import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CartModalComponent } from '../carrinho/cartModal/cart-modal.component';
import {
  CartItem,
  LicenseOption,
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
    this.music.push(elm);
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
      .then((selectedLicense: LicenseOption | undefined) => {
        if (!selectedLicense) {
          return null;
        }

        const cartItem: CartItem = {
          ...music,
          licencaSelecionada: selectedLicense,
        };

        this.receivingCart(cartItem);
        return cartItem;
      })
      .catch(() => null);
  }
  
}
