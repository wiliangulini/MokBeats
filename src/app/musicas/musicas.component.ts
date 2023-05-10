import {Component, OnInit} from '@angular/core';
import {MusicasService} from "./musicas.service";
import {AuthService} from "../login/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-musicas',
  templateUrl: './musicas.component.html',
  styleUrls: ['./musicas.component.scss']
})
export class MusicasComponent implements OnInit {

  icon: string = 'play_circle';
  titles: any[];
  music: any[];
  humor: any[];
  formG!: FormGroup;

  cantada: Array<any> = [
    "Amostras/Efeitos",
    "Cantores principais",
    "Coro/Grupo",
    "Oohs e Aahs",
    "Todos os Cantores",
  ]
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

  constructor(
    private musicService: MusicasService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.formG = this.fb.group({
      checkbox: [],
      checkbox1: [],
    });
    this.titles = this.musicService.convertida2;
    this.music = this.musicService.convertida;
    this.humor = this.musicService.humor;
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

  onChange(event: any) {
    console.log(event);
  }

}
