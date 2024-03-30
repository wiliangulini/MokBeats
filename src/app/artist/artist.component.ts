import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Musica, MusicasService} from "../musicas/musicas.service";
import {AuthService} from "../login/auth.service";
import {ScrollService} from "../service/scroll.service";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {environment} from "../../environments/environment";
import {UploadFileService} from "../upload-file/upload-file.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit, AfterViewInit {
  
  public favorite: Musica = {};
  trecho: any[] = [15, 30, 60];
  loop: any[] = [1, 2, 3, 4, 5, 6, 7];
  duration: any;
  durationAut: any;
  musicDownload: any[] = [];
  titles: any[];
  music: any[];
  humor: any[];
  musicas: any = {};
  number!: number;
  formG!: FormGroup;
  frase: string = "Elegante e moderno com elementos dance pop, com pads de sintetizador, percussão, baixo de sintetizador e guitarra elétrica, criando um clima suave e noturno.";
  select: any = 'Mais Relevantes';
  $$: any;
  
  cantada: Array<any> = [
    "Amostras/Efeitos",
    "Cantores principais",
    "Coro/Grupo",
    "Oohs e Aahs",
    "Todos os Cantores",
  ]
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
  arrMusica: Musica[] = [];
  nameArtist: string = 'Wilian Gulini';
  descriptionArtist: any = 'Wilian Gulini é um desenvolvedor web/mobile e de software que reside em Coronel Vivida. Wilian Gulini é um desenvolvedor web/mobile e de software que reside em Coronel Vivida';
  
  @Output('ngModelChange') update: any = new EventEmitter();
  
  constructor(
    private musicService: MusicasService,
    private authService: AuthService,
    private scrollService: ScrollService,
    private fb: FormBuilder,
    private uploadFileService: UploadFileService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
  ) {
    this.formG = this.fb.group({
      bpm: [],
      duracao: [],
      upload: [],
      textAreaDescription: [{value: this.descriptionArtist, disabled: true}],
      nameArtist: [{value: this.nameArtist, disabled: true}],
    });
    this.titles = this.musicService.convertida2;
    this.music = this.musicService.convertida;
    this.humor = this.musicService.humor;
  }
  
  ngOnInit(): void {
    this.scrollService.scrollUp();
    this.$$ = document.querySelector.bind(document);
    if (screen.width < 769) document.getElementById('navLeft')!.style.width = '0';
    
    // this.route.queryParams.subscribe((data: any) => {
    //   console.log(data);
      // this.nameArtist = data.nome_produtor;
      this.musicService.listMusic().subscribe((data: any) => {
        this.arrMusica = data;
      });
    // });
  }
  
  ngAfterViewInit() {
    this.uploadFileService.list().subscribe((data: any) => {
      console.log(data);
    })
    
    this.uploadFile();
  }
  
  convertToBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
  
  files!: Set<File>;
  onChange(event: any) {
    const selectedFiles: FileList = event.srcElement.files;
    this.files = new Set();
    for(let i = 0; i < selectedFiles.length; i++) {
      this.files.add(selectedFiles[i]);
    }
    // this.onUpload();
  }
  
  // onUpload() {
  //   if (this.files.size > 0) {
  //     this.uploadFileService.upload(this.files, environment.API + 'uploads').subscribe((data: any) => {
  //       if(data.type == 4) {
  //         console.log(data);
  //         console.log('"Upload CONCLUIDO"');
  //
  //       }
  //     })
  //   }
  // }
  
  uploadFile(): void {
    let fileChooser = this.$$('.input-file');
    
    fileChooser.onchange = (e: any): void => {
      console.log(e.target.files[0]);
      let b64: any;
      const getFileAndConvert = async () => {
        
        const file = e.target.files[0];
        const convertedFile = await this.convertToBase64(file)
        console.log(convertedFile);
        b64 = convertedFile;
      }
      // b64 = getFileAndConvert();
      getFileAndConvert();
      setTimeout(() => {
        let img: any = document.getElementById('imgPerfil');
        console.log(img);
        img.setAttribute('src', b64);
      }, 1000);
    };
  }
  
  editDescription() {
    console.log('description');
    let description: any = document.querySelector('.description');
    let nameArtist: any = document.querySelector('.nameArtist');
    let save: any = document.getElementById('save');
    description.removeAttribute('disabled');
    nameArtist.removeAttribute('disabled');
    this.formG.patchValue({
      textAreaDescription: this.descriptionArtist
    });
    description.style.background = "#FFF";
    description.style.color = "#000";
    nameArtist.style.background = "#FFF";
    nameArtist.style.color = "#000";
    description.focus();
    save.classList.remove('d-none');
    save.classList.add('d-flex');
  }
  
  saveDescription() {
    let description: any = document.querySelector('.description');
    let nameArtist: any = document.querySelector('.nameArtist');
    let save: any = document.getElementById('save');
    console.log(this.formG.get('nameArtist')?.value); // jogar os valores dentro de console.log em uma variavel e salvar com a função save apontando pro backend.
    console.log(this.formG.get('textAreaDescription')?.value);
    description.setAttribute('disabled', 'true');
    nameArtist.setAttribute('disabled', 'true');
    description.removeAttribute('style');
    nameArtist.removeAttribute('style');
    save.classList.add('d-none');
    save.classList.remove('d-flex');
  }
  
  msToMinute(ms: any) {
    let minutes: any = Math.floor(ms / 60000);
    let seconds: any = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  
  curtir(i: number): void {
    this.favorite.id = this.arrMusica[i].id;
    this.favorite.nome_musica = this.arrMusica[i].nome_musica;
    this.favorite.nome_produtor = this.arrMusica[i].nome_produtor;
    this.favorite.duracao = this.arrMusica[i].duracao;
    this.favorite.bpm = this.arrMusica[i].bpm;
    this.favorite.trechos = this.arrMusica[i].trechos;
    this.favorite.loops = this.arrMusica[i].loops;
    this.musicService.sendFavorite(i, this.favorite);
    
  }
  
  filtrar(): void {
    let navleft = document.getElementById('navLeft');
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
  
  copiarLink(i: number): void { this.musicService.copiarLink(i); }
  
  baixarAmostra(i: number): void {
    this.authService.verificaLogin();
    if(this.authService.userAutetic()) {
      this.musicDownload = [];
      this.musicDownload.push(this.arrMusica[i].nome_musica);
      this.musicDownload.push(this.arrMusica[i].nome_produtor);
      this.musicService.baixarAmostra(i, this.musicDownload);
    }
  }
  
  comprarLicensa(i: number): void { this.musicService.comprarLicensa(i); }
  
  filtroP(e: any): void { this.select = e; }
  
  onChangedEvent(event: any, elem: any): void {
    elem == 'bpm' ? this.number = event : this.duration = event;
    
    if(elem == 'duracao') {
      let dateObj: any = new Date(this.duration * 1000);
      let minutes: any = dateObj.getUTCMinutes();
      let seconds: any = dateObj.getSeconds();
      
      let timeString: any = minutes.toString().padStart(1) + ':' + seconds.toString().padStart(2, '0');
      this.durationAut = timeString;
    }
  }
}
