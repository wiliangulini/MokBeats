import {Injectable} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddPlaylistModalComponent} from "../add-playlist-modal/add-playlist-modal.component";
import {DownloadAmostraComponent} from "../download-amostra/download-amostra.component";
import {AuthService} from "../login/auth.service";
import {FavoritosService} from "../favoritos/favoritos.service";

export interface Music {
  id: number;
  nome_musica: string;
  nome_produtor: string;
  duracao: number;
  bpm: number;
  trechos: number;
  loops: number;
}

@Injectable({
  providedIn: 'root'
})
export class MusicasService {

  hearth: any;
  hearth1: any;
  addMusicPlaylist: any;
  downloadMusic: any[] = [];
  convertida: Array<any> = [];
  convertida2: Array<any> = [];

  public genero: any = [
    {
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
        "Spain",
        "Suécia",
        "Índia",
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
        "Ópera",
      ],
      "Corporativo": [
        "Incidental",
        "Inspiradora",
        "Motivacional",
      ],
      "Dance/Tecno": [
        "Bhangra Trap",
        "Bounce",
        "Break",
        "Dance",
        "Dance Pop",
        "Deep House",
        "DnB",
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
        "Tropical House",
      ],
      "Datas comemorativas": [
        "Dia da Independência",
        "Dia das Bruxas",
        "NYE",
        "Natal",
        "Patriótica/presidencial",
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
        "Vaporwave",
      ],
      "Folk": [
        "Acústico",
        "Folk pop",
        "Folk rock",
        "Folktronica",
        "Indie Folk",
      ],
      "Hip Hop": [
        "Crunk",
        "Gangsta",
        "Hick",
        "Hop",
        "Hip",
        "hop",
        "old",
        "school",
        "Hyphy",
        "Rap",
        "Rap",
        "emo",
        "Trap",
        "Twerk,"
      ],
      "Infantil/Crianças": [
        "Animada",
        "Divertida/Engraçada",
        "Suave/Canção de ninar",
      ],
      "Jazz": [
        "Acid",
        "jazz",
        "Balada",
        "jazz",
        "Dixieland",
        "Exótica",
        "Fusion",
        "Jazz",
        "cigano",
        "Jazz",
        "latino",
        "Jazz",
        "moderno",
        "Lounge",
        "jazz",
        "Ragtime",
        "Smooth",
        "jazz",
        "Swing",
      ],
      "Jogos": [
        "8bits",
        "8bits/Chiptune",
        "Aventura",
        "Batalha",
        "Corrida",
        "Crianças",
        "Fantasia",
      ],
      "Latina": [
        "Bachata",
        "Bossa",
        "Nova",
        "Brasileira/Samba",
        "Conjunto",
        "Cubana/Salsa",
        "Cúmbia",
        "Espanhola/Flamenca",
        "Jarocho",
        "Mariachi",
        "Norteno",
        "Peruana",
        "Reggaeton",
        "Rock",
        "latino",
        "Rumba",
        "Tango",
        "Tex-Mex",
      ],
      "Mundo": [
        " Africana",
        " Afro-cubana",
        " Asiática",
        " Balinesa",
        " Balkan",
        " Bollywood",
        " Cajun",
        " Calipso",
        " Celta",
        " Chinês",
        " Coreano",
        " Dinamarca",
        " Estilo",
        " gamelão",
        " Etíope",
        " Europeia",
        " Germany",
        " Gnawa",
        " Grega",
        " Havaiana",
        " Indiana",
        " Indígena",
        " norte-americana",
        " Ireland",
        " Italiana",
        " Japonesa",
        " Klezmer",
        " Mediterrânea",
        " Mongol",
        " Norwegian",
        " Polca",
        " Polinésia",
        " Portugal",
        " Scandinavian",
        " Tailandesa",
        " Vietnamita",
        " do",
        " Oriente",
        " Médio",
      ],
      "New age": [
        "Drones",
        "Elementos",
        "de",
        "world",
        "music",
        "Etéreo",
        "Lounge",
        "Orquestral",
      ],
      "Noticiário": [
        "Identidade",
        "auditiva",
        "Manchetes",
      ],
      "Piano/Solo instrumental": [
        "Drama humano",
      ],
      "Pop": [
        "Adulto",
        "contemporâneo",
        "Afrobeat",
        "Balada",
        "Cantor/Compositor",
        "Dream",
        "Pop",
        "Electro",
        "pop",
        "Indie",
        "pop",
        "New",
        "Wave",
        "Pop",
        "chiclete",
        "Pop",
        "rock",
        "Suave/Easy",
        "listening",
        "Synthpop",
      ],
      "Reggae": [
        "Dancehall",
        "Polinésia",
        "Soca",
      ],
      "Rhythm and blues": [
        " Disco",
        " Doo-Wop",
        " Funk",
        " Gospel",
        " Motown R&B alternativo",
        " R&B pop",
        "Soul",
        " Soul contemporâneo",
        " Soul pop",
      ],
      "Rock": [
        "Alternativa/Grunge",
        "Blues",
        "Rock",
        "Boogie-Woogie",
        "Death",
        "Metal",
        "Emo",
        "Funk",
        "Rock",
        "Hard",
        "Rock",
        "Hardcore",
        "Heartland",
        "Rock",
        "Heavy",
        "metal",
        "Indie",
        "rock",
        "Mersey",
        "Beat",
        "Pop",
        "Punk",
        "Pop",
        "rock",
        "Punk",
        "rock",
        "Raga",
        "rock",
        "Rock",
        "clássico",
        "Rock n roll",
        "Rock",
        "retrô",
        "Rockabilly",
        "Rocktrônica",
        "Ska",
        "Soft",
        "rock",
        "Southern",
        "rock",
        "Spaghetti",
        "Western",
        "Surf",
        "rock",
        "Swamp",
        "Rock",
      ],
      "Sertanejo": [
        "Bluegrass",
        "Faroeste",
        "Honky",
        "Tonk",
        "Raízes",
        "americanas",
        "Sertaneja",
        "tradicional",
        "Sertanejo",
        "folk",
        "Sertanejo",
        "pop",
        "Sertanejo",
        "rock",
        "Swing",
        "texano",
      ]
    }
  ];
  public humor: any = [
    "Action / Sports",
    "Adventure / Discovery",
    "Aerobics / Workout",
    "Aggressive",
    "Comedy / Funny",
    "Crime / Thriller / Spy",
    "Dark / Somber",
    "Epic / Orchestral",
    "Fashion / Lifestyle",
    "Feel Good",
    "Gentle / Light",
    "Happy / Cheerful",
    "Horror / Scary",
    "Magical / Mystical",
    "Military / Patriotic",
    "Relaxation / Meditation",
    "Religious / Christian",
    "Romantic / Sentimental",
    "Sad / Nostalgic",
    "Sci-Fi / Future",
    "Sexy / Sensual",
    "Strange / Bizarre",
    "Suspense / Drama",
    "Underscores",
    "Uplifting",
    "Wedding",
  ];
  public arrMusica: Music[] = [
    {id: 1, nome_musica: 'HighFrenetic', nome_produtor: 'Xalaika', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 2, nome_musica: 'Maleficus Chaos', nome_produtor: 'Luan Bolico', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 3, nome_musica: 'Impertinent', nome_produtor: 'Hagy Fantasy', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 4, nome_musica: 'The Funkster', nome_produtor: 'Sweet Spot', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 5, nome_musica: 'Code', nome_produtor: 'Bonieky', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 6, nome_musica: 'The Funkster', nome_produtor: 'Sweet Spot', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 7, nome_musica: 'HighFrenetic', nome_produtor: 'Xalaika', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 8, nome_musica: 'Maleficus Chaos', nome_produtor: 'Luan Bolico', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 9, nome_musica: 'Impertinent', nome_produtor: 'Hagy Fantasy', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 10, nome_musica: 'The Funkster', nome_produtor: 'Sweet Spot', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 11, nome_musica: 'Code', nome_produtor: 'Bonieky', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 12, nome_musica: 'The Funkster', nome_produtor: 'Sweet Spot', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 13, nome_musica: 'HighFrenetic', nome_produtor: 'Xalaika', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 14, nome_musica: 'Maleficus Chaos', nome_produtor: 'Luan Bolico', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 15, nome_musica: 'Impertinent', nome_produtor: 'Hagy Fantasy', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 16, nome_musica: 'The Funkster', nome_produtor: 'Sweet Spot', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 17, nome_musica: 'Code', nome_produtor: 'Bonieky', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 18, nome_musica: 'The Funkster', nome_produtor: 'Sweet Spot', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 19, nome_musica: 'HighFrenetic', nome_produtor: 'Xalaika', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 20, nome_musica: 'Maleficus Chaos', nome_produtor: 'Luan Bolico', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 21, nome_musica: 'Impertinent', nome_produtor: 'Hagy Fantasy', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 22, nome_musica: 'The Funkster', nome_produtor: 'Sweet Spot', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 23, nome_musica: 'Code', nome_produtor: 'Bonieky', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
    {id: 24, nome_musica: 'The Funkster', nome_produtor: 'Sweet Spot', duracao: 180000, bpm: 95, trechos: 60, loops: 7},
  ]

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private likeService: FavoritosService,
  ) {
    this.genero.map((obj: any) => {
      Object.keys(obj).map((chave: any) => {
        this.convertida2.push(chave);
        this.convertida.push(obj[chave]);
      });
    });
  }


  public curtir(i: number) {
    this.authService.verificaLogin();

    if(this.authService.userAutetic()) {
      this.hearth = document.querySelectorAll('.hearth');
      this.hearth1 = document.querySelectorAll('.hearth1');

      if(this.hearth[i].style.display == 'block') {
        this.hearth[i].style.display = 'none';
        this.hearth1[i].style.display = 'block';
      } else {
        this.hearth[i].style.display = 'block';
        this.hearth1[i].style.display = 'none';
      }
    }
  }

  sendFavorite(i: number, favorite: any) {
    this.curtir(i);
    this.likeService.sendFavorite(favorite);
  }

  public addPlayList(i: number, m: any) {
    this.authService.verificaLogin();
    console.log(m);
    this.addMusicPlaylist = m;
    if(this.authService.userAutetic()) {
      document.querySelectorAll('.addPlaylist').forEach((e: any, index: any) => {
        if (i == index && e.classList.contains('amarelo')) {
          e.classList.remove('amarelo');
        } else if (i == index) {
          e.classList.add('amarelo');
          this.modalService.open(AddPlaylistModalComponent, {size: 'lg', modalDialogClass: 'modal-dialog-centered', container: 'body', backdrop: 'static', keyboard: false});
        }
      });
    }
  }

  public copiarLink(i: number) {
    console.log(i);
  }

  public baixarAmostra(i: number, md: any) {
    console.log(md);
    this.downloadMusic = md;
    this.modalService.open(DownloadAmostraComponent, {size: 'lg', modalDialogClass: 'modal-dialog-centered', container: 'body', backdrop: 'static', keyboard: false});
  }

  public comprarLicensa(i: number) {
    this.authService.verificaLogin();
    console.log(i);
  }
}
