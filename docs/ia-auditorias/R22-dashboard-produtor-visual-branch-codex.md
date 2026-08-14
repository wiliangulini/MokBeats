# R22 — Dashboard produtor: visual da branch Codex

## Relatório do Claude Code

## Resumo da etapa

Etapa 13B — reescrita visual do `DashboardProdutorComponent` existente em `src/app/dashboard-produtor`,
guiada (não copiada) pela referência da branch `codex/create-musical-producer-dashboard-design`.
Nenhum merge, cherry-pick ou checkout dessa branch foi feito — ela foi lida apenas via `git show`
somente leitura. A R21 (13A) já havia concluído que a branch codex não é portável (Angular 14 +
Bootstrap 4, remove guards/service, usa `ng-apexcharts`), então esta etapa reimplementou as ideias de
layout (ícone por KPI, cards com hierarquia, subtítulo por bloco, badge na tabela) sobre a base real da
`dev` (Angular 22, Bootstrap 5, `DashboardService`, models e guards intactos).

A exploração revelou um defeito visual real e não documentado nas etapas anteriores:
`src/styles.scss:11` define `body { background-color: #101010 !important }` e o
`dashboard-produtor.component.scss` não definia fundo próprio — o cabeçalho da tela (texto
`text-muted`/`text-dark`/`h1` sem cor) renderizava sobre um fundo quase preto, fora dos cards
brancos do Bootstrap. As 4 páginas irmãs da área do produtor (`pedidos`, `assinatura`,
`atualizar-informacoes`, `formas-de-pagamento`) já resolviam isso com `background-color: #f3f3f4`;
o dashboard era a única que não o fazia. Corrigido nesta etapa.

Por decisão explícita do usuário, a paleta adotada foi **claro `#f3f3f4` + acento roxo `#4B3A8F`**
(cor primária real do projeto — 73 ocorrências em `src/app`, contra 1 do `#FFC107` que estava na borda
dos KPI cards), preservando o amarelo `btn-warning` apenas no CTA de saque. Também por decisão do
usuário, os 4 achados de higiene registrados na R21 foram corrigidos nesta etapa: percentuais
hardcoded removidos, botões inertes da tabela desabilitados com tooltip, erro parcial da tabela
distinguido do estado vazio, e spec do componente criada (não existia antes).

## Arquivos lidos

- `src/app/dashboard-produtor/dashboard-produtor.component.html`, `.ts`, `.scss`
- `src/app/dashboard-produtor/dashboard.service.ts`, `dashboard.models.ts`
- `src/app/sub-menu/sub-menu.component.html`, `.scss`
- `src/app/app.component.html`, `.scss`
- `src/styles.scss`, `src/index.html`
- `src/app/app.module.ts` (imports `MatButtonToggleModule`, `MatIconModule`, `NgbModule`,
  `NgbTooltipModule`), `src/app/app-routing.module.ts` (rota e guards)
- `src/app/pedidos/pedidos.component.scss`, `src/app/assinatura/assinatura.component.scss`,
  `src/app/atualizar-informacoes/atualizar-informacoes.component.scss`,
  `src/app/formas-de-pagamento/formas-de-pagamento.component.scss` (padrão de fundo/cor primária das
  páginas irmãs da área do produtor)
- `src/app/menu/menu.component.scss` (confirmação de `$primary-color: #4b3a8f`)
- `src/app/models/user-profile.model.ts`, `src/app/service/user-profile.service.ts` (assinatura de
  `getProfile()`)
- `src/app/player/player.component.behavior.spec.ts`, `src/app/artist/artist.component.spec.ts`,
  `src/app/favoritos/favoritos.component.spec.ts` (padrões de spec/stub do repositório)
- `docs/ia-auditorias/R21-dashboard-produtor-auditoria-dev-contrato-dados.md`,
  `docs/ia-auditorias/R03-comparacao-dev-vs-dashboard-codex.md` (relatórios anteriores do roadmap)
- `docs/areas/identidade-visual-ux.md`, `docs/areas/producer-dashboard.md`
- Branch `codex/create-musical-producer-dashboard-design` — **somente leitura**, via `git ls-tree` e
  `git show`, para `produtor-dashboard.component.html`/`.scss` e os 4 SVGs em `src/assets/icons/`
  (referência de layout; não copiada, não mesclada)

## Arquivos alterados

- `src/app/dashboard-produtor/dashboard-produtor.component.scss` — reescrito
- `src/app/dashboard-produtor/dashboard-produtor.component.html` — reorganizado
- `src/app/dashboard-produtor/dashboard-produtor.component.ts` — ajustes localizados
- `src/app/dashboard-produtor/dashboard-produtor.component.spec.ts` — **novo**
- `docs/ia-auditorias/R22-dashboard-produtor-visual-branch-codex.md` — este relatório, substituindo o
  stub placeholder

Nenhum outro arquivo (`dashboard.service.ts`, `dashboard.models.ts`, `app-routing.module.ts`,
`app.module.ts`, guards, interceptors, `sub-menu/`, `src/styles.scss`, `server/`) foi tocado —
confirmado por `git status`/`git diff --stat` ao final da etapa.

## O que foi implementado ou auditado

### SCSS

Tokens locais no topo do arquivo (`$mok-primary: #4b3a8f`, `$mok-page-bg: #f3f3f4`, etc.).
`.dashboard-produtor` ganhou `background-color: $mok-page-bg`, corrigindo o contraste do cabeçalho.
Nova classe `.dash-card` (superfície branca, borda `#e6e6ea`, raio 14px, sombra sutil) aplicada junto
de `.card`/`.kpi-card`/tabela/placeholders. `.kpi-card` trocou a borda amarela por
`border-top: 3px solid $mok-primary` e ganhou `.kpi-icon` (badge circular roxo). `.licenca-tile` para
o breakdown de licenças. `.chart-placeholder` substitui os `style` inline dos 4 placeholders de
gráfico. Hover da tabela trocado de `#FFF8E1` para `rgba(75, 58, 143, .06)`. `.gap-2/.gap-3/.gap-4`
locais removidos (redundavam com os utilitários do Bootstrap 5 e ainda sobrescreviam valores).
Bloco `@media (max-width: 767.98px)` para cabeçalho, toggle de período e ações da tabela em coluna.

### HTML

Ordem dos blocos preservada (cabeçalho → erro → loading → KPIs → resumo financeiro → placeholders →
tabela). Mudanças:
- Ícone `equalizer` em círculo roxo no cabeçalho (releitura do `logo-circle` da codex).
- KPI cards passaram de 4 blocos quase idênticos para `*ngFor="let kpi of kpiCards"`, cada um com
  ícone Material (`shopping_bag`, `payments`, `favorite`, `confirmation_number`).
- **Removidos** os textos "+12% vs mês anterior" e o badge "+8%" — eram valores hardcoded no template
  sem origem em `DashboardSummary` (mock permanente no HTML, distinto do mock já isolado do backend).
  O backend não expõe período anterior, então os cards ficam sem selo de variação em vez de exibir um
  dado fictício.
- Breakdown de licenças com `.licenca-tile`.
- Placeholders de gráfico com `.chart-placeholder` + chip "Fase 2", no lugar do `style` inline.
- Tabela: primeira coluna agora tem `.track-badge` (inicial da faixa) + nome. Botões "Ver detalhes" e
  "Promover" passaram a `disabled` + `ngbTooltip="Disponível em breve"` (não havia rota de detalhe nem
  endpoint de promoção para dar ação real — ficam coerentes com os demais botões inertes da tela, em
  vez de continuar sem `(click)` nem `routerLink`).
- Novo bloco `*ngIf="tracksError"` (alerta) antes do estado vazio, para distinguir falha de
  `sales-by-track` de "produtor sem vendas no período" — lacuna documentada na R21.

### TypeScript

- `interface KpiCard { icon; label; value; helper }` local ao componente (não movida para
  `dashboard.models.ts`, para não ampliar a superfície de mudança do contrato).
- `kpiCards: KpiCard[]`, recomputado dentro de `loadData()` via `buildKpiCards(summary)` — não é
  getter porque o componente usa `ChangeDetectionStrategy.Eager` (linha 30 original).
- `tracksError: boolean`, resetado no início de `loadData()` e ligado no `catchError` de
  `getSalesByTrack` (que antes engolia silenciosamente o erro em `of([])`).
- `trackByTrackId()` para o `*ngFor` da tabela e `initialOf(nome)` para o badge.
- `DashboardService`, `dashboard.models.ts`, contrato dos 3 endpoints consumidos, `AuthGuard`,
  `ProdutorGuard`, `getSalesByOrigin` (ainda carregado mas não renderizado, reservado para R23) e
  `formatBRL`/`formatCompact`/`totalLicencas`/`salesByTrackFiltered` permaneceram intactos.

### Spec (novo)

`dashboard-produtor.component.spec.ts` instancia o componente diretamente (sem `TestBed`, seguindo o
padrão de stub por classe já usado em `player.component.behavior.spec.ts`), com `StubDashboardService`
e `StubUserProfileService` via `vi.fn()`. 6 testes: criação; KPIs carregados a partir do summary
mockado; `loadError` ligado quando `getSummary` falha; `tracksError` ligado (e `loadError` continua
`false`) quando só `getSalesByTrack` falha — reproduzindo e cobrindo a lacuna da R21; filtro de
destaque; `initialOf`.

## Comandos executados

- [x] `git branch`
- [x] `git status`
- [x] `npm run build`
- [x] `npm test`

## Resultado dos comandos

**`git branch`** — branch atual `dev` (confirmado antes e depois da implementação).

**`git status`** — ao final: 3 arquivos modificados (`dashboard-produtor.component.html/.ts/.scss`) e
1 arquivo novo (`dashboard-produtor.component.spec.ts`), todos em
`src/app/dashboard-produtor/`. Nenhum outro caminho alterado.

**`npm run build`** (`nvm use 24.18.1`, necessário porque o Node padrão do ambiente `v22.18.0` está
abaixo do mínimo exigido pelo Angular CLI) — **sucesso**, build de produção em ~7,3s, bundle inicial
2.49 MB raw / 423.71 kB transferência estimada, chunk lazy `upload-file-module` inalterado. Único
aviso: depreciação de `@import` do Sass em `src/styles.scss:79` (pré-existente, não relacionado a esta
etapa, já registrado na R21).

**`npm test`** (`ng test`, runner Vitest, Node 24.18.1) — **55 arquivos de teste, 121 testes, todos
aprovados** (baseline da R21 era 54 arquivos/115 testes; o novo spec soma 1 arquivo/6 testes).
Confirmado isoladamente: `dashboard-produtor.component.spec.ts (6 tests)` ✓. Sem falhas, sem testes
pulados.

## Como validar manualmente

1. `nvm use 24.18.1 && npm start` (proxy para backend em `127.0.0.1:3100`; subir o backend
   separadamente).
2. Logar como `produtor` → `/#/dashboard-produtor`: fundo `#f3f3f4` (era `#101010`, cabeçalho ilegível
   antes desta etapa), 4 KPI cards com ícone roxo e sem selo de variação falso, resumo financeiro com
   `.licenca-tile`, 4 placeholders de gráfico com chip "Fase 2", tabela com badge de inicial por faixa.
3. Redimensionar a janela para <768px: cabeçalho empilha, toggle de período ocupa a largura total,
   ações da tabela empilham.
4. Logar como `comprador` → confirmar que o item "Dashboard" não aparece no sub-menu e que navegar
   manualmente para `/#/dashboard-produtor` redireciona para `/home` (`ProdutorGuard` intacto).
5. Deslogar → acessar `/#/dashboard-produtor` → `AuthGuard` abre o modal de login.
6. DevTools → bloquear `GET /api/dashboard/sales-by-track` mantendo `summary` OK → a tabela deve
   mostrar o alerta de erro (não mais "Nenhuma faixa encontrada").
7. Alternar o filtro "Em destaque" na tabela → lista continua filtrando corretamente.
8. Passar o mouse sobre "Ver detalhes"/"Promover"/"Exportar CSV" na tabela e "Exportar relatório" no
   cabeçalho → tooltip "Disponível em breve", botões desabilitados (nenhum é inerte silenciosamente).

## Riscos ou pendências

- O filtro de período (7d/30d/12m) continua sem efeito visível nos dados — 4 dos 5 endpoints do mock
  do backend ignoram `period` (lacuna de backend já documentada na R21, fora do escopo de front-end
  desta etapa).
- `CHART_COLORS.primary` em `dashboard.models.ts:62` permanece `#FFC107`, divergente do roxo adotado
  nesta etapa. Não é consumido por nenhum componente hoje; recomenda-se alinhar em R23, junto com a
  decisão da biblioteca de gráficos.
- Gráficos reais (biblioteca a validar), consumo de `salesByOrigin` e persistência real de
  vendas/licenças por produtor seguem como decisões pendentes de aprovação (PROJECT_RULES §13),
  tratadas em R23.
- `sub-menu.component.ts:13` (`nome = 'Wilian Gulini'` hardcoded) permanece fora do escopo — é outro
  componente, já registrado como pendência própria pela R20/R21.
- Spec novo cobre o componente por instanciação direta (sem `TestBed`/renderização de template); não
  substitui um teste de integração com Angular Material/ngb — decisão deliberada para manter o teste
  determinístico e rápido, seguindo o padrão já usado em `player.component.behavior.spec.ts`.

## Confirmação de escopo

Alterados apenas os 4 arquivos de `src/app/dashboard-produtor/` (3 modificados + 1 spec novo) e este
relatório. Nenhum arquivo em `dashboard.service.ts`, `dashboard.models.ts`, `app-routing.module.ts`,
`app.module.ts`, guards, interceptors, `sub-menu/`, `src/styles.scss` ou `server/` foi tocado —
confirmado por `git status`/`git diff --stat` ao final da etapa. Nenhum merge, cherry-pick ou checkout
da branch `codex/create-musical-producer-dashboard-design` foi executado; toda referência a ela foi
via `git show` somente leitura. Não houve necessidade de sair do escopo autorizado.

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

- R23: gráficos reais (biblioteca a validar e aprovar), consumo de `salesByOrigin`, alinhamento de
  `CHART_COLORS` com a paleta roxa adotada.
- Filtro de período efetivo nos 4 endpoints do backend que hoje o ignoram (fora do front-end).
- Persistência real de vendas/licenças por produtor e segmentação por usuário autenticado (backend).
- Corrigir `nome = 'Wilian Gulini'` hardcoded em `sub-menu.component.ts` (pendência de outro componente,
  já registrada na R20/R21).
