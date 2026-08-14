import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {ScrollService} from "../service/scroll.service";
import {
  LICENCAS_MUSICA_POR_PERIODO,
  OpcaoLicencaMusica,
  PeriodoLicencaMusica,
  PERIODOS_LICENCA_MUSICA,
} from './licenca-valor.models';

@Component({
    selector: 'app-licenca-valor',
    templateUrl: './licenca-valor.component.html',
    styleUrls: ['./licenca-valor.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LicencaValorComponent implements OnInit {

  /** Opções de período exibidas no toggle da licença de músicas por tempo determinado. */
  readonly periodosLicencaMusica = PERIODOS_LICENCA_MUSICA;

  /** Período atualmente selecionado no toggle 6/12 meses. */
  periodoLicencaMusicaSelecionado: PeriodoLicencaMusica = '6';

  constructor(
    private scrollService: ScrollService,
  ) { }

  ngOnInit(): void {
    this.scrollService.scrollUp();
  }

  /** Dados de preço/período da licença de músicas para o período selecionado. */
  get licencaMusicaAtual(): OpcaoLicencaMusica {
    return LICENCAS_MUSICA_POR_PERIODO[this.periodoLicencaMusicaSelecionado];
  }

  selecionarPeriodoLicencaMusica(periodo: PeriodoLicencaMusica): void {
    this.periodoLicencaMusicaSelecionado = periodo;
  }

}
