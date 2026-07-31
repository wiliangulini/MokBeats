# Relatório de Tarefa — Migração Angular 14→22, Etapa 12 (Karma → Vitest)

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-31
**Branch atual:** `feature/angular-22-migration`
**Tipo de tarefa:** Implementação (migração de test runner + pré-requisito de builder, ambos
validados/decididos com o usuário) — qualitativamente diferente dos degraus D1-D8 (não é `ng update`
de versão do Angular)
**Status final:** Aprovado

## 2. Objetivo

Executar a Etapa 12 do plano: migrar o runner de testes unitários de Karma para Vitest, o único
caminho que fecha definitivamente o grupo de vulnerabilidades do `npm audit` ligado ao Karma
(`fixAvailable: karma@0.12.33` — um downgrade, ou seja, "sem correção futura" enquanto o Karma
estiver instalado).

## 3. Escopo solicitado

- Migrar os alvos `test` e `test-focus` de `angular.json` para o builder Vitest.
- Portar os 54 specs (API do `TestBed` inalterada; muda o arcabouço de asserção/mock).
- Atualizar `tsconfig.spec.json`/`tsconfig.spec.focus.json`.
- Remover `karma.conf.js`, pacotes `karma-*`, `jasmine-core`, `@types/jasmine`.
- **Preservar a distinção `test` vs `test:focus`** (`src/test.ts`/`src/test.focus.ts`).
- DoD: os 115 testes continuam existindo e passando; `npm audit` = 0 (ou cada remanescente
  justificado com `fixAvailable` e alcance).
- Pré-requisito confirmado: Etapa 11 (D8) com status final `Aprovado` — tag `mig/d8`.

## 4. Escopo não incluído

Etapa 13 (reflexo em build/scripts/limpeza) não iniciada. Nenhum deploy. Nenhuma alteração em
`server/`.

## 5. Divergência do plano descoberta em execução (validada com o usuário)

O schematic oficial `ng update @angular/cli --name migrate-karma-to-vitest` — o mecanismo
concreto para esta etapa — **recusou migrar o projeto**: *"Project 'MokBeats_FrontEnd' cannot be
migrated to Vitest yet. The project must first be migrated to use the '@angular/build:application'
builder."* O plano descrevia a Etapa 12 como uma migração isolada de test runner, sem prever essa
dependência do builder `application`/esbuild — cuja adoção havia sido **recusada de forma
consistente em todos os 6 degraus anteriores** (D3-D8) por ser modernização de infraestrutura fora
do escopo original de "preservar comportamento".

Apresentei a divergência ao usuário via pergunta direta antes de agir, com duas opções: (A) migrar
também para o builder `application` como pré-requisito, ou (B) parar em D8 sem adotar Vitest. **O
usuário escolheu a opção A.**

## 6. Fontes de verdade consultadas

- Plano de migração completo, seção "Etapa 12 — Karma → Vitest" (linhas 456-477) e critérios de
  aceite (§8, item 4: `npm audit` = 0 ou justificado).
- `docs/migracao-angular-achados/README.md` (20 achados antes desta etapa).
- Código-fonte do `@angular/build` instalado (`node_modules/@angular/build/src/builders/unit-test/`)
  — para diagnosticar 2 problemas de configuração não documentados no plano (ver §13, Decisões 4 e 5).
- `node_modules/wavesurfer.js/package.json` (`exports` map) e `npm pack wavesurfer.js@7.12.11
  --dry-run --json` — para diagnosticar e corrigir a quebra do import do plugin Minimap sob esbuild.

## 7. Arquivos lidos

- Saída completa dos 2 schematics oficiais (`use-application-builder`,
  `migrate-karma-to-vitest`) e do schematic `refactor-jasmine-vitest`.
- `karma.conf.js` (antes de removê-lo — confirmado que não havia configuração customizada
  load-bearing além de padrões default já cobertos pela nova configuração).
- `src/test.ts`, `src/test.focus.ts` (antes/depois de cada ajuste).
- Amostra + revisão integral de diff dos 13 arquivos transformados pelo `refactor-jasmine-vitest`
  (relatório do schematic: 54 escaneados, 13 transformados, 0 TODOs — confirmado por execução real
  que "0 TODOs" não significava "0 bugs", ver achado 0023).
- `node_modules/@angular/build/src/builders/unit-test/schema.json` (opções do builder) e
  `runners/vitest/build-options.js` (lógica de `getZoneTestingStrategy`) — para diagnosticar os 2
  problemas de configuração do builder (ver §13, Decisões 4-5).
- `node_modules/@angular/build/src/builders/unit-test/../../../utils/...` (via
  `tsconfig-aliased-for-wbip`, resolução de `wavesurfer.js` exports) — reaproveitando a mesma
  disciplina de investigação de causa raiz das etapas anteriores.

## 8. Arquivos alterados

**Commit 1 — migração do builder (pré-requisito, `5b98f01`):**
- `angular.json` — builders `build`/`serve`/`extract-i18n`/`test`/`test-focus` renomeados para
  `@angular/build:*`; `outputPath` estruturado; `polyfills` viram array; `vendorChunk`/
  `buildOptimizer` removidos (não aplicáveis ao esbuild); `main` → `browser` no alvo `build`;
  `scripts` (jQuery/Bootstrap/mask) preservados na mesma ordem.
- `karma.conf.js` — plugin `@angular-devkit/build-angular/plugins/karma` removido (renomeado no
  novo pacote; arquivo inteiro removido no commit 2).
- `package.json`/`package-lock.json` — `@angular-devkit/build-angular` → `@angular/build`.
- `tsconfig.json` — `esModuleInterop: true` adicionado; `downlevelIteration` removido (não mais
  necessário com o target ES2022 do esbuild).
- `src/app/player/player.component.ts`, `src/app/wave-surfer-test/wave-surfer-test.component.ts` —
  import do plugin Minimap corrigido (achado 0022).
- `package.json`: `wavesurfer.js` resolvido para `7.12.11` (dentro da faixa já declarada `^7.8.2`,
  sem alteração da faixa em si).
- `angular.json`: `polyfills` dos alvos `test`/`test-focus` corrigido de string para array (schema
  mais estrito do novo builder de teste, ainda em Karma nesse ponto).

**Commit 2 — migração para Vitest (`d102726`):**
- `angular.json` — alvos `test`/`test-focus` migrados para `@angular/build:unit-test`
  (`runner: "vitest"`); `test-focus` ganhou `"include"` explícito (achado 0024); configuração
  `build.configurations.testing` ganhou `"polyfills": ["src/polyfills.ts", "zone.js"]` (achado 0024).
- `tsconfig.spec.json` — `"types": ["jasmine"]` → `["vitest/globals"]`.
- `src/test.ts` — removida a chamada `getTestBed().initTestEnvironment(...)` (o builder Vitest
  inicializa automaticamente); adicionados stubs mínimos para `IntersectionObserver` e
  `DataTransfer` (lacunas do jsdom, ver achado 0024... — na verdade documentado dentro do próprio
  arquivo, não um achado separado por ser correção pontual e pequena).
- `src/test.focus.ts` — reescrito como arquivo mínimo de documentação (a descoberta de specs agora é
  via `"include"` do builder, não mais via imports diretos).
- **13 arquivos `.spec.ts`** — sintaxe Jasmine → Vitest via schematic `refactor-jasmine-vitest`, mais
  correções manuais em 7 desses (ver achado 0023): `wave-surfer-test.component.behavior.spec.ts`,
  `service/carrinho.service.spec.ts`, `service/music-player.service.behavior.spec.ts`,
  `produtores/produtores.component.spec.ts`, `player/player.component.behavior.spec.ts`,
  `musicas/musicas.service.spec.ts`, `login/login.component.spec.ts`,
  `carrinho/carrinho.component.spec.ts`, `custom-file-upload/custom-file-upload.component.spec.ts`.
- `package.json`/`package-lock.json` — removidos `@types/jasmine`, `jasmine-core`, `karma`,
  `karma-chrome-launcher`, `karma-coverage`, `karma-jasmine`, `karma-jasmine-html-reporter`;
  adicionados `vitest`, `jsdom`; `test:focus` script perdeu a flag `--browsers=ChromeHeadless`
  (específica do Karma, sem equivalente/necessidade no Vitest).
- `karma.conf.js` — removido.
- 6 screenshots de `baseline-visual.cy.ts` — recapturadas (inspecionadas visualmente).

## 9. Arquivos criados

- `docs/migracao-angular-achados/0021-dist-output-muda-para-dist-browser.md` (achado crítico,
  ação obrigatória na Etapa 13).
- `docs/migracao-angular-achados/0022-wavesurfer-exports-map-quebra-sob-esbuild.md`.
- `docs/migracao-angular-achados/0023-schematic-jasmine-vitest-gaps.md`.
- `docs/migracao-angular-achados/0024-vitest-builder-config-zonejs-e-include.md`.
- Este relatório.

## 10. Arquivos preservados

- `src/app/app-routing.module.ts`, `src/app/upload-file/upload-file-routing.module.ts`,
  `src/app/guards/*.ts`, `src/app/interceptors/*.ts`, `src/app/app.module.ts` — todos intocados.
- `server/` (código) — intocado.
- Todos os templates `.html`/estilos `.scss` — nenhum tocado.
- Nenhuma lógica de componente ou serviço alterada — só arquivos de configuração de build/teste e os
  próprios arquivos de spec.

## 11. Arquivos removidos

- `karma.conf.js`.
- Arquivo de relatório transitório `jasmine-vitest-<timestamp>.md` gerado pelo schematic — conteúdo
  incorporado a este relatório e ao achado 0023; removido para não deixar arquivo solto na raiz
  (`PROJECT_RULES.md §15`).

## 12. Estado inicial observado

- Branch em `mig/d8` (commit `b0a4f0f`), árvore com os 2 arquivos alheios de sempre.
- Builder `@angular-devkit/build-angular:browser`, testes via Karma/Jasmine, 115 testes.
- `npm audit`: 20 vulnerabilidades (0 críticas), herdado do D8.

## 13. O que foi implementado e decisões técnicas tomadas

### Decisão 1: migrar também para o builder `application`/esbuild (validada com o usuário)

Detalhada na §5. Executado `ng update @angular/cli --name use-application-builder`, revisão completa
do diff (4 arquivos), validação isolada (build + 115 testes Karma + 5 specs/8 testes Cypress) **antes**
de prosseguir para a parte 2 (Vitest), como um commit próprio — permite reverter só essa parte se
necessário, sem perder a decisão de dividir a etapa em 2 passos verificáveis.

### Decisão 2: corrigir o import do Minimap (`wavesurfer.js`) — achado 0022

O build sob esbuild falhou em área crítica (player). Investigação de causa raiz em 2 camadas
(subpath incorreto no import + bug de empacotamento na versão instalada do pacote) documentada
integralmente no achado 0022. Corrigido sem expandir escopo: subpath ajustado no código, patch do
`wavesurfer.js` atualizado **dentro da faixa já autorizada** (`^7.8.2` → resolvido para `7.12.11`,
sem tocar `package.json`).

### Decisão 3: revisão de amostra + validação funcional > confiar cegamente no relatório do schematic — achado 0023

O schematic `refactor-jasmine-vitest` reportou "0 TODOs / todos os padrões transformados com
sucesso." Revisão manual do diff (disciplina já estabelecida em todas as etapas anteriores) revelou
um bug de correção real (não apenas incompletude sinalizada): o padrão `(done) => setTimeout(() =>
{...; done(); })` foi convertido para `async () => {...}` sem envolver o `setTimeout` numa Promise
aguardada, quebrando a semântica assíncrona de 2 testes. Corrigido manualmente, junto com 5 outras
categorias de incompatibilidade de tipos TypeScript não sinalizadas pelo schematic (detalhe completo
no achado 0023). **Nenhuma correção assumiu que "0 TODOs" significava "seguro" — a suíte só foi
considerada validada após rodar de fato e chegar a 115/115.**

### Decisão 4-5: configuração do builder `unit-test` (`zone.js` nos polyfills + `include` de `test-focus`) — achado 0024

Dois problemas de configuração não documentados no plano, diagnosticados por leitura direta do
código-fonte do builder instalado (mesma disciplina de investigação já usada nos achados 0015/0019/
0020): `zone.js/testing` usando `await import()` dinâmico incompatível com o target configurado
(resolvido incluindo a string `"zone.js"` no array `polyfills` da configuração `testing`, escopado
só a testes); e o alvo `test-focus` tentando compilar todos os 54 specs contra um `tsConfig`
restrito (resolvido com a opção própria `"include"` do builder). **Efeito colateral positivo:** essa
segunda correção resolve também o achado 0012 (`test:focus` quebrado desde a Etapa 4/D1) — `npm run
test:focus` volta a funcionar, 27 testes passando.

### Decisão 6: registrar o achado 0021 (output `dist/` → `dist/browser/`) sem corrigir agora

A migração do builder muda onde a build de produção é escrita. Isso **quebra silenciosamente**
`deploy-to-vps.sh` (que faz `rsync` a partir de `dist/`), mas corrigir scripts de deploy é
explicitamente escopo da Etapa 13 ("Reflexo em build, scripts e limpeza"), não desta. Registrado como
achado de severidade **Alta** com ação obrigatória sinalizada para a próxima etapa — decisão de não
corrigir agora é deliberada (não expandir escopo), não uma omissão.

## 14. Validações executadas

- [x] `ng update` (2 schematics) sob Node 24.18.1, árvore limpa (via stash).
- [x] Revisão completa do diff da migração de builder (commit 1) antes de prosseguir ao Vitest.
- [x] `npm run build` — sucesso (após corrigir achado 0022), em ambos os commits.
- [x] `npm test` — **115/115 SUCCESS** (54 arquivos de spec), Karma (commit 1) e depois Vitest
  (commit 2).
- [x] `npm run test:focus` — **27/27 SUCCESS** (3 arquivos) — resolve o achado 0012.
- [x] `npm run e2e` — **5/5 specs, 8/8 testes**, em ambos os commits (backend iniciado manualmente).
- [x] `git checkout -- server/data/users.json` após cada execução real do e2e.
- [x] `npm audit` — **20 → 7 vulnerabilidades** (todas moderate, 0 high/critical). Leitura completa
  confirmando que a cadeia karma/brace-expansion fechou por completo; `npm audit fix` (não-destrutivo)
  testado para os 3 itens remanescentes (`@hono/node-server`, `qs`, `uuid`) — sem efeito real (nenhum
  fix aplicável sem `--force`, que exigiria downgrade do `@angular/cli` ou bump de 2 majors do
  `cypress`).
- [x] Inspeção visual das 6 capturas de tela recapturadas (`home`, `carrinho`, `login`,
  `finalizar-compra`, `musicas`, `upload-mat-form-field`) — layout intacto.
- [x] `git diff --stat -- server/ src/app/guards/ src/app/interceptors/ src/app/app-routing.
  module.ts src/app/upload-file/upload-file-routing.module.ts src/app/app.module.ts` vazio.

## 15. Validações não executadas

- `npm run lint`/`npm run typecheck` — não existem neste projeto.
- Validação manual em viewport mobile — gap pré-existente, não coberto por nenhuma etapa desta
  migração.

## 16. Compatibilidade com legado MokBeats

- Rotas preservadas: Sim — `git diff` vazio.
- Guards/autenticação preservados: Sim — `git diff` vazio.
- APIs/payloads preservados: Sim — nenhuma alteração de contrato.
- Player/WaveSurfer preservado: Sim — `player.cy.ts` (2/2); a correção do import do Minimap foi
  puramente de resolução de módulo, sem mudança de comportamento (confirmado visualmente e via e2e).
- Upload/FormData preservado: Sim — `upload.cy.ts` confirma nomes de campo idênticos.
- Carrinho/licenças/checkout preservados: Sim — `checkout.cy.ts`/`licenca-carrinho.cy.ts` passam.
- Estilos/padrões preservados: Sim — nenhum `.scss` alterado; inspeção visual de 6 telas confirma.
- **115 testes preservados** (DoD explícito do plano): Sim — mesma contagem exata, antes e depois.

## 17. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| Output `dist/` → `dist/browser/` quebra scripts de deploy | **Alta** | Deploy real falharia/publicaria site incompleto sem correção | Achado 0021 — ação **obrigatória** na Etapa 13, antes de qualquer deploy |
| `npm audit` em 7 (0 critical/high) — 3 itens sem fix não-destrutivo disponível | Baixa | Nenhum novo; já era esperado pelo padrão do plano (DoD aceita remanescentes justificados) | Acompanhar; `@hono/node-server` fecha em `@angular/cli` futuro, `qs`/`uuid` exigiriam bump de major do `cypress` |
| Builder `browser`/webpack completamente removido (não mais reversível sem novo `ng update`) | Baixa | Nenhum funcional — validado build+testes+e2e em ambos os commits | Nenhuma; decisão já tomada e validada com o usuário |
| Causa raiz do bug de empacotamento do `wavesurfer.js@7.12.3` (achado 0022) não investigada além do necessário para corrigir | Baixa | Nenhum — resolvido via patch mais novo já dentro da faixa autorizada | N/A |

## 18. Pendências

- **Achado 0021 (Alta, obrigatório):** ajustar scripts de deploy para `dist/browser/` antes de
  qualquer deploy real — escopo da Etapa 13.
- `npm audit` em 7 — 3 itens sem fix não-destrutivo, documentados e aceitos conforme o DoD do plano.
- Validação manual em viewport mobile — gap pré-existente.

## 19. Próximo passo recomendado

Aguardar confirmação explícita do usuário antes de iniciar a Etapa 13 (reflexo em build, scripts e
limpeza) — que precisa **obrigatoriamente** tratar o achado 0021 (`dist/` → `dist/browser/`) antes
de qualquer deploy, além do escopo já previsto no plano (resolução de Node local em
`deploy-to-vps.sh`, remoção do CSS duplicado do Bootstrap, limpeza do vocabulário de "ponte EOL" em
`start.sh`).

## 20. Instruções para o próximo agente

1. Leia este relatório e os das Etapas 0-11.
2. Confirme `git log --oneline` e `git tag -l 'mig/*'` — deve haver `mig/e0`-`mig/e3`,
   `mig/d1`-`mig/d8` e `mig/e12` (esta etapa).
3. Leia `docs/migracao-angular-achados/README.md` — 24 achados catalogados (0012 agora resolvido).
4. **Leia o achado 0021 antes de tocar em qualquer script de deploy** — é o item de maior risco
   real desta etapa, com ação obrigatória.
5. Confirme `node -v` = `24.18.1` **em cada comando que precisar do Node correto**.
6. Antes de rodar `npm run e2e`, suba o backend manualmente: `cd server && node src/index.js` (sob
   Node 24.18.1), confirme pelo log, encerre ao final. Reverta `server/data/users.json` se
   necessário.
7. `npm run test:focus` agora funciona — 27 testes, 3 arquivos `.behavior.spec.ts`. Se novos specs
   "focados" forem adicionados no futuro, o padrão `src/app/**/*.behavior.spec.ts` em
   `angular.json`'s `test-focus.options.include` os capturará automaticamente.

## 21. Observações finais

Etapa qualitativamente diferente das anteriores — não um `ng update` de versão, mas uma troca de
test runner que revelou uma dependência não documentada no plano (o builder `application` como
pré-requisito), tratada com uma pergunta direta ao usuário em vez de decisão unilateral, dado que
alterava uma decisão já tomada e reafirmada 6 vezes ao longo da migração. A disciplina de "não
confiar cegamente em ferramentas automáticas" — já estabelecida desde a Etapa 4 (achado 0012
original) — se provou necessária de novo: tanto o schematic de refatoração Jasmine→Vitest quanto a
configuração do builder Vitest tinham lacunas reais que só a execução completa da suíte (não a
compilação, não o relatório do schematic) expôs. O resultado líquido é positivo além do escopo
mínimo: `npm audit` caiu de 20 para 7 (0 críticas/altas), e o achado 0012 — aberto desde a Etapa 4 —
foi resolvido como efeito colateral. O achado 0021 (mudança do diretório de output) é o único item
de risco real remanescente, e está claramente sinalizado como bloqueador da Etapa 13.
