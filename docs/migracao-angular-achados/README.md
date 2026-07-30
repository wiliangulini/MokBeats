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
| [0012](0012-test-focus-quebrado-apos-angular15.md) | `npm run test:focus` quebra após `ng update` para Angular 15 | 4 | Média | Aberto |
