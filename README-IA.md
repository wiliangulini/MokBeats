# README-IA — Operação com Codex e Claude Code no MokBeats

Este arquivo é o ponto de entrada da configuração de agentes de IA do **MokBeats**. Leia-o antes de
qualquer sessão de Codex ou Claude Code no repositório.

## Objetivo

Padronizar como Codex e Claude Code devem planejar, implementar, revisar, auditar e entregar tarefas
no MokBeats — marketplace de beats, músicas, efeitos sonoros, licenças e área de produtores — sem
quebrar a base funcional da branch `dev`.

## Stack (não muda sem autorização)

```txt
Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, Node.js/API, WaveSurfer.js
```

## Arquivos principais

```txt
PROJECT_RULES.md                          fonte de verdade (regras técnicas, funcionais e de produto)
AGENTS.md                                 roteador operacional comum a todos os agentes
CLAUDE.md                                 guia operacional do Claude Code (carrega @PROJECT_RULES.md)
CODEX.md                                  guia operacional do Codex
.codex/config.toml                        postura local conservadora do Codex
.codex/instructions.md                    matriz de impacto e critérios do Codex
.claude/settings.json                     permissões seguras do Claude Code (versionado)
.claude/commands/*.md                     entrypoints de tarefa (/nome + $ARGUMENTS)
.claude/rules/*.md                        invariantes de domínio, acionados por `paths`
.claude/skills/**/SKILL.md                metodologias reutilizáveis
docs/areas/**                             regras de domínio detalhadas (load on demand)
docs/ia-auditorias/TEMPLATE-agent-report.md  template de relatório final
docs/ia-auditorias/README.md              índice dos relatórios R01–R28 (histórico)
docs/adr/*.md                             decisões de governança de IA
```

## Hierarquia de instruções (resumo — detalhe em AGENTS.md §2)

1. Solicitação explícita do usuário.
2. `PROJECT_RULES.md` — fonte de verdade.
3. `AGENTS.md`.
4. `CLAUDE.md` + `.claude/commands|rules|skills` (Claude Code) · `CODEX.md` + `.codex/instructions.md` (Codex).
5. Código existente da branch atual.

Relatórios em `docs/ia-auditorias/` são **histórico e continuidade**, não fonte de verdade superior.

## Como iniciar uma sessão segura

1. Rode `git status` e confirme a branch real (`dev` é a base de implementação).
2. Leia `PROJECT_RULES.md`, `AGENTS.md` e o guia do agente em uso.
3. Para Codex, leia também `.codex/instructions.md`.
4. Para Claude Code, use Plan Mode quando a tarefa for sensível ou multiarquivo.
5. Antes de editar um arquivo, leia a rule de `.claude/rules/` cujo `paths` casa com ele (mapa em `AGENTS.md §8`).
6. Nunca leia nem exponha `.env`, secrets ou `.claude/settings.local.json`.
7. Nunca execute deploy, `git push`, `git reset`, `git clean`, `rm -rf`, `sudo`, `ssh`, `curl` ou `wget` sem autorização explícita.
8. Antes de validar, confirme scripts reais no `package.json`.
9. Finalize no formato de relatório de `PROJECT_RULES.md §15`.

## Invariantes críticos do MokBeats

- Preservar estrutura Angular 14 e rotas existentes.
- Preservar `AuthGuard`, `ProdutorGuard`, fluxo de token/perfil e contratos da API.
- Preservar o ciclo de vida do WaveSurfer e o comportamento do player.
- Preservar nomes de campos do `FormData` no upload do produtor.
- Preservar a seleção de licença antes do carrinho/checkout.
- Branch `codex/create-musical-producer-dashboard-design` é **só referência visual** — nunca merge direto.

## Primeira tarefa recomendada

Execute uma auditoria sem edição:

```txt
Leia PROJECT_RULES.md, AGENTS.md, CLAUDE.md, CODEX.md, .codex/instructions.md e a estrutura atual.
Não edite arquivos.
Confirme se a configuração de agentes está coerente com Angular 14, guards, player/WaveSurfer,
upload, carrinho, licenças e dashboard do produtor.
Finalize com Status final.
```
