import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pag-playlist',
  templateUrl: './pag-playlist.component.html',
  styleUrls: ['./pag-playlist.component.scss']
})
export class PagPlaylistComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('pag-playlist');
  }

}
