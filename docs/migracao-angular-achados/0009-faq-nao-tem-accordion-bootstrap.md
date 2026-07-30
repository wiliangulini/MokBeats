# 0009 — FAQ não usa accordion do Bootstrap (correção de premissa do checklist)

**Etapa de origem:** 3 (Bootstrap 4→5)
**Severidade:** Baixa (nota de execução, não bug)
**Status:** Resolvido (documentado)

## Descrição

O checklist manual da Etapa 3 do plano de migração cita "accordion do FAQ" como uma das telas a
verificar após a troca do Bootstrap. `src/app/faq/faq.component.html` não usa o componente
Accordion do Bootstrap (`data-bs-toggle="collapse"`) — a navegação entre perguntas é uma lista
lateral (`menuLeft`) com `(click)="infoValue(quest.viewValue)"`, mostrando/escondendo seções via
lógica do próprio componente Angular, sem depender de JS do Bootstrap.

O componente Bootstrap `collapse` (37 ocorrências de `data-bs-toggle="collapse"` reais) existe no
projeto, mas em outro lugar: o painel de filtros da página de músicas/efeitos/favoritos/etc.
(`filter.component.html`, "FILTRAR"/"Limpar Filtros"), não no FAQ.

## Evidência

`grep -n 'accordion\|collapse\|ngb' src/app/faq/faq.component.html` — zero ocorrências.
Confirmado visualmente: clicar em `[data-bs-toggle="collapse"]` na rota `/musicas` expande
corretamente o painel de filtros (screenshot `musicas-filtro-toggle.png`, gerada e descartada
durante a verificação desta etapa).

## Ação recomendada

Nenhuma — é só uma correção de rota para o checklist manual. Ao repetir o checklist em etapas
futuras (D1, D3 etc.), verificar o collapse no **filtro de busca** (`filter.component.html`), não no
FAQ.

## Referências

`docs/ia-auditorias/2026-07-30__migracao-angular-etapa-3__claude.md` (a ser criado).
