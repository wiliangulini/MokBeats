import type { Mock } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CartModalComponent } from './cart-modal.component';

describe('CartModalComponent', () => {
    let component: CartModalComponent;
    let fixture: ComponentFixture<CartModalComponent>;
    let closeSpy: Mock;
    let dismissSpy: Mock;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CartModalComponent],
            providers: [NgbActiveModal],
        })
            .compileComponents();

        const activeModal = TestBed.inject(NgbActiveModal);
        closeSpy = vi.spyOn(activeModal, 'close').mockReturnValue(undefined);
        dismissSpy = vi.spyOn(activeModal, 'dismiss').mockReturnValue(undefined);

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
        const getConfirmButton = (): HTMLButtonElement => fixture.nativeElement.querySelector('.confirm-button');

        expect(getConfirmButton().disabled).toBe(true);

        component.selectLicense('padrao');
        fixture.detectChanges();
        expect(getConfirmButton().disabled).toBe(true);

        component.selectPlan('mensal');
        fixture.detectChanges();
        expect(getConfirmButton().disabled).toBe(false);
    });

    it('should close with the selected license and plan on confirmation', () => {
        component.selectLicense('premium');
        component.selectPlan('12-meses');
        component.confirmSelection();

        expect(closeSpy).toHaveBeenCalledTimes(1);

        expect(closeSpy).toHaveBeenCalledWith(expect.objectContaining({
            licencaSelecionada: expect.objectContaining({
                id: 'premium',
                nome: 'Licença Premium',
            }),
            planoSelecionado: expect.objectContaining({
                id: '12-meses',
                preco: 249.99,
            }),
        }));
    });

    it('should dismiss without returning a license on cancellation', () => {
        component.closeModal();

        expect(dismissSpy).toHaveBeenCalledTimes(1);

        expect(dismissSpy).toHaveBeenCalledWith('cancel');
        expect(closeSpy).not.toHaveBeenCalled();
    });
});
