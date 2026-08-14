import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IndexedLineSeries, LINE_VIEWBOX } from '../dashboard.charts';
import { formatCompact } from '../dashboard.models';

/**
 * Linha com duas séries de escalas muito diferentes (curtidas × compras),
 * cada uma indexada ao próprio valor inicial (100 = início do período) e
 * plotadas num único eixo — evita o anti-pattern de eixo duplo (2 escalas Y),
 * que inventaria uma correlação visual inexistente no dado (skill `dataviz`).
 *
 * O SVG é decorativo (`aria-hidden`); a tabela abaixo é a via de acesso real
 * aos valores (legenda + tabela == "table view" exigido pela skill), em vez
 * de depender de hover/crosshair customizado — redução deliberada de escopo
 * para esta etapa, documentada no relatório da R23.
 */
@Component({
    selector: 'app-line-chart',
    template: `
    <ng-container *ngIf="series.length">
      <div class="line-legend">
        <span class="legend-item" *ngFor="let s of series">
          <span class="legend-swatch" [style.background-color]="s.color"></span>
          {{ s.label }}
          <strong>{{ formatCompact(s.lastPoint?.raw ?? 0) }}</strong>
        </span>
      </div>

      <svg
        class="line-svg"
        [attr.viewBox]="'0 0 ' + viewBox.width + ' ' + viewBox.height"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false">
        <line
          *ngIf="baselineY !== null"
          class="line-baseline"
          [attr.x1]="viewBox.padding"
          [attr.x2]="viewBox.width - viewBox.padding"
          [attr.y1]="baselineY"
          [attr.y2]="baselineY" />
        <polyline
          *ngFor="let s of series"
          class="line-path"
          [attr.points]="pointsAttr(s)"
          [attr.stroke]="s.color" />
        <circle
          *ngFor="let s of series"
          class="line-end-ring"
          [attr.cx]="s.lastPoint?.x"
          [attr.cy]="s.lastPoint?.y"
          r="2" />
        <circle
          *ngFor="let s of series"
          class="line-end-dot"
          [attr.cx]="s.lastPoint?.x"
          [attr.cy]="s.lastPoint?.y"
          [attr.fill]="s.color"
          r="1.3" />
      </svg>

      <div class="line-table-wrap">
        <table class="line-table">
          <thead>
            <tr>
              <th scope="col">Data</th>
              <th scope="col" *ngFor="let s of series">{{ s.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let label of dateLabels; let i = index">
              <td>{{ label }}</td>
              <td *ngFor="let s of series">{{ formatCompact(s.points[i]?.raw ?? 0) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </ng-container>
  `,
    styles: [`
    .line-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 0.75rem;
      font-size: 0.82rem;
      color: #52514e;
    }

    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    .legend-item strong {
      color: #212121;
      font-variant-numeric: tabular-nums;
    }

    .legend-swatch {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
    }

    .line-svg {
      width: 100%;
      height: 140px;
      display: block;
    }

    .line-baseline {
      stroke: #e1e0d9;
      stroke-width: 0.3;
    }

    .line-path {
      fill: none;
      stroke-width: 0.7;
      stroke-linejoin: round;
      stroke-linecap: round;
    }

    .line-end-ring {
      fill: #fff;
    }

    .line-table-wrap {
      margin-top: 0.75rem;
      max-height: 160px;
      overflow-y: auto;
    }

    .line-table {
      width: 100%;
      font-size: 0.78rem;
      border-collapse: collapse;
    }

    .line-table th,
    .line-table td {
      padding: 0.25rem 0.5rem;
      text-align: right;
      font-variant-numeric: tabular-nums;
      border-bottom: 1px solid #f0eff2;
    }

    .line-table th:first-child,
    .line-table td:first-child {
      text-align: left;
      font-variant-numeric: normal;
    }

    .line-table th {
      color: #898781;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.68rem;
      letter-spacing: 0.03em;
    }
  `],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LineChartComponent {
  @Input() series: IndexedLineSeries[] = [];
  @Input() baselineY: number | null = null;

  readonly viewBox = LINE_VIEWBOX;
  readonly formatCompact = formatCompact;

  get dateLabels(): string[] {
    const first = this.series[0];
    if (!first) return [];
    return first.points.map(p => this.formatDate(p.data));
  }

  pointsAttr(series: IndexedLineSeries): string {
    return series.points.map(p => `${p.x},${p.y}`).join(' ');
  }

  private formatDate(iso: string): string {
    const parsed = new Date(`${iso}T00:00:00`);
    if (isNaN(parsed.getTime())) return iso;
    return parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
}
