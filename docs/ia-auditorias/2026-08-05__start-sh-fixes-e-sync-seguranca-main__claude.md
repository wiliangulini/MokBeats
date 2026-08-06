# Relatório de Tarefa — Correções em `start.sh`/backend e sincronização de segurança `dev` → `main`

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-08-05
**Branch atual:** `dev` (conteúdo idêntico a `main` ao final do dia)
**Tipo de tarefa:** Auditoria + Implementação + Sincronização de branch / segurança de dependências
**Status final:** Aprovado

## 2. Objetivo

Sessão com dois blocos de trabalho encadeados:

1. Auditar `start.sh` (`/verificar-scripts-shell start.sh`) e, mediante plano aprovado, corrigir os
   achados confirmados.
2. A partir de uma pergunta sobre alertas do Dependabot, investigar e corrigir a defasagem entre
   `main` e `dev`, sincronizar as duas branches e reduzir a exposição real de vulnerabilidades de
   dependências na raiz do projeto.

## 3. Escopo solicitado

- Auditoria somente leitura de `start.sh` via command dedicado.
- Planejamento e implementação das correções autorizadas (A-1, A-2, R-1, R-2/H-1).
- Commit das correções em três commits pequenos, conforme plano.
- Verificação se os números do Dependabot mudaram desde a última auditoria (2026-07-30).
- Abertura de PR `dev` → `main` para sincronizar a migração Angular já concluída em `dev`.
- Validação pós-merge: build de produção e suíte Vitest do frontend.
- `npm audit fix` (sem `--force`) na raiz, commit e novo PR `dev` → `main`.
- Avaliação custo/benefício dos 3 alertas moderate remanescentes.
- Limpeza de arquivos de teste no scratchpad.
- Este relatório de continuidade.

## 4. Escopo não incluído

- Correção dos 3 alertas moderate remanescentes (`@hono/node-server`, `qs`, `uuid`) — decisão
  explícita do usuário de aceitar o risco, não implementar.
- `npm audit fix --force` (traria breaking change em `@angular/cli`, não solicitado).
- Qualquer alteração em `deploy-to-vps.sh` ou deploy real em VPS.
- Qualquer alteração em `show_help()` do próprio `start.sh` (só a documentação externa,
  `docs/SCRIPTS_SHELL.md`, foi atualizada).
- Migração de `cypress` para major mais recente.

## 5. Fontes de verdade consultadas

- `PROJECT_RULES.md` — regras centrais do MokBeats
- `AGENTS.md` — regras comuns para agentes
- `CLAUDE.md` — regras do Claude Code
- `.claude/commands/verificar-scripts-shell.md` — contrato do command de auditoria

## 6. Arquivos lidos

- `start.sh` — objeto da auditoria e das correções
- `server/src/index.js` — bootstrap do backend, achado A-1
- `server/scripts/generate-peaks.js` — padrão de referência para o `dotenv.config({ path })`
- `server/scripts/check-node.js` — contrato de runtime do backend
- `server/test/helpers/test-server.js` — confirmação de que a suíte de testes não é afetada pela
  mudança no `dotenv`
- `deploy-to-vps.sh` — confirmação de que produção já não dependia do bug do A-1
- `docs/SCRIPTS_SHELL.md` — documentação a atualizar
- `.nvmrc`, `server/.nvmrc`, `package.json`, `server/package.json` — contrato de runtime/scripts
- `docs/ia-auditorias/TEMPLATE-agent-report.md` — formato deste relatório

## 7. Arquivos alterados

- `server/src/index.js` — `dotenv.config()` passa a receber `path` explícito via `__dirname`
  (commit `0b1a5b0`)
- `start.sh` — `set -m`, `kill_tree()`, `cleanup()`/traps `EXIT INT TERM HUP`, `free_port()` com
  confirmação, `wait -n -p` propagando exit code (commit `8c97d85`)
- `docs/SCRIPTS_SHELL.md` — documenta `--help`, overrides de Node, `MOKBEATS_FORCE_FREE_PORT` e o
  novo comportamento de exit code (commit `80a3918`)
- `package-lock.json` — resultado de `npm audit fix` (sem `--force`) na raiz (commit `1535948`)

## 8. Arquivos criados

- Este relatório: `docs/ia-auditorias/2026-08-05__start-sh-fixes-e-sync-seguranca-main__claude.md`

## 9. Arquivos preservados

- `.vscode/settings.json` (modificado) e
  `docs/Plano P0 v2.2 — remediação de vulnerabilidades do MokBeats.md` (não versionado) — já
  estavam no worktree antes desta sessão; não foram tocados nem incluídos em nenhum commit.
- `package.json` da raiz — `npm audit fix` não alterou nenhuma versão declarada, só resolução
  dentro dos ranges já existentes em `package-lock.json`.

## 10. Arquivos removidos

- Nenhum arquivo do repositório. Cinco arquivos temporários de teste no scratchpad (fora do
  repositório) foram removidos a pedido do usuário: `dependabot_alerts.jsonl`, `listener.pid`,
  `start_sh_test.log`, `start_sh_test2.log`, `test_free_port.sh`.

## 11. Estado inicial observado

`start.sh` iniciava o backend com `cwd` na raiz do repositório; `server/src/index.js` carregava
`dotenv` sem `path`, resolvendo contra `process.cwd()` — `server/.env` nunca era lido nesse fluxo,
gerando `JWT_SECRET` efêmero a cada `./start.sh`. `wait` sem argumento sempre retornava `0`.
`free_port()` matava qualquer processo nas portas 3100/4200 sem confirmação. O trap só cobria
`SIGINT`/`SIGTERM`, deixando o `ng serve` (neto de `npm run start`) potencialmente órfão.

Separadamente, `main` estava 37 commits atrás de `dev`, sem a migração major do Angular 14→22 já
concluída em `dev` (PR #4). O Dependabot, que só escaneia a branch padrão, reportava números
inflados e desatualizados por causa dessa defasagem — o mesmo padrão já documentado na recalibração
de 2026-07-30.

## 12. O que foi implementado ou analisado

- Auditoria completa de `start.sh` com evidência reprodutível para cada achado.
- Plano aprovado e implementado para A-1, A-2, R-1, R-2/H-1 (detalhe em §13).
- Dois bugs adicionais sob `set -e`, encontrados e corrigidos durante a implementação (TOCTOU no
  `free_port`, EOF no `read` de confirmação).
- Validação manual de ponta a ponta com o script real em execução (não só leitura de código).
- Diagnóstico da defasagem `main`/`dev` e do número real de vulnerabilidades via `npm audit` direto
  na `dev`, contrastado com o Dependabot.
- PR #5 (`dev` → `main`): sincroniza a migração Angular + as correções de `start.sh`. Mesclado pelo
  usuário (`94bcec4`).
- Build de produção e suíte Vitest do frontend validados na `main` pós-merge do PR #5.
- `npm audit fix` (sem `--force`) na raiz, com revalidação de build/testes.
- PR #6 (`dev` → `main`): sincroniza o `npm audit fix`. Mesclado pelo usuário (`8ba9aa9`).
- Avaliação custo/benefício dos 3 alertas moderate remanescentes, com decisão do usuário de aceitar
  o risco.

## 13. Decisões técnicas tomadas

### Decisão 1: caminho explícito do `dotenv` via `__dirname`, não mudança de `cwd` no `start.sh`

**Decisão:**
Corrigir o A-1 em `server/src/index.js` (`dotenv.config({ path: join(__dirname, '../.env') })`),
não em `start.sh`.

**Justificativa:**
Corrige os dois pontos de entrada do backend (`start.sh` local e PM2 em produção) de uma vez só, e
remove a dependência de `cwd` na origem, em vez de só mascará-la em um dos dois lugares. Mesmo
padrão já usado em `server/scripts/generate-peaks.js:4`. Confirmado por leitura de
`deploy-to-vps.sh:525,556` que produção já fazia `cd server` antes do `pm2 start`, então a correção
não muda o comportamento em produção, só remove uma coincidência frágil.

**Alternativas consideradas:**
- Rodar o backend a partir de `server/` dentro do `start.sh` (menor superfície, mas mantém a
  fragilidade de depender do diretório de execução).

**Trade-offs:**
- Prós: remove a causa raiz, cobre local e produção, sem side effect em teste (`test-server.js`
  seta `NODE_ENV=test` antes do `require`, que já pula o bloco do `dotenv`).
- Contras: nenhum identificado.

### Decisão 2: `set -m` + `kill_tree()` por process group, não apenas `kill` no PID direto

**Decisão:**
Habilitar job control (`set -m`) e encerrar cada servidor pelo process group inteiro
(`kill -- -PID`, com fallback `pkill -P` → `kill` direto), em vez de só `kill "$PID"`.

**Justificativa:**
`ng serve` é neto do processo `npm run start` (via `sh -c`), não filho direto; `kill` no PID de
`FRONTEND_PID` não alcançava o `ng serve`. Confirmado experimentalmente: com o fix, `ps` mostrou
`npm run start` (PGID próprio) e o `ng serve` real na mesma PGID, ambos encerrados por
`kill -- -PID`.

**Alternativas consideradas:**
- Rastrear PIDs de netos manualmente (mais frágil, quebra se a árvore de processos mudar).

**Trade-offs:**
- Prós: encerramento robusto e correto, validado com o script real.
- Contras: `set -m` muda a entrega de sinais no terminal (Ctrl+C deixa de propagar automaticamente
  ao process group dos filhos, passa a depender só do trap) — mitigado com traps em
  `EXIT INT TERM HUP` e validado manualmente via `kill -INT` no PID do script.

### Decisão 3: `free_port()` pede confirmação por padrão, com escape hatch não interativo

**Decisão:**
Antes de matar processo em porta ocupada, listar o(s) processo(s) e exigir confirmação
interativa ou `MOKBEATS_FORCE_FREE_PORT=1`; sem TTY e sem a variável, abortar com instrução.

**Justificativa:**
O comportamento anterior matava qualquer processo de terceiro em silêncio — risco real em máquina
compartilhada. Não há CI versionado no repositório dependente do comportamento automático anterior.

**Alternativas consideradas:**
- Só listar e nunca matar automaticamente (removeria a conveniência original sem necessidade).

**Trade-offs:**
- Prós: elimina o risco de matar processo alheio sem aviso.
- Contras: uso não interativo sem a variável de override passa a falhar em vez de liberar a porta
  — comportamento intencional, documentado.

### Decisão 4: `npm audit fix` sem `--force`; não corrigir os 3 alertas remanescentes

**Decisão:**
Aplicar só a resolução dentro dos ranges já declarados em `package.json`; não aplicar `--force` nem
propor migração major de `@angular/cli` ou `cypress` para eliminar os 3 alertas moderate restantes.

**Justificativa:**
Os três (`@hono/node-server`, `qs`, `uuid`) só existem em devDependencies — `@angular/cli` (via
`@modelcontextprotocol/sdk`, tooling interno nunca invocado no build/serve real) e `cypress`
(usado só em `npm run e2e`). Nenhum alcança `dist/browser/` nem `server/`. Corrigir o
`@hono/node-server` exigiria reverter `@angular/cli` para `21.0.4` (`isSemVerMajor: true`),
desfazendo parte da migração major recém-mesclada, para um path traversal que só afeta Windows
(ambiente de dev é Linux). Corrigir `qs`/`uuid` exigiria migração major do Cypress sem garantia de
resolver — confirmado que `cypress@15.20.0` (última major) ainda declara
`@cypress/request: ^4.0.0`.

**Alternativas consideradas:**
- `npm audit fix --force` (rejeitada: reverteria o `@angular/cli`).
- Migrar `cypress` para major mais recente (rejeitada: fora de escopo, sem garantia de resolver,
  exigiria plano e testes próprios).

**Trade-offs:**
- Prós: nenhuma reversão de trabalho recém-concluído, nenhum escopo não solicitado.
- Contras: 3 alertas moderate permanecem abertos no Dependabot indefinidamente, até decisão
  explícita em contrário.

**Decisão do usuário:** confirmada explicitamente — "deixa como está". Registrada em memória de
longo prazo (`[[plano-p0-v2.2-encerrado]]`) para não ser reproposta sem necessidade.

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| `set -m` altera entrega de sinais no terminal | Baixo | Ctrl+C deixa de propagar automaticamente ao process group dos filhos | Traps em `EXIT INT TERM HUP` cobrindo todos os caminhos de saída; validado manualmente |
| `free_port()` pode bloquear em uso não interativo sem `MOKBEATS_FORCE_FREE_PORT` | Baixo | Script aborta em vez de liberar porta automaticamente | Comportamento intencional (R-1); documentado em `docs/SCRIPTS_SHELL.md` |
| 3 alertas moderate remanescentes no Dependabot (`@hono/node-server`, `qs`, `uuid`) | Baixo | Nenhum alcança produção (`dist/browser/`, `server/`) | Risco aceito explicitamente pelo usuário; revisitar se severidade subir ou Cypress for mexido |
| `main` pode voltar a divergir de `dev` em migrações futuras | Baixo/Médio | Números do Dependabot voltam a ficar desatualizados | Registrado em memória: sempre checar `git rev-list --left-right --count origin/main...origin/dev` antes de citar número do Dependabot |

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Não aplicável (migração para Angular 22 já estava concluída em `dev`
  antes desta sessão; esta sessão só sincronizou `main`, não alterou a migração)
- Rotas preservadas: Sim
- Guards/autenticação preservados: Sim — `AuthGuard`/`ProdutorGuard` não tocados; correção do A-1
  só afeta *como* `JWT_SECRET` é carregado, não a lógica de autenticação
- APIs/payloads preservados: Sim
- Player/WaveSurfer preservado: Sim — não tocado
- Upload/FormData preservado: Sim — não tocado
- Carrinho/licenças/checkout preservados: Sim — não tocado
- Dashboard/produtor preservado: Sim — não tocado
- Estilos/padrões preservados: Sim — não tocado

Observações:

- Sessão não tocou em código de aplicação Angular (`src/app/**`), só scripts shell, bootstrap do
  backend e dependências de build/teste.

## 16. Validações executadas

- [x] `bash -n start.sh` — sem erro de sintaxe, antes e depois de cada bloco de edição
- [x] `node --check server/src/index.js` — OK
- [x] `cd server && npm test` — 114/114 testes passando, após todas as edições de `start.sh` e
      `server/src/index.js`
- [x] Teste manual: `./start.sh` real em execução, aviso `⚠️ JWT_SECRET ausente` ausente no log —
      confirma A-1
- [x] Teste manual: `kill -INT` no PID do `start.sh` — `Desligando servidores.../Servidores
      parados.`, zero processos remanescentes (`ps`), portas 3100/4200 livres — confirma R-2/H-1
- [x] Teste manual: `kill -KILL` no PID do backend com frontend ainda ativo — script reportou
      `ERRO: backend (PID ...) encerrou com status 137.` e encerrou tudo — confirma A-2
- [x] Teste manual: `free_port()` isolado (cópia sintética fora do repo) contra porta real —
      caminho não interativo lista e sai 1 sem matar; `MOKBEATS_FORCE_FREE_PORT=1` lista e libera
      — confirma R-1
- [x] `git status`/`git diff --stat` — confirma escopo preservado em cada commit
- [x] `gh pr view --json mergeable,mergeStateStatus` — `MERGEABLE`/`CLEAN` para PR #5 e PR #6 antes
      do merge
- [x] `npm run build` (Node 24.18.1 via nvm) pós-merge do PR #5 — bundle 2,49 MB raw / 423,13 kB
      estimado, sem erro
- [x] `npm test` (Vitest, Node 24.18.1) pós-merge do PR #5 — 54/54 arquivos, 115/115 testes
- [x] `npm audit` (raiz e `server/`) antes e depois do `npm audit fix` — 9→7 na raiz (0 high após o
      fix), 0 em `server/` nos dois momentos
- [x] `npm run build` e `npm test` revalidados após `npm audit fix`, sem regressão (mesmo tamanho
      de bundle, mesma contagem de testes)
- [x] `gh api repos/.../dependabot/alerts` — 57→4 pós-merge PR #5, 4→3 pós-merge PR #6

## 17. Validações não executadas

- ShellCheck — indisponível no ambiente (`command -v shellcheck` não encontrado); não instalado
  por proibição do command de auditoria original.
- Testes E2E via Cypress (`npm run e2e`) — não fazem parte do fluxo de validação padrão desta
  sessão; não executados nem afetados pelas mudanças.
- Deploy real em VPS — fora de escopo; análise de compatibilidade com `deploy-to-vps.sh` foi só
  estática (leitura de código), não testada em produção.

## 18. Validações recomendadas

- [ ] Se o Dependabot subir a severidade de `@hono/node-server`, `qs` ou `uuid`, reavaliar a
      decisão registrada em memória.
- [ ] Próxima vez que `cypress` for atualizado por outro motivo, checar de bônus se a versão nova
      resolve `qs`/`uuid` (não investigado a fundo nesta sessão além do CLI `cypress@15.20.0`).
- [ ] Antes de um próximo deploy real, validar em ambiente de fato que `server/.env` é lido
      corretamente pelo PM2 com o binário `--interpreter` fixado (a análise desta sessão foi só
      estática, via leitura de `deploy-to-vps.sh`).

## 19. Pendências

- Nenhuma pendência bloqueante. Os 3 alertas moderate remanescentes são risco aceito, não
  pendência técnica.

## 20. Próximo passo recomendado

Nenhum próximo passo imediato necessário — ambos os PRs foram mesclados, `main` e `dev` estão
sincronizadas e validadas. Se uma nova sessão for aberta para continuar trabalho de segurança de
dependências, começar lendo `[[plano-p0-v2.2-encerrado]]` (memória) para não reabrir decisões já
tomadas.

## 21. Instruções para o próximo agente

Para continuar esta tarefa:

1. Leia este relatório.
2. Leia `PROJECT_RULES.md`, `AGENTS.md` e `CLAUDE.md`.
3. Verifique `git status` e `git log --oneline -6` (branch `dev`).
4. Antes de citar qualquer número do Dependabot, rode
   `git rev-list --left-right --count origin/main...origin/dev` — se não for `0  0`, o número
   pode estar medindo uma `main` desatualizada.
5. Não reabra a decisão sobre os 3 alertas moderate remanescentes sem um motivo novo (severidade
   subir, Cypress ser mexido por outro motivo, ou pedido explícito do usuário).

## 22. Observações finais

Esta sessão teve dois fios narrativos: a correção pontual de um script de desenvolvimento local
(`start.sh`) e um trabalho mais amplo de sincronização de segurança de dependências entre `main` e
`dev`, que emergiu de uma pergunta lateral durante o primeiro. Todas as ações em `git push`,
merges de PR e reconfirmações de estado real (`npm audit`, `Dependabot`) foram feitas com
autorização explícita do usuário em cada etapa, incluindo um caso em que um `git push` direto foi
negado pela política de permissões e o usuário optou por executá-lo manualmente.

Um erro operacional (não de código) ocorreu e foi autodetectado: o `cwd` do shell persistente ficou
dentro de `server/` após um `cd` de um comando anterior, fazendo um `npm audit fix` rodar no lugar
errado antes de ser corrigido e re-executado corretamente na raiz. Não teve efeito colateral
(`server/` já estava em 0 vulnerabilidades), mas fica registrado como lição operacional: confirmar
`pwd` antes de comandos sensíveis ao diretório após qualquer `cd` em turno anterior.
