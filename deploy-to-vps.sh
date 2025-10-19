#!/bin/bash

################################################################################
# Script de Deploy Automatizado - MokBeats VPS
#
# Este script automatiza todo o processo de deploy do projeto MokBeats
# para a VPS da Hostinger.
#
# Uso: ./deploy-to-vps.sh
#
# Requisitos:
# - rsync instalado
# - ssh configurado
# - Build do Angular já executado (npm run build)
################################################################################

set -e  # Sair se qualquer comando falhar

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configurações da VPS
VPS_IP="147.79.87.156"
VPS_USER="root"
VPS_PATH="/var/www/mokbeats"
PROJECT_DIR="/home/hustler/Documentos/projetos/MokBeats"

# Banner
echo -e "${CYAN}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 Deploy Automatizado - MokBeats VPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

# Função para printar mensagens
print_step() {
  echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
  echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
  echo -e "${RED}[✗]${NC} $1"
}

print_info() {
  echo -e "${MAGENTA}[INFO]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "angular.json" ]; then
  print_error "Este script deve ser executado do diretório raiz do projeto MokBeats"
  exit 1
fi

# Passo 1: Build do Angular
print_step "1. Verificando build do Angular..."
if [ ! -d "dist" ]; then
  print_warning "Pasta dist/ não encontrada. Executando build..."
  npm run build
  if [ $? -eq 0 ]; then
    print_success "Build concluído com sucesso"
  else
    print_error "Erro no build do Angular"
    exit 1
  fi
else
  print_info "Build já existe em dist/"
  read -p "Deseja fazer um novo build? (s/N): " rebuild
  if [[ $rebuild =~ ^[Ss]$ ]]; then
    npm run build
    print_success "Build concluído"
  fi
fi

# Passo 2: Upload do Frontend
print_step "2. Fazendo upload do frontend (dist/)..."
rsync -avz --delete dist/* ${VPS_USER}@${VPS_IP}:${VPS_PATH}/
if [ $? -eq 0 ]; then
  print_success "Frontend enviado com sucesso"
else
  print_error "Erro ao enviar frontend"
  exit 1
fi

# Passo 3: Upload do Backend
print_step "3. Fazendo upload do backend (server/)..."
rsync -avz --delete --exclude=node_modules --exclude=.env server/ ${VPS_USER}@${VPS_IP}:${VPS_PATH}/server/
if [ $? -eq 0 ]; then
  print_success "Backend enviado com sucesso"
else
  print_error "Erro ao enviar backend"
  exit 1
fi

# Passo 4: Upload dos Arquivos de Áudio
print_step "4. Verificando arquivos de áudio..."
if [ -d "src/assets/audios" ]; then
  audio_count=$(find src/assets/audios -name "*.mp3" | wc -l)
  print_info "Encontrados $audio_count arquivos MP3"

  read -p "Deseja fazer upload dos arquivos de áudio? (s/N): " upload_audio
  if [[ $upload_audio =~ ^[Ss]$ ]]; then
    print_step "Enviando arquivos de áudio..."
    rsync -avz src/assets/audios/ ${VPS_USER}@${VPS_IP}:${VPS_PATH}/assets/audios/
    if [ $? -eq 0 ]; then
      print_success "Arquivos de áudio enviados com sucesso"
    else
      print_error "Erro ao enviar arquivos de áudio"
      exit 1
    fi
  else
    print_warning "Upload de áudio pulado. Certifique-se de que os arquivos já estão na VPS."
  fi
else
  print_warning "Pasta src/assets/audios não encontrada localmente"
fi

# Passo 5: Criar arquivo .env na VPS
print_step "5. Configurando arquivo .env na VPS..."
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
cd /var/www/mokbeats/server

# Criar arquivo .env com configurações de produção
cat > .env << 'ENVFILE'
# Configuração de Ambiente - Produção (VPS)
NODE_ENV=production

# Caminho base para arquivos de áudio
# Na VPS: os áudios estão em ../assets/audios/
AUDIO_BASE_PATH=../
ENVFILE

echo "✓ Arquivo .env criado com sucesso"
cat .env
EOF

if [ $? -eq 0 ]; then
  print_success "Arquivo .env configurado na VPS"
else
  print_error "Erro ao configurar .env"
  exit 1
fi

# Passo 6: Instalar dependências do backend na VPS
print_step "6. Instalando dependências do backend na VPS..."
ssh ${VPS_USER}@${VPS_IP} "cd ${VPS_PATH}/server && npm install"
if [ $? -eq 0 ]; then
  print_success "Dependências instaladas"
else
  print_error "Erro ao instalar dependências"
  exit 1
fi

# Passo 7: Gerar peaks dos áudios
print_step "7. Gerando peaks dos áudios..."
print_info "Este processo pode demorar alguns minutos..."
ssh ${VPS_USER}@${VPS_IP} "cd ${VPS_PATH}/server && node scripts/generate-peaks.js"
if [ $? -eq 0 ]; then
  print_success "Peaks gerados com sucesso"
else
  print_error "Erro ao gerar peaks (verifique se audiowaveform está instalado)"
  exit 1
fi

# Passo 8: Reiniciar PM2
print_step "8. Reiniciando backend com PM2..."
ssh ${VPS_USER}@${VPS_IP} "pm2 restart mok-backend || pm2 start ${VPS_PATH}/server/src/index.js --name mok-backend"
if [ $? -eq 0 ]; then
  print_success "Backend reiniciado com sucesso"
else
  print_error "Erro ao reiniciar PM2"
  exit 1
fi

# Passo 9: Verificar status
print_step "9. Verificando status do deploy..."
echo ""
ssh ${VPS_USER}@${VPS_IP} "pm2 status && pm2 logs mok-backend --lines 10 --nostream"

# Finalização
echo ""
echo -e "${GREEN}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✨ Deploy concluído com sucesso!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

print_info "VPS: http://${VPS_IP}"
print_info "Logs: ssh ${VPS_USER}@${VPS_IP} \"pm2 logs mok-backend\""
print_info "Status: ssh ${VPS_USER}@${VPS_IP} \"pm2 status\""

echo ""
print_warning "Próximos passos:"
echo "  1. Teste o frontend acessando http://${VPS_IP}"
echo "  2. Verifique se os waveforms carregam rapidamente"
echo "  3. Monitore os logs com: pm2 logs mok-backend"
echo ""
