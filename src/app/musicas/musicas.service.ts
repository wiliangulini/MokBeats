import {Injectable} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddPlaylistModalComponent} from "../add-playlist-modal/add-playlist-modal.component";
import {DownloadAmostraComponent} from "../download-amostra/download-amostra.component";
import {AuthService} from "../login/auth.service";
import {FavoritosService} from "../favoritos/favoritos.service";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CarrinhoService} from "../service/carrinho.service";
import {CrudService} from "../service/crud-service";
import {Observable} from "rxjs";

export type Musica = {
  id?: number;
  nome_musica?: string;
  nome_produtor?: string;
  url?: string;
  duracao?: number;
  bpm?: number;
  trechos?: number;
  loops?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MusicasService extends CrudService<Musica> {

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
  public arrMusica!: Musica[];

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
    private likeService: FavoritosService,
    protected override http: HttpClient,
    private cartService: CarrinhoService,
    private activeModal: NgbActiveModal,
  ) {
    super(http, `${environment.API}musicas`);
    this.genero.map((obj: any) => {
      Object.keys(obj).map((chave: any) => {
        this.convertida2.push(chave);
        this.convertida.push(obj[chave]);
      });
    });
  }

  override list(): Observable<Musica> {
    return super.list();
  }

  override save(record: any): Observable<Musica> {
    return super.save(record);
  }

  override remove(id: number): Observable<Musica> {
    return super.remove(id);
  }

  public curtir(i: number) {
    this.authService.verificaLogin();

    if(this.authService.userAutetic()) {
      this.hearth = document.querySelectorAll('.hearth');
      this.hearth1 = document.querySelectorAll('.hearth1');

      if(this.hearth[i].style.display == 'block') {
        this.hearth[i].style.display = 'none';
        this.hearth1[i].style.display = 'block'; // curtida
      } else {
        this.hearth[i].style.display = 'block'; // descurtida
        this.hearth1[i].style.display = 'none';
      }
    }
  }

  sendFavorite(i: number, favorite: any) {
    this.curtir(i);
    this.likeService.sendFavorite(favorite);
  }

  public addPlayList(music: Musica) {
    this.authService.verificaLogin();
    if(this.authService.userAutetic()) {
      this.list().subscribe((data: any) => {
        this.arrMusica = data;
        this.addMusicPlaylist = music;
        document.querySelectorAll('.addPlaylist').forEach((e: any, index: any) => {
          if (this.arrMusica[index].id == this.addMusicPlaylist.id) {
            e.classList.add('amarelo');
            const activeModal = this.modalService.open(AddPlaylistModalComponent, {size: 'lg', modalDialogClass: 'modal-dialog-centered', container: 'body', backdrop: 'static', keyboard: false});
            activeModal.componentInstance.addNewMusicPlaylist(this.addMusicPlaylist);
            activeModal.result.then();
          }
        });
      })
    }
  }

  public copiarLink(i: number) {
    console.log(i);
    // let urlMontagem: string = 'pagina-playlist?id=';
    // let url = window.location.href.slice(0, -9) + urlMontagem + i;
    // return url;
  }

  public baixarAmostra(i: number, md: any) {
    console.log(md);
    this.downloadMusic = md;
    this.modalService.open(DownloadAmostraComponent, {size: 'lg', modalDialogClass: 'modal-dialog-centered', container: 'body', backdrop: 'static', keyboard: false});
  }

  public comprarLicensa(i: any) {
    this.authService.verificaLogin();
    if(this.authService.userAutetic()) {
      this.cartService.openModalCart();
      this.cartService.receivingCart(i);
    }
  }
}
