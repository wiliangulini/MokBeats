import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {ScrollService} from "../service/scroll.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @ViewChild('footer', {static: true}) footer!:ElementRef;
  @ViewChild('btnW', {static: true}) btnW!:ElementRef;
  @ViewChild('button', {static: true}) button!:ElementRef;

  collections: Array<any> = [
  { value: 'Músicas Mais Populares', viewValue: 'Músicas Mais Populares' },
  { value: 'Músicas Mais Recentes', viewValue: 'Músicas Mais Recentes' },
  { value: 'Corporativo / Empresarial', viewValue: 'Corporativo / Empresarial' },
  { value: 'Música Jazz', viewValue: 'Música Jazz' },
  { value: 'Música Clássica', viewValue: 'Música Clássica' },
  { value: 'Música Livre de Direitos para Projetos', viewValue: 'Música Livre de Direitos para Projetos' },
  { value: 'Coleções de Música', viewValue: 'Coleções de Música' },
  { value: 'Música Gratuita', viewValue: 'Música Gratuita' },
];

  info: Array<any> = [
    {value: 'Sobre Nós', viewValue: 'Sobre Nós'},
    {value: 'Testemunhos', viewValue: 'Testemunhos'},
    {value: 'Política de Privacidade', viewValue: 'Política de Privacidade'},
    {value: 'Informações de Licença', viewValue: 'Informações de Licença'},
  ];
  support: Array<any> = [
    {value: 'Entre em Contato', viewValue: 'Entre em Contato'},
    {value: 'Fale Conosco via WhatsApp', viewValue: 'Fale Conosco via WhatsApp'},
    {value: 'FAQ', viewValue: 'FAQ'},
    {value: 'HUB', viewValue: 'HUB'},
  ];

  url: string = 'https://api.whatsapp.com/send?phone=5546991161666&text=Entre+em+contato+agora';
  // ao clicar no botao do rodape deve redirecionar o link, fazer evento de click com addEventListener

  constructor(
    private router: Router,
    private scrollService: ScrollService,
  ) { }

  ngOnInit(): void {
  }

  infoFunction(data: string) {
    console.log(data);
    if(data === 'Política de Privacidade') {
      this.router.navigate(['/politica-de-privacidade']).then();
    } else if(data === 'FAQ') {
      this.router.navigate(['/faq']).then();
    } else if(data === 'Entre em Contato') {
      this.router.navigate(['/contato']).then();
    } else if(data === 'Informações de Licença') {
      this.router.navigate(['/preco']).then();
    } else if(data === 'Fale Conosco via WhatsApp') {
      this.scrollService.scrollUp();
      setTimeout(() => {
        location.reload();
      }, 750);
    }
  }

}
