import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export interface SessionUser {
  id: number;
  nome: string;
  email: string;
  nivel: 'admin' | 'cliente';
  foto_perfil?: string | null;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}

const STORAGE_KEY = 'suki_session';

/** SecureStore no Android/iOS; no Expo Web (sem SecureStore) usa o localStorage do navegador. */
const storage = {
  async get(): Promise<string | null> {
    if (Platform.OS === 'web') return globalThis.localStorage?.getItem(STORAGE_KEY) ?? null;
    return SecureStore.getItemAsync(STORAGE_KEY);
  },
  async set(value: string): Promise<void> {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(STORAGE_KEY, value);
      return;
    }
    await SecureStore.setItemAsync(STORAGE_KEY, value);
  },
  async remove(): Promise<void> {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(STORAGE_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(STORAGE_KEY);
  },
};

let current: Session | null = null;
let restored = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Store mínimo de sessão (para useSyncExternalStore): token em memória + persistido. */
export const sessionStore = {
  get(): Session | null {
    return current;
  },

  isRestored(): boolean {
    return restored;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  async restore(): Promise<Session | null> {
    if (restored) return current;
    try {
      const raw = await storage.get();
      current = raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      current = null;
    }
    restored = true;
    emit();
    return current;
  },

  async save(session: Session): Promise<void> {
    current = session;
    restored = true;
    emit();
    await storage.set(JSON.stringify(session));
  },

  async updateTokens(accessToken: string, refreshToken: string): Promise<void> {
    if (!current) return;
    await sessionStore.save({ ...current, accessToken, refreshToken });
  },

  async clear(): Promise<void> {
    current = null;
    emit();
    await storage.remove();
  },
};
