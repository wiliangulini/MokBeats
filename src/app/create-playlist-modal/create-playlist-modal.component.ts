import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Music} from "../musicas/musicas.service";

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
  }
  
  namePlaylist: any;
  descriptionPlaylist: any;
  
  public createPlaylist() {
    console.log(this.playlist);
    console.log(this.musicAddPlaylist);
    if (this.form.valid && this.playlist.name.length >= 3) {
      return this.playlist
    }
    this.closeModal();
  }
  
}
