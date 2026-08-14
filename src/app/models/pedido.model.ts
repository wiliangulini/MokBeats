import { CartItem } from '../carrinho/cartModal/cart-modal.models';

export type FormaPagamento = 'Cartão de Crédito' | 'Cartão de Débito' | 'Boleto' | 'PIX';

/**
 * Não há endpoint de pedido no backend (`server/src/index.js`) até o momento
 * desta implementação (R27). `status: 'simulado'` marca que o fechamento é
 * client-side: nenhuma cobrança é feita e nenhum pedido é registrado no
 * servidor. Ver docs/ia-auditorias/R27-checkout-fechamento-pedido.md.
 */
export interface PedidoSimulado {
  status: 'simulado';
  criadoEm: string;
  nomeProjeto: string;
  observacoes: string | null;
  formaDePagamento: FormaPagamento;
  itens: CartItem[];
  total: number;
}
