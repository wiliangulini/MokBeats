import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor() { }

  scrollUp() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}
