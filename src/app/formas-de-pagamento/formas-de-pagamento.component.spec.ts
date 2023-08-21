import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormasDePagamentoComponent } from './formas-de-pagamento.component';

describe('FormasDePagamentoComponent', () => {
  let component: FormasDePagamentoComponent;
  let fixture: ComponentFixture<FormasDePagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormasDePagamentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormasDePagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
