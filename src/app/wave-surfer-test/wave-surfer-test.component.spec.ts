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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
