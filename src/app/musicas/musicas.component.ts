import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

import {PlaylistService} from '../create-playlist-modal/playlist.service';
import {FavoritosService} from '../favoritos/favoritos.service';
import {AuthService} from '../login/auth.service';
import {ScrollService} from '../service/scroll.service';
import {Musica, MusicasService} from './musicas.service';
import {PlayerService} from "../player/player.service";
import {MusicPlayerService} from "../service/music-player.service";
import {WaveSurferTestComponent} from "../wave-surfer-test/wave-surfer-test.component";
import {AudioService} from "../service/audio.service";

@Component({
  selector: 'app-musicas',
  templateUrl: './musicas.component.html',
  styleUrls: ['./musicas.component.scss']
})
export class MusicasComponent implements OnInit, AfterViewInit, AfterViewChecked {
  isLoading: boolean = true;
  @ViewChildren(WaveSurferTestComponent) waveSurfers!: QueryList<WaveSurferTestComponent>;
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
  audioUrl: string = '';
  durationUrl: number | null = null;
  currentTrackIndex = 0;
  isPlaying: boolean = false;

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
  arrMusica: Musica[] = [];
  btnPlay: any;
  btnTrue: boolean = false;

  @Output('ngModelChange') update: any = new EventEmitter();

  constructor(
    private musicService: MusicasService,
    private playerService: PlayerService,
    private authService: AuthService,
    private scrollService: ScrollService,
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private likeService: FavoritosService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private musicPlayerService: MusicPlayerService,
    private audioService: AudioService,
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
    if (screen.width < 769) {
      document.getElementById('navLeft')!.style.width = '0';
    }

  }

  ngAfterViewInit() {
    let playlist: any[] = [];
    const setPlaylist = new Set();
    this.musicService.list().subscribe((data: any) => {
      this.arrMusica = data;
      let arrMusica = JSON.stringify(this.arrMusica);
      localStorage.setItem('arrMusica', arrMusica);
      this.playlistService.list().subscribe((data: any) => {
        this.isLoading = false;
        data.forEach((e: any) => {
          if(e.music.length > 0) {
            for(let i: number = 0; i < e.music.length; i++) {
              playlist.push(e.music[i]);
            }
          } else if(e.music.length == undefined && e.music.id > 0) {
            playlist.push(e.music);
          }
        });
        const filterMusicPlaylist = playlist.filter((data: any) => {
          const duplicatePlaylist = setPlaylist.has(data.id);
          setPlaylist.add(data.id);
          return !duplicatePlaylist;
        })
        filterMusicPlaylist.sort((a, b) => {
          if(a.id > b.id) return 1;
          if(a.id < b.id) return -1;
          return 0;
        });
        let addplaylist: any = document.querySelectorAll('.addPlaylist');
        addplaylist.forEach((e: any, index: any) => {
          for(let i of filterMusicPlaylist){
            if(i.id === this.arrMusica[index]?.id) {
              e.classList.add('amarelo')
            }
          }
        });
      })
      this.likeService.list().subscribe((data: any) => {
        let fav: any[] = [];
        data.forEach((e: any) => {
          fav.push(e);
        });
        let hearthLike = document.querySelectorAll('.hearth');
        let hearthLike1 = document.querySelectorAll('.hearth1');
        hearthLike.forEach((e: any, index: number) => {
          for(let i of fav) {
            if(i.id === this.arrMusica[index]?.id) {
              e.style.display = 'none'
            }
          }
        })
        hearthLike1.forEach((e: any, index: number) => {
          for(let i of fav) {
            if(i.id === this.arrMusica[index]?.id) {
              e.style.display = 'block'
            }
          }
        })
      });
    })
    document.querySelectorAll('.mat-checkbox-frame')?.forEach((e: any) => {
      e.style.borderColor = "#FFF";
    })

    //  essa função mostra todos itens do querylist conforme é sendo prenchido no ngFor.
    // this.waveSurfers.changes.subscribe((data: any) => {
    //   console.log(data);
    //   this.waveSurfers.forEach((e: any) => {
    //     console.log(e);
    //   })
    // })

  }

  ngAfterViewChecked() {
    if(!this.btnTrue) {
      this.btnPlay = document.querySelectorAll('button.svg.play');
      if(this.btnPlay.length > 0) {
        this.btnPlay.forEach((e: any, i: number) => {
          e.setAttribute('data-key', this.arrMusica[i].id);
        });
        this.btnTrue = true;
      }
    }
    this.cdRef.detectChanges();
  }

  play_pause: any = 'play';
  id!: number;
  action!: string;
  playMusic: any;

  onPlayPause(action: any, musicId: any) {
    this.id = musicId;
    this.action = action;
    this.playerShow();
    this.arrMusica.forEach((music: any) => {
      if(music.id === this.id) {
        this.playMusic = music;
      }
    });

    this.currentTrackIndex = this.playMusic.id - 1;
    if(this.isPlaying) {
      const currentWaveSurfer = this.waveSurfers.toArray()[this.currentTrackIndex];
      if (currentWaveSurfer) {
        this.musicPlayerService.onPlayPause('pause', this.id);
        this.toogleButton();
        this.isPlaying = false;
      }
    } else {
      this.playNextTrack();
    }
  }

  toogleButton() {
    let spanPlay: any = document.querySelectorAll('span.spanPlay');
    let spanPause: any = document.querySelectorAll('span.spanPause');
    if(this.action == 'play') {
      this.play_pause = 'pause';
      spanPause[this.currentTrackIndex].classList.add('d-flex');
      spanPause[this.currentTrackIndex].classList.remove('d-none');
      spanPlay[this.currentTrackIndex].classList.remove('d-flex');
      spanPlay[this.currentTrackIndex].classList.add('d-none');
    }
    else if (this.action == 'pause') {
      this.play_pause = 'play';
      spanPlay[this.currentTrackIndex].classList.add('d-flex');
      spanPlay[this.currentTrackIndex].classList.remove('d-none');
      spanPause[this.currentTrackIndex].classList.remove('d-flex');
      spanPause[this.currentTrackIndex].classList.add('d-none');
    }
  }

  playNextTrack() {
    const currentWaveSurfer = this.waveSurfers.toArray()[this.currentTrackIndex];
    if (currentWaveSurfer) {
      this.playMusic = currentWaveSurfer.music;
      this.musicPlayerService.setCurrentMusicID(this.playMusic.id);
      this.musicPlayerService.setCurrentMusicUrl(this.playMusic.url);
      this.musicPlayerService.onPlayPause('play', this.id);
      this.toogleButton();
      this.isPlaying = true;
    }
  }

  onSongFinished(index: number) {
    const currentWaveSurfer = this.waveSurfers.toArray()[this.currentTrackIndex];
    console.log(currentWaveSurfer)
    if (index === this.currentTrackIndex) {
      this.currentTrackIndex++;
      this.id++;
      if (this.currentTrackIndex < this.arrMusica.length) {
        this.playNextTrack();
      } else {
        this.isPlaying = false;
      }
    }
  }

  playerShow() {
    let controlPlayer: any = document.querySelector('#controlPlayer');
    controlPlayer.classList.remove('hidePlayer');
    controlPlayer.classList.add('showPlayer');
  }

  pagArtist(data: any) {
    console.log(data);
    this.router.navigate(['/pagina-artista'], {queryParams: {nome_produtor: data.nome_produtor}});
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

  addMusicPlayList(music: Musica): void {
    this.musicService.addPlayList(music);
  }

  copiarLink(i: number): void { this.musicService.copiarLink(i); }

  // função pra pegar o tempo da musica pela url.
  fetchAudioDuration() {
    this.audioService.getAudioduration(this.audioUrl)
      .then(duration => this.durationUrl = duration)
      .catch(error => console.log(error));

  }

  baixarAmostra(i: number): void {
    this.authService.verificaLogin();
    if(this.authService.userAutetic()) {
      this.musicDownload = [];
      this.musicDownload.push(this.arrMusica[i].nome_musica);
      this.musicDownload.push(this.arrMusica[i].nome_produtor);
      this.musicService.baixarAmostra(i, this.musicDownload);
    }
  }

  comprarLicensa(i: any): void { this.musicService.comprarLicensa(i); }

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
