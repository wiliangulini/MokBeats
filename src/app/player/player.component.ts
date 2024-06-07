import {AfterContentInit, Component, OnInit} from '@angular/core';
import {Musica, MusicasService} from '../musicas/musicas.service';
import WaveSurfer from 'wavesurfer.js';


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
    
    const ws = WaveSurfer.create({
      container: "#waveform",
      waveColor: '#2f1ef1',
      progressColor: '#007BFF',
      url: '../../assets/videos/Vibe_Shisui.mp3',
      minPxPerSec: 10.6,
      hideScrollbar: true,
      fillParent: true,
      height: 100,
      dragToSeek: true,
      // plugins: [
      //   // Registrar o plugin
      //   Minimap.create({
      //     height: 20,
      //     waveColor: '#ddd',
      //     progressColor: '#fff',
      //     // o Minimapa tem todas as mesmas opções do próprio WaveSurfer
      //   }),
      // ],
    });
    
    const formatTime = (seconds: any) => {
      const minutes = Math.floor(seconds / 60)
      const secondsRemainder = Math.round(seconds) % 60
      const paddedSeconds = `0${secondsRemainder}`.slice(-2)
      return `${minutes}:${paddedSeconds}`
    }
    
    const playButton: any = document.querySelector('#play');
    const backButton: any = document.querySelector('#backward');
    const forwardButton: any = document.querySelector('#forward');
    const timeEl: any = document.querySelector('#time');
    const durationEl: any = document.querySelector('#duration');
    
    ws.on('decode', (duration: any) => (durationEl.textContent = formatTime(duration)))
    ws.on('timeupdate', (currentTime: any) => (timeEl.textContent = formatTime(currentTime)))
    
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
  
  hidePlayer() {
    document.getElementById('controlPlayer')!.classList.remove('showPlayer');
    document.getElementById('controlPlayer')!.classList.add('hidePlayer');
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
