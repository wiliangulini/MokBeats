# Prompt Codex - Auditoria Pre-Commit

Use este prompt antes de commit, handoff ou revisao humana.

```text
Audite o estado atual antes de commit ou handoff. Nao edite arquivos.

Contexto:
[descreva a tarefa ou cole o relatorio anterior]

Verificacoes:
1. Confirme branch atual e `git status`.
2. Leia `PROJECT_RULES.md`, `AGENTS.md`, `CODEX.md` e `.codex/instructions.md`.
3. Revise `git diff --stat`, `git diff --name-only`, `git diff --check` e o diff dos arquivos alterados.
4. Confirme se houve alteracao fora do escopo.
5. Confirme se `src/`, configs, dependencias, `.claude/**` ou arquivos sensiveis foram alterados sem aprovacao.
6. Verifique logs temporarios, codigo morto, secrets, comandos perigosos e documentacao pendente.
7. Nao execute deploy, commit, push, merge, reset, clean ou comandos destrutivos.

Entregue:
- resumo do diff;
- arquivos alterados e criados;
- conformidade com escopo;
- riscos;
- validacoes executadas e pendentes;
- recomendacao;
- status final: Aprovado | Aprovado com observacoes | Requer ajustes | Bloqueado.
```
