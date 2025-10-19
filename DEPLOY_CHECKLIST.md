# ✅ Checklist de Deploy - MokBeats VPS

## 📋 Validação do Projeto Local

### Frontend (Angular)

- [x] **package.json configurado corretamente**
  - Script build: `"build": "ng build --configuration=production --base-href /"`
  - Comando: `npm run build`

- [x] **angular.json configurado**
  - Output path: `dist/`
  - Configuração de produção ativa

- [ ] **Dependências instaladas**

  ```bash
  cd /home/hustler/Documentos/projetos/MokBeats
  npm install
  ```

- [ ] **Build executado com sucesso**

  ```bash
  npm run build
  # Verificar pasta dist/ criada
  ls -la dist/
  ```

### Backend (Node.js)

- [x] **Estrutura do servidor correta**
  - `server/src/index.js` - Servidor principal (porta 3100)
  - `server/package.json` - Dependências
  - `server/scripts/generate-peaks.js` - Geração de peaks
  - `server/data/` - Diretório para musicas.json

- [x] **Scripts de geração de peaks funcionais**
  - `generate-peaks.js` - Gera peaks reais
  - `process-audio.js` - Processa áudio com audiowaveform
  - `extract-musicas.js` - Extrai dados do index.js

- [x] **Dependências do backend definidas**
  - express
  - cors
  - body-parser
  - connect-multiparty

### Arquivos de Áudio

- [x] **Áudios presentes em**: `/home/hustler/Documentos/projetos/MokBeats/src/assets/audios/`
  - MokBeats_Future_Forest_(FULL).mp3 ✅
  - MokBeats_Future_Forest_(DRUMS).mp3 ✅
  - MokBeats_Future_Forest_(EFEITOS).mp3 ✅
  - MokBeats_Future_Forest_(HARMONIAS).mp3 ✅
  - MokBeats_Future_Forest_(MELODIAS).mp3 ✅
  - Tipo_Minato.mp3 ✅
  - Vibe_Shisui.mp3 ✅
  - Vibe_Shisui2.mp3 ✅

---

## 🌐 Preparação da VPS

### Informações da VPS

- **IP**: 147.79.87.156
- **SO**: Ubuntu 24.04 LTS
- **Usuário**: root
- **SSH**: `ssh root@147.79.87.156`
- **Diretório Web**: `/var/www/mokbeats`

### Instalação de Dependências na VPS

- [ ] **Conectar à VPS**

  ```bash
  ssh root@147.79.87.156
  ```

- [ ] **Instalar audiowaveform via PPA** (MÉTODO CORRETO)

  ```bash
  sudo apt update
  sudo apt install -y software-properties-common
  sudo add-apt-repository -y ppa:chris-needham/ppa
  sudo apt update
  sudo apt install -y audiowaveform
  audiowaveform --version
  ```

  **Saída esperada**: `Audio Waveform Image Generator v1.x.x`

- [ ] **Verificar Node.js**

  ```bash
  node --version  # Mínimo v14+
  npm --version
  ```

- [ ] **Verificar/Instalar PM2**

  ```bash
  pm2 --version
  # Se não instalado:
  npm install -g pm2
  ```

- [ ] **Criar estrutura de diretórios**

  ```bash
  sudo mkdir -p /var/www/mokbeats/assets/audios
  sudo mkdir -p /var/www/mokbeats/server
  sudo chown -R root:root /var/www/mokbeats
  sudo chmod -R 755 /var/www/mokbeats
  ```

---

## 📤 Upload dos Arquivos

### Upload do Frontend

- [ ] **Build local executado** (`npm run build`)

- [ ] **Upload via rsync**

  ```bash
  cd /home/hustler/Documentos/projetos/MokBeats
  rsync -avz --delete dist/ root@147.79.87.156:/var/www/mokbeats/
  ```

- [ ] **Verificar na VPS**

  ```bash
  ssh root@147.79.87.156 "ls -la /var/www/mokbeats/index.html"
  ```

### Upload do Backend

- [ ] **Upload via rsync (sem node_modules)**

  ```bash
  cd /home/hustler/Documentos/projetos/MokBeats
  rsync -avz --delete server/ root@147.79.87.156:/var/www/mokbeats/server/
  ```

- [ ] **Verificar na VPS**

  ```bash
  ssh root@147.79.87.156 "ls -la /var/www/mokbeats/server/src/index.js"
  ```

### Upload dos Áudios (se necessário)

- [ ] **Verificar se áudios já estão na VPS**

  ```bash
  ssh root@147.79.87.156 "ls -lah /var/www/mokbeats/assets/audios/"
  ```

- [ ] **Upload dos áudios (se não estiverem)**

  ```bash
  rsync -avz src/assets/audios/ root@147.79.87.156:/var/www/mokbeats/assets/audios/
  ```

---

## ⚙️ Configuração do Backend na VPS

**Executar todos os comandos via SSH na VPS:**

- [ ] **Instalar dependências do backend**

  ```bash
  cd /var/www/mokbeats/server
  npm install
  ```

- [ ] **Configurar variáveis de ambiente (.env)**

  ```bash
  cd /var/www/mokbeats/server

  # Criar arquivo .env
  cat > .env << 'EOF'
  NODE_ENV=production
  AUDIO_BASE_PATH=../../
  EOF

  # Verificar
  cat .env
  ```

  **⚠️ IMPORTANTE:** Este passo é obrigatório! Sem o `.env`, a geração de peaks falhará.

- [ ] **Gerar peaks reais dos áudios**

  ```bash
  cd /var/www/mokbeats/server
  node scripts/generate-peaks.js
  ```

  **Saída esperada**:

  ```
  🎵 Iniciando processamento de músicas...

  🔧 Ambiente: production
  📁 Base path para áudios: /var/www/mokbeats

  ✅ 24 músicas carregadas do JSON

  [1/24] Processando: HighFrenetic
    ✅ 3870 peaks gerados com sucesso
  ...
  ✅ Processo concluído!
  ```

- [ ] **Verificar arquivo musicas.json criado**

  ```bash
  ls -la /var/www/mokbeats/server/data/musicas.json
  cat /var/www/mokbeats/server/data/musicas.json | grep -c '"peaks"'
  ```

---

## 🚀 Iniciar Backend com PM2

- [ ] **Parar processos antigos (se existirem)**

  ```bash
  pm2 stop all
  pm2 delete all
  ```

- [ ] **Iniciar novo backend**

  ```bash
  cd /var/www/mokbeats/server
  pm2 start src/index.js --name mok-backend
  ```

- [ ] **Verificar se iniciou corretamente**

  ```bash
  pm2 status
  ```

  **Esperado**:

  ```
  ┌─────┬──────────────┬─────────┬─────────┬──────────┐
  │ id  │ name         │ status  │ restart │ uptime   │
  ├─────┼──────────────┼─────────┼─────────┼──────────┤
  │ 0   │ mok-backend  │ online  │ 0       │ 5s       │
  └─────┴──────────────┴─────────┴─────────┴──────────┘
  ```

- [ ] **Verificar logs**

  ```bash
  pm2 logs mok-backend --lines 20
  ```

  **Deve aparecer**:

  ```
  ✅ 24 músicas carregadas do JSON com peaks reais
  Servidor Iniciado!
  ```

- [ ] **Salvar configuração do PM2**

  ```bash
  pm2 save
  ```

- [ ] **Configurar PM2 startup (iniciar no boot)**

  ```bash
  pm2 startup
  # Executar o comando que o PM2 sugerir
  ```

---

## ✅ Testes e Validação

### Testes do Backend (API)

- [ ] **Testar endpoint de músicas**

  ```bash
  curl http://localhost:3100/api/musicas | head -100
  ```

  **Esperado**: JSON com array de músicas e campo `peaks` preenchido

- [ ] **Testar endpoint de artistas**

  ```bash
  curl http://localhost:3100/api/artistas
  ```

- [ ] **Testar endpoint de gêneros**

  ```bash
  curl http://localhost:3100/api/generos
  ```

### Testes do Apache

- [ ] **Verificar configuração do Apache**

  ```bash
  sudo apache2ctl configtest
  ```

  **Esperado**: `Syntax OK`

- [ ] **Verificar se Apache está rodando**

  ```bash
  sudo systemctl status apache2
  ```

- [ ] **Reiniciar Apache (se necessário)**

  ```bash
  sudo systemctl restart apache2
  ```

### Testes do Frontend (Navegador)

- [ ] **Acessar site**: `http://147.79.87.156`

- [ ] **Verificar se página carrega**

- [ ] **Testar login** (credenciais de teste)
  - Email: `test@mokbeats.com`
  - Senha: `test12345`

- [ ] **Testar player de música**
  - Selecionar uma música
  - Verificar se toca
  - Verificar se waveform aparece

- [ ] **Verificar carregamento rápido do waveform**
  - Waveform deve aparecer instantaneamente (peaks pré-calculados)
  - **NÃO** deve demorar para processar

- [ ] **Testar filtros de músicas**

- [ ] **Testar playlists**

- [ ] **Testar favoritos**

---

## 🔍 Monitoramento Pós-Deploy

### Logs

- [ ] **Monitorar logs do PM2**

  ```bash
  pm2 logs mok-backend
  ```

- [ ] **Logs do Apache - Erros**

  ```bash
  sudo tail -f /var/log/apache2/error.log
  ```

- [ ] **Logs do Apache - Acesso**

  ```bash
  sudo tail -f /var/log/apache2/access.log
  ```

### Performance

- [ ] **Verificar uso de memória do PM2**

  ```bash
  pm2 monit
  ```

- [ ] **Verificar se backend não está reiniciando**

  ```bash
  pm2 status
  # Coluna "restart" deve estar em 0
  ```

---

## 🛠️ Scripts Automatizados Criados

### 1. build-and-upload.sh (Local)

**Uso básico**:

```bash
# Deploy completo (build + upload frontend e backend)
./build-and-upload.sh

# Apenas frontend
./build-and-upload.sh --frontend-only

# Apenas backend
./build-and-upload.sh --backend-only

# Simular (não executa, apenas mostra o que seria feito)
./build-and-upload.sh --dry-run
```

**Checklist do script**:

- [x] Script criado em: `/home/hustler/Documentos/projetos/MokBeats/build-and-upload.sh`
- [x] Permissão de execução configurada: `chmod +x build-and-upload.sh`
- [ ] Testado localmente

### 2. setup-vps.sh (VPS)

**Uso na VPS**:

```bash
# Enviar para VPS e executar:
scp setup-vps.sh root@147.79.87.156:/tmp/
ssh root@147.79.87.156
chmod +x /tmp/setup-vps.sh
/tmp/setup-vps.sh
```

**Ou executar remotamente**:

```bash
ssh root@147.79.87.156 'bash -s' < setup-vps.sh
```

**Checklist do script**:

- [x] Script criado em: `/home/hustler/Documentos/projetos/MokBeats/setup-vps.sh`
- [x] Permissão de execução configurada: `chmod +x setup-vps.sh`
- [ ] Executado na VPS

---

## 📚 Documentação Criada/Atualizada

- [x] **BUILD_AND_DEPLOY.md** - Guia completo passo-a-passo
- [x] **server/DEPLOY_VPS.md** - Instruções específicas do servidor (CORRIGIDO)
- [x] **DEPLOY_CHECKLIST.md** - Este checklist
- [x] **build-and-upload.sh** - Script de automação local
- [x] **setup-vps.sh** - Script de setup da VPS
- [x] **server/README.md** - Documentação do backend (existente)
- [x] **CHANGELOG_PEAKS.md** - Histórico de mudanças (existente)
- [x] **RESUMO_IMPLEMENTACAO.md** - Resumo das implementações (existente)
- [x] **CONFIG_APACHE_CORRETA.md** - Configuração Apache (existente)

---

## 🆘 Troubleshooting Rápido

### Problema: Frontend não carrega

**Verificar**:

```bash
ssh root@147.79.87.156 "ls -la /var/www/mokbeats/index.html"
ssh root@147.79.87.156 "sudo chmod -R 755 /var/www/mokbeats"
```

### Problema: Backend não inicia

**Verificar logs**:

```bash
ssh root@147.79.87.156 "pm2 logs mok-backend --err --lines 50"
```

### Problema: Peaks não carregam

**Regenerar peaks**:

```bash
ssh root@147.79.87.156 "cd /var/www/mokbeats/server && node scripts/generate-peaks.js"
ssh root@147.79.87.156 "pm2 restart mok-backend"
```

### Problema: Áudios não tocam

**Verificar arquivos**:

```bash
ssh root@147.79.87.156 "ls -lah /var/www/mokbeats/assets/audios/"
ssh root@147.79.87.156 "sudo chmod 644 /var/www/mokbeats/assets/audios/*.mp3"
```

### Problema: audiowaveform não encontrado

**Reinstalar via PPA**:

```bash
ssh root@147.79.87.156 << 'EOF'
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:chris-needham/ppa
sudo apt update
sudo apt install -y audiowaveform
audiowaveform --version
EOF
```

---

## ✨ Deploy Finalizado - Validação Final

Após completar todos os itens acima, seu deploy está completo quando:

- ✅ Site acessível em `http://147.79.87.156`
- ✅ Backend rodando: `pm2 status` mostra `mok-backend` online
- ✅ Logs sem erros: `pm2 logs mok-backend`
- ✅ API respondendo: `curl http://localhost:3100/api/musicas`
- ✅ Waveforms carregando instantaneamente (peaks reais)
- ✅ Player funcionando corretamente
- ✅ Apache configurado e rodando

---

**Data de criação**: 19 de outubro de 2025
**Versão**: 1.0.0
**Projeto**: MokBeats - Plataforma de Músicas para Produtores
