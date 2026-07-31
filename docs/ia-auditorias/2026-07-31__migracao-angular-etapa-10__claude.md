# Relatório de Tarefa — Migração Angular 14→22, Etapa 10 / Degrau D7 (Angular/Material 21 — CHECKPOINT)

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-31
**Branch atual:** `feature/angular-22-migration`
**Tipo de tarefa:** Implementação (`ng update` + 2 decisões técnicas + 1 decisão de dependência validada com o usuário)
**Status final:** Aprovado

## 2. Objetivo

Executar o degrau D7 do plano de migração: `ng update @angular/core@21 @angular/cli@21`,
`@angular/material@21` e `@ng-bootstrap/ng-bootstrap@20`. O plano marca este degrau como o
**checkpoint entregável e ponto de parada aceito** da migração — estado mergeável em `dev`, com
validação completa e checklist manual, servindo como entrega garantida caso o D8 (TypeScript 6.0)
se mostre hostil.

## 3. Escopo solicitado

- Confirmar Node 24.18.1 e árvore limpa antes de iniciar.
- Ler o guia oficial de breaking changes do Angular 21 antes de agir.
- `ng update @angular/core@21 @angular/cli@21` — nunca agrupar majors diferentes.
- `ng update @angular/material@21` e `@ng-bootstrap/ng-bootstrap@20` no mesmo degrau.
- Revisar **todo** o diff das migrações automáticas antes de commitar.
- Rodar o bloco de validação: `npm run build`, `npm test`, `npm run e2e`, `npm audit`.
- **Por ser checkpoint:** complementar com o checklist manual de `docs/areas/validacao-qa.md`.
- Commit + tag `mig/d7`.
- Pré-requisito confirmado: Etapa 9 (D6) com status final `Aprovado` — tag `mig/d6`, relatório
  commitado, `npm audit` confirmado em 20, 0 críticas.

## 4. Escopo não incluído

Nenhum outro degrau (D8). Nenhuma alteração em `server/`. Nenhuma das 2 migrações opcionais
oferecidas pelo `ng update` (`use-application-builder`, `router-current-navigation`) foi executada.
A migração de control-flow syntax (`@if`/`@for`/`@switch`), que rodou como obrigatória nesta etapa
(diferente do D6, onde era opcional), foi revertida — ver Decisão 1. Etapa 11 (D8) não iniciada.

## 5. Fontes de verdade consultadas

- Plano de migração completo, seção "Etapas 4-11", risco específico do D7 ("CHECKPOINT. Estado
  entregável e mergeável em `dev`. Rodar validação completa + checklist manual integral"), matriz de
  degraus (D7: Angular 21.2.19, Node idem D6, TypeScript `>=5.9 <6.1`, ng-bootstrap 20.0.0, Material
  21.2.14).
- ADR `docs/adr/0002-migracao-angular-14-para-22.md`.
- `docs/migracao-angular-achados/README.md` (19 achados após esta etapa; validação de não-bloqueio).
- `docs/areas/validacao-qa.md` — checklist manual mínimo e fluxos a validar (checkpoint).
- CHANGELOG oficial do Angular 21.0.0 (via `gh api repos/angular/angular/contents/CHANGELOG.md`,
  tag `21.0.0`) — lido integralmente antes de agir.

## 6. Arquivos lidos

- CHANGELOG.md do Angular 21.0.0 (breaking changes de `common`, `compiler-cli`, `core`, `elements`,
  `forms`, `platform-browser`, `router`, `upgrade`, `zone.js`).
- Verificação própria (grep) de uso de APIs removidas: `NgModuleFactory` (0), `moduleId` de
  `@Component` (0 — único hit era variável local não relacionada em spec), `interpolation:` de
  Component (0), `ApplicationConfig` de `platform-browser` (0), `UpgradeAdapter` (0),
  `lastSuccessfulNavigation` (0), `provideZoneChangeDetection`/`NgZone` (0, esperado — ainda não
  aplicado antes desta etapa).
- `angular.json`, `tsconfig.json`, `src/main.ts` (diffs completos, antes e depois de cada ajuste).
- `package.json` (diff completo revisado).
- `node_modules/@angular/common/package.json` (campo `exports`, ausência de `main`/`types` de
  nível raiz) e `npm view rxjs@7.8.2 exports` — para diagnosticar e confirmar a causa raiz do erro
  de build que motivou a Decisão 2.
- Amostra representativa dos 28 templates tocados pela migração de control-flow (ex.:
  `src/app/carrinho/cartModal/cart-modal.component.html`) — para confirmar que era reformatação
  completa de sintaxe, não correção pontual.
- `src/app/wave-surfer-test/wave-surfer-test.component.ts`, `.spec.ts` e `.behavior.spec.ts` — para
  diagnosticar a falha de teste da Decisão 3.
- `cypress/e2e/baseline-visual.cy.ts` — para entender a cobertura visual disponível (desktop-only,
  sem viewport mobile).
- Screenshots `home.png`, `carrinho.png`, `upload-mat-form-field.png` (inspeção visual direta via
  Read, formato imagem) — confirmação do checklist manual do checkpoint.
- `src/app/app-routing.module.ts`, `src/app/upload-file/upload-file-routing.module.ts`,
  `src/app/app.module.ts`, `src/app/guards/`, `src/app/interceptors/`, `server/` — confirmados sem
  alteração (`git diff --stat` vazio para todos).

## 7. Arquivos alterados

- `package.json`/`package-lock.json` — `@angular/*` → `21.2.19`, `@angular/cli`/
  `@angular-devkit/build-angular` → `21.2.19`, `@angular/material`/`@angular/cdk`/
  `@angular/material-moment-adapter` → `21.2.14`, `@ng-bootstrap/ng-bootstrap` → `20.0.0`,
  `typescript` → `~5.9.3` (era `~5.8.3`). **`rxjs`** `~7.4.0` → `~7.8.2` (ver Decisão 2, validada
  com o usuário).
- `tsconfig.json` — `moduleResolution` mantido em `"bundler"` (migração automática); campo `lib`
  removido (migração automática — TypeScript infere o default a partir de `target: "ES2022"`).
- `src/main.ts` — migração automática obrigatória: `provideZoneChangeDetection` importado e
  aplicado via `bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()] })`.
- `src/test.ts` — **ajuste manual**: `provideZoneChangeDetection()` adicionado ao override global de
  `TestBed.configureTestingModule` (ver Decisão 3).
- `src/app/wave-surfer-test/wave-surfer-test.component.spec.ts` — **ajuste manual**: `component.music`
  definido antes de `fixture.detectChanges()` (ver Decisão 3).
- `cypress/screenshots/baseline-visual.cy.ts/upload-mat-form-field.png` — recapturada durante a
  execução do e2e (mesmo padrão de etapas anteriores; inspecionada visualmente, ver §12).

## 8. Arquivos criados

Este relatório e 4 achados: `0016`, `0017`, `0018`, `0019`.

## 9. Arquivos preservados

- **28 templates** revertidos manualmente da migração automática de control-flow syntax (lista
  completa na Decisão 1) — mantidos com `*ngIf`/`*ngFor`/`*ngSwitch`.
- `src/app/app-routing.module.ts`, `src/app/upload-file/upload-file-routing.module.ts`,
  `src/app/app.module.ts`, `src/app/guards/*.ts`, `src/app/interceptors/*.ts` — todos intocados.
- `server/` (código) — intocado.
- Todos os arquivos `.scss` — nenhum tocado.

## 10. Arquivos removidos

Nenhum arquivo do repositório.

## 11. Estado inicial observado

- Branch em `mig/d6` (commit `4d7d1fb`), árvore com os 2 arquivos alheios de sempre.
- `@angular/core` 20.3.27, `@angular/material` 20.2.14, `@ng-bootstrap` 19.0.1, `typescript` 5.8.3,
  `rxjs` 7.4.0.
- `npm audit`: 20 vulnerabilidades (herdado do D6), 0 críticas.

## 12. O que foi implementado ou analisado

**Preparação:** mesmo procedimento das etapas anteriores — `nvm use` para Node `24.18.1`, stash dos
2 arquivos alheios antes do `ng update`, devolvidos após o commit.

**Leitura prévia do CHANGELOG oficial do v21:** identificados os breaking changes reais —
`NgModuleFactory` removido, `moduleId` removido de `@Component`, opção `interpolation` removida de
`@Component`, `ApplicationConfig` removido de `@angular/platform-browser` (mover para
`@angular/core`), `UpgradeAdapter` removido, `lastSuccessfulNavigation` do Router agora é signal
(precisa ser invocado), TypeScript `<5.9` não mais suportado, e — o mais relevante para este
projeto — **Angular deixa de fornecer automaticamente um agendador de change detection para apps
baseados em ZoneJS**, exigindo `provideZoneChangeDetection()` explícito (migração automática
prevista). Confirmado por grep que nenhuma API removida é usada pelo projeto antes de agir.

**Sequência executada:**
1. `ng update @angular/core@21 @angular/cli@21` — sucesso. Executou 5 migrações obrigatórias:
   remoção de config Karma vazia (sem alteração), `moduleResolution` → `bundler` em `tsconfig.json`,
   `lib` → inferido de `target` em `tsconfig.json`, `BootstrapContext`/`ApplicationConfig` (sem
   alteração — projeto não usa SSR nem importava de `platform-browser`), **migração de bootstrap
   options para providers em `src/main.ts`** (`provideZoneChangeDetection`), e — de forma inesperada
   — **conversão obrigatória de control-flow syntax em 28 templates** (ver Decisão 1). Ofereceu 1
   migração opcional (`use-application-builder`) — não executada, mesma decisão de todos os degraus
   anteriores desde D3.
2. `ng update @angular/material@21 --allow-dirty` — sucesso, **zero arquivos de código-fonte
   modificados**.
3. `ng update @ng-bootstrap/ng-bootstrap@20 --allow-dirty` — sucesso, sem migração de código.

**Decisão 1 — revertida a migração obrigatória de control-flow syntax** (detalhe na §13).

**Bug de build encontrado e corrigido — Decisão 2:** `npm run build` falhou inicialmente com
`TS7016`/`TS7031` em importações de `rxjs` (mesmo sintoma do achado 0015, D6). Diferente do D6,
reverter `moduleResolution` para `"node"` **não resolveu** — em vez disso, produziu uma cascata
maior de erros (`TS2307: Cannot find module '@angular/common/http'`,
`'@angular/material/snack-bar'`, `app-footer is not a known element`). Investigação confirmou que
`@angular/common@21` não tem mais campos `main`/`types` de nível raiz — depende inteiramente do
mapa `exports`, que só `moduleResolution: "bundler"` entende. `bundler` passou de recomendação
(D6) a **obrigatório** (D7). Isso reabriu o problema do `rxjs~7.4.0` sem a saída de reversão
disponível no D6 — decisão levada ao usuário via `AskUserQuestion` antes de agir (ver Decisão 2).

**Falhas de teste encontradas e corrigidas — Decisão 3:** após corrigir o build, `npm test`
inicialmente travou com um `TypeError` não relacionado ao `rxjs` (`Cannot read properties of
undefined (reading 'id')` em `wave-surfer-test.component.ts:56`) seguido de desconexão do Chrome
Headless por timeout. Após corrigir esse spec, restaram 2 falhas `NG0100:
ExpressionChangedAfterItHasBeenCheckedError` em `CartModalComponent` e `LoginComponent`. Ambas
diagnosticadas e corrigidas conforme detalhado na §13.

**Verificação de rotas e áreas críticas:** `git diff --stat` vazio para `app-routing.module.ts`,
`upload-file-routing.module.ts`, `app.module.ts`, `src/app/guards/`, `src/app/interceptors/`,
`server/`.

**Validação:**
- `npm run build` — falhou inicialmente (2 causas distintas investigadas e corrigidas), **sucesso**
  após as correções.
- `npm test` — falhou inicialmente (3 problemas distintos), **115/115 SUCCESS** após as correções.
- `npm run e2e` — backend iniciado manualmente (lição já registrada nas Etapas 8/9): **5/5 specs,
  8/8 testes** (`baseline-visual.cy.ts` 3/3, `checkout.cy.ts` 1/1, `licenca-carrinho.cy.ts` 1/1,
  `player.cy.ts` 2/2, `upload.cy.ts` 1/1). Backend encerrado ao final.
- `git checkout -- server/data/users.json` — revertido após a execução real do e2e.
- `npm audit` — **20 vulnerabilidades**, inalterado em relação ao D6 (9 moderate / 11 high / 0
  critical). Leitura completa confirmou: nenhuma vulnerabilidade nova; `@hono/node-server` segue
  pendente (fix sugerido cai numa faixa de `@angular/cli` que `21.2.19` ainda não atinge);
  `brace-expansion`/karma, `postcss`, `qs`/`uuid` seguem as mesmas pendências já documentadas nos
  relatórios anteriores, todas mapeadas para fechar em D8 ou posterior.
- **Checklist manual do checkpoint** (`docs/areas/validacao-qa.md`): inspeção visual direta (via
  Read, formato imagem) das 3 capturas de tela do `baseline-visual.cy.ts` — `home.png`,
  `carrinho.png`, `upload-mat-form-field.png` — layout desktop confirmado intacto, idêntico às
  etapas anteriores. Rotas protegidas preservadas (guards intocados, confirmado via diff). Player
  funciona (`player.cy.ts` 2/2). Carrinho funciona (`checkout.cy.ts`, `licenca-carrinho.cy.ts`).
  Upload envia `FormData` esperado (`upload.cy.ts`). Console sem erro crítico novo (nenhuma falha
  não tratada na execução do e2e). **Não executado nesta sessão:** validação manual em viewport
  mobile — a suíte `baseline-visual.cy.ts` só captura desktop (ver §17); nenhuma etapa anterior desta
  migração cobriu mobile automaticamente.

## 13. Decisões técnicas tomadas

### Decisão 1: reverter a migração obrigatória de control-flow syntax (28 templates)

**Descoberta:** a migração "Converts the entire application to block control flow syntax"
(`*ngIf`/`*ngFor`/`*ngSwitch` → `@if`/`@for`/`@switch`) rodou como **obrigatória** no D7 — listada
em "Executing migrations", não em "Optional migrations" —, diferente do D6 (Etapa 9), onde a mesma
migração (`control-flow-migration`) era explicitamente opcional e foi recusada, com a justificativa
registrada de que é "mudança de sintaxe ampla e visível, fora do escopo de preservar comportamento
desta migração de versões". Tocou 28 arquivos, incluindo templates de carrinho, checkout, dashboard,
upload e login.

**Investigação:** confirmado via CHANGELOG oficial do Angular 21 que `ngIf`/`ngFor`/`ngSwitch`
seguem apenas **depreciados**, não removidos — a migração não era necessária para compatibilidade,
só modernização de sintaxe. Lida uma amostra representativa do diff (`cart-modal.component.html`)
confirmando que a transformação era reformatação estrutural completa de indentação, não uma
correção pontual.

**Decisão:** revertidos os 28 arquivos via `git checkout --`, mantendo o restante do degrau.
**Justificativa:** o plano declara explicitamente fora de escopo "adotar... como refatoração" —
embora a frase literal do plano cite apenas standalone/signals/zoneless, o mesmo princípio de
"preservação, não modernização" já havia sido aplicado por mim mesmo, de forma documentada, a esta
exata migração no relatório da Etapa 9. Reverter aqui é apenas **aplicar de forma consistente uma
decisão de escopo já tomada** — não uma nova decisão. Diferente da Decisão 2 (rxjs), não há
ambiguidade técnica real aqui (o app funciona igualmente bem com qualquer uma das duas sintaxes) —
por isso não foi levada ao usuário como pergunta, apenas revertida e documentada (achado 0016).

### Decisão 2: bump do `rxjs` para `~7.8.2` — validado com o usuário antes de aplicar

**Descoberta:** ao contrário do D6 (onde reverter `moduleResolution` para `"node"` resolvia o
problema do `rxjs~7.4.0` sem tocar em dependências), no D7 essa reversão **não é mais viável**:
`@angular/common@21` (e demais pacotes `@angular/*`) abandonaram os campos legados `main`/`types`
no `package.json`, dependendo inteiramente do mapa `exports` — que só `moduleResolution: "bundler"`
compreende. Confirmado isoladamente: com `tsconfig.json` **totalmente revertido** ao estado
pré-D7 (`moduleResolution: "node"` + `lib` explícito restaurado), o build ainda falhava com
`Cannot find module '@angular/common/http'`. Isso reabre o problema de tipos do `rxjs~7.4.0` sob
`bundler` (mesma causa raiz do achado 0015), agora sem alternativa de reversão.

**Por que perguntar ao usuário:** essa correção altera a faixa de versão de uma dependência
(`rxjs`) fora dos 3 pacotes nominalmente autorizados por degrau
(`@angular/core`/`cli`, `@angular/material`, `@ng-bootstrap/ng-bootstrap`), e `PROJECT_RULES.md
§13` lista "dependências novas" entre as decisões que exigem validação humana explícita. Diferente
da Decisão 1 (onde a reversão era zero-risco e já decidida), aqui não havia alternativa de
menor escopo — a única saída seria abandonar o D7 e voltar ao checkpoint D6. Apresentei as duas
opções ao usuário via pergunta direta: (A) bump do `rxjs` para `~7.8.2`, dentro do peer aceito pelo
Angular 21 (`^6.5.3 || ^7.4.0`), baixo risco; ou (B) parar em D6. **O usuário escolheu a opção A.**

**Correção aplicada:** `package.json` `"rxjs": "~7.4.0"` → `"~7.8.2"`, `npm install rxjs@7.8.2`.
Confirmado via `npm view rxjs@7.8.2 exports` que a versão já declara condição `"types"` em cada
subpath do `exports`. Build voltou a passar. Registrado como achado 0019.

### Decisão 3: `provideZoneChangeDetection()` ausente em `src/test.ts` + spec com `@Input()` não definido

**Descoberta 1:** após corrigir o build, `npm test` travava com um `TypeError` em
`wave-surfer-test.component.ts:56` (`this.music.id`, com `music` indefinido) — bug latente no spec
padrão "should create" (`wave-surfer-test.component.spec.ts`), que nunca definia `@Input() music`
antes de `fixture.detectChanges()`, diferente do spec irmão `behavior.spec.ts`, que já fazia isso
corretamente. Esse bug sempre existiu, mas era mascarado por versões anteriores do `TestBed`
reportarem o erro só ao `ErrorHandler` (log) sem falhar o teste. **Corrigido no spec** (definido
`component.music` antes de `detectChanges()`), não no componente — o componente real sempre recebe
`music` via binding do Angular antes de `ngOnInit`, sem risco em produção. Registrado como achado
0018.

**Descoberta 2:** com esse spec corrigido, restaram 2 falhas `NG0100:
ExpressionChangedAfterItHasBeenCheckedError` em bindings `[class.x]` de `CartModalComponent` e
`LoginComponent`. Diagnosticado via CHANGELOG oficial do Angular 21: *"Angular no longer provides a
change detection scheduler for ZoneJS-based change detection by default... This provider addition
will be covered by an automated migration"* — a migração automática aplicou
`provideZoneChangeDetection()` corretamente em `src/main.ts` (bootstrap real), mas **não** em
`src/test.ts` (bootstrap de teste, override customizado de `TestBed.configureTestingModule`) — o
mesmo padrão de lacuna já visto nos achados 0012 e 0014 (migrações automáticas não reconhecem esse
ponto de configuração paralelo). **Corrigido:** adicionado `provideZoneChangeDetection()` ao array
`providers` do override global em `src/test.ts`. Confirmado por execução real: `npm test` voltou a
115/115. Registrado como achado 0017.

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| `rxjs` agora em `~7.8.2` (bump validado, mas ainda fora da matriz de versões explícita do plano) | Baixa | Nenhum funcional observado; mesma major, comportamento reativo básico inalterado | Confirmado via `npm run build`/`test`/`e2e` completos; documentado no achado 0019 |
| Migração de control-flow pode voltar a rodar como obrigatória no D8 | Baixa | Reversão manual repetida, mesmo padrão já estabelecido | Vigiar no D8; achado 0016 documenta o procedimento |
| `provideZoneChangeDetection()` — padrão de "migração cobre `main.ts` mas não `test.ts`" já se repetiu (3ª vez, contando 0012/0014) | Baixa | Pode se repetir em degraus futuros que alterem bootstrap | Revisar `src/test.ts` com atenção extra a cada `ng update @angular/core` |
| Validação manual em viewport mobile não executada nesta sessão | Baixa | Nenhuma etapa anterior desta migração cobriu mobile; risco pré-existente, não introduzido aqui | Considerar adicionar viewport mobile ao `baseline-visual.cy.ts` como melhoria futura, fora do escopo desta migração |
| `npm audit` em 20 (0 critical) — pendências de toolchain seguem abertas | Baixa | Nenhum novo; expectativa de queda no D8 | Acompanhar |

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Não aplicável (migrado para 21.2.19)
- Rotas preservadas: Sim — `git diff` de `app-routing.module.ts` e `upload-file-routing.module.ts`
  vazio
- Guards/autenticação preservados: Sim — `git diff` de `src/app/guards/` e `src/app/interceptors/`
  vazio
- APIs/payloads preservados: Sim — nenhuma mudança de contrato
- Player/WaveSurfer preservado: Sim — `player.cy.ts` (2/2); o bug corrigido em
  `wave-surfer-test.component.spec.ts` era exclusivo do ambiente de teste, sem afetar o componente
  real (achado 0018)
- Upload/FormData preservado: Sim — `upload.cy.ts` confirma nomes de campo idênticos
- Carrinho/licenças/checkout preservados: Sim — `checkout.cy.ts` e `licenca-carrinho.cy.ts` passam;
  `CartModalComponent` funcionalmente intacto (o `NG0100` era de dev-mode/teste, não visível em
  produção com change detection normal)
- Dashboard/produtor preservado: Sim — template revertido para `*ngIf`/`*ngFor` original (Decisão 1)
- Estilos/padrões preservados: Sim — nenhum `.scss` alterado; inspeção visual (home, carrinho,
  upload) confirma layout desktop intacto

## 16. Validações executadas

- [x] `ng update` completo (3 comandos) sob Node 24.18.1, árvore limpa (via stash).
- [x] Grep prévio confirmando ausência de uso das APIs removidas no v21.
- [x] Revisão de **todo** o diff das migrações automáticas, incluindo amostra dos 28 templates de
  control-flow antes de decidir revertê-los.
- [x] `npm run build` — falhou 2 vezes por causas distintas, ambas investigadas até a causa raiz e
  corrigidas; sucesso final.
- [x] `npm test` — falhou 3 vezes por causas distintas, todas investigadas e corrigidas; **115/115
  SUCCESS** final.
- [x] `npm run e2e` — **5/5 specs, 8/8 testes** (backend iniciado manualmente).
- [x] `npm audit` — leitura completa da saída, confirmado sem vulnerabilidades novas; 20
  registradas (inalterado do D6).
- [x] `git checkout -- server/data/users.json` após a execução real do e2e.
- [x] `git diff --stat -- server/ src/app/guards/ src/app/interceptors/ src/app/app-routing.
  module.ts src/app/upload-file/upload-file-routing.module.ts src/app/app.module.ts` vazio.
- [x] **Checklist manual do checkpoint:** inspeção visual das 3 capturas de tela do baseline
  (`home`, `carrinho`, `upload-mat-form-field`) via leitura direta de imagem.
- [x] Decisão de dependência fora do escopo nominal do degrau (`rxjs`) validada explicitamente com
  o usuário antes de aplicar.

## 17. Validações não executadas

- `npm run test:focus` — não retestado nesta etapa (já sabido quebrado desde o D1, achado 0012).
- `npm run lint`/`npm run typecheck` — não existem neste projeto.
- **Validação manual em viewport mobile** — a suíte `baseline-visual.cy.ts` só captura desktop
  (viewport padrão do Cypress); nenhuma etapa anterior desta migração cobriu mobile
  automaticamente, e não há ferramenta de navegador disponível nesta sessão para inspeção manual
  interativa. Gap pré-existente, não introduzido por este degrau.
- Inspeção de console do navegador em tempo real (fora do que o Cypress reporta como falha) — não
  executada; nenhuma falha de console foi reportada pelos specs e2e.

## 18. Validações recomendadas

- [ ] Antes da Etapa 11 (D8): `git tag -l 'mig/*'` e `git log --oneline` para confirmar `mig/d7`.
- [ ] Continuar subindo o backend manualmente antes de `npm run e2e`.
- [ ] No D8, verificar se a migração de control-flow syntax volta a rodar como obrigatória —
  reverter novamente se necessário, seguindo o achado 0016.
- [ ] No D8, revisar `src/test.ts` com atenção redobrada a cada migração que toque `src/main.ts` —
  padrão já repetido 3 vezes (achados 0012, 0014, 0017).
- [ ] D8 é o degrau de maior risco declarado pelo plano (TypeScript 6.0) — com **timebox**: se não
  fechar em uma sessão, parar em D7 (este checkpoint) é resultado aceito, não falha.
- [ ] Considerar, como tarefa própria fora desta migração, adicionar cobertura de viewport mobile ao
  `baseline-visual.cy.ts`.

## 19. Pendências

- Achado 0012 (`test:focus` quebrado) — aberto, sem mudança nesta etapa.
- Achado 0015 (`moduleResolution` D6) — superado pelo achado 0019 (D7 tornou `bundler` obrigatório).
- `npm audit` em 20 (0 critical) — expectativa de queda adicional no D8.
- Validação manual em viewport mobile — gap pré-existente, não coberto por nenhuma etapa desta
  migração até agora.

## 20. Próximo passo recomendado

Aguardar confirmação explícita do usuário antes de iniciar a Etapa 11 (D8 — Angular 22, o degrau de
maior risco declarado pelo plano por forçar TypeScript 6.0), conforme instrução da sessão. **D7
(este checkpoint) já é, por si só, um resultado aceito e entregável** caso o usuário prefira não
prosseguir ao D8.

## 21. Instruções para o próximo agente

1. Leia este relatório e os das Etapas 0-9.
2. Confirme `git log --oneline` e `git tag -l 'mig/*'` — deve haver `mig/e0`-`mig/e3` e
   `mig/d1`-`mig/d7`.
3. Leia `docs/migracao-angular-achados/README.md` — 19 achados catalogados.
4. Confirme `node -v` = `24.18.1` **explicitamente após `nvm use`**; árvore 100% limpa antes de
   `ng update` (stash dos arquivos alheios).
5. Antes de rodar `npm run e2e`, suba o backend manualmente: `cd server && node src/index.js` (sob
   Node 24.18.1) em background, confirme pelo log ("Servidor Iniciado!"), encerre ao final. Reverta
   `server/data/users.json` se o e2e real for executado antes de commitar.
6. **D8 é o degrau de maior risco do plano** (TypeScript 6.0, `@ng-bootstrap` 21.0.0 recente e pouco
   exercitado). Ler o CHANGELOG oficial do Angular 22 com atenção redobrada antes de agir.
7. Se a migração de control-flow syntax voltar a rodar (obrigatória ou opcional), revertê-la
   novamente, seguindo o precedente do achado 0016 — a menos que o usuário explicitamente decida
   adotar a nova sintaxe como tarefa separada.
8. Após qualquer `ng update @angular/core`, verificar se `src/main.ts` recebeu alguma migração de
   bootstrap/providers que **não** tenha equivalente em `src/test.ts` — padrão repetido 3 vezes
   (achados 0012, 0014, 0017).
9. Se o build falhar por resolução de módulo/tipos após o `ng update`, **não assumir que reverter
   `moduleResolution` resolve** — confirme primeiro se os próprios pacotes `@angular/*` ainda
   suportam `"node"` resolution neste degrau (o achado 0019 documenta que isso deixou de ser
   verdade a partir do D7).
10. **Timebox do D8:** se não fechar em uma sessão, parar em D7 (`mig/d7`, já tageado e validado
    como checkpoint) é resultado aceito conforme o próprio plano — não é necessário forçar.

## 22. Observações finais

O checkpoint do plano se confirmou como o degrau tecnicamente mais denso da escada até agora — não
pelo volume de código tocado (o diff final ficou pequeno: 7 arquivos), mas pela quantidade de
decisões técnicas genuínas exigidas: uma migração automática que ultrapassou o escopo já decidido
(control-flow syntax, revertida por consistência com a Etapa 9), uma mudança estrutural real no
comportamento do TypeScript module resolution dos pacotes `@angular/*` (que tornou obrigatório o
que antes era reversível), e uma cadeia de 3 falhas de teste distintas — cada uma com causa raiz
diferente, todas remontadas ao mesmo fenômeno documentado no CHANGELOG oficial: o `TestBed` do
Angular 21 ficou mais rigoroso ao relançar erros que antes eram só logados. A decisão de bump do
`rxjs`, por alterar uma dependência fora do escopo nominal dos 3 pacotes autorizados por degrau, foi
levada ao usuário antes de aplicar — mantendo o princípio de não expandir escopo silenciosamente
mesmo quando a correção técnica é de baixo risco. Build, 115 testes Karma e 8 testes Cypress
verdes, `npm audit` estável em 20 (0 críticas), e inspeção visual confirmando o layout desktop
intacto nas 3 telas de baseline. D7 é um estado entregável e mergeável em `dev`, exatamente como o
plano previu.
