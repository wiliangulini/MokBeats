---
description: Revisa performance no MokBeats com base em código real, separando gargalos reais de hipóteses.
argument-hint: "[escopo a revisar; caminho -revisao.md opcional]"
---

# Comando: revisar-performance

Escopo:

$ARGUMENTS

## Papel

Atue como revisor sênior de performance.

## Protocolo comum

Siga `AGENTS.md` (§3 modos, §4/§10 segurança, §5 evidência) e `PROJECT_RULES.md` (§12 validação,
§15 relatório). Leia a rule de `.claude/rules/` aplicável (mapa em `AGENTS.md §8`). Não recopie o
protocolo aqui. Aplique a metodologia da skill `senior-code-review`.

## Contrato de escrita

Não altere implementação, testes, estilos ou configuração. A única escrita permitida é o relatório
em `docs/ia-auditorias/`, e somente quando `$ARGUMENTS` informar um caminho exato; sem caminho,
responda apenas no chat. Se o caminho for ambíguo ou fora de `docs/ia-auditorias/`, não escreva.

## Regra principal

Baseie achados em código real e indique como medir.

## Leitura obrigatória

1. Leia arquivos reais do escopo.
2. Leia consumidores ou produtores de dados relacionados.
3. Verifique `git diff`, se a revisão for sobre alteração atual.

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
