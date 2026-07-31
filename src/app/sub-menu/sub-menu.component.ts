import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../login/auth.service';

@Component({
    selector: 'app-sub-menu',
    templateUrl: './sub-menu.component.html',
    styleUrls: ['./sub-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SubMenuComponent implements OnInit {

  nome: string = 'Wilian Gulini';

  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  get isProdutor(): boolean {
    return this.auth.isProdutor();
  }

}
