const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Auth básico (mock) para destravar login no front
// Aceita qualquer e-mail válido e senha com 8+ caracteres, retorna um token
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body || {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRe.test(email)) {
      return res.status(400).json({ message: 'E-mail inválido.' });
    }
    if (!password || String(password).length < 8) {
      return res.status(400).json({ message: 'Senha deve ter no mínimo 8 caracteres.' });
    }

    // Gera um token simples (mock) — em produção real, emitir JWT
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    return res.status(200).json({ token, user: { email } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Erro ao autenticar.' });
  }
});

const multipartMiddleware = multipart({ uploadDir: './uploads' });
app.post('/api/uploads/', multipartMiddleware, (req, res) => {
  const files = req.files;
  console.log(files);
  res.json({ message: files });
});

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
  response.send(MUSICAS);
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

  response.status(200).send(musicasFiltradas);
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

// Stub login para testes
app.route('/api/auth/login').post((req, res) => {
  const { email, password } = req.body;

  // Credenciais de teste fixas
  if (email === 'test@mokbeats.com' && password === 'test12345') {
    return res.status(200).json({
      token: 'mock-jwt-token-' + Date.now(),
      user: { email, name: 'Test User' }
    });
  }

  return res.status(401).json({
    error: 'Credenciais inválidas'
  });
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
    const mode = req.body.mode; // 'trackNoStems' | 'trackWithStems'
    const metaRaw = req.body.meta;
    let meta = {};
    try { meta = metaRaw ? JSON.parse(metaRaw) : {}; } catch (e) { meta = {}; }

    const files = req.files || {};
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
            return res.status(422).json({ message: `Stem #${i+1} não possui a mesma duração da música completa.` });
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


var MUSICAS = [
  {
    id: 1,
    nome_musica: "HighFrenetic",
    nome_produtor: "Xalaika",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "EDM",
    subgenero: "Dance",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Sintetizador", "Bateria Eletrônica", "Baixo Sintetizado"],
    vozes: "Instrumental",
    created_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    nome_musica: "Maleficus Chaos",
    nome_produtor: "Luan Bolico",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rock",
    subgenero: "Hard Rock",
    humor: "Agressivo",
    instrumentos: ["Guitarra Elétrica", "Bateria", "Baixo Elétrico"],
    vozes: "Instrumental",
    created_at: "2024-01-20T14:15:00Z"
  },
  {
    id: 3,
    nome_musica: "Impertinent",
    nome_produtor: "Hagy Fantasy",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Pop",
    subgenero: "Indie Pop",
    humor: "Feliz / Alegre",
    instrumentos: ["Piano", "Violão", "Baixo Acústico", "Bateria"],
    vozes: "Instrumental",
    created_at: "2024-01-25T09:45:00Z"
  },
  {
    id: 4,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental",
    created_at: "2024-01-30T11:20:00Z"
  },
  {
    id: 5,
    nome_musica: "Code",
    nome_produtor: "Bonieky",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Eletrônica",
    subgenero: "Experimental",
    humor: "Ficção Científica / Futurista",
    instrumentos: ["Sintetizador Modular", "Sequenciador", "Drum Machine"],
    vozes: "Instrumental",
    created_at: "2024-02-04T16:10:00Z"
  },
  {
    id: 6,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental",
    created_at: "2024-02-09T13:30:00Z"
  },
  {
    id: 7,
    nome_musica: "HighFrenetic",
    nome_produtor: "Xalaika",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "EDM",
    subgenero: "Dance",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Sintetizador", "Bateria Eletrônica", "Baixo Sintetizado"],
    vozes: "Instrumental",
    created_at: "2024-02-14T08:00:00Z"
  },
  {
    id: 8,
    nome_musica: "Maleficus Chaos",
    nome_produtor: "Luan Bolico",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rock",
    subgenero: "Hard Rock",
    humor: "Agressivo",
    instrumentos: ["Guitarra Elétrica", "Bateria", "Baixo Elétrico"],
    vozes: "Instrumental",
    created_at: "2024-02-19T15:45:00Z"
  },
  {
    id: 9,
    nome_musica: "Impertinent",
    nome_produtor: "Hagy Fantasy",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Pop",
    subgenero: "Indie Pop",
    humor: "Feliz / Alegre",
    instrumentos: ["Piano", "Violão", "Baixo Acústico", "Bateria"],
    vozes: "Instrumental",
    created_at: "2024-02-24T12:15:00Z"
  },
  {
    id: 10,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental",
    created_at: "2024-02-29T17:25:00Z"
  },
  {
    id: 11,
    nome_musica: "Code",
    nome_produtor: "Bonieky",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Eletrônica",
    subgenero: "Experimental",
    humor: "Ficção Científica / Futurista",
    instrumentos: ["Sintetizador Modular", "Sequenciador", "Drum Machine"],
    vozes: "Instrumental",
    created_at: "2024-03-05T14:00:00Z"
  },
  {
    id: 12,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental",
    created_at: "2024-03-10T10:35:00Z"
  },
  {
    id: 13,
    nome_musica: "HighFrenetic",
    nome_produtor: "Xalaika",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "EDM",
    subgenero: "Dance",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Sintetizador", "Bateria Eletrônica", "Baixo Sintetizado"],
    vozes: "Instrumental",
    created_at: "2024-03-15T16:50:00Z"
  },
  {
    id: 14,
    nome_musica: "Maleficus Chaos",
    nome_produtor: "Luan Bolico",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rock",
    subgenero: "Hard Rock",
    humor: "Agressivo",
    instrumentos: ["Guitarra Elétrica", "Bateria", "Baixo Elétrico"],
    vozes: "Instrumental",
    created_at: "2024-03-20T09:10:00Z"
  },
  {
    id: 15,
    nome_musica: "Impertinent",
    nome_produtor: "Hagy Fantasy",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Pop",
    subgenero: "Indie Pop",
    humor: "Feliz / Alegre",
    instrumentos: ["Piano", "Violão", "Baixo Acústico", "Bateria"],
    vozes: "Instrumental",
    created_at: "2024-03-25T13:40:00Z"
  },
  {
    id: 16,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental"
  },
  {
    id: 17,
    nome_musica: "Code",
    nome_produtor: "Bonieky",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Eletrônica",
    subgenero: "Experimental",
    humor: "Ficção Científica / Futurista",
    instrumentos: ["Sintetizador Modular", "Sequenciador", "Drum Machine"],
    vozes: "Instrumental"
  },
  {
    id: 18,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental"
  },
  {
    id: 19,
    nome_musica: "HighFrenetic",
    nome_produtor: "Xalaika",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "EDM",
    subgenero: "Dance",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Sintetizador", "Bateria Eletrônica", "Baixo Sintetizado"],
    vozes: "Instrumental"
  },
  {
    id: 20,
    nome_musica: "Maleficus Chaos",
    nome_produtor: "Luan Bolico",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rock",
    subgenero: "Hard Rock",
    humor: "Agressivo",
    instrumentos: ["Guitarra Elétrica", "Bateria", "Baixo Elétrico"],
    vozes: "Instrumental"
  },
  {
    id: 21,
    nome_musica: "Impertinent",
    nome_produtor: "Hagy Fantasy",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Pop",
    subgenero: "Indie Pop",
    humor: "Feliz / Alegre",
    instrumentos: ["Piano", "Violão", "Baixo Acústico", "Bateria"],
    vozes: "Instrumental"
  },
  {
    id: 22,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental"
  },
  {
    id: 23,
    nome_musica: "Code",
    nome_produtor: "Bonieky",
    // url: '../../assets/audios/Tipo_Minato.mp3',
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Eletrônica",
    subgenero: "Experimental",
    humor: "Ficção Científica / Futurista",
    instrumentos: ["Sintetizador Modular", "Sequenciador", "Drum Machine"],
    vozes: "Instrumental"
  },
  {
    id: 24,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    url: '../../assets/audios/MokBeats_Future_Forest_(FULL).mp3',
    // url: '../../assets/audios/Vibe_Shisui.mp3',
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7,
    genero: "Rhythm and blues",
    subgenero: "Funk",
    humor: "Bem-Estar / Sentir-se Bem",
    instrumentos: ["Baixo Elétrico", "Guitarra Funk", "Bateria", "Teclados"],
    vozes: "Instrumental"
  }
];

// Enriquecimento do modelo in-memory com arrays de stems e loops
// Mantemos o campo numérico existente `loops` para compatibilidade com o front atual
// e adicionamos:
//  - `stems: { id, url, duration_ms, type }[]`
//  - `loops_variants: { len_sec, url, duration_ms }[]`
// As URLs de stems são as mesmas usadas pela simulação de getStemsForId,
// durations dos stems seguem a duração completa da faixa; os loops usam 15/30/60s.
MUSICAS = MUSICAS.map(m => {
  try {
    const stemsBase = (getStemsForId(m.id) || []).map((s, idx) => ({
      id: idx + 1,
      url: s.url,
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
  },
  {
    id: 5,
    nome_musica: "Code",
    nome_produtor: "Bonieky",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 6,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 7,
    nome_musica: "HighFrenetic",
    nome_produtor: "Xalaika",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 8,
    nome_musica: "Maleficus Chaos",
    nome_produtor: "Luan Bolico",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 9,
    nome_musica: "Impertinent",
    nome_produtor: "Hagy Fantasy",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 12,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  }
];
