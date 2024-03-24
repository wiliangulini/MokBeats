import { Injectable } from '@angular/core';
import {Musica} from "../musicas/musicas.service";

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  music: Musica[] = [];
  
  constructor() { }
  
  public receivingCart(elm: Musica) {
    this.music.push(elm);
    return this.music;
  }
  public receivingCart2() {
    console.log(this.music);
    return this.music;
  }
}
