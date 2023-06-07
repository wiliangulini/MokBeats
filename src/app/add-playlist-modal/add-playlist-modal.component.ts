import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {MusicasService} from "../musicas/musicas.service";

@Component({
  selector: 'app-add-playlist-modal',
  templateUrl: './add-playlist-modal.component.html',
  styleUrls: ['./add-playlist-modal.component.scss']
})
export class AddPlaylistModalComponent implements OnInit {

  addMusicPlaylist: any;

  constructor(
    private activeModal: NgbActiveModal,
    private musicService: MusicasService,
  ) {
    this.addMusicPlaylist = this.musicService.addMusicPlaylist;
  }

  ngOnInit(): void {
  }

  public closeModal() {
    return this.activeModal.close();
  }
}
