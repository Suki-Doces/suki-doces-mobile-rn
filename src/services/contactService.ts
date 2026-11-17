import { apiFetch } from '@/services/api';
import type { ContactFormValues, ContactMessageItem } from '@/interfaces/contact';

export async function sendContactMessage(
  values: ContactFormValues
): Promise<{ message: string; id: number }> {
  return apiFetch<{ message: string; id: number }>('/contatos', {
    method: 'POST',
    body: JSON.stringify({
      nome: values.name,
      telefone: values.phone,
      email: values.email,
      assunto: values.subject,
      mensagem: values.message,
    }),
  });
}

export async function getMyContactMessages(): Promise<ContactMessageItem[]> {
  try {
    const response = await apiFetch<{ messages: ContactMessageItem[] }>('/contatos/me', {
      method: 'GET',
    });
    return response.messages || [];
  } catch {
    // Se o usuário não estiver logado (401/403), retorna lista vazia sem quebrar a tela
    return [];
  }
}