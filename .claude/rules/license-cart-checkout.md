---
paths:
  - "src/app/carrinho/**/*"
  - "src/app/finalizar-compra/**/*"
  - "src/app/carrinho/cartModal/**/*"
  - "src/app/service/carrinho.service.ts"
  - "src/app/licenca-valor/**/*"
  - "src/app/musicas/**/*"
  - "src/app/efeitos-sonoros/**/*"
---

# License, cart, and checkout

Derived from `docs/areas/license-cart-checkout.md` (PROJECT_RULES.md §9.7 and §9.8); if this file diverges, update the project rule first.

- Preserve the flow: item → license selection → cart → checkout.
- Do not bypass license choice when a modal or explicit selection is expected.
- Preserve cart count reliability and checkout data needed downstream.
- Avoid direct DOM state for cart behavior in new code.
- Gateway and final checkout endpoint require human validation before any change.
