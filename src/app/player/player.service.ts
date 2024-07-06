import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import WaveSurfer from "wavesurfer.js";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private dataSource = new BehaviorSubject<any>('audio');
  currentData = this.dataSource.asObservable();

  // private dataSource2 = new BehaviorSubject<any>('waveId');
  // currentData2 = this.dataSource2.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$ = this.isPlayingSubject.asObservable();

  play() {
    this.isPlayingSubject.next(true);
  }

  pause() {
    this.isPlayingSubject.next(false);
  }

  changeData(data: any) {
    this.dataSource.next(data);
  }

  // changeData2(data: any) {
  //   this.dataSource2.next(data);
  // }

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

  hidePlayer() {
    document.getElementById('controlPlayer')!.classList.remove('showPlayer');
    document.getElementById('controlPlayer')!.classList.add('hidePlayer');
  }

  // setAudio(data: any) {
  //   this.data = data;
  // }
  // setId(data2: any) {
  //   this.data2 = data2;
  // }
  // getAudio() {
  //   // console.log(this.data);
  //   return this.data;
  // }
  // getId() {
  //   // console.log(this.data2);
  //   return this.data2;
  // }


}
