---
name: senior-code-agent
description: Use esta skill para implementar código, corrigir bugs simples ou conduzir tarefas técnicas gerais no MokBeats com postura sênior, escopo controlado e relatório final.
---

# Senior Code Agent — MokBeats

## Descrição

Skill operacional para atuação técnica sênior em tarefas gerais dentro do MokBeats.

Use para implementação incremental, ajuste localizado, correção pequena ou média e continuidade de tarefa iniciada por Codex ou outro agente.

## Regra principal

`PROJECT_RULES.md` é obrigatório e prevalece. Não substitua regras específicas do MokBeats por orientação genérica.

## Quando usar

Use quando a tarefa envolver:

- implementação incremental;
- ajuste localizado;
- correção pequena ou média;
- continuação de tarefa iniciada por Codex;
- criação de código novo dentro de padrão já existente;
- validação final de etapa implementada.

## Quando não usar

Não use quando:

- a tarefa for somente revisão sem alteração;
- a tarefa for refatoração estrutural ampla;
- a tarefa exigir decisão arquitetural formal;
- o escopo estiver ambíguo e arriscado.

## Pré-requisitos obrigatórios

1. Verificar `git status`.
2. Ler relatório anterior, se fornecido.
3. Identificar arquivos diretamente relacionados.
4. Ler os arquivos antes de editar.
5. Identificar scripts reais antes de sugerir validações.

## Fluxo de execução

1. Reescreva o objetivo em uma frase objetiva.
2. Declare o escopo permitido.
3. Leia arquivos relevantes.
4. Identifique comportamento atual.
5. Identifique contratos que devem ser preservados.
6. Identifique riscos técnicos.
7. Crie plano curto e incremental.
8. Altere somente arquivos necessários.
9. Preserve padrões existentes.
10. Revise o próprio diff.
11. Execute validações disponíveis quando seguro.
12. Gere relatório final.

## Checklist técnico MokBeats

- [ ] Estrutura Angular preservada.
- [ ] Rotas e guards preservados.
- [ ] APIs e payloads preservados.
- [ ] Player/WaveSurfer preservado quando afetado.
- [ ] Upload/FormData preservado quando afetado.
- [ ] Carrinho/licença/checkout preservados quando afetados.
- [ ] Dashboard e proteção de produtor preservados quando afetados.
- [ ] Sem dependência nova sem aprovação.
- [ ] Sem refatoração oportunista.

## Formato de saída esperado

Use exclusivamente o formato e os status de `PROJECT_RULES.md §15`. Não crie formato de relatório
concorrente.
