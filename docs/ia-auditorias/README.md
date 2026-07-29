# Índice — docs/ia-auditorias

Relatórios de auditoria e continuidade entre agentes (Codex ↔ Claude Code) no MokBeats.

> **Natureza destes arquivos:** são **histórico e continuidade**, não fonte de verdade. A fonte de
> verdade é `PROJECT_RULES.md`; as regras de domínio detalhadas ficam em `docs/areas/`. Um relatório
> Rxx registra o estado de uma etapa **no momento em que foi escrito** — se citar um arquivo, função
> ou rota, confirme no código atual antes de agir.

## Como usar (leitura sob demanda)

- Só leia o Rxx correspondente à área que você vai tocar (coluna "Área/Rule").
- Se a tarefa continua um trabalho anterior, leia o relatório **preenchido** mais recente da área.
- **Não** leia toda a pasta por padrão; isso desperdiça contexto/tokens.
- Ao gerar um novo relatório, use `TEMPLATE-agent-report.md`.

## Status dos relatórios

Legenda: **Preenchido** = conteúdo real · **Modelo** = stub não preenchido ("[cole aqui…]") · **Vazio** = 0 bytes.

| Rxx | Tema | Status | Área/Rule relacionada |
|---|---|---|---|
| R01 | Auditoria inicial da branch `dev` | Preenchido | geral |
| R02 | Auditoria branch dashboard (codex) | **Vazio** | `producer-dashboard` |
| R03 | Comparação `dev` vs dashboard (codex) | Preenchido | `producer-dashboard` |
| R04 | Header/footer — links globais | Preenchido | `buyer-flow` |
| R05 | Home — navegação institucional | Preenchido | `buyer-flow` |
| R06 | Login — fonte do tipo de perfil | Preenchido | `auth-and-guards` |
| R07 | Músicas — navegação, botões, layout | Preenchido | `license-cart-checkout` |
| R08 | Músicas — modal de seleção de licença | Preenchido | `license-cart-checkout` |
| R09 | Músicas — integração licença/carrinho | Preenchido | `license-cart-checkout` |
| R10 | Player — índice, metadados, ações | Preenchido | `player-and-waveform` |
| R11 | Waveform — lazy loading e sincronização | Preenchido | `player-and-waveform` |
| R12 | Player — stems, carregamento, sincronização | Preenchido | `player-and-waveform` |
| R13 | Filtros — minimizar scroll | Preenchido | `buyer-flow` |
| R14 | Efeitos sonoros — dados/service/backend | Modelo | `api-contracts` / `license-cart-checkout` |
| R15 | Efeitos sonoros — visual, botões, paginação | Modelo | `buyer-flow` |
| R16 | Efeitos sonoros — player, waveform, licença | Modelo | `player-and-waveform` |
| R17 | Upload produtor — UI single/stems/fx | Modelo | `producer-upload` |
| R18 | Upload produtor — validações, duração, FormData | Modelo | `producer-upload` |
| R19 | Página do artista — HTML e responsabilidades | Modelo | `producer-dashboard` |
| R20 | Área do produtor — menu, rotas, proteção | Modelo | `auth-and-guards` / `producer-dashboard` |
| R21 | Dashboard produtor — contrato de dados | Modelo | `producer-dashboard` / `api-contracts` |
| R22 | Dashboard produtor — visual (branch codex) | Modelo | `producer-dashboard` |
| R23 | Dashboard produtor — gráficos, estados, responsividade | Modelo | `producer-dashboard` |
| R24 | Pricing — toggle e cards responsivos | Modelo | `license-cart-checkout` |
| R25 | FAQ — navegação, visual, responsividade | Modelo | `buyer-flow` |
| R26 | Carrinho — modelo de item, contador, licença | Modelo | `license-cart-checkout` |
| R27 | Checkout — fechamento de pedido | Modelo | `license-cart-checkout` |
| R28 | QA final — regressão completa | Modelo | `validacao-qa` |

## Outros arquivos da pasta

- `TEMPLATE-agent-report.md` — template canônico de relatório final/handoff (use este).
- `relatorio-prompt-claude.md` — registro histórico de uma tarefa de configuração de IA anterior.
- `DIAGNOSTICO-*` / relatórios de migração de IA, quando existirem — histórico da governança.
- `2026-07-29__plano-p0-v2.2-status-final__claude.md` e
  `2026-07-29__plano-p0-v2.2-auditoria-t0-b1__claude-final-audit.md` — status e auditoria final
  do Plano P0 v2.2 (remediação de vulnerabilidades de dependências), arquivados após merge do PR
  #2 em `dev` (commit `20569dc`). Backend encerrado com 0 vulnerabilidades no `npm audit`.

> Os relatórios **Modelo** (R14–R28) são stubs planejados: preencha-os ao executar a etapa
> correspondente, não os trate como auditoria concluída. R02 está vazio e deve ser refeito ou
> descartado quando a etapa de dashboard for auditada.
