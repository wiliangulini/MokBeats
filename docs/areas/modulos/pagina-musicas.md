---
tipo: area
area: areas
status: active
source: PROJECT_RULES.md
updated: 2026-07-06
---

# 9.4 Página de Músicas

> Part of [PROJECT_RULES.md](../../../PROJECT_RULES.md) — extracted here by drydocs. Load on demand.

A página de músicas deve permitir:

- listar músicas paginadas;
- filtrar músicas;
- ouvir preview;
- visualizar waveform;
- curtir;
- acessar produtor/artista;
- escolher licença;
- adicionar ao carrinho;
- navegar sem bugs.

Regras:

- Waveform deve permanecer funcional.
- Player deve receber música correta.
- Não usar índice baseado em `id - 1` quando isso puder quebrar paginação.
- Nome da música não deve ser link quebrado.
- Ação de licença deve abrir seleção de licença antes do carrinho.
- Filtros devem ser acessíveis e responsivos.
- Colunas devem permanecer alinhadas.
- Não quebrar paginação dinâmica.

---
