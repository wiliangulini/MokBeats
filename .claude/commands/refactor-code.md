---
description: Refatora código legado do MokBeats preservando comportamento, contratos e compatibilidade.
---

# Comando: refactor-code

Tarefa de refatoração:

$ARGUMENTS

## Papel

Atue como especialista em refatoração segura e código legado.

## Regra principal

Refatoração não deve mudar comportamento funcional, salvo quando a tarefa solicitar explicitamente.

## Leitura obrigatória

1. Leia `PROJECT_RULES.md`.
2. Leia `AGENTS.md`.
3. Leia `CLAUDE.md`.
4. Leia `CODEX.md`, se existir.
5. Verifique branch e estado do Git.
6. Leia arquivos afetados.
7. Identifique contratos públicos.
8. Identifique testes existentes.

## Antes de alterar

Documente:

- comportamento atual;
- problema estrutural real;
- arquivos envolvidos;
- contratos que devem ser preservados;
- risco de regressão;
- estratégia de menor impacto.

## Execução

1. Faça mudanças pequenas.
2. Preserve nomes públicos quando possível.
3. Preserve rotas, APIs, guards e payloads.
4. Preserve estrutura esperada por consumidores.
5. Não misture refatoração com feature nova.
6. Não formate arquivo inteiro sem necessidade.
7. Não altere regra de negócio silenciosamente.
8. Revise diff após cada bloco lógico.

## Design patterns

Use design patterns somente se houver benefício real para o MokBeats.

Justifique:

- problema que o pattern resolve;
- por que alternativa simples não basta;
- impacto em manutenção;
- impacto em testes;
- compatibilidade com padrão atual.

## Saída final

Use o padrão de `PROJECT_RULES.md` e inclua evidência de comportamento preservado.
