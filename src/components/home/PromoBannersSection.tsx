// Exemplo de aplicação imediata no components/home/PromoBannersSection.tsx
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/constants/colors';

export function PromoBannersSection() {
  return (
    <View style={styles.adsFlavours}>
      {/* .af-one: radial-gradient(50% 50% at 50% 50%, #81E8A8 0%, #67B992 100%) */}
      <LinearGradient
        colors={['#81E8A8', '#67B992']}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 0.9, y: 0.9 }}
        style={[styles.afBanner, styles.afOne]}
      >
        <View style={styles.afContent}>
          <Text style={styles.title}>100% natural</Text>
          <Text style={styles.subtitle}>Cremoso e saboroso. Opções sem lactose.</Text>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.btnGlass, pressed && styles.pressed]}
            onPress={() => Alert.alert('Sorvetes', 'Abrindo categoria Sorvetes (5)...')}
          >
            <Text style={styles.btnText}>Ver sorvetes</Text>
          </Pressable>
        </View>
      </LinearGradient>

      {/* .af-two: radial-gradient(50% 50% at 50% 50%, #FFCE92 0%, #FF7B00 100%) */}
      <LinearGradient
        colors={['#FFCE92', '#FF7B00']}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 0.9, y: 0.9 }}
        style={[styles.afBanner, styles.afTwo]}
      >
        <View style={styles.afContent}>
          <Text style={styles.title}>Frete grátis</Text>
          <Text style={styles.subtitle}>Entrega rápida ao comprar até às 16h30.</Text>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.btnGlass, pressed && styles.pressed]}
            onPress={() => Alert.alert('Doces', 'Abrindo categoria Doces (1)...')}
          >
            <Text style={styles.btnText}>Ver doces</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  adsFlavours: {
    margin: 20,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  afBanner: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  afOne: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  afTwo: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  afContent: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.white,
    fontSize: 13,
    textAlign: 'center',
  },
  btnGlass: {
    marginTop: 2,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  btnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});