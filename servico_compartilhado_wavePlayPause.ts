// //playerService
// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class PlayerService {
//   private isPlayingSubject = new BehaviorSubject<boolean>(false);
//   isPlaying$ = this.isPlayingSubject.asObservable();
//
//   play() {
//     this.isPlayingSubject.next(true);
//   }
//
//   pause() {
//     this.isPlayingSubject.next(false);
//   }
// }
//
//
// // wavesurfer ou em musicas?? wavesurfer ja tem play musicas na vdd pega de wavesurfer Component.
// import { Component, OnInit } from '@angular/core';
// import { PlayerService } from './player.service';
//0
// @Component({
//   selector: 'app-wavesurfer',
//   templateUrl: './wavesurfer.component.html',
//   styleUrls: ['./wavesurfer.component.css']
// })
// export class WavesurferComponent implements OnInit {
//   isPlaying: boolean;
//
//   constructor(private playerService: PlayerService) {}
//
//   ngOnInit() {
//     this.playerService.isPlaying$.subscribe(isPlaying => {
//       this.isPlaying = isPlaying;
//       if (this.isPlaying) {
//         // Lógica para tocar o wavesurfer
//       } else {
//         // Lógica para pausar o wavesurfer
//       }
//     });
//   }
// }
//
//
// // player ou musicas??
// import { Component, OnInit } from '@angular/core';
// import { PlayerService } from './player.service';
//
// @Component({
//   selector: 'app-player',
//   templateUrl: './player.component.html',
//   styleUrls: ['./player.component.css']
// })
// export class PlayerComponent implements OnInit {
//   isPlaying: boolean;
//
//   constructor(private playerService: PlayerService) {}
//
//   ngOnInit() {
//     this.playerService.isPlaying$.subscribe(isPlaying => {
//       this.isPlaying = isPlaying;
//     });
//   }
//
//   togglePlayPause() {
//     if (this.isPlaying) {
//       this.playerService.pause();
//     } else {
//       this.playerService.play();
//     }
//   }
// }
//

// button no html pra reconhecer, isso vai dar certo? se necessario faça testes.
// <button (click)="togglePlayPause()">
//   {{ isPlaying ? 'Pause' : 'Play' }}
// </button>

