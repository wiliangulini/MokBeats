import {AfterContentInit, AfterViewInit, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Musica, MusicasService} from '../musicas/musicas.service';
import WaveSurfer from 'wavesurfer.js';
import Minimap from 'wavesurfer.js/dist/plugins/minimap';
import {WavesurferComponent} from "../wavesurfer/wavesurfer.component";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterContentInit {

  // @ViewChildren(WavesurferComponent) waveSurfers!: QueryList<WavesurferComponent>;
  // currentTrackIndex = 0;
  // isPlaying = false;

  arrMusica: Musica[] = [];
  volumeInitial: any;
  timeSkip: any;
  track: any;

  constructor(
    private musicService: MusicasService,
  ) {}

  ngOnInit(): void {
    // this.musicService.listMusic().subscribe((data: any): void => {
    //   console.log(data);
    //   this.track = data[1].url;
    //   console.log(this.track);
    // });
    // puxar musicas pra essa pagina porem é preciso verificar onde o usuario esta e em qual lista de reproduçao ele esta usando para entao reproduzir uma apos a outra, pois aqui todas as musicas sao puxadas.
  }

  ngAfterContentInit(): void {
    // setTimeout(() => {
    //   let span: any = document.querySelector('span.svg');
    //   console.log(span);
    //   span?.addEventListener('click', () => {
    //     // let url: any;
    //     // let i: any;
    //     // console.log();
    //     console.log(localStorage.getItem('number'));
    //   })
    // }, 1000);

    this.musicService.listMusic().subscribe((data: any): void => {
      console.log(data);
      // se eu pegar via localsotorage a url e a posicao do array posso fazer uma confirmação ou verificaçao aki pra que as waves se iniciem juntas

      const ws: any = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#fff',
        progressColor: '#dcad54',
        minPxPerSec: 100,
        hideScrollbar: true,
        fillParent: true,
        height: 0,
        backend: 'MediaElement',
        plugins: [
          Minimap.create({
            height: 50,
            waveColor: '#fff',
            progressColor: '#dcad54',
            dragToSeek: true,
          })
        ]
      });

      setTimeout(() => {
        ws.load(localStorage.getItem('audioUrl'));
      }, 500);

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

      const formatTime = (seconds: any) => {
        const minutes = Math.floor(seconds / 60);
        const secondsRemainder = Math.round(seconds) % 60;
        const paddedSeconds = `0${secondsRemainder}`.slice(-2);
        return `${minutes}:${paddedSeconds}`
      }

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
              this.muteOffAdd(muteOn, muteOff);
            } else {
              this.muteOnAdd(muteOn, muteOff);
            }
          });

          volumeOn.addEventListener('click', (e: any) => {
            if(muteOn.classList.contains('d-flex')) {
              ws.setMuted(true);
              this.muteOffAdd(muteOn, muteOff);
              volumeSlider.value = '0';
            } else if (muteOff.classList.contains('d-flex')) {
              ws.setMuted(false);
              this.muteOnAdd(muteOn, muteOff);
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
    });
  }

  //
  // playNextTrack() {
  //   const currentWaveSurfer = this.waveSurfers.toArray()[this.currentTrackIndex];
  //   console.log(currentWaveSurfer);
  //   if (currentWaveSurfer) {
  //     currentWaveSurfer.play();
  //     this.isPlaying = true;
  //     // console.log(this.isPlaying)
  //   }
  // }
  //
  // onSongFinished(index: number) {
  //   console.log(this.currentTrackIndex)
  //   console.log(index);
  //   if (index === this.currentTrackIndex) {
  //     this.currentTrackIndex++;
  //     console.log(this.currentTrackIndex)
  //     if (this.currentTrackIndex < 24) {
  //       this.playNextTrack();
  //       console.log('proxima musica');
  //     } else {
  //       this.isPlaying = false;
  //       console.log(this.isPlaying)
  //     }
  //   }
  // }

  // service player ?
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
  // service player ?
  hidePlayer() {
    document.getElementById('controlPlayer')!.classList.remove('showPlayer');
    document.getElementById('controlPlayer')!.classList.add('hidePlayer');
  }

  muteOnAdd(elm: any, elm2: any): void {
    let muteOn: any = elm;
    let muteOff: any = elm2;
    muteOn.classList.add('d-flex');
    muteOn.classList.remove('d-none');
    muteOff.classList.remove('d-flex');
    muteOff.classList.add('d-none');
  }
  muteOffAdd(elm: any, elm2: any): void {
    let muteOn: any = elm;
    let muteOff: any = elm2;
    muteOff.classList.add('d-flex');
    muteOff.classList.remove('d-none');
    muteOn.classList.remove('d-flex');
    muteOn.classList.add('d-none');
  }
  valueInitial(event: any) {
    this.volumeInitial = event.target.value;
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
