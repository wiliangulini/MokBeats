#!/bin/bash

#############################################################################
# Script de Build e Upload - MokBeats VPS Hostinger
#
# Descrição: Automatiza o processo de build do Angular e upload para VPS
# Uso: ./build-and-upload.sh [opcoes]
#
# Opções:
#   --frontend-only     Upload apenas do frontend (dist/)
#   --backend-only      Upload apenas do backend (server/)
#   --no-build          Pula o build, apenas upload
#   --dry-run           Simula upload sem executar (rsync --dry-run)
#
# Autor: MokBeats Team
# Data: 19/10/2025
#############################################################################

set -e  # Para execução em caso de erro

# ============================================================================
# CONFIGURAÇÕES
# ============================================================================

VPS_HOST="147.79.87.156"
VPS_USER="root"
VPS_PATH="/var/www/mokbeats"
LOCAL_PROJECT_PATH="/home/hustler/Documentos/projetos/MokBeats"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# FUNÇÕES
# ============================================================================

print_header() {
    echo -e "${BLUE}============================================================${NC}"
    echo -e "${BLUE}  MokBeats - Build and Deploy Script${NC}"
    echo -e "${BLUE}============================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_prerequisites() {
    print_info "Verificando pré-requisitos..."

    # Verificar se está no diretório correto
    if [ ! -f "package.json" ]; then
        print_error "Erro: package.json não encontrado. Execute este script na raiz do projeto."
        exit 1
    fi

    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js não encontrado. Instale Node.js primeiro."
        exit 1
    fi

    # Verificar npm
    if ! command -v npm &> /dev/null; then
        print_error "npm não encontrado. Instale npm primeiro."
        exit 1
    fi

    # Verificar rsync
    if ! command -v rsync &> /dev/null; then
        print_error "rsync não encontrado. Instale com: sudo apt install rsync"
        exit 1
    fi

    # Verificar conectividade SSH
    print_info "Testando conectividade com VPS..."
    print_warning "A senha SSH será solicitada durante o upload"
    print_info "VPS: ${VPS_USER}@${VPS_HOST}"
    print_info "Senha será solicitada interativamente pelo rsync/ssh"

    print_success "Pré-requisitos verificados"
    echo ""
}

build_frontend() {
    print_info "Iniciando build do frontend..."
    echo ""

    # Limpar build anterior
    if [ -d "dist" ]; then
        print_info "Removendo build anterior..."
        rm -rf dist/
    fi

    # Executar build
    print_info "Executando: npm run build"
    if npm run build; then
        print_success "Build do frontend concluído!"
        echo ""

        # Verificar se dist/ foi criado
        if [ ! -d "dist" ]; then
            print_error "Erro: pasta dist/ não foi criada após o build"
            exit 1
        fi

        # Mostrar tamanho do build
        DIST_SIZE=$(du -sh dist/ | cut -f1)
        print_info "Tamanho do build: ${DIST_SIZE}"
        echo ""
    else
        print_error "Erro durante o build do frontend"
        exit 1
    fi
}

upload_frontend() {
    print_info "Fazendo upload do frontend para VPS..."
    echo ""

    if [ ! -d "dist" ]; then
        print_error "Pasta dist/ não encontrada. Execute o build primeiro."
        exit 1
    fi

    RSYNC_OPTS="-avz --delete"

    if [ "$DRY_RUN" = true ]; then
        RSYNC_OPTS="${RSYNC_OPTS} --dry-run"
        print_warning "Modo DRY-RUN ativado - nenhuma alteração será feita"
    fi

    print_info "Comando: rsync ${RSYNC_OPTS} dist/* ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/"
    print_warning "Nota: Será solicitada a senha SSH da VPS"
    echo ""

    if rsync ${RSYNC_OPTS} dist/* ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/; then
        print_success "Upload do frontend concluído!"
        echo ""
    else
        print_error "Erro durante upload do frontend"
        exit 1
    fi
}

upload_backend() {
    print_info "Fazendo upload do backend para VPS..."
    echo ""

    if [ ! -d "server" ]; then
        print_error "Pasta server/ não encontrada."
        exit 1
    fi

    RSYNC_OPTS="-avz --delete --exclude=node_modules"

    if [ "$DRY_RUN" = true ]; then
        RSYNC_OPTS="${RSYNC_OPTS} --dry-run"
        print_warning "Modo DRY-RUN ativado - nenhuma alteração será feita"
    fi

    print_info "Comando: rsync ${RSYNC_OPTS} server/ ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/server/"
    print_warning "Excluindo node_modules (será reinstalado na VPS)"
    print_warning "Nota: Será solicitada a senha SSH da VPS"
    echo ""

    if rsync ${RSYNC_OPTS} server/ ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/server/; then
        print_success "Upload do backend concluído!"
        echo ""
    else
        print_error "Erro durante upload do backend"
        exit 1
    fi
}

restart_backend() {
    if [ "$DRY_RUN" = true ]; then
        print_info "DRY-RUN: Pulando restart do backend"
        return
    fi

    print_info "Instalando dependências e reiniciando backend na VPS..."
    echo ""

    ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
        cd /var/www/mokbeats/server

        echo "📦 Instalando dependências do backend..."
        npm install

        echo "🔄 Reiniciando PM2..."
        pm2 restart mok-backend || pm2 start src/index.js --name mok-backend

        echo "💾 Salvando configuração PM2..."
        pm2 save

        echo ""
        echo "📊 Status do PM2:"
        pm2 status

        echo ""
        echo "📝 Últimas linhas do log:"
        pm2 logs mok-backend --lines 10 --nostream
ENDSSH

    if [ $? -eq 0 ]; then
        print_success "Backend reiniciado com sucesso!"
        echo ""
    else
        print_error "Erro ao reiniciar backend"
        exit 1
    fi
}

show_summary() {
    echo ""
    print_header
    print_success "Deploy concluído com sucesso!"
    echo ""
    print_info "Próximos passos:"
    echo "  1. Acesse http://${VPS_HOST} no navegador"
    echo "  2. Teste o player de música"
    echo "  3. Verifique se waveforms carregam rapidamente"
    echo ""
    print_info "Comandos úteis:"
    echo "  ssh ${VPS_USER}@${VPS_HOST}                    # Conectar à VPS"
    echo "  ssh ${VPS_USER}@${VPS_HOST} \"pm2 logs mok-backend\"   # Ver logs"
    echo "  ssh ${VPS_USER}@${VPS_HOST} \"pm2 status\"             # Ver status"
    echo ""
}

show_help() {
    cat << EOF
Uso: ./build-and-upload.sh [opções]

Opções:
  --frontend-only     Upload apenas do frontend (dist/)
  --backend-only      Upload apenas do backend (server/)
  --no-build          Pula o build, apenas upload
  --dry-run           Simula upload sem executar (rsync --dry-run)
  --help              Mostra esta ajuda

Exemplos:
  ./build-and-upload.sh                    # Build completo + upload de tudo
  ./build-and-upload.sh --frontend-only    # Apenas frontend
  ./build-and-upload.sh --backend-only     # Apenas backend
  ./build-and-upload.sh --dry-run          # Simular sem executar
  ./build-and-upload.sh --no-build         # Apenas upload (sem build)

EOF
    exit 0
}

# ============================================================================
# MAIN
# ============================================================================

# Variáveis de controle
FRONTEND_ONLY=false
BACKEND_ONLY=false
NO_BUILD=false
DRY_RUN=false

# Parse argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        --frontend-only)
            FRONTEND_ONLY=true
            shift
            ;;
        --backend-only)
            BACKEND_ONLY=true
            shift
            ;;
        --no-build)
            NO_BUILD=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help)
            show_help
            ;;
        *)
            print_error "Opção desconhecida: $1"
            echo "Use --help para ver opções disponíveis"
            exit 1
            ;;
    esac
done

# Início do script
print_header

# Verificar pré-requisitos
check_prerequisites

# Build (se necessário)
if [ "$NO_BUILD" = false ] && [ "$BACKEND_ONLY" = false ]; then
    build_frontend
fi

# Upload Frontend
if [ "$BACKEND_ONLY" = false ]; then
    upload_frontend
fi

# Upload Backend
if [ "$FRONTEND_ONLY" = false ]; then
    upload_backend
    restart_backend
fi

# Resumo final
show_summary

exit 0
