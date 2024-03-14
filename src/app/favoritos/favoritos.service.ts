import {Injectable} from '@angular/core';
import {Musica} from "../musicas/musicas.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CrudService} from "../service/crud-service";
import {Observable} from "rxjs";
import {AuthService} from "../login/auth.service";

@Injectable({
  providedIn: 'root'
})
export class FavoritosService extends CrudService<Musica> {
  
  favorit: any[];
  favoritos: any;
  favSave: any;
  arrMusica: Musica[] = [];
  hearth: any;
  hearth1: any;
  
  constructor(
    protected override http: HttpClient,
    private authService: AuthService,
  ) {
    super(http, `${environment.API}favoritos`);
    this.favorit = [];
    this.listMusic().subscribe((data: any) => {
      this.arrMusica = data;
    });
    
  }
  
  private readonly API_MUSIC1 = `${environment.API}musicas`
  
  private listMusic() {
    return this.http.get<Musica>(`${this.API_MUSIC1}`).pipe();
  }
  
  override list(): Observable<Musica> {
    return super.list();
  }
  
  override save(record: any): Observable<Musica> {
    return super.save(record);
  }
  
  override remove(id: number): Observable<Musica> {
    return super.remove(id);
  }
  
  public curtir(i: number) {
    this.authService.verificaLogin();
    this.list().subscribe((data: any) => {
      this.favoritos = data;
      
      for(let index = 0; this.favoritos.length > index; index++) {
        if(this.favoritos[index] === this.favoritos[i]) {
          console.log(this.favoritos[i]);
          this.remove(this.favoritos[i]?.id).subscribe((data: any) => {
            console.log(data);
          })
        }
      }
      console.log(this.favoritos)
    })
    
    if(this.authService.userAutetic()) {
      this.hearth = document.querySelectorAll('.hearth');
      this.hearth1 = document.querySelectorAll('.hearth1');
      
      if(this.hearth[i].style.display == 'block') {
        this.hearth[i].style.display = 'none';
        this.hearth1[i].style.display = 'block'; // curtida
      } else {
        this.hearth[i].style.display = 'block'; // descurtida
        this.hearth1[i].style.display = 'none';
      }
    }
  }
  
  sendFavorite(elm: any) {
    this.list().subscribe((data: any) => {
      this.favoritos = data;
      
      for (let i= 0; i < this.arrMusica.length; i++) {
        if(this.favoritos[i]?.id == elm.id) {
          alert('Música ja existente na playlist!!!');
          break;
        } else if(this.arrMusica[i].id == elm.id) {
          // console.log(this.arrMusica[i]);
          this.favorit.push(this.arrMusica[i]);
        }
      }
      
      for(let i: number = 0; i < this.favoritos.length; i++) {
        if(this.favorit[i]?.id !== this.favoritos[i]?.id && this.favorit[i]?.id !== undefined) {
          // console.log(this.favorit[i])
          this.favSave = this.favorit[i];
          this.save(this.favSave).subscribe((data: any) => {
            console.log(data);
          })
          // break;
        }
      }
      console.log(this.favSave);
      
      
      
    });
  }
  
  addFavorite() {
    return this.favorit;
  }
  
}
