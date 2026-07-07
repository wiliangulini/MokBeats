import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { EfeitosSonorosService } from "./efeitosSonoros.service";
import {ScrollService} from "../service/scroll.service";

@Component({
  selector: 'app-efeitos-sonoros',
  templateUrl: './efeitosSonoros.component.html',
  styleUrls: ['./efeitosSonoros.component.scss']
})
export class EfeitosSonorosComponent implements OnInit, AfterViewInit {

  titles: any[];
  music: any[];
  musicas: any = {};
  number!: number;
  valor: any;
  frase: string = "Elegante e moderno com elementos dance pop, com pads de sintetizador, percussão, baixo de sintetizador e guitarra elétrica, criando um clima suave e noturno.";
  select: any = 'Mais Relevantes';
  vozes: Array<any> = [
    "Amostras/Efeitos",
    "Cantores principais",
    "Coro/Grupo",
    "Oohs e Aahs",
    "Todos os Cantores",
  ]
  // Mock estático: não existe endpoint /api/efeitos hoje (ver auditoria R14).
  // Paginação é client-side sobre este array fixo até a API existir.
  dados: Array<any> =  [
    {value: 'Sweet Spot', viewValue: 'Sweet Spot'},
    {value: 'Bonieky', viewValue: 'Bonieky'},
    {value: 'Wilian', viewValue: 'Wilian'},
    {value: 'Maleficus Chaos', viewValue: 'Maleficus Chaos'},
    {value: 'HighFrenetic', viewValue: 'HighFrenetic'},
    {value: 'Sweet Spot', viewValue: 'Sweet Spot'},
    {value: 'Bonieky', viewValue: 'Bonieky'},
    {value: 'Wilian', viewValue: 'Wilian'},
    {value: 'Maleficus Chaos', viewValue: 'Maleficus Chaos'},
    {value: 'HighFrenetic', viewValue: 'HighFrenetic'},
    {value: 'Sweet Spot', viewValue: 'Sweet Spot'},
    {value: 'Bonieky', viewValue: 'Bonieky'},
    {value: 'Wilian', viewValue: 'Wilian'},
    {value: 'Maleficus Chaos', viewValue: 'Maleficus Chaos'},
    {value: 'HighFrenetic', viewValue: 'HighFrenetic'},
    {value: 'Sweet Spot', viewValue: 'Sweet Spot'},
    {value: 'Bonieky', viewValue: 'Bonieky'},
    {value: 'Wilian', viewValue: 'Wilian'},
    {value: 'Maleficus Chaos', viewValue: 'Maleficus Chaos'},
    {value: 'HighFrenetic', viewValue: 'HighFrenetic'},
  ];
  arrMusic: Array<any> = [
    {value: 'The Funkster', viewValue: 'The Funkster'},
    {value: 'Code', viewValue: 'Code'},
    {value: 'Impertinent', viewValue: 'Impertinent'},
    {value: 'Maleficus Chaos', viewValue: 'Maleficus Chaos'},
    {value: 'HighFrenetic', viewValue: 'HighFrenetic'},
    {value: 'The Funkster', viewValue: 'The Funkster'},
    {value: 'Code', viewValue: 'Code'},
    {value: 'Impertinent', viewValue: 'Impertinent'},
    {value: 'Maleficus Chaos', viewValue: 'Maleficus Chaos'},
    {value: 'HighFrenetic', viewValue: 'HighFrenetic'},
    {value: 'The Funkster', viewValue: 'The Funkster'},
    {value: 'Code', viewValue: 'Code'},
    {value: 'Impertinent', viewValue: 'Impertinent'},
    {value: 'Maleficus Chaos', viewValue: 'Maleficus Chaos'},
    {value: 'HighFrenetic', viewValue: 'HighFrenetic'},
    {value: 'The Funkster', viewValue: 'The Funkster'},
    {value: 'Code', viewValue: 'Code'},
    {value: 'Impertinent', viewValue: 'Impertinent'},
    {value: 'Maleficus Chaos', viewValue: 'Maleficus Chaos'},
    {value: 'HighFrenetic', viewValue: 'HighFrenetic'},
  ];
  arrFilter: Array<any> = [
    "Popularidade",
    "Mais relevantes",
  ]
  arrVExtendida: Array<any> = [
    {value: "Baixo por sintetizador", viewValue: "Baixo por sintetizador"},
    {value: "Chill", viewValue: "Chill"},
    {value: "Dance", viewValue: "Dance"},
    {value: "Dance Pop", viewValue: "Dance Pop"},
    {value: "Dance/Tecno", viewValue: "Dance/Tecno"},
    {value: "Electro pop", viewValue: "Electro pop"},
    {value: "Exciting", viewValue: "Exciting"},
    {value: "Futurista", viewValue: "Futurista"},
    {value: "Futuristic", viewValue: "Futuristic"},
    {value: "Groovy", viewValue: "Groovy"},
    {value: "Guitarra", viewValue: "Guitarra"},
    {value: "Hip", viewValue: "Hip"},
    {value: "Mesmerizing", viewValue: "Mesmerizing"},
    {value: "Moda/Estilo de vida", viewValue: "Moda/Estilo de vida"},
    {value: "Pulsing", viewValue: "Pulsing"},
    {value: "Sentimento bom", viewValue: "Sentimento bom"},
    {value: "Sintetizador", viewValue: "Sintetizador"},
    {value: "Smooth", viewValue: "Smooth"},
    {value: "Technology", viewValue: "Technology"},
    {value: "Trippy", viewValue: "Trippy"},
  ]

  @Output('ngModelChange') update: any = new EventEmitter();

  // Paginação client-side (dados mock, sem backend) — ver comentário acima de `dados`.
  currentPage: number = 1;
  itemsPerPage: number = 10;
  itensPaginados: Array<{ viewValue: string; produtor: string }> = [];

  get totalPages(): number {
    return Math.ceil(this.arrMusic.length / this.itemsPerPage);
  }

  constructor(
    private effectSoundService: EfeitosSonorosService,
    private scrollService: ScrollService,
  ) {
    this.titles = this.effectSoundService.convertida2;
    this.music = this.effectSoundService.convertida;
  }

  ngOnInit(): void {
    this.scrollService.scrollUp();
    this.atualizarPaginaAtual();

    let div1: any = document.getElementById('div1');
    let div2: any = document.getElementById('div2');
    div1.style.display = 'none';
    div2.style.display = 'none';

    if (screen.width < 769) {
      document.getElementById('navLeft')!.style.width = '0';
    }
  }

  // Combina arrMusic[i] (nome) + dados[i] (produtor) pelo mesmo índice global,
  // evitando descompasso entre nome e produtor ao trocar de página.
  private atualizarPaginaAtual(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.itensPaginados = this.arrMusic
      .slice(start, end)
      .map((efeito, idx) => ({
        viewValue: efeito.viewValue,
        produtor: this.dados[start + idx].viewValue,
      }));
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.atualizarPaginaAtual();
    this.scrollService.scrollUp();
  }

  ngAfterViewInit() {
    document.querySelectorAll('.mat-checkbox-frame')?.forEach((e: any) => {
      e.style.borderColor = "#FFF";
    })
  }

  curtir(i: number): void {
    this.effectSoundService.curtir(i);
  }

  filtrar(): void {
    let navleft = document.getElementById('navLeft');
    console.log(navleft);
    if(navleft!.getAttribute('style') == 'width: 0px;' || navleft!.getAttribute('style') == 'width: 0px; opacity: 0; z-index: 0;') {
      navleft!.style.width = '96vw';
      navleft!.style.opacity = '1';
      navleft!.style.zIndex = '99999';
    } else {
      navleft!.style.width = '0';
      navleft!.style.opacity = '0';
      navleft!.style.zIndex = '0';
    }
  }

  // Pendência objetiva (R16): não chama CarrinhoService.openModalCart aqui.
  // O contrato do carrinho (CartItem = Musica & CartSelection, openModalCart(music: Musica))
  // é acoplado nominal e semanticamente a Musica (id/url/nome_musica/nome_produtor), e o
  // efeito sonoro mock não tem nenhum desses campos (sem id, sem url, sem preço real).
  // Forçar esse objeto no fluxo geraria um CartItem inválido/deduplicação quebrada e um
  // modal com labels erradas ("Música selecionada"). Retomar somente quando existir
  // /api/efeitos real e um tipo EfeitoSonoro com id/url/preço (ver docs/ia-auditorias/R14, R16).
  comprarLicensa(i: number): void {
    this.effectSoundService.comprarLicensa(i);
  }

  filtroP(e: any): void {
    console.log(e);
    this.select = e;
  }
}
