import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  music: CartItem[] = [];
  
  constructor(
    private modalService: NgbModal,
    ) { }
  
  public receivingCart(elm: CartItem): CartItem[] {
    const isDuplicate = this.music.some((item) =>
      this.isSameCartItem(item, elm)
    );

    if (!isDuplicate) {
      this.music.push(elm);
    }

    const cartCounter = document.querySelector<HTMLElement>('#ms_number');

    if (cartCounter) {
      cartCounter.textContent = String(this.music.length);
      cartCounter.style.display = this.music.length > 0 ? 'flex' : 'none';
    }

    return this.music;
  }

  public receivingCart2(): CartItem[] {
    return this.music;
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
