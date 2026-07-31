# 0007 — `inputmask@5.0.8` (npm) instalado mas nunca importado

**Etapa de origem:** 0 (herdado do plano de migração, achado A4)
**Severidade:** Baixa
**Status:** Aberto

## Descrição

`package.json` declara `"inputmask": "^5.0.8"` como dependência direta, mas nenhum arquivo em
`src/**/*.ts` importa esse pacote (`import`/`require`). A máscara de fato usada no projeto vem de
`src/inputMask.js` (arquivo local, é o bundle `jquery.inputmask.bundle.js` v3.3.4 de 2016 — não o
pacote npm) e `src/input_mask.js` (que a chama via `$(...).inputmask()`; ver achado 0003 sobre por
que essa chamada nunca aplica). O pacote npm `inputmask@5.0.8` é peso morto no `node_modules` e no
`package.json`.

## Evidência

`grep -rn "from 'inputmask'\|require('inputmask')" src/` — zero ocorrências.
`package.json:32` — `"inputmask": "^5.0.8"` presente nas dependências.

## Ação recomendada

Remover a dependência do `package.json` — mudança de dependência exige aprovação humana
(`PROJECT_RULES.md §13`). Não remover durante a migração automaticamente; registrar como item de
limpeza a decidir junto com a Etapa 12/13 (ou antes, se o dev preferir), já que remover dependências
não usadas é justamente o tipo de faxina que costuma acompanhar o fechamento de `npm audit`.

## Referências

Plano de migração, §2 (achado A4) e Apêndice A.3.
