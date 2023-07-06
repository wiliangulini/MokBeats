import { AfterContentInit, Component, OnInit } from '@angular/core';
import { MusicasService } from "../musicas/musicas.service";

@Component({
  selector: 'app-genero',
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.scss']
})
export class GeneroComponent implements OnInit, AfterContentInit {

  titles: Array<any> = [];
  music: Array<any> = [];

  constructor(
    private musicService: MusicasService,
  ) {
    this.titles = this.musicService.convertida2;
    this.music = this.musicService.convertida;
    console.log(this.titles);
    console.log(this.music);
    window.scroll(0, 0);
  }

  ngOnInit(): void {
  }

  ngAfterContentInit() {
    setTimeout(() => {
      let form = document.getElementById('form');
      document.getElementById('btnOutS')!.style.display = 'none';
      document.getElementById('cf')!.style.justifyContent = 'flex-end';
      form!.style.position = 'absolute';
      form!.style.left = '.5%';
      form!.style.top = '0';
    }, 25);
  }

}
