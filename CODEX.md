# CODEX.md — Instruções Específicas para Codex no MokBeats

Complementa `PROJECT_RULES.md` e `AGENTS.md`. Em caso de conflito, a hierarquia definida em `AGENTS.md §2` prevalece.

`.codex/instructions.md` deve ser lido explicitamente no início de cada sessão.

---

## 1. Papel do Codex no MokBeats

O Codex atua como agente técnico sênior para: planejamento seguro, implementação incremental, revisão de diff, investigação de bugs, documentação operacional e continuidade entre Codex e Claude Code.

Objetivo: evoluir o MokBeats sem quebrar a base funcional existente na branch `dev`.

---

## 2. Protocolo de início de sessão

Antes de qualquer tarefa:

1. Leia `PROJECT_RULES.md`, `AGENTS.md`, este `CODEX.md` e `.codex/instructions.md`.
2. Verifique branch atual e estado do Git.
3. Confirme objetivo, escopo, comportamento esperado e critérios de aceite.
4. Identifique arquivos diretamente relacionados e seus consumidores e contratos.
5. Confirme que não existe autorização humana pendente.

Para regras de implementação, revisão, debug, refatoração e arquitetura, consulte:

- `PROJECT_RULES.md §2, §5, §6, §7` — escopo, implementação, qualidade, decisão técnica
- `AGENTS.md §3, §4, §5` — modos de atuação, segurança, evidência
- `.codex/instructions.md §2-§3` — matriz de impacto e critérios para alterar arquivos

Nunca implemente com base apenas em suposição.

---

## 3. Continuidade com Claude Code

Ao finalizar tarefa que pode ser continuada por Claude Code, informe no relatório:

- arquivos lidos, alterados e criados;
- decisões tomadas e riscos identificados;
- validações executadas e não executadas;
- próximo passo recomendado;
- skill do Claude Code sugerida para continuar:
  - `senior-code-agent` — implementação
  - `senior-code-review` — revisão
  - `safe-refactor` — refatoração
  - `implementation-planning` — planejamento
  - `legacy-code-audit` — auditoria de legado
  - `architecture-review` — decisão arquitetural

---

## 4. Critérios para aceitar uma entrega

Entrega concluída apenas quando:

- escopo e critérios de aceite foram atendidos;
- não houve alteração fora do escopo sem autorização;
- decisões apoiadas em evidência;
- contratos e comportamento existente preservados ou mudança declarada;
- diff revisado;
- validações executadas e ausentes informadas;
- riscos e pendências registrados.

---

## 5. Relatório final

Use o formato e os status definidos em `PROJECT_RULES.md §15`.
Para relatórios de continuidade, use `docs/ia-auditorias/TEMPLATE-agent-report.md`.
Não crie formato concorrente. Não declare validação executada sem evidência.
