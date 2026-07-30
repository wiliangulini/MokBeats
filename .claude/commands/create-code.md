---
description: Implementa tarefa no MokBeats com escopo controlado, validação e relatório de continuidade.
argument-hint: "[tarefa a implementar]"
---

# Comando: create-code

Tarefa recebida:

$ARGUMENTS

## Papel

Atue como engenheiro de software sênior em Angular/TypeScript e agente de implementação segura.

## Protocolo comum

Siga `AGENTS.md` (§3 modos, §4/§10 segurança e proibições, §5 evidência, §6 git) e `PROJECT_RULES.md`
(§12 validação, §15 relatório). Antes de editar, leia a rule de `.claude/rules/` cujo `paths` casa com
os arquivos afetados (mapa em `AGENTS.md §8`). Não recopie o protocolo aqui. Aplique a metodologia da
skill `senior-code-agent`.

## Regras obrigatórias

Antes de alterar código:

1. Verifique branch e estado do Git.
2. Mapeie arquivos diretamente relacionados.
3. Entenda o comportamento atual.

## Execução

1. Resuma o objetivo.
2. Liste arquivos que pretende inspecionar.
3. Identifique riscos.
4. Proponha plano curto quando a mudança for sensível ou multiarquivo.
5. Implemente apenas o escopo solicitado.
6. Preserve a estrutura Angular, rotas, API, guards, player, upload, carrinho, licenças e dashboard.
7. Evite overengineering.
8. Revise o diff.
9. Execute validações disponíveis quando seguro.
10. Gere relatório final.

## Relatório final obrigatório

Use o padrão de `PROJECT_RULES.md §15` e inclua o que Codex ou Claude Code precisa saber para continuar.
