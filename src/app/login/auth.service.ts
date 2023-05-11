import {Injectable} from '@angular/core';
import {UsuarioLogin} from "./usuarioLogin";
import {LoginComponent} from "./login.component";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioAutenticado: boolean = false;
  userEmail: any;
  userPass: any;

  constructor(
    private modalService: NgbModal,
    ) {
  }

  public fazerLogin(usuario: UsuarioLogin) {
    if(this.userEmail == null && this.userPass == null) {
      localStorage.setItem('userEmail', usuario.email);
      localStorage.setItem('userPass', usuario.senha);
    }

    this.userEmail = localStorage.getItem('userEmail');
    this.userPass = localStorage.getItem('userPass');

    if(this.userEmail === 'gulini.dev@gmail.com' && this.userPass === 'teste') {
      console.log('login enviado');
      this.usuarioAutenticado = true;
    } else {
      this.usuarioAutenticado = false;
    }
  }

  public verificaLogin() {
    this.userAutetic();
    if(!this.usuarioAutenticado) {
      this.modalService.open(LoginComponent, {size: 'lg', modalDialogClass: 'modal-dialog-centered', container: 'body', backdrop: 'static', keyboard: false});
    }
  }

  public userAutetic() {
    this.userEmail = localStorage.getItem('userEmail');
    this.userPass = localStorage.getItem('userPass');

    if(this.userEmail != null && this.userPass != null) {
      this.usuarioAutenticado = true;
    } else {
      this.usuarioAutenticado = false;
    }
    return this.usuarioAutenticado;
  }
}
