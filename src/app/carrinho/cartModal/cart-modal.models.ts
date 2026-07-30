import type { Musica } from '../../musicas/musicas.service';

export type LicenseId = 'padrao' | 'premium';
export type CommercialPlanId = 'mensal' | '6-meses' | '12-meses';

export interface LicenseOption {
  id: LicenseId;
  nome: string;
  descricao: string;
  beneficios: string[];
}

export interface CommercialPlanOption {
  id: CommercialPlanId;
  nome: string;
  duracaoMeses: 1 | 6 | 12;
  preco: number;
}

export interface CartSelection {
  licencaSelecionada: LicenseOption;
  planoSelecionado: CommercialPlanOption;
}

export type CartItem = Musica & CartSelection;
