import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '@/constants/colors';
import type { Milestone } from '@/interfaces/history';

export function TimelineItem({ year, title, text }: Milestone) {
  return (
    <View style={styles.item}>
      <LinearGradient
        colors={gradients.timelineBadge}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.yearBadge}
      >
        <Text style={styles.yearText}>{year}</Text>
      </LinearGradient>

      <LinearGradient
        colors={gradients.glassCard}
        style={styles.card}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{text}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'flex-start',
    gap: 16,
  },
  yearBadge: {
    minWidth: 90,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.timelinePink,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    zIndex: 1,
  },
  yearText: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '700',
  },
  card: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(241, 120, 182, 0.25)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  title: {
    color: colors.brown,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  text: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
  },
});