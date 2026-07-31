# Relatório de Tarefa — Migração Angular 14→22, Etapa 9 / Degrau D6 (Angular/Material 20)

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-31
**Branch atual:** `feature/angular-22-migration`
**Tipo de tarefa:** Implementação (`ng update` + ajuste manual de configuração)
**Status final:** Aprovado

## 2. Objetivo

Executar o degrau D6 do plano de migração: `ng update @angular/core@20 @angular/cli@20`,
`@angular/material@20` e `@ng-bootstrap/ng-bootstrap@19`. O plano identifica este degrau como o
**piso de segurança real** do projeto — os achados da própria análise (`§1` do plano) corrigiram a
premissa herdada de que "Angular ≥ 19.2.16" seria suficiente: os advisories novos de
`@angular/core` e `@angular/common` têm range `<=19.2.25`, ou seja, só fecham a partir do Angular 20.

## 3. Escopo solicitado

- Confirmar Node 24.18.1 e árvore limpa antes de iniciar.
- Ler o guia oficial de breaking changes do Angular 20 antes de agir.
- `ng update @angular/core@20 @angular/cli@20` — nunca agrupar majors diferentes.
- `ng update @angular/material@20` e `@ng-bootstrap/ng-bootstrap@19` no mesmo degrau.
- Revisar **todo** o diff das migrações automáticas antes de commitar.
- Rodar o bloco de validação: `npm run build`, `npm test`, `npm run e2e`, `npm audit`.
- Commit + tag `mig/d6`.
- Pré-requisito confirmado: Etapa 8 (D5) validada — tag `mig/d5`, relatório commitado, `npm audit`
  confirmado em 54, nenhuma vulnerabilidade nova introduzida pelo D5.

## 4. Escopo não incluído

Nenhum outro degrau (D7-D8). Nenhuma alteração em `server/`. Nenhuma das três migrações opcionais
oferecidas pelo `ng update` (`use-application-builder`, `control-flow-migration`,
`router-current-navigation`) foi executada. Nenhum bump de versão do `rxjs` (ver Decisão 2 — decidido
reverter a causa raiz em vez de ajustar a dependência). Etapa 10 (D7 — checkpoint) não iniciada.

## 5. Fontes de verdade consultadas

- Plano de migração completo, seção "Etapas 4-11", risco específico do D6, matriz de degraus (D6:
  Angular 20.3.27, Node `^20.19 || ^22.12 || >=24`, TypeScript `>=5.8 <6.0`, ng-bootstrap 19.0.1,
  Material 20.2.14) e §1 ("Correções ao diagnóstico herdado" — piso de segurança real = Angular 20).
- ADR `docs/adr/0002-migracao-angular-14-para-22.md`.
- `docs/migracao-angular-achados/README.md` (14 achados; validação de não-bloqueio).
- CHANGELOG oficial do Angular 20.0.0 (via `gh api repos/angular/angular/contents/CHANGELOG.md`,
  tag `20.0.0`) — lido integralmente antes de agir.

## 6. Arquivos lidos

- CHANGELOG.md do Angular 20.0.0 (breaking changes de `common`, `compiler`, `core`, `router`;
  deprecações de `core`/`platform-browser`/`platform-server`).
- Verificação própria (grep) de uso de APIs removidas: `TestBed.flushEffects` (0 ocorrências),
  `InjectFlags` (0), `TestBed.get(` (0), `afterRender` (0), `Hammer`/HammerJS (0).
- `angular.json`, `tsconfig.json` (diffs completos revisados antes e depois do ajuste manual).
- `package.json` (diff completo revisado).
- `node_modules/rxjs/package.json` (campo `exports`, para diagnosticar a causa raiz do erro de
  build) e `node_modules/@angular/core/package.json` (`peerDependencies.rxjs`), e `npm view
  rxjs@7.8.2 exports` para confirmar que versões mais novas de rxjs 7.x corrigem o problema.
- `src/test.ts`, `src/app/app-routing.module.ts`, `src/app/upload-file/upload-file-routing.
  module.ts`, `src/app/app.module.ts`, `src/app/guards/`, `src/app/interceptors/` — confirmados
  sem alteração (`git diff --stat` vazio para todos).

## 7. Arquivos alterados

- `package.json`/`package-lock.json` — `@angular/*` → `20.3.27`, `@angular/cli`/
  `@angular-devkit/build-angular` → `20.3.32`, `@angular/material`/`@angular/cdk`/
  `@angular/material-moment-adapter` → `20.2.14`, `@ng-bootstrap/ng-bootstrap` → `19.0.1`.
  `typescript` inalterado (`~5.8.3`, já dentro da faixa `>=5.8 <6.0`).
- `angular.json` — migração automática obrigatória acrescentou defaults de `schematics` (`type`
  para `component`/`directive`/`service`; `typeSeparator` para `guard`/`interceptor`/`module`/
  `pipe`/`resolver`), preservando a convenção de nomenclatura de `ng generate` que era o
  comportamento padrão antes do Angular 20 (que passou a omitir o sufixo de tipo por padrão em
  arquivos gerados). **Só afeta `ng generate` futuro — nenhum arquivo existente é tocado.**
- `cypress/screenshots/baseline-visual.cy.ts/carrinho.png`,
  `cypress/screenshots/baseline-visual.cy.ts/upload-mat-form-field.png` — recapturadas durante a
  execução do e2e (mesmo padrão de etapas anteriores).

## 8. Arquivos criados

Este relatório.

## 9. Arquivos preservados

- `tsconfig.json` — a migração automática obrigatória mudou `moduleResolution` de `"node"` para
  `"bundler"`; **revertido manualmente** (ver Decisão 2). Resultado: arquivo byte-idêntico ao
  estado pré-D6 (a migração só alterava essa linha).
- `src/` (todo o diretório) — **nenhum arquivo tocado** neste degrau (diferente do D5, que tocou 44
  arquivos). Confirmado via `git diff --stat -- src/` vazio.
- `src/app/app-routing.module.ts`, `src/app/upload-file/upload-file-routing.module.ts`,
  `src/app/app.module.ts`, `src/app/guards/*.ts`, `src/app/interceptors/*.ts`, `src/test.ts` — todos
  intocados.
- `server/` (código) — intocado.
- Todos os templates `.html` e arquivos `.scss` — nenhum tocado.

## 10. Arquivos removidos

Nenhum arquivo do repositório.

## 11. Estado inicial observado

- Branch em `mig/d5` (commit `12bd7a9`), árvore com os 2 arquivos alheios de sempre.
- `@angular/core` 19.2.25, `@angular/material` 19.2.19, `@ng-bootstrap` 18.0.0, `typescript` 5.8.3.
- `npm audit`: 54 vulnerabilidades (herdado do D5), incluindo 1 `critical` (`tar`, via cadeia
  `pacote`/`@sigstore`/`@angular/cli`).

## 12. O que foi implementado ou analisado

**Preparação:** mesmo procedimento das etapas anteriores — `nvm use` para garantir Node `24.18.1`,
stash dos 2 arquivos alheios antes do `ng update`, devolvidos após o commit.

**Leitura prévia do CHANGELOG oficial do v20:** identificados os breaking changes reais —
`TestBed.flushEffects()` removido (usar `TestBed.tick()`), `InjectFlags` removido, `TestBed.get`
removido (usar `TestBed.inject`), `afterRender` renomeado para `afterEveryRender`, TypeScript `<5.8`
não mais suportado, Node.js `<20.11.1` e `22.0-22.10` não mais suportados, HammerJS depreciado
(não removido), `ngIf`/`ngFor`/`ngSwitch` depreciados em favor do control flow `@if`/`@for`/
`@switch` (não removidos, sem ação necessária). Confirmado por grep que nenhuma API removida é
usada pelo projeto antes de agir. TypeScript já em `5.8.3` (herdado do D5) satisfaz a nova faixa
mínima sem necessidade de bump.

**Sequência executada:**
1. `ng update @angular/core@20 @angular/cli@20` — sucesso. Executou 4 migrações obrigatórias:
   atualização de defaults de `schematics` em `angular.json`; troca de `moduleResolution` em
   `tsconfig.json`; 2 migrações de imports de `provideServerRendering`/`@angular/ssr` sem alteração
   (projeto não usa SSR); remoção de arquivos de configuração Karma "vazios" (sem alteração — o
   `karma.conf.js` do projeto tem conteúdo customizado). Ofereceu 1 migração opcional
   (`use-application-builder`) — não executada, mesma decisão de todas as etapas anteriores. As
   migrações do `@angular/core` (`DOCUMENT` de `@angular/common`, `InjectFlags`, `TestBed.get`,
   `BootstrapContext`) completaram sem alteração — confirma o grep prévio de que nenhuma API
   afetada é usada. Ofereceu 2 migrações opcionais adicionais (`control-flow-migration`,
   `router-current-navigation`) — nenhuma executada (fora do escopo de preservação desta migração).
2. `ng update @angular/material@20 --allow-dirty` — sucesso, **zero arquivos de código-fonte
   modificados** (só tocou `dist/index.html` e `dist/styles.*.css`, ambos `.gitignore`d — sem
   impacto no repositório).
3. `ng update @ng-bootstrap/ng-bootstrap@19 --allow-dirty` — sucesso, sem migração de código.

**Revisão do diff:** apenas 4 arquivos alterados (`angular.json`, `tsconfig.json`, `package.json`,
`package-lock.json`) — o menor volume de diff de qualquer degrau até agora, já que nenhuma migração
de código-fonte foi disparada. `git diff -- angular.json` confirmado como aditivo e restrito à
seção `schematics` (defaults de `ng generate`, sem efeito em arquivos existentes).

**Bug de build encontrado e corrigido:** `npm run build` falhou após o `ng update` com múltiplos
erros `TS7016`/`TS7031` ("Could not find a declaration file for module 'rxjs'" e "implicitly has an
'any' type" em callbacks de `.subscribe(...)`), espalhados por vários arquivos que importam de
`rxjs` (ver Decisão 2).

**Validação:**
- `npm run build` — falhou inicialmente (ver Decisão 2); **sucesso** após reverter
  `moduleResolution`.
- `npm test` — **115/115 SUCCESS**.
- `npm run e2e` — backend iniciado manualmente antes (mesma lição da Etapa 8, já esperada — não é
  achado novo): **5/5 specs, 8/8 testes** (`baseline-visual.cy.ts` 3/3, `checkout.cy.ts` 1/1,
  `licenca-carrinho.cy.ts` 1/1, `player.cy.ts` 2/2, `upload.cy.ts` 1/1). Backend encerrado ao final.
- `git checkout -- server/data/users.json` — revertido após a execução real do e2e.
- `npm audit` — **20 vulnerabilidades** (caiu de 54), sendo 9 moderate / 11 high / **0 critical**.
  Leitura completa da saída confirmou: os advisories de `@angular/core`, `@angular/common`,
  `@angular/compiler`, `@angular/router`, `@angular/platform-browser*`, `@ng-bootstrap/ng-bootstrap`
  e `@babel/core` **desapareceram por completo** — confirma a correção de diagnóstico do próprio
  plano (§1: "piso de segurança real = Angular 20"). O item `critical` de `tar` (cadeia `pacote`/
  `@sigstore`) também desapareceu, provavelmente resolvido pela atualização do `@angular/cli` para
  20.3.32. Os 20 remanescentes são: `@hono/node-server` (moderate, nova entrada nesta etapa, via
  `@modelcontextprotocol/sdk` → `@angular/cli`, fix sugerido `@angular/cli@21.0.4+` — D7),
  `brace-expansion`/karma (high, mesma cadeia já documentada no A8/achado do plano — fix
  disponível seria um *downgrade* do karma, não aplicável), `postcss` (high, fix sugerido
  `@angular-devkit/build-angular@22.1.2` — D8), `qs`/`uuid` (moderate, cadeia `cypress`/
  `webpack-dev-server`, com fix não-destrutivo disponível via `npm audit fix` simples — não
  aplicado nesta etapa, registrado como pendência de baixo risco).

## 13. Decisões técnicas tomadas

### Decisão 1: aceitar os defaults de `schematics` em `angular.json` sem alteração

**Decisão:** manter a migração automática que adicionou `type`/`typeSeparator` aos defaults de
`schematics` em `angular.json`.

**Justificativa:** essa mudança só afeta o comportamento de `ng generate` para arquivos **futuros**
— preserva a convenção de nomenclatura que já era o padrão do projeto (ex.: `nome.component.ts`,
não `nome.ts`), compensando a mudança de default do próprio Angular 20 (que passou a omitir o
sufixo de tipo). Não há nenhum efeito em código já existente, confirmado por `git diff --stat --
src/` vazio.

### Decisão 2: reverter `moduleResolution` de `tsconfig.json` de `bundler` para `node`

**Descoberta:** a migração automática obrigatória do `@angular/cli@20` alterou
`tsconfig.json`'s `moduleResolution` de `"node"` para `"bundler"` — mudança recomendada pela própria
Angular para acompanhar a evolução do toolchain TypeScript. Isso quebrou o build com múltiplos
erros `TS7016`/`TS7031`, todos originados em importações de `rxjs`.

**Investigação da causa raiz:** o `rxjs` do projeto está fixado em `~7.4.0` (`package.json`) — e
`7.4.0` é a **única** versão `7.4.x` já publicada no npm (confirmado via `npm view rxjs versions`).
Inspecionado `node_modules/rxjs/package.json`: seu campo `"exports"` define caminhos `node`/
`es2015`/`default` para cada subpath, mas **não declara nenhuma condição `"types"`** — só o campo
legado de nível superior `"types": "index.d.ts"`. Sob `moduleResolution: "node"` (o padrão anterior
do TypeScript para builds CommonJS/webpack), o compilador ignora o `"exports"` map e usa
diretamente o campo `"types"` legado, então a resolução funciona. Sob `moduleResolution: "bundler"`,
o TypeScript honra o `"exports"` map — e como não há uma condição `"types"` ali, a resolução de
tipos falha (`TS7016`), e cada uso subsequente de valores importados de `rxjs` em callbacks perde
inferência de tipo (`TS7031`/`TS7006`, "implicitly has an 'any' type", sob `strict: true`).
Confirmado via `npm view rxjs@7.8.2 exports` que versões `7.8.x` do rxjs **já corrigem** isso
(adicionam condição `"types"` a cada subpath do `exports`), e que `@angular/core@20.3.27` aceita
`rxjs: "^6.5.3 || ^7.4.0"` como peer — ou seja, um bump para `7.8.x` seria tecnicamente compatível.

**Correção aplicada:** revertido `moduleResolution` para `"node"` em vez de ajustar a versão do
`rxjs`. Testado isoladamente: a reversão, sozinha, faz `npm run build` voltar a passar sem tocar em
nenhuma dependência.

**Por que reverter em vez de ajustar o rxjs:** (1) `rxjs` não é um dos três pacotes que este degrau
está autorizado a atualizar (`@angular/core`/`cli`, `@angular/material`, `@ng-bootstrap/ng-
bootstrap`) — mudar sua faixa de versão seria expandir o escopo da etapa sem autorização explícita,
o que `PROJECT_RULES.md §2` proíbe ("ampliar escopo sem informar justificativa, risco e alternativa
de menor impacto") e `§13` lista "dependências novas" entre as decisões que exigem validação
humana; mesmo não sendo uma dependência nova, é uma mudança de faixa semver que hoje trava em um
único patch (`~7.4.0` → só `7.4.0` existe) e mudaria esse comportamento. (2) `moduleResolution:
"bundler"` é uma recomendação atrelada à evolução em direção ao builder `application`/esbuild — o
projeto permanece deliberadamente no builder `browser`/webpack desde as Etapas 6/7/8 (decisão já
registrada 3 vezes), que não exige `bundler` resolution para funcionar. Reverter é, portanto, a
correção de **menor escopo e mais reversível**: nenhuma dependência muda de faixa, e a decisão pode
ser revisitada junto da eventual migração de builder, quando ambas as mudanças fariam sentido
juntas. (3) Este é exatamente o padrão que o plano autoriza: "revisar todo o diff das migrações
automáticas antes de commitar" — nem toda mudança automática precisa ser aceita; migrações que
quebram a validação podem e devem ser ajustadas ou revertidas, com a decisão documentada.

**Registrado como achado** [0015](../migracao-angular-achados/0015-moduleresolution-bundler-quebra-rxjs-antigo.md)
para rastreamento e possível revisão futura (junto da adoção do builder `application`, se/quando
isso for decidido).

### Decisão 3: não executar as 3 migrações opcionais oferecidas

**Decisão:** ignorar `use-application-builder`, `control-flow-migration` e
`router-current-navigation`.

**Justificativa:** todas explicitamente opcionais no output do `ng update`. A primeira já foi
adiada em 3 etapas anteriores pela mesma razão (mudança de infraestrutura maior, fora do escopo). A
segunda converteria `*ngIf`/`*ngFor` para `@if`/`@for` em todos os templates — mudança de sintaxe
ampla e visível, fora do escopo de "preservar comportamento" desta migração de versões. A terceira é
irrelevante — grep não encontrou uso de `Router.getCurrentNavigation`.

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| `moduleResolution: "node"` mantido (não `"bundler"`) — diverge da recomendação padrão do Angular 20 | Baixa | Nenhum imediato; builder `browser`/webpack não exige `bundler` | Revisitar junto da eventual adoção do builder `application`/esbuild (achado 0015) |
| `rxjs` preso em `~7.4.0` (único patch da faixa) | Baixa | Nenhum funcional hoje; limitação latente de compatibilidade com ferramentas mais novas que assumam `exports` com `types` | Considerar bump para `~7.8.x` como tarefa própria, com validação humana (fora desta migração) |
| Builder `browser` (webpack) mantido, não `application` (esbuild) | Baixa | Nenhum imediato | Reavaliar como tarefa própria, fora da escada |
| `qs`/`uuid` têm fix não-destrutivo disponível (`npm audit fix` simples) não aplicado | Baixa | Nenhum — 2 vulnerabilidades moderate seguem abertas por 1 degrau a mais | Aplicar em etapa própria ou no D7, se o protocolo permitir `npm audit fix` sem `--force` |
| Achado 0012 (`test:focus`) seguindo aberto | Média | Ferramenta de dev indisponível | Resolver antes da Etapa 12 |

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Não aplicável (migrado para 20.3.27)
- Rotas preservadas: Sim — `git diff` de `app-routing.module.ts` e `upload-file-routing.module.ts`
  vazio
- Guards/autenticação preservados: Sim — `git diff` de `src/app/guards/` e `src/app/interceptors/`
  vazio
- APIs/payloads preservados: Sim — nenhuma mudança de contrato; nenhum arquivo de `src/` tocado
- Player/WaveSurfer preservado: Sim — `player.cy.ts` (2/2)
- Upload/FormData preservado: Sim — `upload.cy.ts` confirma nomes de campo idênticos
- Carrinho/licenças/checkout preservados: Sim — `checkout.cy.ts` e `licenca-carrinho.cy.ts` passam
- Dashboard/produtor preservado: Sim — não tocado
- Estilos/padrões preservados: Sim — nenhum `.html`/`.scss` alterado; `baseline-visual.cy.ts` (3/3)

## 16. Validações executadas

- [x] `ng update` completo (3 comandos) sob Node 24.18.1, árvore limpa (via stash).
- [x] Grep prévio confirmando ausência de uso das APIs removidas no v20.
- [x] Revisão de **todo** o diff (4 arquivos) antes do commit.
- [x] `npm run build` — falhou inicialmente, causa raiz investigada e corrigida (Decisão 2),
  sucesso após a correção.
- [x] `npm test` — **115/115 SUCCESS**.
- [x] `npm run e2e` — **5/5 specs, 8/8 testes** (backend iniciado manualmente).
- [x] `npm audit` — leitura completa da saída, confirmado que os advisories de `@angular/*` e
  `@ng-bootstrap` fecharam e a crítica de `tar` desapareceu; 20 vulnerabilidades registradas (queda
  de 54).
- [x] `git checkout -- server/data/users.json` após a execução real do e2e.
- [x] `git diff --stat -- src/ server/` vazio — confirmado que nenhum arquivo de aplicação foi
  tocado neste degrau.

## 17. Validações não executadas

- `npm run test:focus` — não retestado nesta etapa (já sabido quebrado desde o D1, achado 0012).
- `npm run lint`/`npm run typecheck` — não existem neste projeto.
- `npm audit fix` (sem `--force`) para `qs`/`uuid` — não executado; fora do escopo do protocolo
  desta etapa (que só manda registrar o número, não aplicar fixes automáticos). Registrado como
  pendência de baixo risco.

## 18. Validações recomendadas

- [ ] Antes da Etapa 10 (D7): `git tag -l 'mig/*'` e `git log --oneline` para confirmar `mig/d6`.
- [ ] Continuar subindo o backend manualmente antes de `npm run e2e` (lição já registrada na
  Etapa 8).
- [ ] D7 (Angular 21) é o **checkpoint** do plano — estado entregável e mergeável em `dev`. Ao
  chegar lá, rodar a validação completa **e** o checklist manual integral de
  `docs/areas/validacao-qa.md`, não só o bloco de validação automatizado.
- [ ] Revisitar o achado 0015 (`moduleResolution`) quando/se o projeto decidir adotar o builder
  `application`/esbuild — nesse momento, o bump de `rxjs` provavelmente também será necessário.

## 19. Pendências

- Achado 0012 (`test:focus` quebrado) — aberto, sem mudança nesta etapa.
- Achado 0015 (`moduleResolution: bundler` quebra `rxjs` antigo) — revertido nesta etapa, registrado
  para revisão futura junto da adoção do builder `application`.
- `qs`/`uuid` com fix não-destrutivo disponível, não aplicado — baixo risco, pendência aberta.
- `npm audit` em 20 (0 critical) — expectativa de queda adicional a partir do D7
  (`@angular/cli@21.0.4+`, fecha `@hono/node-server`) e D8 (`@angular-devkit/build-angular@22.1.2`,
  fecha `postcss`).

## 20. Próximo passo recomendado

Aguardar confirmação explícita do usuário antes de iniciar a Etapa 10 (D7 — Angular 21, o
**checkpoint** do plano: estado entregável e mergeável em `dev`, com validação completa +
checklist manual integral), conforme instrução da sessão.

## 21. Instruções para o próximo agente

1. Leia este relatório e os das Etapas 0-8.
2. Confirme `git log --oneline` e `git tag -l 'mig/*'` — deve haver `mig/e0`-`mig/e3` e
   `mig/d1`-`mig/d6`.
3. Leia `docs/migracao-angular-achados/README.md` — 15 achados catalogados.
4. Confirme `node -v` = `24.18.1` **explicitamente após `nvm use`**; árvore 100% limpa antes de
   `ng update` (stash dos arquivos alheios).
5. Antes de rodar `npm run e2e`, suba o backend manualmente: `cd server && node src/index.js` (sob
   Node 24.18.1) em background, confirme pelo log ("Servidor Iniciado!"), encerre ao final. Reverta
   `server/data/users.json` se o e2e real for executado antes de commitar.
6. **D7 é o checkpoint do plano.** Além do bloco de validação automatizado padrão, rode o checklist
   manual integral de `docs/areas/validacao-qa.md` antes de considerar a etapa concluída — é o
   ponto de parada aceito caso o D8 (TypeScript 6.0) se mostre hostil.
7. Se `npm run build` falhar após o `ng update` do D7, **não assuma que a causa é nova** — confirme
   primeiro se `tsconfig.json` foi novamente tocado (ex.: `moduleResolution` reescrito pela
   migração) antes de investigar do zero; o achado 0015 documenta esse padrão específico.
8. Ao considerar fechar `qs`/`uuid` via `npm audit fix` (sem `--force`), validar que não altera
   `package.json` de forma inesperada antes de aceitar — mesmo sendo "não-destrutivo" segundo o
   `npm audit`, revisar o diff como qualquer outra mudança de dependência.

## 22. Observações finais

Este degrau confirmou, com evidência concreta de `npm audit`, a correção de diagnóstico mais
importante do plano: o piso de segurança real do projeto era Angular 20, não Angular 19 como a
premissa herdada sugeria — os advisories de `@angular/core`/`@angular/common` (que motivaram a
migração inteira) só fecham aqui, junto com a vulnerabilidade crítica de `tar`. Foi também o degrau
com menor volume de diff de código-fonte (zero arquivos em `src/`), mas o único até agora que exigiu
uma decisão técnica de reverter parte de uma migração automática obrigatória — feita com
investigação de causa raiz completa (não um ajuste às cegas) e documentada como achado para revisão
futura, mantendo o princípio de menor mudança possível sem expandir o escopo autorizado desta etapa.
