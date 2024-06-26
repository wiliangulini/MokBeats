import {AfterContentInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MusicasService} from "../musicas/musicas.service";
import {FavoritosService} from "../favoritos/favoritos.service";
import {ScrollService} from "../service/scroll.service";
import {Router} from "@angular/router";
import {PlaylistService} from "../create-playlist-modal/playlist.service";
import {CreatePlaylistModalComponent, playlists} from "../create-playlist-modal/create-playlist-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EMPTY} from "rxjs";
import {EditPlaylistModalComponent} from "../create-playlist-modal/edit-playlist-modal/edit-playlist-modal.component";

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit, AfterContentInit {
  
  playlists: any;
  arrMusic: any[] = [];
  insert: boolean = false;
  numF: number = 0;
  duration: any;
  titles: any[];
  music: any[];
  humor: any[];
  musicas: any = {};
  number!: number;
  formG!: FormGroup;
  select: string;
  arrFilter: Array<any> = [
    "Data de criação (mais recente)",
    "Data de criação (mais antiga)",
    "Data de alteração (mais recente)",
    "Data de alteração (mais antiga)",
    "Ordem alfabética (a-z)",
    "Ordem alfabética (z-a)",
  ];
  
  @Output('ngModelChange') update: any = new EventEmitter();
  
  constructor(
    private musicService: MusicasService,
    private likeService: FavoritosService,
    private modalService: NgbModal,
    private scrollService: ScrollService,
    private fb: FormBuilder,
    private playlistService: PlaylistService,
    private router: Router,
  ) {
    this.formG = this.fb.group({
      checkbox: [],
      bpm: [],
      duracao: [],
    });
    this.titles = this.musicService.convertida2;
    this.music = this.musicService.convertida;
    this.humor = this.musicService.humor;
    this.select = this.arrFilter[0];
  }
  
  ngOnInit(): void {
    this.scrollService.scrollUp();
    
    if (screen.width < 769) {
      document.getElementById('navLeft')!.style.width = '0';
    }
    this.arrMusic = this.likeService.addFavorite();
  }
  
  numMusics: any[] = [];
  
  ngAfterContentInit() {
    
    setTimeout(() => {
      let form = document.getElementById('form');
      let div1 = document.getElementById('div1');
      document.getElementById('btnOutS')!.style.display = 'none';
      document.getElementById('cf')!.style.justifyContent = 'flex-end';
      form!.style.marginRight = '1%';
      form!.style.paddingLeft = '0.5%';
      form!.style.maxWidth = '33.3%';
      div1!.style.flex = '0 0 40%';
      div1!.style.maxWidth = '40%';
    }, 25);
    
    this.playlistService.list().subscribe((data: any) => {
      data.forEach((e: any) => {
        e.music == undefined ? this.numMusics.push(0) : EMPTY;
        (e.music?.length == undefined && e.music.id > 0) ? this.numMusics.push(1) : this.numMusics.push(e.music?.length);
      })
      this.numF = this.numMusics.length;
      this.insert = true;
      this.playlists = data;
    })
  }
  
  curtir(i: number): void {
    this.musicService.curtir(i);
  }
  
  filtrar(): void {
    let navleft: any = document.getElementById('navLeft');
    if(navleft!.getAttribute('style') == 'width: 0px;' || navleft!.getAttribute('style') == 'width: 0px; opacity: 0; z-index: 0;') {
      navleft!.style.width = '96vw';
      navleft!.style.opacity = '1';
      navleft!.style.zIndex = '99999';
    } else {
      navleft!.style.width = '0';
      navleft!.style.opacity = '0';
      navleft!.style.zIndex = '0';
    }
  }
  
  link: any;
  
  copiarLink(i: any): void {
    let id = i.id;
    this.link = this.playlistService.copiarLink(id);
    this.execCopy().then();
  }
  async execCopy(): Promise<void> {
    await navigator.clipboard.writeText(this.link);
  }
  
  filtroP(e: any): void { this.select = e; }
  
  editPlaylist(data: playlists) {
    const activeModal = this.modalService.open(EditPlaylistModalComponent, {size: 'md', modalDialogClass: 'modal-dialog-centered', container: 'body', backdrop: 'static', keyboard: false});
    activeModal.componentInstance.editarPlaylist(data)
    activeModal.result.then((res: any) => {
      console.log(res);
    })
  }
  
  public createPlaylist() {
    this.playlistService.list().subscribe((data: any) => {
      this.playlists = data;
    })
  }
  
  createPlaylistModal() {
    const activeModal = this.modalService.open(CreatePlaylistModalComponent, {size: 'md', modalDialogClass: 'modal-dialog-centered', container: 'body', backdrop: 'static', keyboard: false});
    activeModal.result.then((res: any) => {
      console.log(res);
      this.insert = true;
      this.createPlaylist();
    })
  }
  
  pagPlaylist(data: any) {
    this.router.navigate(['/pagina-playlist'], {queryParams: {id: data.id}});
  }
  
}
