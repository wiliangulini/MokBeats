# Relatório de Tarefa — Migração Angular 14→22, Etapa 7 / Degrau D4 (Angular/Material 18)

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-30
**Branch atual:** `feature/angular-22-migration`
**Tipo de tarefa:** Implementação (`ng update` + correção de migração automática)
**Status final:** Aprovado

## 2. Objetivo

Executar o degrau D4 do plano de migração: `ng update @angular/core@18 @angular/cli@18`,
`@angular/material@18` e `@ng-bootstrap/ng-bootstrap@17` — o degrau que, segundo o achado A11 do
plano ("Material 18+ já fecha [o advisory de Material/CDK]"), deveria reduzir o `npm audit` de
forma perceptível.

## 3. Escopo solicitado

- Confirmar Node 24.18.1 e árvore limpa antes de iniciar.
- `ng update @angular/core@18 @angular/cli@18` — nunca agrupar majors diferentes.
- `ng update @angular/material@18` e `@ng-bootstrap/ng-bootstrap@17` no mesmo degrau.
- Revisar todo o diff das migrações automáticas antes de commitar.
- Rodar o bloco de validação: `npm run build`, `npm test`, `npm run e2e`, `npm audit`.
- Commit + tag `mig/d4`.
- Pré-requisito confirmado: Etapa 6 (D3) validada, nenhum achado bloqueia este degrau.

## 4. Escopo não incluído

Nenhum outro degrau (D5-D8). Nenhuma alteração em `server/`. Nenhuma migração para o builder
`application`/esbuild (oferecida como migração opcional pelo `ng update`, não aplicada — mesma
decisão da Etapa 6). Nenhuma correção do achado 0012 (`test:focus`). Etapa 8 (D5) não iniciada.

## 5. Fontes de verdade consultadas

- Plano de migração completo, seção "Etapas 4-11" e achado A11.
- ADR `docs/adr/0002-migracao-angular-14-para-22.md`.
- `docs/migracao-angular-achados/README.md` (13 achados; validação de não-bloqueio).
- CHANGELOG oficial do Angular 18.0.0 (via `gh api repos/angular/angular/contents/CHANGELOG.md`,
  tag `18.2.14`) — lido integralmente antes de agir.
- Definições de tipo do pacote instalado (`node_modules/@angular/common/http/testing/index.d.ts`,
  `fesm2022/http/testing.mjs`) — para entender a implementação real de `provideHttpClientTesting()`
  antes de aplicar a correção.

## 6. Arquivos lidos

- CHANGELOG.md do Angular 18.0.0 (breaking changes de `core`, `http`, `router`, `platform-*`).
- Verificação própria (grep) de uso de APIs afetadas: `async` de testing (0 ocorrências),
  `whenStable`/`autoDetect` em specs (0 ocorrências), providers customizados em `RouterOutlet`
  (só uso de diretiva, sem providers customizados).
- `src/app/app.module.ts`, `src/app/interceptors/auth.interceptor.ts` (antes/depois).
- `src/test.ts` (antes/depois; investigação da causa do bug).
- `node_modules/@angular/common/http/testing/index.d.ts` — confirmação de que
  `HttpClientTestingModule` ainda existe (deprecated) e `provideHttpClientTesting()` está
  disponível.
- `node_modules/@angular/common/fesm2022/http/testing.mjs` — implementação real de
  `provideHttpClientTesting()` (só substitui `HttpBackend`/`HttpTestingController`, não fornece
  `HttpClient`).

## 7. Arquivos alterados

- `package.json`/`package-lock.json` — `@angular/*` → `18.2.14`, `@angular/cli`/
  `@angular-devkit/build-angular` → `18.2.21`, `@angular/material`/`@angular/cdk` → `18.2.14`,
  `@ng-bootstrap/ng-bootstrap` → `17.0.1`. `typescript` inalterado (`5.4.5`, já dentro da faixa).
- `src/app/app.module.ts` — migração automática: `HttpClientModule` removido dos `imports`;
  `provideHttpClient(withInterceptorsFromDi())` adicionado aos `providers`. Reformatação de
  indentação do decorator (sem mudança de conteúdo).
- `src/app/interceptors/auth.interceptor.ts` — só reformatação de import (5 linhas → 1 linha).
- `src/app/{artist,carrinho}/*.component.ts`, `src/app/create-playlist-modal/playlist.service.ts`,
  `src/app/favoritos/favoritos.service.ts`, `src/app/service/crud-service.ts` — só reformatação de
  import de `HttpClient` (espaçamento).
- `src/test.ts` — **corrigido manualmente**: import órfão de `HttpClientTestingModule` (migração
  automática incompleta) substituído por `provideHttpClient()` + `provideHttpClientTesting()` nos
  providers (ver Decisão 2).
- `cypress/screenshots/baseline-visual.cy.ts/upload-mat-form-field.png` — re-capturada (idêntica).

## 8. Arquivos criados

Este relatório.

## 9. Arquivos preservados

- `server/` (código) — intocado.
- Todos os templates `.html` e arquivos `.scss` — nenhum tocado nesta etapa.
- Builder principal (`@angular-devkit/build-angular:browser`) — migração para `application`
  oferecida como opcional pelo `ng update`, não aplicada (mesma decisão da Etapa 6).
- Provider de `AuthInterceptor` via `HTTP_INTERCEPTORS` — preservado exatamente, só a forma de
  bootstrapar o `HttpClient` em si mudou (de `NgModule` import para provider function).

## 10. Arquivos removidos

Nenhum arquivo do repositório.

## 11. Estado inicial observado

- Branch em `mig/d3` (commit `201e1fd`), árvore com os 2 arquivos alheios de sempre.
- `@angular/core` 17.3.12, `@angular/material` 17.3.10, `@ng-bootstrap` 16.0.0, `typescript` 5.4.5.
- `npm audit`: 71 vulnerabilidades (herdado do D3).

## 12. O que foi implementado ou analisado

**Preparação:** mesmo procedimento das etapas anteriores — stash dos 2 arquivos alheios antes do
`ng update`, devolvidos após o commit.

**Leitura prévia do CHANGELOG oficial do v18:** identificados os breaking changes reais (TypeScript
<5.4 não suportado — já atendido; `async` removido de testing utils; mudanças de timing em
`ComponentFixture.whenStable`/`autoDetect`; providers do `RouterOutlet` não herdados por rotas;
cache HTTP com header de Authorization prevenido por padrão — irrelevante, projeto não usa SSR).
Confirmado por grep que nenhuma API removida é usada pelo projeto antes de agir.

**Sequência executada:**
1. `ng update @angular/core@18 @angular/cli@18` — sucesso. Ofereceu a migração opcional para o
   builder `application` (`ng update @angular/cli --name use-application-builder`) — **não
   executada**, mesma decisão da Etapa 6. Executou a migração automática de `HttpClientModule` →
   `provideHttpClient`, tocando 8 arquivos.
2. `ng update @angular/material@18 --allow-dirty` — sucesso, **zero arquivos de código
   modificados** (Material 18 não trouxe mudança de API para o projeto, já nos componentes MDC
   desde o D3).
3. `ng update @ng-bootstrap/ng-bootstrap@17 --allow-dirty` — sucesso, sem migração de código.

**Revisão do diff:** 10 arquivos de código alterados. `auth.interceptor.ts` e `app.module.ts`
revisados com atenção redobrada por serem área crítica (autenticação). Confirmado que o provider
`{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }` foi preservado
integralmente — a nova API `provideHttpClient(withInterceptorsFromDi())` é a forma de
compatibilidade oficial e recomendada para projetos com interceptors baseados em classe.

**Bug encontrado e corrigido** (`src/test.ts`, ver Decisão 2).

**Validação:**
- `npm run build` — sucesso.
- `npm test` — **115/115 SUCCESS** (após a correção).
- `npm run e2e` — **5/5 specs, 8/8 testes** (confirma que o `AuthInterceptor` continua funcionando
  com a nova API — os specs de login/upload dependem de chamadas HTTP autenticadas).
- `npm audit` — **69 vulnerabilidades** (caiu de 71). Confirmado, por leitura completa da saída,
  que nenhuma entrada menciona `@angular/material` ou `@angular/cdk` — o advisory de Material/CDK
  fechou de fato (achado A11 confirmado). Os 69 remanescentes são do núcleo do Angular (ranges
  como `<=19.2.25`, que só fecham a partir do D6/Angular 20) e do toolchain (webpack, tar, rollup,
  cypress/request — fecham perto do fim da escada, conforme o próprio `npm audit` sugere
  `@angular/cli@22.1.2` como fix).
- Comparação visual: screenshot da tela de upload idêntica (nenhum HTML/CSS tocado nesta etapa).

## 13. Decisões técnicas tomadas

### Decisão 1: aceitar `provideHttpClient(withInterceptorsFromDi())` sem alteração

**Decisão:** manter a migração automática de `HttpClientModule` para
`provideHttpClient(withInterceptorsFromDi())`.

**Justificativa:** `withInterceptorsFromDi()` é exatamente a opção de compatibilidade que instrui o
novo `provideHttpClient()` a continuar honrando interceptors registrados via o token
`HTTP_INTERCEPTORS` (estilo de classe, como `AuthInterceptor`) — sem essa opção, interceptors desse
estilo parariam de ser aplicados. O provider do `AuthInterceptor` em si não foi tocado. Confirmado
funcionalmente pelos 8 testes e2e (login/upload dependem de requisições autenticadas passando pelo
interceptor).

### Decisão 2: corrigir `src/test.ts` — `HttpClientTestingModule` órfão

**Descoberta:** a migração automática removeu `HttpClientTestingModule` do import de
`src/test.ts` (deixando `import {} from '@angular/common/http/testing';`), mas não atualizou o uso
dentro do array `moduleDef.imports` do override customizado de `TestBed.configureTestingModule` —
mesmo padrão de bug da Etapa 4 (D1, `require.context` órfão): a análise estática da migração não
reconhece esse padrão não-convencional (módulos injetados programaticamente em todos os testes via
monkey-patch do `TestBed`).

**Investigação antes de corrigir:** confirmei em `node_modules/@angular/common/http/testing/
index.d.ts` que `HttpClientTestingModule` ainda existe (só `@deprecated`, não removido) e que
`provideHttpClientTesting()` está disponível. Verifiquei a implementação real
(`fesm2022/http/testing.mjs`) e confirmei que `provideHttpClientTesting()` **sozinho não é
suficiente** — ele só substitui `HttpBackend`/`HttpTestingController`; o `HttpClient` em si
precisa vir de `provideHttpClient()` separadamente (antes, `HttpClientTestingModule` trazia isso
"de brinde" via `imports: [HttpClientModule]` interno ao módulo deprecated).

**Correção aplicada:** removido `HttpClientTestingModule` do array `imports`; adicionados
`provideHttpClient()` e `provideHttpClientTesting()` ao array `providers`. Confirmado por execução
real: sem a correção completa (só `provideHttpClientTesting()`), os testes que injetam
`HttpClient`/services HTTP falhariam por falta de provider — com a correção completa, 115/115.

### Decisão 3: não migrar para o builder `application`/esbuild

**Decisão:** ignorar a migração opcional oferecida (`use-application-builder`).

**Justificativa:** mesma decisão da Etapa 6 — o `ng update` oferece isso como **opcional**, não
executa automaticamente. Trocar de builder é uma mudança de infraestrutura maior (esbuild processa
CSS/assets de forma diferente do webpack), fora do escopo desta etapa (versões de pacote +
compatibilidade). O builder `browser` continua suportado no Angular 18.

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| Builder `browser` (webpack) mantido, não `application` (esbuild) | Baixa | Nenhum imediato | Reavaliar como tarefa própria, fora da escada |
| Achado 0012 (`test:focus`) seguindo aberto | Média | Ferramenta de dev indisponível | Resolver antes da Etapa 12 |
| `npm audit` remanescente (69) é majoritariamente do núcleo Angular, só fecha no D6+ | Baixa | Nenhum novo — já esperado pelo ADR 0002 | Nenhuma ação; acompanhar a cada degrau |
| Padrão de migração automática incompleta em código customizado do `test.ts` já se repetiu 2x (D1, D4) | Baixa | Pode se repetir em degraus futuros que toquem `test.ts` | Revisar `test.ts` com atenção extra a cada `ng update @angular/core` daqui em diante |

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Não aplicável (migrado para 18.2.14)
- Rotas preservadas: Sim — `git diff` de `app-routing.module.ts` vazio
- Guards/autenticação preservados: Sim — `AuthInterceptor` revisado com atenção redobrada, provider
  preservado; specs de login/upload confirmam funcionamento real
- APIs/payloads preservados: Sim — nenhuma mudança de contrato; só forma de bootstrap do
  `HttpClient`
- Player/WaveSurfer preservado: Sim — `player.cy.ts` (2 testes) passa
- Upload/FormData preservado: Sim — `upload.cy.ts` confirma nomes de campo idênticos
- Carrinho/licenças/checkout preservados: Sim — specs correspondentes passam
- Dashboard/produtor preservado: Sim — não tocado
- Estilos/padrões preservados: Sim — nenhum `.html`/`.scss` alterado; screenshot confirma

## 16. Validações executadas

- [x] `ng update` completo (3 comandos) sob Node 24.18.1, árvore limpa (via stash).
- [x] Revisão de **todo** o diff (10 arquivos) antes do commit, com atenção especial a
  `auth.interceptor.ts`/`app.module.ts`.
- [x] `npm run build` — sucesso.
- [x] `npm test` — **115/115 SUCCESS** (após a correção do `test.ts`).
- [x] `npm run e2e` — **5/5 specs, 8/8 testes**.
- [x] `npm audit` — leitura completa da saída, confirmado que Material/CDK não aparece mais
  (achado A11 confirmado); 69 vulnerabilidades registradas.
- [x] Comparação visual da tela de upload — idêntica (nenhum HTML/CSS tocado).
- [x] `git diff --stat server/` e `src/**/*.html src/**/*.scss` — vazios.

## 17. Validações não executadas

- `npm run test:focus` — não retestado nesta etapa (já sabido quebrado desde o D1, achado 0012).
- `npm run lint`/`npm run typecheck` — não existem neste projeto.

## 18. Validações recomendadas

- [ ] Antes da Etapa 8 (D5): `git tag -l 'mig/*'` e `git log --oneline` para confirmar `mig/d4`.
- [ ] Rodar `npm run e2e` uma vez mais antes de iniciar D5, revertendo `server/data/users.json`
  depois.
- [ ] D5 (Angular 19) é o degrau que injeta `standalone: false` em ~70 componentes automaticamente
  — o plano classifica como "maior alteração automática da escada"; revisar `test.ts` com atenção
  redobrada (padrão de migração incompleta já se repetiu 2x em código customizado desse arquivo).

## 19. Pendências

- Achado 0012 (`test:focus` quebrado) — aberto, sem mudança nesta etapa.
- Builder `browser` vs `application`/esbuild — decisão de não migrar, registrada como nota.
- `npm audit` em 69 — expectativa de nova queda relevante só a partir do D6 (núcleo Angular).

## 20. Próximo passo recomendado

Aguardar confirmação explícita do usuário antes de iniciar a Etapa 8 (D5 — Angular 19, que injeta
`standalone: false` em ~70 componentes automaticamente, segundo o plano a maior alteração
automática da escada), conforme instrução da sessão.

## 21. Instruções para o próximo agente

1. Leia este relatório e os das Etapas 0-6.
2. Confirme `git log --oneline` e `git tag -l 'mig/*'` — deve haver `mig/e0`-`mig/e3` e
   `mig/d1`-`mig/d4`.
3. Leia `docs/migracao-angular-achados/README.md` — 13 achados catalogados.
4. Confirme `node -v` = `24.18.1`; árvore 100% limpa antes de `ng update` (stash dos arquivos
   alheios).
5. Reverta `server/data/users.json` se `npm run e2e` for executado antes de commitar.
6. **Atenção especial a `src/test.ts`** em qualquer `ng update @angular/core` futuro — o padrão de
   migração automática incompleta no override customizado de `TestBed.configureTestingModule` já
   se repetiu 2 vezes (D1: `require.context`; D4: `HttpClientTestingModule`). Revisar esse arquivo
   linha a linha após cada `ng update`, não confiar que "zero arquivos modificados" nesse arquivo
   signifique "nada a verificar".
7. Antes de agir no D5, leia o CHANGELOG oficial do Angular 19 e preste atenção à migração
   automática de `standalone: false` — revisar o diff completo antes de commitar, dado o volume
   esperado (~70 componentes).

## 22. Observações finais

Degrau que confirmou uma previsão específica do plano (achado A11: Material 18+ fecha o advisory) —
verificado por leitura completa da saída do `npm audit`, não apenas pela contagem total (que caiu
pouco, de 71 para 69, porque os advisories do núcleo Angular e do toolchain permanecem, mas o bloco
de Material/CDK especificamente desapareceu). O bug real desta etapa (`HttpClientTestingModule`
órfão em `test.ts`) seguiu o mesmo padrão do D1 — a migração automática do Angular não lida bem com
o override customizado de `TestBed.configureTestingModule` que o projeto usa para injetar módulos
comuns em todos os testes. Esse padrão já se repetiu duas vezes e deve ser vigiado nos próximos
degraus. A revisão cuidadosa da área de autenticação (`AuthInterceptor`) confirmou que a nova API
de `HttpClient` preserva 100% o comportamento anterior.
