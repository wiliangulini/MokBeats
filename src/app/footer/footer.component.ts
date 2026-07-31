import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ConfigService } from "../service/config.service";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false
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
    {value: 'Sobre Nós', viewValue: 'Sobre Nós', route: '/sobre-nos'},
    {value: 'Termos e Condições', viewValue: 'Termos e Condições', route: '/termos-do-site'},
    {value: 'Política de Privacidade', viewValue: 'Política de Privacidade', route: '/politica-de-privacidade'},
    {value: 'Informações de Licença', viewValue: 'Informações de Licença', route: '/precos'},
  ];
  support: Array<any> = [
    {value: 'Entre em Contato', viewValue: 'Entre em Contato', route: '/contato'},
    {value: 'FAQ', viewValue: 'FAQ', route: '/faq'},
  ];

  url: string = 'https://wa.me/5546991161666';
  hubUrl: string = 'https://www.mokbeats-hub.com/';

  constructor(
    private configService: ConfigService,
  ) { }

  ngOnInit(): void {
    // Carrega número de WhatsApp do backend e normaliza para wa.me/E.164
    this.configService.getConfig().subscribe((cfg: any) => {
      try {
        const digits = String(cfg?.whatsapp || '').replace(/\D+/g, '');
        if (digits) this.url = `https://wa.me/${digits}`;
      } catch (_) {}
    });
  }

}
