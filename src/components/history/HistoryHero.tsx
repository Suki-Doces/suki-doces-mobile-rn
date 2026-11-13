import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '@/constants/colors';

export function HistoryHero() {
  return (
    <LinearGradient
      colors={gradients.softPinkSection}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.hero}
    >
      <Text style={styles.title}>A Essência da Suki Doces</Text>
      <Text style={styles.subtitle}>Doces que encantam, momentos que marcam.</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingVertical: 72,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomColor: colors.timelinePink,
    borderBottomWidth: 2,
  },
  title: {
    color: colors.brown,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6b4c4c',
    fontSize: 17,
    lineHeight: 23,
    textAlign: 'center',
  },
});