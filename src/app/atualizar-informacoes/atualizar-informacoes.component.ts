import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SharedValidators } from '../shared/validators';
import { UserProfileService } from '../service/user-profile.service';
import { DocumentTipo, UserProfile } from '../models/user-profile.model';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

@Component({
    selector: 'app-atualizar-informacoes',
    templateUrl: './atualizar-informacoes.component.html',
    styleUrls: ['./atualizar-informacoes.component.scss'],
    standalone: false
})
export class AtualizarInformacoesComponent implements OnInit, OnDestroy {

  form: FormGroup;
  formSenha: FormGroup;
  submitted = false;
  submittedSenha = false;
  errorSummary: string[] = [];
  errorSummarySenha: string[] = [];
  savingProfile = false;
  savingPassword = false;
  senhaAberta = false;

  // Arquivos de upload (gerenciados fora do FormGroup)
  fotoDocumentoFile: File | null = null;
  comprovanteFile: File | null = null;
  docEmpresaFile: File | null = null;
  uploadErrors: { foto?: string; comprovante?: string; docEmpresa?: string } = {};

  tiposEmpresaExt = ['LLC', 'C-Corp', 'S-Corp', 'Holding', 'Trust', 'Outros'];

  @ViewChild('errorSummaryRef') errorSummaryRef?: ElementRef;
  @ViewChild('errorSummarySenhaRef') errorSummarySenhaRef?: ElementRef;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private host: ElementRef,
    private snackBar: MatSnackBar,
    public profileService: UserProfileService,
  ) {
    this.form = this.fb.group({
      nomeCompleto:      ['', [Validators.required, Validators.minLength(3)]],
      tipoDocumento:     ['cpf', Validators.required],
      cpf:               [''],
      passaporte:        [''],
      dataNascimento:    ['', [Validators.required, SharedValidators.birthDate()]],
      paisOrigem:        ['', Validators.required],
      telefone:          ['', [Validators.required, SharedValidators.phoneWithDDD()]],
      email:             ['', [Validators.required, Validators.email]],
      endereco:          ['', Validators.required],
      cidade:            ['', Validators.required],
      estado:            [''],
      cep:               [''],
      tipoConta:         ['none', Validators.required],
      nomeEmpresaBR:     [''],
      cnpj:              [''],
      nomeEmpresaExt:    [''],
      tipoEmpresaExt:    [''],
      tipoEmpresaOutros: [''],
    });

    this.formSenha = this.fb.group({
      senhaAtual:      ['', Validators.required],
      novaSenha:       ['', [Validators.required, SharedValidators.passwordComplexity()]],
      confirmarSenha:  ['', Validators.required],
    }, { validators: SharedValidators.passwordsMatch('novaSenha', 'confirmarSenha') });
  }

  ngOnInit(): void {
    this.updateConditionalValidators();

    this.form.get('tipoDocumento')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateConditionalValidators());

    this.form.get('paisOrigem')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateConditionalValidators());

    this.form.get('tipoConta')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateConditionalValidators());

    this.form.get('tipoEmpresaExt')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateConditionalValidators());

    // Carregar dados existentes do perfil
    this.profileService.getProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => {
        if (profile && Object.keys(profile).length) {
          this.patchForm(profile);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isBrasil(): boolean {
    return (this.form.get('paisOrigem')?.value ?? '').toLowerCase().trim() === 'brasil';
  }

  get tipoConta(): string {
    return this.form.get('tipoConta')?.value ?? 'none';
  }

  get tipoDocumento(): string {
    return this.form.get('tipoDocumento')?.value ?? 'cpf';
  }

  get tipoEmpresaExt(): string {
    return this.form.get('tipoEmpresaExt')?.value ?? '';
  }

  private patchForm(profile: Partial<UserProfile>): void {
    const fields: (keyof UserProfile)[] = [
      'nomeCompleto', 'tipoDocumento', 'cpf', 'passaporte', 'dataNascimento',
      'paisOrigem', 'telefone', 'email', 'endereco', 'cidade', 'estado', 'cep',
      'tipoConta', 'nomeEmpresaBR', 'cnpj', 'nomeEmpresaExt', 'tipoEmpresaExt', 'tipoEmpresaOutros',
    ];
    const patch: any = {};
    fields.forEach(f => { if (profile[f] !== undefined) patch[f] = profile[f]; });
    this.form.patchValue(patch, { emitEvent: false });
    this.updateConditionalValidators();
  }

  private updateConditionalValidators(): void {
    const tipoDoc = this.tipoDocumento;
    const pais = (this.form.get('paisOrigem')?.value ?? '').toLowerCase().trim();
    const conta = this.tipoConta;
    const tipoEmpresa = this.tipoEmpresaExt;

    // CPF vs Passaporte
    if (tipoDoc === 'cpf') {
      this.form.get('cpf')!.setValidators([Validators.required, SharedValidators.cpf()]);
      this.form.get('passaporte')!.clearValidators();
      this.form.get('passaporte')!.setValue('', { emitEvent: false });
    } else {
      this.form.get('passaporte')!.setValidators([Validators.required, SharedValidators.passport()]);
      this.form.get('cpf')!.clearValidators();
      this.form.get('cpf')!.setValue('', { emitEvent: false });
    }

    // Estado / CEP — só Brasil
    if (pais === 'brasil') {
      this.form.get('estado')!.setValidators(Validators.required);
      this.form.get('cep')!.setValidators([Validators.required, Validators.pattern(/^\d{8}$/)]);
    } else {
      this.form.get('estado')!.clearValidators();
      this.form.get('cep')!.clearValidators();
    }

    // Conta Jurídica BR
    if (conta === 'br') {
      this.form.get('nomeEmpresaBR')!.setValidators(Validators.required);
      this.form.get('cnpj')!.setValidators([Validators.required, SharedValidators.cnpj()]);
    } else {
      this.form.get('nomeEmpresaBR')!.clearValidators();
      this.form.get('cnpj')!.clearValidators();
      if (conta !== 'br') {
        this.form.get('nomeEmpresaBR')!.setValue('', { emitEvent: false });
        this.form.get('cnpj')!.setValue('', { emitEvent: false });
      }
    }

    // Conta Jurídica Estrangeira
    if (conta === 'foreign') {
      this.form.get('nomeEmpresaExt')!.setValidators(Validators.required);
      this.form.get('tipoEmpresaExt')!.setValidators(Validators.required);
    } else {
      this.form.get('nomeEmpresaExt')!.clearValidators();
      this.form.get('tipoEmpresaExt')!.clearValidators();
      if (conta !== 'foreign') {
        this.form.get('nomeEmpresaExt')!.setValue('', { emitEvent: false });
        this.form.get('tipoEmpresaExt')!.setValue('', { emitEvent: false });
        this.form.get('tipoEmpresaOutros')!.setValue('', { emitEvent: false });
      }
    }

    // Tipo empresa "Outros"
    if (conta === 'foreign' && tipoEmpresa === 'Outros') {
      this.form.get('tipoEmpresaOutros')!.setValidators(Validators.required);
    } else {
      this.form.get('tipoEmpresaOutros')!.clearValidators();
    }

    // Atualizar todos os estados
    ['cpf', 'passaporte', 'estado', 'cep', 'nomeEmpresaBR', 'cnpj',
     'nomeEmpresaExt', 'tipoEmpresaExt', 'tipoEmpresaOutros'].forEach(name => {
      this.form.get(name)!.updateValueAndValidity({ emitEvent: false });
    });
  }

  // ─── Handlers de upload ───────────────────────────────────────────────────

  onFotoDocumentoSelected(files: FileList): void {
    const file = files?.[0];
    if (!file) return;
    const err = this.validateFile(file);
    if (err) { this.uploadErrors.foto = err; this.fotoDocumentoFile = null; return; }
    this.uploadErrors.foto = undefined;
    this.fotoDocumentoFile = file;
  }

  onComprovanteSelected(files: FileList): void {
    const file = files?.[0];
    if (!file) return;
    const err = this.validateFile(file);
    if (err) { this.uploadErrors.comprovante = err; this.comprovanteFile = null; return; }
    this.uploadErrors.comprovante = undefined;
    this.comprovanteFile = file;
  }

  onDocEmpresaSelected(files: FileList): void {
    const file = files?.[0];
    if (!file) return;
    const err = this.validateFile(file);
    if (err) { this.uploadErrors.docEmpresa = err; this.docEmpresaFile = null; return; }
    this.uploadErrors.docEmpresa = undefined;
    this.docEmpresaFile = file;
  }

  private validateFile(file: File): string | null {
    if (!ALLOWED_MIME.includes(file.type)) {
      return 'Tipo de arquivo não permitido. Use JPG, PNG ou PDF.';
    }
    if (file.size > MAX_FILE_BYTES) {
      return 'O arquivo excede o tamanho máximo de 10MB.';
    }
    return null;
  }

  private uploadPendingFiles(uploadsNeeded: { file: File; tipo: DocumentTipo }[]): Promise<void> {
    if (!uploadsNeeded.length) return Promise.resolve();
    return new Promise((resolve, reject) => {
      let remaining = uploadsNeeded.length;
      uploadsNeeded.forEach(({ file, tipo }) => {
        this.profileService.uploadDocument(file, tipo).subscribe({
          next: () => { if (--remaining === 0) resolve(); },
          error: (err) => reject(err),
        });
      });
    });
  }

  // ─── Submit dados pessoais ────────────────────────────────────────────────

  onSubmit(): void {
    this.submitted = true;
    this.errorSummary = [];
    this.form.markAllAsTouched();

    // Validar uploads obrigatórios
    const snapshot = this.profileService.getSnapshot();
    const jaTemFoto = !!snapshot?.fotoDocumentoUrl;
    const jaTemComprovante = !!snapshot?.comprovanteResidenciaUrl;
    const jaTemDocEmpresa = !!snapshot?.documentoEmpresaUrl;
    const precisaDocEmpresa = this.tipoConta !== 'none';

    if (!jaTemFoto && !this.fotoDocumentoFile) {
      this.errorSummary.push('Foto segurando documento é obrigatória.');
    }
    if (!jaTemComprovante && !this.comprovanteFile) {
      this.errorSummary.push('Comprovante de residência é obrigatório.');
    }
    if (precisaDocEmpresa && !jaTemDocEmpresa && !this.docEmpresaFile) {
      this.errorSummary.push('Documento da empresa é obrigatório para conta jurídica.');
    }

    if (this.form.invalid) {
      this.buildErrorSummary();
      setTimeout(() => this.scrollToErrorSummary(), 0);
      setTimeout(() => this.focusFirstInvalidControl(), 0);
      return;
    }
    if (this.errorSummary.length) {
      setTimeout(() => this.scrollToErrorSummary(), 0);
      return;
    }

    this.savingProfile = true;
    const profileData: Partial<UserProfile> = this.form.value;

    const uploadsNeeded: { file: File; tipo: DocumentTipo }[] = [];
    if (this.fotoDocumentoFile) uploadsNeeded.push({ file: this.fotoDocumentoFile, tipo: 'foto-documento' });
    if (this.comprovanteFile) uploadsNeeded.push({ file: this.comprovanteFile, tipo: 'comprovante-residencia' });
    if (this.docEmpresaFile) uploadsNeeded.push({ file: this.docEmpresaFile, tipo: 'documento-empresa' });

    this.uploadPendingFiles(uploadsNeeded)
      .then(() => {
        this.profileService.saveProfile(profileData).subscribe({
          next: () => {
            this.savingProfile = false;
            this.snackBar.open('Dados pessoais salvos com sucesso!', '', { duration: 4000 });
          },
          error: () => {
            this.savingProfile = false;
            this.snackBar.open('Erro ao salvar dados. Tente novamente.', '', { duration: 5000 });
          }
        });
      })
      .catch(() => {
        this.savingProfile = false;
        this.snackBar.open('Erro ao enviar documentos. Tente novamente.', '', { duration: 5000 });
      });
  }

  // ─── Submit alterar senha ─────────────────────────────────────────────────

  onSubmitSenha(): void {
    this.submittedSenha = true;
    this.errorSummarySenha = [];
    this.formSenha.markAllAsTouched();

    if (this.formSenha.invalid) {
      this.buildErrorSummarySenha();
      setTimeout(() => {
        if (this.errorSummarySenhaRef?.nativeElement) {
          this.errorSummarySenhaRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
      return;
    }

    this.savingPassword = true;
    // TODO: conectar ao endpoint POST /api/user/password quando backend estiver pronto
    // this.http.post(`${environment.apiBaseUrl}/user/password`, this.formSenha.value, ...).subscribe(...)
    setTimeout(() => {
      this.savingPassword = false;
      this.formSenha.reset();
      this.submittedSenha = false;
      this.snackBar.open('Senha alterada com sucesso!', '', { duration: 4000 });
    }, 500);
  }

  // ─── Error summary ────────────────────────────────────────────────────────

  private buildErrorSummary(): void {
    const f = this.form;
    const req = (label: string) => `${label} é obrigatório.`;
    const invalid = (label: string) => `${label} inválido.`;

    if (f.get('nomeCompleto')?.hasError('required')) this.errorSummary.push(req('Nome completo'));
    if (f.get('nomeCompleto')?.hasError('minlength')) this.errorSummary.push('Nome completo deve ter pelo menos 3 caracteres.');

    if (this.tipoDocumento === 'cpf') {
      if (f.get('cpf')?.hasError('required')) this.errorSummary.push(req('CPF'));
      if (f.get('cpf')?.hasError('cpf')) this.errorSummary.push(invalid('CPF'));
    } else {
      if (f.get('passaporte')?.hasError('required')) this.errorSummary.push(req('Passaporte'));
      if (f.get('passaporte')?.hasError('passport')) this.errorSummary.push(invalid('Passaporte'));
    }

    if (f.get('dataNascimento')?.hasError('required')) this.errorSummary.push(req('Data de nascimento'));
    if (f.get('dataNascimento')?.hasError('birthDate')) {
      this.errorSummary.push(f.get('dataNascimento')!.getError('birthDate')?.message ?? invalid('Data de nascimento'));
    }
    if (f.get('paisOrigem')?.hasError('required')) this.errorSummary.push(req('País de origem'));
    if (f.get('telefone')?.hasError('required')) this.errorSummary.push(req('Telefone'));
    if (f.get('telefone')?.hasError('phone')) this.errorSummary.push(invalid('Telefone'));
    if (f.get('email')?.hasError('required')) this.errorSummary.push(req('E-mail'));
    if (f.get('email')?.hasError('email')) this.errorSummary.push(invalid('E-mail'));
    if (f.get('endereco')?.hasError('required')) this.errorSummary.push(req('Endereço'));
    if (f.get('cidade')?.hasError('required')) this.errorSummary.push(req('Cidade'));

    if (this.isBrasil) {
      if (f.get('estado')?.hasError('required')) this.errorSummary.push(req('Estado'));
      if (f.get('cep')?.hasError('required')) this.errorSummary.push(req('CEP'));
      if (f.get('cep')?.hasError('pattern')) this.errorSummary.push('CEP deve conter 8 dígitos.');
    }
    if (this.tipoConta === 'br') {
      if (f.get('nomeEmpresaBR')?.hasError('required')) this.errorSummary.push(req('Nome da empresa'));
      if (f.get('cnpj')?.hasError('required')) this.errorSummary.push(req('CNPJ'));
      if (f.get('cnpj')?.hasError('cnpj')) this.errorSummary.push(invalid('CNPJ'));
    }
    if (this.tipoConta === 'foreign') {
      if (f.get('nomeEmpresaExt')?.hasError('required')) this.errorSummary.push(req('Nome da empresa'));
      if (f.get('tipoEmpresaExt')?.hasError('required')) this.errorSummary.push(req('Tipo de empresa'));
      if (this.tipoEmpresaExt === 'Outros' && f.get('tipoEmpresaOutros')?.hasError('required')) {
        this.errorSummary.push(req('Descrição do tipo de empresa'));
      }
    }
    this.errorSummary = Array.from(new Set(this.errorSummary));
  }

  private buildErrorSummarySenha(): void {
    const f = this.formSenha;
    if (f.get('senhaAtual')?.hasError('required')) this.errorSummarySenha.push('Senha atual é obrigatória.');
    if (f.get('novaSenha')?.hasError('required')) this.errorSummarySenha.push('Nova senha é obrigatória.');
    if (f.get('novaSenha')?.hasError('passwordComplexity')) {
      this.errorSummarySenha.push(f.get('novaSenha')!.getError('passwordComplexity')?.message ?? 'Nova senha não atende aos requisitos.');
    }
    if (f.get('confirmarSenha')?.hasError('required')) this.errorSummarySenha.push('Confirmação de senha é obrigatória.');
    if (f.hasError('passwordsMismatch') || f.get('confirmarSenha')?.hasError('passwordsMismatch')) {
      this.errorSummarySenha.push('As senhas não coincidem.');
    }
    this.errorSummarySenha = Array.from(new Set(this.errorSummarySenha));
  }

  private scrollToErrorSummary(): void {
    try {
      if (this.errorSummaryRef?.nativeElement) {
        this.errorSummaryRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scroll({ top: 0, behavior: 'smooth' as ScrollBehavior });
      }
    } catch (_) { window.scrollTo(0, 0); }
  }

  private focusFirstInvalidControl(): void {
    try {
      const root = this.host?.nativeElement as HTMLElement;
      if (!root) return;
      const selector = 'form .ng-invalid[formcontrolname], form .ng-invalid input';
      const invalid = root.querySelector(selector) as HTMLElement | null;
      if (invalid) {
        const el = (invalid.matches('input') ? invalid : invalid.querySelector('input')) as HTMLElement | null;
        if (el && typeof (el as any).focus === 'function') (el as any).focus();
      }
    } catch (_) {}
  }
}
