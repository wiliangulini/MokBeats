import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CartModalComponent } from './cart-modal.component';

describe('CartModalComponent', () => {
  let component: CartModalComponent;
  let fixture: ComponentFixture<CartModalComponent>;
  let closeSpy: jasmine.Spy;
  let dismissSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartModalComponent],
      providers: [NgbActiveModal],
    })
    .compileComponents();

    const activeModal = TestBed.inject(NgbActiveModal);
    closeSpy = spyOn(activeModal, 'close');
    dismissSpy = spyOn(activeModal, 'dismiss');

    fixture = TestBed.createComponent(CartModalComponent);
    component = fixture.componentInstance;
    component.music = {
      id: 1,
      nome_musica: 'Faixa de teste',
      nome_produtor: 'Produtor de teste',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the selected music and producer', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('Faixa de teste');
    expect(content).toContain('Produtor de teste');
  });

  it('should display the three commercial plans and their prices', () => {
    const content = fixture.nativeElement.textContent;

    expect(content).toContain('Mensal');
    expect(content).toContain('49,99');
    expect(content).toContain('6 meses');
    expect(content).toContain('199,99');
    expect(content).toContain('12 meses');
    expect(content).toContain('249,99');
  });

  it('should not confirm without both a selected license and plan', () => {
    component.selectLicense('padrao');
    component.confirmSelection();

    expect(closeSpy).not.toHaveBeenCalled();

    component.selectedLicenseId = null;
    component.selectPlan('mensal');
    component.confirmSelection();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should enable the confirmation button only after both selections', () => {
    const getConfirmButton = (): HTMLButtonElement =>
      fixture.nativeElement.querySelector('.confirm-button');

    expect(getConfirmButton().disabled).toBeTrue();

    component.selectLicense('padrao');
    fixture.detectChanges();
    expect(getConfirmButton().disabled).toBeTrue();

    component.selectPlan('mensal');
    fixture.detectChanges();
    expect(getConfirmButton().disabled).toBeFalse();
  });

  it('should close with the selected license and plan on confirmation', () => {
    component.selectLicense('premium');
    component.selectPlan('12-meses');
    component.confirmSelection();

    expect(closeSpy).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        licencaSelecionada: jasmine.objectContaining({
          id: 'premium',
          nome: 'Licença Premium',
        }),
        planoSelecionado: jasmine.objectContaining({
          id: '12-meses',
          preco: 249.99,
        }),
      })
    );
  });

  it('should dismiss without returning a license on cancellation', () => {
    component.closeModal();

    expect(dismissSpy).toHaveBeenCalledOnceWith('cancel');
    expect(closeSpy).not.toHaveBeenCalled();
  });
});
