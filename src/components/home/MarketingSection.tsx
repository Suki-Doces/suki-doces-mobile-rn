import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/constants/colors';
import { store } from '@/constants/store';

export function MarketingSection() {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      {/* Card Nossa Essência -> Rota /history */}
      <View style={styles.storyCard}>
        <View style={styles.storyBadge}>
          <Text style={styles.storyBadgeText}>Desde 2020</Text>
        </View>
        <Text style={styles.title}>A Essência da Suki Doces</Text>
        <Text style={styles.description}>
          Da nossa primeira receita caseira até a distribuição de doces artesanais e de
          fábrica, entregamos pequenos pedaços de felicidade todos os dias.
        </Text>

        <Image
          source={require('@/assets/images/candy-wallpaper.jpg')}
          style={styles.storyImage}
          resizeMode="cover"
        />

        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          onPress={() => router.navigate('/history')}
        >
          <Text style={styles.primaryButtonText}>Conhecer Nossa Trajetória</Text>
        </Pressable>
      </View>

      {/* Card Atendimento Rápido -> Rota /contact */}
      <View style={styles.contactBanner}>
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Encomendas para Festas e Comércios</Text>
          <Text style={styles.contactText}>
            Atendemos em {store.address} ({store.openingHours}). Precisando de orçamento ou
            parceria?
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          onPress={() => router.navigate('/contact')}
        >
          <Icon name="mail" size={18} color={colors.pink} />
          <Text style={styles.secondaryButtonText}>Escreva para o Suki</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 28,
    gap: 18,
  },
  storyCard: {
    padding: 22,
    borderRadius: 22,
    backgroundColor: '#fff0facc',
    borderWidth: 1,
    borderColor: 'rgba(233, 34, 144, 0.22)',
    gap: 12,
  },
  storyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.pinkPale,
  },
  storyBadgeText: {
    color: colors.pink,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: colors.brown,
    fontSize: 23,
    lineHeight: 28,
    fontWeight: '800',
  },
  description: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  storyImage: {
    width: '100%',
    height: 150,
    borderRadius: 14,
    marginVertical: 4,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.pink,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  contactBanner: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.pinkPale,
    gap: 14,
  },
  contactInfo: {
    gap: 6,
  },
  contactTitle: {
    color: colors.brown,
    fontSize: 18,
    fontWeight: '800',
  },
  contactText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.pinkLight,
  },
  secondaryButtonText: {
    color: colors.pink,
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.82,
  },
});