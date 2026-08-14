# R28 — QA final: regressão completa

## Resumo da etapa

QA final da Etapa 16 (R28), aplicando a skill `senior-code-review` — revisão e validação, sem
implementação. Repositório estava limpo (`git status` sem pendências) ao iniciar, na branch `dev`,
sincronizada com `origin/dev`. Todos os relatórios R01–R27 estão com status `Preenchido` no índice
(`docs/ia-auditorias/README.md`), então esta etapa tratou o histórico anterior como aceito/commitado
e focou em: (1) rodar build e suíte de testes reais (frontend e backend) com evidência de execução;
(2) levantar a lista de arquivos alterados desde o baseline pós-migração Angular; (3) auditar
regressão cruzada nas áreas críticas (guards, WaveSurfer, upload, carrinho/checkout, dashboard,
pricing, FAQ, menu); (4) verificar links vazios, `target="_blank"` sem `rel`, `console.log` e outros
indicadores objetivos de regressão nos arquivos efetivamente tocados nesta rodada de trabalho.

Nenhum bug objetivo bloqueador foi encontrado nos arquivos alterados desde o baseline. Os achados
de qualidade (links `href="#"`, `console.log`, manipulação direta de DOM em `button-whats`, preços
duplicados em `cart-modal`) são todos pré-existentes, fora do diff desta rodada e/ou já documentados
como pendência em relatórios anteriores (R02, R24, R26, R27) — nenhum foi corrigido aqui, conforme a
restrição da etapa de não iniciar refatoração nova.

**Escopo de "desde o início da implementação" usado neste relatório:** o commit `dfdf03b`
(`"feat(deploy): ajusta scripts e docs para dist/browser/ e Node unificado (Etapa 13 - final)"`), que
fecha a migração Angular 14→22 (rastreada à parte em `docs/adr/0002-migracao-angular-14-para-22.md`
e nos relatórios `2026-07-30__migracao-angular-etapa-*`). A partir dali começou a sequência de
correções de fluxo R14–R27 que esta etapa audita. Os relatórios R01–R13 (pré-migração) e a própria
migração já foram auditados e commitados em rodadas anteriores; incluí-los de novo no diff (334
arquivos desde `a5bc71f`, o commit do R01) misturaria regressão de infraestrutura de build com
regressão de fluxo de produto e não agregaria sinal novo.

## Arquivos lidos

- `PROJECT_RULES.md`, `AGENTS.md`, `CLAUDE.md` (carregado via `@PROJECT_RULES.md`)
- `docs/ia-auditorias/README.md` (índice e status dos relatórios)
- `docs/ia-auditorias/R28-qa-final-regressao-completa.md` (stub original, substituído por este conteúdo)
- `docs/ia-auditorias/R27-checkout-fechamento-pedido.md` (relatório mais recente antes desta etapa, para continuidade)
- `package.json` (raiz) e `server/package.json` (scripts reais disponíveis)
- `src/app/guards/auth.guard.ts`, `src/app/guards/produtor.guard.ts`, `src/app/guards/profile-complete.guard.ts`
- `src/app/app-routing.module.ts` (mapa completo de rotas e guards)
- `src/app/menu/menu.component.ts`, `.html` (contador do carrinho, link HUB)
- `src/app/button-whats/button-whats.component.ts`, `.html`
- `src/app/carrinho/carrinho.component.scss`, `src/app/carrinho/cartModal/cart-modal.component.ts`
- `server/src/index.js` (diff desde `dfdf03b`, referente ao fix de carregamento do `.env`)
- Saída completa de `git log`, `git diff --stat`/`--name-only` (`a5bc71f..HEAD` e `dfdf03b..HEAD`), `git show --stat 6440b74`
- Grep dirigido em `src/app/**/*.ts`/`*.html` para `href="#"`, `href=""`, `target="_blank"`, `console.log`, `TODO`/`FIXME`, `.destroy()`/`ngOnDestroy` (WaveSurfer), `FormData`/`append(` (upload)

## Arquivos alterados

Nenhum arquivo de produto foi alterado nesta etapa (revisão/QA, sem escrita de código). O único
arquivo escrito é este próprio relatório: `docs/ia-auditorias/R28-qa-final-regressao-completa.md`.

Lista de arquivos alterados no período auditado (`dfdf03b..HEAD`, 60 arquivos, +5822/-3141), por área:

**Carrinho / Checkout (R26–R27)**
`src/app/carrinho/carrinho.component.{ts,html,scss,spec.ts}`, `src/app/finalizar-compra/finalizar-compra.component.{ts,html,scss,spec.ts}`, `src/app/service/carrinho.service.{ts,spec.ts}`, `src/app/models/pedido.model.ts`, `src/app/assinatura/assinatura.component.html`

**Dashboard do Produtor (R21–R23)**
`src/app/dashboard-produtor/dashboard-produtor.component.{ts,html,scss,spec.ts}`, `src/app/dashboard-produtor/dashboard.charts.ts`, `.spec.ts`, `dashboard.models.ts`, `charts/bar-list-chart.component.ts`, `charts/line-chart.component.ts`

**Licenças/Preços (R24)**
`src/app/licenca-valor/licenca-valor.component.{ts,html,scss,spec.ts}`, `licenca-valor.models.ts`

**FAQ (R25)**
`src/app/faq/faq.component.{ts,html}`

**Página/área do produtor (R19–R20)**
`src/app/artist/artist.component.html`, `src/app/usuario-artista/usuario-artista.component.html`, `src/app/sub-menu/sub-menu.component.{html,scss}`, `src/app/menu-produtor/menu-produtor.component.html`

**Menu/Header (R26, badge do carrinho)**
`src/app/menu/menu.component.{html,ts,spec.ts}`

**App-level**
`src/app/app.module.ts`

**Backend**
`server/src/index.js` (fix de path do `.env`, auditoria de 2026-08-05, não relacionado ao fluxo de produto)

**Infra/tooling/docs**
`package.json`, `package-lock.json`, `start.sh`, `.gitignore`, `.vscode/settings.json`, `.claude/commands/verificar-scripts-shell.md`, `.claude/settings.json`, `.claude/skills/senior-code-agent/SKILL.md`, `docs/SCRIPTS_SHELL.md`, `docs/planos/2026-07-29__plano-p0-v2.2-remediacao-vulnerabilidades.md`, e os próprios relatórios `docs/ia-auditorias/{R02,R19,R20,R21,R22,R23,R24,R25,R26,R27,README}.md` + `docs/ia-auditorias/2026-08-05__start-sh-fixes-e-sync-seguranca-main__claude.md`

Não alterados nesta janela (fora do escopo das etapas R14–R27, confirmados por leitura/grep como
estáveis): guards, `app-routing.module.ts`, player/WaveSurfer (`player.component.ts`,
`wave-surfer.service.ts`, `musicas.component.ts`), `upload-file.service.ts`, `home`, `footer`, `login`.

## O que foi implementado ou auditado

1. **Build e testes reais executados com Node correto** (`.nvmrc` = `24.18.1`; o `nvm` padrão do
   ambiente é `22.18.0`, incompatível com o Angular CLI do projeto — mesma condição já registrada
   nas R24–R27). `npm run build` (produção) e `npm test`/`npm test` do `server/` rodaram sob
   `nvm use 24.18.1`.
2. **Guards de autenticação/perfil/produtor auditados linha a linha** (`AuthGuard`, `ProdutorGuard`,
   `ProfileCompleteGuard`) e cruzados contra `app-routing.module.ts`: `/finalizar-compra` e `/upload`
   exigem `AuthGuard` + `ProfileCompleteGuard`; `/dashboard-produtor` exige `AuthGuard` +
   `ProdutorGuard`; `/carrinho` continua público (revisão de itens, por decisão da R27) — nenhuma
   rota crítica ficou desprotegida.
3. **Lifecycle do WaveSurfer confirmado intacto**: `.destroy()` presente em
   `player.component.ts:436` (instância principal) e `:533` (stems), e em
   `wave-surfer-test.component.ts:138`/`:259`. Nenhum desses arquivos foi tocado nas etapas
   R14–R27, então o comportamento auditado nas R10–R12 e R16 permanece válido.
4. **`FormData` do upload do produtor auditado**: `upload-file.service.ts` preserva `append('file',
   file, file.name)` e a assinatura de `uploadProducerTrack(fd: FormData)` inalteradas; consistente
   com a suíte de contrato do backend (`server/src/index.js`, testada abaixo).
5. **Integração carrinho → menu → checkout revisada de ponta a ponta no código**: `MenuComponent`
   assina `CarrinhoService.cartCount$` com `unsubscribe` em `ngOnDestroy` (mesmo padrão de
   `authStatus$`); `carrinho.component.scss` ficou com 1 media query após a simplificação da R27
   (revisão de itens), consistente com a redução de escopo do template.
6. **Varredura de regressão em links e DOM em toda a árvore `src/app`**:
   - `href="#"` encontrado apenas em `pag-playlist`, `favoritos` e `genero` — nenhum desses arquivos
     está no diff `dfdf03b..HEAD`; são débito técnico pré-existente fora do escopo das áreas críticas
     da etapa (home, header, footer, login, músicas, player, stems, efeitos, upload, dashboard,
     pricing, FAQ, carrinho, checkout).
   - `target="_blank"` sem `rel="noopener noreferrer"`: apenas `button-whats.component.html` — mas o
     `<a>` não tem `href` no HTML (é setado via `setAttribute` em `closeWhats()`, manipulação direta
     de DOM pré-existente), então nem chega a ser um link externo funcional nesse estado; arquivo
     fora do diff da etapa. Nos links externos reais tocados nesta janela (`menu.component.html`
     "HUB", `footer.component.html` WhatsApp/HUB) o `rel="noopener noreferrer"` está presente.
   - `console.log` remanescente: volume relevante em todo o projeto (`musicas`, `player`, `favoritos`,
     `efeitos-sonoros`, `playlists` etc.), mas **nenhum desses arquivos está no diff da etapa** — a
     R27 já havia removido os `console.log` de depuração do `carrinho.component.ts` como parte do
     escopo dela. Não removi os demais por serem fora do escopo desta rodada de QA (etapa é
     revisão, não refatoração).
7. **Pendência de duplicação de preços confirmada ainda presente**: `cart-modal.component.ts` mantém
   `preco: 49.99/199.99/249.99` hardcoded, independente de `licenca-valor` (`/precos`) — mesmo risco
   já sinalizado nas R24, R26 e R27, sem alteração nesta etapa (não é bug novo, é pendência de
   arquitetura que exige decisão de produto sobre fonte única de preço).
8. **`npm audit` (raiz, produção)**: 0 vulnerabilidades — consistente com o encerramento do Plano P0
   v2.2 registrado em memória de sessões anteriores.

## Comandos executados

- [x] `git branch`
- [x] `git status`
- [x] `npm run build`
- [x] `npm test`

## Resultado dos comandos

- `git branch` → `dev` (único branch local). `git status` → limpo antes e depois desta etapa (só o
  relatório foi escrito).
- `npm run build` (`ng build --configuration=production --base-href /`, sob `nvm use 24.18.1`) →
  **sucesso**. Bundle inicial 2,51 MB / 427,38 kB transferência estimada — idêntico ao baseline da
  R27. Único aviso: deprecation do Sass `@import` em `src/styles.scss:79`, pré-existente e fora de
  escopo (mesmo aviso reportado desde a R24).
- `npm test -- --watch=false` (frontend, Vitest) → **56 arquivos de teste, 154 testes, 100% passou**,
  0 falhas. Número idêntico ao baseline reportado na R27 (nenhum teste novo foi necessário nesta
  etapa, pois não houve alteração de código).
- `npm test` (`server/`, `node --test`) → **114 testes, 100% passou**, 0 falhas. Cobre validação de
  contrato `producer_form_v2` e legado, parser multipart, cleanup de arquivos temporários e upload
  legado sem auth.
- `npm run lint` / `npm run typecheck`: **não existem** no `package.json` da raiz nem do `server/`
  (raiz: `ng`, `start`, `build`, `watch`, `test`, `test:focus`, `cypress:run`, `e2e`; `server`:
  `start`, `test`) — não foram inventados, conforme `AGENTS.md §7`.
- `cypress:run` / `e2e`: **não executados**. Exigem subir o servidor de desenvolvimento e não fazem
  parte da lista de comandos de validação desta etapa (mesma decisão da R27); ficam registrados como
  pendência de validação abaixo.
- `npm audit --omit=dev` (raiz): 0 vulnerabilidades.

## Como validar manualmente

**Fluxo comprador**
1. `nvm use 24.18.1 && npm start`, abrir `/#/home` → navegação institucional, links `routerLink`.
2. `/#/musicas`: aplicar filtros, tocar preview (waveform carrega, player não duplica áudio ao trocar
   de faixa), abrir modal de licença, adicionar ao carrinho — badge do menu atualiza sem reload.
3. `/#/efeitos-sonoros`: mesmo fluxo de player/licença/carrinho da página de músicas.
4. `/#/carrinho`: revisão de itens, remoção de item (`x`) atualiza total e badge em tempo real, sem
   card de endereço/pagamento (movido para `/finalizar-compra`).
5. Deslogado, clicar "Finalizar compra": deve abrir modal de login (`AuthGuard`) em vez de renderizar
   o checkout.
6. Logado com perfil incompleto: `ProfileCompleteGuard` deve redirecionar para
   `/atualizar-informacoes`.
7. Logado com perfil completo, em `/#/finalizar-compra`: total/itens reais do carrinho (nunca valor
   fixo), aceite de termos obrigatório de fato (`Validators.requiredTrue`), submit gera tela de
   "simulação" (sem cobrança real).
8. `/#/precos`: alternar toggle 6/12 meses, conferir que os valores batem com os exibidos no modal de
   licença do carrinho (`cart-modal`) — **atenção**: são fontes de dados hoje independentes (ver
   pendência abaixo), então divergência aqui não é bug de regressão desta etapa, é a pendência
   conhecida.
9. `/#/faq`: navegação por âncoras/abas e responsividade do menu.

**Fluxo produtor**
10. Login como produtor, `/#/produtores` → upload Single Track (sem Stems), Single Track + Stems e
    FX — conferir que os nomes de campo do `FormData` continuam batendo com o backend (testes de
    contrato do `server/` cobrem isso automaticamente, ver acima).
11. `/#/dashboard-produtor`: só acessível a produtor autenticado (`AuthGuard` + `ProdutorGuard`);
    gráficos, tabela responsiva e filtro "Todas/Destaque" renderizam sem erro no console.
12. `/#/pagina-artista` (pública) vs. área privada do produtor (`/#/artista`, com `AuthGuard`):
    confirmar que a página pública não expõe nada do dashboard.

**Responsividade e browsers**
13. **Não executado nesta etapa** (limitação do ambiente de execução, sem acesso a browser real):
    testar em ~375px/768px/1440px e nos browsers principais (Chrome, Firefox, Safari, Edge) as telas
    tocadas nas R14–R27 — carrinho, finalizar-compra, dashboard-produtor, licenca-valor, faq,
    sub-menu, menu-produtor. Os arquivos `.scss` alterados têm media queries presentes (confirmado
    por leitura), mas isso não substitui validação visual real.
14. `npm run e2e` (Cypress) — não executado nesta etapa; considerar antes de release se houver
    suíte E2E cobrindo os fluxos de carrinho/checkout.

## Riscos ou pendências

- **Preços duplicados entre `/precos` (`licenca-valor`) e `cart-modal`**: risco de inconsistência de
  valor cobrado vs. valor anunciado, sinalizado desde a R24 e ainda não resolvido. Requer decisão de
  produto sobre fonte única de verdade (endpoint de preços ou serviço compartilhado) antes de uma
  eventual integração com gateway de pagamento real.
- **Checkout de assinatura mensal sem tela dedicada**: pendência herdada da R27 — `/finalizar-compra`
  deixou de atender assinatura (agora é checkout do carrinho avulso) e "Assine Já" aponta para
  `/precos`. Decisão de produto pendente.
- **Validação de responsividade em browsers reais e Cypress E2E não executados nesta etapa** (ver
  itens 13–14 acima) — ambiente de execução não tem acesso a browser gráfico; registrado como
  pendência explícita, não como "validado".
- **Débito técnico pré-existente fora do escopo das áreas críticas** (não são regressões desta
  rodada, mas ficam registrados por varredura completa do repositório):
  - `href="#"` em `pag-playlist`, `favoritos`, `genero`;
  - manipulação direta de DOM (`document.querySelectorAll`, `setAttribute`) em
    `button-whats.component.ts`;
  - volume alto de `console.log` de depuração fora das áreas tocadas (musicas, player, favoritos,
    efeitos-sonoros, playlists, dashboard menu-produtor etc.).
  Nenhum foi corrigido aqui — corrigir exigiria tocar arquivos fora do escopo da Etapa 16 e
  configuraria refatoração nova, vedada por esta etapa.
- **`PedidosComponent` ("Meus Pedidos") continua casca vazia**, sem lista de pedidos reais ou
  simulados — pendência já registrada na R27, sem mudança.
- **Backend sem endpoint real de pedido/pagamento** — confirmado novamente por leitura de
  `server/src/index.js`; o checkout continua sendo simulação explícita client-side.

Nenhuma das pendências acima é bloqueadora para o estado atual da `dev`: build passa, 154+114
testes automatizados passam, guards e contratos críticos estão intactos.

## Confirmação de escopo

Esta etapa foi puramente revisão/QA: nenhum arquivo de código-fonte, configuração ou dependência foi
alterado. O único arquivo escrito é este relatório
(`docs/ia-auditorias/R28-qa-final-regressao-completa.md`), conforme o contrato de escrita da tarefa.
Não foram feitos merges, cherry-picks nem qualquer interação com a branch
`codex/create-musical-producer-dashboard-design`. Não foi necessário sair do escopo declarado.
