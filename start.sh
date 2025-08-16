#!/bin/bash

# Variáveis de versão
NODE_VERSION="16.20.2"
ANGULAR_CLI_VERSION="~14.1.3"

echo "🚀 Iniciando o Sistema Mokbeats..."

# Função para limpar processos em segundo plano ao sair
cleanup() {
    echo -e "\n🛑 Desligando servidores..."
    # Mata os processos do PM2
    pm2 stop mok-backend 2>/dev/null
    pm2 delete mok-backend 2>/dev/null
    # Mata os processos do frontend
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# 1. Verificar e instalar NVM
if [ ! -d "$HOME/.nvm" ]; then
    echo "📦 NVM não encontrado. Instalando NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
else
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    echo "✅ NVM já está instalado."
fi

# 2. Usar a versão correta do Node.js
nvm install $NODE_VERSION
nvm use $NODE_VERSION

# 3. Verificar e instalar PM2
if ! command -v pm2 &> /dev/null
then
    echo "📦 PM2 não encontrado. Instalando PM2 globalmente..."
    npm install -g pm2
else
    echo "✅ PM2 já está instalado."
fi

# Remove o '~' ou '^' para a comparação
CLEAN_VERSION=$(echo "$ANGULAR_CLI_VERSION" | sed 's/[~^]//g')

echo "ℹ️  Versão do Angular CLI desejada: $CLEAN_VERSION"

# 4. Verificar e instalar Angular CLI
if ! command -v ng &> /dev/null; then
    echo "❌ Angular CLI não encontrado. Instalando a versão $CLEAN_VERSION globalmente..."
    npm install -g @angular/cli@$CLEAN_VERSION
else
    # Extrai a versão instalada de forma mais segura
    INSTALLED_VERSION=$(ng version | grep 'Angular CLI:' | awk -F': ' '{print $2}')

    echo "✅ Angular CLI encontrado. Versão instalada: $INSTALLED_VERSION"

    if [[ "$INSTALLED_VERSION" != "$CLEAN_VERSION" ]]; then
        echo "⚠️  A versão instalada ($INSTALLED_VERSION) é diferente da desejada ($CLEAN_VERSION). Reinstalando..."
        npm install -g @angular/cli@$CLEAN_VERSION
    else
        echo "✅ Angular CLI já está instalado e na versão correta."
    fi
fi

# 5. Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
npm install

# 6. Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd server/
npm install
cd ..

# 7. Iniciar o backend com PM2
echo "🖥️  Iniciando o servidor backend com PM2..."
pm2 start server/src/index.js --name mok-backend

# 8. Iniciar o frontend
echo "⚛️  Iniciando o servidor frontend..."
npm run start &
FRONTEND_PID=$!

echo "✅ Ambos os servidores estão iniciando..."
echo "Pressione Ctrl+C para parar os dois servidores"

wait


