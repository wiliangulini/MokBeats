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
    const ws: WaveSurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'rgb(200, 0, 200)',
      progressColor: 'rgb(100, 0, 100)',
      url: '../../assets/videos/Vibe_Shisui.mp3',
      minPxPerSec: 100,
      dragToSeek: true,
    })
    
    // const ws = WaveSurfer.create({
    //   container: document.body,
    //   waveColor: 'rgb(200, 0, 200)',
    //   progressColor: 'rgb(100, 0, 100)',
    //   url: '../../assets/videos/Vibe_Shisui.mp3',
    //   minPxPerSec: 100,
    //   hideScrollbar: true,
    //   autoCenter: false,
    //   mediaControls: true,
    //   barWidth: 1,
    //   barGap: 1,
    //   barRadius: 1,
    //   dragToSeek: true,
    //   fillParent: true,
    //   plugins: [
    //     // Register the plugin
    //     Minimap.create({
    //       height: 20,
    //       waveColor: '#ddd',
    //       progressColor: '#fff',
    //       // the Minimap takes all the same options as the WaveSurfer itself
    //     }),
    //   ],
    // });
    
    // ws.on('interaction', () => {
    //   ws.play();
    // });
    
    ws.once('decode', (): void => {
      const slider: any = document.querySelector('#zoom');
      console.log(slider);
      
      slider.addEventListener('input', (e: any): void => {
        console.log(e);
        const minPxPerSec = e.target.valueAsNumber
        ws.zoom(minPxPerSec)
      })
    })
    
    const playButton: any = document.querySelector('#play');
    const forwardButton: any = document.querySelector('#forward');
    const backButton: any = document.querySelector('#backward');
    
    ws.once('decode', (): void => {
      document.querySelectorAll('input[type="checkbox"]').forEach((input: any) => {
        input.onchange = (e: any): void => {
          ws.setOptions({
            [input.value]: e.target.checked,
          })
        }
      });
      
      playButton.onclick = (): void => {
        ws.playPause();
      }
      
      forwardButton.onclick = (): void => {
        ws.skip(5);
      }
      
      backButton.onclick = (): void => {
        ws.skip(-5);
      }
    });
    
    setTimeout(() => {
      const scroll: any = document.querySelector('.scroll');
      console.log(scroll);
    }, 500);
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
