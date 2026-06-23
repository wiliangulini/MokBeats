# Instruções operacionais do Claude Code — MokBeats

Estas instruções complementam `PROJECT_RULES.md`, `AGENTS.md`, `CLAUDE.md` e `CODEX.md`.

O conteúdo abaixo é um checklist operacional. Não substitui as regras específicas do MokBeats.

---

## 1. Antes de qualquer alteração

Confirme:

- objetivo exato da tarefa;
- escopo permitido;
- itens fora de escopo;
- branch atual;
- estado do Git;
- arquivos diretamente envolvidos;
- riscos em Angular 14, rotas, autenticação, player, WaveSurfer, upload, carrinho, checkout, licenças e dashboard;
- scripts reais disponíveis para validação.

Leia sempre:

1. `PROJECT_RULES.md`;
2. `AGENTS.md`;
3. `CLAUDE.md`;
4. `CODEX.md`, se existir;
5. documentação ou relatório relacionado;
6. arquivos reais do escopo.

---

## 2. Investigação

Antes de implementar:

- diferencie fato, hipótese, causa provável e risco;
- procure padrões já existentes;
- não invente APIs, rotas, services, payloads, scripts, tabelas ou dependências;
- preserve a arquitetura atual da branch `dev`;
- use a branch de dashboard apenas como referência visual quando o escopo envolver dashboard.

---

## 3. Implementação

Ao editar:

- faça a menor alteração suficiente;
- preserve comportamento existente;
- preserve contratos de API e `FormData`;
- preserve guards e perfis;
- prefira estado Angular/RxJS a manipulação direta do DOM;
- não instale dependências sem aprovação;
- não reescreva módulos inteiros;
- não deixe mock permanente substituindo dados reais;
- não deixe botão, link ou ação falsa.

---

## 4. Revisão própria

Antes de concluir:

- revise `git diff`;
- confirme que não alterou arquivos fora do escopo;
- procure logs temporários, imports não usados e código morto;
- confira risco de regressão em rotas, player, upload, carrinho e dashboard;
- execute validações disponíveis quando seguro;
- registre validações não executadas com motivo.

---

## 5. Segurança

Não faça sem autorização explícita:

- `git add`, commit, push, merge ou reset destrutivo;
- deploy;
- alteração de secrets ou `.env`;
- instalação de dependências;
- migration ou alteração irreversível de banco;
- mudança em autenticação/autorização;
- alteração de contrato com backend;
- refatoração ampla ou troca de biblioteca principal.

---

## 6. Continuidade

Ao finalizar:

- gere relatório objetivo;
- cite arquivos lidos, criados e alterados;
- documente decisões técnicas e riscos;
- informe validações executadas;
- deixe próximo passo claro para Codex ou Claude Code continuar.

---

## 7. Modo Planejamento

Em Modo Planejamento, o Claude Code deve apenas analisar, mapear riscos, propor abordagem e responder com um plano.
É proibido editar, criar, mover, excluir ou sobrescrever arquivos durante o Modo Planejamento, salvo quando o usuário pedir explicitamente para criar ou salvar um arquivo de plano.
Se o usuário não pedir criação de arquivo, o plano deve ser entregue apenas como resposta no chat.
