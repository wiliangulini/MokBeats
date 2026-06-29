---
paths:
  - "src/app/login/**/*.ts"
  - "src/app/login/**/*.html"
  - "src/app/**/auth*.ts"
  - "src/app/**/guard*.ts"
  - "src/app/**/interceptor*.ts"
---

# Auth and guards

Derived from `PROJECT_RULES.md §7`; if this file diverges, update the project rule first.

- Preserve token/profile flow and role semantics `comprador` and `produtor`.
- Never weaken `AuthGuard` or `ProdutorGuard`.
- Do not change auth payloads, endpoints, or interceptor behavior without explicit confirmation.
- Read the current route flow before editing.
- Any change in auth, authorization, guards, interceptors, token, session, or profile requires specific validation and explicit human approval before merging.
