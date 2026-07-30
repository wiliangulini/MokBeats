# ADR 0002 — Migração major do Angular (14 → 22) do MokBeats

## Status

Aceita

## Contexto

O MokBeats roda Angular 14.3.0, cuja linha deixou de receber patches de segurança
(`angular.dev/reference/releases`: *"Angular versions v2 to v19 are no longer supported"*). O
`npm audit` da raiz retorna 62 vulnerabilidades (1 crítica, 43 altas), e a auditoria de 2026-07-30
já isolou que nenhuma delas se resolve sem salto de major. O projeto mantém dois runtimes Node
(backend em 24.18.1, frontend preso em 16.20.2 — "ponte EOL" documentada em `start.sh:74-79`), e
`.claude/rules/angular-14.md` proibia textualmente esta migração.

O diagnóstico herdado de sessões anteriores continha oito premissas que a análise desta sessão
corrigiu por leitura de código, `npm view`, `npm audit` e a página oficial de releases:

| Premissa herdada | Fato verificado | Impacto |
|---|---|---|
| Piso de segurança = Angular ≥ 19.2.16 | Superada. Advisories novos de `@angular/core`/`@angular/common` têm range `<=19.2.25` (última v19). Piso real = Angular 20 | Muda o alvo mínimo |
| Alvo natural = "20 LTS" | Pior opção. LTS da v20 termina em 2026-11-28 (~4 meses). Política oficial: 12 meses ativo + 12 LTS | Desqualifica o 20 |
| `fixAvailable` do toolchain = `@angular/cli@22.1.1` | Hoje é `21.2.19`. O Angular 20 não fecha o grupo de toolchain | Reforça a desqualificação do 20 |
| Karma é dívida "para quando der" | Não tem correção futura. `npm audit` aponta `fixAvailable: karma@0.12.33` — um downgrade | Torna a Etapa 12 obrigatória |
| Bootstrap 4→5 é consequência do alvo Angular | É pré-existente e ortogonal. O `@ng-bootstrap` 13.1.1 já instalado documenta Bootstrap 5 no próprio README | Permite antecipar a etapa |
| Superfície Bootstrap ≈ 370 ocorrências | ≈ 487. Faltava `font-weight-bold` × 137 (→ `fw-bold`) | +32% de volume |
| Rule do player com 1 path defasado | 11 patterns quebrados em 6 das 8 rules | Amplia a Etapa 0 |
| jQuery é removível com o Bootstrap 5 | Falso. `src/inputMask.js` é o `jquery.inputmask.bundle.js` v3.3.4 (2016) — jQuery é obrigatório | Reverte uma ação planejada |

## Problema

Como migrar o frontend de um major EOL (Angular 14) para uma versão suportada, fechando os
advisories de runtime e de toolchain, unificando o runtime Node do projeto e eliminando a dívida de
Karma sem correção futura — preservando os invariantes de produto (WaveSurfer, guards, `FormData`
do upload, licença→carrinho, rotas, contratos HTTP) e sem quebrar a base funcional da `dev`.

## Restrições

- Um major por etapa (`ng update`); nunca agrupar degraus.
- Nada em `server/` (backend já em 0 vulnerabilidades).
- Nenhum deploy ou operação na VPS.
- Sem redesign visual — a migração preserva a identidade atual.
- Não adotar standalone components, signals ou zoneless como refatoração oportunista (o `ng update`
  do D5 injeta `standalone: false` automaticamente; isso é preservação, não adoção).
- Não remover jQuery (obrigatório — ver Riscos) nem reordenar o array `scripts` de `angular.json`.
- `npm run lint` e `npm run typecheck` não existem neste projeto; não prometer nem reportar nenhum
  dos dois.

## Alternativas consideradas

| Alvo | Degraus a partir do 14 | Fase de suporte | Fim do suporte | Fecha toolchain | Fecha `@ng-bootstrap` (fix=21.0.0) |
|---|---|---|---|---|---|
| Angular 20.3.27 | 6 | LTS | 2026-11-28 (~4 meses) | Não | Não |
| Angular 21.2.19 | 7 | LTS | 2027-06 (~11 meses) | Sim | Não |
| **Angular 22.1.0** | **8** | **Ativa** | **2028-06 (~23 meses)** | **Sim** | **Sim** |

O alvo 20 se desqualifica sozinho: economiza 2 degraus para exigir remigração em ~4 meses, e nem
fecha o grupo de toolchain. Entre 21 e 22, a diferença real é um degrau que força TypeScript 6.0 —
o maior desconhecido do plano.

## Decisão recomendada

Angular 22.1.0, com **21.2.19 como checkpoint entregável e ponto de parada aceito**. O 21 é
estruturado como checkpoint completo e mergeável: se o TypeScript 6.0 ou o `@ng-bootstrap` 21 se
mostrarem hostis no D8, para-se em D7 com todo o resto já ganho, sem retrabalho.

Matriz de degraus (fonte: `npm view`, 2026-07-30):

| Degrau | Angular | Node exigido | TypeScript | `ng-bootstrap` | Material |
|---|---|---|---|---|---|
| D1 | 15.2.10 | `^14.20 \|\| ^16.13 \|\| >=18.10` | `>=4.8.2 <5.0` | 14.2.0 | 15.2.9 |
| D2 | 16.2.12 | `^16.14 \|\| >=18.10` | `>=4.9.3 <5.2` | 15.1.2 | 16.2.14 |
| D3 | 17.3.12 | `^18.13 \|\| >=20.9` | `>=5.2 <5.5` | 16.0.0 | 17.3.10 |
| D4 | 18.2.14 | `^18.19.1 \|\| ^20.11.1 \|\| >=22` | `>=5.4 <5.6` | 17.0.1 | 18.2.14 |
| D5 | 19.2.25 | idem D4 | `>=5.5 <5.9` | 18.0.0 | 19.2.19 |
| D6 | 20.3.27 | `^20.19 \|\| ^22.12 \|\| >=24` | `>=5.8 <6.0` | 19.0.1 | 20.2.14 |
| D7 | 21.2.19 | idem D6 | `>=5.9 <6.1` | 20.0.0 | 21.2.14 |
| D8 | 22.1.0 | `^22.22.3 \|\| ^24.15 \|\| >=26` | `>=6.0 <6.1` | 21.0.0 | 22.1.0 |

Lockstep do `ng-bootstrap`: versão X ↔ Angular X+1 (verificado em `peerDependencies` de 13 a 20).
Node 24.18.1 satisfaz os 8 degraus; o Node 16.20.2 morre no D3.

## Justificativa

O 22 é o único alvo que fecha simultaneamente os advisories de runtime, o grupo de toolchain e o
advisory de `@ng-bootstrap` (fix em 21.0.0), com a maior janela de suporte ativo (23 meses). O custo
de 1 degrau adicional sobre o 21 é isolado e cercado por um checkpoint mergeável, não um risco
difuso sobre todo o plano.

## Impactos

**Front-end Angular:** 8 majors sequenciais de `ng update`; builder `browser`→`application`/esbuild
no D3; standalone `false` injetado em ~70 componentes no D5; split de `@angular/build` no D6;
TypeScript 6.0 no D8.

**Node/API:** nenhum impacto em `server/` (fora de escopo). Unificação do runtime de
desenvolvimento/CI em Node 24.18.1 (Etapa 2) — o Node da VPS já está correto e é irrelevante para o
frontend, que é buildado localmente e publicado via `dist/` por rsync.

**Autenticação/segurança:** `AuthGuard`, `ProdutorGuard` e `ProfileCompleteGuard` devem manter a
assinatura atual através de todos os degraus — migrações automáticas do Angular podem converter
guards para functional guards; verificação explícita exigida a cada degrau.

**Player, upload, carrinho, licenças, dashboard:** ver tabela de invariantes no plano de execução
(§7, "Verificação de invariantes por degrau"). Nenhuma mudança de comportamento pretendida; qualquer
diff nesses arquivos fora do esperado pela migração automática exige justificativa escrita.

**Testes:** os 115 testes Karma atravessam a escada inteira (confirmado: `@angular/build@22.1.0`
mantém `karma ^6.4.0` como peer opcional) e só são portados para Vitest na Etapa 12, a última.
Cypress ganha 4 specs novas na Etapa 1, antes de qualquer degrau, como rede independente de runner e
de template.

## Riscos

| Risco | Severidade | Mitigação | Etapa |
|---|---|---|---|
| Material 15 (MDC) renomeia classes internas; o projeto sobrescreve 10 classes `.mat-*` em 2 arquivos (`styles.scss`, `produtores.component.scss`) — quebra silenciosa (build e testes passam, formulários quebram) | Alta | Screenshots de baseline (Etapa 1) + procedimento determinístico de mapeamento via `grep` no pacote instalado; não usar `mat-legacy-*` (removido no D3) | D1 |
| TypeScript 6.0 incompatível com o código sob `strict`+`strictTemplates` | Alta | D7 é checkpoint entregável; timebox no D8; parar em 21 é resultado aceito, não falha | D8 |
| Bootstrap 4→5: ~18 ocorrências estruturais (`form-group`, `.close`, `custom-file`, `badge-*`) sem cobertura automatizada | Média | Etapa isolada ainda em Angular 14; screenshots antes/depois; checklist manual nas 12 telas com `data-toggle` | 3 |
| Migração automática do D5 altera ~70 componentes de uma vez | Média | Revisão integral do diff antes do commit; suíte Karma ainda intacta nesse ponto | D5 |
| Migrações automáticas convertem guards para functional guards | Média | Verificação explícita de `src/app/guards/*.ts` a cada degrau | D1..D8 |
| Node 24 não roda o toolchain do Angular 14 | Média | Contingência: manter `.nvmrc` em 16.20.2 e reexecutar a Etapa 2 após o D2 (Node 16 só morre de fato no D3) | 2 |
| Etapa 12 reduz a contagem de testes durante o port Karma→Vitest | Média | Critério de aceite numérico: 115 testes, sem exceção sem justificativa nominal | 12 |
| Reordenar `scripts` de `angular.json` quebra as máscaras do checkout (`input_mask.js` acopla a `#numerocartao1`/`#cpfBol` via jQuery global no load) | Média | Proibição explícita; spec `checkout.cy.ts` assere as máscaras | 3, 13 |
| `@ng-bootstrap` 21.0.0 é recente e pouco exercitado | Baixa | Concentrado no D8; parada em D7 (`ng-bootstrap` 20.0.0) é a saída | D8 |
| `@types/node` 12 → 24 quebra compilação | Baixa | Blast radius verificado: `tsconfig.app.json` tem `"types": []`; spec só usa `["jasmine"]` | 2 |

## Plano incremental

| Etapa | Entrega | Depende de |
|---|---|---|
| 0 | Destravar e reconciliar as regras de IA + este ADR | — |
| 1 | Ampliar a rede e2e Cypress (4 specs novas + baseline visual) | 0 |
| 2 | Unificar o runtime Node em 24.18.1 | 1 |
| 3 | Bootstrap 4.6.2 → 5.3.8 (ainda em Angular 14) | 2 |
| 4–11 | Degraus D1..D8 do `ng update`, um major por etapa | 3 |
| 12 | Karma → Vitest | 11 (ou 10, se parar no D7) |
| 13 | Reflexo em `start.sh` / script de publicação + limpeza de vocabulário "ponte EOL" | 12 |

Protocolo idêntico em todos os degraus D1–D8: confirmar Node 24.18.1 e árvore limpa → ler o guia
oficial do degrau (`angular.dev/update-guide`) → `ng update @angular/core@N @angular/cli@N` →
`ng update @angular/material@N` e `@ng-bootstrap/ng-bootstrap@N-1` no mesmo degrau → revisar todo o
diff automático → rodar o bloco de validação (`npm run build`, `npm test`, `npm run e2e`,
`npm audit`) → commit + `git tag mig/dN`.

Rollback universal: `git reset --hard mig/<etapa anterior> && rm -rf node_modules && npm ci`. Não há
ponto de não-retorno dentro do repositório; as três fronteiras reais (Node 16 morre no D3, escape
`mat-legacy-*` removido no D3, publicação do `dist/` novo na VPS) estão fora do escopo deste plano.

## Critérios de aceite

| # | Critério | Como verificar |
|---|---|---|
| 1 | `npm run build` (produção) conclui sem erro sob Node 24.18.1 | Saída do comando |
| 2 | 115 testes passando (Vitest após a Etapa 12; Karma até lá) | Contagem, não só o status |
| 3 | `npm run e2e` verde com os 5 specs Cypress | Saída do comando |
| 4 | `npm audit` = 0 vulnerabilidades, ou cada remanescente justificada nominalmente com `fixAvailable` e alcance | `npm audit` |
| 5 | `@angular/core` em 22.1.0 (ou 21.2.19, se o critério de parada do D8 for acionado) | `package.json` |
| 6 | `.nvmrc` da raiz = `server/.nvmrc` = `24.18.1` | Um único Node no projeto |
| 7 | `git diff` de `app-routing.module.ts` e `upload-file-routing.module.ts` vazio | `git diff` |
| 8 | Services de `src/app/service/` sem alteração de URL, método HTTP ou shape | `git diff` |
| 9 | Nomes de campo do `FormData` idênticos | `cy.intercept` do `upload.cy.ts` |
| 10 | Zero regressão visual nas 12 telas com `data-toggle` e nas telas com `<mat-form-field>` | Comparação com as screenshots de baseline |
| 11 | As 11 rules corrigidas na Etapa 0 acionam contra arquivos reais | `find` de cada glob |
| 12 | Nenhuma alteração em `server/` | `git diff --stat server/` vazio |
| 13 | jQuery preservado e ordem de `scripts` de `angular.json` intacta | `git diff angular.json` |

Plano detalhado completo (achados A1–A15, riscos residuais e apêndices de versão):
`docs/ia-auditorias/2026-07-30__plano-migracao-angular-14-para-22-v2__claude.md`.
