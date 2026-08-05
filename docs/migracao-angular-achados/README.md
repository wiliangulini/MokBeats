# Achados da migração Angular 14 → 22

Índice de observações, divergências e bugs encontrados durante a execução das 13 etapas do plano
de migração (`docs/ia-auditorias/2026-07-30__plano-migracao-angular-14-para-22-v2__claude.md` e
ADR `docs/adr/0002-migracao-angular-14-para-22.md`). Cada achado que não bloqueia a etapa em
andamento é registrado aqui como um arquivo próprio, para resolução posterior — não se resolve nada
nesta pasta automaticamente; ela existe para não perder o achado entre sessões/agentes.

Esta pasta é cumulativa: novos achados de qualquer etapa (0 a 13) entram aqui, não só os da etapa
em que foram descobertos.

## Convenção

- Um arquivo por achado: `NNNN-slug-curto.md` (`NNNN` sequencial, 4 dígitos).
- Cada arquivo contém: Etapa de origem, Severidade, Status, Descrição, Evidência, Ação recomendada.
- Status possíveis: `Aberto` (precisa decisão/ação futura) · `Monitorar` (não é bug, mas merece
  atenção continuada) · `Resolvido` (referenciar o commit/etapa que resolveu).
- Achados que **bloqueiam** a etapa em andamento não vão para cá isolados — são resolvidos ou
  escalados na hora, e só documentados aqui depois de resolvidos (se relevante para o histórico).

## Índice

| ID | Título | Etapa origem | Severidade | Status |
|---|---|---|---|---|
| [0001](0001-cy-visit-sem-hash-quebra-navegacao-spa.md) | `cy.visit` sem hash carregava a Home em vez da rota pedida | 1 | Média | Resolvido (mig/e1) |
| [0002](0002-finalizar-compra-desconectado-do-carrinho.md) | `/finalizar-compra` não reflete o carrinho real | 1 | Baixa | Monitorar |
| [0003](0003-mascara-jquery-input-mask-nunca-aplica-spa.md) | Máscara de cartão/CPF (`input_mask.js`) nunca aplica em nenhuma rota | 1 | Média | Aberto |
| [0004](0004-server-data-sujo-por-execucao-e2e.md) | `server/data/users.json` é escrito a cada execução real do e2e | 1 | Baixa | Aberto |
| [0005](0005-tooltips-bootstrap-inertes.md) | 30 tooltips `data-toggle="tooltip"` inertes (sem JS de inicialização) | 0 (herdado do plano, A12) | Baixa | Aberto |
| [0006](0006-typo-data-toogle-add-playlist-modal.md) | Typo `data-toogle` — 2 ocorrências, não 1 (contagem corrigida) | 0 (herdado do plano, A12) | Baixa | Aberto |
| [0007](0007-inputmask-dependencia-morta.md) | `inputmask@5.0.8` (npm) instalado mas nunca importado | 0 (herdado do plano, A4) | Baixa | Aberto |
| [0008](0008-cypress-fullpage-screenshot-bug-home.md) | `cy.screenshot({capture:'fullPage'})` quebra na rota Home (bug do Cypress, não do app) | 3 | Baixa | Resolvido (mig/e3) |
| [0009](0009-faq-nao-tem-accordion-bootstrap.md) | FAQ não usa accordion do Bootstrap (correção de premissa do checklist) | 3 | Baixa | Resolvido (documentado) |
| [0010](0010-close-e-custom-file-nao-existem-como-bootstrap.md) | `.close` e `custom-file` do plano (3b) não existem como componentes Bootstrap reais | 3 | Baixa | Resolvido (documentado) |
| [0011](0011-form-group-mantido-intocado.md) | `form-group` mantido intocado (risco de colisão com CSS custom) | 3 | Baixa | Resolvido (documentado) |
| [0012](0012-test-focus-quebrado-apos-angular15.md) | `npm run test:focus` quebra após `ng update` para Angular 15 | 4 | Média | Resolvido (mig/e12) |
| [0013](0013-mat-label-mdc-cobre-inputs-cypress.md) | `<mat-label>` do MDC cobre o centro dos inputs, quebrando `cy.type()` sem force | 6 | Baixa | Resolvido (mig/d3) |
| [0014](0014-httpclienttestingmodule-orfao-apos-angular18.md) | `HttpClientTestingModule` órfão em `src/test.ts` após migração automática para Angular 18 | 7 | Baixa | Resolvido (mig/d4) |
| [0015](0015-moduleresolution-bundler-quebra-rxjs-antigo.md) | `moduleResolution: "bundler"` (migração automática do Angular 20) quebra resolução de tipos do `rxjs~7.4.0` | 9 | Baixa | Resolvido (mig/d6) |
| [0016](0016-control-flow-migration-obrigatoria-no-d7.md) | Migração de control-flow (`@if`/`@for`/`@switch`) rodou como obrigatória no D7, revertida (28 templates) | 10 | Baixa | Resolvido (mig/d7) |
| [0017](0017-testbed-relanca-ng0100-sem-providezonechangedetection.md) | `TestBed` relança `NG0100` sem `provideZoneChangeDetection()` no ambiente de teste (Angular 21) | 10 | Média | Resolvido (mig/d7) |
| [0018](0018-wave-surfer-test-spec-nao-definia-input-music.md) | `wave-surfer-test.component.spec.ts` não definia `@Input() music` antes de `detectChanges()` | 10 | Baixa | Resolvido (mig/d7) |
| [0019](0019-rxjs-bump-obrigatorio-no-d7.md) | `rxjs` precisou de bump para `~7.8.2` no D7 — `moduleResolution: bundler` passa a ser obrigatório | 10 | Baixa | Resolvido (mig/d7) |
| [0020](0020-cypress-ts5011-rootdir-tsconfig-extends.md) | TypeScript 6.0 (`TS5011`) quebra o `ts-loader` interno do Cypress via `tsconfig.json` com `extends` | 11 | Média | Resolvido (mig/d8) |
| [0021](0021-dist-output-muda-para-dist-browser.md) | Output da build de produção muda de `dist/` para `dist/browser/` | 12 | Alta | Resolvido (mig/e13) |
| [0022](0022-wavesurfer-exports-map-quebra-sob-esbuild.md) | `wavesurfer.js/dist/plugins/minimap` quebra sob esbuild; bug de empacotamento na versão 7.12.3 | 12 | Média | Resolvido (mig/e12) |
| [0023](0023-schematic-jasmine-vitest-gaps.md) | Lacunas do schematic `refactor-jasmine-vitest` (relatório dizia "0 TODOs", mas havia bugs reais) | 12 | Média | Resolvido (mig/e12) |
| [0024](0024-vitest-builder-config-zonejs-e-include.md) | Configuração do builder `unit-test`: `zone.js` nos polyfills e `include` explícito para `test-focus` | 12 | Média | Resolvido (mig/e12) |
