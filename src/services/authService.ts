import { apiFetch } from './api';
import { sessionStore, type Session, type SessionUser } from './session';

/** Resposta de login/registro do NestJS (`token` é o mesmo valor de `accessToken`, legado). */
export interface AuthResponse {
  message?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user: SessionUser & { email_verificado?: boolean };
}

export interface RegisterPayload {
  nome: string;
  telefone: string;
  email: string;
  senha: string;
}

export type RegisterResult =
  | { status: 'logged-in'; session: Session }
  /** A API exige confirmar o e-mail antes do primeiro login. */
  | { status: 'verification-pending' };

async function startSession(response: AuthResponse): Promise<Session> {
  const accessToken = response.accessToken ?? response.token;
  if (!accessToken || !response.refreshToken) {
    throw new Error('Resposta de login inválida.');
  }
  const session: Session = {
    accessToken,
    refreshToken: response.refreshToken,
    user: {
      id: response.user.id,
      nome: response.user.nome,
      email: response.user.email,
      nivel: response.user.nivel,
      foto_perfil: response.user.foto_perfil ?? null,
    },
  };
  await sessionStore.save(session);
  return session;
}

export const authService = {
  /** Mesmo login do site: a conta é única para os dois canais. */
  async login(email: string, password: string): Promise<Session> {
    const response = await apiFetch<AuthResponse>('/usuario/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), senha: password }),
    });
    return startSession(response);
  },

  async register(payload: RegisterPayload): Promise<RegisterResult> {
    const response = await apiFetch<AuthResponse>('/usuario/registro', {
      method: 'POST',
      body: JSON.stringify({
        nome: payload.nome.trim(),
        email: payload.email.trim(),
        senha: payload.senha,
        // A API valida pelo menos 10 caracteres; enviamos só os dígitos.
        telefone: payload.telefone.replace(/\D/g, ''),
      }),
    });
    if (response.user?.email_verificado === false) {
      return { status: 'verification-pending' };
    }
    return { status: 'logged-in', session: await startSession(response) };
  },

  async logout(): Promise<void> {
    const session = sessionStore.get();
    if (session) {
      // Revoga o refresh token no servidor (melhor esforço: a sessão local é apagada de qualquer jeito).
      await apiFetch('/usuario/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      }).catch(() => undefined);
    }
    await sessionStore.clear();
  },
};
