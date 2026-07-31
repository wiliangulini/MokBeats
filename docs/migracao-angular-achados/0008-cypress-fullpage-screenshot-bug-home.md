# 0008 — `cy.screenshot({capture:'fullPage'})` quebra na rota Home

**Etapa de origem:** 3 (Bootstrap 4→5)
**Severidade:** Baixa (bug do mecanismo de teste, não do app)
**Status:** Resolvido (contornado em `mig/e3`)

## Descrição

Ao rodar `baseline-visual.cy.ts` após a migração do Bootstrap, a screenshot `home.png`
(`capture: 'fullPage'`) veio com o bloco "hero" (imagem de fundo do estúdio + título + busca)
repetido ~5 vezes empilhado verticalmente, sem mostrar o resto da página (lista de músicas, vídeo,
cards, footer).

Investigação descartou regressão real do app:
- O DOM real tem apenas 1 ocorrência de cada elemento (`h1`, `article.container-fluid`,
  `section.one`) — não há duplicação de conteúdo.
- `scrollHeight`/`clientHeight` do `<html>`/`<body>` são normais; nenhum elemento interno rouba o
  scroll (`overflow-y: auto` em algum container aninhado) — o scroll do documento é o padrão.
- `cy.scrollTo('bottom')` seguido de `cy.screenshot({capture:'viewport'})` mostra o footer
  corretamente.
- Capturas de `viewport` em 4 posições de scroll (topo, lista de músicas, cards/vídeo, footer)
  mostram a página inteira renderizada corretamente, idêntica à baseline anterior.
- Aumentar o `cy.wait()` antes do `fullPage` (testado com 4s) não muda o resultado — descarta
  timing de carregamento de imagem como causa.

Conclusão: é um bug/limitação do algoritmo de "scroll e stitch" do `capture:'fullPage'` do Cypress
13.17.0 especificamente para esta página (provavelmente relacionado à imagem de fundo grande do
hero, que pode confundir o mecanismo de captura incremental). Não é causado pela migração do
Bootstrap — é a primeira vez que essa etapa gera a baseline com Node/Cypress neste estado, então não
há como confirmar se já acontecia antes, mas o comportamento visual real do app está intacto.

## Evidência

Reproduzido de forma determinística: `debug-fullpage-wait4s.png` e `home.png` mostram o mesmo padrão
de repetição, mesmo com wait de 4s. `after-scroll-to-bottom.png` (scroll manual + captura de
viewport) mostra o footer correto. `scroll-01-musicas.png` e `scroll-02-video-cards.png` (capturas
de viewport em posições intermediárias) mostram a página completa e correta.

## Ação recomendada

`cypress/e2e/baseline-visual.cy.ts` foi ajustado para usar `capture: 'viewport'` em todas as 6
rotas, em vez de `capture: 'fullPage'` — mais lento para revisar manualmente (não mostra a página
inteira em uma imagem), mas confiável. Se no futuro for necessário capturar a página inteira da
Home, considerar: (a) `cy.scrollTo` incremental + múltiplos screenshots de viewport (como usado
para diagnosticar este achado), ou (b) atualizar o Cypress para uma versão mais recente e testar se
o bug persiste.

## Referências

`docs/ia-auditorias/2026-07-30__migracao-angular-etapa-3__claude.md` (a ser criado).
