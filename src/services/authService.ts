import { apiFetch, setAuthToken } from './api';

export interface LoginPayload {
  email: string;
  senha?: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: number | string;
    nome: string;
    email: string;
    role?: string;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        senha: password,
        password, // Enviado em ambos os formatos para compatibilidade com o controller
      }),
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  logout() {
    setAuthToken(null);
  },
};