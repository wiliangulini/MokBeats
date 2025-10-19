#!/bin/bash

# Variáveis de versão
NODE_VERSION="16.20.2"
ANGULAR_CLI_VERSION="~14.1.3"

# Processar argumentos da linha de comando
GENERATE_PEAKS=false
for arg in "$@"; do
    case $arg in
        --generate-peaks)
            GENERATE_PEAKS=true
            shift
            ;;
        --help)
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "🎵 MokBeats - Sistema de Gerenciamento de Músicas"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo ""
            echo "Uso: ./start.sh [opções]"
            echo ""
            echo "Opções:"
            echo "  --generate-peaks    Gera peaks reais das músicas usando audiowaveform"
            echo "                      (Requer audiowaveform instalado)"
            echo "  --help              Mostra esta mensagem de ajuda"
            echo ""
            echo "Exemplos:"
            echo "  ./start.sh                    # Inicia normalmente"
            echo "  ./start.sh --generate-peaks   # Gera peaks e depois inicia"
            echo ""
            echo "Sobre o sistema de peaks:"
            echo "  - Peaks são waveforms pré-calculados para carregamento instantâneo"
            echo "  - Sem peaks: Usa fallback (dados hardcoded ou peaks sintéticos)"
            echo "  - Com peaks: 385x mais rápido que processar áudio no frontend"
            echo ""
            echo "Para instalar audiowaveform:"
            echo "  sudo snap install audiowaveform"
            echo ""
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            exit 0
            ;;
        *)
            echo "❌ Opção desconhecida: $arg"
            echo "Use --help para ver as opções disponíveis"
            exit 1
            ;;
    esac
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Iniciando o Sistema MokBeats..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Função para limpar processos em segundo plano ao sair
cleanup() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🛑 Desligando servidores..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Mata os processos do PM2
    pm2 stop mok-backend 2>/dev/null
    pm2 delete mok-backend 2>/dev/null

    # Mata os processos do frontend
    kill $(jobs -p) 2>/dev/null

    echo "✅ Servidores desligados com sucesso"
    echo ""
    exit 0
}

trap cleanup SIGINT SIGTERM

# Função para verificar se audiowaveform está instalado
check_audiowaveform() {
    if command -v audiowaveform &> /dev/null; then
        AUDIOWAVEFORM_VERSION=$(audiowaveform --version 2>&1 | head -1)
        echo "✅ audiowaveform encontrado: $AUDIOWAVEFORM_VERSION"
        echo "   Instalado via: $(which audiowaveform)"
        return 0
    else
        echo "⚠️  audiowaveform NÃO encontrado."
        echo ""
        echo "   Para gerar peaks reais das músicas, instale audiowaveform:"
        echo "   "
        echo "   📦 Via Snap (Recomendado):"
        echo "      sudo snap install audiowaveform"
        echo "   "
        echo "   📦 Via Compilação:"
        echo "      https://github.com/bbc/audiowaveform#building-from-source"
        echo ""
        echo "   ⚡ Benefícios dos peaks reais:"
        echo "      - Precisão visual pixel-perfect"
        echo "      - Carregamento 385x mais rápido"
        echo "      - Economia de 99.7% de banda"
        echo ""
        echo "   O sistema continuará usando fallback (dados hardcoded ou peaks sintéticos)"
        return 1
    fi
}

# Função para verificar se arquivo de músicas com peaks existe
check_musicas_json() {
    if [ -f "server/data/musicas.json" ]; then
        MUSICAS_COUNT=$(grep -o '"id":' server/data/musicas.json 2>/dev/null | wc -l)
        echo "✅ Arquivo musicas.json encontrado com $MUSICAS_COUNT músicas"

        # Verificar se tem peaks preenchidos
        PEAKS_SAMPLE=$(grep -m 1 '"peaks":\s*\[' server/data/musicas.json 2>/dev/null)
        if echo "$PEAKS_SAMPLE" | grep -q '"peaks":\s*\[\s*\]'; then
            echo "   ⚠️  Atenção: As músicas ainda têm peaks vazios"
            echo "   "
            echo "   Para gerar peaks reais, execute:"
            echo "   ./start.sh --generate-peaks"
            echo ""
        else
            # Contar quantos peaks tem no primeiro item
            FIRST_PEAKS_COUNT=$(echo "$PEAKS_SAMPLE" | grep -o "," | wc -l)
            echo "   ✅ Peaks reais detectados no arquivo JSON (~$FIRST_PEAKS_COUNT pontos por música)"
        fi
        return 0
    else
        echo "⚠️  Arquivo server/data/musicas.json NÃO encontrado."
        echo ""
        echo "   O sistema usará dados hardcoded como fallback"
        echo "   "
        echo "   Para criar o arquivo com peaks reais, execute:"
        echo "   ./start.sh --generate-peaks"
        echo ""
        return 1
    fi
}

# Função para gerar peaks das músicas usando audiowaveform
generate_peaks() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎵 Gerando peaks reais das músicas..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    if ! command -v audiowaveform &> /dev/null; then
        echo "❌ ERRO: audiowaveform não está instalado!"
        echo ""
        echo "   Instale primeiro via:"
        echo "   sudo snap install audiowaveform"
        echo ""
        return 1
    fi

    echo "📂 Mudando para diretório do servidor..."
    cd server

    if [ ! -f "scripts/generate-peaks.js" ]; then
        echo "❌ ERRO: Script generate-peaks.js não encontrado!"
        echo "   Esperado em: server/scripts/generate-peaks.js"
        cd ..
        return 1
    fi

    echo "📂 Verificando arquivos de áudio..."
    AUDIO_COUNT=$(find ../src/assets/audios/ -name "*.mp3" -type f 2>/dev/null | wc -l)

    if [ $AUDIO_COUNT -eq 0 ]; then
        echo "⚠️  AVISO: Nenhum arquivo MP3 encontrado em src/assets/audios/"
        echo ""
        echo "   Certifique-se de que os arquivos de áudio estão no local correto:"
        echo "   - Caminho esperado: src/assets/audios/"
        echo "   - Formatos suportados: .mp3"
        echo ""
        echo "   O script continuará mas pode gerar peaks vazios para algumas músicas."
        echo ""
        read -p "   Deseja continuar? (s/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Ss]$ ]]; then
            cd ..
            return 1
        fi
    else
        echo "✅ $AUDIO_COUNT arquivo(s) MP3 encontrado(s) em src/assets/audios/"
    fi

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⚙️  Executando script de geração de peaks..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "   ⏱️  Isso pode levar alguns minutos dependendo do número de músicas..."
    echo "   📊 Progresso será exibido abaixo:"
    echo ""

    node scripts/generate-peaks.js

    GENERATE_EXIT_CODE=$?

    if [ $GENERATE_EXIT_CODE -eq 0 ]; then
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ Peaks gerados com sucesso!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "   📁 Arquivo salvo: server/data/musicas.json"

        # Mostrar tamanho do arquivo gerado
        if [ -f "data/musicas.json" ]; then
            FILE_SIZE=$(du -h data/musicas.json | cut -f1)
            echo "   📊 Tamanho do arquivo: $FILE_SIZE"
        fi

        echo ""
        cd ..
        return 0
    else
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "❌ Erro ao gerar peaks"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "   Verifique os logs acima para mais detalhes."
        echo "   O sistema continuará usando fallback."
        echo ""
        cd ..
        return 1
    fi
}

# 1. Verificar e instalar NVM
echo "🔍 Verificando dependências do sistema..."
echo ""
if [ ! -d "$HOME/.nvm" ]; then
    echo "📦 NVM não encontrado. Instalando NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
else
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    echo "✅ NVM já está instalado."
fi

# 2. Usar a versão correta do Node.js
echo "📦 Instalando/usando Node.js v$NODE_VERSION..."
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

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 5. Instalar dependências do frontend
echo ""
echo "📦 Instalando dependências do frontend..."
npm install

# 6. Instalar dependências do backend
echo ""
echo "📦 Instalando dependências do backend..."
cd server/
npm install
cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Verificando sistema de peaks..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

check_audiowaveform
AUDIOWAVEFORM_INSTALLED=$?

echo ""

check_musicas_json
MUSICAS_JSON_EXISTS=$?

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Gerar peaks se flag foi passada
if [ "$GENERATE_PEAKS" = true ]; then
    if [ $AUDIOWAVEFORM_INSTALLED -eq 0 ]; then
        generate_peaks
        GENERATE_SUCCESS=$?

        if [ $GENERATE_SUCCESS -ne 0 ]; then
            echo ""
            echo "⚠️  Falha ao gerar peaks, mas o sistema continuará com fallback"
            echo ""
            read -p "Deseja continuar iniciando os servidores? (S/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Nn]$ ]]; then
                echo "❌ Inicialização cancelada pelo usuário"
                exit 1
            fi
        fi
    else
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "❌ Não é possível gerar peaks: audiowaveform não está instalado"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "   Instale via: sudo snap install audiowaveform"
        echo ""
        read -p "Continuar sem gerar peaks? (S/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Nn]$ ]]; then
            echo "❌ Inicialização cancelada pelo usuário"
            exit 1
        fi
    fi
fi

# 7. Iniciar o backend com PM2
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🖥️  Iniciando o servidor backend com PM2..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 start server/src/index.js --name mok-backend

# Aguardar um pouco para backend inicializar
sleep 2

# Verificar se backend iniciou corretamente
if pm2 list | grep -q "mok-backend.*online"; then
    echo "✅ Backend iniciado com sucesso"

    # Mostrar últimas linhas do log para verificar se JSON foi carregado
    echo ""
    echo "📋 Logs do backend:"
    pm2 logs mok-backend --lines 5 --nostream
else
    echo "❌ Erro ao iniciar backend. Verificando logs..."
    pm2 logs mok-backend --lines 20 --nostream
    echo ""
    echo "Execute 'pm2 logs mok-backend' para mais detalhes"
fi

# 8. Iniciar o frontend
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚛️  Iniciando o servidor frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm run start &
FRONTEND_PID=$!

# Aguardar alguns segundos para mensagens do Angular aparecerem
sleep 3

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Sistema MokBeats iniciado com sucesso!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Status do Sistema:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   🌐 Backend:  http://localhost:3100"
echo "   🌐 Frontend: http://localhost:4200"
echo ""

if [ $MUSICAS_JSON_EXISTS -eq 0 ]; then
    echo "   📊 Sistema de Peaks: ✅ Usando JSON com peaks"
else
    echo "   📊 Sistema de Peaks: ⚠️  Usando fallback hardcoded"
fi

if [ $AUDIOWAVEFORM_INSTALLED -eq 0 ]; then
    echo "   🔧 Audiowaveform: ✅ Instalado e disponível"
else
    echo "   🔧 Audiowaveform: ⚠️  Não instalado"
fi

echo ""
echo "💡 Dicas úteis:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $MUSICAS_JSON_EXISTS -ne 0 ] || [ $AUDIOWAVEFORM_INSTALLED -ne 0 ]; then
    if [ $AUDIOWAVEFORM_INSTALLED -ne 0 ]; then
        echo "   📥 Instalar audiowaveform: sudo snap install audiowaveform"
    fi
    if [ $MUSICAS_JSON_EXISTS -ne 0 ] && [ $AUDIOWAVEFORM_INSTALLED -eq 0 ]; then
        echo "   🎵 Gerar peaks reais: ./start.sh --generate-peaks"
    fi
fi

echo "   📋 Ver logs do backend: pm2 logs mok-backend"
echo "   🔄 Reiniciar backend: pm2 restart mok-backend"
echo "   🛑 Parar servidores: Pressione Ctrl+C"
echo "   ❓ Ajuda: ./start.sh --help"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⌛ Aguardando... (Pressione Ctrl+C para parar)"
echo ""

wait
