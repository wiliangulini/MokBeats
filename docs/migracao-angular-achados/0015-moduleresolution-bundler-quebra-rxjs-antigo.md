# 0015 — `moduleResolution: "bundler"` quebra a resolução de tipos do `rxjs` antigo

**Etapa de origem:** 9 (D6 — Angular/Material 20)
**Severidade:** Baixa (build quebrava, corrigido na mesma etapa via reversão pontual)
**Status:** Resolvido (`mig/d6`) — revisão futura recomendada

## Descrição

A migração automática obrigatória do `ng update @angular/cli@20` altera `tsconfig.json`,
trocando `"moduleResolution": "node"` por `"moduleResolution": "bundler"` — mudança recomendada
pela própria Angular, alinhada à evolução do toolchain TypeScript e ao builder `application`/esbuild
(que este projeto ainda não adotou; ver decisões equivalentes nas Etapas 6, 7 e 8 sobre manter o
builder `browser`/webpack).

Essa troca quebrou `npm run build` com múltiplos erros `TS7016` ("Could not find a declaration file
for module 'rxjs'") e `TS7031`/`TS7006` ("implicitly has an 'any' type") em callbacks de
`.subscribe(...)` espalhados por vários arquivos.

Causa raiz: o `rxjs` do projeto está fixado em `~7.4.0` no `package.json` — e `7.4.0` é a **única**
versão `7.4.x` já publicada no npm (não há patch a instalar dentro da mesma faixa semver). O
`package.json` do `rxjs@7.4.0` define um campo `"exports"` com caminhos `node`/`es2015`/`default`
por subpath, mas **sem nenhuma condição `"types"`** — só o campo legado de nível superior
`"types": "index.d.ts"`. Sob `moduleResolution: "node"`, o TypeScript ignora `"exports"` e usa
diretamente o campo `"types"` legado (resolve normalmente). Sob `moduleResolution: "bundler"`, o
TypeScript honra o `"exports"` map — e como não há condição `"types"` ali, a resolução de tipos
falha.

## Evidência

`node_modules/rxjs/package.json` (`rxjs@7.4.0`): campo `"exports"` sem condição `"types"` em
nenhum subpath. `npm view rxjs@7.8.2 exports`: confirma que a partir de `7.8.x` o rxjs já inclui
`"types": "./dist/types/.../index.d.ts"` em cada subpath do `exports` — corrige o problema.
`node_modules/@angular/core/package.json`: `peerDependencies.rxjs` = `"^6.5.3 || ^7.4.0"` — um bump
para `7.8.x` seria tecnicamente compatível com o Angular 20, mas está fora do escopo desta etapa
(só autoriza atualizar `@angular/core`/`cli`, `@angular/material`, `@ng-bootstrap/ng-bootstrap`).

## Ação recomendada

Aplicado nesta etapa: revertido `moduleResolution` para `"node"` em `tsconfig.json` — correção de
menor escopo, sem tocar em nenhuma versão de dependência. Confirmado isoladamente que a reversão,
sozinha, resolve o erro de build.

**Pendência para revisão futura:** se/quando o projeto adotar o builder `application`/esbuild (hoje
deliberadamente adiado em 4 degraus consecutivos), `moduleResolution: "bundler"` provavelmente será
necessário de novo — nesse momento, um bump de `rxjs` para `~7.8.x` (validado como compatível com o
peer dependency do Angular) deveria ser decidido como tarefa própria, com validação humana explícita
(`PROJECT_RULES.md §13`, "dependências novas"), não como efeito colateral de uma migração de major.

## Referências

`docs/ia-auditorias/2026-07-31__migracao-angular-etapa-9__claude.md`.
