import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlaylistModalComponent } from './add-playlist-modal.component';

describe('AddPlaylistModalComponent', () => {
  let component: AddPlaylistModalComponent;
  let fixture: ComponentFixture<AddPlaylistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlaylistModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPlaylistModalComponent);
    component = fixture.componentInstance;
    // Define uma música para evitar undefined no template
    (component as any).newMusicPlaylist = { id: 1, nome_musica: 'Teste', nome_produtor: 'Prod' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
