import { Platform } from 'react-native';
import { sessionStore } from './session';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Emulador Android enxerga o localhost do computador em 10.0.2.2.
  return Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/suki-doces'
    : 'http://localhost:3000/suki-doces';
};

export const API_URL = getBaseUrl();

/** Identifica o app como canal de venda: o painel do site mostra "App" nos pedidos feitos aqui. */
const CLIENT_PLATFORM = 'mobile';

/** Rotas de autenticação nunca tentam renovar o token (evita loop). */
const AUTH_ROUTES = ['/usuario/login', '/usuario/registro', '/usuario/refresh', '/admin/login'];

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined | null>;
  /** Não envia o token mesmo se houver sessão. */
  anonymous?: boolean;
}

/** Token atual (a sessão fica em sessionStore). */
export function getAuthToken() {
  return sessionStore.get()?.accessToken ?? null;
}

/**
 * O NestJS responde a maioria das rotas como { success, message, data }.
 * Removemos o envelope e devolvemos só o `data` (rotas sem envelope voltam como vieram).
 */
export function unwrapEnvelope<T>(body: unknown): T {
  if (
    body !== null &&
    typeof body === 'object' &&
    !Array.isArray(body) &&
    (body as { success?: unknown }).success === true &&
    'data' in body
  ) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export function errorMessage(body: unknown, status: number): string {
  const payload = body as { message?: unknown; mensagem?: unknown } | null;
  const raw = payload?.message ?? payload?.mensagem;
  if (Array.isArray(raw)) return raw.join(' ');
  if (typeof raw === 'string' && raw) return raw;
  if (status === 0) return 'Sem conexão com o servidor.';
  return `Erro na comunicação com o servidor (${status}).`;
}

function buildUrl(endpoint: string, params?: RequestOptions['params']) {
  let url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) searchParams.append(key, String(value));
    });
    const query = searchParams.toString();
    if (query) url += `?${query}`;
  }
  return url;
}

let refreshInFlight: Promise<string | null> | null = null;

/** Troca o refresh token (uso único no NestJS) por um novo par. Uma renovação por vez. */
export function refreshAccessToken(): Promise<string | null> {
  const session = sessionStore.get();
  if (!session?.refreshToken) return Promise.resolve(null);

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const response = await fetch(buildUrl('/usuario/refresh'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Client-Platform': CLIENT_PLATFORM,
          },
          body: JSON.stringify({ refreshToken: session.refreshToken }),
        });
        if (!response.ok) {
          // Refresh expirado ou revogado: a sessão acabou.
          await sessionStore.clear();
          return null;
        }
        const pair = unwrapEnvelope<{ accessToken: string; refreshToken: string }>(
          await response.json(),
        );
        await sessionStore.updateTokens(pair.accessToken, pair.refreshToken);
        return pair.accessToken;
      } catch {
        return null;
      } finally {
        refreshInFlight = null;
      }
    })();
  }

  return refreshInFlight;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, anonymous, ...restOptions } = options;
  const url = buildUrl(endpoint, params);
  const isAuthRoute = AUTH_ROUTES.some((route) => endpoint.startsWith(route));

  const send = (token: string | null | undefined) => {
    const finalHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Client-Platform': CLIENT_PLATFORM,
      ...(headers as Record<string, string>),
    };
    if (token && !anonymous && !isAuthRoute) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
    return fetch(url, { ...restOptions, headers: finalHeaders });
  };

  let response: Response;
  try {
    response = await send(sessionStore.get()?.accessToken);
    // Access token do NestJS dura 15 min: renova uma vez e repete a requisição.
    if (response.status === 401 && !isAuthRoute && !anonymous && sessionStore.get()?.refreshToken) {
      const newToken = await refreshAccessToken();
      if (newToken) response = await send(newToken);
    }
  } catch (error) {
    throw new ApiError(errorMessage(null, 0), 0, error);
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(errorMessage(body, response.status), response.status, body);
  }

  return unwrapEnvelope<T>(body);
}
