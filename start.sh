#!/bin/bash

BACKEND_PID=""
FRONTEND_PID=""

# ─── Cleanup ──────────────────────────────────────────────────────────────────
cleanup() {
    echo ""
    echo "Desligando servidores..."

    [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null
    [ -n "$BACKEND_PID" ]  && kill "$BACKEND_PID"  2>/dev/null

    wait "$FRONTEND_PID" 2>/dev/null
    wait "$BACKEND_PID"  2>/dev/null

    echo "Servidores parados."
    exit 0
}

trap cleanup SIGINT SIGTERM

# ─── Liberar porta ────────────────────────────────────────────────────────────
free_port() {
    local port=$1
    if fuser "$port/tcp" &>/dev/null; then
        echo "Porta $port ocupada. Liberando..."
        fuser -k "$port/tcp" 2>/dev/null
        sleep 1
    fi
}

# ─── Node / NVM ───────────────────────────────────────────────────────────────
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    # shellcheck disable=SC1091
    source "$HOME/.nvm/nvm.sh"
fi

if ! command -v node &>/dev/null; then
    echo "ERRO: 'node' nao encontrado no PATH."
    echo "Instale o Node.js: https://nodejs.org  ou via nvm: nvm install --lts"
    exit 1
fi

if ! command -v npm &>/dev/null; then
    echo "ERRO: 'npm' nao encontrado no PATH."
    exit 1
fi

echo "Node: $(node -v)  |  npm: $(npm -v)"
echo ""

# ─── Dependências ─────────────────────────────────────────────────────────────
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

# ─── Verificar JWT_SECRET ─────────────────────────────────────────────────────
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

# ─── Backend ──────────────────────────────────────────────────────────────────
free_port 3100
echo "Iniciando backend  →  http://localhost:3100"
node server/src/index.js &
BACKEND_PID=$!

sleep 2

if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "ERRO: backend encerrou inesperadamente. Verifique os logs acima."
    exit 1
fi

echo "Backend OK  (PID $BACKEND_PID)"
echo ""

# ─── Frontend ─────────────────────────────────────────────────────────────────
free_port 4200
echo "Iniciando frontend →  http://localhost:4200"
echo ""
npm run start &
FRONTEND_PID=$!

wait
