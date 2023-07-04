import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicencaValorComponent } from './licenca-valor.component';

describe('LicencaValorComponent', () => {
  let component: LicencaValorComponent;
  let fixture: ComponentFixture<LicencaValorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicencaValorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicencaValorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
