---
description: Audit the current state before commit, handoff, or human approval in a fresh context.
disable-model-invocation: true
context: fork
---

Audit: $ARGUMENTS

Requirements:

- Do not edit code.
- Check diff scope, accidental files, logs, dead code, validation evidence, and sensitive changes.
- Confirm readiness for review, handoff, or commit.
- End with exactly one status: Aprovado | Aprovado com observações | Requer ajustes | Bloqueado.
