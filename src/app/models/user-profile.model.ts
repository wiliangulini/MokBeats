export type TipoDocumento = 'cpf' | 'passaporte';
export type TipoConta = 'none' | 'br' | 'foreign';
export type TipoEmpresaExt = 'LLC' | 'C-Corp' | 'S-Corp' | 'Holding' | 'Trust' | 'Outros';
export type DocumentTipo = 'foto-documento' | 'comprovante-residencia' | 'documento-empresa';

export interface UserProfile {
  nomeCompleto: string;
  tipoDocumento: TipoDocumento;
  cpf?: string;
  passaporte?: string;
  dataNascimento: string;        // ISO 8601 (YYYY-MM-DD)
  paisOrigem: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado?: string;               // condicional: somente Brasil
  cep?: string;                  // condicional: somente Brasil
  tipoConta: TipoConta;
  // Conta Jurídica Brasileira
  nomeEmpresaBR?: string;
  cnpj?: string;
  // Conta Jurídica Estrangeira
  nomeEmpresaExt?: string;
  tipoEmpresaExt?: TipoEmpresaExt;
  tipoEmpresaOutros?: string;    // condicional: tipoEmpresaExt === 'Outros'
  // URLs de documentos (retornadas pelo backend)
  fotoDocumentoUrl?: string;
  comprovanteResidenciaUrl?: string;
  documentoEmpresaUrl?: string;
}

export const REQUIRED_PROFILE_FIELDS: (keyof UserProfile)[] = [
  'nomeCompleto', 'tipoDocumento', 'dataNascimento',
  'paisOrigem', 'telefone', 'email', 'endereco', 'cidade',
];

export function isProfileComplete(profile: Partial<UserProfile> | null): boolean {
  if (!profile) return false;
  for (const field of REQUIRED_PROFILE_FIELDS) {
    if (!profile[field]) return false;
  }
  if (profile.tipoDocumento === 'cpf' && !profile.cpf) return false;
  if (profile.tipoDocumento === 'passaporte' && !profile.passaporte) return false;
  if (!profile.fotoDocumentoUrl) return false;
  if (!profile.comprovanteResidenciaUrl) return false;
  if (profile.tipoConta !== 'none' && !profile.documentoEmpresaUrl) return false;
  return true;
}
