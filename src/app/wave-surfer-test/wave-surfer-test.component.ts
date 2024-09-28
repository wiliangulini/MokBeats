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

    this.wavesurfer.load(this.music.url);

    this.wavesurfer.setMuted(true);

    this.wavesurfer.on('finish', () => {
      this.songFinished.emit();
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

  playWave() {
    console.log('play', 'this.playWave')
    this.wavesurfer.play().then();
  }

  pauseWave() {
    this.wavesurfer.pause();
  }

}
