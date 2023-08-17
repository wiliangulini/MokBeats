import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "./auth.service";
import { UsuarioLogin } from "./usuarioLogin";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  public cadastro: any = {};
  public usuario: UsuarioLogin = new UsuarioLogin();
  public resetPass: any = {};
  log: any;
  resetP: any;
  mf: any;
  person: any[] = [
    {value: 'Pessoa Física', viewValue: 'Pessoa Física'},
    {value: 'Pessoa Jurídica', viewValue: 'Pessoa Jurídica'},
  ];
  typeStems: any[] = [
    { value: 'Druns', viewValue: 'Druns' },
    { value:  'Melodia', viewValue:  'Melodia' },
    { value: 'Harmonia', viewValue: 'Harmonia' },
    { value: 'Efeitos/Vozes', viewValue: 'Efeitos/Vozes' },
  ]

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public activeModal: NgbActiveModal,
  ) {
    this.form = this.fb.group({
      email: [],
      senha: [],
      typePerson: [],
      emailLog: [],
      senhaLog: [],
      emailReset: [],
    })
  }

  ngOnInit(): void {
  }

  politica() {
    this.router.navigate(['/politica-de-privacidade']);
    this.activeModal.close();
  }

  public closeModal() {
    return this.activeModal.close();
  }

  irProLogin(data: any) {
    let register = document.getElementById('register');
    this.log = document.getElementById('login');
    let logCad = document.getElementById('logCad');
    let aLog = document.getElementById('aLog');
    if(data.target.innerText == 'Faça Login') {
      register!.style.display = 'none'
      this.log!.style.display = 'flex';
      logCad!.innerHTML = `Não tem uma conta?`;
      aLog!.innerHTML = `Crie a Sua`;
    } else if(data.target.innerText == 'Crie a Sua') {
      register!.style.display = 'flex'
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
    this.authService.fazerLogin(this.usuario)
  }

  onSubmit() {
    console.log('enviou');
    this.activeModal.close();
  }
}
