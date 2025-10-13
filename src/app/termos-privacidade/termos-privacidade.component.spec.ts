import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermosPrivacidadeComponent } from './termos-privacidade.component';

describe('TermosPrivacidadeComponent', () => {
  let component: TermosPrivacidadeComponent;
  let fixture: ComponentFixture<TermosPrivacidadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermosPrivacidadeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermosPrivacidadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
