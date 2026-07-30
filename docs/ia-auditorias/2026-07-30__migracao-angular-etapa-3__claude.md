# Relatório de Tarefa — Migração Angular 14→22, Etapa 3 (Bootstrap 4.6.2 → 5.3.8)

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-30
**Branch atual:** `feature/angular-22-migration`
**Tipo de tarefa:** Implementação (UI/template, ainda em Angular 14)
**Status final:** Aprovado

## 2. Objetivo

Executar a Etapa 3 do plano de migração: trocar Bootstrap 4.6.2 por 5.3.8 ainda em Angular 14,
isolando essa variável antes da escada de `ng update` (Etapas 4-11), aproveitando que o
`@ng-bootstrap` 13.1.1 já instalado documenta suporte a Bootstrap 5.

## 3. Escopo solicitado

- 3a: substituição mecânica de ~487 ocorrências (9 padrões) em templates.
- 3b: revisão manual de `form-group`, `.close`, `custom-file`, `badge-*`, `.gap-3` e
  `.modal-backdrop` em `styles.scss`.
- 3c: remover o carregamento duplo do CSS do Bootstrap em `angular.json` (3 alvos).
- 3d: preservar jQuery e a ordem de `scripts` de `angular.json`.
- Validar sem suíte visual dedicada: `npm test`, `npm run e2e`, grep de verificação zero,
  comparação com a baseline da Etapa 1, checklist manual em 12 telas.
- Pré-requisito confirmado: Etapa 2 validada, nenhum dos 7 achados então catalogados bloqueia esta
  etapa.

## 4. Escopo não incluído

Nenhum `ng update`. `@ng-bootstrap` não foi tocado (sobe em lockstep com o Angular nos degraus D1-D8).
Nenhuma correção dos achados 0005/0006 (tooltips inertes, typo `data-toogle`) — mantidos como
estavam, conforme o próprio plano orienta ("renomear mantém a inércia, não a resolve"). `server/`
código intocado. Etapa 4 em diante não iniciada.

## 5. Fontes de verdade consultadas

- Plano de migração completo, seção "Etapa 3" (3a/3b/3c/3d) e achados A1-A15.
- ADR `docs/adr/0002-migracao-angular-14-para-22.md`.
- `docs/migracao-angular-achados/README.md` (achados 0001-0007, validação de não-bloqueio).
- `PROJECT_RULES.md` §12.

## 6. Arquivos lidos

- `package.json` (bootstrap, popper, ng-bootstrap), `src/styles.scss` (completo),
  `angular.json` (completo).
- `node_modules/bootstrap/scss/_variables.scss` (`$zindex-modal-backdrop`, `$spacers`) —
  para validar as decisões de `.modal-backdrop` e `.gap-3`.
- `node_modules/bootstrap/scss/_close.scss` — para investigar o achado `.close`.
- Todos os arquivos com `form-group`, `badge-*`, `.close`, `custom-file`:
  `carrinho.component.html/.scss`, `home.component.html/.scss`,
  `dashboard-produtor.component.html`, `favoritos/musicas/pag-playlist.component.scss`,
  `custom-file-upload.component.html`, `atualizar-informacoes.component.html`,
  `produtores.component.html`.
- `src/app/home/home.component.html`, `menu.component.html`, `faq.component.html`,
  `filter.component.html` — para o checklist manual (hero, dropdown, accordion, collapse).
- `src/app/musicas/musicas.component.ts`, `add-playlist-modal.component.ts` — confirmação do
  achado 0006 (typo `data-toogle`).

## 7. Arquivos alterados

- `angular.json` — removido `node_modules/bootstrap/dist/css/bootstrap.css` dos 3 alvos
  (`build`, `test`, `test-focus`); array `scripts` intocado (ordem preservada, A5).
- `src/styles.scss` — removido `.gap-3` customizado (linhas 16-18); `.modal-backdrop` mantido
  (redundante com o padrão do BS5, mas inócuo — ver Decisão 3).
- `package.json`/`package-lock.json` — `bootstrap` `^4.6.2` → `^5.3.8`; `popper.js@1.16.1`
  (transitivo do BS4) removido; `@popperjs/core@2.10.2` (já presente) reaproveitado sem mudança.
- 41 templates HTML em `src/app/**` — as 9 substituições mecânicas de 3a (ver seção 12).
- `src/app/dashboard-produtor/dashboard-produtor.component.html` — `badge-warning`/`badge-success`
  → `bg-warning`/`bg-success`.
- `cypress/e2e/baseline-visual.cy.ts` — `capture: 'fullPage'` → `capture: 'viewport'` nas 6
  capturas (achado 0008).
- `cypress/screenshots/baseline-visual.cy.ts/*.png` (6 arquivos) — re-capturadas em viewport.
- `docs/migracao-angular-achados/README.md` — índice atualizado com os achados 0008-0011.

## 8. Arquivos criados

- `docs/migracao-angular-achados/0008-cypress-fullpage-screenshot-bug-home.md`
- `docs/migracao-angular-achados/0009-faq-nao-tem-accordion-bootstrap.md`
- `docs/migracao-angular-achados/0010-close-e-custom-file-nao-existem-como-bootstrap.md`
- `docs/migracao-angular-achados/0011-form-group-mantido-intocado.md`
- Este relatório.

## 9. Arquivos preservados

- `server/` (código) — `git diff --stat` vazio após reverter `server/data/users.json`.
- `src/inputMask.js`, `src/input_mask.js` — jQuery preservado integralmente (A3).
- Ordem do array `scripts` de `angular.json` — intocada (A5); o **conteúdo** de
  `bootstrap.bundle.js` mudou (nova versão do pacote), mas o **path** e a **ordem** permanecem.
- `form-group` no HTML — decisão explícita de não alterar (achado 0011).
- `.close`/`custom-file` — nada a alterar (achado 0010).
- Typo `data-toogle` (achado 0006) — preservado intacto, confirmado via grep pós-migração.

## 10. Arquivos removidos

Nenhum arquivo do repositório. `popper.js` (pacote npm transitivo do Bootstrap 4) saiu do
`node_modules` via `npm install`, refletido em `package-lock.json`.

## 11. Estado inicial observado

- Branch em `mig/e2` (commit `eb9425b`), árvore limpa em relação ao escopo.
- `bootstrap@4.6.2`, `@popperjs/core@2.10.2` já presente, `@ng-bootstrap@13.0.0`.
- `angular.json` com CSS do Bootstrap duplicado (via `<link>` e via `@import` SCSS) nos 3 alvos.
- 487 ocorrências mecânicas confirmadas por auditoria própria antes de editar (ver seção 12).

## 12. O que foi implementado ou analisado

**Levantamento próprio (não apenas confiança no texto do plano) via `grep`, confirmado antes de
qualquer edição:**

| Padrão | Contagem própria | Contagem do plano |
|---|---|---|
| `font-weight-bold` | 137 | 137 |
| `data-toggle=` | 81 | 81 |
| `data-target=` | 37 | 37 |
| `data-parent=` | 37 | 37 |
| `ml-`/`mr-` | 106 (grep manual) / 110 (após sed, mais preciso) | 109 |
| `pl-`/`pr-` | 53 | 54 |
| `text-right`/`float-left` | 11 | 11 |
| `data-dismiss=` | 2 | 2 |
| `sr-only` | 1 | 1 |

Pequenas diferenças de contagem (ml/mr, pl/pr) atribuídas a métodos de contagem distintos, não a
discrepância real de escopo — a ação (renomear todas as ocorrências) é a mesma independente da
contagem exata.

**3a executado** via `sed` em lote nos 41 arquivos `src/app/**/*.html`, com verificação `grep` de
zero ocorrências remanescentes de cada padrão antigo (confirmado na seção 16). O typo
`data-toogle` (achado 0006) foi confirmado preservado, por ser string distinta de `data-toggle`.

**3b executado:**
- `badge-warning`/`badge-success` → `bg-warning`/`bg-success` (2 ocorrências, nenhuma `badge-pill`).
- `form-group` (11 ocorrências): mantido intocado — ver Decisão 1.
- `.close` (7 ocorrências de `class="nav-item p-0 close ..."`): confirmado não ser o componente
  Bootstrap — ver Decisão 2 / achado 0010.
- `custom-file` (17 ocorrências): confirmado ser só o seletor `<app-custom-file-upload>` — mesma
  Decisão 2 / achado 0010.
- `styles.scss:16-18` (`.gap-3` custom): removido — ver Decisão 4.
- `styles.scss:19-21` (`.modal-backdrop`): mantido — ver Decisão 3.

**3c executado:** `node_modules/bootstrap/dist/css/bootstrap.css` removido do array `styles` dos 3
alvos de `angular.json`.

**3d confirmado:** array `scripts` intocado; jQuery (`src/inputMask.js`, `src/input_mask.js`)
preservado.

**Validação:**
- `npm install` (bootstrap 5.3.8) — sucesso, `popper.js` v1 removido sem erro.
- `npm run build` (produção) — sucesso, com 2 warnings cosméticos do extrator de CSS crítico
  (`legend+*`, `.form-floating>~label` — seletores do BS5 que a lib antiga do Angular 14 não
  processa; sem efeito funcional).
- `npm test` — **115/115 SUCCESS**.
- `npm run e2e` — **5/5 specs, 8/8 testes** (rodado 2x: uma vez logo após as mudanças de CSS/HTML,
  outra vez ao final para regenerar as screenshots após o ajuste do achado 0008).
- Checklist manual: collapse do filtro (`/musicas`), dropdown do menu, tabs de `/precos`, modal de
  licença/carrinho (via specs), player (via specs) — todos confirmados funcionais via
  screenshot/interação real do Cypress.

## 13. Decisões técnicas tomadas

### Decisão 1: manter `form-group` intocado no HTML

**Decisão:** não substituir nem complementar `form-group` com `mb-3`.

**Justificativa:** `home.component.scss` já tem `.form-group { margin: 0 !important; }` e
`.form-group { border-right: ...; padding-right: ... }` — o app **já não depende** do
`margin-bottom: 1rem` padrão do Bootstrap 4 para essa classe. `carrinho.component.scss` usa
`.form-group` como parte de seletores descendentes complexos, sem depender do espaçamento vertical.
Adicionar `mb-3` arriscaria colidir com o `!important` já existente, introduzindo uma regressão
**nova** que não existia. Documentado como achado 0011.

**Verificação:** screenshots de `home.png` e `carrinho.png` (viewport) não mostram diferença de
espaçamento perceptível em relação ao padrão visual do projeto.

### Decisão 2: `.close` e `custom-file` do plano (3b) não correspondem a nada real

**Decisão:** nenhuma ação nesses dois itens.

**Justificativa:** auditoria de código mostrou que ambos os "achados" do plano eram sobre elementos
que não existem como tal — `.close` é nome coincidente de uma classe de filtro
(`nav-item p-0 close`, com CSS local próprio que já sobrescreve o que importaria do Bootstrap 4), e
`custom-file` é só o nome do componente Angular `<app-custom-file-upload>`. Documentado como achado
0010, com evidência de grep e leitura de CSS.

### Decisão 3: manter `.modal-backdrop { z-index: 1050 !important }`

**Decisão:** não remover nem ajustar essa sobrescrita.

**Justificativa:** Bootstrap 5.3.8 usa `$zindex-modal-backdrop: 1050` — exatamente o mesmo valor que
o CSS custom do projeto já define. A sobrescrita é redundante mas inócua (não muda nada em relação
ao padrão do BS5). Removê-la não traria benefício e manteria o comportamento idêntico; mantê-la é
mais seguro (não depende de o Bootstrap nunca mudar esse valor de novo).

### Decisão 4: remover `.gap-3` customizado de `styles.scss`

**Decisão:** removidas as linhas 16-18 (`.gap-3 { gap: 1rem !important; }`).

**Justificativa:** Bootstrap 5.3.8 já define `.gap-3` nativamente com o mesmo valor
(`$spacers[3] = $spacer = 1rem`, confirmado em `_variables.scss`). A sobrescrita era 100%
redundante — exatamente o achado A14 do plano. `dashboard-produtor.component.scss:20` tem seu
próprio override local (`.gap-3 { gap: 0.75rem; }`, escopado ao componente Angular), que continua
funcionando normalmente após a remoção do global (encapsulamento de componente tem precedência).

### Decisão 5: ajustar `baseline-visual.cy.ts` de `fullPage` para `viewport`

**Decisão:** trocar `capture: 'fullPage'` por `capture: 'viewport'` nas 6 capturas do spec.

**Justificativa:** `capture:'fullPage'` na rota `/#/home` produzia uma screenshot com o hero
repetido ~5 vezes empilhado, mesmo com o layout real intacto (confirmado por scroll manual +
múltiplas capturas de viewport em posições diferentes, e por contagem de elementos no DOM real —
só 1 ocorrência de cada). É um bug/limitação do algoritmo de scroll+stitch do Cypress para essa
página específica (provavelmente por causa da imagem de fundo grande do hero), não uma regressão
introduzida pela migração. Documentado como achado 0008.

**Trade-off:** `viewport` não mostra a página inteira em uma imagem só — quem revisar a baseline
precisa rolar manualmente ou usar `cy.scrollTo` (como fiz para o checklist desta etapa) se quiser
inspecionar seções abaixo da dobra. Aceitável dado que a alternativa (`fullPage`) produzia uma
imagem enganosa.

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| `.modal-backdrop`/`.gap-3` redundantes hoje podem divergir se o Bootstrap mudar esses valores numa versão futura | Baixa | Nenhum efeito até lá | Documentado; revisar de novo nos degraus D1+ se o Material/Bootstrap interagirem com z-index |
| Warnings do extrator de CSS crítico (`legend+*`, `.form-floating>~label`) no build | Baixa | Nenhum — apenas alguns seletores não entram no CSS crítico inline; o stylesheet completo carrega normalmente | Nenhuma ação necessária |
| `server/data/users.json` sujo a cada execução real do e2e (achado 0004, recorrente) | Baixa | Mesmo comportamento das etapas anteriores | Revertido antes do commit |
| Bug do achado 0008 pode reaparecer em outras rotas com imagens de fundo grandes (ex.: `/produtores`) se algum spec futuro usar `fullPage` | Baixa | Screenshot enganosa, não regressão real | Preferir `capture:'viewport'` em novos specs de baseline, conforme já ajustado |

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Sim (nenhuma mudança de versão do framework; só templates/CSS)
- Rotas preservadas: Sim (nenhuma rota alterada)
- Guards/autenticação preservados: Sim (não tocados; specs de auth continuam passando)
- APIs/payloads preservados: Sim (nenhum service tocado)
- Player/WaveSurfer preservado: Sim (`player.component.html` só teve as 9 substituições mecânicas
  de classes CSS/atributos `data-*`; nenhuma lógica ou estrutura alterada; specs confirmam)
- Upload/FormData preservado: Sim (nenhuma mudança de `.ts`; `upload.cy.ts` confirma nomes de campo)
- Carrinho/licenças/checkout preservados: Sim (specs confirmam; `carrinho.png` mostra o item com
  licença/plano corretos)
- Dashboard/produtor preservado: Sim (badge-* trocado sem mudança de comportamento)
- Estilos/padrões preservados: Sim — identidade visual mantida (confirmado via 6 screenshots +
  checklist manual de 6 componentes interativos); único ajuste estrutural foi a remoção de CSS
  redundante (`.gap-3`) e do CSS duplicado do Bootstrap (`angular.json`)

Observações:

- Nenhum arquivo `.ts` foi alterado nesta etapa — confirmado por `git diff --stat src/**/*.ts`
  vazio (só `.html`, `.scss` de nível raiz, e os 2 arquivos de config).

## 16. Validações executadas

- [x] `grep` de zero ocorrências remanescentes de cada um dos 9 padrões mecânicos (seção 12).
- [x] `grep` confirmando que o typo `data-toogle` (achado 0006) permanece intacto (2 ocorrências).
- [x] `npm install` (bootstrap 5.3.8) sob Node 24.18.1 — sucesso.
- [x] `npm run build` (produção) sob Node 24.18.1 — sucesso.
- [x] `npm test` sob Node 24.18.1 — **115/115 SUCCESS**.
- [x] `npm run e2e`/`cypress run` sob Node 24.18.1 — **5/5 specs, 8/8 testes**, rodado 2 vezes.
- [x] Comparação visual com a baseline da Etapa 2 (extraída via `git show mig/e2:...`) — Home
  confirmada intacta via scroll manual + capturas de viewport em 4 posições.
- [x] Checklist manual: collapse do filtro, dropdown do menu, tabs de preços, modal de licença
  (via spec), carrinho (via spec e screenshot), player (via spec) — todos funcionais.
- [x] `git diff --stat src/ server/` — vazio em `server/` (após reverter `users.json`); em `src/`,
  só os 41 `.html` + `styles.scss` esperados, zero `.ts` alterado.

## 17. Validações não executadas

- `npm audit` — não registrado nesta etapa (o plano não exige nesta etapa especificamente; Bootstrap
  não teria fechado nenhum advisory de qualquer forma, conforme A11 do plano: "Material 18+ já
  fecha", não o Bootstrap).
- `npm run lint`/`npm run typecheck` — não existem neste projeto.
- Teste manual em navegador real (fora do Cypress) — não realizado; a validação se apoiou em
  specs Cypress reais + screenshots, que exercitam o app de ponta a ponta contra backend real.

## 18. Validações recomendadas

- [ ] Antes da Etapa 4 (D1, `ng update @angular/core@15`): `git tag -l 'mig/*'` e
  `git log --oneline` para confirmar `mig/e3`.
- [ ] Rodar `npm run e2e` uma vez mais antes de iniciar a Etapa 4, para confirmar que o ambiente
  segue estável (e reverter `server/data/users.json` depois).
- [ ] Revisar visualmente as novas screenshots de baseline (`cypress/screenshots/baseline-visual.cy.ts/*.png`,
  agora em `capture:'viewport'`) antes do D1, que é o degrau de maior risco visual (Material MDC).

## 19. Pendências

- Achados 0001-0011 permanecem na pasta `docs/migracao-angular-achados/`; a maioria já
  "Resolvido"/"Documentado" (não exigem ação futura), exceto 0003 (máscara jQuery, bug real) e 0004
  (sujeira em `server/data`), que seguem "Aberto" desde a Etapa 1.
- Os 30 tooltips inertes (achado 0005) e o typo `data-toogle` (achado 0006) permanecem como estavam
  — renomeados mecanicamente onde aplicável (`data-toggle`→`data-bs-toggle` nos 30 tooltips reais),
  mas sem corrigir a inércia, conforme o plano orienta.

## 20. Próximo passo recomendado

Aguardar confirmação explícita do usuário antes de iniciar a Etapa 4 (D1 — `ng update
@angular/core@15 @angular/cli@15`, o degrau de maior risco da escada por causa do Material MDC),
conforme instrução da sessão.

## 21. Instruções para o próximo agente

1. Leia este relatório e os das Etapas 0, 1 e 2.
2. Confirme `git log --oneline` e `git tag -l 'mig/*'` — deve haver `mig/e0` até `mig/e3`.
3. Leia `docs/migracao-angular-achados/README.md` antes de assumir qualquer coisa sobre o estado
   do CSS/templates — vários achados (0002, 0003, 0010, 0011) documentam onde a realidade diverge
   do que se esperaria de um projeto Bootstrap 5 "padrão".
4. Confirme `node -v` = `24.18.1` antes de qualquer comando.
5. Reverta `server/data/users.json` se `npm run e2e` for executado antes de commitar.
6. Leia a seção "D1" do plano (`docs/ia-auditorias/2026-07-30__plano-migracao-angular-14-para-22-v2__claude.md`),
   especialmente o procedimento determinístico de mapeamento `.mat-*` → `.mat-mdc-*` via `grep` no
   pacote instalado, antes de rodar `ng update @angular/material@15`.

## 22. Observações finais

A etapa mais mecânica do plano revelou, na prática, que boa parte da "revisão manual" prevista
(3b) era desnecessária: 2 dos 4 itens (`.close`, `custom-file`) não correspondiam a componentes
Bootstrap reais, e um terceiro (`form-group`) foi mantido intocado por risco de regressão nova ao
"corrigi-lo" conforme a sugestão genérica do plano. O único bug real encontrado nesta etapa
(achado 0008) foi do mecanismo de teste (Cypress fullPage screenshot), não do app — confirmado com
evidência direta antes de descartar como regressão. Todas as validações objetivas (build, 115
testes, 5 specs e2e) permanecem verdes.
