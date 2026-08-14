import { DashboardProdutorComponent } from './dashboard-produtor.component';
import { DashboardService } from './dashboard.service';
import { UserProfileService } from '../service/user-profile.service';
import { DashboardSummary, TrackSales, SalesByOrigin } from './dashboard.models';
import { of, throwError } from 'rxjs';

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

class StubDashboardService {
  summaryResult$ = of(SUMMARY_MOCK);
  tracksResult$ = of(TRACKS_MOCK);
  originResult$ = of(ORIGIN_MOCK);

  getSummary = vi.fn().mockImplementation(() => this.summaryResult$);
  getSalesByTrack = vi.fn().mockImplementation(() => this.tracksResult$);
  getSalesByOrigin = vi.fn().mockImplementation(() => this.originResult$);
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
    expect(component.loadError).toBe(false);
    expect(component.kpiCards.length).toBe(4);
    expect(component.kpiCards[0].value).toBe('1,2K');
    expect(component.kpiCards[1].value).toContain('45.300');
    expect(component.nomeProdutor).toBe('Fulano de Tal');
  });

  it('deve ligar loadError quando getSummary falhar', () => {
    createComponent();
    dashboardService.getSummary = vi.fn().mockImplementation(() => throwError(() => new Error('falha')));

    component.ngOnInit();

    expect(component.loading).toBe(false);
    expect(component.loadError).toBe(true);
    expect(component.summary).toBeNull();
  });

  it('deve ligar tracksError (e não loadError) quando só getSalesByTrack falhar', () => {
    createComponent();
    dashboardService.getSalesByTrack = vi.fn().mockImplementation(() => throwError(() => new Error('falha')));

    component.ngOnInit();

    expect(component.loading).toBe(false);
    expect(component.tracksError).toBe(true);
    expect(component.loadError).toBe(false);
    expect(component.salesByTrack).toEqual([]);
    expect(component.summary).toEqual(SUMMARY_MOCK);
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
});
