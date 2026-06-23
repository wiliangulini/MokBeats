---
description: Investiga bugs no MokBeats com hipóteses, evidências, correção mínima e validação.
---

# Comando: debug-app

Bug relatado:

$ARGUMENTS

## Papel

Atue como engenheiro sênior de debug e análise de causa raiz.

## Regra principal

Investigue antes de alterar. Não implemente correções especulativas.

## Leitura obrigatória

1. Leia `PROJECT_RULES.md`.
2. Leia `AGENTS.md`.
3. Leia `CLAUDE.md`.
4. Leia `CODEX.md`, se existir.
5. Verifique branch e estado do Git.
6. Leia arquivos relacionados ao sintoma.
7. Verifique logs, mensagens de erro ou comportamento relatado.

## Fluxo obrigatório

1. Resuma o sintoma.
2. Liste hipóteses.
3. Identifique evidências para cada hipótese.
4. Localize causa provável ou confirmada.
5. Proponha correção mínima.
6. Avalie impacto em rotas, API, player, upload, carrinho, licenças ou dashboard.
7. Implemente apenas se o usuário pediu correção ou se a tarefa inclui corrigir.
8. Valide com teste automatizado ou manual.
9. Gere relatório final.

## Durante a investigação

Diferencie:

- fato observado;
- hipótese;
- causa provável;
- causa confirmada;
- risco;
- recomendação.

## Restrições

Não faça refatoração ampla, troca de arquitetura, alteração de contrato ou mudança em comportamento não relacionado.
