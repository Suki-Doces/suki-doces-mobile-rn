import { useEffect, useSyncExternalStore } from 'react';
import { sessionStore } from '@/services/session';

/** Sessão atual (null = visitante). Restaura a sessão salva na primeira montagem. */
export function useSession() {
  const session = useSyncExternalStore(sessionStore.subscribe, sessionStore.get, sessionStore.get);
  const restored = useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.isRestored,
    sessionStore.isRestored,
  );

  useEffect(() => {
    if (!sessionStore.isRestored()) {
      void sessionStore.restore();
    }
  }, []);

  return { session, user: session?.user ?? null, isLoggedIn: !!session, restored };
}
