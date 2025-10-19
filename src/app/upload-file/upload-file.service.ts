import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from "../service/crud-service";
import { environment } from "../../environments/environment";

export class Musicas {
  id?: number;
  nome_musica?: string;
  nome_produtor?: string;
  duracao?: number;
  bpm?: number;
  trechos?: number;
  loops?: number;
}

export type UPLOADS = {
  id?: number,
  name?: string,
  size?: number,
  type?: string,
  base64?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadFileService extends CrudService<UPLOADS>{

  private readonly baseUrl = environment.apiBaseUrl;
  private readonly musicasUrl: string = `${this.baseUrl}/musicas`;

  constructor(
    protected override http: HttpClient
  ) {
    super(http, `${environment.apiBaseUrl}/uploads`);
  }

  override list(): Observable<UPLOADS[]> {
    return super.list();
  }

  override save(record: any): Observable<UPLOADS> {
    return super.save(record);
  }

  override remove(id: number): Observable<UPLOADS> {
    return super.remove(id);
  }

  upload(files: Set<File>, url: string) {
    console.log(files, url);
    const formData = new FormData();
    files.forEach(file => formData.append('file', file, file.name));

    const request = new HttpRequest('POST', url, formData);
    return this.http.request(request);
  }

  uploadProducerTrack(fd: FormData) {
    return this.http.post(`${this.baseUrl}/producers/track`, fd);
  }

  public list2(): Observable<Musicas[]> {
    return this.http.get<Musicas[]>(this.musicasUrl);
  }

  public loadById(id: number) {
    return this.http.get<Musicas[]>(`${this.musicasUrl}/${id}`).pipe();
  }
}
