import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LicencaValorComponent } from './licenca-valor.component';
import { LICENCAS_MUSICA_POR_PERIODO } from './licenca-valor.models';

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

  it('inicia com o período de 6 meses selecionado', () => {
    expect(component.periodoLicencaMusicaSelecionado).toBe('6');
    expect(component.licencaMusicaAtual).toEqual(LICENCAS_MUSICA_POR_PERIODO['6']);
  });

  it('troca o período e os dados expostos ao selecionar 12 meses', () => {
    component.selecionarPeriodoLicencaMusica('12');

    expect(component.periodoLicencaMusicaSelecionado).toBe('12');
    expect(component.licencaMusicaAtual).toEqual(LICENCAS_MUSICA_POR_PERIODO['12']);
  });

  it('atualiza o preço renderizado ao clicar no botão do toggle 6/12 meses, sem reload', () => {
    const botoes = fixture.debugElement.queryAll(By.css('#myTab1 .nav-item button'));
    expect(botoes.length).toBe(2);

    const precoAntes = fixture.debugElement.query(By.css('.card.two .price .h2')).nativeElement.textContent.trim();
    expect(precoAntes).toBe(LICENCAS_MUSICA_POR_PERIODO['6'].precoLabel);

    botoes[1].nativeElement.click();
    fixture.detectChanges();

    const precoDepois = fixture.debugElement.query(By.css('.card.two .price .h2')).nativeElement.textContent.trim();
    expect(precoDepois).toBe(LICENCAS_MUSICA_POR_PERIODO['12'].precoLabel);
    expect(component.periodoLicencaMusicaSelecionado).toBe('12');
  });

  it('renderiza os preços dos cards de assinatura mensal e efeitos sonoros a partir das constantes', () => {
    const precoMensal = fixture.debugElement.query(By.css('.card.one .price .h2')).nativeElement.textContent.trim();
    const precoEfeitos = fixture.debugElement.query(By.css('.card.three .price .h2')).nativeElement.textContent.trim();

    expect(precoMensal).toBe(component.assinaturaMensal.precoLabel);
    expect(precoEfeitos).toBe(component.licencaEfeitosSonoros.precoLabel);
  });
});
