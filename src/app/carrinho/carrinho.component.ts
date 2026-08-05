import {AfterContentInit, Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {FormBuilder, FormGroup, Validators,} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import {CarrinhoService} from "../service/carrinho.service";
import {CartItem} from "./cartModal/cart-modal.models";

@Component({
    selector: 'app-carrinho',
    templateUrl: './carrinho.component.html',
    styleUrls: ['./carrinho.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CarrinhoComponent implements OnInit, AfterContentInit {

  nav: any;

  numberMusic!: number;
  musics: CartItem[] = [];
  form!: FormGroup;
  cidadeJson: any = '../../assets/json/Cidades.json';
  estadoJson: any = '../../assets/json/Estados.json';
  paisJson: any = '../../assets/json/locale_MUN.json';
  price: number = 0;
  cidades: any[] = [];
  estados: any[] = [];
  pais: any[] = [];
  insert: boolean = false;
  private readonly currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

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
    this.price = this.calculateTotal(this.musics);
    console.log('carrinho: ', this.musics);
  }

  ngAfterContentInit() {
    console.log(this.price);
    this.nav = document.querySelector('nav');
    let url: string = location.href;
    let newUrl = url.slice(-8);
    if (this.nav) {
      (window.scrollY === 0 && newUrl === 'carrinho') ? this.nav.style.marginTop = '10px' : this.nav.style.marginTop = '0px';
    }
  }

  calculateTotal(items: CartItem[]): number {
    const totalInCents = items.reduce(
      (total, item) => total + Math.round(item.planoSelecionado.preco * 100),
      0
    );

    return totalInCents / 100;
  }

  formatPrice(price: number): string {
    return this.currencyFormatter.format(price);
  }

  onSubmit(data: any) {
    console.log(data);
  }

}
