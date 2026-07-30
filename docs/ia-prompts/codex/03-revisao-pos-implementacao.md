# Prompt Codex - Revisao Pos-Implementacao

Use este prompt para revisar um diff atual sem editar arquivos.

```text
Revise a implementacao atual sem editar arquivos.

Escopo esperado:
[descreva aqui o que deveria ter sido implementado]

Procedimento:
1. Confirme branch atual e `git status`.
2. Leia `PROJECT_RULES.md`, `AGENTS.md`, `CODEX.md` e `.codex/instructions.md`.
3. Leia `git diff --stat`, `git diff --name-only` e o diff dos arquivos alterados.
4. Leia os arquivos alterados e consumidores diretos quando necessario.
5. Verifique aderencia ao escopo, regressao, contratos, seguranca, tipagem, UX e validacoes.
6. Nao acesse `.env`, secrets ou credenciais.
7. Nao execute comandos destrutivos ou deploy.

Entregue achados primeiro, por severidade:
- Critico;
- Alto;
- Medio;
- Baixo;
- Observacao.

Finalize com:
- arquivos revisados;
- validacoes analisadas;
- validacoes recomendadas;
- decisao objetiva;
- status final: Aprovado | Aprovado com observacoes | Requer ajustes | Bloqueado.
```
