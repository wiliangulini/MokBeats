// ─── Funções puras de transformação para os gráficos da Dashboard ─────────
// Sem dependência de biblioteca de gráficos: cada gráfico é renderizado em
// SVG/CSS pelos componentes de `./charts/*`, a partir dos tipos abaixo.
// Metodologia: skill `dataviz` (form heuristic + color formula + anti-patterns).
import { CHART_COLORS, LikesVsSalesPoint, formatCompact } from './dashboard.models';

// ─── Barras horizontais (série única) ──────────────────────────────────────
// Usado por "Origem das compras", "Vendas por faixa" e "Receita por música".
// É série única (uma métrica por linha, mesma entidade) — pela skill dataviz,
// cores nominais de série única usam UM só tom (identidade fica no rótulo),
// nunca uma rampa de valor por barra. `percent` é relativo ao MAIOR valor da
// série (não ao total), para que a barra mais alta sempre preencha 100%.
export interface BarItem {
  label: string;
  value: number;
  /** Valor já formatado para exibição (BRL, compacto, etc. — conforme a métrica). */
  valueLabel: string;
  /** Texto auxiliar opcional ao lado do valor (ex.: "3,7% da receita"). */
  caption?: string;
  /** 0–100, relativo ao maior valor da série. */
  percent: number;
}

export interface ToBarItemsOptions<T> {
  captionFn?: (row: T) => string;
  /** Formatador do valor exibido; padrão `formatCompact` (contagens). */
  formatValue?: (value: number) => string;
}

export function toBarItems<T>(
  rows: T[],
  labelFn: (row: T) => string,
  valueFn: (row: T) => number,
  options?: ToBarItemsOptions<T>,
): BarItem[] {
  const { captionFn, formatValue = formatCompact } = options ?? {};
  const sorted = [...rows].sort((a, b) => valueFn(b) - valueFn(a));
  const max = sorted.reduce((acc, row) => Math.max(acc, valueFn(row)), 0);

  return sorted.map(row => {
    const value = valueFn(row);
    return {
      label: labelFn(row),
      value,
      valueLabel: formatValue(value),
      caption: captionFn ? captionFn(row) : undefined,
      percent: max > 0 ? (value / max) * 100 : 0,
    };
  });
}

// ─── Linha indexada (2 séries, 1 eixo) ─────────────────────────────────────
// "Curtidas × Compras" tem duas métricas de escalas muito diferentes
// (curtidas na casa dos milhares, compras na casa das centenas). Um gráfico
// de eixo duplo (2 eixos Y) é anti-pattern (inventa correlação visual que não
// existe no dado) — em vez disso, cada série é indexada ao seu próprio valor
// inicial (100 = início do período) e as duas passam a caber num único eixo
// percentual, comparável.
export const LINE_VIEWBOX = { width: 100, height: 40, padding: 6 };

export interface IndexedLinePoint {
  x: number;
  y: number;
  index: number;   // valor indexado (100 = início do período)
  raw: number;      // valor absoluto original, para rótulo/legenda
  data: string;      // data ISO do ponto, como veio da API
}

export interface IndexedLineSeries {
  key: 'curtidas' | 'compras';
  label: string;
  color: string;
  points: IndexedLinePoint[];
  lastPoint: IndexedLinePoint | null;
}

function buildIndexedPoints(raws: number[], dates: string[]): { index: number; raw: number; data: string }[] {
  // Base defensiva: se o primeiro ponto do período for 0, indexar geraria
  // Infinity/NaN. Usa 1 como piso só para o cálculo da razão — o valor bruto
  // exibido ao usuário continua sendo o real.
  const base = raws[0] || 1;
  return raws.map((raw, i) => ({
    index: (raw / base) * 100,
    raw,
    data: dates[i],
  }));
}

export function toIndexedLineSeries(points: LikesVsSalesPoint[]): IndexedLineSeries[] {
  if (!points || points.length === 0) return [];

  const dates = points.map(p => p.data);
  const curtidas = buildIndexedPoints(points.map(p => p.curtidas), dates);
  const compras = buildIndexedPoints(points.map(p => p.compras), dates);

  // Escala vertical compartilhada pelas duas séries (1 eixo só), incluindo
  // sempre a linha de base 100 para a leitura "acima/abaixo do início".
  const allIndexes = [...curtidas, ...compras].map(p => p.index).concat(100);
  const min = Math.min(...allIndexes);
  const max = Math.max(...allIndexes);
  const range = max - min || 1;

  const { width, height, padding } = LINE_VIEWBOX;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  const lastIdx = points.length - 1 || 1;

  const project = (raw: { index: number; raw: number; data: string }[]): IndexedLinePoint[] =>
    raw.map((p, i) => ({
      x: padding + (i / lastIdx) * plotWidth,
      y: padding + plotHeight - ((p.index - min) / range) * plotHeight,
      index: p.index,
      raw: p.raw,
      data: p.data,
    }));

  const curtidasPoints = project(curtidas);
  const comprasPoints = project(compras);

  return [
    {
      key: 'curtidas',
      label: 'Curtidas',
      color: CHART_COLORS.primary,
      points: curtidasPoints,
      lastPoint: curtidasPoints[curtidasPoints.length - 1] ?? null,
    },
    {
      key: 'compras',
      label: 'Compras',
      color: CHART_COLORS.secondary,
      points: comprasPoints,
      lastPoint: comprasPoints[comprasPoints.length - 1] ?? null,
    },
  ];
}

/** Posição Y (SVG) da linha de base 100% — para desenhar a hairline de referência. */
export function baselineY(series: IndexedLineSeries[]): number | null {
  const anyPoint = series[0]?.points?.[0];
  if (!anyPoint) return null;
  // Recalcula a mesma escala usada em toIndexedLineSeries para achar onde 100 cai.
  const allIndexes = series.flatMap(s => s.points.map(p => p.index)).concat(100);
  const min = Math.min(...allIndexes);
  const max = Math.max(...allIndexes);
  const range = max - min || 1;
  const { height, padding } = LINE_VIEWBOX;
  const plotHeight = height - padding * 2;
  return padding + plotHeight - ((100 - min) / range) * plotHeight;
}
