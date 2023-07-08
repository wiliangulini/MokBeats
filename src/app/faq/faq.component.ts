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

  //arrumar scroll ao clicar, funciona somente se tiver no inicio da pagina.
  infoValue(e: string) {
    if(e == 'Assinatura') {
      let assinatura = document.getElementById('assinatura');
      let scrollPosition: any = assinatura!.getBoundingClientRect();
      console.log(scrollPosition);
      let position: number = scrollPosition.top - 85;
      window.scrollTo({top: position, behavior: 'smooth'});
    } else if(e == 'Programa de indicação') {
      let programaDeIndicacao = document.getElementById('programaDeIndicacao');
      let scrollPosition: any = programaDeIndicacao!.getBoundingClientRect();
      let position: number = scrollPosition.top - 85;
      window.scrollTo({top: position, behavior: 'smooth'});
    } else if(e == 'Resolução de problemas') {
      let resolucaoDeProblemas = document.getElementById('resolucaoDeProblemas');
      let scrollPosition: any = resolucaoDeProblemas!.getBoundingClientRect();
      let position: number = scrollPosition.top - 85;
      window.scrollTo({top: position, behavior: 'smooth'});
    } else if(e == 'Músicas livres de direitos') {
      let music = document.getElementById('musicasFree');
      let scrollPosition: any = music!.getBoundingClientRect();
      let position: number = scrollPosition.top - 85;
      window.scrollTo({top: position, behavior: 'smooth'});
    } else if(e == 'Técnicas') {
      let tecnicas = document.getElementById('tecnicas');
      let scrollPosition: any = tecnicas!.getBoundingClientRect();
      let position: number = scrollPosition.top - 175;
      window.scrollTo({top: position, behavior: 'smooth'});
    } else if(e == 'Segurança') {
      let seguranca = document.getElementById('seguranca');
      let scrollPosition: any = seguranca!.getBoundingClientRect();
      let position: number = scrollPosition.top - 50;
      window.scrollTo({top: position, behavior: 'smooth'});
    }
  }

}
