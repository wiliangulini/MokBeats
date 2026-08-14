# R24 — Pricing: toggle e cards responsivos

## Resumo da etapa

Implementada a Etapa 14A na branch `dev`, repositório limpo antes de iniciar (R23 já commitada em `dce1e7c`). O toggle 6/12 meses do card "Licenças de Músicas" (rota `/precos`) passou a ser estado Angular real, os 3 blocos de tabs Bootstrap com `href=""` foram substituídos por `<button>` acessíveis, e o breakpoint responsivo que quebrava os 3 cards em larguras de tablet (768–1024.98px, gerando um layout "2 + 1 órfão") foi corrigido para empilhar em coluna única de 576px a 991.98px.

## Arquivos lidos

- `src/app/licenca-valor/licenca-valor.component.html`
- `src/app/licenca-valor/licenca-valor.component.ts`
- `src/app/licenca-valor/licenca-valor.component.scss`
- `src/app/licenca-valor/licenca-valor.component.spec.ts`
- `src/app/app-routing.module.ts` (rota `/precos`)
- `src/app/app.module.ts` (declaração do componente, confirma ausência de `CommonModule` dedicado — módulo raiz)
- `src/app/faq/faq.component.html` (referência de uso de `*ngFor` no mesmo módulo)
- `src/app/carrinho/cartModal/cart-modal.models.ts` e `cart-modal.component.ts` (única fonte tipada de preços do projeto — `CommercialPlanOption` com 199.99/249.99 para 6/12 meses, usada como referência para não divergir valores)
- `src/app/dashboard-produtor/dashboard.models.ts` e `dashboard-produtor.component.ts` (padrão de array tipado `{ value, label }[]` e ausência de uso de Signals no projeto — mantida consistência de estilo: propriedades + métodos comuns, sem `signal()`)
- `PROJECT_RULES.md` (§2, §9.7/§9.8, §12, §13, §15)
- `AGENTS.md` (§3, §4, §5, §6, §8, §10)
- `CLAUDE.md`
- `docs/areas/license-cart-checkout.md`
- `docs/areas/identidade-visual-ux.md`
- `docs/areas/padrao-implementacao.md`
- `docs/areas/validacao-qa.md`
- `.claude/rules/license-cart-checkout.md`
- `docs/ia-auditorias/R24-pricing-toggle-cards-responsivos.md` (stub original, substituído por este conteúdo)

## Arquivos alterados

- `src/app/licenca-valor/licenca-valor.component.ts`
- `src/app/licenca-valor/licenca-valor.component.html`
- `src/app/licenca-valor/licenca-valor.component.scss`
- `src/app/licenca-valor/licenca-valor.models.ts` (novo arquivo)
- `docs/ia-auditorias/R24-pricing-toggle-cards-responsivos.md` (este relatório)

## O que foi implementado ou auditado

1. **Novo arquivo `licenca-valor.models.ts`** — tipos e constantes de preço isolados do componente, seguindo o padrão já usado em `dashboard.models.ts` (array tipado `{ value, label }[]` + `Record` por chave):
   - `PeriodoLicencaMusica = '6' | '12'`
   - `PERIODOS_LICENCA_MUSICA`: array usado no `*ngFor` do toggle.
   - `OpcaoLicencaMusica`: interface com `precoLabel`, `periodoLabel`, `comparativoLabel`.
   - `LICENCAS_MUSICA_POR_PERIODO`: valores de 6 e 12 meses. **Mantidos os mesmos valores já existentes no HTML anterior (R$199,99 / R$249,99)**, que também são os valores canônicos já usados em `cart-modal.component.ts` (`CommercialPlanOption`) — não foi inventado nenhum preço novo. Comentário no topo do arquivo marca os valores como temporários/configuráveis, remetendo a `PROJECT_RULES.md §13`.

2. **`licenca-valor.component.ts`** — adicionado estado real:
   - `periodosLicencaMusica` (readonly, da constante).
   - `periodoLicencaMusicaSelecionado: PeriodoLicencaMusica = '6'` (estado do toggle).
   - `get licencaMusicaAtual()` — deriva preço/período/comparativo do período selecionado.
   - `selecionarPeriodoLicencaMusica(periodo)` — troca o estado ao clicar.
   - Nenhuma outra lógica do componente foi tocada (`ScrollService`, `ngOnInit`, `ChangeDetectionStrategy.Eager`, `standalone: false` preservados).

3. **`licenca-valor.component.html`** — 3 blocos de tabs corrigidos:
   - Card "Assinatura Mensal" (`#myTab`, 1 aba "Mensalmente"): `<a href="" data-bs-toggle="tab">` → `<button type="button">` com `role="tab"`/`aria-selected`. Não há alternância real aqui (só uma opção), então não recebeu `(click)`.
   - Card "Licenças de Músicas" (`#myTab1`, o toggle real 6/12 meses): as duas âncoras fixas foram substituídas por um `*ngFor` sobre `periodosLicencaMusica`, renderizando `<button>` com `[class.active]`, `[attr.aria-selected]` e `(click)="selecionarPeriodoLicencaMusica(periodo.value)"`. O bloco de preço abaixo (`R$199,99`, `/6 meses`, texto comparativo) passou a usar interpolação (`{{ licencaMusicaAtual.precoLabel }}`, etc.) em vez de texto fixo.
   - Card "Licenças de Efeitos Sonoros" (`#myTab2`, 1 aba "Vitalício"): mesmo tratamento do card 1 (`<a href="">` → `<button>`).
   - Nenhum outro trecho do HTML (seção de comparação de licenças, tabela, FAQ, footer) foi alterado.

4. **`licenca-valor.component.scss`**:
   - Seletores das tabs (`#myTab .nav-item a`, etc.) estendidos para também cobrir `button` (mantendo `a` por segurança/compatibilidade, embora não haja mais `<a>` nesses blocos), com reset de `background-color: transparent`, `font-family: inherit`, `border: none` (já existia) e `cursor: pointer` para que os `<button>` não herdem o estilo nativo de botão do navegador.
   - Corrigido o breakpoint `@media (min-width: 768px) and (max-width: 1024.98px)`, que forçava os 3 cards a `max-width: 48%` — com 3 elementos numa linha `flex-wrap`, isso produzia 2 cards na primeira linha e o terceiro sozinho e estreito na segunda (layout quebrado em tablets). Substituído por `@media (min-width: 576px) and (max-width: 991.98px)` com os cards em coluna única (`flex: 0 0 100%`) e `margin-bottom` entre eles — faixa alinhada ao breakpoint já existente que remove os `transform: scale(...)` de destaque (`max-width: 991.98px`). Isso também cobre a faixa 576–767.98px, que antes não tinha nenhuma regra dedicada e caía no layout desktop de 32,5% de largura (cards espremidos).
   - Nenhuma outra regra, cor, fonte ou seção do SCSS foi alterada.

## Comandos executados

- [x] `git branch` / `git status`
- [x] `npm run build`
- [x] `npm test`

## Resultado dos comandos

- `git branch` → `dev` (branch correta). `git status` → limpo antes de iniciar; ao final, apenas os arquivos listados acima como alterados/novos.
- `npm run build` → **falhou inicialmente** com o Node ativo por padrão (`v22.18.0`): `The Angular CLI requires a minimum Node.js version of v22.22.3 or v24.15.0 or v26.0.0.` Isso é uma condição pré-existente do ambiente (não causada por esta etapa) — o projeto já define `.nvmrc` com `24.18.1`. Reexecutado com `nvm use 24.18.1` (versão já instalada localmente): **build concluído com sucesso** (`Application bundle generation complete`, bundle inicial 2.51 MB / 427.43 kB transferência estimada). Único aviso: deprecation do Sass `@import` em `src/styles.scss:79`, pré-existente e fora do escopo desta etapa.
- `npm test` → o script `ng test` não aceita `--run`; reexecutado com a flag correta do Angular CLI (`--watch=false`), também sob Node 24.18.1. **56 arquivos de teste, 137 testes, todos passaram**, incluindo `licenca-valor.component.spec.ts` (1 teste) e a suíte completa do projeto (player, carrinho, dashboard-produtor, efeitos sonoros, etc.) — nenhuma regressão introduzida.

## Como validar manualmente

1. Rodar `nvm use 24.18.1 && npm start`, acessar `/#/precos`.
2. No card central "Licenças de Músicas / Por Tempo Determinado", clicar em "12 meses": o preço deve mudar de `R$199,99 /6 meses` para `R$249,99 /12 meses` e o texto comparativo deve trocar, **sem reload da página** (URL não deve mudar, sem "pulo" de scroll). Clicar de volta em "6 meses" deve reverter.
3. Inspecionar o HTML renderizado (DevTools) e confirmar que não há mais `href=""` nos 3 blocos de tabs (`#myTab`, `#myTab1`, `#myTab2`) — agora são `<button>`.
4. Testar responsividade no DevTools (ou redimensionando a janela) nas larguras: ~1440px (desktop), ~1024–1280px (notebook), ~768–991px e ~600–767px (tablet), ~375–414px (celular). Confirmar que os 3 cards nunca ficam com um card "sozinho e estreito" numa segunda linha — na faixa 576–991.98px eles empilham em coluna única; abaixo de 576px, comportamento inalterado (já funcionava); acima de 991.98px, layout de 3 colunas com destaque central inalterado.
5. Testar em Chrome e Firefox (conforme critério de aceite) — nenhuma mudança de biblioteca ou API específica de navegador foi introduzida, mas vale conferir visualmente os botões de tab (background transparente, texto legível, estado ativo roxo `#4b3a8f`).
6. Confirmar que os cards 1 ("Assinatura Mensal") e 3 ("Efeitos Sonoros") continuam exibindo sua única aba normalmente (agora como botão, visualmente idêntica a antes).

## Riscos ou pendências

- **Preços ainda temporários/fictícios** (já eram antes desta etapa) — `PROJECT_RULES.md §13` exige validação humana para valores reais de licença. Marcado explicitamente no novo `licenca-valor.models.ts`.
- **Divergência de preço pré-existente e fora de escopo**: `src/app/assinatura/assinatura.component.html` exibe `R$64,95` para o plano mensal, enquanto `licenca-valor` (`R$49,99`) e `cart-modal.component.ts` (`49.99`) usam outro valor. Não foi tocado por não fazer parte do escopo da Etapa 14A (arquivo fora da lista de arquivos prováveis/permitidos); registrar como pendência para uma etapa futura de unificação de preços.
- Botões "ASSINE JÁ" (3×) continuam sem `(click)`/`routerLink` — comportamento pré-existente, fora do escopo definido para esta etapa (que tratou apenas do toggle 6/12 e responsividade dos cards).
- O ambiente local tem Node `v22.18.0` como padrão do `nvm`, incompatível com o Angular CLI do projeto (`.nvmrc` pede `24.18.1`); os comandos de validação só funcionaram após `nvm use 24.18.1` manual. Isso é uma condição de ambiente pré-existente, não uma regressão desta etapa, mas fica registrado para não repetir a investigação em etapas futuras.
- Cursor `pointer` foi aplicado uniformemente aos três blocos de tabs por simplicidade de seletor CSS; nos cards com aba única (1 e 3) isso sinaliza visualmente uma interatividade que não existe (não há segunda opção para alternar). Impacto visual mínimo, não bloqueante.

## Confirmação de escopo

Alterados **somente** arquivos dentro do escopo da Etapa 14A: os 3 arquivos do componente `licenca-valor` (`.html`, `.ts`, `.scss`), um novo arquivo de modelos/constantes de preço colocado na mesma pasta (`licenca-valor.models.ts` — explicitamente previsto no escopo como "modelos/constantes de preço se existirem"), e este relatório. Nenhuma rota, guard, service, módulo global, outro componente ou dependência foi alterado. Não houve necessidade de sair do escopo declarado.

---

## Execução — 2026-08-14

### Resumo da etapa

Auditoria identificou que a implementação da Etapa 14A registrada acima (commit `7bb0b15`) estava correta no núcleo, mas com 4 gaps residuais dentro do próprio escopo: uma regressão de CSS introduzida pela própria R24 (breakpoint mobile das tabs não acompanhou a troca `<a>`→`<button>`), semântica ARIA falsa nas duas abas de item único, preços dos cards 1 e 3 ainda hardcoded no HTML (só o card 2 tinha sido isolado no `models.ts`), e ausência de teste para o toggle. Este fechamento corrige os 4 pontos, sem alterar o comportamento visual nem os valores de preço. O relatório original acima também não continha "Status final da etapa" (perdido ao substituir o stub) — adicionado ao fim desta seção.

### Arquivos lidos

- `src/app/licenca-valor/licenca-valor.component.html`, `.ts`, `.scss`, `.models.ts`, `.component.spec.ts` (estado pós-`7bb0b15`)
- `src/app/service/scroll.service.ts` (confirmar ausência de dependências para o novo spec)
- `src/test.ts` (setup global de teste — `RouterTestingModule`, `NO_ERRORS_SCHEMA` já injetados)
- `docs/ia-auditorias/README.md`
- `.claude/rules/license-cart-checkout.md`
- `docs/areas/license-cart-checkout.md`, `docs/areas/identidade-visual-ux.md`

### Arquivos alterados

- `src/app/licenca-valor/licenca-valor.component.html`
- `src/app/licenca-valor/licenca-valor.component.scss`
- `src/app/licenca-valor/licenca-valor.component.ts`
- `src/app/licenca-valor/licenca-valor.models.ts`
- `src/app/licenca-valor/licenca-valor.component.spec.ts`
- `docs/ia-auditorias/R24-pricing-toggle-cards-responsivos.md` (esta seção)
- `docs/ia-auditorias/README.md`

### O que foi implementado ou auditado

1. **CSS mobile das tabs (`≤575.98px`)**: os seletores que reduziam a fonte do toggle para `16px` miravam só `.nav-item a`, elemento que não existe mais desde a conversão para `<button>`/`<span>` — CSS morto, regressão da própria R24. Estendido para `a`, `button` e `span` nos 3 blocos (`#myTab`, `#myTab1`, `#myTab2`).
2. **A11y das abas de item único (`#myTab` "Mensalmente" e `#myTab2` "Vitalício")**: anunciavam `role="tablist"`/`role="tab"`/`aria-controls="home"` para um painel (`id="home"`) que nunca existiu, e eram focáveis via `<button>` sem executar nenhuma ação. Convertidos para `<span class="nav-link active">` (rótulo estático, fora do tab-order), com `cursor: default`. O toggle real (`#myTab1`) passou do padrão tab falso para o padrão ARIA correto de grupo de alternância: `role="group"` + `aria-label="Período da licença"` no `<ul>`, `[attr.aria-pressed]` nos botões (no lugar de `aria-selected`, que pressupõe `tablist`).
3. **Preços dos cards 1 e 3 isolados no modelo**: adicionados `LicencaPrecoUnico`, `ASSINATURA_MENSAL` (`R$49,99 /mês`) e `LICENCA_EFEITOS_SONOROS` (`R$4,99 /vitalício`) a `licenca-valor.models.ts`, sob o mesmo aviso de valores temporários/configuráveis (§13). Componente reexpõe como `readonly assinaturaMensal`/`readonly licencaEfeitosSonoros`; HTML interpola preço, período e rótulo da aba — nenhum valor mudou, só a fonte. Agora os 3 cards seguem o mesmo padrão do card 2.
4. **Teste do toggle**: `licenca-valor.component.spec.ts` ganhou 4 casos — estado inicial `'6'`, troca para `'12'` via `selecionarPeriodoLicencaMusica`, clique real no segundo `<button>` de `#myTab1` confirmando que o preço no DOM muda após `detectChanges()` (evidência do critério "sem reload"), e renderização dos preços dos cards 1/3 a partir das novas constantes.
5. Consolidados dois `@media` redundantes e sobrepostos (`max-width: 992px` e `max-width: 991.98px`, ambos afetando os mesmos cards) em um único bloco `991.98px`, alinhado ao breakpoint Bootstrap 5 já usado no resto do arquivo.

Fora de escopo, mantido como pendência (decisão do usuário): botões "ASSINE JÁ" sem ação — destino depende de definição comercial (§13).

### Comandos executados

- [x] `git status`
- [x] `npm run build`
- [x] `npm test -- --watch=false`

### Resultado dos comandos

- `git status` → branch `dev`, working tree limpo antes de iniciar (apenas os arquivos desta seção alterados ao final).
- `nvm use 24.18.1` necessário (padrão do ambiente é `v22.18.0`, incompatível com o Angular CLI do projeto — mesma condição já registrada na execução anterior).
- `npm run build` → sucesso. Bundle inicial **2,52 MB / 427,29 kB** transferência estimada — equivalente ao baseline da execução anterior (2,51 MB / 427,43 kB), sem regressão de tamanho. Único aviso: deprecation do Sass `@import` em `src/styles.scss:79`, pré-existente e fora de escopo.
- `npm test -- --watch=false` → **56 arquivos de teste, 141 testes, todos passaram** (137 do baseline + 4 novos em `licenca-valor.component.spec.ts`, que agora tem 5 testes). Nenhuma regressão.

### Como validar manualmente

1. `nvm use 24.18.1 && npm start`, acessar `/#/precos`.
2. Reduzir a janela para ≤575px (ou emular um celular no DevTools): confirmar que o texto dos dois botões do toggle central ("6 meses" / "12 meses") fica visivelmente menor (16px) que em desktop — antes desta correção permanecia em 20px.
3. Passar o mouse sobre "Mensalmente" (card 1) e "Vitalício" (card 3): o cursor deve ser o padrão (seta), não a mãozinha de link/botão. Pressionar Tab a partir do topo da página: o foco deve pular direto para os dois botões reais do toggle central, sem parar em "Mensalmente" ou "Vitalício".
4. Confirmar visualmente que os preços R$49,99/mês (card 1) e R$4,99/vitalício (card 3) permanecem idênticos a antes.
5. Repetir a alternância 6/12 meses do relatório anterior (item 2 da seção "Como validar manualmente" acima) — comportamento inalterado.
6. Chrome e Firefox, sem quebra visual.

### Riscos ou pendências

- Preços continuam temporários/fictícios (§13), agora isolados em `licenca-valor.models.ts` nos 3 cards.
- Divergência de preço pré-existente com `assinatura.component.html` (R$64,95) e duplicação de fonte com `cart-modal.component.ts`/`cart-modal.models.ts` (valores numéricos) seguem sem unificação — seguem fora de escopo, candidatas à etapa R26 (carrinho).
- `zoom: 90% !important` (linha ~401, faixa 1440–1600px) é propriedade não padronizada; não foi tocada por estar fora do escopo dos gaps identificados, mas fica sinalizada.
- Botões "ASSINE JÁ" (3×) seguem sem `(click)`/`routerLink`, por decisão explícita de deixar como pendência até haver definição comercial/endpoint de checkout.

## Status final da etapa

Aprovado

Toggle 6/12 meses funciona como estado Angular real e sem reload (evidenciado por teste de DOM), os 3 blocos de tabs não têm `href` vazio, os 3 cards têm preços isolados em arquivo tipado e marcados como temporários, a regressão de CSS mobile introduzida na execução original foi corrigida, e build + suíte completa de testes passam sem regressão.
