# Relatório de Tarefa — Migração Angular 14→22, Etapa 0 (destravar regras e roteamento)

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-30
**Branch atual:** `feature/angular-22-migration` (criada a partir de `dev` em `cfc22be`)
**Tipo de tarefa:** Implementação (documentação/regras de IA)
**Status final:** Aprovado

## 2. Objetivo

Executar exclusivamente a Etapa 0 do plano de migração major do Angular (14 → 22), aprovado em
`docs/ia-auditorias/2026-07-30__plano-migracao-angular-14-para-22-v2__claude.md`: destravar a
proibição textual de migração nas regras de IA, registrar a decisão em ADR e corrigir os 11 globs
`paths` defasados que impediam 6 das 8 rules de acionar.

## 3. Escopo solicitado

- 0a: criar `docs/adr/0002-migracao-angular-14-para-22.md`.
- 0b: renomear `.claude/rules/angular-14.md` → `angular.md`, remover a proibição de migrar, e
  propagar a mudança em cascata (`AGENTS.md`, `CLAUDE.md`, `README-IA.md`, `docs/areas/`,
  `docs/resources/`, 5 commands, 4 skills).
- 0c: corrigir os 11 paths defasados nas 6 rules afetadas e nos pontos correspondentes de
  `AGENTS.md` (§8.4, §8.5, §8.6, §8.8, §8.11).
- Commit + tag `mig/e0` (autorização explícita concedida para esta etapa).
- Versionar cópia do plano aprovado em `docs/ia-auditorias/`.

## 4. Escopo não incluído

`ng update`, `npm install/ci`, alteração em `package.json`/`package-lock.json`, qualquer arquivo em
`src/` ou `server/`, `.nvmrc`, `start.sh`, `start.ps1`, `angular.json`, deploy/VPS, `git push`,
Etapas 1 em diante. Nada disso foi tocado.

## 5. Fontes de verdade consultadas

- `PROJECT_RULES.md` §2, §5, §12, §13, §15
- `AGENTS.md` §2, §3, §5, §8.0
- `CLAUDE.md`
- Plano aprovado (íntegro): `~/.claude/plans/planeje-a-migra-o-major-golden-crystal.md`

## 6. Arquivos lidos

- Plano de migração completo (709 linhas) — fonte de verdade da tarefa.
- Todas as 8 rules de `.claude/rules/*.md` — para localizar os 11 paths quebrados.
- `AGENTS.md` completo — para localizar as 5 seções (§8.4–§8.11) com paths espelhados.
- `.claude/commands/architecture-decision.md` — formato de saída do ADR.
- `docs/adr/0001-modelo-operacional-ia.md` — estilo de ADR existente.
- `docs/ia-auditorias/TEMPLATE-agent-report.md` — formato deste relatório.
- `docs/areas/arquitetura-angular.md`, `docs/resources/stack-tecnica.md`, `README-IA.md`,
  `docs/areas/producer-dashboard.md`, `docs/areas/qualidade-de-codigo.md` — trechos com "Angular 14".
- 5 commands e 4 skills listados em 0b — trechos com "Angular 14".
- `docs/GUIA_MOKBEATS_NAO_TECNICO.md`, `start.sh`, `start.ps1` — para decidir a divergência D-1.
- Estrutura real de `src/app/` (`ls`/`find`) — para validar cada um dos 11 paths.
- `git status`, `git log`, `git tag -l 'mig/*'`, `git diff .vscode/settings.json` — estado do repo.

## 7. Arquivos alterados

- `AGENTS.md` — §1 (stack em migração), §2 item 7 (neutro), §8.0 (nome/rótulo da rule), §8.4–§8.11
  (5 blocos de paths corrigidos), §9 ("migrar Angular" → "fora de um plano aprovado").
- `CLAUDE.md` — invariante "Preserve Angular 14 structure" → estrutura NgModule + referência ao ADR.
- `README-IA.md` — stack (linha 15), invariante (linha 61), texto da primeira tarefa (linha 75).
- `docs/areas/arquitetura-angular.md` — "Respeitar Angular 14" → versão vigente + referência ao ADR.
- `docs/resources/stack-tecnica.md` — stack e restrição de migração.
- `docs/areas/producer-dashboard.md`, `docs/areas/qualidade-de-codigo.md` — "Angular 14" → neutro.
- `.claude/commands/architecture-decision.md`, `checklist-merge.md`, `create-code.md` (×2),
  `final-audit.md`, `melhorar-ui-ux.md` — "Angular 14" → neutro/estrutura.
- `.claude/skills/architecture-review/SKILL.md`, `implementation-planning/SKILL.md`,
  `legacy-code-audit/SKILL.md`, `senior-code-agent/SKILL.md` — idem.
- `.claude/rules/api-contracts.md`, `auth-and-guards.md`, `buyer-flow.md`,
  `license-cart-checkout.md`, `player-and-waveform.md`, `producer-dashboard.md` — 11 paths
  corrigidos (detalhe na seção 12, Decisão 2).

## 8. Arquivos criados

- `docs/adr/0002-migracao-angular-14-para-22.md` — ADR com Status/Contexto/Problema/Restrições/
  Alternativas/Decisão/Justificativa/Impactos/Riscos/Plano incremental/Critérios de aceite.
- `docs/ia-auditorias/2026-07-30__plano-migracao-angular-14-para-22-v2__claude.md` — cópia integral
  e versionada do plano aprovado (o original em `~/.claude/plans/` não é versionado).
- Este relatório.

## 9. Arquivos preservados

- Tudo em `src/` e `server/` — confirmado por `git diff --stat` vazio em ambos.
- `.nvmrc`, `start.sh`, `start.ps1`, `angular.json`, `package.json`, `package-lock.json` —
  intocados; menções a "Angular 14"/"bridge EOL" nesses arquivos ficam para a Etapa 2 (ver
  Decisão 1, divergência D-1).
- `TEMPLATE-agent-report.md` e os 3 relatórios históricos que citam `angular-14.md` — não
  reescritos por serem histórico (ver Decisão 3).

## 10. Arquivos removidos

Nenhum. `angular-14.md` foi **renomeado** (`git mv`) para `angular.md`, preservando o histórico do
arquivo — não é remoção.

## 11. Estado inicial observado

- Branch `dev` em `cfc22be`, 2 commits à frente de `origin/dev` (normal; plano proíbe push).
- Árvore de trabalho não estava limpa: `M .vscode/settings.json` (tema Peacock, alheio à tarefa) e
  um `.md` untracked de outra sessão (`docs/Plano P0 v2.2 …`).
- Nenhuma tag `mig/*` existia — confirma que esta é de fato a primeira etapa executada.
- `docs/adr/` continha apenas `0001-modelo-operacional-ia.md`.
- Os 11 globs listados no plano foram todos confirmados quebrados por `find`/`ls`: o path
  declarado casava 0 arquivos; o path real existia.

## 12. O que foi implementado ou analisado

- ADR 0002 criado com a matriz de decisão de alvo (Angular 22.1.0, checkpoint 21.2.19), as 8
  correções de diagnóstico e os 15 achados (A1–A15) do plano.
- Rule `angular-14.md` renomeada para `angular.md`; proibição de migrar removida; substituída por
  "preservar estrutura NgModule/rotas, migração só via plano aprovado".
- Cascata 0b aplicada em 17 arquivos (`AGENTS.md`, `CLAUDE.md`, `README-IA.md`, 2 docs/areas, 1
  docs/resources, 5 commands, 4 skills).
- 11 paths corrigidos nas 6 rules + nos 5 pontos espelhados de `AGENTS.md`.
- Todos os 11 paths corrigidos verificados por `find`/`ls` contra o filesystem real — cada um casa
  com ≥ 1 arquivo.
- `git diff --stat src/` e `git diff --stat server/` confirmados vazios.
- Plano aprovado copiado para `docs/ia-auditorias/` (versionado).
- Commit único (25 arquivos) + tag `mig/e0`. Sem `git push`.

## 13. Decisões técnicas tomadas

### Decisão 1: não editar `docs/GUIA_MOKBEATS_NAO_TECNICO.md`, `start.sh`, `start.ps1` nesta etapa

**Decisão:** Apesar de o plano listar `docs/GUIA_MOKBEATS_NAO_TECNICO.md` em 0b sob "versão da
stack", suas únicas menções a "Angular 14" (linhas 56 e 71) descrevem a bridge Node 16.20.2, que é
o estado real e verdadeiro do `.nvmrc` até a Etapa 2 rodar.

**Justificativa:** Trocar essas linhas para "Angular 22" agora produziria documentação falsa. O
próprio plano restringe a Etapa 0 a "regras, docs e o ADR" e reserva o vocabulário de "ponte EOL"
para a Etapa 13 (que já existe explicitamente para isso). `start.sh`/`start.ps1` são scripts, fora
do escopo declarado de 0b.

**Alternativas consideradas:**
- Editar mesmo assim, seguindo a letra da tabela 0b.
- Editar apenas o rótulo sem tocar nos comandos Node.

**Trade-offs:**
- Manter intocado preserva a veracidade da documentação operacional (o script real ainda instala
  Node 16.20.2 hoje).
- Custo: a stack declarada em `AGENTS.md`/`README-IA.md`/`stack-tecnica.md` já menciona "em
  migração para 22.1.0", criando uma pequena assimetria temporária entre esses 3 arquivos e o guia
  não-técnico — assimetria que se resolve naturalmente na Etapa 2.

### Decisão 2: redação diferenciada para "declaração de stack" vs. "restrição operacional"

**Decisão:** Onde o texto original *declarava a versão da stack* (`AGENTS.md` §1, `README-IA.md`,
`stack-tecnica.md`, `arquitetura-angular.md`), a nova redação é
"Angular 14.3.0 — em migração para 22.1.0 (ADR 0002; checkpoint em 21.2.19)". Onde o texto era uma
*restrição operacional repetida* ("preservar Angular 14", "compatibilidade com Angular 14"), a
redação virou neutra de versão ("a estrutura Angular", "a versão vigente do Angular").

**Justificativa:** Uma declaração de stack que dissesse simplesmente "Angular 22" seria falsa hoje
(o `package.json` ainda está em 14.3.0). Uma restrição neutra evita reescrever 9+ arquivos a cada um
dos 8 degraus da escada — mesmo princípio já aplicado pelo próprio plano ao renomear a rule.

**Alternativas consideradas:**
- Deixar tudo em "Angular 14" até o fim da migração.
- Trocar tudo para "Angular 22" antecipadamente.

**Trade-offs:**
- A redação escolhida é verificável a qualquer momento durante os 8 degraus sem ficar
  desatualizada nem mentir sobre o estado atual.

### Decisão 3: não editar `TEMPLATE-agent-report.md` nem os 3 relatórios históricos

**Decisão:** `TEMPLATE-agent-report.md:86` ("Angular 14 preservado: Sim | Não | Não aplicável") não
está na lista de 0b e não foi alterado — é um campo de formulário, não uma declaração de versão.
Os relatórios históricos que citam `angular-14.md` (`R19-…`, `2026-07-06__migracao-config-ia__…`)
também não foram tocados.

**Justificativa:** `AGENTS.md §11`/`§2.1` classificam relatórios em `docs/ia-auditorias/` como
histórico e continuidade, não fonte de regra concorrente — reescrevê-los apagaria o registro do que
era verdade naquela data.

**Alternativas consideradas:** Atualizar a referência nos 3 relatórios para o novo nome do arquivo.

**Trade-offs:** Um leitor futuro de `R19` verá uma referência a um arquivo renomeado; aceitável
porque o relatório já é histórico e o `git log`/`git mv` preserva a rastreabilidade real.

### Decisão 4: paths corrigidos por evidência de filesystem, não por leitura do texto do plano

**Decisão:** Cada um dos 11 paths da tabela 0c foi confirmado por `find`/`ls` contra a árvore real
antes de editar, e reconfirmado depois da edição.

**Justificativa:** É exatamente o Definition of Done da Etapa 0 no plano ("para cada `paths`
corrigido, um `find`/`ls` do glob casa com ≥1 arquivo real") e a instrução explícita de não editar
às cegas.

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| Assimetria temporária entre a stack declarada ("em migração") e `GUIA_MOKBEATS_NAO_TECNICO.md`/scripts (ainda "Angular 14" puro) | Baixo | Confuso para leitura casual até a Etapa 2 | Registrado como pendência explícita (item 19); resolve-se naturalmente quando o `.nvmrc` mudar |
| Redação neutra ("versão vigente do Angular") pode parecer vaga sem o contexto do ADR | Baixo | Leitor sem acesso ao ADR 0002 perde a versão exata | Toda ocorrência relevante referencia `docs/adr/0002-…md`, que tem a matriz completa |
| Etapa 0 é pré-requisito hard-block para a Etapa 1 (regra explícita do plano) | N/A (governança, não técnico) | Se um agente futuro pular esta etapa, a proibição de migrar não é mais um risco — já foi removida | Este relatório e a tag `mig/e0` registram que a Etapa 0 está concluída |

Nenhum risco de severidade Alta ou Crítica: esta etapa não toca código de aplicação.

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Não aplicável (sem mudança em `src/`; a rule agora *permite* a migração
  futura sob plano aprovado, mas nada foi migrado nesta sessão)
- Rotas preservadas: Sim (nenhuma rota tocada)
- Guards/autenticação preservados: Sim (nenhum guard tocado; a rule `auth-and-guards.md` passou a
  **cobrir** `ProdutorGuard`/`ProfileCompleteGuard`/`auth.interceptor.ts`, que antes escapavam)
- APIs/payloads preservados: Sim (nenhum service tocado)
- Player/WaveSurfer preservado: Sim (nenhum arquivo de player tocado; a rule passou a cobrir
  `wave-surfer.service.ts`, `audio.service.ts`, `audio-preloader.service.ts`, antes descobertos)
- Carrinho/licenças/checkout preservados: Sim (nenhum arquivo tocado)
- Dashboard/produtor preservado: Sim (nenhum arquivo tocado; a rule passou a cobrir
  `usuario-artista/`, antes descoberto)
- Estilos/padrões preservados: Sim (nenhum SCSS tocado)

Observações:

- Esta etapa é puramente de governança/documentação. O ganho real é que 5 invariantes de produto
  (auth guards, interceptor, player/WaveSurfer, carrinho/service, dashboard/artista) passam a ter
  cobertura de rule que antes não tinham — condição necessária para os 8 degraus de `ng update`
  que virão nas próximas etapas.

## 16. Validações executadas

- [x] `find`/`ls` de cada um dos 11 globs corrigidos — todos retornaram ≥ 1 arquivo real (evidência
  na seção 6 e reproduzível a qualquer momento).
- [x] `git diff --stat src/` — vazio.
- [x] `git diff --stat server/` — vazio.
- [x] `grep -rln "angular-14.md"` fora de `docs/ia-auditorias/` — zero ocorrências (rename sem
  referência órfã fora do histórico).
- [x] Revisão manual do `git diff` completo (25 arquivos, +929/-46) antes do commit.
- [x] Teste manual: branch criada a partir de `dev` limpa em relação ao escopo (`.vscode` e o `.md`
  alheio identificados e conscientemente excluídos do commit) — Resultado: OK.

## 17. Validações não executadas

- `npm run build` / `npm test` / `npm run e2e` / `npm audit` — Motivo: não se aplicam a uma etapa
  que não toca `src/`, `server/`, `package.json` nem `angular.json`; são o bloco de validação das
  Etapas 2+ do plano.
- `npm run lint` / `npm run typecheck` — Motivo: não existem neste projeto (`PROJECT_RULES.md §12`).

## 18. Validações recomendadas

- [ ] Antes de iniciar a Etapa 1: `git tag -l 'mig/*'` e `git log --oneline` para confirmar que o
  estado real do repositório é `mig/e0` (não supor a partir deste relatório apenas).
- [ ] Reconfirmar os 11 paths com `find` caso algum arquivo de `src/app/` tenha sido renomeado por
  outro agente entre esta sessão e a próxima.
- [ ] Ler o ADR 0002 e a cópia versionada do plano antes de iniciar a Etapa 1.

## 19. Pendências

- `docs/GUIA_MOKBEATS_NAO_TECNICO.md` (linhas 56 e 71) e o vocabulário de "ponte EOL" em
  `start.sh:19,77`/`start.ps1:6` continuam descrevendo Node 16.20.2 — correto hoje, mas **devem ser
  atualizados na Etapa 2** (unificação do runtime Node), não antes.
- `TEMPLATE-agent-report.md:86` mantém o campo "Angular 14 preservado" — decisão consciente de não
  generalizar o template nesta etapa; pode ser revisitado numa etapa de manutenção de template, sem
  relação direta com a migração.
- 3 relatórios históricos (`R19-…`, `2026-07-06__migracao-config-ia__…`) ainda citam
  `.claude/rules/angular-14.md` pelo nome antigo — aceito, são registro histórico.
- A árvore de trabalho da branch `dev` original já tinha `.vscode/settings.json` modificado e um
  `.md` untracked (`docs/Plano P0 v2.2 …`) de sessão anterior, não relacionados a esta tarefa — não
  foram commitados nem descartados, permanecem como estavam.

## 20. Próximo passo recomendado

Aguardar confirmação explícita do usuário antes de iniciar a Etapa 1 (ampliar a rede e2e Cypress),
conforme instrução da sessão. Não prosseguir automaticamente.

## 21. Instruções para o próximo agente

Para continuar esta tarefa:

1. Leia este relatório.
2. Leia `PROJECT_RULES.md`, `AGENTS.md`, `CLAUDE.md` (já atualizados por esta etapa).
3. Leia o ADR `docs/adr/0002-migracao-angular-14-para-22.md` e a cópia do plano em
   `docs/ia-auditorias/2026-07-30__plano-migracao-angular-14-para-22-v2__claude.md`.
4. Verifique `git status`, `git log --oneline` e `git tag -l 'mig/*'` — não suponha o degrau a
   partir deste relatório isoladamente.
5. Confirme que a branch ativa é `feature/angular-22-migration` e que `HEAD` está em `mig/e0` (ou à
   frente, se outra etapa já rodou).
6. Continue apenas dentro do escopo da Etapa 1, conforme o plano.

## 22. Observações finais

Nenhum código de aplicação foi tocado nesta sessão. O ganho é estrutural: a proibição textual de
migração foi removida da fonte de verdade (`.claude/rules/angular.md`), o ADR 0002 registra a
decisão de alvo e sua justificativa, e as 6 rules que antes tinham 11 globs mortos agora acionam
contra o filesystem real — incluindo dois invariantes que antes não tinham cobertura alguma
(`ProdutorGuard`/`ProfileCompleteGuard` e o núcleo do WaveSurfer). A Etapa 1 pode iniciar com as
regras de proteção de fato ativas durante os 8 degraus de `ng update` que virão.
