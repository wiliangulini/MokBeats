# 0017 — `TestBed` relança `NG0100` sem `provideZoneChangeDetection()` no ambiente de teste (Angular 21)

**Etapa de origem:** 10 (D7 — Angular/Material 21, checkpoint)
**Severidade:** Média (quebrava 2 specs + causava desconexão do Chrome Headless em uma terceira falha correlata)
**Status:** Resolvido (`mig/d7`)

## Descrição

O Angular 21 documenta no CHANGELOG oficial: *"Angular no longer provides a change detection
scheduler for ZoneJS-based change detection by default. Add `provideZoneChangeDetection` to the
providers of your `bootstrapApplication` function or your `AppModule`... This provider addition
will be covered by an automated migration."* — e também: *"(test only) Using
`provideZoneChangeDetection` in the TestBed providers would previously prevent `TestBed` from
rethrowing errors as it should. Errors in the test will now be rethrown, regardless of the usage of
`provideZoneChangeDetection`."*

A migração automática do `ng update @angular/core@21` aplicou `provideZoneChangeDetection()`
corretamente em `src/main.ts` (bootstrap real da aplicação), mas **não** tocou `src/test.ts` — o
override global de `TestBed.configureTestingModule` que o projeto usa para injetar módulos comuns
em todos os specs (mesmo padrão já visto nos achados 0012 e 0014: migrações automáticas não
reconhecem esse padrão de injeção dinâmica).

Sem `provideZoneChangeDetection()` no ambiente de teste, dois specs passaram a falhar com
`NG0100: ExpressionChangedAfterItHasBeenCheckedError` em bindings `[class.xxx]`
(`CartModalComponent`, `LoginComponent`) — erros que antes eram só logados e agora o `TestBed` do
Angular 21 relança por padrão. Um terceiro problema (não-`NG0100`) causava desconexão do Chrome
Headless por timeout, mascarando a contagem real de falhas.

## Evidência

```
Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was
checked. Previous value: 'false'. Current value: 'true'. Expression location: CartModalComponent
component.
    at checkStylingProperty (.../core/fesm2022/_debug_node-chunk.mjs:16086:30)
    at ɵɵclassProp (.../core/fesm2022/_debug_node-chunk.mjs:16060:3)
```

Ambas as falhas ocorrem em `ɵɵclassProp` (bindings `[class.x]`), consistente com o padrão descrito
no CHANGELOG. Adicionar `provideZoneChangeDetection()` ao array `providers` do override global em
`src/test.ts` eliminou as 2 falhas — `npm test` voltou a 115/115.

## Ação recomendada

Aplicado em `src/test.ts`: import de `provideZoneChangeDetection` de `@angular/core`, adicionado ao
início do array `moduleDef.providers` dentro do override de `TestBed.configureTestingModule`.

**Padrão a vigiar em degraus futuros:** qualquer migração automática que altere `src/main.ts`
(bootstrap real) deve ser conferida quanto ao equivalente necessário em `src/test.ts` (bootstrap de
teste) — são dois pontos de configuração paralelos que a automação do `ng update` só cobre um dos
dois.

## Referências

`docs/ia-auditorias/2026-07-31__migracao-angular-etapa-10__claude.md`.
