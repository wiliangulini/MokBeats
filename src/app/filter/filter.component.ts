import { empty, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MusicasService } from "../musicas/musicas.service";

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss'],
    standalone: false
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input() hideSearch: boolean = false;
  @Output() filterToggle = new EventEmitter<void>();

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
    this.filterToggle.emit();
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
