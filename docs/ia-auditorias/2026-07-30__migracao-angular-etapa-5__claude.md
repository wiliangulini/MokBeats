# Relatório de Tarefa — Migração Angular 14→22, Etapa 5 / Degrau D2 (Angular/Material 16)

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-30
**Branch atual:** `feature/angular-22-migration`
**Tipo de tarefa:** Implementação (`ng update`, degrau de dependências)
**Status final:** Aprovado

## 2. Objetivo

Executar o degrau D2 do plano de migração: `ng update @angular/core@16 @angular/cli@16`,
`@angular/material@16` e `@ng-bootstrap/ng-bootstrap@15` no mesmo commit.

## 3. Escopo solicitado

- Confirmar Node 24.18.1 e árvore limpa antes de iniciar.
- `ng update @angular/core@16 @angular/cli@16` — nunca agrupar majors diferentes.
- `ng update @angular/material@16` e `@ng-bootstrap/ng-bootstrap@15` no mesmo degrau.
- Revisar todo o diff das migrações automáticas antes de commitar.
- Rodar o bloco de validação: `npm run build`, `npm test`, `npm run e2e`, `npm audit`.
- Commit + tag `mig/d2`.
- Pré-requisito confirmado: Etapa 4 (D1) validada, nenhum achado bloqueia este degrau.

## 4. Escopo não incluído

Nenhum outro degrau (D3-D8). Nenhuma alteração em `server/`. Nenhuma correção do achado 0012
(`test:focus`) — apenas reconfirmado no mesmo estado. Etapa 6 (D3) não iniciada.

## 5. Fontes de verdade consultadas

- Plano de migração completo, seção "Etapas 4-11" (protocolo idêntico por degrau).
- ADR `docs/adr/0002-migracao-angular-14-para-22.md`.
- `docs/migracao-angular-achados/README.md` (validação de não-bloqueio, 12 achados).
- Relatório da Etapa 4 (`2026-07-30__migracao-angular-etapa-4__claude.md`).
- CHANGELOG oficial do Angular 16.0.0 (via `gh api repos/angular/angular/contents/CHANGELOG.md`,
  tag `16.2.12`) — lido integralmente antes de agir, para identificar breaking changes reais.

## 6. Arquivos lidos

- CHANGELOG.md do Angular 16.0.0 (breaking changes de `core`, `common`, `compiler`,
  `platform-browser`, `platform-server`, `router`).
- `src/app/guards/{auth,produtor,profile-complete}.guard.ts` (antes e depois da migração).
- `package.json` (versões antes/depois).
- Verificação própria (grep) de uso de APIs removidas no v16 no código do projeto:
  `ComponentFactoryResolver`, `moduleId` (falso positivo — string literal não relacionada),
  `renderApplication`/`renderModuleFactory` (projeto não usa SSR).

## 7. Arquivos alterados

- `package.json`/`package-lock.json` — `@angular/*` → `16.2.12` (ou `16.2.14` para
  material/cdk/material-moment-adapter), `@angular/cli`/`@angular-devkit/build-angular` →
  `16.2.16`, `@ng-bootstrap/ng-bootstrap` → `15.1.2`, `zone.js` → `0.13.3`.
- `src/app/guards/auth.guard.ts`, `produtor.guard.ts`, `profile-complete.guard.ts` — migração
  automática removeu a interface `CanActivate` (deprecated); espaço duplo residual corrigido
  manualmente.
- `cypress/screenshots/baseline-visual.cy.ts/{carrinho,upload-mat-form-field}.png` —
  re-capturadas (idênticas visualmente às anteriores, confirmado).
- `docs/migracao-angular-achados/0012-test-focus-quebrado-apos-angular15.md` — seção "Atualização
  (D2)" adicionada, reconfirmando o mesmo estado de falha.

## 8. Arquivos criados

Este relatório.

## 9. Arquivos preservados

- `server/` (código) — intocado.
- Todos os templates `.html`, `.scss` — nenhum tocado (Material 16 não trouxe migração de código
  nos consumidores dos módulos `Legacy`, confirmado por `0 files modified` na saída do
  `ng update @angular/material@16`).
- `TypeScript` — permanece `4.9.5` (já dentro da nova faixa exigida, `>=4.9.3 <5.2`).
- Lógica de autorização dos 3 guards — 100% idêntica; só a assinatura de tipos mudou.

## 10. Arquivos removidos

Nenhum.

## 11. Estado inicial observado

- Branch em `mig/d1` (commit `ff32704`), árvore com os 2 arquivos alheios de sempre.
- `@angular/core` 15.2.10, `@angular/material` 15.2.9, `@ng-bootstrap/ng-bootstrap` 14.2.0,
  `zone.js` ~0.11.5.
- `npm audit`: 65 vulnerabilidades (herdado do D1).

## 12. O que foi implementado ou analisado

**Preparação:** mesmo procedimento do D1 — os 2 arquivos alheios movidos para `git stash push -u`
antes do `ng update`, devolvidos (`stash pop`) após o commit desta etapa.

**Leitura prévia do CHANGELOG oficial (não apenas a ferramenta interativa, que não expõe texto
estático):** identifiquei os breaking changes reais do v16 e confirmei, por `grep` no código do
projeto, que nenhuma API removida é usada: `ComponentFactoryResolver` (0 ocorrências),
`moduleId` como propriedade de `@Component` (a única ocorrência da string é um literal dentro de
`Function('moduleId', ...)` em um spec, não relacionado), `renderApplication`/`renderModuleFactory`
(projeto não faz SSR). `zone.js 0.11.x` deixou de ser suportado — resolvido automaticamente pelo
próprio `ng update`, que atualizou para `0.13.3`.

**Sequência executada:**
1. `ng update @angular/core@16 @angular/cli@16` — sucesso, árvore limpa.
2. `ng update @angular/material@16 --allow-dirty` — sucesso, **zero arquivos de código
   modificados** (os módulos `Legacy` usados desde o D1 continuam válidos no Material 16).
3. `ng update @ng-bootstrap/ng-bootstrap@15 --allow-dirty` — sucesso, sem migração de código.

**Revisão do diff:** só 5 arquivos de código alterados (3 guards + `package.json`/lock) — o menor
diff de todos os degraus até agora. Cada guard revisado individualmente (seção 13).

**Validação:**
- `npm run build` — sucesso (1 warning cosmético do extrator de CSS crítico, um a menos que no D1).
- `npm test` — **115/115 SUCCESS**.
- `npm run e2e` — **5/5 specs, 8/8 testes**.
- `npm audit` — **71 vulnerabilidades** (subiu de 65).
- `npm run test:focus` — reconfirmado quebrado, mesmo padrão de erro do D1 (achado 0012 sem
  mudança de estado).
- Comparação visual: screenshot `upload-mat-form-field.png` (33 `<mat-form-field>`) idêntica à
  versão do D1 — sem regressão.

## 13. Decisões técnicas tomadas

### Decisão 1: aceitar a remoção da interface `CanActivate` nos 3 guards

**Decisão:** manter a migração automática (remoção de `implements CanActivate` e do import
correspondente), apenas corrigindo o espaço duplo residual na declaração de classe.

**Justificativa:** revisão linha a linha de `auth.guard.ts`, `produtor.guard.ts` e
`profile-complete.guard.ts` (antes/depois) confirma que o método `canActivate()`, a assinatura de
parâmetros, o construtor e toda a lógica de autorização (`userAutetic()`, `isProdutor()`,
`isProfileComplete()`, redirecionamentos) permanecem **byte-a-byte idênticos** — a única mudança é
a remoção de uma interface TypeScript deprecated desde o Angular 15.2, que não tem efeito em
runtime (o Angular Router invoca `canActivate()` estruturalmente, não depende da interface formal
para reconhecer um guard de classe). Tratamento com atenção redobrada por serem invariante crítico
explícito do `PROJECT_RULES.md`/`CLAUDE.md` ("Preserve `AuthGuard`, `ProdutorGuard`").

**Verificação adicional:** `npm run e2e` inclui specs que dependem do comportamento real dos guards
(login, upload — que passam por `AuthGuard`/`ProfileCompleteGuard`), todos verdes.

### Decisão 2: nenhuma ação sobre o achado 0012 (`test:focus`)

**Decisão:** apenas reconfirmar e documentar que o comportamento não mudou.

**Justificativa:** mesmo princípio da Etapa 4 — não é exigido pelo DoD oficial do degrau, e a
correção definitiva fica para antes da Etapa 12 (migração Karma→Vitest).

### Decisão 3: `npm audit` subiu de 65 para 71 — aceito, mesma lógica do D1

**Decisão:** registrar sem tentar reduzir.

**Justificativa:** idêntica à Decisão 4 da Etapa 4 — novas dependências transitivas do
Angular/Material 16 trazem advisories novos; o fechamento efetivo é esperado só a partir do
Material 18+ (achado A11).

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| `npm audit` em tendência de alta (62→65→71 ao longo de D1/D2) | Baixa | Nenhum imediato; é o padrão esperado até o Material 18+ | Monitorar a cada degrau; sem ação até então |
| Achado 0012 (`test:focus`) seguindo aberto | Média | Ferramenta de dev indisponível; `npm test`/CI não afetados | Resolver antes da Etapa 12 |
| Migração real para MDC continua adiada (D3 é o próximo degrau) | Alta (já conhecida, não nova) | Nenhuma nesta etapa — Material 16 não tocou os módulos Legacy | Ver relatório da Etapa 4, Decisão 1 — mapeamento oficial já levantado, revisar antes do D3 |

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Não aplicável (migrado para 16.2.12)
- Rotas preservadas: Sim — `git diff` de `app-routing.module.ts` vazio
- Guards/autenticação preservados: Sim — lógica idêntica, revisada linha a linha (Decisão 1);
  specs de login/upload confirmam comportamento real
- APIs/payloads preservados: Sim — nenhum service tocado
- Player/WaveSurfer preservado: Sim — `player.cy.ts` (2 testes) passa
- Upload/FormData preservado: Sim — `upload.cy.ts` confirma nomes de campo idênticos
- Carrinho/licenças/checkout preservados: Sim — specs correspondentes passam
- Dashboard/produtor preservado: Sim — não tocado
- Estilos/padrões preservados: Sim — nenhum `.html`/`.scss` alterado; screenshot confirma

## 16. Validações executadas

- [x] `ng update` completo (3 comandos) sob Node 24.18.1, árvore limpa (via stash) — sucesso.
- [x] Revisão de **todo** o diff (5 arquivos) antes do commit, com atenção especial aos 3 guards.
- [x] `npm run build` — sucesso.
- [x] `npm test` — **115/115 SUCCESS**.
- [x] `npm run e2e` — **5/5 specs, 8/8 testes**.
- [x] `npm audit` — registrado (71, subiu de 65).
- [x] `npm run test:focus` — reconfirmado quebrado, sem regressão nova.
- [x] Comparação visual da tela de upload (33 `<mat-form-field>`) — sem diferença.
- [x] `git diff --stat src/**/*.html src/**/*.scss server/` — vazio.

## 17. Validações não executadas

- `npm run lint`/`npm run typecheck` — não existem neste projeto.

## 18. Validações recomendadas

- [ ] Antes da Etapa 6 (D3): `git tag -l 'mig/*'` e `git log --oneline` para confirmar `mig/d2`.
- [ ] Rodar `npm run e2e` uma vez mais antes de iniciar D3, revertendo `server/data/users.json`
  depois.
- [ ] **D3 é o próximo degrau crítico**: troca de builder (`browser`→`application`/esbuild),
  reorganização de `angular.json`, primeiro degrau que exige abandonar Node 16 (irrelevante aqui,
  já unificado desde a Etapa 2), e **remoção dos módulos `mat-legacy-*`** — revisar o relatório da
  Etapa 4 (Decisão 1) e o mapeamento oficial de classes MDC levantado lá antes de agir.

## 19. Pendências

- Achado 0012 (`test:focus` quebrado) — aberto, sem mudança.
- Migração real para componentes MDC — adiada para o D3, agora com urgência real (é o próximo
  degrau).
- `npm audit` em 71 — monitorar.

## 20. Próximo passo recomendado

Aguardar confirmação explícita do usuário antes de iniciar a Etapa 6 (D3 — Angular 17, o degrau que
remove os módulos `mat-legacy-*` e exige a migração real de CSS para MDC), conforme instrução da
sessão.

## 21. Instruções para o próximo agente

1. Leia este relatório e os das Etapas 0-4.
2. Confirme `git log --oneline` e `git tag -l 'mig/*'` — deve haver `mig/e0`-`mig/e3` e
   `mig/d1`-`mig/d2`.
3. **Leia com atenção a Decisão 1 do relatório da Etapa 4** (mapeamento oficial `.mat-form-field`→
   `.mat-mdc-form-field`, e as classes sem equivalente direto) antes de rodar
   `ng update @angular/material@17` — é quando os módulos `legacy-*` são removidos.
4. Confirme `node -v` = `24.18.1`; árvore 100% limpa antes de `ng update` (stash dos arquivos
   alheios, como feito nas Etapas 4 e 5).
5. Reverta `server/data/users.json` se `npm run e2e` for executado antes de commitar.
6. Antes de agir no D3, leia o CHANGELOG oficial do Angular 17 (via `gh api
   repos/angular/angular/contents/CHANGELOG.md?ref=<tag>`) para breaking changes reais, seguindo o
   mesmo padrão desta etapa — a ferramenta interativa `angular.dev/update-guide` não expõe texto
   estático.

## 22. Observações finais

Degrau mais tranquilo até agora: diff mínimo (5 arquivos), nenhuma mudança de template/CSS, e a
única área sensível tocada (os 3 guards) teve mudança puramente de tipagem, verificada com cuidado
por ser invariante crítico do projeto. Todas as validações objetivas permanecem verdes. O próximo
degrau (D3) é onde a dívida represada da estratégia `Legacy` do Material (Decisão 1 da Etapa 4)
finalmente vence — é o ponto de maior atenção do restante da escada.
