---
description: Continue a MokBeats task from a Codex report without losing scope or valid prior work.
disable-model-invocation: true
---

Continue from Codex: $ARGUMENTS

Requirements:

- Read the provided report first.
- Compare the report with actual git state before trusting it.
- Read changed files and the next relevant files only.
- Preserve valid prior work; do not revert without evidence.
- State divergences between report and repository if any.
- End with the next logical step and a fresh handoff summary.
