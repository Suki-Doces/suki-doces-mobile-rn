import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';

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
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={() => router.navigate('/history')}
      >
        <Text style={styles.buttonText}>Ver catálogo</Text>
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
  button: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: colors.pink,
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