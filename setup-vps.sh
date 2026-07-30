#!/bin/bash

#############################################################################
# Script de Setup da VPS - MokBeats Hostinger
#
# Descrição: Configura a VPS pela primeira vez ou após reset
#            - Instala audiowaveform via PPA
#            - Cria estrutura de diretórios
#            - Configura permissões
#            - Verifica Node.js, npm e PM2
#
# Uso: Execute este script NA VPS via SSH
#      ssh root@31.97.160.61 'bash -s' < setup-vps.sh
#
#      Ou copie para VPS e execute:
#      scp setup-vps.sh root@31.97.160.61:/tmp/
#      ssh root@31.97.160.61
#      chmod +x /tmp/setup-vps.sh
#      /tmp/setup-vps.sh
#
# Autor: MokBeats Team
# Data: 19/10/2025
#############################################################################

set -e  # Para execução em caso de erro

# ============================================================================
# CONFIGURAÇÕES
# ============================================================================

WEB_ROOT="/var/www/html/gulini.com.br/mokbeats"
APACHE_USER="www-data"
# Runtime exigido do backend (lote R1a do Plano P0 v2.2). Este script apenas
# avisa se a VPS estiver desatualizada — o upgrade em si pertence ao lote R1b.
REQUIRED_NODE_MAJOR="24"
REQUIRED_NODE_MIN="24.18.1"

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
    echo -e "${BLUE}  MokBeats VPS - Setup Script${NC}"
    echo -e "${BLUE}  VPS Hostinger - Ubuntu 24.04 LTS${NC}"
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

check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "Este script deve ser executado como root"
        exit 1
    fi
    print_success "Executando como root"
}

check_os() {
    print_info "Verificando sistema operacional..."

    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID

        print_info "OS: ${OS}"
        print_info "Versão: ${VER}"

        if [[ ! $OS =~ "Ubuntu" ]]; then
            print_warning "Este script foi testado no Ubuntu 24.04 LTS"
            print_warning "Você está usando: ${OS} ${VER}"
            read -p "Deseja continuar? (s/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Ss]$ ]]; then
                exit 1
            fi
        fi
    else
        print_warning "Não foi possível detectar o sistema operacional"
    fi

    print_success "Verificação de OS concluída"
    echo ""
}

update_system() {
    print_info "Atualizando repositórios do sistema..."
    echo ""

    if apt update; then
        print_success "Repositórios atualizados"
    else
        print_error "Erro ao atualizar repositórios"
        exit 1
    fi

    echo ""
}

install_dependencies() {
    print_info "Instalando dependências do sistema..."
    echo ""

    # Lista de pacotes necessários
    PACKAGES=(
        "software-properties-common"
        "curl"
        "wget"
        "git"
    )

    for package in "${PACKAGES[@]}"; do
        if dpkg -l | grep -q "^ii  ${package}"; then
            print_success "${package} já instalado"
        else
            print_info "Instalando ${package}..."
            if apt install -y "${package}"; then
                print_success "${package} instalado"
            else
                print_error "Erro ao instalar ${package}"
                exit 1
            fi
        fi
    done

    echo ""
}

install_audiowaveform() {
    print_info "Instalando audiowaveform via PPA..."
    echo ""

    # Verificar se já está instalado
    if command -v audiowaveform &> /dev/null; then
        INSTALLED_VERSION=$(audiowaveform --version 2>&1 | head -n1)
        print_warning "audiowaveform já instalado: ${INSTALLED_VERSION}"
        read -p "Deseja reinstalar? (s/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Ss]$ ]]; then
            print_info "Pulando instalação do audiowaveform"
            echo ""
            return
        fi
    fi

    # Adicionar PPA
    print_info "Adicionando PPA do Chris Needham..."
    if add-apt-repository -y ppa:chris-needham/ppa; then
        print_success "PPA adicionado"
    else
        print_error "Erro ao adicionar PPA"
        exit 1
    fi

    # Atualizar repositórios novamente
    print_info "Atualizando repositórios..."
    apt update

    # Instalar audiowaveform
    print_info "Instalando audiowaveform..."
    if apt install -y audiowaveform; then
        print_success "audiowaveform instalado"
    else
        print_error "Erro ao instalar audiowaveform"
        exit 1
    fi

    # Verificar instalação
    if command -v audiowaveform &> /dev/null; then
        VERSION=$(audiowaveform --version 2>&1 | head -n1)
        print_success "Versão instalada: ${VERSION}"
    else
        print_error "audiowaveform não encontrado após instalação"
        exit 1
    fi

    echo ""
}

check_nodejs() {
    print_info "Verificando Node.js..."

    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js instalado: ${NODE_VERSION}"

        # Extrair versão major
        NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
        NODE_BARE_VERSION="${NODE_VERSION#v}"
        NODE_LOWEST=$(printf '%s\n%s\n' "$NODE_BARE_VERSION" "$REQUIRED_NODE_MIN" | sort -V | head -n1)

        if [ "$NODE_MAJOR" != "$REQUIRED_NODE_MAJOR" ] || [ "$NODE_LOWEST" != "$REQUIRED_NODE_MIN" ]; then
            print_warning "Node.js versão ${NODE_VERSION} diverge do exigido pelo backend (major ${REQUIRED_NODE_MAJOR}, mínimo v${REQUIRED_NODE_MIN})"
            print_info "Upgrade/provisionamento da VPS pertence ao lote R1b — nao instalado automaticamente aqui."
            print_info "Visite: https://nodejs.org/ ou use nvm"
        fi
    else
        print_error "Node.js não instalado"
        print_info "Instale Node.js v${REQUIRED_NODE_MIN}+ (major ${REQUIRED_NODE_MAJOR}) antes de continuar"
        print_info "Visite: https://nodejs.org/ ou use nvm"
        exit 1
    fi

    echo ""
}

check_npm() {
    print_info "Verificando npm..."

    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm instalado: v${NPM_VERSION}"
    else
        print_error "npm não instalado"
        exit 1
    fi

    echo ""
}

check_pm2() {
    print_info "Verificando PM2..."

    if command -v pm2 &> /dev/null; then
        PM2_VERSION=$(pm2 --version)
        print_success "PM2 instalado: v${PM2_VERSION}"
    else
        print_warning "PM2 não instalado"
        read -p "Deseja instalar PM2 globalmente? (S/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            print_info "Instalando PM2..."
            if npm install -g pm2; then
                print_success "PM2 instalado com sucesso"
                PM2_VERSION=$(pm2 --version)
                print_info "Versão: v${PM2_VERSION}"
            else
                print_error "Erro ao instalar PM2"
                exit 1
            fi
        fi
    fi

    echo ""
}

create_directory_structure() {
    print_info "Criando estrutura de diretórios..."
    echo ""

    # Diretórios necessários
    DIRS=(
        "${WEB_ROOT}"
        "${WEB_ROOT}/assets"
        "${WEB_ROOT}/assets/audios"
        "${WEB_ROOT}/server"
        "${WEB_ROOT}/server/data"
        "${WEB_ROOT}/server/scripts"
    )

    for dir in "${DIRS[@]}"; do
        if [ -d "${dir}" ]; then
            print_success "${dir} já existe"
        else
            print_info "Criando ${dir}..."
            if mkdir -p "${dir}"; then
                print_success "${dir} criado"
            else
                print_error "Erro ao criar ${dir}"
                exit 1
            fi
        fi
    done

    echo ""
}

set_permissions() {
    print_info "Configurando permissões..."
    echo ""

    # Proprietário
    print_info "Definindo proprietário: root:root"
    chown -R root:root ${WEB_ROOT}

    # Permissões
    print_info "Definindo permissões: 755 para diretórios, 644 para arquivos"
    find ${WEB_ROOT} -type d -exec chmod 755 {} \;
    find ${WEB_ROOT} -type f -exec chmod 644 {} \;

    # Permissão especial para scripts
    if [ -d "${WEB_ROOT}/server/scripts" ]; then
        print_info "Permissões especiais para scripts: 755"
        find ${WEB_ROOT}/server/scripts -type f -name "*.js" -exec chmod 755 {} \;
    fi

    print_success "Permissões configuradas"
    echo ""
}

check_apache() {
    print_info "Verificando Apache..."

    if command -v apache2 &> /dev/null; then
        print_success "Apache instalado"

        # Verificar se está rodando
        if systemctl is-active --quiet apache2; then
            print_success "Apache está rodando"
        else
            print_warning "Apache não está rodando"
            read -p "Deseja iniciar o Apache? (S/n): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Nn]$ ]]; then
                systemctl start apache2
                print_success "Apache iniciado"
            fi
        fi

        # Verificar configuração
        print_info "Testando configuração do Apache..."
        if apache2ctl configtest 2>&1 | grep -q "Syntax OK"; then
            print_success "Configuração do Apache OK"
        else
            print_warning "Verifique a configuração do Apache"
            print_info "Execute: apache2ctl configtest"
        fi
    else
        print_warning "Apache não instalado"
        print_info "Instale o Apache2 se necessário"
    fi

    echo ""
}

show_summary() {
    echo ""
    print_header
    print_success "Setup da VPS concluído!"
    echo ""

    print_info "Resumo da configuração:"
    echo ""
    echo "  📁 Diretório web: ${WEB_ROOT}"
    echo "  🎵 Áudios: ${WEB_ROOT}/assets/audios/"
    echo "  ⚙️  Backend: ${WEB_ROOT}/server/"
    echo ""

    print_info "Software instalado:"
    if command -v audiowaveform &> /dev/null; then
        echo "  ✅ audiowaveform: $(audiowaveform --version 2>&1 | head -n1)"
    fi
    if command -v node &> /dev/null; then
        echo "  ✅ Node.js: $(node --version)"
    fi
    if command -v npm &> /dev/null; then
        echo "  ✅ npm: v$(npm --version)"
    fi
    if command -v pm2 &> /dev/null; then
        echo "  ✅ PM2: v$(pm2 --version)"
    fi
    echo ""

    print_info "Próximos passos:"
    echo "  1. Faça upload dos arquivos do projeto"
    echo "  2. Instale dependências do backend: cd ${WEB_ROOT}/server && npm install"
    echo "  3. Gere os peaks: node scripts/generate-peaks.js"
    echo "  4. Inicie o backend: pm2 start src/index.js --name mok-backend"
    echo "  5. Configure PM2 startup: pm2 save && pm2 startup"
    echo ""

    print_info "Documentação:"
    echo "  - docs/SCRIPTS_SHELL.md (inventario dos scripts shell)"
    echo "  - deploy-to-vps.sh --help (deploy atual)"
    echo ""
}

# ============================================================================
# MAIN
# ============================================================================

print_header

# Verificações iniciais
check_root
check_os

# Atualizar sistema
update_system

# Instalar dependências
install_dependencies

# Instalar audiowaveform
install_audiowaveform

# Verificar Node.js stack
check_nodejs
check_npm
check_pm2

# Criar estrutura de diretórios
create_directory_structure

# Configurar permissões
set_permissions

# Verificar Apache
check_apache

# Mostrar resumo
show_summary

print_success "✨ Setup concluído com sucesso! ✨"
echo ""

exit 0
