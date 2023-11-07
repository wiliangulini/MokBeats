import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MusicasService} from "../musicas/musicas.service";
import {FavoritosService} from "../favoritos/favoritos.service";
import {AuthService} from "../login/auth.service";
import {ScrollService} from "../service/scroll.service";

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {

  trecho: any[] = [15, 30, 60];
  loop: any[] = [1, 2, 3, 4, 5, 6, 7];
  arrMusic: any = [];
  numF: number = 0;
  musicAdd: any;
  duration: any;
  durationAut: any;
  musicDownload: any[] = [];
  titles: any[];
  music: any[];
  humor: any[];
  musicas: any = {};
  number!: number;
  formG!: FormGroup;
  frase: string = "Elegante e moderno com elementos dance pop, com pads de sintetizador, percussão, baixo de sintetizador e guitarra elétrica, criando um clima suave e noturno.";
  select: string = 'Adicionada em';
  cantada: Array<any> = [
    "Amostras/Efeitos",
    "Cantores principais",
    "Coro/Grupo",
    "Oohs e Aahs",
    "Todos os Cantores",
  ]
  arrFilter: Array<any> = [
    "Adicionada em",
    "Popularidade",
    "Mais relevantes",
    "Mais recentes",
    "Ordem alfabética",
    "Artista",
    "BPM (mais baixos primeiro)",
    "BPM (mais altos primeiro)",
    "Duração (mais curtas primeiro)",
    "Duração (mais longas primeiro)",
  ]
  arrVExtendida: Array<any> = [
    {value: "Baixo por sintetizador", viewValue: "Baixo por sintetizador"},
    {value: "Chill", viewValue: "Chill"},
    {value: "Dance", viewValue: "Dance"},
    {value: "Dance Pop", viewValue: "Dance Pop"},
    {value: "Dance/Tecno", viewValue: "Dance/Tecno"},
    {value: "Electro pop", viewValue: "Electro pop"},
    {value: "Exciting", viewValue: "Exciting"},
    {value: "Futurista", viewValue: "Futurista"},
    {value: "Futuristic", viewValue: "Futuristic"},
    {value: "Groovy", viewValue: "Groovy"},
    {value: "Guitarra", viewValue: "Guitarra"},
    {value: "Hip", viewValue: "Hip"},
    {value: "Mesmerizing", viewValue: "Mesmerizing"},
    {value: "Moda/Estilo de vida", viewValue: "Moda/Estilo de vida"},
    {value: "Pulsing", viewValue: "Pulsing"},
    {value: "Sentimento bom", viewValue: "Sentimento bom"},
    {value: "Sintetizador", viewValue: "Sintetizador"},
    {value: "Smooth", viewValue: "Smooth"},
    {value: "Technology", viewValue: "Technology"},
    {value: "Trippy", viewValue: "Trippy"},
  ]

  @Output('ngModelChange') update: any = new EventEmitter();

  constructor(
    private musicService: MusicasService,
    private likeService: FavoritosService,
    private authService: AuthService,
    private scrollService: ScrollService,
    private fb: FormBuilder,
  ) {
    // this.arrMusic = this.musicService.arrMusica;
    this.formG = this.fb.group({
      checkbox: [],
      bpm: [],
      duracao: [],
    });
    this.titles = this.musicService.convertida2;
    this.music = this.musicService.convertida;
    this.humor = this.musicService.humor;
  }

  ngOnInit(): void {
    this.scrollService.scrollUp();

    if (screen.width < 769) {
      document.getElementById('navLeft')!.style.width = '0';
    }
    this.arrMusic = this.likeService.addFavorite();
  }

  curtir(i: number): void {
    this.musicService.curtir(i);
  }

  filtrar(): void {
    let navleft: any = document.getElementById('navLeft');
    if(navleft!.getAttribute('style') == 'width: 0px;' || navleft!.getAttribute('style') == 'width: 0px; opacity: 0; z-index: 0;') {
      navleft!.style.width = '96vw';
      navleft!.style.opacity = '1';
      navleft!.style.zIndex = '99999';
    } else {
      navleft!.style.width = '0';
      navleft!.style.opacity = '0';
      navleft!.style.zIndex = '0';
    }
  }

  addPlayList(i: number): void {
    this.musicAdd = this.arrMusic[i].viewValue;
    this.musicService.addPlayList(i, this.musicAdd);
  }

  copiarLink(i: number): void {
    this.musicService.copiarLink(i);
  }

  baixarAmostra(i: number): void {
    this.authService.verificaLogin();
    if(this.authService.userAutetic()) {
      this.musicDownload = [];
      this.musicDownload.push(this.arrMusic[i].nome_musica);
      this.musicDownload.push(this.arrMusic[i].nome_produtor);
      this.musicService.baixarAmostra(i, this.musicDownload);
    }
  }

  comprarLicensa(i: number): void { this.musicService.comprarLicensa(i); }

  filtroP(e: any): void { this.select = e; }

  onChangedEvent(event: any, elem: any): void {

    elem == 'bpm' ? this.number = event : this.duration = event;
    if(elem == 'duracao') {
      let dateObj: any = new Date(this.duration * 1000);
      let minutes: any = dateObj.getUTCMinutes();
      let seconds: any = dateObj.getSeconds();
      let timeString: any = minutes.toString().padStart(1) + ':' + seconds.toString().padStart(2, '0');
      this.durationAut = timeString;
    }
  }

}
