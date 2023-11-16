import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Music} from "../musicas/musicas.service";
import {empty} from "rxjs";

@Component({
  selector: 'app-create-playlist-modal',
  templateUrl: './create-playlist-modal.component.html',
  styleUrls: ['./create-playlist-modal.component.scss']
})
export class CreatePlaylistModalComponent implements OnInit {
  
  musicAddPlaylist!: Music;
  playlist: any = {};
  form: FormGroup;
  
  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      playlist_name: [null, Validators.required],
      playlist_description: [null],
    })
  }
  
  ngOnInit(): void {
  }
  
  public closeModal() {
    return this.activeModal.close();
  }
  
  public dataNewPlaylist(event: Music) {
    this.musicAddPlaylist = event;
    return this.musicAddPlaylist;
  }
  
  private createPlaylist() {
    (this.form.valid && this.playlist.name.length >= 3) ? this.playlist.musica = this.musicAddPlaylist : empty();
  }
  
  save() {
    if (this.form.valid) {
      this.createPlaylist();
      console.log(this.playlist);
      this.activeModal.close(this.playlist);
    } else {
      console.log('error');
      alert('Erro ao criar Playlist');
    }
  }
  
}
