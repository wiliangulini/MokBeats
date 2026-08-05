---
paths:
  - "src/app/**/*.module.ts"
  - "src/app/**/*-routing.module.ts"
  - "src/app/app.module.ts"
  - "src/main.ts"
  - "angular.json"
---

# Angular architecture

Derived from `docs/areas/arquitetura-angular.md` (PROJECT_RULES.md §6); if this file diverges, update the project rule first.

- Preserve the NgModule/component structure and existing routes; do not migrate Angular versions or introduce standalone/signals/zoneless patterns outside an approved plan (see `docs/adr/0002-migracao-angular-14-para-22.md`).
- Preserve existing routes and route order; do not change `useHash`, base href, or global routing without explicit authorization.
- Keep dependency injection, `app.module.ts` providers, and interceptor wiring intact unless the task explicitly targets them.
- Do not add, remove, or bump dependencies in `package.json`/`angular.json` without human approval, or outside the steps authorized by an approved migration plan.
- Prefer the smallest localized change; avoid global architecture edits without justification and validation.
