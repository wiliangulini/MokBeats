---
description: Executa checklist objetivo antes de merge, verificando escopo, diff, segurança, validações e risco de regressão.
argument-hint: "[contexto do merge; caminho -auditoria.md opcional]"
---

# Comando: checklist-merge

Contexto do merge:

$ARGUMENTS

## Papel

Atue como revisor final antes de merge no MokBeats.

## Protocolo comum

Siga `AGENTS.md` (§3 modos, §4/§10 segurança, §5 evidência, §6 git) e `PROJECT_RULES.md` (§12 validação,
§15 relatório). Leia a rule de `.claude/rules/` aplicável (mapa em `AGENTS.md §8`). Não recopie o
protocolo aqui. Aplique a metodologia da skill `senior-code-review`.

## Contrato de escrita

Não altere arquivos. Faça análise objetiva com base em evidência. A única escrita permitida é o
relatório em `docs/ia-auditorias/`, e somente quando `$ARGUMENTS` informar um caminho exato; sem
caminho, responda apenas no chat.

## Verificações obrigatórias

1. `git status`.
2. `git diff`.
3. Arquivos alterados.
4. Aderência ao escopo.
5. Riscos em Angular, rotas, player, upload, carrinho, licenças e dashboard.
6. Autenticação/autorização: `AuthGuard`, `ProdutorGuard`, token e perfil.
7. API/payloads/FormData quando aplicável.
8. Build, lint, typecheck e testes disponíveis.
9. Documentação necessária.
10. Arquivos sensíveis alterados.
11. Dependências adicionadas.
12. Arquivos fora do escopo.

## Checklist de saída

```md
## Checklist de merge

- [ ] Escopo respeitado
- [ ] Sem alteração destrutiva
- [ ] Sem secrets expostos
- [ ] Sem dependência desnecessária
- [ ] Sem quebra de contrato
- [ ] Sem alteração sensível não autorizada
- [ ] Build validado ou pendente documentado
- [ ] Testes/lint/typecheck validados ou pendentes documentados
- [ ] Riscos documentados
- [ ] Pronto para merge ou requer ajustes

## Arquivos analisados

## Riscos encontrados

## Validações executadas

## Validações pendentes

## Decisão final
```
