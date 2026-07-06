---
tipo: area
area: areas
status: active
source: PROJECT_RULES.md
updated: 2026-07-06
---

# 9.5 Player

> Part of [PROJECT_RULES.md](../../PROJECT_RULES.md) — extracted here by drydocs. Load on demand.

O player deve:

- tocar música selecionada;
- exibir waveform;
- exibir dados reais da música quando disponíveis;
- suportar stems quando disponíveis;
- preservar sincronização;
- não manter metadados hard-coded;
- não ter botões falsos ou sem ação visível.

Regras:

- Destruir instâncias do WaveSurfer quando necessário.
- Evitar vazamento de memória.
- Evitar múltiplas instâncias tocando simultaneamente.
- Manter comportamento previsível ao trocar de faixa.
- Preservar integração com `music-player.service` ou service equivalente existente.

---
