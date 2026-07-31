# Relatório de Tarefa — Migração Angular 14→22, Etapa 13 (Reflexo em build, scripts e limpeza)

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-31
**Branch atual:** `feature/angular-22-migration`
**Tipo de tarefa:** Implementação (última etapa do plano de migração)
**Status final:** Aprovado

## 2. Objetivo

Executar a Etapa 13, última do plano de migração Angular 14→22: fechar a lacuna entre o que a
Etapa 12 mudou dentro do build (builder `application`/esbuild, output em `dist/browser/`) e o que
ainda descrevia/consumia esse build fora dele — script de deploy, script de desenvolvimento Windows
e documentação. Item obrigatório: achado 0021 (severidade Alta), a mudança de raiz de output que
quebraria silenciosamente o próximo deploy real.

## 3. Escopo solicitado

Confirmação prévia de que a Etapa 12 estava `Aprovado` (verificado contra o repositório, não só o
relatório — ver §11). Em seguida, duas decisões colhidas do usuário via `AskUserQuestion`:

1. Achado 0021 → **ajustar o deploy** (`dist/browser/` como raiz publicável), não reverter o output.
2. Escopo da limpeza → **completo**: incluir `start.ps1` e o guia não técnico (defeitos vivos fora
   da letra original do plano, mas do mesmo gênero do achado A13) e as 4 declarações de stack
   desatualizadas.

## 4. Escopo não incluído

- Qualquer deploy real — a publicação é decisão e sessão do próprio usuário.
- Alteração em `server/`, `src/app/**`, templates ou `.scss`.
- `angular.json` (a opção de reverter o output via `outputPath.browser: ""` foi descartada).
- Achados 0002-0007 (seguem `Aberto`, não pertencem a esta etapa).

## 5. Fontes de verdade consultadas

- `PROJECT_RULES.md`, `AGENTS.md`, `CLAUDE.md`.
- `docs/ia-auditorias/2026-07-30__plano-migracao-angular-14-para-22-v2__claude.md` (Etapa 13, linhas
  481-498) e `docs/adr/0002-migracao-angular-14-para-22.md`.
- `docs/ia-auditorias/2026-07-31__migracao-angular-etapa-12__claude.md` — ponto de partida.
- `docs/migracao-angular-achados/0021-dist-output-muda-para-dist-browser.md` e `README.md` do índice
  de achados.

## 6. Arquivos lidos

- `deploy-to-vps.sh`, `build-and-upload.sh`, `start.sh`, `start.ps1`, `start.bat` — inventário e
  pontos de acoplamento a `dist/`/Node local.
- `angular.json` — confirmação de que o CSS duplicado do Bootstrap já saiu (Etapa 3) e que jQuery/
  ordem de `scripts` seguem intactos.
- `docs/GUIA_MOKBEATS_NAO_TECNICO.md`, `docs/SCRIPTS_SHELL.md` — pontos com Node 16.20.2/Angular 14.
- `AGENTS.md`, `README-IA.md`, `docs/resources/stack-tecnica.md`, `docs/areas/arquitetura-angular.md`
  — declarações de stack.
- `git show mig/e0:angular.json`, `git show mig/e0:start.sh` — para confirmar (não assumir) que os
  itens de CSS duplicado e vocabulário "ponte EOL" já haviam sido resolvidos em etapas anteriores.
- `dist/` (estrutura real pós-build) — confirmação empírica do achado 0021 antes de codar a correção.

## 7. Arquivos alterados

- `deploy-to-vps.sh` — `build_frontend()`/`upload_frontend()` passam a checar/publicar
  `dist/browser/` (achado 0021); nova função `resolve_local_node_bin()` (reusa o padrão de
  `start.sh:80-109`, com fallback ao Node do `PATH` quando a major bate e respeitando
  `--allow-runtime-mismatch`) resolve o Node local do build a partir do `.nvmrc` da raiz (achado
  A13); textos de ajuda atualizados (`dist/` → `dist/browser/`, `--allow-runtime-mismatch` cobrindo
  Node local e remoto); comentário na fronteira `build_frontend()` registrando que o Node da VPS é
  irrelevante para o frontend.
- `build-and-upload.sh` — texto de ajuda `--no-build` atualizado para `dist/browser/`.
- `start.ps1` — `$FRONTEND_NODE_VERSION`/`$BACKEND_NODE_VERSION` deixam de ser hardcoded (`16.20.2`/
  `24.18.1`) e passam a ser lidos de `.nvmrc`/`server/.nvmrc`; comentário do cabeçalho atualizado.
  `Ensure-PortableNode` não precisou de mudança — já compara major e reusa Node do sistema.
- `docs/GUIA_MOKBEATS_NAO_TECNICO.md` — 3 blocos reescritos (linhas ~44, ~54-60, ~69-81): um único
  Node (24.18.1) para frontend e backend; removido "bridge EOL do Angular 14" e "Angular CLI 14".
- `docs/SCRIPTS_SHELL.md` — inventário de `deploy-to-vps.sh` ganhou 2 bullets (raiz publicável e
  resolução de Node local); as 2 entradas de `node_modules/karma/*` removidas (pacote não existe
  mais desde a Etapa 12); data do inventário atualizada.
- `AGENTS.md`, `README-IA.md`, `docs/resources/stack-tecnica.md`, `docs/areas/arquitetura-angular.md`
  — as 4 declarações "Angular 14.3.0 — em migração para 22.1.0" passam a "Angular 22.1.0 — migrado a
  partir do 14.3.0", mantendo a referência ao ADR 0002 como histórico da decisão.
- `docs/migracao-angular-achados/0021-dist-output-muda-para-dist-browser.md` — `Status: Resolvido
  (mig/e13)`; seção "Resolução" documentando a opção adotada e o efeito colateral aceito
  (`3rdpartylicenses.txt`/`prerendered-routes.json` deixam de ser publicados).
- `docs/migracao-angular-achados/README.md` — linha do índice do achado 0021 atualizada.

## 8. Arquivos criados

- Este relatório.

## 9. Arquivos preservados

- `server/` (código) — intocado, `git diff --stat -- server/` vazio.
- `src/app/**`, templates `.html`, estilos `.scss` — intocados, `git diff --stat -- src/app/` vazio.
- `angular.json` — intocado (opção 1 do achado 0021, não a opção 2).
- `.claude/rules/angular.md` — não alterada; a proibição de migrar versão fora de plano aprovado
  segue correta e desejável depois desta migração.
- `start.sh` — verificado, já sem vocabulário de "ponte EOL" desde a Etapa 2; nenhuma mudança
  necessária.
- `setup-vps.sh`, `quick-fix-vps.sh` — verificado que não referenciam `dist/` nem o Node do frontend;
  fora de escopo, confirmado, não alterados.
- `cypress/screenshots/baseline-visual.cy.ts/*.png` — o `npm run e2e` de validação recapturou as 6
  imagens como efeito colateral padrão do Cypress; revertidas via `git checkout` por não haver
  nenhuma mudança visual pretendida nesta etapa (etapa é só build/scripts/docs).
- `server/data/users.json` — sujo pela execução real do e2e; revertido via `git checkout` ao final.

## 10. Arquivos removidos

Nenhum.

## 11. Estado inicial observado

- Etapa 12 confirmada `Aprovado` **contra o repositório**, não só contra o relatório:
  `git tag -l 'mig/*'` continha `mig/e0`–`mig/e3`, `mig/d1`–`mig/d8`, `mig/e12`; `git status --short`
  limpo (só os 2 arquivos alheios pré-existentes); `angular.json` já com builder
  `@angular/build:application` e alvos `test`/`test-focus` em `@angular/build:unit-test`/`vitest`;
  `package.json` com `@angular/core ^22.1.0`, `typescript ~6.0.3`, `vitest ^4.0.8`, zero `karma-*`.
- `ls dist/` confirmou empiricamente o achado 0021: `3rdpartylicenses.txt`, `browser/`,
  `prerendered-routes.json` — a aplicação real estava em `dist/browser/`, não em `dist/`.
- `.nvmrc` (raiz) e `server/.nvmrc` já em `24.18.1` (unificados desde a Etapa 2).
- Shell da sessão em Node v22.18.0 — cada comando de validação precisou resolver Node 24.18.1
  explicitamente via nvm.

## 12. O que foi implementado e decisões técnicas tomadas

### Decisão 1: achado 0021 — ajustar o deploy, não reverter o output

**Decisão:** `deploy-to-vps.sh` passa a publicar `dist/browser/`; `angular.json` fica intocado.

**Justificativa:** alinhado com a estrutura oficial do builder `application`, que o próprio Angular
está migrando o ecossistema para; evita "lutar" contra a estrutura padrão em futuras atualizações do
CLI. Decisão do usuário, apresentada com as duas opções do próprio achado.

**Trade-off aceito:** `dist/3rdpartylicenses.txt` e `dist/prerendered-routes.json` (fora de
`dist/browser/`) deixam de ser publicados. O primeiro é atribuição de licenças de terceiros, não
código funcional — hoje ia para a raiz do site; passa a não ir. Registrado no próprio achado 0021,
não escondido.

### Decisão 2: achado A13 — resolução do Node local no deploy, reusando `start.sh`

**Decisão:** nova função `resolve_local_node_bin()` em `deploy-to-vps.sh`, chamada por
`build_frontend()` antes do `npm run build`.

**Justificativa:** `build_frontend()` chamava `npm run build` com o `npm` do `PATH` do operador, sem
checar a major — o mesmo tipo de footgun silencioso que o achado A13 já descrevia. Resolvido
reusando o padrão de `resolve_node_bin()` de `start.sh:80-109` em vez de inventar um novo, com dois
ajustes justificados pelo contexto de um script de deploy (que roda em máquinas variadas, não só a
de desenvolvimento):
- fallback ao Node do `PATH` quando a major já bate com `.nvmrc` (evita exigir nvm em toda máquina
  de deploy);
- respeita `--allow-runtime-mismatch`, flag que já existia no script com exatamente essa semântica
  para o Node remoto — estender seu alcance ao Node local é reuso do padrão vigente, não uma opção
  nova.

**Alternativa considerada:** exigir nvm sempre, sem fallback ao `PATH` (mais próximo do
`resolve_node_bin()` original). Descartada por ser mais rígida do que o restante do script permite
(a checagem remota já tem fallback e flag de escape).

### Decisão 3: escopo da limpeza — completo (`start.ps1` + guia + declarações de stack)

**Decisão:** confirmada pelo usuário via `AskUserQuestion`. `start.ps1` tinha
`$FRONTEND_NODE_VERSION = '16.20.2'` hardcoded — um Node que **não constrói** Angular 22
(`@angular/cli@22` exige `^22.22.3 || ^24.15.0 || >=26`), quebrando o fluxo Windows desde a Etapa 2.
O guia não técnico instruía o mesmo Node 16 para o frontend. Ambos corrigidos; as 4 declarações de
stack ("Angular 14.3.0 — em migração") atualizadas para "Angular 22.1.0 — migrado a partir do
14.3.0", preservando a referência ao ADR 0002 como histórico.

**Trade-off:** ampliou o escopo além da letra original da Etapa 13, mas dentro do que o usuário
autorizou explicitamente antes da execução — não uma decisão unilateral.

### Decisão 4: screenshots recapturados pelo e2e de validação — revertidos

Rodar `npm run e2e` para validar recapturou as 6 imagens de `baseline-visual.cy.ts` (comportamento
padrão do `cy.screenshot()`, que sobrescreve o arquivo a cada execução). Como esta etapa não muda
nada visual, as imagens foram revertidas via `git checkout` para manter o diff estritamente escopado
a build/scripts/docs — mesma disciplina já usada para `server/data/users.json`.

## 13. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| `resolve_local_node_bin()` nunca foi exercitada em ambiente sem nvm nem Node 24 no `PATH` (caminho de erro) | Baixa | Mensagem de erro poderia estar imprecisa em cenário não testado | Caminho feliz (nvm com Node 24.18.1) validado via `npm run build` real; caminho de erro é leitura de código, não execução |
| `--dry-run`/SSH real do `deploy-to-vps.sh` não pôde ser executado nesta sessão (`ssh`/`*deploy*` negados em `.claude/settings.json`) | Média | A mudança de `dist/` → `dist/browser/` só será validada de ponta a ponta no próximo deploy real | Sintaxe verificada via `bash -n` (cópia no scratchpad); pedido explícito ao usuário no §17 |
| `3rdpartylicenses.txt` deixa de ser publicado no site | Baixa | Nenhum funcional; é atribuição de licenças, não código | Decisão explícita do usuário, documentada no achado 0021 |
| `start.ps1` não pôde ser executado neste ambiente (Linux, sem PowerShell) | Baixa | Mudança (`Get-Content .nvmrc`) é sintaticamente simples e usa cmdlet padrão, mas não foi exercitada | Revisão estática apenas; declarado como validação não executada |

## 14. Compatibilidade com legado MokBeats

- Angular 22.1.0 preservado (não regrediu): Sim
- Rotas preservadas: Sim — `git diff` de `app-routing.module.ts`/`upload-file-routing.module.ts` vazio
- Guards/autenticação preservados: Sim — `git diff --stat -- src/app/` vazio
- APIs/payloads preservados: Sim — `git diff --stat -- server/` vazio
- Player/WaveSurfer preservado: Sim — `player.cy.ts` (2/2) passou sem alteração de código
- Upload/FormData preservado: Sim — `upload.cy.ts` confirma nomes de campo idênticos
- Carrinho/licenças/checkout preservados: Sim — `checkout.cy.ts`/`licenca-carrinho.cy.ts` passaram
- Estilos/padrões preservados: Sim — nenhum `.scss`/template tocado; screenshots revertidos ao estado
  anterior (nenhuma regressão introduzida ou mascarada)

Observações:

- Esta etapa não tocou `src/app/**`, então a compatibilidade funcional já vinha garantida pela
  Etapa 12; o que se valida aqui é que build/deploy/docs não regrediram nada.

## 15. Fechamento dos critérios de aceite do plano (§8, ADR 0002)

| # | Critério | Resultado |
|---|---|---|
| 1 | `npm run build` conclui sem erro sob Node 24.18.1 | ✅ `dist/browser/index.html` gerado |
| 2 | 115 testes passando (Vitest) | ✅ 115/115 |
| 3 | `npm run e2e` verde com os 5 specs | ✅ 5 specs / 8 testes |
| 4 | `npm audit` = 0 ou justificado nominalmente | 7 moderate (qs, uuid, @angular/cli↔MCP transitivo, cypress) — inalterado desde a Etapa 12, sem `fix` não destrutivo disponível |
| 5 | `@angular/core` em 22.1.0 | ✅ (herdado da Etapa 11/D8, confirmado) |
| 6 | `.nvmrc` raiz = `server/.nvmrc` = 24.18.1 | ✅ |
| 7 | `git diff` de `app-routing.module.ts`/`upload-file-routing.module.ts` vazio | ✅ |
| 8 | Services de `src/app/service/` sem alteração | ✅ (`git diff --stat -- src/app/` vazio) |
| 9 | Nomes de campo do `FormData` idênticos | ✅ `upload.cy.ts` passou |
| 10 | Zero regressão visual | ✅ nenhuma mudança de template/estilo; screenshots revertidos ao baseline anterior |
| 11 | As 11 rules corrigidas na Etapa 0 acionam contra arquivos reais | Herdado da Etapa 0, não re-verificado nesta etapa (fora do escopo desta sessão) |
| 12 | Nenhuma alteração em `server/` | ✅ |
| 13 | jQuery preservado e ordem de `scripts` intacta | ✅ `angular.json` intocado nesta etapa |

## 16. Validações executadas

- [x] `npm run build` sob Node 24.18.1 — sucesso, `dist/browser/index.html` gerado.
- [x] `npm test` — **115/115 SUCCESS** (54 arquivos de spec).
- [x] `npm run test:focus` — **27/27 SUCCESS** (3 arquivos).
- [x] `npm run e2e` — **5/5 specs, 8/8 testes** (backend iniciado manualmente sob Node 24.18.1,
  `git checkout -- server/data/users.json` após a execução).
- [x] `npm audit` — 7 vulnerabilidades moderadas, idêntico ao estado herdado da Etapa 12 (nada nesta
  etapa mexeu em dependências).
- [x] `git diff --stat -- server/ src/app/` — vazio.
- [x] `git diff -- src/app/app-routing.module.ts src/app/upload-file/upload-file-routing.module.ts`
  — vazio.
- [x] `cat .nvmrc server/.nvmrc` — ambos `24.18.1`.
- [x] `bash -n` sobre uma cópia de `deploy-to-vps.sh` no scratchpad (checagem de sintaxe indireta,
  já que `Bash(*deploy*)` está no `deny` de `.claude/settings.json`) — sem erro.
- [x] Revisão manual completa do diff de `deploy-to-vps.sh` antes de aplicar (não apenas gerado, lido
  de volta via `Read` após os `Edit`s).
- [x] `git status --short` final — só os arquivos pretendidos + os 2 alheios pré-existentes.

## 17. Validações não executadas

- `./deploy-to-vps.sh --dry-run --frontend-only` de ponta a ponta — **peço ao usuário**: `Bash` nega
  qualquer comando contendo `deploy` ou `ssh`. Recomendo rodar com `! ./deploy-to-vps.sh --dry-run
  --frontend-only` para validar a integração real (resolução de Node local + checagem do Node
  remoto) antes do primeiro deploy pós-migração.
- `start.ps1` — não executável neste ambiente (Linux, sem PowerShell). Revisão estática apenas
  (`Get-Content -Raw` + `.Trim()` é padrão e a lógica de fallback em `Ensure-PortableNode` não foi
  tocada). Recomendo um teste manual em Windows antes de divulgar o guia atualizado amplamente.
- `npm run lint`/`npm run typecheck` — não existem neste projeto (confirmado desde etapas
  anteriores).
- Reverificação das 11 rules de IA da Etapa 0 — fora do escopo desta etapa.

## 18. Validações recomendadas

- [ ] `! ./deploy-to-vps.sh --dry-run --frontend-only` — usuário, valida a integração SSH real.
- [ ] Teste manual de `start.ps1` em uma máquina Windows.
- [ ] Primeiro deploy real pós-migração como validação definitiva do achado 0021 (fora desta sessão).

## 19. Pendências

- Nenhuma pendência bloqueante. A migração major Angular 14→22 está **completa** com esta etapa.
- Achados 0003 (máscara jQuery), 0004 (`users.json` sujo pelo e2e), 0005 (tooltips inertes), 0006
  (typo `data-toogle`), 0007 (`inputmask` morto) seguem `Aberto`, mas nenhum bloqueia e nenhum
  pertence a esta etapa — herdados de achados pré-existentes à migração ou de baixa severidade.

## 20. Próximo passo recomendado

Nenhum próximo passo da migração em si — as 14 etapas (0 a 13) estão concluídas. Recomendo ao
usuário: (1) rodar a validação de deploy pendente (§17/§18) antes do primeiro deploy real; (2)
decidir separadamente sobre os achados de baixa severidade ainda abertos, se valerem a pena; (3)
considerar meregear `feature/angular-22-migration` em `dev` quando o usuário validar o resultado —
decisão e sessão do usuário, não executada aqui.

## 21. Instruções para o próximo agente

1. Leia este relatório e os das Etapas 0-12.
2. Confirme `git tag -l 'mig/*'` — deve incluir `mig/e13` (após o commit desta etapa).
3. A migração está encerrada; qualquer trabalho novo em Angular é uma iniciativa própria, não
   continuidade desta migração.
4. Se for tratar os achados 0003-0007 remanescentes, leia cada um em
   `docs/migracao-angular-achados/` antes de agir — nenhum foi criado ou alterado nesta etapa.

## 22. Observações finais

Etapa fechada com o mesmo padrão de disciplina das anteriores: a Etapa 12 foi verificada contra o
repositório (tags, `angular.json`, `package.json`), não aceita apenas pelo texto do relatório
anterior. O achado 0021 foi confirmado empiricamente (`ls dist/`) antes de codificar a correção, e a
decisão entre as duas opções documentadas nele foi levada ao usuário em vez de escolhida
unilateralmente. Dois defeitos vivos fora da letra original do plano (`start.ps1`, guia não técnico)
foram identificados durante a auditoria e só entraram no escopo depois de autorização explícita — não
por iniciativa própria. A validação completa (build, 115+27 testes, 8 testes e2e, `npm audit`) rodou
de ponta a ponta sob o Node correto (24.18.1, resolvido via nvm explicitamente porque o shell da
sessão estava em outra major), e os dois efeitos colaterais da validação real (`users.json` sujo,
screenshots recapturados) foram revertidos para manter o diff final estritamente escopado ao que a
etapa pretendia mudar: scripts de build/deploy, script de desenvolvimento Windows e documentação.
