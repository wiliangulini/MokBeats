#!/bin/bash

set -euo pipefail

BACKEND_PID=""
FRONTEND_PID=""
GENERATE_PEAKS=false

show_help() {
    cat <<'EOF'
Uso: ./start.sh [opcoes]

Opcoes:
  --generate-peaks  Gera peaks reais localmente antes de iniciar os servidores
  --help, -h        Mostra esta ajuda

Servicos iniciados:
  Backend:  http://localhost:3100 (Node fixado em server/.nvmrc)
  Frontend: http://localhost:4200 (Node fixado em .nvmrc)

Variaveis de override (opcionais, apontam para um binario node):
  MOKBEATS_BACKEND_NODE, MOKBEATS_FRONTEND_NODE
EOF
}

while [ "$#" -gt 0 ]; do
    case "$1" in
        --generate-peaks)
            GENERATE_PEAKS=true
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            echo "ERRO: opcao desconhecida: $1"
            echo "Use --help para ver as opcoes disponiveis."
            exit 1
            ;;
    esac
    shift
done

cleanup() {
    echo ""
    echo "Desligando servidores..."

    [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null || true
    [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null || true

    [ -n "$FRONTEND_PID" ] && wait "$FRONTEND_PID" 2>/dev/null || true
    [ -n "$BACKEND_PID" ] && wait "$BACKEND_PID" 2>/dev/null || true

    echo "Servidores parados."
    exit 0
}

trap cleanup SIGINT SIGTERM

free_port() {
    local port=$1
    if fuser "$port/tcp" >/dev/null 2>&1; then
        echo "Porta $port ocupada. Liberando..."
        fuser -k "$port/tcp" 2>/dev/null || true
        sleep 1
    fi
}

if [ -s "$HOME/.nvm/nvm.sh" ]; then
    # shellcheck disable=SC1091
    source "$HOME/.nvm/nvm.sh"
fi

# Backend (server/) e frontend (raiz) sao resolvidos a partir dos
# respectivos .nvmrc (server/.nvmrc e .nvmrc da raiz) — desde a Etapa 2
# da migracao Angular 14->22, ambos fixam Node 24.18.1 (runtime
# unificado; ver docs/adr/0002-migracao-angular-14-para-22.md).
# MOKBEATS_BACKEND_NODE / MOKBEATS_FRONTEND_NODE permitem apontar
# diretamente para um binario node, sem depender do nvm.
resolve_node_bin() {
    local override="$1"
    local nvmrc_path="$2"

    if [ -n "$override" ]; then
        if [ ! -x "$override" ]; then
            echo "ERRO: '$override' nao e um binario node executavel." >&2
            exit 1
        fi
        echo "$override"
        return 0
    fi

    if ! command -v nvm >/dev/null 2>&1; then
        echo "ERRO: nvm nao encontrado e nenhum override foi informado." >&2
        echo "Instale nvm (https://github.com/nvm-sh/nvm) ou defina a variavel de override." >&2
        exit 1
    fi

    local required
    required="$(cat "$nvmrc_path")"
    local bin
    bin="$(nvm which "$required" 2>/dev/null)"
    if [ -z "$bin" ] || [ ! -x "$bin" ]; then
        echo "ERRO: Node $required nao esta instalado no nvm." >&2
        echo "Instale com: nvm install $required" >&2
        exit 1
    fi
    echo "$bin"
}

BACKEND_NODE_BIN="$(resolve_node_bin "${MOKBEATS_BACKEND_NODE:-}" "server/.nvmrc")"
FRONTEND_NODE_BIN="$(resolve_node_bin "${MOKBEATS_FRONTEND_NODE:-}" ".nvmrc")"
BACKEND_NODE_DIR="$(dirname "$BACKEND_NODE_BIN")"
FRONTEND_NODE_DIR="$(dirname "$FRONTEND_NODE_BIN")"

echo "Backend Node:  $("$BACKEND_NODE_BIN" -v) ($BACKEND_NODE_BIN)"
echo "Frontend Node: $("$FRONTEND_NODE_BIN" -v) ($FRONTEND_NODE_BIN)"
echo ""

if [ ! -f "server/node_modules/bcrypt/package.json" ]; then
    echo "Instalando dependencias do backend..."
    rm -rf server/node_modules
    (cd server && PATH="$BACKEND_NODE_DIR:$PATH" npm install --prefer-offline 2>&1) || { echo "ERRO: falha ao instalar deps do backend."; exit 1; }
    echo ""
fi

mkdir -p server/data
mkdir -p server/src/uploads/documents

if [ ! -f "node_modules/@angular/cli/bin/bootstrap.js" ]; then
    echo "Dependencias do frontend incompletas. Instalando..."
    rm -rf node_modules
    PATH="$FRONTEND_NODE_DIR:$PATH" npm install --prefer-offline 2>&1 || { echo "ERRO: falha ao instalar deps do frontend."; exit 1; }
    echo ""
fi

if [ -f "server/.env" ]; then
    if ! grep -q "^JWT_SECRET=.\+" "server/.env" 2>/dev/null; then
        echo "AVISO: JWT_SECRET nao configurado em server/.env"
        echo "       Gere com: openssl rand -hex 32"
        echo ""
    fi
else
    echo "AVISO: server/.env nao encontrado. Crie-o com JWT_SECRET configurado."
    echo ""
fi

if [ "$GENERATE_PEAKS" = true ]; then
    echo "Gerando peaks reais localmente..."
    if ! command -v audiowaveform >/dev/null 2>&1; then
        echo "ERRO: audiowaveform nao encontrado."
        echo "Instale antes de usar --generate-peaks."
        exit 1
    fi

    if [ ! -f "server/scripts/generate-peaks.js" ]; then
        echo "ERRO: server/scripts/generate-peaks.js nao encontrado."
        exit 1
    fi

    (cd server && NODE_ENV=development AUDIO_BASE_PATH=../../src "$BACKEND_NODE_BIN" scripts/generate-peaks.js)
    echo "Peaks gerados."
    echo ""
fi

free_port 3100
echo "Iniciando backend -> http://localhost:3100"
"$BACKEND_NODE_BIN" server/src/index.js &
BACKEND_PID=$!

sleep 2

if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "ERRO: backend encerrou inesperadamente. Verifique os logs acima."
    exit 1
fi

echo "Backend OK (PID $BACKEND_PID)"
echo ""

free_port 4200
echo "Iniciando frontend -> http://localhost:4200"
echo ""
PATH="$FRONTEND_NODE_DIR:$PATH" npm run start &
FRONTEND_PID=$!

wait
