# Scripts shell do MokBeats

Este inventario cobre os arquivos `.sh` encontrados no repositorio, revisado em 2026-07-31 (Etapa 13 da migracao Angular 14->22). Scripts dentro de `node_modules/` e `server/node_modules/` pertencem a dependencias instaladas e nao devem ser editados diretamente.

## Scripts mantidos pelo projeto

### `deploy-to-vps.sh`

Script oficial de deploy do MokBeats para a VPS Hostinger.

- Destino: `root@31.97.160.61:/var/www/html/gulini.com.br/mokbeats`
- URL publica: `https://gulini.com.br/mokbeats/`
- Envia frontend Angular, backend Node.js e audios.
- Configura `.htaccess` para SPA routing.
- Preserva `.env` remoto existente; quando precisa criar um novo, gera `JWT_SECRET` automaticamente e define `NODE_ENV=production` e `AUDIO_BASE_PATH=../../`.
- Instala dependencias do backend, garante PM2 e configura/recarrega Apache quando o vhost existe.
- Pode gerar peaks na VPS com `--generate-peaks`.
- Builda o frontend localmente e publica `dist/browser/` (raiz publicavel do builder `@angular/build:application`, desde a Etapa 12/13 da migracao Angular 14->22; `dist/` deixou de ser a raiz direta).
- Resolve o Node local do build a partir do `.nvmrc` da raiz (nvm-first, com fallback ao Node do `PATH` quando a major ja bate); `--allow-runtime-mismatch` cobre tanto o Node local quanto o remoto.

Uso principal:

```bash
./deploy-to-vps.sh
```

Opcoes relevantes:

```bash
./deploy-to-vps.sh --frontend-only
./deploy-to-vps.sh --backend-only
./deploy-to-vps.sh --no-build
./deploy-to-vps.sh --no-audio
./deploy-to-vps.sh --generate-peaks
./deploy-to-vps.sh --dry-run
```

### `build-and-upload.sh`

Wrapper de compatibilidade para fluxos antigos.

- Nao possui mais IP, caminho de VPS ou logica propria de deploy.
- Delega a execucao para `deploy-to-vps.sh`.
- Deve ser mantido apenas para nao quebrar comandos antigos.

Uso:

```bash
./build-and-upload.sh --dry-run
```

### `quick-fix-vps.sh`

Script de reparo operacional para peaks e backend na VPS atual.

- Verifica conexao, estrutura remota, audios, `.env`, Node.js, PM2 e `audiowaveform`.
- Corrige/adiciona `NODE_ENV=production` e `AUDIO_BASE_PATH=../../` sem sobrescrever `JWT_SECRET`.
- Cria backup do `.env` antes de ajustar variaveis em arquivo existente.
- Executa `server/scripts/generate-peaks.js` quando chamado com `--generate-peaks` ou sem flags.
- Reinicia/cria PM2 `mok-backend` quando chamado com `--restart-backend` ou sem flags.

Uso seguro para diagnostico:

```bash
./quick-fix-vps.sh --check-only
```

Uso para reparo completo:

```bash
./quick-fix-vps.sh
```

### `setup-vps.sh`

Script de preparacao inicial ou reset controlado da VPS.

- Deve ser executado na VPS como `root`.
- Cria a estrutura em `/var/www/html/gulini.com.br/mokbeats`.
- Instala/verifica dependencias de sistema, Node.js, npm, PM2 e `audiowaveform`.
- Configura permissoes basicas para frontend, backend, dados e scripts.
- Nao faz deploy do codigo; depois dele use `deploy-to-vps.sh`.

Uso remoto:

```bash
ssh root@31.97.160.61 'bash -s' < setup-vps.sh
```

### `start.sh`

Script de desenvolvimento local.

- Garante dependencias locais de frontend/backend quando incompletas.
- Inicia backend em `http://localhost:3100`.
- Inicia frontend Angular em `http://localhost:4200`.
- Libera portas locais `3100` e `4200` antes de subir os processos, mas so apos listar o(s)
  processo(s) ocupando a porta e confirmar (interativamente ou via `MOKBEATS_FORCE_FREE_PORT=1`);
  nunca mata processo de terceiro em silencio.
- Com `--generate-peaks`, gera peaks locais usando `AUDIO_BASE_PATH=../../src`.
- Encerra com exit code diferente de zero se o backend ou o frontend cair inesperadamente enquanto
  o outro segue rodando (antes disso, o script sempre saia com `0` mesmo nesse caso).
- Ctrl+C encerra os dois servidores e toda a arvore de processos de cada um (ex.: o `ng serve`
  iniciado pelo `npm run start` do frontend), evitando processo orfao preso na porta.

Uso:

```bash
./start.sh
./start.sh --generate-peaks
./start.sh --help
```

Variaveis de ambiente (opcionais):

- `MOKBEATS_BACKEND_NODE` / `MOKBEATS_FRONTEND_NODE`: apontam para um binario `node` especifico
  (absoluto), sem depender do `nvm`, para o backend e o frontend respectivamente.
- `MOKBEATS_FORCE_FREE_PORT=1`: libera a porta 3100/4200 ocupada sem pedir confirmacao interativa
  (uso nao interativo, ex.: automacao local).

## Scripts de dependencias

### `server/node_modules/bcrypt/test-docker.sh`

Script interno da dependencia `bcrypt`.

- Usado pela propria dependencia para testes/empacotamento em ambiente Docker.
- Remove artefatos locais dentro do pacote, instala dependencias Alpine quando aplicavel e roda testes do pacote.
- Nao deve ser executado como parte do fluxo MokBeats.
- Nao deve ser editado no projeto.

### `node_modules/node-gyp/gyp/tools/emacs/run-unit-tests.sh`

Script interno da dependencia `node-gyp`.

- Executa testes de modo Emacs para arquivos do `gyp`.
- Requer Emacs e arquivos de teste da dependencia.
- Nao deve ser executado como validacao do MokBeats.

### `node_modules/node-gyp/macOS_Catalina_acid_test.sh`

Script interno da dependencia `node-gyp`.

- Detecta versoes do Command Line Tools no macOS.
- Serve ao pacote `node-gyp`, nao ao projeto MokBeats.
- Nao deve ser editado no projeto.

## Status operacional

- Script canonico para deploy: `deploy-to-vps.sh`.
- Script local para desenvolvimento: `start.sh`.
- Script para diagnostico/reparo remoto: `quick-fix-vps.sh`.
- Script para preparacao de VPS: `setup-vps.sh`.
- Scripts em `node_modules/`: apenas inventariados, sem manutencao direta pelo projeto.
