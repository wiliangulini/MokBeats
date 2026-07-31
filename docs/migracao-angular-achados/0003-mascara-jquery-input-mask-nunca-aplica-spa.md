# 0003 — Máscara de cartão/CPF (`input_mask.js`) nunca aplica em nenhuma rota

**Etapa de origem:** 1 (ampliar rede e2e Cypress)
**Severidade:** Média
**Status:** Aberto

## Descrição

`src/input_mask.js` roda `$("#numerocartao1").inputmask({...})` e
`$("#cpfBol").inputmask({...})` de forma síncrona, no top-level do arquivo, sem
`$(document).ready()` nem `MutationObserver`. Esse script é injetado via `scripts` do
`angular.json` (`node_modules/jquery/dist/jquery.js`, `bootstrap.bundle.js`, `src/inputMask.js`,
`src/input_mask.js`) e executa **uma única vez**, no carregamento do documento HTML — **antes** de
o Angular montar qualquer componente (o `<app-root>` está vazio nesse momento).

Consequência: `$("#numerocartao1")`/`$("#cpfBol")` sempre retornam um jQuery-set vazio. A máscara
nunca aplica em nenhuma tela da aplicação, em nenhuma condição — não é uma questão de navegação
SPA vs. reload; é estrutural, porque o elemento não existe fisicamente no DOM enquanto o script
roda, independentemente de como o usuário chega até a tela.

O achado A5 do plano de migração presumia que a máscara aplica hoje ("preservar comportamento das
máscaras"). Essa premissa está desatualizada: não há comportamento funcional para preservar nessas
duas telas especificamente — a proibição de reordenar `scripts` de `angular.json` continua válida
por outros motivos (não piorar o que já não funciona), mas não protege uma funcionalidade ativa.

## Evidência

Reproduzido nesta sessão: digitar `1234567890123456` em `#numerocartao1` (após navegar via
`cy.visit('/#/formas-de-pagamento')`, um reload completo do documento) resulta no valor idêntico,
sem espaços — a máscara não aplicou. Confirmado estruturalmente pela ordem de carregamento dos
`scripts` no `angular.json` e pelo conteúdo literal de `src/input_mask.js` (2 linhas, sem guard de
timing).

## Ação recomendada

Registrar como bug de produto a corrigir independentemente da migração (não é causado por ela nem
resolvido por ela). Opções de correção, para avaliação futura, fora desta migração:
- Mover a chamada de `.inputmask()` para dentro do lifecycle do componente Angular
  (`ngAfterViewInit` de `FormasDePagamentoComponent`), chamando o jQuery diretamente ali.
- Ou substituir por uma diretiva Angular de máscara (ex.: `ngx-mask`), que já se popularizou para
  esse caso de uso — decisão de dependência nova, exige aprovação humana (PROJECT_RULES.md §13).

`cypress/e2e/checkout.cy.ts` documenta o comportamento real (sem máscara) exatamente para servir de
sinal automático: se este bug for corrigido no futuro, o teste passa a falhar, avisando quem estiver
executando a suíte.

## Referências

`docs/ia-auditorias/2026-07-30__migracao-angular-etapa-1__claude.md`, seção 13.4.
