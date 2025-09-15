import { ElementRef } from '@angular/core';
import { PlaceholderEllipsisDirective } from './placeholder-ellipsis.directive';

describe('PlaceholderEllipsisDirective', () => {
  it('deve criar e acrescentar reticências ao placeholder', () => {
    const input = document.createElement('input');
    input.placeholder = 'Nome';
    const directive = new PlaceholderEllipsisDirective(new ElementRef<HTMLInputElement>(input));
    // simula lifecycle
    directive.ngAfterViewInit();
    expect(input.placeholder).toBe('Nome...');
  });
});
