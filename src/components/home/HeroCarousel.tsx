import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CandyPlaceholderIcon } from '@/components/home/CandyPlaceholderIcon';
import { colors, gradients } from '@/constants/colors';
import { carouselProducts as fallbackCarousel } from '@/constants/home';
import { productService, ApiProduct } from '@/services/productService'; // Ajuste o caminho se necessário
import type { CarouselProduct } from '@/interfaces/home';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.72);
const CARD_GAP = 12;
const SIDE_PADDING = Math.round((SCREEN_WIDTH - CARD_WIDTH) / 2);

export function HeroCarousel() {
  const listRef = useRef<FlatList<CarouselProduct>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState<CarouselProduct[]>(fallbackCarousel);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productService
      .getProducts()
      .then((apiItems) => {
        if (apiItems && apiItems.length > 0) {
          // Mapeia os dados da API para o formato esperado pelo carrossel
          const mapped: CarouselProduct[] = apiItems.slice(0, 5).map((item, index) => ({
            id: String(item.id),
            rankLabel: index === 0 ? 'Mais Vendido' : `${index + 1}º Destaque`,
            name: item.name,
            price: item.price,
          }));
          setProducts(mapped);
        }
      })
      .catch((err) => {
        console.warn('Erro ao carregar carrossel da API, usando fallback local:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_GAP));
    if (index >= 0 && index < products.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  }

  function scrollToIndex(index: number) {
    const clamped = Math.max(0, Math.min(index, products.length - 1));
    listRef.current?.scrollToOffset({
      offset: clamped * (CARD_WIDTH + CARD_GAP),
      animated: true,
    });
    setActiveIndex(clamped);
  }

  return (
    <View style={styles.container}>
      <View style={styles.carouselRow}>
        <FlatList
          ref={listRef}
          data={products}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_GAP}
          decelerationRate="fast"
          contentContainerStyle={styles.listContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <LinearGradient colors={gradients.carouselCardBg} style={styles.card}>
              <View style={styles.iconArea}>
                <CandyPlaceholderIcon size={58} color="#4f545c" />
              </View>

              <LinearGradient
                colors={gradients.carouselOverlay}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.cardFooter}
              >
                <Text style={styles.rankText}>{item.rankLabel}</Text>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {item.name}
                </Text>

                <View style={styles.bottomRow}>
                  <Text style={styles.price}>{item.price}</Text>
                  <Pressable
                    accessibilityRole="button"
                    style={({ pressed }) => [pressed && styles.pressed]}
                    onPress={() => Alert.alert('Carrinho', `${item.name} adicionado!`)}
                  >
                    <LinearGradient
                      colors={gradients.brandPink}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.buyBtn}
                    >
                      <Text style={styles.buyBtnText}>Comprar</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </LinearGradient>
            </LinearGradient>
          )}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Anterior"
          style={[styles.navArrow, styles.navArrowLeft]}
          onPress={() => scrollToIndex(activeIndex - 1)}
        >
          <Text style={styles.navArrowText}>‹</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Próximo"
          style={[styles.navArrow, styles.navArrowRight]}
          onPress={() => scrollToIndex(activeIndex + 1)}
        >
          <Text style={styles.navArrowText}>›</Text>
        </Pressable>
      </View>

      <View style={styles.dotsRow}>
        {products.map((item, idx) => (
          <View
            key={item.id}
            style={[styles.dot, idx === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
    gap: 10,
  },
  carouselRow: {
    position: 'relative',
    height: 195,
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: SIDE_PADDING,
    gap: CARD_GAP,
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: 185,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.timelinePink,
    overflow: 'hidden',
    justifyContent: 'space-between',
    shadowColor: colors.pink,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  iconArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  cardFooter: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 10,
    gap: 2,
  },
  rankText: {
    color: colors.pinkLight,
    fontSize: 10,
    fontWeight: '700',
  },
  productTitle: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
  },
  bottomRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
  },
  buyBtn: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 16,
  },
  buyBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
  navArrow: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    zIndex: 5,
  },
  navArrowLeft: {
    left: 14,
  },
  navArrowRight: {
    right: 14,
  },
  navArrowText: {
    color: colors.brown,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '800',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d8c2cc',
  },
  dotActive: {
    backgroundColor: colors.pink,
    width: 16,
    height: 6,
    borderRadius: 3,
  },
});