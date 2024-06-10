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
  volumeInitial: any;
  
  constructor(
    private musicService: MusicasService,
  ) {}
  
  ngOnInit(): void {
    this.musicService.listMusic().subscribe((data: any): void => {
      console.log(data);
      // puxar musicas pra essa pagina porem é preciso verificar onde o usuario esta e qual lista de reproduçao ele esta usando para entao reproduzir uma apos a outra, pois aqui todas as musicas sao puxadas.
    });
  }
  
  ngAfterContentInit(): void {
    const ws: any = WaveSurfer.create({
      container: "#waveform",
      waveColor: '#2f1ef1',
      progressColor: '#007BFF',
      // url: '../../assets/videos/Tipo_Minato.mp3',
      minPxPerSec: 10,
      hideScrollbar: true,
      fillParent: true,
      height: 100,
      dragToSeek: true,
      backend: 'MediaElement',
    });
    ws.load('../../assets/videos/Tipo_Minato.mp3');
    
    const formatTime = (seconds: any) => {
      const minutes = Math.floor(seconds / 60)
      const secondsRemainder = Math.round(seconds) % 60
      const paddedSeconds = `0${secondsRemainder}`.slice(-2)
      return `${minutes}:${paddedSeconds}`
    }
    
    const playButton: any = document.querySelector('#playPause');
    const backButton: any = document.querySelector('#backward');
    const forwardButton: any = document.querySelector('#forward');
    const timeEl: any = document.querySelector('#time');
    const durationEl: any = document.querySelector('#duration');
    const volumeSlider: any = document.querySelector("#volumeSlider");
    const volumeOn: any = document.querySelector("#volumeOn");
    const muteOn: any = document.querySelector(".muteOn");
    const muteOff: any = document.querySelector(".muteOff");
    this.volumeInitial = document.querySelector('#volumeSlider')!.getAttribute('value');
    
    ws.on('decode', (duration: any) => (durationEl.textContent = formatTime(duration)));
    ws.on('timeupdate', (currentTime: any) => (timeEl.textContent = formatTime(currentTime)));
    ws.on('ready', () => {
      if(volumeSlider) {
        volumeSlider.addEventListener('input', (e: any) => {
          let vol: any = e.target.value;
          ws.setVolume(vol / 100);
          if(vol == '0') {
            muteOff.classList.add('d-flex');
            muteOff.classList.remove('d-none');
            muteOn.classList.remove('d-flex');
            muteOn.classList.add('d-none');
          } else {
            muteOn.classList.add('d-flex');
            muteOn.classList.remove('d-none');
            muteOff.classList.remove('d-flex');
            muteOff.classList.add('d-none');
          }
        });
        
        volumeOn.addEventListener('click', (e: any) => {
          console.log(e);
          if(muteOn.classList.contains('d-flex')) {
            ws.setMuted(true);
            muteOn.classList.remove('d-flex');
            muteOn.classList.add('d-none');
            muteOff.classList.add('d-flex');
            muteOff.classList.remove('d-none');
            volumeSlider.value = '0';
          } else if (muteOff.classList.contains('d-flex')) {
            ws.setMuted(false);
            muteOff.classList.remove('d-flex');
            muteOff.classList.add('d-none');
            muteOn.classList.add('d-flex');
            muteOn.classList.remove('d-none');
            volumeSlider.value = this.volumeInitial;
          }
        });
      }
      
      let volbox: any = document.querySelector('.volbox');
      let volboxAdd = () => {
        volbox.classList.add('d-flex');
        volumeSlider.classList.add('d-flex');
      }
      let volboxRemove = () => {
        volbox.classList.remove('d-flex');
        volumeSlider.classList.remove('d-flex');
      }
      volumeOn.addEventListener('mouseover', () => {
        volboxAdd();
        volbox.addEventListener('mouseover', () => {
          volboxAdd();
        })
        volumeSlider.addEventListener('mouseover', () => {
          volboxAdd();
        })
      })
      volumeOn.addEventListener('mouseout', () => {
        volboxRemove();
        volbox.addEventListener('mouseout', () => {
          volboxRemove();
        })
        volumeSlider.addEventListener('mouseout', () => {
          volboxRemove();
        })
      })
    });
    
    
    playButton.addEventListener('click', (): void => {
      ws.playPause();
      
      let play: any = document.querySelector('#play');
      let pause: any = document.querySelector('#pause');
      if(play.classList.contains('d-flex')) {
        console.log('pause icon d-flex');
        play.classList.remove('d-flex');
        play.classList.add('d-none');
        pause.classList.add('d-flex');
        pause.classList.remove('d-none');
      } else if (pause.classList.contains('d-flex')) {
        console.log('play icon d-flex');
        play.classList.remove('d-none');
        play.classList.add('d-flex');
        pause.classList.remove('d-flex');
        pause.classList.add('d-none');
      }
    });
    
    forwardButton.onclick = (): void => {
      ws.skip(5);
    }
    
    backButton.onclick = (): void => {
      ws.skip(-5);
    }
    
  }
  
  valueInitial(event: any) {
    this.volumeInitial = event.target.value;
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
