---
tipo: area
area: areas
status: active
source: PROJECT_RULES.md
updated: 2026-07-06
---

# 7. Autenticação e perfis

> Part of [PROJECT_RULES.md](../../PROJECT_RULES.md) — extracted here by drydocs. Load on demand.

Perfis principais:

```txt
comprador
produtor
```

Regras:

- Usuário não autenticado não deve acessar áreas privadas.
- Comprador não deve acessar dashboard do produtor.
- Produtor deve acessar upload, dashboard e área do produtor.
- `AuthGuard` deve proteger rotas autenticadas.
- `ProdutorGuard` deve proteger rotas exclusivas de produtor.
- Não remover validações de perfil.
- Não quebrar login, cadastro, armazenamento de token ou leitura de perfil.
- Qualquer alteração em autenticação, autorização, guards, interceptors, token, sessão ou perfil é área sensível e exige validação específica.

---
