import { Injectable } from '@angular/core';
import WaveSurfer from "wavesurfer.js";

@Injectable({
  providedIn: 'root'
})
export class WaveSurferService {
  private wavesurfer: WaveSurfer | null = null;
  private isPlaying: boolean = false;
  private audioUrl: string | null = null;

  create(container: string | HTMLElement): void {
    if (!this.wavesurfer) {
      this.wavesurfer = WaveSurfer.create({
        container: container,
        waveColor: 'violet',
        progressColor: 'purple'
      });

      this.wavesurfer.on('play', () => this.isPlaying = true);
      this.wavesurfer.on('pause', () => this.isPlaying = false);
    }

    if (this.audioUrl) {
      this.wavesurfer.load(this.audioUrl);
    }
  }

  setUrl(url: string): void {
    this.audioUrl = url;
    if (this.wavesurfer) {
      this.wavesurfer.load(url);
    }
  }

  async playPause(): Promise<void> {
    if (this.wavesurfer) {
      if (this.isPlaying) {
        this.wavesurfer.pause();
      } else {
        try {
          await this.wavesurfer.play();
        } catch (error) {
          console.error('Play request was interrupted:', error);
        }
      }
    }
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }
}
