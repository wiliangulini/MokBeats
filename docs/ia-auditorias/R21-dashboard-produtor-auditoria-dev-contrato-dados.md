# R21 — Dashboard produtor: auditoria dev, contrato e dados

## Relatório do Claude Code

## Resumo da etapa

Etapa 13A — auditoria técnica somente leitura do `DashboardProdutorComponent` da `dev`, seu
`DashboardService`, models, rota, guards e estados de UI, pré-requisito das etapas R22 (adaptação
visual guiada pela branch `codex/create-musical-producer-dashboard-design`) e R23 (gráficos, estados,
responsividade). Nenhum arquivo de código foi alterado. O contrato de dados está mapeado: 5 endpoints
existem no backend, mas ele é um mock estático declarado (comentário explícito em
`server/src/index.js:911-912`) e apenas 3 dos 5 endpoints são consumidos pelo componente hoje. A rota
e os dois guards (`AuthGuard`, `ProdutorGuard`) estão corretos e intactos. Os 4 gráficos da Fase 2 são
hoje placeholders tracejados no HTML — a escolha da biblioteca de gráficos fica registrada como
decisão pendente de validação humana (PROJECT_RULES §13), sem recomendação de adoção nesta etapa.

## Arquivos lidos

- `src/app/dashboard-produtor/dashboard-produtor.component.ts`, `.html`, `.scss`
- `src/app/dashboard-produtor/dashboard.service.ts`
- `src/app/dashboard-produtor/dashboard.models.ts`
- `src/app/sub-menu/sub-menu.component.ts`, `.html`, `.scss`
- `src/app/app-routing.module.ts`
- `src/app/guards/auth.guard.ts`, `src/app/guards/produtor.guard.ts`
- `src/app/login/auth.service.ts` (métodos `isProdutor`, `userAutetic`, `verificaLogin`)
- `src/app/service/user-profile.service.ts`
- `src/app/interceptors/auth.interceptor.ts`
- `src/app/app.module.ts` (declarações e providers relacionados ao dashboard/sub-menu)
- `src/environments/environment.ts` e `proxy.conf.json`
- `server/src/index.js` (bloco `Dashboard do Produtor`, linhas ~910-1010)
- `package.json` (scripts e dependências da `dev`)
- `docs/ia-auditorias/R20-area-produtor-menu-rotas-protecao.md` (relatório anterior, formato de referência)
- `docs/ia-auditorias/README.md` (posição de R21/R22/R23 no roadmap)
- Branch `codex/create-musical-producer-dashboard-design` — **somente leitura**, via `git ls-tree` e
  `git show`, para `produtor-dashboard.component.ts`/`.html` e `package.json` (comparação de stack;
  não mesclada, não copiada)

## Arquivos alterados

- `docs/ia-auditorias/R21-dashboard-produtor-auditoria-dev-contrato-dados.md` (este relatório,
  substituindo o stub placeholder)

Nenhum arquivo de código (`src/`, `server/`) foi alterado.

## O que foi implementado ou auditado

### Contrato de dados — `DashboardService`

`DashboardService` (`src/app/dashboard-produtor/dashboard.service.ts`) expõe 5 métodos sobre
`${environment.apiBaseUrl}/dashboard`, com `environment.apiBaseUrl = '/api'` roteado em dev por
`proxy.conf.json` para `http://127.0.0.1:3100`:

| Método do service | Endpoint | Parâmetro `period` | Consumido pelo componente? | Honrado pelo backend? |
|---|---|---|---|---|
| `getSummary()` | `GET /api/dashboard/summary` | — | Sim | — |
| `getSalesByTrack(period)` | `GET /api/dashboard/sales-by-track` | sim | Sim | **Não** — ignora o param |
| `getSalesByOrigin(period)` | `GET /api/dashboard/sales-by-origin` | sim | Sim | **Não** — ignora o param |
| `getRevenueByTrack(period)` | `GET /api/dashboard/revenue-by-track` | sim | **Não** | **Não** — ignora o param |
| `getLikesVsSales(period)` | `GET /api/dashboard/likes-vs-sales` | sim | **Não** | Sim — único que filtra por `period` |

Todos os 5 endpoints existem e respondem em `server/src/index.js:989-1008`, protegidos por
`dashboardMiddleware` (`server/src/index.js:914-921`), que primeiro chama `authenticateToken` e depois
exige `req.user.tipoPerfil === 'produtor'` (403 caso contrário). O `DashboardService` monta o header
`Authorization` manualmente (`dashboard.service.ts:24-27`) — redundante com o `AuthInterceptor`
(`src/app/interceptors/auth.interceptor.ts`), que já injeta o mesmo header em qualquer request com
`/api/` na URL. Não quebra (o header explícito apenas sobrescreve com o mesmo valor), mas duplica a
regra de autenticação em dois lugares do código.

**Backend é mock estático e declarado.** `server/src/index.js:910-985` define o bloco
`// ─── Dashboard do Produtor ───` com o comentário: *"MOCK — todos os dados abaixo são estáticos para
validar o contrato de API. Substituir por queries reais quando houver persistência de vendas/licenças."*
`DASHBOARD_MOCK` é um objeto fixo em memória; nenhum dos 5 handlers lê `req.user` para segmentar dados
por produtor — qualquer usuário com `tipoPerfil: 'produtor'` recebe exatamente o mesmo payload. Apenas
`likes-vs-sales` lê `req.query.period` (validado contra `VALID_PERIODS`, default `'30d'`); os outros 4
handlers ignoram `_req`/`req.query` e devolvem sempre o mesmo array/objeto — logo, hoje, alternar o
filtro 7d/30d/12m na UI **não altera nenhum dado visível** nos KPIs, na tabela de faixas ou na origem.

### Models (`dashboard.models.ts`)

DTOs espelham o contrato do backend 1:1: `DashboardSummary` (com `licencas.basica/profissional/exclusiva`,
cada uma `{ quantidade, receita }`), `TrackSales`, `SalesByOrigin`, `RevenueByTrack`,
`LikesVsSalesPoint`. `DashboardPeriod` = `'7d' | '30d' | '12m'`, com `DASHBOARD_PERIODS` para o
`mat-button-toggle-group`. Funções puras já implementadas e testáveis: `formatBRL`, `formatCompact`,
`calcTicketMedio`, `calcVariacaoPercent`; e a paleta `CHART_COLORS` (`primary #FFC107`,
`secondary #212121`, `accent #757575`, `light #FFF8E1`, `danger #E53935`) pré-definida para os futuros
gráficos. `calcVariacaoPercent`, `CHART_COLORS`, `RevenueByTrack` e `LikesVsSalesPoint` **não são usados**
em nenhum lugar do componente hoje — são infraestrutura pré-posicionada para a Fase 2 (gráficos), não
código morto acidental.

### Rota e guards

`app-routing.module.ts:60`:
```ts
{ path: 'dashboard-produtor', component: DashboardProdutorComponent, canActivate: [AuthGuard, ProdutorGuard] }
```
O router usa `useHash: true` (linha 64), então a URL real em runtime é `/#/dashboard-produtor`.
`AuthGuard.canActivate()` chama `authService.userAutetic()`; se falso, abre o modal de login
(`verificaLogin()`) e bloqueia a navegação. `ProdutorGuard.canActivate()` chama `auth.isProdutor()`
(que lê o perfil persistido em `localStorage` via `getUserPerfil()`); se falso, redireciona para
`/home`. Proteção é dupla e consistente entre front (guards) e backend (`dashboardMiddleware` no
próprio endpoint) — nenhum dos dois foi alterado. `sub-menu.component.html:7-9` só renderiza o item
"Dashboard" quando `isProdutor` é verdadeiro, coerente com o guard.

### Estados de loading, erro e vazio

`DashboardProdutorComponent.loadData()` (`dashboard-produtor.component.ts:89-111`) dispara
`combineLatest` sobre `getSummary()`, `getSalesByTrack()` e `getSalesByOrigin()` (os 3 únicos
endpoints consumidos), cada um com `catchError` próprio:
- `getSummary()` → `catchError(() => of(null))`
- `getSalesByTrack()` e `getSalesByOrigin()` → `catchError(() => of([]))`

Estados no template (`dashboard-produtor.component.html`):
- **Loading** (linhas 50-54): spinner Bootstrap enquanto `loading === true`.
- **Erro** (linhas 44-47): alerta `alert-warning` quando `loadError === true`, que só é setado se
  `summary` vier `null` (linha 104) ou se o próprio `subscribe.error` disparar (linha 106-109; não
  ocorre na prática porque cada stream já tem `catchError` individual).
- **Vazio** (linhas 220-223): ícone `music_off` + mensagem quando `salesByTrackFiltered.length === 0`.

**Lacuna real identificada:** se `sales-by-track` ou `sales-by-origin` falhar isoladamente (summary OK),
o erro é engolido por `catchError(() => of([]))` e a UI mostra o estado "vazio" ("Nenhuma faixa
encontrada para o filtro selecionado") — indistinguível de um produtor que genuinamente não tem vendas
no período. `loadError` não cobre esse caso.

### Dados reais disponíveis vs. lacunas de backend

Disponível hoje (mock, mas com contrato estável):
- KPIs de resumo (`vendasTotais`, `valorTotalVendas`, `totalCurtidas`, `ticketMedio`, breakdown por licença).
- Lista de faixas com compras/receita/origem principal/likes/destaque.
- Lista de origem geográfica (país/cidade/lat/lng) — sem lib de mapa instalada no `package.json`.
- Receita por faixa com `share` percentual (endpoint pronto, não consumido).
- Série temporal curtidas × compras por período (endpoint pronto, não consumido, único que filtra).

Lacunas de backend (fora do escopo desta etapa, apenas documentadas):
- Nenhuma persistência real de vendas/licenças — é decisão pendente de arquitetura/dados (PROJECT_RULES §13).
- Filtro de período não é aplicado em 4 dos 5 endpoints.
- Dados não são segmentados por produtor autenticado (mock global).
- Sem endpoint de saldo/saque (a UI já reserva o card "Saldo disponível" como bloqueado na Fase 1).
- Sem endpoint de exportação de relatório (botão já desabilitado no template, "Disponível em breve").

### Achados de higiene (documentados, não corrigidos nesta etapa — R21 é read-only)

1. `dashboard-produtor.component.html:69-70` e `:93` — "+12% vs mês anterior" e badge "+8%" hardcoded
   no template, sem origem em `DashboardSummary`. É um valor mockado permanentemente no HTML, distinto
   do mock do backend (que ao menos está isolado e comentado).
2. `sub-menu.component.ts:13` — `nome: string = 'Wilian Gulini'` fixo no componente, não obtido de
   `UserProfileService`/`AuthService`. Afeta a saudação "Olá, {{ nome }}" no sub-menu (não confundir
   com `nomeProdutor` do dashboard, que corretamente vem de `profileService.getProfile()`).
3. `dashboard.service.ts:24-27` — monta `Authorization` manualmente, duplicando o `AuthInterceptor`
   global. Não é bug funcional, mas é acoplamento redundante a remover em refactor futuro.
4. `dashboard-produtor.component.html:252-259` — botões "Ver detalhes" e "Promover" na tabela de
   faixas não têm `(click)` nem `routerLink`; são inertes.
5. Não existe `dashboard-produtor.component.spec.ts` nem spec para `DashboardService` — módulo sem
   cobertura de teste automatizado.

Nenhum desses 5 pontos foi alterado nesta etapa, conforme decisão do usuário de manter a R21
estritamente como auditoria; ficam registrados como pendências para R22/R23.

### Referência visual — branch `codex/create-musical-producer-dashboard-design`

Lida em modo somente leitura via `git ls-tree`/`git show`, sem checkout, merge ou cherry-pick. O
componente de referência chama-se `produtor-dashboard` (nome diferente de `dashboard-produtor` na
`dev`) e depende de `apexcharts`/`ng-apexcharts`, rodando sobre uma base de `package.json` presa em
Angular 14.x + `@ng-bootstrap/ng-bootstrap` 13 + Bootstrap 4 + `zone.js` 0.11 — divergente da `dev`
(Angular 22.1.0 + Bootstrap 5.3 + `zone.js` 0.15). O HTML de referência usa `apx-chart` para heatmap de
origem, barras de vendas por faixa, pizza de receita e linha de curtidas × compras, com cards de KPI e
filtros de período próprios (`filter-chip`) — layout mais rico que o atual, mas não transportável
diretamente: nenhuma classe Bootstrap 4/estrutura specífica da codex é compatível sem reescrita, e a
lib de gráficos da referência não está instalada nem aprovada na `dev`. R22 deve ser tratada como
**reescrita visual guiada por referência**, não como port de código.

## Comandos executados

- [x] `git branch` / `git status` (antes e depois da leitura)
- [x] `npm run build`
- [x] `npm test`

## Resultado dos comandos

**`git status`** — antes e depois da auditoria: working tree limpo, branch `dev`, nenhuma alteração de
código (apenas este relatório foi escrito).

**`npm run build`** — falhou inicialmente sob Node ativo `v22.18.0` (`nvm` local), com o erro:
```
The Angular CLI requires a minimum Node.js version of v22.22.3 or v24.15.0 or v26.0.0.
```
Reexecutado com `nvm use 24.18.1` (versão travada em `.nvmrc`, já instalada localmente). Resultado:
**sucesso**, build de produção completo em ~6,7s, bundle inicial 2.49 MB raw / 423.11 kB transferência
estimada, chunk lazy `upload-file-module`. Único aviso: depreciação de `@import` do Sass em
`src/styles.scss:79` (Dart Sass 3.0 removerá `@import`) — não relacionado ao escopo desta etapa.

**`npm test`** (`ng test`, runner Vitest) — executado com Node 24.18.1: **54 arquivos de teste, 115
testes, todos aprovados**, ~5s de execução (mais setup/import/environment). Sem falhas, sem testes
pulados. Nota: `npm test -- --watch=false --browsers=ChromeHeadless` (variante usada em `test:focus`)
falhou por dependência ausente (`@vitest/browser-playwright`/`webdriverio`/`preview`); o comando
correto e já documentado no `package.json` é `npm test` puro, que usa o ambiente jsdom padrão do
Vitest e funcionou sem instalação adicional.

## Como validar manualmente

1. `nvm use 24.18.1 && npm start` (proxy para backend em `127.0.0.1:3100`; subir o backend
   separadamente se necessário).
2. Logar com um usuário `tipoPerfil: 'produtor'` → acessar `/#/dashboard-produtor` diretamente ou pelo
   item "Dashboard" do sub-menu → confirmar que os 4 KPI cards, o resumo financeiro e a tabela de
   faixas carregam com os valores do `DASHBOARD_MOCK`.
3. Logar com um usuário `tipoPerfil: 'comprador'` → confirmar que o item "Dashboard" não aparece no
   sub-menu e que navegar manualmente para `/#/dashboard-produtor` redireciona para `/home`.
4. Deslogar (limpar `authToken`) → acessar `/#/dashboard-produtor` → confirmar que o `AuthGuard` abre
   o modal de login em vez de renderizar o componente.
5. Nas DevTools → aba Network, com produtor logado: confirmar 3 requisições `GET /api/dashboard/summary`,
   `GET /api/dashboard/sales-by-track?period=30d`, `GET /api/dashboard/sales-by-origin?period=30d`, cada
   uma com header `Authorization: Bearer <token>`.
6. Trocar o filtro de período (7d/30d/12m) → confirmar visualmente que os dados **não mudam** (esperado,
   dado o mock atual não filtrar por período nesses 3 endpoints) — comportamento a esclarecer/planejar
   antes de dar polish visual ao seletor em R22/R23.
7. Simular falha de rede em `sales-by-track` (bloquear a URL via DevTools) mantendo `summary` OK →
   observar que a tabela mostra "Nenhuma faixa encontrada" em vez de um estado de erro — reproduz a
   lacuna descrita acima.

## Riscos ou pendências

- **Decisão pendente (usuário/PROJECT_RULES §13):** biblioteca de gráficos para os 4 placeholders da
  Fase 2. A referência da codex usa `ng-apexcharts` em versão presa a Angular 14, incompatível direta
  com Angular 22 da `dev`; qualquer adoção de lib nova exige validação de compatibilidade e aprovação
  explícita antes de R23.
- **Decisão pendente (backend/produto):** persistência real de vendas/licenças por produtor, filtro de
  período efetivo nos 4 endpoints que hoje o ignoram, segmentação de dados por usuário autenticado,
  saldo/saque e exportação de relatório — todos fora do escopo de front-end desta etapa.
- **Risco de UX:** erro parcial de `sales-by-track`/`sales-by-origin` fica mascarado como estado vazio;
  recomenda-se tratar esse caso em R23 ao mexer nos estados, sem alterar o contrato do service agora.
- **Achados de higiene** (percentuais hardcoded, nome fixo no sub-menu, header duplicado, botões
  inertes, ausência de spec) documentados acima e não corrigidos nesta etapa, por decisão explícita do
  usuário de manter R21 estritamente read-only; recomenda-se endereçá-los em R22/R23 quando o HTML for
  reescrito de qualquer forma.
- Build local exige `nvm use 24.18.1` explicitamente — o Node ativo por padrão no ambiente
  (`v22.18.0`) está abaixo do mínimo exigido pelo Angular CLI atual; isso já era conhecido de sessões
  anteriores ([[vps-producao-gulini-topologia]]) e não é uma regressão desta etapa.

## Confirmação de escopo

Alterado apenas o arquivo deste relatório
(`docs/ia-auditorias/R21-dashboard-produtor-auditoria-dev-contrato-dados.md`), dentro do escopo
autorizado pelo contrato de escrita da etapa. Nenhum arquivo em `src/app/dashboard-produtor/`,
`src/app/sub-menu/`, `src/app/app-routing.module.ts`, guards, interceptors, `app.module.ts` ou
`server/src/index.js` foi modificado — confirmado por `git status` limpo antes e depois da auditoria,
e por `git diff` vazio para `src/` e `server/`. Não houve necessidade de sair do escopo.

---

## Revisão do Claude Code

[cole aqui o relatório do Claude Code]

---

## Complemento pós-revisão

[cole aqui o complemento, se houver]

---

## Status final da etapa

Aprovado

## Pendências para etapas futuras

- Validar e aprovar a biblioteca de gráficos para R23 (compatibilidade com Angular 22.1.0), conforme
  decisão pendente registrada em PROJECT_RULES §13.
- Planejar, junto ao backend, persistência real de vendas/licenças, filtro de período efetivo nos 4
  endpoints que hoje o ignoram, e segmentação de dados por produtor autenticado.
- Corrigir em R22/R23: percentuais "+12%"/"+8%" hardcoded no template, nome fixo em `sub-menu`, header
  `Authorization` duplicado em `DashboardService`, botões "Ver detalhes"/"Promover" sem ação, e criar
  specs para `DashboardProdutorComponent`/`DashboardService`.
- Tratar o estado de erro parcial de `sales-by-track`/`sales-by-origin`, hoje indistinguível de dado vazio.
- R22: tratar a branch `codex/create-musical-producer-dashboard-design` como referência visual apenas —
  reescrever o layout sobre Angular 22/Bootstrap 5, sem portar código Angular 14/Bootstrap 4.
