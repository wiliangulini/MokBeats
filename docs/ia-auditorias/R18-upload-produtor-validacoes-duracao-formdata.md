# R18 — Upload produtor: validações, duração e FormData

## Relatório do Claude Code

## Resumo da etapa

Etapa 11B — auditoria de que a reorganização visual da R17 (commit `f3148e6`, que moveu o
bloco Single Track para antes dos loops e alterou apenas HTML/SCSS) não quebrou a lógica
de validação de duração, obrigatoriedade por modo e montagem do `FormData` do upload do
produtor. Exploração confirmou que a R17 tocou somente
`produtores.component.html`/`.scss`; toda a lógica de negócio (`produtores.component.ts`,
`upload-file.service.ts`) permaneceu intocada. Auditoria de código real + execução de
`npm run build` e `npm test` confirmam que os 6 critérios de aceite continuam válidos.
**Nenhuma alteração de código-fonte foi necessária** — etapa somente de leitura/auditoria,
conforme decisão validada com o usuário em Plan Mode.

## Arquivos lidos

- `src/app/produtores/produtores.component.ts`
- `src/app/produtores/produtores.component.html`
- `src/app/produtores/produtores.component.spec.ts`
- `src/app/upload-file/upload-file.service.ts`
- `src/app/shared/validators.ts`
- `docs/areas/producer-upload.md`
- `.claude/rules/producer-upload.md`
- `.claude/rules/api-contracts.md`
- `docs/ia-auditorias/R17-upload-produtor-ui-single-stems-fx.md` (contexto de continuidade)
- `package.json` (scripts e versão do Angular)
- Diff do commit `f3148e6` (R17), via `git show --stat` / `--name-only`

## Arquivos alterados

- Nenhum arquivo de código-fonte foi alterado.
- Único arquivo gravado: este relatório
  (`docs/ia-auditorias/R18-upload-produtor-validacoes-duracao-formdata.md`), substituindo
  o conteúdo placeholder anterior.

## O que foi implementado ou auditado

Auditoria dos 6 critérios de aceite da Etapa 11B, com evidência de código:

1. **Validações por modo funcionam** — `applyModeValidators()`
   (`produtores.component.ts:239-263`) aplica `Validators.required` aos controles de stems
   (`stemMelodyFile`, `stemHarmonyFile`, `stemDrumsFile`, `stemFxFile`) somente quando
   `mode === 'trackWithStems'`, e aos controles `fx1..fx6` somente quando
   `mode === 'effectsFx'`. Nos demais modos os controles são resetados e limpos de
   validadores. Coberto pelos testes `should require stems only in trackWithStems mode` e
   `should require fx1..fx6 only in effectsFx mode and reset stems`
   (`produtores.component.spec.ts:67-92`).

2. **`FormData` preserva contrato existente** — `buildFormData()`
   (`produtores.component.ts:265-320`) monta `schemaVersion='producer_form_v2'`, `mode`,
   `track`, `loop15`/`loop30`/`loop60`, `stem_melody`/`stem_harmony`/`stem_drums`/`stem_fx`
   (só em `trackWithStems`), `effect1..effect6` (só em `effectsFx`) e `meta` (JSON com
   dados do artista, registro classificado e `durations`). Nenhum nome de campo foi
   alterado. Coberto por `produtores.component.spec.ts:135-146` (payload v2) e `:202-210`
   (payload FX).

3. **Single Track envia sem stems** — em `buildFormData`, os `fd.append('stem_*', ...)`
   só ocorrem dentro do bloco `if (mode === 'trackWithStems')`
   (`produtores.component.ts:278-283`); no modo `trackNoStems` esses campos simplesmente
   não são anexados ao `FormData`.

4. **Single Track + Stems exige stems corretos** — `applyModeValidators` torna os 4
   controles de stem obrigatórios nesse modo (`ts:244-245`), e `validateDurations()`
   (`ts:424-437`) rejeita o envio se qualquer stem não tiver a mesma duração do Single
   Track (tolerância de ±200ms), com mensagens específicas por stem.

5. **FX não envia campos de música indevidos** — no modo `effectsFx`, `buildFormData`
   não anexa nenhum `stem_*` (bloco condicional `ts:278-283` não é executado); anexa
   apenas `effect1..effect6` (`ts:285-289`). Por decisão confirmada com o usuário, o envio
   de `track` + `loop15/30/60` no modo FX foi mantido como está — esses campos continuam
   obrigatórios no formulário e fazem parte do contrato vigente com o backend (coberto por
   `produtores.component.spec.ts:200-210`); alterá-los seria mudança de contrato de API e
   exigiria validação de backend, fora do escopo desta etapa (ver PROJECT_RULES.md §13 e
   `.claude/rules/api-contracts.md`).

6. **Erro de validação é visível ao usuário** — resumo de erros em bloco `alert-danger`
   (`produtores.component.html:73-82`) alimentado por `errorSummary`, `mat-error` por
   campo, `MatSnackBar` para mensagens pontuais, e `scrollToErrorSummary()` +
   `focusFirstInvalidControl()` para guiar o usuário até o primeiro campo inválido
   (`produtores.component.ts:146-186`, `buildErrorSummary()` em `ts:451-503`,
   `validateDurations()` em `ts:400-449`).

**Validação de duração dos loops** (`validateDurations`, `ts:412-422`): Loop 15s/30s/60s
seguem exigindo duração exata (±200ms) — 15000ms, 30000ms e 60000ms respectivamente —
preservada e independente da reordenação visual feita na R17.

**Conclusão da auditoria**: a reorganização visual da R17 (mover Single Track para antes
dos loops, `span-6` → `span-12`, destaque tipográfico) alterou apenas HTML/SCSS. A lógica
de validação, duração e montagem de `FormData` em `produtores.component.ts` e o endpoint
`uploadProducerTrack()` em `upload-file.service.ts` (`POST /producers/track`) permanecem
inalterados e funcionais.

## Comandos executados

- [x] git branch (confirmado: `dev`)
- [x] git status (confirmado: nenhum arquivo de código do escopo modificado antes da
      execução; apenas docs de outras etapas R19–R28 e `.vscode/settings.json`, fora do
      escopo da R18)
- [x] npm run build
- [x] npm test (via `npm test -- --watch=false --browsers=ChromeHeadless`, execução
      não-interativa)

## Resultado dos comandos

**`npm run build`** — sucesso.

```text
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.
Initial Total: 2.14 MB | Estimated Transfer Size: 375.43 kB
Build at: 2026-07-22T17:10:58.305Z - Hash: f54fd4ed979c1e28 - Time: 9557ms
```

Aviso pré-existente, não relacionado ao escopo: `1 rules skipped due to selector errors:
.custom-file-input:lang(en)~.custom-file-label -> unmatched pseudo-class :lang`.

**`npm test`** — sucesso, 115/115 testes.

```text
Chrome Headless 150.0.0.0 (Linux 0.0.0): Executed 115 of 115 SUCCESS (1.381 secs / 1.092 secs)
TOTAL: 115 SUCCESS
```

Os 4 testes do `ProdutoresComponent` (obrigatoriedade por modo, reset de stems ao trocar
para FX, payload v2 em `trackNoStems`, payload FX com `effect1..effect6`) passaram.
Warning não relacionado ao escopo: `Spec 'MusicPlayerService behavior updates current url
and id' has no expectations.`

## Como validar manualmente

1. Acessar `/produtores`, selecionar modo **Single track**, preencher os campos
   obrigatórios (nome, email, telefone, identificação, dados da faixa) e enviar Single
   Track + Loop 15s/30s/60s com durações exatas (15s/30s/60s, tolerância ±200ms) e
   confirmar que o envio ocorre **sem** exigir stems.
2. Trocar para **Single track + Stems**, confirmar que os 4 campos de stem passam a ser
   obrigatórios e que a validação rejeita stems com duração diferente da do Single Track
   (mensagem de erro específica por stem).
3. Trocar para **Efeitos (FX)**, confirmar que os campos de stem somem do formulário e não
   são exigidos, que os 6 campos de efeito passam a ser obrigatórios, e que cada efeito
   deve ter a mesma duração do Single Track.
4. Em qualquer modo, tentar enviar com campos inválidos e confirmar que o resumo de erros
   aparece no topo do formulário, a página rola até ele e o snackbar exibe a mensagem.
5. Abrir o DevTools → aba Network ao enviar um upload válido e confirmar no `POST
   /api/producers/track` que o `FormData` contém `schemaVersion`, `mode`, `track`,
   `loop15/30/60`, `stem_*` (só em Stems) ou `effect1..6` (só em FX), e `meta` em JSON.

## Riscos ou pendências

- **Pré-existente, não introduzido pela R17**: o botão de envio usa
  `[disabled]="form.invalid"` (`produtores.component.html:503`). Isso torna o ramo de
  `onUpload()` que monta `errorSummary` a partir de `form.invalid`
  (`produtores.component.ts:151-157`) de difícil alcance via clique real, já que o botão
  fica desabilitado antes disso. Não corrigido nesta etapa por estar fora do escopo (R18 é
  somente auditoria); registrar como candidato a ajuste de UX em etapa futura.
- **Pendência de validação de backend**: o modo FX continua enviando `track` +
  `loop15/30/60` no `FormData`, além dos `effect1..6`. Caso se deseje futuramente que o FX
  envie somente campos de efeitos, isso exige confirmação explícita do backend antes de
  qualquer alteração (mudança de contrato de API — PROJECT_RULES.md §13).
- Nenhum risco de regressão identificado nos fluxos de duração, obrigatoriedade por modo
  ou `FormData` decorrente da R17.

## Confirmação de escopo

Alterei somente o arquivo de relatório desta etapa
(`docs/ia-auditorias/R18-upload-produtor-validacoes-duracao-formdata.md`). Nenhum arquivo
de código-fonte (`produtores.component.ts/.html/.scss`, `upload-file.service.ts`) foi
modificado, pois a auditoria confirmou que a lógica de negócio já preserva os 6 critérios
de aceite após a reorganização visual da R17. Escopo integralmente respeitado.

---

## Revisão do Claude Code

### Revisão Claude Code — Etapa 11B — Upload do Produtor — validações, duração e FormData

#### Classificação final

Aprovado com observações

#### Resumo da revisão

A auditoria da R18 cumpre integralmente o objetivo da etapa: confirmar que a reorganização
visual da R17 (`f3148e6` — moveu o bloco Single Track para antes dos loops, `span-6` →
`span-12`, com destaque tipográfico) não afetou a lógica de validação, duração ou
`FormData` do upload do produtor. Conferi `git show --stat`/`--name-only` de `f3148e6` e
confirmei que o commit tocou apenas `produtores.component.html`, `produtores.component.scss`
e o relatório da R17 — nenhum `.ts` foi alterado. `git status`/`git diff --stat` nesta
sessão confirmam que a R18 também não alterou nenhum arquivo de código-fonte no escopo
(`src/app/produtores/**`, `src/app/upload-file/**`, `package.json`); apenas documentação
(`docs/ia-auditorias/*.md`) e `.vscode/settings.json` aparecem no diff, fora do escopo desta
etapa.

Reli linha a linha `produtores.component.ts` e `upload-file.service.ts` e todas as
referências de código citadas no relatório (`applyModeValidators` ts:239-263,
`buildFormData` ts:265-320, `validateDurations` ts:400-449, `buildErrorSummary` ts:451-503)
batem exatamente com o arquivo real — não há nenhuma linha citada incorretamente ou
afirmação não sustentada pelo código. Os 6 critérios de aceite da etapa foram verificados
individualmente contra a implementação e todos se confirmam. As duas observações
registradas no relatório (botão `[disabled]="form.invalid"` tornando o ramo de erro de
`onUpload()` de difícil alcance via clique; modo FX ainda enviando `track`+`loop15/30/60`)
são reais, pré-existentes à R17/R18, corretamente classificadas como fora do escopo desta
etapa (mudança de contrato de API exige validação de backend — PROJECT_RULES.md §13,
`.claude/rules/api-contracts.md`) e devidamente carregadas para pendências futuras. Por
isso a classificação é "aprovado com observações" e não "aprovado": as observações não são
defeitos da R18, mas achados legítimos que merecem tratamento em etapa própria.

#### Arquivos inspecionados

- `src/app/produtores/produtores.component.ts` (leitura integral, 527 linhas)
- `src/app/produtores/produtores.component.html` (trechos: resumo de erros, botão de envio)
- `src/app/produtores/produtores.component.spec.ts` (leitura integral, 211 linhas)
- `src/app/upload-file/upload-file.service.ts` (leitura integral)
- `.claude/rules/producer-upload.md`, `.claude/rules/api-contracts.md`
- `docs/ia-auditorias/R18-upload-produtor-validacoes-duracao-formdata.md` (relatório sob revisão)
- `git show --stat` / `--name-only` do commit `f3148e6` (R17)
- `git status`, `git diff --stat` (estado atual da branch `dev`)

#### Pontos aprovados

- Nenhum arquivo de código-fonte foi alterado na R18; a etapa respeitou seu próprio
  contrato de "somente auditoria".
- Todas as referências de linha citadas no relatório conferem com o código atual.
- Os 6 critérios de aceite estão de fato implementados e cobertos por teste:
  - `applyModeValidators` (ts:239-263) aplica `required` a stems só em `trackWithStems`
    e a `fx1..fx6` só em `effectsFx`, resetando os controles do modo não ativo.
  - `buildFormData` (ts:265-320) preserva `schemaVersion='producer_form_v2'`, `mode`,
    `track`, `loop15/30/60`, `stem_melody/harmony/drums/fx` (só em Stems),
    `effect1..effect6` (só em FX) e `meta` — nenhum campo foi renomeado.
  - Em `trackNoStems`, o bloco de `stem_*` não é executado (ts:278-283) — Single Track
    envia sem stems.
  - Em `trackWithStems`, `validateDurations` (ts:424-437) rejeita qualquer stem fora de
    ±200ms da duração do Single Track, com mensagem específica por stem.
  - Em `effectsFx`, nenhum `stem_*` é anexado; apenas `effect1..6` (ts:285-289).
  - Erros são visíveis via bloco `alert-danger` + `errorSummary` (html:73-82), `mat-error`
    por campo, `MatSnackBar`, `scrollToErrorSummary()` e `focusFirstInvalidControl()`.
- Loop 15/30/60 seguem exigindo duração exata (15000/30000/60000ms, ±200ms) — inalterado
  pela reorganização visual da R17 (ts:412-422).
- Os 4 specs de `ProdutoresComponent` cobrem obrigatoriedade por modo, reset de stems ao
  trocar para FX, payload v2 em `trackNoStems` e payload FX com `effect1..effect6`;
  todos passam.
- Nenhum campo de `FormData` foi renomeado; nenhuma mudança de contrato de API foi feita
  sem validação de backend — em conformidade com `.claude/rules/api-contracts.md`.
- Nenhum guard, interceptor, service global, autenticação ou rota privada foi tocado.
- Nenhum `href="#"`/`href=""`, manipulação direta de DOM nova, jQuery ou mock permanente
  foi introduzido.
- `package.json` permaneceu intacto (nenhuma dependência nova).

#### Problemas encontrados

##### Bloqueadores

- Nenhum.

##### Importantes

- Nenhum. As duas observações abaixo são pré-existentes e já tratadas como pendências
  futuras, não como defeitos desta etapa — ver seção "Observações finais".

##### Menores

- O botão de envio usa `[disabled]="form.invalid"` (`produtores.component.html`, linha do
  `submit-row`). Isso significa que o ramo de `onUpload()` que monta `errorSummary` via
  `form.invalid` (ts:151-157) só é alcançado programaticamente (como nos testes) ou se o
  Angular Material permitir o clique em um estado transitório — na prática, um usuário real
  quase nunca aciona esse ramo por clique, pois o botão já está desabilitado antes disso.
  Não é uma regressão da R17/R18 (o comportamento já existia antes), mas seria uma melhoria
  de UX válida corrigir em etapa futura.
- O modo FX continua enviando `track` + `loop15/30/60` no `FormData`, além de
  `effect1..effect6`. Isso é consistente com o contrato atual do backend e está
  corretamente documentado como pendência de validação de backend antes de qualquer
  alteração — não é uma falha da R18.

#### Regressões potenciais

- Nenhuma identificada. A reorganização visual da R17 alterou apenas HTML/SCSS
  (confirmado via `git show --stat f3148e6`); a lógica de validação, duração e montagem
  de `FormData` em `produtores.component.ts` permanece bit-a-bit a mesma, e os testes que
  cobrem essa lógica continuam passando.

#### Validação de comandos

- [x] git status
- [x] npm run build
- [x] npm test

#### Resultado dos comandos (revisão independente)

**`git status` / `git diff --stat`** — confirmado que nenhum arquivo em
`src/app/produtores/**`, `src/app/upload-file/**` ou `package.json` está modificado nesta
sessão. Apenas `docs/ia-auditorias/*.md` (R18–R28) e `.vscode/settings.json` aparecem no
`git status`, fora do escopo desta revisão.

**`npm run build`** — sucesso.

```text
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.
Initial Total: 2.14 MB | Estimated Transfer Size: 375.43 kB
Build at: 2026-07-22T17:57:41.283Z - Hash: f54fd4ed979c1e28 - Time: 8137ms
```

Mesmo aviso pré-existente, não relacionado ao escopo: `1 rules skipped due to selector
errors: .custom-file-input:lang(en)~.custom-file-label -> unmatched pseudo-class :lang`.

**`npm test`** (`-- --watch=false --browsers=ChromeHeadless`) — sucesso, 115/115 testes.

```text
Chrome Headless 150.0.0.0 (Linux 0.0.0): Executed 115 of 115 SUCCESS (1.671 secs / 1.426 secs)
TOTAL: 115 SUCCESS
```

Os 4 specs de `ProdutoresComponent` relevantes à R18 passaram, confirmando obrigatoriedade
por modo, reset de stems ao trocar para FX, payload v2 em `trackNoStems` e payload FX com
`effect1..effect6`.

#### Correções exigidas para nova execução

Nenhuma. Não há bloqueadores nem itens importantes pendentes de correção nesta etapa.

#### Observações finais

A R18 é um exemplo de auditoria bem conduzida: escopo respeitado (zero alteração de
código-fonte), evidência de código real citada com precisão de linha, comandos de
validação executados e documentados, e riscos residuais reportados com honestidade em vez
de omitidos. As duas pendências identificadas (botão desabilitado mascarando o ramo de
erro de `onUpload`; FX enviando campos de música além dos efeitos) já estavam presentes
antes da R17 e continuam corretamente registradas como candidatas a etapas futuras, sem
exigir ação nesta revisão.

## Revisão técnica — 2026-07-22

Revisão executada nesta data com leitura completa dos arquivos técnicos envolvidos
(`produtores.component.ts`, `.html`, `upload-file.service.ts`, specs), conferência
linha a linha de todas as referências de código citadas no relatório de implementação, e
reexecução de `npm run build` e `npm test` (não copiados do relatório anterior). Resultados
idênticos aos reportados: zero diff de código-fonte no escopo, build limpo (mesmo aviso
pré-existente do seletor `:lang`), 115 de 115 testes com sucesso. Nenhuma divergência entre
o relatado e o observado. Classificação mantida: **Aprovado com observações**, pelas duas
observações menores já registradas acima (botão desabilitado mascarando o ramo de erro;
FX enviando campos de música além dos efeitos), sem impacto em nenhum dos 6 critérios de
aceite.

---

## Complemento pós-revisão

Sem complemento adicional — a revisão independente confirmou integralmente o relatório de
auditoria, sem achados novos além dos dois pontos menores já registrados (pré-existentes,
fora do escopo da R18).

---

## Status final da etapa

Aprovado com observações

## Pendências para etapas futuras

- Avaliar reabilitar o botão de envio mesmo com `form.invalid` (ou usar outro gatilho) para
  que o resumo de erros de `onUpload()` seja de fato alcançável via clique, melhorando a
  UX de erro.
- Validar com o backend se o modo FX deve deixar de enviar `track`/`loop15/30/60` no
  `FormData`, restringindo-se a `effect1..effect6`.
