# 0014 — `HttpClientTestingModule` órfão em `src/test.ts` após `ng update` para Angular 18

**Etapa de origem:** 7 (D4 — Angular/Material 18)
**Severidade:** Baixa (quebrava a suíte de testes, mas resolvido na mesma etapa)
**Status:** Resolvido (`mig/d4`)

## Descrição

A migração automática de `HttpClientModule` → `provideHttpClient(withInterceptorsFromDi())`
(mudança oficial do Angular 18) alterou o import de `HttpClientTestingModule` em `src/test.ts`
para `import {} from '@angular/common/http/testing';` (vazio), mas não atualizou o uso do símbolo
dentro do array `moduleDef.imports` do override customizado de `TestBed.configureTestingModule`
— o mesmo monkey-patch que injeta módulos comuns (Router, Forms, Material, ng-bootstrap) em todos
os specs do projeto.

É o segundo caso do mesmo padrão: a análise estática da migração automática não reconhece código
que referencia símbolos de módulo dentro de estruturas de dados construídas dinamicamente (arrays
montados em runtime), só reconhece `imports: [...]` literais em decorators `@NgModule`/
`TestBed.configureTestingModule({...})`. O primeiro caso foi o achado
[0012](0012-test-focus-quebrado-apos-angular15.md) (D1, `require.context`), embora aquele não
tenha sido corrigido na mesma etapa — este foi.

## Evidência

Após `ng update @angular/core@18`, `npm test` falhava com `HttpClientTestingModule` não definido
(referenciado em `src/test.ts:42` do estado pré-correção, dentro do array `moduleDef.imports`,
mas sem import válido do símbolo).

Investigação em `node_modules/@angular/common/http/testing/index.d.ts` confirmou que
`HttpClientTestingModule` ainda existe (`@deprecated`, não removido) e que `provideHttpClientTesting()`
é a alternativa recomendada. Leitura de `node_modules/@angular/common/fesm2022/http/testing.mjs`
confirmou que `provideHttpClientTesting()` sozinho **não basta** — só substitui
`HttpBackend`/`HttpTestingController`; o `HttpClient` em si precisa de `provideHttpClient()`
separado (antes vinha "de brinde" via `imports: [HttpClientModule]` interno ao módulo deprecated).

## Ação recomendada

Aplicado em `src/test.ts`:
- Removido `HttpClientTestingModule` do array `moduleDef.imports`.
- Adicionados `provideHttpClient()` e `provideHttpClientTesting()` ao array `moduleDef.providers`.

Confirmado por execução real: `npm test` voltou a 115/115 após a correção completa (com só
`provideHttpClientTesting()`, testes que injetam `HttpClient`/services HTTP falhariam por falta de
provider).

**Padrão a vigiar em degraus futuros:** qualquer `ng update @angular/core` que altere APIs
referenciadas dentro do override customizado de `TestBed.configureTestingModule` em `src/test.ts`
merece revisão linha a linha, independentemente do que o resumo do `ng update` reportar como
"arquivos modificados" — a migração automática não enxerga esse padrão de injeção dinâmica.

## Referências

`docs/ia-auditorias/2026-07-30__migracao-angular-etapa-7__claude.md`.
