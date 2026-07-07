# R14 — Efeitos sonoros: auditoria de dados, service e backend

## Relatório do Claude

## Resumo da etapa

Etapa 10A — auditoria técnica somente leitura do módulo Efeitos Sonoros (`src/app/efeitos-sonoros/`). Nenhum código funcional foi alterado. Conclusão principal: a tela é 100% mockada no frontend (sem `HttpClient`, sem paginação real, sem player, sem licença/preço) e **não existe nenhum endpoint de backend** para efeitos sonoros — apenas um campo de modo (`effectsFx`) no upload de produtores que valida payload sem persistir nada. O padrão de referência (Músicas) foi mapeado em detalhe para orientar as próximas etapas (R15 visual/paginação, R16 player/licença) e uma pendência de backend própria.

## Arquivos lidos

- `PROJECT_RULES.md`, `AGENTS.md`, `CLAUDE.md`
- `docs/areas/modulos/efeitos-sonoros.md` (regra §9.6)
- `docs/ia-auditorias/R13-filtros-minimizar-scroll.md` (confirmação de aceite da etapa anterior)
- `src/app/efeitos-sonoros/efeitosSonoros.component.ts`
- `src/app/efeitos-sonoros/efeitosSonoros.component.html`
- `src/app/efeitos-sonoros/efeitosSonoros.component.scss`
- `src/app/efeitos-sonoros/efeitosSonoros.component.spec.ts`
- `src/app/efeitos-sonoros/efeitosSonoros.service.ts`
- `src/app/efeitos-sonoros/efeitosSonoros.service.spec.ts`
- `src/app/app-routing.module.ts`
- `src/app/app.module.ts`
- `src/app/musicas/musicas.component.ts`
- `src/app/musicas/musicas.component.html`
- `src/app/musicas/musicas.service.ts`
- `src/app/shared/pagination/pagination.component.ts`
- `src/app/carrinho/cartModal/cart-modal.component.ts` e `.models.ts`
- `src/app/service/carrinho.service.ts`
- `src/app/wave-surfer-test/wave-surfer-test.component.ts`
- `src/app/player/player.component.ts`
- `src/app/service/music-player.service.ts`
- `server/src/index.js`
- `server/data/musicas.json` (referência de origem dos dados de Músicas)
- `server/package.json`

## Arquivos alterados

- `docs/ia-auditorias/R14-efeitos-sonoros-auditoria-dados-service-backend.md` (este relatório, substituindo o placeholder)

## O que foi implementado ou auditado

### 1. Caminho real do módulo

`src/app/efeitos-sonoros/` (pasta com hífen); arquivos internos em camelCase: `efeitosSonoros.component.ts/html/scss/spec.ts`, `efeitosSonoros.service.ts/spec.ts` (ambos os specs vazios, só "should create"/"should be created"). Registrado em `app-routing.module.ts:38` (`path: 'efeitos-sonoros'`) e declarado em `app.module.ts:54-55,102,164`. Usa `<app-filter>` no topo (componente compartilhado com Músicas).

**Divergência de documentação encontrada**: `AGENTS.md §8.6` (linhas 187-190) referencia o caminho `src/app/efeitosSonoros/*` (sem hífen), que não existe. O caminho real da pasta é `src/app/efeitos-sonoros/*`. Não corrigido nesta etapa (fora do escopo do R14, registrado como pendência).

### 2. Dados: 100% estático/mock, nenhuma chamada HTTP

- `EfeitosSonorosService` não injeta `HttpClient` (só `AuthService`); nenhuma ocorrência de `/api/` em todo o módulo.
- `categorias` (`efeitosSonoros.service.ts:14-81`): array literal fixo (Air, Aircraft, Alarms, Ambience, Animals...).
- `dados`, `arrMusic` (`efeitosSonoros.component.ts:28-71`): arrays literais com nomes repetidos em loop manual 4x.
- Duração "2:25" (`efeitosSonoros.component.html:88`) e descrição `frase` (linha 19) são strings fixas, idênticas para todos os itens.
- `arrFilter` (ordenação): só 2 valores fixos ("Popularidade"/"Mais relevantes"), sem efeito real na lista.
- Contraste: `MusicasService` estende `CrudService<Musica>` e chama `HttpClient` real contra `/api/musicas`, `/api/musicas/filtro`, `/api/artistas`, `/api/instrumentos`, `/api/generos`, `/api/humores`, `/api/genres-full`, `/api/subgeneros`, `/api/tracks/:id/stems`, `/api/tracks/latest-unique-by-producer`.

### 3. Paginação: ausente/decorativa

`efeitosSonoros.component.html:118-137`: markup Bootstrap estático com páginas "1, 2, 3" fixas, `href=""` em todos os links, sem `*ngFor`, sem `(click)`, sem slice — não pagina nada de fato (a lista inteira de 20 itens é renderizada de uma vez via `*ngFor` sobre `arrMusic`).

O componente compartilhado real `src/app/shared/pagination/pagination.component.ts` (`<app-pagination>`, `@Input currentPage/totalPages/maxVisiblePages`, `@Output pageChange`, lógica de janela deslizante `visiblePages`) **não é usado em Efeitos Sonoros**. Hoje seu único consumidor no projeto é `musicas.component.html:765-771`.

### 4. Botões/ações — comparação objetiva com Músicas

| Ação | Efeitos Sonoros | Músicas |
|---|---|---|
| Play/preview | Ícone SVG sem `(click)` (`html:79-81`), nenhum player associado | `WaveSurferTestComponent` por linha + `MusicPlayerService` (barramento) + `PlayerComponent` global (reprodução real, inclusive stems) |
| Favoritar | `curtir(i)` (`service.ts:94-109`) só alterna `style.display` via `document.querySelectorAll('.hearth')` após checar login — sem persistência | `FavoritosService` real (`GET`/`POST /api/favoritos`) |
| Comprar licença | `comprarLicensa(i)` (`service.ts:111-114`) só `console.log(i)` após `authService.verificaLogin()` — nenhum preço/licença exibido em lugar nenhum | `comprarLicensa` → `CarrinhoService.openModalCart` → `CartModalComponent` (seleção de licença + plano comercial) → `CartItem` no carrinho |
| Categorias/filtro | `mat-checkbox` sem `(change)`; `formG` (`component.ts:106-110`) criado mas nunca ligado a nenhum `formControlName` no template — FormGroup morto | Filtros reais (`onGeneroChange`, `onHumorChange` etc.) → `applyFilters()` → `POST /api/musicas/filtro` |
| Atalhos de teclado | Seção ilustrativa (`html:139-315`) sem `HostListener` no `.ts` — 100% decorativo | N/A |
| Ordenação | `filtroP(p)` só troca o texto exibido (`this.select = e`), não reordena a lista | Mesma limitação (dropdown decorativo) observada em Músicas |
| Visualização grade/lista | Só `data-toggle="collapse"` do Bootstrap, sem handler Angular | N/A |

### 5. Player/WaveSurfer: ausente

Nenhuma referência a `wavesurfer.js`, `<app-wave-surfer-test>`, `<app-player>` ou `<audio>` em todo o módulo `efeitos-sonoros`. Por contraste, Músicas usa arquitetura em 3 camadas: `MusicPlayerService` (barramento reativo) + `WaveSurferTestComponent` (waveform visual silenciada, por linha, lazy-loaded via `IntersectionObserver`) + `PlayerComponent` global (reprodução real de áudio, com suporte a até 4 stems).

### 6. Licenciamento/preço: ausente

Nenhum campo de preço nos dados mock. Nenhuma seleção de tipo de licença. Nenhuma integração com `CarrinhoService`/`CartModalComponent`. O botão "COMPRAR LICENÇA" é apenas texto sem fluxo (`console.log`). Em Músicas, `licenseOptions`/`commercialPlanOptions` do `CartModalComponent` já são hardcoded no próprio componente (não vêm de API) — ou seja, mesmo esse fluxo de Músicas não depende de backend para a seleção de licença em si, apenas do dado da música/efeito sendo comprado.

### 7. Backend: endpoint real de Efeitos Sonoros **não existe**

Backend é um monolito Express (`server/src/index.js`, ~2300 linhas, sem `express.Router()` modular), sem ORM/banco de dados — persistência via variáveis em memória carregadas de `server/data/*.json`. Busca completa por `efeito|sound|fx|sfx` no backend:

- Único achado tangencial: `POST /api/producers/track` (`server/src/index.js:1094-1383`) aceita `mode: 'effectsFx'` como um dos modos de upload de produtor, exigindo arquivos `effect1..effect6` e durações — mas **apenas valida o payload e responde 200** (`{ message: 'Upload v2 validado e recebido com sucesso.' }`), sem persistir em nenhum array/JSON e sem endpoint `GET` correspondente depois.
- Não existe `/api/efeitos`, `/api/sound-effects`, `/api/fx`, `/api/sfx` nem rota equivalente em toda a lista de rotas registradas em `/api/*`.
- Padrão de referência real e funcional (`/api/musicas`, linhas 753-953): paginação via query `page`/`limit` (default `limit=24`), resposta `{ data, pagination: { totalItems, currentPage, totalPages, itemsPerPage } }`; filtros combinados via `POST /api/musicas/filtro`; dados carregados de `server/data/musicas.json` (com fallback hardcoded).
- Não há schema/migration de banco relacionado a efeitos sonoros — de fato, não há banco de dados real no projeto (sem Sequelize/Prisma/TypeORM/Knex/Mongoose, sem `.sql`, sem `schema.prisma`).

### O que pode ser feito sem backend vs. o que depende de API

**Sem backend (só frontend, reversível):**

- Padronizar visual (cards, espaçamento, responsividade) igual a Músicas.
- Trocar a paginação estática pelo `<app-pagination>` compartilhado, operando client-side sobre o array mock existente.
- Ligar os checkboxes de categoria a um filtro client-side real sobre os dados mock.
- Ligar o ícone de play a um preview via `WaveSurferTestComponent`/`MusicPlayerService` (reaproveitando o player global existente), usando os áudios mock disponíveis como fonte de teste.

**Depende de API real (bloqueado até existir backend):**

- Qualquer dado real de efeito sonoro (nome, duração, categoria, artista, arquivo de áudio) — hoje 100% mock.
- Persistência de "favoritar".
- Preço/licença reais associados a um efeito real (o componente de modal de carrinho/licença em si já é reutilizável e não depende de API, mas precisa de um dado real de efeito para fazer sentido).
- Paginação real (server-side) — depende de um endpoint `/api/efeitos` (ou nome equivalente) com contrato igual ao de `/api/musicas` (`page`/`limit` → `{ data, pagination }`).
- Persistência do upload de efeitos: o backend já valida parcialmente (`mode: 'effectsFx'`) mas não grava nem expõe leitura — isso é trabalho de outra frente (upload do produtor), fora do escopo desta etapa.

### Plano de implementação incremental (para as próximas etapas, não executado agora)

1. **R15 (visual/botões/paginação)**: padronizar HTML/SCSS com Músicas; substituir a paginação estática por `<app-pagination>` operando sobre os dados mock existentes; ligar `mat-checkbox` de categoria a um filtro client-side; remover o `formG` morto ou conectá-lo de fato.
2. **R16 (player/waveform/licença)**: ligar o ícone de play ao `WaveSurferTestComponent`/`MusicPlayerService` (reaproveitando o player global já existente, sem duplicar lógica); manter `comprarLicensa` chamando `CarrinhoService.openModalCart` (reuso direto, já genérico), deixando claro que o preço/licença real depende de dado real do efeito.
3. **Pendência de backend (etapa própria a definir, fora de R15/R16)**: criar `/api/efeitos` (ou nome equivalente) seguindo o contrato de `/api/musicas` (`page`/`limit` → `{ data, pagination }`); decidir se aproveita ou substitui o `mode: 'effectsFx'` já existente em `POST /api/producers/track` para persistir os uploads de efeitos.
4. Corrigir a documentação (`AGENTS.md §8.6`) para o caminho real `src/app/efeitos-sonoros/*` — pendência de doc, não desta etapa.

## Comandos executados

- [x] git branch
- [x] git status
- [x] npm run build
- [x] npm test

## Resultado dos comandos

- `git branch`: branch atual `dev`.
- `git status`: antes desta etapa, o único arquivo modificado era este relatório (`docs/ia-auditorias/R14-efeitos-sonoros-auditoria-dados-service-backend.md`), com uma edição manual do usuário no cabeçalho ("Relatório do Codex" → "Relatório do Claude Code"), preparando o arquivo para a gravação do resultado real. Nenhum outro arquivo foi afetado. Esta gravação final substitui integralmente o conteúdo placeholder.
- `npm run build`: passou (`ng build --configuration=production`, bundle inicial 2.14 MB / ~375 kB transferência estimada, sem erros).
- `npm test`: `114` specs executados, `105 SUCCESS`, `9 FAILED`. As 9 falhas são pré-existentes e se dividem em 7 no `LoginComponent` (erro de injeção de `ActivatedRoute`/`Router` nos specs, `TypeError: Cannot read properties of undefined (reading 'root')`) e 2 no `ProdutoresComponent` (`should build and submit v2 payload in trackNoStems mode` e `should submit effects payload with effect1..effect6`, erro `TypeError: Cannot read properties of undefined (reading 'args')`) — a segunda delas trata justamente do payload de upload de efeitos (`effect1..effect6`), tema desta própria auditoria. Ambos os componentes já estavam fora do escopo desta etapa e o mesmo padrão de falha pré-existente já havia sido registrado corretamente no relatório da R13 (`LoginComponent` e `ProdutoresComponent`).

## Como validar manualmente

1. Confirmar o caminho real do módulo: `ls src/app/efeitos-sonoros/`.
2. Abrir `efeitosSonoros.service.ts` e confirmar ausência de `HttpClient`/chamadas `/api/`.
3. Abrir `/efeitos-sonoros` no navegador (`ng serve`) e conferir visualmente: paginação "1 2 3" fixa sem funcionar, ícone de play sem tocar áudio, botão "COMPRAR LICENÇA" sem abrir modal (comparar com o botão "LICENÇA" em `/musicas`, que abre o modal de seleção).
4. Comparar lado a lado com `/musicas` (paginação real via `<app-pagination>`, player funcional, modal de licença).
5. Em `server/src/index.js`, buscar por `efeito|sound|fx|sfx` e confirmar que o único resultado é `mode === 'effectsFx'` dentro de `POST /api/producers/track`, sem rota `GET` correspondente.

## Riscos ou pendências

- `AGENTS.md §8.6` referencia caminho de arquivo incorreto (`src/app/efeitosSonoros/*` em vez de `src/app/efeitos-sonoros/*`) — pendência de correção de documentação, não feita nesta etapa por estar fora do escopo do R14.
- `npm test` já falha em 9 specs pré-existentes fora do escopo (`LoginComponent`), consistente com o baseline registrado na R13.
- Toda a tela de Efeitos Sonoros precisará de backend real (`/api/efeitos` ou equivalente) para sair do estado 100% mockado; até lá, R15/R16 só podem endereçar visual/paginação/player client-side sobre os dados mock existentes.

## Confirmação de escopo

Alterei somente o arquivo de relatório desta etapa (`docs/ia-auditorias/R14-efeitos-sonoros-auditoria-dados-service-backend.md`). Nenhum código de `src/app/efeitos-sonoros/*`, `src/app/musicas/*`, `src/app/shared/pagination/*`, serviços de API ou backend (`server/*`) foi alterado. Não foi feito merge nem referência de implementação a partir da branch `codex/create-musical-producer-dashboard-design`.

---

## Revisão do Claude Code

# Revisão Claude Code — Etapa 10A — Efeitos Sonoros — auditoria de dados, service e gaps de backend

## Classificação final

Aprovado com observações

## Resumo da revisão

A auditoria R14 cumpre o objetivo da etapa: mapeia com precisão o caminho real do módulo, confirma que a tela é 100% mockada (sem `HttpClient`, sem paginação real, sem player, sem licença), identifica a ausência de qualquer endpoint de backend para efeitos sonoros, compara objetivamente os botões/ações com Músicas e produz um plano incremental coerente para R15/R16 e para uma etapa de backend própria. Verifiquei diretamente no código todas as citações de arquivo/linha do relatório (`efeitosSonoros.service.ts`, `efeitosSonoros.component.ts/html`, `app-routing.module.ts`, `app.module.ts`, `AGENTS.md:187-190`, `pagination.component.ts`, `server/src/index.js`) e todas conferem. Nenhum código funcional foi alterado; o `git diff` mostra apenas a edição do próprio arquivo de relatório.

Encontrei uma imprecisão factual na seção "Resultado dos comandos": o relatório atribui as 9 falhas de `npm test` inteiramente ao `LoginComponent`, mas na verdade são 7 falhas em `LoginComponent` e 2 em `ProdutoresComponent` — sendo que uma delas ("should submit effects payload with effect1..effect6") trata exatamente do payload de upload de efeitos (`effectsFx`), tema central desta própria auditoria. O relatório da etapa anterior (R13) já havia identificado corretamente os dois componentes; a R14 regrediu essa precisão. Isso não invalida as conclusões da auditoria (o backend de efeitos sonoros segue inexistente, o frontend segue mockado), mas é uma correção objetiva e pequena a fazer no texto.

## Arquivos inspecionados

- `docs/ia-auditorias/R14-efeitos-sonoros-auditoria-dados-service-backend.md` (linhas 1-148, conteúdo já gravado)
- `src/app/efeitos-sonoros/efeitosSonoros.service.ts`
- `src/app/efeitos-sonoros/efeitosSonoros.component.ts`
- `src/app/efeitos-sonoros/efeitosSonoros.component.html`
- `src/app/app-routing.module.ts`
- `src/app/app.module.ts`
- `AGENTS.md` (linhas 187-190)
- `src/app/shared/pagination/pagination.component.ts`
- `src/app/musicas/musicas.component.html` (uso de `<app-pagination>`)
- `src/app/service/favoritos.service.ts` (existência confirmada via busca por `class FavoritosService`)
- `server/src/index.js` (rotas `/api/musicas`, `/api/producers/track`, `/api/favoritos`; busca geral por `efeito|sound|sfx|/fx`)
- `src/app/produtores/produtores.component.spec.ts` (origem real de 2 das 9 falhas de teste)
- `docs/ia-auditorias/R13-filtros-minimizar-scroll.md` (comparação da descrição de falhas pré-existentes)
- `git status`, `git diff --stat`, `git diff` (diff completo)

## Pontos aprovados

- Caminho real do módulo corretamente identificado (`src/app/efeitos-sonoros/*`, com hífen), incluindo a divergência real em `AGENTS.md §8.6` (linhas 187-190, caminho sem hífen), corretamente registrada como pendência e não corrigida nesta etapa (fora de escopo, conforme instrução).
- Ausência de `HttpClient`/chamadas `/api/` no módulo confirmada; contraste com `MusicasService` (via `CrudService<Musica>`) é preciso.
- Paginação estática (`href=""`, páginas "1,2,3" fixas) corretamente descrita; `<app-pagination>` corretamente identificado como não utilizado em Efeitos Sonoros e usado apenas em `musicas.component.html:765-771`.
- Tabela comparativa de botões/ações (play, favoritar, licença, filtro, atalhos, ordenação, visualização) é objetiva e cada afirmação bate com o código (`curtir()`, `comprarLicensa()`, `formG` nunca ligado a `formControlName`).
- Ausência de endpoint de backend corretamente confirmada por busca ampla nas rotas `/api/*`; o único achado tangencial (`mode: 'effectsFx'` em `POST /api/producers/track`, validação sem persistência) está corretamente delimitado, com faixa de linhas praticamente exata (relatada 1094-1383; bloco real vai de 1094 até a resposta 200 em torno da linha 1383).
- Separação clara entre "sem backend" e "depende de API" — atende ao critério de aceite.
- Plano incremental para R15/R16 e pendência de backend é coerente com os achados e não propõe invenção de contrato de API.
- Nenhum código de `src/app/*` ou `server/*` foi alterado; único arquivo no diff é o próprio relatório.
- Nenhum `href="#"`/`href=""` foi introduzido por esta etapa — o markup estático já existia antes da auditoria e não foi tocado (etapa é somente leitura, como determinado).
- Guards, interceptors, autenticação, rotas privadas, player, WaveSurfer, carrinho, upload e dashboard não aparecem no diff — sem risco de regressão nesta etapa documental.

## Problemas encontrados

### Bloqueadores

- Nenhum.

### Importantes

- "Resultado dos comandos" (seção `npm test`) afirma que as 9 falhas são "pré-existentes em `LoginComponent`". Na prática são 7 em `LoginComponent` e 2 em `ProdutoresComponent` (`should build and submit v2 payload in trackNoStems mode` e `should submit effects payload with effect1..effect6`), confirmado por execução real (`npm test -- --watch=false --browsers=ChromeHeadless`) e leitura de `produtores.component.spec.ts:94-140`. A segunda falha trata exatamente do payload de efeitos (`effect1..effect6`), tema da própria auditoria R14, e deveria ter sido citada nominalmente. O relatório da R13 (`docs/ia-auditorias/R13-filtros-minimizar-scroll.md:58`) já registrava corretamente "`LoginComponent` e `ProdutoresComponent`" — a R14 perdeu essa precisão ao citar a R13 como referência do "mesmo padrão".

### Menores

- Nenhum.

## Regressões potenciais

- Nenhuma. O diff é limitado à edição do próprio arquivo de relatório; nenhum arquivo de código-fonte (frontend ou backend) foi tocado nesta etapa.

## Validação de comandos

- [x] git status
- [x] git diff --stat / git diff
- [x] npm run build
- [x] npm test

## Resultado dos comandos

- `git status` / `git diff --stat`: único arquivo modificado é `docs/ia-auditorias/R14-efeitos-sonoros-auditoria-dados-service-backend.md` (143 inserções, 3 remoções antes desta revisão). Nenhum arquivo de código alterado.
- `npm run build`: `ng build --configuration=production --base-href /` concluído sem erros. Bundle inicial 2.14 MB / ~375,39 kB de transferência estimada (consistente com o valor citado no relatório original).
- `npm test` (`npm test -- --watch=false --browsers=ChromeHeadless`): `114` specs executados, `105 SUCCESS`, `9 FAILED`. Falhas reais, listadas individualmente:
  - `LoginComponent` (7): `deve manter apenas um select custom aberto por vez`, `deve aplicar classe open somente no select ativo para controlar empilhamento`, `deve renderizar o select custom de tipoPerfil sem radio visível com formControlName`, `deve mapear Mok Starters e Mok Makers para comprador/produtor`, `deve exibir erro de obrigatório para tipoPerfil quando touched e vazio`, `should create`, `deve enviar tipoPerfil no payload sem alterar contrato no onSubmit` — erro `TypeError: Cannot read properties of undefined (reading 'root')` (injeção de `ActivatedRoute`/`Router` no spec).
  - `ProdutoresComponent` (2): `should build and submit v2 payload in trackNoStems mode`, `should submit effects payload with effect1..effect6` — erro `TypeError: Cannot read properties of undefined (reading 'args')` (`uploadService.uploadProducerTrack.calls.mostRecent()` retorna `undefined`, indicando que o spy não foi chamado como esperado dentro do teste).
  - Todas as 9 falhas são pré-existentes (nenhum código de produção foi alterado nesta etapa nem na R14); nenhuma delas foi causada pela auditoria.

## Correções exigidas para nova execução

- Corrigir a seção "Resultado dos comandos" do relatório original (linhas 115-127) para refletir que as 9 falhas de `npm test` se dividem em 7 (`LoginComponent`) + 2 (`ProdutoresComponent`, incluindo o teste de payload `effect1..effect6`), alinhando com o que a própria R13 já havia registrado corretamente.

## Observações finais

A auditoria R14 é sólida, bem escopada e tecnicamente precisa na parte de mapeamento de código (frontend mockado, paginação decorativa, ausência de endpoint de backend). A única lacuna é a imprecisão pontual na descrição das falhas de teste pré-existentes, que não compromete as conclusões técnicas centrais da etapa mas merece correção textual antes de servir de baseline para as próximas etapas (R15/R16), já que uma das falhas mal atribuídas é justamente sobre o fluxo de upload de efeitos sonoros.

---

## Complemento pós-revisão

Após a revisão técnica acima, as 9 falhas pré-existentes de `npm test` foram diagnosticadas e corrigidas (fora do escopo original da auditoria R14, mas autorizado explicitamente pelo usuário por estarem relacionadas ao tema `effectsFx`). Nenhum código de produção foi alterado — apenas os 2 arquivos `.spec.ts` correspondentes.

**Causa raiz e correção — `LoginComponent` (7 falhas):**
`login.component.html:215` usa `<a [routerLink]="['/termos-do-site']">`. A diretiva `RouterLink`/`RouterLinkWithHref` injeta `ActivatedRoute` e assina `router.events`, além de chamar `router.createUrlTree(...)` — mas o spec fornecia um `Router` mockado via `jasmine.createSpyObj<Router>('Router', ['navigate'])`, um spy com apenas o método `navigate`, sem `routerState`, `events` ou `createUrlTree`. Isso derrubava as 7 specs já no `beforeEach` (`fixture.detectChanges()`), antes de qualquer corpo de teste rodar. Nenhum teste do arquivo asserta chamadas em `router.navigate`, então a correção trocou o spy manual por `RouterTestingModule` (import de `@angular/router/testing`), que fornece um `Router` de teste completo e consistente com o restante do template. Arquivo alterado: `src/app/login/login.component.spec.ts`.

**Causa raiz e correção — `ProdutoresComponent` (2 falhas):**
Os dois testes que chamam `component.onUpload()` (`should build and submit v2 payload in trackNoStems mode` e `should submit effects payload with effect1..effect6`) faziam `patchValue()` sem preencher `loop15File`/`loop30File`/`loop60File`, campos `Validators.required` incondicionais no form (`produtores.component.ts:107-109`). Com o form inválido, `onUpload()` retornava antes de chamar `uploadFileService.uploadProducerTrack`, e `calls.mostRecent()` vinha `undefined`. A correção adicionou os 3 arquivos de loop ao `patchValue` de cada teste e trocou o spy de `getFileDurationMs` de um valor fixo (`returnValue`) para um `callFake` que devolve a duração esperada por nome de arquivo (15000/30000/60000ms para os loops, duração igual à da faixa para stems/efeitos), satisfazendo também `validateDurations()`. Arquivo alterado: `src/app/produtores/produtores.component.spec.ts`.

**Validação após a correção:**
- `npm test -- --watch=false --browsers=ChromeHeadless`: `114` specs executados, `114 SUCCESS`, `0 FAILED`.
- `npm run build`: `ng build --configuration=production --base-href /` concluído sem erros, mesmo tamanho de bundle (2.14 MB / ~375,39 kB).
- `git diff --stat`: 3 arquivos alterados — `docs/ia-auditorias/R14-...md` (este relatório), `src/app/login/login.component.spec.ts`, `src/app/produtores/produtores.component.spec.ts`. Nenhum arquivo de produção (`*.component.ts`, `*.service.ts`, `server/*`) foi tocado.

---

## Status final da etapa

Aprovado com observações

## Pendências para etapas futuras

- ...
