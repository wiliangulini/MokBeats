import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Musica, MusicasService} from '../musicas/musicas.service';
import WaveSurfer from 'wavesurfer.js';
import Minimap from 'wavesurfer.js/dist/plugins/minimap';
import {PlayerService} from "./player.service";
import {MusicPlayerService} from "../service/music-player.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  arrMusica: Musica[] = [];
  volumeInitial: any;
  timeSkip: any;
  track: any;
  currentMusicUrl!: string;
  isPlaying: boolean = false;
  musicId: any;

  private subscription?: Subscription;
  ws!: WaveSurfer;

  constructor(
    private musicService: MusicasService,
    private playerService: PlayerService,
    private cdRef: ChangeDetectorRef,
    private musicPlayerService: MusicPlayerService
  ) {}

  ngOnInit(): void {
    this.musicPlayerService.currentMusicUrl$.subscribe((url) => {
      this.currentMusicUrl = url;
      console.log(this.currentMusicUrl);
      this.playMusicUrl(url)
    })
    this.subscription = this.musicPlayerService.playPauseAction$.subscribe(({ action, musicId }) => {
      if (action === 'play') {
        this.playMusic(musicId);
      } else if (action === 'pause') {
        this.pauseMusic(musicId);
      }
    });
  }

  ngAfterViewChecked() {
    if(!this.isPlaying) {
      if(this.arrMusica.length === 0) {
        this.arrMusica = JSON.parse(String(localStorage.getItem('arrMusica')));
        console.log(this.arrMusica);
        this.isPlaying = true;
      }
    }
    this.cdRef.detectChanges();
  }

  ngAfterViewInit(): void {
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

    // setTimeout(() => {
    //   console.log(this.arrMusica)
    //
    //   this.ws.load("../../assets/audios/Tipo_Minato.mp3");
    // }, 300);
    this.ws.load("../../assets/audios/Tipo_Minato.mp3");
    // playButton.click();

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

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.ws) {
      this.ws.destroy();
    }
  }
  playMusicUrl(url: string): void {
    console.log(url.length);
    // this.ws.load(url);
  }

  playMusic(musicId: any) {
    this.musicId = musicId;
    this.ws.play();
  }

  pauseMusic(musicId: any) {
    this.musicId = musicId;
    this.ws.pause();
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
