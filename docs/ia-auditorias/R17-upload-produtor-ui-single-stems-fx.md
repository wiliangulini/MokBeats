# R17 — Upload produtor: UI, single, stems e FX

## Relatório do Claude Code

## Resumo da etapa

Reorganização puramente visual do formulário de upload do produtor (`ProdutoresComponent`,
usado tanto em `/produtores` quanto em `/upload`): o bloco **Single Track** foi movido para
**antes** dos blocos de Loop (15s/30s/60s) e passou a ocupar a largura total da grade
(`span-12`, com pequeno destaque tipográfico no label), em vez de `span-6` depois dos loops.
A ordem dos blocos condicionais de Stems (Melodias/Harmonias/Ritmos/Efeitos) e de Efeitos FX
(fx1..fx6) não mudou — ambos continuam aparecendo apenas no respectivo modo, depois dos loops.
Nenhum `FormControl`, validator, nome de campo do `FormData`, rota, guard ou service foi
alterado. Decisão explícita do usuário nesta etapa: a ocultura de Single Track/Loops no modo
Efeitos FX foi **adiada para a R18**, pois exigiria reescrever a regra de duração dos efeitos
(hoje ancorada na duração do Single Track) e mudar o payload enviado a `POST /api/producers/track`
— o que extrapola o escopo "sem alterar payload" desta etapa.

## Arquivos lidos

- `src/app/produtores/produtores.component.ts` — modos (`TrackMode`), FormGroup/validators,
  `applyModeValidators`, `buildFormData`, `buildDurations`, `validateDurations`.
- `src/app/produtores/produtores.component.html` — estrutura completa da grade de upload.
- `src/app/produtores/produtores.component.scss` — grid CSS de 12 colunas, classes `span-*`,
  breakpoints responsivos.
- `src/app/upload-file/upload-file.service.ts` — confirmação do contrato `POST /api/producers/track`.
- `src/app/app-routing.module.ts` — rota `/produtores` (sem guard) e rota lazy `/upload`
  (`AuthGuard`, `ProfileCompleteGuard`).
- `src/app/upload-file/upload-file-routing.module.ts` — confirmação de que `/upload` também
  renderiza `ProdutoresComponent`.
- `docs/areas/producer-upload.md` — regras de negócio dos três modos (fonte: `PROJECT_RULES.md §9.9`).
- `docs/ia-auditorias/R17-upload-produtor-ui-single-stems-fx.md` (stub existente, antes da escrita).

## Arquivos alterados

- `src/app/produtores/produtores.component.html` — bloco Single Track movido para antes dos
  loops; classe do Single Track alterada de `span-6` para `span-12 single-track-primary`;
  classe `loop-row-start` removida do bloco Loop 15s (deixou de ser necessária, pois o Single
  Track em `span-12` já força nova linha).
- `src/app/produtores/produtores.component.scss` — regra órfã `.loop-row-start` removida;
  adicionada regra discreta `.single-track-primary .field-label { font-size: 20px; }` para
  destaque tipográfico do label.

## O que foi implementado ou auditado

- Mapeamento completo dos 3 modos (`trackNoStems`, `trackWithStems`, `effectsFx`), campos por
  modo, validators estáticos vs. dinâmicos (`applyModeValidators`), e nomes de campo do
  `FormData` (`track`, `loop15/30/60`, `stem_melody/harmony/drums/fx`, `effect1..6`, `meta`).
- Confirmado que `/upload` e `/produtores` renderizam o mesmo `ProdutoresComponent`
  (`app-routing.module.ts:45` e `upload-file-routing.module.ts:6`), diferindo apenas nos guards
  (`/upload` tem `AuthGuard` + `ProfileCompleteGuard`; `/produtores` não tem guard).
- Reordenação visual: Single Track agora aparece **antes** dos loops, com largura 100% e leve
  destaque no label.
- Loops (15s/30s/60s) continuam sempre visíveis, na ordem original, agora depois do Single Track.
- Grupo Stems (Melodias/Harmonias/Ritmos/Efeitos) confirmado como já correto — visível somente
  em `trackWithStems`, sem alteração necessária.
- Grupo FX (fx1..fx6) confirmado como já correto — visível somente em `effectsFx`, sem stems de
  música exibidos; Single Track/Loops seguem visíveis nesse modo por decisão de escopo (ver
  Riscos/Pendências).
- Nenhum `formControlName`, validator, mensagem de erro, endpoint ou lógica de `buildFormData`/
  `buildDurations`/`validateDurations` foi tocado.

## Comandos executados

- [x] git status
- [x] npm run build
- [x] npm test

## Resultado dos comandos

- `git branch --show-current` → `dev` (branch correta confirmada antes de iniciar).
- `git status --short` (antes de editar) → árvore limpa.
- `git status --short` (depois de editar) → apenas os 2 arquivos do escopo:
  `M src/app/produtores/produtores.component.html`, `M src/app/produtores/produtores.component.scss`.
- `npm run build` (`ng build --configuration=production --base-href /`) → **sucesso**. Bundle
  gerado normalmente (`main.js` 1.63 MB raw / 271.18 kB transfer, etc.). Único aviso —
  `1 rules skipped due to selector errors: .custom-file-input:lang(en)~.custom-file-label` — é
  pré-existente e não relacionado a esta mudança (confirmado por não tocar nessa regra).
- `npm test -- --watch=false --browsers=ChromeHeadless` → **sucesso**. `Executed 115 of 115
  SUCCESS` (Chrome Headless 150.0.0.0), 0 falhas. Inclui os specs de `produtores.component.spec.ts`.

## Como validar manualmente

1. Rodar `npm start` e acessar `/produtores` (ou `/upload` autenticado com perfil completo).
2. **Modo "Single track"** (padrão): confirmar que o bloco **Single Track** aparece **antes**
   dos três loops, ocupando a largura total da linha; nenhum campo de Stems ou FX visível.
3. Selecionar **"Single track + Stems"**: confirmar que, após Single Track e os 3 loops,
   aparecem os 4 grupos — Melodias, Harmonias, Ritmos, Efeitos (FX) — cada um com upload próprio.
4. Selecionar **"Efeitos (FX)"**: confirmar que aparecem os 6 campos de efeito (Efeito 1..6) e
   nenhum stem de música (Melodias/Harmonias/Ritmos); Single Track e Loops continuam visíveis e
   obrigatórios (comportamento preservado desta etapa, não da R18).
5. Redimensionar a janela para < 768px: confirmar que a grade colapsa para 1 coluna, Single Track
   e loops empilham sem overflow horizontal. Testar também < 350px (zoom 80% aplicado ao container).
6. Preencher o formulário completo em cada modo e confirmar que o botão "Envie aqui" continua
   habilitando/desabilitando conforme `form.invalid`, sem regressão de validação.

## Riscos ou pendências

- **Pendência para R18**: no modo "Efeitos (FX)", Single Track e Loops continuam visíveis e
  obrigatórios (validators `Validators.required` estáticos preservados). Ocultá-los exigiria
  reescrever `validateDurations` (hoje ancora a duração dos efeitos na duração do Single Track,
  `produtores.component.ts:400-448`) e alterar o payload enviado por `buildFormData` a
  `POST /api/producers/track` (`produtores.component.ts:265-320`) — mudança de contrato de
  backend, fora do escopo "sem alterar payload" desta etapa. Registrado para a R18
  (`R18-upload-produtor-validacoes-duracao-formdata`), com validação de backend antes de implementar.
- **Observação de UX não corrigida nesta etapa**: os textos `stems-title`/`stems-helper`
  (`produtores.component.html:289-292`, "Stems" / "Todos os áudios deverão ter exatamente a
  mesma duração") ficam soltos na coluna do seletor de modo e aparecem em todos os 3 modos,
  inclusive quando não há stems. Não foi alterado para manter a mudança mínima e reversível;
  fica como melhoria opcional futura.
- Risco de regressão: baixo. Mudança contida em 2 arquivos (HTML/SCSS), sem tocar TS, service,
  rotas ou guards; build e suíte de testes completa passaram sem falhas.

## Confirmação de escopo

Alterados **somente** os dois arquivos previstos no escopo desta etapa:
`src/app/produtores/produtores.component.html` e `src/app/produtores/produtores.component.scss`.
Nenhum outro arquivo foi modificado — `produtores.component.ts`, `upload-file.service.ts`,
rotas e guards foram lidos apenas para leitura/auditoria, conforme instruído. Não houve
necessidade de sair do escopo.

---

## Revisão do Claude Code

# Revisão Claude Code — Etapa 11A — Upload do Produtor — reorganização visual Single/Stems/FX

## Classificação final
Aprovado com observações

## Resumo da revisão

O diff é exatamente o descrito no relatório de implementação: dois arquivos-fonte
(`produtores.component.html`, `produtores.component.scss`), zero linhas tocadas em
`produtores.component.ts`, `upload-file.service.ts`, rotas ou guards. A mudança move o bloco
Single Track para **antes** dos três loops e o expande de `span-6` para
`span-12 single-track-primary`, com destaque tipográfico de 20px no label via SCSS. A classe
órfã `.loop-row-start` foi removida de forma consistente (verificado com `grep -rn` em `src/`:
zero ocorrências remanescentes; a nova classe `.single-track-primary` só aparece nos dois
lugares esperados — HTML e SCSS). Os três modos (`trackNoStems`, `trackWithStems`, `effectsFx`)
continuam controlados por `applyModeValidators` em TS, intocado. `FormData` (`track`,
`loop15/30/60`, `stem_melody/harmony/drums/fx`, `effect1..6`, `meta`, `schemaVersion`, `mode`)
preservado byte a byte. Build de produção e suíte de testes completa rodaram limpos.

## Arquivos inspecionados
- `src/app/produtores/produtores.component.html` (leitura integral, 515 linhas)
- `src/app/produtores/produtores.component.ts` (leitura integral, 526 linhas)
- `src/app/produtores/produtores.component.scss` (leitura integral, 254 linhas)
- `src/app/upload-file/upload-file.service.ts` (leitura integral)
- `src/app/app-routing.module.ts` (rotas `/produtores` e `/upload`)
- `src/app/upload-file/upload-file-routing.module.ts`
- `docs/areas/producer-upload.md` (regras de negócio dos 3 modos)
- `git diff`, `git status --short`, `git diff --stat`
- `grep -rn` para `loop-row-start` e `single-track-primary` em todo `src/` (verificação de
  classes órfãs/duplicadas)

## Pontos aprovados
- `/upload` (lazy, `AuthGuard` + `ProfileCompleteGuard`) e `/produtores` (sem guard) renderizam
  o mesmo `ProdutoresComponent` — confirmado em `app-routing.module.ts:45,58` e
  `upload-file-routing.module.ts`. Guards não tocados.
- Single Track aparece antes dos loops, em `span-12`, com label destacado — atende ao pedido
  de reordenação e destaque de largura.
- Modo `trackWithStems` mostra os quatro grupos corretos (Melodias, Harmonias, Ritmos, Efeitos
  FX), inalterado e posicionado corretamente após Single Track + loops.
- Modo `effectsFx` mostra apenas Efeito 1..6, sem stems de música renderizados; `applyModeValidators`
  reseta e remove `Validators.required` dos controles de stems fora de `trackWithStems`, então
  stems nunca são obrigatórios em Single Track nem em FX.
- Nenhum `formControlName`, validator, nome de campo do `FormData`, endpoint
  (`POST /api/producers/track`), rota ou guard foi alterado — confirmado por diff vazio em
  `produtores.component.ts` e `upload-file.service.ts`.
- Classe CSS órfã `.loop-row-start` removida sem deixar resíduo (zero ocorrências restantes no
  projeto); nenhuma classe nova ficou duplicada ou conflitante.
- Responsividade preservada: breakpoint `< 768px` já colapsa todos os `span-*` (incluindo
  `span-12`) para coluna única; nenhum ajuste adicional necessário nem introduzido.
- Sem `href="#"`/`href=""` novos, sem manipulação direta de DOM, sem jQuery, sem mocks
  permanentes introduzidos no diff.
- Diff pequeno, localizado, rastreável e trivialmente reversível (2 arquivos, ~50 linhas).

## Problemas encontrados
### Bloqueadores
- Nenhum.

### Importantes
- Nenhum.

### Menores
- Os textos `stems-title` ("Stems") e `stems-helper` (HTML 289–292) continuam fixos na coluna
  do seletor de modo e visíveis em **todos** os três modos, inclusive Single Track e Efeitos FX,
  onde não há stems de música. Não é um campo obrigatório nem afeta validação — é ruído visual,
  não um bloqueador do critério de aceite "Single Track não mostra Stems como obrigatório".
  Correção sugerida (fora do escopo mínimo desta etapa, registrar como melhoria futura): envolver
  esse bloco em `*ngIf="isMode('trackWithStems')"` ou reposicioná-lo junto ao grupo de stems real.

## Regressões potenciais
- Nenhuma identificada. Player/WaveSurfer, carrinho, checkout e dashboard não foram tocados
  (fora do escopo do diff). Suíte de testes completa (115 specs, incluindo
  `produtores.component.spec.ts`) roda sem falhas após a mudança.

## Validação de comandos
- [x] git status
- [x] npm run build
- [x] npm test

## Resultado dos comandos
- `git status --short` → 3 arquivos modificados: este relatório `.md` +
  `produtores.component.html` + `produtores.component.scss`. Nenhum arquivo fora do escopo.
- `git diff --stat` → `produtores.component.html` (42 linhas, +/-), `produtores.component.scss`
  (8 linhas, +/-). Confirma diff pequeno e localizado.
- `npm run build` (`ng build --configuration=production --base-href /`) → **sucesso**.
  `main.163cb49555ad91a3.js` 1.63 MB raw / 271.18 kB transfer; total inicial 2.14 MB / 375.43 kB
  transfer. Único aviso — `1 rules skipped due to selector errors:
  .custom-file-input:lang(en)~.custom-file-label -> unmatched pseudo-class :lang` — pré-existente,
  não relacionado a este diff (a regra `:lang` não foi tocada nem está nos arquivos alterados).
- `npm test -- --watch=false --browsers=ChromeHeadless` → **sucesso**.
  `Chrome Headless 150.0.0.0 (Linux 0.0.0): Executed 115 of 115 SUCCESS` (3.792 secs / 3.025 secs),
  `TOTAL: 115 SUCCESS`. 0 falhas. Um `WARN` pré-existente sem relação ("Spec 'MusicPlayerService
  behavior updates current url and id' has no expectations") e logs de depuração de outro módulo
  (carrinho) aparecem no output — não são falhas nem specs novos, e não pertencem a este componente.

## Correções exigidas para nova execução
Nenhuma correção bloqueadora. Nenhuma correção obrigatória para esta etapa.

## Observações finais
Implementação fiel ao escopo pedido: reorganização puramente visual, sem tocar TypeScript,
service, rotas, guards ou payload. A decisão de adiar a ocultação de Single Track/Loops no modo
Efeitos FX para a R18 é tecnicamente correta — ocultá-los agora exigiria reescrever
`validateDurations` (que ancora a duração dos efeitos na duração do Single Track,
`produtores.component.ts:400-448`) e alterar o payload de `buildFormData`
(`produtores.component.ts:265-320`), o que é mudança de contrato de backend e está corretamente
fora do escopo desta etapa (`PROJECT_RULES.md §13`, `.claude/rules/api-contracts.md`). A
observação sobre `stems-title`/`stems-helper` é cosmética e não compromete o critério de aceite
"Single Track não mostra Stems como obrigatório" — está registrada como melhoria opcional, não
como bloqueio.

## Revisão técnica — 2026-07-21

Revisão reexecutada de forma independente nesta data, com leitura completa dos 4 arquivos
técnicos, `git diff` linha a linha, e reexecução de `npm run build` e `npm test` (não copiados
do relatório de implementação). Resultados idênticos aos reportados: diff de 2 arquivos-fonte,
build limpo (mesmo aviso pré-existente do seletor `:lang`), 115 de 115 testes com sucesso.
Nenhuma divergência entre o relatado e o observado. Classificação mantida: **Aprovado com
observações**, pela mesma observação cosmética de `stems-title`/`stems-helper` já registrada
acima, sem impacto em critério de aceite.

---

## Complemento pós-revisão

Sem complemento adicional — revisão independente confirmou integralmente o relatório de
implementação, sem achados novos.

---

## Status final da etapa

Aprovado com observações

## Pendências para etapas futuras

- R18: revisar/reescrever a regra de duração dos efeitos FX e o payload de `POST /api/producers/track`
  para permitir ocultar Single Track/Loops no modo Efeitos (FX), com validação prévia do backend.
- Melhoria opcional futura: reposicionar/condicionar os textos "Stems" e seu helper para que só
  apareçam junto ao grupo de Stems real (modo `trackWithStems`), em vez de fixos na coluna do
  seletor de modo em todos os modos.
