# R19 — Página artista: HTML e responsabilidades

## Relatório do Claude Code

## Resumo da etapa

Corrigido HTML inválido nos dois componentes de página de artista (`ArtistComponent` em `/artista` e
`UsuarioArtistaComponent` em `/pagina-artista`), removidos links mortos (`href="#"`/`href=""`) e
adicionado `AuthGuard` à rota `/artista`, que expunha formulário de edição de perfil (upload de
avatar, nome, bio) sem nenhuma proteção — e cujo "salvar" (`saveDescription()`) não persistia nada,
apenas `console.log`. `/pagina-artista` permanece pública, como perfil de leitura.

## Arquivos lidos

- `src/app/artist/artist.component.html`, `.ts`, `.scss`, `.spec.ts`
- `src/app/usuario-artista/usuario-artista.component.html`, `.ts`, `.scss`, `.spec.ts`
- `src/app/app-routing.module.ts`
- `src/app/sub-menu/sub-menu.component.html`, `src/app/menu-produtor/menu-produtor.component.html`
- `src/app/musicas/musicas.component.html`, `.ts`, `.scss` (padrão de referência para link do produtor,
  nome da música e paginação)
- `src/app/shared/pagination/pagination.component.ts`
- `src/app/musicas/musicas.service.ts`, `src/app/service/user-profile.service.ts`,
  `src/app/models/user-profile.model.ts`, `src/app/login/auth.service.ts`
- `docs/roadmap_tecnico_MokBeats_Codex_Claude.md` (seção R19/Etapa 12A)
- `AGENTS.md`, `PROJECT_RULES.md`, `CLAUDE.md`, `.claude/rules/angular-14.md`

## Arquivos alterados

- `src/app/app-routing.module.ts`
- `src/app/artist/artist.component.html`
- `src/app/artist/artist.component.ts`
- `src/app/artist/artist.component.scss`
- `src/app/usuario-artista/usuario-artista.component.html`
- `src/app/usuario-artista/usuario-artista.component.scss`

## O que foi implementado ou auditado

1. **Rota `/artista` protegida** (`app-routing.module.ts:51`): adicionado `canActivate: [AuthGuard]`
   (guard já importado e usado por outras rotas do mesmo arquivo). `/pagina-artista` (linha 52)
   permanece sem guard — é o perfil público, alimentado por `?nome_produtor=`.
2. **Tags HTML inválidas corrigidas** em `artist.component.html`:
   - linha 6: `<<ul class="w-100">` → `<ul class="w-100">`
   - linha 113: `</ul>>` → `</ul>`
   - linha 9: removido atributo `type="button"` do `<a>` (inválido nesse elemento)
   - bloco do accordion de faixa (`id="collapseT"`): removido `class` duplicado no mesmo elemento
     (o segundo `class="collapse mb-5"` sobrescrevia o primeiro `class="row flex-column"`, perdendo o
     layout em coluna); classes unificadas em `class="row flex-column collapse mb-5"`. Mesmo problema
     corrigido em `usuario-artista.component.html`.
3. **Links mortos removidos**, em ambos os componentes, seguindo o padrão já em produção em
   `musicas.component.html:503-517`:
   - Nome da música (`<a href="#">{{itens.nome_musica}}</a>`) → `<span class="music-name">`, sem
     destino real (não existe página de detalhe de faixa).
   - Nome do produtor (`<a href="#">{{itens.nome_produtor}}</a>`) → `<a [routerLink]="['/pagina-artista']"
     [queryParams]="{ nome_produtor: itens.nome_produtor }">`, navegação Angular real para o perfil
     público, igual à usada em `/musicas`.
   - Adicionada a classe `.music-name { color: #fff; }` nos dois SCSS (mesma regra já usada em
     `musicas.component.scss:391-393`), preservando a cor branca que antes vinha do seletor
     `article.one .text p.h4 a`.
   - Paginação estática (`1 2 3`, "Previous"/"Next"): removido o atributo `href=""` das 5 âncoras em
     cada componente. Antes, clicar recarregava a aplicação (navegação para a raiz do hash); agora o
     elemento fica inerte. A tag `<a>` foi mantida (não trocada por `<button>`) porque o SCSS estiliza
     por seletor de elemento (`nav ul.pagination li.page-item a`) — trocar exigiria reescrever essas
     regras, fora do escopo desta etapa.
4. **Removido "salvar" que não persiste** (`artist.component.ts`): excluído o método
   `saveDescription()` (fazia apenas `console.log` dos valores do formulário e re-desabilitava os
   campos) e o botão/ícone `<span id="save">` no HTML (linha 136). O botão `edit` (`editDescription()`)
   foi mantido — ainda habilita os campos localmente — mas sem o botão de salvar a UI não sugere mais
   que a edição é persistida. Também removidas, dentro de `editDescription()`, as três linhas que
   manipulavam o elemento `save` (ficariam órfãs sem o elemento no template) e um `console.log('description')`
   solto de depuração.
5. **Dados hard-coded identificados e não substituídos por mock** (mantidos como estão; documentados
   como pendência):
   - `artist.component.ts:76-77`: `nameArtist = 'Wilian Gulini'` e `descriptionArtist` fixos — a
     listagem de músicas do componente é filtrada por esse nome fixo (`filterMusicas({ artistas: [this.nameArtist] })`).
   - `usuario-artista.component.ts:73`: `descriptionArtist = 'Xalaika é um produtor...'` fixo mesmo
     quando `nameArtist` vem do query param.
   - `src="./assets/images/smoking.png"` como avatar fixo em ambos os templates.
   - Listas estáticas (`arrVExtendida`, `vozes`, `arrFilter`, `frase`, `trecho`).
   - Causa raiz: o backend não expõe endpoint de perfil público de produtor (só
     `GET/PUT /api/user/profile`, autenticado, e `GET /api/artistas`, que devolve apenas nomes).
6. **Área privada do produtor não exposta na página pública**: confirmado que `/pagina-artista`
   (`UsuarioArtistaComponent`) é somente leitura — não tem formulário de edição, upload ou qualquer
   campo de escrita. Toda a edição ficou isolada em `/artista`, agora protegida por `AuthGuard`.
7. **Dashboard não tocado**: nenhum arquivo em `src/app/dashboard-produtor/` foi lido além do
   necessário para mapear rotas, e nenhum foi alterado.

## Comandos executados

- [x] git status
- [x] npm run build
- [x] npm test

## Resultado dos comandos

- `git branch --show-current` → `dev`; `git status` → limpo antes de iniciar (R18 commitada em `b6249fd`).
- `npm run build` (`ng build --configuration=production --base-href /`) → **sucesso**, sem erros. Bundle
  gerado normalmente (`main` 1.63 MB raw / 271 kB transfer); nenhum warning novo introduzido pelas
  alterações (o único warning do build, `.custom-file-input:lang(en)` com pseudo-classe não suportada,
  é preexistente e não relacionado a este escopo).
- `npm test` (`ng test`) roda em modo watch por padrão (browser interativo) e não retorna em ambiente
  não interativo. Para validar sem inventar comando, foi executado o mesmo builder/target `test`
  (script real do `package.json`) com as flags de execução não interativa do próprio Angular CLI,
  `--watch=false --browsers=ChromeHeadless`:
  - Specs diretamente tocados (`artist.component.spec.ts`, `usuario-artista.component.spec.ts`, ambos
    `should create`): **2 de 2 SUCCESS**.
  - Suíte completa do projeto: **115 de 115 SUCCESS**, nenhuma falha.
  - `npm run test:focus` (suíte reduzida do projeto, `tsconfig.spec.focus.json`): **27 de 27 SUCCESS**
    (não inclui os specs de artist/usuario-artista, que ficam fora desse subconjunto).

## Como validar manualmente

1. `npm start`, acessar `#/artista` **deslogado** → deve redirecionar para login (antes desta etapa,
   abria diretamente o formulário de edição de perfil).
2. Logar e abrir `#/artista` → confirmar que não há mais `<` solto no topo do menu lateral de filtros
   nem `>` solto logo abaixo dele.
3. Em `/artista`, clicar no ícone `edit` ao lado do nome/bio → os campos habilitam; confirmar que **não
   existe mais** o ícone `save` ao lado.
4. Na listagem de músicas de `/artista` e de `#/pagina-artista?nome_produtor=<nome>`: o nome do
   produtor é um link que navega para `/pagina-artista?nome_produtor=...`; o nome da música não é mais
   clicável (não existe página de detalhe de faixa).
5. Clicar nos números `1`, `2`, `3` da paginação, ou nas setas anterior/próximo → não recarrega mais a
   aplicação (antes, `href=""` navegava para a raiz do hash).
6. No DevTools, inspecionar o bloco do accordion de faixa (`id="collapseT"`) e confirmar que ele
   mantém as três classes `row flex-column collapse mb-5` juntas.
7. Confirmar que `/musicas` continua funcionando sem alterações (nenhum arquivo desse módulo foi
   tocado).

## Riscos ou pendências

- **Botão "Reproduzir Músicas"** (`artist.component.html`, `usuario-artista.component.html`): não tem
  `(click)`. Por decisão explícita do usuário nesta etapa, **não foi removido** — fica pendente para
  receber função real (integração com player/WaveSurfer, como em `/musicas`) em etapa futura.
- **Paginação estática "1 2 3"**: por decisão explícita do usuário, **não foi removida nem trocada**
  por `<app-pagination>` nesta etapa — apenas o `href=""` foi retirado. Pendência: padronizar com
  `src/app/shared/pagination/pagination.component.ts` (mesmo padrão usado em
  `musicas.component.html:765-771` e `musicas.component.ts:364-366`), o que exige `filterMusicas`
  paginado (`{page, limit}`) nos dois componentes de artista.
- **Ícones de play por faixa** (SVG estático, sem handler): decorativos; nenhum dos dois componentes de
  artista usa WaveSurfer. Fora do escopo desta etapa.
- **Aninhamento `<ul> > <div class="control">`** ainda presente nos dois templates — inválido, mas
  invisível ao usuário; corrigir exigiria reescrever ~15 seletores SCSS dependentes da estrutura atual
  (ex.: `article.one .position-absolute ul .control li`). Não corrigido por violar "alteração pequena e
  reversível"; registrado como pendência.
- **IDs duplicados dentro de `*ngFor`** (`id="array"`, `id="collapseT"`, `id="bpm"`, `id="duracao"`,
  `id="arve"`/`id="arrve"`) — o `data-target="#collapseT"` do botão de grade/lista só funciona
  corretamente para o primeiro item da lista. Correção real exige indexar IDs por item e revisar o
  comportamento do collapse (mudança de comportamento, não só de validade) — fora do escopo.
  Relacionado: `data-parent="#accordion1"` no bloco do accordion de faixa aponta para o accordion do
  menu lateral de filtros, não para o `id="accordionT1"` que o envolve — também não corrigido nesta
  etapa pelo mesmo motivo (mudança de comportamento, não de validade de HTML).
- **Endpoint de perfil artístico inexistente**: nome, bio e avatar continuam hard-coded; a edição em
  `/artista` habilita campos mas não persiste nada (sem backend para isso). Ver seção "dados
  hard-coded" acima.
- **Duplicação entre `ArtistComponent` e `UsuarioArtistaComponent`** (~3.000 linhas somando HTML+SCSS
  dos dois) não foi endereçada — é refatoração ampla, fora do escopo desta etapa.
- **Imports/injeções órfãos** em `artist.component.ts` (`ActivatedRoute`, `environment`, `MatSnackBar`,
  `HttpClient` nunca usados) não foram removidos — risco baixo, mas fora do escopo estrito de HTML e
  responsabilidade da rota; registrado para limpeza futura.
- Nenhum teste E2E (Cypress) cobre `/artista` ou `/pagina-artista`; a validação de guard e navegação
  foi manual (roteiro acima), não automatizada.

## Confirmação de escopo

Alterados somente os arquivos previstos no escopo da Etapa 12A: `app-routing.module.ts` (guard da
rota `/artista`), e os três arquivos de cada um dos dois componentes de artista (`.html`, `.ts` — só
`artist.component.ts`, já que `usuario-artista.component.ts` não precisou de alteração —, `.scss`).
Nenhum arquivo de `dashboard-produtor`, `musicas` ou outro módulo foi modificado. Não houve
necessidade de sair do escopo declarado.

---

## Revisão do Claude Code

## Revisão técnica — 2026-07-29

Revisão Claude Code — Etapa 12A — Página do Artista — HTML válido e separação de responsabilidade

### Classificação final

Aprovado com observações

### Resumo da revisão

O diff é pequeno (6 arquivos em `src/`, +32/−39 linhas), rastreável e reversível. Cumpre o objetivo
central da etapa: corrige as tags HTML quebradas visíveis (`<<ul`/`</ul>>`), remove todos os
`href="#"`/`href=""` dos dois componentes, protege `/artista` com `AuthGuard` sem alterar seu
comportamento, e confirma que `/pagina-artista` permanece somente-leitura. `npm run build` e a suíte
completa de testes (`115/115`) passam sem regressão. Não há bloqueadores. Há duas inconsistências
"importantes" (uma assimetria de correção entre os dois componentes e uma mudança de comportamento não
documentada no accordion) e uma ressalva sobre o valor probatório real dos testes automatizados, que
devem ser corrigidas ou verificadas visualmente antes do merge, mas nenhuma delas justifica reprovar a
etapa.

### Arquivos inspecionados

- `src/app/app-routing.module.ts` (diff completo)
- `src/app/artist/artist.component.html`, `.ts`, `.scss` (diff completo + arquivo íntegro nos trechos
  relevantes)
- `src/app/usuario-artista/usuario-artista.component.html`, `.ts`, `.scss` (diff completo + arquivo
  íntegro nos trechos relevantes)
- `src/app/artist/artist.component.spec.ts`, `src/app/usuario-artista/usuario-artista.component.spec.ts`
- `src/app/musicas/musicas.component.html` (referência de padrão para link do produtor e bloco
  `#collapseT`), `musicas.component.scss:391-393`
- `src/app/sub-menu/sub-menu.component.html`, `src/app/menu-produtor/menu-produtor.component.html`
  (origem dos links para `/artista`)
- `src/app/login/auth.guard.ts`
- `src/test.ts`, `tsconfig.spec.json`, `src/test.focus.ts` (para avaliar o que a suíte realmente cobre)
- `package.json`, `angular.json` (confirmação de que não foram tocados; scripts reais de build/test)
- `node_modules/@angular/compiler/fesm2015/compiler.mjs` (`registerClassAttr`, para confirmar o efeito
  real da fusão de `class` duplicado no Ivy)
- `docs/roadmap_tecnico_MokBeats_Codex_Claude.md:6052-6115` (objetivo, escopo e critérios de aceite da
  R19), `PROJECT_RULES.md`, `AGENTS.md`, `.claude/rules/angular-14.md`,
  `.claude/rules/auth-and-guards.md`
- `git status`, `git diff --stat`, `git diff` (todos os arquivos modificados)

### Pontos aprovados

- **Rota `/artista` protegida**: `canActivate: [AuthGuard]` adicionado em
  `app-routing.module.ts:51`, único caractere de diff nesse arquivo. `AuthGuard` em si
  (`src/app/login/auth.guard.ts`) não foi alterado — a proteção usa o guard já existente, sem
  enfraquecê-lo. `/pagina-artista` (linha 52) permanece sem guard, coerente com ser o perfil público.
  Os dois únicos pontos do app que navegam para `/artista` (`sub-menu.component.html:14`,
  `menu-produtor.component.html:59`) já estão em áreas de usuário autenticado, então o guard não quebra
  navegação existente.
- **Tags inválidas corrigidas**: confirmado por busca no arquivo completo — não há mais `<<` nem `>>`
  em nenhum dos dois templates. As duas ocorrências relatadas (`artist.component.html:6` e `:113` na
  versão anterior) foram as únicas do tipo no arquivo.
- **`href="#"`/`href=""` removidos**: busca por `href="#"` e `href=""` nos dois templates retorna zero
  ocorrências. As âncoras de paginação (10 no total, 5 por componente) e o nome da música (trocado por
  `<span class="music-name">`) foram tratados.
- **Link do produtor**: reproduz fielmente o padrão já em produção em
  `musicas.component.html:511-519` (mesma estrutura `[routerLink]="['/pagina-artista']"` +
  `[queryParams]="{ nome_produtor: itens.nome_produtor }"`), e a classe `.music-name { color: #fff }`
  adicionada nos dois SCSS reproduz `musicas.component.scss:391-393`. Como
  `UsuarioArtistaComponent.ngOnInit` (linha ~94) assina `route.queryParams` via `.subscribe(...)` (não
  snapshot), o link funciona mesmo navegando de `/pagina-artista?nome_produtor=A` para
  `/pagina-artista?nome_produtor=B` sem reload de página.
- **Separação público/privado**: confirmado por leitura completa de `usuario-artista.component.html`
  que não existe nenhum campo de formulário, `(click)` de edição ou upload — é puramente leitura. Toda
  a superfície de edição (upload de avatar, campos de nome/bio, `editDescription()`) está isolada em
  `ArtistComponent`, agora atrás do guard.
- **Remoção do "salvar" enganoso**: `saveDescription()` de fato só fazia `console.log` dos valores do
  form e re-desabilitava os campos sem chamar nenhum service — removê-lo junto com o botão associado é
  correto; a alternativa (deixar um botão "salvar" que não salva) seria pior para o usuário.
- **Escopo respeitado**: `git status --porcelain` para `package.json`, `angular.json`,
  `dashboard-produtor/`, `musicas/`, `player/`, `wave-surfer-test/` retorna vazio — nenhum desses foi
  tocado. O diff toca exatamente os arquivos previstos no roadmap
  (`docs/roadmap_tecnico_MokBeats_Codex_Claude.md:6063-6065`) mais `app-routing.module.ts`, que é a
  extensão mínima necessária para "evitar misturar perfil público com área privada".
- **Dados hard-coded**: os nomes/bios fixos, o avatar fixo e as listas estáticas foram corretamente
  identificados e documentados como pendência em vez de receberem mock novo, com causa raiz plausível
  (ausência de endpoint de perfil público de produtor) — aderente à regra de não inventar backend
  (roadmap, seção "Observação operacional", linha 6091) e a `PROJECT_RULES.md §13`.
- **Build e testes reais**: reexecutados nesta revisão, não apenas conferidos no relatório do
  implementador (ver "Resultado dos comandos" abaixo).

### Problemas encontrados

#### Bloqueadores

- Nenhum.

#### Importantes

- **Assimetria na correção do `type="button"` inválido em `<a>`**: o relatório do implementador
  descreve a remoção de `type="button"` de `<a>` como parte da correção de HTML inválido em
  `artist.component.html:9` (confirmado no diff). O mesmo atributo inválido continua presente em
  `usuario-artista.component.html:9` (`<a class="nav-link ..." type="button">`), e essa linha nem
  aparece no diff desse arquivo. Como os dois componentes compartilham o mesmo template-fonte (menu
  lateral de filtros), a correção deveria ter sido espelhada. Critério de aceite "HTML da página fica
  válido" fica parcialmente atendido — válido em `/artista`, não em `/pagina-artista`.
- **Fusão do `class` duplicado no bloco `#collapseT` muda comportamento visual, não é neutra**: em
  `artist.component.html` e `usuario-artista.component.html`, o elemento tinha dois atributos
  `class` (`class="row flex-column"` seguido de `class="collapse mb-5"` mais adiante na mesma tag).
  Inspecionando o compilador Angular 14 (`node_modules/@angular/compiler/fesm2015/compiler.mjs:8837`,
  `registerClassAttr`), a segunda ocorrência de `class` **sobrescreve** a primeira via atribuição
  direta (`this._initialClassValues = value...`), então o HTML original já renderizava só
  `class="collapse mb-5"` — o layout em coluna nunca esteve ativo em runtime, apesar do relatório
  descrever isso como "perdendo o layout em coluna" (implicando que o problema já causava dano visível
  antes da correção, quando na verdade o dano visível é o oposto: a correção agora *ativa* um layout
  que antes não existia). Ao unificar em `class="row flex-column collapse mb-5"`, o elemento passa a
  ter as classes Bootstrap `row` + `flex-column` ativas simultaneamente com `collapse`, o que altera a
  disposição visual do conteúdo quando o accordion é expandido (margens negativas de `.row` combinadas
  com `display:flex; flex-direction:column`) — um comportamento diferente do que existia em produção.
  Além disso, isso **diverge do padrão equivalente em `/musicas`**
  (`musicas.component.html:733-736`), que mantém a mesma estrutura de `class` duplicado não corrigida.
  Não é um bug do diff, mas é uma mudança de renderização real que não foi qualificada como tal no
  relatório (foi apresentada como correção de "class duplicado" sem mencionar o efeito colateral
  visual) nem coberta por validação visual documentada — o roteiro manual do implementador (item 6)
  só confirma que as três classes aparecem juntas no DevTools, não como o layout se compara ao
  comportamento anterior. Recomenda-se validação visual manual do bloco expandido em ambas as páginas
  antes do merge.

#### Menores

- `editDescription()` continua sendo uma ação que só habilita campos no DOM sem qualquer persistência
  real — isso é consistente com a pendência já documentada ("endpoint de perfil artístico inexistente"),
  mas vale registrar que a UX ainda comunica "editar" sem qualquer forma de confirmar/cancelar a edição
  após a remoção do botão salvar.
- CSS órfão remanescente: `artist.component.scss:361` (`article.one .material-icons.save { ... }`)
  ficou sem elemento correspondente no template após a remoção do `<span id="save">`; e a regra
  `article.one .text p.h4 a` (`artist.component.scss:242`, `usuario-artista.component.scss:217`)
  também não tem mais nenhum `<a>` dentro de `p.h4` para estilizar, já que o nome da música virou
  `<span class="music-name">`. Nenhum dos dois quebra nada (CSS não usado é inofensivo), mas é
  limpeza pendente natural desta mesma etapa.
- `console.log` de depuração continuam em `artist.component.ts:114,153,159,166` (fora dos métodos
  tocados por este diff) — não é regressão introduzida agora, mas está na mesma classe editada.
- Âncoras de paginação sem `href` (`<a class="page-link">1</a>`) deixam de ser navegáveis por teclado
  e perdem o cursor de link nativo do navegador (dependem só do CSS/JS para indicar interatividade);
  aceitável como solução mínima documentada como pendência (trocar por `<app-pagination>` está fora do
  escopo), mas seria mais correto usar `<button type="button" class="page-link">` mantendo os
  seletores CSS por classe — registrado apenas como observação, não como correção exigida, pois o
  próprio relatório já justifica a escolha.

### Regressões potenciais

- Nenhuma regressão funcional encontrada em player/WaveSurfer, stems, upload, dashboard, carrinho ou
  checkout — nenhum arquivo dessas áreas foi tocado (`git status --porcelain` vazio para
  `dashboard-produtor/`, `musicas/`, `player/`, `wave-surfer-test/`).
- Risco de regressão visual localizado e não confirmado: o bloco `#collapseT` expandido em `/artista`
  e `/pagina-artista` (ver "Importantes" acima). Não é uma regressão de funcionalidade (o accordion
  ainda abre/fecha), mas pode alterar o layout do conteúdo exibido dentro dele.
- `usuario-artista.component.html:9` mantém `type="button"` em `<a>`, o que é tecnicamente HTML
  inválido remanescente (baixo risco de renderização, mas contraria o critério de aceite "HTML da
  página fica válido" para essa página especificamente).

### Validação de comandos

- [x] git status
- [x] npm run build
- [x] npm test

### Resultado dos comandos

- `git status`: branch `dev`, atualizada com `origin/dev`. 7 arquivos modificados e não commitados —
  os 6 arquivos de código já descritos no relatório do implementador mais este próprio arquivo de
  auditoria (que já existia como stub antes desta revisão). Nenhum arquivo novo fora do escopo.
- `git diff --stat` (apenas `src/`): 6 arquivos, `32 insertions(+), 39 deletions(-)` — diff pequeno e
  revisável, consistente com o relatado.
- `npm run build` (`ng build --configuration=production --base-href /`): **sucesso**, reexecutado
  nesta revisão. Bundle gerado normalmente (`main` 1.63 MB raw / 271 kB transfer, total inicial
  2.14 MB / 375.25 kB transfer). Único aviso do build (`.custom-file-input:lang(en)~.custom-file-label`,
  pseudo-classe `:lang` não suportada) é preexistente e não relacionado a este diff.
- `npm test`: `ng test` roda em watch mode e não retorna em shell não interativo, confirmado ao tentar.
  Reexecutado com `npx ng test --watch=false --browsers=ChromeHeadless` (mesmo builder Karma do script
  `test` do `package.json`, apenas com flags não interativas do próprio Angular CLI — nenhum comando
  inventado): **115 de 115 SUCCESS**, nenhuma falha, incluindo os specs `ArtistComponent` e
  `UsuarioArtistaComponent` (`should create`).
  - **Ressalva sobre o que os testes realmente comprovam**: `src/test.ts` (carregado por todo `ng test`)
    injeta globalmente `NO_ERRORS_SCHEMA` + `CUSTOM_ELEMENTS_SCHEMA` e faz patch de
    `document.querySelector`/`getElementById` para nunca retornar `null` durante specs. Combinado com o
    fato de que `artist.component.spec.ts` e `usuario-artista.component.spec.ts` têm apenas o teste
    padrão `should create`, o "115/115 SUCCESS" comprova que os componentes continuam instanciáveis e
    que não há erro de compilação de template, mas **não** exercita o `AuthGuard` na rota `/artista`,
    não clica no link do produtor, não verifica a ausência de `href="#"` em runtime, nem valida o
    layout do `#collapseT` — essas verificações continuam dependendo do roteiro manual descrito pelo
    implementador, que é adequado para o tamanho da etapa, mas deve ser lido como validação manual, não
    como coberta por teste automatizado.

### Correções exigidas para nova execução

1. Remover `type="button"` do `<a class="nav-link d-flex justify-content-center align-items-center p-0
   border-0">` em `usuario-artista.component.html:9`, espelhando a correção já feita em
   `artist.component.html:9`, para que o critério "HTML da página fica válido" seja atendido de forma
   simétrica nas duas páginas.
2. Validar visualmente (screenshot ou inspeção manual no navegador) o bloco `#collapseT` expandido em
   `/artista` e `/pagina-artista` após a fusão de `class`, confirmando que o layout resultante
   (`row flex-column collapse mb-5` simultâneas) é o esperado e não quebra o espaçamento/alinhamento do
   conteúdo do accordion; se o resultado visual for indesejado, ajustar para reproduzir apenas o
   comportamento funcional do `collapse` sem herdar `row`/`flex-column` (por exemplo, envolvendo o
   conteúdo em um wrapper interno, ou removendo `row flex-column` se nunca esteve realmente ativo em
   produção).

Nenhuma das duas correções exige tocar em arquivo fora do escopo já definido pela etapa.

### Observações finais

- A remoção de `saveDescription()` e do botão associado é uma decisão de produto implícita (deixar de
  sugerir que a edição é persistida) tomada dentro de uma tarefa rotulada como correção de HTML —
  tecnicamente correta e de baixo risco, mas vale registrar para o time de produto que o formulário de
  edição em `/artista` segue sem nenhuma forma de submissão, mesmo depois desta etapa; a pendência já
  está documentada no relatório do implementador.
- Adicionar `canActivate: [AuthGuard]` a uma rota é, por definição, uma mudança de autorização
  (`PROJECT_RULES.md §13`, `.claude/rules/auth-and-guards.md`). Está claramente alinhada ao objetivo
  explícito da etapa ("evitar misturar perfil público com área privada do produtor") e não enfraquece
  nada — mas, por ser mudança de autorização, deveria receber ratificação humana explícita antes do
  merge para `dev`, não apenas aprovação por revisão automatizada.
- Nenhuma das pendências listadas no relatório do implementador (paginação estática, botão "Reproduzir
  Músicas" sem handler, IDs duplicados em `*ngFor`, endpoint de perfil ausente, duplicação entre os
  dois componentes) precisa de ação nesta etapa; concordo que estão corretamente fora de escopo.

---

## Correção pós-revisão — 2026-07-29

### Correções realizadas

- Removido o atributo inválido `type="button"` do `<a class="nav-link ...">` em
  `usuario-artista.component.html:9`, espelhando a correção já existente em `artist.component.html:9`.
  Agora nenhum dos dois templates tem `type` em elemento `<a>`.
- Removida a duplicação do atributo `class` no bloco do accordion de faixa (`id="collapseT"`) em
  `artist.component.html:324` e `usuario-artista.component.html:226`. Em vez de fundir em
  `class="row flex-column collapse mb-5"` (que a revisão apontou como ativação de um layout que nunca
  esteve ativo em produção — o Ivy sempre aplicava só a segunda ocorrência de `class`), a correção
  manteve **apenas `class="collapse mb-5"`**, preservando o DOM renderizado idêntico ao de produção
  (zero risco visual) e alinhando o bloco ao padrão equivalente em `musicas.component.html:733-736`.
  Isso dispensa a validação visual manual que seria necessária na alternativa de manter a fusão.
- Limpeza de CSS órfão associada às mudanças desta mesma etapa (item "menor" da revisão, aplicado com
  aprovação do usuário):
  - Removido o bloco `article.one .material-icons.save { ... }` de `artist.component.scss`
    (linhas ~361-369), sem elemento correspondente no template desde a remoção do `<span id="save">`.
  - Removida a linha `article.one .text p.h4 a,` do seletor agrupado `color: #fff !important` em
    `artist.component.scss:242` e `usuario-artista.component.scss:217`, já que não existe mais nenhum
    `<a>` dentro de `p.h4` (o nome da música virou `<span class="music-name">`). A regra
    `article.one .text p.h6 a` (link do produtor) e a nova classe `.music-name { color: #fff }` foram
    mantidas intactas.

### Arquivos alterados

- `src/app/artist/artist.component.html`
- `src/app/artist/artist.component.scss`
- `src/app/usuario-artista/usuario-artista.component.html`
- `src/app/usuario-artista/usuario-artista.component.scss`
- `docs/ia-auditorias/R19-pagina-artista-html-responsabilidades.md` (este relatório)

`app-routing.module.ts` e `artist.component.ts` não foram tocados nesta correção — nenhum dos dois
itens exigidos pela revisão dependia deles.

### Itens do Claude resolvidos

1. **Assimetria do `type="button"` inválido** — resolvido: `usuario-artista.component.html:9` agora é
   simétrico a `artist.component.html:9`. Critério "HTML da página fica válido" passa a valer para as
   duas páginas.
2. **Fusão do `class` duplicado em `#collapseT` mudando comportamento visual** — resolvido pela via
   mais conservadora: em vez de manter a fusão e validar visualmente, o `class` foi reduzido a
   `collapse mb-5` (o único valor que já era renderizado em produção segundo o próprio compilador
   Ivy), eliminando o atributo duplicado sem qualquer efeito colateral de layout.

### Itens não resolvidos e justificativa

- `console.log` de depuração em `artist.component.ts:114,153,159,166` — mantidos. Não fazem parte dos
  métodos tocados por este diff (nem pelo diff original da etapa), e a revisão os classificou como
  "menor"/"não é regressão introduzida agora". Corrigir exigiria tocar em `artist.component.ts`, fora
  do escopo mínimo desta correção pós-revisão; registrado como pendência futura.
- Demais pendências já documentadas no relatório original (paginação estática, botão "Reproduzir
  Músicas" sem handler, IDs duplicados em `*ngFor`, aninhamento `<ul>/<div>`, endpoint de perfil
  ausente, duplicação entre os dois componentes, imports órfãos em `artist.component.ts`) — todas
  fora do escopo desta correção, que tratou apenas dos 2 itens "importantes" exigidos pela revisão
  mais a limpeza de CSS órfão associada.
- Observação da revisão sobre `canActivate: [AuthGuard]` em `/artista` ser mudança de autorização que
  merece ratificação humana explícita antes do merge — não é algo a "corrigir" (a proteção está
  correta e alinhada ao objetivo da etapa); fica registrado aqui como lembrete para quem aprovar o
  merge para `dev`.

### Comandos executados e resultado

- `git status` → branch `dev`; mesmos 7 arquivos já modificados (6 de código + este relatório),
  nenhum arquivo novo fora do escopo.
- `git diff --stat -- src/` → 6 arquivos, `33 insertions(+), 51 deletions(-)`. O total de linhas
  alteradas cresceu ligeiramente frente ao diff revisado (`32/-39`) por causa da limpeza de CSS órfão
  (item "menor", aplicada com aprovação explícita do usuário) — não por reabertura de escopo; o
  bloco `#collapseT` em si ficou **mais enxuto** que antes (uma única declaração de `class` em vez de
  duas).
- `npm run build` (`ng build --configuration=production --base-href /`) → **sucesso**. Bundle gerado
  normalmente (`main` 1.62 MB raw / 271.16 kB transfer, total inicial 2.14 MB / 375.41 kB transfer).
  Único aviso (`.custom-file-input:lang(en)`, pseudo-classe `:lang` não suportada) é preexistente e
  não relacionado a este diff.
- `npm test`: `ng test` roda em watch mode e não retorna em shell não interativo. Reexecutado com
  `npx ng test --watch=false --browsers=ChromeHeadless` (mesmo builder Karma do script `test`, apenas
  com flags não interativas do próprio Angular CLI): **115 de 115 SUCCESS**, nenhuma falha. Mesma
  ressalva da revisão anterior aplica-se: isso comprova que os componentes continuam instanciáveis e
  compiláveis, não que o guard/navegação/layout foram exercidos em runtime.
- Confirmação por busca textual nos dois templates: zero ocorrências de `type="button"` em `<a>`,
  zero `<<`/`>>`, zero `href="#"`/`href=""`; `#collapseT` agora aparece com um único atributo `class`
  em cada componente (`artist.component.html:324`, `usuario-artista.component.html:226`).

### Como validar novamente

1. `git diff -- src/app/artist/artist.component.html src/app/artist/artist.component.scss src/app/usuario-artista/usuario-artista.component.html src/app/usuario-artista/usuario-artista.component.scss`
   — revisar as 4 mudanças pontuais.
2. `npm run build` — deve concluir sem erro novo.
3. `npx ng test --watch=false --browsers=ChromeHeadless` — deve manter 115/115 SUCCESS.
4. Inspecionar visualmente (opcional, não bloqueante dado que o DOM renderizado não mudou): abrir
   `/artista` e `/pagina-artista`, expandir o accordion de faixa e confirmar que o layout é idêntico
   ao que já estava em produção antes da Etapa 12A.

---

## Complemento pós-revisão

Ver seção "Correção pós-revisão — 2026-07-29" acima: os 2 itens "importantes" exigidos pela revisão
técnica foram resolvidos, mais a limpeza de CSS órfão associada. Nenhum item bloqueador havia sido
levantado.

---

## Status final da etapa

Aprovado com observações

## Pendências para etapas futuras

- Dar função real ao botão "Reproduzir Músicas" (integração com player/WaveSurfer).
- Substituir a paginação estática pelo componente `app-pagination`, com `filterMusicas` paginado nos
  componentes de artista.
- Corrigir aninhamento `<ul>/<div class="control">` e IDs duplicados em `*ngFor`, revisando os
  seletores SCSS dependentes.
- Definir e implementar endpoint de perfil público/artístico de produtor (nome artístico, bio, avatar)
  para eliminar os dados hard-coded.
- Avaliar unificação de `ArtistComponent` e `UsuarioArtistaComponent` (alta duplicação) em etapa de
  refatoração dedicada.
- Remover imports/injeções não utilizados em `artist.component.ts`.
- Remover `console.log` de depuração remanescentes em `artist.component.ts:114,153,159,166`.
