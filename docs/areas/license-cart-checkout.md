---
tipo: area
area: areas
status: active
source: PROJECT_RULES.md
updated: 2026-07-06
---

# 9.7 Licenças e Preços

> Part of [PROJECT_RULES.md](../../PROJECT_RULES.md) — extracted here by drydocs. Load on demand.

A área de licenças deve:

- explicar planos com clareza;
- alternar entre 6 meses e 12 meses;
- exibir valores corretamente;
- ser responsiva;
- funcionar sem depender de links vazios.

Regras:

- Usar estado Angular para alternância.
- Preços fictícios podem ser usados enquanto valores reais não forem definidos.
- Não esconder informação importante de licença.
- Modal de licença deve informar claramente o que está sendo comprado.
- Regras comerciais reais exigem validação humana.

---


## 9.8 Carrinho e Checkout

Fluxo correto:

```txt
Usuário escolhe música/efeito
Usuário escolhe licença
Item vai ao carrinho
Usuário revisa carrinho
Usuário preenche dados do projeto/observações
Usuário aceita termos
Usuário finaliza pedido
```

Campos importantes:

- nome do projeto;
- observações/comentários;
- dados pessoais/faturamento;
- forma de pagamento;
- aceite dos termos.

Regras:

- Não adicionar licença diretamente ao carrinho sem escolha quando houver modal.
- Evitar duplicidade entre carrinho e finalizar compra.
- Carrinho deve atualizar contador de forma confiável.
- Não depender de manipulação direta do DOM para estado do carrinho.
- Preservar dados necessários para checkout.
- Gateway de pagamento e endpoint final de checkout exigem validação humana.

---
