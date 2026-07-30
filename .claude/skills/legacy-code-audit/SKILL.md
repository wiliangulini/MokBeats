---
name: legacy-code-audit
description: Use esta skill para auditar código legado do MokBeats antes de implementar ou refatorar, sem alterar arquivos automaticamente.
---

# Legacy Code Audit — MokBeats

## Descrição

Skill para análise de código legado com foco em entendimento, risco, preservação de comportamento e planejamento incremental.

## Regra principal

Não altere arquivos durante a auditoria. Respeite `PROJECT_RULES.md` antes de qualquer workflow.

## Quando usar

Use quando a tarefa envolver:

- entender módulo legado;
- mapear fluxo existente;
- avaliar risco antes de alteração;
- identificar acoplamento;
- preparar refatoração futura;
- auditar código sem modificar;
- documentar arquitetura atual.

## Quando não usar

Não use quando:

- o usuário pediu implementação direta pequena;
- já há escopo claro e arquivos óbvios;
- a tarefa é apenas revisão de diff;
- a tarefa é refatoração já aprovada.

## Pré-requisitos obrigatórios

1. Verificar `git status`.
2. Identificar módulo, pasta ou fluxo em análise.
3. Ler arquivos centrais do fluxo.
4. Ler arquivos consumidores quando necessário.
5. Identificar scripts de validação disponíveis.

## Fluxo de execução

1. Defina o escopo da auditoria.
2. Liste arquivos e pastas analisados.
3. Mapeie o fluxo atual.
4. Identifique responsabilidades.
5. Identifique dependências internas e externas.
6. Identifique contratos públicos.
7. Identifique acoplamentos e duplicações reais.
8. Identifique riscos de segurança, performance e regressão.
9. Classifique achados por severidade.
10. Separe fatos observados de inferências.
11. Proponha plano incremental.

## Checklist MokBeats

- [ ] Estrutura Angular preservada.
- [ ] Rotas e guards avaliados quando aplicável.
- [ ] Player/WaveSurfer avaliados quando aplicável.
- [ ] Upload/FormData avaliado quando aplicável.
- [ ] Carrinho/licenças/checkout avaliados quando aplicável.
- [ ] Dashboard/ProdutorGuard avaliado quando aplicável.

## Formato de saída esperado

```text
## Escopo da auditoria
## Arquivos analisados
## Visão geral do módulo
## Fluxo atual observado
## Contratos e dependências
## Achados por severidade
## Riscos de segurança
## Riscos de performance
## Riscos de regressão
## Dívida técnica real
## Plano incremental recomendado
## O que não deve ser alterado agora
## Próximo passo recomendado
## Status final
```
