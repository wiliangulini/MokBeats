# Relatório de Tarefa — [NOME DA TAREFA]

## 1. Identificação

**Agente:** Codex | Claude Code | Outro  
**Data:** [YYYY-MM-DD]  
**Branch atual:** [branch]  
**Tipo de tarefa:** Implementação | Revisão | Refatoração | Debug | Arquitetura | Auditoria final | Documentação  
**Status final:** Aprovado | Aprovado com observações | Requer ajustes | Bloqueado

## 2. Objetivo

[Descreva o objetivo da tarefa.]

## 3. Escopo solicitado

[Liste exatamente o que estava dentro do escopo.]

## 4. Escopo não incluído

[Liste o que não foi implementado por estar fora do escopo.]

## 5. Fontes de verdade consultadas

- `PROJECT_RULES.md` — regras centrais do MokBeats
- `AGENTS.md` — regras comuns para agentes
- `CLAUDE.md` — regras do Claude Code, quando aplicável
- `CODEX.md` — continuidade com Codex, quando aplicável

## 6. Arquivos lidos

- `[arquivo]` — [motivo]

## 7. Arquivos alterados

- `[arquivo]` — [o que mudou]

## 8. Arquivos criados

- `[arquivo]` — [objetivo]

## 9. Arquivos preservados

- `[arquivo]` — [motivo]

## 10. Arquivos removidos

- `[arquivo]` — [justificativa]

## 11. Estado inicial observado

[Resumo do comportamento ou estrutura antes da alteração.]

## 12. O que foi implementado ou analisado

- [item]
- [item]
- [item]

## 13. Decisões técnicas tomadas

### Decisão 1: [nome]

**Decisão:**  
[Explique.]

**Justificativa:**  
[Baseada em fatos do projeto.]

**Alternativas consideradas:**  
- [alternativa]
- [alternativa]

**Trade-offs:**  
- [pró]
- [contra]

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| [risco] | Crítico/Alto/Médio/Baixo | [impacto] | [mitigação] |

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Sim | Não | Não aplicável
- Rotas preservadas: Sim | Não | Não aplicável
- Guards/autenticação preservados: Sim | Não | Não aplicável
- APIs/payloads preservados: Sim | Não | Não aplicável
- Player/WaveSurfer preservado: Sim | Não | Não aplicável
- Upload/FormData preservado: Sim | Não | Não aplicável
- Carrinho/licenças/checkout preservados: Sim | Não | Não aplicável
- Dashboard/produtor preservado: Sim | Não | Não aplicável
- Estilos/padrões preservados: Sim | Não | Não aplicável

Observações:

- [observação]

## 16. Validações executadas

- [ ] `comando` — [resultado]
- [ ] Teste manual: [descrição] — [resultado]

## 17. Validações não executadas

- `comando` — Motivo: [motivo]

## 18. Validações recomendadas

- [ ] [teste]
- [ ] [teste]
- [ ] [teste]

## 19. Pendências

- [pendência]
- [pendência]

## 20. Próximo passo recomendado

[Explique o próximo passo lógico.]

## 21. Instruções para o próximo agente

Para continuar esta tarefa:

1. Leia este relatório.
2. Leia `PROJECT_RULES.md`, `AGENTS.md`, `CLAUDE.md` e `CODEX.md`.
3. Verifique `git status` e `git diff`.
4. Leia os arquivos alterados.
5. Execute as validações recomendadas.
6. Continue apenas dentro do escopo documentado.

## 22. Observações finais

[Qualquer observação relevante.]

---

## Convenção de nomenclatura de relatórios

Padrão: `YYYY-MM-DD__escopo__agente.md`

Exemplos:

```txt
2026-06-29__dashboard-produtor__codex.md
2026-06-29__dashboard-produtor__claude-review.md
2026-06-29__dashboard-produtor__claude-final-audit.md
```

Quando gerar relatório: para qualquer tarefa com auth, upload, checkout, dashboard, player,
múltiplos arquivos ou continuidade Codex → Claude, registrar em `docs/ia-auditorias/`
usando este template.
