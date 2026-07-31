# 0001 — `cy.visit` sem hash carregava a Home em vez da rota pedida

**Etapa de origem:** 1 (ampliar rede e2e Cypress)
**Severidade:** Média
**Status:** Resolvido (`mig/e1`)

## Descrição

O app usa `RouterModule.forRoot(routes, {useHash: true})` (`src/app/app-routing.module.ts:64`). O
spec original `cypress/e2e/player.cy.ts` (pré-existente, antes desta migração) usava
`cy.visit('/musicas')` — sem `#`. Como o `HashLocationStrategy` resolve a rota a partir de
`location.hash`, e a URL não tinha hash, o Angular Router carregava a rota vazia
(`{ path: '', redirectTo: 'home' }`), ou seja, a **Home**, não Músicas.

O teste "passava" (antes desta sessão, nunca fora executado de fato para confirmar) só por
coincidência: a Home também lista músicas com o mesmo tipo de botão de play, então
`cy.get('button.svg.play')` encontrava elementos mesmo estando na página errada.

## Evidência

Reproduzido nesta sessão com `npx cypress run --spec player.cy.ts` sob Node 16.20.2: o spec
original falhava (`0 passing, 1 failing`, elemento nunca encontrado) antes da correção. Um spec de
diagnóstico confirmou: `cy.visit('/musicas')` → `location.href` = `http://localhost:4200/#/home`;
com `cy.visit('/#/musicas')` → `appMusicas:1, btnPlay:10`.

## Ação recomendada

Nenhuma — já corrigido. Todos os specs desta migração usam `/#/rota` (nunca `/rota` sem hash).
Relevante registrar aqui para o caso de algum spec futuro (Etapas 4-11) reintroduzir o padrão sem
hash por hábito.

## Referências

`docs/ia-auditorias/2026-07-30__migracao-angular-etapa-1__claude.md`, seção 13.1.
