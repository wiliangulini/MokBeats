import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ScrollService} from "../service/scroll.service";

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  @ViewChild('menuL', {static: true}) menuL!:ElementRef;
  @ViewChild('control', {static: true}) control!:ElementRef;

  @HostListener('window:scroll') onWindowScroll() {
    if (window.scrollY < 657) {
      this.menuL.nativeElement.style.position = 'initial';
      this.control.nativeElement.style.marginLeft = '0%';
    } else {
      this.menuL.nativeElement.style.position = 'fixed';
      this.menuL.nativeElement.style.top = '10%';
      this.control.nativeElement.style.marginLeft = '25%';
    }
  }

  menuLeft: Array<any> = [
    { value: "Assinatura", viewValue: "Assinatura" },
    { value: "Programa de indicação", viewValue: "Programa de indicação" },
    { value: "Resolução de problemas", viewValue: "Resolução de problemas" },
    { value: "Músicas livres de direitos", viewValue: "Músicas livres de direitos" },
    { value: "Técnicas", viewValue: "Técnicas" },
    { value: "Segurança", viewValue: "Segurança" },
  ];
  constructor(
    private scrollService: ScrollService,
  ) { }

  ngOnInit(): void {
    this.scrollService.scrollUp();
  }

  array: any = [
    "bottom: 4488.25",
    "height: 519.59375",
    "left: 667.5",
    "right: 1308.75",
    "top: 3968.65625",
    "width: 641.25",
    "x: 667.5",
    "y: 3968.65625",
  ]

  private position(e: number) {
    window.scrollTo({top: e, behavior: 'smooth'});
  }

  //arrumar scroll ao clicar, funciona somente se tiver no inicio da pagina.
  infoValue(e: string) {

    if(e == 'Assinatura') {

      let assinatura = document.getElementById('assinatura');
      let scrollPosition: any = assinatura!.getBoundingClientRect();
      this.position(scrollPosition.y + window.scrollY - 100);

    } else if(e == 'Programa de indicação') {

      let programaDeIndicacao = document.getElementById('programaDeIndicacao');
      let scrollPosition: any = programaDeIndicacao!.getBoundingClientRect();
      this.position(scrollPosition.y + window.scrollY - 100);

    } else if(e == 'Resolução de problemas') {

      let resolucaoDeProblemas = document.getElementById('resolucaoDeProblemas');
      let scrollPosition: any = resolucaoDeProblemas!.getBoundingClientRect();
      this.position(scrollPosition.y + window.scrollY - 100);

    } else if(e == 'Músicas livres de direitos') {

      let music = document.getElementById('musicasFree');
      let scrollPosition: any = music!.getBoundingClientRect();
      this.position(scrollPosition.y + window.scrollY - 100);

    } else if(e == 'Técnicas') {

      let tecnicas = document.getElementById('tecnicas');
      let scrollPosition: any = tecnicas!.getBoundingClientRect();
      this.position(scrollPosition.y + window.scrollY - 100);

    } else if(e == 'Segurança') {

      let seguranca = document.getElementById('seguranca');
      let scrollPosition: any = seguranca!.getBoundingClientRect();
      this.position(scrollPosition.y + window.scrollY - 100);

    }
  }

}
