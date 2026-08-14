import type { MockedObject } from "vitest";
import { TestBed } from '@angular/core/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CartItem, CartSelection, CommercialPlanOption, LicenseOption, } from '../carrinho/cartModal/cart-modal.models';
import { Musica } from '../musicas/musicas.service';
import { CarrinhoService } from './carrinho.service';

describe('CarrinhoService', () => {
    let service: CarrinhoService;
    let modalService: MockedObject<NgbModal>;

    const music: Musica = {
        id: 1,
        nome_musica: 'Faixa de teste',
        nome_produtor: 'Produtor de teste',
    };

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

    const monthlySelection: CartSelection = {
        licencaSelecionada: standardLicense,
        planoSelecionado: monthlyPlan,
    };

    const getCartCount = (): number => {
        let count = 0;
        service.cartCount$.subscribe((value) => (count = value)).unsubscribe();
        return count;
    };

    const getCartTotal = (): number => {
        let total = 0;
        service.cartTotal$.subscribe((value) => (total = value)).unsubscribe();
        return total;
    };

    beforeEach(() => {
        modalService = {
            open: vi.fn().mockName("NgbModal.open")
        } as unknown as MockedObject<NgbModal>;

        TestBed.configureTestingModule({
            providers: [
                CarrinhoService,
                { provide: NgbModal, useValue: modalService },
            ],
        });

        service = TestBed.inject(CarrinhoService);
    });

    it('should not add an item before the modal is confirmed', async () => {
        const componentInstance: {
            music?: Musica;
        } = {};
        modalService.open.mockReturnValue({
            componentInstance,
            result: Promise.resolve(monthlySelection),
        } as NgbModalRef);

        const resultPromise = service.openModalCart(music);

        expect(service.receivingCart2()).toEqual([]);
        expect(componentInstance.music).toBe(music);

        const result = await resultPromise;

        expect(result).toEqual(expect.objectContaining({
            id: music.id,
            licencaSelecionada: standardLicense,
            planoSelecionado: monthlyPlan,
        }));
    });

    it('should add exactly one item with the selected license and plan after confirmation', async () => {
        modalService.open.mockReturnValue({
            componentInstance: {},
            result: Promise.resolve(monthlySelection),
        } as NgbModalRef);

        await service.openModalCart(music);

        const cartItems: CartItem[] = service.receivingCart2();
        expect(cartItems.length).toBe(1);
        expect(cartItems[0].licencaSelecionada).toBe(standardLicense);
        expect(cartItems[0].planoSelecionado).toBe(monthlyPlan);
        expect(getCartCount()).toBe(1);
    });

    it('should not add the same music, license and plan twice', async () => {
        modalService.open.mockReturnValue({
            componentInstance: {},
            result: Promise.resolve(monthlySelection),
        } as NgbModalRef);

        await service.openModalCart(music);
        await service.openModalCart({ ...music });

        expect(service.receivingCart2().length).toBe(1);
        expect(getCartCount()).toBe(1);
    });

    it('should allow the same music and license with a different plan', () => {
        const monthlyItem: CartItem = {
            ...music,
            ...monthlySelection,
        };
        const sixMonthItem: CartItem = {
            ...music,
            licencaSelecionada: standardLicense,
            planoSelecionado: sixMonthPlan,
        };

        service.receivingCart(monthlyItem);
        service.receivingCart(sixMonthItem);

        expect(service.receivingCart2().length).toBe(2);
        expect(getCartCount()).toBe(2);
    });

    it('should use the music url as duplicate fallback when id is unavailable', () => {
        const firstItem: CartItem = {
            nome_musica: 'Faixa sem id',
            nome_produtor: 'Produtor',
            url: 'faixa-sem-id.mp3',
            ...monthlySelection,
        };
        const repeatedItem: CartItem = {
            ...firstItem,
            nome_musica: 'Outro nome',
        };

        service.receivingCart(firstItem);
        service.receivingCart(repeatedItem);

        expect(service.receivingCart2().length).toBe(1);
    });

    it('should use music and producer names as duplicate fallback', () => {
        const firstItem: CartItem = {
            nome_musica: 'Faixa sem identificador',
            nome_produtor: 'Produtor',
            ...monthlySelection,
        };

        service.receivingCart(firstItem);
        service.receivingCart({ ...firstItem });

        expect(service.receivingCart2().length).toBe(1);
    });

    it('should not change the cart or counter when the modal is cancelled', async () => {
        service.receivingCart({
            ...music,
            ...monthlySelection,
        });
        modalService.open.mockReturnValue({
            componentInstance: {},
            result: Promise.reject('cancel'),
        } as NgbModalRef);

        const result = await service.openModalCart(music);

        expect(result).toBeNull();
        expect(service.receivingCart2().length).toBe(1);
        expect(getCartCount()).toBe(1);
    });

    it('should expose cartCount$ as a hot observable that reflects the cart without reload', () => {
        const emissions: number[] = [];
        service.cartCount$.subscribe((count) => emissions.push(count));

        expect(emissions).toEqual([0]);

        service.receivingCart({
            ...music,
            ...monthlySelection,
        });

        expect(emissions).toEqual([0, 1]);
    });

    it('should expose cartTotal$ as the sum of the selected plans', () => {
        const monthlyItem: CartItem = { ...music, ...monthlySelection };
        const sixMonthItem: CartItem = {
            ...music,
            id: 2,
            licencaSelecionada: standardLicense,
            planoSelecionado: sixMonthPlan,
        };

        expect(getCartTotal()).toBe(0);

        service.receivingCart(monthlyItem);
        expect(getCartTotal()).toBe(49.99);

        service.receivingCart(sixMonthItem);
        expect(getCartTotal()).toBe(249.98);
    });

    it('should remove a matching item from the cart', () => {
        const monthlyItem: CartItem = { ...music, ...monthlySelection };
        const sixMonthItem: CartItem = {
            ...music,
            id: 2,
            licencaSelecionada: standardLicense,
            planoSelecionado: sixMonthPlan,
        };

        service.receivingCart(monthlyItem);
        service.receivingCart(sixMonthItem);

        const remaining = service.removeItem(monthlyItem);

        expect(remaining).toEqual([sixMonthItem]);
        expect(service.receivingCart2()).toEqual([sixMonthItem]);
        expect(getCartCount()).toBe(1);
        expect(getCartTotal()).toBe(199.99);
    });

    it('should be a no-op when removing an item that is not in the cart', () => {
        const monthlyItem: CartItem = { ...music, ...monthlySelection };
        const unrelatedItem: CartItem = {
            id: 99,
            nome_musica: 'Outra faixa',
            nome_produtor: 'Outro produtor',
            licencaSelecionada: standardLicense,
            planoSelecionado: sixMonthPlan,
        };

        service.receivingCart(monthlyItem);
        const result = service.removeItem(unrelatedItem);

        expect(result).toEqual([monthlyItem]);
        expect(getCartCount()).toBe(1);
    });
});
