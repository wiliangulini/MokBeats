import {Injectable} from '@angular/core';
import {Musica} from "../musicas/musicas.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  favorit: any[];

  arrMusica: Musica[] = [];

  constructor(
    private http: HttpClient,
  ) {
    this.favorit = [];
    this.listMusic().subscribe((data: any) => {
      this.arrMusica = data;
    })
  }

  private readonly API_MUSIC = `${environment.API}MUSICAS`

  private listMusic() {
    return this.http.get<Musica>(`${this.API_MUSIC}`).pipe();
  }

  sendFavorite(elm: any) {

    for (let i= 0; i < this.arrMusica.length; i++) {
      if(this.arrMusica[i].id == elm.id) {
        this.favorit.push(this.arrMusica[i]);
      }
    }

  }

  addFavorite() {
    return this.favorit;
  }
}
