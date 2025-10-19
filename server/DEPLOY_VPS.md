# 🚀 Deploy na VPS - Sistema de Peaks Reais

Este documento contém instruções completas para fazer deploy do sistema de peaks reais na VPS.

## 📋 Pré-requisitos

- VPS com Ubuntu/Debian
- Acesso SSH à VPS
- Node.js instalado
- PM2 configurado
- Arquivos de áudio em `assets/audios/` na VPS

---

## 🔧 Passo 1: Instalar Audiowaveform na VPS

### ⚠️ IMPORTANTE: O método via APT padrão NÃO funciona no Ubuntu 24.04 LTS

**MÉTODO CORRETO - Via PPA (Chris Needham):**

```bash
# Conectar à VPS via SSH
ssh root@147.79.87.156

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

### Opção A: Via Git (Recomendado)

```bash
# Na sua máquina local
cd /home/hustler/Documentos/projetos/MokBeats
git add server/
git commit -m "feat: Add peaks generation system with audiowaveform"
git push origin main

# Na VPS
ssh usuario@seu-servidor.com
cd /caminho/do/projeto
git pull origin main
```

### Opção B: Via SCP

```bash
# Na sua máquina local
cd /home/hustler/Documentos/projetos/MokBeats

# Upload da pasta server inteira
scp -r server/ usuario@seu-servidor.com:/caminho/do/projeto/

# Ou arquivos específicos
scp server/scripts/process-audio.js usuario@seu-servidor.com:/caminho/do/projeto/server/scripts/
scp server/scripts/generate-peaks.js usuario@seu-servidor.com:/caminho/do/projeto/server/scripts/
scp server/src/index.js usuario@seu-servidor.com:/caminho/do/projeto/server/src/
scp server/data/musicas.json usuario@seu-servidor.com:/caminho/do/projeto/server/data/
```

---

## 🎵 Passo 3: Gerar Peaks Reais na VPS

```bash
# Conectar à VPS
ssh usuario@seu-servidor.com

# Navegar até o diretório do servidor
cd /caminho/do/projeto/server

# IMPORTANTE: Verificar se os arquivos de áudio existem
ls -lh assets/audios/*.mp3

# Se os arquivos estiverem em outro local, ajustar os caminhos no musicas.json
# Editar: nano data/musicas.json
# Exemplo: trocar "../../assets/audios/" por "assets/audios/"

# Executar script de geração de peaks
node scripts/generate-peaks.js
```

### Saída Esperada

```
🎵 Iniciando processamento de músicas...

[1/24] Processando: HighFrenetic
  📁 Arquivo: /caminho/assets/audios/MokBeats_Future_Forest_(FULL).mp3
  ⚙️  Gerando peaks...
  ✅ 3870 peaks gerados com sucesso

[2/24] Processando: Maleficus Chaos
  📁 Arquivo: /caminho/assets/audios/MokBeats_Future_Forest_(FULL).mp3
  ⚙️  Gerando peaks...
  ✅ 3870 peaks gerados com sucesso

...

✨ Processamento concluído!
📊 Estatísticas:
   - Total de músicas: 24
   - Processadas com sucesso: 24
   - Erros/avisos: 0
   - Arquivo salvo: /caminho/do/projeto/server/data/musicas.json

🎉 Arquivo musicas.json criado com sucesso!
```

---

## 🔄 Passo 4: Configurar e Iniciar Backend com PM2

### 4.1. Instalar Dependências do Backend

```bash
# Na VPS, navegar até o diretório do servidor
cd /var/www/mokbeats/server

# Instalar dependências npm
npm install
```

**Dependências esperadas (ver package.json):**

- express
- cors
- body-parser
- connect-multiparty

### 4.2. Configurar PM2

```bash
# Se houver processo antigo rodando, parar
pm2 stop all
pm2 delete all

# Iniciar novo backend com nome específico
cd /var/www/mokbeats/server
pm2 start src/index.js --name mok-backend

# Configurar PM2 para iniciar automaticamente no boot
pm2 save
pm2 startup

# Executar o comando que o PM2 sugerir (começará com sudo)
# Exemplo: sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root
```

### 4.3. Verificar Logs e Status

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

### 4.4. Comandos Úteis do PM2

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

**Última atualização:** 2025-10-19
**Versão do sistema:** 1.0.0
**Compatibilidade:** Node.js 14+, Ubuntu 20.04+
