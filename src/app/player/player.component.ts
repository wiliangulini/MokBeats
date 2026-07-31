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
import { Musica, MusicasService, MusicStem } from '../musicas/musicas.service';
import { MusicPlayerService } from '../service/music-player.service';
import { PlayerService } from './player.service';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss'],
    standalone: false
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
  private subscription = new Subscription();
  private stemsLoadSubscription?: Subscription;
  wavesurfer!: WaveSurfer;
  stems: WaveSurfer[] = [];
  stemLabels: string[] = [];
  stemTrackAvailable: boolean[] = [false, false, false, false];
  stemVolumes: number[] = [75, 75, 75, 75];
  stemMuted: boolean[] = [false, false, false, false];
  private lastLoadedStemsMusicId: number = -1;
  private playbackMode: 'full' | 'stems' = 'full';
  isStemsPlaying: boolean = false;
  stemsReady: boolean = false;
  stemsLoading: boolean = false;
  stemsEmpty: boolean = false;
  stemsLoadError: boolean = false;
  private stemsReadyCount: number = 0;
  private stemsExpectedCount: number = 0;
  private isSyncing: boolean = false;

  constructor(
    private musicService: MusicasService,
    private playerService: PlayerService,
    private cdRef: ChangeDetectorRef,
    private musicPlayerService: MusicPlayerService,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.musicPlayerService.playPauseAction$.subscribe(
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
      ),
    );

    this.subscription.add(
      this.musicPlayerService.currentMusicUrl$.subscribe((url) => {
        console.log(url);
        this.currentMusicUrl = url;
        if (url.length > 0) {
          // Exibe o player assim que uma música for selecionada
          this.playerService.showPlayer();
          this.playMusicUrl(url);
        }
      }),
    );

    this.subscription.add(
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
      }),
    );

    this.subscription.add(
      this.musicPlayerService.currentMusic$.subscribe((music) => {
        this.currentMusic = music;
      }),
    );

    // Responde às solicitações de seek vindas da lista
    this.subscription.add(
      this.musicPlayerService.seekRequest$.subscribe(({ musicId, time }) => {
        try {
          if (this.idMusicCurrent === musicId && this.wavesurfer) {
            this.seekActivePlayback(time);
          }
        } catch (e) {
        }
      }),
    );
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
      this.seekActivePlayback(this.getActiveDuration());
      this.playerService.tooglePlayPause();
    });
    backButton.addEventListener('click', (): void => {
      this.seekActivePlayback(0);
      this.playerService.tooglePlayPause();
    });
    prev10.addEventListener('click', (): void => {
      this.skipActivePlayback(-10);
    });
    next10.addEventListener('click', (): void => {
      this.skipActivePlayback(10);
    });
  }

  ngOnDestroy() {
    this.stemsLoadSubscription?.unsubscribe();
    this.subscription.unsubscribe();
    this.destroyStems();
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
    if (this.playbackMode === 'stems' || this.isStemsPlaying) {
      this.pauseStemsMode();
      return;
    }
    this.playbackMode = 'full';
    this.pauseAllStems();
    this.wavesurfer.play();
    this.playerService.tooglePlayPause();
    this.isPlaying2 = true;
    // Stems são controlados automaticamente pelo evento 'play' do wavesurfer principal (linha 141)
  }

  pauseMusic(musicId: any) {
    if (this.playbackMode === 'stems' || this.isStemsPlaying) {
      this.pauseStemsMode();
      return;
    }
    this.wavesurfer.pause();
    this.playerService.tooglePlayPause();
    this.isPlaying2 = false;
    // Stems são controlados automaticamente pelo evento 'pause' do wavesurfer principal (linha 148)
  }

  playPause(): void {
    if (this.playbackMode === 'stems' || this.isStemsPlaying) {
      this.pauseStemsMode();
      return;
    }
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
      this.stems.forEach((s) => {
        try {
          s.pause();
          s.destroy();
        } catch (e) {}
      });
    } catch (e) {
    }
    this.stems = [];
  }

  private pauseAllStems(): void {
    this.stems.forEach((s) => {
      try {
        s.pause();
      } catch (e) {}
    });
    this.isStemsPlaying = false;
  }

  private resetStemLoadState(): void {
    this.playbackMode = 'full';
    this.isStemsPlaying = false;
    this.stemsReady = false;
    this.stemsLoading = false;
    this.stemsEmpty = false;
    this.stemsLoadError = false;
    this.stemsReadyCount = 0;
    this.stemsExpectedCount = 0;
    this.stemLabels = [];
    this.stemTrackAvailable = [false, false, false, false];
    this.stemVolumes = [75, 75, 75, 75];
    this.stemMuted = [false, false, false, false];
  }

  private clearStemContainers(): void {
    for (let i = 0; i < 4; i++) {
      const el = document.querySelector(`#trackCustom${i + 1}`) as HTMLElement | null;
      if (!el) continue;
      Array.from(el.children).forEach((child) => {
        if (!(child as HTMLElement).classList.contains('stem-badge')) {
          child.remove();
        }
      });
    }
  }

  hasStem(index: number): boolean {
    return !!this.stemTrackAvailable[index];
  }

  private normalizeStemResponse(data: MusicStem[] | unknown): MusicStem[] {
    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .filter((stem): stem is MusicStem => {
        return !!stem && typeof stem.url === 'string' && stem.url.trim().length > 0;
      })
      .slice(0, 4)
      .map((stem, index) => ({
        ...stem,
        label: this.getStemLabel(stem, index),
        url: stem.url!.trim(),
      }));
  }

  private getStemLabel(stem: MusicStem, index: number): string {
    return stem.label || stem.type || `STEM ${index + 1}`;
  }

  private createStemWaveSurfer(stemData: MusicStem, index: number): void {
    this.stemLabels[index] = this.getStemLabel(stemData, index);
    this.stemTrackAvailable[index] = true;

    const stem = WaveSurfer.create({
      container: `#trackCustom${index + 1}`,
      waveColor: '#fff',
      progressColor: '#dcad54',
      minPxPerSec: 100,
      url: stemData.url,
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

    this.stems[index] = stem;

    (stem as any).on('seek', (progress: number) => {
      if (this.isSyncing) return;
      const duration = stem.getDuration() || 0;
      this.seekActivePlayback(progress * duration);
    });

    (stem as any).on('audioprocess', () => {
      if (this.playbackMode !== 'stems') return;
      try {
        const time = (stem as any)?.getCurrentTime?.() || 0;
        this.musicPlayerService.setCurrentTime(time);
      } catch (e) {}
    });

    stem.on('ready', () => {
      this.applyStoredStemSettings(index);
      this.stemsReadyCount++;
      this.stemsReady = this.stemsReadyCount >= this.stemsExpectedCount;
      this.stemsLoading = !this.stemsReady;
    });

    (stem as any).on('error', (error: unknown) => {
      this.stemsLoadError = true;
      this.stemsLoading = false;
      this.stemsReady = false;
      console.warn('Erro ao carregar stem da música.', error);
    });
  }

  onStemVolumeInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    this.setStemVolume(index, Number(input.value));
  }

  toggleStemMute(index: number): void {
    const stem = this.stems[index];
    if (!stem) return;

    if (this.stemMuted[index]) {
      const restoredVolume = this.getStoredStemVolume(index);
      this.stemMuted[index] = false;
      this.stemVolumes[index] = restoredVolume;
      stem.setMuted(false);
      stem.setVolume(restoredVolume / 100);
      this.persistStemSettings(index, restoredVolume, false);
      return;
    }

    const currentVolume = this.stemVolumes[index] || this.getStoredStemVolume(index);
    this.stemMuted[index] = true;
    this.stemVolumes[index] = 0;
    stem.setMuted(true);
    this.persistStemSettings(index, currentVolume, true);
  }

  private setStemVolume(index: number, volume: number): void {
    const stem = this.stems[index];
    if (!stem) return;

    const clampedVolume = this.clampVolume(volume);
    const muted = clampedVolume === 0;
    this.stemVolumes[index] = clampedVolume;
    this.stemMuted[index] = muted;
    stem.setVolume(clampedVolume / 100);
    stem.setMuted(muted);
    this.persistStemSettings(index, clampedVolume || this.getStoredStemVolume(index), muted);
  }

  private applyStoredStemSettings(index: number): void {
    const stem = this.stems[index];
    if (!stem) return;

    const storedVolume = this.getStoredStemVolume(index);
    const muted = this.getStoredStemMuted(index);
    stem.setVolume(storedVolume / 100);
    stem.setMuted(muted);
    this.stemMuted[index] = muted;
    this.stemVolumes[index] = muted ? 0 : storedVolume;
  }

  private persistStemSettings(index: number, volume: number, muted: boolean): void {
    try {
      localStorage.setItem(this.getStemVolKey(index), String(this.clampVolume(volume)));
      localStorage.setItem(this.getStemMutedKey(index), String(muted));
    } catch (e) {}
  }

  private getStoredStemVolume(index: number): number {
    try {
      const stored = Number(localStorage.getItem(this.getStemVolKey(index)));
      return this.clampVolume(Number.isFinite(stored) && stored > 0 ? stored : 75);
    } catch (e) {
      return 75;
    }
  }

  private getStoredStemMuted(index: number): boolean {
    try {
      return localStorage.getItem(this.getStemMutedKey(index)) === 'true';
    } catch (e) {
      return false;
    }
  }

  private clampVolume(volume: number): number {
    if (!Number.isFinite(volume)) return 0;
    return Math.max(0, Math.min(100, Math.round(volume)));
  }

  private getActiveCurrentTime(): number {
    try {
      if (this.playbackMode === 'stems' && this.stems[0]) {
        return (this.stems[0] as any)?.getCurrentTime?.() || 0;
      }
      return (this.wavesurfer as any)?.getCurrentTime?.() || 0;
    } catch (e) {
      return 0;
    }
  }

  private getActiveDuration(): number {
    try {
      if (this.playbackMode === 'stems' && this.stems[0]) {
        return this.stems[0].getDuration() || this.timeSkip || 0;
      }
      return this.wavesurfer?.getDuration?.() || this.timeSkip || 0;
    } catch (e) {
      return this.timeSkip || 0;
    }
  }

  private skipActivePlayback(delta: number): void {
    const duration = this.getActiveDuration();
    const currentTime = this.getActiveCurrentTime();
    const targetTime = Math.max(0, Math.min(duration, currentTime + delta));
    this.seekActivePlayback(targetTime);
  }

  private seekActivePlayback(time: number): void {
    const duration = this.getActiveDuration();
    const targetTime = duration > 0 ? Math.max(0, Math.min(duration, time)) : Math.max(0, time);
    this.isSyncing = true;

    try {
      if (this.wavesurfer) {
        this.wavesurfer.setTime(targetTime);
      }
      this.stems.forEach((stem) => {
        try {
          stem.setTime(targetTime);
        } catch (e) {}
      });
      this.musicPlayerService.setCurrentTime(targetTime);
    } catch (e) {
    } finally {
      Promise.resolve().then(() => {
        this.isSyncing = false;
      });
    }
  }

  initWavesurferHandlers(): void {
    // Guard: só cascateia play para stems quando em modo 'stems'
    this.wavesurfer.on('play', () => {
      if (this.playbackMode !== 'stems') return;
      const currentTime = (this.wavesurfer as any)?.getCurrentTime?.() || 0;
      this.stems.forEach((s) => {
        try { s.setTime(currentTime); s.play(); } catch (e) {}
      });
      this.isStemsPlaying = true;
    });
    // Guard: em modo 'stems', não cascatear pause para evitar race condition
    this.wavesurfer.on('pause', () => {
      if (this.playbackMode === 'stems') return;
      this.pauseAllStems();
    });
    (this.wavesurfer as any).on('seek', (progress: number) => {
      if (this.isSyncing) return;
      try {
        const time = progress * (this.wavesurfer.getDuration() || 0);
        this.seekActivePlayback(time);
      } catch (e) {}
    });
    (this.wavesurfer as any).on('audioprocess', () => {
      if (this.playbackMode === 'stems') return;
      try {
        const time = (this.wavesurfer as any)?.getCurrentTime?.() || 0;
        this.musicPlayerService.setCurrentTime(time);
      } catch (e) {}
    });
  }

  private loadStems(id: number) {
    this.stemsLoadSubscription?.unsubscribe();
    this.resetStemLoadState();
    this.destroyStems();
    this.clearStemContainers();
    this.stemsLoading = true;

    this.stemsLoadSubscription = this.musicService.getStemsByMusicId(id).subscribe({
      next: (data: MusicStem[]) => {
        if (this.idMusicCurrent !== id) return;

        const stems = this.normalizeStemResponse(data);
        this.stemsExpectedCount = stems.length;

        if (stems.length === 0) {
          this.stemsLoading = false;
          this.stemsEmpty = true;
          return;
        }

        stems.forEach((stem, index) => this.createStemWaveSurfer(stem, index));
      },
      error: (error: any) => {
        if (this.idMusicCurrent !== id) return;

        this.stemsLoading = false;
        this.stemsReady = false;
        if (error?.status === 404) {
          this.stemsEmpty = true;
          return;
        }

        this.stemsLoadError = true;
        console.warn('Erro ao carregar stems da música.', error);
      },
    });

    this.subscription.add(this.stemsLoadSubscription);
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
    if (!muteOn || !muteOff) return;
    muteOn.classList.add('d-flex');
    muteOn.classList.remove('d-none');
    muteOff.classList.remove('d-flex');
    muteOff.classList.add('d-none');
  }
  muteOffAdd(elm: any, elm2: any): void {
    let muteOn: any = elm;
    let muteOff: any = elm2;
    if (!muteOn || !muteOff) return;
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
    const currentTime = this.getActiveCurrentTime();
    // Define modo ANTES de pausar wavesurfer: on('pause') verá 'stems' e não cascateará
    this.playbackMode = 'stems';
    try { this.wavesurfer.pause(); } catch (e) {}
    this.seekActivePlayback(currentTime);
    this.stems.forEach((s) => {
      try { s.play(); } catch (e) {}
    });
    this.isStemsPlaying = true;
    // Atualiza UI do botão principal se estava tocando
    if (this.isPlaying2) {
      this.playerService.tooglePlayPause();
      this.isPlaying2 = false;
    }
  }

  pauseStemsMode(): void {
    const currentTime = this.getActiveCurrentTime();
    this.playbackMode = 'full';
    this.pauseAllStems();
    // Sincroniza wavesurfer para handoff de tempo
    try { this.seekActivePlayback(currentTime); } catch (e) {}
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
      try {
        if (stem) {
          stem.setMuted(false);
          stem.setVolume(0.75);
        }
        this.stemVolumes[i] = 75;
        this.stemMuted[i] = false;
        this.persistStemSettings(i, 75, false);
      } catch (e) {}
    }
  }
}
