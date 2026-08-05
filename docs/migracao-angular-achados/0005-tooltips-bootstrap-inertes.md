# 0005 — 30 tooltips `data-toggle="tooltip"` inertes (sem JS de inicialização)

**Etapa de origem:** 0 (herdado do plano de migração, achado A12 do diagnóstico original)
**Severidade:** Baixa
**Status:** Aberto

## Descrição

O Bootstrap Tooltip exige inicialização JS explícita (`$('[data-toggle="tooltip"]').tooltip()`) para
funcionar — ela não é automática. O projeto tem 30 ocorrências de `data-toggle="tooltip"` espalhadas
por 9 componentes, e nenhuma inicialização correspondente em nenhum lugar do código. Os únicos
tooltips que de fato funcionam hoje são os 6 que usam `ngbTooltip` (diretiva do `@ng-bootstrap`,
que não depende dessa inicialização jQuery).

Renomear esses atributos para `data-bs-toggle` na Etapa 3 (Bootstrap 4→5) **mantém a inércia atual**
— não cria nem resolve o defeito, só preserva o nome do atributo consistente com a nova versão.

## Evidência

`grep -rc 'data-toggle="tooltip"' src/` — 30 ocorrências, distribuídas em:
`pag-playlist` (4), `musicas` (4), `favoritos` (4), `playlists` (1), `home` (4), `efeitos-sonoros`
(1), `usuario-artista` (3), `artist` (3), `player` (6).

## Ação recomendada

Ticket de UI/UX — não corrigir durante a migração (mudaria comportamento visual, fora do princípio
"a migração preserva a identidade atual"). Candidato natural para `/melhorar-ui-ux` depois da
migração: inicializar os tooltips reais via JS (ou migrar todos para `ngbTooltip`, unificando a
abordagem).

## Referências

Plano de migração, §2 (achado A12) e §3b (Etapa 3, "Achado colateral, fora de escopo").
