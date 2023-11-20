import {AfterContentInit, Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Music, MusicasService} from "../musicas/musicas.service";
import {CreatePlaylistModalComponent, playlists} from "../create-playlist-modal/create-playlist-modal.component";
import {PlaylistService} from "../create-playlist-modal/playlist.service";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-add-playlist-modal',
  templateUrl: './add-playlist-modal.component.html',
  styleUrls: ['./add-playlist-modal.component.scss']
})
export class AddPlaylistModalComponent implements OnInit, AfterContentInit {
  
  addMusicPL: Music;
  insert: boolean = false;
  playlist: playlists = {};
  arrPlaylist: any[] = [];
  
  constructor(
    private activeModal: NgbActiveModal,
    private musicService: MusicasService,
    private modalService: NgbModal,
    private playlistService: PlaylistService,
    private snackBar: MatSnackBar,
  ) {
    this.addMusicPL = this.musicService.addMusicPlaylist;
  }
  
  ngOnInit(): void {}
  
  ngAfterContentInit() {
    this.createPlaylist();
  }
  
  public createPlaylist() {
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
    activeModal.componentInstance.dataNewPlaylist(this.addMusicPL);
    activeModal.result.then((res: any) => {
      this.playlist = res;
      this.createPlaylist();
    })
  }
  
  addMusicPlaylist(evt: any) {
    this.playlist = evt;
    if (this.playlist.music.length == undefined) {
      let musicas: any[] = [];
      musicas.push(evt.music);
      musicas.forEach((e: any) => {
        e.id !== this.addMusicPL.id ? musicas.push(this.addMusicPL) : alert('Error, Música já existente na playlist');
      })
      this.playlist.music = musicas;
    } else if (this.playlist.music.length > 0) {
      this.playlist.music.forEach((e: any) => {
        console.log(e)
        e.id !== this.addMusicPL.id ? this.playlist.music.push(this.addMusicPL) : alert('Error, Música já existente na playlist');
      })
    }
    
    this.playlistService.save(this.playlist).subscribe((data: any) => {
      if (data.id !== undefined) {
        console.log(data);
        this.snackBar.open('Música adicionada a playlist com SUCESSO!!!', '', {duration: 5000});
      } else {
        this.snackBar.open('ERRO ao adicionar música a playlist!!!', '', {duration: 5000});
      }
    });
  }
}
