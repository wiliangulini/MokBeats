import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss']
})
export class CartModalComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
    ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.closeModal();
    }, 2000);
  }
  
  closeModal() {
    this.activeModal.close();
  }

}
