# MokBeats

Marketplace de beats e instrumentais para produtores musicais — catálogo, player com waveform, carrinho, checkout, licenciamento e área do produtor.

**Demo:** https://gulini.com.br/mokbeats/

## Funcionalidades

- Catálogo de músicas com player integrado (waveform via `wavesurfer.js`)
- Carrinho, checkout e histórico de pedidos
- Licenciamento com diferentes níveis de valor por faixa
- Favoritos e playlists
- Área do produtor: dashboard, upload de arquivos, gestão de faixas
- Autenticação de usuários (comprador/produtor)
- Internacionalização (i18next)

## Stack

**Frontend:** Angular 22 · Angular Material · Bootstrap 5 · ng-bootstrap · RxJS · wavesurfer.js
**Backend:** Node.js · Express · JWT · bcrypt
**Testes:** Vitest (unitário) · Cypress (e2e)

## Arquitetura

```
src/app/          frontend Angular (componentes por funcionalidade:
                   musicas, carrinho, finalizar-compra, player, playlists,
                   dashboard-produtor, upload-file, favoritos, login...)
server/
  src/             API Express (autenticação, pedidos, catálogo)
  data/            dados da aplicação
  scripts/         geração de waveform peaks
cypress/           testes end-to-end
```

Frontend e backend vivem no mesmo repositório; o frontend consome a API via proxy (`proxy.conf.json` em desenvolvimento).

## Instalação

```bash
git clone https://github.com/wiliangulini/MokBeats.git
cd MokBeats
npm install
cd server && npm install && cd ..
```

## Variáveis de ambiente

Backend (`server/.env`, ver `server/.env.production.example`):

| Variável | Descrição |
|---|---|
| `NODE_ENV` | Ambiente de execução |
| `AUDIO_BASE_PATH` | Caminho base para os arquivos de áudio |
| `JWT_SECRET` | Chave de assinatura dos tokens (gerar com `openssl rand -hex 32`) |

## Comandos

```bash
npm start              # frontend (ng serve, com proxy para a API)
npm run build            # build de produção
npm test                  # testes unitários (Vitest)
npm run cypress:run        # testes e2e (Cypress)
npm run e2e                 # sobe o app e roda os testes e2e

# backend (dentro de server/)
npm start
npm test
```

## Testes

Cobertura unitária com Vitest e testes end-to-end com Cypress, incluindo fluxos de carrinho, checkout, login e upload.

## Contexto

Projeto pessoal, com backend próprio (Node/Express) e frontend Angular no mesmo repositório, em produção em `gulini.com.br/mokbeats`.
