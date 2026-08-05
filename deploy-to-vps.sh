#!/bin/bash

################################################################################
# Deploy MokBeats - VPS Hostinger
#
# Uso:
#   ./deploy-to-vps.sh [opcoes]
#
# Opcoes:
#   --no-audio        Nao envia src/assets/audios/
#   --no-build        Usa o dist/browser/ existente, sem executar npm run build
#   --frontend-only   Envia apenas frontend e .htaccess
#   --backend-only    Envia apenas backend e reinicia PM2
#   --generate-peaks  Executa server/scripts/generate-peaks.js na VPS
#   --dry-run         Mostra o que seria enviado/configurado, sem alterar a VPS
#   --allow-runtime-mismatch  Prossegue mesmo se o Node local ou remoto
#                      divergirem do exigido (>=24.18.1, major 24); nao
#                      recomendado, ver R1a/R1b
#   --help            Mostra esta ajuda
################################################################################

set -euo pipefail

VPS_IP="31.97.160.61"
VPS_USER="root"
VPS_PATH="/var/www/html/gulini.com.br/mokbeats"
PUBLIC_URL="https://gulini.com.br/mokbeats/"
PM2_NAME="mok-backend"
BACKEND_PORT=3100
SSH="${VPS_USER}@${VPS_IP}"

# Runtime exigido do backend remoto (lote R1a do Plano P0 v2.2). O upgrade da
# VPS em si pertence ao lote R1b (fora deste script) — aqui so verificamos.
REQUIRED_NODE_MAJOR=24
REQUIRED_NODE_MIN="24.18.1"

# Caminho absoluto do binario Node remoto resolvido por check_remote_runtime()
# (nvm-first, com fallback ao node do PATH) e reutilizado por
# configure_remote_env(). Necessario porque nvm.sh so e carregado em shells
# interativos via .bashrc — uma sessao `ssh host comando` nao-interativa nao
# enxerga versoes instaladas via nvm a menos que resolvamos o caminho
# explicitamente (mesmo padrao ja usado nesta VPS pelo PM2 de outras apps).
REMOTE_NODE_BIN=""

NO_AUDIO=false
NO_BUILD=false
FRONTEND_ONLY=false
BACKEND_ONLY=false
GENERATE_PEAKS=false
DRY_RUN=false
ALLOW_RUNTIME_MISMATCH=false

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

step() { echo -e "\n${BLUE}[STEP]${NC} $1"; }
ok() { echo -e "${GREEN}[OK]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err() { echo -e "${RED}[ERROR]${NC} $1"; }
info() { echo "    $1"; }

show_help() {
  cat <<'EOF'
Uso: ./deploy-to-vps.sh [opcoes]

Opcoes:
  --no-audio        Nao envia src/assets/audios/
  --no-build        Usa o dist/browser/ existente, sem executar npm run build
  --frontend-only   Envia apenas frontend e .htaccess
  --backend-only    Envia apenas backend e reinicia PM2
  --generate-peaks  Executa server/scripts/generate-peaks.js na VPS
  --dry-run         Mostra o que seria enviado/configurado, sem alterar a VPS
  --allow-runtime-mismatch  Prossegue mesmo se o Node local ou remoto
                     divergirem do exigido (>=24.18.1, major 24); nao
                     recomendado, ver R1a/R1b
  --help, -h        Mostra esta ajuda

Destino:
  root@31.97.160.61:/var/www/html/gulini.com.br/mokbeats
EOF
}

parse_args() {
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --no-audio) NO_AUDIO=true ;;
      --no-build) NO_BUILD=true ;;
      --frontend-only) FRONTEND_ONLY=true ;;
      --backend-only) BACKEND_ONLY=true ;;
      --generate-peaks) GENERATE_PEAKS=true ;;
      --dry-run) DRY_RUN=true ;;
      --allow-runtime-mismatch) ALLOW_RUNTIME_MISMATCH=true ;;
      --help|-h)
        show_help
        exit 0
        ;;
      *)
        err "Opcao desconhecida: $1"
        echo "Use --help para ver as opcoes disponiveis."
        exit 1
        ;;
    esac
    shift
  done

  if [ "$FRONTEND_ONLY" = true ] && [ "$BACKEND_ONLY" = true ]; then
    err "Use apenas uma das opcoes: --frontend-only ou --backend-only."
    exit 1
  fi
}

check_local_prerequisites() {
  if [ ! -f "angular.json" ] || [ ! -f "package.json" ]; then
    err "Execute este script na raiz do projeto MokBeats."
    exit 1
  fi

  command -v npm >/dev/null 2>&1 || { err "npm nao encontrado."; exit 1; }
  command -v rsync >/dev/null 2>&1 || { err "rsync nao encontrado. Instale com: sudo apt install rsync"; exit 1; }
  command -v ssh >/dev/null 2>&1 || { err "ssh nao encontrado."; exit 1; }
}

run_ssh() {
  if [ "$DRY_RUN" = true ]; then
    info "DRY-RUN ssh ${SSH}: $*"
    return 0
  fi

  ssh "$SSH" "$@"
}

run_remote_script() {
  local title="$1"
  shift

  if [ "$DRY_RUN" = true ]; then
    info "DRY-RUN: pularia bloco remoto: ${title}"
    return 0
  fi

  ssh "$SSH" "$@"
}

rsync_run() {
  local opts=(-avz)
  if [ "$DRY_RUN" = true ]; then
    opts+=(--dry-run)
  fi

  rsync "${opts[@]}" "$@"
}

print_banner() {
  echo -e "${CYAN}"
  echo "============================================================"
  echo "  Deploy MokBeats"
  echo "  VPS: ${SSH}"
  echo "  Destino: ${VPS_PATH}"
  echo "============================================================"
  echo -e "${NC}"

  if [ "$DRY_RUN" = true ]; then
    warn "Modo DRY-RUN ativo: nenhum arquivo remoto sera alterado."
  fi
}

# Resolucao do Node LOCAL usado para buildar o frontend (achado A13, Etapa 13
# da migracao Angular 14->22). Ate aqui so o Node REMOTO era resolvido
# (resolve_remote_node_bin(), abaixo); build_frontend() chamava
# "npm run build" com o npm do PATH do operador, sem checar a major - footgun
# silencioso ja documentado no plano. Mesmo padrao de start.sh:80-109
# (resolve_node_bin), com dois ajustes proprios deste script: aceita o node
# do PATH quando a major ja bate com .nvmrc (evita depender de nvm em toda
# maquina de deploy) e respeita --allow-runtime-mismatch como as checagens
# remotas. Retorna "" (sem erro) se --allow-runtime-mismatch cobrir a
# ausencia de um Node compativel - nesse caso o build segue com o node do
# PATH tal como estava antes desta etapa.
resolve_local_node_bin() {
  local nvmrc_path=".nvmrc"
  local required required_major
  required="$(cat "$nvmrc_path")"
  required_major="${required%%.*}"

  if [ -n "${MOKBEATS_FRONTEND_NODE:-}" ]; then
    if [ ! -x "$MOKBEATS_FRONTEND_NODE" ]; then
      err "MOKBEATS_FRONTEND_NODE='${MOKBEATS_FRONTEND_NODE}' nao e um binario node executavel."
      exit 1
    fi
    echo "$MOKBEATS_FRONTEND_NODE"
    return 0
  fi

  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    # shellcheck disable=SC1091
    . "$NVM_DIR/nvm.sh" >/dev/null 2>&1
  fi

  local bin=""
  if command -v nvm >/dev/null 2>&1; then
    bin="$(nvm which "$required" 2>/dev/null)"
    [ "$bin" = "N/A" ] && bin=""
  fi

  if [ -z "$bin" ] || [ ! -x "$bin" ]; then
    local sys_node
    sys_node="$(command -v node || true)"
    if [ -n "$sys_node" ]; then
      local sys_version sys_major
      sys_version="$("$sys_node" --version 2>/dev/null | sed 's/^v//')"
      sys_major="${sys_version%%.*}"
      [ "$sys_major" = "$required_major" ] && bin="$sys_node"
    fi
  fi

  if [ -z "$bin" ] || [ ! -x "$bin" ]; then
    if [ "$ALLOW_RUNTIME_MISMATCH" = true ]; then
      warn "Node local ${required} nao encontrado (nem via nvm, nem compativel no PATH). Prosseguindo por --allow-runtime-mismatch: o build usara o node do PATH tal como esta."
      echo ""
      return 0
    fi
    err "Node local ${required} nao encontrado (nem via nvm, nem compativel no PATH em major ${required_major})."
    info "Instale com: nvm install ${required}"
    info "Ou aponte MOKBEATS_FRONTEND_NODE para um binario node compativel."
    info "Use --allow-runtime-mismatch para prosseguir mesmo assim (nao recomendado)."
    exit 1
  fi

  echo "$bin"
}

build_frontend() {
  if [ "$BACKEND_ONLY" = true ]; then
    return
  fi

  if [ "$NO_BUILD" = true ]; then
    step "Build pulado (--no-build)"
    [ -d "dist/browser" ] || { err "dist/browser/ nao encontrado. Remova --no-build ou gere o build antes."; exit 1; }
    return
  fi

  step "Build do Angular (--base-href /mokbeats/)"
  # O frontend e SEMPRE buildado localmente; so o dist/browser/ resultante
  # vai por rsync (upload_frontend(), abaixo). O Node da VPS (resolvido mais
  # adiante por check_remote_runtime()) e irrelevante aqui - so importa para
  # o backend. A unificacao de runtime da migracao Angular 14->22 e de
  # desenvolvimento/CI, nao de producao do frontend.
  local node_bin
  node_bin="$(resolve_local_node_bin)"
  if [ -n "$node_bin" ]; then
    ok "Node local $("$node_bin" -v) (${node_bin})"
    PATH="$(dirname "$node_bin"):${PATH}" npm run build -- --base-href /mokbeats/
  else
    npm run build -- --base-href /mokbeats/
  fi
  ok "Build concluido em dist/browser/"
}

upload_frontend() {
  if [ "$BACKEND_ONLY" = true ]; then
    return
  fi

  [ -d "dist/browser" ] || { err "dist/browser/ nao encontrado."; exit 1; }

  step "Upload do frontend"
  info "Destino: ${SSH}:${VPS_PATH}/"
  run_ssh "mkdir -p '${VPS_PATH}'"
  rsync_run --delete --exclude=server/ --exclude=.htaccess dist/browser/ "${SSH}:${VPS_PATH}/"
  ok "Frontend enviado"

  step "Configurar .htaccess da SPA"
  if [ "$DRY_RUN" = true ]; then
    info "DRY-RUN: escreveria ${VPS_PATH}/.htaccess"
  else
    ssh "$SSH" "cat > '${VPS_PATH}/.htaccess'" <<'HTACCESS'
RewriteEngine On
RewriteBase /mokbeats/

RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /mokbeats/index.html [L]
HTACCESS
  fi
  ok ".htaccess configurado"
}

resolve_remote_node_bin() {
  ssh "$SSH" bash -s -- "$REQUIRED_NODE_MIN" "$REQUIRED_NODE_MAJOR" <<'REMOTE'
set -u
WANT_MIN="$1"
WANT_MAJOR="$2"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh" >/dev/null 2>&1
fi

CANDIDATE=""
if command -v nvm >/dev/null 2>&1; then
  CANDIDATE="$(nvm which "$WANT_MIN" 2>/dev/null)"
  [ "$CANDIDATE" = "N/A" ] && CANDIDATE=""
  if [ -z "$CANDIDATE" ]; then
    CANDIDATE="$(nvm which "$WANT_MAJOR" 2>/dev/null)"
    [ "$CANDIDATE" = "N/A" ] && CANDIDATE=""
  fi
fi

if [ -z "$CANDIDATE" ]; then
  CANDIDATE="$(command -v node 2>/dev/null || true)"
fi

if [ -z "$CANDIDATE" ] || [ ! -x "$CANDIDATE" ]; then
  echo "MISSING"
  exit 0
fi

VERSION="$("$CANDIDATE" --version 2>/dev/null)"
echo "${CANDIDATE}|${VERSION}"
REMOTE
}

check_remote_runtime() {
  if [ "$FRONTEND_ONLY" = true ]; then
    return
  fi

  step "Verificar runtime Node remoto"
  if [ "$DRY_RUN" = true ]; then
    info "DRY-RUN: verificaria se o Node remoto e major ${REQUIRED_NODE_MAJOR}, >= v${REQUIRED_NODE_MIN} (nvm-first, fallback ao PATH)."
    return
  fi

  local probe remote_bin remote_version
  probe="$(resolve_remote_node_bin)"

  if [ "$probe" = "MISSING" ]; then
    if [ "$ALLOW_RUNTIME_MISMATCH" = true ]; then
      warn "Node.js nao encontrado na VPS (nem via nvm, nem no PATH). Prosseguindo por --allow-runtime-mismatch (o backend ira falhar adiante se o runtime nao existir de fato)."
      REMOTE_NODE_BIN=""
      return
    fi
    err "Node.js nao encontrado na VPS (nem via nvm, nem no PATH)."
    info "Provisionamento/upgrade da VPS pertence ao lote R1b (fora deste script); nao sera instalado automaticamente."
    info "Use --allow-runtime-mismatch para prosseguir mesmo assim (nao recomendado)."
    exit 1
  fi

  remote_bin="${probe%%|*}"
  remote_version="${probe#*|}"

  local major
  major="$(echo "$remote_version" | sed 's/^v\([0-9]*\).*/\1/')"

  local compatible=true
  if [ "$major" != "$REQUIRED_NODE_MAJOR" ]; then
    compatible=false
  else
    local lowest
    lowest="$(printf '%s\n%s\n' "${remote_version#v}" "$REQUIRED_NODE_MIN" | sort -V | head -n1)"
    [ "$lowest" = "$REQUIRED_NODE_MIN" ] || compatible=false
  fi

  if [ "$compatible" = true ]; then
    ok "Node remoto ${remote_version} compativel (major ${REQUIRED_NODE_MAJOR}, >= v${REQUIRED_NODE_MIN})."
    info "Binario: ${remote_bin}"
    REMOTE_NODE_BIN="$remote_bin"
    return
  fi

  if [ "$ALLOW_RUNTIME_MISMATCH" = true ]; then
    warn "Node remoto ${remote_version} (${remote_bin}) diverge do exigido (major ${REQUIRED_NODE_MAJOR}, >= v${REQUIRED_NODE_MIN}). Prosseguindo por --allow-runtime-mismatch."
    REMOTE_NODE_BIN="$remote_bin"
    return
  fi

  err "Node remoto ${remote_version} (${remote_bin}) diverge do exigido (major ${REQUIRED_NODE_MAJOR}, >= v${REQUIRED_NODE_MIN})."
  info "Upgrade da VPS pertence ao lote R1b (fora deste script); nao sera instalado/atualizado automaticamente."
  info "Se o Node correto ja estiver instalado via nvm, confirme com:"
  info "  ssh ${SSH} 'export NVM_DIR=\$HOME/.nvm; . \$NVM_DIR/nvm.sh; nvm ls'"
  info "Use --allow-runtime-mismatch para prosseguir mesmo assim (nao recomendado; bcrypt 6 exige Node >=18 e pode falhar em runtime divergente)."
  exit 1
}

upload_backend() {
  if [ "$FRONTEND_ONLY" = true ]; then
    return
  fi

  [ -d "server" ] || { err "server/ nao encontrado."; exit 1; }

  step "Upload do backend"
  info "Excluindo: node_modules/, .env*, uploads/"
  run_ssh "mkdir -p '${VPS_PATH}/server'"
  rsync_run --delete \
    --exclude=node_modules \
    --exclude=.env \
    --exclude=.env.* \
    --exclude=uploads/ \
    server/ "${SSH}:${VPS_PATH}/server/"
  ok "Backend enviado"
}

upload_audio() {
  if [ "$FRONTEND_ONLY" = true ] || [ "$BACKEND_ONLY" = true ] || [ "$NO_AUDIO" = true ]; then
    # if em vez de "[ ] && warn" — sob set -e, um teste falso nessa forma
    # curta faz a funcao retornar o status do teste (1), abortando o
    # script no call site mesmo sem nenhum erro real (bug pre-existente,
    # so nao se manifestava porque deploys anteriores usavam --no-audio).
    if [ "$NO_AUDIO" = true ]; then
      warn "Upload de audio pulado (--no-audio)"
    fi
    return
  fi

  step "Upload dos arquivos de audio"
  if [ ! -d "src/assets/audios" ]; then
    warn "src/assets/audios/ nao encontrado localmente."
    return
  fi

  local audio_count
  audio_count=$(find src/assets/audios -name "*.mp3" 2>/dev/null | wc -l)
  info "Encontrados ${audio_count} arquivo(s) MP3"
  run_ssh "mkdir -p '${VPS_PATH}/assets/audios'"
  rsync_run src/assets/audios/ "${SSH}:${VPS_PATH}/assets/audios/"
  ok "Audios enviados"
}

configure_remote_env() {
  if [ "$FRONTEND_ONLY" = true ]; then
    return
  fi

  step "Configurar ambiente remoto"
  if [ "$DRY_RUN" = true ]; then
    info "DRY-RUN: validaria Node.js, PM2, .env, Apache e backend."
    return
  fi

  local skip_check="0"
  if [ "$ALLOW_RUNTIME_MISMATCH" = true ]; then
    skip_check="1"
  fi

  ssh "$SSH" bash -s -- "$VPS_PATH" "$BACKEND_PORT" "$PM2_NAME" "$skip_check" "$REMOTE_NODE_BIN" <<'REMOTE'
set -euo pipefail

VPS_PATH="$1"
BACKEND_PORT="$2"
PM2_NAME="$3"
SKIP_NODE_CHECK="$4"
NODE_BIN="$5"
ENV_FILE="${VPS_PATH}/server/.env"
VHOST_FILE="/etc/apache2/sites-available/gulini.com.br-le-ssl.conf"

# Node.js remoto ja foi resolvido por check_remote_runtime() (lote R1a do
# Plano P0 v2.2) via resolve_remote_node_bin() (nvm-first, fallback ao PATH)
# e chega aqui como caminho absoluto — necessario porque esta sessao SSH
# nao-interativa nao enxerga nvm.sh. Este script nunca instala/atualiza Node
# na VPS - provisionamento pertence ao lote R1b.
if [ -z "$NODE_BIN" ] || [ ! -x "$NODE_BIN" ]; then
  NODE_BIN="$(command -v node || true)"
fi
if [ -z "$NODE_BIN" ]; then
  echo "[ERROR] Node.js nao encontrado na VPS. Provisionamento pertence ao lote R1b."
  exit 1
fi
NODE_DIR="$(dirname "$NODE_BIN")"
NPM_BIN="${NODE_DIR}/npm"
[ -x "$NPM_BIN" ] || NPM_BIN="$(command -v npm || true)"
PATH="${NODE_DIR}:${PATH}"
echo "[OK] Node.js $("$NODE_BIN" --version) (${NODE_BIN})"

if [ "$SKIP_NODE_CHECK" = "1" ]; then
  export MOKBEATS_SKIP_NODE_CHECK=1
  echo "[WARN] MOKBEATS_SKIP_NODE_CHECK=1 (via --allow-runtime-mismatch) - verificacao de runtime do backend (server/scripts/check-node.js) ignorada."
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "[STEP] Instalando PM2..."
  "$NPM_BIN" install -g pm2
fi
echo "[OK] PM2 $(pm2 --version)"

mkdir -p "${VPS_PATH}/server" "${VPS_PATH}/assets/audios"

if [ ! -f "$ENV_FILE" ]; then
  echo "[STEP] Criando .env de producao..."
  umask 077
  GENERATED_SECRET="$(openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
  cat > "$ENV_FILE" <<ENVFILE
NODE_ENV=production
AUDIO_BASE_PATH=../../
JWT_SECRET=${GENERATED_SECRET}
ENVFILE
  echo "[OK] .env criado com JWT_SECRET gerado automaticamente"
else
  echo "[OK] .env existente preservado"
  cp "$ENV_FILE" "${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
  if grep -q '^NODE_ENV=' "$ENV_FILE"; then
    sed -i 's|^NODE_ENV=.*|NODE_ENV=production|' "$ENV_FILE"
  else
    printf '\nNODE_ENV=production\n' >> "$ENV_FILE"
  fi
  if grep -q '^AUDIO_BASE_PATH=' "$ENV_FILE"; then
    sed -i 's|^AUDIO_BASE_PATH=.*|AUDIO_BASE_PATH=../../|' "$ENV_FILE"
  else
    printf 'AUDIO_BASE_PATH=../../\n' >> "$ENV_FILE"
  fi
  if ! grep -q '^JWT_SECRET=.\+' "$ENV_FILE"; then
    echo "[WARN] JWT_SECRET ausente em ${ENV_FILE}. Configure antes de usar producao."
  fi
fi
chmod 600 "$ENV_FILE" || true

echo "[STEP] Instalando dependencias do backend..."
cd "${VPS_PATH}/server"
if [ -f package-lock.json ]; then
  "$NPM_BIN" ci --omit=dev
else
  "$NPM_BIN" install --omit=dev
fi
echo "[OK] Dependencias do backend instaladas"

if [ -f "$VHOST_FILE" ]; then
  if ! grep -q "ProxyPass /api" "$VHOST_FILE"; then
    echo "[STEP] Adicionando ProxyPass /api ao vhost Apache..."
    sed -i "s|</VirtualHost>|    # Proxy para backend MokBeats\n    ProxyPass /api http://localhost:${BACKEND_PORT}/api\n    ProxyPassReverse /api http://localhost:${BACKEND_PORT}/api\n</VirtualHost>|" "$VHOST_FILE"
  else
    echo "[OK] ProxyPass /api ja configurado"
  fi
  a2enmod proxy proxy_http >/dev/null 2>&1 || true
  apache2ctl configtest
  systemctl reload apache2
  echo "[OK] Apache recarregado"
else
  echo "[WARN] Vhost nao encontrado: ${VHOST_FILE}"
fi

echo "[STEP] Iniciando/reiniciando backend com PM2..."
# Recriado (delete + start) em vez de "pm2 restart" para garantir que o
# --interpreter fique sempre fixado no NODE_BIN resolvido acima — "pm2
# restart" nao altera o interpretador de um processo ja existente, e o
# mok-backend pode ter sido criado antes do R1b com o node do PATH (system).
if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  pm2 delete "$PM2_NAME"
fi
pm2 start "${VPS_PATH}/server/src/index.js" --name "$PM2_NAME" --interpreter "$NODE_BIN"
pm2 save
pm2 startup 2>/dev/null || true
echo "[OK] Backend em PM2 configurado (interpreter: ${NODE_BIN})"
REMOTE

  ok "Ambiente remoto configurado"
}

generate_remote_peaks() {
  if [ "$FRONTEND_ONLY" = true ] || [ "$GENERATE_PEAKS" != true ]; then
    return
  fi

  step "Gerar peaks na VPS"
  if [ "$DRY_RUN" = true ]; then
    info "DRY-RUN: executaria node scripts/generate-peaks.js e reiniciaria ${PM2_NAME}."
    return
  fi

  ssh "$SSH" bash -s -- "$VPS_PATH" "$PM2_NAME" <<'REMOTE'
set -euo pipefail
VPS_PATH="$1"
PM2_NAME="$2"

cd "${VPS_PATH}/server"
if ! command -v audiowaveform >/dev/null 2>&1; then
  echo "[ERROR] audiowaveform nao encontrado. Execute setup-vps.sh na VPS antes de gerar peaks."
  exit 1
fi
node scripts/generate-peaks.js
pm2 restart "$PM2_NAME"
REMOTE

  ok "Peaks gerados e backend reiniciado"
}

validate_deploy() {
  if [ "$DRY_RUN" = true ]; then
    return
  fi

  step "Validacao final"
  if [ "$FRONTEND_ONLY" != true ]; then
    ssh "$SSH" bash -s -- "$PM2_NAME" "$BACKEND_PORT" <<'REMOTE'
set -e
PM2_NAME="$1"
BACKEND_PORT="$2"
echo "=== PM2 Status ==="
pm2 list
echo ""
echo "=== Backend direto ==="
sleep 2
if curl -fsS "http://localhost:${BACKEND_PORT}/api/generos" >/dev/null; then
  echo "[OK] Backend respondendo em :${BACKEND_PORT}/api/generos"
else
  echo "[WARN] Backend nao respondeu em :${BACKEND_PORT}/api/generos"
  pm2 logs "$PM2_NAME" --lines 15 --nostream 2>/dev/null || true
fi
REMOTE
  fi

  if [ "$BACKEND_ONLY" != true ]; then
    echo ""
    echo "=== Frontend via Apache ==="
    if curl -fsSk "$PUBLIC_URL" | grep -qi "app-root\|MokBeats\|<!DOCTYPE"; then
      ok "Frontend acessivel em ${PUBLIC_URL}"
    else
      warn "Frontend pode estar indisponivel. Verifique manualmente: ${PUBLIC_URL}"
    fi
  fi

  return 0
}

show_summary() {
  echo ""
  echo -e "${CYAN}============================================================${NC}"
  echo -e "${CYAN}  Deploy finalizado${NC}"
  echo -e "${CYAN}============================================================${NC}"
  info "Frontend: ${PUBLIC_URL}"
  info "Backend local na VPS: http://localhost:${BACKEND_PORT}/api"
  info "Backend via proxy: https://gulini.com.br/api"
  info "Logs: ssh ${SSH} 'pm2 logs ${PM2_NAME}'"
  info "Status: ssh ${SSH} 'pm2 status'"
  return 0
}

parse_args "$@"
check_local_prerequisites
print_banner
build_frontend
upload_frontend
check_remote_runtime
upload_backend
upload_audio
configure_remote_env
generate_remote_peaks
validate_deploy
show_summary
