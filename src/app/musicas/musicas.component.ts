import {Component, OnInit} from '@angular/core';
import {MusicasService} from "./musicas.service";
import {AuthService} from "../login/auth.service";

@Component({
  selector: 'app-musicas',
  templateUrl: './musicas.component.html',
  styleUrls: ['./musicas.component.scss']
})
export class MusicasComponent implements OnInit {

  icon: string = 'play_circle';

  dados: Array<any> =  [
    {value: 'Sweet Spot', viewValue: 'Sweet Spot'},
    {value: 'Bonieky', viewValue: 'Bonieky'},
    {value: 'Wilian', viewValue: 'Wilian'},
    {value: 'Maleficus Chaos', viewValue: 'Maleficus Chaos'},
    {value: 'HighFrenetic', viewValue: 'HighFrenetic'}
  ];
  produtores: Array<any> = [
    {value: 'The Funkster', viewValue: 'The Funkster'},
    {value: 'Code', viewValue: 'Code'},
    {value: 'Impertinent', viewValue: 'Impertinent'},
    {value: 'Maleficus Chaos', viewValue: 'Maleficus Chaos'},
    {value: 'HighFrenetic', viewValue: 'HighFrenetic'},
  ];

  filter: Array<any> = [];
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

  constructor(
    private musicService: MusicasService,
    private authService: AuthService,
  ) {
    this.filter = this.musicService.filtroGenero;
  }

  ngOnInit(): void {
  }

  curtir(i: number) {
    this.musicService.curtir(i);
  }

  addPlayList(i: number) {
    this.musicService.addPlayList(i);
  }

  copiarLink(i: number) {
    this.musicService.copiarLink(i);
  }

  baixarAmostra(i: number) {
    this.musicService.baixarAmostra(i);
  }

  verificaLogin() {
    this.authService.verificaLogin();
  }

  filtrar() {
    console.log('filtrar');
    let navleft = document.getElementById('navLeft');
    let cf = document.getElementById('cf');
    if(navleft!.getAttribute('style') == 'width: 15vw;' || navleft!.getAttribute('style') == 'width: 15vw; opacity: 1;') {
      navleft!.style.width = '0vw';
      navleft!.style.opacity = '0';
      cf!.style.width = '100vw';
    } else {
      navleft!.style.width = '15vw';
      navleft!.style.opacity = '1';
      cf!.style.width = '84vw';
    }
  }

  openGeneroAccordion() {
    let section = document.getElementById('generoAccordion');
    section!.getAttribute('style') == 'display: none;' ? section!.style.display = 'flex' : section!.style.display = 'none';
  }

}
