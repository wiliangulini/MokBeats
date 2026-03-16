import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserProfile, DocumentTipo, isProfileComplete } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private readonly TOKEN_KEY = 'authToken';
  private readonly PROFILE_CACHE_KEY = 'userProfileCache';

  private profileSnapshot: Partial<UserProfile> | null = null;
  private profileCompleteSubject = new BehaviorSubject<boolean>(false);
  public profileComplete$ = this.profileCompleteSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromCache();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = (() => { try { return localStorage.getItem(this.TOKEN_KEY); } catch (_) { return null; } })();
    return new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` });
  }

  private loadFromCache(): void {
    try {
      const cached = localStorage.getItem(this.PROFILE_CACHE_KEY);
      if (cached) {
        this.profileSnapshot = JSON.parse(cached);
        this.profileCompleteSubject.next(isProfileComplete(this.profileSnapshot));
      }
    } catch (_) {}
  }

  private saveToCache(profile: Partial<UserProfile>): void {
    try { localStorage.setItem(this.PROFILE_CACHE_KEY, JSON.stringify(profile)); } catch (_) {}
  }

  getProfile(): Observable<Partial<UserProfile>> {
    return this.http.get<Partial<UserProfile>>(
      `${environment.apiBaseUrl}/user/profile`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(profile => {
        this.profileSnapshot = profile;
        this.saveToCache(profile);
        this.profileCompleteSubject.next(isProfileComplete(profile));
      }),
      catchError(() => {
        // Backend ainda não disponível — retorna cache local
        return of(this.profileSnapshot ?? {});
      })
    );
  }

  saveProfile(data: Partial<UserProfile>): Observable<any> {
    return this.http.put(
      `${environment.apiBaseUrl}/user/profile`,
      data,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(() => {
        this.profileSnapshot = { ...this.profileSnapshot, ...data };
        this.saveToCache(this.profileSnapshot!);
        this.profileCompleteSubject.next(isProfileComplete(this.profileSnapshot));
      }),
      catchError(err => {
        throw err;
      })
    );
  }

  uploadDocument(file: File, tipo: DocumentTipo): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(
      `${environment.apiBaseUrl}/user/documents/${tipo}`,
      formData,
    ).pipe(
      tap(({ url }) => {
        const urlField = tipo === 'foto-documento' ? 'fotoDocumentoUrl'
          : tipo === 'comprovante-residencia' ? 'comprovanteResidenciaUrl'
          : 'documentoEmpresaUrl';
        this.profileSnapshot = { ...this.profileSnapshot, [urlField]: url };
        this.saveToCache(this.profileSnapshot!);
        this.profileCompleteSubject.next(isProfileComplete(this.profileSnapshot));
      })
    );
  }

  isProfileComplete(): boolean {
    return isProfileComplete(this.profileSnapshot);
  }

  getSnapshot(): Partial<UserProfile> | null {
    return this.profileSnapshot;
  }

  clearCache(): void {
    this.profileSnapshot = null;
    try { localStorage.removeItem(this.PROFILE_CACHE_KEY); } catch (_) {}
    this.profileCompleteSubject.next(false);
  }
}
