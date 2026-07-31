# 0022 — `wavesurfer.js/dist/plugins/minimap` quebra sob resolução esbuild; pacote 7.12.3 tinha arquivo declarado no `exports` mas ausente

**Etapa de origem:** 12 (migração para o builder `application`/esbuild)
**Severidade:** Média (quebrava o build de produção — área crítica: player/WaveSurfer)
**Status:** Resolvido (`mig/e12`)

## Descrição

O builder `application` (esbuild) é mais rígido que o webpack antigo na resolução de módulos via
`exports` map do `package.json`. O import `import Minimap from 'wavesurfer.js/dist/plugins/minimap';`
(sem extensão) — que funcionava sob webpack — passou a falhar com `Could not resolve
"wavesurfer.js/dist/plugins/minimap"`.

Investigação em duas camadas:

1. **Subpath incorreto:** o `exports` map de `wavesurfer.js` declara o subpath **documentado e
   recomendado** como `./plugins/*` (sem o prefixo `dist/`), mapeando para
   `./dist/plugins/*.esm.js`. O import original usava um subpath alternativo (`./dist/plugins/*.js`)
   que também existe no mapa, mas aponta para o MESMO arquivo `.esm.js` de destino.
2. **Bug de empacotamento na versão instalada:** mesmo corrigindo o subpath para
   `wavesurfer.js/plugins/minimap`, o build continuava falhando — `./dist/plugins/minimap.esm.js`
   **não existia fisicamente** em `node_modules/wavesurfer.js@7.12.3`. Só `minimap.js`/`minimap.d.ts`
   estavam presentes (só o plugin `timeline` tinha o conjunto completo `.js`/`.cjs`/`.esm.js`) — uma
   inconsistência entre o `exports` map declarado e os artefatos realmente publicados nessa versão
   específica do pacote.

## Evidência

`npm pack wavesurfer.js@7.12.11 --dry-run --json` confirmou que a versão `7.12.11` (mais recente
dentro da faixa já declarada `^7.8.2` do projeto) **inclui** `dist/plugins/minimap.esm.js`,
`.cjs`, `.js` e `.min.js` — o bug foi corrigido em algum patch entre `7.12.3` e `7.12.11`.

## Ação recomendada

Aplicado em duas partes:
1. `src/app/player/player.component.ts` e `src/app/wave-surfer-test/wave-surfer-test.component.ts`:
   import corrigido para o subpath documentado `wavesurfer.js/plugins/minimap` (sem `dist/`).
2. `npm update wavesurfer.js` — resolvido para `7.12.11`, **dentro da faixa já declarada**
   `^7.8.2` em `package.json` (nenhuma alteração de `package.json` necessária, só do
   `package-lock.json`) — não é uma decisão de dependência nova, apenas obter o patch mais recente já
   autorizado.

Confirmado via `npm run build` (sucesso) e `player.cy.ts` (2/2, e2e) que o WaveSurfer/Minimap
funciona normalmente após a correção.

## Referências

`docs/ia-auditorias/2026-07-31__migracao-angular-etapa-12__claude.md`.
