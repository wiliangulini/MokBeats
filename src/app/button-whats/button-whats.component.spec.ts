import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonWhatsComponent } from './button-whats.component';

describe('ButtonWhatsComponent', () => {
  let component: ButtonWhatsComponent;
  let fixture: ComponentFixture<ButtonWhatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonWhatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonWhatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
