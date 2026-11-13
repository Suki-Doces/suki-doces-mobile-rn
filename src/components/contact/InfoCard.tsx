import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@/components/ui/Icon';
import { colors, gradients } from '@/constants/colors';
import type { ContactMethod } from '@/interfaces/contact';

export function InfoCard({ icon, title, lines }: ContactMethod) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={gradients.brandPink}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.icon}
      >
        <Icon name={icon} color={colors.white} size={24} />
      </LinearGradient>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {lines.map((line) => (
          <Text key={line} style={styles.line}>{line}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 115,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.pink,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  text: {
    flex: 1,
  },
  title: {
    color: colors.brown,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '700',
    marginBottom: 4,
  },
  line: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
});