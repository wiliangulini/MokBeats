import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';

import WaveSurfer from 'wavesurfer.js';
import { PlaylistService } from '../create-playlist-modal/playlist.service';
import { FavoritosService } from '../favoritos/favoritos.service';
import { AuthService } from '../login/auth.service';
import { PlayerService } from '../player/player.service';
import { MusicPlayerService } from '../service/music-player.service';
import { ScrollService } from '../service/scroll.service';
import { WaveSurferTestComponent } from '../wave-surfer-test/wave-surfer-test.component';
import { Musica, MusicasService } from './musicas.service';
import { AudioPreloaderService } from '../service/audio-preloader.service';

@Component({
    selector: 'app-musicas',
    templateUrl: './musicas.component.html',
    styleUrls: ['./musicas.component.scss'],
    standalone: false
})
export class MusicasComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  isLoading: boolean = true;
  // Controla renderização do waveform por breakpoint
  isDesktop: boolean = true;
  isFilterPanelOpen: boolean = true;
  @ViewChildren(WaveSurferTestComponent)
  waveSurfers!: QueryList<WaveSurferTestComponent>;
  public favorite: Musica = {};
  trecho: any[] = [15, 30, 60];
  selectedKeys: string[] = [];
  duration: any;
  durationAut: any;
  musicDownload: any[] = [];
  titles: any[];
  music: any[];
  humor: any[];
  artistas: any[] = [];
  instrumentos: any[] = [];
  musicas: any = {};
  number: number | undefined;

  readonly keyOptions = [
    { value: 'A_MAJOR', label: 'A (Lá M)' }, { value: 'A_SHARP_MAJOR', label: 'A# (M)' },
    { value: 'A_FLAT_MAJOR', label: 'Ab (M)' }, { value: 'B_MAJOR', label: 'B (Si M)' },
    { value: 'B_FLAT_MAJOR', label: 'Bb (M)' }, { value: 'C_MAJOR', label: 'C (Dó M)' },
    { value: 'C_SHARP_MAJOR', label: 'C# (M)' }, { value: 'D_MAJOR', label: 'D (Ré M)' },
    { value: 'D_SHARP_MAJOR', label: 'D# (M)' }, { value: 'E_MAJOR', label: 'E (Mi M)' },
    { value: 'F_MAJOR', label: 'F (Fá M)' }, { value: 'F_SHARP_MAJOR', label: 'F# (M)' },
    { value: 'G_MAJOR', label: 'G (Sol M)' }, { value: 'G_SHARP_MAJOR', label: 'G# (M)' },
    { value: 'A_MINOR', label: 'Am (m)' }, { value: 'A_SHARP_MINOR', label: 'A#m (m)' },
    { value: 'A_FLAT_MINOR', label: 'Abm (m)' }, { value: 'B_MINOR', label: 'Bm (m)' },
    { value: 'B_FLAT_MINOR', label: 'Bbm (m)' }, { value: 'C_MINOR', label: 'Cm (m)' },
    { value: 'C_SHARP_MINOR', label: 'C#m (m)' }, { value: 'D_MINOR', label: 'Dm (m)' },
    { value: 'D_SHARP_MINOR', label: 'D#m (m)' }, { value: 'E_MINOR', label: 'Em (m)' },
    { value: 'F_MINOR', label: 'Fm (m)' }, { value: 'F_SHARP_MINOR', label: 'F#m (m)' },
    { value: 'G_MINOR', label: 'Gm (m)' }, { value: 'G_SHARP_MINOR', label: 'G#m (m)' },
  ];

  // Filtros selecionados
  selectedGeneros: string[] = [];
  selectedSubgeneros: string[] = [];
  selectedVozes: string[] = [];
  selectedHumores: string[] = [];
  selectedArtistas: string[] = [];
  selectedInstrumentos: string[] = [];

  // Flag para controlar se os filtros devem ser aplicados
  filtersInitialized: boolean = false;
  formG!: FormGroup;
  frase: string =
    'Elegante e moderno com elementos dance pop, com pads de sintetizador, percussão, baixo de sintetizador e guitarra elétrica, criando um clima suave e noturno.';
  select: any = 'Mais Relevantes';
  audioUrl: string = '';
  durationUrl: number | null = null;
  currentTrackIndex = 0;
  isPlaying: boolean = false;
  private pendingPlaylistIds: Set<number> = new Set<number>();
  private pendingFavoritoIds: Set<number> = new Set<number>();
  private highlightTimeoutId: any;
  private playButtonBindingTimeoutId: any;

  vozes: Array<any> = [
    'Amostras/Efeitos',
    'Cantores principais',
    'Coro/Grupo',
    'Oohs e Aahs',
    'Todos os Cantores',
  ];
  arrFilter: Array<any> = [
    'Popularidade',
    'Mais relevantes',
    'Mais recentes',
    'Ordem alfabética',
    'Artista',
    'BPM (mais baixos primeiro)',
    'BPM (mais altos primeiro)',
    'Duração (mais curtas primeiro)',
    'Duração (mais longas primeiro)',
  ];
  arrVExtendida: Array<any> = [
    { value: 'Baixo por sintetizador', viewValue: 'Baixo por sintetizador' },
    { value: 'Chill', viewValue: 'Chill' },
    { value: 'Dance', viewValue: 'Dance' },
    { value: 'Dance Pop', viewValue: 'Dance Pop' },
    { value: 'Dance/Tecno', viewValue: 'Dance/Tecno' },
    { value: 'Electro pop', viewValue: 'Electro pop' },
    { value: 'Exciting', viewValue: 'Exciting' },
    { value: 'Futurista', viewValue: 'Futurista' },
    { value: 'Futuristic', viewValue: 'Futuristic' },
    { value: 'Groovy', viewValue: 'Groovy' },
    { value: 'Guitarra', viewValue: 'Guitarra' },
    { value: 'Hip', viewValue: 'Hip' },
    { value: 'Mesmerizing', viewValue: 'Mesmerizing' },
    { value: 'Moda/Estilo de vida', viewValue: 'Moda/Estilo de vida' },
    { value: 'Pulsing', viewValue: 'Pulsing' },
    { value: 'Sentimento bom', viewValue: 'Sentimento bom' },
    { value: 'Sintetizador', viewValue: 'Sintetizador' },
    { value: 'Smooth', viewValue: 'Smooth' },
    { value: 'Technology', viewValue: 'Technology' },
    { value: 'Trippy', viewValue: 'Trippy' },
  ];
  arrMusica: Musica[] = [];
  wavesurfer!: WaveSurfer;
  @Output('ngModelChange') update: any = new EventEmitter();

  // Propriedades de paginação
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  currentFilters: any = null;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  constructor(
    private musicService: MusicasService,
    private playerService: PlayerService,
    private authService: AuthService,
    private scrollService: ScrollService,
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private likeService: FavoritosService,
    private musicPlayerService: MusicPlayerService,
    private audioPreloader: AudioPreloaderService
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
    // Define se deve renderizar o waveform na página músicas (>=768px)
    this.isDesktop = window.innerWidth >= 768;
    this.isFilterPanelOpen = this.isDesktop;
    this.loadArtistas();
    this.loadInstrumentos();
  }

  @HostListener('window:resize', [])
  onResize() {
    const wasDesktop = this.isDesktop;
    this.isDesktop = window.innerWidth >= 768;

    if (this.isDesktop && !wasDesktop) {
      this.openFilterPanel();
    } else if (!this.isDesktop && wasDesktop) {
      this.closeFilterPanel();
    }
  }

  ngAfterViewInit() {
    // Carrega dados iniciais com paginação (página 1, 10 itens)
    this.loadMusicas(1);

    // Estiliza checkboxes
    document.querySelectorAll('.mat-checkbox-frame')?.forEach((e: any) => {
      e.style.borderColor = '#FFF';
    });
  }

  private scheduleDomUpdates(): void {
    this.schedulePlayButtonBinding();
    this.scheduleHighlightUpdate();
  }

  private schedulePlayButtonBinding(): void {
    if (this.playButtonBindingTimeoutId) {
      clearTimeout(this.playButtonBindingTimeoutId);
    }

    this.playButtonBindingTimeoutId = setTimeout(() => {
      const buttons = document.querySelectorAll('button.svg.play');
      buttons.forEach((element: Element, index: number) => {
        const musicId = this.arrMusica[index]?.id;
        if (musicId) {
          (element as HTMLElement).setAttribute('data-key', String(musicId));
        }
      });
    });
  }

  private scheduleHighlightUpdate(): void {
    if (this.highlightTimeoutId) {
      clearTimeout(this.highlightTimeoutId);
    }

    this.highlightTimeoutId = setTimeout(() => {
      this.applyPlaylistClasses(this.pendingPlaylistIds);
      this.applyFavoriteClasses(this.pendingFavoritoIds);
    }, 100);
  }

  loadMusicas(page: number = 1, filtros?: any): void {
    this.isLoading = true;

    // Determina qual endpoint usar (paginado ou filtrado)
    const musicasRequest = filtros
      ? this.musicService.filterMusicas({ ...filtros, page, limit: this.itemsPerPage })
      : this.musicService.listPaginated(page, this.itemsPerPage);

    // Executa todas as requisições em paralelo para otimizar tempo de carregamento
    forkJoin({
      musicas: musicasRequest,
      playlists: this.playlistService.list(),
      favoritos: this.likeService.list()
    }).subscribe({
      next: (result) => {
        // Processa músicas
        if (result.musicas?.data && result.musicas?.pagination) {
          this.arrMusica = result.musicas.data;
          this.totalItems = result.musicas.pagination.totalItems;
          this.currentPage = result.musicas.pagination.currentPage;
        } else {
          this.arrMusica = result.musicas || [];
          this.totalItems = Array.isArray(result.musicas) ? result.musicas.length : 0;
          this.currentPage = page;
        }

        localStorage.setItem('arrMusica', JSON.stringify(this.arrMusica));

        if (!this.filtersInitialized) {
          this.filtersInitialized = true;
        }

        // Processa playlists
        this.pendingPlaylistIds = this.extractPlaylistMusicIds(result.playlists || []);

        // Processa favoritos
        this.pendingFavoritoIds = new Set(
          (result.favoritos || []).map((fav: any) => fav?.id).filter((id: number) => !!id)
        );

        this.isLoading = false;
        this.scheduleDomUpdates();

        // Pré-carrega áudios da página atual para reprodução instantânea
        this.preloadCurrentPageAudios();
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        this.arrMusica = [];
        this.totalItems = 0;
        this.pendingPlaylistIds = new Set<number>();
        this.pendingFavoritoIds = new Set<number>();
        this.isLoading = false;
      },
    });
  }

  /**
   * Pré-carrega áudios da página atual em background
   * Executa após carregar metadados e peaks
   */
  private preloadCurrentPageAudios(): void {
    // Extrai URLs dos áudios da página atual
    const audioUrls = this.arrMusica
      .filter(musica => musica.url) // Filtra músicas com URL válida
      .map(musica => musica.url as string);

    if (audioUrls.length > 0) {
      console.log(`🎵 Iniciando preload de ${audioUrls.length} áudio(s) da página ${this.currentPage}`);
      this.audioPreloader.preloadAudios(audioUrls);
    }
  }

  /**
   * Extrai IDs de músicas presentes em playlists
   * Retorna Set para busca O(1)
   */
  private extractPlaylistMusicIds(playlists: any[]): Set<number> {
    const ids = new Set<number>();
    playlists.forEach((playlist: any) => {
      // Normaliza música como array
      const musicList = Array.isArray(playlist.music)
        ? playlist.music
        : (playlist.music?.id ? [playlist.music] : []);

      // Adiciona IDs ao Set
      musicList.forEach((music: any) => {
        if (music?.id) ids.add(music.id);
      });
    });
    return ids;
  }

  /**
   * Aplica classe 'amarelo' a músicas que estão em playlists
   * Complexidade: O(n) onde n = número de músicas exibidas
   */
  private applyPlaylistClasses(playlistMusicIds: Set<number>): void {
    const elements = document.querySelectorAll('.addPlaylist');
    elements.forEach((element: any, index: number) => {
      const musicId = this.arrMusica[index]?.id;
      if (musicId && playlistMusicIds.has(musicId)) {
        element.classList.add('amarelo');
      } else {
        element.classList.remove('amarelo');
      }
    });
  }

  /**
   * Aplica estilos a músicas favoritadas
   * Complexidade: O(n) onde n = número de músicas exibidas
   */
  private applyFavoriteClasses(favoritoIds: Set<number>): void {
    const hearthElements = document.querySelectorAll('.hearth');
    const hearth1Elements = document.querySelectorAll('.hearth1');

    this.arrMusica.forEach((musica: any, index: number) => {
      const isFavorite = musica?.id && favoritoIds.has(musica.id);

      if (hearthElements[index]) {
        (hearthElements[index] as HTMLElement).style.display = isFavorite ? 'none' : 'block';
      }
      if (hearth1Elements[index]) {
        (hearth1Elements[index] as HTMLElement).style.display = isFavorite ? 'block' : 'none';
      }
    });
  }

  /**
   * Callback quando o usuário muda de página
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadMusicas(page, this.currentFilters);
    this.scrollService.scrollUp();
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
      if (music.id === this.id) {
        this.playMusic = music;
      }
    });

    const foundIndex = this.arrMusica.findIndex((m: any) => m.id === this.id);
    this.currentTrackIndex = foundIndex >= 0 ? foundIndex : 0;
    if (this.isDesktop) {
      if (this.isPlaying) {
        const currentWaveSurfer =
          this.waveSurfers.toArray()[this.currentTrackIndex];
        if (currentWaveSurfer) {
          this.musicPlayerService.onPlayPause('pause', this.id);
          this.toogleButton();
          this.isPlaying = false;
        }
      } else {
        this.playNextTrack();
      }
    } else {
      // Mobile: não depende do componente WaveSurfer na lista
      if (this.isPlaying) {
        this.musicPlayerService.onPlayPause('pause', this.id);
        this.toogleButton();
        this.isPlaying = false;
      } else {
        this.musicPlayerService.setCurrentMusicID(this.playMusic.id);
        this.musicPlayerService.setCurrentMusicUrl(this.playMusic.url);
        this.musicPlayerService.setCurrentMusic(this.playMusic);
        this.musicPlayerService.onPlayPause('play', this.id);
        this.toogleButton();
        this.isPlaying = true;
      }
    }
  }

  toogleButton() {
    let spanPlay: any = document.querySelectorAll('span.spanPlay');
    let spanPause: any = document.querySelectorAll('span.spanPause');
    if (this.action == 'play') {
      this.play_pause = 'pause';
      spanPause[this.currentTrackIndex].classList.add('d-flex');
      spanPause[this.currentTrackIndex].classList.remove('d-none');
      spanPlay[this.currentTrackIndex].classList.remove('d-flex');
      spanPlay[this.currentTrackIndex].classList.add('d-none');
    } else if (this.action == 'pause') {
      this.play_pause = 'play';
      spanPlay[this.currentTrackIndex].classList.add('d-flex');
      spanPlay[this.currentTrackIndex].classList.remove('d-none');
      spanPause[this.currentTrackIndex].classList.remove('d-flex');
      spanPause[this.currentTrackIndex].classList.add('d-none');
    }
  }

  playNextTrack() {
    if (this.isDesktop) {
      const currentWaveSurfer =
        this.waveSurfers.toArray()[this.currentTrackIndex];
      if (currentWaveSurfer) {
        console.log(currentWaveSurfer);
        this.playMusic = currentWaveSurfer.music;
        this.musicPlayerService.setCurrentMusicID(this.playMusic.id);
        this.musicPlayerService.setCurrentMusicUrl(this.playMusic.url);
        this.musicPlayerService.setCurrentMusic(this.playMusic);
        this.musicPlayerService.onPlayPause('play', this.id);
        this.toogleButton();
        this.isPlaying = true;
      }
    } else {
      // Mobile: avança e toca via serviço
      if (this.playMusic) {
        this.musicPlayerService.setCurrentMusicID(this.playMusic.id);
        this.musicPlayerService.setCurrentMusicUrl(this.playMusic.url);
        this.musicPlayerService.setCurrentMusic(this.playMusic);
        this.musicPlayerService.onPlayPause('play', this.id);
        this.toogleButton();
        this.isPlaying = true;
      }
    }
  }

  onSongFinished(index: number) {
    const currentWaveSurfer =
      this.waveSurfers.toArray()[this.currentTrackIndex];
    console.log(currentWaveSurfer);
    if (index === this.currentTrackIndex) {
      this.currentTrackIndex++;
      if (this.currentTrackIndex < this.arrMusica.length) {
        const nextMusic = this.arrMusica[this.currentTrackIndex];
        this.playMusic = nextMusic;
        this.id = nextMusic?.id ?? this.id;
        this.musicPlayerService.setCurrentMusic(nextMusic ?? null);
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

  // Formata segundos para o formato mm:ss (igual ao player)
  formatTime = (seconds: any) => {
    const total = Math.round(Number(seconds) || 0);
    const minutes = Math.floor(total / 60);
    const secondsRemainder = total % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  dur!: any;
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

  openFilterPanel(): void {
    this.isFilterPanelOpen = true;
  }

  closeFilterPanel(): void {
    this.isFilterPanelOpen = false;
  }

  toggleFilterPanel(): void {
    this.isFilterPanelOpen = !this.isFilterPanelOpen;
  }

  addMusicPlayList(music: Musica): void {
    this.musicService.addPlayList(music);
  }

  copiarLink(i: number): void {
    this.musicService.copiarLink(i);
  }

  // função pra pegar o tempo da musica pela url.
  // fetchAudioDuration() {
  //   this.audioService.getAudioduration("../../assets/audios/MokBeats_Future_Forest_(FULL).mp3")
  //     .then(duration => {
  //       this.durationUrl = duration
  //       console.log(this.durationUrl)
  //     }).catch(error => console.log(error));
  //
  // }

  baixarAmostra(i: number): void {
    this.authService.verificaLogin();
    if (this.authService.userAutetic()) {
      this.musicDownload = [];
      this.musicDownload.push(this.arrMusica[i].nome_musica);
      this.musicDownload.push(this.arrMusica[i].nome_produtor);
      this.musicService.baixarAmostra(i, this.musicDownload);
    }
  }

  comprarLicensa(i: any): void {
    this.musicService.comprarLicensa(i);
  }

  filtroP(e: any): void {
    this.select = e;
  }

  onChangedEvent(event: any, elem: any): void {
    elem == 'bpm' ? (this.number = event) : (this.duration = event);

    if (elem == 'duracao') {
      let dateObj: any = new Date(this.duration * 1000);
      let minutes: any = dateObj.getUTCMinutes();
      let seconds: any = dateObj.getSeconds();

      let timeString: any =
        minutes.toString().padStart(1) +
        ':' +
        seconds.toString().padStart(2, '0');
      this.durationAut = timeString;
    }
    // Só aplica filtros se há um valor definido
    if (this.number || this.duration) {
      this.applyFilters();
    }
  }

  // Métodos para carregar dados do backend
  loadArtistas(): void {
    this.musicService.getArtistas().subscribe((data: any) => {
      this.artistas = data;
    });
  }

  loadInstrumentos(): void {
    this.musicService.getInstrumentos().subscribe((data: any) => {
      this.instrumentos = data;
    });
  }

  // Métodos para lidar com mudanças nos checkboxes
  onGeneroChange(event: any): void {
    const value = event.source.value;
    if (event.checked) {
      this.selectedGeneros.push(value);
    } else {
      const index = this.selectedGeneros.indexOf(value);
      if (index > -1) {
        this.selectedGeneros.splice(index, 1);
      }
    }
    if (this.filtersInitialized) {
      this.applyFilters();
    }
  }

  onSubgeneroChange(event: any): void {
    const value = event.source.value;
    if (event.checked) {
      this.selectedSubgeneros.push(value);
    } else {
      const index = this.selectedSubgeneros.indexOf(value);
      if (index > -1) {
        this.selectedSubgeneros.splice(index, 1);
      }
    }
    if (this.filtersInitialized) {
      this.applyFilters();
    }
  }

  onVozesChange(event: any): void {
    const value = event.source.value;
    if (event.checked) {
      this.selectedVozes.push(value);
    } else {
      const index = this.selectedVozes.indexOf(value);
      if (index > -1) {
        this.selectedVozes.splice(index, 1);
      }
    }
    if (this.filtersInitialized) {
      this.applyFilters();
    }
  }

  onHumorChange(event: any): void {
    const value = event.source.value;
    if (event.checked) {
      this.selectedHumores.push(value);
    } else {
      const index = this.selectedHumores.indexOf(value);
      if (index > -1) {
        this.selectedHumores.splice(index, 1);
      }
    }
    if (this.filtersInitialized) {
      this.applyFilters();
    }
  }

  onArtistaChange(event: any): void {
    const value = event.source.value;
    if (event.checked) {
      this.selectedArtistas.push(value);
    } else {
      const index = this.selectedArtistas.indexOf(value);
      if (index > -1) {
        this.selectedArtistas.splice(index, 1);
      }
    }
    if (this.filtersInitialized) {
      this.applyFilters();
    }
  }

  onInstrumentoChange(event: any): void {
    const value = event.source.value;
    if (event.checked) {
      this.selectedInstrumentos.push(value);
    } else {
      const index = this.selectedInstrumentos.indexOf(value);
      if (index > -1) {
        this.selectedInstrumentos.splice(index, 1);
      }
    }
    if (this.filtersInitialized) {
      this.applyFilters();
    }
  }

  onKeyChange(event: any): void {
    const value = event.source.value;
    if (event.checked) {
      this.selectedKeys.push(value);
    } else {
      const index = this.selectedKeys.indexOf(value);
      if (index > -1) {
        this.selectedKeys.splice(index, 1);
      }
    }
    if (this.filtersInitialized) {
      this.applyFilters();
    }
  }

  // Método para aplicar todos os filtros
  applyFilters(): void {
    // Verifica se há algum filtro selecionado
    const hasFilters =
      this.selectedGeneros.length > 0 ||
      this.selectedSubgeneros.length > 0 ||
      this.selectedVozes.length > 0 ||
      this.selectedHumores.length > 0 ||
      this.selectedArtistas.length > 0 ||
      this.selectedInstrumentos.length > 0 ||
      this.selectedKeys.length > 0 ||
      (this.number && this.number > 0) ||
      (this.duration && this.duration > 0);

    if (!hasFilters) {
      // Se não há filtros, recarrega primeira página sem filtros
      this.currentFilters = null;
      this.loadMusicas(1);
      return;
    }

    // Monta objeto de filtros
    const filtros: any = {};

    if (this.selectedGeneros.length > 0) filtros.genero = this.selectedGeneros;
    if (this.selectedSubgeneros.length > 0)
      filtros.subgenero = this.selectedSubgeneros;
    if (this.selectedVozes.length > 0) filtros.vozes = this.selectedVozes;
    if (this.selectedHumores.length > 0) filtros.humor = this.selectedHumores;
    if (this.selectedArtistas.length > 0)
      filtros.artistas = this.selectedArtistas;
    if (this.selectedInstrumentos.length > 0)
      filtros.instrumentos = this.selectedInstrumentos;
    if (this.selectedKeys.length > 0) filtros.key = this.selectedKeys;
    if (this.number && this.number > 0) filtros.bpmMax = this.number;
    if (this.duration && this.duration > 0) filtros.duracaoMax = this.duration;

    // Salva filtros atuais e reseta para página 1
    this.currentFilters = filtros;
    this.currentPage = 1;
    this.loadMusicas(1, filtros);
  }

  // Método para resetar todos os filtros
  resetFilters(): void {
    this.selectedGeneros = [];
    this.selectedSubgeneros = [];
    this.selectedVozes = [];
    this.selectedHumores = [];
    this.selectedArtistas = [];
    this.selectedInstrumentos = [];
    this.selectedKeys = [];
    this.number = undefined;
    this.duration = undefined;
    this.durationAut = undefined;
    this.musicas = {
      ...this.musicas,
      bpm: undefined,
      duracao: undefined,
    };
    this.formG.patchValue(
      {
        checkbox: null,
        bpm: null,
        duracao: null,
      },
      { emitEvent: false }
    );

    // Limpa filtros atuais e recarrega primeira página
    this.currentFilters = null;
    this.currentPage = 1;
    this.loadMusicas(1);
  }

  ngOnDestroy(): void {
    if (this.playButtonBindingTimeoutId) {
      clearTimeout(this.playButtonBindingTimeoutId);
    }
    if (this.highlightTimeoutId) {
      clearTimeout(this.highlightTimeoutId);
    }
  }
}
