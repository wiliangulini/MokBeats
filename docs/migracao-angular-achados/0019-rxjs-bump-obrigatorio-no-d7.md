# 0019 — `rxjs` precisou de bump para `~7.8.2` no D7 (dependência fora do escopo nominal do degrau)

**Etapa de origem:** 10 (D7 — Angular/Material 21, checkpoint)
**Severidade:** Baixa (decisão de dependência, validada com o usuário antes de aplicar)
**Status:** Resolvido (`mig/d7`) — validado com o usuário

## Descrição

A partir do Angular 21, `@angular/common` (e demais pacotes `@angular/*`) abandonou os campos
legados `main`/`types` no `package.json` — a resolução de módulos depende inteiramente do mapa
`exports`, que só é compreendido por `moduleResolution: "bundler"` (ou `node16`/`nodenext`) do
TypeScript. Isso torna `bundler` **obrigatório** a partir deste degrau (diferente do D6, onde o
achado [0015](0015-moduleresolution-bundler-quebra-rxjs-antigo.md) documentou reverter para `"node"`
como correção válida).

Sob `moduleResolution: "bundler"`, o `rxjs~7.4.0` do projeto (único patch `7.4.x` já publicado) não
declara condição `"types"` em seu `exports` — mesma causa raiz do achado 0015, mas agora sem
alternativa de reversão, já que `moduleResolution: "node"` quebra a resolução dos próprios pacotes
`@angular/*` neste degrau (confirmado: `Cannot find module '@angular/common/http'` mesmo com
`tsconfig.json` totalmente revertido ao estado pré-D7).

## Evidência

`node_modules/@angular/common/package.json` (v21): sem campos `main`/`types` de nível raiz;
`exports["./http"]` = `{"types": "./types/http.d.ts", "default": "./fesm2022/http.mjs"}`. Testado
isoladamente: `moduleResolution: "node"` + `tsconfig.json` idêntico ao estado pré-D7 ainda falha com
`TS2307: Cannot find module '@angular/common/http'`.

## Ação recomendada

Como isso altera a faixa de versão de uma dependência fora dos 3 pacotes nominalmente autorizados
por degrau (`@angular/core`/`cli`, `@angular/material`, `@ng-bootstrap/ng-bootstrap`) —
`PROJECT_RULES.md §13` lista "dependências novas" entre as decisões que exigem validação humana —,
a decisão foi levada ao usuário via pergunta explícita antes de aplicar, apresentando as duas
alternativas viáveis: bump do `rxjs` (baixo risco, dentro do peer aceito `^6.5.3 || ^7.4.0` do
Angular 21) ou parar em D6 (checkpoint anterior, já válido e tageado). O usuário aprovou o bump.

Aplicado: `package.json` `"rxjs": "~7.4.0"` → `"~7.8.2"`. Mesma major, sem mudança de API usada pelo
projeto (`Observable`, `BehaviorSubject`, `Subscription`, operadores básicos) — só corrige a
declaração de tipos no `exports` map.

**Padrão a vigiar em degraus futuros:** o D8 (Angular 22, TypeScript 6.0) pode expor problemas
semelhantes em outras dependências não rastreadas pela matriz de versões do plano. Antes de assumir
que um erro de build é causado pela própria migração, verificar se a causa é uma dependência
transitiva desatualizada cuja faixa semver trava em um único patch antigo.

## Referências

`docs/ia-auditorias/2026-07-31__migracao-angular-etapa-10__claude.md`,
[0015](0015-moduleresolution-bundler-quebra-rxjs-antigo.md) (mesma causa raiz, D6).
