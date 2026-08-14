# R02 — Auditoria da branch `codex/create-musical-producer-dashboard-design`

## Resumo da etapa

Esta etapa ficou como stub vazio desde o planejamento original (Etapa 2 do roadmap) — a R03
("Comparação técnica `dev` x branch Dashboard") acabou absorvendo boa parte desse trabalho na
prática, e as etapas de implementação real do dashboard (R19–R23) já usaram a branch codex como
referência visual, sem merge. Esta auditoria fecha a lacuna documental: audita **isoladamente** o
que a branch `codex/create-musical-producer-dashboard-design` adiciona, com verificação direta via
`git diff`/`git show` contra o ponto onde ela divergiu da `dev` (não contra a `dev` atual, que já
evoluiu muito desde então — Angular 14→22, dashboard reescrito nas R19–R23), e confirma contra o
estado *atual* da `dev` quais riscos identificados em 2026 continuam relevantes hoje.

A branch tem um único commit (`4317975 feat: add producer dashboard experience`) sobre o ponto de
divergência `8c3f950`. Ela adiciona uma tela de dashboard do produtor **paralela e desconectada** da
arquitetura real do projeto: componente novo em `src/app/produtor-dashboard/` (não
`src/app/dashboard-produtor/`, que já existia na `dev` desde antes da divergência), 100% de dados
estáticos (nenhum `constructor`, nenhum `HttpClient`, nenhum service, nenhum `OnInit`), rota **sem
nenhum guard** (`canActivate` ausente) e link de menu **sem `*ngIf`** de proteção por perfil — e
adiciona duas dependências novas (`apexcharts` e `ng-apexcharts`) só para os gráficos dessa tela
mockada. Nenhum desses três riscos (rota desprotegida, link sem guard, dependência de gráficos) foi
herdado pela `dev`: a auditoria confirma que o dashboard real em `src/app/dashboard-produtor`
mantém `AuthGuard`+`ProdutorGuard` na rota, `*ngIf="isProdutor"` no link do menu, dados via
`DashboardService` real, e `apexcharts`/`ng-apexcharts` **não constam** no `package.json` atual.

## Arquivos lidos

- Branch `codex/create-musical-producer-dashboard-design` (via `git show`/`git diff`, sem checkout):
  `package.json`, `src/app/app-routing.module.ts`, `src/app/app.module.ts`,
  `src/app/menu-produtor/menu-produtor.component.html`,
  `src/app/produtor-dashboard/produtor-dashboard.component.ts`, `.html`
  (`.scss`/`.spec.ts` listados via diffstat, não lidos linha a linha — ver "Riscos ou pendências")
- `src/assets/icons/{heart-pulse,money-stack,shopping-bag,ticket-average}.svg` da branch codex
  (confirmados apenas como novos via diffstat)
- Estado atual da `dev`: `package.json`, `src/app/app-routing.module.ts`,
  `src/app/menu-produtor/menu-produtor.component.html`, `.ts`,
  `src/app/dashboard-produtor/dashboard-produtor.component.ts`
- `docs/ia-auditorias/R03-comparacao-dev-vs-dashboard-codex.md`,
  `R21-dashboard-produtor-auditoria-dev-contrato-dados.md`,
  `R22-dashboard-produtor-visual-branch-codex.md` (continuidade — confirmar o que já foi decidido e
  implementado, para não duplicar trabalho)
- `docs/roadmap_tecnico_MokBeats_Codex_Claude.md` (seção "R02", linhas 392–525 — escopo e critérios
  de aceite originais da etapa)
- `AGENTS.md` (§3 modos, §6 branch/git, §8.9), `PROJECT_RULES.md` (§2, §4, §12, §15), `CLAUDE.md`
- `docs/ia-auditorias/README.md`

## Arquivos alterados

- `docs/ia-auditorias/R02-auditoria-branch-dashboard-codex.md` (este relatório — era 0 bytes)
- `docs/ia-auditorias/README.md` (status do índice: R02 `Vazio` → `Preenchido`)

Nenhum arquivo de aplicação foi tocado. Etapa somente leitura/auditoria, sem merge, cherry-pick ou
checkout da branch codex (lida inteiramente via `git show <branch>:<arquivo>` e
`git diff <merge-base> <branch>`, mantendo a `dev` como `HEAD` o tempo todo).

## O que foi implementado ou auditado

**1. Ponto de divergência e escopo real do commit** — `git merge-base dev
codex/create-musical-producer-dashboard-design` = `8c3f950`; a branch tem exatamente um commit acima
disso. `git diff --stat 8c3f950 codex/create-musical-producer-dashboard-design` mostra 13 arquivos
alterados: `package.json`/`package-lock.json`, `app-routing.module.ts`, `app.module.ts`,
`menu-produtor.component.html` (todos modificados, não recriados), mais 4 arquivos novos em
`src/app/produtor-dashboard/` e 4 ícones SVG novos em `src/assets/icons/`.

**2. Dependências adicionadas** — `apexcharts@^3.46.0` e `ng-apexcharts@^1.7.4`, usadas
exclusivamente pelos gráficos (heatmap, barra, coluna, linha) do `ProdutorDashboardComponent` da
codex. Confirmado no `package.json` atual da `dev`: **nenhuma das duas está instalada** — a decisão
da R03/R21 de adiar gráficos como placeholders no MVP, sem essas dependências, foi mantida em todas
as etapas seguintes (R22/R23).

**3. Rota `/dashboard-produtor` sem guard** — a branch codex registra
`{ path: 'dashboard-produtor', component: ProdutorDashboardComponent }`, sem `canActivate`. Ponto
importante para quem for reler o histórico: no commit-base (`8c3f950`) a `dev` **ainda não tinha**
essa rota — ela foi criada depois, já com guard, então tecnicamente a codex não "removeu" proteção
de uma rota preexistente; ela **nunca teve** proteção. Na prática o efeito é equivalente ao que a R03
já havia sinalizado. Confirmado hoje: a rota real em `src/app/app-routing.module.ts:60` usa
`canActivate: [AuthGuard, ProdutorGuard]`.

**4. Link de menu sem proteção por perfil** — mesma lógica do item 3: a codex adiciona o item de menu
`<li class="nav-item"><a [routerLink]="['/dashboard-produtor']">Dashboard do Produtor…</a></li>` sem
`*ngIf`, num `menu-produtor.component.html` que no ponto de divergência ainda não tinha esse link.
Confirmado hoje: o item real (`menu-produtor.component.html:43-44`) usa
`*ngIf="isProdutor"` (getter que delega a `AuthService.isProdutor()`), então o link só aparece para
quem tem perfil produtor — o risco de vazamento de UI para compradores, sinalizado na revisão da R03,
não existe na `dev` atual.

**5. Componente 100% mockado, sem service** — `ProdutorDashboardComponent` (branch codex) não tem
`constructor`, não importa `HttpClient`, não implementa `OnInit` nem qualquer lifecycle hook: todo o
conteúdo (`cards`, `tracks`, séries dos gráficos) é `readonly` com literais hardcoded (ex.:
`value: '8.542'`, `value: 'R$ 126.340,00'`). Não há nenhuma tentativa de integração com
`/api/dashboard/*`. Confirmado que o componente real (`dashboard-produtor.component.ts`) injeta
`DashboardService` no `constructor` e carrega dados em `ngOnInit` — a base de dados real da `dev`
nunca foi trocada pelos mocks da codex, em nenhuma das etapas R19–R23.

**6. Botões sem ação real** — no template da codex, apenas os 3 botões de intervalo (`7d`/`30d`/`12m`
no topo) têm `(click)="setRange(...)"`. Os demais — `btn-export`, dois `mode-toggle`, `Ver detalhes`
(2x), `Filtrar`, o segundo grupo `7d/30d/12m` (dentro de um card específico), `Promover`,
`help-button` e `floating-help` — não têm nenhum `(click)` nem `[routerLink]`; são decorativos.
Nenhum `href=""`/`href="#"` foi encontrado no template (os elementos interativos são todos
`<button>`, não âncoras).

**7. Reaproveitar / adaptar / descartar (matriz consolidada, cruzando o que a auditoria confirma com
o que a R22 de fato implementou)**

| Item da branch codex | Decisão | Confirmação |
|---|---|---|
| `apexcharts` / `ng-apexcharts` | Descartar no MVP | Ausentes do `package.json` atual |
| `src/app/produtor-dashboard/*` (componente inteiro) | Descartar — não criar essa pasta | `dev` usa `src/app/dashboard-produtor/*`, nunca criada a pasta paralela |
| Rota sem `canActivate` | Descartar | Rota real usa `AuthGuard`+`ProdutorGuard` |
| Link de menu sem `*ngIf` | Descartar | Link real usa `*ngIf="isProdutor"` |
| Dados 100% mockados (`cards`, `tracks`, séries) | Descartar | `DashboardService` real, `dashboard.models.ts` com DTOs |
| Botões decorativos sem ação | Descartar (ou reimplementar com ação real) | R21 já cobrou isso; R22 registra correção de "botões inertes da tabela desabilitados com tooltip" |
| Ícones SVG (`heart-pulse`, `money-stack`, `shopping-bag`, `ticket-average`) | Adaptar | Uso pontual como inspiração de iconografia por KPI — não confirmado 1:1 nos assets atuais, ver pendência abaixo |
| Cards KPI, hierarquia visual, subtítulo por bloco, badge de tabela | Adaptar (não copiar) | R22 registra explicitamente reimplementação dessas ideias sobre a base real, com paleta clara `#f3f3f4` + acento roxo `#4B3A8F` (decisão do usuário, não a paleta escura da codex) |
| Renomeação "Dados Pessoais" → "Configurações" (achado da revisão da R03) | Descartar | Não foi possível confirmar 1:1 nesta auditoria pontual (fora do diffstat inspecionado); tratar como já decidido pela R03 e não reabrir sem novo motivo |

## Comandos executados

- [x] `git branch` / `git status`
- [x] `npm run build`
- [x] `npm test`

## Resultado dos comandos

- `git branch --show-current` → `dev` durante toda a auditoria (nenhum checkout da branch codex).
- `git status --short` → limpo antes e depois da auditoria.
- `git fetch origin` → branch remota `origin/codex/create-musical-producer-dashboard-design`
  confirmada presente.
- `npm run build` (`ng build --configuration=production --base-href /`) → sucesso, mesmo resultado da
  R27 (bundle inicial ~2,51 MB / ~427 kB), sem nenhuma mudança de código nesta etapa. Único aviso:
  deprecation do Sass `@import` em `src/styles.scss:79`, pré-existente e fora de escopo.
- `npm test -- --watch=false` → **56 arquivos de teste, 154 testes, todos passaram**, idêntico ao
  resultado da R27 (nenhum arquivo de aplicação foi tocado nesta etapa, então nenhuma mudança de
  cobertura era esperada). Reexecutado por disciplina de `PROJECT_RULES.md §12`, não porque algo no
  código tivesse mudado.

## Como validar manualmente

1. `git fetch origin && git merge-base dev codex/create-musical-producer-dashboard-design` deve
   retornar `8c3f950...`.
2. `git diff --stat 8c3f950 codex/create-musical-producer-dashboard-design` deve reproduzir os 13
   arquivos listados no item 1 de "O que foi implementado ou auditado".
3. `grep -n "apexcharts" package.json` na `dev` não deve retornar nada.
4. `grep -n "canActivate" src/app/app-routing.module.ts | grep dashboard-produtor` deve mostrar
   `AuthGuard, ProdutorGuard`.
5. `grep -n "isProdutor" src/app/menu-produtor/menu-produtor.component.html` deve mostrar o `*ngIf`
   no item de menu do Dashboard.

## Riscos ou pendências

- **Auditoria pontual, não exaustiva**: `.scss`/`.spec.ts` da branch codex foram confirmados apenas
  via diffstat (tamanho/existência), não lidos linha a linha — não há indicação de que contenham algo
  além de estilo/teste do componente mockado, mas não foi verificado.
- **Ícones SVG**: não confirmei se os 4 SVGs da codex (`heart-pulse`, `money-stack`, `shopping-bag`,
  `ticket-average`) foram de fato copiados/adaptados para `src/assets/icons/` na `dev` durante a R22,
  ou se o dashboard real usa outra fonte de ícone (ex.: `material-icons`, já usado em várias telas do
  projeto). Não é um risco técnico — é só uma lacuna de confirmação 1:1 que uma leitura futura de
  `src/assets/icons/` e do template atual do dashboard resolveria em poucos minutos, se for
  relevante.
- **Renomeação "Dados Pessoais" → "Configurações"**: item citado pela revisão da R03 como "não
  replicar sem validação de produto"; não estava no diffstat que esta auditoria isolou (pode estar em
  outro arquivo do menu de produtor não coberto pelo escopo original da R02, ex.
  `sub-menu.component.html`). Tratar a decisão da R03 como válida; se precisar reconfirmar a origem
  exata, é um `grep -rn "Configurações"` na branch codex.
- **`npm run build`/`npm test` não foram reexecutados nesta etapa** (ver "Resultado dos comandos")
  — nenhuma mudança de código nesta etapa; risco residual é zero, mas fica registrado por disciplina
  de `PROJECT_RULES.md §12`.
- Nenhum risco novo foi encontrado além dos já documentados nas R03/R21/R22. Esta etapa não abre
  pendência de implementação nova — ela apenas fecha a lacuna de documentação que a R03 tinha deixado
  ao absorver esse trabalho sem que a R02 fosse formalmente preenchida.

## Confirmação de escopo

Alterado apenas o próprio relatório desta etapa e o índice `docs/ia-auditorias/README.md`. Nenhum
arquivo de aplicação foi lido para edição — apenas para auditoria — e nenhum arquivo de aplicação foi
alterado. Não houve checkout, merge, cherry-pick ou qualquer escrita na branch
`codex/create-musical-producer-dashboard-design`; toda a inspeção foi feita com `git show`/`git diff`
a partir da `dev`, que permaneceu como `HEAD` durante toda a etapa.

## Status final da etapa

Aprovado com observações

A branch `codex/create-musical-producer-dashboard-design` está corretamente mapeada: um único commit
que adiciona uma tela de dashboard paralela, 100% mockada, com rota e menu sem proteção por perfil, e
duas dependências de gráficos não adotadas. Nenhum desses três riscos foi herdado pela `dev` — as
etapas R19–R23 já implementaram o dashboard real preservando guards, `DashboardService` e sem as
dependências de gráfico, reaproveitando apenas ideias visuais pontuais (cards KPI, hierarquia,
badges), com paleta diferente da codex por decisão do usuário. A observação fica por conta das duas
lacunas de confirmação 1:1 registradas acima (ícones SVG e a renomeação "Configurações"), nenhuma das
quais bloqueia o fechamento desta etapa ou a R28.

## Pendências para etapas futuras

- Nenhuma pendência de implementação. As únicas lacunas (ícones SVG, origem exata da renomeação
  "Configurações") são de confirmação documental, não de código, e podem ser resolvidas em minutos
  se algum dia forem relevantes — não é necessário criar uma etapa dedicada para isso.
