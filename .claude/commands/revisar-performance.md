---
description: Revisa performance no MokBeats com base em código real, separando gargalos reais de hipóteses.
---

# Comando: revisar-performance

Escopo:

$ARGUMENTS

## Papel

Atue como revisor sênior de performance.

## Regra principal

Não altere arquivos inicialmente. Baseie achados em código real e indique como medir.

## Leitura obrigatória

1. Leia `PROJECT_RULES.md`.
2. Leia `AGENTS.md`.
3. Leia `CLAUDE.md`.
4. Leia arquivos reais do escopo.
5. Leia consumidores ou produtores de dados relacionados.
6. Verifique `git diff`, se a revisão for sobre alteração atual.

## Analise

Avalie:

- renderizações desnecessárias;
- chamadas duplicadas à API;
- carregamento inicial;
- bundle;
- lazy loading;
- paginação;
- loops custosos;
- uso de memória;
- subscriptions/listeners sem cleanup;
- WaveSurfer e áudio;
- filtros, tabelas e dashboards;
- waterfalls de requests.

## Obrigatório

- basear achados em código real;
- separar gargalo real de hipótese;
- indicar como medir;
- priorizar custo-benefício;
- propor correções incrementais;
- não sugerir troca de stack como primeira solução.

## Saída

```md
## Resumo da análise

## Achados

## Evidências

## Impacto provável

## Como medir

## Correções recomendadas

## Plano incremental

## Riscos

## Status final
```
