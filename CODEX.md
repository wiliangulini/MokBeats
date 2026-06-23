# CODEX.md — Instrucões Específicas para Codex no MokBeats

Este arquivo orienta o uso do **Codex** no repositório **MokBeats** e define como deixar continuidade para Claude Code.

`PROJECT_RULES.md` é a fonte central de regras técnicas, funcionais e de produto.  
`AGENTS.md` define o comportamento comum para agentes.  
`CLAUDE.md` define cuidados específicos para Claude Code.

Este arquivo é complementar. Em caso de conflito, preserve `PROJECT_RULES.md`, `AGENTS.md`, `CLAUDE.md` e a estabilidade da branch `dev`.

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

## 2. Leitura obrigatória

Antes de implementar, revisar, auditar, refatorar ou documentar:

1. leia `PROJECT_RULES.md`;
2. leia `AGENTS.md`;
3. leia `CLAUDE.md` quando houver continuidade com Claude Code;
4. leia `.claude/instructions.md` se existir;
5. verifique branch e estado do Git;
6. leia os arquivos diretamente relacionados ao escopo;
7. identifique scripts reais antes de executar validações;
8. confirme que a tarefa não exige autorização humana pendente.

Nunca implemente com base apenas em suposição.

---

## 3. Regras de implementação

Quando implementar:

- trabalhe sobre `dev`, salvo instrução contrária;
- altere somente arquivos necessários ao escopo;
- preserve Angular 14, TypeScript, SCSS, Bootstrap, Angular Material, Node.js/API e WaveSurfer.js;
- preserve rotas, guards, interceptors, services e contratos existentes;
- preserve `AuthGuard`, `ProdutorGuard`, token e perfis `comprador`/`produtor`;
- preserve player, waveform, upload, carrinho, checkout, licenças e dashboard conforme `PROJECT_RULES.md`;
- evite refatoração ampla, dependência nova e mudança de arquitetura sem autorização;
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
- informe validações executadas, ausentes ou recomendadas;
- finalize com status objetivo.

---

## 6. Continuidade com Claude Code

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

## 7. Relatório final

Toda tarefa relevante deve terminar com relatório compatível com o padrão de `PROJECT_RULES.md`, `AGENTS.md` e, quando fizer sentido registrar em arquivo, `docs/ia-auditorias/TEMPLATE-agent-report.md`.

Não declare validação executada sem evidência.
