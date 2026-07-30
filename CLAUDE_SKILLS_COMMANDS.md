# Mapeamento completo: Commands e Skills do `.claude/`

## Diferença fundamental

| Tipo                              | Como usar                                           | Aceita prompt junto?                     | Edita arquivos?    |
|------                             |-----------                                          |---------------------                     |-----------------   |
| **Command** (`/nome`)             | Você digita `/nome sua_descrição_aqui`              | Sim — o texto vira `$ARGUMENTS`          | Depende do comando |
| **Skill** (invocado internamente) | Ativado pelo Claude Code quando a tarefa se encaixa | Não — você descreve a tarefa normalmente | Depende da skill   |

---

## Commands — `/comandos`

Todos os commands aceitam `$ARGUMENTS`, ou seja, o texto que você passa depois do `/comando` é injetado diretamente dentro do prompt do command. Você **pode e deve** passar contexto junto.

---

### `/create-code` — Implementação incremental

**Quando usar:** Você quer que o Claude implemente algo novo ou corrija algo específico.

```
/create-code adicione filtro por BPM na listagem de músicas, usando o serviço de músicas existente
```

```
/create-code corrija o bug onde o player continua tocando ao trocar de página
```

**O que faz:** Lê o projeto, mapeia arquivos, propõe plano, implementa o escopo solicitado e entrega relatório.
**Não faz:** Refatoração oportunista, troca de biblioteca, alteração fora do escopo.

---

### `/review-code` — Revisão técnica

**Quando usar:** Quer uma revisão do diff atual, de uma etapa concluída, ou de um trecho específico.

```
/review-code revise as alterações feitas no componente de upload do produtor nesta etapa
```

```
/review-code verifique se a implementação do modal de licença introduziu alguma regressão no fluxo de carrinho
```

**O que faz:** Lê o `git diff`, classifica achados por severidade (Crítico/Alto/Médio/Baixo) e entrega decisão final: Aprovado / Aprovado com observações / Requer ajustes / Bloqueado.
**Não faz:** Altera arquivos automaticamente.

---

### `/refactor-code` — Refatoração segura

**Quando usar:** Você quer melhorar estrutura, remover duplicação ou separar responsabilidades sem mudar comportamento.

```
/refactor-code extraia a lógica de formatação de duração do player para uma função utilitária reutilizável
```

```
/refactor-code remova a manipulação direta de DOM no componente do carrinho e substitua por estado Angular
```

**O que faz:** Documenta comportamento atual, refatora em passos pequenos, preserva contratos e entrega evidência de comportamento preservado.
**Não faz:** Mistura feature nova com refatoração, altera contrato de API.

---

### `/debug-app` — Investigação de bugs

**Quando usar:** Há um bug reportado e você quer investigação com hipóteses antes de correção.

```
/debug-app ao clicar em uma música diferente o waveform da faixa anterior continua visível por alguns segundos
```

```
/debug-app o contador do carrinho no header não atualiza quando um item é removido
```

**O que faz:** Separa fato/hipótese/causa provável, identifica causa raiz com evidência e propõe correção mínima. Só implementa se você pedir.
**Não faz:** Correções especulativas sem evidência.

---

### `/architecture-decision` — Decisão arquitetural

**Quando usar:** Você está em frente a uma decisão técnica relevante e quer análise formal com trade-offs.

```
/architecture-decision devo usar um BehaviorSubject compartilhado ou um service com Observable para sincronizar estado do player entre componentes?
```

```
/architecture-decision como estruturar o módulo de dashboard do produtor mantendo compatibilidade com a dev e aproveitando a referência visual da branch de design?
```

**O que faz:** Produz um ADR (Architecture Decision Record) com contexto real, alternativas, trade-offs, impactos e recomendação justificada.
**Não faz:** Implementa automaticamente, propõe soluções genéricas sem inspecionar o projeto.

---

### `/checklist-merge` — Checklist antes de merge

**Quando usar:** Antes de fazer merge de uma branch de feature ou etapa para a `dev`.

```
/checklist-merge branch feature/dashboard-produtor-mvp pronta para merge na dev
```

```
/checklist-merge verifique as alterações desta sessão antes de commitar
```

**O que faz:** Executa `git status`, `git diff`, verifica escopo, segurança, guards, API, build — e entrega checklist de Aprovado/Requer ajustes.
**Não faz:** Altera arquivos.

---

### `/final-audit` — Auditoria final

**Quando usar:** Antes de commit, entrega ao cliente ou handoff para Codex.

```
/final-audit valide tudo que foi implementado nesta sessão antes do commit
```

```
/final-audit etapa 8B do roadmap — waveform por item
```

**O que faz:** Verifica escopo cumprido, arquivos fora do escopo, logs temporários, código morto, regressões, segurança — e entrega mensagem de commit sugerida se pedida.
**Não faz:** Altera arquivos.

---

### `/continue-from-codex` — Continuidade do Codex

**Quando usar:** O Codex fez uma etapa e você quer que o Claude Code continue de onde parou.

```
/continue-from-codex [cole aqui o relatório final deixado pelo Codex]
```

**O que faz:** Lê o relatório do Codex, verifica o estado real do Git, identifica divergências entre o que o Codex disse que fez e o que realmente está no repositório, e continua sem desfazer trabalho válido.
**Não faz:** Presume que o relatório é 100% correto sem verificar.

---

### `/melhorar-ui-ux` — Melhoria visual

**Quando usar:** Você quer melhorar visual, responsividade, hierarquia ou UX de uma tela específica.

```
/melhorar-ui-ux melhore a aparência dos cards de música — estão muito comprimidos no mobile e sem hierarquia visual clara
```

```
/melhorar-ui-ux a página de licenças parece desconectada visualmente do restante do site — aproxime da identidade do MokBeats
```

**O que faz:** Avalia hierarquia, responsividade, contraste, estados vazios/loading/erro, e aplica melhorias incrementais preservando comportamento funcional.
**Não faz:** Reescreve a tela inteira, instala biblioteca visual sem aprovação.

---

### `/revisar-performance` — Revisão de performance

**Quando usar:** Suspeita de gargalo ou quer analisar performance de uma área específica.

```
/revisar-performance analise o componente de listagem de músicas — parece lento ao paginar com muitos itens
```

```
/revisar-performance verifique subscriptions sem cleanup no player e no dashboard
```

**O que faz:** Analisa renderizações desnecessárias, chamadas duplicadas à API, lazy loading, WaveSurfer, subscriptions sem cleanup — com evidência de código real e indicação de como medir.
**Não faz:** Altera arquivos na primeira rodada, sugere troca de stack.

---

### `/revisar-seguranca` — Revisão de segurança

**Quando usar:** Quer auditar uma área sensível (auth, upload, guards, tokens, rotas).

```
/revisar-seguranca revise o fluxo de autenticação — token, guards e perfis comprador/produtor
```

```
/revisar-seguranca analise o upload do produtor quanto a validação de tipo e tamanho de arquivo no frontend
```

**O que faz:** Avalia autenticação, autorização, XSS, exposição de dados, validação de entrada, upload — com severidade classificada e recomendações objetivas.
**Não faz:** Acessa `.env` ou secrets, cria falsos positivos genéricos.

---

## Skills — ativadas pelo Claude Code

Skills são workflows internos que o Claude Code ativa quando a situação se encaixa. Você não digita `/skill-name` — você descreve o que precisa e o Claude decide qual skill invocar. Mas você pode pedir explicitamente pelo nome.

---

### `senior-code-agent` — Agente de implementação sênior

Equivalente mais completo ao `/create-code`, com checklist técnico estruturado.

**Peça assim:** _"Implemente X seguindo postura sênior com checklist de validação"_

---

### `senior-code-review` — Revisão sênior

Equivalente mais estruturado ao `/review-code`, com fluxo de severidade mais detalhado.

**Peça assim:** _"Faça uma revisão sênior da etapa X que o Codex implementou"_

---

### `safe-refactor` — Refatoração segura

Equivalente mais estruturado ao `/refactor-code`, com regras de parada explícitas.

**Peça assim:** _"Refatore o serviço do player com segurança, preservando contratos"_

---

### `legacy-code-audit` — Auditoria de código legado

Não tem command equivalente direto. Ideal antes de qualquer refatoração de módulo desconhecido.

**Peça assim:** _"Antes de mexer no módulo de upload, faça uma auditoria de código legado"_

---

### `architecture-review` — Revisão arquitetural

Mais abrangente que `/architecture-decision` — avalia um módulo inteiro, não só uma decisão pontual.

**Peça assim:** _"Faça uma revisão arquitetural do módulo de carrinho/checkout"_

---

### `implementation-planning` — Planejamento de implementação

Não tem command equivalente. Cria um plano incremental estruturado antes de implementar.

**Peça assim:** _"Antes de implementar o dashboard, crie um plano de implementação incremental"_

---

## Guia de escolha rápida

```
Quero implementar algo         → /create-code <descrição>
Quero revisar o que foi feito  → /review-code <contexto>
Quero refatorar com segurança  → /refactor-code <o que refatorar>
Tenho um bug para investigar   → /debug-app <descrição do bug>
Tenho uma decisão técnica      → /architecture-decision <pergunta>
Antes de fazer merge           → /checklist-merge <contexto>
Antes de commitar/entregar     → /final-audit <contexto>
Continuando tarefa do Codex    → /continue-from-codex <relatório>
Quero melhorar visual          → /melhorar-ui-ux <tela/problema>
Suspeito de gargalo            → /revisar-performance <área>
Quero checar segurança         → /revisar-seguranca <área>

Preciso de plano antes de implementar → peça "implementation-planning"
Preciso auditar módulo legado         → peça "legacy-code-audit"
Preciso de revisão arquitetural ampla → peça "architecture-review"
```
