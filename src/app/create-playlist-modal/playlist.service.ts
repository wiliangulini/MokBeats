import {Injectable} from '@angular/core';
import {CrudService} from "../service/crud-service";
import {playlists} from "./create-playlist-modal.component";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlaylistService extends CrudService<playlists>{

  constructor(
    protected override http: HttpClient,
  ) {
    super(http, `${environment.API}playlists`);
  }
  
  override list(): Observable<playlists> {
    return super.list();
  }
  
  override loadByID(id: number): Observable<playlists> {
    return super.loadByID(id);
  }
  
  override save(record: playlists): Observable<playlists> {
    return super.save(record);
  }
}
