import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import WaveSurfer from 'wavesurfer.js';
import Minimap from 'wavesurfer.js/dist/plugins/minimap';
import { Musica, MusicasService } from '../musicas/musicas.service';
import { MusicPlayerService } from '../service/music-player.service';
import { PlayerService } from './player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  arrMusica: Musica[] = [];
  currentMusic: Musica | null = null;
  volumeInitial: any;
  volumeInitial1: any;
  volumeInitial2: any;
  volumeInitial3: any;
  volumeInitial4: any;
  timeSkip: any;
  track: any;
  currentMusicUrl: string = '';
  isPlaying: boolean = false;
  isPlaying2: boolean = false;
  musicId: any;
  idMusicCurrent!: number;
  arrayControl: any[] = [];
  private subscription?: Subscription;
  wavesurfer!: WaveSurfer;
  stems: WaveSurfer[] = [];
  stemLabels: string[] = [];
  private lastLoadedStemsMusicId: number = -1;
  private playbackMode: 'full' | 'stems' = 'full';
  isStemsPlaying: boolean = false;
  stemsReady: boolean = false;
  private stemsReadyCount: number = 0;
  private isSyncing: boolean = false;

  constructor(
    private musicService: MusicasService,
    private playerService: PlayerService,
    private cdRef: ChangeDetectorRef,
    private musicPlayerService: MusicPlayerService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.musicPlayerService.playPauseAction$.subscribe(
      ({ action, musicId }) => {
        console.log(action, musicId);
        this.musicId = musicId;
        if (this.currentMusicUrl.length > 0) {
          if (action === 'play') {
            this.playerService.showPlayer();
            this.playMusic(musicId);
          } else if (action === 'pause') {
            this.pauseMusic(musicId);
          }
        }
      },
    );
    this.musicPlayerService.currentMusicUrl$.subscribe((url) => {
      console.log(url);
      this.currentMusicUrl = url;
      if (url.length > 0) {
        // Exibe o player assim que uma música for selecionada
        this.playerService.showPlayer();
        this.playMusicUrl(url);
      }
    });
    this.musicPlayerService.currentMusicID$.subscribe((id) => {
      console.log(id);
      if (id > -1) {
        this.idMusicPlay(id);
        // Só recarrega stems se for uma música diferente
        if (this.lastLoadedStemsMusicId !== id) {
          this.loadStems(id);
          this.lastLoadedStemsMusicId = id;
        }
      }
    });

    this.musicPlayerService.currentMusic$.subscribe((music) => {
      this.currentMusic = music;
    });

    // Responde às solicitações de seek vindas da lista
    this.musicPlayerService.seekRequest$.subscribe(({ musicId, time }) => {
      try {
        if (this.idMusicCurrent === musicId && this.wavesurfer) {
          this.wavesurfer.setTime(time);
          // Mantém stems sincronizados ao seek originado na lista
          try {
            this.stems.forEach((s) => {
              try {
                s.setTime(time);
              } catch (e) {}
            });
          } catch (e) {}
          // stems e tempo global já são ajustados pelos handlers de seek/audioprocess
        }
      } catch (e) {}
    });
  }

  ngAfterViewChecked() {
    if (!this.isPlaying) {
      if (this.arrMusica.length === 0) {
        this.arrMusica = JSON.parse(String(localStorage.getItem('arrMusica')));
        console.log(this.arrMusica);
        this.isPlaying = true;
      }
    }
    this.cdRef.detectChanges();
  }

  ngAfterViewInit(): void {
    // Aplicar estado minimizado persistido
    try {
      const minimized = localStorage.getItem('playerMinimized') === 'true';
      if (minimized) {
        this.playerService.hidePlayer();
      }
    } catch (e) {}

    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: '#fff',
      progressColor: '#dcad54',
      minPxPerSec: 100,
      hideScrollbar: true,
      fillParent: true,
      height: 0,
      backend: 'MediaElement',
      plugins: [
        Minimap.create({
          height: 50,
          waveColor: '#fff',
          progressColor: '#dcad54',
          dragToSeek: true,
        }),
      ],
    });

    this.initWavesurferHandlers();

    const mutedTrack1: any = document.getElementById('mutedTrack1');
    const volumeOnTrackCustom1: any = document.getElementById(
      'volumeOnTrackCustom1',
    );
    const muteOn1: any = document.querySelector('.muteOn1');
    const muteOff1: any = document.querySelector('.muteOff1');
    this.volumeInitial1 = document
      .querySelector('#mutedTrack1')!
      .getAttribute('value');
    const mutedTrack2: any = document.getElementById('mutedTrack2');
    const volumeOnTrackCustom2: any = document.getElementById(
      'volumeOnTrackCustom2',
    );
    const muteOn2: any = document.querySelector('.muteOn2');
    const muteOff2: any = document.querySelector('.muteOff2');
    this.volumeInitial2 = document
      .querySelector('#mutedTrack2')!
      .getAttribute('value');
    const mutedTrack3: any = document.getElementById('mutedTrack3');
    const volumeOnTrackCustom3: any = document.getElementById(
      'volumeOnTrackCustom3',
    );
    const muteOn3: any = document.querySelector('.muteOn3');
    const muteOff3: any = document.querySelector('.muteOff3');
    this.volumeInitial3 = document
      .querySelector('#mutedTrack3')!
      .getAttribute('value');
    const mutedTrack4: any = document.getElementById('mutedTrack4');
    const volumeOnTrackCustom4: any = document.getElementById(
      'volumeOnTrackCustom4',
    );
    const muteOn4: any = document.querySelector('.muteOn4');
    const muteOff4: any = document.querySelector('.muteOff4');
    this.volumeInitial4 = document
      .querySelector('#mutedTrack4')!
      .getAttribute('value');

    // A configuração dos controles de volume dos stems ocorrerá após loadStems()
    // Uma vez que cada stem terá sua própria instância de WaveSurfer.
    {
      if (mutedTrack1) {
        // Handlers serão ligados em bindStemControls(0, ...)
      }
      let volbox1: any = document.querySelector('.volbox1');
      let volboxAdd1 = () => {
        volbox1.classList.add('d-flex');
        mutedTrack1.classList.add('d-flex');
      };
      let volboxRemove1 = () => {
        volbox1.classList.remove('d-flex');
        mutedTrack1.classList.remove('d-flex');
      };
      volumeOnTrackCustom1.addEventListener('mouseover', () => {
        volboxAdd1();
        volbox1.addEventListener('mouseover', () => {
          volboxAdd1();
        });
        mutedTrack1.addEventListener('mouseover', () => {
          volboxAdd1();
        });
      });
      volumeOnTrackCustom1.addEventListener('mouseout', () => {
        volboxRemove1();
        volbox1.addEventListener('mouseout', () => {
          volboxRemove1();
        });
        mutedTrack1.addEventListener('mouseout', () => {
          volboxRemove1();
        });
      });

      // handlers serão ligados em bindStemControls(1, ...)
      let volbox2: any = document.querySelector('.volbox2');
      let volboxAdd2 = () => {
        volbox2.classList.add('d-flex');
        mutedTrack2.classList.add('d-flex');
      };
      let volboxRemove2 = () => {
        volbox2.classList.remove('d-flex');
        mutedTrack2.classList.remove('d-flex');
      };
      volumeOnTrackCustom2.addEventListener('mouseover', () => {
        volboxAdd2();
        volbox2.addEventListener('mouseover', () => {
          volboxAdd2();
        });
        mutedTrack2.addEventListener('mouseover', () => {
          volboxAdd2();
        });
      });
      volumeOnTrackCustom2.addEventListener('mouseout', () => {
        volboxRemove2();
        volbox2.addEventListener('mouseout', () => {
          volboxRemove2();
        });
        mutedTrack2.addEventListener('mouseout', () => {
          volboxRemove2();
        });
      });

      // handlers serão ligados em bindStemControls(2, ...)
      let volbox3: any = document.querySelector('.volbox3');
      let volboxAdd3 = () => {
        volbox3.classList.add('d-flex');
        mutedTrack3.classList.add('d-flex');
      };
      let volboxRemove3 = () => {
        volbox3.classList.remove('d-flex');
        mutedTrack3.classList.remove('d-flex');
      };
      volumeOnTrackCustom3.addEventListener('mouseover', () => {
        volboxAdd3();
        volbox3.addEventListener('mouseover', () => {
          volboxAdd3();
        });
        mutedTrack3.addEventListener('mouseover', () => {
          volboxAdd3();
        });
      });
      volumeOnTrackCustom3.addEventListener('mouseout', () => {
        volboxRemove3();
        volbox3.addEventListener('mouseout', () => {
          volboxRemove3();
        });
        mutedTrack3.addEventListener('mouseout', () => {
          volboxRemove3();
        });
      });

      // handlers serão ligados em bindStemControls(3, ...)
      let volbox4: any = document.querySelector('.volbox4');
      let volboxAdd4 = () => {
        volbox4.classList.add('d-flex');
        mutedTrack4.classList.add('d-flex');
      };
      let volboxRemove4 = () => {
        volbox4.classList.remove('d-flex');
        mutedTrack4.classList.remove('d-flex');
      };
      volumeOnTrackCustom4.addEventListener('mouseover', () => {
        volboxAdd4();
        volbox4.addEventListener('mouseover', () => {
          volboxAdd4();
        });
        mutedTrack4.addEventListener('mouseover', () => {
          volboxAdd4();
        });
      });
      volumeOnTrackCustom4.addEventListener('mouseout', () => {
        volboxRemove4();
        volbox4.addEventListener('mouseout', () => {
          volboxRemove4();
        });
        mutedTrack4.addEventListener('mouseout', () => {
          volboxRemove4();
        });
      });
    }

    const prev10: any = document.querySelector('.prev10sec');
    const next10: any = document.querySelector('.next10sec');
    const backButton: any = document.querySelector('#backward');
    const forwardButton: any = document.querySelector('#forward');
    const timeEl: any = document.querySelector('#time');
    const durationEl: any = document.querySelector('#duration');
    const volumeSlider: any = document.querySelector('#volumeSlider');
    const volumeOn: any = document.querySelector('#volumeOn');
    const muteOn: any = document.querySelector('.muteOn');
    const muteOff: any = document.querySelector('.muteOff');
    this.volumeInitial = document
      .querySelector('#volumeSlider')!
      .getAttribute('value');

    const formatTime = (seconds: any) => {
      const total = Math.round(Number(seconds) || 0);
      const minutes = Math.floor(total / 60);
      const secondsRemainder = total % 60;
      const paddedSeconds = `0${secondsRemainder}`.slice(-2);
      return `${minutes}:${paddedSeconds}`;
    };

    this.wavesurfer.on('decode', (duration: any) => {
      durationEl.textContent = formatTime(duration);
      this.timeSkip = duration;
    });
    this.wavesurfer.on('timeupdate', (currentTime: any) => {
      timeEl.textContent = formatTime(currentTime);
    });
    this.wavesurfer.on('ready', () => {
      if (volumeSlider) {
        volumeSlider.addEventListener('input', (e: any) => {
          let vol: any = e.target.value;
          this.wavesurfer.setVolume(vol / 100);
          if (vol == '0') {
            this.muteOffAdd(muteOn, muteOff);
          } else {
            this.muteOnAdd(muteOn, muteOff);
          }
        });

        volumeOn.addEventListener('click', (e: any) => {
          if (muteOn.classList.contains('d-flex')) {
            this.wavesurfer.setMuted(true);
            this.muteOffAdd(muteOn, muteOff);
            volumeSlider.value = '0';
          } else if (muteOff.classList.contains('d-flex')) {
            this.wavesurfer.setMuted(false);
            this.muteOnAdd(muteOn, muteOff);
            volumeSlider.value = this.volumeInitial;
          }
        });
      }

      let volbox: any = document.querySelector('.volbox');
      let volboxAdd = () => {
        volbox.classList.add('d-flex');
        volumeSlider.classList.add('d-flex');
      };
      let volboxRemove = () => {
        volbox.classList.remove('d-flex');
        volumeSlider.classList.remove('d-flex');
      };
      volumeOn.addEventListener('mouseover', () => {
        volboxAdd();
        volbox.addEventListener('mouseover', () => {
          volboxAdd();
        });
        volumeSlider.addEventListener('mouseover', () => {
          volboxAdd();
        });
      });
      volumeOn.addEventListener('mouseout', () => {
        volboxRemove();
        volbox.addEventListener('mouseout', () => {
          volboxRemove();
        });
        volumeSlider.addEventListener('mouseout', () => {
          volboxRemove();
        });
      });
    });

    // todos segundos da track estao em timeskip, ao clicar vai direto pro final da musica ou inicio dependendo do botao clicado. API Wavesurfer Pre-decode = setTime(0) dentro de on('finish') faz a track ao terminar voltar ao inicio;
    forwardButton.addEventListener('click', (): void => {
      this.wavesurfer.setTime(this.timeSkip);
      this.playerService.tooglePlayPause();
    });
    backButton.addEventListener('click', (): void => {
      this.wavesurfer.setTime(-this.timeSkip);
      this.playerService.tooglePlayPause();
    });
    prev10.addEventListener('click', (): void => {
      this.wavesurfer.skip(-10);
    });
    next10.addEventListener('click', (): void => {
      this.wavesurfer.skip(10);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
    }
  }

  playMusicUrl(url: string): void {
    if (!this.arrayControl.includes(url)) {
      this.arrayControl.push(url, this.idMusicCurrent);
      this.wavesurfer.load(url);
      this.wavesurfer.on('finish', () => {
        this.wavesurfer.setTime(0);
        this.playMusic(this.idMusicCurrent);
      });
      // Handlers de seek/audioprocess já adicionados no ngAfterViewInit
    }
  }

  idMusicPlay(id: number) {
    this.idMusicCurrent = id;
  }

  playMusic(musicId: any) {
    this.wavesurfer.play();
    this.playerService.tooglePlayPause();
    this.isPlaying2 = true;
    // Stems são controlados automaticamente pelo evento 'play' do wavesurfer principal (linha 141)
  }

  pauseMusic(musicId: any) {
    this.wavesurfer.pause();
    this.playerService.tooglePlayPause();
    this.isPlaying2 = false;
    // Stems são controlados automaticamente pelo evento 'pause' do wavesurfer principal (linha 148)
  }

  playPause(): void {
    !this.isPlaying2
      ? this.playMusic(this.musicId)
      : this.pauseMusic(this.musicId);
    // console.log(document.querySelector('button.svg.play'))
    // isso pode servir pra controlar o play em musicas caso a criacao de outro servico nao de certo, usando o id de cada musica por botao ou entao data-key.
    let btn: any = document.querySelectorAll('button.svg.play');
    btn.forEach((btn: any) => {
      if (btn.getAttribute('data-key') == this.idMusicCurrent.toString()) {
        btn.click();
        this.playerService.tooglePlayPause();
      }
    });
  }

  trackCustomOpen() {
    let waveform: any = document.querySelector('#waveform');
    let rowPlayer: any = document.querySelector('.row.player');
    let trackCustom: any = document.getElementById('trackCustom');
    let trackCustom1: any = document.getElementById('trackCustom1');
    let trackCustom2: any = document.getElementById('trackCustom2');
    let trackCustom3: any = document.getElementById('trackCustom3');
    let trackCustom4: any = document.getElementById('trackCustom4');
    if (trackCustom.getAttribute('style') == 'display: none;') {
      trackCustom.setAttribute('style', 'display: flex;');
      waveform.setAttribute('style', 'bottom: 301px;');
      rowPlayer.setAttribute('style', 'bottom: 220px;');
    } else if (trackCustom.getAttribute('style') == 'display: flex;') {
      if (this.isStemsPlaying) {
        this.pauseStemsMode();
      }
      trackCustom.setAttribute('style', 'display: none;');
      waveform.removeAttribute('style');
      rowPlayer.removeAttribute('style');
    }
  }

  hidePlayer() {
    this.playerService.hidePlayer();
  }
  showPlayer() {
    this.playerService.showPlayer();
  }

  private destroyStems() {
    try {
      this.stems.forEach((s) => s.destroy());
    } catch (e) {}
    this.stems = [];
  }

  private bindStemControls(index: number) {
    const stem = this.stems[index];
    if (!stem) return;
    const volInput: any = document.getElementById(`mutedTrack${index + 1}`);
    const volumeBtn: any = document.getElementById(
      `volumeOnTrackCustom${index + 1}`,
    );
    const muteOn: any = document.querySelector(`.muteOn${index + 1}`);
    const muteOff: any = document.querySelector(`.muteOff${index + 1}`);
    const volbox: any = document.querySelector(`.volbox${index + 1}`);
    const initial =
      (
        document.querySelector(`#mutedTrack${index + 1}`) as HTMLElement
      )?.getAttribute('value') || '75';
    stem.on('ready', () => {
      // Estados persistidos
      const volKey = this.getStemVolKey(index);
      const mutedKey = this.getStemMutedKey(index);
      try {
        const storedVol = localStorage.getItem(volKey);
        const storedMuted = localStorage.getItem(mutedKey) === 'true';
        if (storedVol && volInput) {
          volInput.value = storedVol;
          stem.setVolume((Number(storedVol) || 0) / 100);
        }
        if (storedMuted) {
          stem.setMuted(true);
          this.muteOffAdd(muteOn, muteOff);
          if (volInput) volInput.value = '0';
        } else {
          this.muteOnAdd(muteOn, muteOff);
        }
      } catch (e) {}
      if (volInput) {
        volInput.addEventListener('input', (e: any) => {
          let vol: any = e.target.value;
          stem.setVolume((vol || 0) / 100);
          if (vol == '0') {
            this.muteOffAdd(muteOn, muteOff);
            try {
              localStorage.setItem(mutedKey, 'true');
            } catch (e) {}
          } else {
            this.muteOnAdd(muteOn, muteOff);
            try {
              localStorage.setItem(mutedKey, 'false');
              localStorage.setItem(volKey, String(vol));
            } catch (e) {}
          }
        });
      }
      if (volumeBtn) {
        volumeBtn.addEventListener('click', () => {
          if (muteOn?.classList?.contains('d-flex')) {
            stem.setMuted(true);
            this.muteOffAdd(muteOn, muteOff);
            if (volInput) volInput.value = '0';
            try {
              localStorage.setItem(mutedKey, 'true');
            } catch (e) {}
          } else if (muteOff?.classList?.contains('d-flex')) {
            stem.setMuted(false);
            this.muteOnAdd(muteOn, muteOff);
            if (volInput) volInput.value = initial;
            try {
              localStorage.setItem(mutedKey, 'false');
              localStorage.setItem(volKey, String(initial));
            } catch (e) {}
          }
        });
        // Hover box for slider
        const add = () => {
          volbox?.classList?.add('d-flex');
          volInput?.classList?.add('d-flex');
        };
        const rmv = () => {
          volbox?.classList?.remove('d-flex');
          volInput?.classList?.remove('d-flex');
        };
        volumeBtn.addEventListener('mouseover', () => {
          add();
          volbox?.addEventListener('mouseover', add);
          volInput?.addEventListener('mouseover', add);
        });
        volumeBtn.addEventListener('mouseout', () => {
          rmv();
          volbox?.addEventListener('mouseout', rmv);
          volInput?.addEventListener('mouseout', rmv);
        });
      }
    });
  }

  initWavesurferHandlers(): void {
    // Guard: só cascateia play para stems quando em modo 'stems'
    this.wavesurfer.on('play', () => {
      if (this.playbackMode !== 'stems') return;
      const currentTime = (this.wavesurfer as any)?.getCurrentTime?.() || 0;
      this.stems.forEach((s) => {
        try { s.setTime(currentTime); s.play(); } catch (e) {}
      });
    });
    // Guard: em modo 'stems', não cascatear pause para evitar race condition
    this.wavesurfer.on('pause', () => {
      if (this.playbackMode === 'stems') return;
      this.stems.forEach((s) => {
        try { s.pause(); } catch (e) {}
      });
    });
    (this.wavesurfer as any).on('seek', (progress: number) => {
      if (this.isSyncing) return;
      try {
        const time = progress * (this.wavesurfer.getDuration() || 0);
        this.isSyncing = true;
        this.stems.forEach((s) => {
          try { s.setTime(time); } catch (e) {}
        });
        Promise.resolve().then(() => { this.isSyncing = false; });
        this.musicPlayerService.setCurrentTime(time);
      } catch (e) {}
    });
    (this.wavesurfer as any).on('audioprocess', () => {
      try {
        const time = (this.wavesurfer as any)?.getCurrentTime?.() || 0;
        this.musicPlayerService.setCurrentTime(time);
      } catch (e) {}
    });
  }

  private loadStems(id: number) {
    // Reset de modo na troca de música
    this.playbackMode = 'full';
    this.isStemsPlaying = false;
    this.stemsReady = false;
    this.stemsReadyCount = 0;
    // Limpa instâncias anteriores
    this.destroyStems();
    const containers = [
      '#trackCustom1',
      '#trackCustom2',
      '#trackCustom3',
      '#trackCustom4',
    ];
    // Limpa DOM dos containers para garantir recriação
    containers.forEach((sel) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el) el.innerHTML = '';
    });
    this.musicService.getStemsByMusicId(id).subscribe((data: any[]) => {
      for (let i = 0; i < containers.length; i++) {
        const url = data?.[i]?.url;
        this.stemLabels[i] = data?.[i]?.label || `STEM ${i + 1}`;
        const s = WaveSurfer.create({
          container: containers[i],
          waveColor: '#fff',
          progressColor: '#dcad54',
          minPxPerSec: 100,
          url: url,
          hideScrollbar: true,
          fillParent: true,
          height: 0,
          backend: 'MediaElement',
          plugins: [
            Minimap.create({
              height: 40,
              waveColor: '#fff',
              progressColor: '#dcad54',
              dragToSeek: true,
            }),
          ],
        });
        this.stems.push(s);

        // Seek cross-sync: seek em qualquer stem sincroniza os demais + wavesurfer
        (s as any).on('seek', (progress: number) => {
          if (this.isSyncing) return;
          try {
            const time = progress * (s.getDuration() || 0);
            this.isSyncing = true;
            this.stems.forEach((other) => {
              if (other !== s) { try { other.setTime(time); } catch (e) {} }
            });
            if (this.playbackMode === 'stems') {
              try { this.wavesurfer.setTime(time); } catch (e) {}
            }
            Promise.resolve().then(() => { this.isSyncing = false; });
            this.musicPlayerService.setCurrentTime(time);
          } catch (e) {}
        });

        // Rastreia stems prontos para habilitar o botão
        s.on('ready', () => {
          this.stemsReadyCount++;
          if (this.stemsReadyCount >= this.stems.length) {
            this.stemsReady = true;
          }
        });

        this.bindStemControls(i);
      }
    });
  }

  private getStemVolKey(index: number): string {
    return `player:stemVol:${this.idMusicCurrent}:${index}`;
  }
  private getStemMutedKey(index: number): string {
    return `player:stemMuted:${this.idMusicCurrent}:${index}`;
  }
  muteOnAdd(elm: any, elm2: any): void {
    let muteOn: any = elm;
    let muteOff: any = elm2;
    muteOn.classList.add('d-flex');
    muteOn.classList.remove('d-none');
    muteOff.classList.remove('d-flex');
    muteOff.classList.add('d-none');
  }
  muteOffAdd(elm: any, elm2: any): void {
    let muteOn: any = elm;
    let muteOff: any = elm2;
    muteOff.classList.add('d-flex');
    muteOff.classList.remove('d-none');
    muteOn.classList.remove('d-flex');
    muteOn.classList.add('d-none');
  }
  get currentMusicBpm(): string {
    return this.currentMusic?.bpm ? `${this.currentMusic.bpm} bpm` : '—';
  }

  valueInitial(event: any) {
    this.volumeInitial = event.target.value;
  }
  curtir(e: any) {
    console.log(e);
  }
  addMusicPlayList(el: any): void {
    console.log(el);
  }
  copiarLink(elm: any) {
    console.log(elm);
  }
  baixarAmostra(i: any) {
    console.log(i);
  }

  playStemsMode(): void {
    if (!this.stemsReady || this.stems.length === 0) return;
    const currentTime = (this.wavesurfer as any)?.getCurrentTime?.() || 0;
    // Define modo ANTES de pausar wavesurfer: on('pause') verá 'stems' e não cascateará
    this.playbackMode = 'stems';
    try { this.wavesurfer.pause(); } catch (e) {}
    this.isSyncing = true;
    this.stems.forEach((s) => {
      try { s.setTime(currentTime); s.play(); } catch (e) {}
    });
    Promise.resolve().then(() => { this.isSyncing = false; });
    this.isStemsPlaying = true;
    // Atualiza UI do botão principal se estava tocando
    const pauseEl = document.querySelector('#pause');
    if (pauseEl?.classList.contains('d-flex')) {
      this.playerService.tooglePlayPause();
      this.isPlaying2 = false;
    }
  }

  pauseStemsMode(): void {
    if (this.stems.length === 0) return;
    const currentTime = (this.stems[0] as any)?.getCurrentTime?.() || 0;
    this.playbackMode = 'full';
    this.stems.forEach((s) => { try { s.pause(); } catch (e) {} });
    this.isStemsPlaying = false;
    // Sincroniza wavesurfer para handoff de tempo
    try { this.wavesurfer.setTime(currentTime); } catch (e) {}
  }

  toggleStemsPlayback(): void {
    this.isStemsPlaying ? this.pauseStemsMode() : this.playStemsMode();
  }

  resetStems() {
    // Reset player principal
    try {
      const mainVol: any = document.getElementById('volumeSlider');
      if (mainVol) {
        mainVol.value = '75';
        this.wavesurfer.setMuted(false);
        this.wavesurfer.setVolume(0.75);
        const muteOn: any = document.querySelector('.muteOn');
        const muteOff: any = document.querySelector('.muteOff');
        this.muteOnAdd(muteOn, muteOff);
      }
    } catch (e) {}
    // Reset stems
    for (let i = 0; i < 4; i++) {
      const stem = this.stems[i];
      const volInput: any = document.getElementById(`mutedTrack${i + 1}`);
      const muteOn: any = document.querySelector(`.muteOn${i + 1}`);
      const muteOff: any = document.querySelector(`.muteOff${i + 1}`);
      const volKey = this.getStemVolKey(i);
      const mutedKey = this.getStemMutedKey(i);
      try {
        if (stem) {
          stem.setMuted(false);
          stem.setVolume(0.75);
        }
        if (volInput) volInput.value = '75';
        this.muteOnAdd(muteOn, muteOff);
        localStorage.setItem(volKey, '75');
        localStorage.setItem(mutedKey, 'false');
      } catch (e) {}
    }
  }
}
