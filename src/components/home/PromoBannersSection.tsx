import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';

export function PromoBannersSection() {
  return (
    <View style={styles.wrapper}>
      {/* Banner 100% Natural */}
      <View style={[styles.banner, styles.greenBanner]}>
        <Text style={styles.title}>100% natural</Text>
        <Text style={styles.subtitle}>Sorvetes e picolés feitos com frutas frescas</Text>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.ctaButton, pressed && styles.pressed]}
          onPress={() => Alert.alert('Sorvetes', 'A abrir catálogo de sorvetes...')}
        >
          <Text style={styles.ctaText}>Ver sorvetes</Text>
        </Pressable>
      </View>

      {/* Banner Frete Grátis */}
      <View style={[styles.banner, styles.orangeBanner]}>
        <Text style={styles.title}>Frete grátis</Text>
        <Text style={styles.subtitle}>Em compras acima de R$ 100,00</Text>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.ctaButton, pressed && styles.pressed]}
          onPress={() => Alert.alert('Doces', 'A abrir catálogo de doces...')}
        >
          <Text style={styles.ctaText}>Ver doces</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 14,
    marginTop: 22,
    gap: 10,
  },
  banner: {
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    gap: 6,
  },
  greenBanner: {
    backgroundColor: '#68c393',
  },
  orangeBanner: {
    backgroundColor: '#ff9015',
  },
  title: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.92)',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 4,
  },
  ctaButton: {
    backgroundColor: colors.pink,
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 16,
  },
  ctaText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});