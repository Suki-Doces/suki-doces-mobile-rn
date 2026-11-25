import { cartService, EMPTY_CART, type Cart } from './cartService';
import { sessionStore } from './session';

/**
 * Estado do carrinho compartilhado entre as telas (barra inferior, catálogo, tela do carrinho).
 * A fonte da verdade é o servidor; aqui só guardamos a última leitura.
 */
let cart: Cart = EMPTY_CART;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export const cartStore = {
  get: () => cart,

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** Relê o carrinho no servidor (inclui o que foi adicionado pelo site). */
  async refresh(): Promise<Cart> {
    if (!sessionStore.get()) {
      cart = EMPTY_CART;
      emit();
      return cart;
    }
    cart = await cartService.get();
    emit();
    return cart;
  },

  async add(productId: number, quantity: number) {
    await cartService.add(productId, quantity);
    return cartStore.refresh();
  },

  async setQuantity(itemId: number, quantity: number) {
    await cartService.setQuantity(itemId, quantity);
    return cartStore.refresh();
  },

  async remove(itemId: number) {
    await cartService.remove(itemId);
    return cartStore.refresh();
  },

  async clear() {
    await cartService.clear();
    return cartStore.refresh();
  },

  reset() {
    cart = EMPTY_CART;
    emit();
  },
};

// Ao sair da conta o carrinho local é zerado; ao entrar, recarregado do servidor.
sessionStore.subscribe(() => {
  if (sessionStore.get()) {
    cartStore.refresh().catch(() => undefined);
  } else {
    cartStore.reset();
  }
});
