import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  constructor(private http: HttpClient) {}

  getConfig(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/config`);
  }
}
