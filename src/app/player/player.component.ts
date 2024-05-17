import { Component, OnInit } from '@angular/core';
import { Musica, MusicasService } from '../musicas/musicas.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {


  arrMusica: Musica[] = [];

  constructor(
    private musicService: MusicasService,
  ) { }

  ngOnInit(): void {
    this.musicService.listMusic().subscribe((data: any) => {
      console.log(data);
    })
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

}
