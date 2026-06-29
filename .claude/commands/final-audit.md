---
description: Executa auditoria final antes de commit, entrega ou continuidade por outro agente.
---

# Comando: final-audit

Contexto:

$ARGUMENTS

## Papel

Atue como auditor técnico sênior antes de commit ou entrega.

## Objetivo

Validar se a alteração está pronta para revisão, commit ou continuidade por outro agente.

## Leitura obrigatória

1. Verifique branch atual.
2. Verifique `git status`.
3. Leia `git diff`.
4. Leia arquivos alterados quando necessário.

## Checklist de auditoria

Verifique:

- escopo cumprido;
- arquivos fora do escopo;
- mudanças acidentais;
- imports não usados;
- logs temporários;
- código morto;
- quebra de contrato;
- regressão funcional;
- risco de segurança;
- risco de performance;
- risco de UX;
- compatibilidade com Angular 14;
- compatibilidade com player, upload, carrinho, licenças e dashboard;
- compatibilidade com continuidade Codex/Claude.

## Classificação final

Use uma das opções:

- Aprovado;
- Aprovado com observações;
- Requer ajustes;
- Bloqueado.

## Saída obrigatória

1. Resumo do diff.
2. Arquivos alterados.
3. Avaliação de escopo.
4. Riscos encontrados.
5. Testes executados.
6. Testes recomendados.
7. Pendências.
8. Classificação final.
9. Mensagem de commit sugerida, se o usuário pediu commit.
10. Relatório de continuidade.
