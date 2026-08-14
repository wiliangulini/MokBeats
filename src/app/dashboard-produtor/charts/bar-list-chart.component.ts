import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BarItem } from '../dashboard.charts';

/**
 * Lista de barras horizontais para métricas de série única (uma linha por
 * entidade — origem, faixa, música), ordenadas do maior para o menor valor.
 * Série única não usa legenda (a identidade já está no rótulo de cada linha)
 * nem rampa de cor por valor — todas as barras usam o mesmo tom de destaque,
 * conforme a skill `dataviz` (regra: "one series → one color for every bar").
 */
@Component({
    selector: 'app-bar-list-chart',
    template: `
    <ul class="bar-list" *ngIf="items.length">
      <li class="bar-row" *ngFor="let item of items">
        <span class="bar-label" [title]="item.label">{{ item.label }}</span>
        <span class="bar-track">
          <span class="bar-fill" [style.width.%]="item.percent"></span>
        </span>
        <span class="bar-caption" *ngIf="item.caption">{{ item.caption }}</span>
        <span class="bar-value">{{ item.valueLabel }}</span>
      </li>
    </ul>
  `,
    styles: [`
    .bar-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .bar-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.4rem 0;
    }

    .bar-row + .bar-row {
      border-top: 1px solid #f0eff2;
    }

    .bar-label {
      flex: 0 0 38%;
      min-width: 0;
      font-size: 0.82rem;
      color: #212121;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bar-track {
      flex: 1 1 auto;
      min-width: 24px;
      height: 10px;
      border-radius: 5px;
      background-color: #ece8f6;
      overflow: hidden;
      display: block;
    }

    .bar-fill {
      display: block;
      height: 100%;
      border-radius: 0 4px 4px 0;
      background-color: #4b3a8f;
    }

    .bar-caption {
      flex: 0 0 auto;
      font-size: 0.7rem;
      color: #898781;
      min-width: 44px;
      text-align: right;
    }

    .bar-value {
      flex: 0 0 auto;
      min-width: 56px;
      text-align: right;
      font-weight: 600;
      font-size: 0.82rem;
      color: #212121;
      font-variant-numeric: tabular-nums;
    }
  `],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BarListChartComponent {
  @Input() items: BarItem[] = [];
}
