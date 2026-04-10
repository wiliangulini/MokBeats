require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'mokbeats-dev-secret-change-in-prod';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Servir arquivos de áudio estáticos com cache headers otimizados
// Detecta ambiente automaticamente:
// - DESENVOLVIMENTO: ../../src/assets/audios/ (pasta src existe)
// - PRODUÇÃO (VPS): ../../assets/audios/ (sem pasta src)
const devPath = path.join(__dirname, '../../src/assets/audios');
const prodPath = path.join(__dirname, '../../assets/audios');

// Verifica qual caminho existe no sistema de arquivos
const audioPath = fs.existsSync(devPath) ? devPath : prodPath;
const environment = fs.existsSync(devPath) ? 'DESENVOLVIMENTO' : 'PRODUÇÃO';

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`🎵 Configuração de Áudio:`);
console.log(`   Ambiente: ${environment}`);
console.log(`   Caminho: ${audioPath}`);
console.log(`   Existe: ${fs.existsSync(audioPath) ? '✅' : '❌'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

app.use('/assets/audios', express.static(audioPath, {
  // Cache de 10 minutos (600 segundos)
  maxAge: '600000',
  // Headers adicionais de cache
  setHeaders: (res, filePath) => {
    // Cache público (pode ser armazenado por proxies/CDN)
    res.setHeader('Cache-Control', 'public, max-age=600');
    // Permite validação condicional (304 Not Modified)
    res.setHeader('ETag', 'true');
    // Habilita range requests para streaming
    res.setHeader('Accept-Ranges', 'bytes');
    // Tipo MIME correto para MP3
    if (filePath.endsWith('.mp3')) {
      res.setHeader('Content-Type', 'audio/mpeg');
    }
  }
}));

// ─── Persistência de usuários (JSON file) ─────────────────────────────────
const USERS_FILE = path.join(__dirname, '../data/users.json');

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    }
  } catch (e) { console.error('Erro ao carregar users.json:', e.message); }
  return [];
}

function saveUsers(users) {
  try {
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (e) { console.error('Erro ao salvar users.json:', e.message); }
}

let users = loadUsers();

// ─── Middleware de autenticação JWT ────────────────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Token ausente.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (_) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

// ─── Multer para upload de documentos ─────────────────────────────────────
const documentStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const userId = req.user?.userId || 'unknown';
    const tipo = req.params.tipo || 'outros';
    const dir = path.join(__dirname, 'uploads', 'documents', userId, tipo);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'application/pdf'];
const documentUpload = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Tipo de arquivo não permitido. Use JPG, PNG ou PDF.'));
  }
});

// Cadastro de novo usuário
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, tipoPessoa, tipoPerfil } = req.body || {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRe.test(email)) {
      return res.status(400).json({ message: 'E-mail inválido.' });
    }
    if (!password || String(password).length < 8) {
      return res.status(400).json({ message: 'Senha deve ter no mínimo 8 caracteres.' });
    }
    if (!tipoPessoa) {
      return res.status(400).json({ message: 'Tipo de pessoa é obrigatório.' });
    }
    if (!tipoPerfil || !['comprador', 'produtor'].includes(tipoPerfil)) {
      return res.status(400).json({ message: 'Tipo de perfil inválido. Use "comprador" ou "produtor".' });
    }

    // Recarregar do disco para evitar race conditions
    users = loadUsers();
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const userId = uuidv4();
    const user = {
      id: userId,
      email,
      passwordHash,
      tipoPessoa,
      tipoPerfil,
      profile: {},
      documents: { fotoDocumento: null, comprovanteResidencia: null, documentoEmpresa: null },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(user);
    saveUsers(users);

    const token = jwt.sign({ userId, email, tipoPerfil }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ token, user: { email, tipoPessoa, tipoPerfil } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Erro ao cadastrar.' });
  }
});

// Login com verificação de senha real
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRe.test(email)) {
      return res.status(400).json({ message: 'E-mail inválido.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Senha é obrigatória.' });
    }

    users = loadUsers();
    const found = users.find(u => u.email === email);

    // Usuários antigos (sem passwordHash) — aceitar qualquer senha de 8+ chars durante migração
    if (!found || !found.passwordHash) {
      if (String(password).length < 8) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }
      const tipoPerfil = found ? found.tipoPerfil : 'comprador';
      const userId = found ? found.id : uuidv4();
      const token = jwt.sign({ userId, email, tipoPerfil }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({ token, user: { email, tipoPerfil } });
    }

    const valid = await bcrypt.compare(String(password), found.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const token = jwt.sign({ userId: found.id, email, tipoPerfil: found.tipoPerfil }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token, user: { email, tipoPerfil: found.tipoPerfil } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Erro ao autenticar.' });
  }
});

// Stub — autenticação social com Google (não implementada)
// Para integrar: usar Firebase Authentication com AngularFire no front-end
app.post('/api/auth/google', (req, res) => {
  return res.status(501).json({
    message: 'Autenticação com Google não está configurada. Integre com Firebase Auth para habilitar.'
  });
});

const multipartMiddleware = multipart({ uploadDir: './uploads' });
app.post('/api/uploads/', multipartMiddleware, (req, res) => {
  const files = req.files;
  console.log(files);
  res.json({ message: files });
});

// ─── Endpoints de perfil do usuário ───────────────────────────────────────

// GET /api/user/profile — retorna dados pessoais do usuário autenticado
app.get('/api/user/profile', authenticateToken, (req, res) => {
  users = loadUsers();
  const user = users.find(u => u.id === req.user.userId);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
  return res.json(user.profile || {});
});

// PUT /api/user/profile — atualiza dados pessoais (sem senha e sem documentos)
app.put('/api/user/profile', authenticateToken, (req, res) => {
  users = loadUsers();
  const idx = users.findIndex(u => u.id === req.user.userId);
  if (idx === -1) return res.status(404).json({ message: 'Usuário não encontrado.' });

  const ALLOWED_FIELDS = [
    'nomeCompleto', 'tipoDocumento', 'cpf', 'passaporte', 'dataNascimento',
    'paisOrigem', 'telefone', 'email', 'endereco', 'cidade', 'estado', 'cep',
    'tipoConta', 'nomeEmpresaBR', 'cnpj', 'nomeEmpresaExt', 'tipoEmpresaExt', 'tipoEmpresaOutros',
  ];
  const body = req.body || {};
  const update = {};
  ALLOWED_FIELDS.forEach(f => { if (body[f] !== undefined) update[f] = body[f]; });

  users[idx].profile = { ...users[idx].profile, ...update };
  users[idx].updatedAt = new Date().toISOString();
  saveUsers(users);

  return res.json({ message: 'Perfil atualizado.', profile: users[idx].profile });
});

// POST /api/user/password — troca de senha (requer senha atual)
app.post('/api/user/password', authenticateToken, async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body || {};
    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias.' });
    }
    if (String(novaSenha).length < 8) {
      return res.status(400).json({ message: 'Nova senha deve ter no mínimo 8 caracteres.' });
    }

    users = loadUsers();
    const idx = users.findIndex(u => u.id === req.user.userId);
    if (idx === -1) return res.status(404).json({ message: 'Usuário não encontrado.' });

    const valid = await bcrypt.compare(String(senhaAtual), users[idx].passwordHash || '');
    if (!valid) return res.status(401).json({ message: 'Senha atual incorreta.' });

    users[idx].passwordHash = await bcrypt.hash(String(novaSenha), 10);
    users[idx].updatedAt = new Date().toISOString();
    saveUsers(users);

    return res.json({ message: 'Senha alterada com sucesso.' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Erro ao alterar senha.' });
  }
});

// POST /api/user/documents/:tipo — upload de documento de perfil
// tipo: foto-documento | comprovante-residencia | documento-empresa
app.post('/api/user/documents/:tipo', authenticateToken, (req, res) => {
  const { tipo } = req.params;
  const tiposValidos = ['foto-documento', 'comprovante-residencia', 'documento-empresa'];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({ message: 'Tipo de documento inválido.' });
  }

  documentUpload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'Nenhum arquivo enviado.' });

    const relativePath = `/uploads/documents/${req.user.userId}/${tipo}/${req.file.filename}`;

    users = loadUsers();
    const idx = users.findIndex(u => u.id === req.user.userId);
    if (idx !== -1) {
      const fieldMap = {
        'foto-documento': 'fotoDocumento',
        'comprovante-residencia': 'comprovanteResidencia',
        'documento-empresa': 'documentoEmpresa',
      };
      users[idx].documents = users[idx].documents || {};
      users[idx].documents[fieldMap[tipo]] = relativePath;
      users[idx].updatedAt = new Date().toISOString();
      saveUsers(users);
    }

    return res.json({ url: relativePath });
  });
});

// Servir documentos de usuário
app.use('/uploads/documents', express.static(path.join(__dirname, 'uploads', 'documents')));

// ─── Dashboard do Produtor ─────────────────────────────────────────────────
// MOCK — todos os dados abaixo são estáticos para validar o contrato de API.
// Substituir por queries reais quando houver persistência de vendas/licenças.

function dashboardMiddleware(req, res, next) {
  authenticateToken(req, res, () => {
    if (req.user?.tipoPerfil !== 'produtor') {
      return res.status(403).json({ message: 'Acesso restrito a produtores.' });
    }
    next();
  });
}

const DASHBOARD_MOCK = {
  summary: {
    vendasTotais: 8542,
    valorTotalVendas: 126340.00,
    totalCurtidas: 22481,
    ticketMedio: 14.80,
    licencas: {
      basica:        { quantidade: 4200, receita: 50400.00 },
      profissional:  { quantidade: 3100, receita: 62000.00 },
      exclusiva:     { quantidade: 1242, receita: 13940.00 }
    }
  },
  salesByTrack: [
    { trackId: 1, nome: 'HighFrenetic',   compras: 312, receita: 4680.00, origemPrincipal: 'Brasil',         likes: 1240, destaque: true  },
    { trackId: 2, nome: 'Maleficus Chaos',compras: 289, receita: 4335.00, origemPrincipal: 'Estados Unidos', likes:  980, destaque: false },
    { trackId: 3, nome: 'Impertinent',    compras: 211, receita: 3165.00, origemPrincipal: 'Brasil',         likes:  745, destaque: false },
    { trackId: 4, nome: 'The Funkster',   compras: 198, receita: 2970.00, origemPrincipal: 'Portugal',       likes:  630, destaque: true  },
    { trackId: 5, nome: 'Code',           compras: 154, receita: 2310.00, origemPrincipal: 'Brasil',         likes:  510, destaque: false }
  ],
  salesByOrigin: [
    { pais: 'Brasil',          cidade: 'São Paulo',     compras: 4100, lat: -23.55, lng: -46.63 },
    { pais: 'Brasil',          cidade: 'Rio de Janeiro',compras: 1820, lat: -22.90, lng: -43.17 },
    { pais: 'Estados Unidos',  cidade: 'Los Angeles',   compras:  980, lat:  34.05, lng:-118.24 },
    { pais: 'Portugal',        cidade: 'Lisboa',         compras:  640, lat:  38.72, lng:  -9.14 },
    { pais: 'Alemanha',        cidade: 'Berlim',         compras:  420, lat:  52.52, lng:  13.40 },
    { pais: 'Argentina',       cidade: 'Buenos Aires',   compras:  310, lat: -34.61, lng: -58.38 },
    { pais: 'Outros',          cidade: '',               compras:  272, lat:    0,   lng:    0   }
  ],
  revenueByTrack: [
    { trackId: 1, nome: 'HighFrenetic',    receita: 4680.00, share: 3.7 },
    { trackId: 2, nome: 'Maleficus Chaos', receita: 4335.00, share: 3.4 },
    { trackId: 3, nome: 'Impertinent',     receita: 3165.00, share: 2.5 },
    { trackId: 4, nome: 'The Funkster',    receita: 2970.00, share: 2.4 },
    { trackId: 5, nome: 'Code',            receita: 2310.00, share: 1.8 },
    { trackId: 6, nome: 'Outras faixas',   receita: 108880.00, share: 86.2 }
  ],
  likesVsSales: {
    '7d': [
      { data: '2026-03-10', curtidas: 312, compras: 45 },
      { data: '2026-03-11', curtidas: 298, compras: 51 },
      { data: '2026-03-12', curtidas: 341, compras: 39 },
      { data: '2026-03-13', curtidas: 387, compras: 62 },
      { data: '2026-03-14', curtidas: 412, compras: 58 },
      { data: '2026-03-15', curtidas: 356, compras: 44 },
      { data: '2026-03-16', curtidas: 329, compras: 37 }
    ],
    '30d': [
      { data: '2026-02-15', curtidas: 8421, compras: 1230 },
      { data: '2026-02-22', curtidas: 9102, compras: 1380 },
      { data: '2026-03-01', curtidas: 9780, compras: 1510 },
      { data: '2026-03-08', curtidas: 10234,compras: 1620 },
      { data: '2026-03-16', curtidas: 11240,compras: 1830 }
    ],
    '12m': [
      { data: '2025-04-01', curtidas: 14200, compras: 520 },
      { data: '2025-06-01', curtidas: 16800, compras: 680 },
      { data: '2025-08-01', curtidas: 19200, compras: 820 },
      { data: '2025-10-01', curtidas: 20100, compras: 910 },
      { data: '2025-12-01', curtidas: 21000, compras: 980 },
      { data: '2026-02-01', curtidas: 22481, compras: 1100 }
    ]
  }
};

const VALID_PERIODS = ['7d', '30d', '12m'];

app.get('/api/dashboard/summary', dashboardMiddleware, (_req, res) => {
  res.json(DASHBOARD_MOCK.summary);
});

app.get('/api/dashboard/sales-by-track', dashboardMiddleware, (_req, res) => {
  res.json(DASHBOARD_MOCK.salesByTrack);
});

app.get('/api/dashboard/sales-by-origin', dashboardMiddleware, (_req, res) => {
  res.json(DASHBOARD_MOCK.salesByOrigin);
});

app.get('/api/dashboard/revenue-by-track', dashboardMiddleware, (_req, res) => {
  res.json(DASHBOARD_MOCK.revenueByTrack);
});

app.get('/api/dashboard/likes-vs-sales', dashboardMiddleware, (req, res) => {
  const period = VALID_PERIODS.includes(req.query.period) ? req.query.period : '30d';
  res.json(DASHBOARD_MOCK.likesVsSales[period]);
});

// ─── Fim Dashboard ─────────────────────────────────────────────────────────

app.use((err, req, res, next) => res.json({ message: err.message }));

app.listen(3100, () => {
  console.log('Servidor Iniciado!');
});

// Dados estáticos movidos do front (simulação de backend)
const GENERO_MAP = {
  "Blues": [
    "Aleatória",
    "Blues eletrificado",
    "Blues acústico",
    "Blues-rock",
    "Chicago",
    "Delta blues",
    "Memphis",
    "St. Louis",
    "Zydeco"
  ],
  "Cantores": [
    "Alemães",
    "Brasil",
    "China",
    "Dinamarqueses",
    "Finlândia",
    "França",
    "Grécia",
    "Itália",
    "Japão",
    "K-Pop",
    "México",
    "Rússia",
    "Espanha",
    "Suécia",
    "Índia"
  ],
  "Clássica": [
    "Barroca",
    "Canto gregoriano",
    "Clássica moderna/Neoclássica",
    "Composições originais",
    "Medieval",
    "Período clássico",
    "Período romântico",
    "Renascimento",
    "Século XX",
    "Valsa",
    "Ópera"
  ],
  "Corporativo": [
    "Incidental",
    "Inspiradora",
    "Motivacional"
  ],
  "Dance/Tecno": [
    "Bhangra Trap",
    "Bounce",
    "Break",
    "Dance",
    "Dance Pop",
    "Deep House",
    "Drum and Bass (DnB)",
    "Dubstep",
    "EDM",
    "Future House",
    "Glitch House",
    "House",
    "House Progressivo",
    "Industrial",
    "Jersey Club",
    "Nu Disco",
    "Rave",
    "Tech House",
    "Tecno",
    "Trance",
    "Trap",
    "Tropical House"
  ],
  "Datas comemorativas": [
    "Dia da Independência",
    "Dia das Bruxas",
    "Ano Novo",
    "Natal",
    "Patriótica/Presidencial"
  ],
  "Eletrônica": [
    "ASMR",
    "Chill out",
    "Chillwave",
    "Downtempo",
    "Drones",
    "Etéreo",
    "Experimental",
    "Future Bass",
    "Futurewave",
    "Lounge",
    "Minimalista",
    "Trip-hop",
    "Vaporwave"
  ],
  "Folk": [
    "Americana",
    "Folk",
    "Folk rock",
    "Folktronica",
    "Indie Folk"
  ],
  "Hip Hop": [
    "Crunk",
    "Gangsta",
    "Hick Hop",
    "Hip hop old school",
    "Hyphy",
    "Rap",
    "Rap emo",
    "Trap",
    "Twerk"
  ],
  "Infantil/Crianças": [
    "Animada",
    "Divertida/Engraçada",
    "Suave/Canção de ninar"
  ],
  "Jazz": [
    "Acid jazz",
    "Balada jazz",
    "Dixieland",
    "Exótica",
    "Fusion",
    "Jazz cigano",
    "Jazz latino",
    "Jazz moderno",
    "Lounge jazz",
    "Ragtime",
    "Smooth jazz",
    "Swing"
  ],
  "Jogos": [
    "8bits",
    "8bits/Chiptune",
    "Aventura",
    "Batalha",
    "Corrida",
    "Crianças",
    "Fantasia"
  ],
  "Latina": [
    "Bachata",
    "Bossa Nova",
    "Brasileira/Samba",
    "Conjunto",
    "Cubana/Salsa",
    "Cúmbia",
    "Espanhola/Flamenca",
    "Jarocho",
    "Mariachi",
    "Norteño",
    "Peruana",
    "Reggaeton",
    "Rock latino",
    "Rumba",
    "Tango",
    "Tex-Mex"
  ],
  "Mundo": [
    "Africana",
    "Afro-cubana",
    "Asiática",
    "Balinesa",
    "Balcânica",
    "Bollywood",
    "Cajun",
    "Calipso",
    "Celta",
    "Chinesa",
    "Coreana",
    "Dinamarquesa",
    "Estilo gamelão",
    "Etíope",
    "Europeia",
    "Alemã",
    "Gnawa",
    "Grega",
    "Havaiana",
    "Indiana",
    "Indígena norte-americana",
    "Irlandesa",
    "Italiana",
    "Japonesa",
    "Klezmer",
    "Mediterrânea",
    "Mongol",
    "Norueguesa",
    "Polca",
    "Polinésia",
    "Portuguesa",
    "Escandinava",
    "Tailandesa",
    "Vietnamita",
    "Do Oriente Médio"
  ],
  "New age": [
    "Drones",
    "Elementos de música mundial",
    "Etéreo",
    "Lounge",
    "Orquestral"
  ],
  "Noticiário": [
    "Identidade auditiva",
    "Manchetes"
  ],
  "Piano/Solo instrumental": [
    "Drama humano"
  ],
  "Pop": [
    "Adulto contemporâneo",
    "Afrobeat",
    "Balada",
    "Cantor/Compositor",
    "Dream Pop",
    "Electro Pop",
    "Indie Pop",
    "New Wave",
    "Pop chiclete",
    "Pop rock",
    "Suave/Easy listening",
    "Synthpop"
  ],
  "Reggae": [
    "Dancehall",
    "Polinésia",
    "Soca"
  ],
  "Rhythm and blues": [
    "Disco",
    "Doo-Wop",
    "Funk",
    "Gospel",
    "Motown R&B alternativo",
    "R&B pop",
    "Soul",
    "Soul contemporâneo",
    "Soul pop"
  ],
  "Rock": [
    "Alternativo/Grunge",
    "Blues Rock",
    "Boogie-Woogie",
    "Death Metal",
    "Emo",
    "Funk Rock",
    "Hard Rock",
    "Hardcore",
    "Heartland Rock",
    "Heavy Metal",
    "Indie Rock",
    "Mersey Beat",
    "Pop Punk",
    "Pop rock",
    "Punk rock",
    "Raga rock",
    "Rock clássico",
    "Rock n roll",
    "Rock retrô",
    "Rockabilly",
    "Rocktrônica",
    "Ska",
    "Soft rock",
    "Southern rock",
    "Spaghetti Western",
    "Surf rock",
    "Swamp Rock"
  ],
  "Sertanejo": [
    "Bluegrass",
    "Faroeste",
    "Honky Tonk",
    "Raízes americanas",
    "Sertaneja tradicional",
    "Sertanejo folk",
    "Sertanejo pop",
    "Sertanejo rock",
    "Swing texano"
  ]
};

const HUMORES = [
  "Ação / Esportes",
  "Aventura / Descoberta",
  "Aeróbica / Exercícios",
  "Agressivo",
  "Comédia / Engraçado",
  "Crime / Suspense / Espionagem",
  "Sombrio / Melancólico",
  "Épico / Orquestral",
  "Moda / Estilo de Vida",
  "Bem-Estar / Sentir-se Bem",
  "Suave / Leve",
  "Feliz / Alegre",
  "Terror / Assustador",
  "Mágico / Místico",
  "Militar / Patriótico",
  "Relaxamento / Meditação",
  "Religioso / Cristão",
  "Romântico / Sentimental",
  "Triste / Nostálgico",
  "Ficção Científica / Futurista",
  "Sexy / Sensual",
  "Estranho / Bizarro",
  "Suspense / Drama",
  "Trilhas de Fundo",
  "Inspirador / Elevado",
  "Casamento"
];

// Config simples
const CONFIG = {
  whatsapp: '5546991161666'
};

app.route('/api/musicas').get((request, response) => {
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 24; // default: retorna todas

  // Se não houver parâmetros de paginação, retorna todas as músicas (compatibilidade)
  if (!request.query.page && !request.query.limit) {
    return response.send(MUSICAS);
  }

  // Calcula índices de paginação
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = MUSICAS.slice(startIndex, endIndex);

  // Retorna dados paginados com metadados
  response.send({
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(MUSICAS.length / limit),
      totalItems: MUSICAS.length,
      itemsPerPage: limit
    }
  });
});

app.route('/api/musicas').post((request, response) => {
  let musica = request.body;

  const firstId = MUSICAS ? Math.max.apply(null, MUSICAS.map(musicaIterator => musicaIterator.id)) + 1 : 1;
  musica.id = firstId;
  MUSICAS.push(musica);
  response.status(201).send(musica);
});

app.route('/api/musicas/:id').put((request, response) => {
  const musicaId = +request.params['id'];
  const musica = request.body;
  const index = MUSICAS.findIndex(musicaIterator => musicaIterator.id === musicaId);
  MUSICAS[index] = musica;
  response.status(200).send(musica);
});

app.route('/api/musicas/:id').get((request, response) => {
  const musicaId = +request.params['id'];
  response.status(200).send(MUSICAS.find(musicaIterator => musicaIterator.id === musicaId));
});

app.route('/api/musicas/:id').delete((request, response) => {
  const musicaId = +request.params['id'];
  MUSICAS = MUSICAS.filter(musicaIterator => musicaIterator.id !== musicaId);
  response.status(204).send({});
});

// Novos endpoints para filtros
app.route('/api/artistas').get((request, response) => {
  const artistas = [...new Set(MUSICAS.map(musica => musica.nome_produtor))].sort();
  response.status(200).send(artistas);
});

app.route('/api/instrumentos').get((request, response) => {
  const instrumentos = [...new Set(MUSICAS.flatMap(musica => musica.instrumentos || []))].sort();
  response.status(200).send(instrumentos);
});

app.route('/api/generos').get((request, response) => {
  const generos = Object.keys(GENERO_MAP).sort();
  response.status(200).send(generos);
});

app.route('/api/humores').get((request, response) => {
  response.status(200).send(HUMORES);
});

app.route('/api/genres-full').get((request, response) => {
  const query = request.query.q;

  if (!query) {
    return response.status(200).send(GENERO_MAP);
  }

  // Filtrar gêneros e subgêneros por query
  const filtered = {};
  const lowerQuery = query.toLowerCase();

  Object.keys(GENERO_MAP).forEach(genero => {
    // Inclui se o gênero principal contém a query
    if (genero.toLowerCase().includes(lowerQuery)) {
      filtered[genero] = GENERO_MAP[genero];
      return;
    }

    // Ou se algum subgênero contém a query
    const matchedSubs = GENERO_MAP[genero].filter(sub =>
      sub.toLowerCase().includes(lowerQuery)
    );

    if (matchedSubs.length > 0) {
      filtered[genero] = matchedSubs;
    }
  });

  response.status(200).send(filtered);
});

app.route('/api/subgeneros').get((request, response) => {
  const genero = request.query.genero;
  const sub = GENERO_MAP[genero] || [];
  response.status(200).send(sub);
});

app.route('/api/config').get((request, response) => {
  response.status(200).send(CONFIG);
});

// Endpoint de filtros avançados
app.route('/api/musicas/filtro').post((request, response) => {
  const filtros = request.body;
  let musicasFiltradas = MUSICAS;

  if (filtros.genero && filtros.genero.length > 0) {
    musicasFiltradas = musicasFiltradas.filter(musica =>
      filtros.genero.includes(musica.genero)
    );
  }

  if (filtros.humor && filtros.humor.length > 0) {
    musicasFiltradas = musicasFiltradas.filter(musica =>
      filtros.humor.includes(musica.humor)
    );
  }

  if (filtros.artistas && filtros.artistas.length > 0) {
    musicasFiltradas = musicasFiltradas.filter(musica =>
      filtros.artistas.includes(musica.nome_produtor)
    );
  }

  if (filtros.instrumentos && filtros.instrumentos.length > 0) {
    musicasFiltradas = musicasFiltradas.filter(musica =>
      filtros.instrumentos.some(instrumento =>
        (musica.instrumentos || []).includes(instrumento)
      )
    );
  }

  if (filtros.bpmMin || filtros.bpmMax) {
    const min = filtros.bpmMin || 0;
    const max = filtros.bpmMax || 999;
    musicasFiltradas = musicasFiltradas.filter(musica =>
      musica.bpm >= min && musica.bpm <= max
    );
  }

  if (filtros.duracaoMin || filtros.duracaoMax) {
    const min = filtros.duracaoMin || 0;
    const max = filtros.duracaoMax || 999999;
    musicasFiltradas = musicasFiltradas.filter(musica =>
      musica.duracao >= min && musica.duracao <= max
    );
  }

  if (filtros.vozes && filtros.vozes.length > 0) {
    musicasFiltradas = musicasFiltradas.filter(musica =>
      filtros.vozes.includes(musica.vozes)
    );
  }

  if (filtros.subgenero && filtros.subgenero.length > 0) {
    musicasFiltradas = musicasFiltradas.filter(musica =>
      filtros.subgenero.includes(musica.subgenero)
    );
  }

  // Paginação após filtros
  const page = parseInt(filtros.page) || 1;
  const limit = parseInt(filtros.limit) || musicasFiltradas.length;

  // Se não houver parâmetros de paginação, retorna todos os resultados filtrados (compatibilidade)
  if (!filtros.page && !filtros.limit) {
    return response.status(200).send(musicasFiltradas);
  }

  // Aplica paginação
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = musicasFiltradas.slice(startIndex, endIndex);

  // Retorna dados filtrados e paginados com metadados
  response.status(200).send({
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(musicasFiltradas.length / limit),
      totalItems: musicasFiltradas.length,
      itemsPerPage: limit
    }
  });
});

// Últimas sem repetir produtor (baseado em created_at desc, fallback id desc)
app.route('/api/tracks/latest-unique-by-producer').get((request, response) => {
  const limit = parseInt(request.query.limit || '5', 10);
  const sorted = [...MUSICAS].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
    const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
    return dateB.getTime() - dateA.getTime() || (b.id || 0) - (a.id || 0);
  });
  const seen = new Set();
  const unique = [];
  for (const m of sorted) {
    if (!seen.has(m.nome_produtor)) {
      seen.add(m.nome_produtor);
      unique.push(m);
    }
    if (unique.length >= limit) break;
  }
  response.status(200).send(unique);
});

app.route('/api/playlists').get((request, response) => {
  response.send(PLAYLISTS);
});

// Stems por música (simulação)
function getStemsForId(id) {
  switch (id) {
    case 1:
      return [
        { id: 1, label: 'DRUMS', url: '../../assets/audios/MokBeats_Future_Forest_(DRUMS).mp3' },
        { id: 2, label: 'FX', url: '../../assets/audios/MokBeats_Future_Forest_(EFEITOS).mp3' },
        { id: 3, label: 'HARMONIAS', url: '../../assets/audios/MokBeats_Future_Forest_(HARMONIAS).mp3' },
        { id: 4, label: 'MELODIAS', url: '../../assets/audios/MokBeats_Future_Forest_(MELODIAS).mp3' },
      ];
    case 2:
      return [
        { id: 1, label: 'BATIDA', url: '../../assets/audios/MokBeats_Future_Forest_(DRUMS).mp3' },
        { id: 2, label: 'SFX', url: '../../assets/audios/MokBeats_Future_Forest_(EFEITOS).mp3' },
        { id: 3, label: 'CAMADAS', url: '../../assets/audios/MokBeats_Future_Forest_(HARMONIAS).mp3' },
        { id: 4, label: 'LEADS', url: '../../assets/audios/MokBeats_Future_Forest_(MELODIAS).mp3' },
      ];
    case 3:
      return [
        { id: 1, label: 'PERCUSSÃO', url: '../../assets/audios/MokBeats_Future_Forest_(DRUMS).mp3' },
        { id: 2, label: 'AMBIENTES', url: '../../assets/audios/MokBeats_Future_Forest_(EFEITOS).mp3' },
        { id: 3, label: 'ACORDES', url: '../../assets/audios/MokBeats_Future_Forest_(HARMONIAS).mp3' },
        { id: 4, label: 'TEMAS', url: '../../assets/audios/MokBeats_Future_Forest_(MELODIAS).mp3' },
      ];
    default:
      return [
        { id: 1, label: 'DRUMS', url: '../../assets/audios/MokBeats_Future_Forest_(DRUMS).mp3' },
        { id: 2, label: 'FX', url: '../../assets/audios/MokBeats_Future_Forest_(EFEITOS).mp3' },
        { id: 3, label: 'HARMONIAS', url: '../../assets/audios/MokBeats_Future_Forest_(HARMONIAS).mp3' },
        { id: 4, label: 'MELODIAS', url: '../../assets/audios/MokBeats_Future_Forest_(MELODIAS).mp3' },
      ];
  }
}

app.route('/api/musicas/:id/stems').get((req, res) => {
  const id = parseInt(req.params.id, 10);
  const exists = MUSICAS.some(m => m.id === id);
  if (!exists) return res.status(404).send([]);
  return res.status(200).send(getStemsForId(id));
});

// Alias para stems na nova rota /api/tracks/:id/stems
app.route('/api/tracks/:id/stems').get((req, res) => {
  const id = parseInt(req.params.id, 10);
  const exists = MUSICAS.some(m => m.id === id);
  if (!exists) return res.status(404).send([]);
  return res.status(200).send(getStemsForId(id));
});

app.route('/api/playlists').post((request, response) => {
  let playlist = request.body;

  const firstId = PLAYLISTS ? Math.max.apply(null, PLAYLISTS.map(playlistIterator => playlistIterator.id)) + 1 : 1;
  playlist.id = firstId;
  PLAYLISTS.push(playlist);
  response.status(201).send(playlist);
});

app.route('/api/playlists/:id').put((request, response) => {
  const playlistId = +request.params['id'];
  const playlist = request.body;
  const index = PLAYLISTS.findIndex(playlistIterator => playlistIterator.id === playlistId);
  PLAYLISTS[index] = playlist;
  response.status(200).send(playlist);
});

app.route('/api/playlists/:id').get((request, response) => {
  const playlistId = +request.params['id'];
  response.status(200).send(PLAYLISTS.find(playlistIterator => playlistIterator.id === playlistId));
});

app.route('/api/playlists/:id').delete((request, response) => {
  const playlistId = +request.params['id'];
  PLAYLISTS = PLAYLISTS.filter(playlistIterator => playlistIterator.id !== playlistId);
  response.status(204).send({});
});

app.route('/api/favoritos').get((request, response) => {
  console.log(FAVORITOS);
  response.send(FAVORITOS);
});

app.route('/api/favoritos').post((request, response) => {
  let favorito = request.body;
  console.log(favorito);
  const firstId = FAVORITOS ? Math.max.apply(null, FAVORITOS.map(favoritoIterator => favoritoIterator.id)) + 1 : 1;
  favorito.id = firstId;
  FAVORITOS.push(favorito);
  response.status(201).send(favorito);
});

app.route('/api/favoritos/:id').put((request, response) => {
  const favoritoId = +request.params['id'];
  const favorito = request.body;
  const index = FAVORITOS.findIndex(favoritoIterator => favoritoIterator.id === favoritoId);
  FAVORITOS[index] = favorito;
  response.status(200).send(favorito);
});

app.route('/api/favoritos/:id').get((request, response) => {
  const favoritoId = +request.params['id'];
  response.status(200).send(FAVORITOS.find(favoritoIterator => favoritoIterator.id === favoritoId));
});

app.route('/api/favoritos/:id').delete((request, response) => {
  const favoritoId = +request.params['id'];
  FAVORITOS = FAVORITOS.filter(favoritoIterator => favoritoIterator.id !== favoritoId);
  response.status(204).send({});
});

// Regras de upload de produtores
app.post('/api/producers/track', multipartMiddleware, (req, res) => {
  try {
    const schemaVersion = req.body.schemaVersion;
    const mode = req.body.mode; // 'trackNoStems' | 'trackWithStems' | 'effectsFx'
    const metaRaw = req.body.meta;
    let meta = {};
    try { meta = metaRaw ? JSON.parse(metaRaw) : {}; } catch (e) { meta = {}; }

    const files = req.files || {};

    // V2: contrato do novo formulário de produtores
    if (schemaVersion === 'producer_form_v2') {
      const allowedModes = ['trackNoStems', 'trackWithStems', 'effectsFx'];
      if (!allowedModes.includes(mode)) {
        return res.status(422).json({ message: 'Modo inválido. Use trackNoStems, trackWithStems ou effectsFx.' });
      }

      const track = files.track;
      const image = files.image;
      const stemMelody = files.stem_melody;
      const stemHarmony = files.stem_harmony;
      const stemDrums = files.stem_drums;
      const stemFx = files.stem_fx;
      const effects = [files.effect1, files.effect2, files.effect3, files.effect4, files.effect5, files.effect6];

      if (!track) {
        return res.status(422).json({ message: 'É obrigatório enviar o arquivo Single Track.' });
      }

      if (mode === 'trackNoStems') {
        if (stemMelody || stemHarmony || stemDrums || stemFx || effects.some(Boolean)) {
          return res.status(422).json({ message: 'Modo Single track não permite stems ou efeitos extras.' });
        }
      }

      if (mode === 'trackWithStems') {
        if (!(stemMelody && stemHarmony && stemDrums && stemFx)) {
          return res.status(422).json({ message: 'No modo Single track + Stems, envie Melodias, Harmonias, Ritmos e Efeitos.' });
        }
        if (effects.some(Boolean)) {
          return res.status(422).json({ message: 'No modo Single track + Stems, não envie os campos effect1..effect6.' });
        }
      }

      if (mode === 'effectsFx') {
        if (stemMelody || stemHarmony || stemDrums || stemFx) {
          return res.status(422).json({ message: 'No modo Efeitos (FX), não envie stem_melody/stem_harmony/stem_drums/stem_fx.' });
        }
        if (effects.some((file) => !file)) {
          return res.status(422).json({ message: 'No modo Efeitos (FX), envie todos os arquivos effect1..effect6.' });
        }
      }

      const requiredMeta = ['artistName', 'email', 'countryCode', 'phone', 'identification', 'trackName', 'category', 'genre', 'bpm', 'key', 'saleValue'];
      for (const field of requiredMeta) {
        if (meta?.[field] === undefined || meta?.[field] === null || String(meta?.[field]).trim() === '') {
          return res.status(422).json({ message: `Campo obrigatório ausente no meta: ${field}.` });
        }
      }

      if (!meta?.termsAccepted) {
        return res.status(422).json({ message: 'É obrigatório aceitar os termos e condições.' });
      }

      const email = String(meta?.email || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(422).json({ message: 'Email inválido.' });
      }

      const bpm = parseInt(meta?.bpm, 10);
      if (!Number.isFinite(bpm) || bpm < 1 || bpm > 300) {
        return res.status(422).json({ message: 'BPM inválido. Deve estar entre 1 e 300.' });
      }

      const saleValue = Number(String(meta?.saleValue).replace(',', '.'));
      if (!Number.isFinite(saleValue) || saleValue <= 0) {
        return res.status(422).json({ message: 'Valor de venda inválido. Deve ser maior que zero.' });
      }

      const externalLink = String(meta?.externalLink || '').trim();
      if (externalLink && !/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(externalLink)) {
        return res.status(422).json({ message: 'Link externo inválido. Use http:// ou https://.' });
      }

      // Registro flexível (ao menos um identificador válido)
      const registryRaw = String(meta?.registryRaw || meta?.registryValue || '').trim();
      const isrc = String(meta?.isrc || '').trim();
      const upc = String(meta?.upc || '').trim();
      const hashType = String(meta?.hashType || '').trim().toUpperCase();
      const registryTypeRaw = String(meta?.registryType || '').trim().toUpperCase();
      const registryValue = String(meta?.registryValue || registryRaw).trim();

      const inferRegistryType = () => {
        if (registryTypeRaw) return registryTypeRaw;
        if (/^[A-Za-z0-9]{12}$/.test(isrc || registryRaw)) return 'ISRC';
        if (/^(?:\d{12}|\d{6})$/.test(upc || registryRaw)) return 'UPC';
        if (/^[A-Fa-f0-9]{32}$/.test(registryRaw)) return 'HASH';
        if (/^[A-Fa-f0-9]{40}$/.test(registryRaw)) return 'HASH';
        if (/^[A-Fa-f0-9]{64}$/.test(registryRaw)) return 'HASH';
        if (/^[A-Fa-f0-9]{128}$/.test(registryRaw)) return 'HASH';
        return registryRaw ? 'OUTROS' : '';
      };

      const registryType = inferRegistryType();
      if (!registryType) {
        return res.status(422).json({ message: 'Informe um registro válido (ISRC, UPC, HASH ou OUTROS).' });
      }

      if (registryType === 'ISRC') {
        const value = isrc || registryRaw;
        if (!/^[A-Za-z0-9]{12}$/.test(value)) {
          return res.status(422).json({ message: 'ISRC inválido. Deve conter 12 caracteres alfanuméricos.' });
        }
      } else if (registryType === 'UPC') {
        const value = upc || registryRaw;
        if (!/^(?:\d{12}|\d{6})$/.test(value)) {
          return res.status(422).json({ message: 'UPC inválido. Deve conter 12 dígitos (UPC-A) ou 6 dígitos (UPC-E).' });
        }
      } else if (registryType === 'HASH') {
        const value = registryValue || registryRaw;
        const map = { MD5: 32, 'SHA-1': 40, 'SHA-256': 64, 'SHA-512': 128 };
        let resolvedType = hashType;
        if (!resolvedType) {
          if (/^[A-Fa-f0-9]{32}$/.test(value)) resolvedType = 'MD5';
          else if (/^[A-Fa-f0-9]{40}$/.test(value)) resolvedType = 'SHA-1';
          else if (/^[A-Fa-f0-9]{64}$/.test(value)) resolvedType = 'SHA-256';
          else if (/^[A-Fa-f0-9]{128}$/.test(value)) resolvedType = 'SHA-512';
        }
        const len = map[resolvedType] || 0;
        const re = new RegExp(`^[A-Fa-f0-9]{${len}}$`);
        if (!len || !re.test(value)) {
          return res.status(422).json({ message: 'HASH inválido para o tipo selecionado.' });
        }
      } else if (registryType === 'OUTROS') {
        if (!registryRaw || registryRaw.length < 3) {
          return res.status(422).json({ message: 'Registro inválido. Informe ao menos 3 caracteres para OUTROS.' });
        }
      } else {
        return res.status(422).json({ message: 'Tipo de registro inválido.' });
      }

      // Durações (mesma duração do track para stems/efeitos)
      const TOL = 200; // ms
      const eq = (a, b, tol) => Math.abs(a - b) <= tol;
      const toInt = (v) => typeof v === 'string' ? parseInt(v, 10) : v;
      const d = meta?.durations || {};
      const trackMs = toInt(d?.track_ms);
      if (!trackMs || !Number.isFinite(trackMs)) {
        return res.status(422).json({ message: 'Informe duration_ms da faixa principal (meta.durations.track_ms).' });
      }

      if (mode === 'trackWithStems') {
        let stemDurations = [toInt(d?.stem_melody_ms), toInt(d?.stem_harmony_ms), toInt(d?.stem_drums_ms), toInt(d?.stem_fx_ms)];
        if (stemDurations.some((value) => !value) && Array.isArray(d?.stems_ms)) {
          stemDurations = d.stems_ms.map(toInt);
        }
        if (stemDurations.length !== 4 || stemDurations.some((value) => !value)) {
          return res.status(422).json({ message: 'Informe as durações de todos os stems (melody/harmony/drums/fx).' });
        }
        for (let i = 0; i < stemDurations.length; i++) {
          if (!eq(stemDurations[i], trackMs, TOL)) {
            return res.status(422).json({ message: `Stem #${i + 1} não possui a mesma duração do Single Track.` });
          }
        }
      }

      if (mode === 'effectsFx') {
        let effectDurations = [toInt(d?.effect1_ms), toInt(d?.effect2_ms), toInt(d?.effect3_ms), toInt(d?.effect4_ms), toInt(d?.effect5_ms), toInt(d?.effect6_ms)];
        if (effectDurations.some((value) => !value) && Array.isArray(d?.effects_ms)) {
          effectDurations = d.effects_ms.map(toInt);
        }
        if (effectDurations.length !== 6 || effectDurations.some((value) => !value)) {
          return res.status(422).json({ message: 'Informe as durações de todos os efeitos (effect1_ms..effect6_ms).' });
        }
        for (let i = 0; i < effectDurations.length; i++) {
          if (!eq(effectDurations[i], trackMs, TOL)) {
            return res.status(422).json({ message: `Efeito #${i + 1} não possui a mesma duração do Single Track.` });
          }
        }
      }

      return res.status(200).json({
        message: 'Upload v2 validado e recebido com sucesso.',
        schemaVersion,
        mode,
        files: Object.keys(files),
        hasImage: !!image,
      });
    }

    // Legacy: mantém compatibilidade com formulário antigo
    const track = files.track; // único
    const stems = toArray(files.stem); // 0..4
    const loop15 = files.loop15;
    const loop30 = files.loop30;
    const loop60 = files.loop60;

    if (!track) {
      return res.status(422).json({ message: 'É obrigatório enviar uma música completa (track).' });
    }

    // Validação de modo
    if (mode === 'trackNoStems') {
      if (stems.length > 0) {
        return res.status(422).json({ message: 'Modo sem stems selecionado, mas arquivos de stems foram enviados.' });
      }
    } else if (mode === 'trackWithStems') {
      if (stems.length < 1 || stems.length > 4) {
        return res.status(422).json({ message: 'Envie entre 1 e 4 stems quando o modo "com stems" estiver selecionado.' });
      }
    } else {
      return res.status(422).json({ message: 'Modo inválido. Use trackNoStems ou trackWithStems.' });
    }

    // Loops obrigatórios
    if (!loop15 || !loop30 || !loop60) {
      return res.status(422).json({ message: 'Envie os loops obrigatórios de 15s, 30s e 60s.' });
    }

    // Validações de duração (opcionalmente usando metadados)
    const TOL = 200; // ms
    const eq = (a, b, tol) => Math.abs(a - b) <= tol;
    const toInt = (v) => typeof v === 'string' ? parseInt(v, 10) : v;

    if (meta && meta.durations) {
      const d = meta.durations;
      if (mode === 'trackWithStems') {
        const tms = toInt(d?.track_ms);
        if (!tms) return res.status(422).json({ message: 'Informe duration_ms da música completa (meta.durations.track_ms).' });
        const stemsMs = d?.stems_ms || [];
        if (!Array.isArray(stemsMs) || stemsMs.length !== stems.length) {
          return res.status(422).json({ message: 'Informe durations dos stems compatível com a quantidade enviada.' });
        }
        for (let i = 0; i < stemsMs.length; i++) {
          if (!eq(toInt(stemsMs[i]), tms, TOL)) {
            return res.status(422).json({ message: `Stem #${i + 1} não possui a mesma duração da música completa.` });
          }
        }
      }
      // Loops 15/30/60s
      const l15 = toInt(d?.loop15_ms);
      const l30 = toInt(d?.loop30_ms);
      const l60 = toInt(d?.loop60_ms);
      if (!(l15 && l30 && l60)) {
        return res.status(422).json({ message: 'Informe as durações dos loops (meta.durations.loop15_ms/loop30_ms/loop60_ms).' });
      }
      if (!eq(l15, 15000, TOL) || !eq(l30, 30000, TOL) || !eq(l60, 60000, TOL)) {
        return res.status(422).json({ message: 'Loops devem ter 15s, 30s e 60s (±200ms).\nVerifique as durações informadas.' });
      }
    }

    // Validações ISRC/UPC/HASH
    const isrc = meta?.isrc;
    const upc = meta?.upc;
    if (!isrc || !/^[A-Za-z0-9]{12}$/.test(isrc)) {
      return res.status(422).json({ message: 'ISRC inválido. Deve conter 12 caracteres alfanuméricos.' });
    }
    if (!upc || !/^(?:\d{12}|\d{6})$/.test(upc)) {
      return res.status(422).json({ message: 'UPC inválido. Deve conter 12 dígitos (UPC-A) ou 6 dígitos (UPC-E).' });
    }
    if (meta?.registryType === 'HASH') {
      const hv = meta?.registryValue || '';
      const ht = meta?.hashType;
      const map = { 'MD5': 32, 'SHA-1': 40, 'SHA-256': 64, 'SHA-512': 128 };
      const len = map[ht] || 0;
      const re = new RegExp(`^[A-Fa-f0-9]{${len}}$`);
      if (!len || !re.test(hv)) {
        return res.status(422).json({ message: 'HASH inválido para o tipo selecionado.' });
      }
    }

    // Sucesso (simulação)
    return res.status(200).json({ message: 'Upload validado e recebido com sucesso.', files: Object.keys(files) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Erro interno ao processar upload.' });
  }
});

function toArray(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x;
  return [x];
}

/**
 * Carrega músicas do arquivo JSON com peaks pré-calculados
 * Se o arquivo não existir, retorna array vazio
 * @returns {Array} Array de músicas com peaks reais
 */
function loadMusicasFromJSON() {
  const fs = require('fs');
  const path = require('path');
  const jsonPath = path.join(__dirname, '../data/musicas.json');

  try {
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      console.log(`✅ ${data.musicas.length} músicas carregadas do JSON com peaks reais`);
      return data.musicas;
    } else {
      console.warn('⚠️  Arquivo musicas.json não encontrado. Execute: node scripts/generate-peaks.js');
      return [];
    }
  } catch (error) {
    console.error('❌ Erro ao carregar musicas.json:', error.message);
    return [];
  }
}

// Carrega músicas do JSON (com peaks reais) ou usa fallback se não existir
var MUSICAS = loadMusicasFromJSON();

// Fallback: Se JSON não existir, usa dados hardcoded (sem peaks reais)
if (MUSICAS.length === 0) {
  console.warn('⚠️  Usando dados hardcoded como fallback. Para peaks reais, execute: node scripts/generate-peaks.js');
  MUSICAS = [
  {
    id: 1,
    nome_musica: "HighFrenetic",
    nome_produtor: "Xalaika",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "EDM",
    subgenero: "Dance",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Sintetizador", "Bateria Eletrônica", "Baixo Sintetizado"],
    vozes: "Instrumental",
    created_at: "2024-01-15T10:30:00Z",
    peaks: []
  },
  {
    id: 2,
    nome_musica: "Maleficus Chaos",
    nome_produtor: "Luan Bolico",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rock",
    subgenero: "Hard Rock",
    humor: "Agressivo",
    instrumentos: ["Guitarra Elétrica", "Bateria", "Baixo Elétrico"],
    vozes: "Instrumental",
    created_at: "2024-01-20T14:15:00Z",
    peaks: []
  },
  {
    id: 3,
    nome_musica: "Impertinent",
    nome_produtor: "Hagy Fantasy",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Pop",
    subgenero: "Indie Pop",
    humor: "Feliz / Alegre",
    instrumentos: ["Piano", "Violão", "Baixo Acústico", "Bateria"],
    vozes: "Instrumental",
    created_at: "2024-01-25T09:45:00Z",
    peaks: []
  },
  {
    id: 4,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental",
    created_at: "2024-01-30T11:20:00Z",
    peaks: []
  },
  {
    id: 5,
    nome_musica: "Code",
    nome_produtor: "Bonieky",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Eletrônica",
    subgenero: "Experimental",
    humor: "Ficção Científica / Futurista",
    instrumentos: ["Sintetizador Modular", "Sequenciador", "Drum Machine"],
    vozes: "Instrumental",
    created_at: "2024-02-04T16:10:00Z",
    peaks: []
  },
  {
    id: 6,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental",
    created_at: "2024-02-09T13:30:00Z",
    peaks: []
  },
  {
    id: 7,
    nome_musica: "HighFrenetic",
    nome_produtor: "Xalaika",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "EDM",
    subgenero: "Dance",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Sintetizador", "Bateria Eletrônica", "Baixo Sintetizado"],
    vozes: "Instrumental",
    created_at: "2024-02-14T08:00:00Z",
    peaks: []
  },
  {
    id: 8,
    nome_musica: "Maleficus Chaos",
    nome_produtor: "Luan Bolico",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rock",
    subgenero: "Hard Rock",
    humor: "Agressivo",
    instrumentos: ["Guitarra Elétrica", "Bateria", "Baixo Elétrico"],
    vozes: "Instrumental",
    created_at: "2024-02-19T15:45:00Z",
    peaks: []
  },
  {
    id: 9,
    nome_musica: "Impertinent",
    nome_produtor: "Hagy Fantasy",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Pop",
    subgenero: "Indie Pop",
    humor: "Feliz / Alegre",
    instrumentos: ["Piano", "Violão", "Baixo Acústico", "Bateria"],
    vozes: "Instrumental",
    created_at: "2024-02-24T12:15:00Z",
    peaks: []
  },
  {
    id: 10,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental",
    created_at: "2024-02-29T17:25:00Z",
    peaks: []
  },
  {
    id: 11,
    nome_musica: "Code",
    nome_produtor: "Bonieky",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Eletrônica",
    subgenero: "Experimental",
    humor: "Ficção Científica / Futurista",
    instrumentos: ["Sintetizador Modular", "Sequenciador", "Drum Machine"],
    vozes: "Instrumental",
    created_at: "2024-03-05T14:00:00Z",
    peaks: []
  },
  {
    id: 12,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental",
    created_at: "2024-03-10T10:35:00Z",
    peaks: []
  },
  {
    id: 13,
    nome_musica: "HighFrenetic",
    nome_produtor: "Xalaika",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "EDM",
    subgenero: "Dance",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Sintetizador", "Bateria Eletrônica", "Baixo Sintetizado"],
    vozes: "Instrumental",
    created_at: "2024-03-15T16:50:00Z",
    peaks: []
  },
  {
    id: 14,
    nome_musica: "Maleficus Chaos",
    nome_produtor: "Luan Bolico",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rock",
    subgenero: "Hard Rock",
    humor: "Agressivo",
    instrumentos: ["Guitarra Elétrica", "Bateria", "Baixo Elétrico"],
    vozes: "Instrumental",
    created_at: "2024-03-20T09:10:00Z",
    peaks: []
  },
  {
    id: 15,
    nome_musica: "Impertinent",
    nome_produtor: "Hagy Fantasy",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Pop",
    subgenero: "Indie Pop",
    humor: "Feliz / Alegre",
    instrumentos: ["Piano", "Violão", "Baixo Acústico", "Bateria"],
    vozes: "Instrumental",
    created_at: "2024-03-25T13:40:00Z",
    peaks: []
  },
  {
    id: 16,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental",
    peaks: []
  },
  {
    id: 17,
    nome_musica: "Code",
    nome_produtor: "Bonieky",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Eletrônica",
    subgenero: "Experimental",
    humor: "Ficção Científica / Futurista",
    instrumentos: ["Sintetizador Modular", "Sequenciador", "Drum Machine"],
    vozes: "Instrumental",
    peaks: []
  },
  {
    id: 18,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental",
    peaks: []
  },
  {
    id: 19,
    nome_musica: "HighFrenetic",
    nome_produtor: "Xalaika",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "EDM",
    subgenero: "Dance",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Sintetizador", "Bateria Eletrônica", "Baixo Sintetizado"],
    vozes: "Instrumental",
    peaks: []
  },
  {
    id: 20,
    nome_musica: "Maleficus Chaos",
    nome_produtor: "Luan Bolico",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rock",
    subgenero: "Hard Rock",
    humor: "Agressivo",
    instrumentos: ["Guitarra Elétrica", "Bateria", "Baixo Elétrico"],
    vozes: "Instrumental",
    peaks: []
  },
  {
    id: 21,
    nome_musica: "Impertinent",
    nome_produtor: "Hagy Fantasy",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Pop",
    subgenero: "Indie Pop",
    humor: "Feliz / Alegre",
    instrumentos: ["Piano", "Violão", "Baixo Acústico", "Bateria"],
    vozes: "Instrumental",
    peaks: []
  },
  {
    id: 22,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental",
    peaks: []
  },
  {
    id: 23,
    nome_musica: "Code",
    nome_produtor: "Bonieky",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Eletrônica",
    subgenero: "Experimental",
    humor: "Ficção Científica / Futurista",
    instrumentos: ["Sintetizador Modular", "Sequenciador", "Drum Machine"],
    vozes: "Instrumental",
    peaks: []
  },
  {
    id: 24,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental",
    peaks: []
  }
  ]; // Fim do fallback
}

// Função para normalizar URLs de áudio
// Converte caminhos relativos (../../assets/audios/file.mp3) para absolutos (/assets/audios/file.mp3)
// Isso permite que o backend sirva os arquivos através do endpoint estático
function normalizeAudioUrl(url) {
  if (!url) return url;

  // Se URL já é absoluta ou começa com /, mantém
  if (url.startsWith('http') || url.startsWith('/assets/')) {
    return url;
  }

  // Extrai apenas o nome do arquivo de caminhos relativos
  const fileName = url.split('/').pop();
  return `/assets/audios/${fileName}`;
}

// Enriquecimento do modelo in-memory com arrays de stems e loops
// Mantemos o campo numérico existente `loops` para compatibilidade com o front atual
// e adicionamos:
//  - `stems: { id, url, duration_ms, type }[]`
//  - `loops_variants: { len_sec, url, duration_ms }[]`
// As URLs de stems são as mesmas usadas pela simulação de getStemsForId,
// durations dos stems seguem a duração completa da faixa; os loops usam 15/30/60s.
//
// NOTA: Peaks não são mais gerados no backend. O WaveSurfer no frontend
// processará o áudio real para gerar waveforms autênticos.
MUSICAS = MUSICAS.map(m => {
  // Normaliza URL do áudio principal para usar endpoint do backend
  m.url = normalizeAudioUrl(m.url);
  try {
    const stemsBase = (getStemsForId(m.id) || []).map((s, idx) => ({
      id: idx + 1,
      url: normalizeAudioUrl(s.url), // Normaliza URLs dos stems também
      duration_ms: m.duracao || 0,
      type: s.label || `STEM ${idx + 1}`,
    }));
    const loopsVariants = [
      { len_sec: 15, url: m.url, duration_ms: 15000 },
      { len_sec: 30, url: m.url, duration_ms: 30000 },
      { len_sec: 60, url: m.url, duration_ms: 60000 },
    ];

    return { ...m, stems: stemsBase, loops_variants: loopsVariants };
  } catch (_) {
    return m;
  }
});

console.log(`✅ ${MUSICAS.length} músicas carregadas com URLs normalizadas para /assets/audios/`);

var PLAYLISTS = [
  {
    name: "testeNIT2",
    data_alteracao: "30/12/2023",
    description: "testeinit2Description",
    music: [
      {
        id: 1,
        nome_musica: "HighFrenetic",
        nome_produtor: "Xalaika",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      },
      {
        id: 2,
        nome_musica: "Maleficus Chaos",
        nome_produtor: "Luan Bolico",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      },
      {
        id: 3,
        nome_musica: "Impertinent",
        nome_produtor: "Hagy Fantasy",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      },
      {
        id: 4,
        nome_musica: "The Funkster",
        nome_produtor: "Sweet Spot",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      }
    ],
    id: 1
  },
  {
    name: "New Paylist",
    data_alteracao: "18/11/2023",
    description: "description playlist",
    music: [
      {
        id: 1,
        nome_musica: "HighFrenetic",
        nome_produtor: "Xalaika",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      }
    ],
    id: 2
  },
  {
    name: "HighBM",
    data_alteracao: "18/11/2023",
    description: "acelero",
    music: [
      {
        id: 2,
        nome_musica: "Maleficus Chaos",
        nome_produtor: "Luan Bolico",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      }
    ],
    id: 3
  },
  {
    name: "novaP",
    data_alteracao: "18/11/2023",
    description: "descricao",
    music: [
      {
        id: 1,
        nome_musica: "HighFrenetic",
        nome_produtor: "Xalaika",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      }
    ],
    id: 4
  },
  {
    name: "hagy",
    data_alteracao: "18/11/2023",
    description: "impertinent",
    music: [
      {
        id: 3,
        nome_musica: "Impertinent",
        nome_produtor: "Hagy Fantasy",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      }
    ],
    id: 5
  },
  {
    name: "test1",
    data_alteracao: "18/11/2023",
    description: "desc1",
    music: [
      {
        id: 2,
        nome_musica: "Maleficus Chaos",
        nome_produtor: "Luan Bolico",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      },
      {
        id: 3,
        nome_musica: "Impertinent",
        nome_produtor: "Hagy Fantasy",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      }
    ],
    id: 6
  },
  {
    name: "test2",
    data_alteracao: "18/11/2023",
    description: "desc2",
    music: [
      {
        id: 1,
        nome_musica: "HighFrenetic",
        nome_produtor: "Xalaika",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      },
      {
        id: 3,
        nome_musica: "Impertinent",
        nome_produtor: "Hagy Fantasy",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      }
    ],
    id: 7
  },
  {
    name: "testEd",
    data_alteracao: "18/11/2023",
    description: "descEnd",
    music: [
      {
        id: 1,
        nome_musica: "HighFrenetic",
        nome_produtor: "Xalaika",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      },
      {
        id: 2,
        nome_musica: "Maleficus Chaos",
        nome_produtor: "Luan Bolico",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      }
    ],
    id: 8
  },
  {
    name: "1test",
    data_alteracao: "19/11/2023",
    description: "1desc",
    music: [
      {
        id: 1,
        nome_musica: "HighFrenetic",
        nome_produtor: "Xalaika",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      },
      {
        id: 3,
        nome_musica: "Impertinent",
        nome_produtor: "Hagy Fantasy",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      }
    ],
    id: 9
  },
  {
    name: "Code",
    description: "bonieky",
    data_alteracao: "28/12/2023",
    music: [
      {
        id: 5,
        nome_musica: "Code",
        nome_produtor: "Bonieky",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      }
    ],
    id: 13
  },
  {
    name: "code2",
    description: "boniekylacerda",
    data_alteracao: "28/12/2023",
    music: [
      {
        id: 5,
        nome_musica: "Code",
        nome_produtor: "Bonieky",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      }
    ],
    id: 14
  },
  {
    name: "AFudrica",
    description: "theFunkester",
    data_alteracao: "28/12/2023",
    music: [
      {
        id: 6,
        nome_musica: "The Funkster",
        nome_produtor: "Sweet Spot",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      }
    ],
    id: 15
  },
  {
    name: "foraDeOrdemPlaylist",
    description: "testando icone amarelo fora de ordem",
    data_alteracao: "31/12/2023",
    music: [
      {
        id: 9,
        nome_musica: "Impertinent",
        nome_produtor: "Hagy Fantasy",
        duracao: 180000,
        bpm: 95,
        trechos: 60,
        loops: 7
      }
    ],
    id: 16
  }
];

var FAVORITOS = [
  {
    id: 1,
    nome_musica: "HighFrenetic",
    nome_produtor: "Xalaika",
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 2,
    nome_musica: "Maleficus Chaos",
    nome_produtor: "Luan Bolico",
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 3,
    nome_musica: "Impertinent",
    nome_produtor: "Hagy Fantasy",
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 4,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 5,
    nome_musica: "Code",
    nome_produtor: "Bonieky",
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 6,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 7,
    nome_musica: "HighFrenetic",
    nome_produtor: "Xalaika",
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 8,
    nome_musica: "Maleficus Chaos",
    nome_produtor: "Luan Bolico",
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 9,
    nome_musica: "Impertinent",
    nome_produtor: "Hagy Fantasy",
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 12,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    duracao: 180000,
    duracaoReal: 193.5, // Duração real em segundos (3:05)
    bpm: 95,
    trechos: 60,
    loops: 7
  }
];
