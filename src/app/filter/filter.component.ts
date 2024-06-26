import { empty } from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {MusicasService} from "../musicas/musicas.service";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  generos: Array<any> = [
    "Blues",
    "Clássica",
    "Corporativo",
    "Dance/Tecno",
    "Datas comemorativas",
    "Eletrônica",
    "Folk",
    "Hip Hop",
    "Infantil/Crianças",
    "Jazz",
    "Jogos",
    "Latina",
    "Mundo",
    "New age",
    "Noticiário",
    "Piano/Solo instrumental",
    "Pop",
    "Reggae",
    "Rhythm and blues",
    "Rock",
    "Sertanejo",,
    "Blues",
    "Clássica",
    "Corporativo",
    "Dance/Tecno",
    "Datas comemorativas",
    "Eletrônica",
    "Folk",
    "Hip Hop",
    "Infantil/Crianças",
    "Jazz",
    "Jogos",
    "Latina",
    "Mundo",
    "New age",
    "Noticiário",
    "Piano/Solo instrumental",
    "Pop",
    "Reggae",
    "Rhythm and blues",
    "Rock",
    "Sertanejo",,
    "Blues",
    "Clássica",
    "Corporativo",
    "Dance/Tecno",
    "Datas comemorativas",
    "Eletrônica",
    "Folk",
    "Hip Hop",
    "Infantil/Crianças",
    "Jazz",
    "Jogos",
    "Latina",
    "Mundo",
    "New age",
    "Noticiário",
    "Piano/Solo instrumental",
    "Pop",
    "Reggae",
    "Rhythm and blues",
    "Rock",
    "Sertanejo",,
    "Blues",
    "Clássica",
    "Corporativo",
    "Dance/Tecno",
    "Datas comemorativas",
    "Eletrônica",
    "Folk",
    "Hip Hop",
    "Infantil/Crianças",
    "Jazz",
    "Jogos",
    "Latina",
    "Mundo",
    "New age",
    "Noticiário",
    "Piano/Solo instrumental",
    "Pop",
    "Reggae",
    "Rhythm and blues",
    "Rock",
    "Sertanejo",
    "Blues",
    "Clássica",
    "Corporativo",
    "Dance/Tecno",
    "Datas comemorativas",
    "Eletrônica",
    "Folk",
    "Hip Hop",
    "Infantil/Crianças",
    "Jazz",
    "Jogos",
    "Latina",
    "Mundo",
    "New age",
    "Noticiário",
    "Piano/Solo instrumental",
    "Pop",
    "Reggae",
    "Rhythm and blues",
    "Rock",
    "Sertanejo",
    "Blues",
    "Clássica",
    "Corporativo",
    "Dance/Tecno",
    "Datas comemorativas",
    "Eletrônica",
    "Folk",
    "Hip Hop",
  ];
  humor: any[];

  constructor(
    private musicService: MusicasService,
  ) {
    this.humor = this.musicService.humor;
  }

  ngOnInit(): void {
  }

  filtrar() {
    let navleft = document.getElementById('navLeft');
    let cf = document.getElementById('cf');

    if(navleft!.getAttribute('style') == 'width: 13vw;' || navleft!.getAttribute('style') == 'width: 13vw; opacity: 1;') {
      navleft!.style.width = '0vw';
      navleft!.style.opacity = '0';
      cf!.style.width = '99vw';
    } else {
      navleft!.style.width = '13vw';
      navleft!.style.opacity = '1';
      cf!.style.width = '86vw';
    }
  }


  verifyGen() {
    let gender: any = document.getElementById('gender');
    let collapseOne: any = document.getElementById('collapseOne');

    collapseOne?.classList.contains('show') ? gender.click() : empty();
  }

  verifyHum() {
    let humor: any = document.getElementById('humor');
    let collapseOne1: any = document.getElementById('collapseOne1');

    collapseOne1?.classList.contains('show') ? humor.click() : empty();
  }
}
