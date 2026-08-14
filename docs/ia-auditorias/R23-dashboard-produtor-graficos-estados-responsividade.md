# R23 — Dashboard produtor: gráficos, estados e responsividade

## Relatório do Claude Code

## Resumo da etapa

Etapa 13C — implementação dos 4 gráficos que estavam como placeholders tracejados "Fase 2" no
`DashboardProdutorComponent`, com estados loading/erro/vazio por bloco (em vez de um `loading` global
que escondia a tela inteira) e responsividade real da tabela de faixas em telas pequenas.

Os dados vêm dos 2 endpoints do `DashboardService` que existiam desde a R21 mas nunca eram consumidos
(`getRevenueByTrack`, `getLikesVsSales`) — nenhum mock novo foi introduzido no front, o contrato do
service não mudou. Os gráficos foram implementados em SVG/CSS puro, sem dependência nova: a skill
`dataviz` foi carregada antes da implementação (conforme decisão do usuário) e sua regra de "eixo
único" descartou o desenho original de eixo duplo para "Curtidas × Compras" (curtidas na casa dos
milhares vs. compras na casa das centenas) — as duas séries agora são indexadas ao próprio valor
inicial do período (100% = início) e plotadas num único eixo, evitando o anti-pattern de correlação
visual inventada por dois eixos Y. Pela mesma skill, "Receita por música" deixou de ser um donut (a
distribuição real — 5 faixas entre 1,8% e 3,7% da receita, mais "Outras faixas" em 86,2% — é
exatamente o caso que a skill sinaliza como ruim para pizza/donut: fatias próximas e pequenas, difíceis
de comparar visualmente) e virou uma lista de barras como as outras duas, reaproveitando o mesmo
sub-componente.

## Arquivos lidos

- `src/app/dashboard-produtor/dashboard-produtor.component.ts`, `.html`, `.scss`, `.spec.ts`
- `src/app/dashboard-produtor/dashboard.service.ts`, `dashboard.models.ts`
- `src/app/shared/pagination/pagination.component.ts` (padrão de componente com template/styles
  inline, `standalone: false`, usado como referência para os novos sub-componentes de gráfico)
- `src/app/app.module.ts` (bloco de `declarations`/`imports`)
- `package.json`, `angular.json` (confirmação de que `inlineStyleLanguage` não está configurado —
  `styles: []` inline é CSS puro, não SCSS)
- `server/src/index.js` (bloco `Dashboard do Produtor`, linhas 910–1010 — contrato/mock dos 5 endpoints)
- `docs/ia-auditorias/R21-dashboard-produtor-auditoria-dev-contrato-dados.md`,
  `docs/ia-auditorias/R22-dashboard-produtor-visual-branch-codex.md` (relatórios anteriores do roadmap)
- `docs/areas/producer-dashboard.md`, `docs/areas/identidade-visual-ux.md`
- `.claude/rules/producer-dashboard.md`, `.claude/rules/api-contracts.md`, `.claude/rules/angular.md`
- Skill `dataviz` completa (`choosing-a-form.md`, `color-formula.md`, `marks-and-anatomy.md`,
  `anti-patterns.md`, `palette.md`) e o script `validate_palette.js`, executado para validar o par de
  cores roxo `#4B3A8F` (identidade já adotada na R22) + laranja `#EB6834` (2ª série do gráfico de
  linha)

## Arquivos alterados

- `src/app/dashboard-produtor/dashboard.charts.ts` — **novo**: funções puras de transformação
  (`toBarItems`, `toIndexedLineSeries`, `baselineY`)
- `src/app/dashboard-produtor/dashboard.charts.spec.ts` — **novo**: 12 testes das funções puras
- `src/app/dashboard-produtor/charts/bar-list-chart.component.ts` — **novo**: `<app-bar-list-chart>`
- `src/app/dashboard-produtor/charts/line-chart.component.ts` — **novo**: `<app-line-chart>`
- `src/app/dashboard-produtor/dashboard-produtor.component.ts` — 5 streams em `combineLatest` (antes
  3), estado por bloco (`BlockState`), construção dos dados dos 4 gráficos, `blockDisplayState()` para
  evitar flash de skeleton ao trocar de período
- `src/app/dashboard-produtor/dashboard-produtor.component.html` — gráficos reais substituindo os 4
  placeholders, skeletons por bloco, `scope="col"` + `data-label` na tabela
- `src/app/dashboard-produtor/dashboard-produtor.component.scss` — skeletons, `.dash-refreshing`,
  tabela de faixas vira cards empilhados em `≤767.98px`, remoção de `.chart-placeholder`
- `src/app/dashboard-produtor/dashboard-produtor.component.spec.ts` — stub do `DashboardService`
  ampliado para os 5 métodos; 10 testes (era 6), incluindo os 3 novos blocos e o anti-flash de skeleton
- `src/app/dashboard-produtor/dashboard.models.ts` — `CHART_COLORS` realinhado ao roxo `#4B3A8F`
  (antes `#FFC107`, não usado em nenhum lugar até esta etapa — ver R21)
- `src/app/app.module.ts` — `declarations` dos 2 novos sub-componentes de gráfico (única alteração
  fora de `src/app/dashboard-produtor/`, inevitável na arquitetura NgModule)
- `docs/ia-auditorias/R23-dashboard-produtor-graficos-estados-responsividade.md` — este relatório

Intocados: `dashboard.service.ts`, `app-routing.module.ts`, guards, interceptors, `sub-menu/`,
`src/styles.scss`, `server/`, `package.json` — confirmado por `git diff --stat` desses caminhos
(saída vazia).

## O que foi implementado ou auditado

### Decisões de gráfico (skill `dataviz`)

1. **Sem biblioteca nova.** `ng-apexcharts@3.0.0` até aceitaria Angular 22 (peer `@angular/core
   >=20.0.0`), mas traria `apexcharts@6` (~500 KB) para 4 gráficos com datasets de 5–7 pontos, num
   bundle que já soma 2,49 MB. `package.json` não foi tocado.
2. **"Origem das compras", "Vendas por faixa" e "Receita por música"** são listas de barras
   horizontais de série única — pela regra da skill ("nominal categórica de série única usa UM só
   tom, nunca rampa por valor"), todas as barras usam o mesmo roxo `#4B3A8F`, sem legenda (a
   identidade já está no rótulo de cada linha).
3. **"Curtidas × Compras"** é a única com 2 séries reais. Descartado o desenho original de eixo duplo
   (anti-pattern documentado: "a alinhamento de duas escalas é arbitrário, inventa correlação que não
   existe no dado"); implementado como índice-100 num único eixo. Paleta validada via
   `validate_palette.js "#4b3a8f,#eb6834" --mode light --surface "#ffffff"`: CVD ΔE 29,0 (protan) /
   normal-vision ΔE 36,4 — muito acima dos pisos de 8 e 15 — e contraste ≥ 3:1. **Único ponto fora do
   ideal:** a lightness do roxo (`L=0.415`) fica levemente abaixo da banda recomendada para cor
   categórica (`0,43–0,77`); como é a cor primária real do produto (73 ocorrências em `src/app`,
   adotada explicitamente na R22), mantida como está — troca de marca não é decisão desta etapa.
4. **Acessibilidade dos gráficos.** Listas de barras já expõem rótulo + valor como texto real no DOM
   (sem depender de hover). O gráfico de linha é decorativo (`aria-hidden="true"` no `<svg>`); os
   valores reais ficam acessíveis via legenda (com o último valor de cada série) **e** uma tabela
   compacta abaixo do gráfico (data × curtidas × compras) — a "table view" que a skill exige para todo
   gráfico contínuo.

### Redução de escopo deliberada (documentada, não escondida)

O plano original prevê um componente de gráfico por tipo, incluindo um donut/`<app-donut-chart>`.
Durante a implementação, a skill `dataviz` (carregada como passo 0 do plano) sinalizou que "Receita por
música" é exatamente o caso que o anti-pattern "donut/pie para comparar valores próximos" cobre — a
distribuição real (5 faixas entre 1,8–3,7% + "Outras faixas" 86,2%) teria 5 fatias quase
indistinguíveis. Optou-se por reutilizar `<app-bar-list-chart>` (com `caption` mostrando o `share`),
reduzindo para 2 sub-componentes em vez de 3 — menos código, sem SVG de arco/`stroke-dasharray`, mesma
cobertura funcional do card. Registrado aqui por transparência com o plano aprovado.

Também por redução de escopo deliberada: o gráfico de linha não implementa um crosshair/tooltip
customizado com JS de posicionamento de mouse — usa `<title>` nativo do SVG como bônus de hover e a
tabela de dados como via de acesso primária aos valores. Full crosshair interativo ficaria fora do
"menor incremento seguro" para esta etapa; a skill exige que todo valor seja alcançável sem mouse, o
que a tabela já garante.

### Estados por bloco

`BlockState = 'loading' | 'error' | 'empty' | 'ready'`, um getter por bloco (`summaryState`,
`tracksState`, `tracksChartState`, `originState`, `revenueState`, `trendState`), cada um combinando
`loading` global + flag de erro própria (`summaryError`, `tracksError`, `originError`, `revenueError`,
`trendError`) + verificação de lista vazia. `loadData()` agora dispara 5 streams em `combineLatest`
(era 3), cada um com `catchError` isolado — a falha de um endpoint não derruba os demais nem esconde
seus dados atrás de um estado genérico. Isso corrige diretamente o achado da R21 ("erro parcial ficava
indistinguível de vazio"), agora coberto por spec (`revenueError`/`trendError` isolados testados).

**`blockDisplayState()`** — anti-pattern "skeleton flash on refetch": ao trocar de período com dados já
carregados (`hasLoadedOnce = true`), o bloco não volta a mostrar skeleton; os dados do período anterior
continuam visíveis, esmaecidos via `.dash-refreshing` no CSS, até a resposta nova chegar. No 1º
carregamento (sem dado prévio), o skeleton aparece normalmente.

### Tabela de faixas — responsividade

`<th scope="col">` nos cabeçalhos; `data-label` em cada `<td>`. Em `@media (max-width: 767.98px)`: o
`<thead>` fica visualmente oculto (técnica padrão, sem sumir da árvore de acessibilidade), cada `<tr>`
vira um card com borda/raio, cada `<td>` mostra `label ··· valor` via `::before { content:
attr(data-label) }`. A 1ª célula (nome da faixa) funciona como cabeçalho do card e não repete o rótulo.
Os 3 botões de ação (inertes desde a R21/R22, mantidos assim) ficam alinhados à direita.

### Filtro de período

Preservado: `onPeriodChange()` continua chamando as 5 requisições com o novo `period`. Como já
documentado na R21, o backend-mock só aplica o filtro em `likes-vs-sales` — os outros 4 endpoints
ignoram `period`. Efeito visível na R23: trocar 7d/30d/12m agora **muda de fato** o gráfico "Curtidas ×
Compras" (única mudança perceptível, esperada); os demais blocos continuam mostrando os mesmos valores
entre períodos — limitação de backend fora do escopo desta etapa (já registrada como pendência na R21).

## Comandos executados

- [x] `git status`
- [x] `npm run build`
- [x] `npm test`

## Resultado dos comandos

**`git status`** — antes: limpo, branch `dev`. Depois: 6 arquivos modificados + 3 novos (listados
acima), todos dentro de `src/app/dashboard-produtor/` e `src/app/app.module.ts`; `docs/ia-auditorias/`
para este relatório.

**`npm run build`** (`nvm use 24.18.1`, exigido — Node padrão do ambiente `v22.18.0` fica abaixo do
mínimo do Angular CLI, já conhecido desde a R21) — **sucesso**, ~8,9 s. Bundle inicial: **2,51 MB raw /
427,02 kB transferência estimada** (era 2,49 MB / 423,11 kB na R21 — variação de ~20 KB raw pelos 2
componentes novos, nenhuma dependência adicionada). Único aviso: depreciação de `@import` do Sass em
`src/styles.scss:79` — pré-existente, fora do escopo desta etapa.

**`npm test`** (`ng test`, Vitest, jsdom) — **56 arquivos de teste, 137 testes, todos aprovados**
(~5,8 s). Eram 54 arquivos/115 testes na R21: `+1` arquivo (`dashboard.charts.spec.ts`, 12 testes) e o
spec do componente cresceu de 6 para 10 testes (4 novos, cobrindo os 3 blocos de gráfico e o
anti-flash). Sem falhas, sem testes pulados.

## Como validar manualmente

1. `nvm use 24.18.1 && npm start` (proxy para backend em `127.0.0.1:3100`; subir o backend
   separadamente).
2. Logar com `tipoPerfil: 'produtor'` → `/#/dashboard-produtor`: os 4 gráficos renderizam com dados do
   `DASHBOARD_MOCK` — origem com São Paulo no topo (4.100), vendas por faixa com HighFrenetic no topo
   (312), receita por música com "Outras faixas" na barra mais longa (86,2%), curtidas × compras com 2
   linhas partindo de 100%.
3. DevTools → Network: confirmar **5** requisições `GET /api/dashboard/*` (antes eram 3), todas com
   `Authorization: Bearer`.
4. Trocar o período 7d/30d/12m: "Curtidas × Compras" muda (7 pontos diários → 5 semanais → 6 mensais);
   os demais gráficos/tabela permanecem iguais (limitação de backend documentada acima) — e a troca
   **não** deve mostrar skeleton, apenas um esmaecimento breve dos cards existentes.
5. Bloquear `sales-by-origin` no DevTools (mantendo os outros OK) → só o card "Origem das compras"
   mostra alerta de erro; KPIs, resumo financeiro, os outros 3 gráficos e a tabela seguem normais.
6. Bloquear `revenue-by-track` → só "Receita por música" mostra erro; confirmar que **não** aparece
   como "vazio" (bug da R21 corrigido para este bloco também).
7. Redimensionar para 375px (ou emular um iPhone) → a tabela de faixas vira cards empilhados sem
   scroll lateral; os 4 gráficos e o cabeçalho reorganizam em coluna sem estourar a largura da tela.
8. Logar como `tipoPerfil: 'comprador'` → confirmar que `ProdutorGuard` segue redirecionando para
   `/home` (guard não foi tocado).

## Riscos ou pendências

- **Decisão pendente (backend/produto, já registrada na R21):** o mock global não segmenta por
  produtor autenticado e só 1 dos 5 endpoints (`likes-vs-sales`) honra `period` — os outros 4
  continuam retornando os mesmos valores independentemente do filtro. Fora do escopo de front-end.
- **Redução de escopo desta etapa (documentada acima):** "Receita por música" é lista de barras, não
  donut, por indicação direta da skill `dataviz` diante da distribuição real dos dados mock; e o
  gráfico de linha usa `<title>` nativo + tabela em vez de um crosshair customizado com JS de
  posicionamento — ambas decisões dentro do "menor incremento seguro", não bloqueios técnicos.
- **Achado de higiene ainda aberto (R21):** `dashboard.service.ts` monta `Authorization` manualmente,
  duplicando o `AuthInterceptor` global — não tocado nesta etapa (fora do escopo de gráficos/estados).
- Build local segue exigindo `nvm use 24.18.1` explicitamente — conhecido desde a R21, não é
  regressão desta etapa.

## Confirmação de escopo

Alterados apenas arquivos dentro de `src/app/dashboard-produtor/` (componente principal, models, novo
`dashboard.charts.ts`/spec, novo diretório `charts/` com 2 sub-componentes) e uma única saída de escopo
justificada em `src/app/app.module.ts` (registro dos 2 sub-componentes novos em `declarations` —
inevitável na arquitetura NgModule desta base, sem a qual os componentes não compilariam), mais este
relatório em `docs/ia-auditorias/`. Confirmado por `git diff --stat` vazio para `package.json`,
`dashboard.service.ts`, `app-routing.module.ts` e `server/`. `AuthGuard`/`ProdutorGuard`,
`AuthInterceptor`, WaveSurfer e o contrato de `FormData` do upload não foram tocados — nenhuma relação
com esta etapa.

---

## Revisão do Claude Code

[cole aqui o relatório do Claude Code]

---

## Complemento pós-revisão

[cole aqui o complemento, se houver]

---

## Status final da etapa

Aprovado com observações

## Pendências para etapas futuras

- Backend: persistência real de vendas/licenças, filtro de período efetivo nos 4 endpoints que hoje o
  ignoram, segmentação de dados por produtor autenticado (registrado desde a R21).
- Avaliar, numa etapa futura de acessibilidade, se vale a pena investir num crosshair/tooltip
  interativo customizado para "Curtidas × Compras" além da tabela + legenda atuais.
- Corrigir a duplicação de header `Authorization` em `dashboard.service.ts` (achado da R21, ainda
  aberto).
- Criar specs dedicados para `BarListChartComponent`/`LineChartComponent` se esses sub-componentes
  passarem a ser reutilizados em outras telas do produtor.
