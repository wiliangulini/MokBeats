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
  volumeInitial1: any;
  volumeInitial2: any;
  volumeInitial3: any;
  volumeInitial4: any;
  timeSkip: any;
  track: any;
  currentMusicUrl: string = '';
  isPlaying: boolean = false;
  isPlaying2: boolean = false;
  musicId: any;
  idMusicCurrent!: number;
  arrayControl: any[] = [];
  private subscription?: Subscription;
  wavesurfer!: WaveSurfer;
  trackCustom!: WaveSurfer;

  constructor(
    private musicService: MusicasService,
    private playerService: PlayerService,
    private cdRef: ChangeDetectorRef,
    private musicPlayerService: MusicPlayerService
  ) {}

  ngOnInit(): void {
    this.subscription = this.musicPlayerService.playPauseAction$.subscribe(({ action, musicId }) => {
      console.log(action, musicId);
      this.musicId = musicId;
      if(this.currentMusicUrl.length > 0) {
        if (action === 'play') {
          this.playMusic(musicId);
        } else if (action === 'pause') {
          this.pauseMusic(musicId);
        }
      }
    });
    this.musicPlayerService.currentMusicUrl$.subscribe((url) => {
      console.log(url);
      this.currentMusicUrl = url;
      if(url.length > 0) {
        this.playMusicUrl(url);
      }
    });
    this.musicPlayerService.currentMusicID$.subscribe((id) => {
      console.log(id)
      if(id > -1) {
        this.idMusicPlay(id);
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
    this.wavesurfer = WaveSurfer.create({
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
        }),
      ],
    });

    const mutedTrack1: any = document.getElementById('mutedTrack1');
    const volumeOnTrackCustom1: any = document.getElementById('volumeOnTrackCustom1');
    const muteOn1: any = document.querySelector('.muteOn1');
    const muteOff1: any = document.querySelector('.muteOff1');
    this.volumeInitial1 = document.querySelector('#mutedTrack1')!.getAttribute('value');
    const mutedTrack2: any = document.getElementById('mutedTrack2');
    const volumeOnTrackCustom2: any = document.getElementById('volumeOnTrackCustom2');
    const muteOn2: any = document.querySelector('.muteOn2');
    const muteOff2: any = document.querySelector('.muteOff2');
    this.volumeInitial2 = document.querySelector('#mutedTrack2')!.getAttribute('value');
    const mutedTrack3: any = document.getElementById('mutedTrack3');
    const volumeOnTrackCustom3: any = document.getElementById('volumeOnTrackCustom3');
    const muteOn3: any = document.querySelector('.muteOn3');
    const muteOff3: any = document.querySelector('.muteOff3');
    this.volumeInitial3 = document.querySelector('#mutedTrack3')!.getAttribute('value');
    const mutedTrack4: any = document.getElementById('mutedTrack4');
    const volumeOnTrackCustom4: any = document.getElementById('volumeOnTrackCustom4');
    const muteOn4: any = document.querySelector('.muteOn4');
    const muteOff4: any = document.querySelector('.muteOff4');
    this.volumeInitial4 = document.querySelector('#mutedTrack4')!.getAttribute('value');

    this.trackCustom = WaveSurfer.create({
      container: '#trackCustom1',
      waveColor: '#fff',
      progressColor: '#dcad54',
      minPxPerSec: 100,
      url: '../../assets/audios/MokBeats_Future_Forest_(DRUMS).mp3',
      hideScrollbar: true,
      fillParent: true,
      height: 0,
      backend: 'MediaElement',
      plugins: [
        Minimap.create({
          height: 40,
          waveColor: '#fff',
          progressColor: '#dcad54',
          dragToSeek: true,
        }),
      ],
    });
    this.trackCustom = WaveSurfer.create({
      container: '#trackCustom2',
      waveColor: '#fff',
      progressColor: '#dcad54',
      minPxPerSec: 100,
      url: '../../assets/audios/MokBeats_Future_Forest_(EFEITOS).mp3',
      hideScrollbar: true,
      fillParent: true,
      height: 0,
      backend: 'MediaElement',
      plugins: [
        Minimap.create({
          height: 40,
          waveColor: '#fff',
          progressColor: '#dcad54',
          dragToSeek: true,
        }),
      ],
    });
    this.trackCustom = WaveSurfer.create({
      container: '#trackCustom3',
      waveColor: '#fff',
      progressColor: '#dcad54',
      minPxPerSec: 100,
      url: '../../assets/audios/MokBeats_Future_Forest_(HARMONIAS).mp3',
      hideScrollbar: true,
      fillParent: true,
      height: 0,
      backend: 'MediaElement',
      plugins: [
        Minimap.create({
          height: 40,
          waveColor: '#fff',
          progressColor: '#dcad54',
          dragToSeek: true,
        }),
      ],
    });
    this.trackCustom = WaveSurfer.create({
      container: '#trackCustom4',
      waveColor: '#fff',
      progressColor: '#dcad54',
      minPxPerSec: 100,
      url: '../../assets/audios/MokBeats_Future_Forest_(MELODIAS).mp3',
      hideScrollbar: true,
      fillParent: true,
      height: 0,
      backend: 'MediaElement',
      plugins: [
        Minimap.create({
          height: 40,
          waveColor: '#fff',
          progressColor: '#dcad54',
          dragToSeek: true,
        }),
      ],
    });

    this.trackCustom.on('ready', () => {
      if(mutedTrack1) {
        mutedTrack1.addEventListener('input', (e: any) => {
          let vol: any = e.target.value;
          this.trackCustom.setVolume(vol / 100);
          if(vol == '0') {
            this.muteOffAdd(muteOn1, muteOff1);
          } else {
            this.muteOnAdd(muteOn1, muteOff1);
          }
        });
        volumeOnTrackCustom1.addEventListener('click', (e: any) => {
          if(muteOn1.classList.contains('d-flex')) {
            this.trackCustom.setMuted(true);
            this.muteOffAdd(muteOn1, muteOff1);
            mutedTrack1.value = '0';
          } else if (muteOff1.classList.contains('d-flex')) {
            this.trackCustom.setMuted(false);
            this.muteOnAdd(muteOn1, muteOff1);
            mutedTrack1.value = this.volumeInitial;
          }
        });
      }
      let volbox1: any = document.querySelector('.volbox1');
      let volboxAdd1 = () => {
        volbox1.classList.add('d-flex');
        mutedTrack1.classList.add('d-flex');
      }
      let volboxRemove1 = () => {
        volbox1.classList.remove('d-flex');
        mutedTrack1.classList.remove('d-flex');
      }
      volumeOnTrackCustom1.addEventListener('mouseover', () => {
        volboxAdd1();
        volbox1.addEventListener('mouseover', () => {
          volboxAdd1();
        })
        mutedTrack1.addEventListener('mouseover', () => {
          volboxAdd1();
        })
      })
      volumeOnTrackCustom1.addEventListener('mouseout', () => {
        volboxRemove1();
        volbox1.addEventListener('mouseout', () => {
          volboxRemove1();
        })
        mutedTrack1.addEventListener('mouseout', () => {
          volboxRemove1();
        })
      })

      if(mutedTrack2) {
        mutedTrack2.addEventListener('input', (e: any) => {
          let vol: any = e.target.value;
          this.trackCustom.setVolume(vol / 100);
          if(vol == '0') {
            this.muteOffAdd(muteOn2, muteOff2);
          } else {
            this.muteOnAdd(muteOn2, muteOff2);
          }
        });
        volumeOnTrackCustom2.addEventListener('click', (e: any) => {
          if(muteOn2.classList.contains('d-flex')) {
            this.trackCustom.setMuted(true);
            this.muteOffAdd(muteOn2, muteOff2);
            mutedTrack2.value = '0';
          } else if (muteOff2.classList.contains('d-flex')) {
            this.trackCustom.setMuted(false);
            this.muteOnAdd(muteOn2, muteOff2);
            mutedTrack2.value = this.volumeInitial;
          }
        });
      }
      let volbox2: any = document.querySelector('.volbox2');
      let volboxAdd2 = () => {
        volbox2.classList.add('d-flex');
        mutedTrack2.classList.add('d-flex');
      }
      let volboxRemove2 = () => {
        volbox2.classList.remove('d-flex');
        mutedTrack2.classList.remove('d-flex');
      }
      volumeOnTrackCustom2.addEventListener('mouseover', () => {
        volboxAdd2();
        volbox2.addEventListener('mouseover', () => {
          volboxAdd2();
        })
        mutedTrack2.addEventListener('mouseover', () => {
          volboxAdd2();
        })
      })
      volumeOnTrackCustom2.addEventListener('mouseout', () => {
        volboxRemove2();
        volbox2.addEventListener('mouseout', () => {
          volboxRemove2();
        })
        mutedTrack2.addEventListener('mouseout', () => {
          volboxRemove2();
        })
      })

      if(mutedTrack3) {
        mutedTrack3.addEventListener('input', (e: any) => {
          let vol: any = e.target.value;
          this.trackCustom.setVolume(vol / 100);
          if(vol == '0') {
            this.muteOffAdd(muteOn3, muteOff3);
          } else {
            this.muteOnAdd(muteOn3, muteOff3);
          }
        });
        volumeOnTrackCustom3.addEventListener('click', (e: any) => {
          if(muteOn3.classList.contains('d-flex')) {
            this.trackCustom.setMuted(true);
            this.muteOffAdd(muteOn3, muteOff3);
            mutedTrack3.value = '0';
          } else if (muteOff3.classList.contains('d-flex')) {
            this.trackCustom.setMuted(false);
            this.muteOnAdd(muteOn3, muteOff3);
            mutedTrack3.value = this.volumeInitial;
          }
        });
      }
      let volbox3: any = document.querySelector('.volbox3');
      let volboxAdd3 = () => {
        volbox3.classList.add('d-flex');
        mutedTrack3.classList.add('d-flex');
      }
      let volboxRemove3 = () => {
        volbox3.classList.remove('d-flex');
        mutedTrack3.classList.remove('d-flex');
      }
      volumeOnTrackCustom3.addEventListener('mouseover', () => {
        volboxAdd3();
        volbox3.addEventListener('mouseover', () => {
          volboxAdd3();
        })
        mutedTrack3.addEventListener('mouseover', () => {
          volboxAdd3();
        })
      })
      volumeOnTrackCustom3.addEventListener('mouseout', () => {
        volboxRemove3();
        volbox3.addEventListener('mouseout', () => {
          volboxRemove3();
        })
        mutedTrack3.addEventListener('mouseout', () => {
          volboxRemove3();
        })
      })

      if(mutedTrack4) {
        mutedTrack4.addEventListener('input', (e: any) => {
          let vol: any = e.target.value;
          this.trackCustom.setVolume(vol / 100);
          if(vol == '0') {
            this.muteOffAdd(muteOn4, muteOff4);
          } else {
            this.muteOnAdd(muteOn4, muteOff4);
          }
        });
        volumeOnTrackCustom3.addEventListener('click', (e: any) => {
          if(muteOn4.classList.contains('d-flex')) {
            this.trackCustom.setMuted(true);
            this.muteOffAdd(muteOn4, muteOff4);
            mutedTrack4.value = '0';
          } else if (muteOff4.classList.contains('d-flex')) {
            this.trackCustom.setMuted(false);
            this.muteOnAdd(muteOn4, muteOff4);
            mutedTrack4.value = this.volumeInitial;
          }
        });
      }
      let volbox4: any = document.querySelector('.volbox4');
      let volboxAdd4 = () => {
        volbox4.classList.add('d-flex');
        mutedTrack4.classList.add('d-flex');
      }
      let volboxRemove4 = () => {
        volbox4.classList.remove('d-flex');
        mutedTrack4.classList.remove('d-flex');
      }
      volumeOnTrackCustom4.addEventListener('mouseover', () => {
        volboxAdd4();
        volbox4.addEventListener('mouseover', () => {
          volboxAdd4();
        })
        mutedTrack4.addEventListener('mouseover', () => {
          volboxAdd4();
        })
      })
      volumeOnTrackCustom4.addEventListener('mouseout', () => {
        volboxRemove4();
        volbox4.addEventListener('mouseout', () => {
          volboxRemove4();
        })
        mutedTrack4.addEventListener('mouseout', () => {
          volboxRemove4();
        })
      })
    });

    const prev10: any = document.querySelector('.prev10sec');
    const next10: any = document.querySelector('.next10sec');
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

    this.wavesurfer.on('decode', (duration: any) => {
      durationEl.textContent = formatTime(duration);
      this.timeSkip = duration;
    });
    this.wavesurfer.on('timeupdate', (currentTime: any) => {
      timeEl.textContent = formatTime(currentTime);
    });
    this.wavesurfer.on('ready', () => {
      if(volumeSlider) {
        volumeSlider.addEventListener('input', (e: any) => {
          let vol: any = e.target.value;
          this.wavesurfer.setVolume(vol / 100);
          if(vol == '0') {
            this.muteOffAdd(muteOn, muteOff);
          } else {
            this.muteOnAdd(muteOn, muteOff);
          }
        });

        volumeOn.addEventListener('click', (e: any) => {
          if(muteOn.classList.contains('d-flex')) {
            this.wavesurfer.setMuted(true);
            this.muteOffAdd(muteOn, muteOff);
            volumeSlider.value = '0';
          } else if (muteOff.classList.contains('d-flex')) {
            this.wavesurfer.setMuted(false);
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

    // todos segundos da track estao em timeskip, ao clicar vai direto pro final da musica ou inicio dependendo do botao clicado. API Wavesurfer Pre-decode = setTime(0) dentro de on('finish') faz a track ao terminar voltar ao inicio;
    forwardButton.addEventListener('click', (): void => {
      this.wavesurfer.setTime(this.timeSkip);
      this.playerService.tooglePlayPause();
    });
    backButton.addEventListener('click', (): void => {
      this.wavesurfer.setTime(-this.timeSkip);
      this.playerService.tooglePlayPause();
    });
    prev10.addEventListener('click', (): void => {
      this.wavesurfer.skip(-10);
    });
    next10.addEventListener('click', (): void => {
      this.wavesurfer.skip(10);
    });

  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
    }
  }

  playMusicUrl(url: string): void {
    if(!this.arrayControl.includes(url)) {
      this.arrayControl.push(url, this.idMusicCurrent);
      this.wavesurfer.load(url);
      this.wavesurfer.on('finish', () => {
        this.wavesurfer.setTime(0);
        this.playMusic(this.idMusicCurrent)
      })
    }
  }

  idMusicPlay(id: number) {
    this.idMusicCurrent = id;
  }

  playMusic(musicId: any) {
    this.wavesurfer.play();
    this.playerService.tooglePlayPause();
    this.isPlaying2 = true;
  }

  pauseMusic(musicId: any) {
    this.wavesurfer.pause();
    this.playerService.tooglePlayPause();
    this.isPlaying2 = false;
  }

  playPause(): void {
    !this.isPlaying2 ? this.playMusic(this.musicId) : this.pauseMusic(this.musicId);
    // console.log(document.querySelector('button.svg.play'))
    // isso pode servir pra controlar o play em musicas caso a criacao de outro servico nao de certo, usando o id de cada musica por botao ou entao data-key.
    let btn: any = document.querySelectorAll('button.svg.play');
    btn.forEach((btn: any) => {
      if(btn.getAttribute('data-key') == this.idMusicCurrent.toString()) {
        btn.click();
        this.playerService.tooglePlayPause();
      }
    })
  }

  trackCustomOpen() {
    let waveform: any = document.querySelector('#waveform');
    let rowPlayer: any = document.querySelector('.row.player');
    let trackCustom: any = document.getElementById('trackCustom');
    let trackCustom1: any = document.getElementById('trackCustom1');
    let trackCustom2: any = document.getElementById('trackCustom2');
    let trackCustom3: any = document.getElementById('trackCustom3');
    let trackCustom4: any = document.getElementById('trackCustom4');
    if(trackCustom.getAttribute('style') == 'display: none;') {
      trackCustom.setAttribute('style', 'display: flex;');
      waveform.setAttribute('style', 'bottom: 301px;');
      rowPlayer.setAttribute('style', 'bottom: 220px;');
    } else if(trackCustom.getAttribute('style') == 'display: flex;') {
      trackCustom.setAttribute('style', 'display: none;');
      waveform.removeAttribute('style');
      rowPlayer.removeAttribute('style');
    }
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
