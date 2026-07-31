# Relatório de Tarefa — Recalibração da T1 e sincronização `main`

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-30
**Branch atual:** dev
**Tipo de tarefa:** Auditoria + Implementação incremental
**Status final:** Aprovado com observações

## 2. Objetivo

A sessão anterior (R1b) encerrou com duas pendências declaradas pelo usuário: **T1** (toolchain
Angular/Cypress, motivada por "141 vulnerabilidades do Dependabot, 2 críticas") e, secundariamente,
**remover o fallback JWT hardcoded** do backend. O objetivo desta tarefa era decidir qual delas
atacar primeiro. A investigação prévia à decisão revelou que ambas as premissas estavam erradas, e
o objetivo mudou para: corrigir o diagnóstico, sincronizar a branch `main` (desatualizada e
responsável pelo alarme falso) e aplicar o único ganho de dependências disponível sem migração
major.

## 3. Escopo solicitado

- Investigar o estado real do fallback JWT e dos alertas do Dependabot antes de agir.
- Sincronizar `main` com `dev` via Pull Request (sem merge/push direto).
- Aplicar o upgrade de `@angular/cli` 14.1.3 → 14.2.13 (único fix sem salto de major).
- Validar build e suíte de testes sob Node 16.20.2.
- Corrigir memórias desatualizadas e registrar relatório.

## 4. Escopo não incluído

- Migração major Angular 14 → 20 LTS (iniciativa própria, autorização separada).
- Merge do PR `dev` → `main` (ação do usuário).
- Qualquer alteração em `server/` ou código de aplicação do frontend.
- `start.ps1` (pendência antiga, não relacionada).

## 5. Fontes de verdade consultadas

- `PROJECT_RULES.md`
- `AGENTS.md` (implícito via CLAUDE.md)
- `CLAUDE.md`
- Memórias de sessões anteriores: `plano-p0-v2-2-encerrado.md`,
  `seguranca-env-e-settings-local.md`, `vps-producao-gulini-topologia.md`

## 6. Arquivos lidos

- `server/src/index.js` — verificar estado atual do JWT_SECRET/fallback
- `package.json` (raiz) — versões atuais de dependências do frontend
- `package-lock.json` (raiz) — versões instaladas, comparação antes/depois
- `docs/ia-auditorias/TEMPLATE-agent-report.md` — formato deste relatório
- Memórias citadas na seção 5

## 7. Arquivos alterados

- `package.json` — `"@angular/cli": "~14.1.3"` → `"~14.2.13"`
- `package-lock.json` — atualizado por `npm install` (398 linhas alteradas: `@angular/cli`,
  `@angular-devkit/*`, `@schematics/angular` 14.1.3 → 14.2.13; `pacote` 13.6.1 → 13.6.2; `semver`
  7.3.7 → 7.5.3; 12 pacotes removidos, 7 alterados)

## 8. Arquivos criados

- `docs/ia-auditorias/2026-07-30__recalibracao-t1-e-sync-main__claude.md` — este relatório

## 9. Arquivos preservados

- Todo o código de aplicação (`src/`, `server/`) — nenhuma alteração funcional nesta tarefa.
- `server/src/index.js` — confirmado já correto (fail-fast em produção, sem fallback hardcoded),
  não precisou de edição.

## 10. Arquivos removidos

- Nenhum.

## 11. Estado inicial observado

- **Fallback JWT:** a memória de sessão registrava `server/src/index.js:13` com
  `JWT_SECRET = process.env.JWT_SECRET || 'mokbeats-dev-secret-change-in-prod'` como risco latente.
  Achado real: esse trecho não existe mais — foi removido em `6821fd4` (2026-07-06), commit já
  ancestral de `dev`. `server/src/index.js:18-26` hoje faz `process.exit(1)` em produção se
  `JWT_SECRET` estiver ausente, e gera segredo efêmero apenas em desenvolvimento.
- **Dependabot:** reportava 141 alertas (2 críticas, 69 altas, 54 moderadas, 16 baixas) contra o
  repositório. Achado real: o repositório não tem `.github/dependabot.yml`; o Dependabot escaneia a
  branch padrão, que é `main`. `origin/main` estava **73 commits atrás** de `origin/dev`
  (`git rev-list --left-right --count origin/main...origin/dev` → `0  73`), ainda com o backend
  pré-P0 (`connect-multiparty`, `express@^4.18.2`, sem multer/bcrypt/jsonwebtoken).
  - As 2 críticas eram fantasmas: `protobufjs` (CVE-2026-41242) não existe na `dev` — saiu junto
    com o SDK Firebase no lote F1 (`1e00f16`); `websocket-driver` (CVE-2026-54466) está instalado
    em `0.7.5` na `dev`, exatamente a `first_patched_version` (range vulnerável é `< 0.7.5`).
  - Os 16 alertas contra `server/package-lock.json` também eram da `main`; `npm audit` em
    `server/` na `dev` retorna 0 vulnerabilidades (confirmado no lote R1b, sessão anterior).
  - Exposição real da `dev`: `npm audit` na raiz retornava 63 vulnerabilidades (1 crítica, 44
    altas, 15 moderadas, 3 baixas) antes desta tarefa. Separação por alcance: 44 são de toolchain
    de build/teste (não chegam ao browser, incluindo a única crítica, `tar@6.2.1`, devDependency);
    19 são de `@angular/*`/`@ng-bootstrap` e transitivos de runtime (chegam ao browser — XSS via
    SVG/MathML, XSRF token leakage, DoS por OOM em `formatDate`/`digitsInfo`, vazamento de cache em
    `HttpTransferCache`), e só resolvem com Angular ≥ 19.2.16 (migração major).

## 12. O que foi implementado ou analisado

- Auditoria completa do estado real do fallback JWT (código-fonte + histórico git).
- Auditoria completa dos alertas do Dependabot via `gh api .../dependabot/alerts`, com
  cruzamento contra `manifest_path`, severidade, e comparação `dev` vs `main`.
- Classificação dos 63 alertas reais da `dev` por escopo (runtime vs build/teste) e por
  corrigibilidade sem major.
- Abertura do PR #3 (`dev` → `main`) via `gh pr create`, com corpo detalhando o que entra e o
  efeito colateral esperado nos alertas do Dependabot.
- Upgrade de `@angular/cli` para `~14.2.13`, alinhando-o ao `@angular-devkit/build-angular` que já
  rodava nessa versão via range `^14.1.3`.
- Validação completa (install, audit, build, test) sob Node 16.20.2.
- **Correção de expectativa:** o upgrade do `@angular/cli` **não** resolveu os 9 alertas high
  esperados. `npm audit` antes/depois: 63 → 62 (líquido -1). Apenas `semver` saiu da lista;
  `uuid@8.3.2` (moderate, transitivo de `pacote`) entrou. Os 8 alertas high remanescentes
  (`@angular/cli`, `node-gyp`, `make-fetch-happen`, `pacote`, `npm-registry-fetch`,
  `npm-packlist`, `@npmcli/run-script`, `read-package-json`) têm `fixAvailable` apontando para
  `@angular/cli@22.1.1` — major, fora do escopo desta tarefa. A causa raiz: o range vulnerável do
  advisory contra `@angular/cli` (`6.2.9 - 20.3.17`) já cobria a versão 14.2.13 instalada; a
  comparação inicial (`npm view` das dependências diretas) não verificou isso antes de propor o
  ganho no plano.

## 13. Decisões técnicas tomadas

### Decisão 1: sincronizar `main` via PR, não merge direto

**Decisão:** abrir PR #3 (`dev` → `main`) e deixar o merge como ação do usuário.

**Justificativa:** `main` é a branch padrão do repositório e superfície pública (é o que o
Dependabot mede, e potencialmente o que terceiros veem primeiro). Ainda que o merge seja
fast-forward puro e sem risco técnico, escrever na branch padrão sem revisão intermediária do
usuário está fora do que a sessão foi autorizada a fazer sozinha.

**Alternativas consideradas:**
- Merge direto + push: mais rápido, descartado por escrever na branch padrão sem revisão.
- Não sincronizar: descartado porque mantém o Dependabot medindo um estado inexistente
  indefinidamente.

**Trade-offs:**
- Pró: reversível, com rastro (PR), sem ação irreversível de minha parte.
- Contra: os alertas fantasmas só desaparecem depois que o usuário mergear.

### Decisão 2: manter o upgrade do `@angular/cli` mesmo após a correção de expectativa

**Decisão:** aplicar e commitar o upgrade para `~14.2.13` mesmo constatando que o ganho de
segurança é de apenas 1 vulnerabilidade líquida, não 9.

**Justificativa:** a mudança continua sendo estritamente positiva e sem risco — alinha o CLI à
versão do devkit que já rodava (`^14.1.3` já havia resolvido para `14.2.13`), fica dentro do
Angular 14 (sem breaking change), e o build de produção e os 115 testes Karma passaram sem
alteração de resultado. Reverter não traria benefício.

**Alternativas consideradas:**
- Reverter e não commitar, já que o ganho é menor que o esperado: descartado — o custo de manter é
  zero e o ganho, embora pequeno, é real e verificado.

**Trade-offs:**
- Pró: convergência de versões, 1 vulnerabilidade a menos, zero risco.
- Contra: nenhum identificado.

### Decisão 3: não remover o fallback JWT (não há o que remover)

**Decisão:** nenhuma ação de código; apenas corrigir a memória.

**Justificativa:** o código já está no estado desejado desde 2026-07-06 (commit `6821fd4`). Agir
sobre uma pendência que não existe seria trabalho fora do escopo real.

**Alternativas consideradas:** nenhuma — não havia decisão técnica a tomar, apenas verificação.

**Trade-offs:** nenhum.

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| PR #3 não é mergeado e `main` continua desatualizada | Baixo | Dependabot segue reportando alertas fantasmas | Ação pendente do usuário; documentado no PR e neste relatório |
| Migração major do Angular segue sem data | Médio | 19 advisories de runtime (XSS, XSRF, DoS) permanecem expostos até a migração | Fora de escopo desta tarefa; requer plano e autorização próprios |
| `uuid@8.3.2` (novo alerta moderate) é transitivo de `pacote`, ferramenta de build | Baixo | Não chega ao browser/produção | Nenhuma ação necessária; resolve junto com a major do `@angular/cli` |

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Sim
- Rotas preservadas: Não aplicável
- Guards/autenticação preservados: Sim (nenhuma alteração; fallback JWT já estava correto)
- APIs/payloads preservados: Não aplicável
- Player/WaveSurfer preservado: Sim (não tocado; build de produção gerou os bundles normalmente)
- Upload/FormData preservado: Não aplicável
- Carrinho/licenças/checkout preservados: Não aplicável
- Dashboard/produtor preservado: Não aplicável
- Estilos/padrões preservados: Sim

Observações:

- Nenhum arquivo de aplicação (`src/`) foi tocado nesta tarefa — apenas `package.json` e
  `package-lock.json`.

## 16. Validações executadas

- [x] `git rev-list --left-right --count origin/main...origin/dev` — confirmou `0  73`
      (fast-forward puro) antes de abrir o PR
- [x] `gh pr create --base main --head dev` — PR #3 criado:
      https://github.com/wiliangulini/MokBeats/pull/3
- [x] `npm install` sob Node 16.20.2 — concluído sem erro de peer dependency (apenas avisos
      `EBADENGINE` pré-existentes de `joi`/`wait-on`, não relacionados a esta mudança)
- [x] `npm audit` — 63 → 62 vulnerabilidades (resultado real, corrigido em relação à expectativa
      do plano; ver seção 12 e Decisão 2)
- [x] `npm run build` (produção) — concluído sem erro, bundles gerados normalmente
      (`main` 271.16 kB, `styles` 24.95 kB, etc.)
- [x] `npx ng test --watch=false --browsers=ChromeHeadless` — 115 de 115 testes com sucesso
- [x] `git diff --stat package.json package-lock.json` + `git status --short` — confirmado que
      só esses dois arquivos foram alterados por esta tarefa

## 17. Validações não executadas

- `gh api .../dependabot/alerts` pós-merge do PR #3 — não executável ainda porque o merge é ação
  pendente do usuário. Fica como validação recomendada (seção 18).
- `npm run test:focus` / suíte Cypress (`npm run e2e`) — não executados; o escopo desta tarefa foi
  limitado à suíte Karma (unit/component), que é a validação padrão de build/dependência. Cypress
  cobre fluxos e2e mais amplos, não afetados por esta mudança pontual de devDependency.

## 18. Validações recomendadas

- [ ] Após o merge do PR #3, reconsultar `gh api repos/wiliangulini/MokBeats/dependabot/alerts` e
      confirmar que as 2 críticas e os 16 alertas de `server/package-lock.json` desapareceram.
- [ ] Ao planejar a migração major do Angular, reavaliar o `npm audit` a partir do estado
      pós-merge (main sincronizada), não a partir dos números desta sessão.

## 19. Pendências

- **Merge do PR #3** (`dev` → `main`) — ação do usuário.
- **Migração major Angular 14 → 20 LTS** — única forma de resolver os 19 advisories de runtime
  (XSS, XSRF, DoS) e os 8 alertas high remanescentes de toolchain (`@angular/cli`, `node-gyp`,
  `make-fetch-happen`, `pacote`, etc., todos com `fixAvailable` em `@angular/cli@22.1.1`). Requer
  plano e autorização próprios, dado o tamanho da mudança (79 arquivos `.ts` de aplicação, 54
  specs, acoplamento com Bootstrap 4/`@ng-bootstrap` 13, WaveSurfer, Karma → runner moderno,
  TypeScript 4.7 → 5.x). Superfície já levantada nesta sessão (ver plano aprovado) para acelerar o
  dimensionamento futuro.

## 20. Próximo passo recomendado

Aguardar o usuário mergear o PR #3. Depois disso, se o usuário quiser avançar com a T1, a próxima
sessão deve abrir com Plan Mode dedicado à migração major do Angular — não é uma continuação
incremental como este lote foi.

## 21. Instruções para o próximo agente

Para continuar esta tarefa ou retomar a T1:

1. Leia este relatório.
2. Confirme se o PR #3 já foi mergeado (`gh pr view 3 --repo wiliangulini/MokBeats`); se sim, rode
   a validação pendente da seção 18 antes de qualquer outra coisa.
3. Leia `PROJECT_RULES.md` e `CLAUDE.md`.
4. Leia as memórias `plano-p0-v2-2-encerrado.md` (será atualizada por esta tarefa) e
   `seguranca-env-e-settings-local.md` (idem).
5. Se for iniciar a migração major do Angular, trate como plano novo — não assuma que os números
   de vulnerabilidade desta sessão (62/63) ainda são válidos; rode `npm audit` de novo primeiro.
6. Continue apenas dentro do escopo documentado.

## 22. Observações finais

Esta tarefa começou como uma pergunta de priorização ("T1 ou fallback JWT primeiro?") e se revelou,
na investigação, uma correção de diagnóstico: nenhuma das duas pendências registradas em memória
estava no estado que a memória descrevia. O maior valor entregue não foi código — foi a
recalibração da medição (Dependabot medindo a branch errada) e a economia de uma migração major
sendo tratada com urgência de "2 críticas" que não existiam na branch de trabalho real.

---

**Commits desta tarefa:**
- `fix(security): atualiza @angular/cli para 14.2.13, alinhando ao devkit já instalado`
- `docs: corrige memoria do fallback JWT e recalibra diagnostico da T1`
