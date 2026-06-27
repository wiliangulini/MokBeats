# R09 — Músicas: integração de licença com carrinho

## Relatório do Codex

## Resumo da etapa

R09 implementada na branch `dev`. O fluxo agora exige licença e plano antes de adicionar ao carrinho.

## Arquivos lidos

- `PROJECT_RULES.md`, `AGENTS.md`, `CODEX.md`, `.codex/instructions.md`
- `src/app/musicas/*`
- `src/app/carrinho/*`
- `src/app/service/carrinho.service.ts`
- `src/app/licenca-valor/licenca-valor.component.html`

## Arquivos alterados

- `src/app/carrinho/carrinho.component.{ts,html,scss,spec.ts}`
- `src/app/carrinho/cartModal/cart-modal.component.{ts,html,scss,spec.ts}`
- `src/app/carrinho/cartModal/cart-modal.models.ts`
- `src/app/service/carrinho.service.{ts,spec.ts}`

## O que foi implementado ou auditado

- Seleção obrigatória de Padrão/Premium e Mensal/6 meses/12 meses.
- Preços de R$49,99, R$199,99 e R$249,99.
- `CartItem` preserva música, licença, plano, prazo e preço.
- Deduplicação por música + licença + plano, com fallback por URL ou nome/produtor.
- Contador permanece inalterado em cancelamentos e duplicatas.
- Carrinho exibe os dados selecionados e calcula o total em centavos.
- Nenhuma alteração em checkout real, backend ou página de músicas.

## Comandos executados

- [x] `git status`
- [x] testes focados com `--include`
- [x] `npm run build`
- [x] `npm test -- --watch=false --browsers=ChromeHeadless`
- [x] `git diff --check`

## Resultado dos comandos

- Build: aprovado.
- Testes da R09: 20 aprovados, 0 falhas.
- Suíte completa: 92 aprovados, 9 falhas preexistentes — 7 em Login e 2 em Produtores.
- `git diff --check`: aprovado.
- O primeiro teste no sandbox falhou ao abrir a porta 9876; repetido com permissão local.
- O script `test:focus` ignora `FOCUS_SPECS`; por isso os testes reais foram executados com `--include`.

## Como validar manualmente

1. Acesse `/musicas` autenticado e clique em “LICENÇA”.
2. Confirme que o botão exige licença e plano.
3. Adicione uma combinação e abra `/carrinho`.
4. Confira licença, plano, preço, total e contador.
5. Repita a combinação: o contador não aumenta.
6. Escolha outro plano: uma nova entrada é aceita.

## Riscos ou pendências

- Os preços estão duplicados estaticamente em relação a `/precos`.
- O plano mensal foi tratado como plano do item conforme decisão desta etapa.
- O carrinho continua somente em memória.
- Permanecem as 9 falhas preexistentes da suíte.
- Validação com token sintético gerou `401` esperado no perfil; o token foi removido.

## Confirmação de escopo

Foram alterados somente arquivos de `carrinho`, `cartModal` e `CarrinhoService`, incluindo testes associados. Nenhum commit foi criado.

---

## Revisão do Claude Code

[cole aqui o relatório do Claude Code]

---

## Complemento pós-revisão

[cole aqui o complemento, se houver]

---

## Status final da etapa

Aprovado / Aprovado com observações / Reprovado

## Pendências para etapas futuras

- ...
