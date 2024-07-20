import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {

  private playPauseSubject = new Subject<{action: any, musicId: any}>();
  playPauseAction$ = this.playPauseSubject.asObservable();

  private currentMusicUrlSubject = new BehaviorSubject<string>('');
  currentMusicUrl$ = this.currentMusicUrlSubject.asObservable();

  onPlayPause(action: any, musicId: any) {
    this.playPauseSubject.next({action, musicId});
  }

  setCurrentMusicUrl(musicUrl: any) {
    this.currentMusicUrlSubject.next(musicUrl);
  }

}
