import { Component, OnInit } from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Music, MusicasService} from "../musicas/musicas.service";
import {CreatePlaylistModalComponent} from "../create-playlist-modal/create-playlist-modal.component";

@Component({
  selector: 'app-add-playlist-modal',
  templateUrl: './add-playlist-modal.component.html',
  styleUrls: ['./add-playlist-modal.component.scss']
})
export class AddPlaylistModalComponent implements OnInit {

  addMusicPlaylist: Music;

  constructor(
    private activeModal: NgbActiveModal,
    private musicService: MusicasService,
    private modalService: NgbModal,
  ) {
    this.addMusicPlaylist = this.musicService.addMusicPlaylist;
  }

  ngOnInit(): void {}

  public closeModal() {
    return this.activeModal.close();
  }
  public openModal() {
    const activeModal = this.modalService.open(CreatePlaylistModalComponent, {size: 'md', modalDialogClass: 'modal-dialog-centered', container: 'body', backdrop: 'static', keyboard: false});
    activeModal.componentInstance.dataNewPlaylist(this.addMusicPlaylist);
    activeModal.result.then((res: any) => {
      console.log(res);
      return res;
    })
  }
}
