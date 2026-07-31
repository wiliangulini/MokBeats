---
name: architecture-review
description: Use esta skill para avaliar arquitetura, decisões técnicas, separação de responsabilidades, trade-offs e impacto sistêmico no MokBeats com base no código real.
---

# Architecture Review — MokBeats

## Descrição

Skill para análise arquitetural sênior baseada no estado real do MokBeats.

O objetivo é avaliar decisões técnicas, estrutura, acoplamento, coesão, segurança, testabilidade e compatibilidade com legado sem propor overengineering.

## Regra principal

Antes de qualquer workflow, respeite `PROJECT_RULES.md`. Em conflito entre esta skill e regras do MokBeats, prevalece `PROJECT_RULES.md`.

## Quando usar

Use quando a tarefa envolver:

- decisão arquitetural;
- revisão de módulo ou fluxo;
- escolha entre alternativas técnicas;
- avaliação de acoplamento;
- definição de padrão de implementação;
- análise de impacto sistêmico;
- criação de ADR;
- comparação entre manter padrão atual ou introduzir abstração.

## Quando não usar

Não use quando:

- a tarefa for simples e localizada;
- a decisão já estiver tomada no `PROJECT_RULES.md`;
- o usuário pediu apenas implementação direta;
- o problema for bug pontual;
- não houver arquivos reais para inspecionar.

## Pré-requisitos obrigatórios

1. Ler documentação e relatórios relacionados em `docs/ia-auditorias/`.
2. Ler arquivos reais relacionados.
3. Identificar restrições de Angular, TypeScript, SCSS, Bootstrap, Angular Material, Node.js/API e WaveSurfer.js.
4. Identificar impactos em autenticação, rotas, player, upload, carrinho, licenças e dashboard.

## Fluxo de execução

1. Defina a decisão ou problema arquitetural.
2. Descreva o contexto real observado.
3. Liste arquivos e evidências.
4. Identifique restrições técnicas.
5. Liste alternativas viáveis.
6. Avalie trade-offs.
7. Avalie impacto em legado, segurança, performance e testes.
8. Escolha a alternativa mais simples e segura.
9. Indique plano incremental.
10. Indique quando reavaliar a decisão.

## Regras de parada

Pare e peça contexto se:

- a decisão impactar contrato público sem autorização;
- a decisão exigir mudança de stack;
- a decisão exigir dependência nova;
- a decisão alterar autenticação/autorização;
- houver conflito com `PROJECT_RULES.md`.

## Formato de saída esperado

```text
## Decisão/problema analisado
## Contexto real observado
## Arquivos/evidências
## Restrições técnicas
## Alternativas consideradas
## Comparação de trade-offs
## Recomendação
## Justificativa
## Impactos
## Plano incremental
## Riscos
## Quando reavaliar
## Status final
```
