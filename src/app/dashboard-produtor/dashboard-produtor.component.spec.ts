import { DashboardProdutorComponent } from './dashboard-produtor.component';
import { DashboardService } from './dashboard.service';
import { UserProfileService } from '../service/user-profile.service';
import {
  DashboardSummary,
  TrackSales,
  SalesByOrigin,
  RevenueByTrack,
  LikesVsSalesPoint,
} from './dashboard.models';
import { of, throwError, Subject } from 'rxjs';

const SUMMARY_MOCK: DashboardSummary = {
  vendasTotais: 1200,
  valorTotalVendas: 45300,
  totalCurtidas: 8700,
  ticketMedio: 37.75,
  licencas: {
    basica: { quantidade: 10, receita: 500 },
    profissional: { quantidade: 5, receita: 1000 },
    exclusiva: { quantidade: 1, receita: 2000 },
  },
};

const TRACKS_MOCK: TrackSales[] = [
  { trackId: 1, nome: 'Faixa A', compras: 10, receita: 500, origemPrincipal: 'Instagram', likes: 100, destaque: true },
  { trackId: 2, nome: 'Faixa B', compras: 5, receita: 250, origemPrincipal: 'TikTok', likes: 50, destaque: false },
];

const ORIGIN_MOCK: SalesByOrigin[] = [];

const REVENUE_MOCK: RevenueByTrack[] = [
  { trackId: 1, nome: 'Faixa A', receita: 500, share: 66.7 },
  { trackId: 2, nome: 'Faixa B', receita: 250, share: 33.3 },
];

const TREND_MOCK: LikesVsSalesPoint[] = [
  { data: '2026-03-10', curtidas: 100, compras: 20 },
  { data: '2026-03-11', curtidas: 150, compras: 30 },
];

class StubDashboardService {
  summaryResult$ = of(SUMMARY_MOCK);
  tracksResult$ = of(TRACKS_MOCK);
  originResult$ = of(ORIGIN_MOCK);
  revenueResult$ = of(REVENUE_MOCK);
  trendResult$ = of(TREND_MOCK);

  getSummary = vi.fn().mockImplementation(() => this.summaryResult$);
  getSalesByTrack = vi.fn().mockImplementation(() => this.tracksResult$);
  getSalesByOrigin = vi.fn().mockImplementation(() => this.originResult$);
  getRevenueByTrack = vi.fn().mockImplementation(() => this.revenueResult$);
  getLikesVsSales = vi.fn().mockImplementation(() => this.trendResult$);
}

class StubUserProfileService {
  getProfile = vi.fn().mockImplementation(() => of({ nomeCompleto: 'Fulano de Tal' }));
}

describe('DashboardProdutorComponent', () => {
  let component: DashboardProdutorComponent;
  let dashboardService: StubDashboardService;
  let profileService: StubUserProfileService;

  function createComponent(): void {
    dashboardService = new StubDashboardService();
    profileService = new StubUserProfileService();
    component = new DashboardProdutorComponent(
      dashboardService as unknown as DashboardService,
      profileService as unknown as UserProfileService,
    );
  }

  it('deve ser criado', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('deve carregar os KPIs a partir do DashboardService e encerrar o loading', () => {
    createComponent();
    component.ngOnInit();

    expect(component.loading).toBe(false);
    expect(component.summaryState).toBe('ready');
    expect(component.kpiCards.length).toBe(4);
    expect(component.kpiCards[0].value).toBe('1,2K');
    expect(component.kpiCards[1].value).toContain('45.300');
    expect(component.nomeProdutor).toBe('Fulano de Tal');
  });

  it('deve montar os dados dos 4 gráficos a partir das 5 chamadas do DashboardService', () => {
    createComponent();
    component.ngOnInit();

    expect(dashboardService.getRevenueByTrack).toHaveBeenCalledWith('30d');
    expect(dashboardService.getLikesVsSales).toHaveBeenCalledWith('30d');

    // "Vendas por faixa" — ordenado desc por compras (Faixa A: 10 > Faixa B: 5)
    expect(component.tracksBarItems.map(i => i.label)).toEqual(['Faixa A', 'Faixa B']);
    expect(component.tracksBarItems[0].percent).toBe(100);

    // "Receita por música" — usa formatBRL e a caption de share
    expect(component.revenueBarItems[0].valueLabel).toContain('R$');
    expect(component.revenueBarItems[0].caption).toContain('%');

    // "Curtidas × Compras" — 2 séries indexadas, ambas partindo de 100
    expect(component.trendSeries).toHaveLength(2);
    expect(component.trendSeries[0].points[0].index).toBe(100);
    expect(component.trendBaselineY).not.toBeNull();
  });

  it('deve ligar summaryError (e summaryState "error") quando getSummary falhar', () => {
    createComponent();
    dashboardService.getSummary = vi.fn().mockImplementation(() => throwError(() => new Error('falha')));

    component.ngOnInit();

    expect(component.loading).toBe(false);
    expect(component.summaryError).toBe(true);
    expect(component.summaryState).toBe('error');
    expect(component.summary).toBeNull();
  });

  it('deve ligar tracksError (e não summaryError) quando só getSalesByTrack falhar', () => {
    createComponent();
    dashboardService.getSalesByTrack = vi.fn().mockImplementation(() => throwError(() => new Error('falha')));

    component.ngOnInit();

    expect(component.loading).toBe(false);
    expect(component.tracksError).toBe(true);
    expect(component.tracksState).toBe('error');
    expect(component.summaryError).toBe(false);
    expect(component.salesByTrack).toEqual([]);
    expect(component.summary).toEqual(SUMMARY_MOCK);
  });

  it('deve isolar a falha de getRevenueByTrack — os demais blocos continuam "ready"', () => {
    createComponent();
    dashboardService.getRevenueByTrack = vi.fn().mockImplementation(() => throwError(() => new Error('falha')));

    component.ngOnInit();

    expect(component.revenueError).toBe(true);
    expect(component.revenueState).toBe('error');
    expect(component.revenueBarItems).toEqual([]);
    expect(component.summaryState).toBe('ready');
    expect(component.tracksState).toBe('ready');
  });

  it('deve isolar a falha de getLikesVsSales — não afeta os demais blocos', () => {
    createComponent();
    dashboardService.getLikesVsSales = vi.fn().mockImplementation(() => throwError(() => new Error('falha')));

    component.ngOnInit();

    expect(component.trendError).toBe(true);
    expect(component.trendState).toBe('error');
    expect(component.trendSeries).toEqual([]);
    expect(component.summaryState).toBe('ready');
  });

  it('salesByTrackFiltered deve respeitar o filtro de destaque', () => {
    createComponent();
    component.ngOnInit();

    expect(component.salesByTrackFiltered.length).toBe(2);

    component.filtroDestaque = 'destaque';

    expect(component.salesByTrackFiltered.length).toBe(1);
    expect(component.salesByTrackFiltered[0].nome).toBe('Faixa A');
  });

  it('initialOf deve retornar a inicial maiúscula do nome da faixa', () => {
    createComponent();
    expect(component.initialOf('faixa teste')).toBe('F');
    expect(component.initialOf('')).toBe('—');
  });

  it('blockDisplayState mantém o bloco "ready" numa troca de período (sem flash de skeleton)', () => {
    createComponent();
    component.ngOnInit(); // 1º carregamento — hasLoadedOnce vira true

    expect(component.hasLoadedOnce).toBe(true);

    // Simula uma 2ª chamada ainda em voo (loading=true de novo) segurando o
    // Observable de summary, mantendo o resto síncrono como antes.
    const pending = new Subject<DashboardSummary>();
    dashboardService.getSummary = vi.fn().mockImplementation(() => pending.asObservable());

    component.onPeriodChange('7d');

    expect(component.loading).toBe(true);
    // Estado "cru" reflete o loading em andamento...
    expect(component.summaryState).toBe('loading');
    // ...mas o estado exibido mantém os dados anteriores visíveis (sem skeleton).
    expect(component.blockDisplayState(component.summaryState)).toBe('ready');
  });
});
