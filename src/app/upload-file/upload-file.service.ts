import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// export class Course {
//   id?: number;
//   name?: string;
//   releaseDate?: string;
//   description?: string;
//   duration?: number;
//   code?: string;
//   rating?: number;
//   price?: number;
//   imageUrl?: string;
// }

export class Musicas {
  id?: number;
  nome_musica?: string;
  nome_produtor?: string;
  duracao?: number;
  bpm?: number;
  trechos?: number;
  loops?: number;
}


@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  
  private musicasUrl: string = 'http://localhost:3100/api/musicas';

  constructor(
    private http: HttpClient
  ) { }

  upload(files: Set<File>, url: string) {
    console.log(files, url);
    const formData = new FormData();
    files.forEach(file => formData.append('file', file, file.name));

    const request = new HttpRequest('POST', url, formData);
    return this.http.request(request);
  }

  public list2(): Observable<Musicas[]> {
    return this.http.get<Musicas[]>(this.musicasUrl);
  }
  
  public loadById(id: number) {
    return this.http.get<Musicas[]>(`${this.musicasUrl}/${id}`).pipe();
  }
}