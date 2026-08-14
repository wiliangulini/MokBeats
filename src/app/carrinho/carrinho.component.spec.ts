import type { MockedObject } from "vitest";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { CartItem, CommercialPlanOption, LicenseOption, } from './cartModal/cart-modal.models';
import { CarrinhoService } from '../service/carrinho.service';
import { CarrinhoComponent } from './carrinho.component';

describe('CarrinhoComponent', () => {
    let component: CarrinhoComponent;
    let fixture: ComponentFixture<CarrinhoComponent>;
    let cartService: MockedObject<CarrinhoService>;
    let itemsSubject: BehaviorSubject<CartItem[]>;

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

    const centsTotal = (items: CartItem[]): number =>
        items.reduce((total, item) => total + Math.round(item.planoSelecionado.preco * 100), 0) / 100;

    beforeEach(async () => {
        itemsSubject = new BehaviorSubject<CartItem[]>(cartItems);

        cartService = {
            cartItems$: itemsSubject.asObservable(),
            cartTotal$: itemsSubject.asObservable().pipe(map(centsTotal)),
            removeItem: vi.fn().mockName("CarrinhoService.removeItem").mockImplementation((item: CartItem) => {
                const next = itemsSubject.value.filter((current) => current !== item);
                itemsSubject.next(next);
                return next;
            }),
        } as unknown as MockedObject<CarrinhoService>;

        await TestBed.configureTestingModule({
            declarations: [CarrinhoComponent],
            providers: [
                { provide: CarrinhoService, useValue: cartService },
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

    it('should delegate item removal to the cart service', () => {
        component.removeItem(cartItems[0]);

        expect(cartService.removeItem).toHaveBeenCalledWith(cartItems[0]);
    });

    it('should show the empty cart state when there are no items left', () => {
        itemsSubject.next([]);
        fixture.detectChanges();

        expect(component.insert).toBe(false);
        expect(fixture.nativeElement.textContent).toContain('Seu carrinho está vazio');
    });
});
