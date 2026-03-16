import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AfterContentInit, Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterContentInit {

  form: FormGroup;
  loginErro: boolean = false;
  log: any;
  register: any;
  resetP: any;
  mf: any;
  person: any[] = [
    {value: 'Pessoa Física', viewValue: 'Pessoa Física'},
    {value: 'Pessoa Jurídica', viewValue: 'Pessoa Jurídica'},
  ];

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

  ngAfterContentInit() {
    document.querySelector(".ls-select.status.forma")!.addEventListener("click", () => {
      this.downStatus2();
    });
  }

  downStatus2() {
    let arrow2: any = document.getElementById('arrow2');
    let down2: any = document.querySelector('.down.two');
    if(down2.style.display == "none") {

      down2.style.opacity = 0;
      down2.style.display = "block";
      setTimeout(() =>{
        down2.style.opacity = 0.25;
        arrow2.style.transform = "rotate(45deg)";
      }, 100);
      setTimeout(() =>{
        down2.style.opacity = 0.5;
        arrow2.style.transform = "rotate(90deg)";
      }, 150);
      setTimeout(() =>{
        down2.style.opacity = 0.75;
        arrow2.style.transform = "rotate(135deg)";
      }, 200);
      setTimeout(() => {
        down2.style.opacity = 1;
        arrow2.style.transform = "rotate(180deg)";
      }, 250);

    } else if(down2.style.display == "block") {

      down2.style.opacity = 1;
      setTimeout(() =>{
        down2.style.opacity = 0.75;
        arrow2.style.transform = "rotate(135deg)";
      }, 100);
      setTimeout(() =>{
        down2.style.opacity = 0.5;
        arrow2.style.transform = "rotate(90deg)";
      }, 150);
      setTimeout(() =>{
        down2.style.opacity = 0.25;
        arrow2.style.transform = "rotate(45deg)";
      }, 200);
      setTimeout(() => {
        down2.style.opacity = 0;
        arrow2.style.transform = "rotate(0deg)";
        down2.style.display = "none";
      }, 250);

    }
  }

  radiocontainer(e: any) {
    let n = e.id;
    let txt = document.getElementById(n)!.innerText;
    document.getElementById("forma")!.innerHTML = txt;
    this.form.get('typePerson')?.setValue(txt);
    this.downStatus2();
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
