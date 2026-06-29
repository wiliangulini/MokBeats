# R05 — Etapa 5 — Home e navegação institucional

## Relatório do Codex

## Resumo da etapa

Etapa R05 implementada na Home: CTAs institucionais corrigidos com `routerLink`, `href="#"` removido e fluxo de músicas/download/player preservado.

## Arquivos lidos

- PROJECT_RULES.md
- AGENTS.md
- src/app/home/home.component.html
- src/app/home/home.component.ts
- src/app/home/home.component.scss
- src/app/app-routing.module.ts
- src/app/musicas/musicas.service.ts
- src/app/service/music-player.service.ts
- package.json

## Arquivos alterados

- src/app/home/home.component.html
- src/app/home/home.component.ts
- src/app/home/home.component.scss

## O que foi implementado ou auditado

- Substituído `href="#"` da Home por `routerLink` ou texto sem ação.
- “Mostrar todas as tracks” agora aponta para `/musicas`.
- “SABER MAIS” da seção de produtores agora aponta para `/produtores`.
- “DESCUBRA NOSSAS LICENÇAS” agora aponta para `/precos`.
- Removidos `routeNav`, import/injeção de `Router` sem uso.
- Ajustado SCSS para preservar visual dos textos de música/produtor.

## Comandos executados

- [x] git branch
- [x] git status
- [x] npm run build
- [x] npm test
- [x] npm run start -- --host 127.0.0.1 --port 4200

## Resultado dos comandos

- Branch atual: `dev`.
- `npm run build`: passou.
- `npm test`: falhou com 9 falhas em 84 specs, fora dos arquivos alterados:
  - 7 falhas em `LoginComponent` com `Cannot read properties of undefined (reading 'root')`.
  - 2 falhas em `ProdutoresComponent` relacionadas a submit/upload specs.
- Validação Playwright local: CTAs navegaram para `#/musicas`, `#/produtores` e `#/precos`; mobile 390px manteve links presentes.
- API local `/api` retornou `ECONNREFUSED/504` porque backend `127.0.0.1:3100` não estava rodando.

## Como validar manualmente

1. Abrir `http://127.0.0.1:4200/#/home`.
2. Clicar em “Mostrar todas as tracks”, “SABER MAIS” e “DESCUBRA NOSSAS LICENÇAS”.
3. Confirmar navegação para `#/musicas`, `#/produtores` e `#/precos` sem reload.
4. Com backend ativo, conferir preview/download/últimas músicas.

## Riscos ou pendências

- Suite geral de testes já falha em Login/Produtores; não aponta para a Home alterada.
- Últimas músicas não puderam ser validadas em runtime porque a API local não estava ativa.

## Confirmação de escopo

Altere somente arquivos dentro do escopo da Etapa 5. Não alterei services, rotas, guards, autenticação, carrinho, Dashboard, upload, player ou dependências. O arquivo não rastreado `docs/ia-auditorias/R05-home-navegacao-institucional.md` foi preservado.

---

## Revisão do Claude Code

Revisão Claude Code — Etapa 5 — Home e navegação institucional
Classificação final
Aprovado com observações

Resumo da revisão
A R05 foi implementada com escopo rigorosamente restrito. Alterou exatamente 3 arquivos (19 linhas removidas, 9 adicionadas), sem tocar em nenhuma área crítica do projeto.

Diff inspecionado — tabela de mudanças
Original Novo Resultado
<a href="#">{{musica.nome_musica}}</a> <span class="track-title-text">...</span> Correto — link era decorativo
<a href="#">{{musica.nome_produtor}}</a> <span class="producer-name-text">...</span> Correto
(click)="routeNav('musicas')" routerLink="/musicas" Correto
href="#" em "SABER MAIS" routerLink="/produtores" Correto
(click)="routeNav('precos')" routerLink="/precos" Correto
import { Router } + routeNav() Removidos Correto — não há mais uso
Pontos aprovados
Zero href= restante no template (grep confirmou ausência total)
Rotas validadas no app-routing.module.ts: /musicas (L36), /produtores (L45), /precos (L39) — todas existem
useHash: true ativo — navegação para #/musicas, #/produtores, #/precos sem reload
Router e routeNav() removidos sem deixar referências mortas
Métodos onPlayPause, baixarAmostra, curtir, comprarLicensa intactos
SCSS atualizado para acompanhar troca de <a> → <span> (seletores preservam visual)
Nenhum service, guard, interceptor, routing ou package.json foi tocado
Problemas encontrados
Bloqueadores
Nenhum.

Importantes (não bloqueiam aceite)
type="button" em <a>: os originais tinham <a type="button" href="#"> — atributo inválido em <a>. A remoção é tecnicamente correta; os CTAs agora são <a routerLink="..."> sem role explícito. Sem regressão funcional.
SCSS media query sem prefixo section.one: seletor p.h4 .track-title-text dentro de breakpoint mobile não tem o prefixo section.one. Estava assim antes da R05 também — risco real zero.
Regressões potenciais
Nenhuma introduzida. As 9 falhas de npm test (7 em LoginComponent, 2 em ProdutoresComponent) são pré-existentes e não relacionadas à Home — confirmado pelo diff.

Correções exigidas para o Codex
Nenhuma. A implementação está dentro do escopo, correta e sem regressões.

Recomendação: aceitar a R05 e fazer commit na branch dev antes de iniciar a R06.

---

## Complemento pós-revisão

Não foi executado prompt de Correção pós-revisão do Codex.

Justificativa: o Claude Code classificou a R05 como "Aprovado com observações", sem bloqueadores e sem correções objetivas exigidas. A revisão confirmou que a implementação ficou restrita à Home, que os `href="#"` foram removidos, que os CTAs principais usam `routerLink`, que as rotas `/musicas`, `/produtores` e `/precos` existem, e que o fluxo de player/download/últimas músicas foi preservado.

As observações sobre `type="button"` em `<a>` e seletor SCSS em media query não exigem correção nesta etapa. O primeiro ponto foi resolvido pela própria alteração e o segundo é pré-existente, sem regressão introduzida pela R05.

## Status final da etapa

Aprovado com observações

## Pendências para etapas futuras

- Validar últimas músicas, preview e download com o backend local ativo em `127.0.0.1:3100`.
- Manter acompanhamento das 9 falhas pré-existentes em `npm test`, localizadas em `LoginComponent` e `ProdutoresComponent`.
- Corrigir eventuais ajustes visuais finos da Home somente em etapa própria, se necessário.

---

## Status final da etapa

Aprovado com observações

## Pendências para etapas futuras

- ...
