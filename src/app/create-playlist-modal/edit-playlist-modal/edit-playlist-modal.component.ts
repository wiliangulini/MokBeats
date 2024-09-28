import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Musica} from "../../musicas/musicas.service";
import {PlaylistService} from "../playlist.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {playlists} from "../create-playlist-modal.component";

@Component({
  selector: 'app-edit-playlist-modal',
  templateUrl: './edit-playlist-modal.component.html',
  styleUrls: ['./edit-playlist-modal.component.scss']
})
export class EditPlaylistModalComponent implements OnInit {
  
  playlistEdit!: playlists;
  playlist: playlists = {};
  form: FormGroup;
  
  constructor(
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private createPlaylistService: PlaylistService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      name: [null, Validators.required],
      description: [null],
    })
  }
  
  ngOnInit(): void {
  }
  
  public closeModal() {
    return this.activeModal.close();
  }
  
  public editarPlaylist(event: any) {
    console.log(event);
    this.playlistEdit = event;
    return this.playlistEdit;
  }
  
  private formatDate(date: any) {
    const _date = new Date(date);
    const day = ('0' + _date.getDate()).slice(-2);
    const month = ('0' + (_date.getMonth() + 1)).slice(-2);
    const year = _date.getFullYear();
    console.log(`${day}/${month}/${year}`);
    return `${day}/${month}/${year}`;
  }
  
  private editPlaylist() {
    this.playlist.data_alteracao = this.formatDate(new Date());
    if (this.form.valid && this.form.get('name')?.value.length >= 3) {
      console.log(this.playlistEdit);
      this.playlistEdit.name = this.playlist.name;
      this.playlistEdit.description = this.playlist.description;
      this.playlistEdit.data_alteracao = this.playlist.data_alteracao;
    }
  }
  
  save() {
    if (this.form.valid) {
      this.editPlaylist();
      this.createPlaylistService.save(this.playlistEdit).subscribe((data: any) => {
        if (data.id !== undefined) {
          console.log(data);
          this.snackBar.open('Playlist editada com SUCESSO!!!', '', {duration: 5000});
        } else {
          this.snackBar.open('ERRO ao criar Playlist!!!', '', {duration: 5000});
        }
      })
      this.activeModal.close(this.playlist);
    } else {
      console.log('error');
      alert('Erro ao criar Playlist');
    }
  }
  
}
