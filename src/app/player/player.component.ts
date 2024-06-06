import {AfterContentInit, Component, OnInit} from '@angular/core';
import { Musica, MusicasService } from '../musicas/musicas.service';
import WaveSurfer from 'wavesurfer.js';
import Minimap from 'wavesurfer.js/dist/plugins/minimap';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterContentInit {
  
  arrMusica: Musica[] = [];
  
  constructor(
    private musicService: MusicasService,
  ) {
  
  }
  
  ngOnInit(): void {
    this.musicService.listMusic().subscribe((data: any): void => {
      console.log(data);
    });
  }
  
  ngAfterContentInit(): void {
    const audio = new Audio();
    audio.src = '../../assets/videos/Vibe_Shisui.mp3';
    
    const ws = WaveSurfer.create({
      container: "#waveform",
      waveColor: '#2f1ef1',
      progressColor: '#007BFF',
      media: audio,
      url: '../../assets/videos/Vibe_Shisui.mp3',
      minPxPerSec: 10.6,
      hideScrollbar: true,
      fillParent: true,
      height: 100,
      dragToSeek: true,
      // plugins: [
      //   // Register the plugin
      //   Minimap.create({
      //     height: 20,
      //     waveColor: '#ddd',
      //     progressColor: '#fff',
      //     // the Minimap takes all the same options as the WaveSurfer itself
      //   }),
      // ],
    });
    
    document.body.appendChild(audio);
    
    const playButton: any = document.querySelector('#play');
    const backButton: any = document.querySelector('#backward');
    const forwardButton: any = document.querySelector('#forward');
    
    playButton.onclick = (): void => {
      ws.playPause();
    }
    
    forwardButton.onclick = (): void => {
      ws.skip(5);
    }
    
    backButton.onclick = (): void => {
      ws.skip(-5);
    }
    
    
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
