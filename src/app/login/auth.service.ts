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
  private readonly PERFIL_KEY = 'userPerfil';

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
          const perfil = resp?.user?.tipoPerfil ?? 'comprador';
          try { localStorage.setItem(this.PERFIL_KEY, perfil); } catch (_) {}
          this.usuarioAutenticado = true;
          this.authStatusSubject.next(true);
        } else {
          this.usuarioAutenticado = false;
          this.authStatusSubject.next(false);
        }
      })
    );
  }

  public registrar(usuario: UsuarioLogin): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/auth/register`, {
      email: usuario?.email,
      password: usuario?.senha,
      tipoPessoa: usuario?.tipoPessoa,
      tipoPerfil: usuario?.tipoPerfil,
    }).pipe(
      tap((resp: any) => {
        const token = resp?.token;
        if (token) {
          try { localStorage.setItem(this.TOKEN_KEY, token); } catch (_) {}
          const perfil = resp?.user?.tipoPerfil ?? usuario?.tipoPerfil ?? 'comprador';
          try { localStorage.setItem(this.PERFIL_KEY, perfil); } catch (_) {}
          this.usuarioAutenticado = true;
          this.authStatusSubject.next(true);
        } else {
          this.usuarioAutenticado = false;
          this.authStatusSubject.next(false);
        }
      })
    );
  }

  /**
   * Stub — integração com Google ainda não configurada.
   * Para integrar, utilize AngularFire (firebase@10.3.0 já está instalado).
   */
  public loginComGoogle(): void {
    alert('Login com Google ainda não está disponível. Em breve!');
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
    try { localStorage.removeItem(this.PERFIL_KEY); } catch (_) {}
    this.usuarioAutenticado = false;
    this.authStatusSubject.next(false);
  }

  public getToken(): string | null {
    try { return localStorage.getItem(this.TOKEN_KEY); } catch (_) { return null; }
  }

  public getUserPerfil(): string | null {
    try { return localStorage.getItem(this.PERFIL_KEY); } catch (_) { return null; }
  }

  public isProdutor(): boolean {
    return this.getUserPerfil() === 'produtor';
  }

  public isComprador(): boolean {
    return this.getUserPerfil() === 'comprador';
  }
}
