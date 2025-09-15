import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {MusicPlayerService} from "../service/music-player.service";
import WaveSurfer from "wavesurfer.js";
import Minimap from "wavesurfer.js/dist/plugins/minimap";

@Component({
  selector: 'app-wave-surfer-test',
  templateUrl: './wave-surfer-test.component.html',
  styleUrls: ['./wave-surfer-test.component.scss']
})
export class WaveSurferTestComponent implements OnInit, AfterViewInit ,OnDestroy {
  @Input() music!: any;
  @Input() idContainer!: any;
  @Output() songFinished = new EventEmitter<void>();
  private subscription!: Subscription;
  private timeSub?: Subscription;
  private idSub?: Subscription;
  wavesurfer!: WaveSurfer;
  private isCurrent: boolean = false;

  constructor(private musicPlayerService: MusicPlayerService) {}

  ngOnInit() {
    // Controla play/pause por ação, mas sem reproduzir áudio neste componente
    this.subscription = this.musicPlayerService.playPauseAction$.subscribe(({ action, musicId }) => {
      this.isCurrent = (this.music.id === musicId);
      // Não chamamos play/pause do WaveSurfer local; a posição será movida pelo tempo global.
    });

    // Atualiza a flag de música atual
    this.idSub = this.musicPlayerService.currentMusicID$.subscribe((id) => {
      this.isCurrent = (id === this.music.id);
      if (!this.isCurrent && this.wavesurfer) {
        // Ao trocar de faixa, reseta visual desta waveform
        try { this.wavesurfer.setTime(0); } catch (e) {}
      }
    });

    // Sincroniza tempo com o player principal
    this.timeSub = this.musicPlayerService.currentTime$.subscribe((time) => {
      if (this.isCurrent && this.wavesurfer) {
        try { this.wavesurfer.setTime(time); } catch (e) {}
      }
    });
  }

  ngAfterViewInit() {
    // Delay para garantir que o container DOM esteja disponível
    setTimeout(() => {
      this.initWaveSurfer();
    }, 150);
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
          })
        ]
      });

      // Aguardar a criação antes de carregar
      setTimeout(() => {
        if (this.wavesurfer && this.music.url) {
          this.wavesurfer.load(this.music.url);
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
