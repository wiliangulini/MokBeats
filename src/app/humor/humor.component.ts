import { Component, OnInit } from '@angular/core';
import {MusicasService} from "../musicas/musicas.service";

@Component({
  selector: 'app-humor',
  templateUrl: './humor.component.html',
  styleUrls: ['./humor.component.scss']
})
export class HumorComponent implements OnInit {

  humor: any[];

  constructor(
    private musicService: MusicasService,
  ) {
    this.humor = this.musicService.humor;
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
