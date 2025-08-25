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
  wavesurfer!: WaveSurfer;

  constructor(private musicPlayerService: MusicPlayerService) {}

  ngOnInit() {
    this.subscription = this.musicPlayerService.playPauseAction$.subscribe(({ action, musicId }) => {
      if (this.music.id === musicId) {
        if (action === 'play') {
          this.playWave();
        } else if (action === 'pause') {
          this.pauseWave();
        }
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
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
    }
  }

  playWave() {
    console.log('play', 'this.playWave')
    if (this.wavesurfer) {
      this.wavesurfer.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }

  pauseWave() {
    if (this.wavesurfer) {
      this.wavesurfer.pause();
    }
  }

}
