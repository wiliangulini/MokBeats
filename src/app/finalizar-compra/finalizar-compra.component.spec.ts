import type { MockedObject } from "vitest";
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { CartItem, CommercialPlanOption, LicenseOption } from '../carrinho/cartModal/cart-modal.models';
import { CarrinhoService } from '../service/carrinho.service';
import { UserProfileService } from '../service/user-profile.service';
import { FinalizarCompraComponent } from './finalizar-compra.component';

describe('FinalizarCompraComponent', () => {
    let component: FinalizarCompraComponent;
    let fixture: ComponentFixture<FinalizarCompraComponent>;

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

    const cartItems: CartItem[] = [
        {
            id: 1,
            nome_musica: 'Faixa mensal',
            nome_produtor: 'Produtor',
            licencaSelecionada: standardLicense,
            planoSelecionado: monthlyPlan,
        },
    ];

    const configure = async (items: CartItem[] = cartItems, total = 49.99) => {
        TestBed.resetTestingModule();

        const cartService = {
            cartItems$: of(items),
            cartTotal$: of(total),
        } as unknown as MockedObject<CarrinhoService>;

        const profileService = {
            getSnapshot: vi.fn().mockReturnValue(null),
            getProfile: vi.fn().mockReturnValue(of({})),
        } as unknown as MockedObject<UserProfileService>;

        await TestBed.configureTestingModule({
            declarations: [FinalizarCompraComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: CarrinhoService, useValue: cartService },
                { provide: UserProfileService, useValue: profileService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(FinalizarCompraComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    beforeEach(async () => {
        await configure();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should take the total and items from the cart instead of a fixed value', () => {
        expect(component.total).toBe(49.99);
        expect(component.musics).toEqual(cartItems);
        expect(component.checkoutState).toBe('formulario');
    });

    it('should block submission and list an error when terms are not accepted', () => {
        component.form.patchValue({
            nomeProjeto: 'Meu projeto',
            formaDePagamento: 'PIX',
            aceiteTermos: false,
        });

        component.onSubmit();

        expect(component.pedidoSimulado).toBeNull();
        expect(component.errorSummary).toContain('É necessário aceitar os termos do Contrato de Licença.');
    });

    it('should block submission when the project name is missing', () => {
        component.form.patchValue({
            nomeProjeto: '',
            formaDePagamento: 'PIX',
            aceiteTermos: true,
        });

        component.onSubmit();

        expect(component.pedidoSimulado).toBeNull();
        expect(component.errorSummary).toContain('Nome do projeto é obrigatório.');
    });

    it('should register a simulated order — not a real one — when the form is valid', () => {
        component.form.patchValue({
            nomeProjeto: 'Meu projeto',
            observacoes: 'Entregar rápido',
            formaDePagamento: 'PIX',
            aceiteTermos: true,
        });

        component.onSubmit();

        expect(component.errorSummary).toEqual([]);
        expect(component.checkoutState).toBe('confirmado');
        expect(component.pedidoSimulado).toEqual(expect.objectContaining({
            status: 'simulado',
            nomeProjeto: 'Meu projeto',
            observacoes: 'Entregar rápido',
            formaDePagamento: 'PIX',
            total: 49.99,
            itens: cartItems,
        }));
    });

    it('should show the empty cart state when there are no items', async () => {
        await configure([], 0);

        expect(component.checkoutState).toBe('vazio');
    });
});
