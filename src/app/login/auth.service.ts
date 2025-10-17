import { Injectable } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "./login.component";
import { UsuarioLogin } from "./usuarioLogin";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioAutenticado: boolean = false;
  private readonly TOKEN_KEY = 'authToken';

  // Subject para notificar mudanças no estado de autenticação
  private authStatusSubject = new BehaviorSubject<boolean>(this.checkInitialAuthStatus());
  public authStatus$ = this.authStatusSubject.asObservable();

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    ) {
  }

  /**
   * Verifica o status inicial de autenticação ao instanciar o serviço
   */
  private checkInitialAuthStatus(): boolean {
    const token = (() => {
      try {
        return localStorage.getItem(this.TOKEN_KEY);
      } catch (_) {
        return null;
      }
    })();
    this.usuarioAutenticado = !!token;
    return this.usuarioAutenticado;
  }

  public fazerLogin(usuario: UsuarioLogin): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/auth/login`, {
      email: usuario?.email,
      password: usuario?.senha,
    }).pipe(
      tap((resp: any) => {
        const token = resp?.token;
        if (token) {
          try { localStorage.setItem(this.TOKEN_KEY, token); } catch (_) {}
          this.usuarioAutenticado = true;
          this.authStatusSubject.next(true); // Notificar mudança de estado
        } else {
          this.usuarioAutenticado = false;
          this.authStatusSubject.next(false); // Notificar mudança de estado
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
    this.authStatusSubject.next(false); // Notificar mudança de estado
  }
}
