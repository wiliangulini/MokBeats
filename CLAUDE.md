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

- Preserve the NgModule structure and existing routes; version migration only via an approved plan (`docs/adr/0002-migracao-angular-14-para-22.md`).
- Preserve `AuthGuard`, `ProdutorGuard`, token/profile flow, and current API contracts.
- Preserve WaveSurfer lifecycle and player behavior.
- Preserve upload `FormData` field names unless backend validation explicitly supports change.
- Preserve license selection before cart/checkout flow.

## Commands, skills, and rules

- **Commands** (`.claude/commands/*`) are explicit entrypoints (`/name` + `$ARGUMENTS`) that set the mode, the checklist, the allowed output, and — for review/audit — a write contract.
- **Skills** (`.claude/skills/**`) are reusable methodologies and specialized knowledge; a skill does not grant authorization to edit files.
- **Rules** (`.claude/rules/*`) are domain invariants activated by matching `paths` (map in `AGENTS.md §8`); they are not executable workflows.
- Do not invoke an equivalent command and skill simultaneously; pick the most specific resource for the task.
- Review/audit commands do not change implementation; they may write only the report whose exact path is authorized in the arguments.
- The common protocol (validation block, report format, prohibitions) lives in `PROJECT_RULES.md` and `AGENTS.md`; commands and rules reference it, they do not recopy it.

## Scope control

- Do not duplicate module-specific rules here; keep those in `.claude/rules/`.
- Do not create new rules files unless they remove real recurring ambiguity.
- Do not keep the same workflow in both `.claude/skills/` and `.claude/commands/`.

## Output contract

- Separate facts, hypotheses, risks, and recommendations.
- Before concluding, review the diff and confirm you stayed in scope.
- Report validations executed, validations not executed, residual risks, and final status.
