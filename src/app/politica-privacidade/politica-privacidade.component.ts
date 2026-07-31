import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {ScrollService} from "../service/scroll.service";

@Component({
    selector: 'app-politica-privacidade',
    templateUrl: './politica-privacidade.component.html',
    styleUrls: ['./politica-privacidade.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PoliticaPrivacidadeComponent implements OnInit {

  constructor(
    private scrollService: ScrollService,
  ) { }

  ngOnInit(): void {
    this.scrollService.scrollUp();
  }

}
