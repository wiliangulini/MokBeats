import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Music} from "../musicas/musicas.service";
import {empty} from "rxjs";
import {PlaylistService} from "./playlist.service";
import {MatSnackBar} from "@angular/material/snack-bar";

export interface playlists {
  id?: number;
  name?: string;
  description?: string;
  music?: any;
}

@Component({
  selector: 'app-create-playlist-modal',
  templateUrl: './create-playlist-modal.component.html',
  styleUrls: ['./create-playlist-modal.component.scss']
})
export class CreatePlaylistModalComponent implements OnInit {
  
  musicAddPlaylist!: Music[];
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
  
  public dataNewPlaylist(event: Music[]) {
    this.musicAddPlaylist = event;
    return this.musicAddPlaylist;
  }
  
  private createPlaylist() {
    (this.form.valid && this.form.get('name')?.value.length >= 3) ? this.playlist.music = this.musicAddPlaylist : empty();
  }
  
  save() {
    if (this.form.valid) {
      this.createPlaylist();
      this.createPlaylistService.save(this.playlist).subscribe((data: any) => {
        if (data.id !== undefined) {
          console.log(data);
          this.snackBar.open('Playlist criada com SUCESSO!!!', '', {duration: 5000});
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
