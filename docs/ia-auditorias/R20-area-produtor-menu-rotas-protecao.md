# R20 — Área produtor: menu, rotas e proteção

## Relatório do Claude Code

## Resumo da etapa
Etapa 12B do roadmap: garantir que a navegação da área do produtor tenha Dashboard como primeiro
item e links para Assinatura, Pedidos, Dados Pessoais e Formas de Pagamento, respeitando
autenticação e perfil produtor. A auditoria mostrou que a estrutura (rotas, guards, `*ngIf`) já
estava correta; a implementação corrigiu higiene de navegação em `sub-menu` e `menu-produtor`:
`href=""` concorrendo com `routerLink` (causava reload), estado ativo hardcoded (não acompanhava
a rota) e ordem divergente do item "Artista" entre os dois menus.

## Arquivos lidos
- `src/app/sub-menu/sub-menu.component.html`, `.ts`, `.scss`
- `src/app/menu-produtor/menu-produtor.component.html`, `.ts`, `.scss`, `.spec.ts`
- `src/app/app-routing.module.ts`
- `src/app/guards/auth.guard.ts`, `src/app/guards/produtor.guard.ts`
- `src/app/login/auth.service.ts`
- `src/app/menu/menu.component.ts` (uso de `MenuProdutorComponent` no `modalOpen()`), `menu.component.html` e `menu.component.scss` (padrão de referência `routerLinkActive`)
- `src/app/sub-menu/sub-menu.component.spec.ts`
- `docs/ia-auditorias/R20-area-produtor-menu-rotas-protecao.md` (stub anterior)
- Branch `codex/create-musical-producer-dashboard-design` — **somente leitura**, via `git show`, para conferir `sub-menu.component.html` como referência (não mesclada, não copiada)

## Arquivos alterados
- `src/app/sub-menu/sub-menu.component.html`
- `src/app/sub-menu/sub-menu.component.scss`
- `src/app/menu-produtor/menu-produtor.component.html`

## O que foi implementado ou auditado

**Diagnóstico (já correto, não alterado):**
- `app-routing.module.ts`: todas as rotas do escopo existem com guards corretos — `dashboard-produtor`
  → `[AuthGuard, ProdutorGuard]`; `assinatura`, `pedidos`, `formas-de-pagamento`,
  `atualizar-informacoes`, `artista` → `[AuthGuard]`; `dados-pessoais` → `redirectTo:
  'atualizar-informacoes'`.
- `ProdutorGuard` e `AuthGuard` funcionais e sem alteração.
- Dashboard já era o primeiro item em ambos os menus, protegido por `*ngIf="isProdutor"`
  (`AuthService.isProdutor()`, que lê o perfil persistido).
- O modal "Sua Conta" (`MenuProdutorComponent`) só abre para usuário autenticado
  (`menu.component.ts`, método `modalOpen()`).
- Branch `codex/create-musical-producer-dashboard-design` inspecionada em leitura: seu `sub-menu`
  **não tem Dashboard** e chama Dados Pessoais de "Configurações" — versão anterior/desatualizada;
  confirmado que **não deveria** ser copiada, conforme restrição da etapa.

**Correções aplicadas:**
1. **`sub-menu.component.html`** — removido `href=""` dos 6 links que já usavam `[routerLink]`
   (o atributo vazio concorre com o `RouterLink` e causa reload de página, violando a restrição
   "usar `routerLink` para navegação interna"); substituído `class="nav-item active"` fixo em
   Assinatura por `routerLinkActive="active"` em todos os `<li>`, replicando o padrão já usado em
   `menu.component.html`; movido o item "Artista" para o final da lista (alinhando com a ordem do
   modal "Sua Conta").
   Ordem final: Dashboard (produtor) → Assinatura → Pedidos → Dados Pessoais → Formas de Pagamento
   → Artista.
2. **`sub-menu.component.scss`** — adicionada regra para o item ativo (`font-weight` + sublinhado),
   já que `.active` não tinha nenhum estilo associado e o realce de rota não era visível.
3. **`menu-produtor.component.html`** — removido `href=""` dos 2 cards de atalho (Favoritos,
   Playlists) que já usavam `[routerLink]`; substituído `class="nav-item active"` fixo de
   Assinatura por `routerLinkActive="active"` em todos os itens da lista de navegação. Ordem já
   estava correta (Dashboard primeiro) — não alterada.

**Não alterado, registrado como pendência:**
- `<a href="" class="h6 saiba">Saiba mais</a>` no modal "Sua Conta" (link promocional de indicação
  de amigo, sem rota de destino definida) — decisão do usuário durante o planejamento foi registrar
  como pendência de produto em vez de neutralizar nesta etapa.
- `nome: string = 'Wilian Gulini'` hardcoded em `sub-menu.component.ts` e
  `menu-produtor.component.ts` — dívida pré-existente, fora do escopo desta etapa.
- Manipulação direta do DOM (`document.getElementById`, `document.querySelector`) em
  `menu-produtor.component.ts` (`ngAfterContentInit`) — dívida pré-existente, fora do escopo.

## Comandos executados
- [x] git branch --show-current / git status
- [x] npm run build
- [x] npm test

## Resultado dos comandos
- `git branch --show-current`: `dev`. `git status` limpo antes de iniciar (exceto `past_tmp/`,
  não relacionado).
- **Ambiente**: Node ativo por padrão era `v22.18.0`, abaixo do mínimo exigido pela Angular CLI
  (`>=22.22.3`). Os comandos de validação foram executados usando `v24.18.1` (já disponível via
  `nvm` no ambiente), sem alterar a versão padrão do projeto/ambiente.
- `npm run build` (`ng build --configuration=production --base-href /`): **sucesso**. Bundle inicial
  gerado normalmente (~423 kB transferência estimada). Único aviso: depreciação do `@import` do
  Sass em `src/styles.scss:79` — pré-existente, não relacionado a este diff.
- `npm test` (vitest via `@angular/build:unit-test`):
  - **Baseline (antes de editar)**: 54 arquivos de teste, 115 testes, todos passando.
  - **Após as edições**: 54 arquivos de teste, 115 testes, todos passando — nenhuma regressão.
    `sub-menu.component.spec.ts` e `menu-produtor.component.spec.ts` (ambos smoke tests `should
    create`) continuam passando.

## Como validar manualmente
1. `npm start`, logar como **produtor**, abrir `/assinatura`: Dashboard aparece como 1º item do
   sub-menu.
2. Clicar em cada item do sub-menu: navega sem recarregar a página (sem flash/reload, sem novo
   request de documento na aba Rede) e o item da rota atual fica realçado (negrito + sublinhado).
3. "Dados Pessoais" leva a `/atualizar-informacoes`; digitar `/dados-pessoais` na URL redireciona
   para `/atualizar-informacoes`.
4. Logar como **comprador**: item Dashboard não aparece no sub-menu nem no modal; digitar
   `/dashboard-produtor` na URL redireciona para `/home` (`ProdutorGuard`).
5. **Deslogado**: acessar `/assinatura`, `/pedidos` ou `/formas-de-pagamento` abre o modal de login
   (`AuthGuard`), sem navegar para a rota.
6. Clicar no ícone de conta para abrir o modal "Sua Conta": Dashboard aparece primeiro (se
   produtor), os 6 links navegam sem reload e fecham o modal ao clicar.

## Riscos ou pendências
- Link "Saiba mais" (indicação de amigo) no modal "Sua Conta" continua com `href=""` sem rota
  definida — fora do escopo desta etapa por decisão do usuário; recomenda-se decisão de produto
  em etapa futura (rota real ou neutralizar o elemento).
- `nome` hardcoded (`'Wilian Gulini'`) em `sub-menu` e `menu-produtor` — não é regressão desta
  etapa, mas é dado incorreto exibido a qualquer usuário; candidato a correção futura.
- Manipulação direta do DOM em `menu-produtor.component.ts` (`ngAfterContentInit`) — dívida técnica
  pré-existente, fora do escopo.
- Ambiente local com Node abaixo do mínimo exigido pela Angular CLI (`v22.18.0` vs `>=22.22.3`);
  validações desta etapa só foram possíveis usando `v24.18.1` via `nvm`. Recomenda-se atualizar a
  versão padrão do Node do ambiente de desenvolvimento para evitar fricção em tarefas futuras.

## Confirmação de escopo
Alterados apenas os 3 arquivos previstos no roadmap: `sub-menu.component.html`,
`sub-menu.component.scss` e `menu-produtor.component.html`. Nenhuma alteração em
`app-routing.module.ts`, guards, `menu-produtor.component.ts` ou qualquer outro arquivo fora do
escopo da Etapa 12B. Não houve merge, cherry-pick ou cópia da branch
`codex/create-musical-producer-dashboard-design` (usada apenas como leitura de referência).

Status final: **Aprovado**

---

## Revisão do Claude Code

[cole aqui o relatório do Claude Code]

---

## Complemento pós-revisão

[cole aqui o complemento, se houver]

---

## Status final da etapa

Aprovado

## Pendências para etapas futuras

- Definir rota/destino real para o link "Saiba mais" (indicação de amigo) no modal "Sua Conta", ou
  substituí-lo por elemento não navegável.
- Corrigir o nome de usuário hardcoded (`'Wilian Gulini'`) em `sub-menu.component.ts` e
  `menu-produtor.component.ts` para refletir o usuário autenticado real.
- Avaliar remoção da manipulação direta do DOM em `menu-produtor.component.ts`
  (`ngAfterContentInit`).
- Atualizar a versão padrão do Node do ambiente de desenvolvimento para `>=22.22.3` (ou LTS mais
  recente) para alinhar com o mínimo exigido pela Angular CLI.
