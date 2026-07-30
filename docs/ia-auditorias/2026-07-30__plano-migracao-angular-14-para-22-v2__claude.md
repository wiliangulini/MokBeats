# Plano v2.0 — Migração major do Angular do MokBeats (14 → 22)

> Substitui a v1.0 desta mesma sessão. As mudanças em relação à v1 estão consolidadas no
> **Apêndice A**.

## Context

O MokBeats roda Angular 14.3.0, cuja linha **deixou de receber patches de segurança**
(angular.dev/reference/releases: *"Angular versions v2 to v19 are no longer supported"*). O
`npm audit` da raiz retorna **62 vulnerabilidades** (1 crítica, 43 altas), e a auditoria de
2026-07-30 já isolou que nenhuma delas se resolve sem salto de major.

A migração estava adiada porque o Dependabot media a branch errada — recalibração feita e
registrada. Com o alarme falso removido, a migração deixa de ser urgência e passa a ser **dívida
estrutural com prazo**: além dos advisories, o projeto mantém **dois runtimes Node** (backend em
24.18.1, frontend preso em 16.20.2 — "ponte EOL" documentada em `start.sh:74-79`), e o
`.claude/rules/angular-14.md` proíbe textualmente a própria migração.

**Resultado pretendido:** Angular 22.1.0, runtime Node unificado em 24.18.1, `npm audit` limpo,
suíte de testes preservada em runner mantido, e todos os invariantes de produto (WaveSurfer,
guards, `FormData` do upload, licença→carrinho, rotas, contratos HTTP) preservados e verificados
degrau a degrau.

---

## 1. Correções ao diagnóstico herdado

Verificadas por leitura de código, `npm view`, `npm audit` e a página oficial de releases.

| Premissa herdada | Fato verificado | Impacto |
|---|---|---|
| Piso de segurança = Angular ≥ 19.2.16 | **Superada.** Advisories novos de `@angular/core` e `@angular/common` têm range `<=19.2.25` (última v19). Piso real = **Angular 20** | Muda o alvo mínimo |
| Alvo natural = "20 LTS" | **Pior opção.** LTS da v20 termina em **2026-11-28** (~4 meses). Política oficial: 12 meses ativo + 12 LTS | Desqualifica o 20 |
| `fixAvailable` do toolchain = `@angular/cli@22.1.1` | Hoje é **`21.2.19`**. O Angular 20 **não** fecha o grupo de toolchain | Reforça a desqualificação do 20 |
| Karma é dívida "para quando der" | **Não tem correção futura.** `npm audit` aponta `fixAvailable: karma@0.12.33` — um *downgrade* | Torna a Etapa 12 obrigatória |
| Bootstrap 4→5 é consequência do alvo Angular | **É pré-existente e ortogonal.** O `@ng-bootstrap` 13.1.1 já instalado documenta Bootstrap 5 no próprio README | Permite antecipar a etapa |
| Superfície Bootstrap ≈ 370 ocorrências | **≈ 487.** Faltava `font-weight-bold` × 137 (→ `fw-bold`) | +32% de volume |
| Rule do player com 1 path defasado | **11 patterns quebrados em 6 das 8 rules** | Amplia a Etapa 0 |
| jQuery é removível com o Bootstrap 5 | **Falso.** `src/inputMask.js` é o `jquery.inputmask.bundle.js` v3.3.4 (2016) — jQuery é obrigatório | Reverte uma ação planejada |

## 2. Achados próprios desta análise

| # | Achado | Evidência | Consequência |
|---|---|---|---|
| A1 | **`.mat-*` sobrescritos em 2 arquivos**, não 1 | `src/styles.scss` (8 classes) + `src/app/produtores/produtores.component.scss` (2) | O Material 15 (MDC) quebra ambos, silenciosamente |
| A2 | `font-weight-bold` × **137** ausente da contagem do Bootstrap | `grep` em `src/**/*.html` | Maior item mecânico isolado da Etapa 3 |
| A3 | **jQuery é obrigatório** | `src/inputMask.js` é `jquery.inputmask.bundle.js` v3.3.4; `src/input_mask.js` usa `$(":input").inputmask()` | Remover jQuery sai do plano |
| A4 | `inputmask@5.0.8` (npm) **nunca é importado** | Zero `import`/`require` em `src/**/*.ts` | Dependência morta; registrar, não remover aqui |
| A5 | `input_mask.js` acopla ao **checkout** via jQuery global no load | `#numerocartao1`, `#cpfBol` | A Etapa 3 **não pode** reordenar `scripts` de `angular.json` |
| A6 | **Cypress 13.17.0 roda em Node 24** | `engines: ^16 \|\| ^18 \|\| >=20` | Sem conflito entre Etapas 1 e 2 |
| A7 | `@types/node` = **12.20.55** (EOL 2022) | `node_modules/@types/node` | Mas `tsconfig.app.json` tem `"types": []` e o spec só usa `["jasmine"]` → **blast radius restrito a tooling** |
| A8 | **Karma sobrevive até o Angular 22** | `@angular/build@22.1.0` mantém `karma ^6.4.0` como peer **opcional**, ao lado de `vitest ^4.0.8` | A rede de 115 testes atravessa a escada inteira |
| A9 | **Angular 14 permite Node 24** | `engines.node: "^14.15.0 \|\| >=16.10.0"` | Permite unificar o runtime **antes** da escada |
| A10 | `moment` sobrevive ao alvo | `@angular/material-moment-adapter@22.1.0` ainda exige `moment ^2.18.1` | Sem migração de datas |
| A11 | **Material 17.3.10 é a última vulnerável** | Range do advisory: `<=6.4.7 \|\| 8.0.0-beta.0 - 17.3.10` | Material 18+ já fecha; o `fixAvailable: 22.1.0` do npm é conservadorismo de árvore |
| A12 | **30 tooltips já estão inertes hoje** | `data-toggle="tooltip"` × 30 sem nenhuma inicialização JS no projeto | Renomear não cria nem remove o defeito |
| A13 | Script de publicação **não fixa o Node local** | `build_frontend()` usa o `npm` do `PATH`; só o Node remoto é resolvido | Footgun pré-existente, corrigível na Etapa 13 |
| A14 | Bootstrap é carregado **duas vezes** | `angular.json:27` (CSS) + `styles.scss:82` (SCSS) | Corrigir junto da Etapa 3 |
| A15 | `styles.scss` **não tem override de variável Sass do Bootstrap** | Nenhum `$var:` antes do `@import` da linha 82 | Elimina o maior risco Sass do BS4→5 |

---

## 3. Decisão de alvo

**Angular 22.1.0**, com **21.2.19 como checkpoint entregável e ponto de parada aceito**.
Confirmado pelo usuário nesta sessão.

| | Angular 20.3.27 | Angular 21.2.19 | **Angular 22.1.0** |
|---|---|---|---|
| Degraus a partir do 14 | 6 | 7 | **8** |
| Fase de suporte | LTS | LTS | **Ativa** |
| Fim do suporte | 2026-11-28 (~4 meses) | 2027-06 (~11 meses) | **2028-06 (~23 meses)** |
| Node exigido | `^20.19 \|\| ^22.12 \|\| >=24` | idem | `^22.22.3 \|\| ^24.15 \|\| >=26` |
| Node 24.18.1 atende | sim | sim | **sim** |
| TypeScript | `>=5.8 <6.0` | `>=5.9 <6.1` | **`>=6.0 <6.1`** |
| ng-bootstrap | 19.0.1 | 20.0.0 | **21.0.0** |
| Fecha advisories de runtime | sim | sim | **sim** |
| Fecha grupo de toolchain | **não** | sim | **sim** |
| Fecha `@ng-bootstrap` (fix=21.0.0) | não | não | **sim** |

O 20 se desqualifica sozinho: economiza 2 degraus para exigir remigração em ~4 meses, e nem fecha o
toolchain. Entre 21 e 22, a diferença real é **um degrau que força TypeScript 6.0** — o maior
desconhecido do plano. Por isso o 21 é estruturado como checkpoint completo e mergeável: se o TS 6.0
ou o ng-bootstrap 21 se mostrarem hostis, para-se em 21 com todo o resto já ganho, sem retrabalho.

### 3.1 Matriz de degraus (fonte: `npm view`, 2026-07-30)

| Degrau | Angular | Node exigido | TypeScript | ng-bootstrap | Material |
|---|---|---|---|---|---|
| D1 | 15.2.10 | `^14.20 \|\| ^16.13 \|\| >=18.10` | `>=4.8.2 <5.0` | 14.2.0 | 15.2.9 |
| D2 | 16.2.12 | `^16.14 \|\| >=18.10` | `>=4.9.3 <5.2` | 15.1.2 | 16.2.14 |
| D3 | 17.3.12 | `^18.13 \|\| >=20.9` | `>=5.2 <5.5` | 16.0.0 | 17.3.10 |
| D4 | 18.2.14 | `^18.19.1 \|\| ^20.11.1 \|\| >=22` | `>=5.4 <5.6` | 17.0.1 | 18.2.14 |
| D5 | 19.2.25 | idem D4 | `>=5.5 <5.9` | 18.0.0 | 19.2.19 |
| D6 | 20.3.27 | `^20.19 \|\| ^22.12 \|\| >=24` | `>=5.8 <6.0` | 19.0.1 | 20.2.14 |
| D7 | 21.2.19 | idem D6 | `>=5.9 <6.1` | 20.0.0 | 21.2.14 |
| D8 | 22.1.0 | `^22.22.3 \|\| ^24.15 \|\| >=26` | `>=6.0 <6.1` | 21.0.0 | 22.1.0 |

Lockstep do ng-bootstrap: **versão X ↔ Angular X+1** (verificado em `peerDependencies` de 13 a 20).
**Node 24.18.1 satisfaz os 8 degraus.** O Node 16.20.2 morre no D3.

---

## 4. Escopo

### Incluído

| Etapa | Entrega | Depende de |
|---|---|---|
| 0 | Destravar e reconciliar as regras de IA + ADR | — |
| 1 | Ampliar a rede e2e Cypress (4 fluxos) | 0 |
| 2 | Unificar o runtime Node em 24.18.1 | 1 |
| 3 | Bootstrap 4.6.2 → 5.3.8 (ainda em Angular 14) | 2 |
| 4–11 | Degraus D1..D8 do `ng update`, um major por etapa | 3 |
| 12 | Karma → Vitest | 11 (ou 10, se parar no D7) |
| 13 | Reflexo em `start.sh` / script de publicação + limpeza | 12 |

### Fora de escopo

- Executar deploy ou qualquer operação na VPS.
- Qualquer alteração em `server/` (backend em 0 vulnerabilidades).
- Redesign visual — a migração **preserva** a identidade atual. Melhoria de UI é `/melhorar-ui-ux`.
- Adotar standalone components, signals ou zoneless como refatoração. O `ng update` do D5 injeta
  `standalone: false` automaticamente; isso é **preservação**, não adoção.
- Corrigir os 30 tooltips inertes (A12), o typo `data-toogle` em
  `add-playlist-modal.component.ts:72`, e remover a dependência morta `inputmask@5.0.8` (A4).
  Registrar como tickets; não corrigir aqui.
- Remover jQuery — impossível (A3).

---

## 5. Arquivos prováveis

### 5.1 Confirmados (lidos nesta sessão)

**Etapa 0 — regras e documentação**
- `.claude/rules/`: `angular-14.md` (renomear → `angular.md`), `player-and-waveform.md`,
  `api-contracts.md`, `auth-and-guards.md`, `license-cart-checkout.md`, `buyer-flow.md`,
  `producer-dashboard.md`
- `AGENTS.md` (§1, §2 item 7, §8.0, §8.4, §8.5, §8.6, §8.8, §8.11, §9), `CLAUDE.md`
- `docs/areas/`: `arquitetura-angular.md`, `producer-dashboard.md`, `qualidade-de-codigo.md`
- `docs/resources/stack-tecnica.md`, `README-IA.md`, `docs/GUIA_MOKBEATS_NAO_TECNICO.md`
- `.claude/commands/`: `architecture-decision.md`, `checklist-merge.md`, `create-code.md`,
  `final-audit.md`, `melhorar-ui-ux.md`
- `.claude/skills/`: `architecture-review`, `implementation-planning`, `legacy-code-audit`,
  `senior-code-agent` (SKILL.md de cada)
- **Novo:** `docs/adr/0002-migracao-angular-14-para-22.md` (o `0001-` já existe:
  `0001-modelo-operacional-ia.md`)

**Etapas 2–13 — build e runtime**
- `.nvmrc`, `package.json`, `package-lock.json`
- `angular.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`,
  `tsconfig.spec.focus.json`, `karma.conf.js`, `src/test.ts`, `src/test.focus.ts`,
  `src/polyfills.ts`, `src/main.ts`
- `start.sh` (linhas 18-19; bloco 74-79), `deploy-to-vps.sh` (`build_frontend()`, ~181)
- `docs/SCRIPTS_SHELL.md`

**Invariantes a proteger — caminhos reais**

| Invariante | Arquivos |
|---|---|
| Player / WaveSurfer | `src/app/service/wave-surfer.service.ts`, `music-player.service.ts`, `audio.service.ts`, `audio-preloader.service.ts`; `src/app/player/player.component.ts`; `src/app/musicas/musicas.component.ts`; `src/app/wave-surfer-test/` |
| Auth | `src/app/guards/auth.guard.ts`, `produtor.guard.ts`, `profile-complete.guard.ts`; `src/app/interceptors/auth.interceptor.ts`; `src/app/login/auth.service.ts` |
| Upload / `FormData` | `src/app/upload-file/` (component + `upload-file.service.ts`) |
| Licença → carrinho → checkout | `src/app/licenca-valor/`, `src/app/carrinho/`, `src/app/carrinho/cartModal/`, `src/app/service/carrinho.service.ts`, `src/app/finalizar-compra/` |
| Rotas | `src/app/app-routing.module.ts`, `src/app/upload-file/upload-file-routing.module.ts` |
| Estilo global | `src/styles.scss` (16-21, 22-35, 77-79, 82, 93-110), `src/app/produtores/produtores.component.scss` |

### 5.2 A verificar durante a execução (lista fechada)

Tudo o que a v1 deixava em aberto foi resolvido, exceto os itens abaixo — cada um com procedimento
determinístico definido, não descoberta livre:

| Item | Procedimento | Etapa |
|---|---|---|
| Nomes MDC equivalentes às 10 classes `.mat-*` | Após o `ng update` do D1, `grep -o 'mat-mdc-form-field[a-z-]*' node_modules/@angular/material/prebuilt-themes/indigo-pink.css \| sort -u` e inspeção do DOM renderizado | D1 |
| Breaking changes de cada major | `angular.dev/update-guide` (from N-1, to N) antes de cada `ng update` | D1..D8 |
| Builder Karma funcional no degrau | `npm test` do bloco de validação. Já confirmado que sobrevive em 22 (A8) | D1..D8 |

---

## 6. Pré-leitura obrigatória (para quem executar)

1. Este plano (v2.0) — incluindo §2 (achados) e o Apêndice A.
2. `PROJECT_RULES.md` §2, §5, §12, §13, §15.
3. `AGENTS.md` §2, §3, §5, §8.0.
4. As rules **já corrigidas pela Etapa 0** — nunca as versões atuais.
5. `docs/adr/0002-migracao-angular-14-para-22.md` (criado na Etapa 0).
6. `docs/ia-auditorias/2026-07-30__recalibracao-t1-e-sync-main__claude.md` §11-§12 e
   `2026-07-29__plano-p0-v2.2-r1b-upgrade-node-vps__claude.md` §11 + Decisão 1.

---

## 7. Plano incremental

**Branch:** `feature/angular-22-migration`, a partir de `dev`.
**Rollback universal:** uma tag git por etapa (`mig/e0`, `mig/e1`, … `mig/d8`, `mig/e12`, `mig/e13`).
Voltar = `git reset --hard mig/<anterior> && rm -rf node_modules && npm ci`.

**Portão entre etapas:** nenhuma etapa inicia sem que a anterior tenha (a) bloco de validação verde,
(b) commit + tag, (c) linha no relatório de continuidade. Sem exceção.

---

### Etapa 0 — Destravar as regras e corrigir o roteamento

> **Primeiro por obrigação, não por conveniência.** `.claude/rules/angular-14.md:14` proíbe
> textualmente esta migração (*"do not migrate versions"*) e `:17` proíbe alterar
> `package.json`/`angular.json`. A própria rule declara a ordem: *"if this file diverges, update the
> project rule first"*. A autorização humana existe (é este plano); ela precisa estar **registrada
> na fonte de verdade antes de o código divergir dela**.

**0a — ADR.** Criar `docs/adr/0002-migracao-angular-14-para-22.md` (o `0001-` já existe:
`0001-modelo-operacional-ia.md`) com a tabela comparativa 20/21/22 (§3), as 8 correções de
diagnóstico (§1), os 15 achados (§2) e o critério de parada em D7. Usar o formato de saída do
command `architecture-decision` (`.claude/commands/architecture-decision.md`): Status / Contexto /
Problema / Restrições / Alternativas consideradas / Decisão recomendada / Justificativa / Impactos
/ Riscos / Plano incremental / Critérios de aceite.

**0b — Fonte de verdade, em cascata**

| Arquivo | Mudança |
|---|---|
| `docs/areas/arquitetura-angular.md` | §6: "Respeitar Angular 14" → Angular 22 + referência ao ADR |
| `.claude/rules/angular-14.md` | **Renomear para `.claude/rules/angular.md`** — nome neutro de versão, para não repetir esta etapa na próxima major. Remover a proibição de migrar; substituir por "preservar a estrutura NgModule e as rotas existentes" |
| `AGENTS.md` | §1 ("Stack:"); §2 item 7; §8.0 (nome da rule); §9 ("migrar Angular" → "migrar Angular fora de um plano aprovado") |
| `CLAUDE.md` | Invariantes: "Preserve Angular 14 structure" → "Preserve a estrutura NgModule e as rotas existentes" |
| `.claude/commands/*` (5) e `.claude/skills/*` (4) | Trocar menções a "Angular 14" |
| `docs/resources/stack-tecnica.md`, `docs/areas/producer-dashboard.md`, `docs/areas/qualidade-de-codigo.md`, `README-IA.md`, `docs/GUIA_MOKBEATS_NAO_TECNICO.md` | Versão da stack |

**0c — Corrigir os 11 paths defasados**

O briefing apontou 1. A varredura encontrou **11, em 6 das 8 rules**. Só `producer-upload.md` e
`angular-14.md` têm paths integralmente válidos hoje.

| Rule | Path declarado | Path real | Consequência hoje |
|---|---|---|---|
| `player-and-waveform.md` | `src/app/services/music-player.service.ts` | `src/app/service/…` | **rule do player não aciona** |
| `player-and-waveform.md` | *(ausente)* | `service/wave-surfer.service.ts`, `audio.service.ts`, `audio-preloader.service.ts` | invariante mais crítico da migração sem cobertura |
| `auth-and-guards.md` | `src/app/**/guard*.ts` | `guards/auth.guard.ts`, `produtor.guard.ts`, `profile-complete.guard.ts` | **`ProdutorGuard` e `ProfileCompleteGuard` sem rule alguma** — só `auth.guard.ts` escapa, por casar com `auth*.ts` |
| `auth-and-guards.md` | `src/app/**/interceptor*.ts` | `interceptors/auth.interceptor.ts` | morto (salvo por acaso pelo `auth*.ts`) |
| `license-cart-checkout.md` | `src/app/services/carrinho.service.ts` | `src/app/service/…` | morto |
| `license-cart-checkout.md` | `src/app/efeitosSonoros/**/*` | `src/app/efeitos-sonoros/**/*` | morto |
| `license-cart-checkout.md` | `src/app/cart-modal/**/*` | `src/app/carrinho/cartModal/**/*` | morto (coberto por `carrinho/**`) |
| `api-contracts.md` | `src/app/services/**/*.ts` | `src/app/service/**/*.ts` | morto; `crud-service.ts` (sem ponto) fica descoberto |
| `buyer-flow.md` | `src/app/components/filter/**/*` | `src/app/filter/**/*` | morto |
| `buyer-flow.md` | `src/app/components/pagination/**/*` | `src/app/shared/pagination/**/*` | morto |
| `producer-dashboard.md` | `src/app/pages/artist/**/*` | `src/app/artist/**/*` e `src/app/usuario-artista/**/*` | morto |

Corrigir os mesmos caminhos em `AGENTS.md` §8.4, §8.5, §8.6, §8.8, §8.11.

**Definition of Done:** para cada `paths` corrigido, um `find`/`ls` do glob casa com ≥1 arquivo real.
Nenhum código de aplicação tocado. `git diff --stat src/` vazio.
**Rollback:** `git revert`. **Ponto de não-retorno:** nenhum.

---

### Etapa 1 — Ampliar a rede e2e Cypress

Hoje: `cypress/e2e/player.cy.ts` — 1 spec.

**Por que antes de tudo:** os 115 testes Karma são uma rede que **se degrada durante a própria
migração** — serão alterados pelas mudanças de `TestBed` ao longo dos degraus e substituídos na
Etapa 12. Cypress é independente de runner **e de template**, sendo a única rede que sobrevive tanto
à escada Angular quanto ao Bootstrap 4→5 (que é puro template/CSS e **invisível** para teste
unitário).

Cobrir como smoke (feliz-caminho, sem exaustividade):

| Spec | Fluxo | Asserção-chave |
|---|---|---|
| `player.cy.ts` (ampliar) | Play, waveform, troca de faixa | Nenhum áudio duplicado após 3 trocas |
| `licenca-carrinho.cy.ts` | Item → modal de licença → carrinho | Modal **bloqueia** a adição sem escolha; contador do menu incrementa |
| `checkout.cy.ts` | Carrinho → `/finalizar-compra` | Itens e licenças persistem; máscaras de `#numerocartao1`/`#cpfBol` aplicam (A5) |
| `upload.cy.ts` | Login produtor → Single Track sem stems | `cy.intercept` captura o `FormData` e **congela os nomes de campo** |

O `cy.intercept` do upload é o mecanismo que transforma "preservar `FormData`" de promessa em
verificação automática, repetida em todos os 8 degraus.

**Baseline visual:** no fim desta etapa, `cy.screenshot()` das rotas `/`, `/musicas`, `/carrinho`,
`/finalizar-compra`, `/upload-file`, `/login` e das telas com `<mat-form-field>`. São o gabarito das
Etapas 3 e D1.

**DoD:** `npm run e2e` verde com 5 specs sob Node 16.20.2; screenshots de baseline commitadas.
**Rollback:** trivial (só adiciona). **Ponto de não-retorno:** nenhum.

---

### Etapa 2 — Unificar o runtime Node em 24.18.1

O Angular 14 declara `engines.node: "^14.15.0 || >=16.10.0"` (A9) — Node 24.18.1 é **permitido pela
própria faixa**. Isso permite matar a ponte EOL antes da escada, e não como consequência dela. O
Cypress 13.17.0 instalado também aceita Node 24 (A6), então não há conflito com a Etapa 1.

- `.nvmrc`: `16.20.2` → `24.18.1` (iguala `server/.nvmrc`).
- `start.sh`: reescrever a linha 19 e o bloco 74-79, que documentam a ponte EOL. A função
  `resolve_node_bin()` (linhas 80-109) **não muda** — ela já lê o `.nvmrc`.
- `@types/node`: `^12.11.1` → `^24.0.0`. Baixo risco confirmado: `tsconfig.app.json` tem
  `"types": []` e `tsconfig.spec.json` só declara `["jasmine"]` — o blast radius é tooling, não a
  compilação da aplicação (A7).

**DoD:** `npm ci`, `npm run build`, `npm test` (115), `npm run e2e` (5) — todos verdes sob Node
24.18.1, **antes** de qualquer degrau.

**Contingência (decisão desenhada, não incógnita):** a faixa permite Node 24, mas o Angular 14
(2022) o antecede. Se o build quebrar, manter `.nvmrc` em `16.20.2` e reexecutar esta etapa
**depois do D2** — o Node 16 só morre de fato no D3, que exige `^18.13 || >=20.9`. A etapa é
oportunista, nunca bloqueante, e a ordem alternativa já está definida.

**Rollback:** reverter `.nvmrc` e `@types/node`. **Ponto de não-retorno:** nenhum.

---

### Etapa 3 — Bootstrap 4.6.2 → 5.3.8 (ainda em Angular 14)

**Por que aqui:** o `@ng-bootstrap` 13.1.1 instalado já documenta Bootstrap 5 no README — a
divergência é **pré-existente e independente do alvo Angular**. Fazer as ~487 trocas contra um build
e 115 testes comprovadamente verdes isola a variável; depois a escada corre sem churn de template
misturado.

**Facilitador confirmado (A15):** `styles.scss` **não tem nenhuma sobrescrita de variável Sass do
Bootstrap** antes do `@import` da linha 82 — o que elimina o principal risco de migração Sass do
BS4→5.

**3a — Substituição mecânica (≈ 469 ocorrências, verificável por `grep`)**

| De | Para | Qtd |
|---|---|---|
| `font-weight-bold` | `fw-bold` | 137 |
| `data-toggle` | `data-bs-toggle` | 81 |
| `data-target` | `data-bs-target` | 37 |
| `data-parent` | `data-bs-parent` | 37 |
| `ml-*`→`ms-*`, `mr-*`→`me-*` | | 109 |
| `pl-*`→`ps-*`, `pr-*`→`pe-*` | | 54 |
| `text-right`→`text-end`, `float-left`→`float-start` | | 11 |
| `data-dismiss` | `data-bs-dismiss` | 2 |
| `sr-only` | `visually-hidden` | 1 |

Concentração: `musicas` (14), `pag-playlist` (12), `favoritos` (12), `usuario-artista` (10) e
`artist` (10) respondem por ~72% dos `data-toggle`.

**3b — Exige revisão visual (≈ 18 ocorrências + 2 pontos de CSS global)**

| Item | Qtd | Por quê |
|---|---|---|
| `form-group` | 11 | **Removido** no BS5; vira utilitário de margem (`mb-3`) — decisão de espaçamento caso a caso |
| `close"` | 6 | `.close` → `.btn-close` e **o markup muda**: o `&times;` interno some, o ícone vira `background-image` |
| `custom-file` | 1 | **Removido** no BS5; vira `form-control` com `type="file"` — mudança estrutural |
| `badge-*` | 2 | Vira `bg-*`; mas `badge-pill` → `rounded-pill` — inspecionar cada um |
| `styles.scss:16-18` | — | `.gap-3` custom **colide** com o `.gap-3` nativo do BS5. Remover o custom |
| `styles.scss:19-21` | — | `.modal-backdrop { z-index: 1050 !important }` — o BS5 mudou a escala de z-index. Revisar contra `cartModal`, licença e playlist |

**3c — Corrigir o carregamento duplo (A14).** Manter apenas o `@import` de `styles.scss:82` e
remover `node_modules/bootstrap/dist/css/bootstrap.css` dos **três** alvos de `angular.json`
(`build`, `test`, `test-focus`).

**3d — jQuery permanece (A3).** `src/inputMask.js` é o `jquery.inputmask.bundle.js` v3.3.4 e
`src/input_mask.js` executa `$(":input").inputmask()` — jQuery é obrigatório e **não sai**. Além
disso, **não reordenar** o array `scripts` de `angular.json` (A5): `input_mask.js` roda no load e
depende de `jquery.js` já estar avaliado; ele acopla ao checkout via `#numerocartao1` e `#cpfBol`.
A dependência npm `inputmask@5.0.8`, que nunca é importada (A4), fica registrada como ticket.

**Como validar sem suíte visual:**
- `npm test` (115) e `npm run e2e` (5 specs da Etapa 1).
- `grep` de verificação: **zero** ocorrências remanescentes dos padrões de 3a.
- Comparação contra as screenshots de baseline da Etapa 1.
- Checklist manual nas 12 telas com `data-toggle`: menu responsivo, accordion do FAQ, dropdowns,
  tabs, modais de licença/carrinho/playlist, player.

**Achado colateral (A12), fora de escopo:** os 30 `data-toggle="tooltip"` **já estão inertes hoje** —
tooltip do Bootstrap exige inicialização JS, e não há nenhuma no projeto (os 6 que funcionam são
`ngbTooltip`). Renomeá-los mantém a inércia; não a cria. Somado ao typo `data-toogle` em
`add-playlist-modal.component.ts:72`. Registrar para `/melhorar-ui-ux`.

**DoD:** bloco de validação verde + zero ocorrências no grep + checklist manual das 12 telas.
**Rollback:** `git reset --hard mig/e2`. **Ponto de não-retorno:** nenhum.

---

### Etapas 4–11 — Degraus D1..D8 (`ng update`, um major por etapa)

**Protocolo idêntico em todos os degraus, sem exceção:**

1. Confirmar `node -v` = 24.18.1 e árvore de trabalho limpa.
2. Ler o guia oficial do degrau em `angular.dev/update-guide` (from N-1, to N).
3. `ng update @angular/core@N @angular/cli@N` — **nunca agrupar dois majors**.
4. `ng update @angular/material@N` e `@ng-bootstrap/ng-bootstrap@<N-1>` no mesmo degrau.
5. Revisar **todo** o diff das migrações automáticas antes de commitar.
6. Rodar o bloco de validação.
7. Commit + `git tag mig/dN` + linha no relatório de continuidade.

**Bloco de validação por degrau (obrigatório):**
```bash
npm run build          # produção — é também a checagem de tipos (AOT + strict + strictTemplates)
npm test               # 115 testes Karma — baseline que atravessa toda a escada (A8)
npm run e2e            # 5 specs Cypress
npm audit              # registrar o número; deve cair monotonicamente
```
> `npm run lint` e `npm run typecheck` **não existem** neste projeto. Não prometer nem reportar
> nenhum dos dois (PROJECT_RULES §12). Os scripts reais são `build`, `test`, `test:focus`,
> `cypress:run`, `e2e`.

**Verificação de invariantes por degrau** (não confiar só no verde da suíte):

| Invariante | Arquivo real | Verificação |
|---|---|---|
| Ciclo de vida do WaveSurfer | `src/app/service/wave-surfer.service.ts`, `music-player.service.ts`, `player.component.ts` | Spec Cypress do player; confirmar que `destroy()` segue chamado; zero áudio duplicado |
| `AuthGuard`/`ProdutorGuard`/`ProfileCompleteGuard` | `src/app/guards/*.ts` | Assinatura **não** convertida para functional guard pelas migrações; dashboard inacessível a não-produtor |
| `FormData` do upload | `src/app/upload-file/` | `cy.intercept` da Etapa 1 congela os nomes de campo |
| Licença antes do carrinho | `src/app/licenca-valor/`, `src/app/carrinho/cartModal/` | Spec Cypress do carrinho |
| Rotas e ordem | `app-routing.module.ts`, `upload-file-routing.module.ts` | `git diff` **vazio**; qualquer alteração exige justificativa escrita |
| Contratos HTTP | `src/app/service/*.ts`, `src/app/musicas/musicas.service.ts` | `git diff` sem mudança de URL, método ou shape |

**Riscos específicos por degrau:**

- **D1 (Angular/Material 15) — o degrau mais arriscado da escada, e não é o último.**
  O Material 15 reescreveu todos os componentes sobre MDC, **renomeando as classes internas**. O
  projeto sobrescreve **10 classes em 2 arquivos** (A1): `styles.scss`
  (`.mat-form-field-appearance-fill` ×7, `.mat-form-field-infix` ×3, `.mat-form-field-flex` ×3,
  `.mat-form-field-underline`, `.mat-form-field-label` via `::ng-deep`, `.mat-input-element`,
  `.mat-snack-bar-container`, `.mat-simple-snack-bar-content`) e
  `produtores.component.scss` (`.mat-form-field-flex`, `.mat-form-field-infix`) — contra **33
  `<mat-form-field>`** em templates. Essas sobrescritas **deixam de aplicar silenciosamente**:
  build e testes passam, o visual dos formulários quebra.

  **Procedimento determinístico (substitui descoberta livre):**
  1. Antes: screenshots de baseline já existem (Etapa 1).
  2. `ng update @angular/material@15`.
  3. Resolver o mapeamento por evidência, não por memória:
     ```bash
     grep -o 'mat-mdc-form-field[a-z-]*' node_modules/@angular/material/prebuilt-themes/indigo-pink.css | sort -u
     grep -o 'mat-mdc-snack-bar[a-z-]*\|mdc-snackbar__[a-z]*'  node_modules/@angular/material/prebuilt-themes/indigo-pink.css | sort -u
     ```
     Regra esperada: `.mat-X` → `.mat-mdc-X`. Confirmar cada uma; as que não tiverem equivalente
     direto (previsivelmente `underline` e `simple-snack-bar-content`, cuja estrutura MDC muda)
     resolvem-se pela API de tema suportada, não por seletor interno.
  4. Comparar screenshots. Diferença visual = degrau não concluído.

  **Não** apoiar em `mat-legacy-*`: existe no 15/16 e **é removido no 17 (D3)**.

- **D3 (Angular 17):** troca do builder (`browser` → `application`/esbuild) e reorganização de
  `angular.json`. Primeiro degrau que **exige** abandonar o Node 16. Material 17.3.10 é a última
  versão vulnerável (A11) — o D4 fecha o advisory de Material/CDK.
- **D5 (Angular 19):** componentes passam a standalone por padrão; a migração injeta
  `standalone: false` nos ~70 componentes dos 4 NgModules. **Maior alteração automática da escada** —
  revisar o diff integral antes de commitar.
- **D6 (Angular 20):** split do pacote `@angular/build`; remoção de APIs depreciadas.
- **D7 (Angular 21) — CHECKPOINT.** Estado entregável e mergeável em `dev`. Rodar validação completa
  + checklist manual integral (`docs/areas/validacao-qa.md`). **Se o D8 falhar, esta é a entrega.**
- **D8 (Angular 22):** força **TypeScript 6.0** (`>=6.0 <6.1`) — compilador major novíssimo, o maior
  desconhecido do plano. Sobe `@ng-bootstrap` a 21.0.0 e `@angular/material` a 22.1.0. `moment`
  sobrevive (A10). **Timebox:** se não fechar em uma sessão, parar em D7 e reavaliar.

---

### Etapa 12 — Karma → Vitest

**Por que é obrigatória:** `npm audit` reporta 4 pacotes Karma (`karma`, `karma-coverage`,
`karma-jasmine`, `karma-jasmine-html-reporter`) com `fixAvailable: karma@0.12.33` — um *downgrade*,
que é como o npm expressa "não há correção futura". Enquanto o Karma estiver instalado, **o
`npm audit` nunca fecha**, em nenhuma versão do Angular.

**Por que só agora:** `@angular/build@22.1.0` mantém `karma ^6.4.0` como peer **opcional**, ao lado
de `vitest ^4.0.8` (A8). A rede de 115 testes atravessa a escada intacta e só é trocada quando não
há mais degraus para validar.

- Migrar os alvos `test` e `test-focus` de `angular.json` para `@angular/build:unit-test` com
  `runner: vitest`.
- Portar os 54 specs. A API do `TestBed` é a mesma; muda o arcabouço: `jasmine.createSpy` → `vi.fn`,
  `spyOn`, matchers.
- Atualizar `tsconfig.spec.json` e `tsconfig.spec.focus.json` (`"types": ["jasmine"]` → vitest).
- Remover `karma.conf.js`, `karma-*`, `jasmine-core`, `@types/jasmine`.
- **Preservar a distinção `test` vs `test:focus`** (`src/test.ts` / `src/test.focus.ts`).

**DoD:** os **115 testes** continuam existindo e passando. Reduzir a contagem exige justificativa
explícita por teste — PROJECT_RULES §12 proíbe silenciar validação existente. `npm audit` = 0.
**Rollback:** `git reset --hard mig/d8`. **Ponto de não-retorno:** nenhum.

---

### Etapa 13 — Reflexo em build, scripts e limpeza

**Achado A13:** `deploy-to-vps.sh` **não fixa o Node local em lugar nenhum**. `build_frontend()`
(~linha 181) chama `npm run build` com o `node`/`npm` do `PATH` do operador — só o Node **remoto** é
resolvido (`resolve_remote_node_bin()`, do lote R1b). Hoje isso é um footgun silencioso: sem
`nvm use 16.20.2` prévio, o build do Angular 14 roda sob runtime não suportado. Depois da migração o
risco diminui (o alvo aceita Node 20/22/24), mas a lacuna permanece.

- Adicionar ao script a resolução do Node local a partir do `.nvmrc` da raiz, **reusando** a função
  `resolve_node_bin()` que já existe em `start.sh:80-109` — não reinventar.
- Registrar explicitamente: o frontend é buildado **localmente** e só o `dist/` vai por rsync
  (`upload_frontend()`, ~195). **O Node da VPS é irrelevante para o frontend.** A unificação de
  runtime desta migração é de desenvolvimento/CI, não de produção do frontend.
- `angular.json`: consolidar a remoção do CSS duplicado do Bootstrap (3c). **jQuery permanece** (A3).
- `start.sh`: remover o vocabulário de "ponte EOL" (18-19 e 74-79), já sem sentido.
- Atualizar `docs/SCRIPTS_SHELL.md` se o comportamento dos scripts mudar.

**Nenhum deploy nesta etapa.** A publicação é decisão e sessão do usuário.

---

## 8. Critérios de aceite

| # | Critério | Como verificar |
|---|---|---|
| 1 | `npm run build` (produção) conclui sem erro sob Node 24.18.1 | Saída do comando |
| 2 | **115 testes** passando (Vitest após a Etapa 12; Karma até lá) | Contagem, não só o status |
| 3 | `npm run e2e` verde com os 5 specs | Saída do comando |
| 4 | `npm audit` = **0 vulnerabilidades**, ou cada remanescente justificada nominalmente com `fixAvailable` e alcance | `npm audit` |
| 5 | `@angular/core` em 22.1.0 (ou 21.2.19, se o critério de parada do D8 for acionado) | `package.json` |
| 6 | `.nvmrc` da raiz = `server/.nvmrc` = `24.18.1` | Um único Node no projeto |
| 7 | `git diff` de `app-routing.module.ts` e `upload-file-routing.module.ts` **vazio** | `git diff` |
| 8 | Services de `src/app/service/` sem alteração de URL, método HTTP ou shape | `git diff` |
| 9 | Nomes de campo do `FormData` idênticos | `cy.intercept` do `upload.cy.ts` |
| 10 | Zero regressão visual nas 12 telas com `data-toggle` e nas telas com `<mat-form-field>` | Comparação com as screenshots de baseline |
| 11 | As 11 rules corrigidas acionam contra arquivos reais | `find` de cada glob |
| 12 | Nenhuma alteração em `server/` | `git diff --stat server/` vazio |
| 13 | jQuery preservado e ordem de `scripts` de `angular.json` intacta | `git diff angular.json` |

## 9. Validações recomendadas

- **Por etapa:** o bloco de 4 comandos (`build`, `test`, `e2e`, `audit`).
- **Antes da Etapa 3:** screenshots de baseline (geradas na Etapa 1).
- **Após D1 e após D8:** checklist manual integral de `docs/areas/validacao-qa.md`.
- **Após a Etapa 12:** confirmar a contagem de 115 testes, não só o verde.
- **Ao final:** `npm audit` completo; reconsultar os alertas do Dependabot **depois** do merge em
  `main` (a `main` mede a branch padrão — ver o relatório de recalibração).

## 10. Riscos e mitigação

| Risco | Sev. | Mitigação | Etapa |
|---|---|---|---|
| **Material 15 (MDC) quebra 10 sobrescritas `.mat-*` em 2 arquivos, silenciosamente** — build e testes passam, formulários quebram | **Alta** | Screenshots de baseline + procedimento determinístico de mapeamento por `grep` no pacote instalado (§7, D1). **Não** usar `mat-legacy-*` (removido no D3) | D1 |
| TypeScript 6.0 incompatível com o código sob `strict` + `strictTemplates` | **Alta** | D7 é checkpoint entregável; timebox no D8; parar em 21 é resultado **aceito**, não falha | D8 |
| Bootstrap 4→5: ~18 ocorrências estruturais sem cobertura automatizada | Média | Etapa isolada no Angular 14; screenshots antes/depois; checklist manual nas 12 telas | 3 |
| Migração automática do D5 altera ~70 componentes de uma vez | Média | Revisão integral do diff antes do commit; suíte Karma ainda intacta nesse ponto | D5 |
| Migrações automáticas convertem guards para functional guards | Média | Verificação explícita de `src/app/guards/*.ts` a cada degrau (invariante de `PROJECT_RULES §7`) | D1..D8 |
| Node 24 não roda o toolchain do Angular 14 | Média | Contingência já desenhada: manter 16.20.2 e reexecutar a etapa após o D2 | 2 |
| Regressão no ciclo de vida do WaveSurfer sem falhar teste | Média | `wavesurfer.js@7.12.3` é agnóstico de framework (risco baixo por natureza); spec Cypress cobre play/troca/áudio duplicado | D1..D8 |
| Etapa 12 reduz a contagem de testes durante o port | Média | Critério de aceite numérico (115); PROJECT_RULES §12 | 12 |
| Escada longa (8 degraus) esgota contexto/sessão | Média | Tag git por etapa + relatório de continuidade obrigatório ao fim de cada sessão | todas |
| Reordenar `scripts` de `angular.json` quebra as máscaras do checkout | Média | Proibição explícita (A5); spec `checkout.cy.ts` assere as máscaras | 3, 13 |
| `@ng-bootstrap` 21.0.0 é recente e pouco exercitado | Baixa | Concentrado no D8; parada em D7 (ng-bootstrap 20.0.0) é a saída | D8 |
| `@types/node` 12 → 24 quebra compilação | Baixa | Blast radius verificado: `tsconfig.app.json` tem `"types": []`; spec só usa `["jasmine"]` (A7) | 2 |

## 11. Restrições

- **Um major por etapa. Nunca agrupar degraus.**
- Não usar `--force` em `ng update` sem registrar a justificativa no relatório.
- `npm run lint` e `npm run typecheck` **não existem**. Não prometer nem reportar nenhum dos dois.
- Nada em `server/`.
- Nenhum deploy, nenhuma operação na VPS.
- Sem redesign visual — a migração preserva a identidade atual.
- Não adotar standalone/signals/zoneless como refatoração oportunista.
- Não remover jQuery (A3) nem reordenar `scripts` de `angular.json` (A5).
- Comandos contendo `deploy`, `curl`, `wget` ou `ssh` são negados pelo Bash desta configuração; usar
  `Read` para inspecionar `deploy-to-vps.sh`.

## 12. Instruções para continuidade Claude Code ↔ Codex

- Ao fim de **cada** etapa, gravar relatório em `docs/ia-auditorias/` no formato de
  `TEMPLATE-agent-report.md`, contendo: tag git criada, `npm audit` antes/depois, resultado dos 4
  comandos e os invariantes conferidos.
- Ao retomar: `git tag -l 'mig/*'` e `git log --oneline` para descobrir o degrau real — **não** supor
  a partir do último relatório (AGENTS.md §11).
- **Etapa 0 é pré-requisito absoluto.** Se as rules ainda proibirem a migração, o agente seguinte
  tem obrigação de bloquear.
- Etapas 0, 1 e 3 são independentemente valiosas e podem ser mergeadas em `dev` separadamente. Os
  degraus D1..D8 ficam na branch de feature até o checkpoint D7 ou o alvo D8.
- Não desfazer trabalho de outro agente sem evidência técnica.

## 13. Rollback e pontos de não-retorno

**Mecanismo único:** `git reset --hard mig/<etapa anterior> && rm -rf node_modules && npm ci`.

Não existe ponto de não-retorno **dentro** do repositório: tudo é reversível enquanto estiver em git
e nada tiver sido publicado. As fronteiras reais são três, e **nenhuma é atravessada por este plano**:

| Fronteira | O que muda | Como voltar |
|---|---|---|
| **D3** (Angular 17) | Node 16 deixa de rodar o toolchain | Reverter também o `.nvmrc` |
| **D3** (Material 17) | O escape `mat-legacy-*` é removido | Voltar ao D2; por isso o D1 não deve construir sobre ele |
| **Publicação do `dist/` novo na VPS** | Produção passa a servir o bundle migrado | **Fora do escopo deste plano.** Enquanto não ocorre, a produção segue intocada |

---

## Status do plano

**Aprovado** — completo e executável como escrito.

**Justificativa do status.** Um plano é `Aprovado` quando é completo, internamente consistente,
executável sem descoberta em aberto, e seus riscos residuais são **desenhados** (com mitigação e
ponto de decisão) em vez de desconhecidos. Os critérios foram verificados um a um:

| Critério | Estado |
|---|---|
| Decisão de alvo tomada e confirmada | Sim — §3, confirmada pelo usuário |
| Toda premissa herdada verificada | Sim — 8 corrigidas em §1, cada uma com evidência |
| Nenhuma descoberta livre delegada ao executor | Sim — a lista de §5.2 está fechada em 3 itens, cada um com procedimento determinístico |
| Riscos identificados, dimensionados e mitigados | Sim — §10, 12 riscos com mitigação e etapa |
| Rollback definido para toda etapa | Sim — §13, mecanismo único + 3 fronteiras nomeadas |
| Critérios de aceite objetivos e verificáveis | Sim — §8, 13 critérios com método de verificação |
| Comandos de validação existem de fato | Sim — só `build`, `test`, `test:focus`, `cypress:run`, `e2e` |
| Contrato de escrita respeitado | Sim — nenhum código alterado; só este arquivo de plano |

Riscos de **execução** permanecem — TS 6.0 no D8 e o MDC no D1 são os dois maiores. Isso não
qualifica o status: um plano que identifica, delimita e mitiga seus riscos, com ponto de parada
definido para cada um, é um plano aprovado. O que rebaixaria o status seria incógnita **sem
procedimento**, e as três que existiam na v1 foram fechadas (Apêndice A).

---

## Apêndice A — v2.0 vs v1.0

### A.1 Análise das observações da v1 (por que elas não sobreviveram)

A v1 fechou com `Aprovado com observações` e cinco observações. Reexaminadas uma a uma:

| # | Observação da v1 | Veredito | Destino na v2 |
|---|---|---|---|
| 1 | "Alvo, Cypress e Bootstrap confirmados pelo usuário" | **Não era ressalva** — é registro de decisão tomada | §3 (Decisão de alvo) e §4 (Escopo) |
| 2 | "Seis premissas do briefing corrigidas" | **Não era ressalva** — são correções já aplicadas e verificadas | §1, ampliado para 8 correções |
| 3 | "Dois riscos não dimensionados (MDC, `font-weight-bold`)" | **Parcialmente real.** Estavam dimensionados em volume, mas o MDC deixava descoberta em aberto | **Resolvido:** procedimento determinístico de mapeamento (§7, D1) + segundo arquivo afetado localizado (A1) |
| 4 | "11 patterns quebrados em 6 das 8 rules" | **Não era ressalva** — é achado enumerado com correção pronta | §7, Etapa 0c |
| 5 | "Nenhuma validação executada nesta sessão" | **Não era ressalva** — é conformidade com o Plan Mode, que proíbe executar | §Status (critério "contrato de escrita") |

**Conclusão da análise:** quatro das cinco observações estavam **arquivadas no lugar errado** —
eram decisões, achados e conformidade, não ressalvas pendentes. Apenas a #3 tinha resíduo real, e
ele era fechável sem executar nada. Por isso valeu resolver antes de gerar a v2: a alternativa
seria apenas renomear o status, o que não seria honesto.

### A.2 O que foi **corrigido**

| Correção | v1 dizia | v2 diz | Como se descobriu |
|---|---|---|---|
| **jQuery** | "Avaliar a remoção do `jquery.js` na Etapa 13" | **Impossível.** `inputMask.js` é o `jquery.inputmask.bundle.js` v3.3.4; `input_mask.js` usa `$(":input")` | Leitura do cabeçalho de `src/inputMask.js` e do conteúdo de `src/input_mask.js` |
| **`.mat-*` afetados** | Só `src/styles.scss` | **2 arquivos** — `produtores.component.scss` também sobrescreve `.mat-form-field-flex` e `.mat-form-field-infix` | `grep` de `.mat-*` em todos os `*.scss` |
| **Etapas 1 e 2** | Ordem assumida sem verificar compatibilidade | **Verificado:** Cypress 13.17.0 aceita Node 24 (`^16 \|\| ^18 \|\| >=20`) — sem conflito | `npm view cypress@13.13.1 engines` |
| **Material vulnerável** | Implícito que só o 22 fecharia | **Material 18+ já fecha** — o range é `<=17.3.10`; o `fixAvailable: 22.1.0` é conservadorismo de árvore do npm | `npm audit --json`, campo `range` |

### A.3 O que foi **adicionado**

| Adição | Por quê |
|---|---|
| **§2 — 15 achados verificados (A1–A15)**, com evidência e consequência | A v1 espalhava os achados pelo texto; a v2 os torna auditáveis em bloco |
| **Procedimento determinístico do MDC** (`grep` no pacote instalado, 4 passos) | Converte a única descoberta em aberto da v1 em rotina fechada |
| **`@types/node` 12.20.55 → ^24** com blast radius medido | Não estava na v1. `tsconfig.app.json: "types": []` limita o impacto a tooling — verificado, não suposto |
| **Proibição de reordenar `scripts` de `angular.json`** (A5) | `input_mask.js` acopla ao checkout (`#numerocartao1`, `#cpfBol`) via jQuery global no load |
| **`inputmask@5.0.8` é dependência morta** (A4) | Zero imports; registrado como ticket, não removido aqui |
| **`moment` sobrevive ao alvo** (A10) | `material-moment-adapter@22.1.0` ainda exige `moment ^2.18.1` — elimina um risco que seria natural supor |
| **Tabela de dependências entre etapas** (§4) | A v1 listava etapas em sequência sem tornar explícito o encadeamento |
| **Portão entre etapas** (§7) | Regra formal: nenhuma etapa inicia sem validação + tag + relatório da anterior |
| **`Definition of Done` por etapa** | A v1 misturava DoD com validação |
| **Tabela de baseline visual** (Etapa 1) | A v1 mencionava screenshots; a v2 define quais rotas e quando |
| **Tabela de specs Cypress** com asserção-chave por spec | A v1 descrevia os fluxos em prosa |
| **§13 — rollback e fronteiras em tabela própria** | A v1 diluía isso dentro da seção dos degraus |
| **§8 — critérios de aceite com coluna "como verificar"** | Torna cada critério acionável, não declarativo |
| **Justificativa do status em tabela de 8 critérios** | O status deixa de ser asserção e passa a ser demonstração |
| **Este apêndice** | Rastreabilidade entre versões |

### A.4 O que foi **melhorado** (sem mudar de conteúdo)

- **Achados separados de decisões.** A v1 misturava evidência, decisão e ressalva na seção de status.
- **Correções herdadas passaram de 6 para 8** — entraram a rule do player (1 → 11 patterns) e o
  jQuery removível.
- **Riscos ganharam coluna "Etapa"**, permitindo ler a tabela como cronograma de atenção.
- **D1 promovido a risco de severidade Alta**, com a frase explícita *"o degrau mais arriscado da
  escada, e não é o último"* — na v1 aparecia depois do TS 6.0 na leitura, sugerindo ordem inversa
  de preocupação.
- **A lista "a verificar durante a execução" encolheu de aberta para 3 itens fechados**, cada um com
  procedimento — é a diferença material entre `Aprovado com observações` e `Aprovado`.

### A.5 Validação das informações apresentadas

Toda afirmação numérica ou de versão desta v2 tem origem verificável nesta sessão:

| Fonte | O que sustenta |
|---|---|
| `npm view` (engines, peerDependencies, versions, dist-tags) | Matriz de degraus (§3.1), lockstep do ng-bootstrap, faixas de Node e TypeScript, A8, A9, A10 |
| `npm audit --json` (read-only) | 62 vulnerabilidades, `fixAvailable` por pacote, ranges dos advisories, A11, a evidência do Karma |
| `WebFetch` de `angular.dev/reference/releases` | Datas de release e fim de suporte de v20/v21/v22; política 12+12; "v2 to v19 are no longer supported" |
| `grep`/`find` em `src/` | Contagens de Bootstrap (487), `.mat-*` (A1), `data-toggle` por arquivo, A12 |
| Leitura direta de arquivos | `angular.json`, `styles.scss`, `tsconfig*.json`, `package.json`, `start.sh`, `deploy-to-vps.sh`, `src/inputMask.js`, `src/input_mask.js` → A3, A5, A7, A13, A14, A15 |
| Relatórios em `docs/ia-auditorias/` | Contexto do R1b (PM2 `--interpreter`, nvm, dois Nodes) e da recalibração da T1 |

**Limite declarado:** o mapeamento exato `.mat-*` → `.mat-mdc-*` **não** foi verificado nesta sessão
— a documentação do Material não retornou o conteúdo necessário. Por isso a v2 **não afirma o
mapeamento**; ela especifica o comando que o resolve por evidência contra o pacote instalado, no
momento do D1. Essa é a diferença entre uma incógnita e um procedimento.

---

## Apêndice B — Prompt de kickoff da Etapa 0

Nenhum command existente do MokBeats cobre "atualizar regras/rules/docs sem tocar `src/`" como
tarefa dedicada. O mais próximo é `create-code` (implementação com escopo controlado, aplica a
skill `senior-code-agent`), mas seu checklist assume alteração de código de aplicação. Por isso o
prompt de kickoff abaixo:

- **Não invoca `/create-code`** — referencia a metodologia (`senior-code-agent`) diretamente, sem o
  checklist de código de aplicação que não se aplica à Etapa 0.
- **Usa o formato de saída do command `architecture-decision`** para o ADR (0a), por ser
  exatamente o contrato desse command.
- **Usa o `TEMPLATE-agent-report.md`** para o relatório de continuidade, com o nome de arquivo já
  no padrão `YYYY-MM-DD__escopo__agente.md` observado no diretório.
- Aponta a correção de numeração do ADR (`0002-`, não `0001-`) encontrada nesta sessão.

Este prompt é o texto a colar em uma nova sessão do Claude Code (terminal integrado do VS Code)
para iniciar a execução real, começando pela Etapa 0.
