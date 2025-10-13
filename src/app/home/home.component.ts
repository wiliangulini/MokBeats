
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from "../login/auth.service";
import { Musica, MusicasService } from "../musicas/musicas.service";
import { Router } from "@angular/router";
import { ScrollService } from "../service/scroll.service";
import { MusicPlayerService } from "../service/music-player.service";

interface GeneroM {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, AfterViewChecked {

  form: FormGroup;
  public mokbeats: any = {};
  icon: string[] = [];
  musicAdd: any;
  musicDownload: any[] = [];
  play_pause: string = 'play';
  isPlaying: boolean = false;
  currentTrackIndex: number = -1;

  dados: Array<any> = [
    { value: 'Sweet Spot', viewValue: 'Sweet Spot' },
    { value: 'Bonieky', viewValue: 'Bonieky' },
    { value: 'Wilian', viewValue: 'Wilian' },
    { value: 'Maleficus Chaos', viewValue: 'Maleficus Chaos' },
    { value: 'HighFrenetic', viewValue: 'HighFrenetic' }
  ];

  primeirasCincoMusicas: any[] = [];
  arrMusica: Musica[] = [];

  generoM: GeneroM[] = [
    { value: 'Músicas', viewValue: 'Músicas' },
    { value: 'Efeitos', viewValue: 'Efeitos' },
  ];

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private musicService: MusicasService,
    private scrollService: ScrollService,
    private router: Router,
    private musicPlayerService: MusicPlayerService
  ) {
    this.form = this.fb.group({
      search: [],
      email: [],
      genero: [],
    });
  }

  ngOnInit(): void {
    this.scrollService.scrollUp();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
    this.musicService.getLatestUniqueByProducer(5).subscribe((data: any) => {
      this.primeirasCincoMusicas = Array.isArray(data) ? data : [];
      // Inicializa os ícones como 'play_circle' para cada música
      this.icon = this.primeirasCincoMusicas.map(() => 'play_circle');
    }, err => {
      console.error(err);
      // Fallback simples
      this.musicService.list().subscribe((all: any) => {
        this.primeirasCincoMusicas = (all || []).slice(0,5);
        // Inicializa os ícones como 'play_circle' para cada música
        this.icon = this.primeirasCincoMusicas.map(() => 'play_circle');
      });
    });
    this.form.get('genero')?.setValue(this.generoM[0].viewValue);
  }

  // Formata duração em "X min YY seg" com zero à esquerda nos segundos
  formatDur(ms?: number): string {
    if (!ms && ms !== 0) return '';
    const totalSeconds = Math.floor((ms || 0) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const pad = seconds.toString().padStart(2, '0');
    return `${minutes} min ${pad} seg`;
  }

  routeNav(txt: string): void {
    if (txt === 'musicas') {
      this.router.navigate(['/musicas']).then();
    } else if (txt === 'precos') {
      this.router.navigate(['/precos']).then();
    }
  }

  curtir(i: number) {
    return this.musicService.curtir(i);
  }

  addPlayList(music: Musica) {
    return this.musicService.addPlayList(music);
  }

  copiarLink(i: number) {
    return this.musicService.copiarLink(i);
  }

  baixarAmostra(i: number) {
    //this.musicDownload.push(this.arrMusic[i].viewValue);
    this.musicDownload.push(this.dados[i].viewValue);
    this.musicService.baixarAmostra(i, this.musicDownload);
  }

  verificaLogin() {
    this.authService.verificaLogin();
  }

  comprarLicensa(i: number) {
    this.musicService.comprarLicensa(i);
  }

  onSubmit(): void {
    console.log(this.mokbeats.search);
    console.log(this.mokbeats.genero);
    console.log(this.mokbeats.email);
  }

  onPlayPause(action: string, musicId: number, index: number): void {
    this.play_pause = action;

    // Encontra a música selecionada
    const selectedMusic = this.primeirasCincoMusicas[index];

    if (!selectedMusic) return;

    // Mostra o player
    this.playerShow();

    // Alterna entre play e pause
    if (this.isPlaying && this.currentTrackIndex === index) {
      // Se está tocando a mesma música, pausa
      this.musicPlayerService.onPlayPause('pause', musicId);
      this.icon[index] = 'play_circle';
      this.isPlaying = false;
      this.play_pause = 'play';
    } else {
      // Se não está tocando ou é outra música, toca
      // Pausa a música anterior se houver
      if (this.currentTrackIndex >= 0 && this.currentTrackIndex !== index) {
        this.icon[this.currentTrackIndex] = 'play_circle';
      }

      // Define a música atual
      this.currentTrackIndex = index;
      this.musicPlayerService.setCurrentMusicID(selectedMusic.id);
      this.musicPlayerService.setCurrentMusicUrl(selectedMusic.url);
      this.musicPlayerService.onPlayPause('play', musicId);
      this.icon[index] = 'pause_circle';
      this.isPlaying = true;
      this.play_pause = 'pause';
    }
  }

  playerShow(): void {
    const controlPlayer: any = document.querySelector('#controlPlayer');
    if (controlPlayer) {
      controlPlayer.classList.remove('hidePlayer');
      controlPlayer.classList.add('showPlayer');
    }
  }
}
