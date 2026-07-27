# Plano P0 v2.2 — Status da remediação de vulnerabilidades (MokBeats)

Resumo objetivo do que foi executado até agora na branch `fix/security-dependencies-p0`.

## Contexto

O Plano P0 v2.2 remedia vulnerabilidades de dependências do backend (`server/`) e da raiz
(frontend Angular 14), em lotes seriais, reversíveis e auditados — cada lote implementado
via `/create-code` e revisado de forma independente via `/final-audit` antes do commit.
Nenhum lote altera contrato HTTP, autenticação, rotas ou comportamento visível sem
autorização explícita.

## Branch e commits

- Branch: `fix/security-dependencies-p0` (a partir de `dev`)
- 9 commits, um por lote, todos já enviados a `origin/fix/security-dependencies-p0`
- Preexistência isolada à parte: `chore/editor-font-size` (ajuste de fonte do editor,
  branch e commit próprios, nunca misturado aos lotes de segurança)

## Lotes concluídos

| Lote | Commit | O que fez |
|---|---|---|
| **T0** | `a6c7ce9` | Tornou `server/src/index.js` testável (`module.exports`, `app.listen` condicional, overrides de `USERS_FILE`/uploads só em teste) — sem dependência nova, sem mudar contrato. |
| **U1** | `8330bc8` | Atualizou `multer` de `1.4.5-lts.2` para `2.2.0` e endureceu `POST /api/user/documents/:tipo` (limits explícitos). |
| **U2a** | `2cb3ae4` | Migrou `POST /api/uploads/` de `connect-multiparty` para Multer 2.2.0 route-local (`legacyUpload.any()`), com sanitização da resposta e storage temporário dedicado. |
| **U2b** | `cbcaeb9` | Migrou `POST /api/producers/track` de `connect-multiparty` para Multer 2.2.0 route-local (`fields()`), preservando integralmente os contratos v2 e legado. |
| **U2c** | `604c665` | Removeu `connect-multiparty`, `multiparty` e a cadeia exclusiva (14 pacotes) — sem consumidor restante após U2a/U2b. |
| **E1** | `26fcc6a` | Atualizou `express` (`4.18.2→4.22.2`) e `body-parser` (`1.20.2→1.20.6`), permanecendo nas mesmas majors. |
| **I1** | `28f7238` | Substituiu o pacote `uuid` pela API nativa `crypto.randomUUID()` nos 2 pontos de geração de ID (cadastro e login legado). |
| **F1** | `1e00f16` | Removeu o SDK `firebase` (não utilizado) da raiz do projeto — sem consumidor real. |

Cada lote foi auditado de forma independente (`/final-audit`) antes do commit, com
reexecução de testes, comparação estrutural de lockfile e confirmação de contratos
preservados. Todos classificados **Aprovado**.

## Redução de vulnerabilidades (`npm audit`)

**Backend (`server/`):**

| Momento | Total | Crítica | Alta | Moderada | Baixa |
|---|---|---|---|---|---|
| Antes de U2c | 14 | 1 | 8 | 2 | 3 |
| Depois de U2c | 12 | 1 | 6 | 2 | 3 |
| Depois de E1 | 5 | 1 | 3 | 1 | 0 |
| Depois de I1 | 4 | 1 | 3 | 0 | 0 |

**Raiz (frontend):**

| Momento | Total | Crítica | Alta | Moderada | Baixa |
|---|---|---|---|---|---|
| Antes de F1 | 73 | 1 | 45 | 24 | 3 |
| Depois de F1 | 63 | 1 | 44 | 15 | 3 |

Residuais atuais do backend (`bcrypt`, `@mapbox/node-pre-gyp`, `tar` — crítica —,
`brace-expansion`) pertencem à trilha **B1**, bloqueada até **R1a**. Residuais da raiz
(Angular/Cypress/toolchain) pertencem à trilha **T1**, fora da execução atual.

## O que não foi tocado (por decisão de escopo)

- `firebase.json`, `.firebaserc`, `.firebase/` (Hosting) — preservados
- `/api/auth/google` (stub 501) e `loginComGoogle()` — preservados
- Autenticação, JWT, guards, contratos de rota — preservados em todos os lotes
- `.vscode/settings.json` — preexistência de editor, isolada em `chore/editor-font-size`,
  nunca incluída em nenhum lote de segurança

## Pendências e próximos passos

- **R1a** (bloqueado): fixar a versão corrigida do Node 24 assim que a atualização de
  segurança for publicada (esperada ≥ 27/07/2026); separar runtime do frontend
  (Node 16.20.2, bridge EOL) do backend (Node 24).
- **B1** (bloqueado, depende de R1a): atualizar `bcrypt` para a major 6, resolvendo a
  cadeia crítica de `tar`/`@mapbox/node-pre-gyp`.
- **R1b** (fora da execução atual): operação de deploy/VPS — só especificação futura,
  sem acesso remoto autorizado.
- **T1** (posterior): atualização do toolchain Angular/Cypress — migração maior, separada
  deste plano de segurança.

Nenhum destes pode ser antecipado sem autorização explícita e sem a atualização de Node 24
correspondente.
