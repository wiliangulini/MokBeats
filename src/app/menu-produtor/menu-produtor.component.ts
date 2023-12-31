import {AfterContentInit, Component} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PlaylistService} from "../create-playlist-modal/playlist.service";

@Component({
  selector: 'app-menu-produtor',
  templateUrl: './menu-produtor.component.html',
  styleUrls: ['./menu-produtor.component.scss']
})
export class MenuProdutorComponent implements AfterContentInit {

  nome: string = 'Wilian Gulini';
  numberPlaylist: string = 'Nenhuma playlist ainda';
  txt: string = '';
  insert: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private playlistService: PlaylistService,
  ) { }

  ngAfterContentInit(): void {
    this.playlistService.list().subscribe((data: any) => {
      if(data.length > 0) {
        let svg: any = document.getElementById('svgPlaylist');
        let controlTXT: any = document.querySelector('.controlTXT p.h6');
        controlTXT.classList.remove('mt-2');
        controlTXT.style.fontSize = '72px';
        controlTXT.style.right = '5%';
        svg!.style.display = 'none';
        this.insert = true;
        data.length === 1 ?  this.txt = 'PLAYLIST' : this.txt = 'PLAYLISTS';
        this.numberPlaylist = data.length;
      }
    });
  }

  closeModal() {
    return this.activeModal.close();
  }
}
