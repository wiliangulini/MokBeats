# Prompt Codex - Implementacao Controlada

Use este prompt quando ja existir um plano aprovado e a tarefa puder ser implementada com escopo restrito.

```text
Implemente somente o plano aprovado abaixo.

Plano aprovado:
[cole aqui o plano aprovado]

Regras:
1. Antes de editar, confirme branch atual e `git status`.
2. Leia `PROJECT_RULES.md`, `AGENTS.md`, `CODEX.md` e `.codex/instructions.md`.
3. Leia os arquivos diretamente relacionados ao plano antes de altera-los.
4. Altere somente os arquivos aprovados.
5. Preserve `src/`, `package.json`, lockfiles, `angular.json`, `tsconfig*.json`, `.claude/**` e arquivos de agentes fora do escopo, salvo aprovacao explicita.
6. Nao acesse `.env`, secrets ou credenciais.
7. Nao execute deploy, commit, push, merge, reset, clean ou comandos destrutivos.
8. Revise o diff antes de concluir.

Validacoes:
- execute apenas comandos seguros e existentes no projeto;
- para mudancas de documentacao/config de IA, valide com `git diff --check` e revisao do diff;
- informe qualquer validacao nao executada e o motivo.

Relatorio final:
use o formato de `PROJECT_RULES.md` e destaque arquivos lidos, alterados, criados, validacoes, riscos e pendencias.
```
