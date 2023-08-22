import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  favorit: any[] = [];

  constructor() { }

  ngOnInit() {}

  sendFavorite(elm: any) {
    this.favorit.push(elm)
  }

  addFavorite() {
    return this.favorit;
  }
}
