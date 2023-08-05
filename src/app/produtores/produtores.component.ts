import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ScrollService} from "../service/scroll.service";
import {empty} from "rxjs";


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

  oneOrAlbum: Array<any> = [
    {value: '1 Track com 4 stems', viewValue: '1 Track com 4 stems'},
    {value: '10 Tracks com 30 stems', viewValue: '10 Tracks com 30 stems'},
  ]
  valueTrack: Array<any> = [
    {value: 'trackNoStems', viewValue: 'Track sem Stems'},
    {value: 'trackWithStems', viewValue: 'Track com Stems'},
  ]
  rulesTrackStems: Array<any> = [
    {value: '10Tracks', viewValue: 'Nesta opção você produtor poderá fazer upload de até dez tracks sem stems.'},
    {
      value: '5Tracks',
      viewValue: 'Nesta opção você produtor poderá fazer upload de uma track completa com mais quatro stems, totalizando em cinco uploads.'
    },
    { value: '10Track30Stems', viewValue: 'Nesta opção você produtor poderá fazer upload de até dez tracks completas com mais trinta stems ( no caso quatro stems por track ), totalizando em quarenta uploads.' },
  ];


  constructor(
    private scrollService: ScrollService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      track_stems: this.producer,
      selectOption: this.selectOption,
      nome: [],
      sobrenome: [],
      artista_banda: [],
      estilo_musical: [],
      email: [],
      confirmEmail: [],
      fonteAcesso: [],
      upload: [],
      politicaDePrivacidade: [],
    });
  }

  ngOnInit(): void {
    this.scrollService.scrollUp();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngAfterViewInit(): void {
    this.uploadFile();
  }

  changeTrack(elm: any): void {
    (elm.value == 'trackWithStems' || elm == 'trackWithStems' || elm.value == 'trackNoStems' || elm == 'trackNoStems') ? this.CWE.nativeElement.style.display = 'inline-grid' : empty();
    let card: any;
    this.rulesTrackStems.forEach((e: any, i: number): void => {
      if (e.value === '10Tracks' && (elm.value == 'trackNoStems' || elm == 'trackNoStems')) {
        card = document.getElementById('card');
        card.style.height = '62px';
        card.style.width = 'auto';
        this.rules = e.viewValue;
        this.rulesVal = i;
      } else if (e.value === '5Tracks' && (elm.value == 'trackWithStems' || elm == 'trackWithStems')) {
        card = document.getElementById('card');
        card.style.height = '150px';
        this.rules = e.viewValue;
        this.rulesVal = i;
      }
    })

  }

  optionSelect(event: string): void {
    let spanRules: any = document.getElementById('rules1');
    this.rulesTrackStems.forEach((e: any): void => {
      if (e.value === '10Track30Stems' && event === '10 Tracks com 30 stems') {
        spanRules.innerText = e.viewValue;
      } else if (e.value === '5Tracks' && event === '1 Track com 4 stems') {
        spanRules.innerText = e.viewValue;
      }
    });
  }

  uploadFile(): void {
    const $: any = document.querySelector.bind(document);

    let previewFile = $('.uploaded-files');
    let divPreview = $('.uploaded');
    let showFile = $('.showFile');
    let previewSize = $('.size-file');
    let fileChooser = $('.input-file');

    fileChooser.onchange = (e: any) => {
      console.log(e);
      divPreview.style.display = 'flex';
      let arrayUpload: FileList = e.target.files;

      for (let i: number = 0; i < arrayUpload.length; i++) {

        let fileItem: any = divPreview.cloneNode(true);
        i > 0 ? showFile.append(fileItem) : console.log(fileItem);
        let s: number = arrayUpload[i].size / 1000000;
        let size = s.toFixed(1);
        previewFile.innerText = arrayUpload[i].name;
        previewSize.innerText = size + 'MB';
      }
    };
  }
}
