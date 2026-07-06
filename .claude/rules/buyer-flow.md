---
paths:
  - "src/app/home/**/*"
  - "src/app/menu/**/*"
  - "src/app/components/filter/**/*"
  - "src/app/components/pagination/**/*"
  - "src/app/faq/**/*"
  - "src/app/footer/**/*"
---

# Buyer discovery and navigation

Derived from `docs/areas/modulos/home.md`, `header-menu.md`, `faq.md`, and `footer.md`
(PROJECT_RULES.md §9.1, §9.2, §9.13, §9.14); if this file diverges, update the project rule first.

- This rule covers buyer discovery/navigation (home, menu, filters, pagination, faq, footer). The
  purchase path (music/effects → license → cart → checkout) is owned by `license-cart-checkout.md`.
- Preserve internal navigation with `routerLink`; never introduce empty or broken links.
- Keep the cart counter, responsive menu, and MokBeats Hub link working in the header.
- Preserve institutional links and correct labels in the footer/FAQ.
- Prefer localized fixes; do not restructure navigation or routing without authorization.
