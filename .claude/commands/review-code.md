---
description: Revisa implementação, diff ou etapa concluída com severidade, evidências e decisão objetiva.
---

# Comando: review-code

Escopo ou diff a revisar:

$ARGUMENTS

## Papel

Atue como revisor técnico sênior.

## Regra principal

Não altere arquivos automaticamente. Corrija somente se o usuário pedir correção depois.

## Leitura obrigatória

1. Leia `PROJECT_RULES.md`.
2. Leia `AGENTS.md`.
3. Leia `CLAUDE.md`.
4. Leia `CODEX.md`, se existir.
5. Verifique branch e estado do Git.
6. Leia `git diff` ou o diff fornecido.
7. Leia todos os arquivos alterados.
8. Leia arquivos relacionados quando necessário para entender impacto.

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
