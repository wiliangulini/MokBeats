#!/bin/bash

################################################################################
# Quick Fix VPS - reparo controlado de peaks/env/backend
#
# Uso:
#   ./quick-fix-vps.sh [opcoes]
#
# Opcoes:
#   --generate-peaks  Executa server/scripts/generate-peaks.js na VPS
#   --restart-backend Reinicia/cria processo PM2 mok-backend
#   --check-only      Apenas verifica estrutura, env, Node, PM2 e arquivos
#   --dry-run         Mostra o que seria feito, sem alterar a VPS
#   --help            Mostra esta ajuda
#
# Sem flags, o script executa reparo completo: env + generate-peaks + PM2.
################################################################################

set -euo pipefail

VPS_IP="31.97.160.61"
VPS_USER="root"
VPS_PATH="/var/www/html/gulini.com.br/mokbeats"
PM2_NAME="mok-backend"
SSH="${VPS_USER}@${VPS_IP}"

DO_GENERATE_PEAKS=false
DO_RESTART_BACKEND=false
CHECK_ONLY=false
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
Uso: ./quick-fix-vps.sh [opcoes]

Opcoes:
  --generate-peaks  Executa server/scripts/generate-peaks.js na VPS
  --restart-backend Reinicia/cria processo PM2 mok-backend
  --check-only      Apenas verifica estrutura, env, Node, PM2 e arquivos
  --dry-run         Mostra o que seria feito, sem alterar a VPS
  --help, -h        Mostra esta ajuda

Sem flags, executa reparo completo: env + generate-peaks + PM2.
EOF
}

parse_args() {
  if [ "$#" -eq 0 ]; then
    DO_GENERATE_PEAKS=true
    DO_RESTART_BACKEND=true
    return
  fi

  while [ "$#" -gt 0 ]; do
    case "$1" in
      --generate-peaks) DO_GENERATE_PEAKS=true ;;
      --restart-backend) DO_RESTART_BACKEND=true ;;
      --check-only) CHECK_ONLY=true ;;
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

  if [ "$CHECK_ONLY" = true ]; then
    DO_GENERATE_PEAKS=false
    DO_RESTART_BACKEND=false
  fi
}

run_remote() {
  local label="$1"
  shift

  if [ "$DRY_RUN" = true ]; then
    info "DRY-RUN: pularia bloco remoto: ${label}"
    return 0
  fi

  ssh "$SSH" "$@"
}

print_banner() {
  echo -e "${CYAN}"
  echo "============================================================"
  echo "  Quick Fix VPS - MokBeats"
  echo "  VPS: ${SSH}"
  echo "  Caminho: ${VPS_PATH}"
  echo "============================================================"
  echo -e "${NC}"

  if [ "$DRY_RUN" = true ]; then
    warn "Modo DRY-RUN ativo: nenhuma alteracao remota sera feita."
  fi
}

check_connection() {
  step "Testar conexao SSH"
  if [ "$DRY_RUN" = true ]; then
    info "DRY-RUN: testaria ssh ${SSH}"
    return
  fi

  ssh -o ConnectTimeout=5 "$SSH" "echo 'Conexao OK'" >/dev/null
  ok "Conexao estabelecida"
}

inspect_remote() {
  step "Inspecionar estrutura remota"
  run_remote "inspecao" bash -s -- "$VPS_PATH" "$PM2_NAME" <<'REMOTE'
set -euo pipefail
VPS_PATH="$1"
PM2_NAME="$2"
ENV_FILE="${VPS_PATH}/server/.env"

echo "Diretorio principal: ${VPS_PATH}"
[ -d "$VPS_PATH" ] && ls -1 "$VPS_PATH" | head -20 || echo "[WARN] Diretorio nao existe"
echo ""

if [ -d "${VPS_PATH}/assets/audios" ]; then
  audio_count=$(find "${VPS_PATH}/assets/audios" -name "*.mp3" 2>/dev/null | wc -l)
  echo "[OK] MP3 encontrados: ${audio_count}"
else
  echo "[WARN] ${VPS_PATH}/assets/audios nao existe"
fi

if [ -d "${VPS_PATH}/server" ]; then
  echo "[OK] server/ existe"
else
  echo "[WARN] server/ nao existe"
fi

if [ -f "$ENV_FILE" ]; then
  echo "[OK] .env existe"
  grep -E '^(NODE_ENV|AUDIO_BASE_PATH)=' "$ENV_FILE" || true
  if ! grep -q '^JWT_SECRET=.\+' "$ENV_FILE"; then
    echo "[WARN] JWT_SECRET ausente ou vazio"
  fi
else
  echo "[WARN] .env nao existe"
fi

if command -v node >/dev/null 2>&1; then
  echo "[OK] Node.js $(node --version)"
else
  echo "[WARN] Node.js nao encontrado"
fi

if command -v pm2 >/dev/null 2>&1; then
  echo "[OK] PM2 $(pm2 --version)"
  pm2 describe "$PM2_NAME" >/dev/null 2>&1 && echo "[OK] PM2 ${PM2_NAME} existe" || echo "[WARN] PM2 ${PM2_NAME} nao existe"
else
  echo "[WARN] PM2 nao encontrado"
fi

if command -v audiowaveform >/dev/null 2>&1; then
  echo "[OK] $(audiowaveform --version 2>&1 | head -n1)"
else
  echo "[WARN] audiowaveform nao encontrado"
fi
REMOTE
}

repair_env() {
  if [ "$CHECK_ONLY" = true ]; then
    return
  fi

  step "Corrigir .env remoto sem sobrescrever secrets"
  run_remote "env" bash -s -- "$VPS_PATH" <<'REMOTE'
set -euo pipefail
VPS_PATH="$1"
ENV_FILE="${VPS_PATH}/server/.env"

mkdir -p "${VPS_PATH}/server"
if [ -f "$ENV_FILE" ]; then
  cp "$ENV_FILE" "${ENV_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
  echo "[OK] Backup criado para .env existente"
else
  umask 077
  GENERATED_SECRET="$(openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
  cat > "$ENV_FILE" <<ENVFILE
NODE_ENV=production
AUDIO_BASE_PATH=../../
JWT_SECRET=${GENERATED_SECRET}
ENVFILE
  echo "[OK] .env criado com JWT_SECRET gerado automaticamente"
fi

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
  echo "[WARN] JWT_SECRET ausente ou vazio. Configure antes de usar producao."
fi

chmod 600 "$ENV_FILE" || true
echo "[OK] NODE_ENV e AUDIO_BASE_PATH corrigidos"
REMOTE
  ok ".env remoto revisado"
}

generate_peaks() {
  if [ "$DO_GENERATE_PEAKS" != true ]; then
    return
  fi

  step "Gerar peaks na VPS"
  run_remote "generate-peaks" bash -s -- "$VPS_PATH" <<'REMOTE'
set -euo pipefail
VPS_PATH="$1"

cd "${VPS_PATH}/server"
if ! command -v audiowaveform >/dev/null 2>&1; then
  echo "[ERROR] audiowaveform nao encontrado. Execute setup-vps.sh antes."
  exit 1
fi
node scripts/generate-peaks.js

if [ -f "data/musicas.json" ]; then
  peaks_count=$(grep -Eo '"peaks"[[:space:]]*:[[:space:]]*\[' data/musicas.json | wc -l)
  echo "[OK] musicas.json contem ${peaks_count} campo(s) peaks"
else
  echo "[ERROR] data/musicas.json nao encontrado apos geracao"
  exit 1
fi
REMOTE
  ok "Peaks gerados"
}

restart_backend() {
  if [ "$DO_RESTART_BACKEND" != true ]; then
    return
  fi

  step "Reiniciar backend PM2"
  run_remote "restart-backend" bash -s -- "$VPS_PATH" "$PM2_NAME" <<'REMOTE'
set -euo pipefail
VPS_PATH="$1"
PM2_NAME="$2"

if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  pm2 restart "$PM2_NAME"
else
  pm2 start "${VPS_PATH}/server/src/index.js" --name "$PM2_NAME"
fi

pm2 save
pm2 status
pm2 logs "$PM2_NAME" --lines 15 --nostream
REMOTE
  ok "Backend reiniciado"
}

parse_args "$@"
print_banner
check_connection
inspect_remote
repair_env
generate_peaks
restart_backend

echo ""
ok "Quick fix finalizado"
info "Frontend: https://gulini.com.br/mokbeats/"
info "Logs: ssh ${SSH} 'pm2 logs ${PM2_NAME}'"
