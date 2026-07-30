---
paths:
  - "src/app/upload-file/**/*.ts"
  - "src/app/upload-file/**/*.html"
  - "src/app/upload-file/**/*.scss"
---

# Producer upload

Derived from `docs/areas/producer-upload.md` (PROJECT_RULES.md §9.9); if this file diverges, update the project rule first.

- Preserve real `FormData` field names and current backend contract unless backend explicitly verified.
- Do not make stems mandatory for `Single Track` mode.
- Keep validation messages explicit and preserve duration/file validations.
- Treat upload changes as sensitive and use Plan Mode when behavior is unclear.
- Do not alter payload field names without validating backend support.