import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subscription } from 'rxjs';
import WaveSurfer from 'wavesurfer.js';
import Minimap from 'wavesurfer.js/dist/plugins/minimap';
import { MusicPlayerService } from '../service/music-player.service';
import { AudioPreloaderService } from '../service/audio-preloader.service';

@Component({
    selector: 'app-wave-surfer-test',
    templateUrl: './wave-surfer-test.component.html',
    styleUrls: ['./wave-surfer-test.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class WaveSurferTestComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() music!: any;
  @Input() idContainer!: any;
  @Input() lazyLoad: boolean = true;
  @Output() songFinished = new EventEmitter<void>();
  private subscription!: Subscription;
  private timeSub?: Subscription;
  private idSub?: Subscription;
  wavesurfer!: WaveSurfer;
  private isCurrent: boolean = false;
  private intersectionObserver?: IntersectionObserver;
  private isInitialized: boolean = false;
  private destroyed = false;
  private retryObserverCount = 0;
  private retryInitCount = 0;

  constructor(
    private musicPlayerService: MusicPlayerService,
    private audioPreloader: AudioPreloaderService
  ) {}

  ngOnInit() {
    // Controla play/pause por ação, mas sem reproduzir áudio neste componente
    this.subscription = this.musicPlayerService.playPauseAction$.subscribe(
      ({ action, musicId }) => {
        this.isCurrent = this.music.id === musicId;
        // Não chamamos play/pause do WaveSurfer local; a posição será movida pelo tempo global.
      }
    );

    // Atualiza a flag de música atual
    this.idSub = this.musicPlayerService.currentMusicID$.subscribe((id) => {
      this.isCurrent = id === this.music.id;
      if (!this.isCurrent && this.wavesurfer) {
        // Ao trocar de faixa, reseta visual desta waveform
        try {
          this.wavesurfer.setTime(0);
        } catch (e) {}
      }
    });

    // Sincroniza tempo com o player principal
    this.timeSub = this.musicPlayerService.currentTime$.subscribe((time) => {
      if (this.isCurrent && this.wavesurfer) {
        try {
          this.wavesurfer.setTime(time);
        } catch (e) {}
      }
    });
  }

  ngAfterViewInit() {
    if (this.lazyLoad) {
      // Implementa lazy loading com Intersection Observer
      this.setupIntersectionObserver();
    } else {
      // Carrega imediatamente se lazy loading estiver desabilitado
      setTimeout(() => {
        this.initWaveSurfer();
      }, 150);
    }
  }

  private setupIntersectionObserver(): void {
    if (this.destroyed) return;
    const container = document.querySelector(`#${this.idContainer}`);
    if (!container) {
      if (this.retryObserverCount++ >= 15) {
        console.warn(`WaveSurfer: container #${this.idContainer} não encontrado após 15 tentativas`);
        return;
      }
      setTimeout(() => this.setupIntersectionObserver(), 100);
      return;
    }

    // Configura observer para detectar quando elemento está visível
    const options = {
      root: null, // viewport
      rootMargin: '50px', // Carrega 50px antes de entrar no viewport
      threshold: 0.1 // 10% do elemento visível
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isInitialized) {
          this.isInitialized = true;
          this.initWaveSurfer();
          // Desconecta observer após inicialização
          if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
          }
        }
      });
    }, options);

    this.intersectionObserver.observe(container);
  }

  private initWaveSurfer() {
    if (this.destroyed) return;
    const container = document.querySelector(`#${this.idContainer}`);
    if (!container) {
      if (this.retryInitCount++ >= 15) {
        console.warn(`WaveSurfer: init container #${this.idContainer} não encontrado após 15 tentativas`);
        return;
      }
      setTimeout(() => this.initWaveSurfer(), 200);
      return;
    }

    // Se já existe um wavesurfer, destruir antes de criar novo
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
    }

    try {
      const minimap = Minimap.create({
        height: 40,
        waveColor: '#fff',
        progressColor: '#dcad54',
        dragToSeek: true,
      });

      this.wavesurfer = WaveSurfer.create({
        container: `#${this.idContainer}`,
        waveColor: '#fff',
        progressColor: '#dcad54',
        minPxPerSec: 100,
        hideScrollbar: true,
        fillParent: true,
        height: 0,
        backend: 'MediaElement',
        plugins: [minimap],
      });

      // O Minimap é a waveform visível; seu clique fornece posição relativa (0 a 1).
      minimap.on('click', (relativeX: number) => {
        this.requestSeekFromMinimap(relativeX);
      });

      // Aguardar a criação antes de carregar
      setTimeout(() => {
        if (this.destroyed) return;
        if (this.wavesurfer) {
          // Verifica se áudio está em cache primeiro
          const cachedBlobUrl = this.audioPreloader.getCachedBlobUrl(this.music.url);

          // Prioriza peaks pré-gerados para carregamento instantâneo
          if (this.music.peaks && Array.isArray(this.music.peaks)) {
            console.log(`⚡ Carregando waveform com peaks pré-gerados para ${this.music.nome_musica}`);

            const audioUrl = cachedBlobUrl || this.music.url;
            if (!audioUrl) {
              console.warn(`WaveSurfer: URL de áudio ausente para ${this.music.nome_musica}`);
              return;
            }

            if (cachedBlobUrl) {
              console.log(`💾 Usando áudio do cache para ${this.music.nome_musica}`);
            }

            this.wavesurfer.load(audioUrl, this.music.peaks);
          } else if (this.music.url) {
            console.log(`🎵 Carregando waveform processando áudio para ${this.music.nome_musica}`);

            const audioUrl = cachedBlobUrl || this.music.url;
            if (!audioUrl) {
              console.warn(`WaveSurfer: URL de áudio ausente para ${this.music.nome_musica}`);
              return;
            }
            this.wavesurfer.load(audioUrl);
          }

          this.wavesurfer.setMuted(true);

          this.wavesurfer.on('finish', () => {
            this.songFinished.emit();
          });

          this.wavesurfer.on('error', (error) => {
            if (error.name !== 'AbortError') {
              console.error('WaveSurfer error:', error);
            }
          });

          this.wavesurfer.on('ready', () => {
            console.log(`✅ WaveSurfer ready for ${this.music.nome_musica}`);
          });

          this.wavesurfer.on('loading', (progress) => {
            if (progress === 100) {
              console.log(`📊 WaveSurfer loaded for ${this.music.nome_musica}`);
            }
          });

        }
      }, 50);
    } catch (error) {
      console.error('Error creating WaveSurfer:', error);
    }
  }

  private requestSeekFromMinimap(relativeX: number): void {
    if (this.destroyed || !this.isCurrent || !this.wavesurfer) return;

    const duration = this.wavesurfer.getDuration();
    if (
      !Number.isFinite(relativeX) ||
      !Number.isFinite(duration) ||
      duration <= 0
    ) {
      return;
    }

    const progress = Math.min(1, Math.max(0, relativeX));
    this.musicPlayerService.requestSeek(this.music.id, progress * duration);
  }

  ngOnDestroy() {
    this.destroyed = true;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.idSub) {
      this.idSub.unsubscribe();
    }
    if (this.timeSub) {
      this.timeSub.unsubscribe();
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
    }
  }

  playWave() {
    // Mantido para compatibilidade, mas não reproduz aqui (só visual)
  }

  pauseWave() {
    // Mantido para compatibilidade, mas controle é centralizado no player
  }
}
