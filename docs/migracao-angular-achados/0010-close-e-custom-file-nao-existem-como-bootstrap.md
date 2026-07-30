# 0010 — `.close` e `custom-file` do plano (3b) não existem como componentes Bootstrap reais

**Etapa de origem:** 3 (Bootstrap 4→5)
**Severidade:** Baixa (correção de premissa, sem ação necessária)
**Status:** Resolvido (documentado)

## Descrição

O plano de migração listava 2 itens da subseção "3b — exige revisão visual" que, na auditoria real
do código, não correspondem ao que a premissa assumia:

**`.close` (plano: "6 ocorrências, `.close` → `.btn-close`, o markup muda")**
Todas as ocorrências reais de uma classe `close` no HTML são `class="nav-item p-0 close border-0"`
— um botão de fechar **filtro**, com nome coincidente, não o componente `.close` do Bootstrap (que
teria estrutura `<button class="close" data-dismiss="modal">...&times;...</button>`, inexistente no
projeto). Cada ocorrência tem CSS local próprio (`.nav-item.p-0.close { display: flex; opacity: 1; }`
em `musicas.component.scss`, `favoritos.component.scss`, `pag-playlist.component.scss`) que já
sobrescreve as duas propriedades do Bootstrap 4 `.close` que teriam efeito visual aqui
(`float: right` → sobrescrito por `display: flex`; `opacity: .5` → sobrescrito por `opacity: 1`).
Como o Bootstrap 5 remove a classe `.close` do CSS global, esses elementos deixam de herdar
`font-size`/`font-weight`/`color`/`text-shadow` do framework — mas como o conteúdo é um ícone SVG
sem texto direto, isso não tem efeito visual perceptível.

**`custom-file` (plano: "1 ocorrência, removido no BS5, vira `form-control` type=file")**
As 17 ocorrências de "custom-file" no HTML são todas o seletor `<app-custom-file-upload>` —
componente Angular próprio do projeto (`src/app/custom-file-upload/`), não a classe Bootstrap
`.custom-file`/`.custom-file-input`/`.custom-file-label`. Confirmado: nenhuma ocorrência real da
classe Bootstrap.

## Evidência

`grep -rn 'class="[^"]*\bclose\b[^"]*"' src/app --include="*.html"` — todas as 7 ocorrências são
`nav-item p-0 close border-0`, nunca `class="close"` sozinho. CSS local confirmado via
`grep -n '\.close\b' src/app/*/*.component.scss`.
`grep -rln 'custom-file' src/app --include="*.html"` — 3 arquivos, todos usando
`<app-custom-file-upload>`; `custom-file-upload.component.html:1` confirma
`<div class="custom-file-upload">` como classe raiz do próprio componente.

## Ação recomendada

Nenhuma. Ambos os itens de "3b" do plano foram avaliados e não exigem mudança — não existe
comportamento Bootstrap 4 real para migrar nesses dois casos.

## Referências

Plano de migração, §3b (Etapa 3).
`docs/ia-auditorias/2026-07-30__migracao-angular-etapa-3__claude.md` (a ser criado).
