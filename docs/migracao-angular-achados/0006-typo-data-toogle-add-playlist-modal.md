# 0006 — Typo `data-toogle` (2 ocorrências, não 1)

**Etapa de origem:** 0 (herdado do plano de migração, achado A12) — **contagem corrigida na Etapa 2**
**Severidade:** Baixa
**Status:** Aberto

## Descrição

O plano de migração registrava uma ocorrência do typo `data-toogle` (faltando o "g" de "toggle") em
`add-playlist-modal.component.ts:72`. A varredura desta pasta encontrou uma **segunda** ocorrência,
não citada no plano original: `src/app/playlists/playlists.component.html:91`.

Por ser um typo, o atributo nunca corresponde a `[data-toggle]` (nem `data-bs-toggle` após a Etapa
3) — o comportamento de tooltip nunca é ativado nesses 2 pontos, de forma equivalente ao achado
0005, mas por erro de digitação em vez de ausência de inicialização JS.

## Evidência

```
src/app/playlists/playlists.component.html:91: data-toogle="tooltip" (botão "Editar")
src/app/add-playlist-modal/add-playlist-modal.component.ts:72: e.setAttribute('data-toogle','tooltip')
```

## Ação recomendada

Correção mecânica trivial (`data-toogle` → `data-toggle`) em 2 pontos — mas depende do achado 0005
ser resolvido primeiro (corrigir o typo sozinho não ativa o tooltip, porque falta a inicialização JS
de qualquer forma). Tratar junto, no mesmo ticket de UI/UX.

## Referências

Plano de migração, §2 (achado A12) e §3b.
