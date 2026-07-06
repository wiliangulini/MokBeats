---
tipo: area
area: areas
status: active
source: PROJECT_RULES.md
updated: 2026-07-06
---

# 4. Git, branch e segurança operacional — branch de referência e checklist

> Part of [PROJECT_RULES.md](../../PROJECT_RULES.md) — extracted here by drydocs. Load on demand.

### Branch de referência visual do dashboard

```txt
codex/create-musical-producer-dashboard-design
```

Esta branch serve apenas como referência visual e conceitual para o dashboard do produtor.

Regras:

- Não fazer merge direto na `dev`.
- Não substituir a estrutura da `dev` pela estrutura dessa branch.
- Não copiar cegamente módulos globais, routing, guards, interceptors ou services dessa branch.
- Não remover guards, interceptors ou services da `dev`.
- Aproveitar apenas elementos visuais, ideias de layout e componentes pontuais compatíveis.
- Manter a implementação final do dashboard alinhada à estrutura real da `dev`.

Antes de iniciar uma tarefa:

- verificar branch atual;
- verificar alterações pendentes;
- evitar sobrescrever trabalho existente;
- não criar commits sem pedido explícito;
- não executar push sem autorização explícita;
- não fazer merge sem autorização explícita;
- não executar ações destrutivas de Git, arquivos, banco ou deploy.

Commits devem ser pequenos, objetivos e criados apenas quando solicitados.
