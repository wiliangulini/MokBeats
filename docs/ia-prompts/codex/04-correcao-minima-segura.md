# Prompt Codex - Correcao Minima Segura

Use este prompt para corrigir um problema especifico sem ampliar o escopo.

```text
Corrija o problema abaixo com a menor alteracao segura suficiente.

Problema:
[descreva aqui o bug ou ajuste]

Restricoes:
1. Confirme branch atual e `git status`.
2. Leia `PROJECT_RULES.md`, `AGENTS.md`, `CODEX.md` e `.codex/instructions.md`.
3. Leia os arquivos relacionados ao sintoma antes de editar.
4. Identifique causa provavel ou confirmada antes da correcao.
5. Nao refatore fora do escopo.
6. Nao altere contratos de API, payloads, guards, rotas, upload `FormData`, player ou carrinho/licencas sem aprovacao explicita.
7. Nao acesse `.env`, secrets ou credenciais.
8. Nao execute deploy, commit, push, merge, reset, clean ou comandos destrutivos.

Depois de alterar:
- revise o diff;
- execute validacoes existentes e relevantes;
- informe validacoes nao executadas;
- gere relatorio final no formato de `PROJECT_RULES.md`.
```
