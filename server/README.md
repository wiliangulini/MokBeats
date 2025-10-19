# 🎵 MokBeats Server - Sistema de Peaks Reais

Backend do MokBeats com geração automática de peaks reais usando audiowaveform.

## 📁 Estrutura de Arquivos

```
server/
├── src/
│   └── index.js              # Servidor Express principal
├── data/
│   └── musicas.json          # Banco de dados JSON com peaks reais
├── scripts/
│   ├── process-audio.js      # Utilitário para gerar peaks de um áudio
│   └── generate-peaks.js     # Script batch para processar todas as músicas
├── package.json
├── README.md                 # Este arquivo
└── DEPLOY_VPS.md            # Guia de deploy para VPS
```

## 🚀 Início Rápido

### Desenvolvimento Local

```bash
# Instalar dependências
cd server
npm install

# Iniciar servidor
npm start

# Servidor rodará em http://localhost:3100
```

### Gerar Peaks (Requer audiowaveform)

```bash
# Instalar audiowaveform primeiro
sudo apt-get install audiowaveform

# Gerar peaks de todas as músicas
node scripts/generate-peaks.js

# Reiniciar servidor para carregar novos peaks
npm start
```

## 📊 Sistema de Peaks

### Como Funciona

1. **Extração de Áudio**: Script lê arquivos MP3 do diretório `assets/audios/`
2. **Geração de Peaks**: `audiowaveform` processa cada áudio e gera array de pontos
3. **Armazenamento**: Peaks são salvos em `data/musicas.json`
4. **Servir API**: Backend serve peaks via endpoint `/api/musicas`
5. **Frontend**: WaveSurfer carrega peaks instantaneamente (sem download de áudio)

### Vantagens

| Métrica | Antes | Depois | Melhoria |
|---------|--------|--------|----------|
| Precisão | Sintética | Pixel-perfect | 100% |
| Tamanho | 7.7MB/música | 20KB/música | 385x menor |
| Tempo | 5-15s | <100ms | ~100x mais rápido |

## 🔧 Scripts Disponíveis

### `process-audio.js`

Utilitário para gerar peaks de um arquivo de áudio individual.

```javascript
const { generatePeaksFromAudio } = require('./scripts/process-audio');

const peaks = generatePeaksFromAudio('/path/to/audio.mp3', {
  pixelsPerSecond: 20 // Densidade dos peaks
});

console.log(peaks.length); // ~3870 pontos para áudio de 193s
```

### `generate-peaks.js`

Script batch que processa todas as músicas do sistema.

```bash
node scripts/generate-peaks.js
```

**Saída:**
- Lê músicas do `index.js` (fallback hardcoded)
- Processa cada arquivo de áudio
- Gera peaks reais usando audiowaveform
- Salva tudo em `data/musicas.json`

## 📡 Endpoints da API

### GET `/api/musicas`

Retorna todas as músicas com peaks pré-calculados.

```bash
curl http://localhost:3100/api/musicas
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome_musica": "HighFrenetic",
    "nome_produtor": "Xalaika",
    "url": "../../assets/audios/MokBeats_Future_Forest_(FULL).mp3",
    "duracao": 180000,
    "duracaoReal": 193.5,
    "bpm": 95,
    "genero": "EDM",
    "peaks": [0.234, -0.156, 0.678, ...] // 3870 pontos
  }
]
```

### GET `/api/musicas?page=1&limit=10`

Retorna músicas paginadas.

```bash
curl "http://localhost:3100/api/musicas?page=1&limit=10"
```

**Resposta:**
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 24,
    "itemsPerPage": 10
  }
}
```

## 🔄 Fluxo de Dados

```
┌─────────────────┐
│  Arquivo MP3    │ (7.7MB)
│  na VPS         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  audiowaveform  │ (Processa áudio)
│  script         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  musicas.json   │ (500KB total)
│  com peaks      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │ (Serve JSON)
│  Express.js     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Frontend       │ (Recebe peaks)
│  WaveSurfer     │ (Renderiza instantaneamente)
└─────────────────┘
```

## 🛠️ Manutenção

### Adicionar Nova Música

1. Fazer upload do arquivo MP3 para `assets/audios/`
2. Editar `data/musicas.json` e adicionar entrada com `peaks: []`
3. Rodar `node scripts/generate-peaks.js`
4. Reiniciar servidor: `pm2 restart index`

### Regerar Todos os Peaks

```bash
# Se arquivos de áudio mudaram
node scripts/generate-peaks.js

# Reiniciar
pm2 restart index
```

### Backup

```bash
# Fazer backup do JSON
cp data/musicas.json data/musicas.backup.json

# Restaurar backup
cp data/musicas.backup.json data/musicas.json
pm2 restart index
```

## ⚠️ Troubleshooting

### Erro: "audiowaveform: command not found"

**Solução:** Instalar audiowaveform

```bash
sudo apt-get update
sudo apt-get install audiowaveform
```

### Erro: "Arquivo não encontrado"

**Solução:** Verificar caminhos dos arquivos de áudio

```bash
# Listar arquivos
ls -la assets/audios/

# Ajustar paths no musicas.json se necessário
```

### Peaks vazios no frontend

**Verificações:**

1. Confirmar que `musicas.json` tem peaks:
   ```bash
   cat data/musicas.json | grep -A 1 "peaks"
   ```

2. Verificar logs do servidor:
   ```bash
   pm2 logs index
   ```

   Deve mostrar: `✅ 24 músicas carregadas do JSON com peaks reais`

3. Console do navegador deve mostrar:
   ```
   ⚡ Carregando waveform com peaks pré-gerados para [nome_musica]
   ```

## 📈 Performance

### Métricas de Produção

Com 24 músicas e paginação de 10 itens:

- **Tamanho da resposta API:** ~200KB (com peaks)
- **Tempo de resposta:** <50ms
- **Economia de banda:** 385x menor que carregar áudios
- **Tempo de renderização:** Instantâneo (<100ms)

### Comparação

| Operação | Sem Peaks | Com Peaks Reais |
|----------|-----------|-----------------|
| Carregar página | 77MB download | 200KB download |
| Renderizar waveforms | 5-15 segundos | <100ms |
| Uso de memória | Alto (decode MP3) | Mínimo (array) |

## 🔐 Segurança

- Backend em memória (não persiste mudanças em disco automaticamente)
- JSON é read-only durante execução
- Validações básicas nos endpoints
- CORS configurado para aceitar todas as origens (desenvolvimento)

**⚠️ Para produção:**
- Adicionar autenticação nos endpoints POST/PUT/DELETE
- Configurar CORS para domínios específicos
- Migrar para banco de dados real (MongoDB/PostgreSQL)

## 📝 Logs

```bash
# Ver logs em tempo real
pm2 logs index

# Ver apenas erros
pm2 logs index --err

# Limpar logs
pm2 flush
```

## 🚀 Deploy

Consulte [DEPLOY_VPS.md](./DEPLOY_VPS.md) para instruções completas de deploy na VPS.

---

**Versão:** 1.0.0
**Node.js:** 14+
**Dependências:** express, cors, body-parser, audiowaveform
