import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-menu-produtor',
  templateUrl: './menu-produtor.component.html',
  styleUrls: ['./menu-produtor.component.scss']
})
export class MenuProdutorComponent implements OnInit {

  nome: string = 'Wilian Gulini';

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  closeModal() {
    return this.activeModal.close();
  }
}
