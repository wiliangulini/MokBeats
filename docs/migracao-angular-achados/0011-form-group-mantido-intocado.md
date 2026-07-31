# 0011 — `form-group` mantido intocado (risco de colisão com CSS custom)

**Etapa de origem:** 3 (Bootstrap 4→5)
**Severidade:** Baixa
**Status:** Resolvido (decisão tomada, documentada)

## Descrição

O plano de migração previa, para as 11 ocorrências de `.form-group` (removido no Bootstrap 5),
"decisão de espaçamento caso a caso — vira `mb-3`". A auditoria encontrou que os dois arquivos onde
`form-group` aparece (`src/app/carrinho/carrinho.component.html`, `src/app/home/home.component.html`)
já têm CSS **próprio** dependente dessa classe:

- `home.component.scss:56-58` e `:111-114`: `.form-group { margin: 0 !important; }` e
  `.form-group { border-right: 1px solid #ddd; padding-right: 15px; }` — o app já **zera** ou
  **redefine** o espaçamento, sem depender do `margin-bottom: 1rem` padrão do Bootstrap 4.
- `carrinho.component.scss`: múltiplos seletores descendentes complexos usam `.form-group` como
  parte da cadeia (`.card .form-group input`, `.form-group.d-flex.justify-content-start...`), sem
  nenhuma dependência do espaçamento vertical padrão do Bootstrap.

Adicionar `mb-3` (como o plano sugeria genericamente) correria o risco de **colidir** com o
`margin: 0 !important` de `home.component.scss` (ambos usam `!important`; o resultado final
dependeria de especificidade/ordem de carregamento, imprevisível sem teste visual dedicado) — uma
regressão nova, não presente na versão 4.

## Evidência

`grep -n -B1 -A3 '\.form-group\b' src/app/carrinho/carrinho.component.scss` e leitura de
`home.component.scss:50-60,105-115` (ver relatório da Etapa 3).

## Ação recomendada

Nenhuma ação tomada — `form-group` permanece no HTML, sem `mb-3` adicionado. Bootstrap 5 simplesmente
não define mais essa classe globalmente, mas isso não afeta nada porque ambos os componentes já
sobrescrevem/redefinem o espaçamento via CSS próprio. Validado visualmente nas screenshots de
`carrinho.png` (Etapa 3) e na Home (`home.png`) — sem regressão perceptível.

## Referências

Plano de migração, §3b (Etapa 3).
`docs/ia-auditorias/2026-07-30__migracao-angular-etapa-3__claude.md` (a ser criado).
