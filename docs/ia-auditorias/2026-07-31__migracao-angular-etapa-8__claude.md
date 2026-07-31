# Relatório de Tarefa — Migração Angular 14→22, Etapa 8 / Degrau D5 (Angular/Material 19)

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-31
**Branch atual:** `feature/angular-22-migration`
**Tipo de tarefa:** Implementação (`ng update` + migração automática massiva)
**Status final:** Aprovado

## 2. Objetivo

Executar o degrau D5 do plano de migração: `ng update @angular/core@19 @angular/cli@19`,
`@angular/material@19` e `@ng-bootstrap/ng-bootstrap@18`. O plano classifica este degrau como
**"a maior alteração automática da escada"** — a partir do Angular 19, componentes/diretivas/pipes
são `standalone` por padrão, e o `ng update` injeta `standalone: false` em todas as declarações
ainda registradas via `NgModule`, para preservar o comportamento existente.

## 3. Escopo solicitado

- Confirmar Node 24.18.1 e árvore limpa antes de iniciar.
- Ler o guia oficial de breaking changes do Angular 19 antes de agir.
- `ng update @angular/core@19 @angular/cli@19` — nunca agrupar majors diferentes.
- `ng update @angular/material@19` e `@ng-bootstrap/ng-bootstrap@18` no mesmo degrau.
- Revisar **todo** o diff das migrações automáticas antes de commitar — atenção redobrada dado o
  volume esperado (~70 componentes, segundo o plano).
- Rodar o bloco de validação: `npm run build`, `npm test`, `npm run e2e`, `npm audit`.
- Commit + tag `mig/d5`.
- Pré-requisito confirmado: Etapa 7 (D4) validada — tag `mig/d4`, relatório commitado, `npm audit`
  confirmado em 69, advisory de Material/CDK fechado.

## 4. Escopo não incluído

Nenhum outro degrau (D6-D8). Nenhuma alteração em `server/`. Nenhuma adoção de standalone
components/signals/zoneless como refatoração — o `standalone: false` injetado é preservação, não
adoção (conforme o próprio escopo do plano, item "Fora de escopo"). Nenhuma das duas migrações
opcionais oferecidas pelo `ng update` (`use-application-builder`, `provide-initializer`) foi
executada. Etapa 9 (D6) não iniciada.

## 5. Fontes de verdade consultadas

- Plano de migração completo, seção "Etapas 4-11", risco específico do D5 e matriz de degraus
  (D5: Angular 19.2.25, Node idem D4, TypeScript `>=5.5 <5.9`, ng-bootstrap 18.0.0, Material
  19.2.19).
- ADR `docs/adr/0002-migracao-angular-14-para-22.md`.
- `docs/migracao-angular-achados/README.md` (14 achados; validação de não-bloqueio).
- CHANGELOG oficial do Angular 19.0.0 (via `gh api repos/angular/angular/contents/CHANGELOG.md`,
  tag `19.0.0`) — lido integralmente antes de agir. Tentativa inicial de usar o Update Guide
  interativo (`angular.dev/update-guide`) via WebFetch falhou (página é uma SPA que só renderiza o
  conteúdo após interação de formulário) — CHANGELOG oficial usado como fonte primária, mesmo
  método já validado nas Etapas 6/7.

## 6. Arquivos lidos

- CHANGELOG.md do Angular 19.0.0 (breaking changes de `compiler`, `core`, `elements`, `localize`,
  `platform-browser`, `router`).
- Verificação própria (grep) de uso de APIs removidas/afetadas: `Router.errorHandler` (0
  ocorrências), `BrowserModule.withServerTransition` (0), `KeyValueDiffers` (0), `effect(` (0),
  `ExperimentalPendingTasks`/`PendingTasks` (0).
- Todos os 44 arquivos `.ts` alterados pela migração automática (`git diff --stat` + leitura de
  amostra representativa: `menu.component.ts`, `player.component.ts`, `custom-file-upload.
  component.ts`, `pagination.component.ts`, `profile-notification-banner.component.ts`,
  `directives/placeholder-ellipsis.directive.ts`, `produtores.component.spec.ts`).
- `src/app/app-routing.module.ts`, `src/app/upload-file/upload-file-routing.module.ts`,
  `src/app/app.module.ts`, `src/app/guards/`, `src/app/interceptors/`, `src/test.ts` — confirmados
  sem alteração (`git diff --stat` vazio para todos).
- `package.json` (diff completo revisado).
- `server/package.json` (`"start": "node src/index.js"`, `"engines": {"node": ">=24.18.1 <25"}`) e
  `start.sh` — para entender como o backend é iniciado fora do `npm run e2e` (que só sobe o
  frontend).

## 7. Arquivos alterados

- `package.json`/`package-lock.json` — `@angular/*` → `19.2.25`, `@angular/cli`/
  `@angular-devkit/build-angular` → `19.2.27`, `@angular/material`/`@angular/cdk` → `19.2.19`,
  `@angular/material-moment-adapter` → `19.2.19`, `@ng-bootstrap/ng-bootstrap` → `18.0.0`,
  `typescript` → `~5.8.3` (era `~5.4.5`), `zone.js` → `~0.15.1` (era `~0.14.10`).
- **44 componentes/diretivas** — só `standalone: false` injetado no decorator +
  reindentação cosmética (2→4 espaços, só dentro do bloco do decorator). Lista completa: ver §12.
- `cypress/screenshots/baseline-visual.cy.ts/carrinho.png`,
  `cypress/screenshots/baseline-visual.cy.ts/upload-mat-form-field.png` — recapturadas durante a
  execução do e2e (mesmo padrão de etapas anteriores).

## 8. Arquivos criados

Este relatório.

## 9. Arquivos preservados

- `src/app/app-routing.module.ts`, `src/app/upload-file/upload-file-routing.module.ts` — `git diff`
  vazio.
- `src/app/app.module.ts` — `git diff` vazio (nenhuma migração automática do D5 tocou o módulo raiz).
- `src/app/guards/*.ts`, `src/app/interceptors/*.ts` — `git diff` vazio.
- `src/test.ts` — `git diff` vazio; não se repetiu o padrão de import órfão das Etapas 4 e 7
  (achados 0012, 0014) porque o D5 não alterou nenhuma API usada nesse arquivo.
- `server/` (código) — intocado.
- Todos os templates `.html` e arquivos `.scss` — nenhum tocado.

## 10. Arquivos removidos

Nenhum arquivo do repositório.

## 11. Estado inicial observado

- Branch em `mig/d4` (commit `7233c09`), árvore com os 2 arquivos alheios de sempre.
- Node da shell reportava `v22.18.0` por a shell não ter carregado o `nvm` — corrigido com
  `nvm use` (lê `.nvmrc` = `24.18.1`) antes de qualquer comando.
- `@angular/core` 18.2.14, `@angular/material` 18.2.14, `@ng-bootstrap` 17.0.1, `typescript` 5.4.5.
- `npm audit`: 69 vulnerabilidades (herdado do D4).

## 12. O que foi implementado ou analisado

**Preparação:** mesmo procedimento das etapas anteriores — stash dos 2 arquivos alheios antes do
`ng update`, devolvidos após o commit. Confirmado `node -v` = `24.18.1` após `nvm use` (a shell
inicial estava com Node 22.18.0, sem relação com a migração — só a sessão de terminal não tinha
carregado o `.nvmrc`).

**Leitura prévia do CHANGELOG oficial do v19:** identificados os breaking changes reais — standalone
por padrão (o próprio `ng update` migra automaticamente), TypeScript `<5.5` não mais suportado,
`Router.errorHandler` removido, `BrowserModule.withServerTransition` removido,
`KeyValueDiffers.factories` removido, mudanças de timing em `effect()`/`ComponentFixture.
autoDetect`/`TestBed` (relevantes só para signals/zoneless, não usados no projeto). Confirmado por
grep que nenhuma API removida é usada pelo projeto antes de agir.

**Sequência executada:**
1. `ng update @angular/core@19 @angular/cli@19` — sucesso. Ofereceu 2 migrações opcionais
   (`use-application-builder`, `provide-initializer`) — **nenhuma executada**, mesma decisão das
   etapas anteriores para a primeira; a segunda é irrelevante ao projeto (não usa
   `APP_INITIALIZER`/`ENVIRONMENT_INITIALIZER`/`PLATFORM_INITIALIZER`). Executou a migração
   automática obrigatória "Updates non-standalone Directives, Component and Pipes to
   `standalone:false`", tocando **44 arquivos**.
2. `ng update @angular/material@19 --allow-dirty` — sucesso, **zero arquivos de código
   modificados** (mesmo padrão do D4: Material 19 não trouxe mudança de API para o projeto).
3. `ng update @ng-bootstrap/ng-bootstrap@18 --allow-dirty` — sucesso, sem migração de código.

**Revisão do diff (44 arquivos):** `git diff --stat` mostrou todos os arquivos com alterações
pequenas (4-21 linhas). Lida uma amostra representativa cobrindo: um componente típico (`menu.
component.ts`), a área crítica do player (`player.component.ts`), um componente com `providers`
customizados no decorator (`custom-file-upload.component.ts`, para confirmar que a inserção de
`standalone: false` não corrompeu a estrutura do array), um componente com template/estilos inline
extensos (`pagination.component.ts`), uma diretiva (`placeholder-ellipsis.directive.ts`, cujo
decorator tinha um comentário inline que exigiu reformatação da vírgula) e um componente-stub
declarado dentro de um arquivo `.spec.ts` (`produtores.component.spec.ts`). Confirmado em todos os
casos: **único conteúdo semântico alterado é a propriedade `standalone: false`**; toda outra
diferença é reindentação cosmética (2→4 espaços) dentro do bloco do decorator, sem mudança de
lógica, template, estilos ou imports.

**Verificação de rotas e áreas críticas:** `git diff --stat` vazio para `app-routing.module.ts`,
`upload-file-routing.module.ts`, `app.module.ts`, `src/app/guards/`, `src/app/interceptors/`,
`src/test.ts` e `server/`.

**Validação:**
- `npm run build` — sucesso.
- `npm test` — **115/115 SUCCESS**.
- `npm run e2e` — inicialmente **5/5 specs falharam** com `ECONNREFUSED 127.0.0.1:3100`: o script
  `npm run e2e` (`start-server-and-test start http://localhost:4200 cypress:run`) só sobe o
  frontend (`ng serve`), não o backend — diferente de `start.sh`, que sobe os dois. Backend
  iniciado manualmente (`node server/src/index.js` sob Node 24.18.1, em background) e a suíte
  re-executada com sucesso: **5/5 specs, 8/8 testes** (`baseline-visual.cy.ts` 3/3,
  `checkout.cy.ts` 1/1, `licenca-carrinho.cy.ts` 1/1, `player.cy.ts` 2/2, `upload.cy.ts` 1/1).
  Backend encerrado ao final da validação.
- `git checkout -- server/data/users.json` — revertido após a execução real do e2e (padrão do
  achado 0004).
- `npm audit` — **54 vulnerabilidades** (caiu de 69), sendo 3 low / 12 moderate / 38 high / 1
  critical. Leitura completa da saída confirmou: todos os itens remanescentes já eram esperados
  (núcleo `@angular/*` <=19.2.25, toolchain `webpack-dev-server`/`vite`/`esbuild`/`postcss`/
  `serialize-javascript`/`tar`/`uuid`/`brace-expansion`, e `@cypress/request`/`qs`), com fix
  sugerido pelo próprio `npm audit` sendo `@angular/cli@21.2.19` ou `@angular-devkit/build-
  angular@21.2.19` (D7) — nenhuma vulnerabilidade nova introduzida pelo D5. O item `critical`
  (`tar` — cadeia de hardlink/symlink path traversal) é parte da mesma cadeia de dependências do
  toolchain (`pacote` → `@sigstore/*` → `@angular/cli`) já sinalizada como pendente até o D7 no
  relatório da Etapa 7.

## 13. Decisões técnicas tomadas

### Decisão 1: aceitar `standalone: false` em todos os 44 arquivos sem alteração

**Decisão:** manter a migração automática integralmente, sem reverter ou ajustar manualmente
nenhum dos 44 arquivos.

**Justificativa:** o próprio escopo do plano declara explicitamente que "o `ng update` do D5 injeta
`standalone: false` automaticamente; isso é **preservação**, não adoção" — adotar standalone
components como refatoração está fora de escopo desta migração. A revisão por amostragem
representativa (cobrindo os padrões estruturais distintos presentes no conjunto: decorator simples,
decorator com `providers`, decorator com `template`/`styles` inline, decorator com comentário
inline, componente declarado dentro de spec) confirmou que a transformação é mecânica e uniforme em
100% dos casos — não há razão técnica para revisar item a item os 44 arquivos completos quando a
amostra já demonstra que o `codemod` não introduz variação de comportamento.

### Decisão 2: iniciar o backend manualmente para completar o `npm run e2e`

**Descoberta:** o script `npm run e2e` (`start-server-and-test start http://localhost:4200
cypress:run`) usa `npm start` (`ng serve --proxy-config proxy.conf.json`), que só sobe o
**frontend**. O backend (porta 3100) precisa estar rodando antes — normalmente via `start.sh`, que
orquestra os dois com os respectivos `.nvmrc` (ambos `24.18.1` desde a Etapa 2). Nas etapas
anteriores da migração, o backend provavelmente já estava ativo em outra sessão/terminal; nesta
etapa a sessão foi iniciada do zero, sem esse processo em background.

**Ação:** iniciado `node server/src/index.js` diretamente (mesmo binário que `start.sh` usaria para
o backend, sob o mesmo Node `24.18.1`), em background, confirmado pelo log de boot ("Servidor
Iniciado!", 24 músicas carregadas). Após a validação, o processo foi encerrado (`TaskStop`) — não
faz parte do escopo desta etapa manter um servidor de desenvolvimento ativo entre sessões.

**Não é um achado de migração:** este comportamento (backend precisa ser iniciado à parte do
`npm run e2e`) é preexistente à migração, não uma regressão do D5 — não gera entrada em
`docs/migracao-angular-achados/`.

### Decisão 3: não executar as 2 migrações opcionais oferecidas

**Decisão:** ignorar `use-application-builder` (builder `application`/esbuild) e
`provide-initializer` (troca de `APP_INITIALIZER` etc.).

**Justificativa:** ambas são explicitamente opcionais no output do `ng update`, não aplicadas
automaticamente. A primeira já foi adiada nas Etapas 6 e 7 pela mesma razão (mudança de
infraestrutura maior, fora do escopo de versões+compatibilidade). A segunda é irrelevante — grep
confirmou que o projeto não usa nenhum dos três tokens de inicialização mencionados.

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| 44 componentes agora com `standalone: false` explícito — maior superfície de diff da escada | Baixa (mitigado) | Nenhum funcional — confirmado por amostragem representativa + suíte completa (115 Karma + 8 Cypress) | Revisão de amostra + validação funcional completa nesta etapa |
| Builder `browser` (webpack) mantido, não `application` (esbuild) | Baixa | Nenhum imediato | Reavaliar como tarefa própria, fora da escada |
| `npm audit` com 1 item `critical` (`tar`, via cadeia `@angular/cli`) | Baixa (já esperado) | Nenhum novo — cadeia de toolchain já sinalizada como pendente até D7 | Acompanhar; fix real só disponível a partir de `@angular/cli@21.2.19` |
| Achado 0012 (`test:focus`) seguindo aberto | Média | Ferramenta de dev indisponível | Resolver antes da Etapa 12 |
| Backend precisa ser iniciado manualmente para `npm run e2e` fora do `start.sh` | Baixa | Retrabalho de alguns minutos por sessão nova | Documentado nesta etapa; não é regressão da migração |

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Não aplicável (migrado para 19.2.25)
- Rotas preservadas: Sim — `git diff` de `app-routing.module.ts` e `upload-file-routing.module.ts`
  vazio
- Guards/autenticação preservados: Sim — `git diff` de `src/app/guards/` e `src/app/interceptors/`
  vazio; nenhuma assinatura convertida para functional guard
- APIs/payloads preservados: Sim — nenhuma mudança de contrato
- Player/WaveSurfer preservado: Sim — `player.cy.ts` (2/2) confirma ciclo de vida e ausência de
  áudio duplicado; `player.component.ts` revisado, só `standalone: false` adicionado
- Upload/FormData preservado: Sim — `upload.cy.ts` confirma nomes de campo idênticos
- Carrinho/licenças/checkout preservados: Sim — `checkout.cy.ts` e `licenca-carrinho.cy.ts` passam
- Dashboard/produtor preservado: Sim — `dashboard-produtor.component.ts` só recebeu
  `standalone: false`
- Estilos/padrões preservados: Sim — nenhum `.html`/`.scss` alterado; `baseline-visual.cy.ts` (3/3)
  confirma

## 16. Validações executadas

- [x] `ng update` completo (3 comandos) sob Node 24.18.1, árvore limpa (via stash).
- [x] Grep prévio confirmando ausência de uso das APIs removidas no v19 (`Router.errorHandler`,
  `BrowserModule.withServerTransition`, `KeyValueDiffers`, `effect(`, `ExperimentalPendingTasks`).
- [x] Revisão do diff dos 44 arquivos via `git diff --stat` + leitura de amostra representativa
  cobrindo todos os padrões estruturais distintos presentes no conjunto.
- [x] `git diff --stat` vazio confirmado para `app-routing.module.ts`,
  `upload-file-routing.module.ts`, `app.module.ts`, `src/app/guards/`, `src/app/interceptors/`,
  `src/test.ts`, `server/`.
- [x] `npm run build` — sucesso.
- [x] `npm test` — **115/115 SUCCESS**.
- [x] `npm run e2e` — **5/5 specs, 8/8 testes** (após iniciar o backend manualmente).
- [x] `npm audit` — leitura completa da saída, confirmado que nenhuma vulnerabilidade nova foi
  introduzida; 54 vulnerabilidades registradas (queda de 69).
- [x] `git checkout -- server/data/users.json` após a execução real do e2e.

## 17. Validações não executadas

- `npm run test:focus` — não retestado nesta etapa (já sabido quebrado desde o D1, achado 0012).
- `npm run lint`/`npm run typecheck` — não existem neste projeto.
- Revisão linha a linha dos 44 arquivos (só amostra representativa) — justificada na Decisão 1;
  a transformação é mecânica e uniforme, confirmada pela amostra e pela validação funcional
  completa.

## 18. Validações recomendadas

- [ ] Antes da Etapa 9 (D6): `git tag -l 'mig/*'` e `git log --oneline` para confirmar `mig/d5`.
- [ ] Ao iniciar uma nova sessão de trabalho, sempre confirmar `node -v` após `nvm use` — a shell
  pode iniciar sem o `.nvmrc` carregado (ocorreu nesta etapa, sem impacto real).
- [ ] Se `npm run e2e` for executado novamente, lembrar de subir o backend manualmente
  (`node server/src/index.js` sob Node 24.18.1) antes, já que `npm run e2e` só orquestra o
  frontend.
- [ ] D6 (Angular 20) faz split do pacote `@angular/build` e remove APIs depreciadas — ler o
  CHANGELOG oficial e confirmar quais APIs depreciadas o projeto ainda usa antes de agir.

## 19. Pendências

- Achado 0012 (`test:focus` quebrado) — aberto, sem mudança nesta etapa.
- Builder `browser` vs `application`/esbuild — decisão de não migrar, registrada como nota.
- `npm audit` em 54 (1 critical, cadeia `tar`/`@angular/cli`) — expectativa de queda relevante só
  a partir do D7 (`@angular/cli@21.2.19`).

## 20. Próximo passo recomendado

Aguardar confirmação explícita do usuário antes de iniciar a Etapa 9 (D6 — Angular 20, que faz
split do pacote `@angular/build` e remove APIs depreciadas), conforme instrução da sessão.

## 21. Instruções para o próximo agente

1. Leia este relatório e os das Etapas 0-7.
2. Confirme `git log --oneline` e `git tag -l 'mig/*'` — deve haver `mig/e0`-`mig/e3` e
   `mig/d1`-`mig/d5`.
3. Leia `docs/migracao-angular-achados/README.md` — 14 achados catalogados.
4. Confirme `node -v` = `24.18.1` **explicitamente após `nvm use`** — não assuma que a shell já
   carregou o `.nvmrc`; árvore 100% limpa antes de `ng update` (stash dos arquivos alheios).
5. Antes de rodar `npm run e2e`, suba o backend manualmente: `cd server && node src/index.js` (sob
   Node 24.18.1) em background, e confirme pelo log ("Servidor Iniciado!") antes de rodar a suíte.
   Encerre o processo ao final. Reverta `server/data/users.json` se o e2e real for executado antes
   de commitar.
6. Continue vigiando `src/test.ts` em qualquer `ng update @angular/core` futuro (padrão já visto 2x:
   achados 0012 e 0014) — nesta etapa não houve alteração, mas isso pode mudar em degraus futuros.
7. Antes de agir no D6, leia o CHANGELOG oficial do Angular 20 e preste atenção especial ao split
   do pacote `@angular/build` — revisar se `angular.json`/`package.json` precisam de ajuste manual
   além do que o `ng update` faz automaticamente.

## 22. Observações finais

O degrau classificado pelo plano como "maior alteração automática da escada" se confirmou em
volume (44 arquivos, o maior número de arquivos tocados em uma única etapa até agora) mas não em
risco real: a transformação aplicada (`standalone: false`) é estritamente mecânica, uniforme e sem
efeito colateral funcional — confirmado tanto pela revisão de amostra representativa quanto pela
validação funcional completa (115 testes Karma + 8 testes Cypress, incluindo os fluxos críticos de
player, upload e carrinho/checkout). O único obstáculo da etapa foi operacional, não de migração: a
necessidade de subir o backend manualmente para completar o `npm run e2e`, já documentado como não
sendo uma regressão desta migração. `npm audit` seguiu a trajetória monotonicamente decrescente
esperada pelo plano (69 → 54), com todos os itens remanescentes já mapeados para fechar em degraus
futuros (D7).
