import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SubjectSelector } from '@/components/contact/SubjectSelector';
import { FieldLabel } from '@/components/ui/FieldLabel';
import { FormField } from '@/components/ui/FormField';
import { colors } from '@/constants/colors';
import type { ContactFormValues } from '@/interfaces/contact';

interface ContactFormProps {
  values: ContactFormValues;
  error: string;
  successMessage: string;
  isSubmitting: boolean;
  setField: <K extends keyof ContactFormValues>(field: K, value: ContactFormValues[K]) => void;
  submit: () => void;
}

export function ContactForm({
  values,
  error,
  successMessage,
  isSubmitting,
  setField,
  submit,
}: ContactFormProps) {
  return (
    <View style={styles.card}>
      <FormField
        label="Nome Completo"
        value={values.name}
        onChangeText={(text) => setField('name', text)}
        placeholder="Seu nome"
        autoCapitalize="words"
        returnKeyType="next"
      />

      <FormField
        label="Telefone"
        value={values.phone}
        onChangeText={(text) => setField('phone', text)}
        placeholder="(00) 00000-0000"
        keyboardType="phone-pad"
        returnKeyType="next"
      />

      <FormField
        label="E-mail"
        value={values.email}
        onChangeText={(text) => setField('email', text)}
        placeholder="seu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
      />

      <FieldLabel>Qual o assunto?</FieldLabel>
      <SubjectSelector value={values.subject} onChange={(subject) => setField('subject', subject)} />

      <FormField
        label="Mensagem"
        value={values.message}
        onChangeText={(text) => setField('message', text)}
        placeholder="Como podemos ajudar?"
        style={styles.messageInput}
        multiline
        textAlignVertical="top"
        maxLength={1000}
      />

      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      {successMessage ? (
        <Text accessibilityRole="alert" style={styles.success}>
          {successMessage}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        disabled={isSubmitting}
        style={({ pressed }) => [
          styles.submit,
          (pressed || isSubmitting) && styles.submitPressed,
        ]}
        onPress={submit}
      >
        <Text style={styles.submitLabel}>
          {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 28,
    paddingVertical: 30,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 24,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  messageInput: {
    minHeight: 125,
    paddingTop: 14,
  },
  error: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    color: '#8a1f1f',
    backgroundColor: '#ffd6d6cc',
  },
  success: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    color: '#155724',
    backgroundColor: '#d4edda',
  },
  submit: {
    minHeight: 52,
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.pink,
    shadowColor: colors.pink,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  submitPressed: {
    opacity: 0.82,
  },
  submitLabel: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
});