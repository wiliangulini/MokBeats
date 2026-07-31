# Relatório de Tarefa — Migração Angular 14→22, Etapa 6 / Degrau D3 (Angular/Material 17, migração real para MDC)

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-30
**Branch atual:** `feature/angular-22-migration`
**Tipo de tarefa:** Implementação (`ng update` + migração manual de código)
**Status final:** Aprovado

## 2. Objetivo

Executar o degrau D3 do plano de migração: `ng update @angular/core@17 @angular/cli@17`,
`@angular/material@17` e `@ng-bootstrap/ng-bootstrap@16`. Este é o degrau em que os módulos
`legacy-*` do Angular Material são removidos — a dívida represada desde a Etapa 4 (D1), quando a
migração automática optou por esses módulos para preservar a estrutura visual sem exigir migração
imediata de CSS.

## 3. Escopo solicitado

- Confirmar Node 24.18.1 e árvore limpa antes de iniciar.
- `ng update @angular/core@17 @angular/cli@17` — nunca agrupar majors diferentes.
- `ng update @angular/material@17` e `@ng-bootstrap/ng-bootstrap@16` no mesmo degrau.
- Revisar todo o diff das migrações automáticas antes de commitar.
- Resolver o mapeamento MDC por evidência (procedimento determinístico do plano), comparando
  contra as screenshots de baseline.
- Rodar o bloco de validação: `npm run build`, `npm test`, `npm run e2e`, `npm audit`.
- Commit + tag `mig/d3`.
- Pré-requisito confirmado: Etapa 5 (D2) validada, nenhum achado bloqueia este degrau.

## 4. Escopo não incluído

Nenhum outro degrau (D4-D8). Nenhuma alteração em `server/`. Nenhuma troca do builder principal
para `application`/esbuild (não é automática no `ng update`; decisão registrada em 13). Nenhuma
correção do achado 0012 (`test:focus`). Etapa 7 (D4) não iniciada.

## 5. Fontes de verdade consultadas

- Plano de migração completo, seção "Etapas 4-11" e riscos específicos de D1/D3.
- ADR `docs/adr/0002-migracao-angular-14-para-22.md`.
- `docs/migracao-angular-achados/README.md` (13 achados; validação de não-bloqueio).
- Relatório da Etapa 4 (Decisão 1 — mapeamento MDC previamente levantado via schematic oficial do
  Angular team, usado como ponto de partida e reconfirmado nesta etapa).
- CHANGELOG oficial do Angular 17.0.0 (via `gh api repos/angular/angular/contents/CHANGELOG.md`,
  tag `17.3.12`) — lido integralmente antes de agir.
- Bundle JS compilado do próprio projeto (`dist/main*.js`) — fonte de evidência primária para o
  mapeamento real de classes MDC (mais confiável que o tema pré-compilado, que só contém cores).

## 6. Arquivos lidos

- CHANGELOG.md do Angular 17.0.0 (breaking changes de `core`, `common`, `router`, `platform-*`,
  `zone.js`).
- Verificação própria (grep) de uso de APIs removidas no v17: `ngSwitch` com `==` (0 ocorrências),
  opções removidas de `RouterModule.forRoot` (só `useHash` usado), `zone.js` import (já no formato
  correto em `polyfills.ts`), redirects absolutos (só relativos usados).
- `src/app/app.module.ts`, `src/test.ts` e os 9 componentes que importavam módulos `Legacy` do
  Material (antes/depois da reversão manual).
- `node_modules/@angular/material/esm2022/form-field/directives/line-ripple.mjs` — estrutura real
  do `mdc-line-ripple` (elemento DOM próprio via diretiva, não pseudo-elemento).
- `dist/main*.js` (bundle compilado) — grep das classes `mat-mdc-form-field-*` e
  `mat-mdc-snack-bar-*` reais, para confirmar o mapeamento por evidência.
- `src/styles.scss`, `src/app/produtores/produtores.component.scss` (antes/depois).
- `cypress/e2e/upload.cy.ts` — reescrito após investigação de causa raiz de falhas.

## 7. Arquivos alterados

- `package.json`/`package-lock.json` — `@angular/*` → `17.3.12`, `@angular/cli`/
  `@angular-devkit/build-angular` → `17.3.17`, `@angular/material`/`@angular/cdk` → `17.3.10`,
  `@ng-bootstrap/ng-bootstrap` → `16.0.0`, `typescript` → `5.4.5`, `zone.js` → `0.14.10`.
- `angular.json` — migração automática: `browserTarget` → `buildTarget` nos targets `serve`/
  `extract-i18n` (renomeação de opção; builder principal inalterado).
- 4 templates (`contato`, `faq`, `politica-privacidade`, `termos-privacidade`) — migração
  automática: `@` literal em texto → `&#64;` (nova sintaxe de control flow do v17).
- `src/app/app.module.ts`, `src/test.ts` e 9 componentes — revertidos manualmente dos módulos
  `Legacy` do Material para os módulos MDC padrão (ver Decisão 1).
- `src/app/menu/menu.component.ts` — removido import morto `NgbNavbar` (não exportado mais pelo
  `ng-bootstrap` 16; nunca usado no arquivo).
- `src/styles.scss`, `src/app/produtores/produtores.component.scss` — mapeamento de classes CSS
  MDC aplicado (ver Decisão 2).
- `cypress/e2e/upload.cy.ts` — reescrito com abordagem híbrida para lidar com a nova estrutura MDC
  (ver Decisão 3, achado 0013).
- `cypress/screenshots/baseline-visual.cy.ts/{carrinho,finalizar-compra,upload-mat-form-field}.png`
  — re-capturadas.
- `docs/migracao-angular-achados/README.md` — índice atualizado com o achado 0013.

## 8. Arquivos criados

- `docs/migracao-angular-achados/0013-mat-label-mdc-cobre-inputs-cypress.md`
- Este relatório.

## 9. Arquivos preservados

- `server/` (código) — intocado.
- Builder principal (`@angular-devkit/build-angular:browser`) — não migrado para `application`
  (decisão explícita, ver 13).
- Lógica de todos os componentes — apenas imports de módulos Material e seletores CSS mudaram;
  nenhum comportamento de negócio alterado.

## 10. Arquivos removidos

Nenhum arquivo do repositório.

## 11. Estado inicial observado

- Branch em `mig/d2` (commit `d4353ae`), árvore com os 2 arquivos alheios de sempre.
- `@angular/core` 16.2.12, `@angular/material` 16.2.14 (via módulos `Legacy`), `@ng-bootstrap`
  15.1.2, `typescript` 4.9.5, `zone.js` 0.13.3.
- `npm audit`: 71 vulnerabilidades (herdado do D2).

## 12. O que foi implementado ou analisado

**Preparação:** mesmo procedimento das etapas anteriores — stash dos 2 arquivos alheios antes do
`ng update`, devolvidos após o commit.

**Leitura prévia do CHANGELOG oficial do v17:** identificados os breaking changes reais (remoção
do Node 16, `zone.js ~0.14.0` obrigatório, TypeScript <5.2 não suportado, `NgSwitch` com `===`,
opções removidas do `RouterModule.forRoot`, redirects absolutos). Confirmado por grep que nenhuma
API removida é usada pelo projeto antes de agir.

**Sequência executada:**
1. `ng update @angular/core@17 @angular/cli@17` — sucesso. Migração automática do control-flow
   syntax tocou 4 templates (Decisão 4).
2. `ng update @angular/material@17 --allow-dirty` — **recusado inicialmente**: "Cannot update to
   Angular Material v17 because the project is using the legacy Material components that have been
   deleted", listando os 11 arquivos afetados. O pacote `@angular/cdk` foi atualizado para 17.3.10
   mesmo assim; `@angular/material` ficou preso em 16.2.0 até a migração manual.
3. `ng update @ng-bootstrap/ng-bootstrap@16 --allow-dirty` — sucesso, sem migração de código.
4. **Migração manual dos 11 arquivos** (Decisão 1): reversão dos imports `Legacy*` para os módulos
   MDC padrão, via `sed` + limpeza do padrão redundante `X as X`.
5. Re-execução de `ng update @angular/material@17 --allow-dirty` — sucesso completo, pacote
   atualizado para 17.3.10.
6. `npm run build` — falhou por `NgbNavbar` não exportado mais; corrigido (import morto, nunca
   usado); build passou.
7. **Mapeamento CSS MDC** (Decisão 2) aplicado em `styles.scss` e `produtores.component.scss`.
8. **Reescrita do spec de upload** (Decisão 3) após investigar duas causas de falha distintas.

**Validação:**
- `npm run build` — sucesso.
- `npm test` — **115/115 SUCCESS**.
- `npm run e2e` — **5/5 specs, 8/8 testes**.
- `npm audit` — **71 vulnerabilidades** (mesmo total do D2, distribuição rebalanceada: 5 low/17
  moderate/48 high/1 critical vs. 8/14/48/1 antes).
- Comparação visual: screenshot do formulário de upload completo (33 `<mat-form-field>`) —
  fundo branco, underline, labels e o campo "Código" (que tinha sobreposição de texto pré-D1)
  todos corretos, idênticos à versão legacy.

## 13. Decisões técnicas tomadas

### Decisão 1: migração manual dos 11 arquivos de `Legacy*` para módulos MDC padrão

**Decisão:** reverter, arquivo por arquivo, os imports `MatLegacyX as MatX` de
`@angular/material/legacy-*` para `MatX` de `@angular/material/*` — exatamente o inverso da
migração automática do D1.

**Justificativa:** o Material 17 remove fisicamente os pacotes `legacy-*` do `node_modules`; não
há alternativa além de migrar para os componentes MDC (a decisão já estava anunciada no relatório
da Etapa 4). O `ng update` detecta e recusa avançar a versão do pacote até isso ser feito,
protegendo contra um estado inconsistente.

**Método:** `sed` com mapeamento exaustivo de 1:1 (path do módulo + nome do símbolo), seguido de
limpeza do padrão `X as X` resultante (`sed -E 's/\b(\w+) as \1\b/\1/g'`). Verificado por grep que
zero ocorrências de `legacy` permaneceram nos 11 arquivos.

### Decisão 2: mapeamento de classes CSS MDC — por evidência real, não suposição

**Decisão:** aplicar o seguinte mapeamento em `styles.scss` e `produtores.component.scss`:

| Classe legacy | Classe MDC real | Fonte da evidência |
|---|---|---|
| `.mat-form-field` | `.mat-mdc-form-field` | schematic oficial (Etapa 4) + bundle |
| `.mat-form-field-flex` | `.mat-mdc-form-field-flex` | **bundle compilado** (existe, contrariando a hipótese inicial de "sem equivalente") |
| `.mat-form-field-infix` | `.mat-mdc-form-field-infix` | **bundle compilado** (idem) |
| `.mat-form-field-underline` | `.mdc-line-ripple` | bundle + leitura do código-fonte da diretiva `MatFormFieldLineRipple` |
| `.mat-form-field-label` (via `::ng-deep`) | `.mdc-floating-label` | bundle compilado |
| `.mat-form-field-appearance-fill` | **sem mudança** — nome idêntico | bundle compilado |
| `.mat-input-element` | `.mat-mdc-input-element` | bundle compilado |
| `.mat-snack-bar-container` | `.mat-mdc-snack-bar-container` | schematic oficial (Etapa 4) |
| `.mat-simple-snack-bar-content` | `.mat-mdc-snack-bar-label` | schematic oficial (Etapa 4) |

**Justificativa:** o tema pré-compilado (`prebuilt-themes/indigo-pink.css`) só contém a classe raiz
`mat-mdc-form-field` — as classes de estrutura interna (`-flex`, `-infix`) são geradas como
component-scoped styles, embutidas no bundle JS, não no CSS global. `grep` direto no `dist/main*.js`
(gerado por um build real deste mesmo projeto) foi a fonte de evidência mais confiável — mais
precisa que o schematic oficial do Angular team (que classificava essas classes genericamente como
"deprecated sem mapeamento direto", quando na prática o nome sobrevive com o prefixo `mdc-`, só a
estrutura DOM interna que mudou).

**Verificação adicional:** para `underline`, confirmei a estrutura real lendo o código-fonte da
diretiva `MatFormFieldLineRipple` (`line-ripple.mjs`) — é um `<div>` real com classe host
`mdc-line-ripple`, o mesmo padrão de pseudo-elemento (`::before`) do CSS original foi preservado na
correção.

### Decisão 3: `cypress/e2e/upload.cy.ts` — duas causas de falha distintas, duas correções distintas

**Descoberta 1 — inputs de texto cobertos por `<mat-label>`:** investigação com
`document.elementFromPoint()` (usando `ownerDocument` do elemento, não o `document` do Cypress
runner — erro inicial que retornava `null`) confirmou que o elemento "cobrindo" cada input é sempre
o `<mat-label>` do mesmo `<mat-form-field>` (rótulo flutuante do Material Design, posicionado sobre
o texto até o campo ganhar foco/valor). **Decisão:** `{force: true}` nos `.type()` — seguro, porque
o alvo do comando continua sendo o `<input>` já localizado pelo seletor CSS; force apenas pula a
checagem de "coberto", não redireciona a ação.

**Descoberta 2 — `mat-select` exige tempo para a animação de abertura:** clicar em `mat-option`
logo após abrir o select falhava por "covered". A primeira tentativa de correção
(`{force: true}` no clique da opção) **piorou o problema**: o clique "vazou" para outro elemento da
página (confirmado — a página voltou ao topo após o clique, e o formulário permaneceu inválido sem
erro explícito). **Decisão:** `cy.wait(400)` após o clique de abertura, **sem** force no clique da
opção — mais lento, mas correto (confirmado: o select mostra o valor selecionado de fato).

**Lição registrada (achado 0013):** `{force: true}` é seguro quando o comando já mira o elemento
certo (como `.type()` num input já selecionado); é arriscado em `.click()` quando o elemento
"coberto" pode não ser o mesmo em que o clique de fato aterrissa.

### Decisão 4: aceitar a migração automática de `@`/`}` para HTML entities

**Decisão:** manter as 4 substituições automáticas.

**Justificativa:** confirmado, arquivo por arquivo, que a substituição ocorre apenas em texto
literal visível (nunca em atributos `href`), e `&#64;` renderiza identicamente a `@` no browser —
sem efeito visual. É a preparação do Angular 17 para a nova sintaxe de control flow (`@if`/`@for`),
que trata `@` como caractere especial em certas posições do template.

### Decisão 5: não migrar o builder para `application`/esbuild

**Decisão:** manter `"builder": "@angular-devkit/build-angular:browser"` nos targets `build`/
`test`/`test-focus`.

**Justificativa:** o `ng update` não faz essa troca automaticamente — só renomeou a opção
`browserTarget`→`buildTarget` dos targets que a referenciam (uma migração de compatibilidade menor,
não a adoção do novo builder). O builder `browser` (webpack) continua suportado e funcional no
Angular 17. Trocar de builder é uma mudança de infraestrutura de build maior (esbuild processa
CSS/assets de forma diferente) e não fazia parte do DoD desta etapa (versões de pacote +
compatibilidade). Registrado como nota para avaliação futura, não como pendência bloqueante.

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| Migração real MDC concluída, mas só verificada nas telas com `<mat-form-field>` cobertas pela baseline (upload) | Baixa | Outras telas com Material (login não usa, mas outros formulários podem) podem ter classes CSS não mapeadas | `npm test` (115) e specs funcionais cobrem os principais fluxos; nenhuma outra sobrescrita `.mat-*` foi encontrada no projeto além das 2 já tratadas (confirmado na Etapa 0/auditoria original) |
| Builder `browser` (webpack) mantido, não `application` (esbuild) | Baixa | Nenhum imediato — builder legado continua suportado | Reavaliar a troca de builder como tarefa própria, fora da escada de `ng update` |
| Achado 0012 (`test:focus`) seguindo aberto | Média | Ferramenta de dev indisponível | Resolver antes da Etapa 12 |
| `{force:true}` nos specs pode mascarar problemas reais de acessibilidade/foco em telas futuras | Baixa | Specs continuam validando o fluxo funcional, mas não a navegação por teclado | Fora do escopo desta migração; registrado como observação |

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Não aplicável (migrado para 17.3.12)
- Rotas preservadas: Sim — `git diff` de `app-routing.module.ts` vazio
- Guards/autenticação preservados: Sim — não tocados nesta etapa
- APIs/payloads preservados: Sim — nenhum service tocado
- Player/WaveSurfer preservado: Sim — `player.cy.ts` (2 testes) passa
- Upload/FormData preservado: Sim — `upload.cy.ts` confirma nomes de campo idênticos (após ajuste
  de seletores de teste, não de comportamento do app)
- Carrinho/licenças/checkout preservados: Sim — specs correspondentes passam
- Dashboard/produtor preservado: Sim — não tocado
- Estilos/padrões preservados: Sim — confirmado visualmente; a migração MDC foi transparente para
  o usuário final (mesma aparência, estrutura DOM interna diferente)

## 16. Validações executadas

- [x] `ng update` completo (3 comandos, 2 execuções do Material) sob Node 24.18.1, árvore limpa.
- [x] Revisão de **todo** o diff (27 arquivos) antes do commit.
- [x] `npm run build` — sucesso (após corrigir `NgbNavbar`).
- [x] `npm test` — **115/115 SUCCESS**.
- [x] `npm run e2e` — **5/5 specs, 8/8 testes** (após reescrever `upload.cy.ts`).
- [x] `npm audit` — registrado (71, mesmo total do D2).
- [x] Mapeamento CSS MDC verificado por evidência real (grep no bundle compilado), não suposição.
- [x] Comparação visual da tela de upload (33 `<mat-form-field>`) — sem regressão.
- [x] `git diff --stat server/` — vazio.

## 17. Validações não executadas

- `npm run test:focus` — não retestado nesta etapa (já sabido quebrado desde o D1, achado 0012).
- `npm run lint`/`npm run typecheck` — não existem neste projeto.

## 18. Validações recomendadas

- [ ] Antes da Etapa 7 (D4): `git tag -l 'mig/*'` e `git log --oneline` para confirmar `mig/d3`.
- [ ] Rodar `npm run e2e` uma vez mais antes de iniciar D4, revertendo `server/data/users.json`
  depois.
- [ ] D4 (Angular 18) fecha o advisory de Material/CDK (achado A11 do plano) — conferir `npm audit`
  com atenção especial após esse degrau.

## 19. Pendências

- Achado 0012 (`test:focus` quebrado) — aberto, sem mudança nesta etapa.
- Builder `browser` vs `application`/esbuild — decisão de não migrar nesta etapa, registrada como
  nota para avaliação futura (Decisão 5), não uma pendência bloqueante da escada.
- `npm audit` em 71 — monitorar; expectativa de queda a partir do D4 (Material 18+).

## 20. Próximo passo recomendado

Aguardar confirmação explícita do usuário antes de iniciar a Etapa 7 (D4 — Angular 18, que fecha o
advisory de Material/CDK segundo o achado A11 do plano), conforme instrução da sessão.

## 21. Instruções para o próximo agente

1. Leia este relatório e os das Etapas 0-5.
2. Confirme `git log --oneline` e `git tag -l 'mig/*'` — deve haver `mig/e0`-`mig/e3` e
   `mig/d1`-`mig/d3`.
3. Leia `docs/migracao-angular-achados/README.md` — 13 achados; o 0013 é especialmente relevante
   se algum spec futuro precisar interagir com `<mat-form-field>`/`<mat-select>`.
4. Confirme `node -v` = `24.18.1`; árvore 100% limpa antes de `ng update` (stash dos arquivos
   alheios).
5. Reverta `server/data/users.json` se `npm run e2e` for executado antes de commitar.
6. Antes de agir no D4, leia o CHANGELOG oficial do Angular 18 e confirme se o Material 18
   introduz alguma mudança adicional de classes CSS além do que já foi migrado aqui (não deveria,
   já que a migração MDC já está completa desde este degrau, mas confirmar por precaução).

## 22. Observações finais

O degrau mais trabalhoso da escada até agora — a dívida represada desde o D1 (uso dos módulos
`Legacy` do Material) venceu como esperado, exigindo migração manual de 11 arquivos `.ts` e do CSS
de 2 arquivos `.scss`. A investigação de causa raiz (em vez de aplicar `{force: true}` cegamente
nos specs) foi essencial: uma tentativa inicial de forçar o clique em `mat-option` causou um
"vazamento" de clique que deixava o formulário silenciosamente inválido, sem erro de asserção
explícito — só percebido porque o teste verifica explicitamente que o botão de submit fica
habilitado. O mapeamento de classes CSS foi verificado por evidência direta no bundle compilado do
próprio projeto, não por suposição a partir de documentação externa, corrigindo uma imprecisão do
schematic oficial do Angular team (`.mat-form-field-flex`/`-infix` têm equivalente direto, ao
contrário do que a documentação genérica sugeria). Todas as validações objetivas permanecem verdes.
