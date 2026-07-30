# R03 — Etapa 3 — Comparação técnica `dev` x branch Dashboard

## Relatório do Codex

## Resumo da etapa

Comparação técnica concluída sem implementação. A branch `codex/create-musical-producer-dashboard-design` não deve ser mesclada diretamente: ela remove guards, remove `DashboardService`, apaga `src/app/dashboard-produtor/*`, cria `src/app/produtor-dashboard/*`, usa mocks estáticos e adiciona `ng-apexcharts`.

Estratégia segura: manter a arquitetura da `dev`, preservar `/dashboard-produtor` em `src/app/dashboard-produtor`, reaproveitar apenas ideias visuais pontuais da branch codex.

## Arquivos lidos

- `PROJECT_RULES.md`
- `AGENTS.md`
- `CLAUDE.md`
- `package.json`
- `src/app/app-routing.module.ts`
- `src/app/app.module.ts`
- `src/app/dashboard-produtor/*`
- `src/app/sub-menu/*`
- `src/app/menu-produtor/*`
- `codex/create-musical-producer-dashboard-design:package.json`
- `codex/create-musical-producer-dashboard-design:src/app/app-routing.module.ts`
- `codex/create-musical-producer-dashboard-design:src/app/app.module.ts`
- `codex/create-musical-producer-dashboard-design:src/app/produtor-dashboard/*`
- `codex/create-musical-producer-dashboard-design:src/app/sub-menu/*`
- `codex/create-musical-producer-dashboard-design:src/app/menu-produtor/*`

## Arquivos alterados

- Nenhum.

## O que foi implementado ou auditado

- Rota `/dashboard-produtor`: manter da `dev`, com `DashboardProdutorComponent`, `AuthGuard` e `ProdutorGuard`.
- `app.module.ts`: manter imports/providers da `dev`, especialmente `AuthInterceptor`; não copiar `NgApexchartsModule` agora.
- Menus: manter regra da `dev` que exibe Dashboard apenas para produtor. Pendência futura: remover `href=""` dos links internos.
- Dados: manter `DashboardService` real da `dev`; descartar mocks permanentes da codex.
- Matriz:
  - Manter da `dev`: rota, guards, service, DTOs, loading/erro, período, tabela dinâmica.
  - Adaptar da codex: visual escuro, cards KPI, layout de tabela, barra de filtros, espaçamentos.
  - Descartar da codex: `produtor-dashboard`, mocks estáticos, remoção de guards, remoção de services, botões sem ação, dependência de gráficos no MVP.
- Gráficos: ficam como placeholders controlados no MVP. `ng-apexcharts` só deve entrar depois com justificativa e compatibilidade Angular 14 validada.
- Plano: implementar evolução visual em `src/app/dashboard-produtor`, sem criar `src/app/produtor-dashboard`.

## Comandos executados

- [x] git status
- [x] npm run build
- [x] npm test

## Resultado dos comandos

- `git branch`: branch atual `dev`.
- `git status`: `dev` está ahead 1; há arquivos não rastreados em `docs/ia-auditorias/*`. Não foram alterados por esta etapa.
- `npm run build`: passou.
- `npm test`: falhou com 9 falhas em 84 specs:
  - 7 falhas em `LoginComponent` com `TypeError: Cannot read properties of undefined (reading 'root')`.
  - 2 falhas em `ProdutoresComponent` relacionadas a chamada esperada de `UploadFileService.uploadProducerTrack`.
  - Falhas fora do escopo da comparação da dashboard.

## Como validar manualmente

1. Acessar `/#/dashboard-produtor` autenticado como produtor e confirmar que a rota permanece protegida.
2. Acessar com perfil comprador ou sem login e confirmar bloqueio por guards.
3. Verificar que dados do dashboard vêm de `/api/dashboard/*` via `DashboardService`.
4. Conferir menu/sub-menu: Dashboard aparece apenas para produtor.

## Riscos ou pendências

- Branch codex não é compatível para merge direto.
- `ng-apexcharts` adicionaria dependências novas e deve ficar fora do MVP.
- Menus ainda têm `href=""` em alguns links internos; corrigir em etapa própria.
- A branch codex possui botões visuais sem ação real, como exportar, filtros avançados e suporte.

## Confirmação de escopo

Não alterei arquivos. A etapa foi somente leitura/auditoria dentro do escopo solicitado.

---

## Revisão do Claude Code

Revisão Claude Code — Etapa 3 — Comparação técnica dev x branch Dashboard
Classificação final
Aprovado com observações

Resumo da revisão
git diff e git status confirmam que zero arquivos foram modificados pela Etapa 3 — comportamento correto para uma etapa de auditoria pura. A estratégia definida pelo Codex está tecnicamente sã.

Pontos aprovados
Rota /dashboard-produtor mantém canActivate: [AuthGuard, ProdutorGuard] — guards intactos
DashboardService identificado corretamente como canônico — 5 endpoints reais contra /api/dashboard/*
DTOs completos em dashboard.models.ts — DashboardSummary, TrackSales, SalesByOrigin, RevenueByTrack, LikesVsSalesPoint
Funções formatBRL e formatCompact já existem e já estão expostas no componente — reutilizáveis na Etapa 4 sem código novo
ng-apexcharts corretamente adiado — compatibilidade com Angular 14 não validada
Decisão de manter src/app/dashboard-produtor (não criar src/app/produtor-dashboard) alinhada com CLAUDE.md §6.6
AuthInterceptor intacto no app.module.ts
Problemas encontrados
Importantes — alertas para Etapa 4
[CRÍTICO] Branch codex remove*ngIf="isProdutor" do link Dashboard em menu-produtor.component.html

dev: <li class="nav-item" *ngIf="isProdutor"> — link invisível para compradores ✅
codex: <li class="nav-item"> sem guarda — link visível para qualquer perfil logado ⚠️
O guard de rota ainda bloqueia o acesso, mas o link aparece no menu de comprador — UX incorreta e vazamento de informação de UI
Ao copiar o visual da codex na Etapa 4: preservar obrigatoriamente o*ngIf="isProdutor"
[IMPORTANTE] Branch codex renomeia "Dados Pessoais" → "Configurações" — mudança de produto sem validação. Não replicar.

Menores (pré-existentes, fora do escopo)
sub-menu.component.ts: nome = 'Wilian Gulini' hardcoded — não lê o perfil autenticado
sub-menu.component.html: todos os <a> combinam href="" com [routerLink] — causa scroll-to-top
menu-produtor.component.ts: manipulação direta de DOM via document.querySelector
Matriz final: manter / adaptar / descartar
Item Decisão
Rota + guards Manter da dev
DashboardProdutorComponent em src/app/dashboard-produtor/ Manter da dev
DashboardService + DTOs + funções de formato Manter da dev
Loading / error / filtro de período Manter da dev
Visual escuro, cards KPI, layout de tabela da codex Adaptar (inspiração visual)
src/app/produtor-dashboard/ Descartar — não criar
Mocks estáticos da codex Descartar
NgApexchartsModule / gráficos Descartar no MVP
Remoção de *ngIf="isProdutor" no menu Descartar — risco de UX
Botões sem ação (exportar, suporte) Descartar
Resultado dos comandos
git status: branch dev, ahead 1, nenhum arquivo modificado ✅
npm run build: passou ✅
npm test: 9 falhas pré-existentes (LoginComponent + ProdutoresComponent), nenhuma relacionada ao dashboard ✅
Observações finais
A Etapa 3 está aprovada. O maior risco identificado para a Etapa 4 é a cópia inadvertida do menu-produtor.component.html da codex sem o*ngIf="isProdutor" — esse ponto deve constar explicitamente no contrato de aceite da próxima etapa.

---

## Complemento pós-revisão

Não foi executado prompt de Correção pós-revisão do Codex.

Justificativa: o Claude Code classificou a R03 como "Aprovado com observações", sem bloqueadores e sem correções objetivas exigidas dentro do escopo da etapa. A R03 foi uma etapa de comparação técnica/somente leitura e nenhum arquivo de aplicação foi alterado.

As observações do Claude devem ser carregadas como restrições para as próximas etapas:

- preservar obrigatoriamente `*ngIf="isProdutor"` ao mexer no menu do produtor;
- não copiar da branch codex a remoção da proteção visual do link Dashboard;
- não replicar a mudança "Dados Pessoais" → "Configurações" sem validação de produto;
- tratar `href=""` e manipulação direta de DOM em etapa própria, não nesta R03.

## Status final da etapa

Aprovado com observações

## Pendências para etapas futuras

- Na etapa de implementação visual da Dashboard, adaptar apenas ideias visuais da branch codex, mantendo `src/app/dashboard-produtor`, `DashboardService`, guards e dados reais.
- Ao alterar `menu-produtor.component.html`, preservar `*ngIf="isProdutor"` no link Dashboard.
- Não criar `src/app/produtor-dashboard`.
- Não adicionar `ng-apexcharts` no MVP sem validação explícita de compatibilidade com Angular 14.
- Corrigir `href=""` e manipulação direta de DOM apenas em etapa própria.

---

## Status final da etapa

Aprovado com observações

## Pendências para etapas futuras

- ...
