import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {MusicasService} from "../musicas/musicas.service";

@Component({
  selector: 'app-download-amostra',
  templateUrl: './download-amostra.component.html',
  styleUrls: ['./download-amostra.component.scss']
})
export class DownloadAmostraComponent implements OnInit {

  downloadMusic: any;

  constructor(
    private activeModal: NgbActiveModal,
    private musicService: MusicasService,
  ) {
    this.downloadMusic = this.musicService.downloadMusic;
  }

  ngOnInit(): void {
  }

  public closeModal() {
    return this.activeModal.close();
  }

}
