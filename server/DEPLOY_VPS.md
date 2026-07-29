# 🚀 Deploy na VPS - Sistema de Peaks Reais

Este documento contém instruções completas para fazer deploy do sistema de peaks reais na VPS.

## 📋 Pré-requisitos

- VPS com Ubuntu/Debian (Ubuntu 24.04 LTS)
- Acesso SSH à VPS (root@31.97.160.61)
- Node.js instalado — backend exige major 24, mínimo v24.18.1 (versão corrigida; ver lote R1a
  do Plano P0 v2.2); upgrade da VPS é operação separada (lote R1b), não automatizada aqui
- PM2 instalado e configurado
- ⚠️ **CRÍTICO:** Arquivos de áudio (.mp3) em `/var/www/html/gulini.com.br/mokbeats/assets/audios/`
- ⚠️ **CRÍTICO:** Arquivo `.env` em `/var/www/html/gulini.com.br/mokbeats/server/` com `NODE_ENV=production`

---

## 🔧 Passo 1: Instalar Audiowaveform na VPS

### ⚠️ IMPORTANTE: O método via APT padrão NÃO funciona no Ubuntu 24.04 LTS

**MÉTODO CORRETO - Via PPA (Chris Needham):**

```bash
# Conectar à VPS via SSH
ssh root@31.97.160.61

# 1. Atualizar repositórios
sudo apt update

# 2. Instalar software-properties-common (se não estiver instalado)
sudo apt install -y software-properties-common

# 3. Adicionar o PPA do audiowaveform
sudo add-apt-repository -y ppa:chris-needham/ppa

# 4. Atualizar repositórios novamente
sudo apt update

# 5. Instalar audiowaveform
sudo apt install -y audiowaveform

# 6. Verificar instalação
audiowaveform --version
```

**Saída esperada:**

```
Audio Waveform Image Generator v1.x.x
```

### 🔍 Verificação da Instalação

Após a instalação, verificar se está funcionando corretamente:

```bash
# Verificar se o comando está disponível
which audiowaveform

# Deve retornar: /usr/bin/audiowaveform

# Verificar pacote instalado
dpkg -l | grep audiowaveform

# Testar com um arquivo (opcional)
# audiowaveform -i arquivo.mp3 -o waveform.dat --pixels-per-second 20
```

**⚠️ Nota Importante:** Este método via PPA é o ÚNICO que funciona no Ubuntu 24.04 LTS. Métodos via APT padrão ou SNAP não funcionam e não devem ser utilizados.

---

## 📦 Passo 2: Fazer Upload dos Arquivos para VPS

### Opção A: Via rsync (Recomendado)

**Usar o script automatizado ([BUILD_AND_DEPLOY.md](../../BUILD_AND_DEPLOY.md)):**

```bash
# Na sua máquina local
cd /home/hustler/Documentos/projetos/MokBeats
./deploy-to-vps.sh
```

**Ou manualmente:**

```bash
# Na sua máquina local
cd /home/hustler/Documentos/projetos/MokBeats

# 1. Upload do frontend (build Angular)
npm run build
rsync -avz --delete dist/* root@31.97.160.61:/var/www/html/gulini.com.br/mokbeats/

# 2. Upload do backend
rsync -avz --delete --exclude=node_modules server/ root@31.97.160.61:/var/www/html/gulini.com.br/mokbeats/server/

# 3. ⚠️ CRÍTICO: Upload dos arquivos de áudio
rsync -avz src/assets/audios/ root@31.97.160.61:/var/www/html/gulini.com.br/mokbeats/assets/audios/
```

### Opção B: Via Git

```bash
# Na sua máquina local
cd /home/hustler/Documentos/projetos/MokBeats
git add .
git commit -m "feat: Add peaks generation system with audiowaveform"
git push origin main

# Na VPS
ssh root@31.97.160.61
cd /var/www/html/gulini.com.br/mokbeats
git pull origin main

# ⚠️ IMPORTANTE: Arquivos de áudio devem ser enviados separadamente via rsync
# pois são muito grandes para Git
```

**⚠️ Verificar estrutura de diretórios criada:**

```bash
# Na VPS
ssh root@31.97.160.61

# Verificar estrutura completa
ls -la /var/www/html/gulini.com.br/mokbeats/
# Deve conter: index.html, assets/, server/

ls -la /var/www/html/gulini.com.br/mokbeats/assets/audios/
# Deve conter: *.mp3 (arquivos de áudio)

ls -la /var/www/html/gulini.com.br/mokbeats/server/
# Deve conter: src/, scripts/, data/, package.json
```

---

## 🎵 Passo 3: Criar arquivo .env e Gerar Peaks

**⚠️ PASSO CRÍTICO:** Este arquivo determina o caminho correto para os áudios!

### 3.1. Criar arquivo .env na VPS

```bash
# Conectar à VPS
ssh root@31.97.160.61

# Navegar até o diretório do servidor
cd /var/www/html/gulini.com.br/mokbeats/server

# Criar arquivo .env para produção
cat > .env << 'EOF'
# Configuração de Ambiente - Produção (VPS)
NODE_ENV=production

# Caminho base para arquivos de áudio
# Na VPS: os áudios estão em ../../assets/audios/
AUDIO_BASE_PATH=../../
EOF

# Verificar arquivo criado
cat .env

# Saída esperada:
# NODE_ENV=production
# AUDIO_BASE_PATH=../../
```

### 3.2. Verificar arquivos de áudio

```bash
# Ainda na VPS (/var/www/html/gulini.com.br/mokbeats/server)

# Verificar se os arquivos de áudio existem
ls -lh /var/www/html/gulini.com.br/mokbeats/assets/audios/*.mp3

# Contar quantos arquivos MP3 existem
find /var/www/html/gulini.com.br/mokbeats/assets/audios -name "*.mp3" | wc -l

# Verificar tamanho total dos arquivos
du -sh /var/www/html/gulini.com.br/mokbeats/assets/audios/
```

**Se os arquivos NÃO existirem:**

```bash
# No seu computador local
cd /home/hustler/Documentos/projetos/MokBeats
rsync -avz src/assets/audios/ root@31.97.160.61:/var/www/html/gulini.com.br/mokbeats/assets/audios/
```

### 3.3. Executar script de geração de peaks

```bash
# Na VPS (/var/www/html/gulini.com.br/mokbeats/server)
node scripts/generate-peaks.js
```

### Saída Esperada (SUCESSO)

**Com .env correto e arquivos de áudio presentes:**

```
🎵 Iniciando processamento de músicas...

🔧 Ambiente: production
📁 Base path para áudios: /var/www/html/gulini.com.br/mokbeats

✅ 24 músicas carregadas do JSON

[1/24] Processando: HighFrenetic
  📁 Arquivo: ../../assets/audios/MokBeats_Future_Forest_(FULL).mp3
  ⚙️  Gerando peaks...
  ✅ 3870 peaks gerados com sucesso

[2/24] Processando: Maleficus Chaos
  📁 Arquivo: ../../assets/audios/MokBeats_Future_Forest_(FULL).mp3
  ⚙️  Gerando peaks...
  ✅ 3870 peaks gerados com sucesso

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Salvando arquivo JSON...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Processamento concluído!

📊 Estatísticas:
   - Total de músicas: 24
   - Processadas com sucesso: 24
   - Erros/avisos: 0
   - Arquivos únicos processados: 5
   - Peaks reutilizados: 19
   - Arquivo salvo: /var/www/html/gulini.com.br/mokbeats/server/data/musicas.json
   - Tamanho do arquivo: 8.64 KB

🎉 Todas as músicas foram processadas com sucesso!
   O frontend agora carregará waveforms instantaneamente.
```

### Saída de ERRO (sem .env ou sem arquivos)

**Se esquecer de criar o .env:**

```
🎵 Iniciando processamento de músicas...

🔧 Ambiente: development                           ← ERRADO!
📁 Base path para áudios: /var/www/html/gulini.com.br/mokbeats/src   ← CAMINHO ERRADO!

✅ 24 músicas carregadas do JSON

[1/24] Processando: HighFrenetic
  📁 Arquivo: ../../assets/audios/MokBeats_Future_Forest_(FULL).mp3
  ⚠️  Arquivo não encontrado: /var/www/html/gulini.com.br/mokbeats/src/assets/audios/...
  ℹ️  Mantendo peaks vazios para esta música

⚠️  24 música(s) não foram processadas.
   Verifique se os arquivos de áudio existem nos caminhos corretos.
```

**Solução:** Criar arquivo .env conforme Passo 3.1

---

## 🔄 Passo 4: Configurar e Iniciar Backend com PM2

### 4.1. Instalar Dependências do Backend

```bash
# Na VPS, navegar até o diretório do servidor
cd /var/www/html/gulini.com.br/mokbeats/server

# Instalar dependências npm
npm install
```

**Dependências esperadas (ver package.json):**

- express
- cors
- body-parser
- multer (upload; `connect-multiparty` foi removido no lote U2c do Plano P0 v2.2)
- bcrypt
- jsonwebtoken
- dotenv (gerenciamento de variáveis de ambiente)

### 4.2. Configurar Variáveis de Ambiente (.env)

**⚠️ PASSO OBRIGATÓRIO:** Criar arquivo `.env` com configurações de produção.

```bash
# Criar arquivo .env na VPS
cd /var/www/html/gulini.com.br/mokbeats/server

cat > .env << 'EOF'
# Configuração de Ambiente - Produção (VPS)
NODE_ENV=production

# Caminho base para arquivos de áudio
# Na VPS: os áudios estão em ../../assets/audios/
AUDIO_BASE_PATH=../../
EOF

# Verificar arquivo criado
cat .env
```

**Por que isso é necessário?**

O script `generate-peaks.js` precisa saber onde encontrar os arquivos de áudio:
- **Desenvolvimento** (local): `../../src/assets/audios/`
- **Produção** (VPS): `../../assets/audios/`

O arquivo `.env` define automaticamente o caminho correto para cada ambiente.

**⚠️ Importante:** Sem o `.env` configurado, a geração de peaks falhará!

> ℹ️ Certifique-se de que Node.js/NPM estejam disponíveis para o mesmo usuário que executa o deploy (`root` por padrão). Se você usa NVM, carregue o ambiente (`. ~/.nvm/nvm.sh`) ou instale Node.js globalmente antes desta etapa.

### 4.3. Gerar Peaks dos Áudios

Agora, com o `.env` configurado, gere os peaks:

```bash
cd /var/www/html/gulini.com.br/mokbeats/server
node scripts/generate-peaks.js
```

**Saída esperada (com .env correto):**
```
🎵 Iniciando processamento de músicas...

🔧 Ambiente: production
📁 Base path para áudios: /var/www/html/gulini.com.br/mokbeats

✅ 24 músicas carregadas do JSON

[1/24] Processando: HighFrenetic
  📁 Arquivo: ../../assets/audios/MokBeats_Future_Forest_(FULL).mp3
  ⚙️  Gerando peaks...
  ✅ 3870 peaks gerados com sucesso
...
```

### 4.4. Configurar PM2

**⚠️ Importante (lote R1b do Plano P0 v2.2):** o backend exige Node major 24 (>= v24.18.1),
instalado via `nvm` nesta VPS (não é o Node do sistema). Uma sessão SSH não-interativa não carrega
o `nvm.sh` automaticamente, então `pm2 start` sem `--interpreter` explícito herda o `node` do PATH
— que aponta para o Node do sistema, **não** para o v24.18.1. Sempre fixe o caminho absoluto:

```bash
# Se houver processo antigo rodando, remover
pm2 delete mok-backend 2>/dev/null || true

# Descobrir o binario do Node correto (nvm instalado nesta VPS)
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm which 24.18.1
# Exemplo de saida: /root/.nvm/versions/node/v24.18.1/bin/node

# Iniciar novo backend com o interpreter fixado nesse caminho
cd /var/www/html/gulini.com.br/mokbeats/server
pm2 start src/index.js --name mok-backend --interpreter /root/.nvm/versions/node/v24.18.1/bin/node

# Configurar PM2 para iniciar automaticamente no boot
pm2 save
pm2 startup

# Executar o comando que o PM2 sugerir (começará com sudo)
# Exemplo: sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root
```

Prefira sempre `./deploy-to-vps.sh --backend-only` a este passo manual — o script já resolve o
binário correto via `nvm` automaticamente (funções `resolve_remote_node_bin()` e
`check_remote_runtime()`) e recria o processo com `--interpreter` sempre fixado.

### 4.5. Verificar Logs e Status

```bash
# Verificar logs em tempo real
pm2 logs mok-backend

# Deve aparecer:
# ✅ 24 músicas carregadas do JSON com peaks reais
# Servidor Iniciado!

# Verificar status
pm2 status

# Monitoramento em tempo real
pm2 monit
```

### 4.6. Comandos Úteis do PM2

```bash
# Reiniciar backend
pm2 restart mok-backend

# Ver logs apenas do backend
pm2 logs mok-backend --lines 100

# Parar backend
pm2 stop mok-backend

# Ver informações detalhadas
pm2 info mok-backend

# Limpar logs
pm2 flush
```

---

## ✅ Passo 5: Verificar se Está Funcionando

### Teste 1: Verificar API

```bash
# Testar endpoint de músicas
curl http://localhost:3100/api/musicas?page=1&limit=1

# Deve retornar JSON com campo "peaks" preenchido com array de números
```

### Teste 2: Verificar Frontend

1. Abra o frontend no navegador
2. Acesse a página de músicas
3. Verifique se os waveforms carregam instantaneamente
4. Abra o console do navegador (F12)
5. Procure por mensagens:
   - `⚡ Carregando waveform com peaks pré-gerados para [nome_musica]`
   - `✅ WaveSurfer ready for [nome_musica]`

---

## 🐛 Troubleshooting

### Problema: "audiowaveform: command not found"

**Solução:** Instalar audiowaveform conforme Passo 1

### Problema: "Arquivo não encontrado"

**Solução:** Verificar caminhos dos arquivos de áudio:

```bash
# Listar arquivos de áudio
find . -name "*.mp3"

# Ajustar paths no musicas.json se necessário
nano data/musicas.json
```

### Problema: "Peaks vazios no frontend"

**Verificações:**

1. Conferir se `musicas.json` tem peaks preenchidos:

   ```bash
   cat data/musicas.json | grep -A 2 "peaks"
   ```

2. Verificar logs do servidor:

   ```bash
   pm2 logs index
   ```

3. Verificar console do navegador para erros

### Problema: "Servidor não reinicia"

```bash
# Matar processos Node
pkill -f node

# Reiniciar PM2
pm2 restart all

# Ou reiniciar servidor manualmente
cd /caminho/do/projeto/server
node src/index.js
```

---

## 📊 Comparação de Performance

### Antes (Peaks Sintéticos)

- ❌ Precisão: Aproximada (ondas matemáticas)
- ❌ Tamanho: ~7.7MB por música (download de áudio)
- ❌ Tempo de carregamento: 5-15 segundos
- ❌ Uso de banda: 77-185MB por página

### Depois (Peaks Reais)

- ✅ Precisão: Pixel-perfect (dados reais do áudio)
- ✅ Tamanho: ~10-20KB por música (apenas peaks)
- ✅ Tempo de carregamento: <100ms (instantâneo)
- ✅ Uso de banda: ~200KB por página

**Resultado: 385x mais rápido! 🚀**

---

## 🔄 Adicionando Novas Músicas

Quando adicionar uma nova música ao sistema:

### Opção 1: Gerar Peaks Manualmente

```bash
# Na VPS
cd /caminho/do/projeto/server

# Editar musicas.json e adicionar nova música com peaks vazios
nano data/musicas.json

# Rodar script para gerar peaks de todas as músicas
node scripts/generate-peaks.js

# Reiniciar servidor
pm2 restart index
```

### Opção 2: Modificar Backend para Auto-Geração

O endpoint `POST /api/musicas` pode ser modificado para gerar peaks automaticamente:

```javascript
// Em server/src/index.js
const { generatePeaksFromAudio } = require('../scripts/process-audio');

app.route('/api/musicas').post((request, response) => {
  let musica = request.body;

  // Gera peaks automaticamente se houver URL de áudio
  if (musica.url) {
    const audioPath = resolveAudioPath(musica.url);
    musica.peaks = generatePeaksFromAudio(audioPath) || [];
  }

  const firstId = MUSICAS ? Math.max.apply(null, MUSICAS.map(m => m.id)) + 1 : 1;
  musica.id = firstId;
  MUSICAS.push(musica);

  // Salvar no JSON
  const fs = require('fs');
  const jsonPath = path.join(__dirname, '../data/musicas.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ musicas: MUSICAS }, null, 2));

  response.status(201).send(musica);
});
```

---

## 📝 Notas Importantes

1. **Backup**: Sempre faça backup do `musicas.json` antes de regerá-lo
2. **Performance**: Gerar peaks de 24 músicas leva ~2-5 minutos
3. **Espaço em disco**: Arquivo JSON final tem ~500KB-1MB
4. **Cache**: Peaks são gerados uma vez e reutilizados
5. **Atualização**: Se modificar áudio, regere os peaks

---

## 🎯 Próximos Passos Recomendados

1. ✅ **Monitorar Performance**: Use ferramentas de análise para confirmar melhoria
2. ✅ **Backup Automático**: Configure cron job para backup do `musicas.json`
3. ✅ **Migração para Banco de Dados**: Quando estiver pronto, migre para MongoDB/PostgreSQL
4. ✅ **CDN**: Considere servir peaks via CDN para ainda mais velocidade

---

## 📞 Suporte

Se encontrar problemas:

1. Verificar logs: `pm2 logs index`
2. Verificar status: `pm2 status`
3. Testar manualmente: `node src/index.js`
4. Verificar console do navegador (F12)

---

**Última atualização:** 2026-07-29 (IP/path reconciliados com `deploy-to-vps.sh`, lote R1b do Plano P0 v2.2)
**Versão do sistema:** 1.0.0
**Compatibilidade:** Node.js 24.18.1+ (backend, major 24, via nvm), Ubuntu 24.04 LTS
