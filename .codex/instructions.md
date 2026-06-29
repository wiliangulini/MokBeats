# Instruções operacionais do Codex — MokBeats

Complementa `PROJECT_RULES.md`, `AGENTS.md` e `CODEX.md`. Leia explicitamente no início de cada sessão.

---

## 1. Matriz de impacto

Para cada alteração relevante, avalie somente as áreas aplicáveis:

- componentes, templates, estado Angular/RxJS e estilos;
- rotas, navegação, guards, interceptors, autenticação e autorização;
- API, método HTTP, parâmetros, payloads, respostas, status, paginação, filtros e ordenação;
- player, WaveSurfer.js, uploads, `FormData`, licenças, carrinho e checkout;
- dashboard, `DashboardService`, perfis `comprador` e `produtor`;
- tipos, interfaces, dados legados e consumidores;
- loading, erro, vazio, responsividade e acessibilidade;
- testes, build, manutenção, segurança e deploy.

Não trate uma área como impactada sem evidência no repositório.

---

## 2. Critérios para alterar arquivos

Antes de alterar um arquivo, confirme:

1. o arquivo está diretamente ligado ao escopo;
2. existe evidência de que precisa mudar;
3. não há alternativa de menor impacto;
4. contratos e comportamento existente serão preservados;
5. a alteração pode ser justificada e validada no relatório final.

Se for necessário ampliar o escopo: pare, informe arquivo adicional, motivo, risco e alternativa mais segura antes de editar.

---

## 3. Modo Planejamento

Em Modo Planejamento, apenas leia, busque, analise, mapeie riscos e proponha um plano.

Proibido criar, alterar, mover, excluir ou sobrescrever arquivos. Exceção: arquivo de plano pedido explicitamente pelo usuário. Sem esse pedido, o plano deve ser entregue somente no chat.

---

## 4. Relatório final

Use exclusivamente o formato e os status definidos em `PROJECT_RULES.md §15`.
Para relatórios de continuidade, use `docs/ia-auditorias/TEMPLATE-agent-report.md`.
Não crie formato concorrente. Não declare sucesso sem evidência.
