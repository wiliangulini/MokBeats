import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: 'input[placeholder], textarea[placeholder]' // aplica em todos que tiverem placeholder
})
export class PlaceholderEllipsisDirective implements AfterViewInit {

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const input = this.el.nativeElement as HTMLInputElement | HTMLTextAreaElement;
    if (input.placeholder && !input.placeholder.endsWith('...')) {
      input.placeholder = input.placeholder + '...';
    }
  }
}
