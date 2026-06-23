---
name: senior-code-review
description: Use esta skill para revisar código, diffs, implementações ou etapas concluídas no MokBeats com rigor sênior, sem alterar arquivos automaticamente.
---

# Senior Code Review — MokBeats

## Descrição

Skill para revisão técnica sênior de código, diffs, pull requests locais e etapas implementadas por Codex, Claude Code ou outro agente.

O objetivo é identificar problemas reais com base em evidências, sem transformar preferências pessoais em bloqueadores.

## Regra principal

Não altere código automaticamente. Respeite `PROJECT_RULES.md` e classifique achados com evidência.

## Quando usar

Use quando a tarefa envolver:

- revisão de implementação;
- revisão de diff;
- revisão pós-Codex;
- revisão pré-commit;
- validação de critérios de aceite;
- avaliação de regressão;
- auditoria de escopo.

## Quando não usar

Não use quando:

- o usuário pedir implementação direta;
- a tarefa exigir refatoração;
- a tarefa for planejamento sem código existente;
- a tarefa for apenas explicação conceitual.

## Pré-requisitos obrigatórios

1. Ler `PROJECT_RULES.md`.
2. Ler `AGENTS.md`.
3. Ler `CLAUDE.md`.
4. Ler `CODEX.md`, se existir.
5. Verificar branch atual.
6. Verificar `git status`.
7. Ler `git diff` ou diff fornecido.
8. Ler todos os arquivos alterados.
9. Ler arquivos relacionados quando necessário.
10. Comparar implementação com escopo e critérios de aceite.

## Fluxo de execução

1. Resuma o objetivo da revisão.
2. Identifique escopo esperado.
3. Liste arquivos alterados.
4. Leia diff e arquivos.
5. Verifique se a implementação resolve o objetivo.
6. Verifique alterações fora do escopo.
7. Avalie riscos de regressão.
8. Avalie segurança, autenticação e autorização.
9. Avalie contratos, rotas, APIs e payloads.
10. Avalie tipagem, build, lint e testes.
11. Classifique achados por severidade.
12. Separe bloqueadores de melhorias opcionais.
13. Gere decisão final.

## Severidade dos achados

- `Crítico`: quebra build, falha grave de segurança, perda de dados, autenticação/autorização quebrada.
- `Alto`: regressão funcional provável, contrato quebrado, bug relevante.
- `Médio`: inconsistência técnica que deve ser corrigida antes de evoluir.
- `Baixo`: melhoria localizada sem bloqueio.
- `Observação`: recomendação sem impacto imediato.

## Formato de saída esperado

```text
## Classificação final
Aprovado | Aprovado com observações | Requer ajustes | Bloqueado

## Escopo revisado
## Arquivos revisados
## Achados por severidade
## Evidências
## Validações analisadas
## Validações recomendadas
## Decisão objetiva
Pode seguir | Requer correção | Bloqueado
## Próximo passo recomendado
```
