---
description: Perform a senior review of the current diff or scoped files in a fresh context.
disable-model-invocation: true
context: fork
---

Review: $ARGUMENTS

Requirements:

- Do not edit code.
- Review for scope adherence, regressions, auth/authorization, API contract, typing, UX, performance, and continuity with prior reports.
- Classify findings as Crítico, Alto, Médio, Baixo, or Observação.
- Report blockers separately from optional improvements.
- End with exactly one status: Aprovado | Aprovado com observações | Requer ajustes | Bloqueado.