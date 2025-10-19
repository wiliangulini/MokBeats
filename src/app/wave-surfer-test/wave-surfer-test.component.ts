import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import WaveSurfer from 'wavesurfer.js';
import Minimap from 'wavesurfer.js/dist/plugins/minimap';
import { MusicPlayerService } from '../service/music-player.service';

@Component({
  selector: 'app-wave-surfer-test',
  templateUrl: './wave-surfer-test.component.html',
  styleUrls: ['./wave-surfer-test.component.scss'],
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

  constructor(private musicPlayerService: MusicPlayerService) {}

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
    const container = document.querySelector(`#${this.idContainer}`);
    if (!container) {
      // Se container não existe ainda, tenta novamente
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
    const container = document.querySelector(`#${this.idContainer}`);
    if (!container) {
      console.error(`Container ${this.idContainer} not found`);
      // Tentar novamente após mais tempo
      setTimeout(() => this.initWaveSurfer(), 200);
      return;
    }

    // Se já existe um wavesurfer, destruir antes de criar novo
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
    }

    try {
      this.wavesurfer = WaveSurfer.create({
        container: `#${this.idContainer}`,
        waveColor: '#fff',
        progressColor: '#dcad54',
        minPxPerSec: 100,
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

      // Aguardar a criação antes de carregar
      setTimeout(() => {
        if (this.wavesurfer) {
          // Prioriza peaks pré-gerados para carregamento instantâneo
          if (this.music.peaks && Array.isArray(this.music.peaks)) {
            console.log(`⚡ Carregando waveform com peaks pré-gerados para ${this.music.nome_musica}`);
            // Carrega apenas os peaks (sem download de áudio)
            this.wavesurfer.load(this.music.url, this.music.peaks);
          } else if (this.music.url) {
            // Fallback: carrega e processa o áudio completo (método antigo)
            console.log(`🎵 Carregando waveform processando áudio para ${this.music.nome_musica}`);
            this.wavesurfer.load(this.music.url);
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

          // Propaga seek quando usuário interagir na lista (somente se for a faixa atual)
          (this.wavesurfer as any).on('seek', (progress: number) => {
            try {
              const duration = this.wavesurfer.getDuration() || 0;
              const time = progress * duration;
              if (this.isCurrent) {
                this.musicPlayerService.requestSeek(this.music.id, time);
              }
            } catch (e) {}
          });
        }
      }, 50);
    } catch (error) {
      console.error('Error creating WaveSurfer:', error);
    }
  }

  ngOnDestroy() {
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
