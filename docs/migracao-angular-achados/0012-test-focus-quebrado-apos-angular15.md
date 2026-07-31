# 0012 — `npm run test:focus` quebra após `ng update` para Angular 15

**Etapa de origem:** 4 (D1 — `ng update` Angular/Material 15)
**Severidade:** Média (não bloqueia o DoD oficial da etapa, mas é regressão real de uma ferramenta de dev)
**Status:** Aberto

## Descrição

A migração automática do `ng update @angular/core@15` removeu de `src/test.ts` o uso de
`require.context('./', true, /\.spec\.ts$/)` — corretamente, porque essa API do webpack não
funciona mais no builder Karma do Angular 15 (`__webpack_require__(...).context is not a function`,
confirmado por execução real). O builder passa a descobrir todos os `*.spec.ts` automaticamente via
`"include"` de `tsconfig.spec.json`, então `npm test` continua funcionando (115/115, confirmado).

Só que a migração deixou código órfão referenciando a variável `context` removida (bug da própria
migração automática, não intencional) — corrigido nesta etapa removendo o bloco morto de
`FOCUS_SPECS`/`context` de `test.ts` (esse mecanismo nunca era realmente usado: nenhum script `npm`
define a env var `FOCUS_SPECS`, e já havia relato equivalente em
`docs/ia-auditorias/R09-musicas-integracao-licenca-carrinho.md:49`: *"O script `test:focus` ignora
`FOCUS_SPECS`"*).

O mecanismo **real** de `test:focus` é outro, independente: o script `npm run test:focus` roda o
target `test-focus` do `angular.json`, que usa `src/test.focus.ts` (imports fixos de 3 specs
`.behavior.spec.ts`) e `tsconfig.spec.focus.json` (`include` restrito a esses arquivos). Esse
mecanismo **quebrou de fato** após o D1: o builder tenta compilar TODOS os `.spec.ts` do projeto
(não só os do `include` restrito), falhando com
`Error: .../scroll.service.spec.ts is missing from the TypeScript compilation`.

## Evidência

Reproduzido por execução real: `npm run test:focus` sob Node 24.18.1 pós-D1 falha com 6+ erros
"missing from the TypeScript compilation" para specs que não deveriam ser processados
(`scroll.service.spec.ts`, `wave-surfer.service.spec.ts`, `sub-menu.component.spec.ts`,
`termos-privacidade.component.spec.ts`, `usuario-artista.component.spec.ts`,
`wave-surfer-test.component.spec.ts`), seguido de `Error: Found 1 load error` no Karma server.

Não foi possível confirmar com certeza se isso já falhava antes do D1 sob as mesmas versões de
pacote (testar exigiria reinstalar os pacotes do Angular 14, custoso); o achado é registrado como
"após o D1" porque é quando foi observado, mas a causa (builder varrendo o filesystem em busca de
`.spec.ts`, além do que o `tsconfig.spec.focus.json` restringe) é consistente com mudanças de
builder do Angular 15 (`@ngtools/webpack`).

## Ação recomendada

Não corrigido nesta etapa — o DoD oficial do plano para os degraus (`npm run build`, `npm test`,
`npm run e2e`, `npm audit`) não exige `test:focus`, e o mecanismo já tinha uma pendência conhecida
(R09). Investigar antes da Etapa 12 (migração Karma→Vitest), que precisa **preservar a distinção
`test` vs `test:focus`** — se o problema persistir, a migração para Vitest é a oportunidade natural
de resolver definitivamente (Vitest tem suporte nativo a filtro de arquivo via CLI, sem precisar de
`require.context` nem de um `tsconfig` paralelo).

## Atualização (D2)

Reconfirmado após `ng update` para Angular 16 (Etapa 5): `npm run test:focus` continua com o mesmo
padrão de falha (`wave-surfer-test.component.spec.ts is missing from the TypeScript compilation`).
Sem regressão nova nem melhora — comportamento estável no mesmo estado do D1.

## Referências

`docs/ia-auditorias/2026-07-30__migracao-angular-etapa-4__claude.md`.
`docs/ia-auditorias/2026-07-30__migracao-angular-etapa-5__claude.md` (a ser criado).
`docs/ia-auditorias/R09-musicas-integracao-licenca-carrinho.md:49`.
