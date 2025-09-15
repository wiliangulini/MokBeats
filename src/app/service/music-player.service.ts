import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import WaveSurfer from "wavesurfer.js";

@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {

  private playPauseSubject = new Subject<{action: any, musicId: any}>();
  playPauseAction$ = this.playPauseSubject.asObservable();

  private currentMusicUrlSubject = new BehaviorSubject<string>('');
  currentMusicUrl$ = this.currentMusicUrlSubject.asObservable();

  private currentMusicIDSubject = new BehaviorSubject<number>(-1);
  currentMusicID$ = this.currentMusicIDSubject.asObservable();

  // Stream de tempo atual da música tocando (em segundos)
  private currentTimeSubject = new Subject<number>();
  currentTime$ = this.currentTimeSubject.asObservable();

  // Solicitações de seek vindas de outros componentes (ex.: lista)
  private seekRequestSubject = new Subject<{ musicId: number, time: number }>();
  seekRequest$ = this.seekRequestSubject.asObservable();

  // private wavesurfer!: WaveSurfer;
  //
  // playPause(): void {
  //   this.wavesurfer?.playPause();
  // }

  onPlayPause(action: any, musicId: any) {
    this.playPauseSubject.next({action, musicId});
  }

  setCurrentMusicUrl(musicUrl: any) {
    this.currentMusicUrlSubject.next(musicUrl);
  }

  setCurrentMusicID(idMusic: any) {
    this.currentMusicIDSubject.next(idMusic);
  }

  setCurrentTime(seconds: number) {
    this.currentTimeSubject.next(seconds);
  }

  requestSeek(musicId: number, time: number) {
    this.seekRequestSubject.next({ musicId, time });
  }

}
