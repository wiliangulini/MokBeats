import {AfterContentInit, AfterViewInit, Component, OnInit} from '@angular/core';
import {Musica, MusicasService} from '../musicas/musicas.service';
import WaveSurfer from 'wavesurfer.js';
import Minimap from 'wavesurfer.js/dist/plugins/minimap';
import EnvelopePlugin from 'wavesurfer.js/dist/plugins/envelope';

@Component({
  selector: 'app-player-save',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerSaveComponent implements OnInit, AfterContentInit {

  arrMusica: Musica[] = [];
  volumeInitial: any;
  timeSkip: any;
  track: string = '../../assets/audios/Tipo_Minato.mp3';

  constructor(
    private musicService: MusicasService,
  ) {}

  ngOnInit(): void {
    // this.musicService.list().subscribe((data: any): void => {

    // puxar musicas pra essa pagina porem é preciso verificar onde o usuario esta e em qual lista de reproduçao ele esta usando para entao reproduzir uma apos a outra, pois aqui todas as musicas sao puxadas.
    // });
  }

  ngAfterContentInit(): void {
    console.log(document.querySelector('.scroll.noScrollbar'))
    const ws: any = WaveSurfer.create({
      container: '#waveform',
      waveColor: '#fff',
      progressColor: '#dcad54',
      // url: '../../assets/audios/Tipo_Minato.mp3',
      minPxPerSec: 100,
      hideScrollbar: true,
      fillParent: true,
      height: 0,
      backend: 'MediaElement',
      plugins: [
        Minimap.create({
          height: 100,
          waveColor: '#fff',
          progressColor: '#dcad54',
          dragToSeek: true,
        })
      ]
    });
    ws.load(this.track);

    // TEMOS APENAS UMA TRACK, TBM NAO TEMOS TRACK CUSTOM FAZER URGENTE

    const formatTime = (seconds: any) => {
      const minutes = Math.floor(seconds / 60);
      const secondsRemainder = Math.round(seconds) % 60;
      const paddedSeconds = `0${secondsRemainder}`.slice(-2);
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

    ws.on('decode', (duration: any) => {
      durationEl.textContent = formatTime(duration);
      this.timeSkip = duration;
    });
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
      this.tooglePlayPause();
    });
    // todos segundos da track estao em timeskip, ao clicar vai direto pro final da musica ou inicio dependendo do botao clicado
    forwardButton.addEventListener('click', (): void => {
      ws.setTime(this.timeSkip);
      this.tooglePlayPause();
    });

    backButton.addEventListener('click', (): void => {
      ws.setTime(-this.timeSkip);
      this.tooglePlayPause();
    });

  }

  tooglePlayPause() {
    let play: any = document.querySelector('#play');
    let pause: any = document.querySelector('#pause');
    if(play.classList.contains('d-flex')) {
      play.classList.remove('d-flex');
      play.classList.add('d-none');
      pause.classList.add('d-flex');
      pause.classList.remove('d-none');
    } else if (pause.classList.contains('d-flex')) {
      play.classList.remove('d-none');
      play.classList.add('d-flex');
      pause.classList.remove('d-flex');
      pause.classList.add('d-none');
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
