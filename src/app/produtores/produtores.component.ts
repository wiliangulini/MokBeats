import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ScrollService} from "../service/scroll.service";
import {EMPTY} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MusicasService} from "../musicas/musicas.service";
import {UploadFileService} from "../upload-file/upload-file.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-produtores',
  templateUrl: './produtores.component.html',
  styleUrls: ['./produtores.component.scss']
})
export class ProdutoresComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('CWE') CWE: any;

  form: FormGroup;
  rules: string = '';
  producer: string = '';
  selectOption: string = '';
  checkBoxProducer: boolean = false;
  checked: boolean = false;
  numero: number = 0;
  rulesVal: any;
  card: any;
  $$: any;
  generoMusic: any[] = [];
  typeStems: any[] = [
    { value: 'Druns', viewValue: 'Druns' },
    { value:  'Melodia', viewValue:  'Melodia' },
    { value: 'Harmonia', viewValue: 'Harmonia' },
    { value: 'Efeitos/Vozes', viewValue: 'Efeitos/Vozes' },
  ]
  valueTrack: Array<any> = [
    { value: 'trackNoStems', viewValue: 'Track sem Stems' },
    { value: 'trackWithStems', viewValue: 'Track com Stems' },
  ]
  oneOrAlbum: Array<any> = [
    { value: '1 Track com 4 stems', viewValue: '1 Track com 4 stems' },
    { value: '10 Tracks com 30 Stems', viewValue: '10 Tracks com 30 Stems' },
  ]
  rulesTrackStems: Array<any> = [
    {
      value: '10Tracks',
      viewValue: 'Nesta opção você produtor poderá fazer upload de até dez tracks sem stems.' },
    {
      value: '1Track4Stems',
      viewValue: 'Nesta opção você produtor poderá fazer upload de uma track completa com mais quatro stems, totalizando em cinco uploads. Stems precisam ter o mesmo duração da full track.'
    },
    {
      value: '10Track30Stems',
      viewValue: 'Nesta opção você produtor poderá fazer upload de até dez tracks completas com mais trinta stems ( no caso quatro stems por track ), totalizando em quarenta uploads. Stems precisam ter o mesmo duração da full track.'
    },
  ];

  constructor(
    private snackBar: MatSnackBar,
    private scrollService: ScrollService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private musicService: MusicasService,
    private uploadFileService: UploadFileService,
  ) {
    this.form = this.fb.group({
      track_stems: [this.producer, Validators.required],
      selectOption: [this.selectOption, Validators.required],
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      artista_banda: ['', Validators.required],
      email: ['', Validators.required],
      confirmEmail: ['', Validators.required],
      fonteAcesso: ['', Validators.required],
      upload: ['', Validators.required],
      politicaDePrivacidade: ['', Validators.required],
      generoMusic: ['', Validators.required],
      textarea: ['', Validators.required],
      textarea1: ['', Validators.required],
      matCheckbox: ['', Validators.required],
      pepperoni: [false, Validators.required],
      extracheese: [false, Validators.required],
      mushroom: [false, Validators.required],
      checkBoxProducer: [this.checkBoxProducer, Validators.required],
    });
  }

  ngOnInit(): void {
    this.scrollService.scrollUp();
    this.$$ = document.querySelector.bind(document);
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngAfterViewInit(): void {
    // this.uploadFileService.list().subscribe(data => console.log(data));

    this.uploadFileService.list2().subscribe(data => console.log(data));

    this.uploadFileService.loadById(4).subscribe(data => console.log(data));
    /*
    esta listando no console, verificar se outros metodos alem da listagem estao funcionando, se sim, mudar_todo o nosso crud atual para esse novo back end.

    remover enviroment e criar as urls.
    */

    this.generoMusic = this.musicService.convertida2;
    this.uploadFile();
    let matForm: any = document.querySelectorAll('.mat-form-field-wrapper');
    let matFormInt: any = document.querySelectorAll('.mat-form-field-infix');
    let matFormInt1: any = document.querySelectorAll('.mat-form-field-flex');
    matForm.forEach((e: any) => {
      e!.style.width = '100%';
      e!.style.height = '100%';
    });
    matFormInt.forEach((e: any) => {
      e!.style.width = '100%';
      e!.style.height = '100%';
    });
    matFormInt1.forEach((e: any) => {
      e!.style.width = '100%';
      e!.style.height = '100%';
    });
  }

  private removeTracks(): void {

    let divPreview: any = this.$$('.uploaded');
    if (divPreview !== null) {
      if (divPreview.parentNode && divPreview.innerText.length > 0) {
        document.querySelectorAll('.uploaded').forEach((e: any): void => {
          e.parentNode.removeChild(e);
        });
      }
    }
  }

  markCheckbox(e: any) {
    console.log(this.checkBoxProducer);
    if(e.target.checked == undefined) {
      this.checkBoxProducer ? this.checkBoxProducer = false : this.checkBoxProducer = true;
    }
    if (e.target.checked == true) {
      this.checkBoxProducer = true;
      document.getElementById('btn')?.classList.add('top');
      document.querySelector('a.m-0.p-0')?.classList.add('top');
      document.getElementById('collapseWidthExample')?.classList.add('comboFlex');
    } else if (e.target.checked == false) {
      this.checkBoxProducer = false;
    }
    console.log(this.checkBoxProducer);
    console.log(e.target.checked);
  }

  changeTrack(elm: any): void {
    (elm.value == 'trackWithStems' || elm == 'trackWithStems' || this.producer == 'trackWithStems' || elm.value == 'trackNoStems' || elm == 'trackNoStems' || this.producer == 'trackNoStems') ? this.CWE.nativeElement.style.display = 'inline-grid' : EMPTY;

    this.cardAnimate();
    this.rulesTrackStems.forEach((e: any): void => {
      if (e.value === '10Tracks' && (elm.value == 'trackNoStems' || elm == 'trackNoStems' || this.producer == 'trackNoStems')) {
        this.rules = e.viewValue;
        this.rulesVal = 0;
        this.removeTracks();
      } else if ((elm.value == 'trackWithStems' || elm == 'trackWithStems' || this.producer == 'trackWithStems')) {
        this.rulesVal = 1;
        if(e.value === '1Track4Stems') {
          this.rules = e.viewValue;
        } else if(e.value === '10Track30Stems') {
          this.rules = e.viewValue;
        }
      }
    })
  }

  onCommentChange(e: any) {
    console.log(e)
  }

  cardRepeat() {
    return this.card!.style.width = '0vw';
  }

  cardAnimate(): void {
    this.card = document.getElementById('card');
    if (this.producer == 'trackNoStems') {
      this.cardRepeat();
      setTimeout((): void => {
        this.card!.style.height = '62px';
        this.card!.style.width = 'auto';
        this.card!.style.maxWidth = '65vw';
        this.card!.style.opacity = 1;
        this.card!.style.marginBottom = '2rem';
      }, 150);
    } else if (this.producer == 'trackWithStems') {
      this.cardRepeat();
      window.innerWidth < 2000 ? this.card!.style.width = '47.3vw' : this.card!.style.width = '23vw';
      this.card!.style.height = '150px';
      this.card!.style.maxWidth = '65vw';
      this.card!.style.opacity = 1;
      this.card!.style.marginBottom = '2rem';
    }

    if (this.producer == 'trackNoStems' || this.producer == 'trackWithStems') {
      console.log('producer: ', this.producer);
      console.log('selectOption: ', this.selectOption);
    }
  }

  optionSelect(event: any): void {
    let spanRules: any = document.getElementById('rules1');
    this.rulesTrackStems.forEach((e: any): void => {
      (e.value === '1Track4Stems' && (event === '1 Track com 4 stems' || this.selectOption === '1 Track com 4 stems')) ? (spanRules.innerText = e.viewValue) : this.removeTracks();
      (e.value === '10Track30Stems' && (event === '10 Tracks com 30 Stems' || this.selectOption === '10 Tracks com 30 Stems')) ? (spanRules.innerText = e.viewValue) : this.removeTracks();
    });
  }

  private loop(event: any, num: number): void {
    this.numero = num;
    let showFile = this.$$('.showFile');
    let arrayUpload: FileList = event.target.files;
    let div: any = `
        <div class='uploaded mt-4 w-100 d-flex justify-content-between align-items-center'>
          <div class='files d-flex justify-content-start align-items-center  h6 m-0'>
            <span class='material-icons'>music_note</span>
            <span class='uploaded-files pl-1'></span>
          </div>
          <div class='size d-flex justify-content-end align-items-center h6 m-0'>
            <span class='size-file pr-1'></span>
            <span class='material-icons'>done</span>
          </div>
        </div>`;

    if(arrayUpload.length > num) {
      this.snackBar.open(`A OPÇÃO QUE VOCÊ SELECIONOU PERMITE UM NÚMERO MÁXIMO DE ${num} UPLOADS!`, '', {duration: 20000});
      this.uploadFile();
    } else {
      showFile.innerHTML = div;
      let divPreview: any = this.$$('.uploaded');
      let previewFile = this.$$('.uploaded-files');
      let previewSize = this.$$('.size-file');
      let controlF: any = this.$$('#controlFile .uploaded.mt-4 .size.d-flex');
      let controlFMaterial: any = this.$$('#controlFile .uploaded.mt-4 .size.d-flex .material-icons');
      divPreview.style.display = 'flex';
      divPreview.style.padding = '20px 10px';
      divPreview.style.background = '#DDD';
      divPreview.style.borderRadius = '8px';
      controlF.style.color = '#4B3A8F';
      controlFMaterial.style.fontSize = '21px';
      for (let i: number = 0; i < arrayUpload.length; i++) {
        let fileItem: any = divPreview.cloneNode(true);
        (i > 0) ? showFile.append(fileItem) : null;
        let s: number = arrayUpload[i].size / 1000000;
        let size = s.toFixed(1);
        previewFile.innerText = arrayUpload[i].name;
        previewSize.innerText = size + 'MB';
      }
    }
  }


  files!: Set<File>;
  onChange(event: any) {
    console.log(event)
    document.querySelector('.btnSubmit')!.classList.add('hover');
    const selectedFiles: FileList = event.srcElement.files;
    console.log(selectedFiles);
    const fileNames: any[] = [];
    this.files = new Set();
    for(let i = 0; i < selectedFiles.length; i++) {
      fileNames.push(selectedFiles[i].name);
      this.files.add(selectedFiles[i]);
    }
    console.log(fileNames);
  }
  onUpload() {
    if (this.files && this.files.size > 0) {
      this.uploadFileService.upload(this.files, environment.API + 'uploads/').subscribe((data: any) => {
        console.log(data)
        console.log('"Upload CONCLUIDO"')
      })
    }
  }


  uploadFile(): void {
    let fileChooser = this.$$('.input-file');

    fileChooser.onchange = (e: any): void => {
      if (this.selectOption == '1 Track com 4 stems') {
        this.loop(e, 5);
      } else if (this.selectOption == '10 Tracks com 30 Stems') {
        this.loop(e, 40);
      } else if (this.producer == 'trackNoStems') {
        this.loop(e, 10);
      }
    };
  }
}
