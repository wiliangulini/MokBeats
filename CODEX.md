# CODEX.md — Instrucões Específicas para Codex no MokBeats

Este arquivo orienta o uso do **Codex** no repositório **MokBeats** e define como deixar continuidade para Claude Code.

`PROJECT_RULES.md` é a fonte central de regras técnicas, funcionais e de produto.

`AGENTS.md` define o comportamento comum para agentes.

`CLAUDE.md` define cuidados específicos para Claude Code.

`.codex/instructions.md` define o protocolo operacional específico do Codex e
deve ser lido explicitamente; seu carregamento automático não deve ser presumido.

Este arquivo é complementar. Em caso de conflito, siga a hierarquia definida em
`AGENTS.md`, mantendo `PROJECT_RULES.md` como fonte central e preservando a
estabilidade da branch `dev`.

---

## 1. Papel do Codex no MokBeats

O Codex deve atuar como agente técnico sênior para:

- planejamento seguro;
- implementação incremental;
- revisão de diff;
- investigação de bugs;
- documentação operacional;
- continuidade entre Codex e Claude Code.

O objetivo é evoluir o MokBeats sem quebrar a base funcional existente.

---

## 2. Protocolo de início de sessão

Antes de implementar, revisar, auditar, refatorar ou documentar:

1. leia `PROJECT_RULES.md`;
2. leia `AGENTS.md`;
3. leia este `CODEX.md`;
4. leia `.codex/instructions.md` explicitamente;
5. consulte `.codex/config.toml` quando a tarefa envolver permissões ou comportamento do agente;
6. leia `CLAUDE.md` e `.claude/instructions.md` somente quando houver continuidade com Claude Code;
7. verifique branch e estado do Git;
8. confirme objetivo, escopo, comportamento esperado e critérios de aceite;
9. leia os arquivos diretamente relacionados e identifique consumidores e contratos;
10. identifique scripts reais antes de executar validações;
11. confirme que não existe autorização humana pendente.

Nunca implemente com base apenas em suposição.

---

## 3. Fluxo de implementação

Quando implementar:

- trabalhe sobre `dev`, salvo instrução contrária;
- altere somente arquivos necessários ao escopo;
- preserve Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, Node.js/API e WaveSurfer.js;
- preserve rotas, guards, interceptors, services e contratos existentes;
- preserve `AuthGuard`, `ProdutorGuard`, token e perfis `comprador`/`produtor`;
- preserve player, waveform, upload, carrinho, checkout, licenças e dashboard conforme `PROJECT_RULES.md`;
- evite refatoração ampla, dependência nova e mudança de arquitetura sem autorização;
- se precisar ampliar o escopo, informe justificativa, risco e alternativa antes de editar;
- preserve loading, erro, vazio, acessibilidade, dados legados e consumidores;
- não remova silenciosamente testes, validações ou tratamento de erro;
- revise o próprio diff antes de concluir;
- não execute `git add`, commit, push, merge, deploy ou comandos destrutivos sem pedido explícito.

---

## 4. Modo planejamento

Use planejamento antes de mudanças sensíveis, multiarquivo ou ambíguas.

O plano deve conter:

- objetivo;
- escopo incluído e fora de escopo;
- arquivos prováveis;
- abordagem técnica;
- riscos;
- validações previstas;
- decisões que exigem validação humana.

Não edite arquivos durante uma rodada declarada como planejamento.

---

## 5. Modo revisão

Quando atuar como revisor:

- não altere arquivos, salvo se o usuário pedir correção;
- leia o diff e os arquivos alterados;
- compare com `PROJECT_RULES.md` e o escopo solicitado;
- classifique achados por severidade;
- separe bloqueadores de recomendações;
- informe em cada achado se ele bloqueia ou não a entrega;
- informe validações executadas, ausentes ou recomendadas;
- finalize com status objetivo.

---

## 6. Fluxo de debug

Ao investigar bug:

- comece sem editar arquivos;
- separe fato observado, hipótese e causa raiz;
- leia o erro completo e mapeie o fluxo de chamada;
- confirme a hipótese com evidência antes de corrigir;
- implemente somente se autorizado e com a menor alteração suficiente;
- valide a causa raiz e regressões relacionadas.

---

## 7. Fluxo de refatoração segura

Ao refatorar:

- confirme que a refatoração está no escopo;
- mapeie consumidores e contratos públicos;
- preserve comportamento, rotas, payloads, tipos, permissões e nomes consumidos;
- não misture feature nova;
- execute em passos pequenos e compare antes/depois;
- registre risco residual.

---

## 8. Fluxo de arquitetura

Ao avaliar arquitetura:

- levante fatos e restrições reais do MokBeats;
- compare alternativas e trade-offs;
- avalie simplicidade, manutenção, risco, segurança, performance e compatibilidade;
- recomende a opção mais simples que atenda ao requisito;
- não incorpore stacks, bibliotecas ou padrões sem evidência;
- não implemente decisão sensível sem autorização.

---

## 9. Continuidade com Claude Code

Ao finalizar tarefa que pode ser continuada por Claude Code:

- liste arquivos lidos, alterados e criados;
- descreva decisões e riscos;
- informe validações executadas e não executadas;
- indique próximo passo recomendado;
- referencie skills úteis quando aplicável:
  - `senior-code-agent` para implementação;
  - `senior-code-review` para revisão;
  - `safe-refactor` para refatoração;
  - `implementation-planning` para planejamento;
  - `legacy-code-audit` para auditoria de legado;
  - `architecture-review` para decisão arquitetural.

Claude Code deve usar este arquivo apenas como complemento operacional, nunca como substituto de `PROJECT_RULES.md`.

---

## 10. Critérios para aceitar uma entrega do Codex

Uma entrega só deve ser considerada concluída quando:

- o escopo e os critérios de aceite foram atendidos;
- não houve alteração fora do escopo sem autorização;
- decisões estão apoiadas em evidência;
- contratos e comportamento existente foram preservados ou a mudança foi declarada;
- o diff foi revisado;
- validações executadas e ausentes foram informadas;
- riscos e pendências foram registrados.

---

## 11. Relatório final

Toda tarefa relevante deve terminar com relatório compatível com o padrão de `PROJECT_RULES.md`, `AGENTS.md` e, quando fizer sentido registrar em arquivo, `docs/ia-auditorias/TEMPLATE-agent-report.md`.

Use somente os status oficiais do MokBeats. Não crie formato concorrente.
Não declare validação executada sem evidência.
