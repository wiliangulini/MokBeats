import { empty, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MusicasService } from "../musicas/musicas.service";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input() hideSearch: boolean = false;

  generos: string[] = [];
  humor: string[] = [];
  private search$ = new Subject<string>();
  private destroyed = false;

  constructor(
    private musicService: MusicasService,
  ) {}

  ngOnInit(): void {
    // Carregar dados do backend
    this.musicService.getGeneros().subscribe((data: any) => this.generos = Array.isArray(data) ? data : []);
    this.musicService.getHumores().subscribe((data: any) => this.humor = Array.isArray(data) ? data : []);

    // Debounce de busca por gêneros (backend ?q)
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((q) => {
      if (this.destroyed) return;
      this.musicService.getGenresFull(q || undefined).subscribe((map: any) => {
        try { this.generos = Object.keys(map || {}); } catch (_) { this.generos = []; }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  filtrar() {
    let navleft = document.getElementById('navLeft');
    let cf = document.getElementById('cf');

    if(navleft!.getAttribute('style') == 'width: 13vw;' || navleft!.getAttribute('style') == 'width: 13vw; opacity: 1;') {
      navleft!.style.width = '0vw';
      navleft!.style.opacity = '0';
      cf!.style.width = '99vw';
    } else {
      navleft!.style.width = '13vw';
      navleft!.style.opacity = '1';
      cf!.style.width = '86vw';
    }
  }

  verifyGen() {
    let gender: any = document.getElementById('gender');
    let collapseOne: any = document.getElementById('collapseOne');

    collapseOne?.classList.contains('show') ? gender.click() : empty();
  }

  verifyHum() {
    let humor: any = document.getElementById('humor');
    let collapseOne1: any = document.getElementById('collapseOne1');

    collapseOne1?.classList.contains('show') ? humor.click() : empty();
  }

  onSearch(value: string) {
    this.search$.next((value || '').trim());
  }
}

