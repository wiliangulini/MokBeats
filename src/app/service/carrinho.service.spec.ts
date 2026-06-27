import { TestBed } from '@angular/core/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CartItem, LicenseOption } from '../carrinho/cartModal/cart-modal.models';
import { Musica } from '../musicas/musicas.service';
import { CarrinhoService } from './carrinho.service';

describe('CarrinhoService', () => {
  let service: CarrinhoService;
  let modalService: jasmine.SpyObj<NgbModal>;

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
    preco: null,
    precoTemporario: true,
  };

  beforeEach(() => {
    modalService = jasmine.createSpyObj<NgbModal>('NgbModal', ['open']);

    TestBed.configureTestingModule({
      providers: [
        CarrinhoService,
        { provide: NgbModal, useValue: modalService },
      ],
    });

    service = TestBed.inject(CarrinhoService);
  });

  it('should not add an item before the modal is confirmed', async () => {
    const componentInstance: { music?: Musica } = {};
    modalService.open.and.returnValue({
      componentInstance,
      result: Promise.resolve(standardLicense),
    } as NgbModalRef);

    const resultPromise = service.openModalCart(music);

    expect(service.receivingCart2()).toEqual([]);
    expect(componentInstance.music).toBe(music);

    const result = await resultPromise;

    expect(result).toEqual(
      jasmine.objectContaining({
        id: music.id,
        licencaSelecionada: standardLicense,
      })
    );
  });

  it('should add exactly one item with the selected license after confirmation', async () => {
    modalService.open.and.returnValue({
      componentInstance: {},
      result: Promise.resolve(standardLicense),
    } as NgbModalRef);

    await service.openModalCart(music);

    const cartItems: CartItem[] = service.receivingCart2();
    expect(cartItems.length).toBe(1);
    expect(cartItems[0].licencaSelecionada).toBe(standardLicense);
  });

  it('should not change the cart when the modal is cancelled', async () => {
    modalService.open.and.returnValue({
      componentInstance: {},
      result: Promise.reject('cancel'),
    } as NgbModalRef);

    const result = await service.openModalCart(music);

    expect(result).toBeNull();
    expect(service.receivingCart2()).toEqual([]);
  });
});
