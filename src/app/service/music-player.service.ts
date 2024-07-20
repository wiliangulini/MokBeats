import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {

  private playPauseSubject = new Subject<{action: any, musicId: any}>();
  playPauseAction$ = this.playPauseSubject.asObservable();

  private urlGo = new Subject<{ url: any }>();
  urlGo$ = this.urlGo.asObservable();

  private dataSource = new BehaviorSubject<any>('');
  currentData = this.dataSource.asObservable();

  // private isPlayingSubject = new BehaviorSubject<boolean>(false);
  // isPlaying$ = this.isPlayingSubject.asObservable();

  takeUrl(url: any) {
    this.urlGo.next(url);
  }

  onPlayPause(action: any, musicId: any) {
    this.playPauseSubject.next({action, musicId});
  }

  changeData(data: any) {
    this.dataSource.next(data);
  }
  //
  // playTrue() {
  //   this.isPlayingSubject.next(true);
  // }
  //
  // playFalse() {
  //   this.isPlayingSubject.next(false);
  // }

}
