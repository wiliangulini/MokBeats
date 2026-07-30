import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "./auth.service";
import { UsuarioLogin } from "./usuarioLogin";

function senhasIguaisValidator(group: AbstractControl): ValidationErrors | null {
  const senha = group.get('senha');
  const confirmar = group.get('confirmarSenha');
  if (!senha || !confirmar || !confirmar.value) return null;
  return senha.value === confirmar.value ? null : { senhasNaoConferem: true };
}

type CustomSelectKey = 'typePerson' | 'tipoPerfil';

interface CustomSelectOption {
  value: string;
  label: string;
  tooltip?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loginErro: boolean = false;
  log: any;
  register: any;
  resetP: any;
  mf: any;
  readonly customSelectPlaceholders: Record<CustomSelectKey, string> = {
    typePerson: 'Tipo de Pessoa',
    tipoPerfil: 'Tipo de Perfil',
  };
  readonly customSelectOptions: Record<CustomSelectKey, CustomSelectOption[]> = {
    typePerson: [
      { value: 'Pessoa Física', label: 'Pessoa Física' },
      { value: 'Pessoa Jurídica', label: 'Pessoa Jurídica' },
    ],
    tipoPerfil: [
      {
        value: 'comprador',
        label: 'Mok Starters',
        tooltip: 'Conta para usuários que desejam navegar, comprar e assinar planos na plataforma.',
      },
      {
        value: 'produtor',
        label: 'Mok Makers',
        tooltip: 'Conta para produtores e compositores que desejam publicar, vender e gerenciar suas criações.',
      },
    ],
  };
  customSelectState: Record<CustomSelectKey, boolean> = {
    typePerson: false,
    tipoPerfil: false,
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public activeModal: NgbActiveModal,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      confirmarSenha: ['', Validators.required],
      typePerson: ['', Validators.required],
      tipoPerfil: ['', Validators.required],
      emailLog: ['', [Validators.required, Validators.email]],
      senhaLog: ['', [Validators.required, Validators.minLength(8)]],
      emailReset: ['', [Validators.required, Validators.email]],
    }, { validators: senhasIguaisValidator });
  }

  ngOnInit(): void {}

  isCustomSelectOpen(selectKey: CustomSelectKey): boolean {
    return this.customSelectState[selectKey];
  }

  toggleCustomSelect(selectKey: CustomSelectKey): void {
    const isOpening = !this.customSelectState[selectKey];
    (Object.keys(this.customSelectState) as CustomSelectKey[]).forEach((key) => {
      this.customSelectState[key] = key === selectKey ? isOpening : false;
    });
  }

  selectCustomOption(event: Event, selectKey: CustomSelectKey, option: CustomSelectOption): void {
    event.preventDefault();
    event.stopPropagation();
    this.form.get(selectKey)?.setValue(option.value);
    this.form.get(selectKey)?.markAsTouched();
    this.customSelectState[selectKey] = false;
  }

  onCustomSelectKeydown(event: KeyboardEvent, selectKey: CustomSelectKey): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleCustomSelect(selectKey);
      return;
    }
    if (event.key === 'Escape') {
      this.customSelectState[selectKey] = false;
      return;
    }
    if (event.key === 'ArrowDown' && !this.customSelectState[selectKey]) {
      event.preventDefault();
      this.toggleCustomSelect(selectKey);
    }
  }

  getSelectedLabel(selectKey: CustomSelectKey): string {
    const selectedValue = this.form.get(selectKey)?.value;
    const selectedOption = this.customSelectOptions[selectKey]
      .find((option) => option.value === selectedValue);
    return selectedOption?.label ?? this.customSelectPlaceholders[selectKey];
  }

  politica() {
    this.router.navigate(['/politica-de-privacidade']);
    this.activeModal.close();
  }

  public closeModal() {
    return this.activeModal.close();
  }

  irProLogin(data: any) {
    this.register = document.getElementById('register');
    this.log = document.getElementById('login');
    let logCad: any = document.getElementById('logCad');
    let aLog: any = document.getElementById('aLog');
    if(data.target.innerText == 'Faça Login') {
      this.register!.style.display = 'none'
      this.log!.style.display = 'flex';
      logCad!.innerHTML = `Não tem uma conta?`;
      aLog!.innerHTML = `Crie a Sua`;
    } else if(data.target.innerText == 'Crie a Sua') {
      this.register!.style.display = 'flex'
      this.log!.style.display = 'none';
      logCad!.innerHTML = `Já tem uma conta?`;
      aLog!.innerHTML = `Faça Login`;
    }
  }

  back() {
    this.log!.style.display = 'flex';
    this.resetP!.style.display = 'none';
    this.mf!.style.display = 'flex';
  }

  resetPassword() {
    this.resetP = document.getElementById('resetPass');
    this.mf = document.getElementById('mf');
    this.log!.style.display = 'none';
    this.resetP!.style.display = 'flex';
    this.mf!.style.display = 'none';
  }

  fazerLogin() {
    this.loginErro = false;
    const emailCtrl = this.form.get('emailLog');
    const passCtrl = this.form.get('senhaLog');
    emailCtrl?.markAsTouched();
    passCtrl?.markAsTouched();
    if (emailCtrl?.invalid || passCtrl?.invalid) {
      return;
    }

    const usuario = new UsuarioLogin();
    usuario.email = emailCtrl?.value;
    usuario.senha = passCtrl?.value;

    this.authService.fazerLogin(usuario).subscribe({
      next: () => {
        try { this.activeModal.close(); } catch (_) {}
      },
      error: (err) => {
        console.error('Falha no login', err);
        this.loginErro = true;
      }
    });
  }

  onSubmit() {
    const camposRegister = ['email', 'senha', 'confirmarSenha', 'typePerson', 'tipoPerfil'];
    camposRegister.forEach(f => this.form.get(f)?.markAsTouched());

    const campoInvalido = camposRegister.some(f => this.form.get(f)?.invalid);
    const senhasDiferentes = this.form.hasError('senhasNaoConferem');
    if (campoInvalido || senhasDiferentes) return;

    const usuario = new UsuarioLogin();
    usuario.email = this.form.get('email')?.value;
    usuario.senha = this.form.get('senha')?.value;
    usuario.tipoPessoa = this.form.get('typePerson')?.value;
    usuario.tipoPerfil = this.form.get('tipoPerfil')?.value;

    this.authService.registrar(usuario).subscribe({
      next: () => {
        try { this.activeModal.close(); } catch (_) {}
      },
      error: (err) => {
        console.error('Falha no cadastro', err);
      }
    });
  }

  loginComGoogle() {
    this.authService.loginComGoogle();
  }

  registrarComGoogle() {
    this.authService.loginComGoogle();
  }
}
