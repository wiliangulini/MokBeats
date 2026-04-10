#!/bin/bash

################################################################################
# Deploy MokBeats → VPS Hostinger
#
# Uso: ./deploy-to-vps.sh
#
# Requisitos locais:
# - rsync instalado
# - ssh configurado com chave para root@VPS_IP
# - Executar do diretório raiz do projeto (onde está angular.json)
################################################################################

set -e

# ── Configurações centralizadas ────────────────────────────────────────────────
VPS_IP="31.97.160.61"
VPS_USER="root"
VPS_PATH="/var/www/html/gulini.com.br/mokbeats"
PM2_NAME="mok-backend"
BACKEND_PORT=3100
SSH="${VPS_USER}@${VPS_IP}"

# ── Cores ──────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

step()    { echo -e "\n${BLUE}[STEP]${NC} $1"; }
ok()      { echo -e "${GREEN}[✓]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
err()     { echo -e "${RED}[✗]${NC} $1"; }
info()    { echo -e "    $1"; }

# ── Verificar pré-requisitos locais ───────────────────────────────────────────
if [ ! -f "angular.json" ]; then
  err "Execute este script do diretório raiz do projeto (onde está angular.json)"
  exit 1
fi

command -v rsync >/dev/null 2>&1 || { err "rsync não encontrado. Instale com: sudo apt install rsync"; exit 1; }

echo -e "${CYAN}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Deploy MokBeats → ${VPS_IP}"
echo "  Destino: ${VPS_PATH}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

# ── PASSO 1: Build do Angular ──────────────────────────────────────────────────
step "1. Build do Angular (--base-href /mokbeats/)"
npm run build -- --base-href /mokbeats/
ok "Build concluído → dist/"

# ── PASSO 2: Upload do frontend ───────────────────────────────────────────────
step "2. Upload do frontend (dist/ → VPS)"
info "Destino: ${SSH}:${VPS_PATH}/"
rsync -avz --delete \
  --exclude=server/ \
  --exclude=.htaccess \
  dist/ ${SSH}:${VPS_PATH}/
ok "Frontend enviado"

# ── PASSO 3: .htaccess para SPA routing ──────────────────────────────────────
step "3. Configurando .htaccess na VPS (SPA routing Angular)"
ssh ${SSH} "cat > ${VPS_PATH}/.htaccess << 'HTACCESS'
RewriteEngine On
RewriteBase /mokbeats/

# Não reescrever arquivos/diretórios existentes
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Redirecionar tudo para index.html (Angular router)
RewriteRule . /mokbeats/index.html [L]
HTACCESS
"
ok ".htaccess criado"

# ── PASSO 4: Upload do backend ────────────────────────────────────────────────
step "4. Upload do backend (server/ → VPS)"
info "Excluindo: node_modules/, .env"
rsync -avz --delete \
  --exclude=node_modules \
  --exclude=.env \
  --exclude=uploads/ \
  server/ ${SSH}:${VPS_PATH}/server/
ok "Backend enviado"

# ── PASSO 5: Upload dos áudios ────────────────────────────────────────────────
step "5. Verificando arquivos de áudio locais"
if [ -d "src/assets/audios" ]; then
  audio_count=$(find src/assets/audios -name "*.mp3" 2>/dev/null | wc -l)
  info "Encontrados ${audio_count} arquivo(s) MP3 em src/assets/audios/"

  if [ "$1" = "--no-audio" ]; then
    warn "Upload de áudio pulado (--no-audio)"
  else
    info "Enviando para: ${SSH}:${VPS_PATH}/assets/audios/"
    ssh ${SSH} "mkdir -p ${VPS_PATH}/assets/audios"
    rsync -avz src/assets/audios/ ${SSH}:${VPS_PATH}/assets/audios/
    ok "Áudios enviados (${audio_count} arquivo(s))"
  fi
else
  warn "src/assets/audios/ não encontrado localmente — verifique se os áudios já estão na VPS"
fi

# ── PASSO 6: Configuração remota da VPS ──────────────────────────────────────
step "6. Configurando ambiente na VPS"

ssh ${SSH} bash << REMOTE
set -e

# ── 6a. Instalar Node.js (se não instalado) ──────────────────────────────────
if ! command -v node >/dev/null 2>&1; then
  echo "[STEP] Instalando Node.js LTS via NodeSource..."
  curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
  apt-get install -y nodejs
  echo "[✓] Node.js \$(node --version) instalado"
else
  echo "[✓] Node.js \$(node --version) já instalado"
fi

# ── 6b. Instalar PM2 (se não instalado) ─────────────────────────────────────
if ! command -v pm2 >/dev/null 2>&1; then
  echo "[STEP] Instalando PM2..."
  npm install -g pm2
  echo "[✓] PM2 \$(pm2 --version) instalado"
else
  echo "[✓] PM2 \$(pm2 --version) já instalado"
fi

# ── 6c. Criar .env apenas se não existir ────────────────────────────────────
if [ ! -f "${VPS_PATH}/server/.env" ]; then
  echo "[STEP] Criando .env de produção..."
  cat > "${VPS_PATH}/server/.env" << 'ENVFILE'
NODE_ENV=production
JWT_SECRET=ALTERE_ESTE_SEGREDO_ANTES_DE_USAR
ENVFILE
  echo "[!] ATENÇÃO: .env criado com JWT_SECRET padrão."
  echo "    Edite ${VPS_PATH}/server/.env e defina um segredo seguro!"
else
  echo "[✓] .env já existe — mantido sem alteração"
fi

# ── 6d. Instalar dependências do backend ────────────────────────────────────
echo "[STEP] Instalando dependências do backend..."
cd "${VPS_PATH}/server"
npm install --omit=dev
echo "[✓] Dependências instaladas"

# ── 6e. Configurar Apache ProxyPass (idempotente) ────────────────────────────
VHOST_FILE="/etc/apache2/sites-available/gulini.com.br-le-ssl.conf"

if ! grep -q "ProxyPass /api" "\${VHOST_FILE}" 2>/dev/null; then
  echo "[STEP] Adicionando ProxyPass /api ao vhost Apache..."
  sed -i "s|</VirtualHost>|    # Proxy para backend MokBeats\n    ProxyPass /api http://localhost:${BACKEND_PORT}/api\n    ProxyPassReverse /api http://localhost:${BACKEND_PORT}/api\n</VirtualHost>|" "\${VHOST_FILE}"
  echo "[✓] ProxyPass adicionado ao vhost SSL"
else
  echo "[✓] ProxyPass /api já configurado no vhost"
fi

# Habilitar mod_proxy se necessário
a2enmod proxy proxy_http >/dev/null 2>&1 || true

# Testar e recarregar Apache
apache2ctl configtest
systemctl reload apache2
echo "[✓] Apache recarregado"

# ── 6f. Iniciar/reiniciar backend com PM2 ───────────────────────────────────
echo "[STEP] Iniciando backend com PM2..."
if pm2 describe "${PM2_NAME}" >/dev/null 2>&1; then
  pm2 restart "${PM2_NAME}"
  echo "[✓] Backend reiniciado"
else
  pm2 start "${VPS_PATH}/server/src/index.js" --name "${PM2_NAME}"
  echo "[✓] Backend iniciado"
fi

pm2 save
echo "[✓] Configuração PM2 salva"

# Configurar startup (ignora erro se já configurado)
pm2 startup 2>/dev/null || true

REMOTE

ok "VPS configurada"

# ── PASSO 7: Validação final ──────────────────────────────────────────────────
step "7. Validação do deploy"
echo ""

ssh ${SSH} bash << 'VALIDATE'
echo "=== PM2 Status ==="
pm2 list

echo ""
echo "=== Backend (porta direto) ==="
sleep 2
if curl -s "http://localhost:3100/api/generos" | grep -q "id"; then
  echo "[✓] Backend respondendo em :3100 — /api/generos OK"
else
  echo "[!] Backend pode ainda estar iniciando ou com erro"
  pm2 logs mok-backend --lines 15 --nostream 2>/dev/null || true
fi
VALIDATE

echo ""
echo "=== Frontend via Apache ==="
if curl -sk "https://gulini.com.br/mokbeats/" | grep -q "index\|app-root\|MokBeats\|<!DOCTYPE"; then
  ok "Frontend acessível em https://gulini.com.br/mokbeats/"
else
  warn "Frontend pode estar com problema — verifique manualmente"
fi

# ── Resumo final ──────────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Deploy concluído"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"
info "Frontend: https://gulini.com.br/mokbeats/"
info "Backend:  http://localhost:${BACKEND_PORT}/api (via proxy: https://gulini.com.br/api)"
info ""
info "Monitoramento:"
info "  ssh ${SSH} 'pm2 logs ${PM2_NAME}'"
info "  ssh ${SSH} 'pm2 status'"
info ""
warn "Se o JWT_SECRET ainda for padrão, edite antes de usar em produção:"
info "  ssh ${SSH} 'nano ${VPS_PATH}/server/.env'"
echo ""
