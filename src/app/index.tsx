import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, FlatList } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { colors } from '@/constants/colors';
import { Icon } from '@/components/ui/Icon';
import { Footer } from '@/components/layout/Footer';

// Dados simulados baseados no componente "short-catalog" do Angular
const FEATURED_PRODUCTS = [
  { id: '1', name: 'Trufa de Morango', price: 'R$ 4,50', image: require('@/assets/images/candy-wallpaper.jpg') },
  { id: '2', name: 'Sorvete Artesanal', price: 'R$ 12,00', image: require('@/assets/images/candy-wallpaper.jpg') },
  { id: '3', name: 'Doces Variados', price: 'R$ 8,00', image: require('@/assets/images/candy-wallpaper.jpg') },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Screen>
      
      {/* Seção Hero / Carousel */}
      <View style={styles.bannerContainer}>
        <Image 
          source={require('@/assets/images/candy-wallpaper.jpg')} 
          style={styles.bannerImage} 
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>Bem-vindo à Suki Doces!</Text>
          <Text style={styles.bannerSub}>Os melhores doces artesanais da região</Text>
        </View>
      </View>

      {/* Seção de Marketing com Integração para a Rota de History */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Nossa Essência</Text>
        <Text style={styles.historyText}>
          Descubra como transformamos nossa paixão por doces em pequenos pedaços de felicidade para o seu dia a dia.
        </Text>
        <Pressable 
          style={({ pressed }) => [styles.historyButton, pressed && styles.pressed]} 
          onPress={() => router.navigate('/history')}
        >
          <Text style={styles.historyButtonText}>Ler Nossa História</Text>
          <Icon name="search" color={colors.white} size={18} />
        </Pressable>
      </View>

      {/* Seção Short Catalog */}
      <View style={styles.catalogSection}>
        <Text style={styles.sectionTitle}>Destaques da Loja</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FEATURED_PRODUCTS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.catalogList}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Image source={item.image} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
                <Pressable style={({ pressed }) => [styles.buyButton, pressed && styles.pressed]}>
                  <Text style={styles.buyButtonText}>Adicionar</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
      <Footer/>
    </Screen>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    height: 220,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.pinkPale,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(74, 42, 42, 0.4)', // Fundo escurecido para contraste
    justifyContent: 'center',
    padding: 24,
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  bannerSub: {
    color: colors.pinkLight,
    fontSize: 16,
    fontWeight: '600',
  },
  historySection: {
    marginHorizontal: 16,
    marginTop: 32,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#fff0facc',
    borderWidth: 1,
    borderColor: 'rgba(233, 34, 144, 0.2)',
  },
  sectionTitle: {
    color: colors.brown,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  historyText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pink,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  historyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  catalogSection: {
    marginTop: 32,
  },
  catalogList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  productCard: {
    width: 160,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.pinkPale,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    color: colors.brown,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  productPrice: {
    color: colors.pink,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
  },
  buyButton: {
    backgroundColor: colors.brown,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
});