import {AfterContentInit, Component, OnDestroy, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Subscription} from "rxjs";
import {CarrinhoService} from "../service/carrinho.service";
import {CartItem} from "./cartModal/cart-modal.models";

@Component({
    selector: 'app-carrinho',
    templateUrl: './carrinho.component.html',
    styleUrls: ['./carrinho.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CarrinhoComponent implements OnInit, AfterContentInit, OnDestroy {

  nav: any;

  numberMusic: number = 0;
  musics: CartItem[] = [];
  price: number = 0;
  insert: boolean = false;

  private readonly currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  private cartItemsSubscription!: Subscription;
  private cartTotalSubscription!: Subscription;

  constructor(
    private cartService: CarrinhoService,
  ) {}

  ngOnInit(): void {
    this.cartItemsSubscription = this.cartService.cartItems$.subscribe((items) => {
      this.musics = items;
      this.numberMusic = items.length;
      this.insert = items.length > 0;
    });
    this.cartTotalSubscription = this.cartService.cartTotal$.subscribe((total) => {
      this.price = total;
    });
  }

  ngAfterContentInit() {
    this.nav = document.querySelector('nav');
    let url: string = location.href;
    let newUrl = url.slice(-8);
    if (this.nav) {
      (window.scrollY === 0 && newUrl === 'carrinho') ? this.nav.style.marginTop = '10px' : this.nav.style.marginTop = '0px';
    }
  }

  ngOnDestroy(): void {
    if (this.cartItemsSubscription) {
      this.cartItemsSubscription.unsubscribe();
    }
    if (this.cartTotalSubscription) {
      this.cartTotalSubscription.unsubscribe();
    }
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item);
  }

  formatPrice(price: number): string {
    return this.currencyFormatter.format(price);
  }

}
