# Instruções operacionais do Codex — MokBeats

Este arquivo complementa `PROJECT_RULES.md`, `AGENTS.md` e `CODEX.md`.

Ele não substitui a hierarquia definida em `AGENTS.md`. O Codex deve lê-lo
explicitamente no início da sessão, pois sua descoberta automática não deve ser
presumida.

---

## 1. Protocolo de execução

Antes de implementar, revisar, depurar, refatorar, propor arquitetura ou
documentar:

1. confirmar objetivo, comportamento esperado e critérios de aceite;
2. ler `PROJECT_RULES.md`, `AGENTS.md`, `CODEX.md` e este arquivo;
3. confirmar branch, estado do Git e escopo autorizado;
4. identificar arquivos diretamente envolvidos e arquivos proibidos, quando aplicável;
5. entender comportamento atual, consumidores e contratos;
6. separar fatos, hipóteses, riscos e decisões pendentes;
7. propor a menor solução compatível com Angular 14 e a arquitetura existente;
8. implementar incrementalmente somente quando autorizado;
9. revisar o próprio diff;
10. executar validações reais e registrar limitações;
11. entregar o relatório oficial definido em `PROJECT_RULES.md`.

---

## 2. Matriz de impacto

Para cada alteração relevante, avaliar somente as áreas aplicáveis:

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

## 3. Critérios para alterar arquivos

Antes de alterar um arquivo, confirme:

1. o arquivo está diretamente ligado ao escopo;
2. existe evidência de que precisa mudar;
3. não há alternativa de menor impacto;
4. contratos e comportamento existente serão preservados;
5. a alteração pode ser justificada e validada no relatório final.

Se for necessário ampliar o escopo, pare e informe arquivo adicional, motivo,
risco e alternativa mais segura antes de editar.

---

## 4. Estratégia de implementação

- corrigir a causa raiz com a menor mudança suficiente;
- reutilizar padrões, componentes e services existentes;
- preservar contratos públicos, seletores, classes, IDs e atributos consumidos;
- preservar estados de loading, erro e vazio, acessibilidade e dados legados;
- não remover silenciosamente testes, validações ou tratamento de erro;
- não adicionar dependências, alterar API, autenticação ou arquitetura sem autorização;
- manter mudanças pequenas, reversíveis e revisáveis.

---

## 5. Estratégia de revisão

Priorizar bugs reais, regressões, segurança, contratos, autenticação,
autorização, dados, testes e compatibilidade com o legado.

Classificar achados conforme a severidade oficial do MokBeats e informar, para
cada achado, se ele bloqueia ou não a entrega. Não editar durante revisão, salvo
pedido explícito de correção.

---

## 6. Estratégia de debug

O debug começa sem alteração de arquivos:

1. registrar o fato observado e o comportamento esperado;
2. ler erro, logs e fluxo de chamada;
3. distinguir fato, hipótese e causa provável;
4. confirmar a hipótese com evidência;
5. propor correção mínima;
6. implementar apenas quando autorizado;
7. validar a causa raiz e possíveis regressões.

Não corrigir por tentativa aleatória.

---

## 7. Estratégia de refatoração segura

- mapear consumidores e comportamento atual;
- preservar comportamento externo, rotas, payloads, permissões e nomes públicos;
- não misturar nova funcionalidade;
- refatorar o menor trecho possível;
- comparar antes e depois com validação objetiva;
- registrar risco residual.

---

## 8. Estratégia de arquitetura

- basear a decisão em fatos e restrições do MokBeats;
- comparar alternativas por simplicidade, manutenção, risco, compatibilidade,
  segurança e performance;
- recomendar a opção mais simples que atenda ao requisito;
- explicar trade-offs e plano incremental;
- não incorporar stacks ou padrões sem evidência no repositório.

---

## 9. Modo Planejamento

Em Modo Planejamento, o Codex deve apenas ler, buscar, analisar, mapear riscos e
propor um plano.

É proibido criar, alterar, mover, excluir ou sobrescrever arquivos, salvo se o
usuário pedir explicitamente para criar ou salvar um arquivo de plano. Sem esse
pedido, o plano deve ser entregue somente no chat.

---

## 10. Relatório final

Use exclusivamente o formato e os status definidos em `PROJECT_RULES.md`.
Informe validações executadas, não executadas e falhas encontradas. Não crie
formato concorrente nem declare sucesso sem evidência.
