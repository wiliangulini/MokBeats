---
description: Implementa tarefa no MokBeats com escopo controlado, validação e relatório de continuidade.
---

# Comando: create-code

Tarefa recebida:

$ARGUMENTS

## Papel

Atue como engenheiro de software sênior em Angular 14/TypeScript e agente de implementação segura.

## Regras obrigatórias

Antes de alterar código:

1. Leia `PROJECT_RULES.md`.
2. Leia `AGENTS.md`.
3. Leia `CLAUDE.md`.
4. Leia `CODEX.md`, se existir.
5. Leia `.claude/instructions.md`, se existir.
6. Verifique branch e estado do Git.
7. Mapeie arquivos diretamente relacionados.
8. Entenda o comportamento atual.

## Execução

1. Resuma o objetivo.
2. Liste arquivos que pretende inspecionar.
3. Identifique riscos.
4. Proponha plano curto quando a mudança for sensível ou multiarquivo.
5. Implemente apenas o escopo solicitado.
6. Preserve Angular 14, rotas, API, guards, player, upload, carrinho, licenças e dashboard.
7. Evite overengineering.
8. Revise o diff.
9. Execute validações disponíveis quando seguro.
10. Gere relatório final.

## Restrições

Não faça:

- refatoração fora do escopo;
- mudança arquitetural sem autorização;
- alteração de arquivos não relacionados;
- troca de biblioteca sem justificativa e autorização;
- alteração destrutiva de banco;
- alteração de contrato público sem validação;
- leitura ou edição de `.env`/secrets;
- comando Git destrutivo;
- instalação de dependências sem confirmação.

## Relatório final obrigatório

Use o padrão de `PROJECT_RULES.md` e inclua o que Codex ou Claude Code precisa saber para continuar.
