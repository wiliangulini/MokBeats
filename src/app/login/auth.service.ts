import { Injectable } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "./login.component";
import { UsuarioLogin } from "./usuarioLogin";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioAutenticado: boolean = false;
  private readonly TOKEN_KEY = 'authToken';

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    ) {
  }

  public fazerLogin(usuario: UsuarioLogin): Observable<any> {
    return this.http.post(`${environment.API}auth/login`, {
      email: usuario?.email,
      password: usuario?.senha,
    }).pipe(
      tap((resp: any) => {
        const token = resp?.token;
        if (token) {
          try { localStorage.setItem(this.TOKEN_KEY, token); } catch (_) {}
          this.usuarioAutenticado = true;
        } else {
          this.usuarioAutenticado = false;
        }
      })
    );
  }

  public verificaLogin() {
    this.userAutetic();
    if(!this.usuarioAutenticado) {
      this.modalService.open(LoginComponent, {size: 'lg', modalDialogClass: 'modal-dialog-centered', container: 'body', backdrop: 'static', keyboard: false});
    }
  }

  public userAutetic() {
    const token = (() => { try { return localStorage.getItem(this.TOKEN_KEY); } catch (_) { return null; } })();
    this.usuarioAutenticado = !!token;
    return this.usuarioAutenticado;
  }

  public logout() {
    try { localStorage.removeItem(this.TOKEN_KEY); } catch (_) {}
    this.usuarioAutenticado = false;
  }
}
