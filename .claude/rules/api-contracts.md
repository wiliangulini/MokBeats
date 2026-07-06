---
paths:
  - "src/app/**/*.service.ts"
  - "src/app/services/**/*.ts"
  - "src/environments/**/*.ts"
---

# API contracts

No single project-rule section owns HTTP contracts; changes to backend payloads and endpoints
require human/backend validation per PROJECT_RULES.md §13 and evidence per AGENTS.md §5.

- Preserve HTTP methods, URLs, request/response shapes, status handling, pagination, filters, and ordering.
- Do not change field names, DTO shapes, or endpoints without confirming the backend supports it.
- Read the consumers of a service before changing its contract; keep existing components working.
- Do not hardcode secrets, tokens, or environment URLs; use `src/environments/*`.
- Any contract change must be declared explicitly in the final report with the backend evidence that justifies it.
