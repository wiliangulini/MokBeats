#!/bin/bash

################################################################################
# Deploy MokBeats - VPS Hostinger
#
# Uso:
#   ./deploy-to-vps.sh [opcoes]
#
# Opcoes:
#   --no-audio        Nao envia src/assets/audios/
#   --no-build        Usa o dist/ existente, sem executar npm run build
#   --frontend-only   Envia apenas frontend e .htaccess
#   --backend-only    Envia apenas backend e reinicia PM2
#   --generate-peaks  Executa server/scripts/generate-peaks.js na VPS
#   --dry-run         Mostra o que seria enviado/configurado, sem alterar a VPS
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

NO_AUDIO=false
NO_BUILD=false
FRONTEND_ONLY=false
BACKEND_ONLY=false
GENERATE_PEAKS=false
DRY_RUN=false

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
  --no-build        Usa o dist/ existente, sem executar npm run build
  --frontend-only   Envia apenas frontend e .htaccess
  --backend-only    Envia apenas backend e reinicia PM2
  --generate-peaks  Executa server/scripts/generate-peaks.js na VPS
  --dry-run         Mostra o que seria enviado/configurado, sem alterar a VPS
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

build_frontend() {
  if [ "$BACKEND_ONLY" = true ]; then
    return
  fi

  if [ "$NO_BUILD" = true ]; then
    step "Build pulado (--no-build)"
    [ -d "dist" ] || { err "dist/ nao encontrado. Remova --no-build ou gere o build antes."; exit 1; }
    return
  fi

  step "Build do Angular (--base-href /mokbeats/)"
  npm run build -- --base-href /mokbeats/
  ok "Build concluido em dist/"
}

upload_frontend() {
  if [ "$BACKEND_ONLY" = true ]; then
    return
  fi

  [ -d "dist" ] || { err "dist/ nao encontrado."; exit 1; }

  step "Upload do frontend"
  info "Destino: ${SSH}:${VPS_PATH}/"
  run_ssh "mkdir -p '${VPS_PATH}'"
  rsync_run --delete --exclude=server/ --exclude=.htaccess dist/ "${SSH}:${VPS_PATH}/"
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

upload_backend() {
  if [ "$FRONTEND_ONLY" = true ]; then
    return
  fi

  [ -d "server" ] || { err "server/ nao encontrado."; exit 1; }

  step "Upload do backend"
  info "Excluindo: node_modules/, .env, uploads/"
  run_ssh "mkdir -p '${VPS_PATH}/server'"
  rsync_run --delete \
    --exclude=node_modules \
    --exclude=.env \
    --exclude=uploads/ \
    server/ "${SSH}:${VPS_PATH}/server/"
  ok "Backend enviado"
}

upload_audio() {
  if [ "$FRONTEND_ONLY" = true ] || [ "$BACKEND_ONLY" = true ] || [ "$NO_AUDIO" = true ]; then
    [ "$NO_AUDIO" = true ] && warn "Upload de audio pulado (--no-audio)"
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

  ssh "$SSH" bash -s -- "$VPS_PATH" "$BACKEND_PORT" "$PM2_NAME" <<'REMOTE'
set -euo pipefail

VPS_PATH="$1"
BACKEND_PORT="$2"
PM2_NAME="$3"
ENV_FILE="${VPS_PATH}/server/.env"
VHOST_FILE="/etc/apache2/sites-available/gulini.com.br-le-ssl.conf"

if ! command -v node >/dev/null 2>&1; then
  echo "[STEP] Instalando Node.js LTS via NodeSource..."
  curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
  apt-get install -y nodejs
fi
echo "[OK] Node.js $(node --version)"

if ! command -v pm2 >/dev/null 2>&1; then
  echo "[STEP] Instalando PM2..."
  npm install -g pm2
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
  npm ci --omit=dev
else
  npm install --omit=dev
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
if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  pm2 restart "$PM2_NAME"
else
  pm2 start "${VPS_PATH}/server/src/index.js" --name "$PM2_NAME"
fi
pm2 save
pm2 startup 2>/dev/null || true
echo "[OK] Backend em PM2 configurado"
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
}

parse_args "$@"
check_local_prerequisites
print_banner
build_frontend
upload_frontend
upload_backend
upload_audio
configure_remote_env
generate_remote_peaks
validate_deploy
show_summary
