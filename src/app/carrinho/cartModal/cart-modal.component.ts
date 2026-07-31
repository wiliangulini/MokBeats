import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Musica } from '../../musicas/musicas.service';
import {
  CartSelection,
  CommercialPlanId,
  CommercialPlanOption,
  LicenseId,
  LicenseOption,
} from './cart-modal.models';

@Component({
    selector: 'app-cart-modal',
    templateUrl: './cart-modal.component.html',
    styleUrls: ['./cart-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class CartModalComponent {
  music: Musica = {};
  selectedLicenseId: LicenseId | null = null;
  selectedPlanId: CommercialPlanId | null = null;
  private readonly currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  readonly licenseOptions: LicenseOption[] = [
    {
      id: 'padrao',
      nome: 'Licença Padrão',
      descricao:
        'Indicada para projetos online, redes sociais, podcasts e projetos estudantis.',
      beneficios: [
        'Sites, redes sociais e podcasts',
        'Vídeos online para uso pessoal',
        'Um projeto, com cobertura mundial e perpétua',
      ],
    },
    {
      id: 'premium',
      nome: 'Licença Premium',
      descricao:
        'Inclui a cobertura Padrão e amplia o uso para projetos comerciais selecionados.',
      beneficios: [
        'Todos os usos da Licença Padrão',
        'TV, rádio e publicidade em território único',
        'Apps, jogos e DVDs com tiragem limitada',
      ],
    },
  ];

  readonly commercialPlanOptions: CommercialPlanOption[] = [
    {
      id: 'mensal',
      nome: 'Mensal',
      duracaoMeses: 1,
      preco: 49.99,
    },
    {
      id: '6-meses',
      nome: '6 meses',
      duracaoMeses: 6,
      preco: 199.99,
    },
    {
      id: '12-meses',
      nome: '12 meses',
      duracaoMeses: 12,
      preco: 249.99,
    },
  ];

  constructor(
    private activeModal: NgbActiveModal,
  ) {}

  selectLicense(licenseId: LicenseId): void {
    this.selectedLicenseId = licenseId;
  }

  selectPlan(planId: CommercialPlanId): void {
    this.selectedPlanId = planId;
  }

  formatPrice(price: number): string {
    return this.currencyFormatter.format(price);
  }

  confirmSelection(): void {
    const selectedLicense = this.licenseOptions.find(
      (license) => license.id === this.selectedLicenseId
    );
    const selectedPlan = this.commercialPlanOptions.find(
      (plan) => plan.id === this.selectedPlanId
    );

    if (selectedLicense && selectedPlan) {
      const selection: CartSelection = {
        licencaSelecionada: selectedLicense,
        planoSelecionado: selectedPlan,
      };

      this.activeModal.close(selection);
    }
  }

  closeModal(): void {
    this.activeModal.dismiss('cancel');
  }

}
