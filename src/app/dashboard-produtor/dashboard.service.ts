import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  DashboardPeriod,
  DashboardSummary,
  LikesVsSalesPoint,
  RevenueByTrack,
  SalesByOrigin,
  TrackSales,
} from './dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly TOKEN_KEY = 'authToken';
  private readonly base = `${environment.apiBaseUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = (() => { try { return localStorage.getItem(this.TOKEN_KEY); } catch (_) { return null; } })();
    return new HttpHeaders({ Authorization: `Bearer ${token ?? ''}` });
  }

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(
      `${this.base}/summary`,
      { headers: this.getAuthHeaders() }
    );
  }

  getSalesByTrack(period: DashboardPeriod): Observable<TrackSales[]> {
    return this.http.get<TrackSales[]>(
      `${this.base}/sales-by-track`,
      { headers: this.getAuthHeaders(), params: { period } }
    );
  }

  getSalesByOrigin(period: DashboardPeriod): Observable<SalesByOrigin[]> {
    return this.http.get<SalesByOrigin[]>(
      `${this.base}/sales-by-origin`,
      { headers: this.getAuthHeaders(), params: { period } }
    );
  }

  getRevenueByTrack(period: DashboardPeriod): Observable<RevenueByTrack[]> {
    return this.http.get<RevenueByTrack[]>(
      `${this.base}/revenue-by-track`,
      { headers: this.getAuthHeaders(), params: { period } }
    );
  }

  getLikesVsSales(period: DashboardPeriod): Observable<LikesVsSalesPoint[]> {
    return this.http.get<LikesVsSalesPoint[]>(
      `${this.base}/likes-vs-sales`,
      { headers: this.getAuthHeaders(), params: { period } }
    );
  }
}
