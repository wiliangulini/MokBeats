import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagPlaylistComponent } from './pag-playlist.component';

describe('PagPlaylistComponent', () => {
  let component: PagPlaylistComponent;
  let fixture: ComponentFixture<PagPlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagPlaylistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
