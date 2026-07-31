# 0020 — TypeScript 6.0 (`TS5011`) quebra o `ts-loader` interno do Cypress via `tsconfig.json` com `extends`

**Etapa de origem:** 11 (D8 — Angular/Material 22, TypeScript 6.0)
**Severidade:** Média (bloqueava toda a suíte e2e — 5/5 specs com erro fatal de compilação)
**Status:** Resolvido (`mig/d8`) — causa raiz exata não 100% esclarecida, contorno estável aplicado

## Descrição

Após o `ng update` para TypeScript 6.0 (D8), `npm run e2e` passou a falhar nos 5 specs com um erro
fatal de **compilação** (não uma falha de teste): `TS5011: The common source directory of
'tsconfig.json' is './e2e'. The 'rootDir' setting must be explicitly set...`. O erro se origina no
`ts-loader` interno do preprocessador webpack bundlado do Cypress
(`@cypress/webpack-batteries-included-preprocessor`), que compila `cypress/e2e/*.cy.ts` contra o
`tsconfig.json` raiz do projeto (compartilhado com a aplicação Angular).

TS 6.0 introduziu `TS5011` como erro rígido: quando o compilador infere um "diretório-fonte comum"
para o conjunto de arquivos compilados, `rootDir` deve estar explicitamente declarado e bater com
esse valor inferido (ou ser um ancestral dele) — antes, essa inferência acontecia silenciosamente
sem exigir declaração.

## Evidência e investigação

1. Criado um `cypress/tsconfig.json` com `"extends": "../tsconfig.json"` e `"rootDir": "./e2e"`.
   `npx tsc -p cypress/tsconfig.json --showConfig` confirmou que o arquivo, **isoladamente**, resolve
   perfeitamente (rootDir efetivo bate com os 5 arquivos de spec compilados). Mesmo assim, `npm run
   e2e` continuava reportando **o mesmo erro, palavra por palavra**.
2. Teste decisivo: corromper deliberadamente o JSON de `cypress/tsconfig.json` — o erro mudou
   imediatamente para um erro de parse JSON5 apontando exatamente para esse arquivo. Confirma que o
   Cypress **lê** o arquivo (via `tsconfig-paths-webpack-plugin`, usado só para resolução de path
   aliases), mas isso não prova que `ts-loader` o usa para a checagem de `rootDir`.
3. Teste de eliminação: adicionar `rootDir` ao `tsconfig.json` **raiz** (valor compatível como
   ancestral comum de `src/` e `cypress/e2e/`) — sem qualquer efeito, mesmo erro persistiu.
4. **Resolução:** substituir `cypress/tsconfig.json` por uma versão **totalmente autônoma** — sem
   `"extends"`, com todas as `compilerOptions` necessárias declaradas diretamente — mudou
   **imediatamente** o erro para um `TS5101` diferente (depreciação de `downlevelIteration`),
   provando que a cadeia `extends` era a causa raiz real do `ts-loader` não conseguir validar
   corretamente o `rootDir` herdado através dela.

A causa raiz exata (por que especificamente a resolução de `extends` do `ts-loader`/
`tsconfig-aliased-for-wbip` quebra sob TypeScript 6.0, ao invés de simplesmente herdar `rootDir`
corretamente como `npx tsc` faz) **não foi 100% isolada** — pode ser um bug específico da versão
bundlada do `ts-loader` dentro do Cypress `13.17.0` (a última patch da major 13.x disponível;
confirmado via `npm view cypress versions` que não há patch mais novo dentro de `13.x`).

## Ação recomendada

Aplicado: `cypress/tsconfig.json` reescrito como config **autônoma** (sem `extends`), com
`compilerOptions` completos (`target`, `module`, `moduleResolution`, `strict`,
`experimentalDecorators`, `importHelpers`, `rootDir: "."`, `types: ["cypress", "node"]`,
`ignoreDeprecations: "6.0"`). Suíte e2e completa voltou a passar (5/5 specs, 8/8 testes). O
`tsconfig.json` da aplicação **não foi tocado** para essa correção — a causa raiz era exclusiva do
mecanismo de compilação do Cypress, não do build Angular (que já compilava sem erro).

**Custo aceito:** `cypress/tsconfig.json` duplica algumas opções do `tsconfig.json` raiz sem
herança — mudanças futuras no tsconfig da aplicação não se propagam automaticamente para o cypress.
Aceitável dado o escopo pequeno e estável dos arquivos de teste e2e (5 specs, sem imports externos).

**Se o Cypress for atualizado no futuro:** revisitar se uma versão mais nova do Cypress (a atual,
`15.19.0`, está 2 majors à frente — fora do escopo desta migração) resolve o problema de `extends`
nativamente, permitindo simplificar `cypress/tsconfig.json` de volta a uma config que herda do
`tsconfig.json` raiz.

## Referências

`docs/ia-auditorias/2026-07-31__migracao-angular-etapa-11__claude.md`.
