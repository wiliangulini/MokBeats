import { toBarItems, toIndexedLineSeries, baselineY } from './dashboard.charts';
import { LikesVsSalesPoint } from './dashboard.models';

interface Row {
  nome: string;
  valor: number;
}

describe('toBarItems', () => {
  it('ordena do maior para o menor e normaliza o percentual ao maior valor', () => {
    const rows: Row[] = [
      { nome: 'A', valor: 10 },
      { nome: 'B', valor: 100 },
      { nome: 'C', valor: 50 },
    ];

    const items = toBarItems(rows, r => r.nome, r => r.valor);

    expect(items.map(i => i.label)).toEqual(['B', 'C', 'A']);
    expect(items[0].percent).toBe(100);
    expect(items[1].percent).toBe(50);
    expect(items[2].percent).toBe(10);
  });

  it('retorna lista vazia sem lançar erro', () => {
    expect(toBarItems<Row>([], r => r.nome, r => r.valor)).toEqual([]);
  });

  it('não divide por zero quando o maior valor da série é 0', () => {
    const rows: Row[] = [{ nome: 'A', valor: 0 }, { nome: 'B', valor: 0 }];
    const items = toBarItems(rows, r => r.nome, r => r.valor);
    expect(items.every(i => i.percent === 0)).toBe(true);
    expect(items.every(i => Number.isFinite(i.percent))).toBe(true);
  });

  it('aplica formatValue e captionFn customizados', () => {
    const rows: Row[] = [{ nome: 'A', valor: 4680 }];
    const items = toBarItems(rows, r => r.nome, r => r.valor, {
      formatValue: v => `R$ ${v}`,
      captionFn: () => '3,7%',
    });
    expect(items[0].valueLabel).toBe('R$ 4680');
    expect(items[0].caption).toBe('3,7%');
  });

  it('usa formatCompact como formatador padrão quando nenhum é informado', () => {
    const rows: Row[] = [{ nome: 'A', valor: 1500 }];
    const items = toBarItems(rows, r => r.nome, r => r.valor);
    expect(items[0].valueLabel).toBe('1,5K');
  });
});

describe('toIndexedLineSeries', () => {
  const points: LikesVsSalesPoint[] = [
    { data: '2026-03-10', curtidas: 100, compras: 20 },
    { data: '2026-03-11', curtidas: 150, compras: 30 },
    { data: '2026-03-12', curtidas: 50,  compras: 10 },
  ];

  it('retorna lista vazia quando não há pontos', () => {
    expect(toIndexedLineSeries([])).toEqual([]);
  });

  it('indexa a 100 o primeiro ponto de cada série', () => {
    const series = toIndexedLineSeries(points);
    expect(series).toHaveLength(2);
    expect(series[0].points[0].index).toBe(100);
    expect(series[1].points[0].index).toBe(100);
  });

  it('preserva o valor bruto (raw) para exibição em legenda/tabela', () => {
    const series = toIndexedLineSeries(points);
    const curtidas = series.find(s => s.key === 'curtidas')!;
    expect(curtidas.points.map(p => p.raw)).toEqual([100, 150, 50]);
    expect(curtidas.lastPoint?.raw).toBe(50);
  });

  it('usa base defensiva quando o primeiro valor do período é 0 (evita Infinity/NaN)', () => {
    const zeroStart: LikesVsSalesPoint[] = [
      { data: '2026-03-10', curtidas: 0, compras: 0 },
      { data: '2026-03-11', curtidas: 10, compras: 5 },
    ];
    const series = toIndexedLineSeries(zeroStart);
    for (const s of series) {
      for (const p of s.points) {
        expect(Number.isFinite(p.index)).toBe(true);
      }
    }
  });

  it('projeta um único ponto sem dividir por zero (índice do último ponto = 1-1=0)', () => {
    const single: LikesVsSalesPoint[] = [{ data: '2026-03-10', curtidas: 10, compras: 2 }];
    const series = toIndexedLineSeries(single);
    expect(series[0].points).toHaveLength(1);
    expect(Number.isFinite(series[0].points[0].x)).toBe(true);
    expect(Number.isFinite(series[0].points[0].y)).toBe(true);
  });
});

describe('baselineY', () => {
  it('retorna null quando não há série/ponto', () => {
    expect(baselineY([])).toBeNull();
  });

  it('retorna uma coordenada Y finita quando há dados', () => {
    const points: LikesVsSalesPoint[] = [
      { data: '2026-03-10', curtidas: 100, compras: 20 },
      { data: '2026-03-11', curtidas: 200, compras: 10 },
    ];
    const series = toIndexedLineSeries(points);
    const y = baselineY(series);
    expect(y).not.toBeNull();
    expect(Number.isFinite(y as number)).toBe(true);
  });
});
