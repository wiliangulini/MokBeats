import {Component, OnInit} from '@angular/core';
import {ScrollService} from "../service/scroll.service";

@Component({
  selector: 'app-politica-privacidade',
  templateUrl: './politica-privacidade.component.html',
  styleUrls: ['./politica-privacidade.component.scss']
})
export class PoliticaPrivacidadeComponent implements OnInit {

  constructor(
    private scrollService: ScrollService,
  ) { }

  ngOnInit(): void {
    this.scrollService.scrollUp();
  }

}
