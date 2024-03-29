import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Musica, MusicasService} from "../musicas/musicas.service";
import {AuthService} from "../login/auth.service";
import {ScrollService} from "../service/scroll.service";
import {PlaylistService} from "../create-playlist-modal/playlist.service";
import {playlists} from "../create-playlist-modal/create-playlist-modal.component";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-pag-playlist',
  templateUrl: './pag-playlist.component.html',
  styleUrls: ['./pag-playlist.component.scss']
})
export class PagPlaylistComponent implements OnInit {
  
  public favorite: Musica = {};
  trecho: any[] = [15, 30, 60];
  loop: any[] = [1, 2, 3, 4, 5, 6, 7];
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
  select: any = 'Mais Relevantes';
  
  cantada: Array<any> = [
    "Amostras/Efeitos",
    "Cantores principais",
    "Coro/Grupo",
    "Oohs e Aahs",
    "Todos os Cantores",
  ]
  arrFilter: Array<any> = [
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
  arrMusica: any = [];
  playlist!: playlists;
  _playlist: any;
  namePlaylist: any;
  descriptionPlaylist: any;
  
  @Output('ngModelChange') update: any = new EventEmitter();
  
  constructor(
    private musicService: MusicasService,
    private authService: AuthService,
    private scrollService: ScrollService,
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
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
    if (screen.width < 769) document.getElementById('navLeft')!.style.width = '0';
    
    this.route.queryParams.subscribe((data: any) => {
      this._playlist = data;
      this.playlistService.list().subscribe((data: any) => {
        data.forEach((e: playlists) => {
          if (e.id == this._playlist.id) {
            this.playlist = e;
            this.namePlaylist = this.playlist.name;
            this.descriptionPlaylist = this.playlist.description;
            let musicas: Musica[];
            musicas = this.playlist.music;
            this.arrMusica = musicas;
          }
        });
      });
    });
  }
  
  msToMinute(ms: any) {
    let minutes: any = Math.floor(ms / 60000);
    let seconds: any = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  
  curtir(i: number): void {
    this.favorite.id = this.arrMusica[i].id;
    this.favorite.nome_musica = this.arrMusica[i].nome_musica;
    this.favorite.nome_produtor = this.arrMusica[i].nome_produtor;
    this.favorite.duracao = this.arrMusica[i].duracao;
    this.favorite.bpm = this.arrMusica[i].bpm;
    this.favorite.trechos = this.arrMusica[i].trechos;
    this.favorite.loops = this.arrMusica[i].loops;
    this.musicService.sendFavorite(i, this.favorite);
    
  }
  
  filtrar(): void {
    let navleft = document.getElementById('navLeft');
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
  
  removeMusicPlayList(i: any): void {
    let idRemove: number = this.playlist.music[i].id;
    this.playlist.music = this.playlist.music.filter((obj: any) => obj.id !== idRemove);
    console.log(this.playlist);
    this.save();
    setTimeout(() => {
      document.location.reload();
    }, 5500)
  }
  
  save() {
    console.log(this.playlist);
    this.playlistService.save(this.playlist).subscribe((data: any) => {
      if (data.id !== undefined) {
        console.log(data);
        this.snackBar.open('Música removida da playlist com SUCESSO!!!', '', {duration: 5000});
      } else {
        this.snackBar.open('ERRO ao remover música da playlist!!!', '', {duration: 5000});
      }
    });
  }
  
  copiarLink(i: number): void { this.musicService.copiarLink(i); }
  
  baixarAmostra(i: number): void {
    this.authService.verificaLogin();
    if(this.authService.userAutetic()) {
      this.musicDownload = [];
      this.musicDownload.push(this.arrMusica[i].nome_musica);
      this.musicDownload.push(this.arrMusica[i].nome_produtor);
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
