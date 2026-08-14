import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItem } from '../carrinho/cartModal/cart-modal.models';
import { CarrinhoService } from '../service/carrinho.service';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with the cart badge hidden (count 0)', () => {
    expect(component.cartCount).toBe(0);
  });

  it('should update the cart count reactively from CarrinhoService, without direct DOM access', () => {
    const cartService = TestBed.inject(CarrinhoService);
    const item: CartItem = {
      id: 1,
      nome_musica: 'Faixa de teste',
      nome_produtor: 'Produtor de teste',
      licencaSelecionada: {
        id: 'padrao',
        nome: 'Licença Padrão',
        descricao: 'Descrição',
        beneficios: ['Benefício'],
      },
      planoSelecionado: {
        id: 'mensal',
        nome: 'Mensal',
        duracaoMeses: 1,
        preco: 49.99,
      },
    };

    cartService.receivingCart(item);
    fixture.detectChanges();

    expect(component.cartCount).toBe(1);
  });
});
