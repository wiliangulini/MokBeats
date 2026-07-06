---
tipo: area
area: areas
status: active
source: PROJECT_RULES.md
updated: 2026-07-06
---

# 9.9 Upload do Produtor

> Part of [PROJECT_RULES.md](../../PROJECT_RULES.md) — extracted here by drydocs. Load on demand.

O upload do produtor é área crítica.

Modos conhecidos:

```txt
Single Track
Single Track + Stems
Efeitos FX
```

#### Single Track

Deve exibir:

- arquivo principal da música;
- loops, se aplicável;
- metadados da faixa;
- termos.

Não deve exigir Stems.

#### Single Track + Stems

Deve exibir:

- arquivo principal da música;
- loops;
- stems:
  - Melodia;
  - Harmonia;
  - Ritmo;
  - Efeitos FX;
- metadados;
- termos.

#### Efeitos FX

Deve exibir:

- campos de efeitos;
- metadados necessários;
- termos.

Não deve exibir Stems de música como obrigatórios.

#### Regras técnicas

- Preservar validações de duração.
- Preservar `FormData`.
- Não alterar nomes enviados ao backend sem validação.
- Mostrar mensagens claras de erro.
- Layout deve ser organizado e responsivo.
- Single Track deve ter destaque e largura adequada.
- Não alterar payload real sem verificar backend.

---
