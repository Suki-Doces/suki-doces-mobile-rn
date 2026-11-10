import { useRef, useState } from 'react';
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
import { CandyPlaceholderIcon } from '@/components/home/CandyPlaceholderIcon';
import { colors } from '@/constants/colors';
import { carouselProducts } from '@/constants/home';
import type { CarouselProduct } from '@/interfaces/home';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.72);
const CARD_GAP = 12;
const SIDE_PADDING = Math.round((SCREEN_WIDTH - CARD_WIDTH) / 2);

export function HeroCarousel() {
  const listRef = useRef<FlatList<CarouselProduct>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_GAP));
    if (index >= 0 && index < carouselProducts.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  }

  function scrollToIndex(index: number) {
    const clamped = Math.max(0, Math.min(index, carouselProducts.length - 1));
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
          data={carouselProducts}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_GAP}
          decelerationRate="fast"
          contentContainerStyle={styles.listContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.iconArea}>
                <CandyPlaceholderIcon size={58} color="#4f545c" />
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.rankText}>{item.rankLabel}</Text>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {item.name}
                </Text>

                <View style={styles.bottomRow}>
                  <Text style={styles.price}>{item.price}</Text>
                  <Pressable
                    accessibilityRole="button"
                    style={({ pressed }) => [styles.buyBtn, pressed && styles.pressed]}
                    onPress={() => Alert.alert('Comprar', `${item.name} adicionado!`)}
                  >
                    <Text style={styles.buyBtnText}>Comprar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />

        {/* Botões laterais (< e >) */}
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

      {/* Indicadores (dots) */}
      <View style={styles.dotsRow}>
        {carouselProducts.map((item, idx) => (
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
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#f178b6',
    backgroundColor: '#d9dbe0',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  iconArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  cardFooter: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(45, 42, 46, 0.78)',
    gap: 2,
  },
  rankText: {
    color: '#e0e0e0',
    fontSize: 10,
    fontWeight: '600',
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
    backgroundColor: colors.pink,
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
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '700',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#d8c2cc',
  },
  dotActive: {
    backgroundColor: colors.pink,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});