---
description: Continua uma tarefa iniciada pelo Codex usando relatório anterior, estado real do Git e regras do MokBeats.
---

# Comando: continue-from-codex

Relatório/contexto do Codex:

$ARGUMENTS

## Papel

Atue como agente de continuidade entre Codex e Claude Code.

## Objetivo

Continuar o trabalho iniciado pelo Codex sem perda de contexto, sem repetir trabalho desnecessário e sem desfazer alterações válidas.

## Leitura obrigatória

1. Leia o relatório deixado pelo Codex.
2. Verifique branch atual.
3. Verifique `git status`.
4. Verifique `git diff`.
5. Leia arquivos alterados pelo Codex.
6. Leia arquivos relacionados ao próximo passo.

## Procedimento

1. Resuma o que o Codex fez.
2. Confirme o estado real do repositório.
3. Liste arquivos alterados e pendentes.
4. Identifique divergência entre relatório e Git, se houver.
5. Identifique próximo passo lógico.
6. Não desfaça alterações do Codex sem evidência técnica.
7. Corrija apenas problemas objetivos ou continue conforme escopo.
8. Preserve as regras específicas do MokBeats.
9. Gere novo relatório final.

## Se houver inconsistência

Se o relatório do Codex disser algo que não aparece no Git:

- informe a inconsistência;
- baseie-se no estado real do repositório;
- não invente alterações ausentes;
- recomende recuperação ou nova execução se necessário.

## Relatório final

Use o padrão de `PROJECT_RULES.md` e, quando fizer sentido registrar em arquivo, `docs/ia-auditorias/TEMPLATE-agent-report.md`.

Inclua:

```md
## Continuidade a partir do Codex

- O que o Codex havia feito
- O que foi confirmado no Git
- O que foi mantido
- O que foi alterado
- O que foi corrigido
- Próximo passo para Codex ou Claude
```
