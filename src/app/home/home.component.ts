
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from "../login/auth.service";
import {Musica, MusicasService} from "../musicas/musicas.service";
import {Router} from "@angular/router";
import {ScrollService} from "../service/scroll.service";

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

  dados: Array<any> = [
    { value: 'Sweet Spot', viewValue: 'Sweet Spot' },
    { value: 'Bonieky', viewValue: 'Bonieky' },
    { value: 'Wilian', viewValue: 'Wilian' },
    { value: 'Maleficus Chaos', viewValue: 'Maleficus Chaos' },
    { value: 'HighFrenetic', viewValue: 'HighFrenetic' }
  ];
  arrMusic: Array<any> = [
    { value: 'The Funkster', viewValue: 'The Funkster' },
    { value: 'Code', viewValue: 'Code' },
    { value: 'Impertinent', viewValue: 'Impertinent' },
    { value: 'Maleficus Chaos', viewValue: 'Maleficus Chaos' },
    { value: 'HighFrenetic', viewValue: 'HighFrenetic' },
  ];
  generoM: GeneroM[] = [
    { value: 'Músicas', viewValue: 'Músicas' },
    { value: 'Efeitos', viewValue: 'Efeitos' },
  ];

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private musicService: MusicasService,
    private scrollService: ScrollService,
    private router: Router
  ) {
    this.form = this.fb.group({
      search: [],
      email: [],
      genero: [],
    });
  }

  ngOnInit(): void {
    this.scrollService.scrollUp();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
    this.form.get('genero')?.setValue(this.generoM[0].viewValue);
  }

  routeNav(txt: string): void {
    if (txt === 'musicas') {
      this.router.navigate(['/musicas']).then();
    } else if (txt === 'precos') {
      this.router.navigate(['/precos']).then();
    }
  }

  curtir(i: number) {
    return this.musicService.curtir(i);
  }

  addPlayList(music: Musica) {
    return this.musicService.addPlayList(music);
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

  comprarLicensa(i: number) {
    this.musicService.comprarLicensa(i);
  }

  onSubmit(): void {
    console.log(this.mokbeats.search);
    console.log(this.mokbeats.genero);
    console.log(this.mokbeats.email);
  }
}
