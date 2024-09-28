import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PlaylistService} from "./playlist.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Musica} from "../musicas/musicas.service";

export interface playlists {
  id?: number;
  name?: string;
  data_alteracao?: string;
  description?: string;
  music?: any | undefined;
}

@Component({
  selector: 'app-create-playlist-modal',
  templateUrl: './create-playlist-modal.component.html',
  styleUrls: ['./create-playlist-modal.component.scss']
})
export class CreatePlaylistModalComponent implements OnInit {
  
  musicAddPlaylist: Musica[] = [];
  playlist: playlists = {};
  form: FormGroup;
  
  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private createPlaylistService: PlaylistService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      name: [null, Validators.required],
      description: [null],
    })
  }
  
  ngOnInit(): void {
  }
  
  public closeModal() {
    return this.activeModal.close();
  }
  
  public dataNewPlaylist(event: any): Musica[] {
    console.log(event)
    this.musicAddPlaylist.push(event);
    console.log(this.musicAddPlaylist)
    return this.musicAddPlaylist;
  }
  
  private formatDate(date: any): string {
    const _date: Date = new Date(date);
    const day: string = ('0' + _date.getDate()).slice(-2);
    const month: string = ('0' + (_date.getMonth() + 1)).slice(-2);
    const year: number = _date.getFullYear();
    console.log(`${day}/${month}/${year}`);
    return `${day}/${month}/${year}`;
  }
  
  private createPlaylist() {
    this.playlist.data_alteracao = this.formatDate(new Date());
    if (this.musicAddPlaylist == undefined) {
      if(this.form.valid && this.form.get('name')?.value.length >= 3) {
        this.playlist.music = [];
      }
    } else if (this.form.valid && this.form.get('name')?.value.length >= 3) {
      this.playlist.music = this.musicAddPlaylist;
    }
  }
  
  save() {
    if (this.form.valid) {
      this.createPlaylist();
      console.log(this.playlist)
      this.createPlaylistService.save(this.playlist).subscribe((data: any) => {
        if (data.id !== undefined) {
          console.log(data);
          this.snackBar.open('Playlist criada com SUCESSO!!!', '', {duration: 10000});
        } else {
          this.snackBar.open('ERRO ao criar Playlist!!!', '', {duration: 5000});
        }
      })
      this.activeModal.close(this.playlist);
    } else {
      console.log('error');
      alert('Erro ao criar Playlist');
    }
  }
  
}
