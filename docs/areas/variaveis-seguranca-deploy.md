---
tipo: area
area: areas
status: active
source: PROJECT_RULES.md
updated: 2026-07-06
---

# 11. Secrets, variáveis e deploy

> Part of [PROJECT_RULES.md](../../PROJECT_RULES.md) — extracted here by drydocs. Load on demand.

### Secrets e variáveis

É proibido:

- versionar arquivos locais de ambiente;
- exibir secrets em logs;
- inventar valor de secret;
- alterar secret real sem autorização;
- usar credencial de produção em teste;
- mover secret para código fonte;
- expor token, senha ou dado sensível no client.

Quando uma variável for necessária, documentar apenas nome e finalidade.

### Segurança da aplicação

- Validar dados externos e regras críticas também no backend; validação do frontend não substitui autorização server-side.
- Preservar validações de upload, tipo, tamanho e permissões existentes.
- Não liberar CORS de forma ampla sem justificativa e análise de risco.
- Não expor stack trace, token, senha, segredo ou dado sensível em resposta ou mensagem de erro.
- Não reduzir autenticação ou autorização para contornar falhas de integração.

### Banco e migrations

Quando banco ou migration entrarem explicitamente no escopo:

- avaliar compatibilidade com dados existentes;
- descrever impacto em leitura, escrita e performance;
- definir rollback antes de alteração irreversível;
- não remover tabela, coluna ou dados sem autorização explícita;
- validar contrato com backend e consumidores.

### Deploy/VPS/Linux

Deploy só pode ser executado quando explicitamente solicitado.

Antes de qualquer deploy:

- validar build;
- verificar variáveis necessárias;
- verificar processo de rollback;
- verificar processo de execução do front/API;
- verificar proxy e SSL quando aplicável;
- não reiniciar serviços críticos sem autorização.

Configurações de VPS/Linux devem ser documentadas apenas quando forem parte do escopo.
