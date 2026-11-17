import { useState, useEffect, useCallback } from 'react';

import { defaultSubject } from '@/constants/contact';
import type { ContactFormValues, ContactMessageItem } from '@/interfaces/contact';
import { validateContactForm } from '@/lib/validation';
import { sendContactMessage, getMyContactMessages } from '@/services/contactService';

const initialValues: ContactFormValues = {
  name: '',
  phone: '',
  email: '',
  subject: defaultSubject,
  message: '',
};

export function useContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    const data = await getMyContactMessages();
    setMessages(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  function setField<K extends keyof ContactFormValues>(field: K, value: ContactFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  }

  async function submit() {
    const validationError = validateContactForm(values);
    if (validationError) {
      setError(validationError);
      setSuccessMessage('');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setSuccessMessage('');

      const res = await sendContactMessage(values);

      // Adiciona a mensagem enviada imediatamente no card de histórico da tela
      const novaMensagem: ContactMessageItem = {
        id_contato: res.id || Date.now(),
        nome: values.name,
        telefone: values.phone,
        email: values.email,
        assunto: values.subject,
        mensagem: values.message,
        data_criacao: new Date().toISOString(),
        respondido: false,
      };

      setMessages((prev) => [novaMensagem, ...prev]);
      setValues(initialValues);
      setSuccessMessage(res.message || 'Mensagem recebida com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar a mensagem. Verifique a conexão com a API.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    values,
    messages,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    setField,
    submit,
  };
}