import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtualizarInformacoesComponent } from './atualizar-informacoes.component';

describe('AtualizarInformacoesComponent', () => {
  let component: AtualizarInformacoesComponent;
  let fixture: ComponentFixture<AtualizarInformacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtualizarInformacoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtualizarInformacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
