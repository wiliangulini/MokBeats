import {AfterContentInit, Component, OnInit} from '@angular/core';
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
export class LoginComponent implements OnInit, AfterContentInit {

  form: FormGroup;
  public cadastro: any = {};
  public usuario: UsuarioLogin = new UsuarioLogin();
  public resetPass: any = {};
  log: any;
  register: any;
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
    console.log(e)
    let n = e.id;
    let txt = document.getElementById(n)!.innerText;
    document.getElementById("forma")!.innerHTML = txt;
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
    console.log(data);
    this.register = document.getElementById('register');
    this.log = document.getElementById('login');
    let logCad: any = document.getElementById('logCad');
    let aLog: any = document.getElementById('aLog');
    console.log(logCad);
    console.log(aLog);
    console.log(data.target.innerText);
    console.log(this.log);
    console.log(this.register);
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
    this.authService.fazerLogin(this.usuario)
  }

  onSubmit() {
    console.log('enviou');
    this.activeModal.close();
  }
}
