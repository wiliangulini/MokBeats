import {Component, Input, OnInit, OnDestroy, Output, EventEmitter, AfterViewInit} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import Minimap from "wavesurfer.js/dist/plugins/minimap";

@Component({
  selector: 'app-wavesurfer',
  templateUrl: './wavesurfer.component.html',
  styleUrls: ['./wavesurfer.component.scss']
})
export class WavesurferComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() audioUrl!: string;
  @Input() containerId!: string;
  @Output() songFinished = new EventEmitter<void>();

  private wavesurfer!: WaveSurfer;

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.wavesurfer = WaveSurfer.create({
      container: `#${this.containerId}`,
      waveColor: 'violet',
      progressColor: 'purple',
      minPxPerSec: 100,
      hideScrollbar: true,
      fillParent: true,
      height: 0,
      backend: 'MediaElement',
      plugins: [
        Minimap.create({
          height: 50,
          waveColor: 'violet',
          progressColor: 'purple',
          dragToSeek: true,
        })
      ]
    });

    this.wavesurfer.load(this.audioUrl);

    this.wavesurfer.on('finish', () => {
      this.songFinished.emit();
    });
  }

  ngOnDestroy() {
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
    }
  }

  playPause() {
    this.wavesurfer.playPause();
  }

  play() {
    this.wavesurfer.play();
  }

  pause() {
    this.wavesurfer.pause();
  }

}
