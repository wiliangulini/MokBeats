import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfeitosSonorosComponent } from './efeitosSonoros.component';

describe('EfeitosSonorosComponent', () => {
    let component: EfeitosSonorosComponent;
    let fixture: ComponentFixture<EfeitosSonorosComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EfeitosSonorosComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EfeitosSonorosComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('deve desabilitar o botao de previa de audio (SFX ainda nao possui audio/id/url reais)', () => {
        const previewButton: HTMLButtonElement = fixture.nativeElement.querySelector('button.svg');
        expect(previewButton).toBeTruthy();
        expect(previewButton.disabled).toBe(true);
        expect(previewButton.title).toContain('Prévia indisponível');
    });
});
