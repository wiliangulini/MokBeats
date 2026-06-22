# R06 — Etapa 6 — Login e correção de fonte/renderização do tipo de perfil

## Relatório do Codex

## Resumo da etapa

Correção visual aplicada no custom select de “Tipo de Perfil” do Login. Os valores funcionais `comprador` e `produtor` não foram alterados.

## Arquivos lidos

- `PROJECT_RULES.md`
- `AGENTS.md`
- `src/app/login/login.component.html`
- `src/app/login/login.component.ts`
- `src/app/login/login.component.scss`
- `src/app/login/auth.service.ts`
- `src/app/login/login.component.spec.ts`
- `src/test.ts`
- `angular.json`

## Arquivos alterados

- `src/app/login/login.component.scss`

## O que foi implementado ou auditado

- Corrigida a renderização do texto do select com `font-family`, `line-height`, `min-width` e `box-sizing`.
- Reservado espaço fixo para o ícone `material-icons`.
- Removido `underline dotted` de `.option-help`, mantendo `ngbTooltip` e `cursor: help`.
- Auditado que `comprador` e `produtor` continuam sendo os valores enviados no cadastro.

## Comandos executados

- [x] `git branch`
- [x] `git status`
- [x] `npm run build`
- [x] `npm test -- --watch=false --browsers=ChromeHeadless`
- [x] `npm test -- --watch=false --browsers=ChromeHeadless --include=src/app/login/login.component.spec.ts`
- [x] `git diff --check`

## Resultado dos comandos

- `git branch`: branch atual `dev`.
- `git status`: somente `src/app/login/login.component.scss` alterado.
- `npm run build`: passou.
- `npm test`: falhou com 9 falhas. Há 2 falhas em `ProdutoresComponent` e 7 em `LoginComponent`.
- A spec isolada de Login também falhou por configuração de teste: `Router` spy sem `routerState.root` para `routerLink`. Não alterei specs por estar fora do plano aprovado.
- `git diff --check`: passou sem erros.

## Como validar manualmente

1. Abrir o modal de cadastro/login.
2. Abrir “Tipo de Perfil” e confirmar que `Mok Starters` e `Mok Makers` aparecem legíveis.
3. Verificar tooltip em hover/focus.
4. Selecionar cada opção e confirmar que o fluxo de cadastro segue normal.

## Riscos ou pendências

- Testes automatizados já têm falhas fora da alteração SCSS desta etapa.
- Validação visual manual em Chrome/Firefox não foi executada nesta rodada.

## Confirmação de escopo

Alterei somente arquivo dentro do escopo da Etapa 6: `src/app/login/login.component.scss`. Não alterei autenticação, payload, services, guards, rotas, upload, dashboard, player ou carrinho.

---

## Revisão do Claude Code

Revisão Claude Code — R06 — Login e correção de fonte/renderização do tipo de perfil
Classificação final
Aprovado com observações

Resumo
A R06 cumpriu o escopo com precisão. Apenas login.component.scss foi alterado (31 linhas, todas sob .ls-select.status). A causa raiz dos "pontinhos" foi corretamente identificada: ausência de font-family: "Material Icons" no seletor .arrow e falta de constraints de layout flex no .control p.txt. Autenticação, payload, guards, services e todas as demais áreas estão intactos. O build passou.

Pontos aprovados
Escopo estritamente restrito: confirmado via git show a3da768 --stat — apenas .scss e o doc de auditoria foram incluídos no commit.
Causa raiz correta: <span class="material-icons arrow">keyboard_arrow_down</span> renderizava o texto literal sem a fonte. A adição de font-family: "Material Icons" em .arrow é o fix central.
Valores funcionais preservados: login.component.ts:47-57 — value: 'comprador' e value: 'produtor' intactos. Labels "Mok Starters" / "Mok Makers" são display-only. auth.service.ts:67-69 envia tipoPerfil: usuario.tipoPerfil (o .value, nunca o .label).
auth.service.ts não tocado: token, localStorage, fazerLogin, registrar, authStatusSubject, guards derivados — todos intactos.
login.component.ts não tocado: FormGroup, validadores, onSubmit, fazerLogin — intactos.
login.component.html não tocado: role="combobox", aria-*, [ngbTooltip], triggers="hover focus" — intactos.
Acessibilidade preservada: tabindex, outline no :focus, aria-selected — nenhum removido.
Sem impacto global: zero regras de input, select, button ou label globais alteradas.
Build passou: npm run build em 10686ms, sem erros.
Problemas encontrados
Bloqueadores
Nenhum.

Importantes
[1] 9 falhas em npm test — pré-existentes, não relacionadas ao SCSS

7 em LoginComponent: Router spy sem routerState.root para routerLink — problema de configuração de spec.
2 em ProdutoresComponent: pré-existentes.
Nenhuma das falhas é causável por alteração SCSS. Devem ser registradas como dívida técnica e corrigidas em etapa dedicada a specs antes de habilitar gate de CI.

Menores
[2] overflow: visible em .control p.txt — funciona para os labels atuais (curtos). Se labels crescerem futuramente, preferir overflow: hidden; white-space: nowrap; text-overflow: ellipsis. Não é bloqueador.

[3] Validação visual manual pendente — o Codex sinalizou que Chrome/Firefox não foram validados. A confirmação definitiva de que os "pontinhos" sumiram exige abrir o modal no navegador.

Regressões potenciais
Nenhuma identificável. Alteração puramente SCSS, escopada no seletor do componente.

Dívida pré-existente a registrar (não introduzida pela R06): login.component.ts:135-165 — irProLogin, back, resetPassword usam document.getElementById e manipulação direta de estilo. Candidato para refatoração futura com estado Angular.

Validação
 git show a3da768 — diff inspecionado integralmente
 npm run build — passou
 npm test — 9 falhas pré-existentes (documentadas)
 Validação visual manual (Chrome/Firefox) — pendente, a executar pelo desenvolvedor
Correções exigidas para o Codex
Nenhuma. A R06 está aprovada para registro. A única pendência é a validação visual no navegador antes de marcar a etapa como 100% concluída.

---

## Complemento pós-revisão

[cole aqui o complemento, se houver]

---

## Status final da etapa

Aprovado / Aprovado com observações / Reprovado

## Pendências para etapas futuras

- ...
