import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, HostListener,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ScrollService} from "../service/scroll.service";
import {empty} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MusicasService} from "../musicas/musicas.service";

@Component({
  selector: 'app-produtores',
  templateUrl: './produtores.component.html',
  styleUrls: ['./produtores.component.scss']
})
export class ProdutoresComponent implements OnInit, AfterViewInit, AfterViewChecked {

  form: FormGroup;

  @ViewChild('CWE') CWE: any;



  rules: string = '';
  producer: string = '';
  selectOption: string = '';
  rulesVal: any;
  numero: number = 0;
  card: any;
  typeStems: any[] = [
    { value: 'Druns', viewValue: 'Druns' },
    { value:  'Melodia', viewValue:  'Melodia' },
    { value: 'Harmonia', viewValue: 'Harmonia' },
    { value: 'Efeitos/Vozes', viewValue: 'Efeitos/Vozes' },
  ]
  $$: any
  generoMusic: any[] = [];
  valueTrack: Array<any> = [
    {value: 'trackNoStems', viewValue: 'Track sem Stems'},
    {value: 'trackWithStems', viewValue: 'Track com Stems'},
  ]
  oneOrAlbum: Array<any> = [
    {value: '1 Track com 4 stems', viewValue: '1 Track com 4 stems'},
    {value: '10 Tracks com 30 Stems', viewValue: '10 Tracks com 30 Stems'},
  ]
  rulesTrackStems: Array<any> = [
    {value: '10Tracks', viewValue: 'Nesta opção você produtor poderá fazer upload de até dez tracks sem stems.'},
    {
      value: '1Track4Stems',
      viewValue: 'Nesta opção você produtor poderá fazer upload de uma track completa com mais quatro stems, totalizando em cinco uploads.'
    },
    { value: '10Track30Stems', viewValue: 'Nesta opção você produtor poderá fazer upload de até dez tracks completas com mais trinta stems ( no caso quatro stems por track ), totalizando em quarenta uploads.' },
  ];
  checkBoxProducer: boolean = false;
  checked = false;

  constructor(
    private snackBar: MatSnackBar,
    private scrollService: ScrollService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private musicService: MusicasService,
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
    let matForm: any = document.querySelector('.mat-form-field-wrapper.ng-tns-c178-4');
    let matFormInt: any = document.querySelector('.mat-form-field-infix.ng-tns-c178-4');
    let matFormInt1: any = document.querySelector('.mat-form-field-flex.ng-tns-c178-4');
    matForm!.style.width = '100%';
    matForm!.style.height = '100%';
    matFormInt!.style.width = '100%';
    matFormInt!.style.height = '100%';
    matFormInt1!.style.width = '100%';
    matFormInt1!.style.height = '100%';
    this.$$ = document.querySelector.bind(document);
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.generoMusic = this.musicService.convertida2;
    this.uploadFile();
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
    } else if (e.target.checked == false) {
      this.checkBoxProducer = false;
    }
    console.log(this.checkBoxProducer);
    console.log(e.target.checked);
  }

  changeTrack(elm: any): void {
    (elm.value == 'trackWithStems' || elm == 'trackWithStems' || elm.value == 'trackNoStems' || elm == 'trackNoStems') ? this.CWE.nativeElement.style.display = 'inline-grid' : empty();

    this.cardAnimate();
    this.rulesTrackStems.forEach((e: any, i: number): void => {
      if (e.value === '10Tracks' && (elm.value == 'trackNoStems' || elm == 'trackNoStems')) {
        this.rules = e.viewValue;
        this.rulesVal = i;
        this.removeTracks();
      } else if (e.value === '1Track4Stems' && (elm.value == 'trackWithStems' || elm == 'trackWithStems')) {
        this.rules = e.viewValue;
        this.rulesVal = i;
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
      console.log(this.card.getAttribute('style'));
      this.cardRepeat();
      setTimeout((): void => {
        this.card!.style.height = '62px';
        this.card!.style.width = 'auto';
        this.card!.style.maxWidth = '65vw';
        this.card!.style.opacity = 1;
        this.card!.style.marginBottom = '2rem';
        console.log(this.card.getAttribute('style'));
      }, 150);
    } else if (this.producer == 'trackWithStems') {
      console.log(this.card.getAttribute('style'));
      this.cardRepeat();
      window.innerWidth < 2000 ? this.card!.style.width = '47.3vw' : this.card!.style.width = '23vw';
      this.card!.style.height = '150px';
      this.card!.style.maxWidth = '65vw';
      this.card!.style.opacity = 1;
      this.card!.style.marginBottom = '2rem';
      setTimeout((): void => {

        console.log(this.card.getAttribute('style'));
      }, 150);
    }

    if (this.producer == 'trackNoStems' || this.producer == 'trackWithStems') {

    }
  }

  optionSelect(event: any): void {
    let spanRules: any = document.getElementById('rules1');
    this.rulesTrackStems.forEach((e: any): void => {
      (e.value === '1Track4Stems' && event === '1 Track com 4 stems') ? (spanRules.innerText = e.viewValue) : this.removeTracks();
      (e.value === '10Track30Stems' && event === '10 Tracks com 30 Stems') ? (spanRules.innerText = e.viewValue) : this.removeTracks();
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
    console.log(arrayUpload);
    console.log(num);
    if(arrayUpload.length > num) {
      this.snackBar.open(`A OPÇÃO QUE VOCÊ SELECIONOU PERMITE UM NÚMERO MÁXIMO DE ${num} UPLOADS!`, '', {duration: 5000});
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
