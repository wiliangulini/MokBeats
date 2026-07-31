import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-pagination',
    template: `
    <nav aria-label="Page navigation" *ngIf="totalPages > 1">
      <ul class="pagination mb-0 d-flex justify-content-center align-items-center">
        <li class="page-item previous" [class.disabled]="currentPage === 1">
          <a
            class="page-link"
            (click)="changePage(currentPage - 1)"
            style="cursor: pointer;"
            [attr.aria-disabled]="currentPage === 1"
          >
            <span class="material-icons">navigate_before</span>
          </a>
        </li>

        <li
          *ngFor="let page of visiblePages"
          class="page-item"
          [class.active]="page === currentPage"
        >
          <a
            class="page-link"
            (click)="changePage(page)"
            style="cursor: pointer;"
          >
            {{ page }}
          </a>
        </li>

        <li class="page-item next" [class.disabled]="currentPage === totalPages">
          <a
            class="page-link"
            (click)="changePage(currentPage + 1)"
            style="cursor: pointer;"
            [attr.aria-disabled]="currentPage === totalPages"
          >
            <span class="material-icons">navigate_next</span>
          </a>
        </li>
      </ul>
    </nav>
  `,
    styles: [`
    .page-link {
      color: #4b3a8f;
      background-color: transparent;
      border: 1px solid rgba(75, 58, 143, 0.3);
    }

    .page-link:hover {
      color: #fff;
      background-color: rgba(75, 58, 143, 0.2);
      border-color: #4b3a8f;
    }

    .page-item.active .page-link {
      background-color: #4b3a8f;
      border-color: #4b3a8f;
      color: #fff;
      font-weight: bold;
    }

    .page-item.disabled .page-link {
      cursor: not-allowed !important;
      opacity: 0.5;
      pointer-events: none;
    }

    .pagination {
      gap: 0.5rem;
    }

    .page-link .material-icons {
      font-size: 20px;
      line-height: 1;
    }
  `],
    standalone: false
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() maxVisiblePages: number = 5;
  @Output() pageChange = new EventEmitter<number>();

  /**
   * Calcula quais páginas devem ser exibidas na paginação
   * Mostra no máximo maxVisiblePages páginas por vez, centralizando a página atual
   */
  get visiblePages(): number[] {
    const pages: number[] = [];
    const half = Math.floor(this.maxVisiblePages / 2);

    // Calcula o início e fim da janela de páginas visíveis
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);

    // Ajusta o início se não houver páginas suficientes no final
    if (end - start + 1 < this.maxVisiblePages) {
      start = Math.max(1, end - this.maxVisiblePages + 1);
    }

    // Gera array de páginas
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  /**
   * Navega para uma página específica
   * @param page Número da página (1-indexed)
   */
  changePage(page: number): void {
    // Valida se a página está no range válido e é diferente da atual
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
