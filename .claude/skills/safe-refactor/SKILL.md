---
name: safe-refactor
description: Use esta skill para refatorar código existente do MokBeats de forma incremental, preservando comportamento, contratos públicos e compatibilidade.
---

# Safe Refactor — MokBeats

## Descrição

Skill para refatoração segura, incremental e reversível.

O objetivo é melhorar estrutura, legibilidade, separação de responsabilidades ou testabilidade sem alterar comportamento funcional, contratos públicos, rotas, APIs ou regras de negócio, salvo autorização explícita.

## Regra principal

Antes de refatorar, respeite `PROJECT_RULES.md`. Refatoração só deve ocorrer quando estiver no escopo ou reduzir risco real.

## Quando usar

Use quando a tarefa envolver:

- reduzir duplicação real;
- separar responsabilidades;
- melhorar legibilidade;
- extrair função, componente, service ou helper;
- simplificar fluxo complexo;
- melhorar testabilidade;
- remover código morto confirmado.

## Quando não usar

Não use quando:

- o usuário pediu feature nova;
- o objetivo é corrigir bug funcional;
- a alteração exigiria mudança de contrato público;
- a alteração exigiria troca de biblioteca;
- não houver forma clara de confirmar comportamento preservado;
- a motivação for apenas estética.

## Pré-requisitos obrigatórios

1. Ler `PROJECT_RULES.md`.
2. Ler `AGENTS.md`.
3. Ler `CLAUDE.md`.
4. Ler `CODEX.md`, se existir.
5. Verificar `git status`.
6. Identificar arquivos afetados.
7. Ler os arquivos antes de editar.
8. Identificar comportamento atual que deve permanecer igual.
9. Identificar contratos públicos.
10. Identificar validações disponíveis.

## Fluxo de execução

1. Descreva o problema estrutural real.
2. Explique por que a refatoração é necessária.
3. Declare o comportamento que deve permanecer igual.
4. Liste arquivos envolvidos.
5. Liste contratos que não podem mudar.
6. Proponha etapas pequenas.
7. Faça uma alteração por vez.
8. Revise diff após cada bloco lógico.
9. Execute validações quando possível.
10. Documente evidência de comportamento preservado.

## Regras de parada

Pare e peça autorização se:

- a refatoração exigir mudar contrato público;
- a refatoração exigir instalar dependência;
- a refatoração crescer além do escopo;
- a alteração começar a virar reescrita;
- aparecer bug funcional fora do escopo;
- houver risco de alterar autenticação/autorização.

## Formato de saída esperado

```text
## Objetivo da refatoração
## Problema estrutural identificado
## Comportamento que deve permanecer igual
## Arquivos lidos
## Arquivos alterados
## Refatoração realizada
## Contratos preservados
## Validações executadas
## Evidência de comportamento preservado
## Riscos residuais
## Pendências
## Status final
```
