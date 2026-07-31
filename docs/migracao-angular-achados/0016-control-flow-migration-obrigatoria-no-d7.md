# 0016 — Migração de control-flow (`@if`/`@for`/`@switch`) rodou como obrigatória no D7, revertida

**Etapa de origem:** 10 (D7 — Angular/Material 21, checkpoint)
**Severidade:** Baixa (decisão de escopo, não bug técnico)
**Status:** Resolvido (`mig/d7`) — revertido manualmente

## Descrição

No degrau D6 (Etapa 9), a migração `ng update @angular/core@20` ofereceu a conversão de
`*ngIf`/`*ngFor`/`*ngSwitch` para a sintaxe de control flow (`@if`/`@for`/`@switch`) como migração
**opcional** (`ng update @angular/core --name control-flow-migration`), e a decisão registrada no
relatório da Etapa 9 foi não executá-la — mudança de sintaxe ampla e visível, fora do escopo de
"preservar comportamento" desta migração de versões.

No degrau D7 (`ng update @angular/core@21`), a **mesma migração rodou automaticamente como
obrigatória** (listada em "Executing migrations of package '@angular/core'", não em "Optional
migrations"), convertendo **28 arquivos de template** (incluindo `carrinho.component.html`,
`finalizar-compra.component.html`, `dashboard-produtor.component.html`, `produtores.component.html`
— o formulário de upload —, `login.component.html`, `player.component.html`, entre outros) para a
nova sintaxe, com reformatação estrutural de indentação em todo o arquivo.

Confirmado via CHANGELOG oficial do Angular 21 que `ngIf`/`ngFor`/`ngSwitch` seguem apenas
**depreciados** (não removidos) — a migração não era necessária para compatibilidade, apenas
modernização de sintaxe.

## Evidência

Saída do `ng update @angular/core@21`: bloco "❯ Converts the entire application to block control
flow syntax." aparece fora da seção "Optional migrations", com "Migration completed (28 files
modified)." — sem opção de recusa via prompt, diferente do comportamento observado no D6 para a
mesma migração nomeada.

## Ação recomendada

Revertidos os 28 arquivos (`git checkout --`) para a sintaxe `*ngIf`/`*ngFor`/`*ngSwitch` original,
mantendo o restante do degrau (bump de versões, `provideZoneChangeDetection`, `moduleResolution`).
Consistente com a decisão já registrada na Etapa 9 e com o escopo do plano ("Fora de escopo:
Adotar... como refatoração").

**Atenção para degraus futuros (D8):** confirmar se essa migração é oferecida novamente como
obrigatória ou opcional, e reverter se necessário, mantendo a consistência desta decisão até que o
projeto decida adotar a nova sintaxe como tarefa própria (fora desta migração de versões).

## Referências

`docs/ia-auditorias/2026-07-31__migracao-angular-etapa-10__claude.md`,
`docs/ia-auditorias/2026-07-31__migracao-angular-etapa-9__claude.md` (decisão original de recusa).
