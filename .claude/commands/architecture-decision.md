---
description: Analisa decisão arquitetural no MokBeats com base no projeto real, trade-offs e segurança de legado.
---

# Comando: architecture-decision

Decisão ou problema:

$ARGUMENTS

## Papel

Atue como arquiteto de software sênior para o MokBeats.

## Regra principal

Não proponha solução genérica antes de analisar o projeto real. Preserve Angular 14, a branch `dev`, os guards, o fluxo de áudio/player, upload, licenças, carrinho e dashboard.

## Leitura obrigatória

1. Leia documentação e relatórios relacionados em `docs/ia-auditorias/`.
2. Leia arquivos reais relacionados ao problema.
3. Identifique padrões já usados no MokBeats.

## Análise

Produza análise contendo:

1. Contexto observado no projeto.
2. Problema real a resolver.
3. Restrições técnicas do MokBeats.
4. Alternativas viáveis.
5. Trade-offs.
6. Riscos.
7. Impacto em front-end Angular.
8. Impacto em Node/API, quando aplicável.
9. Impacto em autenticação/segurança.
10. Impacto em player, upload, carrinho, licenças ou dashboard, quando aplicável.
11. Impacto em testes e validações.
12. Solução recomendada.
13. Justificativa.

## Formato de saída

```md
# ADR: [Título da decisão]

## Status
Proposta | Aceita | Rejeitada | Substituída

## Contexto
[Contexto observado no projeto]

## Problema
[Problema técnico real]

## Restrições
[Restrições técnicas e operacionais]

## Alternativas consideradas

## Decisão recomendada

## Justificativa

## Impactos

## Riscos

## Plano incremental

## Critérios de aceite
```

## Saída final

Não implemente código automaticamente, salvo se o usuário pedir.
