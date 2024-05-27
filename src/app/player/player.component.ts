import { Component, OnInit } from '@angular/core';
import { Musica, MusicasService } from '../musicas/musicas.service';
import WaveSurfer from 'wavesurfer.js';
import Minimap from 'wavesurfer.js/dist/plugins/minimap';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  ws!: WaveSurfer;

  arrMusica: Musica[] = [];

  constructor(
    private musicService: MusicasService,
  ) {

  }

  ngOnInit(): void {
    this.musicService.listMusic().subscribe((data: any) => {
      console.log(data);
    })

    this.ws = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'rgb(200, 0, 200)',
      progressColor: 'rgb(100, 0, 100)',
      url: '../../assets/videos/Vibe_Shisui.mp3',
      minPxPerSec: 100,
      hideScrollbar: true,
      autoCenter: false,
      mediaControls: true,
      plugins: [
        // Register the plugin
        Minimap.create({
          height: 20,
          waveColor: '#ddd',
          progressColor: '#fff',
          // the Minimap takes all the same options as the WaveSurfer itself
        }),
      ],
    })

    this.playAudio();
  }

  playAudio() {

    this.ws.on('interaction', () => {
      this.ws.play();
    })
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

}
