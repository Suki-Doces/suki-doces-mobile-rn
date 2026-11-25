import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CandyPlaceholderIcon } from '@/components/home/CandyPlaceholderIcon';
import { Icon } from '@/components/ui/Icon';
import { colors, gradients } from '@/constants/colors';
import { carouselProducts as fallbackCarousel } from '@/constants/home';
import type { CarouselProduct } from '@/interfaces/home';
import { cartStore } from '@/services/cartStore';
import { productService } from '@/services/productService';
import { sessionStore } from '@/services/session';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.72);
const CARD_GAP = 12;
const SIDE_PADDING = Math.round((SCREEN_WIDTH - CARD_WIDTH) / 2);
const AUTOPLAY_MS = 4000;

export function HeroCarousel() {
  const router = useRouter();
  const listRef = useRef<FlatList<CarouselProduct>>(null);
  const isDraggingRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [products, setProducts] = useState<CarouselProduct[]>(fallbackCarousel);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    productService
      .getProducts()
      .then((apiItems) => {
        if (apiItems && apiItems.length > 0) {
          const mapped: CarouselProduct[] = apiItems.slice(0, 5).map((item, index) => ({
            id: String(item.id),
            productId: item.productId,
            rankLabel: index === 0 ? 'Mais Vendido' : `${index + 1}º Destaque`,
            name: item.name,
            price: item.price,
            image: item.image,
          }));
          setProducts(mapped);
        }
      })
      .catch((err) => {
        console.warn('Erro ao carregar carrossel da API, usando fallback local:', err);
      });
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (products.length === 0) return;
      const looped = ((index % products.length) + products.length) % products.length;
      listRef.current?.scrollToOffset({
        offset: looped * (CARD_WIDTH + CARD_GAP),
        animated: true,
      });
      setActiveIndex(looped);
    },
    [products.length],
  );

  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(() => {
      if (!isDraggingRef.current) {
        setActiveIndex((prev) => {
          const next = (prev + 1) % products.length;
          listRef.current?.scrollToOffset({
            offset: next * (CARD_WIDTH + CARD_GAP),
            animated: true,
          });
          return next;
        });
      }
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [products.length]);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_GAP));
    if (index >= 0 && index < products.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  }

  async function handleBuy(item: CarouselProduct) {
    if (!item.productId) {
      Alert.alert('Indisponível', 'Conecte o app à API para comprar este produto.');
      return;
    }
    if (!sessionStore.get()) {
      Alert.alert('Entre na sua conta', 'Faça login para adicionar produtos ao carrinho.', [
        { text: 'Agora não', style: 'cancel' },
        { text: 'Entrar', onPress: () => router.push('/login') },
      ]);
      return;
    }
    try {
      await cartStore.add(item.productId, 1);
      Alert.alert('Carrinho', `${item.name} adicionado!`, [
        { text: 'Continuar', style: 'cancel' },
        { text: 'Ver carrinho', onPress: () => router.push('/(tabs)/cart') },
      ]);
    } catch (error) {
      Alert.alert('Não foi possível adicionar', (error as Error).message);
    }
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
          onScrollBeginDrag={() => {
            isDraggingRef.current = true;
          }}
          onScrollEndDrag={() => {
            isDraggingRef.current = false;
          }}
          onMomentumScrollEnd={() => {
            isDraggingRef.current = false;
          }}
          scrollEventThrottle={16}
          renderItem={({ item }) => {
            const hasValidImage =
              !!item.image &&
              item.image.startsWith('http') &&
              !failedImages[item.id];

            return (
              <Pressable
                style={styles.cardWrap}
                onPress={() => item.productId && router.push(`/product/${item.id}`)}
              >
                <LinearGradient colors={gradients.carouselCardBg} style={styles.card}>
                  {hasValidImage ? (
                    <Image
                      source={{ uri: item.image }}
                      style={styles.productImage}
                      resizeMode="cover"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [item.id]: true }))
                      }
                    />
                  ) : (
                    <View style={styles.iconArea}>
                      <CandyPlaceholderIcon size={58} color="#4f545c" />
                    </View>
                  )}

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
                        onPress={() => handleBuy(item)}
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
              </Pressable>
            );
          }}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Anterior"
          style={[styles.navArrow, styles.navArrowLeft]}
          onPress={() => scrollToIndex(activeIndex - 1)}
        >
          <Icon name="chevronLeft" size={16} color={colors.brown} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Próximo"
          style={[styles.navArrow, styles.navArrowRight]}
          onPress={() => scrollToIndex(activeIndex + 1)}
        >
          <Icon name="chevronRight" size={16} color={colors.brown} />
        </Pressable>
      </View>

      <View style={styles.dotsRow}>
        {products.map((item, idx) => (
          <Pressable
            key={item.id}
            onPress={() => scrollToIndex(idx)}
            hitSlop={6}
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
  cardWrap: {
    width: CARD_WIDTH,
    height: 185,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.timelinePink,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    shadowColor: colors.pink,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  productImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  iconArea: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 56,
  },
  cardFooter: {
    paddingHorizontal: 12,
    paddingTop: 22,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.92)',
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