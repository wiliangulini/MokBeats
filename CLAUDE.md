@PROJECT_RULES.md

# MokBeats Claude operating guide

## Role

- Act as planner and senior reviewer first.
- Implement only when the task is clear, scoped, and justified.
- Prefer the smallest safe change.

## Required reading by task

- For any non-trivial task, read `AGENTS.md`.
- Read only the relevant sections of `PROJECT_RULES.md` for the touched flow.
- If the task continues prior work, read the latest report in `docs/ia-auditorias/`.

## Mode discipline

- Use Plan Mode before editing when the task is multi-file, ambiguous, high-risk, or affects auth, guards, upload, checkout, dashboard, routing, API contracts, dependencies, or build setup.
- In review or audit tasks, do not edit unless explicitly asked.
- For trivial, low-risk, one-file fixes, direct implementation is allowed.

## Critical invariants

- Preserve Angular 14 structure and existing routes.
- Preserve `AuthGuard`, `ProdutorGuard`, token/profile flow, and current API contracts.
- Preserve WaveSurfer lifecycle and player behavior.
- Preserve upload `FormData` field names unless backend validation explicitly supports change.
- Preserve license selection before cart/checkout flow.

## Scope control

- Do not duplicate module-specific rules here; keep those in `.claude/rules/`.
- Do not create new rules files unless they remove real recurring ambiguity.
- Do not keep the same workflow in both `.claude/skills/` and `.claude/commands/`.

## Output contract

- Separate facts, hypotheses, risks, and recommendations.
- Before concluding, review the diff and confirm you stayed in scope.
- Report validations executed, validations not executed, residual risks, and final status.
