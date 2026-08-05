# 0021 — Output da build de produção muda de `dist/` para `dist/browser/`

**Etapa de origem:** 12 (migração para o builder `application`/esbuild — pré-requisito do Vitest)
**Severidade:** Alta (quebra silenciosamente qualquer script/pipeline que assuma `dist/` como raiz publicável)
**Status:** Resolvido (mig/e13)

## Descrição

A migração `ng update @angular/cli --name use-application-builder` (necessária como pré-requisito
para adotar Vitest, ver achado 0016 e a decisão da Etapa 12) muda o builder principal de
`@angular-devkit/build-angular:browser` para `@angular/build:application`. Esse novo builder
estrutura a saída da build de produção em subpastas por plataforma de destino — o output deixa de
ser `dist/` diretamente e passa a ser **`dist/browser/`** (reservando `dist/` para eventuais
artefatos de servidor, caso SSR seja adotado no futuro; o projeto não usa SSR).

O próprio `ng update` já avisou sobre isso no momento da migração: *"The output location of the
browser build has been updated from 'dist/' to 'dist/browser'. You might need to adjust your
deployment pipeline or, as an alternative, set outputPath.browser to '' in order to maintain the
previous functionality."*

## Evidência

`ls dist/` após `npm run build`: contém `3rdpartylicenses.txt`, `browser/` (com todo o conteúdo real
da aplicação: `index.html`, JS/CSS com hash, assets) e `prerendered-routes.json`. Antes desta etapa,
`dist/` continha esses arquivos diretamente na raiz.

O plano de migração (`docs/ia-auditorias/2026-07-30__plano-migracao-angular-14-para-22-v2__claude.md`,
Etapa 13, achado A13) já documenta que `deploy-to-vps.sh`'s `upload_frontend()` faz `rsync` a partir
de `dist/` para a VPS — **esse script vai enviar um diretório com apenas 3 arquivos (incluindo uma
subpasta `browser/` que provavelmente não é tratada como o conteúdo publicável), quebrando o deploy
silenciosamente** se não for ajustado.

## Ação recomendada

**Obrigatório resolver na Etapa 13** ("Reflexo em build, scripts e limpeza"), antes de qualquer
deploy real. Duas opções:

1. **Ajustar os scripts de deploy** (`deploy-to-vps.sh`'s `upload_frontend()` e qualquer outro
   consumidor de `dist/`) para apontar para `dist/browser/` como a raiz publicável. Caminho
   recomendado — alinhado com a estrutura oficial do novo builder, sem lutar contra ela.
2. **Reverter o output** para o comportamento anterior via `outputPath.browser: ""` em
   `angular.json` (`build.options.outputPath`). Caminho de menor mudança nos scripts, mas diverge da
   estrutura padrão que a própria Angular está migrando o ecossistema para.

**Não fazer nada não é uma opção segura** — o próximo deploy real falharia ou publicaria um site
quebrado sem aviso claro, já que o `rsync`/upload em si não erraria (só o CONTEÚDO copiado estaria
incompleto/incorreto).

## Resolução (Etapa 13, `mig/e13`)

Adotada a **opção 1**, confirmada com o usuário. `deploy-to-vps.sh` (`build_frontend()` e
`upload_frontend()`) passou a checar/publicar `dist/browser/`; os textos de ajuda do próprio script
e de `build-and-upload.sh` foram atualizados. `angular.json` permanece intocado.

**Efeito colateral aceito:** `dist/3rdpartylicenses.txt` e `dist/prerendered-routes.json` (fora de
`dist/browser/`) deixam de ser publicados — antes o primeiro ia para a raiz do site. É atribuição de
licenças de terceiros, não código funcional; a opção 2 (que os preservaria) foi descartada.

## Referências

`docs/ia-auditorias/2026-07-31__migracao-angular-etapa-12__claude.md`,
`docs/ia-auditorias/2026-07-31__migracao-angular-etapa-13__claude.md`.
