# R29 — Página do artista (pública e privada): decisões de Fase 0

## Resumo da etapa

Esta etapa registra as **decisões de produto/contrato (Fase 0)** exigidas por `PROJECT_RULES.md §13`
antes de implementar as lacunas encontradas em uma auditoria read-only da página pública do artista
(`UsuarioArtistaComponent`, rota `pagina-artista`) e da área privada do artista/produtor
(`ArtistComponent`, rota `artista`), cobrindo o mapeamento de produto Mok Starter → técnico
`comprador` e Mok Maker → técnico `produtor`.

A auditoria em si foi conduzida na mesma sessão do Claude Code, em modo estritamente read-only
(skill `legacy-code-audit`), e entregue apenas como resposta de chat — não foi persistida em arquivo
próprio, conforme o contrato de escrita daquela etapa. Este relatório resume os achados relevantes
para continuidade e registra as 6 decisões pendentes, todas apresentadas ao usuário via perguntas
objetivas e **aprovadas com a opção recomendada** em 2026-08-14.

**Nenhum código foi alterado nesta etapa.** É uma etapa de planejamento/decisão
(`AGENTS.md §3` — modo "Planejamento": analisar, mapear risco, decidir; não editar código).

## Contexto — resumo dos achados da auditoria que originou este relatório

Achados centrais (evidência completa em `arquivo:linha`, verificada por leitura estática do
worktree em `dev` na data da auditoria):

- **Crítico** — `PUT`/`DELETE /api/musicas/:id` (`server/src/index.js:1364-1381`) não exigem
  autenticação nem checam ownership: qualquer requisição HTTP pode editar ou apagar qualquer faixa
  do catálogo.
- **Crítico** — rota `artista` (`app-routing.module.ts:51`) usa apenas `AuthGuard`, sem
  `ProdutorGuard` (diferente de `dashboard-produtor`, linha 60, que usa os dois): qualquer
  `comprador` autenticado acessa a área de gestão do artista.
- **Crítico** — `comprarLicensa(i)` em `artist.component.html:315`/`.ts:232` e
  `usuario-artista.component.html:219`/`.ts:165` envia o **índice numérico** do `*ngFor` para
  `CarrinhoService.openModalCart(music: Musica)` em vez do objeto da música
  (`musicas.service.ts:449`). O spread `{ ...music, ...selection }` em `carrinho.service.ts:85-88`
  sobre um número produz objeto vazio — o item do carrinho perde `id`/`nome_musica`/`nome_produtor`/`url`.
  Comparar com `musicas.component.html:716`, que já passa o objeto correto (`itens`).
- **Alto** — identidade do artista na área privada é hard-coded (`nameArtist = 'Wilian Gulini'`,
  `artist.component.ts:78-79`), nunca derivada da sessão/token.
- **Alto** — nenhum vínculo `producerId`/`userId` entre faixa e produtor em `server/data/musicas.json`
  (só existe `nome_produtor`, texto livre) — impede ownership real no backend.
- **Alto** — preview/player ausente em ambas as páginas (nenhum `MusicPlayerService`/`WaveSurferService`
  injetado; ícone de play e botão "Reproduzir Músicas" sem handler).
- **Alto** — edição de nome/bio/avatar na área privada não persiste (`editDescription()` só remove
  `disabled`; upload converte a base64 mas `onUpload()` está comentado).
- **Alto** — `POST /api/producers/track` (`server/src/index.js:1670-1718`) só valida o payload e
  descarta os arquivos recebidos — nunca persiste a faixa no catálogo (`MUSICAS.push` só ocorre em
  `POST /api/musicas` genérico, linha 1360, não usado por este fluxo).
- **Alto** — curtidas sem escopo por usuário: `/api/favoritos*` (linhas 1636-1667) sem
  `authenticateToken`; array `FAVORITOS` (linha 2545) sem `userId`.
- **Médio** — item de menu "Artista" visível a todos os perfis (`sub-menu.component.html:59`,
  `menu-produtor.component.html:58-60`), sem o mesmo `*ngIf="isProdutor"` já usado no item "Dashboard".
- **Médio** — nenhum estado de loading/erro/vazio/artista-inexistente em nenhuma das duas páginas.

Validações executadas durante a auditoria (evidência de execução real, não apenas leitura):
`npm run build` (Node 24.18.1 via nvm — sucesso, `dist/` gerado), `npm test` frontend/vitest
(56/56 arquivos, 154/154 testes, 0 falhas — inclui `artist.component.spec.ts` e
`usuario-artista.component.spec.ts`, ambos smoke-only `should create`), `cd server && npm test`
(114/114 testes, 0 falhas). Nenhum teste runtime/manual de UI foi executado (fora do contrato
read-only daquela etapa).

## Decisões de Fase 0 (aprovadas nesta etapa)

Todas as decisões foram apresentadas como pergunta objetiva com opções (uma recomendada) via
`AskUserQuestion`, e o usuário escolheu a opção recomendada em todas.

### Decisão 1 — Fonte de identidade do artista na área privada

**Decisão:** criar um novo endpoint de **perfil artístico público**, separado do perfil
pessoal/KYC (`/api/user/profile`, `server/src/index.js:816-843`). Esse novo contrato alimenta tanto
a área privada (`ArtistComponent`) quanto a página pública (`UsuarioArtistaComponent`).
**Justificativa:** evita misturar dados pessoais/KYC com dados públicos do artista (risco de
exposição), conforme já recomendado em `docs/areas/modulos/pagina-artista.md`.
**Alternativa descartada:** reaproveitar `/api/user/profile` diretamente (rejeitada — mistura KYC
com dado público).
**Impacto:** novo contrato/payload no backend — requer implementação e validação específicas
(`PROJECT_RULES.md §13`).

### Decisão 2 — Vínculo produtor ↔ faixa

**Decisão:** adicionar campo `producerId` às faixas, populado em novos registros e migrado às
faixas existentes via **backfill controlado**.
**Justificativa:** hoje só existe `nome_produtor` (texto livre) em `musicas.json`; não há como o
backend verificar ownership real sem um identificador estável.
**Alternativa descartada:** continuar usando `nome_produtor` como identificador (rejeitada — frágil,
não permite ownership real).
**Impacto:** migração de dados existentes + mudança de payload nos endpoints de faixa. Bloqueia a
Fase 3 completa (ownership real, "minhas faixas", remoção própria).

### Decisão 3 — Autenticação/ownership em `PUT`/`DELETE /api/musicas/:id`

**Decisão:** exigir `authenticateToken` + `tipoPerfil === 'produtor'` já nesta rodada (mitigação
imediata do achado Crítico). Ownership completo (comparar `producerId` da faixa com
`req.user.userId`) fica condicionado à Decisão 2 (Fase 3).
**Justificativa:** os endpoints estão hoje completamente abertos — é o achado de segurança mais
grave da auditoria.
**Alternativa descartada:** manter aberto (rejeitada — risco de segurança confirmado).

### Decisão 4 — Persistência real do upload de produtor

**Decisão:** manter **fora do escopo** desta rodada de planejamento. Vira tarefa própria futura.
**Justificativa:** é uma decisão maior de armazenamento de mídia/infraestrutura, desproporcional ao
escopo desta etapa (correção de página pública/privada do artista).
**Impacto:** `POST /api/producers/track` continua sendo um endpoint de validação de contrato, sem
persistir faixas — dívida técnica já documentada no próprio código
(`server/src/index.js`, comentário acima de `PRODUCER_TRACK_UPLOAD_DIR`).

### Decisão 5 — `ProdutorGuard` na rota `artista`

**Decisão:** aplicar `ProdutorGuard` à rota `artista` em `app-routing.module.ts:51`, replicando o
padrão já usado em `dashboard-produtor` (linha 60: `[AuthGuard, ProdutorGuard]`).
**Justificativa:** mitigação direta do segundo achado Crítico; baixo risco, sem dependências de
outras decisões.
**Escopo:** aprovado para implementação imediata (Fase 1).

### Decisão 6 — Bug do índice no carrinho

**Decisão:** corrigir `comprarLicensa(i)` para `comprarLicensa(itens)` em
`artist.component.html`/`.ts` e `usuario-artista.component.html`/`.ts`, replicando o padrão já
correto de `musicas.component.html:716`.
**Justificativa:** mitigação direta do terceiro achado Crítico; mudança localizada, sem novo
contrato, sem dependências de outras decisões.
**Escopo:** aprovado para implementação imediata (Fase 1).

**Nota:** o mesmo padrão de bug (`comprarLicensa(i)` com índice) foi observado também em
`home.component.ts`, `favoritos.component.ts`, `pag-playlist.component.ts` e
`efeitosSonoros.component.ts`, fora do escopo desta tarefa (página de artista). Registrado aqui
apenas como evidência corroborante; não faz parte do escopo aprovado nesta etapa.

## Escopo aprovado para implementação imediata (Fase 1)

Sem dependências pendentes — pode ser implementado na próxima etapa:

- Aplicar `ProdutorGuard` à rota `artista` (Decisão 5).
- Ocultar o item de menu "Artista" para `comprador` (`*ngIf="isProdutor"`) em
  `sub-menu.component.html` e `menu-produtor.component.html`.
- Corrigir `comprarLicensa(i)` → `comprarLicensa(itens)` nas duas páginas de artista (Decisão 6).

## Escopo aprovado em princípio, implementação maior pendente (Fases 2–4)

- Decisão 1 (perfil artístico público): novo endpoint + model Angular + wiring em `ArtistComponent`
  e `UsuarioArtistaComponent`.
- Decisão 2 (vínculo produtor-faixa): campo `producerId` + migração/backfill.
- Decisão 3 (auth mínima no CRUD de músicas): `authenticateToken` + checagem de perfil; ownership
  completo depende da Decisão 2.

Estas três decisões estão **aprovadas quanto ao produto**, mas a implementação ainda não foi
iniciada e deve ser tratada em sessão(ões) própria(s), dado o volume (mudança de contrato backend +
migração de dados).

## Fora de escopo (explicitamente adiado ou não aplicável)

- Decisão 4 — persistência real do upload de produtor.
- Renomear enums/valores persistidos `comprador`/`produtor`.
- Migração de versão do Angular, gateway de pagamento, endpoint final de checkout, exportação de
  relatórios do dashboard.
- Corrigir o mesmo bug de índice do carrinho em componentes fora da página de artista (`home`,
  `favoritos`, `pag-playlist`, `efeitos-sonoros`) — candidato a tarefa própria futura.

## Arquivos lidos

Nesta etapa (registro de decisões): `PROJECT_RULES.md`, `AGENTS.md`, `docs/areas/protocolo-planejamento.md`,
`docs/ia-auditorias/README.md`, `docs/ia-auditorias/TEMPLATE-agent-report.md`,
`docs/ia-auditorias/R28-qa-final-regressao-completa.md` (referência de estilo/convenção).

Na auditoria que originou este relatório (mesma sessão, chat): `app-routing.module.ts`,
`src/app/artist/artist.component.ts`/`.html`/`.spec.ts`, `src/app/usuario-artista/usuario-artista.component.ts`/`.html`/`.spec.ts`,
`src/app/guards/auth.guard.ts`, `src/app/guards/produtor.guard.ts`, `src/app/guards/profile-complete.guard.ts`,
`src/app/login/auth.service.ts`, `src/app/interceptors/auth.interceptor.ts`,
`src/app/service/user-profile.service.ts`, `src/app/models/user-profile.model.ts`,
`src/app/service/carrinho.service.ts`, `src/app/carrinho/cartModal/cart-modal.component.ts`/`.models.ts`/`.html`,
`src/app/musicas/musicas.service.ts`, `src/app/musicas/musicas.component.html` (trechos),
`src/app/upload-file/upload-file.service.ts`, `src/app/upload-file/upload-file-routing.module.ts`,
`src/app/produtores/produtores.component.ts` (trecho), `src/app/favoritos/favoritos.service.ts`,
`src/app/dashboard-produtor/dashboard.service.ts`, `dashboard-produtor.component.ts`/`.html` (trechos),
`src/app/sub-menu/sub-menu.component.html`/`.ts`, `src/app/menu-produtor/menu-produtor.component.html`/`.ts`,
`src/app/app.component.html`, `server/src/index.js` (leitura integral por trechos),
`server/data/users.json`/`musicas.json` (estrutura), `package.json`, `server/package.json`,
`angular.json`, `tsconfig.spec.json`, `tsconfig.spec.focus.json`, `.gitignore`,
`docs/areas/modulos/pagina-artista.md`, `docs/areas/producer-dashboard.md`, `docs/areas/auth-and-guards.md`,
`.claude/rules/angular.md`, `.claude/rules/auth-and-guards.md`, `.claude/rules/producer-dashboard.md`,
`.claude/rules/api-contracts.md`, `.claude/rules/license-cart-checkout.md`, `.claude/rules/producer-upload.md`.

## Arquivos alterados

Nenhum arquivo de código-fonte foi alterado nesta etapa. Arquivos escritos:
`docs/ia-auditorias/R29-pagina-artista-decisoes-fase0.md` (este relatório) e
`docs/ia-auditorias/README.md` (nova linha no índice).

## Validações executadas

Nenhum comando foi executado nesta etapa (registro de decisão, sem código tocado). Ver seção
"Contexto" acima para as validações executadas durante a auditoria original (mesma sessão).

## Riscos

- Os três achados Críticos (auth do CRUD de músicas, `ProdutorGuard` ausente na rota `artista`, bug
  de metadados no carrinho) **continuam ativos no código** até a Fase 1 ser implementada — esta
  etapa apenas aprovou a correção, não a aplicou.
- Fases 2–4 (backend) envolvem mudança de contrato/payload e migração de dados — risco de regressão
  se implementadas sem o backfill controlado decidido na Decisão 2.

## Pendências

- Implementar a Fase 1 (Decisões 5 e 6) — próximo passo imediato, via Plan Mode.
- Detalhar plano de implementação das Fases 2–4 (Decisões 1–3) em sessão própria, dado o volume de
  mudança de backend.
- Decisão 4 (upload real) permanece como tarefa não planejada, a ser retomada quando houver
  prioridade de produto para persistência de mídia.

## Próximo passo recomendado

Entrar em Plan Mode para desenhar a implementação da Fase 1 (Decisões 5 e 6, mais a ocultação do
item de menu), que não depende de nenhuma decisão de backend pendente.

## Status final da etapa

Aprovado — as 6 decisões de Fase 0 foram apresentadas ao usuário e aprovadas (todas com a opção
recomendada) em 2026-08-14. Nenhuma implementação foi realizada nesta etapa, conforme o modo
"Planejamento" de `AGENTS.md §3`.

## Execução — Fase 1 (2026-08-14/15)

Implementadas as Decisões 5 e 6 (baixo risco, sem dependências), via Plan Mode + aprovação explícita:

- `ProdutorGuard` aplicado à rota `artista` (`app-routing.module.ts`).
- Item de menu "Artista" oculto para `comprador` (`*ngIf="isProdutor"`) em `sub-menu.component.html`
  e `menu-produtor.component.html`.
- `comprarLicensa(i)` → `comprarLicensa(musica: Musica)` em `artist.component.ts`/`.html` e
  `usuario-artista.component.ts`/`.html`, corrigindo o bug de metadados do carrinho.
- Dois novos testes de regressão (`artist.component.spec.ts`, `usuario-artista.component.spec.ts`).

Validações: `npm run build` (Node 24.18.1) — sucesso; `npm test -- --watch=false` (frontend) —
56/56 arquivos, 156/156 testes, 0 falhas. Nenhum arquivo fora do escopo planejado foi tocado
(`musicas.service.ts` preservado intencionalmente, ver plano). Status: **Aprovado**.

## Execução — Fase 2 (2026-08-15)

Implementada a Decisão 3 (autenticação mínima no CRUD de músicas), via Plan Mode + aprovação
explícita:

- Novo middleware `authenticateProdutor` em `server/src/index.js` (mesmo padrão de
  `dashboardMiddleware`: `authenticateToken` + checagem `req.user.tipoPerfil === 'produtor'`).
- Aplicado a `PUT /api/musicas/:id` e `DELETE /api/musicas/:id`. `GET`/`POST /api/musicas`
  permanecem abertos (fora do escopo da Decisão 3).
- Novo `server/test/musicas-write-auth.test.js` com 6 testes (401 sem token, 403 para `comprador`,
  sucesso para `produtor`, por verbo).

Confirmado por leitura do frontend que nenhum componente Angular chama `MusicasService.save()`/
`.remove()` hoje — endurecer os endpoints não quebra nenhum fluxo real; o `AuthInterceptor` já
anexa o token automaticamente para quando isso passar a ser usado.

Validações: `cd server && npm test` — 120/120 testes (114 originais + 6 novos), 0 falhas;
`npm run build` (frontend) — sucesso, inalterado; `npm test -- --watch=false` (frontend) — 56/56
arquivos, 156/156 testes, inalterado. Status: **Aprovado**.

## Execução — Fases 3-4 (2026-08-15)

Implementadas as Decisões 1 e 2 (perfil artístico público, vínculo `producerId`, ownership
completo), via Plan Mode + aprovação explícita do plano detalhado apresentado em chat.

**Achado que simplificou o plano:** confirmado que `server/data/musicas.json` só é lido na
inicialização — nenhuma migração de dado em disco foi necessária; `producerId` ausente é tratado
como "sem dono" (comportamento da Fase 2 preservado para o catálogo legado).

**Backend (`server/src/index.js`):**
- `PRODUCERS_FILE`/`loadProducers`/`saveProducers`, espelhando o padrão de `users.json`.
- `GET /api/producers/me`, `PUT /api/producers/me`, `POST /api/producers/me/avatar` (identidade
  sempre de `req.user.userId`) e `GET /api/producers/:producerId` (público) — nessa ordem de
  registro, para a rota curinga não capturar `/me` (bug encontrado e corrigido durante os testes).
- Ownership real em `PUT`/`DELETE /api/musicas/:id`: 403 se `producerId` existir e for de outro
  produtor; 404 novo no PUT para id inexistente (necessário para a checagem, sem isso o código
  antigo "sucedia" silenciosamente sobre um índice inválido).
- Filtro `?producerId=` em `GET /api/musicas` (aditivo).
- Novos testes: `server/test/producers-profile.test.js` (7 casos) e casos adicionais de ownership em
  `server/test/musicas-write-auth.test.js`.

**Frontend:**
- `src/app/models/producer-profile.model.ts`, `src/app/service/producer-profile.service.ts` (espelha
  `UserProfileService`), `MusicasService.getByProducer()`.
- `ArtistComponent` (área privada): identidade real via `getMyProfile()` (removido hard-code
  "Wilian Gulini"), formulário de nome/bio com submit real (`salvarPerfil`/`cancelarEdicaoPerfil`,
  substituindo manipulação direta de DOM por Reactive Forms), avatar real via `uploadAvatar()`
  (substituindo o fluxo base64 morto), lista "minhas faixas" via `getByProducer`, remoção com
  confirmação (`removerFaixa`), CTA para `/upload` e `/dashboard-produtor`, resumo de vendas via
  `DashboardService.getSummary()` (reaproveitado, sem mudança), estados de loading/erro/vazio.
- `UsuarioArtistaComponent` (página pública): aceita `?producerId=` com fallback de compatibilidade
  para `?nome_produtor=`; remove a bio hard-coded ("Xalaika é um produtor..."); estados de
  loading/erro/artista-inexistente.
- Novos testes comportamentais substituindo os smoke-only anteriores em ambos os componentes
  (carregamento de identidade, erro, salvar perfil, remover faixa, compatibilidade de link antigo).

Validações: `cd server && npm test` — 133/133 (120 + 13 novos), 0 falhas; `npx tsc --noEmit` — sem
erros; `npm run build` (Node 24.18.1) — sucesso; `npm test -- --watch=false` (frontend) — 56/56
arquivos, **165/165 testes**, 0 falhas. `git diff --stat` confirma escopo idêntico ao plano
aprovado; `server/data/musicas.json` não foi tocado. Status: **Aprovado**.

**Pendente (à época):** Decisão 4, preview/player e curtidas por usuário fora de escopo — ver
execução abaixo, que trata os três.

## Execução — Decisão 4 + player/preview + curtidas por usuário (2026-08-15)

Implementados os três achados Altos restantes da auditoria original, via Plan Mode + aprovação
explícita (decisões de escopo confirmadas por `AskUserQuestion` antes de codar).

**Player/preview:** `ArtistComponent` e `UsuarioArtistaComponent` passam a despachar play/pause pelo
`MusicPlayerService` global (`tocarFaixa`/`reproduzirPrimeiraFaixa`), reaproveitando o `PlayerComponent`
único já renderizado em `app.component.html` — nenhuma instância própria de WaveSurfer foi criada,
preservando a regra de "sem conflito de múltiplos áudios" por construção.

**Curtidas por usuário:** `GET/POST/PUT/DELETE /api/favoritos*` passam a exigir `authenticateToken`
e escopam por `userId` (GET só retorna as próprias; PUT/DELETE de curtida alheia retornam 403). A
lógica de despacho do frontend (`FavoritosService`/`MusicasService.curtir`), já confusa/pré-existente,
não foi tocada — decisão de escopo confirmada previamente.

**Decisão 4 (upload real), escopo restrito a `trackNoStems`:** descoberto que `getStemsForId`
(stems) é 100% hard-coded, não orientado a dados — persistir `trackWithStems`/`effectsFx` exigiria
refatorá-lo antes, fora desta rodada (confirmado por decisão explícita do usuário). Implementado:
`POST /api/producers/track` agora exige `authenticateProdutor`; no modo `trackNoStems` do contrato
v2 (único que o formulário real envia), o arquivo da faixa é copiado para
`server/src/uploads/tracks/<producerId>/<trackId>/` (servido por `/uploads/tracks`, público) e uma
entrada real é criada em `MUSICAS` com `producerId` do token — nunca de um campo do body.
`trackWithStems`/`effectsFx`/ramo legado continuam exatamente como antes (validam e descartam).
`ProdutorGuard` adicionado à rota `/upload` (mesma inconsistência já corrigida em `/artista` na Fase
1 — agora que o endpoint é produtor-only, deixar a rota acessível a `comprador` só geraria 403
confuso).

**Achado não previsto no plano:** `server/test/producer-track-multer.test.js` (954 linhas,
pré-existente) e `server/test/uploads-baseline.test.js` faziam todas as chamadas a
`POST /api/producers/track` sem token — quebrariam com 401 assim que o endpoint passasse a exigir
`authenticateProdutor`. Corrigidos centralizando um token de produtor de teste no `before()`/helper
`postTrack()` de cada arquivo (mínimo de 4 chamadas `fetch` diretas corrigidas manualmente), e os 2
testes que exercitavam sucesso de `trackNoStems` v2 tiveram a asserção atualizada de 200/eco de
validação para 201/`{message, musica}` (mudança de contrato intencional desta etapa, não regressão).

Validações: `cd server && npm test` — **144/144** (133 anteriores + 11 novos), 0 falhas; `npx tsc
--noEmit` — sem erros; `npm run build` (Node 24.18.1) — sucesso; `npm test -- --watch=false`
(frontend) — 56/56 arquivos, **170/170 testes**, 0 falhas. `git diff --stat` confirma que
`getStemsForId`, `musicas.json` e o catálogo de efeitos sonoros não foram tocados. Status:
**Aprovado**.

**Pendente:** persistência real de `trackWithStems`/`effectsFx` (depende de tornar `getStemsForId`
orientado a dados) e reescrita da lógica de despacho de curtidas do frontend — ambos fora de escopo
por decisão explícita, candidatos a tarefa própria futura se houver prioridade de produto.
