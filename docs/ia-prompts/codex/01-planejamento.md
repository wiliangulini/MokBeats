# Prompt Codex - Planejamento

Use este prompt quando a tarefa precisar de auditoria e plano antes de qualquer edicao.

```text
Modo Planejamento. Nao edite, crie, mova, apague ou sobrescreva arquivos.

Tarefa:
[descreva aqui o objetivo]

Antes de concluir:
1. Leia `PROJECT_RULES.md`, `AGENTS.md`, `CODEX.md` e `.codex/instructions.md`.
2. Verifique branch atual e estado do Git.
3. Leia relatorios relevantes em `docs/ia-auditorias/`, se houver continuidade.
4. Leia apenas os arquivos diretamente relacionados ao escopo.
5. Separe fatos observados, hipoteses, riscos e recomendacoes.
6. Nao acesse `.env`, secrets ou credenciais.
7. Nao execute deploy, commit, push, merge, reset, clean ou comandos destrutivos.

Entregue:
- diagnostico atual;
- arquivos lidos;
- comportamento atual e esperado;
- riscos;
- plano fase por fase;
- arquivos que seriam alterados ou criados;
- arquivos que devem ser preservados;
- validacoes recomendadas;
- pontos que exigem aprovacao humana;
- status final.
```
