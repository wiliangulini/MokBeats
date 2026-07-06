# Relatório de Tarefa — Migração das vantagens estruturais do Burguer System para o MokBeats

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-06
**Branch atual:** dev
**Tipo de tarefa:** Documentação | Auditoria + adaptação de configuração de IA
**Status final:** Aprovado com observações

## 2. Objetivo

Herdar do Burguer System apenas as **vantagens estruturais** da configuração de agentes de IA
(hierarquia documental, entrypoint, anti-duplicação, segurança operacional, continuidade Codex↔Claude,
rules por domínio, templates/handoff), sem copiar domínio de hamburgueria nem alterar a stack do MokBeats.

## 3. Escopo solicitado

Exclusivamente configuração de IA, documentação operacional, prompts, commands, skills, rules e
templates. Análise em modo leitura, plano com autorização, execução após aprovação.

## 4. Escopo não incluído

- `src/`, API, `package.json`, `angular.json`, rotas, componentes, serviços e estilos do produto.
- Correção do `server/.env.production` versionado (operação Git, requer autorização).
- Alteração de `settings.local.json` (decisão do usuário: apenas documentar).
- Commit, push e deploy.

## 5. Fontes de verdade consultadas

- `PROJECT_RULES.md` — regras centrais do MokBeats
- `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `.codex/instructions.md`
- `.claude/rules/*`, `.claude/skills/*`, `.claude/commands/*`
- `_tmp/burger-system.zip` (lido via `unzip -p`, sem extrair)

## 6. Arquivos lidos

- Config MokBeats: root (AGENTS/CLAUDE/CODEX/PROJECT_RULES), `.codex/*`, `.claude/settings*.json`, 5 rules, 11 skills, 11 commands, `TEMPLATE-agent-report.md`, `docs/ia-prompts/codex/README.md`.
- ZIP Burguer: `README-IA.md`, root files, `.codex/instructions.md`, `docs/adr/0001-0002`, `TEMPLATE-agent-report.md`, `DIAGNOSTICO-ADAPTACAO.md`, `regras-dominio/README.md`, `workspace-agentes/README.md`, `pr-checklist.md`, commands `implementation-plan`/`review-code`/`final-audit`.

## 7. Arquivos alterados (17)

- `AGENTS.md` — §2.1 mapa de responsabilidades + §8.0 roteamento área→rule→seção (sem renumerar §3/§4/§5).
- `CLAUDE.md` — seção "Commands, skills, and rules".
- `CODEX.md` — referência a `.codex/instructions.md §1-§4`.
- `.codex/instructions.md` — §4 "Operações proibidas" (incl. `settings.local.json`); relatório → §5.
- `.claude/settings.json` — deny de leitura de `settings.local.json`.
- `docs/ia-prompts/codex/README.md` — nota "templates/histórico".
- 11 commands — `argument-hint`, protocolo comum + skill referenciada, contrato de escrita nos 6 de revisão/auditoria; `create-code` sem a lista de restrições duplicada.

## 8. Arquivos criados (6)

- `README-IA.md` — entrypoint da operação de IA.
- `docs/ia-auditorias/README.md` — índice R01–R28 (histórico; status por relatório).
- `docs/adr/0001-modelo-operacional-ia.md` — ADR de governança.
- `.claude/rules/angular-14.md`, `api-contracts.md`, `buyer-flow.md` — rules com `paths`.
- (este relatório)

## 9. Arquivos preservados

- Todo `src/`, API, `package.json`, `angular.json`, estilos.
- `PROJECT_RULES.md`, `docs/areas/*`, `.codex/config.toml`.
- 5 rules originais, 6 skills-metodologia, R01–R28, `TEMPLATE-agent-report.md`, `relatorio-prompt-claude.md`.

## 10. Arquivos removidos (5 skills redundantes)

- `.claude/skills/continue-from-codex/SKILL.md` — dup do command homônimo (mantido como command).
- `.claude/skills/final-audit/SKILL.md` — dup do command homônimo (mantido como command).
- `.claude/skills/implementation-plan/SKILL.md` — dup de `implementation-planning`.
- `.claude/skills/controlled-implementation/SKILL.md` — coberto por `create-code` + `senior-code-agent`.
- `.claude/skills/senior-review/SKILL.md` — coberto por `review-code` + `senior-code-review`.

Grep prévio confirmou ausência de referência dura ativa (menções só em `relatorio-prompt-claude.md`, histórico).

## 11. Estado inicial observado

MokBeats já modularizado por drydocs (`docs/areas/`, PROJECT_RULES com ponteiros, rules com `paths`).
Config funcional, porém com 2 sistemas paralelos de skills (6 metodologias + 5 `$ARGUMENTS`
redundantes), sem `README-IA.md`, sem mapa de responsabilidades/roteamento no AGENTS, sem índice de
auditorias e com lacuna de segurança (`settings.json` não negava `settings.local.json`).

## 12. O que foi implementado ou analisado

- Inventário comparativo MokBeats × Burguer (Etapa A) e diagnóstico (Etapa B).
- Criação de entrypoint, ADR, índice de auditorias e 3 rules por domínio.
- Governança no AGENTS (§2.1/§8.0), distinção de recursos no CLAUDE, ops proibidas no Codex.
- Consolidação de skills (11 → 6) e padronização dos 11 commands (referência ao protocolo + contrato de escrita).
- Hardening do `settings.json`.

## 13. Decisões técnicas tomadas

### Decisão 1: manter nomes de rules/skills existentes

**Decisão:** não renomear `legacy-code-audit`→`legacy-angular-audit` nem criar `ui-ux-review`.
**Justificativa:** `CODEX.md` referencia os nomes atuais; `melhorar-ui-ux` já cobre UI/UX como command.
**Alternativas consideradas:** alinhar aos nomes sugeridos no prompt (exigiria atualizar referências).
**Trade-offs:** (pró) zero quebra de referência; (contra) leve divergência dos nomes sugeridos.

### Decisão 2: contrato de escrita em vez de `allowed-tools` restrito

**Decisão:** nos commands de revisão/auditoria não restringi `allowed-tools` a Read/Grep/Glob/Bash.
**Justificativa:** isso bloquearia a gravação do relatório autorizado em `docs/ia-auditorias/`.
**Alternativas consideradas:** restringir tools (padrão Burguer para commands chat-only).
**Trade-offs:** (pró) preserva o handoff via relatório; (contra) a barreira é textual (contrato), não de tooling.

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| `server/.env.production` versionado | Alto | Vazamento de segredos | `git rm --cached` + rotação (fora do escopo; reportado) |
| `settings.local.json` com ssh/curl/deploy prod | Médio | Execução perigosa local | Documentado; `settings.json` nega leitura; revisão manual |
| Contrato de escrita é textual | Baixo | Command poderia escrever fora do alvo | Instrução explícita + preferência por Plan Mode |

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Não aplicável (sem mudança em `src/`)
- Rotas preservadas: Não aplicável
- Guards/autenticação preservados: Não aplicável
- APIs/payloads preservados: Não aplicável
- Player/WaveSurfer preservado: Não aplicável
- Upload/FormData preservado: Não aplicável
- Carrinho/licenças/checkout preservados: Não aplicável
- Dashboard/produtor preservado: Não aplicável
- Estilos/padrões preservados: Não aplicável

Observações:

- Tarefa 100% de configuração de IA/documentação; nenhum arquivo de produto foi alterado (confirmado por `git status`).

## 16. Validações executadas

- [x] `git status` / `git diff --stat` — 22 modificados/removidos + 6 criados; nenhum arquivo de produto.
- [x] `python3 json.load('.claude/settings.json')` — JSON válido.
- [x] `ls .claude/skills` / `.claude/rules` — 6 skills, 8 rules.
- [x] `grep` referências órfãs a skills removidas em config ativa — vazio.
- [x] README-IA: arquivos citados existem; AGENTS §2.1/§8.0 presentes, §3/§4/§5 preservadas.

## 17. Validações não executadas

- `npm run build|lint|typecheck|test` — Motivo: nenhuma mudança em `src/`; sem impacto em código do produto.

## 18. Validações recomendadas

- [ ] Rodar os 4 comandos da seção "comandos de validação" antes da próxima sessão.
- [ ] Revisar manualmente `settings.local.json`.
- [ ] Planejar remoção de `server/.env.production` do índice + rotação de segredos.

## 19. Pendências

- Tratamento de `server/.env.production` (Git + rotação).
- Preencher/descartar R02 (vazio) e stubs R14–R28 quando as etapas forem auditadas.
- Nada commitado/pushado.

## 20. Próximo passo recomendado

Revisar o diff de configuração; opcionalmente commitar como `chore: adota governança de IA do Burguer
System (README-IA, rules, skills, commands)`; tratar os riscos de segurança em tarefa separada e autorizada.

## 21. Instruções para o próximo agente

1. Leia este relatório e `README-IA.md`.
2. Leia `PROJECT_RULES.md`, `AGENTS.md`, `CLAUDE.md`, `CODEX.md`.
3. Verifique `git status` e `git diff`.
4. Antes de editar um arquivo, leia a rule cujo `paths` casa (mapa em `AGENTS.md §8.0`).
5. Execute as validações recomendadas.
6. Continue apenas dentro do escopo documentado.

## 22. Observações finais

Migração estrutural concluída e validada dentro do escopo. Ganhos: entrypoint único, governança
anti-duplicação, skills sem redundância, commands com contrato de escrita, índice de auditorias e
segurança operacional reforçada — preservando Angular 14, branch `dev` e domínio musical do MokBeats.

Status final: Aprovado com observações
