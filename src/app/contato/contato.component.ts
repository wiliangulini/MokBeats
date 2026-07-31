import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {ScrollService} from "../service/scroll.service";

@Component({
    selector: 'app-contato',
    templateUrl: './contato.component.html',
    styleUrls: ['./contato.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ContatoComponent implements OnInit {

  constructor(
    private scrollService: ScrollService,
  ) { }

  ngOnInit(): void {
    this.scrollService.scrollUp();
  }

}
