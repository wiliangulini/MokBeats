import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Musica } from '../../musicas/musicas.service';
import {
  LicenseId,
  LicenseOption,
} from './cart-modal.models';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss']
})
export class CartModalComponent {
  music: Musica = {};
  selectedLicenseId: LicenseId | null = null;

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
      preco: null,
      precoTemporario: true,
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
      preco: null,
      precoTemporario: true,
    },
  ];

  constructor(
    private activeModal: NgbActiveModal,
  ) {}

  selectLicense(licenseId: LicenseId): void {
    this.selectedLicenseId = licenseId;
  }

  confirmSelection(): void {
    const selectedLicense = this.licenseOptions.find(
      (license) => license.id === this.selectedLicenseId
    );

    if (selectedLicense) {
      this.activeModal.close(selectedLicense);
    }
  }

  closeModal(): void {
    this.activeModal.dismiss('cancel');
  }

}
