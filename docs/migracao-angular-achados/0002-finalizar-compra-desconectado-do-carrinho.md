# 0002 — `/finalizar-compra` não reflete o carrinho real

**Etapa de origem:** 1 (ampliar rede e2e Cypress)
**Severidade:** Baixa
**Status:** Monitorar

## Descrição

`FinalizarCompraComponent` (`src/app/finalizar-compra/finalizar-compra.component.ts`) não injeta
`CarrinhoService`. O total exibido é hardcoded (`total: string = '64,95'`) e o template não contém
os campos de cartão/CPF (`#numerocartao1`, `#cpfBol`) que o plano de migração presumia estarem ali.

Esses campos vivem, na verdade, em `FormasDePagamentoComponent`
(`src/app/formas-de-pagamento/`, rota `/formas-de-pagamento`, guard só `AuthGuard`) — uma rota
diferente, desconectada do fluxo carrinho → checkout.

## Evidência

Leitura direta de `finalizar-compra.component.ts` (sem injeção de `CarrinhoService`, `total`
hardcoded) e `finalizar-compra.component.html` (sem `#numerocartao1`/`#cpfBol`). Confirmado por
`grep` que esses IDs só existem em `formas-de-pagamento.component.html`.

## Ação recomendada

Não é um bug per se — é o estado atual da arquitetura do fluxo de compra (`/carrinho` →
`/finalizar-compra` → `/formas-de-pagamento` parecem ser telas de um wizard que nunca foi conectado
de ponta a ponta, ou que foram desenhadas para serem preenchidas independentemente). Decisão de
produto: se o fluxo de checkout deveria de fato mostrar o resumo do carrinho em
`/finalizar-compra`, é uma mudança de produto/funcionalidade, não de migração — deveria passar por
`/melhorar-ui-ux` ou um ticket de produto próprio, com validação humana antes (PROJECT_RULES.md
§13, "regras comerciais de licença" / "endpoint final de checkout" já exigem validação humana).

## Referências

`docs/ia-auditorias/2026-07-30__migracao-angular-etapa-1__claude.md`, seção 13.3.
`cypress/e2e/checkout.cy.ts` (comentário no topo do arquivo).
