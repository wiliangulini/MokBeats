import { Component, OnInit } from '@angular/core';
import {MusicasService} from "../musicas/musicas.service";

@Component({
  selector: 'app-genero',
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.scss']
})
export class GeneroComponent implements OnInit {

  titles: Array<any> = [];
  music: Array<any> = [];

  constructor(
    private musicService: MusicasService,
  ) {
    this.titles = this.musicService.convertida2;
    this.music = this.musicService.convertida;
    console.log(this.titles);
    console.log(this.music);
  }

  ngOnInit(): void {
  }

}
