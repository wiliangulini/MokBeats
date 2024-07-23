const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

const multipartMiddleware = multipart({ uploadDir: './uploads' });
app.post('/upload', multipartMiddleware, (req, res) => {
  const files = req.files;
  console.log(files);
  res.json({ message: files });
});

app.use((err, req, res, next) => res.json({ message: err.message }));


app.listen(3100, () => {
  console.log('Server Started!');
});

app.route('/api/uploads').get((request, response) => {
  response.send(UPLOADS);
});
app.route('/api/uploads').post((request, response) => {
  let upload = request.body;

  const firstId = UPLOADS ? Math.max.apply(null, UPLOADS.map(uploadIterator => uploadIterator.id)) + 1 : 1;
  upload.id = firstId;
  UPLOADS.push(upload);
  response.status(201).send(upload);
});
app.route('/api/uploads/:id').put((request, response) => {
  const uploadId = +request.params['id'];
  const upload = request.body;
  const index = UPLOADS.findIndex(uploadIterator => uploadIterator.id === uploadId);
  UPLOADS[index] = upload;
  response.status(200).send(upload);
});
app.route('/api/uploads/:id').get((request, response) => {
  const uploadId = +request.params['id'];
  response.status(200).send(UPLOADS.find(uploadIterator => uploadIterator.id === uploadId));
});

app.route('/api/uploads/:id').delete((request, response)=> {
  const uploadId = +request.params['id'];
  UPLOADS = UPLOADS.filter(uploadIterator => uploadIterator.id !== uploadId);
  response.status(204).send({});
});

var UPLOADS = [
  {
    id: 1,
    name: '1inhd.png',
    size: 2908,
    type: 'image/png',
    base64: 'data:image/png;base64,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'
  }
];


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

app.route('/api/musicas/:id').delete((request, response)=> {
  const musicaId = +request.params['id'];
  MUSICAS = MUSICAS.filter(musicaIterator => musicaIterator.id !== musicaId);
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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
    loops: 7
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

app.route('/api/playlists/:id').delete((request, response)=> {
  const playlistId = +request.params['id'];
  PLAYLISTS = PLAYLISTS.filter(playlistIterator => playlistIterator.id !== playlistId);
  response.status(204).send({});
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

app.route('/api/favoritos/:id').delete((request, response)=> {
  const favoritoId = +request.params['id'];
  FAVORITOS = FAVORITOS.filter(favoritoIterator => favoritoIterator.id !== favoritoId);
  response.status(204).send({});
});


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
