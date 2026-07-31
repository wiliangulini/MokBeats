import {AfterContentInit, Component, ChangeDetectionStrategy} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {PlaylistService} from "../create-playlist-modal/playlist.service";
import {FavoritosService} from "../favoritos/favoritos.service";
import {AuthService} from "../login/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-menu-produtor',
    templateUrl: './menu-produtor.component.html',
    styleUrls: ['./menu-produtor.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class MenuProdutorComponent implements AfterContentInit {

  nome: string = 'Wilian Gulini';
  numberPlaylist: string = 'Nenhuma playlist ainda';
  likeNumber: string = 'Nenhuma curtida ainda';
  txt: string = '';
  txtLike: string = '';
  insert: boolean = false;
  insertLike: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private playlistService: PlaylistService,
    private likeService: FavoritosService,
    private authService: AuthService,
    private router: Router,
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
    this.likeService.list().subscribe((data: any) => {
      console.log(data);
      let svg: any = document.getElementById('svgLike');
      let txtLike: any = document.querySelector('.txtLike p.h6');
      txtLike.classList.remove('mt-2');
      txtLike.style.fontSize = '72px';
      txtLike.style.right = '5%';
      svg!.style.display = 'none';
      this.insertLike = true;
      data.length === 1 ? this.txtLike = 'CURTIDA' : this.txtLike = 'CURTIDAS';
      this.likeNumber = data.length;
    })
  }

  get isProdutor(): boolean {
    return this.authService.isProdutor();
  }

  closeModal() {
    return this.activeModal.close();
  }

  logout() {
    // Faz logout removendo o token e atualizando o estado de autenticação
    this.authService.logout();

    // Fecha o modal
    this.activeModal.close();

    // Redireciona para a página inicial
    this.router.navigate(['/']);
  }
}
