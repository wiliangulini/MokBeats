import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartModalComponent } from '../carrinho/cartModal/cart-modal.component';
import {
  CartItem,
  CartSelection,
} from '../carrinho/cartModal/cart-modal.models';
import { Musica } from '../musicas/musicas.service';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  // Estado em memória (singleton `providedIn: 'root'`): não há persistência em
  // localStorage/backend, então o carrinho é perdido em reload de página ou
  // nova aba. Ver docs/ia-auditorias/R26-carrinho-modelo-item-contador-licenca.md.
  private readonly cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  public readonly cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();
  public readonly cartCount$: Observable<number> = this.cartItems$.pipe(
    map((items) => items.length)
  );

  constructor(
    private modalService: NgbModal,
    ) { }

  public receivingCart(elm: CartItem): CartItem[] {
    const currentItems = this.cartItemsSubject.value;
    const isDuplicate = currentItems.some((item) =>
      this.isSameCartItem(item, elm)
    );

    const nextItems = isDuplicate ? currentItems : [...currentItems, elm];
    this.cartItemsSubject.next(nextItems);

    return nextItems;
  }

  public receivingCart2(): CartItem[] {
    return this.cartItemsSubject.value;
  }
  
  public openModalCart(music: Musica): Promise<CartItem | null> {
    const activeModal = this.modalService.open(CartModalComponent, {
      size: 'lg',
      modalDialogClass: 'modal-dialog-centered',
      container: 'body',
      backdrop: 'static',
      keyboard: false,
    });

    activeModal.componentInstance.music = music;

    return activeModal.result
      .then((selection: CartSelection | undefined) => {
        if (!selection) {
          return null;
        }

        const cartItem: CartItem = {
          ...music,
          ...selection,
        };

        this.receivingCart(cartItem);
        return cartItem;
      })
      .catch(() => null);
  }

  private isSameCartItem(current: CartItem, candidate: CartItem): boolean {
    return (
      this.isSameMusic(current, candidate) &&
      current.licencaSelecionada.id === candidate.licencaSelecionada.id &&
      current.planoSelecionado.id === candidate.planoSelecionado.id
    );
  }

  private isSameMusic(current: Musica, candidate: Musica): boolean {
    if (current.id != null && candidate.id != null) {
      return current.id === candidate.id;
    }

    if (current.url && candidate.url) {
      return current.url === candidate.url;
    }

    const currentName = current.nome_musica?.trim();
    const candidateName = candidate.nome_musica?.trim();
    const currentProducer = current.nome_produtor?.trim();
    const candidateProducer = candidate.nome_produtor?.trim();

    return Boolean(
      currentName &&
      candidateName &&
      currentProducer &&
      candidateProducer &&
      currentName === candidateName &&
      currentProducer === candidateProducer
    );
  }
  
}
