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

  it('should not confirm without a selected license', () => {
    component.confirmSelection();

    expect(closeSpy).not.toHaveBeenCalled();
  });

  it('should close with the selected license on confirmation', () => {
    component.selectLicense('premium');
    component.confirmSelection();

    expect(closeSpy).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        id: 'premium',
        nome: 'Licença Premium',
      })
    );
  });

  it('should dismiss without returning a license on cancellation', () => {
    component.closeModal();

    expect(dismissSpy).toHaveBeenCalledOnceWith('cancel');
    expect(closeSpy).not.toHaveBeenCalled();
  });
});
