import { apiFetch } from './api';
import { toProductItem, type ApiProduct } from './productService';
import type { ProductItem } from '@/interfaces/home';

/**
 * O carrinho do cliente logado fica no servidor (tabela carrinho), não no aparelho:
 * o que é adicionado no app aparece no carrinho do site e vice-versa.
 */
export interface CartLine {
  /** ID do ITEM do carrinho (usado para alterar/remover), diferente do ID do produto. */
  id: number;
  productId: number;
  quantity: number;
  total: number;
  product: ProductItem;
}

export interface Cart {
  items: CartLine[];
  subtotal: number;
  shipping: number;
  total: number;
  freeShipping: boolean;
  itemCount: number;
}

interface ApiCart {
  cartItems: {
    id: number;
    id_produto: number;
    quantidade: number;
    total: number;
    produto: ApiProduct;
  }[];
  subtotal: number;
  frete: number;
  total: number;
  freteGratis: boolean;
  itemCount: number;
}

export const EMPTY_CART: Cart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  total: 0,
  freeShipping: false,
  itemCount: 0,
};

function toCart(data: ApiCart): Cart {
  return {
    items: (data.cartItems ?? []).map((line) => ({
      id: line.id,
      productId: line.id_produto,
      quantity: line.quantidade,
      total: Number(line.total) || 0,
      product: toProductItem(line.produto),
    })),
    subtotal: Number(data.subtotal) || 0,
    shipping: Number(data.frete) || 0,
    total: Number(data.total) || 0,
    freeShipping: !!data.freteGratis,
    itemCount: data.itemCount ?? 0,
  };
}

export const cartService = {
  async get(): Promise<Cart> {
    return toCart(await apiFetch<ApiCart>('/carrinho'));
  },

  async add(productId: number, quantity: number): Promise<void> {
    await apiFetch('/carrinho/add', {
      method: 'POST',
      body: JSON.stringify({ id_produto: productId, quantidade: quantity }),
    });
  },

  async setQuantity(itemId: number, quantity: number): Promise<void> {
    await apiFetch(`/carrinho/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantidade: quantity }),
    });
  },

  async remove(itemId: number): Promise<void> {
    await apiFetch(`/carrinho/${itemId}`, { method: 'DELETE' });
  },

  async clear(): Promise<void> {
    await apiFetch('/carrinho', { method: 'DELETE' });
  },
};
