# Prompts Codex - MokBeats

Biblioteca manual de prompts para usar com Codex no MokBeats.

Estes arquivos nao sao contexto automatico. Use apenas quando quiser iniciar uma tarefa com um roteiro mais controlado.

## Uso

1. Abra o prompt adequado.
2. Cole no chat do Codex.
3. Acrescente o escopo real da tarefa.
4. Preserve `PROJECT_RULES.md`, `AGENTS.md`, `CODEX.md` e `.codex/instructions.md` como fontes de verdade.

## Prompts disponiveis

- `01-planejamento.md` - auditoria e plano sem editar arquivos.
- `02-implementacao-controlada.md` - implementacao apos plano aprovado.
- `03-revisao-pos-implementacao.md` - revisao de diff sem editar.
- `04-correcao-minima-segura.md` - correcao localizada com menor mudanca suficiente.
- `05-auditoria-pre-commit.md` - checagem final antes de commit ou handoff.

## Regras gerais

- Nao cole secrets, tokens, `.env` ou credenciais.
- Nao autorize deploy, commit, push, merge ou alteracao destrutiva dentro destes prompts.
- Para tarefas com continuidade entre agentes, registre ou consulte relatorios em `docs/ia-auditorias/`.
