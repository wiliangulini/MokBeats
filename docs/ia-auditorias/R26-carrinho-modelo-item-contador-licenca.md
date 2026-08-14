# R26 — Carrinho: modelo de item, contador e licença

## Resumo da etapa

Implementada a Etapa 15A na branch `dev` (repositório limpo antes de iniciar, R25 já commitada em `57ef5a3`). O item de carrinho (`CartItem = Musica & CartSelection`, criado na etapa 7C) já exibia música, licença e preço corretamente em `carrinho.component.html`; nenhuma correção foi necessária nesse ponto. O achado real da etapa foi a manipulação direta e frágil do DOM para o contador do carrinho: `CarrinhoService.receivingCart()` escrevia diretamente em `document.querySelector('#ms_number')` a cada item adicionado, e `MenuComponent.onWindowScroll()` repetia a mesma leitura/escrita de DOM a cada evento de scroll — sem nenhum estado Angular/observable centralizando a contagem, em violação direta de `.claude/rules/license-cart-checkout.md` ("Avoid direct DOM state for cart behavior") e `docs/areas/license-cart-checkout.md` ("Não depender de manipulação direta do DOM para estado do carrinho"). Isso foi corrigido introduzindo um `BehaviorSubject`/`Observable` no `CarrinhoService` (mesmo padrão já usado em `AuthService.authStatus$`), consumido reativamente pelo `MenuComponent` via `*ngIf`/interpolação no template. Remoção de item e alteração de quantidade não existiam antes desta etapa e não foram adicionadas (ver "Riscos ou pendências").

## Arquivos lidos

- `src/app/service/carrinho.service.ts`, `src/app/service/carrinho.service.spec.ts`
- `src/app/carrinho/carrinho.component.ts`, `.html`, `.scss`, `.spec.ts`
- `src/app/carrinho/cartModal/cart-modal.component.ts`, `.html`, `.scss`, `.models.ts`, `.spec.ts`
- `src/app/menu/menu.component.ts`, `.html`, `.scss`, `.spec.ts`
- `src/app/login/auth.service.ts` (referência do padrão `BehaviorSubject`/`Observable$` já usado no projeto)
- `src/app/musicas/musicas.service.ts` (integração real do modal de licença → `CarrinhoService.openModalCart`, etapa 7C)
- `src/app/efeitos-sonoros/efeitosSonoros.component.ts`, `.service.ts` (confirma que efeitos sonoros ainda não integram com o carrinho — R16, fora de escopo)
- `src/app/finalizar-compra/*` (apenas leitura, para não confundir com o formulário de checkout embutido em `carrinho.component.html`; rota separada e protegida por `AuthGuard`/`ProfileCompleteGuard`, fora do escopo desta etapa — é o escopo da R27)
- `src/app/app-routing.module.ts` (confirma rotas `carrinho` e `finalizar-compra`)
- `PROJECT_RULES.md` (§2, §9.7/§9.8, §12, §13, §15)
- `AGENTS.md` (§3, §4, §5, §6, §8.11, §10)
- `CLAUDE.md`
- `docs/areas/license-cart-checkout.md`
- `.claude/rules/license-cart-checkout.md`, `.claude/rules/api-contracts.md`
- `docs/ia-auditorias/R24-pricing-toggle-cards-responsivos.md`, `R25-faq-navegacao-visual-responsividade.md` (continuidade e confirmação de estado limpo da `dev`)
- `docs/ia-auditorias/README.md`
- `docs/ia-auditorias/R26-carrinho-modelo-item-contador-licenca.md` (stub original, substituído por este conteúdo)

## Arquivos alterados

- `src/app/service/carrinho.service.ts`
- `src/app/service/carrinho.service.spec.ts`
- `src/app/menu/menu.component.ts`
- `src/app/menu/menu.component.html`
- `src/app/menu/menu.component.spec.ts`
- `docs/ia-auditorias/R26-carrinho-modelo-item-contador-licenca.md` (este relatório)
- `docs/ia-auditorias/README.md` (status do índice: `Modelo` → `Preenchido`)

Não alterados (lidos apenas como referência/confirmação de que já atendiam ao critério de aceite): `carrinho.component.ts`, `carrinho.component.html`, `carrinho.component.scss`, `carrinho.component.spec.ts`, e todo `src/app/carrinho/cartModal/*`.

## O que foi implementado ou auditado

1. **Persistência do carrinho — confirmado e documentado**: `CarrinhoService` é `providedIn: 'root'` com estado 100% em memória (agora num `BehaviorSubject<CartItem[]>`, antes um array simples `music: CartItem[]`). Não há `localStorage`/`sessionStorage` nem chamada a backend. **Limitação real**: o carrinho é perdido em reload de página, fechamento de aba ou nova aba — comentário explicativo adicionado no topo da classe (`carrinho.service.ts:17-19`) apontando para este relatório. Nenhuma persistência foi adicionada nesta etapa (mudança de storage não estava no escopo e alteraria comportamento observável sem validação prévia).

2. **Item do carrinho exibe música, licença, preço e quantidade quando aplicável — auditado, sem necessidade de alteração**: `carrinho.component.html:85-107` já itera `*ngFor="let music of musics"` e exibe `music.nome_musica`, `music.licencaSelecionada.nome`, `music.planoSelecionado.nome` e `formatPrice(music.planoSelecionado.preco)`. **Quantidade**: o modelo `CartItem = Musica & CartSelection` (`cart-modal.models.ts`) não tem campo de quantidade — cada licença é vendida como unidade única (padrão do domínio: uma licença por faixa/projeto, sem múltiplas unidades do mesmo item), e a deduplicação em `isSameCartItem` já impede duplicar o mesmo item (música + licença + plano). "Quantidade" não é aplicável neste modelo de negócio atual; não inventei um campo `quantidade` sem confirmação de regra comercial (`PROJECT_RULES.md §13`).

3. **Contador do carrinho corrigido para usar observable em vez de DOM manual (item central da etapa)**:
   - `CarrinhoService` (`carrinho.service.ts`): substituído o array público `music: CartItem[]` por um `BehaviorSubject<CartItem[]>` privado, expondo `cartItems$: Observable<CartItem[]>` e `cartCount$: Observable<number>` (via `map(items => items.length)`), no mesmo padrão de `AuthService.authStatus$` (`BehaviorSubject` + `.asObservable()`). Removida a leitura/escrita direta de `document.querySelector('#ms_number')` de dentro do service — o service não conhece mais o DOM do header. `receivingCart()` e `receivingCart2()` mantiveram exatamente a mesma assinatura e retorno (`CartItem[]`), preservando compatibilidade com `carrinho.component.ts` (que não precisou de nenhuma alteração).
   - `MenuComponent` (`menu.component.ts`): removidas as 3 ocorrências de `document.querySelector('#ms_number')` (em `ngOnInit`, no corpo de `onWindowScroll`, e a leitura de `music.length` a cada scroll). Adicionada uma subscrição a `cartService.cartCount$` em `ngOnInit`, armazenando o valor em uma propriedade pública `cartCount: number`, com `unsubscribe()` em `ngOnDestroy` (mesmo padrão já usado para `authSubscription`). O listener de scroll (`onWindowScroll`) ficou responsável apenas pelo efeito visual `bg-dark`/`margin-top`, sem nenhuma leitura de carrinho.
   - `menu.component.html`: `<small id="ms_number">0</small>` (sempre renderizado, escondido via `style.display` imperativo) virou `<small id="ms_number" *ngIf="cartCount > 0">{{ cartCount }}</small>` — mantém o mesmo `id` (usado pelo CSS de posicionamento do badge em `menu.component.scss:236` e `:417`, não alterado) mas a visibilidade e o número passam a ser 100% declarativos. Efeito colateral positivo: corrige um pequeno flash do badge mostrando "0" antes do `ngOnInit` esconder via JS, que existia no comportamento anterior.
   - Resultado: o contador agora atualiza **imediatamente** quando um item é adicionado (o `BehaviorSubject` emite de forma síncrona para todos os subscribers, incluindo o `MenuComponent`, que está sempre montado no shell da aplicação), em vez de depender do próximo evento de scroll para ser recalculado — o que é uma melhoria de confiabilidade sobre o comportamento anterior, não apenas uma remoção de DOM manual.

4. **Remoção de item / alteração de quantidade**: auditado — **não existe** nenhuma função de remoção ou alteração de quantidade em `CarrinhoService`, `CarrinhoComponent` ou nos templates atuais (confirmado via busca por `removeItem`/`remover`/`deleteItem` em todo `src/app/carrinho` e `carrinho.service.ts`: nenhuma ocorrência). Conforme a tarefa ("Validar remoção/alteração de quantidade **se já existirem**") e o critério de aceite ("Remover item funciona **se já existia**"), nenhuma funcionalidade nova de remoção foi implementada nesta etapa — isso seria uma feature nova de UI/UX (botão, confirmação, estado), fora do escopo de "revisão" desta etapa e melhor tratada como etapa dedicada. Documentado como pendência abaixo.

5. **Endpoint de pedido**: não implementado, conforme restrição explícita da etapa. `finalizar-compra.component.ts` (rota separada, protegida por `AuthGuard`/`ProfileCompleteGuard`) não foi tocado.

6. **`cart-modal` (modal de seleção de licença)**: não alterado. `cart-modal.component.ts`, `.html`, `.scss` e `cart-modal.models.ts` permanecem exatamente como estavam; `CarrinhoService.openModalCart()` continua chamando o modal da mesma forma, apenas internamente delegando o resultado para o novo `receivingCart()` baseado em `BehaviorSubject`.

## Comandos executados

- [x] `git branch`
- [x] `git status`
- [x] `npm run build`
- [x] `npm test`

## Resultado dos comandos

- `git branch` → `dev` (branch correta). `git status` → limpo antes de iniciar; ao final, apenas os 5 arquivos de código + os 2 arquivos de documentação listados acima como alterados.
- Ambiente local com Node `v22.18.0` como padrão do `nvm`, incompatível com o Angular CLI do projeto (mesma condição já registrada nas R24/R25); reexecutado com `nvm use 24.18.1` (`.nvmrc`).
- `npm run build` (`ng build --configuration=production --base-href /`) → sucesso. Bundle inicial **2,52 MB / 427,30 kB** transferência estimada — equivalente ao baseline da R25 (2,52 MB / 427,37 kB), sem regressão de tamanho. Único aviso: deprecation do Sass `@import` em `src/styles.scss:79`, pré-existente e fora de escopo.
- `npm test -- --watch=false` → **56 arquivos de teste, 144 testes, todos passaram** (141 do baseline da R25 + 3 novos: 1 em `carrinho.service.spec.ts` cobrindo `cartCount$` como observable "quente" que reflete o carrinho sem reload, e 2 em `menu.component.spec.ts` cobrindo o estado inicial do badge e a atualização reativa via `CarrinhoService`). Nenhuma regressão.
- `carrinho.service.spec.ts`: as 4 asserções pré-existentes que liam `document.querySelector('#ms_number')?.textContent` (testando o comportamento de DOM que esta etapa removeu por ser o problema relatado no objetivo) foram atualizadas para ler `cartCount$` via um helper `getCartCount()`, preservando a mesma cobertura de comportamento (contagem correta após adicionar/duplicar/cancelar) sem testar mais a manipulação de DOM que deixou de existir. Nenhum teste foi removido ou desativado sem substituição equivalente — todos os 6 testes originais continuam passando, mais 1 novo teste dedicado ao contrato do observable.

## Como validar manualmente

1. `nvm use 24.18.1 && npm start`, acessar `/#/musicas`, escolher uma música, selecionar licença + plano no modal e confirmar: o badge do carrinho no menu (ícone do carrinho, canto superior) deve aparecer **imediatamente** com "1", sem precisar rolar a página (antes desta correção, o número só era atualizado no próximo evento de `scroll`).
2. Adicionar um segundo item (música/licença/plano diferentes): o badge deve ir para "2" imediatamente.
3. Tentar adicionar exatamente o mesmo item (mesma música + mesma licença + mesmo plano) novamente: o badge deve permanecer no mesmo número (deduplicação já existente, não alterada).
4. Recarregar a página (F5): o badge deve voltar a ficar oculto (carrinho vazio) — comportamento esperado e documentado, pois o carrinho é em memória, sem persistência.
5. Acessar `/#/carrinho`: confirmar que a lista mostra nome da música, nome da licença, nome do plano e preço formatado em R$ para cada item, e que o total (`formatPrice(price)`) soma corretamente os preços dos planos selecionados — comportamento inalterado nesta etapa, apenas reconfirmado.
6. Com o carrinho vazio, acessar `/#/carrinho` diretamente: deve exibir o estado "Seu carrinho está vazio" com botão para `/musicas` (via `routerLink`, inalterado).
7. Rolar a página em `/#/musicas` ou `/#/carrinho` com itens no carrinho: o badge deve continuar mostrando o número correto durante o scroll (o efeito visual `bg-dark` do menu continua funcionando, agora desacoplado da leitura do carrinho).
8. Chrome e Firefox, sem quebra visual do badge (posição/tamanho do círculo do contador inalterados, CSS não tocado).

## Riscos ou pendências

- **Persistência do carrinho continua em memória (`BehaviorSubject` no singleton `providedIn: 'root'`)**: não há `localStorage` nem backend. Isso é uma limitação de produto pré-existente (não introduzida nesta etapa) e está fora do escopo de "revisão de modelo/contador/dados de licença" — adicionar persistência é uma decisão de arquitetura/UX que merece etapa própria e validação humana, especialmente por interagir com o fluxo de checkout (R27) e com a decisão de exigir login antes de adicionar ao carrinho ou não.
- **Nenhuma função de remoção de item ou alteração de quantidade foi criada**: confirmadas como inexistentes antes desta etapa; não implementadas agora porque a tarefa e o critério de aceite condicionam essa validação a "se já existirem". Recomendo que a etapa de checkout (R27) — que já vai mexer no fluxo de revisão do carrinho antes do pagamento — inclua a decisão de produto sobre remoção de item (esperado no fluxo padrão de qualquer carrinho de compras) e, se aplicável, quantidade.
- **Duplicação de fonte de preços entre `licenca-valor` e `cart-modal`, já sinalizada na R24**: `cart-modal.component.ts` mantém seus próprios `licenseOptions`/`commercialPlanOptions` com preços hardcoded (`49.99`, `199.99`, `249.99`), independentes dos preços exibidos em `/precos` (`licenca-valor.models.ts`). Não fazem parte desta etapa (que é sobre modelo de item/contador, não sobre unificação de fonte de preço) — mantida como pendência para uma etapa futura dedicada, evitando alterar valores/contratos sem validação comercial (`PROJECT_RULES.md §13`).
- **Duplicidade estrutural entre `carrinho.component` e `finalizar-compra.component`**: `carrinho.component.html` já contém um formulário completo de checkout ("Finalizar a compra", endereço, forma de pagamento, termos) na rota pública `/carrinho`, enquanto existe uma rota separada e protegida `/finalizar-compra` (`AuthGuard` + `ProfileCompleteGuard`) com propósito aparentemente sobreposto. Isso é a duplicidade que a regra de domínio já alerta ("Evitar duplicidade entre carrinho e finalizar compra"). Não investiguei nem alterei `finalizar-compra.component.ts` em profundidade — está fora do escopo desta etapa e é, pelo nome do índice, o escopo da R27 ("Checkout — fechamento de pedido"). Fica registrado aqui como contexto para quem for executar a R27.
- **`CarrinhoComponent` ainda lê o carrinho apenas uma vez (`ngOnInit` → `receivingCart2()`)**, sem se inscrever em `cartItems$`. Isso não é um bug nesta etapa (a rota `/carrinho` recria o componente a cada navegação, então a lista sempre reflete o estado atual ao entrar na página) e foi uma escolha deliberada para manter o diff mínimo e não quebrar `carrinho.component.spec.ts`. Se uma etapa futura adicionar remoção/alteração de item diretamente na página do carrinho (sem navegar para fora e voltar), `CarrinhoComponent` deverá passar a se inscrever em `cartItems$` para refletir mudanças em tempo real — a infraestrutura (`cartItems$`) já foi deixada pronta para isso nesta etapa.

## Confirmação de escopo

Alterados **somente** arquivos dentro do escopo da Etapa 15A: `CarrinhoService` (+ seu spec), `MenuComponent` (`.ts`, `.html`, + seu spec) — este último por ser o consumidor direto e único do contador do carrinho fora do próprio service (`#ms_number`), e por isso parte inseparável da correção "evitar manipulação direta frágil do contador" pedida no objetivo — e a documentação de continuidade (`docs/ia-auditorias/R26-*.md` e `README.md` do índice). Não foi necessário alterar `carrinho.component.*` nem nenhum arquivo de `src/app/carrinho/cartModal/*` — ambos foram lidos e auditados, mas já atendiam aos critérios de aceite relacionados a exibição de música/licença/preço e ao fluxo do modal. Não houve necessidade de sair do escopo declarado.

## Status final da etapa

Aprovado com observações

O carrinho lista itens com licença escolhida corretamente (já atendia, confirmado), o preço/total não quebra com licença presente (inalterado, confirmado por teste), o contador do menu agora atualiza de forma imediata e reativa via `Observable` do `CarrinhoService` — sem nenhuma leitura/escrita direta de DOM restante em `carrinho.service.ts` ou `menu.component.ts` para esse fim —, e build + suíte completa de testes passam sem regressão (144 testes, 3 novos cobrindo o contrato reativo). A observação fica por conta de duas pendências de produto explicitamente fora do escopo desta etapa e já documentadas acima: ausência de remoção/quantidade no carrinho (nunca existiu, não pedida para ser criada agora) e a persistência 100% em memória do carrinho (limitação pré-existente, apenas documentada, não resolvida).
