# ADR 0001 — Modelo operacional de IA do MokBeats

## Status

Aceita

## Contexto

O MokBeats evolui com apoio de Codex (VS Code) e Claude Code. O risco principal é permitir que
agentes alterem escopo, autenticação/guards, contratos da API, player/WaveSurfer, upload, carrinho,
licenças ou dashboard sem plano, sem evidência e sem preservar a base funcional da branch `dev`.

A configuração já havia sido modularizada por drydocs (`docs/areas/`, `PROJECT_RULES.md` com
ponteiros, rules com `paths`). Esta decisão consolida o modelo operacional e registra a migração
das vantagens estruturais da configuração de referência do Burguer System — **apenas estrutura de
governança**, sem copiar domínio (hamburgueria) nem stack (Next.js/Prisma/Auth.js/Tailwind).

## Decisão

Adotar um modelo operacional baseado em:

- `PROJECT_RULES.md` como fonte de verdade única (escopo, stack, domínio, segurança, validação, relatório);
- `AGENTS.md` como roteador comum: prioridade de instruções, mapa de responsabilidades (§2.1),
  modos, segurança, evidência, git, continuidade e roteamento domínio → rule (§8);
- `CLAUDE.md`, `.claude/commands/`, `.claude/rules/` e `.claude/skills/` para Claude Code;
- `CODEX.md` e `.codex/instructions.md` para Codex (matriz de impacto e critérios de edição);
- `README-IA.md` como ponto de entrada da operação de IA;
- rules acionadas por `paths` (`.claude/rules/*`) como invariantes de domínio; commands e skills
  **referenciam** o protocolo comum, não o recopiam;
- relatório final obrigatório no formato de `PROJECT_RULES.md §15` / `TEMPLATE-agent-report.md`;
- proibição de ler/expor `.env`, secrets e `.claude/settings.local.json`;
- validação baseada em scripts reais do `package.json`.

### Fronteiras entre agentes

- **Codex:** planejamento seguro, implementação incremental, revisão de diff, debug e continuidade técnica.
- **Claude Code:** planejamento em Plan Mode, implementação controlada, revisão sênior, auditoria e aplicação de commands/skills.
- **Dev humano:** aprova dependências, mudanças de contrato de API, alterações de auth/guards,
  deploy, push, ações destrutivas e decisões arquiteturais amplas.

## Consequências

- Mais previsibilidade e continuidade entre Codex e Claude Code.
- Menor risco de alteração destrutiva ou fora de escopo.
- Menos duplicação (uma responsabilidade por arquivo) e menor custo de tokens.
- Custo documental inicial, compensado por revisão mais segura e onboarding mais rápido.
