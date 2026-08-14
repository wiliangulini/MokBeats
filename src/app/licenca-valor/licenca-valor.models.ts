/**
 * Modelos e valores de preço da tela de Licenças e Preços (rota `/precos`).
 *
 * Os preços abaixo são TEMPORÁRIOS/CONFIGURÁVEIS — ainda não há definição comercial final para
 * a licença de músicas por tempo determinado (ver PROJECT_RULES.md §13, "valores reais de
 * licenças" e "regras comerciais de licença"). Antes de produção, validar com o cliente.
 */

export type PeriodoLicencaMusica = '6' | '12';

export const PERIODOS_LICENCA_MUSICA: { value: PeriodoLicencaMusica; label: string }[] = [
  { value: '6', label: '6 meses' },
  { value: '12', label: '12 meses' },
];

export interface OpcaoLicencaMusica {
  periodo: PeriodoLicencaMusica;
  precoLabel: string;
  periodoLabel: string;
  comparativoLabel: string;
}

export const LICENCAS_MUSICA_POR_PERIODO: Record<PeriodoLicencaMusica, OpcaoLicencaMusica> = {
  '6': {
    periodo: '6',
    precoLabel: 'R$199,99',
    periodoLabel: '/6 meses',
    comparativoLabel: '12 meses R$249,99 | Vitalício R$999,99',
  },
  '12': {
    periodo: '12',
    precoLabel: 'R$249,99',
    periodoLabel: '/12 meses',
    comparativoLabel: '6 meses R$199,99 | Vitalício R$999,99',
  },
};
