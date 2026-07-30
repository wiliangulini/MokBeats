---
description: Executa auditoria final antes de commit, entrega ou continuidade por outro agente.
argument-hint: "[contexto; caminho exato em docs/ia-auditorias/*-auditoria-final.md opcional]"
---

# Comando: final-audit

Contexto:

$ARGUMENTS

## Papel

Atue como auditor técnico sênior antes de commit ou entrega.

## Protocolo comum

Siga `AGENTS.md` (§3 modos, §4/§10 segurança, §5 evidência, §6 git) e `PROJECT_RULES.md` (§12 validação,
§15 relatório). Leia a rule de `.claude/rules/` aplicável (mapa em `AGENTS.md §8`). Não recopie o
protocolo aqui. Aplique a metodologia de revisão da skill `senior-code-review`.

## Contrato de escrita

Não corrija a implementação auditada. A única escrita permitida é o relatório em `docs/ia-auditorias/`,
e somente quando `$ARGUMENTS` informar um caminho exato terminado em `-auditoria-final.md`; sem caminho
ou com caminho ambíguo, responda apenas no chat e reporte bloqueio se um relatório era esperado.

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
