# 0013 — `<mat-label>` do MDC cobre o centro dos inputs, quebrando `cy.type()` sem force

**Etapa de origem:** 6 (D3 — Angular/Material 17, migração real para MDC)
**Severidade:** Baixa (ajuste de spec, não bug do app)
**Status:** Resolvido (`mig/d3`)

## Descrição

Ao migrar `upload.cy.ts` para os componentes MDC (ver decisão da Etapa 4, achado adiado até aqui),
`cy.type()` nos campos de texto do formulário de upload passou a falhar com "element is being
covered by another element", mesmo com waits generosos. Investigação com
`document.elementFromPoint()` (usando o `ownerDocument` do próprio input, não o documento do
Cypress runner) confirmou a causa: o elemento que cobre o centro do input é sempre o
**`<mat-label>`** do mesmo `<mat-form-field>` — o rótulo flutuante que, no Material Design (MDC),
fica posicionado sobre o texto do campo até ele ganhar foco ou valor. É comportamento visual
esperado do próprio componente, não um elemento externo nem uma regressão de layout.

Um problema **diferente e relacionado** apareceu nos `mat-select`: clicar na `mat-option` logo após
abrir o select falhava, porque a animação de abertura do overlay MDC (mais longa que a do
componente legacy) ainda não tinha assentado. Tentar contornar isso com `{force: true}` no clique
da opção **piorou o problema**: o clique "vazou" para outro elemento da página por trás do overlay
(confirmado: a página voltou ao topo após o clique forçado, e o formulário permaneceu inválido) —
diferente do caso do input, onde `{force:true}` continua mirando o elemento certo (o próprio
`<input>`), no clique isso não é garantido da mesma forma quando o alvo real é outro elemento.

## Evidência

`document.elementFromPoint()` no ponto central do input `phone` retornou
`{tagName: "MAT-LABEL", className: "ng-tns-c3736059725-4"}` — não o próprio input, nem nenhum
elemento de layout externo (`.container-fluid`, mencionado na mensagem de erro do Cypress, era o
ancestral mais próximo identificável pelo Cypress, não o elemento real cobrindo o ponto).
Reproduzido de forma determinística: sem wait, `cy.contains('mat-option', 'Beats').click()` falha
por "covered"; com `cy.wait(400)` após abrir o select, o mesmo clique **sem** force funciona e
seleciona corretamente (confirmado via `.should('contain.text', 'Beats')`).

## Ação recomendada

Aplicado em `cypress/e2e/upload.cy.ts`:
- Inputs de texto (`nome`, `email`, `phone`, `identification`, `trackName`, `bpm`): `{force: true}`
  no `.type()` — seguro, o alvo do comando é sempre o input localizado pelo seletor CSS.
- `mat-select` → `mat-option`: `cy.wait(400)` após o clique de abertura, **sem** `{force: true}` no
  clique da opção — mais lento, mas confiável (a alternativa com force causou uma seleção que nunca
  se efetivava, deixando o formulário `invalid` silenciosamente até o `.should('not.be.disabled')`
  no botão de submit expor o problema).

Padrão a repetir em specs futuros que interajam com `<mat-form-field>`/`<mat-select>` MDC.

## Referências

`docs/ia-auditorias/2026-07-30__migracao-angular-etapa-6__claude.md`.
