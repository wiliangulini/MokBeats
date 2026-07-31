---
tipo: area
area: areas
status: active
source: PROJECT_RULES.md
updated: 2026-07-31
---

# 6. Regras gerais de arquitetura

> Part of [PROJECT_RULES.md](../../PROJECT_RULES.md) — extracted here by drydocs. Load on demand.

### Angular

- Respeitar a versão vigente do Angular (`package.json`; hoje 22.1.0, migrado a partir do 14.3.0 — ver `docs/adr/0002-migracao-angular-14-para-22.md`). Nova migração de versão só via plano aprovado.
- Manter estrutura baseada em módulos.
- Preservar `modules`, `components`, `services`, `guards`, `interceptors` e `routing`.
- Componentes devem conter lógica de tela, não regra de negócio extensa.
- Services devem concentrar comunicação com API e lógica reutilizável.
- Guards devem proteger rotas privadas.
- Interceptors devem preservar autenticação e comportamento HTTP existente.
- Templates devem ser simples, declarativos e com HTML válido.
- Evitar subscriptions sem cleanup em fluxos longos.
- Evitar mexer em arquivos globais sem necessidade clara.

### Estado e DOM

- Preferir estado Angular/RxJS em vez de manipulação direta do DOM.
- Evitar `document.querySelector`, `getElementById`, jQuery e manipulação manual em novas implementações.
- Quando houver legado com manipulação direta do DOM, corrigir gradualmente e com cautela.

### Rotas e navegação

- Usar `routerLink` para navegação interna.
- Usar `button` para ações que não são navegação.
- Evitar links vazios ou âncoras falsas.
- Links externos devem usar URL real e proteção adequada para nova aba quando aplicável.
- Não duplicar rotas existentes.
- Rotas privadas devem continuar protegidas.
- Verificar `app-routing.module.ts` antes de alterar navegação.

### API Node.js

- Usar `/api` como base quando o projeto estiver configurado assim.
- Não alterar endpoints sem validar backend.
- Não alterar payloads sem validar API.
- Preservar contrato atual sempre que possível.
- Preservar método HTTP, URL, query params, path params, formato da resposta,
  status HTTP, paginação, filtros e ordenação.
- Validar entradas e tratar erros.
- Não logar tokens, senhas ou dados sensíveis.
- Quando endpoint não existir, registrar pendência ou criar camada temporária claramente isolada, nunca mock permanente disfarçado de integração real.

---
