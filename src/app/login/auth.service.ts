import {Injectable} from '@angular/core';
import {UsuarioLogin} from "./usuarioLogin";
import {LoginComponent} from "./login.component";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioAutenticado: boolean = false;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private router: Router,
    ) { }

  public fazerLogin(usuario: UsuarioLogin, btn: any) {
    console.log(usuario);
    if(usuario.email === 'gulini.dev@gmail.com' && usuario.senha === 'teste') {
      console.log('login enviado');
      this.usuarioAutenticado = true;
      this.router.navigate(['/home']);
    } else {
      this.usuarioAutenticado = false;
    }
  }

  public verificaLogin() {
    console.log('verificaLogin', this.usuarioAutenticado);
    if(!this.usuarioAutenticado) {
      this.modalService.open(LoginComponent, {size: 'lg', modalDialogClass: 'modal-dialog-centered', container: 'body', backdrop: 'static', keyboard: false});
    }
  }

  public userAutetic() {
    console.log('userAutetic', this.usuarioAutenticado);
    return this.usuarioAutenticado;
  }
}
