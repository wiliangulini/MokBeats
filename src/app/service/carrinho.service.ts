import {Injectable} from '@angular/core';
import {Musica} from "../musicas/musicas.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CartModalComponent} from "../carrinho/cartModal/cart-modal.component";

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  music: Musica[] = [];
  
  constructor(
    private modalService: NgbModal,
    ) { }
  
  public receivingCart(elm: Musica) {
    this.music.push(elm);
    let ms_number: any = document.querySelector('#ms_number');
    ms_number.innerHTML = this.music.length;
    return this.music;
  }
  public receivingCart2() {
    return this.music;
  }
  
  public openModalCart() {
    this.modalService.open(CartModalComponent, {size: 'lg', modalDialogClass: 'modal-dialog-centered', container: 'body', backdrop: 'static', keyboard: false});
  }
  
}
