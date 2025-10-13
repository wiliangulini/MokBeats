import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ScrollService} from "../service/scroll.service";
import {EMPTY} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MusicasService} from "../musicas/musicas.service";
import {UploadFileService} from "../upload-file/upload-file.service";
import { environment } from 'src/environments/environment';
import { SharedValidators } from '../shared/validators';

@Component({
  selector: 'app-produtores',
  templateUrl: './produtores.component.html',
  styleUrls: ['./produtores.component.scss']
})
export class ProdutoresComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('CWE') CWE: any;
  @ViewChild('card') cardElement?: ElementRef;
  @ViewChild('btnSubmit') submitButton?: ElementRef;

  form: FormGroup;
  rules: string = '';
  producer: string = '';
  // selectOption removido conforme novas regras
  checkBoxProducer: boolean = false;
  checked: boolean = false;
  numero: number = 0;
  // rulesVal removido
  card: any;
  $$: any;
  generoMusic: any[] = [];
  generos: string[] = [];
  subgeneros: string[] = [];
  humores: string[] = [];
  submitted: boolean = false;
  errorSummary: string[] = [];
  @ViewChild('errorSummaryRef') errorSummaryRef?: ElementRef;
  artistas: string[] = [];
  // Pré-visualização do WhatsApp normalizado
  whatsappPreview: string = '';
  typeStems: any[] = [
    { value: 'Druns', viewValue: 'Druns' },
    { value:  'Melodia', viewValue:  'Melodia' },
    { value: 'Harmonia', viewValue: 'Harmonia' },
    { value: 'Efeitos/Vozes', viewValue: 'Efeitos/Vozes' },
  ]
  valueTrack: Array<any> = [
    { value: 'trackNoStems', viewValue: 'Música sem Stems' },
    { value: 'trackWithStems', viewValue: 'Música com Stems' },
  ];
  // Registro
  registryTypes: Array<any> = [
    { value: 'ISRC', viewValue: 'ISRC' },
    { value: 'UPC', viewValue: 'UPC' },
    { value: 'HASH', viewValue: 'HASH' },
    { value: 'OUTROS', viewValue: 'OUTROS' },
  ];
  hashTypes: Array<any> = [
    { value: 'MD5', viewValue: 'MD5 (32 hex)' },
    { value: 'SHA-1', viewValue: 'SHA-1 (40 hex)' },
    { value: 'SHA-256', viewValue: 'SHA-256 (64 hex)' },
    { value: 'SHA-512', viewValue: 'SHA-512 (128 hex)' },
  ];
  registryPlaceholder: string = 'Digite o valor...';

  constructor(
    private snackBar: MatSnackBar,
    private scrollService: ScrollService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private musicService: MusicasService,
    private uploadFileService: UploadFileService,
    private host: ElementRef,
  ) {
    this.form = this.fb.group({
      track_stems: [this.producer, Validators.required],
      // selectOption removido
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      artista_banda: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      fonteAcesso: ['', Validators.required],
      upload: ['', Validators.required],
      politicaDePrivacidade: ['', Validators.required],
      genrePrimary: ['', Validators.required],
      genreSecondary: [''],
      mood: ['', Validators.required],
      stemsType: ['', Validators.required],
      isRemix: [false],
      remixProducer: [''],
      remixProducerOther: [''],
      textarea: ['', Validators.required],
      textarea1: ['', Validators.required],
      matCheckbox: ['', Validators.required],
      pepperoni: [false, Validators.required],
      extracheese: [false, Validators.required],
      mushroom: [false, Validators.required],
      checkBoxProducer: [this.checkBoxProducer, Validators.required],
      // Registro (ISRC/UPC obrigatórios)
      isrc: ['', [Validators.required, SharedValidators.isrc()]],
      upc: ['', [Validators.required, SharedValidators.upc()]],
      registryType: [''],
      registryValue: [''],
      hashType: [''],
      // Upload loops (um arquivo para cada)
      loop15: [null, Validators.required],
      loop30: [null, Validators.required],
      loop60: [null, Validators.required],
      // Redes Sociais
      facebookUrl: [''],
      instagramUrl: [''],
      whatsapp: [''],
      googleUrl: [''],
      linkedinUrl: [''],
      spotifyUrl: [''],
      otherUrl: [''],
    }, { validators: [SharedValidators.emailsMatch()] });
  }

  ngOnInit(): void {
    this.scrollService.scrollUp();
    this.$$ = document.querySelector.bind(document);
    // Carregar dados dinâmicos do backend
    this.musicService.getGeneros().subscribe((data: any) => {
      this.generos = data || [];
    });
    this.musicService.getHumores().subscribe((data: any) => {
      this.humores = data || [];
    });
    // Artistas para referenciar em caso de remix (opcional)
    this.musicService.getArtistas().subscribe((data: any) => {
      this.artistas = data || [];
    });
    // Atualizar subgêneros quando gênero primário mudar
    this.form.get('genrePrimary')?.valueChanges.subscribe((genero: string) => {
      this.onGenreChange(genero);
    });
    // Registro dinâmico
    this.form.get('registryType')?.valueChanges.subscribe((type: string) => {
      this.updateRegistryValidators(type, this.form.get('hashType')?.value);
    });
    this.form.get('hashType')?.valueChanges.subscribe((ht: string) => {
      if (this.form.get('registryType')?.value === 'HASH') {
        this.updateRegistryValidators('HASH', ht);
      }
    });
    // remix: quando selecionar "Outro", exigir texto
    this.form.get('remixProducer')?.valueChanges.subscribe((v: string) => {
      const otherCtrl = this.form.get('remixProducerOther');
      if (!otherCtrl) return;
      if (v === '__OUTRO__') {
        otherCtrl.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(80)]);
      } else {
        otherCtrl.clearValidators();
        otherCtrl.reset('');
      }
      otherCtrl.updateValueAndValidity();
    });

    // Atualiza prévia de WhatsApp normalizado
    this.form.get('whatsapp')?.valueChanges.subscribe((v: string) => {
      const digits = (v || '').replace(/\D+/g, '');
      this.whatsappPreview = digits ? `https://wa.me/${digits}` : '';
    });
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

    // Ajustes de estilo do Material
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

  onGenreChange(genero: string): void {
    if (!genero) {
      this.subgeneros = [];
      this.form.get('genreSecondary')?.reset('');
      return;
    }
    this.musicService.getSubgeneros(genero).subscribe((subs: any) => {
      this.subgeneros = subs || [];
      const current = this.form.get('genreSecondary')?.value;
      if (current && !this.subgeneros.includes(current)) {
        this.form.get('genreSecondary')?.reset('');
      }
    });
  }

  // Método removeTracks() removido - não mais necessário com o novo componente de upload

  markCheckbox(e: any) {
    console.log(this.checkBoxProducer);
    if(e.target.checked == undefined) {
      this.checkBoxProducer ? this.checkBoxProducer = false : this.checkBoxProducer = true;
    }
    if (e.target.checked == true) {
      this.checkBoxProducer = true;
      // Usar ViewChild seria ideal, mas mantendo funcionalidade por enquanto
      const btn = document.getElementById('btn');
      const link = document.querySelector('a.m-0.p-0') as HTMLElement;
      const collapse = document.getElementById('collapseWidthExample');
      
      btn?.classList.add('top');
      link?.classList.add('top');
      collapse?.classList.add('comboFlex');
    } else if (e.target.checked == false) {
      this.checkBoxProducer = false;
    }
    console.log(this.checkBoxProducer);
    console.log(e.target.checked);
  }

  changeTrack(elm: any): void {
    (elm.value == 'trackWithStems' || elm == 'trackWithStems' || this.producer == 'trackWithStems' || elm.value == 'trackNoStems' || elm == 'trackNoStems' || this.producer == 'trackNoStems') ? this.CWE.nativeElement.style.display = 'inline-grid' : EMPTY;

    const val = elm?.value || elm || this.producer;
    if (val === 'trackWithStems') {
      this.rules = 'Nesta opção você poderá enviar 1 música completa + 1 a 4 stems. Todos os stems precisam ter a mesma duração da música completa.';
    } else if (val === 'trackNoStems') {
      this.rules = 'Nesta opção você poderá enviar somente 1 música completa (sem stems).';
      // removeTracks() não mais necessário - o componente de upload gerencia isso automaticamente
    }
    this.cardAnimate();
  }

  onCommentChange(e: any) {
    console.log(e)
  }

  cardRepeat() {
    return this.card!.style.width = '0vw';
  }

  cardAnimate(): void {
    // Usar ViewChild se disponível, senão fallback para getElementById
    const cardEl = this.cardElement?.nativeElement || document.getElementById('card');
    this.card = cardEl;
    
    if (this.producer == 'trackNoStems') {
      this.cardRepeat();
      setTimeout((): void => {
        if (cardEl) {
          cardEl.style.height = '62px';
          cardEl.style.width = 'auto';
          cardEl.style.maxWidth = '65vw';
          cardEl.style.opacity = '1';
          cardEl.style.marginBottom = '2rem';
        }
      }, 150);
    } else if (this.producer == 'trackWithStems') {
      this.cardRepeat();
      if (cardEl) {
        cardEl.style.width = 'auto';
        cardEl.style.height = 'auto';
        cardEl.style.maxWidth = '65vw';
        cardEl.style.opacity = '1';
        cardEl.style.marginBottom = '2rem';
      }
    }
  }

  // Métodos loop(), uploadFile() e onLoopFileChange() removidos - substituídos pelo componente custom-file-upload


  files!: Set<File>;

  onMainFilesSelected(fileList: FileList): void {
    console.log('Arquivos selecionados:', fileList);
    // Usar ViewChild se disponível, senão fallback para querySelector
    const submitBtn = this.submitButton?.nativeElement || document.querySelector('.btnSubmit');
    submitBtn?.classList.add('hover');

    const fileNames: any[] = [];
    this.files = new Set();
    for(let i = 0; i < fileList.length; i++) {
      fileNames.push(fileList[i].name);
      this.files.add(fileList[i]);
    }
    console.log('Nomes dos arquivos:', fileNames);
    this.form.get('upload')?.markAsTouched();
  }
  onUpload() {
    this.submitted = true;
    this.errorSummary = [];
    this.form.markAllAsTouched();
    // Verificações de form e quantidades de arquivos
    if (this.form.invalid) {
      this.buildErrorSummary();
      this.snackBar.open('Corrija os erros destacados antes de enviar.', '', { duration: 5000 });
      setTimeout(() => this.scrollToErrorSummary(), 0);
      setTimeout(() => this.focusFirstInvalidControl(), 0);
      return;
    }

    // Monta FormData para a rota de produtores com regras
    const fd = new FormData();
    // Modo (sem stems ou com stems)
    const mode = this.producer === 'trackWithStems' ? 'trackWithStems' : 'trackNoStems';
    fd.append('mode', mode);
    // Arquivos principais: assumimos primeiro arquivo como track e demais como stems quando applicable
    if (this.files && this.files.size > 0) {
      const arr = Array.from(this.files);
      // Regras de contagem
      if (mode === 'trackNoStems' && arr.length !== 1) {
        this.errorSummary.push('Modo sem stems: selecione exatamente 1 arquivo de música.');
      }
      if (mode === 'trackWithStems' && (arr.length < 2 || arr.length > 5)) {
        this.errorSummary.push('Modo com stems: selecione 1 música + 1 a 4 stems (total até 5 arquivos).');
      }
      if (this.errorSummary.length) {
        this.snackBar.open(this.errorSummary[0], '', { duration: 5000 });
        setTimeout(() => this.scrollToErrorSummary(), 0);
        setTimeout(() => this.focusFirstInvalidControl(), 0);
        return;
      }
      if (arr.length > 0) {
        fd.append('track', arr[0]);
        for (let i = 1; i < arr.length; i++) {
          fd.append('stem', arr[i]);
        }
      }
    }
    // Loops
    const l15 = this.form.get('loop15')?.value; if (l15) fd.append('loop15', l15);
    const l30 = this.form.get('loop30')?.value; if (l30) fd.append('loop30', l30);
    const l60 = this.form.get('loop60')?.value; if (l60) fd.append('loop60', l60);
    this.buildDurations().then((durations) => {
      const selectedRemix = this.form.get('remixProducer')?.value;
      const remixOther = this.form.get('remixProducerOther')?.value;
      const remixFinal = selectedRemix === '__OUTRO__' ? (remixOther || null) : (selectedRemix || null);
      const social = this.buildSocial();
      const meta: any = {
        genre: this.form.get('genrePrimary')?.value,
        subgenre: this.form.get('genreSecondary')?.value,
        mood: this.form.get('mood')?.value,
        isRemix: !!this.form.get('isRemix')?.value,
        remixProducer: remixFinal,
        isrc: this.form.get('isrc')?.value,
        upc: this.form.get('upc')?.value,
        registryType: this.form.get('registryType')?.value,
        registryValue: this.form.get('registryValue')?.value,
        hashType: this.form.get('hashType')?.value,
        durations,
        social,
      };
      fd.append('meta', JSON.stringify(meta));
      this.uploadFileService.uploadProducerTrack(fd).subscribe((resp) => {
        console.log('Upload Produtor:', resp);
        this.snackBar.open('Upload enviado!', '', { duration: 4000 });
      }, (err) => {
        console.error(err);
        this.snackBar.open(`Erro no upload: ${err?.error?.message || 'verifique os arquivos.'}`, '', { duration: 6000 });
      });
    }).catch((e) => {
      console.error(e);
      this.snackBar.open('Não foi possível calcular as durações dos áudios.', '', { duration: 6000 });
    });
  }

  // Atualiza validações e placeholder do campo de registro dinâmico
  private updateRegistryValidators(type: string, hashType?: string) {
    const ctrl = this.form.get('registryValue');
    if (!ctrl) return;
    ctrl.clearValidators();
    
    this.registryPlaceholder = SharedValidators.getRegistryPlaceholder(type, hashType);
    
    const validators: any[] = [];
    const pattern = SharedValidators.getRegistryPattern(type, hashType);
    if (pattern) {
      if (type === 'HASH' && hashType) {
        validators.push(SharedValidators.hash(hashType));
      } else {
        validators.push(Validators.pattern(pattern));
      }
    }
    
    ctrl.setValidators(validators);
    ctrl.updateValueAndValidity();
  }

  // onLoopFileChange() removido - agora é gerenciado pelo componente custom-file-upload via ControlValueAccessor

  private getFileDurationMs(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        const audio = document.createElement('audio');
        audio.preload = 'metadata';
        audio.onloadedmetadata = () => {
          const d = Math.round((audio.duration || 0) * 1000);
          URL.revokeObjectURL(audio.src);
          resolve(d);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audio.src);
          reject(new Error('Falha ao carregar metadados do áudio.'));
        };
        audio.src = URL.createObjectURL(file);
      } catch (err) {
        reject(err);
      }
    });
  }

  private async buildDurations(): Promise<any> {
    const result: any = {};
    const arr = this.files ? Array.from(this.files) : [];
    if (arr.length > 0) {
      result.track_ms = await this.getFileDurationMs(arr[0]);
      const stems: number[] = [];
      for (let i = 1; i < arr.length; i++) {
        stems.push(await this.getFileDurationMs(arr[i]));
      }
      if (stems.length) result.stems_ms = stems;
    }
    const l15 = this.form.get('loop15')?.value; if (l15) result.loop15_ms = await this.getFileDurationMs(l15);
    const l30 = this.form.get('loop30')?.value; if (l30) result.loop30_ms = await this.getFileDurationMs(l30);
    const l60 = this.form.get('loop60')?.value; if (l60) result.loop60_ms = await this.getFileDurationMs(l60);
    return result;
  }

  // Normaliza redes sociais e WhatsApp (E.164 simples: dígitos somente)
  private buildSocial() {
    const get = (k: string) => (this.form.get(k)?.value || '').trim();
    const rawWa = get('whatsapp');
    const digits = (rawWa || '').replace(/\D+/g, '');
    const whatsapp_e164 = digits || null;
    const whatsapp_wa = digits ? `https://wa.me/${digits}` : null;
    return {
      facebook: get('facebookUrl') || null,
      instagram: get('instagramUrl') || null,
      google: get('googleUrl') || null,
      linkedin: get('linkedinUrl') || null,
      spotify: get('spotifyUrl') || null,
      other: get('otherUrl') || null,
      whatsapp_e164,
      whatsapp_wa,
    };
  }

  private buildErrorSummary() {
    const msgs: string[] = [];
    const f = this.form;

    if (f.get('nome')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Nome'));
    if (f.get('sobrenome')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Sobrenome'));
    if (f.get('artista_banda')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Artista/Banda'));

    if (f.get('email')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('E-mail'));
    else if (f.get('email')?.hasError('email')) msgs.push(SharedValidators.getInvalidEmailMessage('E-mail'));

    if (f.get('confirmEmail')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Confirmação de e-mail'));
    else if (f.get('confirmEmail')?.hasError('email')) msgs.push(SharedValidators.getInvalidEmailMessage('Confirmação de e-mail'));
    if (f.hasError('emailsMismatch')) msgs.push('Os e-mails não coincidem.');

    if (f.get('fonteAcesso')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Como você ficou sabendo sobre nós?'));

    if (f.get('genrePrimary')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Gênero primário'));
    if (f.get('stemsType')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Tipo de stem'));
    if (f.get('mood')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Humor'));

    if (f.get('isrc')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('ISRC'));
    else if (f.get('isrc')?.hasError('isrc')) msgs.push(SharedValidators.getErrorMessage(f.get('isrc'), 'isrc') || 'ISRC inválido.');

    if (f.get('upc')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('UPC'));
    else if (f.get('upc')?.hasError('upc')) msgs.push(SharedValidators.getErrorMessage(f.get('upc'), 'upc') || 'UPC inválido.');

    // Registry value errors - usar mensagem customizada dos validators compartilhados
    const registryCtrl = f.get('registryValue');
    if (registryCtrl?.hasError('hash')) msgs.push(SharedValidators.getErrorMessage(registryCtrl, 'hash') || 'Valor do registro adicional inválido.');
    else if (registryCtrl?.hasError('pattern')) msgs.push('Valor do registro adicional inválido.');
    
    if (f.get('remixProducer')?.value === '__OUTRO__') {
      if (f.get('remixProducerOther')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Nome do Produtor (Outro)'));
      else if (f.get('remixProducerOther')?.hasError('minlength')) msgs.push('Nome do Produtor (Outro): mínimo de 3 caracteres.');
      else if (f.get('remixProducerOther')?.hasError('maxlength')) msgs.push('Nome do Produtor (Outro): máximo de 80 caracteres.');
    }

    if (f.get('textarea')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Tags'));
    if (f.get('textarea1')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Descrição da música'));

    if (f.get('loop15')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Loop 15s'));
    if (f.get('loop30')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Loop 30s'));
    if (f.get('loop60')?.hasError('required')) msgs.push(SharedValidators.getRequiredMessage('Loop 60s'));

    if (f.get('politicaDePrivacidade')?.hasError('required')) msgs.push('É obrigatório aceitar a Política de Privacidade.');

    this.errorSummary = Array.from(new Set(msgs));
  }

  private scrollToErrorSummary() {
    try {
      if (this.errorSummaryRef?.nativeElement) {
        this.errorSummaryRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scroll({ top: 0, behavior: 'smooth' as ScrollBehavior });
      }
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }

  private focusFirstInvalidControl() {
    try {
      const root: HTMLElement = this.host?.nativeElement as HTMLElement;
      if (!root) return;
      const selector = 'form .ng-invalid[formcontrolname], form .ng-invalid input, form .ng-invalid textarea';
      const invalid = root.querySelector(selector) as HTMLElement | null;
      if (invalid) {
        if (typeof (invalid as any).focus === 'function') {
          (invalid as any).focus();
        } else {
          const inner = invalid.querySelector('input,textarea') as HTMLElement | null;
          if (inner && typeof (inner as any).focus === 'function') {
            (inner as any).focus();
          }
        }
      }
    } catch (e) {}
  }
  // uploadFile() removido - não mais necessário com o componente custom-file-upload
}
