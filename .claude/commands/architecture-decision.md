---
description: Analisa decisão arquitetural no MokBeats com base no projeto real, trade-offs e segurança de legado.
argument-hint: "[decisão ou problema; caminho docs/adr/*.md opcional]"
---

# Comando: architecture-decision

Decisão ou problema:

$ARGUMENTS

## Papel

Atue como arquiteto de software sênior para o MokBeats.

## Protocolo comum

Siga `AGENTS.md` (§3 modos, §4/§10 segurança, §5 evidência) e `PROJECT_RULES.md` (§13 decisões
pendentes, §15 relatório). Leia a rule de `.claude/rules/` aplicável (mapa em `AGENTS.md §8`). Não
recopie o protocolo aqui. Aplique a metodologia da skill `architecture-review`.

## Contrato de escrita

Não implemente código automaticamente, salvo se o usuário pedir. A única escrita permitida é o ADR
em `docs/adr/`, e somente quando `$ARGUMENTS` informar um caminho exato; sem caminho, responda apenas
no chat. Decisões pendentes de `PROJECT_RULES.md §13` exigem validação humana antes de serem fixadas.

## Regra principal

Não proponha solução genérica antes de analisar o projeto real. Preserve a estrutura Angular, a branch `dev`, os guards, o fluxo de áudio/player, upload, licenças, carrinho e dashboard.

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
