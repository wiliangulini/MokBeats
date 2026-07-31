# 0023 — Lacunas do schematic oficial `refactor-jasmine-vitest` (0 TODOs reportados, mas com bugs reais)

**Etapa de origem:** 12 (migração Karma→Vitest)
**Severidade:** Média (o relatório do schematic afirmava "0 TODOs / nenhuma mudança manual
necessária", mas havia pelo menos 1 bug de correção real e várias incompatibilidades de tipos)
**Status:** Resolvido (`mig/e12`)

## Descrição

`ng g @schematics/angular:refactor-jasmine-vitest --project=MokBeats_FrontEnd --fake-async
--defaults` transformou 13 dos 54 arquivos de spec e gerou um relatório
(`jasmine-vitest-<data>.md`) afirmando "Total TODOs: 0 / All identified patterns were successfully
transformed." Essa confiança não se confirmou integralmente na prática — revisão manual do diff
encontrou os seguintes problemas, nenhum sinalizado pelo próprio schematic:

### 1. `(done) => { setTimeout(() => {...; done(); }, N); }` → correção incompleta (bug real)

Para o padrão Jasmine de teste assíncrono via callback `done` combinado com `setTimeout`, o
schematic trocou a assinatura para `async () => {...}` e **só apagou a chamada `done()`** (deixando
um `;` solto), **sem envolver o `setTimeout` numa Promise aguardada**. Resultado: a função de teste
retorna/resolve imediatamente, antes do `setTimeout` disparar — a asserção dentro nunca é
efetivamente aguardada pelo framework de teste. 2 ocorrências em
`wave-surfer-test.component.behavior.spec.ts`.

**Correção:** envolver manualmente em `await new Promise<void>((resolve) => setTimeout(() => {
expect(...); resolve(); }, N));`.

**Nota:** o mesmo padrão apareceu 4 vezes em `music-player.service.behavior.spec.ts`, mas ali era
inofensivo — os observables envolvidos (`Subject`s) emitem de forma síncrona, então a asserção já
roda antes do `;` solto ser alcançado. Removidas por limpeza, sem impacto funcional.

### 2. `vi.spyOn<any>(x, 'metodo')` — 1 argumento de tipo, Vitest exige 2

Jasmine aceitava `spyOn<any>(...)` para espiar métodos privados/protegidos contornando a checagem de
visibilidade do TypeScript. O equivalente direto do schematic (`vi.spyOn<any>(...)`) não compila —
a assinatura de `vi.spyOn<T, K>` exige dois parâmetros de tipo. 3 ocorrências.

**Correção:** `vi.spyOn(x as any, 'metodo')` — cast no primeiro argumento, não no genérico.

### 3. `MockedObject<X>` exige todas as propriedades de `X`; specs usam mocks parciais deliberados

7 ocorrências em 5 arquivos (`produtores.component.spec.ts`, `carrinho.service.spec.ts`,
`musicas.service.spec.ts` ×3, `carrinho.component.spec.ts`, `login.component.spec.ts`) declaravam
variáveis como `MockedObject<X>` mas atribuíam objetos literais só com os métodos realmente usados
pelo componente sob teste — padrão intencional e comum (equivalente ao antigo
`jasmine.SpyObj<X>`, que não exigia o objeto completo).

**Correção:** cast na atribuição (`{ metodo: vi.fn() } as unknown as MockedObject<X>`), não na
declaração da variável — preserva tipagem completa (sem `| undefined`) para todo o uso posterior do
mock nos testes.

### 4. `mock.lastCall[0]` — pode ser `undefined`

`Mock.lastCall` é tipado como `Parameters<T> | undefined` (o mock pode nunca ter sido chamado). 3
ocorrências acessavam `[0]` diretamente. Como em todos os casos havia um
`expect(...).toHaveBeenCalled()` imediatamente antes (garantia em runtime), corrigido com non-null
assertion: `mock.lastCall![0]`.

### 5. `expect(x).toBe(valor, 'mensagem')` — sintaxe Jasmine de 2 argumentos

`toBe()` do Vitest só aceita 1 argumento (o valor esperado); Jasmine aceitava uma mensagem de
descrição opcional como segundo argumento. 12 ocorrências em `player.component.behavior.spec.ts`
(único arquivo afetado, não coberto pela lista de transformação do schematic porque o arquivo já
tinha sido normalizado por uma passada de reformatação de indentação anterior, mascarando o padrão
do detector do schematic).

**Correção:** removida a mensagem, mantendo só o valor esperado.

## Ação recomendada

Todas as correções acima já aplicadas nesta etapa. **Padrão a vigiar em qualquer refatoração futura
assistida por schematic**: um relatório de "0 TODOs" não é garantia de correção total — a suíte de
testes precisa rodar de fato (não só compilar) antes de confiar no resultado. Neste caso, 109-115
tests só começaram a falhar silenciosamente ANTES de eu forçar a execução real (o erro de tipo
TypeScript bloqueava a compilação, então nenhum teste sequer rodava até as correções manuais).

## Referências

`docs/ia-auditorias/2026-07-31__migracao-angular-etapa-12__claude.md`.
