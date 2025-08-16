import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators,} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {CarrinhoService} from "../service/carrinho.service";
import {Musica} from "../musicas/musicas.service";

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss']
})
export class CarrinhoComponent implements OnInit, AfterContentInit {

  nav: any;

  numberMusic!: number;
  musics: Musica[] = [];
  form!: FormGroup;
  cidadeJson: any = '../../assets/json/Cidades.json';
  estadoJson: any = '../../assets/json/Estados.json';
  paisJson: any = '../../assets/json/locale_MUN.json';
  priceMusic: number = 29;
  price!: number;
  cidades: any[] = [];
  estados: any[] = [];
  pais: any[] = [];
  insert: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cartService: CarrinhoService,
  ) {
    this.form = this.fb.group({
      nomeProjeto: [''],
      observacoes: [''],
      nomeContato: ['', Validators.required],
      endereco: ['', Validators.required],
      enderecoLinha2: [''],
      pais: ['', Validators.required],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      cep: ['', Validators.required],
      credito: [''],
      termosLicensa: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.http.get<any>(this.paisJson).subscribe((data: any) => {
      console.log(data);
      this.pais = data;
    });
    this.http.get<any>(this.estadoJson).subscribe((data: any) => {
      console.log(data);
      this.estados = data;
    });
    this.http.get<any>(this.cidadeJson).subscribe((data: any) => {
      console.log(data);
      this.cidades = data;
    });
    this.musics = this.cartService.receivingCart2();
    this.numberMusic = this.musics.length;
    this.numberMusic > 0 ? this.insert = true : this.insert = false;
    console.log('carrinho: ', this.musics);
  }

  ngAfterContentInit() {
    this.price = this.numberMusic * this.priceMusic;
    console.log(this.price);
    this.nav = document.querySelector('nav');
    let url: string = location.href;
    let newUrl = url.slice(-8);
    (window.scrollY === 0 && newUrl === 'carrinho') ? this.nav.style.marginTop = '10px' : this.nav.style.marginTop = '0px';
  }

  onSubmit(data: any) {
    console.log(data);
  }

}
