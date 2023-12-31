import {AfterContentInit, Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CreatePlaylistModalComponent, playlists} from "../create-playlist-modal/create-playlist-modal.component";
import {PlaylistService} from "../create-playlist-modal/playlist.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EMPTY} from "rxjs";
import {Musica} from "../musicas/musicas.service";


@Component({
  selector: 'app-add-playlist-modal',
  templateUrl: './add-playlist-modal.component.html',
  styleUrls: ['./add-playlist-modal.component.scss']
})
export class AddPlaylistModalComponent implements OnInit, AfterContentInit {
  
  newMusicPlaylist!: Musica;
  insert: boolean = false;
  playlist: playlists = {};
  arrPlaylist: any[] = [];
  numMusics: any[] = [];
  
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private playlistService: PlaylistService,
    private snackBar: MatSnackBar,
  ) {}
  
  ngOnInit(): void {}
  
  ngAfterContentInit() {
    this.createPlaylist();
    this.musicExistsPlaylist();
  }
  
  private numMusicPlaylist(data: any) {
    data.forEach((e: any) => {
      e.music === undefined ? this.numMusics.push(0) : EMPTY;
      (e.music?.length === undefined && e.music.id > 0) ? this.numMusics.push(1) : this.numMusics.push(e.music?.length);
    })
  }
  
  private musicExistsPlaylist() {
    let playMusicExist: any[] = [];
    this.playlistService.list().subscribe((playlist: any) => {
      playlist.forEach((e: any) => {
        if(e.music.length > 0) {
          for(let i: number = 0; i < e.music.length; i++) {
            if(e.music[i].id === this.newMusicPlaylist.id) {
              playMusicExist.push(e.name)
            }
          }
        } else if(e.music.length == undefined && e.music.id > 0) {
          console.log(e.music.id)
          for(let i: number = 0; i < playlist.length; i++) {
            if(e.music.id === this.newMusicPlaylist.id) {
              playMusicExist.push(e.name);
              break;
            }
          }
        }
      });
      this.numMusicPlaylist(playlist);
      setTimeout(() => {
        document.querySelectorAll('.buttonPlaylist').forEach((e: any) => {
          let nome: any = e.children[0].innerText.slice(0, -4);
          console.log(nome)
          for(let i in playMusicExist) {
            if(playMusicExist[i] === nome) {
              e.classList.add('filtragem');
              e.setAttribute('data-toogle','tooltip');
              e.setAttribute('data-placement','top');
              e.setAttribute('title','Música já existente na playlist');
              e.addEventListener('click', (ev: any) => {
                ev.preventDefault();
                ev.stopPropagation();
              })
            }
          }
        })
      }, 250);
    });
  }
  
  private createPlaylist() {
    this.playlistService.list().subscribe((data: any) => {
      this.arrPlaylist = data;
      this.arrPlaylist.length > 0 ? this.insert = true : this.insert = false;
    })
  }
  
  public closeModal() {
    return this.activeModal.close();
  }
  public openModal() {
    const activeModal = this.modalService.open(CreatePlaylistModalComponent, {size: 'md', modalDialogClass: 'modal-dialog-centered', container: 'body', backdrop: 'static', keyboard: false});
    activeModal.componentInstance.dataNewPlaylist(this.newMusicPlaylist);
    activeModal.result.then((res: any) => {
      console.log(res);
      this.playlist = res;
      this.createPlaylist();
      this.closeModal();
    })
  }
  
  public addNewMusicPlaylist(element: Musica) {
    this.newMusicPlaylist = element;
    return this.newMusicPlaylist;
  }
  
  addMusicPlaylist(evt: any) {
    this.playlist = evt;
    console.log(this.insert)
    if(this.insert) {
      if (evt.music.length === undefined) {
        let musicas: any[] = [];
        musicas.push(evt.music);
        musicas.forEach((e: any) => {
          e.id !== this.newMusicPlaylist.id ? musicas.push(this.newMusicPlaylist) : alert('Error, Música já existente na playlist');
        });
        this.playlist.music = musicas;
      } else if(evt.music.length > 0) {
        this.playlist.music.push(this.newMusicPlaylist);
        console.log(this.playlist)
      }
      this.save();
    }
  }
  
  save() {
    this.playlistService.save(this.playlist).subscribe((data: any) => {
      if (data.id !== undefined) {
        console.log(data);
        this.snackBar.open('Música adicionada a playlist com SUCESSO!!!', '', {duration: 5000});
      } else {
        this.snackBar.open('ERRO ao adicionar música a playlist!!!', '', {duration: 5000});
      }
      this.closeModal();
    });
  }
}
