# 🚀 Guia Completo de Build e Deploy - MokBeats VPS Hostinger

## 📋 Informações da VPS

- **Servidor**: VPS Hostinger
- **IP**: 147.79.87.156
- **OS**: Ubuntu 24.04 LTS
- **Usuário SSH**: root
- **Acesso**: `ssh root@147.79.87.156`
- **Diretório web**: `/var/www/mokbeats`
- **Backend gerenciado por**: PM2

---

## 🎯 Objetivo

Fazer build do projeto Angular localmente e fazer deploy completo na VPS, incluindo:

- Frontend Angular (dist/) → `/var/www/mokbeats/`
- Backend Node.js (server/) → `/var/www/mokbeats/server/`
- Gerar peaks reais dos áudios na VPS
- Configurar PM2 para rodar o backend

---

## 📦 PARTE 1: Build Local do Projeto Angular

### Passo 1.1: Preparar Ambiente Local

```bash
# No diretório do projeto MokBeats
cd /home/hustler/Documentos/projetos/MokBeats

# Garantir que dependências estão instaladas
npm install

# Verificar se está tudo ok
npm list --depth=0
```

### Passo 1.2: Build de Produção

```bash
# Executar build (já configurado no package.json)
npm run build
```

**O que acontece:**

- Executa: `ng build --configuration=production --base-href /`
- Gera arquivos otimizados em `dist/`
- Minifica JS/CSS
- Tree-shaking (remove código não usado)
- AOT compilation

**Saída esperada:**

```
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.

Initial Chunk Files               | Names         |  Raw Size
main.xxxxxxxx.js                  | main          |   XXX kB
polyfills.xxxxxxxx.js             | polyfills     |   XXX kB
styles.xxxxxxxx.css               | styles        |   XXX kB

Build at: 2025-10-19...
```

### Passo 1.3: Validar Build Local

```bash
# Verificar se pasta dist/ foi criada
ls -la dist/

# Deve conter:
# - index.html
# - *.js (bundles)
# - *.css
# - assets/
# - favicon.ico
```

---

## 🌐 PARTE 2: Preparar VPS (Primeira Vez ou Reset)

**⚠️ Atenção:** Execute apenas se for primeira vez ou se precisar reinstalar tudo.

### Passo 2.1: Conectar à VPS

```bash
ssh root@147.79.87.156
```

### Passo 2.2: Instalar Audiowaveform via PPA

```bash
# Atualizar sistema
sudo apt update

# Instalar software-properties-common
sudo apt install -y software-properties-common

# Adicionar PPA do audiowaveform
sudo add-apt-repository -y ppa:chris-needham/ppa

# Atualizar repositórios
sudo apt update

# Instalar audiowaveform
sudo apt install -y audiowaveform

# Verificar instalação
audiowaveform --version
```

**Saída esperada:** `Audio Waveform Image Generator v1.x.x`

### Passo 2.3: Verificar Node.js e PM2

```bash
# Verificar Node.js
node --version  # Deve ser v14+

# Verificar npm
npm --version

# Verificar PM2
pm2 --version

# Se PM2 não estiver instalado:
npm install -g pm2
```

### Passo 2.4: Criar Estrutura de Diretórios

```bash
# Criar diretório principal (se não existir)
sudo mkdir -p /var/www/mokbeats

# Criar subdiretórios
sudo mkdir -p /var/www/mokbeats/assets/audios
sudo mkdir -p /var/www/mokbeats/server

# Ajustar permissões
sudo chown -R root:root /var/www/mokbeats
sudo chmod -R 755 /var/www/mokbeats
```

---

## 📤 PARTE 3: Upload dos Arquivos para VPS

### Passo 3.1: Upload do Frontend (dist/)

**No seu computador local (Linux Mint):**

```bash
# Navegar até diretório do projeto
cd /home/hustler/Documentos/projetos/MokBeats

# Upload do CONTEÚDO de dist/ para VPS (usando rsync)
# IMPORTANTE: Use dist/* para enviar o conteúdo, não a pasta dist/
rsync -avz --delete dist/* root@147.79.87.156:/var/www/mokbeats/

# A senha SSH será solicitada: +w@CYpr#Svvnz6WtU2W6
```

**⚠️ ATENÇÃO: Diferença importante**

```bash
# ✅ CORRETO - Envia CONTEÚDO de dist/ direto para /var/www/mokbeats/
rsync -avz --delete dist/* root@147.79.87.156:/var/www/mokbeats/
# Resultado: /var/www/mokbeats/index.html, /var/www/mokbeats/assets/, etc.

# ❌ ERRADO - Criaria pasta dist/ dentro de /var/www/mokbeats/
rsync -avz --delete dist/ root@147.79.87.156:/var/www/mokbeats/
# Resultado: /var/www/mokbeats/dist/index.html (ERRADO!)
```

**Opções do rsync explicadas:**

- `-a`: modo arquivo (preserva permissões)
- `-v`: verbose (mostra progresso)
- `-z`: compacta durante transferência
- `--delete`: remove arquivos antigos no destino

**Autenticação SSH:**

- **Senha**: `+w@CYpr#Svvnz6WtU2W6`
- A senha será solicitada automaticamente pelo rsync/ssh
- Digite a senha quando solicitado e pressione Enter

### Passo 3.2: Upload do Backend (server/)

```bash
# Ainda no diretório do projeto local
cd /home/hustler/Documentos/projetos/MokBeats

# Upload da pasta server/ para VPS (excluindo node_modules)
rsync -avz --delete --exclude=node_modules server/ root@147.79.87.156:/var/www/mokbeats/server/

# A senha SSH será solicitada: +w@CYpr#Svvnz6WtU2W6

# ⚠️ IMPORTANTE: node_modules é excluído automaticamente (será instalado na VPS)
```

### Passo 3.3: Verificar Arquivos de Áudio

**Na VPS:**

```bash
ssh root@147.79.87.156

# Verificar se áudios estão no lugar correto
ls -lah /var/www/mokbeats/assets/audios/

# Deve listar arquivos .mp3 como:
# - MokBeats_Future_Forest_(FULL).mp3
# - MokBeats_Future_Forest_(DRUMS).mp3
# - MokBeats_Future_Forest_(EFEITOS).mp3
# - MokBeats_Future_Forest_(HARMONIAS).mp3
# - MokBeats_Future_Forest_(MELODIAS).mp3
```

**⚠️ Se áudios não estiverem presentes:**

```bash
# No seu computador local, enviar áudios:
rsync -avz src/assets/audios/ root@147.79.87.156:/var/www/mokbeats/assets/audios/
```

---

## ⚙️ PARTE 4: Configurar Backend na VPS

**Todos os comandos abaixo na VPS (via SSH):**

### Passo 4.1: Instalar Dependências do Backend

```bash
# Navegar até diretório do servidor
cd /var/www/mokbeats/server

# Instalar dependências
npm install

# Verificar instalação
ls -la node_modules/
```

**Dependências instaladas (package.json):**

- express
- cors
- body-parser
- connect-multiparty
- dotenv (gerenciamento de variáveis de ambiente)

### Passo 4.2: Configurar Variáveis de Ambiente

**⚠️ IMPORTANTE:** O backend usa variáveis de ambiente para localizar os arquivos de áudio.

```bash
# Ainda em /var/www/mokbeats/server

# Criar arquivo .env para produção
cat > .env << 'EOF'
# Configuração de Ambiente - Produção (VPS)
NODE_ENV=production

# Caminho base para arquivos de áudio
# Na VPS: os áudios estão em ../assets/audios/
AUDIO_BASE_PATH=../
EOF

# Verificar arquivo criado
cat .env
```

**Conteúdo esperado do .env na VPS:**
```
NODE_ENV=production
AUDIO_BASE_PATH=../
```

**Por que isso é necessário?**
- **Local** (desenvolvimento): áudios em `/home/hustler/.../src/assets/audios/`
- **VPS** (produção): áudios em `/var/www/mokbeats/assets/audios/`
- O `.env` define o caminho correto para cada ambiente automaticamente

### Passo 4.3: Gerar Peaks Reais dos Áudios

```bash
# Ainda em /var/www/mokbeats/server
node scripts/generate-peaks.js
```

**Saída esperada:**

```
🎵 Iniciando processamento de músicas...

🔧 Ambiente: production
📁 Base path para áudios: /var/www/mokbeats

✅ 24 músicas carregadas do JSON

[1/24] Processando: HighFrenetic
  📁 Arquivo: ../../assets/audios/MokBeats_Future_Forest_(FULL).mp3
  ⚙️  Gerando peaks...
  ✅ 3870 peaks gerados com sucesso

[2/24] Processando: Maleficus Chaos
  ...
📝 Arquivo musicas.json atualizado com 24 músicas
✅ Processo concluído!
```

**Verificar arquivo gerado:**

```bash
# Verificar se musicas.json foi criado com peaks
cat /var/www/mokbeats/server/data/musicas.json | head -50

# Deve conter array "peaks" preenchido para cada música
```

### Passo 4.4: Configurar PM2

```bash
# Parar processos antigos (se existirem)
pm2 stop all
pm2 delete all

# Iniciar novo backend
cd /var/www/mokbeats/server
pm2 start src/index.js --name mok-backend

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup

# ⚠️ Executar o comando que o PM2 sugerir
# Exemplo: sudo env PATH=$PATH:/usr/bin...
```

### Passo 4.5: Verificar Backend Funcionando

```bash
# Ver logs do backend
pm2 logs mok-backend

# Deve aparecer:
# ✅ 24 músicas carregadas do JSON com peaks reais
# Servidor Iniciado!

# Verificar status
pm2 status

# Deve mostrar:
# ┌─────┬──────────────┬─────────┬─────────┬──────────┐
# │ id  │ name         │ status  │ restart │ uptime   │
# ├─────┼──────────────┼─────────┼─────────┼──────────┤
# │ 0   │ mok-backend  │ online  │ 0       │ 5s       │
# └─────┴──────────────┴─────────┴─────────┴──────────┘
```

---

## ✅ PARTE 5: Validação Final

### Passo 5.1: Testar API do Backend

```bash
# Na VPS, testar endpoints
curl http://localhost:3100/api/musicas | head -50

# Deve retornar JSON com músicas e peaks
```

### Passo 5.2: Verificar Apache/Proxy

**Na VPS:**

```bash
# Verificar configuração do Apache
sudo apache2ctl configtest

# Deve retornar: Syntax OK

# Se necessário, reiniciar Apache
sudo systemctl restart apache2

# Verificar status
sudo systemctl status apache2
```

### Passo 5.3: Testar Frontend

**No navegador:**

1. Acessar: `http://147.79.87.156` (ou seu domínio)
2. Verificar se site carrega
3. Testar player de música
4. Verificar se waveform carrega rapidamente (peaks reais)

### Passo 5.4: Monitorar Logs

```bash
# Logs do PM2
pm2 logs mok-backend --lines 100

# Logs do Apache
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/apache2/access.log
```

---

## 🔄 DEPLOY INCREMENTAL (Atualizações Futuras)

Quando fizer mudanças no código e precisar atualizar:

### Build e Upload Rápido

```bash
# No seu computador local
cd /home/hustler/Documentos/projetos/MokBeats

# 1. Build do frontend
npm run build

# 2. Upload frontend (CONTEÚDO de dist/*)
rsync -avz --delete dist/* root@147.79.87.156:/var/www/mokbeats/

# 3. Upload backend (se mudou algo no server/)
rsync -avz --delete --exclude=node_modules server/ root@147.79.87.156:/var/www/mokbeats/server/

# 4. Reiniciar backend na VPS
ssh root@147.79.87.156 "cd /var/www/mokbeats/server && pm2 restart mok-backend"
```

---

## 🛠️ Comandos Úteis PM2

```bash
# Ver status de todos processos
pm2 status

# Logs em tempo real
pm2 logs mok-backend

# Reiniciar backend
pm2 restart mok-backend

# Parar backend
pm2 stop mok-backend

# Deletar processo
pm2 delete mok-backend

# Monitoramento com interface visual
pm2 monit

# Ver informações detalhadas
pm2 info mok-backend

# Salvar configuração atual
pm2 save

# Limpar logs
pm2 flush
```

---

## 📝 Checklist de Deploy Completo

- [ ] Build local executado (`npm run build`)
- [ ] Pasta `dist/` gerada com sucesso
- [ ] Upload do frontend para `/var/www/mokbeats/`
- [ ] Upload do backend para `/var/www/mokbeats/server/`
- [ ] Arquivos de áudio em `/var/www/mokbeats/assets/audios/`
- [ ] Audiowaveform instalado na VPS via PPA
- [ ] Dependências do backend instaladas (`npm install`)
- [ ] Peaks gerados (`node scripts/generate-peaks.js`)
- [ ] Arquivo `data/musicas.json` criado com peaks
- [ ] PM2 configurado com nome `mok-backend`
- [ ] PM2 startup configurado
- [ ] Backend rodando (verificar `pm2 status`)
- [ ] Logs do backend sem erros
- [ ] API respondendo (`curl localhost:3100/api/musicas`)
- [ ] Apache configurado e rodando
- [ ] Site acessível pelo navegador
- [ ] Waveform carregando rápido (peaks reais)

---

## 🆘 Troubleshooting

### Frontend não carrega

```bash
# Verificar se arquivos foram enviados
ssh root@147.79.87.156 "ls -la /var/www/mokbeats/index.html"

# Verificar permissões
ssh root@147.79.87.156 "sudo chmod -R 755 /var/www/mokbeats"
```

### Backend não inicia

```bash
# Ver logs de erro
pm2 logs mok-backend --err --lines 50

# Verificar se porta 3100 está disponível
ssh root@147.79.87.156 "netstat -tulpn | grep 3100"
```

### Peaks não carregam

```bash
# Verificar se musicas.json existe e tem peaks
ssh root@147.79.87.156 "cat /var/www/mokbeats/server/data/musicas.json | grep peaks | head -5"

# Regenerar peaks se necessário
ssh root@147.79.87.156 "cd /var/www/mokbeats/server && node scripts/generate-peaks.js"
```

### Áudios não tocam

```bash
# Verificar se arquivos de áudio existem
ssh root@147.79.87.156 "ls -lah /var/www/mokbeats/assets/audios/"

# Verificar permissões dos áudios
ssh root@147.79.87.156 "sudo chmod 644 /var/www/mokbeats/assets/audios/*.mp3"
```

---

## 📚 Documentação Relacionada

- [DEPLOY_VPS.md](server/DEPLOY_VPS.md) - Instruções detalhadas do servidor
- [README.md](server/README.md) - Documentação do backend
- [CHANGELOG_PEAKS.md](CHANGELOG_PEAKS.md) - Histórico de mudanças nos peaks
- [CONFIG_APACHE_CORRETA.md](CONFIG_APACHE_CORRETA.md) - Configuração do Apache
- [RESUMO_IMPLEMENTACAO.md](RESUMO_IMPLEMENTACAO.md) - Resumo das implementações

---

**Última atualização:** 19 de outubro de 2025
**Versão do Backend:** 1.0.0 (com peaks reais)
