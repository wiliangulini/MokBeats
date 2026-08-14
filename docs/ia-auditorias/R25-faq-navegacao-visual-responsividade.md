# R25 — FAQ: navegação, padronização visual e responsividade

## Resumo da etapa

Implementada a Etapa 14B na branch `dev` (repositório limpo antes de iniciar, R24 já commitada em `dd1b783`). A navegação Pricing → FAQ já usava `routerLink` corretamente (nenhuma correção necessária ali); o achado real da etapa foi dentro do próprio FAQ: o texto continha ~10 referências a **PremiumBeat** (concorrente real, dono: Shutterstock) e uma menção direta à **Shutterstock**, herdadas de um conteúdo de referência usado como base do FAQ e nunca higienizadas — incluindo um `mailto:` para `orders@premiumbeat.com`, um domínio de terceiro. Também havia 3 `routerLink` quebrados (`/preco`, rota inexistente; a rota real é `/precos`), 2 âncoras `<a>` sem `href`/`routerLink`/`(click)` (links vazios funcionais), e um bug de responsividade no menu lateral fixo, que aplicava `position: fixed` ao rolar a página independente da largura da viewport, podendo sobrepor o conteúdo em mobile.

## Arquivos lidos

- `src/app/faq/faq.component.html`, `.ts`, `.scss`, `.spec.ts`
- `src/app/politica-privacidade/politica-privacidade.component.html`, `.scss`, `.ts` (referência estrutural institucional)
- `src/app/termos-privacidade/*` (localizado, não usado como referência principal)
- `src/app/licenca-valor/licenca-valor.component.html` (botão/link de FAQ em Pricing — 4 ocorrências, já usando `routerLink`)
- `src/app/finalizar-compra/finalizar-compra.component.html` (outra referência a `/faq`, já correta)
- `src/app/app-routing.module.ts` (confirmação das rotas reais: `precos`, `politica-de-privacidade`, `faq`, `contato`, `pedidos`)
- `PROJECT_RULES.md` (§2, §9.13/§9.14, §12, §13, §15)
- `AGENTS.md` (§3, §4, §5, §6, §8, §10)
- `CLAUDE.md`
- `docs/areas/identidade-visual-ux.md`
- `.claude/rules/buyer-flow.md`, `.claude/rules/angular.md`, `.claude/rules/license-cart-checkout.md`
- `docs/ia-auditorias/R24-pricing-toggle-cards-responsivos.md` (referência de formato/parser de status)
- `docs/ia-auditorias/README.md`
- `docs/ia-auditorias/R25-faq-navegacao-visual-responsividade.md` (stub original, substituído por este conteúdo)

## Arquivos alterados

- `src/app/faq/faq.component.html`
- `src/app/faq/faq.component.ts`
- `docs/ia-auditorias/R25-faq-navegacao-visual-responsividade.md` (este relatório)
- `docs/ia-auditorias/README.md` (status do índice: `Modelo` → `Preenchido`)

## O que foi implementado ou auditado

1. **Navegação Pricing → FAQ**: auditada, não alterada. As 4 ocorrências em `licenca-valor.component.html` (3 cards + seção final de FAQ) e a ocorrência em `finalizar-compra.component.html` já usam `[routerLink]="['/faq']"`. Nenhum `href="#"`/`href=""` encontrado nesse fluxo.

2. **Remoção de conteúdo de terceiros indevido** (`faq.component.html`, item 3 do escopo): substituídas todas as ~10 ocorrências de "PremiumBeat" por "MokBeats" (incluindo a correção do artigo "do PremiumBeat" → "da MokBeats", para manter o mesmo gênero gramatical já usado em `politica-privacidade.component.html` — "A MokBeats..."), e removida a menção a "outros produtos da Shutterstock" na seção Segurança. Removido também o `<a href="mailto:orders@premiumbeat.com">`, que apontava para um domínio de terceiro; a frase foi reescrita para manter a orientação de suporte via `<a [routerLink]="['/contato']">fale conosco</a>` (rota interna já existente e já usada no restante do FAQ), sem inventar um e-mail de suporte real da MokBeats — ver pendência abaixo.

3. **Correção de rotas quebradas**: 3 ocorrências de `[routerLink]="['/preco']"` (rota inexistente, singular) corrigidas para `[routerLink]="['/precos']"` (rota real declarada em `app-routing.module.ts:39`), alinhando com as demais 2 ocorrências do arquivo que já usavam a forma correta.

4. **Correção de links vazios** (critério de aceite "não há links vazios principais"):
   - `<a class="talk">Pedidos e downloads</a>` (sem destino) → `<a [routerLink]="['/pedidos']" class="talk">`, rota autenticada real (`AuthGuard`) já existente para o histórico de pedidos/downloads do usuário, coerente com o texto ao redor.
   - `<a class="talk">músicas livres de direitos?</a>` (sem destino, apenas decorativo dentro de um título) → removida a marcação `<a>`, mantendo o texto plano dentro do próprio `<p class="h3">` (já é um título, não precisava de um link falso).

5. **Bug de responsividade do menu lateral fixo** (`faq.component.ts`): o `@HostListener('window:scroll')` aplicava `position: fixed` + `margin-left: 25%` no conteúdo ao ultrapassar `scrollY: 657`, **sem checar a largura da viewport** — em mobile (onde a media query `≤575.98px` já força `menuLeft`/`control` a 100% de largura em coluna única), esse comportamento JS inline podia sobrepor o menu lateral sobre o conteúdo ao rolar a página, conflitando com a regra "header/menu não pode sobrepor conteúdo" (`docs/areas/identidade-visual-ux.md`). Corrigido para só aplicar o `fixed`/deslocamento quando `window.innerWidth > 575.98` (mesmo breakpoint já usado no SCSS), e adicionado `@HostListener('window:resize')` chamando a mesma lógica, para que redimensionar a janela sem rolar também recalcule o estado corretamente.

6. **Não alterado (fora de escopo, documentado como pendência)**: o conteúdo comercial das seções "Assinatura" e "Programa de indicação" (créditos mensais/anuais, período de compromisso de 3 meses, 25% de desconto e US$25 de crédito por indicação, meios de pagamento aceitos) parece ter sido copiado quase literalmente do FAQ real do PremiumBeat, com apenas o nome da marca agora corrigido para MokBeats. Não alterei os números/termos comerciais em si — isso seria inventar/validar regra comercial sem aprovação, o que o item 5 do escopo e o `PROJECT_RULES.md §13` proíbem explicitamente. Ver seção de riscos.

## Comandos executados

- [x] `git branch`
- [x] `git status`
- [x] `npm run build`
- [x] `npm test`

## Resultado dos comandos

- `git branch` → `dev` (branch correta). `git status` → limpo antes de iniciar; ao final, apenas os arquivos listados acima como alterados.
- Ambiente local com Node `v22.18.0` como padrão do `nvm`, incompatível com o Angular CLI do projeto (mesma condição já registrada na R24); reexecutado com `nvm use 24.18.1` (`.nvmrc`).
- `npm run build` → sucesso. Bundle inicial **2,52 MB / 427,37 kB** transferência estimada — equivalente ao baseline da R24 (2,52 MB / 427,29 kB), sem regressão de tamanho. Único aviso: deprecation do Sass `@import` em `src/styles.scss:79`, pré-existente e fora de escopo.
- `npm test -- --watch=false` → **56 arquivos de teste, 141 testes, todos passaram** (mesmo total da R24 — nenhum teste novo foi adicionado para o FAQ, ver pendência abaixo). Nenhuma regressão.

## Como validar manualmente

1. `nvm use 24.18.1 && npm start`, acessar `/#/precos` e clicar em qualquer um dos 3 links "Veja todos os detalhes na página Perguntas Frequentes" (ou no botão final "Perguntas Frequentes na FAQ"): deve navegar para `/#/faq` via Angular Router, sem reload de página.
2. Em `/#/faq`, usar o menu lateral esquerdo (Assinatura, Programa de indicação, Resolução de problemas, Músicas livres de direitos, Técnicas, Segurança) e confirmar o scroll suave até cada seção.
3. Ler o conteúdo das seções "Assinatura", "Programa de indicação", "Resolução de Problemas" e "Segurança": confirmar que não há mais nenhuma menção a "PremiumBeat" ou "Shutterstock", e que os links "contrato de licença" / "página de licença" (dentro de "Músicas livres de direitos") levam a `/#/precos` (antes levavam a uma rota inexistente `/#/preco`).
4. Na seção "Resolução de Problemas", confirmar que "Pedidos e downloads" navega para `/#/pedidos` (exige login — comportamento esperado do `AuthGuard`).
5. Redimensionar a janela para ≤575px (ou emular um celular no DevTools) e rolar a página além de ~657px de scroll: o menu lateral deve permanecer em fluxo normal (coluna única, acima do conteúdo), **sem** virar `position: fixed` sobre o texto. Alargar a janela para desktop (>575px) e repetir: o menu lateral deve ficar fixo/deslocado como antes.
6. Redimensionar a janela sem rolar a página (ex.: começar em desktop com scroll >657px, depois encolher para mobile mantendo o scroll): o menu deve voltar ao fluxo normal imediatamente ao cruzar o breakpoint, graças ao novo `window:resize`.
7. Chrome e Firefox, sem quebra visual.

## Riscos ou pendências

- **Conteúdo comercial do FAQ ainda reflete termos de um concorrente real (PremiumBeat/Shutterstock), agora apenas com a marca trocada para MokBeats**: valores como "5 Licenças Padrão/mês", "60 Licenças Padrão/ano", "período de compromisso de 3 meses", "25% de desconto + US$25 de crédito por indicação" e a lista de bandeiras de cartão aceitas não foram validados como política comercial real da MokBeats. Isso é regra comercial (`PROJECT_RULES.md §13` — "regras comerciais de licença") e está fora do escopo desta etapa (navegação/visual/responsividade). Recomendo uma etapa dedicada de revisão de conteúdo/negócio para o FAQ antes de tratar este texto como definitivo, seguindo o mesmo padrão de placeholder já usado em `politica-privacidade.component.html` (campos `[[ ]]`) onde aplicável.
- **E-mail de suporte real ainda não definido**: o `mailto:orders@premiumbeat.com` foi removido (apontava para domínio de terceiro), e a frase foi redirecionada para `/contato`. Não foi inventado um e-mail de suporte da MokBeats — se um endereço real existir, ele pode substituir esse trecho em etapa futura.
- **Cor do título do hero do FAQ (`#7703B9`, roxo) é única no projeto** — não usada em nenhum outro `.scss` do repositório; o restante das páginas institucionais/hero usa branco sobre fundo escuro. Não alterei essa cor por não ter como validar visualmente o contraste contra a imagem de fundo (`mokbeats_roseta.webp`) neste ambiente sem navegador; fica registrado como possível inconsistência de identidade visual para decisão humana, sem forçar uma mudança de tema sem aprovação.
- **Nenhum teste novo foi adicionado** para o FAQ (`faq.component.spec.ts` segue com apenas o teste "should create"). As correções desta etapa (rotas, `routerLink`, listener de scroll/resize) são pequenas e de baixo risco, validadas via build + leitura de diff, mas não há cobertura automatizada de regressão para o comportamento de scroll/resize do menu lateral.
- **Bug pré-existente e não corrigido, fora de escopo**: o comentário `//arrumar scroll ao clicar, funciona somente se tiver no inicio da pagina` em `faq.component.ts` (método `infoValue`) indica uma limitação conhecida do scroll ao clicar nos itens do menu lateral quando a página já está rolada. Não é um problema de responsividade/link vazio coberto pelos critérios de aceite desta etapa; fica registrado como pendência para uma etapa futura de comportamento/JS do FAQ.
- A propriedade `array` no `FaqComponent` (linhas 43–52 antes desta etapa) é código morto pré-existente, não relacionado a este escopo; não foi removida para manter a alteração estritamente localizada.

## Confirmação de escopo

Alterados **somente** arquivos dentro do escopo da Etapa 14B: os 2 arquivos do componente `faq` (`.html`, `.ts` — `.scss` não precisou de alteração, pois a causa raiz do bug de responsividade estava no listener de scroll em TypeScript, não no CSS) e a documentação de continuidade (`docs/ia-auditorias/R25-*.md` e `README.md` do índice, seguindo o mesmo padrão do fechamento da R24). Não foi necessário alterar `licenca-valor.*` nem `politica-privacidade.*` — ambos foram lidos apenas como referência/verificação, sem modificação. Nenhuma rota, guard, service, módulo global ou dependência foi alterada. Não houve necessidade de sair do escopo declarado.

## Status final da etapa

Aprovado com observações

FAQ é acessível a partir de Pricing por rota interna (já estava correto, verificado), os links internos quebrados (`/preco` → `/precos`) e os 2 links sem destino foram corrigidos, o conteúdo de terceiros indevido (PremiumBeat/Shutterstock/mailto externo) foi removido, o bug de sobreposição do menu lateral em mobile foi corrigido, e build + suíte completa de testes passam sem regressão. A observação fica por conta do conteúdo comercial remanescente (herdado de um concorrente real, apenas com a marca corrigida) e do e-mail de suporte ainda não definido — ambos documentados como pendência que exige validação humana (`PROJECT_RULES.md §13`), fora do escopo de uma etapa de navegação/visual/responsividade.
