import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { InfoCard } from '@/components/contact/InfoCard';
import { gradients } from '@/constants/colors';
import { contactMethods } from '@/constants/contact';

export function ContactCards() {
  return (
    <LinearGradient
      colors={gradients.contactCardsBox}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cards}
    >
      {contactMethods.map((method) => (
        <InfoCard key={method.title} {...method} />
      ))}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  cards: {
    gap: 8,
    padding: 10,
    marginHorizontal: 14,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
});