# 0024 — Configuração do builder `@angular/build:unit-test`: `zone.js` nos polyfills e `include` explícito para `test-focus`

**Etapa de origem:** 12 (migração Karma→Vitest)
**Severidade:** Média (2 problemas de configuração que bloqueavam `npm test`/`npm run test:focus` por completo)
**Status:** Resolvido (`mig/e12`)

## Descrição

### 1. `Top-level await is not available in the configured target environment`

Após migrar `test`/`test-focus` para `@angular/build:unit-test` (runner Vitest), `npm test` falhava
na fase de build com esse erro, apontando para `await import('zone.js/testing')` dentro de um
arquivo virtual gerado internamente pelo builder (`angular:test-bed-init`).

Investigação no código-fonte do builder
(`node_modules/@angular/build/src/builders/unit-test/runners/vitest/build-options.js`,
`getZoneTestingStrategy`) revelou a lógica exata: o builder inspeciona o array `polyfills` da
configuração de build delegada (`buildTarget`) e decide como carregar `zone.js/testing`:
- se `polyfills` contém literalmente a string `'zone.js/testing'` → não carrega nada (`'none'`);
- se `polyfills` contém literalmente a string `'zone.js'` → `import 'zone.js/testing';` **estático**
  (`'static'`) — o caminho correto e compatível com qualquer `target`;
- caso contrário (ex.: `polyfills: ["src/polyfills.ts"]`, um caminho de arquivo, não a string
  `'zone.js'`) → `await import('zone.js/testing')` **dinâmico** (`'dynamic'`) — exige suporte a
  top-level await no target de compatibilidade configurado, que não estava disponível.

### 2. `test-focus`: builder tentava compilar todos os 54 specs contra o `tsconfig` restrito

Mesmo com a distinção `test`/`test-focus` preservada via `setupFiles`/`tsConfig` diferentes, `npm
run test:focus` falhava com múltiplos erros `File 'X.spec.ts' not found in TypeScript compilation`
para especificações que **não** deveriam fazer parte do subconjunto focado. O builder
`@angular/build:unit-test` tem uma opção própria `"include"` (visível no `schema.json` do builder,
separada de `tsConfig`) que controla **quais arquivos são descobertos como testes** — e, sem essa
opção configurada, aplica um padrão amplo (equivalente a `**/*.spec.ts`) independentemente do
`tsConfig` apontado, cruzando depois contra o programa TypeScript mais restrito e falhando para
tudo que não está nele. Esse é, de fato, o mesmo mecanismo raiz do achado 0012 (antes, era o builder
Karma que varria o filesystem; agora é uma opção nova e específica do builder Vitest).

## Ação recomendada

Aplicado em `angular.json`:
1. Configuração `build.configurations.testing` (usada por `buildTarget: ":build:testing"`, o alvo
   delegado tanto por `test` quanto por `test-focus`) ganhou `"polyfills": ["src/polyfills.ts",
   "zone.js"]` — mantém `src/polyfills.ts` (arquivo real, com os flags de Zone.js e outras
   configurações) e adiciona a string bare `"zone.js"` só para satisfazer a checagem do builder e
   selecionar a estratégia `'static'`. Escopado **só** à configuração `testing` — não afeta
   `polyfills` de `build`/`serve` em produção/desenvolvimento.
2. Alvo `test-focus` ganhou `"include": ["src/app/**/*.behavior.spec.ts"]` — restringe a descoberta
   de testes aos 3 arquivos `.behavior.spec.ts` reais, resolvendo também o achado 0012.

## Referências

`docs/ia-auditorias/2026-07-31__migracao-angular-etapa-12__claude.md`,
[0012](0012-test-focus-quebrado-apos-angular15.md) (resolvido por este mesmo achado).
