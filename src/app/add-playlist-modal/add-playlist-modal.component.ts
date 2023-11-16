import { Component, OnInit } from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Music, MusicasService} from "../musicas/musicas.service";
import {CreatePlaylistModalComponent} from "../create-playlist-modal/create-playlist-modal.component";
import {FormBuilder, FormGroup} from "@angular/forms";

// export interface playlists {
//   namePlaylist?: string;
//   descriptionPlaylist?: string;
//   musics?: {};
// }

@Component({
  selector: 'app-add-playlist-modal',
  templateUrl: './add-playlist-modal.component.html',
  styleUrls: ['./add-playlist-modal.component.scss']
})
export class AddPlaylistModalComponent implements OnInit {

  addMusicPlaylist: Music;
  insert: boolean = false;
  playlist: any = {};
  form: FormGroup;
  // nomePlaylist: any;
  // descriptionPlaylist: any;
  numberMusics: number = 0;

  constructor(
    private activeModal: NgbActiveModal,
    private musicService: MusicasService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) {
    this.addMusicPlaylist = this.musicService.addMusicPlaylist;
    this.form = this.fb.group({
      namePlaylist: [],
    });
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
      this.playlist = res;
      this.insert = true;
      setTimeout(() => {
        let input: any = document.getElementById('input');
        console.log(input);
        input.style.width = 'auto';
      }, 250)
      return this.playlist;
    })
  }
}
