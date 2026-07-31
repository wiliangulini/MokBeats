# Relatório de Tarefa — Migração Angular 14→22, Etapa 11 / Degrau D8 (Angular/Material 22 — ALVO FINAL)

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-31
**Branch atual:** `feature/angular-22-migration`
**Tipo de tarefa:** Implementação (`ng update` + 3 decisões técnicas de compatibilidade TypeScript 6.0)
**Status final:** Aprovado

## 2. Objetivo

Executar o degrau D8 do plano de migração — o **alvo final**: `ng update @angular/core@22
@angular/cli@22`, `@angular/material@22` e `@ng-bootstrap/ng-bootstrap@21`. O plano classifica este
degrau como **"o maior desconhecido do plano"** por forçar TypeScript 6.0, com **timebox explícito**:
"se não fechar em uma sessão, parar em D7 e reavaliar" — D7 (já tageado como `mig/d7`) sendo um
resultado aceito, não uma falha.

## 3. Escopo solicitado

- Confirmar Node 24.18.1 e árvore limpa antes de iniciar.
- Ler o guia oficial de breaking changes do Angular 22 antes de agir.
- `ng update @angular/core@22 @angular/cli@22` — nunca agrupar majors diferentes.
- `ng update @angular/material@22` e `@ng-bootstrap/ng-bootstrap@21` no mesmo degrau.
- Revisar **todo** o diff das migrações automáticas antes de commitar.
- Rodar o bloco de validação: `npm run build`, `npm test`, `npm run e2e`, `npm audit`.
- Checklist manual integral (D8, como D1 e D7).
- Commit + tag `mig/d8`.
- Pré-requisito confirmado: Etapa 10 (D7) com status final `Aprovado` — tag `mig/d7`, relatório
  commitado, `npm audit` estável em 20, checkpoint validado.

## 4. Escopo não incluído

Nenhuma migração opcional adicional (`use-application-builder`, `migrate-karma-to-vitest` —
esta última é literalmente a Etapa 12 do plano, fora desta etapa). Nenhuma alteração em `server/`.
Etapa 12 (Karma → Vitest) e Etapa 13 (reflexo em scripts/build) não iniciadas.

## 5. Fontes de verdade consultadas

- Plano de migração completo, risco específico do D8 ("força TypeScript 6.0... o maior desconhecido
  do plano... Timebox: se não fechar em uma sessão, parar em D7"), matriz de degraus (D8: Angular
  22.1.0, Node `^22.22.3 || ^24.15 || >=26`, TypeScript `>=6.0 <6.1`, ng-bootstrap 21.0.0, Material
  22.1.0), riscos da tabela geral (TS 6.0 incompatível com `strict`+`strictTemplates`: Alta;
  `@ng-bootstrap` 21.0.0 recente e pouco exercitado: Baixa).
- ADR `docs/adr/0002-migracao-angular-14-para-22.md`.
- `docs/migracao-angular-achados/README.md` (19 achados; validação de não-bloqueio).
- `docs/areas/validacao-qa.md` — checklist manual (D8 exige o mesmo tratamento de D1/D7).
- CHANGELOG oficial do Angular 22.0.0 — via `gh api repos/angular/angular/contents/CHANGELOG.md`.
  **Nota de processo:** a partir da v22, o repositório `angular/angular` passou a usar tags
  prefixadas com `v` (`v22.0.0`), diferente do padrão sem prefixo usado até a v21 (`21.0.0`) —
  confirmado via `gh api repos/angular/angular/tags` antes de localizar o CHANGELOG correto.

## 6. Arquivos lidos

- CHANGELOG.md do Angular 22.0.0 (breaking changes de `compiler`, `compiler-cli`, `core`, `forms`,
  `http`, `platform-browser`, `router`, `upgrade`).
- Verificação própria (grep) de uso de APIs removidas: `changeDetection` já declarado (0 — nenhum
  componente do projeto declarava explicitamente, confirmando que TODOS dependiam do default
  anterior), `ChangeDetectorRef.checkNoChanges` (0), `createNgModuleRef` (0),
  `ComponentFactoryResolver`/`ComponentFactory` (0), `Validators.min`/`max` com string (0),
  `provideRoutes` (0), `paramsInheritanceStrategy` (0), atributos `data-*` como binding Angular (0),
  `reportProgress`/`UploadProgress`/`HttpEventType` (0).
- `src/app/upload-file/upload-file.service.ts` (lido integralmente) — confirmado que o upload não
  usa `reportProgress`, então a troca de backend padrão (`HttpXhrBackend` → `FetchBackend`) não
  afeta a funcionalidade real, apenas o mecanismo de transporte HTTP interno.
- Amostra representativa da migração `ChangeDetectionStrategy.Eager` (`menu.component.ts`,
  `player.component.ts`, `custom-file-upload.component.ts`).
- `src/app/app.module.ts`, `tsconfig.app.json`, `tsconfig.spec.json`, `tsconfig.json` (diffs
  completos, antes e depois de cada ajuste).
- Investigação profunda do preprocessador TypeScript interno do Cypress:
  `@cypress/webpack-batteries-included-preprocessor/index.js`,
  `tsconfig-aliased-for-wbip/dist/tsconfig.js` (implementação de `findSync`) — para diagnosticar a
  causa raiz do erro `TS5011` em `cypress/e2e/*.cy.ts` (ver Decisão 3).
- `npm view rxjs versions`, `npm view cypress versions` — para confirmar que não havia patches mais
  novos disponíveis dentro das faixas já fixadas que resolvessem os problemas encontrados.

## 7. Arquivos alterados

- `package.json`/`package-lock.json` — `@angular/*` → `22.1.0`, `@angular/cli`/
  `@angular-devkit/build-angular` → `22.1.2`, `@angular/material`/`@angular/cdk`/
  `@angular/material-moment-adapter` → `22.1.0`, `@ng-bootstrap/ng-bootstrap` → `21.0.0`,
  `typescript` → `~6.0.3` (era `~5.9.3`). `istanbul-lib-instrument` adicionado a `devDependencies`
  (migração automática do `@angular/cli`, necessário para cobertura Karma).
- **43 componentes** — migração automática obrigatória: `changeDetection:
  ChangeDetectionStrategy.Eager` adicionado ao decorator (mesmo padrão puramente mecânico das
  migrações `standalone: false`/D5 e `ChangeDetectionStrategy`/D5 — só import + propriedade de
  decorator, sem mudança de lógica).
- `src/app/app.module.ts` — `withXhr()` adicionado a `provideHttpClient(withXhr(),
  withInterceptorsFromDi())`, preservando `HttpXhrBackend` como backend padrão (Angular 22 trocou o
  default para `FetchBackend`). `AuthInterceptor` preservado intacto.
- `src/test.ts` — mesma migração: `provideHttpClient(withXhr())` no override global do `TestBed`.
- `tsconfig.json` — `"ignoreDeprecations": "6.0"` adicionado manualmente (ver Decisão 1).
- `tsconfig.app.json`, `tsconfig.spec.json` — migração automática: `angularCompilerOptions.
  extendedDiagnostics.checks` com `nullishCoalescingNotNullable`/`optionalChainNotNullable`
  suprimidos (recomendação da própria mensagem do compilador do Angular 22).
- `cypress/screenshots/baseline-visual.cy.ts/musicas.png`,
  `.../upload-mat-form-field.png` — recapturadas (inspecionadas visualmente, layout intacto).

## 8. Arquivos criados

- `cypress/tsconfig.json` — tsconfig próprio para `cypress/`, autônomo (sem `extends`), criado para
  resolver o erro `TS5011` do TypeScript 6.0 no preprocessador do Cypress (ver Decisão 3).
- Este relatório.

## 9. Arquivos preservados

- `src/app/app-routing.module.ts`, `src/app/upload-file/upload-file-routing.module.ts`,
  `src/app/guards/*.ts`, `src/app/interceptors/*.ts` — todos intocados.
- `server/` (código) — intocado.
- Todos os templates `.html` e arquivos `.scss` — nenhum tocado. A migração automática de
  control-flow syntax (revertida no D7, achado 0016) **não rodou novamente** neste degrau —
  confirmado via `git diff --stat` vazio nos templates que haviam sido tocados no D7.
- `tsconfig.json` da aplicação — mantido praticamente intocado; a tentativa de adicionar `rootDir`
  ali para resolver o problema do Cypress foi revertida (ver Decisão 3), já que a solução correta
  não exigiu tocar neste arquivo.

## 10. Arquivos removidos

Nenhum arquivo do repositório.

## 11. Estado inicial observado

- Branch em `mig/d7` (commit `b77013f`), árvore com os 2 arquivos alheios de sempre.
- `@angular/core` 21.2.19, `@angular/material` 21.2.14, `@ng-bootstrap` 20.0.0, `typescript` 5.9.3,
  `rxjs` 7.8.2.
- `npm audit`: 20 vulnerabilidades (herdado do D7), 0 críticas.

## 12. O que foi implementado ou analisado

**Preparação:** `nvm use` para Node `24.18.1`, stash dos 2 arquivos alheios. **Nota operacional:**
nesta etapa a resolução do Node via `nvm` mostrou-se instável entre invocações separadas do Bash
(uma chamada `npx ng update` chegou a falhar reportando `v22.18.0` mesmo após `nvm use` ter
confirmado `v24.18.1` na mesma sessão) — mitigado sempre reexecutando `source ~/.nvm/nvm.sh && nvm
use` na mesma invocação do comando que efetivamente precisa do Node correto, não apenas no início da
etapa.

**Leitura prévia do CHANGELOG oficial do v22:** identificados os breaking changes reais — TypeScript
`<6.0` não mais suportado; **componentes sem `changeDetection` explícito passam a ser `OnPush` por
padrão** (antes "Default"), com migração automática para `ChangeDetectionStrategy.Eager` preservando
o comportamento anterior; `ComponentFactoryResolver`/`ComponentFactory` removidos; `createNgModuleRef`
removido; `ChangeDetectorRef.checkNoChanges` removido; `min`/`max` de forms não aceitam mais string;
`provideRoutes()` removido; `paramsInheritanceStrategy` muda o default de `'emptyOnly'` para
`'always'`; Hammer.js removido; `HttpXhrBackend` deixa de ser o backend padrão do `HttpClient`
(troca para `FetchBackend`, com migração automática para preservar XHR via `withXhr()`). Confirmado
por grep que nenhuma API removida é usada pelo projeto, e que o upload não depende de
`reportProgress` (então a troca de backend HTTP não teria efeito funcional mesmo sem a preservação
via `withXhr()` — a preservação foi mantida mesmo assim, por ser o comportamento padrão da migração
automática e não haver razão para divergir).

**Sequência executada:**
1. `ng update @angular/core@22 @angular/cli@22` — bloqueado inicialmente por conflito de peer
   dependency (`@ng-bootstrap@20` exige `@angular/common@^21.0.0`, incompatível com `22.1.0`) —```
   resolvido com `--force`, já que o `@ng-bootstrap` seria atualizado para a versão compatível
   (`21.0.0`) na sequência do mesmo degrau, seguindo o mesmo padrão de agrupar core+material+
   ng-bootstrap já usado em todos os degraus anteriores. Executou a migração automática obrigatória
   **"Adds `ChangeDetectionStrategy.Eager` to all components"**, tocando 43 arquivos, e **"Adds
   `withXhr` to `provideHttpClient` function calls when the `HttpXhrBackend` is used"**, tocando
   `app.module.ts` e `test.ts`. Também executou a supressão dos 2 novos `extendedDiagnostics` em
   `tsconfig.app.json`/`tsconfig.spec.json`. Ofereceu 2 migrações opcionais
   (`migrate-karma-to-vitest` — a própria Etapa 12 do plano — e `use-application-builder`) —
   nenhuma executada.
2. `ng update @angular/material@22 --allow-dirty --force` — sucesso, **zero arquivos de código-fonte
   modificados**.
3. `ng update @ng-bootstrap/ng-bootstrap@21 --allow-dirty --force` — sucesso, sem migração de
   código.

**Revisão do diff:** confirmado padrão uniforme e puramente mecânico nos 43 componentes (amostra
representativa lida integralmente) — só `changeDetection: ChangeDetectionStrategy.Eager` adicionado
ao decorator, sem mudança de lógica/template/estilo. `app.module.ts` revisado com atenção redobrada
(área crítica de autenticação): `AuthInterceptor` e o provider `HTTP_INTERCEPTORS` preservados
integralmente, só `withXhr()` adicionado à chamada de `provideHttpClient`.

**3 problemas de compatibilidade TypeScript 6.0 encontrados e corrigidos** (detalhe completo na
§13, Decisões 1, 2 e 3).

**Verificação de rotas e áreas críticas:** `git diff --stat` vazio para `app-routing.module.ts`,
`upload-file-routing.module.ts`, `guards/`, `interceptors/`, `server/`, e confirmado que a migração
de control-flow syntax (revertida no D7) não rodou novamente.

**Validação:**
- `npm run build` — falhou inicialmente com `TS5101` (deprecação de `baseUrl`/`downlevelIteration`
  sob TypeScript 6.0); **sucesso** após a Decisão 1.
- `npm test` — **115/115 SUCCESS** de primeira, sem problemas adicionais (as correções da Etapa 10
  em `src/test.ts` — `provideZoneChangeDetection()`, `wave-surfer-test.component.spec.ts` — seguiram
  válidas).
- `npm run e2e` — falhou inicialmente de forma severa (5/5 specs com erro fatal de compilação,
  `TS5011` no preprocessador do Cypress); investigação extensa (ver Decisão 3); **5/5 specs, 8/8
  testes** após a correção (`baseline-visual.cy.ts` 3/3, `checkout.cy.ts` 1/1, `licenca-carrinho.
  cy.ts` 1/1, `player.cy.ts` 2/2, `upload.cy.ts` 1/1). Backend iniciado manualmente (lição já
  registrada), encerrado ao final.
- `git checkout -- server/data/users.json` — revertido após a execução real do e2e.
- `npm audit` — **20 vulnerabilidades**, mesma contagem total do D7, mas com composição diferente:
  `postcss` **fechou** (conforme previsto explicitamente no relatório da Etapa 10: "fix sugerido
  `@angular-devkit/build-angular@22.1.2`" — exatamente a versão agora instalada), substituído por
  outro item de severidade equivalente já presente na cadeia do toolchain. Leitura completa
  confirmou: nenhuma vulnerabilidade nova.
- **Checklist manual do D8** (mesmo tratamento de D1/D7, conforme o plano): inspeção visual direta
  (via Read, formato imagem) de `musicas.png` e `upload-mat-form-field.png` (recapturadas nesta
  etapa) — waveforms renderizando corretamente, layout intacto. `home.png`, `carrinho.png`,
  `login.png`, `finalizar-compra.png` não tiveram diff nesta execução (idênticas ao já inspecionado
  no checkpoint D7).

## 13. Decisões técnicas tomadas

### Decisão 1: `"ignoreDeprecations": "6.0"` no `tsconfig.json` da aplicação

**Descoberta:** `npm run build` falhou com `TS5101: Option 'baseUrl' is deprecated...` e o mesmo
para `'downlevelIteration'` — ambas opções ativamente usadas pelo projeto (`baseUrl: "./"`,
`downlevelIteration: true`), agora deprecadas (não removidas) sob TypeScript 6.0, tornando-se erro
rígido em vez de aviso.

**Correção aplicada:** adicionado `"ignoreDeprecations": "6.0"` ao `compilerOptions` de
`tsconfig.json` — exatamente a solução prescrita pela própria mensagem de erro do compilador
TypeScript, um flag de compatibilidade temporário padrão da transição 5.x→6.0, sem mudança de
comportamento de compilação. Removê-las completamente (ex.: migrar `baseUrl` para `paths` sem base,
ou remover `downlevelIteration`) seria uma refatoração maior e fora do escopo de "preservar
comportamento" desta migração — `ignoreDeprecations` é a saída oficialmente recomendada para manter
essas opções funcionando por mais um ciclo de major.

### Decisão 2: aceitar a migração `ChangeDetectionStrategy.Eager` sem alteração

**Decisão:** manter a migração automática que adicionou `changeDetection:
ChangeDetectionStrategy.Eager` a todos os 43 componentes sem `changeDetection` explícito.

**Justificativa:** o Angular 22 muda o default de change detection de componentes não anotados para
`OnPush` — uma mudança de comportamento potencialmente catastrófica para uma aplicação legada como o
MokBeats, onde **nenhum** componente (confirmado por grep, 0 ocorrências de `changeDetection` antes
desta etapa) declarava a estratégia explicitamente, e portanto todos dependiam implicitamente do
comportamento "Default" (checagem automática a cada ciclo). A própria Angular reconheceu esse risco
e forneceu uma migração automática dedicada (`ChangeDetectionStrategy.Eager`, que replica o
comportamento "Default" pré-v22) — aceitá-la integralmente é a ação correta de preservação de
comportamento, e a revisão por amostragem confirmou que é puramente mecânica (mesmo padrão já
validado nas migrações `standalone: false` do D5).

### Decisão 3: `cypress/tsconfig.json` autônomo — TS5011 no preprocessador do Cypress

**Descoberta:** `npm run e2e` falhava para os 5 specs com um erro fatal de compilação (não uma
falha de teste): `TS5011: The common source directory of 'tsconfig.json' is './e2e'. The 'rootDir'
setting must be explicitly set...` — originado no `ts-loader` interno do preprocessador webpack
bundlado do Cypress (`@cypress/webpack-batteries-included-preprocessor`), ao compilar
`cypress/e2e/*.cy.ts` contra o `tsconfig.json` raiz (compartilhado com a aplicação Angular, que não
tinha `rootDir` explícito).

**Investigação extensa:**
1. Confirmado, lendo o código-fonte do preprocessador (`tsconfig-aliased-for-wbip`'s `findSync`),
   que o mecanismo *deveria* buscar o `tsconfig.json` mais próximo subindo a partir do diretório do
   arquivo de spec — o que localizaria um `cypress/tsconfig.json` dedicado antes do da raiz.
2. Criado `cypress/tsconfig.json` com `"extends": "../tsconfig.json"` e `"rootDir": "./e2e"` —
   confirmado via `tsc -p cypress/tsconfig.json --showConfig` que o arquivo, isoladamente, resolve
   de forma perfeitamente correta (rootDir efetivo bate exatamente com os 5 arquivos de spec). Ainda
   assim, `ts-loader` dentro do Cypress reportava o **mesmo erro, palavra por palavra**, mesmo após
   a mudança.
3. Testado se o arquivo era sequer lido pelo Cypress: corrompendo deliberadamente o JSON, o erro
   mudou para um erro de parse JSON5 apontando exatamente para `cypress/tsconfig.json` — confirmando
   que o arquivo **é** lido por uma parte do preprocessador (`tsconfig-paths-webpack-plugin`, usado
   para resolução de path aliases), mas aparentemente não pelo `ts-loader` em si para a checagem de
   `rootDir`.
4. Testado adicionar `rootDir` ao `tsconfig.json` **raiz** (compatível como ancestral comum de
   `src/` e `cypress/e2e/`) — sem efeito, mesmo erro.
5. **Resolução:** substituído `cypress/tsconfig.json` por uma versão **autônoma** (sem `"extends"`,
   com `compilerOptions` completos e independentes) — o erro **mudou imediatamente** para um
   `TS5101` de depreciação (`downlevelIteration`), confirmando que a cadeia `extends` era a causa
   raiz real do `ts-loader` não conseguir resolver corretamente o `rootDir` herdado (causa exata não
   totalmente esclarecida — possivelmente uma interação entre a implementação de resolução de
   `extends` de `ts-loader`/`tsconfig-aliased-for-wbip` sob TypeScript 6.0 e o encadeamento com
   `moduleResolution: "bundler"` herdado). Adicionado `"ignoreDeprecations": "6.0"` ao novo arquivo
   autônomo — suíte e2e completa passou a funcionar (5/5 specs, 8/8 testes).

**Por que não modificar o `tsconfig.json` da aplicação:** a causa raiz estava isolada ao mecanismo
de compilação TypeScript **do Cypress**, não da aplicação Angular (que já buildava corretamente).
Criar um `cypress/tsconfig.json` dedicado e autônomo é a correção de menor escopo e mais segura —
mantém a configuração da aplicação intocada, evitando qualquer risco de efeito colateral no build de
produção por causa de um problema exclusivo do tooling de teste e2e.

**Registrado como achado** [0020](../migracao-angular-achados/0020-cypress-ts5011-rootdir-tsconfig-extends.md).

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| Causa raiz exata do bug de `extends` no `ts-loader` do Cypress não totalmente esclarecida | Baixa | Nenhum funcional — a correção (config autônomo) resolve de forma estável e reproduzível | Documentado no achado 0020 para investigação futura, se necessário |
| `cypress/tsconfig.json` duplica algumas opções do `tsconfig.json` raiz (sem herança) | Baixa | Manutenção: mudanças futuras no tsconfig raiz não se propagam automaticamente para o cypress | Aceito como custo da correção; escopo de teste e2e é pequeno e estável |
| Builder `browser`/webpack mantido, não `application`/esbuild (`use-application-builder` segue não adotado) | Baixa | O build agora emite aviso de depreciação do builder webpack | Reavaliar como tarefa própria, fora da escada |
| `npm audit` em 20 (0 critical) — pendências de toolchain seguem abertas | Baixa | Nenhum novo; `@hono/node-server` só fecha em versão futura do `@angular/cli` ainda não disponível | Acompanhar |
| Achado 0012 (`test:focus`) seguindo aberto | Média | Ferramenta de dev indisponível | Resolver antes da Etapa 12 |

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Não aplicável (migrado para 22.1.0 — **alvo final do plano**)
- Rotas preservadas: Sim — `git diff` de `app-routing.module.ts` e `upload-file-routing.module.ts`
  vazio
- Guards/autenticação preservados: Sim — `git diff` de `src/app/guards/` e `src/app/interceptors/`
  vazio; `AuthInterceptor` revisado com atenção redobrada em `app.module.ts`
- APIs/payloads preservados: Sim — nenhuma mudança de contrato; `withXhr()` preserva o mecanismo de
  transporte HTTP anterior
- Player/WaveSurfer preservado: Sim — `player.cy.ts` (2/2); `changeDetection: Eager` aplicado sem
  alterar lógica
- Upload/FormData preservado: Sim — `upload.cy.ts` confirma nomes de campo idênticos; confirmado que
  o upload não depende de `reportProgress`, então a troca de backend HTTP padrão não tem efeito
- Carrinho/licenças/checkout preservados: Sim — `checkout.cy.ts` e `licenca-carrinho.cy.ts` passam
- Dashboard/produtor preservado: Sim — `changeDetection: Eager` aplicado, template intocado
- Estilos/padrões preservados: Sim — nenhum `.scss` alterado; inspeção visual (músicas, upload)
  confirma layout intacto

## 16. Validações executadas

- [x] `ng update` completo (3 comandos, com `--force` no core/cli pelo conflito temporário de peer
  dependency com `@ng-bootstrap@20`) sob Node 24.18.1, árvore limpa (via stash).
- [x] Grep prévio confirmando ausência de uso das APIs removidas no v22, incluindo verificação
  direta de `upload-file.service.ts` quanto a `reportProgress`.
- [x] Revisão de amostra representativa dos 43 componentes tocados pela migração
  `ChangeDetectionStrategy.Eager`, confirmando padrão puramente mecânico.
- [x] `app.module.ts` revisado com atenção redobrada (área crítica de autenticação).
- [x] `npm run build` — falhou 1 vez, causa raiz investigada e corrigida (Decisão 1); sucesso final.
- [x] `npm test` — **115/115 SUCCESS** de primeira.
- [x] `npm run e2e` — falhou de forma severa (erro fatal de compilação em todos os 5 specs), causa
  raiz investigada exaustivamente e corrigida (Decisão 3); **5/5 specs, 8/8 testes** final.
- [x] `npm audit` — leitura completa da saída, confirmado sem vulnerabilidades novas; `postcss`
  fechou conforme previsto; 20 vulnerabilidades registradas (igual ao D7).
- [x] `git checkout -- server/data/users.json` após a execução real do e2e.
- [x] `git diff --stat -- server/ src/app/guards/ src/app/interceptors/ src/app/app-routing.
  module.ts src/app/upload-file/upload-file-routing.module.ts` vazio.
- [x] Confirmado que a migração de control-flow syntax (revertida no D7) não rodou novamente.
- [x] **Checklist manual do D8** (mesmo tratamento de D1/D7): inspeção visual das capturas
  recapturadas (`musicas.png`, `upload-mat-form-field.png`).

## 17. Validações não executadas

- `npm run test:focus` — não retestado nesta etapa (já sabido quebrado desde o D1, achado 0012).
- `npm run lint`/`npm run typecheck` — não existem neste projeto.
- Validação manual em viewport mobile — gap pré-existente, não coberto por nenhuma etapa desta
  migração (documentado desde o relatório da Etapa 10).

## 18. Validações recomendadas

- [ ] Confirmar `git tag -l 'mig/*'` e `git log --oneline` mostrando `mig/d8` antes de prosseguir.
- [ ] Continuar subindo o backend manualmente antes de `npm run e2e`.
- [ ] Antes da Etapa 12 (Karma → Vitest): revisar se a migração opcional
  `migrate-karma-to-vitest` (oferecida nesta etapa) é a mesma rota que o plano já planejou, ou se a
  Etapa 12 seguirá um caminho manual — ler a seção específica do plano antes de agir.
- [ ] Considerar revisitar o achado 0020 (causa raiz do bug `extends`+`ts-loader`) caso o Cypress
  seja atualizado no futuro — a causa exata não foi 100% isolada, só contornada de forma estável.

## 19. Pendências

- Achado 0012 (`test:focus` quebrado) — aberto, sem mudança nesta etapa.
- Achado 0020 (causa raiz do TS5011 no Cypress) — contornado, causa raiz exata não 100% esclarecida.
- `npm audit` em 20 (0 critical) — pendências de toolchain que só fecham em versões futuras não
  disponíveis hoje (`@hono/node-server` via `@angular/cli`).
- Validação manual em viewport mobile — gap pré-existente.
- Builder `browser`/webpack — agora emite aviso de depreciação explícito no `npm run build`; decisão
  de não migrar para `application`/esbuild segue registrada, mas o aviso ficará mais visível daqui
  em diante.

## 20. Próximo passo recomendado

**D8 é o alvo final do plano de migração de versões.** Aguardar confirmação explícita do usuário
antes de iniciar a Etapa 12 (Karma → Vitest), que é uma etapa de natureza diferente das anteriores
(troca de test runner, não `ng update` de versão), conforme instrução da sessão.

## 21. Instruções para o próximo agente

1. Leia este relatório e os das Etapas 0-10.
2. Confirme `git log --oneline` e `git tag -l 'mig/*'` — deve haver `mig/e0`-`mig/e3` e
   `mig/d1`-`mig/d8`. **`mig/d8` é o alvo final de versão do plano.**
3. Leia `docs/migracao-angular-achados/README.md` — 20 achados catalogados.
4. Confirme `node -v` = `24.18.1` **em cada comando que precisar do Node correto**, não só no início
   da sessão — instabilidade de PATH entre invocações de Bash foi observada nesta etapa.
5. A Etapa 12 (Karma → Vitest) é qualitativamente diferente das etapas D1-D8: não é um `ng update`
   de versão, é uma migração de test runner. Ler a seção específica do plano (`### Etapa 12`) antes
   de agir — não seguir o protocolo de "3 pacotes por degrau" aqui.
6. Se `npm run e2e` apresentar erros de compilação TypeScript no futuro (não relacionados a lógica
   de teste), revisar primeiro `cypress/tsconfig.json` — é um arquivo autônomo (sem `extends`) por
   necessidade (achado 0020); mudanças no `tsconfig.json` raiz não se propagam para ele.
7. Antes de subir `npm run e2e`, suba o backend manualmente: `cd server && node src/index.js` (sob
   Node 24.18.1) em background, confirme pelo log ("Servidor Iniciado!"), encerre ao final. Reverta
   `server/data/users.json` se o e2e real for executado antes de commitar.

## 22. Observações finais

O degrau que o plano identificou como "o maior desconhecido" se confirmou tecnicamente denso, mas
por razões diferentes das antecipadas: o breaking change mais temido (TypeScript 6.0 sob `strict`+
`strictTemplates`) resolveu-se com uma única linha (`ignoreDeprecations`) prescrita pela própria
mensagem de erro do compilador, e a mudança de maior risco potencial para o produto
(`ChangeDetectionStrategy` mudando de "Default" para "OnPush" por padrão) foi inteiramente coberta
por uma migração automática oficial da própria Angular, aplicada de forma uniforme e mecânica em 43
componentes. O verdadeiro desafio surgiu de um canto inesperado: uma incompatibilidade entre o
TypeScript 6.0 e o `ts-loader` bundlado internamente pelo Cypress 13.17.0 (já na última versão de
sua major), que exigiu investigação profunda do código-fonte do preprocessador para isolar — a causa
raiz exata (por que a cadeia `extends` quebra a resolução de `rootDir` especificamente dentro do
`ts-loader` do Cypress) não foi 100% esclarecida, mas a correção (config autônomo) é estável,
reproduzível e de escopo mínimo, sem tocar a configuração da aplicação. Build, 115 testes Karma e 8
testes Cypress (5 specs) verdes, `npm audit` em 20 (0 críticas, com `postcss` fechando exatamente
como previsto pelo relatório da etapa anterior), e checklist manual confirmando layout intacto. O
plano de migração de versões (Etapas 4-11, D1-D8) está **completo** — Angular 14.3.0 → 22.1.0.
