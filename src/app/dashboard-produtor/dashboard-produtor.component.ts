import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { DashboardService } from './dashboard.service';
import { UserProfileService } from '../service/user-profile.service';
import { UserProfile } from '../models/user-profile.model';
import {
  DashboardPeriod,
  DashboardSummary,
  TrackSales,
  SalesByOrigin,
  DASHBOARD_PERIODS,
  formatBRL,
  formatCompact,
} from './dashboard.models';

interface KpiCard {
  icon: string;
  label: string;
  value: string;
  helper: string;
}

@Component({
    selector: 'app-dashboard-produtor',
    templateUrl: './dashboard-produtor.component.html',
    styleUrls: ['./dashboard-produtor.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DashboardProdutorComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  // ─── Estado ───────────────────────────────────────────────────────────
  selectedPeriod: DashboardPeriod = '30d';
  readonly periods = DASHBOARD_PERIODS;
  readonly today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  loading = false;
  loadError = false;
  tracksError = false;

  summary: DashboardSummary | null = null;
  salesByTrack: TrackSales[] = [];
  salesByOrigin: SalesByOrigin[] = [];
  kpiCards: KpiCard[] = [];

  // Perfil do produtor (nome para o cabeçalho)
  nomeProdutor = '';

  // Filtro local da tabela
  filtroDestaque: 'todos' | 'destaque' = 'todos';

  // ─── Exposição das funções de formatação para o template ─────────────
  readonly formatBRL = formatBRL;
  readonly formatCompact = formatCompact;

  constructor(
    private dashboardService: DashboardService,
    private profileService: UserProfileService,
  ) {}

  ngOnInit(): void {
    // Carregar nome do produtor do perfil
    this.profileService.getProfile()
      .pipe(takeUntil(this.destroy$), catchError(() => of({} as Partial<UserProfile>)))
      .subscribe(p => { this.nomeProdutor = p.nomeCompleto ?? ''; });

    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPeriodChange(period: DashboardPeriod): void {
    this.selectedPeriod = period;
    this.loadData();
  }

  get salesByTrackFiltered(): TrackSales[] {
    if (this.filtroDestaque === 'destaque') {
      return this.salesByTrack.filter(t => t.destaque);
    }
    return this.salesByTrack;
  }

  get totalLicencas(): number {
    if (!this.summary?.licencas) return 0;
    const { basica, profissional, exclusiva } = this.summary.licencas;
    return basica.quantidade + profissional.quantidade + exclusiva.quantidade;
  }

  trackByTrackId(_index: number, track: TrackSales): number {
    return track.trackId;
  }

  initialOf(nome: string): string {
    return (nome ?? '').trim().charAt(0).toUpperCase() || '—';
  }

  private loadData(): void {
    this.loading = true;
    this.loadError = false;
    this.tracksError = false;

    combineLatest([
      this.dashboardService.getSummary().pipe(catchError(() => of(null))),
      this.dashboardService.getSalesByTrack(this.selectedPeriod).pipe(
        catchError(() => { this.tracksError = true; return of([]); })
      ),
      this.dashboardService.getSalesByOrigin(this.selectedPeriod).pipe(catchError(() => of([]))),
    ]).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([summary, salesByTrack, salesByOrigin]) => {
          this.summary = summary;
          this.salesByTrack = salesByTrack;
          this.salesByOrigin = salesByOrigin;
          this.kpiCards = this.buildKpiCards(summary);
          this.loading = false;
          if (!summary) this.loadError = true;
        },
        error: () => {
          this.loading = false;
          this.loadError = true;
        }
      });
  }

  private buildKpiCards(summary: DashboardSummary | null): KpiCard[] {
    return [
      {
        icon: 'shopping_bag',
        label: 'Vendas totais',
        value: summary ? formatCompact(summary.vendasTotais) : '—',
        helper: 'licenças vendidas',
      },
      {
        icon: 'payments',
        label: 'Valor total em vendas',
        value: summary ? formatBRL(summary.valorTotalVendas) : '—',
        helper: 'receita bruta no período',
      },
      {
        icon: 'favorite',
        label: 'Nº total de curtidas',
        value: summary ? formatCompact(summary.totalCurtidas) : '—',
        helper: 'curtidas acumuladas',
      },
      {
        icon: 'confirmation_number',
        label: 'Ticket médio por venda',
        value: summary ? formatBRL(summary.ticketMedio) : '—',
        helper: 'por licença vendida',
      },
    ];
  }
}
