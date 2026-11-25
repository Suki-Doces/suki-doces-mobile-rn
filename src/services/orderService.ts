import { apiFetch } from './api';

export type OrderStatus = 'pendente' | 'pago' | 'enviado' | 'entregue' | 'cancelado';
export type PaymentMethod = 'pix' | 'cartao' | 'boleto';

export interface OrderItem {
  id_item: number;
  id_produto: number;
  quantidade: number;
  preco_unitario: number;
  produtos?: { nome: string; imagem?: string | null } | null;
}

export interface Order {
  id_pedido: number;
  valor_total: number;
  status: OrderStatus;
  metodo_pagamento: PaymentMethod | string | null;
  /** 'mobile' (feito no app), 'web' (feito no site) ou null (pedidos antigos). */
  origem: 'mobile' | 'web' | null;
  data_pedido: string;
  itens_pedido?: OrderItem[];
}

export interface CheckoutLine {
  id_produto: number;
  quantidade: number;
}

export interface CouponPreview {
  codigo: string;
  tipo: string;
  valor: number;
  valor_desconto: number;
}

/** Chave única por tentativa de compra (o NestJS usa para não duplicar pedidos em reenvios). */
export function newIdempotencyKey(): string {
  const random = Math.random().toString(36).slice(2, 10);
  return `app-${Date.now().toString(36)}-${random}`;
}

export const orderService = {
  /**
   * Finaliza a compra. Reenvie com a MESMA `idempotencyKey` se a rede falhar:
   * o servidor devolve o pedido já criado em vez de cobrar de novo.
   */
  async checkout(
    produtos: CheckoutLine[],
    metodoPagamento: PaymentMethod,
    idempotencyKey: string,
    codigoCupom?: string,
  ): Promise<Order> {
    const response = await apiFetch<{ mensagem: string; pedido: Order }>('/pedidos', {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify({
        produtos,
        metodo_pagamento: metodoPagamento,
        ...(codigoCupom ? { codigo_cupom: codigoCupom } : {}),
      }),
    });
    return response.pedido;
  },

  /** Todos os pedidos da conta: os feitos no app e os feitos no site. */
  async myOrders(): Promise<Order[]> {
    const orders = await apiFetch<Order[]>('/usuario/pedidos');
    return Array.isArray(orders) ? orders : [];
  },

  async cancel(orderId: number): Promise<Order | null> {
    const response = await apiFetch<{ pedido: Order | null }>(
      `/usuario/pedidos/${orderId}/cancelar`,
      { method: 'PATCH' },
    );
    return response.pedido;
  },

  async pay(orderId: number): Promise<Order | null> {
    const response = await apiFetch<{ pedido: Order | null }>(`/pedidos/${orderId}/pagar`, {
      method: 'POST',
    });
    return response.pedido;
  },

  async validateCoupon(codigo: string, subtotal: number): Promise<CouponPreview> {
    return apiFetch<CouponPreview>('/cupons/validar', {
      method: 'POST',
      body: JSON.stringify({ codigo, subtotal }),
    });
  },
};
