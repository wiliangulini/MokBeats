---
paths:
  - "src/app/dashboard-produtor/**/*"
  - "src/app/menu-produtor/**/*"
  - "src/app/pages/artist/**/*"
---

# Producer dashboard

Derived from `docs/areas/producer-dashboard.md` (PROJECT_RULES.md §9.11 and §9.12); if this file diverges, update the project rule first.

- Preserve route protection and producer-only access via `ProdutorGuard`.
- Prefer real service/data flow over permanent mocks.
- Handle loading and error states explicitly.
- Treat visual dashboard branches as reference only — never as blind merge sources.
- Dashboard must not be visible to users with `comprador` profile.
