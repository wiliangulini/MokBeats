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
  Backend:  http://localhost:3100
  Frontend: http://localhost:4200
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

if ! command -v node >/dev/null 2>&1; then
    echo "ERRO: 'node' nao encontrado no PATH."
    echo "Instale o Node.js: https://nodejs.org ou via nvm: nvm install --lts"
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "ERRO: 'npm' nao encontrado no PATH."
    exit 1
fi

echo "Node: $(node -v) | npm: $(npm -v)"
echo ""

if [ ! -f "server/node_modules/bcrypt/package.json" ]; then
    echo "Instalando dependencias do backend..."
    rm -rf server/node_modules
    (cd server && npm install --prefer-offline 2>&1) || { echo "ERRO: falha ao instalar deps do backend."; exit 1; }
    echo ""
fi

mkdir -p server/data
mkdir -p server/src/uploads/documents

if [ ! -f "node_modules/@angular/cli/bin/bootstrap.js" ]; then
    echo "Dependencias do frontend incompletas. Instalando..."
    rm -rf node_modules
    npm install --prefer-offline 2>&1 || { echo "ERRO: falha ao instalar deps do frontend."; exit 1; }
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

    (cd server && NODE_ENV=development AUDIO_BASE_PATH=../../src node scripts/generate-peaks.js)
    echo "Peaks gerados."
    echo ""
fi

free_port 3100
echo "Iniciando backend -> http://localhost:3100"
node server/src/index.js &
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
npm run start &
FRONTEND_PID=$!

wait
