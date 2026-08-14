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
import { BarItem, IndexedLineSeries, baselineY, toBarItems, toIndexedLineSeries } from './dashboard.charts';

interface KpiCard {
  icon: string;
  label: string;
  value: string;
  helper: string;
}

/** Estado de um bloco/card independente da Dashboard (KPI, gráfico ou tabela). */
export type BlockState = 'loading' | 'error' | 'empty' | 'ready';

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
  // true assim que o 1º carregamento (qualquer período) termina — depois disso,
  // trocar de período não deve mais mostrar skeleton "piscando": os dados do
  // período anterior seguem visíveis (esmaecidos) até a resposta nova chegar.
  hasLoadedOnce = false;

  // Erro por bloco — uma falha isolada não deve derrubar os demais cards
  // (achado registrado na R21: erro parcial ficava indistinguível de "vazio").
  summaryError = false;
  tracksError = false;
  originError = false;
  revenueError = false;
  trendError = false;

  summary: DashboardSummary | null = null;
  salesByTrack: TrackSales[] = [];
  salesByOrigin: SalesByOrigin[] = [];
  kpiCards: KpiCard[] = [];

  // ─── Dados dos gráficos (funções puras de dashboard.charts.ts) ──────────
  originBarItems: BarItem[] = [];
  tracksBarItems: BarItem[] = [];
  revenueBarItems: BarItem[] = [];
  trendSeries: IndexedLineSeries[] = [];
  trendBaselineY: number | null = null;

  // Perfil do produtor (nome para o cabeçalho)
  nomeProdutor = '';

  // Filtro local da tabela
  filtroDestaque: 'todos' | 'destaque' = 'todos';

  // Contadores fixos para os skeletons de loading (sem relação com dados reais).
  readonly skeletonKpis = [1, 2, 3, 4];
  readonly skeletonBarRows = [1, 2, 3, 4];

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

  // ─── Estado por bloco ─────────────────────────────────────────────────
  get summaryState(): BlockState {
    if (this.loading) return 'loading';
    if (this.summaryError) return 'error';
    if (!this.summary) return 'empty';
    return 'ready';
  }

  get tracksState(): BlockState {
    if (this.loading) return 'loading';
    if (this.tracksError) return 'error';
    if (this.salesByTrackFiltered.length === 0) return 'empty';
    return 'ready';
  }

  get tracksChartState(): BlockState {
    if (this.loading) return 'loading';
    if (this.tracksError) return 'error';
    if (this.tracksBarItems.length === 0) return 'empty';
    return 'ready';
  }

  get originState(): BlockState {
    if (this.loading) return 'loading';
    if (this.originError) return 'error';
    if (this.originBarItems.length === 0) return 'empty';
    return 'ready';
  }

  get revenueState(): BlockState {
    if (this.loading) return 'loading';
    if (this.revenueError) return 'error';
    if (this.revenueBarItems.length === 0) return 'empty';
    return 'ready';
  }

  get trendState(): BlockState {
    if (this.loading) return 'loading';
    if (this.trendError) return 'error';
    if (this.trendSeries.length === 0) return 'empty';
    return 'ready';
  }

  /**
   * Estado "visual" de um bloco: no 1º carregamento, `loading` mostra skeleton;
   * numa troca de período subsequente, os dados anteriores continuam à mostra
   * (o card fica esmaecido via `.dash-refreshing`, sem re-esconder o conteúdo).
   */
  blockDisplayState(state: BlockState): BlockState {
    if (state === 'loading' && this.hasLoadedOnce) return 'ready';
    return state;
  }

  trackByTrackId(_index: number, track: TrackSales): number {
    return track.trackId;
  }

  initialOf(nome: string): string {
    return (nome ?? '').trim().charAt(0).toUpperCase() || '—';
  }

  private loadData(): void {
    this.loading = true;
    this.summaryError = false;
    this.tracksError = false;
    this.originError = false;
    this.revenueError = false;
    this.trendError = false;

    combineLatest([
      this.dashboardService.getSummary().pipe(
        catchError(() => { this.summaryError = true; return of(null); })
      ),
      this.dashboardService.getSalesByTrack(this.selectedPeriod).pipe(
        catchError(() => { this.tracksError = true; return of([]); })
      ),
      this.dashboardService.getSalesByOrigin(this.selectedPeriod).pipe(
        catchError(() => { this.originError = true; return of([]); })
      ),
      this.dashboardService.getRevenueByTrack(this.selectedPeriod).pipe(
        catchError(() => { this.revenueError = true; return of([]); })
      ),
      this.dashboardService.getLikesVsSales(this.selectedPeriod).pipe(
        catchError(() => { this.trendError = true; return of([]); })
      ),
    ]).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([summary, salesByTrack, salesByOrigin, revenueByTrack, likesVsSales]) => {
          this.summary = summary;
          this.salesByTrack = salesByTrack;
          this.salesByOrigin = salesByOrigin;
          this.kpiCards = this.buildKpiCards(summary);

          this.originBarItems = toBarItems(
            salesByOrigin,
            r => r.cidade ? `${r.cidade} — ${r.pais}` : r.pais,
            r => r.compras,
          );
          this.tracksBarItems = toBarItems(
            salesByTrack,
            r => r.nome,
            r => r.compras,
          );
          this.revenueBarItems = toBarItems(
            revenueByTrack,
            r => r.nome,
            r => r.receita,
            {
              formatValue: formatBRL,
              captionFn: r => `${r.share.toFixed(1).replace('.', ',')}%`,
            },
          );
          this.trendSeries = toIndexedLineSeries(likesVsSales);
          this.trendBaselineY = baselineY(this.trendSeries);

          this.loading = false;
          this.hasLoadedOnce = true;
        },
        error: () => {
          // Fallback defensivo: com catchError em cada stream, o combineLatest
          // só cai aqui em falha fora do fluxo esperado (ex.: erro de operador).
          this.loading = false;
          this.summaryError = true;
          this.tracksError = true;
          this.originError = true;
          this.revenueError = true;
          this.trendError = true;
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
