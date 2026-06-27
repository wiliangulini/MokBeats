import type { Musica } from '../../musicas/musicas.service';

export type LicenseId = 'padrao' | 'premium';

export interface LicenseOption {
  id: LicenseId;
  nome: string;
  descricao: string;
  beneficios: string[];
  preco: number | null;
  precoTemporario: boolean;
}

export type CartItem = Musica & {
  licencaSelecionada: LicenseOption;
};
