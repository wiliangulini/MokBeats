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
//loiane aula 138 removendo cors, acredito q precise usar um app.get e nao post pra pegar itens do back end criado.
app.use(cors(corsOptions));

const multipartMiddleware = multipart({ uploadDir: './uploads' });
app.post('/upload', multipartMiddleware, (req, res) => {
  const files = req.files;
  console.log(files);
  res.json({ message: files });
});



app.listen(3100, () => {
  console.log('Server Started!');
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

app.route('/api/musicas/:id').delete((request, response)=> {
  const musicaId = +request.params['id'];
  MUSICAS = MUSICAS.filter(musicaIterator => musicaIterator.id !== musicaId);
  response.status(204).send({});
});

// app.listen(8000, () => {
//   console.log('servidor porta 8000');
// });
//
// var COURSES = [
//     {
//         id: 1,
//         name: 'Angular: CLI',
//         releaseDate: 'November 2, 2019',
//         description: 'Neste curso, os alunos irão obter um grande conhecimento nos principais recursos do CLI.',
//         duration: 120,
//         code: 'XLF-1212',
//         rating: 3,
//         price: 12.99,
//         imageUrl: '/assets/images/cli.png',
//     },
//     {
//         id: 2,
//         name: 'Angular: Forms',
//         releaseDate: 'November 4, 2019',
//         description: 'Neste curso, os alunos irão obter um conhecimento aprofundado sobre os recursos disponíveis no módulo de Forms.',
//         duration: 80,
//         code: 'DWQ-3412',
//         rating: 3.5,
//         price: 24.99,
//         imageUrl: '/assets/images/forms.png',
//     },
//     {
//         id: 3,
//         name: 'Angular: HTTP',
//         releaseDate: 'November 8, 2019',
//         description: 'Neste curso, os alunos irão obter um conhecimento aprofundado sobre os recursos disponíveis no módulo de HTTP.',
//         duration: 80,
//         code: 'QPL-0913',
//         rating: 4.0,
//         price: 36.99,
//         imageUrl: '/assets/images/http.png',
//     },
//     {
//         id: 4,
//         name: 'Angular: Router',
//         releaseDate: 'November 16, 2019',
//         description: 'Neste curso, os alunos irão obter um conhecimento aprofundado sobre os recursos disponíveis no módulo de Router.',
//         duration: 80,
//         code: 'OHP-1095',
//         rating: 4.5,
//         price: 46.99,
//         imageUrl: '/assets/images/router.png',
//     },
//     {
//         id: 5,
//         name: 'Angular: Animations',
//         releaseDate: 'November 25, 2019',
//         description: 'Neste curso, os alunos irão obter um conhecimento aprofundado sobre os recursos disponíveis sobre Animation.',
//         duration: 80,
//         code: 'PWY-9381',
//         rating: 5,
//         price: 56.99,
//         imageUrl: '/assets/images/animations.png',
//     }
// ];

var MUSICAS = [
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
    id: 10,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 11,
    nome_musica: "Code",
    nome_produtor: "Bonieky",
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
  },
  {
    id: 13,
    nome_musica: "HighFrenetic",
    nome_produtor: "Xalaika",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 14,
    nome_musica: "Maleficus Chaos",
    nome_produtor: "Luan Bolico",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 15,
    nome_musica: "Impertinent",
    nome_produtor: "Hagy Fantasy",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 16,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 17,
    nome_musica: "Code",
    nome_produtor: "Bonieky",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 18,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 19,
    nome_musica: "HighFrenetic",
    nome_produtor: "Xalaika",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 20,
    nome_musica: "Maleficus Chaos",
    nome_produtor: "Luan Bolico",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 21,
    nome_musica: "Impertinent",
    nome_produtor: "Hagy Fantasy",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 22,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 23,
    nome_musica: "Code",
    nome_produtor: "Bonieky",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  },
  {
    id: 24,
    nome_musica: "The Funkster",
    nome_produtor: "Sweet Spot",
    duracao: 180000,
    bpm: 95,
    trechos: 60,
    loops: 7
  }
];
