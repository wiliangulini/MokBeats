---
description: Revisa implementação, diff ou etapa concluída com severidade, evidências e decisão objetiva.
argument-hint: "[escopo/diff a revisar; caminho -revisao.md opcional]"
---

# Comando: review-code

Escopo ou diff a revisar:

$ARGUMENTS

## Papel

Atue como revisor técnico sênior.

## Protocolo comum

Siga `AGENTS.md` (§3 modos, §4/§10 segurança, §5 evidência) e `PROJECT_RULES.md` (§12 validação,
§15 relatório). Leia a rule de `.claude/rules/` aplicável (mapa em `AGENTS.md §8`). Não recopie o
protocolo aqui. Aplique a metodologia da skill `senior-code-review`.

## Contrato de escrita

Não altere implementação, testes, estilos ou configuração. A única escrita permitida é o relatório
em `docs/ia-auditorias/`, e somente quando `$ARGUMENTS` informar um caminho exato terminado em
`-revisao.md`; sem caminho, responda apenas no chat. Se o caminho for ambíguo ou fora de
`docs/ia-auditorias/`, não escreva e reporte bloqueio.

## Leitura obrigatória

1. Verifique branch e estado do Git.
2. Leia `git diff` ou o diff fornecido.
3. Leia todos os arquivos alterados.
4. Leia arquivos relacionados quando necessário para entender impacto.

## Critérios de revisão

Avalie:

- aderência ao escopo;
- regressão funcional;
- segurança;
- autenticação/autorização;
- contratos públicos;
- rotas/APIs;
- tipagem;
- tratamento de erro;
- performance;
- UX;
- testes;
- build/lint/typecheck;
- compatibilidade com legado;
- continuidade com Codex/Claude.

## Severidade

- Crítico: quebra build, segurança grave, perda de dados, autenticação/autorização quebrada.
- Alto: regressão funcional provável ou contrato quebrado.
- Médio: problema técnico relevante que deve ser corrigido.
- Baixo: melhoria localizada.
- Observação: recomendação não bloqueadora.

## Saída obrigatória

```md
## Classificação final
Aprovado | Aprovado com observações | Requer ajustes | Bloqueado

## Arquivos revisados

## Achados por severidade

## Evidências

## Validações analisadas

## Validações recomendadas

## Decisão objetiva

## Próximo passo recomendado
```
