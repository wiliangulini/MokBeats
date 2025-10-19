#!/bin/bash

################################################################################
# Quick Fix VPS - Correção Imediata do Problema de Peaks
#
# Este script corrige o problema atual na VPS:
# - Cria arquivo .env com NODE_ENV=production
# - Verifica presença dos arquivos de áudio
# - Re-executa generate-peaks.js
# - Reinicia PM2
#
# Uso: ./quick-fix-vps.sh
################################################################################

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configurações da VPS
VPS_IP="147.79.87.156"
VPS_USER="root"
VPS_PATH="/var/www/mokbeats"

# Banner
echo -e "${CYAN}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔧 Quick Fix VPS - Correção de Peaks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

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
  echo -e "${CYAN}[INFO]${NC} $1"
}

# Função para detectar Node.js e PM2 na VPS
detect_node_and_pm2() {
  print_step "Verificando instalação do Node.js e PM2..."

  # Detectar Node.js usando shell de login (com suporte a NVM)
  NODE_VERSION=$(ssh ${VPS_USER}@${VPS_IP} "bash -l -c 'source ~/.nvm/nvm.sh 2>/dev/null && node --version 2>/dev/null'" || echo "")
  NODE_PATH=$(ssh ${VPS_USER}@${VPS_IP} "bash -l -c 'source ~/.nvm/nvm.sh 2>/dev/null && which node 2>/dev/null'" || echo "")

  if [ -z "$NODE_VERSION" ]; then
    print_error "Node.js não encontrado na VPS!"
    print_warning "Você precisa instalar o Node.js primeiro:"
    echo ""
    echo "  ssh ${VPS_USER}@${VPS_IP}"
    echo "  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    echo ""
    return 1
  fi

  print_success "Node.js encontrado: $NODE_VERSION"
  print_info "Caminho do Node.js: $NODE_PATH"

  # Detectar PM2 (com suporte a NVM)
  PM2_VERSION=$(ssh ${VPS_USER}@${VPS_IP} "bash -l -c 'source ~/.nvm/nvm.sh 2>/dev/null && pm2 --version 2>/dev/null'" || echo "")

  if [ -z "$PM2_VERSION" ]; then
    print_warning "PM2 não encontrado, mas será instalado se necessário"
  else
    print_success "PM2 encontrado: v$PM2_VERSION"
  fi

  echo ""
  return 0
}

# Passo 1: Verificar conexão com VPS
print_step "1. Testando conexão com VPS..."
if ssh -o ConnectTimeout=5 ${VPS_USER}@${VPS_IP} "echo 'Conexão OK'" > /dev/null 2>&1; then
  print_success "Conexão estabelecida com ${VPS_IP}"
else
  print_error "Não foi possível conectar à VPS"
  exit 1
fi

# Passo 2: Verificar estrutura de diretórios
print_step "2. Verificando estrutura de diretórios na VPS..."
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
echo "Estrutura de diretórios:"
echo "  /var/www/mokbeats/:"
ls -1 /var/www/mokbeats/ | head -10

if [ -d "/var/www/mokbeats/assets/audios" ]; then
  echo "  ✓ /var/www/mokbeats/assets/audios/ existe"
  audio_count=$(find /var/www/mokbeats/assets/audios -name "*.mp3" 2>/dev/null | wc -l)
  echo "  ✓ Arquivos MP3 encontrados: $audio_count"
else
  echo "  ✗ /var/www/mokbeats/assets/audios/ NÃO EXISTE"
fi

if [ -d "/var/www/mokbeats/server" ]; then
  echo "  ✓ /var/www/mokbeats/server/ existe"
else
  echo "  ✗ /var/www/mokbeats/server/ NÃO EXISTE"
fi
EOF

# Passo 3: Verificar se áudios estão presentes
print_step "3. Verificando arquivos de áudio..."
audio_check=$(ssh ${VPS_USER}@${VPS_IP} "find /var/www/mokbeats/assets/audios -name '*.mp3' 2>/dev/null | wc -l" || echo "0")

if [ "$audio_check" -eq "0" ]; then
  print_error "Nenhum arquivo de áudio encontrado na VPS!"
  print_warning "Você precisa enviar os arquivos de áudio primeiro:"
  echo ""
  echo "  cd /home/hustler/Documentos/projetos/MokBeats"
  echo "  rsync -avz src/assets/audios/ ${VPS_USER}@${VPS_IP}:/var/www/mokbeats/assets/audios/"
  echo ""
  read -p "Deseja enviar os arquivos de áudio agora? (s/N): " upload_now

  if [[ $upload_now =~ ^[Ss]$ ]]; then
    print_step "Enviando arquivos de áudio..."
    cd /home/hustler/Documentos/projetos/MokBeats
    rsync -avz src/assets/audios/ ${VPS_USER}@${VPS_IP}:/var/www/mokbeats/assets/audios/
    print_success "Arquivos de áudio enviados"
  else
    print_error "Não é possível continuar sem os arquivos de áudio"
    exit 1
  fi
else
  print_success "Encontrados $audio_check arquivos MP3 na VPS"
fi

# Passo 4: Criar arquivo .env na VPS
print_step "4. Criando arquivo .env na VPS..."
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
cd /var/www/mokbeats/server

# Fazer backup do .env antigo se existir
if [ -f ".env" ]; then
  cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
  echo "  ℹ️  Backup do .env antigo criado"
fi

# Criar novo .env
cat > .env << 'ENVFILE'
# Configuração de Ambiente - Produção (VPS)
NODE_ENV=production

# Caminho base para arquivos de áudio
# Na VPS: os áudios estão em ../assets/audios/
AUDIO_BASE_PATH=../
ENVFILE

echo "  ✓ Arquivo .env criado com sucesso"
echo ""
echo "Conteúdo do .env:"
cat .env
EOF

if [ $? -eq 0 ]; then
  print_success "Arquivo .env configurado"
else
  print_error "Erro ao criar .env"
  exit 1
fi

# Passo 5: Verificar Node.js e PM2
echo ""
if ! detect_node_and_pm2; then
  print_error "Não é possível continuar sem Node.js instalado"
  exit 1
fi

# Passo 6: Executar generate-peaks.js
print_step "6. Gerando peaks dos áudios..."
print_info "Este processo pode demorar alguns minutos..."
echo ""

ssh ${VPS_USER}@${VPS_IP} "bash -l -c 'source ~/.nvm/nvm.sh && cd /var/www/mokbeats/server && node scripts/generate-peaks.js'"

if [ $? -eq 0 ]; then
  print_success "Peaks gerados com sucesso"
else
  print_error "Erro ao gerar peaks"
  print_warning "Verifique os logs acima para mais detalhes"
  exit 1
fi

# Passo 7: Verificar musicas.json
print_step "7. Verificando musicas.json..."
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
cd /var/www/mokbeats/server

# Verificar se arquivo existe
if [ ! -f "data/musicas.json" ]; then
  echo "  ✗ Arquivo musicas.json não encontrado"
  exit 1
fi

# Verificar tamanho
file_size=$(stat -f%z "data/musicas.json" 2>/dev/null || stat -c%s "data/musicas.json" 2>/dev/null)
echo "  ✓ Tamanho do musicas.json: $(echo "scale=2; $file_size/1024" | bc) KB"

# Verificar se tem peaks preenchidos
peaks_count=$(grep -o '"peaks":\[' data/musicas.json | wc -l)
echo "  ✓ Músicas com campo peaks: $peaks_count"

# Verificar se peaks não estão vazios
non_empty_peaks=$(grep -o '"peaks":\[[0-9]' data/musicas.json | wc -l)
echo "  ✓ Músicas com peaks preenchidos: $non_empty_peaks"
EOF

if [ $? -eq 0 ]; then
  print_success "musicas.json verificado"
else
  print_warning "Problemas ao verificar musicas.json"
fi

# Passo 8: Reiniciar PM2
print_step "8. Reiniciando backend com PM2..."
ssh ${VPS_USER}@${VPS_IP} "bash -l -c 'source ~/.nvm/nvm.sh && pm2 restart mok-backend || pm2 start /var/www/mokbeats/server/src/index.js --name mok-backend'"

if [ $? -eq 0 ]; then
  print_success "Backend reiniciado"
else
  print_error "Erro ao reiniciar PM2"
  exit 1
fi

# Passo 9: Verificar status final
print_step "9. Verificando status do backend..."
echo ""
ssh ${VPS_USER}@${VPS_IP} "bash -l -c 'source ~/.nvm/nvm.sh && pm2 status && echo && echo \"Últimas linhas do log:\" && pm2 logs mok-backend --lines 15 --nostream'"

# Finalização
echo ""
echo -e "${GREEN}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✨ Correção concluída com sucesso!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

print_success "Problema corrigido!"
print_info "Próximos passos:"
echo "  1. Teste o frontend: http://${VPS_IP}"
echo "  2. Verifique se os waveforms carregam rapidamente"
echo "  3. Monitore os logs: ssh ${VPS_USER}@${VPS_IP} 'pm2 logs mok-backend'"
echo ""
