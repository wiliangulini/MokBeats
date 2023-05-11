import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from "@angular/forms";
import {AuthService} from "../login/auth.service";
import {MusicasService} from "../musicas/musicas.service";

interface GeneroM {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, AfterViewChecked {

  form: FormGroup;
  public mokbeats: any = {};
  icon: string = 'play_circle';
  musicAdd: any;
  musicDownload: any[] = [];

  dados: Array<any> =  [
    {value: 'Sweet Spot', viewValue: 'Sweet Spot'},
    {value: 'Bonieky', viewValue: 'Bonieky'},
    {value: 'Wilian', viewValue: 'Wilian'},
    {value: 'Maleficus Chaos', viewValue: 'Maleficus Chaos'},
    {value: 'HighFrenetic', viewValue: 'HighFrenetic'}
  ];
  arrMusic: Array<any> = [
    {value: 'The Funkster', viewValue: 'The Funkster'},
    {value: 'Code', viewValue: 'Code'},
    {value: 'Impertinent', viewValue: 'Impertinent'},
    {value: 'Maleficus Chaos', viewValue: 'Maleficus Chaos'},
    {value: 'HighFrenetic', viewValue: 'HighFrenetic'},
  ];
  generoM: GeneroM[] = [
    {value: 'Rock', viewValue: 'Rock'},
    {value: 'Reggae', viewValue: 'Reggae'},
    {value: 'Eletrônico', viewValue: 'Eletrônico'}
  ];

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private musicService: MusicasService,
  ) {
    this.form = this.fb.group({
      search: [],
      email: [],
      genero: [],
    });
  }

  ngOnInit(): void {}

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
    this.form.get('genero')?.setValue(this.generoM[0].viewValue);
  }

  curtir(i: number) {
   return this.musicService.curtir(i);
  }

  addPlayList(i: number) {
    this.musicAdd = this.dados[i].viewValue;
    return this.musicService.addPlayList(i, this.musicAdd);
  }

  copiarLink(i: number) {
    return this.musicService.copiarLink(i);
  }

  baixarAmostra(i: number) {
    this.musicDownload.push(this.arrMusic[i].viewValue);
    this.musicDownload.push(this.dados[i].viewValue);
    this.musicService.baixarAmostra(i, this.musicDownload);
  }

  verificaLogin() {
    this.authService.verificaLogin();
  }

  onSubmit(): void {
    console.log(this.mokbeats.search);
    console.log(this.mokbeats.genero);
    console.log(this.mokbeats.email);
  }
}
