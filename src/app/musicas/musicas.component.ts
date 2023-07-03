import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MusicasService} from "./musicas.service";
import {AuthService} from "../login/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-musicas',
  templateUrl: './musicas.component.html',
  styleUrls: ['./musicas.component.scss']
})
export class MusicasComponent implements OnInit {

  musicAdd: any;
  duration: any;
  durationAut: any;
  musicDownload: any[] = [];
  icon: string = 'play_circle';
  titles: any[];
  music: any[];
  humor: any[];
  musicas: any = {};
  number!: number;
  formG!: FormGroup;
  valor: any;
  frase: string = "Elegante e moderno com elementos dance pop, com pads de sintetizador, percussão, baixo de sintetizador e guitarra elétrica, criando um clima suave e noturno.";
  select: any = 'Mais Relevantes';
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
    "Mais recentes",
    "Ordem alfabética",
    "Artista",
    "BPM (mais baixos primeiro)",
    "BPM (mais altos primeiro)",
    "Duração (mais curtas primeiro)",
    "Duração (mais longas primeiro)",
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

  constructor(
    private musicService: MusicasService,
    private fb: FormBuilder,
  ) {
    this.formG = this.fb.group({
      checkbox: [],
      bpm: [],
      duracao: [],
    });
    this.titles = this.musicService.convertida2;
    this.music = this.musicService.convertida;
    this.humor = this.musicService.humor;
  }

  ngOnInit(): void {
    // if (screen.width < 769) {
    //   console.log(this.mobileBtn);
    //   this.btnMobile = true;
    //   this.mobileBtn.nativeElement.style.display = 'flex';
    // } else {
    //   console.log(this.mobileBtn);
    //   this.btnMobile = false;
    //   this.mobileBtn.nativeElement.style.display = 'none';
    // }
  }

  curtir(i: number) {
    this.musicService.curtir(i);
  }

  filtrar() {
    let navleft = document.getElementById('navLeft');
    console.log(navleft);
    if(navleft!.getAttribute('style') == 'width: 96vw;' || navleft!.getAttribute('style') == 'width: 96vw; opacity: 1;') {
      navleft!.style.width = '0vw';
      navleft!.style.opacity = '0';
      navleft!.style.display = 'flex';
      navleft!.style.zIndex = '0';
    } else {
      navleft!.style.width = '96vw';
      navleft!.style.opacity = '1';
      navleft!.style.display = 'flex';
      navleft!.style.zIndex = '99999';
    }
  }

  addPlayList(i: number) {
    this.musicAdd = this.arrMusic[i].viewValue;
    this.musicService.addPlayList(i, this.musicAdd);
  }

  copiarLink(i: number) {
    this.musicService.copiarLink(i);
  }

  baixarAmostra(i: number) {
    this.musicDownload = [];
    this.musicDownload.push(this.arrMusic[i].viewValue);
    this.musicDownload.push(this.dados[i].viewValue);
    this.musicService.baixarAmostra(i, this.musicDownload);
  }

  comprarLicensa(i: number) {
    this.musicService.comprarLicensa(i);
  }

  onChange(event: any) {
    console.log(event);
  }

  filtroP(e: any) {
    console.log(e);
    this.select = e;
  }

  radio(e: any) {
    console.log(e);
    console.log(e.target.value);
    this.valor = e.target.value;
    this.getValor(this.valor);
  }

  getValor(elm: any) {
    console.log(elm);
    let valor = elm;
    return valor;
  }

  onChangedEvent(event: any, elem: any) {
    elem == 'bpm' ? this.number = event : this.duration = event;
    if(elem == 'duracao') {
        let dateObj: any = new Date(this.duration * 1000);
        let minutes: any = dateObj.getUTCMinutes();
        let seconds: any = dateObj.getSeconds();

        let timeString: any = minutes.toString().padStart(1) + ':' + seconds.toString().padStart(2, '0');
        this.durationAut = timeString;
        console.log(this.durationAut)
      }
    }
}
