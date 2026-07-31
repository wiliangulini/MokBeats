import { AfterContentInit, Component, OnInit } from '@angular/core';
import { MusicasService } from "../musicas/musicas.service";

@Component({
    selector: 'app-genero',
    templateUrl: './genero.component.html',
    styleUrls: ['./genero.component.scss'],
    standalone: false
})
export class GeneroComponent implements OnInit, AfterContentInit {

  titles: Array<any> = [];
  music: Array<any> = [];

  constructor(
    private musicService: MusicasService,
  ) {
    window.scroll(0, 0);
  }

  ngOnInit(): void {
    this.musicService.getGenresFull().subscribe((map: any) => {
      this.titles = Object.keys(map);
      this.music = Object.keys(map).map((k: string) => map[k]);
    });
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
