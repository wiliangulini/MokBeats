import {Component, OnInit} from '@angular/core';
import {ScrollService} from "../service/scroll.service";

@Component({
  selector: 'app-licenca-valor',
  templateUrl: './licenca-valor.component.html',
  styleUrls: ['./licenca-valor.component.scss'],
})
export class LicencaValorComponent implements OnInit {

  constructor(
    private scrollService: ScrollService,
  ) { }

  ngOnInit(): void {
    this.scrollService.scrollUp();
  }

}
