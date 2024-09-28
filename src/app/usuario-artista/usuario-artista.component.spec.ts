import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioArtistaComponent } from './usuario-artista.component';

describe('UsuarioArtistaComponent', () => {
  let component: UsuarioArtistaComponent;
  let fixture: ComponentFixture<UsuarioArtistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuarioArtistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioArtistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
