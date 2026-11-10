import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import { iceCreamSteps } from '@/constants/home';

export function IceCreamSection() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>
        Não é somente doces.{' '}
        <Text style={styles.headingHighlight}>Sorvetes e muito mais</Text>!
      </Text>

      <View style={styles.cardsList}>
        {iceCreamSteps.map((step) => (
          <View key={step.id} style={styles.stepCard}>
            <View style={styles.thumbPlaceholder} />
            <View style={styles.stepTextContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.moreButton, pressed && styles.pressed]}
        onPress={() => router.navigate('/history')}
      >
        <Text style={styles.moreButtonText}>Saiba mais</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 32,
    gap: 16,
  },
  heading: {
    color: colors.brown,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
  },
  headingHighlight: {
    color: colors.pink,
  },
  cardsList: {
    gap: 12,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#fff0f7',
    gap: 12,
  },
  thumbPlaceholder: {
    width: 58,
    height: 58,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  stepTextContent: {
    flex: 1,
    gap: 3,
  },
  stepTitle: {
    color: colors.brown,
    fontSize: 13,
    fontWeight: '800',
  },
  stepDescription: {
    color: colors.text,
    fontSize: 11,
    lineHeight: 16,
  },
  moreButton: {
    alignSelf: 'center',
    marginTop: 4,
    backgroundColor: colors.pink,
    paddingHorizontal: 26,
    paddingVertical: 9,
    borderRadius: 18,
  },
  moreButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});