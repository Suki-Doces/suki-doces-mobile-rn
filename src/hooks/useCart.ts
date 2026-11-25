import { useSyncExternalStore } from 'react';
import { cartStore } from '@/services/cartStore';

export function useCart() {
  return useSyncExternalStore(cartStore.subscribe, cartStore.get, cartStore.get);
}
