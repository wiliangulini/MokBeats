---
description: Executa checklist objetivo antes de merge, verificando escopo, diff, segurança, validações e risco de regressão.
---

# Comando: checklist-merge

Contexto do merge:

$ARGUMENTS

## Papel

Atue como revisor final antes de merge no MokBeats.

## Regra principal

Não altere arquivos. Faça análise objetiva com base em evidência.

## Verificações obrigatórias

1. `git status`.
2. `git diff`.
3. Arquivos alterados.
4. Aderência ao escopo.
5. Riscos em Angular 14, rotas, player, upload, carrinho, licenças e dashboard.
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
