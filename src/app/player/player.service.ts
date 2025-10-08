import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import WaveSurfer from "wavesurfer.js";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  tooglePlayPause() {
    let play: any = document.querySelector('#play');
    let pause: any = document.querySelector('#pause');
    if (play.classList.contains('d-flex')) {
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
    const show = document.getElementById('showPlayerBtn');
    if (show) show.style.display = 'flex';
    try { localStorage.setItem('playerMinimized', 'true'); } catch (e) { }
  }

  showPlayer() {
    document.getElementById('controlPlayer')!.classList.remove('hidePlayer');
    document.getElementById('controlPlayer')!.classList.add('showPlayer');
    const show = document.getElementById('showPlayerBtn');
    if (show) show.style.display = 'none';
    try { localStorage.setItem('playerMinimized', 'false'); } catch (e) { }
  }
}
