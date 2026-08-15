import {Component, EventEmitter, OnDestroy, OnInit, Output, ChangeDetectionStrategy} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {Musica, MusicasService} from "../musicas/musicas.service";
import {AuthService} from "../login/auth.service";
import {ScrollService} from "../service/scroll.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ProducerProfileService} from "../service/producer-profile.service";
import {DashboardService} from "../dashboard-produtor/dashboard.service";
import {DashboardSummary, formatBRL} from "../dashboard-produtor/dashboard.models";
import {MusicPlayerService} from "../service/music-player.service";

@Component({
    selector: 'app-artist',
    templateUrl: './artist.component.html',
    styleUrls: ['./artist.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ArtistComponent implements OnInit, OnDestroy {

  public favorite: Musica = {};
  trecho: any[] = [15, 30, 60];
  selectedKeys: string[] = [];
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
  $$: any;

  vozes: Array<any> = [
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

  // Identidade real do produtor autenticado (R29, Decisão 1) — nunca hard-coded.
  producerId: string = '';
  nomeArtistico: string = '';
  biografia: string = '';
  avatarUrl: string = '';

  perfilCarregando = true;
  perfilErro = false;
  perfilEditavel = false;
  savingProfile = false;
  removendoId: number | null = null;

  resumoVendas: DashboardSummary | null = null;
  resumoVendasErro = false;
  readonly formatBRL = formatBRL;

  // Preview/player (R29, achado Alto): reaproveita o player global único
  // (app-player em app.component.html) via MusicPlayerService — nunca cria
  // uma instância própria de WaveSurfer aqui.
  playingId: number | null = null;
  private playerSubscription = new Subscription();

  @Output('ngModelChange') update: any = new EventEmitter();

  constructor(
    private musicService: MusicasService,
    private authService: AuthService,
    private scrollService: ScrollService,
    private fb: FormBuilder,
    private producerProfileService: ProducerProfileService,
    private dashboardService: DashboardService,
    private musicPlayerService: MusicPlayerService,
    private snackBar: MatSnackBar,
  ) {
    this.formG = this.fb.group({
      bpm: [],
      duracao: [],
      textAreaDescription: [{value: '', disabled: true}],
      nameArtist: [{value: '', disabled: true}],
    });
    this.titles = this.musicService.convertida2;
    this.music = this.musicService.convertida;
    this.humor = this.musicService.humor;
  }

  ngOnInit(): void {
    this.scrollService.scrollUp();
    this.$$ = document.querySelector.bind(document);
    if (screen.width < 769) document.getElementById('navLeft')!.style.width = '0';

    this.carregarPerfil();
    this.carregarResumoVendas();

    this.playerSubscription.add(
      this.musicPlayerService.playPauseAction$.subscribe(({ action, musicId }) => {
        if (action === 'pause' && this.playingId === musicId) this.playingId = null;
      })
    );
  }

  ngOnDestroy(): void {
    this.playerSubscription.unsubscribe();
  }

  tocarFaixa(musica: Musica): void {
    if (musica.id == null) return;

    if (this.playingId === musica.id) {
      this.musicPlayerService.onPlayPause('pause', musica.id);
      this.playingId = null;
      return;
    }

    this.musicPlayerService.setCurrentMusicID(musica.id);
    this.musicPlayerService.setCurrentMusicUrl(musica.url);
    this.musicPlayerService.setCurrentMusic(musica);
    this.musicPlayerService.onPlayPause('play', musica.id);
    this.playingId = musica.id;
  }

  reproduzirPrimeiraFaixa(): void {
    if (this.arrMusica.length > 0) this.tocarFaixa(this.arrMusica[0]);
  }

  carregarPerfil(): void {
    this.perfilCarregando = true;
    this.perfilErro = false;
    this.producerProfileService.getMyProfile().subscribe({
      next: (perfil) => {
        this.producerId = perfil.producerId;
        this.nomeArtistico = perfil.nomeArtistico;
        this.biografia = perfil.biografia;
        this.avatarUrl = perfil.avatarUrl;
        this.formG.patchValue({
          nameArtist: perfil.nomeArtistico,
          textAreaDescription: perfil.biografia,
        });
        this.perfilCarregando = false;

        this.musicService.getByProducer(perfil.producerId).subscribe({
          next: (faixas) => { this.arrMusica = faixas ?? []; },
          error: () => { this.arrMusica = []; },
        });
      },
      error: () => {
        this.perfilCarregando = false;
        this.perfilErro = true;
      },
    });
  }

  carregarResumoVendas(): void {
    this.dashboardService.getSummary().subscribe({
      next: (summary) => { this.resumoVendas = summary; },
      error: () => { this.resumoVendasErro = true; },
    });
  }

  onChange(event: any): void {
    const file: File | undefined = event.target?.files?.[0];
    if (!file) return;

    this.producerProfileService.uploadAvatar(file).subscribe({
      next: ({ url }) => {
        this.avatarUrl = url;
        this.snackBar.open('Avatar atualizado com sucesso!', '', { duration: 4000 });
      },
      error: () => {
        this.snackBar.open('Erro ao enviar avatar. Tente novamente.', '', { duration: 5000 });
      },
    });
  }

  editDescription(): void {
    this.perfilEditavel = true;
    this.formG.get('nameArtist')?.enable();
    this.formG.get('textAreaDescription')?.enable();
  }

  cancelarEdicaoPerfil(): void {
    this.perfilEditavel = false;
    this.formG.patchValue({
      nameArtist: this.nomeArtistico,
      textAreaDescription: this.biografia,
    });
    this.formG.get('nameArtist')?.disable();
    this.formG.get('textAreaDescription')?.disable();
  }

  salvarPerfil(): void {
    this.savingProfile = true;
    const nomeArtistico = this.formG.get('nameArtist')?.value ?? '';
    const biografia = this.formG.get('textAreaDescription')?.value ?? '';

    this.producerProfileService.saveMyProfile({ nomeArtistico, biografia }).subscribe({
      next: () => {
        this.savingProfile = false;
        this.perfilEditavel = false;
        this.nomeArtistico = nomeArtistico;
        this.biografia = biografia;
        this.formG.get('nameArtist')?.disable();
        this.formG.get('textAreaDescription')?.disable();
        this.snackBar.open('Perfil atualizado com sucesso!', '', { duration: 4000 });
      },
      error: () => {
        this.savingProfile = false;
        this.snackBar.open('Erro ao salvar perfil. Tente novamente.', '', { duration: 5000 });
      },
    });
  }

  removerFaixa(musica: Musica): void {
    if (musica.id == null) return;
    const confirmado = window.confirm(`Remover "${musica.nome_musica}"? Esta ação não pode ser desfeita.`);
    if (!confirmado) return;

    this.removendoId = musica.id;
    this.musicService.remove(musica.id).subscribe({
      next: () => {
        this.arrMusica = this.arrMusica.filter((m) => m.id !== musica.id);
        this.removendoId = null;
        this.snackBar.open('Faixa removida com sucesso!', '', { duration: 4000 });
      },
      error: () => {
        this.removendoId = null;
        this.snackBar.open('Erro ao remover faixa. Tente novamente.', '', { duration: 5000 });
      },
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

  comprarLicensa(musica: Musica): void { this.musicService.comprarLicensa(musica); }

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
