import {AfterContentInit, Injectable} from '@angular/core';
import {Musica} from "../musicas/musicas.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CrudService} from "../service/crud-service";
import {playlists} from "../create-playlist-modal/create-playlist-modal.component";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FavoritosService extends CrudService<Musica> implements AfterContentInit {

  favorit: any[];

  arrMusica: Musica[] = [];

  constructor(
    protected override http: HttpClient,
  ) {
    super(http, `${environment.API}favoritos`);
    this.favorit = [];
    this.listMusic().subscribe((data: any) => {
      this.arrMusica = data;
    });
   
  }

  private readonly API_MUSIC1 = `${environment.API}musicas`
  private readonly API_FAVORITO = `${environment.API}favoritos`

  private listMusic() {
    return this.http.get<Musica>(`${this.API_MUSIC1}`).pipe();
  }
  
  public listFavoritos() {
    return this.http.get<Musica>(`${this.API_FAVORITO}`).pipe();
  }

  favoritos: any;
  ngAfterContentInit() {
  
  }
  
  sendFavorite(elm: any) {
    this.listFavoritos().subscribe((data: any) => {
    this.favoritos = data;
    console.log(this.favoritos) // verificar this.favoritos[i] e this.arrMusica[i] ids nao podem ser igual se nao ja foi curtida
  })
    for (let i= 0; i < this.arrMusica.length; i++) {
      if(this.arrMusica[i].id == elm.id) {
        console.log(this.arrMusica[i]);
        this.favorit.push(this.arrMusica[i]);
      }
    }
    // this.save(this.favorit).subscribe((data: any) => {
    //   console.log(data);
    // })
    console.log(this.favorit);
    
    // this.listFavoritos().subscribe((data: any) => {
    //   console.log(data);
    // });

  }

  addFavorite() {
    return this.favorit;
  }
  
  override save(record: any): Observable<Musica> {
    return super.save(record);
  }
}
