import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Musica, MusicasService} from '../musicas/musicas.service';
import WaveSurfer from 'wavesurfer.js';
import Minimap from 'wavesurfer.js/dist/plugins/minimap';
import {PlayerService} from "./player.service";
import {WavesurferComponent} from "../wavesurfer/wavesurfer.component";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit, AfterViewChecked {

  arrMusica: Musica[] = [];
  volumeInitial: any;
  timeSkip: any;
  track: any;
  audioUrl: any;

  ws!: WaveSurfer;

  constructor(
    private musicService: MusicasService,
    private playerService: PlayerService,
    private cdRef: ChangeDetectorRef,
  ) {
    // super();
  }

  ngOnInit(): void {
    // puxar musicas pra essa pagina porem é preciso verificar onde o usuario esta e em qual lista de reproduçao ele esta usando para entao reproduzir uma apos a outra, pois aqui todas as musicas sao puxadas.
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngAfterViewInit(): void {

    this.playerService.currentData.subscribe((dt: any) => {
      console.log(dt);
      this.audioUrl = dt;
      console.log(this.audioUrl);

      if(this.audioUrl !== 'audio') {

        this.ws = WaveSurfer.create({
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

        // console.log(this.waveID)
        // if(this.audioUrl == this.audioUrl && this.waveID !== 'waveId') {
        //
        //   console.log(this.waveID)
        // }
        console.log(this.audioUrl);
        this.ws.load(this.audioUrl);
        playButton.click();

        const formatTime = (seconds: any) => {
          const minutes = Math.floor(seconds / 60);
          const secondsRemainder = Math.round(seconds) % 60;
          const paddedSeconds = `0${secondsRemainder}`.slice(-2);
          return `${minutes}:${paddedSeconds}`
        }

        this.ws.on('decode', (duration: any) => {
          durationEl.textContent = formatTime(duration);
          this.timeSkip = duration;
        });
        this.ws.on('timeupdate', (currentTime: any) => (timeEl.textContent = formatTime(currentTime)));
        this.ws.on('ready', () => {
          if(volumeSlider) {
            volumeSlider.addEventListener('input', (e: any) => {
              let vol: any = e.target.value;
              this.ws.setVolume(vol / 100);
              if(vol == '0') {
                this.muteOffAdd(muteOn, muteOff);
              } else {
                this.muteOnAdd(muteOn, muteOff);
              }
            });

            volumeOn.addEventListener('click', (e: any) => {
              if(muteOn.classList.contains('d-flex')) {
                this.ws.setMuted(true);
                this.muteOffAdd(muteOn, muteOff);
                volumeSlider.value = '0';
              } else if (muteOff.classList.contains('d-flex')) {
                this.ws.setMuted(false);
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

        // playButton.addEventListener('click', (): void => {
        //   this.ws.playPause();
        //   this.playerService.tooglePlayPause();
        // });
        // todos segundos da track estao em timeskip, ao clicar vai direto pro final da musica ou inicio dependendo do botao clicado
        forwardButton.addEventListener('click', (): void => {
          this.ws.setTime(this.timeSkip);
          this.playerService.tooglePlayPause();
        });
        backButton.addEventListener('click', (): void => {
          this.ws.setTime(-this.timeSkip);
          this.playerService.tooglePlayPause();
        });
      }

    });
  }

  playPause(): void {
    this.ws.playPause();
    this.playerService.tooglePlayPause();
  }

  hidePlayer() {
    this.playerService.hidePlayer();
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
