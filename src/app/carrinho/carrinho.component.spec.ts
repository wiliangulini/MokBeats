import type { MockedObject } from "vitest";
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { CartItem, CommercialPlanOption, LicenseOption, } from './cartModal/cart-modal.models';
import { CarrinhoService } from '../service/carrinho.service';
import { CarrinhoComponent } from './carrinho.component';

describe('CarrinhoComponent', () => {
    let component: CarrinhoComponent;
    let fixture: ComponentFixture<CarrinhoComponent>;
    let cartService: MockedObject<CarrinhoService>;

    const standardLicense: LicenseOption = {
        id: 'padrao',
        nome: 'Licença Padrão',
        descricao: 'Descrição',
        beneficios: ['Benefício'],
    };

    const monthlyPlan: CommercialPlanOption = {
        id: 'mensal',
        nome: 'Mensal',
        duracaoMeses: 1,
        preco: 49.99,
    };

    const sixMonthPlan: CommercialPlanOption = {
        id: '6-meses',
        nome: '6 meses',
        duracaoMeses: 6,
        preco: 199.99,
    };

    const cartItems: CartItem[] = [
        {
            id: 1,
            nome_musica: 'Faixa mensal',
            nome_produtor: 'Produtor',
            licencaSelecionada: standardLicense,
            planoSelecionado: monthlyPlan,
        },
        {
            id: 2,
            nome_musica: 'Faixa semestral',
            nome_produtor: 'Produtor',
            licencaSelecionada: standardLicense,
            planoSelecionado: sixMonthPlan,
        },
    ];

    beforeEach(async () => {
        cartService = {
            receivingCart2: vi.fn().mockName("CarrinhoService.receivingCart2")
        } as unknown as MockedObject<CarrinhoService>;
        cartService.receivingCart2.mockReturnValue(cartItems);

        await TestBed.configureTestingModule({
            declarations: [CarrinhoComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: CarrinhoService, useValue: cartService },
                {
                    provide: HttpClient,
                    useValue: {
                        get: () => of([]),
                    },
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .compileComponents();

        fixture = TestBed.createComponent(CarrinhoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should calculate the total from selected plans in cents', () => {
        expect(component.numberMusic).toBe(2);
        expect(component.price).toBe(249.98);
    });

    it('should render music, license, plan and price data', () => {
        const content = fixture.nativeElement.textContent;

        expect(content).toContain('Faixa mensal');
        expect(content).toContain('Licença Padrão');
        expect(content).toContain('Mensal');
        expect(content).toContain('49,99');
        expect(content).toContain('total de R$');
        expect(content).toContain('249,98');
    });
});
