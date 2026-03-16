// ─── Tipos de filtro ──────────────────────────────────────────────────────
export type DashboardPeriod = '7d' | '30d' | '12m';

export const DASHBOARD_PERIODS: { value: DashboardPeriod; label: string }[] = [
  { value: '7d',  label: '7 dias'  },
  { value: '30d', label: '30 dias' },
  { value: '12m', label: '12 meses'},
];

// ─── DTOs (espelham o contrato do backend) ────────────────────────────────

export interface LicencaBreakdown {
  quantidade: number;
  receita: number;
}

export interface DashboardSummary {
  vendasTotais: number;
  valorTotalVendas: number;
  totalCurtidas: number;
  ticketMedio: number;
  licencas?: {
    basica:       LicencaBreakdown;
    profissional: LicencaBreakdown;
    exclusiva:    LicencaBreakdown;
  };
}

export interface TrackSales {
  trackId: number;
  nome: string;
  compras: number;
  receita: number;
  origemPrincipal: string;
  likes: number;
  destaque: boolean;
}

export interface SalesByOrigin {
  pais: string;
  cidade: string;
  compras: number;
  lat: number;
  lng: number;
}

export interface RevenueByTrack {
  trackId: number;
  nome: string;
  receita: number;
  share: number;
}

export interface LikesVsSalesPoint {
  data: string;
  curtidas: number;
  compras: number;
}

// ─── Constantes de visualização ──────────────────────────────────────────
export const CHART_COLORS = {
  primary:   '#FFC107',
  secondary: '#212121',
  accent:    '#757575',
  light:     '#FFF8E1',
  danger:    '#E53935',
};

// ─── Funções puras de transformação ──────────────────────────────────────

export function formatBRL(value: number): string {
  if (value == null || isNaN(value)) return 'R$\u00a00,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatCompact(value: number): string {
  if (value == null || isNaN(value)) return '0';
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace('.', ',') + 'M';
  if (value >= 1_000)     return (value / 1_000).toFixed(1).replace('.', ',') + 'K';
  return value.toLocaleString('pt-BR');
}

export function calcTicketMedio(valorTotal: number, vendas: number): number {
  if (!vendas || vendas === 0) return 0;
  return valorTotal / vendas;
}

export function calcVariacaoPercent(atual: number, anterior: number): number {
  if (!anterior || anterior === 0) return 0;
  return ((atual - anterior) / anterior) * 100;
}
