import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { EMPTY_PRODUCER_PROFILE, ProducerProfile } from '../models/producer-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProducerProfileService {

  private readonly TOKEN_KEY = 'authToken';
  private readonly base = `${environment.apiBaseUrl}/producers`;

  private myProfileSnapshot: ProducerProfile | null = null;
  private myProfileSubject = new BehaviorSubject<ProducerProfile | null>(null);
  public myProfile$ = this.myProfileSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = (() => { try { return localStorage.getItem(this.TOKEN_KEY); } catch (_) { return null; } })();
    return new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` });
  }

  /** Perfil artístico público de um produtor. Nunca lança — 404/erro vira `null`. */
  getPublicProfile(producerId: string): Observable<ProducerProfile | null> {
    return this.http.get<ProducerProfile>(`${this.base}/${producerId}`).pipe(
      catchError(() => of(null))
    );
  }

  getMyProfile(): Observable<ProducerProfile> {
    return this.http.get<ProducerProfile>(
      `${this.base}/me`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(profile => {
        this.myProfileSnapshot = profile;
        this.myProfileSubject.next(profile);
      }),
      catchError(() => of(this.myProfileSnapshot ?? EMPTY_PRODUCER_PROFILE))
    );
  }

  saveMyProfile(data: Partial<Pick<ProducerProfile, 'nomeArtistico' | 'biografia'>>): Observable<{ message: string; producer: ProducerProfile }> {
    return this.http.put<{ message: string; producer: ProducerProfile }>(
      `${this.base}/me`,
      data,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(resp => {
        this.myProfileSnapshot = resp.producer;
        this.myProfileSubject.next(resp.producer);
      })
    );
  }

  uploadAvatar(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.base}/me/avatar`, formData).pipe(
      tap(({ url }) => {
        if (this.myProfileSnapshot) {
          this.myProfileSnapshot = { ...this.myProfileSnapshot, avatarUrl: url };
          this.myProfileSubject.next(this.myProfileSnapshot);
        }
      })
    );
  }

  getMySnapshot(): ProducerProfile | null {
    return this.myProfileSnapshot;
  }
}
