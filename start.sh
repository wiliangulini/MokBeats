#!/bin/bash

set -euo pipefail
# Job control (cada job em background vira lider do proprio process group),
# necessario para cleanup()/kill_tree() encerrarem toda a arvore de
# processos — ex.: o "ng serve" e neto do processo "npm run start", nao
# filho direto, e sem process group proprio ficaria orfao ao matar so o
# npm. Efeito colateral aceito: o bash pode imprimir mensagens de status de
# job ("Terminated", "Done") ao encerrar os servidores.
set -m

BACKEND_PID=""
FRONTEND_PID=""
GENERATE_PEAKS=false
CLEANUP_DONE=false

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

# Encerra um job em background e toda a sua arvore de processos filhos.
# Necessario porque, com "set -m", cada "&" vira lider do proprio process
# group: matar so o PID direto (ex.: o processo "npm") deixaria orfao
# qualquer processo neto (ex.: o "ng serve" que o npm inicia) segurando a
# porta (achado R-2/H-1 da auditoria de 2026-08-05).
kill_tree() {
    local pid="$1"
    [ -n "$pid" ] || return 0
    kill -0 "$pid" 2>/dev/null || return 0

    if ! kill -- "-$pid" 2>/dev/null; then
        if command -v pkill >/dev/null 2>&1; then
            pkill -TERM -P "$pid" 2>/dev/null || true
        fi
        kill "$pid" 2>/dev/null || true
    fi
    wait "$pid" 2>/dev/null || true
}

cleanup() {
    local status="${1:-$?}"

    [ "$CLEANUP_DONE" = true ] && return 0
    CLEANUP_DONE=true
    trap - EXIT INT TERM HUP

    echo ""
    echo "Desligando servidores..."

    kill_tree "$FRONTEND_PID"
    kill_tree "$BACKEND_PID"

    echo "Servidores parados."
    exit "$status"
}

# EXIT cobre tanto o fim normal do script (ver "wait -n" mais abaixo) quanto
# qualquer abort por "set -e"; INT/TERM/HUP cobrem Ctrl+C, kill e fechamento
# do terminal. O trap anterior so cobria SIGINT/SIGTERM, o que podia deixar
# backend/frontend orfaos em outros caminhos de saida (achado R-2 da
# auditoria de 2026-08-05).
trap 'cleanup $?' EXIT
trap 'cleanup 130' INT
trap 'cleanup 143' TERM
trap 'cleanup 129' HUP

free_port() {
    local port="$1"

    if ! command -v fuser >/dev/null 2>&1; then
        echo "AVISO: 'fuser' (pacote psmisc) nao encontrado. Pulando verificacao da porta $port."
        echo "       Se a porta estiver ocupada, o servidor pode falhar ao iniciar."
        return 0
    fi

    fuser "$port/tcp" >/dev/null 2>&1 || return 0

    echo "Porta $port ocupada."

    # Captura combinada (2>&1): implementacoes de fuser variam em qual
    # stream recebe a lista de PIDs. O filtro seguinte so aceita tokens
    # 100% numericos apos separar por espaco/tab, o que exclui o rotulo
    # "$port/tcp:" mesmo que ele contenha os digitos da propria porta.
    local raw pids pids_csv
    # Guarda "|| raw=''": a porta pode ter sido liberada entre a checagem
    # acima e esta segunda chamada (TOCTOU); sem a guarda, sob "set -e" um
    # "fuser" que retorne vazio aqui abortaria o script na propria
    # atribuicao, em vez de degradar para "nenhum PID encontrado".
    raw="$(fuser "$port/tcp" 2>&1)" || raw=""
    pids="$(printf '%s' "$raw" | tr -s ' \t' '\n' | grep -E '^[0-9]+$' || true)"
    if [ -n "$pids" ]; then
        pids_csv="$(printf '%s' "$pids" | tr '\n' ',' | sed 's/,$//')"
        echo "Processo(s):"
        ps -o pid,user,command -p "$pids_csv" 2>/dev/null || echo "  PID(s): $pids"
    fi

    # R-1 da auditoria de 2026-08-05: antes, esta funcao matava qualquer
    # processo na porta sem identificar o dono. Agora exige confirmacao
    # (ou MOKBEATS_FORCE_FREE_PORT=1) antes de encerrar.
    if [ "${MOKBEATS_FORCE_FREE_PORT:-}" = "1" ]; then
        echo "Liberando porta $port (MOKBEATS_FORCE_FREE_PORT=1)..."
    elif [ -t 0 ]; then
        local reply
        # Guarda "|| reply=''": Ctrl+D (EOF) num terminal interativo faz
        # "read" retornar diferente de zero; sem a guarda, sob "set -e" isso
        # abortaria o script aqui em vez de cair no "N" (nao confirmado)
        # abaixo.
        read -r -p "Encerrar processo(s) na porta $port? [s/N] " reply || reply=""
        case "${reply,,}" in
            s|sim) ;;
            *)
                echo "ERRO: porta $port permanece ocupada."
                echo "      Encerre manualmente ou defina MOKBEATS_FORCE_FREE_PORT=1."
                exit 1
                ;;
        esac
    else
        echo "ERRO: porta $port ocupada e sem terminal interativo para confirmar."
        echo "      Defina MOKBEATS_FORCE_FREE_PORT=1 para liberar automaticamente,"
        echo "      ou libere a porta manualmente."
        exit 1
    fi

    fuser -k "$port/tcp" 2>/dev/null || true
    sleep 1
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

echo ""
echo "Backend e frontend em execucao. Pressione Ctrl+C para encerrar."
echo ""

# A-2 da auditoria de 2026-08-05: "wait" sem argumento sempre retornava 0,
# mesmo com um dos servidores caindo. "wait -n -p" identifica qual PID saiu
# e propaga o status real da queda.
EXITED_PID=""
STATUS=0
wait -n -p EXITED_PID || STATUS=$?

if [ "$EXITED_PID" = "$BACKEND_PID" ]; then
    echo "ERRO: backend (PID $BACKEND_PID) encerrou com status $STATUS."
elif [ "$EXITED_PID" = "$FRONTEND_PID" ]; then
    echo "ERRO: frontend (PID $FRONTEND_PID) encerrou com status $STATUS."
else
    echo "AVISO: processo $EXITED_PID encerrou com status $STATUS."
fi

exit "$STATUS"
