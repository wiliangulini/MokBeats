import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveSurferTestComponent } from './wave-surfer-test.component';

describe('WaveSurferTestComponent', () => {
  let component: WaveSurferTestComponent;
  let fixture: ComponentFixture<WaveSurferTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaveSurferTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaveSurferTestComponent);
    component = fixture.componentInstance;
    component.music = { id: 1, url: 'a.mp3', nome_musica: 'A' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
