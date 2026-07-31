import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-assinatura',
    templateUrl: './assinatura.component.html',
    styleUrls: ['./assinatura.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AssinaturaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
