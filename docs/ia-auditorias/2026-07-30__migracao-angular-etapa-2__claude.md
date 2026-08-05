# Relatório de Tarefa — Migração Angular 14→22, Etapa 2 (unificar o runtime Node)

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-30
**Branch atual:** `feature/angular-22-migration`
**Tipo de tarefa:** Implementação (build/runtime)
**Status final:** Aprovado

## 2. Objetivo

Executar a Etapa 2 do plano de migração Angular 14→22: unificar o runtime Node do frontend com o do
backend em 24.18.1, eliminando a "ponte EOL" (Node 16.20.2) antes de iniciar a escada de `ng update`
(Etapas 4-11), aproveitando que o Angular 14 aceita `engines.node: "^14.15.0 || >=16.10.0"` — faixa
que já cobre o Node 24.

## 3. Escopo solicitado

- `.nvmrc` da raiz: `16.20.2` → `24.18.1` (iguala `server/.nvmrc`).
- `start.sh`: reescrever a linha 19 (mensagem de ajuda) e o bloco de comentário 74-79 (vocabulário
  de "ponte EOL"), sem alterar `resolve_node_bin()`.
- `@types/node`: `^12.11.1` → `^24.0.0`.
- Validar sob Node 24.18.1: `npm ci`, `npm run build`, `npm test` (115), `npm run e2e` (5).
- Pré-requisito confirmado antes de iniciar: nenhum dos 7 achados da Etapa 1 bloqueia esta etapa
  (registrado em `docs/migracao-angular-achados/README.md` e no commit `dd4b2dd`).

## 4. Escopo não incluído

Nenhuma alteração em `angular.json`, `tsconfig*.json`, `karma.conf.js`, `src/`, `server/` (código).
Nenhum `ng update`. `start.ps1`, `docs/GUIA_MOKBEATS_NAO_TECNICO.md` e `deploy-to-vps.sh` **não**
foram tocados — o plano reserva essa consolidação para a Etapa 13 (ver Decisão 1). Etapa 3 em diante
não iniciada.

## 5. Fontes de verdade consultadas

- Plano de migração completo, seção "Etapa 2".
- ADR `docs/adr/0002-migracao-angular-14-para-22.md`.
- `docs/migracao-angular-achados/README.md` — confirmação de que nenhum achado bloqueia esta etapa.
- `PROJECT_RULES.md` §12 (comandos reais de validação).

## 6. Arquivos lidos

- `.nvmrc`, `server/.nvmrc`, `start.sh` (completo), `start.ps1` (completo, para decidir a Decisão 1).
- `package.json` (`@types/node`, `engines`).
- `docs/migracao-angular-achados/README.md` e os 7 arquivos de achado, para a validação de
  não-bloqueio.

## 7. Arquivos alterados

- `.nvmrc` — `16.20.2` → `24.18.1`.
- `start.sh` — linha 19 (mensagem) e bloco de comentário 74-79 (vocabulário de "ponte EOL" removido,
  referência ao ADR 0002 adicionada).
- `package.json` — `@types/node` `^12.11.1` → `^24.0.0`.
- `package-lock.json` — atualizado por `npm install` (29 inserções/9 remoções: troca de
  `@types/node@12.20.55` por `@types/node@24.x` e adição de `undici-types`).
- `cypress/screenshots/baseline-visual.cy.ts/upload-mat-form-field.png` — re-capturada ao rodar
  `npm run e2e` de novo para validar esta etapa (mesma rota/estado da Etapa 1, apenas nova execução).

## 8. Arquivos criados

Nenhum.

## 9. Arquivos preservados

- `src/` e `server/` (código) — `git diff --stat` vazio em ambos após o commit.
- `start.ps1`, `docs/GUIA_MOKBEATS_NAO_TECNICO.md`, `deploy-to-vps.sh`, `docs/SCRIPTS_SHELL.md` —
  não tocados nesta etapa (ver Decisão 1).
- `angular.json`, `tsconfig*.json`, `karma.conf.js` — intocados (não fazem parte do escopo da
  Etapa 2 no plano).

## 10. Arquivos removidos

Nenhum.

## 11. Estado inicial observado

- Branch em `mig/e1` + commit `dd4b2dd` (pasta de achados), árvore limpa em relação ao escopo.
- `.nvmrc` = `16.20.2`; `server/.nvmrc` = `24.18.1` (dois runtimes, conforme diagnosticado no ADR).
- `@types/node` = `^12.11.1` (EOL desde 2022).
- `npm audit` (antes desta etapa, já registrado na Etapa 0): 62 vulnerabilidades.

## 12. O que foi implementado ou analisado

- `.nvmrc` da raiz alterado para `24.18.1`.
- `start.sh` atualizado (mensagem de ajuda + bloco de comentário) sem alterar
  `resolve_node_bin()` (função já lia do `.nvmrc`, continua correta).
- `@types/node` atualizado; `npm install` sob Node 24.18.1 para ressincronizar o lock (necessário:
  `npm ci` falha com lock desatualizado — `EUSAGE`, confirmado por execução real antes de corrigir).
- `npm ci` confirmado funcional sob Node 24.18.1 após o `npm install`.
- `npm run build` (produção, AOT + `base-href /`) — sucesso, sem erros de compilação.
- `npm test` — **115/115 SUCCESS** sob Chrome Headless, Node 24.18.1.
- `npm run e2e` (comando oficial via `start-server-and-test`, subindo `ng serve` + Cypress) —
  **5/5 specs, 8/8 testes** passando sob Node 24.18.1 (frontend e Cypress no mesmo runtime; backend
  já estava em 24.18.1 desde antes).
- `npm audit` registrado: **62 vulnerabilidades** (3 low, 15 moderate, 43 high, 1 critical) — mesmo
  número de antes; nenhuma fechada nesta etapa, como esperado (`@types/node` é dev-only e não altera
  nenhum advisory de runtime).
- `server/data/users.json`, sujado pela execução real dos specs e2e (login/registro reais),
  revertido antes do commit.

## 13. Decisões técnicas tomadas

### Decisão 1: não tocar `start.ps1`, `docs/GUIA_MOKBEATS_NAO_TECNICO.md` nem `deploy-to-vps.sh`

**Decisão:** apesar de esses arquivos também mencionarem a "ponte EOL"/Node 16.20.2 do frontend, a
Etapa 2 do plano lista explicitamente apenas `.nvmrc` e `start.sh` (linhas 18-19; bloco 74-79). A
Etapa 13 ("Reflexo em build, scripts e limpeza") já está desenhada para consolidar essas referências
(incluindo `docs/SCRIPTS_SHELL.md`, se necessário).

**Justificativa:** seguir o escopo mínimo e explícito de cada etapa, evitando antecipar trabalho de
etapas futuras fora do que foi pedido — mesmo princípio aplicado nas divergências D-1/D-2/D-3 da
Etapa 0.

**Trade-off:** por algumas etapas, `start.ps1` (Windows) e o guia não-técnico ficam com informação
desatualizada em relação ao `.nvmrc` real. Aceitável — são documentação operacional, não código; a
Etapa 13 fecha essa lacuna antes do fim da migração.

### Decisão 2: `npm install` antes de `npm ci`

**Decisão:** `npm ci` falhou inicialmente (`EUSAGE`: lock desatualizado). Rodei `npm install` sob
Node 24.18.1 para ressincronizar `package-lock.json`, e só então confirmei `npm ci` funcional.

**Justificativa:** é o fluxo padrão e esperado ao mudar uma dependência declarada — `npm ci` exige
lock já sincronizado, não o gera. A mudança no lock ficou pequena (29 inserções/9 remoções), batendo
com o "baixo risco confirmado" do plano.

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| Nenhum risco novo desta etapa (contingência do plano — Node 24 não rodar o toolchain do Angular 14 — não se materializou) | — | `npm run build`, `npm test`, `npm run e2e` todos verdes sob Node 24.18.1 | Nenhuma ação necessária |
| `start.ps1`/docs ficam temporariamente desatualizados (Decisão 1) | Baixa | Confusão para quem rodar o script Windows ou seguir o guia manual antes da Etapa 13 | Documentado aqui; Etapa 13 já prevista para consolidar |
| `server/data/users.json` sujo a cada execução real do e2e (achado 0004, já registrado) | Baixa | Mesmo comportamento da Etapa 1, sem mudança | Revertido antes do commit, como na Etapa 1 |

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Sim (nenhuma alteração em `src/`; `ng build` produção sob Node 24
  concluiu sem erro, confirmando que o Angular 14 tolera o novo runtime)
- Rotas preservadas: Sim (não tocadas)
- Guards/autenticação preservados: Sim (não tocados; specs de auth continuam passando)
- APIs/payloads preservados: Sim (`server/` código intocado)
- Player/WaveSurfer preservado: Sim (spec do player passa sob o novo runtime)
- Upload/FormData preservado: Sim (spec de upload passa sob o novo runtime)
- Carrinho/licenças/checkout preservados: Sim (specs correspondentes passam sob o novo runtime)
- Dashboard/produtor preservado: Não aplicável (não tocado)
- Estilos/padrões preservados: Sim (nenhum SCSS/CSS alterado)

## 16. Validações executadas

- [x] `npm ci` sob Node 24.18.1 (após `npm install` para ressincronizar o lock) — sucesso.
- [x] `npm run build` (produção) sob Node 24.18.1 — sucesso, sem erros.
- [x] `npm test` sob Node 24.18.1 — **115/115 SUCCESS**.
- [x] `npm run e2e` sob Node 24.18.1 (comando oficial, `start-server-and-test`) — **5/5 specs, 8/8
  testes** passando.
- [x] `npm audit` sob Node 24.18.1 — **62 vulnerabilidades** (baseline mantida, registrada).
- [x] `git diff --stat src/ server/` — vazio após reverter `server/data/users.json`.

## 17. Validações não executadas

- `npm run lint` / `npm run typecheck` — não existem neste projeto (`PROJECT_RULES.md §12`).

## 18. Validações recomendadas

- [ ] Antes da Etapa 3: `git tag -l 'mig/*'` e `git log --oneline` para confirmar `mig/e2` como
  estado real.
- [ ] Reverter `server/data/users.json` após qualquer execução local futura de `npm run e2e`.

## 19. Pendências

- `start.ps1`, `docs/GUIA_MOKBEATS_NAO_TECNICO.md`, `deploy-to-vps.sh`: ainda descrevem a "ponte
  EOL" com Node 16.20.2 — consolidação prevista para a Etapa 13, não desta.
- Os 7 achados de `docs/migracao-angular-achados/` continuam abertos/monitorados; nenhum novo
  achado surgiu nesta etapa.

## 20. Próximo passo recomendado

Aguardar confirmação explícita do usuário antes de iniciar a Etapa 3 (Bootstrap 4.6.2 → 5.3.8, ainda
em Angular 14), conforme instrução da sessão.

## 21. Instruções para o próximo agente

1. Leia este relatório e os das Etapas 0 e 1.
2. Confirme `git log --oneline` e `git tag -l 'mig/*'` — deve haver `mig/e0`, `mig/e1`, `mig/e2`.
3. Confirme `node -v` = `24.18.1` (via `nvm use $(cat .nvmrc)`) antes de qualquer comando.
4. Reverta `server/data/users.json` se `npm run e2e` for executado novamente antes de commitar.
5. Leia a seção "Etapa 3" do plano em
   `docs/ia-auditorias/2026-07-30__plano-migracao-angular-14-para-22-v2__claude.md`, incluindo o
   achado A15 (sem override de variável Sass) e a proibição de reordenar `scripts` de
   `angular.json` (A5) antes de agir.

## 22. Observações finais

Etapa livre de surpresas: a contingência prevista no plano (Node 24 não suportar o toolchain do
Angular 14) não se materializou — build, testes unitários e e2e passaram integralmente no primeiro
runtime unificado. O único ajuste necessário foi rodar `npm install` antes de `npm ci` (esperado ao
mudar uma dependência declarada). `npm audit` permanece em 62 vulnerabilidades, como previsto —
essa contagem só começa a cair a partir dos degraus `ng update` (Etapas 4+).
