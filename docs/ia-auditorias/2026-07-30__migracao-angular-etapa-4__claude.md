# Relatório de Tarefa — Migração Angular 14→22, Etapa 4 / Degrau D1 (Angular/Material 15)

## 1. Identificação

**Agente:** Claude Code
**Data:** 2026-07-30
**Branch atual:** `feature/angular-22-migration`
**Tipo de tarefa:** Implementação (`ng update`, degrau de dependências)
**Status final:** Aprovado

## 2. Objetivo

Executar o degrau D1 do plano de migração: `ng update @angular/core@15 @angular/cli@15`,
`@angular/material@15` e `@ng-bootstrap/ng-bootstrap@14` no mesmo commit — o degrau que o próprio
plano classifica como "o mais arriscado da escada", por causa da reescrita MDC do Angular Material
15 e as 10 sobrescritas CSS do projeto (achado A1) contra 33 `<mat-form-field>`.

## 3. Escopo solicitado

- Confirmar Node 24.18.1 e árvore limpa antes de iniciar.
- `ng update @angular/core@15 @angular/cli@15` — nunca agrupar majors diferentes.
- `ng update @angular/material@15` e `@ng-bootstrap/ng-bootstrap@14` no mesmo degrau.
- Revisar todo o diff das migrações automáticas antes de commitar.
- Rodar o bloco de validação: `npm run build`, `npm test`, `npm run e2e`, `npm audit`.
- Resolver o mapeamento MDC por evidência (procedimento determinístico do plano: `grep` no CSS do
  pacote instalado), comparando contra as screenshots de baseline.
- Commit + tag `mig/d1`.
- Pré-requisito confirmado: Etapa 3 validada, nenhum achado catalogado bloqueia este degrau.

## 4. Escopo não incluído

Nenhum outro degrau (D2-D8). Nenhuma alteração em `server/`. Nenhuma correção definitiva do achado
0012 (test:focus quebrado) — apenas diagnosticado e registrado. Etapa 5 (D2) não iniciada.

## 5. Fontes de verdade consultadas

- Plano de migração completo, seção "Etapas 4-11" (protocolo, riscos de D1, matriz de degraus).
- ADR `docs/adr/0002-migracao-angular-14-para-22.md`.
- `docs/migracao-angular-achados/README.md` (validação de não-bloqueio, achados 0001-0011).
- Guia oficial `angular.dev/update-guide` — a ferramenta interativa não expôs texto estático
  (SPA); usada como referência complementar o repositório oficial `angular/components` (ver
  seção 6).

## 6. Arquivos lidos

- `package.json` (versões atuais antes do update).
- Repositório `angular/components` (via `gh api`), tag `15.2.9`:
  `src/material/schematics/ng-generate/mdc-migration/rules/components/form-field/form-field-styles.ts`
  e `.../snack-bar/snack-bar-styles.ts` — mapeamento oficial e exato de classes `.mat-X` →
  `.mat-mdc-X` (usado para validar o procedimento do achado A1, embora não tenha sido necessário
  aplicá-lo nesta etapa — ver Decisão 2).
- Todo o diff gerado pelas 3 migrações (`git diff` completo, arquivo por arquivo, listado na
  seção 12).
- `src/test.ts`, `tsconfig.spec.json`, `tsconfig.spec.focus.json`, `karma.conf.js` — para
  diagnosticar e corrigir o bug de `require.context` (Decisão 3).
- `docs/ia-auditorias/R09-musicas-integracao-licenca-carrinho.md` — confirmação de que o mecanismo
  `FOCUS_SPECS` já era conhecido como não-funcional antes desta migração.

## 7. Arquivos alterados

- `package.json`/`package-lock.json` — `@angular/*` → `15.2.10` (ou `15.2.9` para
  material/cdk/material-moment-adapter), `@angular/cli`/`@angular-devkit/build-angular` →
  `15.2.11`, `@ng-bootstrap/ng-bootstrap` → `14.2.0`, `typescript` → `4.9.5`.
- `.browserslistrc` — removido (migração automática; conteúdo idêntico ao default do CLI).
- `tsconfig.json` — `target: ES2022`, `useDefineForClassFields: false` (migração automática).
- `src/app/app.module.ts` — 8 imports de módulos Material trocados para variantes `Legacy`;
  `RouterLinkWithHref` → `RouterLink`.
- `src/app/{add-playlist-modal,artist,atualizar-informacoes,create-playlist-modal,
  create-playlist-modal/edit-playlist-modal,pag-playlist,produtores,usuario-artista}/*.component.ts`
  (8 arquivos) — `MatSnackBar` → `MatLegacySnackBar as MatSnackBar` (só import, sem mudança de
  lógica).
- `src/app/produtores/produtores.component.spec.ts` — mesmo padrão de import.
- `src/test.ts` — migração automática trocou os 7 imports de Material para `Legacy*`; **corrigido
  manualmente** removendo o bloco morto de `FOCUS_SPECS`/`context` que a migração deixou órfão
  (ver Decisão 3).
- `cypress/screenshots/baseline-visual.cy.ts/*.png` (6 arquivos) — re-capturadas pós-D1.
- `docs/migracao-angular-achados/README.md` — índice atualizado com o achado 0012.

## 8. Arquivos criados

- `docs/migracao-angular-achados/0012-test-focus-quebrado-apos-angular15.md`
- Este relatório.

## 9. Arquivos preservados

- `server/` (código) — intocado.
- Todos os templates `.html` e arquivos `.scss` — **nenhum tocado nesta etapa** (a estrutura CSS
  `.mat-form-field-*` do projeto continua válida porque o Material 15 foi instalado nos módulos
  `Legacy`, que preservam a estrutura DOM/CSS do Material 14 — ver Decisão 1).
- `karma.conf.js` — não tocado (a linha `client.args: [process.env.FOCUS_SPECS || '']` ficou órfã
  após a remoção do consumidor em `test.ts`, mas não quebra nada — registrado como observação, não
  corrigido, para não expandir o escopo desta etapa).

## 10. Arquivos removidos

- `.browserslistrc` (pela migração automática do `@angular/cli`, não por mim — conteúdo idêntico
  ao default embutido do CLI, confirmado pela própria mensagem da migração).

## 11. Estado inicial observado

- Branch em `mig/e3` (commit `b505315`), árvore com os 2 arquivos alheios de sempre
  (`.vscode/settings.json`, `docs/Plano P0 v2.2 …md`).
- `@angular/core` 14.3.0, `@angular/material` 14.2.7, `@ng-bootstrap/ng-bootstrap` 13.0.0,
  `typescript` ~4.7.2, `bootstrap` 5.3.8 (já migrado na Etapa 3).
- `npm audit`: 62 vulnerabilidades (herdado da Etapa 2/3).

## 12. O que foi implementado ou analisado

**Preparação:** `ng update` exige árvore de trabalho 100% limpa (checagem própria da ferramenta,
mais rígida que `git status` genérico). Os 2 arquivos alheios foram colocados em `git stash`
(`stash push -u -- <arquivos>`) antes de iniciar, e devolvidos (`stash pop`) após o commit desta
etapa — ação reversível, documentada aqui.

**Sequência executada:**
1. `ng update @angular/core@15 @angular/cli@15` — sucesso, sem `--allow-dirty` (árvore limpa).
2. `ng update @angular/material@15 --allow-dirty` — sucesso; `--allow-dirty` necessário porque o
   passo 1 já havia modificado a árvore (intencional: agrupar os 3 updates em um único commit por
   degrau, conforme protocolo do plano).
3. `ng update @ng-bootstrap/ng-bootstrap@14 --allow-dirty` — sucesso, sem migração de código
   (0 arquivos alterados).

**Revisão completa do diff** (todos os 14 arquivos `.ts`/`.json` alterados pelas migrações
automáticas, um por um, antes de qualquer commit) — resumida nas seções 7 e 13.

**Validação:**
- `npm run build` (produção) — sucesso, mesmos 2 warnings cosméticos do extrator de CSS crítico já
  vistos na Etapa 3 (não novos).
- `npm test` — **115/115 SUCCESS** (após a correção da Decisão 3).
- `npm run e2e` (comando oficial) — **5/5 specs, 8/8 testes**, rodado 2 vezes.
- `npm audit` — **65 vulnerabilidades** (subiu de 62; ver Decisão 4).
- Comparação visual determinística (achado A1): screenshots extraídas de `mig/e3` comparadas com
  as novas via `Read`, mais capturas de scroll incremental na tela de upload (33
  `<mat-form-field>`) — ver Decisão 1.

## 13. Decisões técnicas tomadas

### Decisão 1: o achado A1 (quebra silenciosa do MDC) não se materializou neste degrau

**Descoberta:** a migração automática do `ng update @angular/material@15` trocou os imports do
projeto para os módulos **`Legacy`** do Material (`MatLegacySnackBar`, `MatLegacyFormFieldModule`,
`MatLegacyInputModule`, `MatLegacyButtonModule`, `MatLegacyCheckboxModule`, `MatLegacyRadioModule`,
`MatLegacySelectModule`, `MatLegacyOptionModule`, `MatLegacyTableModule`) em vez de migrar
diretamente para os componentes MDC. Essa é uma escolha oficial e documentada do Angular team: os
módulos `legacy-*` preservam a estrutura DOM/classes CSS do Material 14 durante a janela de
transição, enquanto os paths sem `legacy` (ex.: `@angular/material/form-field`) passam a servir os
novos componentes MDC como padrão.

**Confirmação por evidência (não suposição):** capturas de tela da rota `/upload` (33
`<mat-form-field>`) em múltiplas posições de scroll mostram os campos com fundo branco, underline e
labels renderizando exatamente como antes — as 10 sobrescritas CSS do projeto
(`.mat-form-field-appearance-fill .mat-form-field-flex/-infix`, `.mat-form-field-underline::before`,
`::ng-deep .mat-form-field-label`) continuam aplicando normalmente.

**Consulta ao repositório oficial (`angular/components`, tag `15.2.9`):** confirmei o mapeamento
exato que *seria* necessário se o projeto estivesse nos componentes MDC: `.mat-form-field` →
`.mat-mdc-form-field` (direto); `.mat-form-field-flex`, `.mat-form-field-infix`,
`.mat-form-field-underline`, `.mat-form-field-label` → **sem equivalente direto** (estrutura DOM
completamente diferente no MDC); `.mat-snack-bar-container` → `.mat-mdc-snack-bar-container`
(direto); `.mat-simple-snack-bar-content` → `.mat-mdc-snack-bar-label` (direto — **corrige** a
suposição do plano de que essa classe também não teria equivalente direto). Essa informação fica
registrada para quando for de fato necessária.

**Consequência:** o plano já alertava — *"Não apoiar em `mat-legacy-*`: existe no 15/16 e é
removido no 17 (D3)"*. O risco A1 não desaparece; **é adiado** para o D3 (Angular 17), quando os
módulos `legacy-*` deixam de existir e a migração real para MDC (com o mapeamento acima) se torna
obrigatória. Marcado como item de atenção prioritária para a Etapa 6 (D3) no próximo relatório.

### Decisão 2: não aplicar o mapeamento MDC nesta etapa

**Decisão:** não editar `styles.scss` nem `produtores.component.scss` nesta etapa.

**Justificativa:** consequência direta da Decisão 1 — como o projeto está nos componentes
`Legacy` (não MDC), as classes `.mat-form-field-*` antigas continuam sendo as corretas. Editar
agora introduziria uma mudança desnecessária e potencialmente quebraria o CSS contra os componentes
`Legacy` reais.

### Decisão 3: bug real da migração automática em `src/test.ts` — diagnosticado e corrigido

**Descoberta:** a migração "Remove no longer needed require calls in Karma builder main file"
removeu a declaração `const context = require.context(...)` de `test.ts`, mas **não removeu** o
código que a usa mais abaixo (linhas de `FOCUS_SPECS`), quebrando a compilação
(`__webpack_require__(...).context is not a function` — confirmado por execução real, não suposto).

**Investigação:** a remoção do `require.context` estava **correta em si** — essa API não funciona
mais no builder Karma do Angular 15, e `tsconfig.spec.json` já tem
`"include": ["src/**/*.spec.ts", "src/**/*.d.ts"]`, que faz o builder descobrir todos os specs
automaticamente sem precisar de `require.context` manual (confirmado: `npm test` chega a
115/115 sem esse mecanismo). O bug foi a migração ter deixado código órfão referenciando a
variável removida, sem adaptar a lógica de "focus" que dependia dela.

**Verificação de que o mecanismo removido nunca era usado de fato:** nenhum script `npm` define a
variável de ambiente `FOCUS_SPECS`; `docs/ia-auditorias/R09-musicas-integracao-licenca-carrinho.md:49`
já registrava, antes desta migração, que *"o script `test:focus` ignora `FOCUS_SPECS`"* — o
mecanismo real de foco (`npm run test:focus`) é outro, completamente independente (target
`test-focus` do `angular.json`, main `src/test.focus.ts` com imports fixos, sem `require.context`).

**Decisão final:** removido o bloco morto de `FOCUS_SPECS`/`context` de `test.ts`, mantendo apenas
a inicialização do `TestBed` e a configuração global de módulos — exatamente o que a migração já
pretendia, só que completa. `npm test` confirmado 115/115 após a correção.

**Achado colateral:** `npm run test:focus` (o mecanismo *real* de foco) **quebrou** de fato após o
D1 — builder tentando compilar specs fora do `include` restrito de `tsconfig.spec.focus.json`.
Registrado como achado 0012, não corrigido nesta etapa (fora do DoD oficial do degrau).

### Decisão 4: `npm audit` subiu de 62 para 65 — registrado, não revertido

**Decisão:** aceitar o aumento e documentar, sem tentar reduzir agora.

**Justificativa:** o plano menciona "deve cair monotonicamente" como expectativa geral da escada,
não uma garantia por degrau individual. Novas dependências transitivas do Angular/Material 15 (ex.:
uma versão de `webpack` usada internamente pelo novo builder) trazem advisories que não existiam
nas árvores de dependência do Angular 14. O fechamento efetivo dos advisories de Material está
previsto para o Material 18+ (achado A11 do plano) — um aumento temporário em degraus intermediários
é esperado e não invalida a estratégia.

## 14. Riscos identificados

| Risco | Severidade | Impacto | Mitigação |
|---|---|---|---|
| Migração real para MDC (D3) ainda não foi feita — 10 sobrescritas CSS continuam dependendo dos módulos `Legacy` | Alta (adiada, não eliminada) | Quando os módulos `legacy-*` forem removidos (D3/Angular 17), as sobrescritas quebram silenciosamente se não forem migradas antes | Mapeamento oficial já levantado nesta etapa (Decisão 1); aplicar antes/durante o D3 usando o procedimento do plano + a evidência já coletada aqui |
| `npm run test:focus` quebrado (achado 0012) | Média | Ferramenta de desenvolvimento indisponível; não afeta `npm test` nem CI | Investigar antes da Etapa 12 (migração para Vitest) |
| `npm audit` subiu para 65 | Baixa | Nenhum — esperado nesta fase | Nenhuma ação; monitorar a tendência a cada degrau |
| `karma.conf.js` mantém `client.args: [process.env.FOCUS_SPECS || '']` órfão | Baixa | Nenhum efeito funcional | Nenhuma ação — não expande o escopo desta etapa |

## 15. Compatibilidade com legado MokBeats

- Angular 14 preservado: Não aplicável (migrado para 15.2.10 — é o objetivo desta etapa)
- Rotas preservadas: Sim — `git diff` de `app-routing.module.ts` vazio
- Guards/autenticação preservados: Sim — nenhum guard tocado; specs de auth continuam passando
- APIs/payloads preservados: Sim — nenhum service tocado
- Player/WaveSurfer preservado: Sim — `player.cy.ts` (2 testes) passa
- Upload/FormData preservado: Sim — `upload.cy.ts` confirma nomes de campo idênticos
- Carrinho/licenças/checkout preservados: Sim — `checkout.cy.ts`/`licenca-carrinho.cy.ts` passam
- Dashboard/produtor preservado: Sim — não tocado
- Estilos/padrões preservados: Sim — confirmado visualmente (Decisão 1); nenhum `.html`/`.scss`
  alterado nesta etapa

## 16. Validações executadas

- [x] `ng update` completo (3 comandos) sob Node 24.18.1, árvore limpa (via stash) — sucesso.
- [x] Revisão de **todo** o diff (14 arquivos `.ts`/`.json`) antes do commit.
- [x] `npm run build` (produção) — sucesso.
- [x] `npm test` — **115/115 SUCCESS** (após a correção da Decisão 3).
- [x] `npm run e2e` — **5/5 specs, 8/8 testes**, 2 execuções.
- [x] `npm audit` — registrado (65, subiu de 62 — Decisão 4).
- [x] Comparação visual determinística do achado A1 — screenshots extraídas de `mig/e3` +
  capturas de scroll da tela de upload — confirmado sem regressão.
- [x] `git diff --stat src/**/*.html src/**/*.scss server/` — vazio (nenhum template/estilo/backend
  tocado).

## 17. Validações não executadas

- `npm run test:focus` — executado, mas **falhou** (achado 0012); não é exigido pelo DoD oficial
  do degrau, registrado como pendência, não como validação "não executada por escolha".
- `npm run lint`/`npm run typecheck` — não existem neste projeto.

## 18. Validações recomendadas

- [ ] Antes da Etapa 5 (D2): `git tag -l 'mig/*'` e `git log --oneline` para confirmar `mig/d1`.
- [ ] Rodar `npm run e2e` uma vez mais antes de iniciar D2, revertendo `server/data/users.json`
  depois.
- [ ] Ao chegar no D3 (Angular 17, Etapa 6), revisar o achado deste relatório (Decisão 1) e o
  mapeamento oficial de classes MDC levantado aqui **antes** de rodar `ng update @angular/material@17`
  — é quando os módulos `legacy-*` são removidos e a migração real de CSS se torna obrigatória.

## 19. Pendências

- Achado 0012 (`test:focus` quebrado) — aberto, revisitar antes da Etapa 12.
- Migração real para componentes MDC — adiada para o D3 (não uma pendência desta etapa, é o
  próprio desenho do plano, mas registrada aqui para não ser esquecida).
- `npm audit` em 65 — monitorar a tendência nos próximos degraus, sem ação agora.

## 20. Próximo passo recomendado

Aguardar confirmação explícita do usuário antes de iniciar a Etapa 5 (D2 — `ng update
@angular/core@16 @angular/cli@16 @angular/material@16` e `@ng-bootstrap/ng-bootstrap@15`),
conforme instrução da sessão.

## 21. Instruções para o próximo agente

1. Leia este relatório e os das Etapas 0, 1, 2 e 3.
2. Confirme `git log --oneline` e `git tag -l 'mig/*'` — deve haver `mig/e0` até `mig/e3` e
   `mig/d1`.
3. Leia `docs/migracao-angular-achados/README.md` — 12 achados registrados; nenhum bloqueia D2,
   mas o achado 0012 pode ganhar urgência dependendo de quando a Etapa 12 for planejada.
4. Confirme `node -v` = `24.18.1` antes de qualquer comando; a árvore de trabalho precisa estar
   **100% limpa** antes de rodar `ng update` (inclusive arquivos alheios não relacionados — use
   `git stash push -u -- <arquivo>` e `stash pop` depois, como feito nesta etapa).
5. Reverta `server/data/users.json` se `npm run e2e` for executado antes de commitar.
6. Leia a seção "Etapas 4-11" do plano (protocolo idêntico, riscos por degrau) antes de agir no D2.

## 22. Observações finais

O degrau classificado como "mais arriscado da escada" pelo plano transcorreu sem regressão visual
real, graças à estratégia de módulos `Legacy` do próprio Angular Material — uma mitigação
automática que o plano original não previa em detalhe, mas que é consistente com o aviso que ele já
continha sobre `mat-legacy-*` ser removido no D3. O único bug real encontrado
(`require.context` quebrado em `test.ts`) foi da própria migração automática, não da aplicação, e
foi corrigido com investigação de causa raiz antes de agir (confirmando por execução real que a
API não funciona mais, em vez de simplesmente restaurar o código antigo). Todas as validações
objetivas do bloco oficial (build, 115 testes, 5 specs e2e) permanecem verdes.
