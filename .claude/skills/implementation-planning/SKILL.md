---
name: implementation-planning
description: Use esta skill para transformar uma demanda do MokBeats em plano de implementação incremental, seguro, validável e pronto para Codex ou Claude Code executar.
---

# Implementation Planning — MokBeats

## Descrição

Skill para planejamento técnico antes de editar código.

O objetivo é converter uma demanda em plano operacional claro, com escopo, arquivos prováveis, critérios de aceite, riscos, validações e continuidade entre Claude Code e Codex.

## Regra principal

Não implemente durante esta skill. Antes de planejar, respeite `PROJECT_RULES.md`; ele prevalece sobre qualquer regra genérica.

## Quando usar

Use quando a tarefa envolver:

- etapa grande;
- tarefa multiarquivo;
- implementação sensível;
- continuidade entre agentes;
- decomposição de roadmap técnico;
- criação de critérios de aceite;
- redução de risco antes de implementar.

## Quando não usar

Não use quando:

- a tarefa for pequena, clara e segura;
- já existir plano técnico suficiente;
- a tarefa for somente revisão de diff;
- a tarefa for apenas explicação conceitual.

## Pré-requisitos obrigatórios

1. Ler documentação ou relatório relevante.
2. Identificar estado atual do projeto quando possível.
3. Separar fatos de hipóteses.
4. Identificar riscos em Angular 14, rotas, API, autenticação, player, upload, carrinho, licenças e dashboard.

## Fluxo de execução

1. Resuma o objetivo.
2. Declare escopo incluído.
3. Declare fora de escopo.
4. Liste arquivos prováveis, separando confirmados e a verificar.
5. Mapeie dependências técnicas.
6. Identifique riscos por área.
7. Defina critérios de aceite objetivos.
8. Quebre implementação em etapas pequenas.
9. Defina validações por etapa.
10. Defina relatório final esperado.
11. Inclua instruções de continuidade.

## Checklist de segurança

- [ ] Nenhum `.env` será lido ou editado.
- [ ] Nenhum secret será acessado.
- [ ] Nenhuma dependência será instalada sem confirmação.
- [ ] Nenhuma alteração fora do escopo será incluída.
- [ ] Nenhuma reescrita ampla será proposta como primeiro passo.
- [ ] Nenhuma alteração de autenticação/autorização será feita sem critério claro.
- [ ] Nenhuma validação será declarada como executada.

## Formato de saída esperado

```text
## Objetivo
## Escopo incluído
## Fora de escopo
## Arquivos prováveis
## Pré-leitura obrigatória
## Plano incremental
## Critérios de aceite
## Validações recomendadas
## Riscos e mitigação
## Restrições
## Instruções para continuidade Claude Code ↔ Codex
## Status do plano
```
