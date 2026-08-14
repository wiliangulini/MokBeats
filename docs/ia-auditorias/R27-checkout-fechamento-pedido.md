# R27 — Checkout: fechamento do pedido

## Resumo da etapa

Implementada a Etapa 15B na branch `dev` (repositório limpo antes de iniciar; R26 aceita e commitada em `7c68f17`). O achado central da etapa: `CarrinhoComponent` (rota pública `/carrinho`) e `FinalizarCompraComponent` (rota `/finalizar-compra`, protegida por `AuthGuard` + `ProfileCompleteGuard`) continham **dois formulários de checkout completos e desconectados entre si** — o primeiro já ligado aos dados reais do carrinho mas sem validação efetiva de submit, o segundo com `total: string = '64,95'` hardcoded e nenhum handler de submit. Investigação confirmou que esse `'64,95'` é o preço da assinatura mensal (`assinatura.component.html`) e que `/finalizar-compra` só era alcançada pelo botão "Assine Já" dessa página — ou seja, a rota que deveria fechar o pedido do carrinho na prática nunca era usada para isso.

Também foi encontrado um bug de correção real, não apenas de organização: os `<mat-select>` de País e Estado em `carrinho.component.html` **não tinham `formControlName`**, então os controles `Validators.required` correspondentes nunca podiam ser satisfeitos pela interface — e como o botão de submit não verificava `form.valid`, o "fechamento" seguia adiante mesmo assim, apenas fazendo `console.log`.

Com aprovação prévia do usuário (registrada no plano da etapa), a solução separou responsabilidades: `/carrinho` passou a ser exclusivamente revisão de itens (com remoção de item, pendência herdada da R26), e `/finalizar-compra` passou a ser o fechamento real — autenticado, alimentado pelos itens e pelo total reais do `CarrinhoService`, com validação efetiva (incluindo o aceite de termos, que antes usava `Validators.required` em vez de `Validators.requiredTrue` e por isso não rejeitava um checkbox desmarcado) e com o pedido identificado explicitamente como **simulação**, já que não existe endpoint de pedido no backend atual.

## Arquivos lidos

- `src/app/carrinho/carrinho.component.ts`, `.html`, `.scss`, `.spec.ts`
- `src/app/carrinho/cartModal/cart-modal.component.ts`, `.models.ts` (apenas leitura, não alterados)
- `src/app/finalizar-compra/finalizar-compra.component.ts`, `.html`, `.scss`, `.spec.ts`
- `src/app/service/carrinho.service.ts`, `.spec.ts`
- `src/app/service/user-profile.service.ts`
- `src/app/models/user-profile.model.ts`
- `src/app/guards/auth.guard.ts`, `src/app/guards/profile-complete.guard.ts`
- `src/app/login/auth.service.ts`
- `src/app/assinatura/assinatura.component.ts`, `.html`, `.spec.ts`
- `src/app/pedidos/pedidos.component.ts` (confirma que "Meus Pedidos" é uma casca sem dados, fora de escopo)
- `src/app/app-routing.module.ts` (rotas e guards de `/carrinho`, `/finalizar-compra`, `/assinatura`)
- `server/src/index.js` (mapeamento de todas as rotas reais do backend — confirma ausência de endpoint de pedido/checkout)
- `PROJECT_RULES.md` (§2, §9.7/§9.8, §12, §13, §15), `AGENTS.md` (§3, §4, §5, §6, §8.11, §9, §10), `CLAUDE.md`
- `docs/areas/license-cart-checkout.md`, `.claude/rules/license-cart-checkout.md`, `.claude/rules/auth-and-guards.md`, `.claude/rules/api-contracts.md`, `.claude/rules/angular.md`
- `docs/ia-auditorias/R26-carrinho-modelo-item-contador-licenca.md` (continuidade), `docs/ia-auditorias/README.md`
- `docs/ia-auditorias/R27-checkout-fechamento-pedido.md` (stub original, substituído por este conteúdo)

## Arquivos alterados

- `src/app/service/carrinho.service.ts` (+ `.spec.ts`)
- `src/app/carrinho/carrinho.component.ts`, `.html`, `.scss` (+ `.spec.ts`)
- `src/app/finalizar-compra/finalizar-compra.component.ts`, `.html`, `.scss` (+ `.spec.ts`)
- `src/app/models/pedido.model.ts` (novo)
- `src/app/assinatura/assinatura.component.html` (1 linha — fora do escopo declarado inicialmente, ver "Confirmação de escopo")
- `docs/ia-auditorias/R27-checkout-fechamento-pedido.md` (este relatório)
- `docs/ia-auditorias/README.md` (status do índice: R27 `Modelo` → `Preenchido`)

Não alterados: `src/app/carrinho/cartModal/*` (modal de seleção de licença — auditado, já atendia ao escopo), `src/app/service/user-profile.service.ts`, `src/app/guards/*`, `src/app/app-routing.module.ts` (rotas e guards preservados exatamente como estavam).

## O que foi implementado ou auditado

1. **`CarrinhoService` — fonte única de itens e total**: adicionado `removeItem(item)` (reaproveita o `isSameCartItem` privado já existente da R26 para localizar o item) e `cartTotal$: Observable<number>`, derivado de `cartItems$` no mesmo padrão de `cartCount$`, preservando o cálculo em centavos (`Math.round(preco * 100)`) para evitar erro de ponto flutuante. `receivingCart`/`receivingCart2`/`cartCount$` mantidos com a mesma assinatura — `MenuComponent` (badge do carrinho, R26) não precisou de nenhuma alteração.

2. **`CarrinhoComponent` reduzido a revisão de itens**: removidos o `FormGroup` de checkout completo (nome do projeto, observações, endereço de cobrança, forma de pagamento, aceite de termos — todos migrados para `/finalizar-compra`), o `HttpClient` e os três `.json` de país/estado/cidade que ele carregava. O componente agora se inscreve em `cartItems$`/`cartTotal$` (com `unsubscribe` em `ngOnDestroy`, mesmo padrão do `MenuComponent`), o que também corrige a lista para reagir em tempo real à remoção de item. O ícone "x" que já existia ao lado de cada item (antes decorativo) agora chama `removeItem(item)` via um `<button type="button">` com `aria-label`, substituindo o `<svg>` solto por um elemento focável/acionável por teclado. Um botão "Finalizar compra" (`[routerLink]="['/finalizar-compra']"`) foi adicionado. Os `console.log` de depuração remanescentes (linhas 55, 60, 64, 70, 74, 97 do arquivo original) foram removidos.

3. **`carrinho.component.scss` reorganizado**: os seletores da coluna de checkout removida (`.card`, `.form-group`, `.form-check`, botão de submit antigo, `mat-select`) foram descartados; os seletores da coluna de revisão (`.resumoCompra`, `.total`, `.economize`, `.security`) tiveram apenas o segmento `form` removido da cadeia de descendentes (a estrutura HTML equivalente foi preservada, então o resto de cada regra continua idêntico). O bloco `@media (min-width:768px) and (max-width:1024.98px)` e o bloco `@media (min-width:1440px)` ficaram vazios após a remoção e foram descartados por inteiro. Adicionadas duas regras novas: `.remove-item-btn` (reset de botão + `fill` cinza/vermelho no hover, substituindo a antiga `svg.ml-3 { fill: grey; }`, que já estava morta porque o HTML usava a classe Bootstrap 5 `.ms-3`) e `.resumoCompra .finalizar-btn` (pill, mesma linguagem visual de `border-radius: 33px` já usada no arquivo). A regra `button.btn.btn-primary { background: #4B3A8F; ... }` foi generalizada para `.btn.btn-primary` porque o novo CTA "Finalizar compra" é um `<a>` (necessário para `routerLink`), e sem essa generalização ele renderizaria o azul padrão do Bootstrap em vez do roxo da marca.

4. **`pedido.model.ts` (novo)**: interface `PedidoSimulado` (status `'simulado'`, data, nome do projeto, observações, forma de pagamento, itens e total) e o tipo `FormaPagamento`. Apenas tipagem — sem service, sem chamada HTTP, conforme a restrição de não inventar endpoint.

5. **`FinalizarCompraComponent` reescrito como fechamento real do carrinho**: `total: string = '64,95'` hardcoded foi eliminado; o componente agora se inscreve em `cartItems$`/`cartTotal$` do `CarrinhoService` (mesmo padrão de `unsubscribe`). Formulário reduzido ao que a etapa pede — `nomeProjeto` (obrigatório, 3–120 caracteres), `observacoes` (opcional, até 500 caracteres), `formaDePagamento` (obrigatório) e `aceiteTermos` (**`Validators.requiredTrue`**, corrigindo o `Validators.required` original que não rejeitava um checkbox `false`). Os campos de número de cartão, validade e CVC foram removidos — não há gateway de pagamento (restrição explícita da etapa) e não faz sentido coletar dados de cartão sem infraestrutura para processá-los; a forma de pagamento escolhida é registrada apenas como preferência no pedido simulado. O endereço de cobrança passou a vir de `UserProfileService` (snapshot local + `getProfile()`, que já existe e já é usado por `atualizar-informacoes`), em modo leitura, com link para editar — elimina a necessidade dos `mat-select` de país/estado que tinham o bug de `formControlName` ausente. `onSubmit()` usa o mesmo padrão de `errorSummary`/`markAllAsTouched()` já estabelecido em `atualizar-informacoes.component.ts`; em caso válido, monta um `PedidoSimulado` tipado e exibe confirmação. Um estado de carrinho vazio (com link para `/musicas`) evita que o formulário seja preenchido sem itens.

6. **Simulação explícita, não pedido real**: a tela de confirmação (`checkoutState === 'confirmado'`) declara textualmente "Esta etapa ainda não está integrada a um endpoint real de pedido nem a um gateway de pagamento. Nenhuma cobrança foi realizada e nenhum pedido foi enviado ao servidor." O carrinho **não é esvaziado** após a simulação — como nada é persistido no servidor, limpar o carrinho faria o usuário perder os itens sem ter um pedido real em troca.

7. **`assinatura.component.html`**: o botão "Assine Já" apontava para `/finalizar-compra`, que deixou de ser o checkout de assinatura. Trocado para `[routerLink]="['/precos']"` para não deixar um link quebrado (usuário cairia num checkout de carrinho vazio). Ver "Confirmação de escopo".

8. **Remoção de item do carrinho**: pendência explícita deixada pela R26 (`docs/ia-auditorias/R26-carrinho-modelo-item-contador-licenca.md`, seção "Riscos ou pendências"), implementada nesta etapa conforme decisão do usuário.

## Comandos executados

- [x] `git branch`
- [x] `git status`
- [x] `npm run build`
- [x] `npm test`

## Resultado dos comandos

- `git branch` → `dev`. `git status` → limpo antes de iniciar; ao final, os arquivos listados em "Arquivos alterados" acima.
- Ambiente local com Node `v22.18.0` como padrão do `nvm`, incompatível com o Angular CLI do projeto (mesma condição já registrada nas R24–R26); reexecutado com `nvm use 24.18.1` (`.nvmrc`).
- `npm run build` (`ng build --configuration=production --base-href /`) → sucesso. Bundle inicial **2,51 MB / 427,38 kB** transferência estimada — equivalente ao baseline da R26 (2,52 MB / 427,30 kB), sem regressão de tamanho. Único aviso: deprecation do Sass `@import` em `src/styles.scss:79`, pré-existente e fora de escopo.
- `npm test -- --watch=false` → **56 arquivos de teste, 154 testes, todos passaram** (144 do baseline da R26 + 10 novos: 3 em `carrinho.service.spec.ts` — `cartTotal$`, `removeItem` removendo item existente, `removeItem` no-op para item inexistente —, 2 em `carrinho.component.spec.ts` — delegação de `removeItem` ao service, estado vazio reativo —, 5 em `finalizar-compra.component.spec.ts` — total/itens vindos do carrinho em vez do valor fixo, bloqueio por termos não aceitos, bloqueio por nome de projeto ausente, geração do pedido simulado com dados corretos, estado de carrinho vazio). Um teste precisou de ajuste durante o desenvolvimento (`TestBed.resetTestingModule()` antes de reconfigurar o módulo dentro do próprio teste de carrinho vazio); corrigido antes da execução final. Nenhum teste pré-existente foi removido, desativado ou teve sua cobertura reduzida.
- `npm run lint` / `npm run typecheck`: **não existem** no `package.json` deste projeto (apenas `ng`, `start`, `build`, `watch`, `test`, `test:focus`, `cypress:run`, `e2e`); não foram inventados, conforme `AGENTS.md §7`.
- `cypress:run`/`e2e`: não executados — não fazem parte da lista de comandos de validação da etapa e exigem subir o servidor de desenvolvimento; fora do escopo desta rodada de validação.

## Como validar manualmente

1. `nvm use 24.18.1 && npm start`, acessar `/#/musicas`, escolher uma música, selecionar licença + plano no modal e confirmar: o badge do carrinho no menu aparece imediatamente (comportamento da R26, inalterado).
2. Acessar `/#/carrinho`: a tela mostra apenas a revisão — nome da música, licença, plano, preço e o total real do carrinho, sem nenhum campo de endereço/pagamento/termos. Clicar no "x" ao lado de um item remove-o e atualiza o total e o badge do menu imediatamente, sem reload.
3. Remover todos os itens: cai no estado "Seu carrinho está vazio" (inalterado da R26).
4. Adicionar itens novamente e clicar em "Finalizar compra" em `/carrinho`. **Deslogado**: `AuthGuard` deve abrir o modal de login em vez de renderizar o checkout — confirma que o fechamento do pedido deixou de ser acessível sem autenticação (antes, em `/carrinho`, era público).
5. Logar com um usuário cujo perfil esteja incompleto: `ProfileCompleteGuard` deve redirecionar para `/atualizar-informacoes`.
6. Logar com um usuário de perfil completo e acessar `/finalizar-compra`: confirmar que os itens e o total exibidos são os do carrinho real (nunca `R$ 64,95` fixo), e que o card "Endereço de cobrança" mostra os dados do perfil com link para editar.
7. Tentar submeter sem preencher "Nome do projeto" e sem marcar o aceite de termos: bloqueado, com a lista de erros visível (`alert-danger`) — confirmar especificamente que **desmarcar o checkbox de termos por si só já bloqueia o envio** (antes, com `Validators.required`, isso não acontecia).
8. Preencher nome do projeto, forma de pagamento e aceitar os termos; submeter: tela de confirmação exibindo os dados do pedido e o aviso de que é uma simulação, sem cobrança real. Verificar que o carrinho (badge do menu) continua com os itens após a simulação.
9. Acessar `/#/assinatura` e clicar em "Assine Já": deve navegar para `/#/precos` (não mais para um checkout de carrinho vazio).
10. Testar a responsividade de `/carrinho` e `/finalizar-compra` em ~375px (largura de celular): sem quebra de layout, botões ocupando a largura total conforme os media queries ajustados.

## Riscos ou pendências

- **Endereço de cobrança passou a vir do perfil do usuário (`UserProfileService`), não é mais digitado no checkout**: decisão deliberada (evita duplicar dado já validado pelo `ProfileCompleteGuard`, e elimina o bug do `mat-select` sem `formControlName`), mas é uma mudança de comportamento observável — vale confirmação humana explícita se o produto tiver uma expectativa diferente (ex.: permitir endereço de entrega distinto do endereço de perfil).
- **`nomeProjeto` passou a ser obrigatório**: antes o placeholder dizia "(opcional)" e o campo não tinha validador. A mudança decorre diretamente do critério de aceite "nome do projeto e comentários são validados" e da tarefa "validar campos nome do projeto, observações/comentários e aceite de termos"; registrado aqui para o caso de a regra de produto pretendida ser diferente.
- **Simulação de pedido é 100% client-side e não é persistida**: ao recarregar a página após a confirmação, o estado de "pedido simulado" se perde (volta a mostrar o formulário) — é o comportamento esperado dado que nada é salvo no servidor, mas fica registrado para não ser confundido com bug.
- **`FinalizarCompraComponent` deixou de ser o checkout de uma "assinatura mensal"** (seu propósito original, a julgar pelo total `R$ 64,95` e pelo texto "Assinatura mensal de músicas 5 Licenças Padrão por mês" que existiam antes desta etapa) **e passou a ser o checkout do carrinho avulso**. Isso significa que o produto de assinatura mensal mencionado em `/assinatura` e em `/precos` não tem mais nenhuma tela de checkout dedicada — "Assine Já" agora leva para `/precos` (decisão aprovada para não deixar um link quebrado), mas não há fechamento de assinatura funcional. Se esse produto for prioridade, uma etapa futura precisa decidir se ele ganha uma rota própria ou se é descontinuado — decisão de regra comercial que exige validação humana (`PROJECT_RULES.md §13`).
- **Pedido/checkout continua sem endpoint real no backend**: confirmado por leitura completa de `server/src/index.js` (apenas `/api/auth/*`, `/api/uploads/`, `/api/user/*`, `/api/dashboard/*`, `/api/producers/track`). Enquanto isso não mudar, o fechamento do pedido continuará sendo uma simulação explícita — não implementei nenhum service ou chamada HTTP para um endpoint inexistente.
- **`PedidosComponent` (`/pedidos`, "Meus Pedidos") continua sendo uma casca vazia**, sem nenhuma lista de pedidos (nem reais, nem simulados). Fora do escopo desta etapa (exigiria decidir se pedidos simulados devem ser listados ali, o que por sua vez pressupõe alguma persistência — hoje inexistente).
- **Duplicação de fonte de preços entre `licenca-valor` e `cart-modal`**, já sinalizada na R24 e na R26: `cart-modal.component.ts` mantém seus próprios preços hardcoded, independentes de `/precos`. Não foi tocada nesta etapa (fora de escopo).

## Confirmação de escopo

A imensa maioria das alterações ficou dentro do escopo declarado da Etapa 15B: `src/app/carrinho/*`, `src/app/finalizar-compra/*`, `src/app/service/carrinho.service.ts`, e o novo `src/app/models/pedido.model.ts` (modelo mínimo tipado do pedido, alternativa exigida pela própria tarefa quando não há endpoint). Uma saída pontual de escopo foi necessária e foi decidida com o usuário antes da implementação (registrada no plano aprovado desta etapa): `src/app/assinatura/assinatura.component.html`, uma alteração de 1 linha (`routerLink` de "Assine Já"). Justificativa: `/finalizar-compra` era o único destino desse botão; ao reescrever esse componente como o checkout do carrinho (não mais da assinatura), deixar o link apontando para lá quebraria o fluxo de assinatura silenciosamente. Nenhum guard, rota, contrato de API, service de autenticação, player/WaveSurfer ou fluxo de upload foi alterado.

## Status final da etapa

Aprovado com observações

O fluxo escolher licença → carrinho → checkout está navegável e agora exige autenticação e perfil completo antes do fechamento (antes, o formulário de checkout ficava numa rota pública). Nome do projeto e observações são validados; o aceite de termos passou a ser efetivamente obrigatório (`Validators.requiredTrue`, corrigindo um bug real do código anterior). O total exibido no checkout vem do carrinho em todos os pontos — o valor fixo `R$ 64,95` foi eliminado. O pedido é identificado explicitamente como simulação, tanto na tela de confirmação quanto no tipo `PedidoSimulado`. Build de produção e suíte completa de testes passam sem regressão (154 testes, 10 novos cobrindo o comportamento alterado). A observação fica por conta das pendências de produto documentadas acima — em especial a descontinuidade do checkout de assinatura mensal e a ausência de endpoint real de pedido —, que exigem validação humana antes de uma etapa futura avançar sobre elas.
