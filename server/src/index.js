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
  const generos = [...new Set(MUSICAS.map(musica => musica.genero))].filter(g => g).sort();
  response.status(200).send(generos);
});

app.route('/api/humores').get((request, response) => {
  const humores = [...new Set(MUSICAS.map(musica => musica.humor))].filter(h => h).sort();
  response.status(200).send(humores);
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

  response.status(200).send(musicasFiltradas);
});

app.route('/api/playlists').get((request, response) => {
  response.send(PLAYLISTS);
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
    vozes: "Instrumental"
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
    vozes: "Instrumental"
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
    vozes: "Instrumental"
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
    vozes: "Instrumental"
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
    vozes: "Instrumental"
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
  }
];

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
