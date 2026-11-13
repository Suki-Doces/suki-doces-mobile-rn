import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '@/constants/colors';

export function AboutCallout() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Doces que encantam, momentos que marcam!</Text>
      <Text style={styles.paragraph}>
        Na Suki Doces, somos apaixonados por transformar ingredientes de qualidade em
        verdadeiras experiências de sabor. Cada doce conta um pouquinho da nossa história.
        Seja bem-vindo à Suki Doces.
      </Text>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.buttonWrapper, pressed && styles.pressed]}
        onPress={() => router.navigate('/history')}
      >
        <LinearGradient
          colors={gradients.brandPink}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Ver catálogo</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: colors.white,
    gap: 10,
  },
  title: {
    color: colors.brown,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
  },
  paragraph: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 18,
  },
  buttonWrapper: {
    alignSelf: 'flex-start',
    marginTop: 4,
    borderRadius: 20,
    shadowColor: colors.pink,
    shadowOpacity: 0.28,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  button: {
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});