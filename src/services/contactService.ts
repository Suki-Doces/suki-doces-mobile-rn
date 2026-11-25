import { apiFetch } from '@/services/api';
import { sessionStore } from '@/services/session';
import type { ContactFormValues, ContactMessageItem } from '@/interfaces/contact';

/** Envia a mensagem; com sessão aberta ela fica ligada à conta e aparece no histórico do site também. */
export async function sendContactMessage(
  values: ContactFormValues
): Promise<{ message: string; id: number }> {
  const created = await apiFetch<{ id_contato?: number; id?: number }>('/contatos', {
    method: 'POST',
    body: JSON.stringify({
      nome: values.name,
      telefone: values.phone,
      email: values.email,
      assunto: values.subject,
      mensagem: values.message,
    }),
  });
  return {
    id: created?.id_contato ?? created?.id ?? Date.now(),
    message: 'Mensagem recebida com sucesso. Em breve entraremos em contato.',
  };
}

export async function getMyContactMessages(): Promise<ContactMessageItem[]> {
  if (!sessionStore.get()) return [];
  try {
    const response = await apiFetch<{ messages: ContactMessageItem[] }>('/contatos/me', {
      method: 'GET',
    });
    return response.messages || [];
  } catch {
    // Sem login (401/403): lista vazia sem quebrar a tela
    return [];
  }
}
