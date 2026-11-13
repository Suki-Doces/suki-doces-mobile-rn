import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '@/constants/colors';
import { iceCreamSteps } from '@/constants/home';

export function IceCreamSection() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>
        Não somente doces.{' '}
        <Text style={styles.headingHighlight}>Sorvetes e muito mais</Text>!
      </Text>

      <View style={styles.cardsList}>
        {iceCreamSteps.map((step) => (
          <LinearGradient
            key={step.id}
            colors={gradients.catalogContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.stepCard}
          >
            <View style={styles.thumbPlaceholder} />
            <View style={styles.stepTextContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          </LinearGradient>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.moreButtonWrapper, pressed && styles.pressed]}
        onPress={() => router.navigate('/history')}
      >
        <LinearGradient
          colors={gradients.brandPink}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.moreButton}
        >
          <Text style={styles.moreButtonText}>Saiba mais</Text>
        </LinearGradient>
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
    borderWidth: 1,
    borderColor: 'rgba(241, 120, 182, 0.2)',
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
  moreButtonWrapper: {
    alignSelf: 'center',
    marginTop: 4,
    borderRadius: 18,
    shadowColor: colors.pink,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  moreButton: {
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