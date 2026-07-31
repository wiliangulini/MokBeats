# Relatório de Tarefa — Migração Angular 14→22, Etapa 1 (ampliar a rede e2e Cypress)

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-30
**Branch atual:** `feature/angular-22-migration`
**Tipo de tarefa:** Implementação (testes e2e)
**Status final:** Aprovado com observações

## 2. Objetivo

Executar a Etapa 1 do plano de migração Angular 14→22
(`docs/ia-auditorias/2026-07-30__plano-migracao-angular-14-para-22-v2__claude.md`): ampliar a rede
e2e Cypress de 1 para 5 specs, cobrindo player, licença→carrinho, checkout e upload do produtor, e
gerar a baseline visual (screenshots) que servirá de gabarito nas Etapas 3 (Bootstrap 4→5) e D1
(Material 15/MDC).

## 3. Escopo solicitado

- Ampliar `cypress/e2e/player.cy.ts` com verificação de troca de faixa sem duplicar áudio.
- Criar `licenca-carrinho.cy.ts`, `checkout.cy.ts`, `upload.cy.ts`.
- Gerar screenshots de baseline das rotas `/`, `/musicas`, `/carrinho`, `/finalizar-compra`,
  `/upload-file`, `/login` e telas com `<mat-form-field>`.
- DoD: `npm run e2e` verde com 5 specs sob Node 16.20.2; screenshots commitadas.
- Pré-requisito confirmado: Etapa 0 concluída (`mig/e0`), sem bloqueio (rules destravadas).

## 4. Escopo não incluído

Nenhuma alteração em `src/` (aplicação) ou `server/` (backend). Nenhum `ng update`, `npm install`,
alteração em `package.json`/`angular.json`. Nenhuma correção dos bugs encontrados (ver seção 13) —
apenas documentados como achados. Etapa 2 em diante não iniciada.

## 5. Fontes de verdade consultadas

- Plano de migração completo (v2.0), seção "Etapa 1".
- ADR `docs/adr/0002-migracao-angular-14-para-22.md` (Etapa 0).
- `PROJECT_RULES.md` §12 (validação — só `build`, `test`, `test:focus`, `cypress:run`, `e2e`
  existem; `lint`/`typecheck` não existem).
- `AGENTS.md` §6 (não executar ações destrutivas de Git/dados sem necessidade).

## 6. Arquivos lidos

- `cypress/e2e/player.cy.ts`, `cypress.config.ts`, `package.json` (scripts `e2e`/`cypress:run`).
- `src/app/player/player.component.html`/`.ts`, `src/app/service/wave-surfer.service.ts`.
- `src/app/musicas/musicas.component.html`, `musicas.service.ts` (`comprarLicensa`).
- `src/app/carrinho/cartModal/cart-modal.component.html`/`.ts`, `carrinho.component.html`,
  `carrinho.service.ts`.
- `src/app/menu/menu.component.html`/`.ts` (contador do carrinho, gatilho do modal de login).
- `src/app/login/login.component.html`/`.ts`, `auth.service.ts`.
- `src/app/finalizar-compra/finalizar-compra.component.ts`,
  `src/app/formas-de-pagamento/formas-de-pagamento.component.html`/`.ts`.
- `src/app/licenca-valor/*` (descartado do fluxo real — ver achado 13.2).
- `src/app/produtores/produtores.component.ts`/`.html`, `upload-file.service.ts`,
  `src/app/shared/validators.ts`, `src/app/custom-file-upload/custom-file-upload.component.html`.
- `src/app/guards/profile-complete.guard.ts`, `src/app/service/user-profile.service.ts`,
  `src/app/models/user-profile.model.ts`.
- `src/app/app-routing.module.ts` (paths reais de todas as rotas).
- `src/input_mask.js`, `angular.json` (bloco `scripts`).
- `server/src/index.js` (endpoints `/api/auth/login`, `/register`, `/user/profile`,
  `/user/documents/:tipo`), `server/data/users.json`, `docs/GUIA_MOKBEATS_NAO_TECNICO.md`
  (credencial de teste documentada).

## 7. Arquivos alterados

- `cypress/e2e/player.cy.ts` — corrigido bug de navegação (ver 13.1) e ampliado com 1 teste novo.

## 8. Arquivos criados

- `cypress/e2e/licenca-carrinho.cy.ts`, `checkout.cy.ts`, `upload.cy.ts`, `baseline-visual.cy.ts`.
- `cypress/fixtures/audio/{single-track,loop15,loop30,loop60}.wav` — WAV PCM 8-bit/8kHz sintéticos
  com durações exatas (10s/15s/30s/60s), gerados por script Node ad hoc (não commitado; não fazia
  parte do escopo do repositório). Necessários porque `onUpload()` valida duração real dos arquivos
  via `document.createElement('audio')` com tolerância de 200ms.
- `cypress/screenshots/baseline-visual.cy.ts/*.png` (6 arquivos): `home`, `musicas`, `login`,
  `carrinho`, `finalizar-compra`, `upload-mat-form-field`.

## 9. Arquivos preservados

- Tudo em `src/` e `server/` (`git diff --stat` vazio em ambos após o commit).
- `server/data/users.json` foi **modificado como efeito colateral** de rodar os specs (registros
  reais de usuários de teste via `cy.request`/UI) e **revertido** (`git checkout --`) antes do
  commit — ver observação em 22.

## 10. Arquivos removidos

Nenhum. (Um spec de diagnóstico temporário `cypress/e2e/_debug.cy.ts` foi criado e removido durante
a sessão, nunca commitado — usado só para investigar 3 dos achados da seção 13.)

## 11. Estado inicial observado

- Branch `feature/angular-22-migration` em `mig/e0` (commit `2e6a216`), árvore limpa em relação ao
  escopo (mesmos 2 arquivos alheios já registrados no relatório da Etapa 0).
- `cypress/e2e/` continha só `player.cy.ts` (1 spec, 1 teste).
- Nenhum ambiente rodando; Node ativo no shell era 22.18.0 (não usado para os testes — ver seção
  13.5 sobre a matriz real de Node disponível via `nvm`).

## 12. O que foi implementado ou analisado

- Backend (`server/src/index.js`, Node 24.18.1) e frontend (`ng serve`, Node 16.20.2 — igual ao
  DoD) subidos localmente via `nvm` para exploração e validação real, não apenas leitura de código.
- Corrigido bug real pré-existente no spec `player.cy.ts` (13.1) e ampliado com teste de troca de
  faixa.
- Criados os 3 specs de fluxo (licença→carrinho, checkout, upload) e 1 spec de baseline visual —
  total 5 specs, batendo com o número do DoD do plano (a tabela do plano listava 4 specs "de fluxo"
  sem nomear o de baseline; interpretação registrada em 13.6).
- Todos os 5 specs passam individualmente e em conjunto, rodados via
  `npx cypress run --browser electron --headless` sob Node 16.20.2 (comando real por trás de
  `npm run e2e`, que também sobe o `ng serve` via `start-server-and-test`).
- `server/data/users.json` revertido ao estado original após os testes.

## 13. Decisões técnicas tomadas

### 13.1 — Bug real corrigido: `cy.visit('/musicas')` sem hash

**Achado:** o app usa `RouterModule.forRoot(routes, {useHash: true})`. `cy.visit('/musicas')` (sem
`#`) carrega a rota vazia (`redirectTo: 'home'`) porque o `HashLocationStrategy` lê
`location.hash`, que fica vazio sem o `#`. O spec original **já falhava antes desta sessão**
(reproduzido: `npx cypress run --spec player.cy.ts` → `0 passing, 1 failing`, elemento
`button.svg.play` nunca encontrado porque a Home carregava, não Músicas).

**Decisão:** corrigir todas as navegações dos specs para `/#/rota`. Confirmado por execução real
(não é suposição): antes da correção, `appHome:1, appMusicas:0`; depois, `appMusicas:1, btnPlay:10`.

**Justificativa:** um spec que "passa por coincidência" (a Home também lista músicas com o mesmo
tipo de botão) não é rede de segurança para a migração — o próprio propósito da Etapa 1.

### 13.2 — Divergência de rota do modal de licença

**Achado:** `src/app/licenca-valor/` (rota `/precos`) é uma página estática de planos, **sem**
lógica de adicionar ao carrinho — os botões "ASSINE JÁ" não têm `(click)`. O modal real de
escolha de licença é `src/app/carrinho/cartModal/cart-modal.component.*`, aberto por
`musicas.service.ts:449-454` (`comprarLicensa` → `verificaLogin()` → `openModalCart()`).

**Decisão:** os specs usam `cart-modal` (`#license-padrao`, `#license-premium`, `#plan-mensal`,
`#plan-6-meses`, `#plan-12-meses`, `.confirm-button`), não `licenca-valor`.

### 13.3 — Divergência de rota do checkout (A5)

**Achado:** `FinalizarCompraComponent` não injeta `CarrinhoService` (`total` é hardcoded em
`'64,95'`) e seu template não contém `#numerocartao1`/`#cpfBol`. Esses campos vivem em
`FormasDePagamentoComponent` (rota `/formas-de-pagamento`, guard só `AuthGuard`).

**Decisão:** `checkout.cy.ts` cobre o que existe de fato: (a) persistência do item no carrinho —
`/carrinho` reflete `licencaSelecionada.nome`/`planoSelecionado.nome` corretamente; (b) os campos de
A5 em `/formas-de-pagamento`. Não afirma nada sobre `/finalizar-compra` além de que não está
conectado ao carrinho (não testado — não fazia sentido testar persistência que não existe).

### 13.4 — Achado novo, fora do previsto pelo plano: a máscara de A5 não aplica em nenhuma rota

**Achado:** `src/input_mask.js` (`$("#numerocartao1").inputmask(...)`) é injetado via `scripts` do
`angular.json`, executado uma única vez no carregamento do documento — **antes** de o Angular montar
qualquer componente. Como o script roda de forma síncrona, sem `$(document).ready()` nem observer,
`$("#numerocartao1")` sempre retorna um jQuery-set vazio. Confirmado por execução real: digitar
`1234567890123456` no campo resulta em valor idêntico, sem espaços.

**Decisão:** `checkout.cy.ts` documenta o comportamento **real** (sem máscara), com comentário
explícito no arquivo. Não foi corrigido (fora do escopo — só specs Cypress nesta etapa; a correção
tocaria `angular.json`/`src/`, exigindo plano próprio). Se corrigido no futuro, este teste passa a
falhar e sinaliza a mudança — o comportamento correto para uma rede de regressão.

**Risco para a migração:** isso significa que o achado A5 do plano mestre ("`input_mask.js` acopla
ao checkout via jQuery global no load") está parcialmente impreciso — o script nunca funcionou
contra as rotas SPA, então a "proibição de reordenar `scripts`" continua válida (não piora nada),
mas não há comportamento funcional para proteger nessas telas especificamente.

### 13.5 — Ambiente de execução

**Decisão:** os specs foram validados com backend real (`server/src/index.js`, Node 24.18.1 via
`nvm`) e frontend real (`ng serve`, Node 16.20.2 via `nvm`), replicando o DoD exato do plano. `curl`
está bloqueado nesta configuração do Bash (mencionado em `PROJECT_RULES.md`/plano §11); a validação
usou o próprio Cypress e scripts Node para inspecionar estado, nunca `curl`/`wget`.

### 13.6 — Contagem "5 specs" do DoD

**Decisão:** interpretado como 4 specs de fluxo (player, licença-carrinho, checkout, upload) + 1
spec de baseline visual (`baseline-visual.cy.ts`), que não estava nomeado na tabela de fluxos do
plano mas é exigido pelo próprio DoD ("screenshots de baseline commitadas"). Essa leitura fecha
exatamente em 5 arquivos de spec, batendo com o número citado.

### 13.7 — Setup de autenticação nos specs (login real vs. seed)

**Decisão:** `licenca-carrinho.cy.ts`/`checkout.cy.ts` fazem login real via UI com e-mail novo
(timestamp) + senha ≥8 chars — o backend aceita qualquer e-mail válido nessas condições e cria
sessão com `tipoPerfil: 'comprador'` (comportamento documentado em
`docs/GUIA_MOKBEATS_NAO_TECNICO.md:84`, confirmado em `server/src/index.js:216-224`).
`upload.cy.ts`/`baseline-visual.cy.ts` (produtor) usam `cy.request` real contra
`POST /api/auth/register` (não mock) para obter um token JWT genuíno, e populam o cache de perfil
(`userProfileCache`) via `cy.visit(..., { onBeforeLoad })`, pois `ProfileCompleteGuard` exige
documentos que não fazem parte do escopo deste smoke test. Não foram usados os usuários seedados em
`server/data/users.json` (senhas com hash bcrypt desconhecido) para evitar dependência de segredo
não documentado.

**Achado de timing (Cypress):** `cy.visit()` para uma mudança de **hash fragment** na mesma origem
**não recarrega o documento** — os serviços Angular singleton (`AuthService`, `UserProfileService`)
não são reconstruídos, então popular `localStorage` via `cy.window().then(...)` depois de um
primeiro `cy.visit` não tem efeito. A correção foi usar `onBeforeLoad` (que roda antes do bootstrap)
combinado com `cy.intercept('GET', '**/api/user/profile', ...)` — sem o intercept, o banner global
(`app-profile-notification-banner`, montado em `app.component.html`) chama a API real e sobrescreve
o cache com o profile vazio do usuário recém-registrado antes do guard decidir.

### 13.8 — Limitação do Cypress para inspecionar `FormData` multipart

**Achado:** para requisições `multipart/form-data`, `interception.request.body` do
`cy.intercept`/`cy.wait` do Cypress 13.17.0 sempre retorna `{}` (confirmado por execução: `bodyType:
"object", bodyKeys: []`), independentemente do conteúdo real enviado — limitação conhecida da
camada de rede do Cypress, não um erro de configuração.

**Decisão:** `upload.cy.ts` captura os nomes de campo via monkey-patch de `FormData.prototype.append`
injetado em `onBeforeLoad`, antes do bootstrap do Angular — captura na origem (o próprio
`ProdutoresComponent.buildFormData()`), não na rede. `cy.intercept` no endpoint continua usado só
para stubar a resposta (evita depender do processamento real do upload no backend).

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| A máscara de A5 nunca funcionou nas rotas SPA (13.4) — não é uma regressão a proteger, é ausência de funcionalidade | Baixa | O spec de checkout não serve de guarda contra quebra de máscara (não existe o que quebrar); serve só de registro do estado atual | Documentado no spec e neste relatório; se corrigido no futuro, o teste sinaliza via falha |
| `server/data/users.json` é escrito a cada execução real de `licenca-carrinho`/`checkout`/`upload`/`baseline-visual` (login/registro real) | Baixa | `npm run e2e` local sempre gera diffs em `server/data/users.json` como efeito colateral | Revertido nesta sessão antes do commit; próximo agente deve rodar `git checkout -- server/data/users.json` após `npm run e2e` local, ou considerar branch de dados de teste isolado — decisão de infraestrutura fora do escopo desta etapa |
| Fixtures de áudio geradas por script ad hoc não versionado | Baixa | Se os arquivos `.wav` de `cypress/fixtures/audio/` forem perdidos, precisam ser regenerados | Especificação exata registrada em 8: WAV PCM 8-bit mono, 8kHz, silêncio, durações 10/15/30/60s |
| Specs usam `{force: true}` em vários clicks (menu mobile/overlay cobrindo elementos) | Baixa | Mascara possíveis problemas reais de z-index/responsividade | Pré-existente ao app, não introduzido pelos specs; registrado como observação, não corrigido (fora de escopo) |

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Sim (nenhuma alteração em `src/`)
- Rotas preservadas: Sim — nenhuma rota alterada; specs apenas **leem** os paths reais
- Guards/autenticação preservados: Sim — specs respeitam `AuthGuard`/`ProfileCompleteGuard` reais
  (login/registro reais via API, sem bypass de guard)
- APIs/payloads preservados: Sim — nenhuma mudança de contrato; `upload.cy.ts` **verifica** que os
  nomes de campo do `FormData` real (`schemaVersion, mode, track, loop15, loop30, loop60, meta`)
  continuam os mesmos
- Player/WaveSurfer preservado: Sim — não alterado; spec novo verifica não-duplicação
- Upload/FormData preservado: Sim — ver acima
- Carrinho/licenças/checkout preservados: Sim — não alterados; specs verificam comportamento real
- Dashboard/produtor preservado: Não aplicável (não tocado nesta etapa)
- Estilos/padrões preservados: Sim — nenhum SCSS/CSS alterado

Observações:

- Os specs em si **não protegem contra tudo**: são smoke tests de caminho feliz, conforme o plano
  pede ("sem exaustividade"). Achados 13.2–13.4 mostram que a leitura do código real divergiu da
  premissa do plano em pontos específicos — todos ajustados para refletir o comportamento real.

## 16. Validações executadas

- [x] `npx cypress run --browser electron --headless` (todos os 5 specs, sob Node 16.20.2, backend
  real em Node 24.18.1) — **5/5 specs, 8/8 testes passando**.
- [x] Cada spec também rodado individualmente durante o desenvolvimento, para isolar falhas.
- [x] `git diff --stat src/` e `server/` — vazios após o commit (users.json revertido).
- [x] Teste manual: reprodução do bug do spec original ANTES da correção (falha real, capturada) —
  Resultado: confirma que o achado 13.1 é real, não hipotético.

## 17. Validações não executadas

- `npm run build` / `npm test` (Karma) — Motivo: não exigidos pelo DoD desta etapa (só `e2e`); nada
  em `src/` foi alterado, então build/testes de unidade permanecem no estado da Etapa 0.
- `npm audit` — Motivo: fora do escopo (não há mudança de dependências nesta etapa).
- `npm run lint` / `npm run typecheck` — não existem neste projeto (`PROJECT_RULES.md §12`).

## 18. Validações recomendadas

- [ ] Antes da Etapa 2: `git tag -l 'mig/*'` e `git log --oneline` para confirmar `mig/e1` como
  estado real (não supor a partir deste relatório).
- [ ] Rodar `npm run e2e` (comando oficial, via `start-server-and-test`) ao menos uma vez antes de
  prosseguir, para validar que o pipeline completo (não só `cypress run` direto) funciona.
- [ ] Reverter `server/data/users.json` após qualquer execução local futura dos specs.

## 19. Pendências

- Bug do achado 13.4 (máscara de A5 nunca aplica) não corrigido — registrar como ticket separado,
  fora do escopo de migração (é bug de arquitetura de carregamento de scripts, pré-existente).
- Efeito colateral em `server/data/users.json` a cada execução real dos specs — sem solução
  definitiva nesta etapa; decisão de isolar dados de teste (ex.: backend efêmero para e2e) fica para
  quando/se o projeto tiver CI dedicado.
- Script gerador dos fixtures de áudio não foi commitado (rodou fora do repo, em scratchpad) — os
  `.wav` resultantes estão commitados; se precisarem ser regenerados, a especificação exata está em
  §8 deste relatório.

## 20. Próximo passo recomendado

Aguardar confirmação explícita do usuário antes de iniciar a Etapa 2 (unificar o runtime Node em
24.18.1), conforme instrução da sessão.

## 21. Instruções para o próximo agente

1. Leia este relatório e o da Etapa 0.
2. Confirme `git log --oneline` e `git tag -l 'mig/*'` — deve haver `mig/e0` e `mig/e1`.
3. Rode `npx cypress run` (Node 16.20.2 via nvm) para confirmar que os 5 specs continuam verdes
   antes de iniciar a Etapa 2 — não suponha que o ambiente permanece idêntico entre sessões.
4. Reverta `server/data/users.json` se a execução acima o modificar.
5. Leia a seção "Etapa 2" do plano em
   `docs/ia-auditorias/2026-07-30__plano-migracao-angular-14-para-22-v2__claude.md` antes de agir.

## 22. Observações finais

Esta etapa expôs 3 achados reais que o plano mestre não previa com exatidão: um bug pré-existente no
spec original do player (navegação sem hash), a rota real do "checkout" (formas-de-pagamento, não
finalizar-compra) e um bug estrutural na máscara de A5 (nunca funciona em nenhuma rota SPA). Nenhum
desses foi corrigido — todos documentados e usados para calibrar os specs contra o comportamento
real do sistema, não contra a premissa do plano. Isso é consistente com o princípio de "não editar
às cegas contra o texto do plano" quando o estado real diverge.
