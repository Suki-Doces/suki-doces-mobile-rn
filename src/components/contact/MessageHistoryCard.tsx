import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import type { ContactMessageItem } from '@/interfaces/contact';

interface MessageHistoryCardProps {
  messages: ContactMessageItem[];
  isLoading?: boolean;
}

export function MessageHistoryCard({ messages, isLoading }: MessageHistoryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Histórico de mensagens</Text>

      {isLoading ? (
        <Text style={styles.text}>Carregando mensagens...</Text>
      ) : messages.length === 0 ? (
        <Text style={styles.text}>
          Nenhuma mensagem enviada ainda. Envie uma mensagem no formulário acima!
        </Text>
      ) : (
        <View style={styles.list}>
          {messages.map((item) => (
            <View key={String(item.id_contato)} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.subject}>{item.assunto.toUpperCase()}</Text>
                <Text style={styles.status}>
                  {item.respondido ? 'Respondido' : 'Enviado'}
                </Text>
              </View>
              <Text style={styles.message}>{item.mensagem}</Text>
              {item.resposta ? (
                <Text style={styles.reply}>Resposta Suki Doces: {item.resposta}</Text>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 28,
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#fff0facc',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  title: {
    color: colors.brown,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  text: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  list: {
    gap: 12,
  },
  item: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  subject: {
    fontWeight: '700',
    color: colors.pink,
    fontSize: 13,
  },
  status: {
    fontSize: 12,
    color: colors.brown,
    fontWeight: '600',
  },
  message: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  reply: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    color: '#155724',
    fontSize: 13,
    fontStyle: 'italic',
  },
});