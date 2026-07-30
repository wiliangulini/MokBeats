# 0004 — `server/data/users.json` é escrito a cada execução real do e2e

**Etapa de origem:** 1 (ampliar rede e2e Cypress)
**Severidade:** Baixa
**Status:** Aberto

## Descrição

`licenca-carrinho.cy.ts`, `checkout.cy.ts`, `upload.cy.ts` e `baseline-visual.cy.ts` fazem
login/registro **reais** (via UI ou `cy.request` contra `POST /api/auth/register`) com e-mails
gerados por timestamp, para não depender de segredos (senha dos usuários seedados em
`server/data/users.json` está com hash bcrypt desconhecido). Isso é intencional — os specs preferem
comportamento real do backend a mocks — mas tem o efeito colateral de **gravar um novo usuário em
`server/data/users.json` a cada execução local da suíte**.

`PROJECT_RULES.md`/o plano de migração proíbem alteração em `server/` fora de necessidade técnica
clara. O arquivo de dados não é código, mas ainda assim não deveria acumular lixo de teste no
histórico do repositório.

## Evidência

Após rodar a suíte completa nesta sessão, `git diff --stat server/data/users.json` mostrou +180
linhas (múltiplos usuários novos, um por execução/debug). Revertido com `git checkout --
server/data/users.json` antes de cada commit desta etapa.

## Ação recomendada

Nenhuma ação definitiva tomada — registrado para decisão futura. Alternativas a avaliar quando
houver CI dedicado ou mais execuções locais frequentes:
- Isolar o backend de testes e2e com um arquivo de dados descartável (ex.: copiar
  `users.json`/`musicas.json` para um diretório temporário antes de subir o servidor de teste).
- Adicionar ao fluxo de execução local um passo de `git checkout -- server/data/users.json` após
  `npm run e2e`, documentado em `docs/SCRIPTS_SHELL.md`.
- Não é urgente enquanto a execução for manual e cada agente souber reverter antes de commitar.

## Referências

`docs/ia-auditorias/2026-07-30__migracao-angular-etapa-1__claude.md`, seções 14 e 19.
