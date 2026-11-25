import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CandyPlaceholderIcon } from '@/components/home/CandyPlaceholderIcon';
import { Icon } from '@/components/ui/Icon';
import { colors, gradients } from '@/constants/colors';
import { quickProducts as fallbackProducts } from '@/constants/home';
import type { QuickProduct, QuickTab } from '@/interfaces/home';
import { cartStore } from '@/services/cartStore';
import { productService } from '@/services/productService';
import { sessionStore } from '@/services/session';

export function ShortCatalog() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<QuickTab>('bestsellers');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<QuickProduct[]>(fallbackProducts);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    productService
      .getProducts()
      .then((apiItems) => {
        if (apiItems && apiItems.length > 0) {
          const mapped: QuickProduct[] = apiItems.map((item, index) => ({
            id: String(item.id),
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            tab: index % 2 === 0 ? 'bestsellers' : 'releases',
          }));
          setProducts(mapped);
        }
      })
      .catch((err) => {
        console.warn('Erro ao buscar produtos da API para o ShortCatalog, usando fallback:', err);
      });
  }, []);

  const visibleProducts = products.filter((item) => item.tab === activeTab);

  function getQty(id: string) {
    return quantities[id] ?? 1;
  }

  function changeQty(id: string, delta: number) {
    setQuantities((prev) => {
      const current = prev[id] ?? 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  }

  async function handleBuy(product: QuickProduct) {
    const qty = getQty(product.id);
    if (!product.productId) {
      Alert.alert('Indisponível', 'Este produto é só um exemplo. Conecte o app à API para comprar.');
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
      await cartStore.add(product.productId, qty);
      Alert.alert('Carrinho', `${qty}x ${product.name} adicionado ao carrinho!`, [
        { text: 'Continuar comprando', style: 'cancel' },
        { text: 'Ver carrinho', onPress: () => router.push('/(tabs)/cart') },
      ]);
    } catch (error) {
      Alert.alert('Não foi possível adicionar', (error as Error).message);
    }
  }

  return (
    <LinearGradient
      colors={gradients.catalogContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.heading}>Fazer uma compra rápida</Text>

      <View style={styles.tabsRow}>
        {(['bestsellers', 'releases'] as const).map((tab) => {
          const isSelected = activeTab === tab;
          const label = tab === 'bestsellers' ? 'Mais vendidos' : 'Lançamentos';
          return (
            <Pressable
              key={tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setActiveTab(tab)}
            >
              {isSelected ? (
                <LinearGradient
                  colors={gradients.brandPink}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabBtn}
                >
                  <Text style={[styles.tabText, styles.tabTextActive]}>{label}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabBtn}>
                  <Text style={styles.tabText}>{label}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.grid}>
        {visibleProducts.map((item) => {
          const qty = getQty(item.id);
          const hasValidImage =
            !!item.image &&
            item.image.startsWith('http') &&
            !failedImages[item.id];

          return (
            <View key={item.id} style={styles.card}>
              <Pressable
                onPress={() => item.productId && router.push(`/product/${item.id}`)}
              >
                <View style={styles.iconBox}>
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
                    <CandyPlaceholderIcon size={54} color="#6e7278" />
                  )}
                </View>

                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
              </Pressable>

              <Text style={styles.productPrice}>{item.price}</Text>

              <View style={styles.qtyRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Diminuir quantidade de ${item.name}`}
                  style={styles.qtyBtn}
                  onPress={() => changeQty(item.id, -1)}
                >
                  <Icon name="minus" size={13} color={colors.pink} />
                </Pressable>
                <Text style={styles.qtyValue}>{qty}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Aumentar quantidade de ${item.name}`}
                  style={styles.qtyBtn}
                  onPress={() => changeQty(item.id, 1)}
                >
                  <Icon name="plus" size={13} color={colors.pink} />
                </Pressable>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Comprar ${item.name}`}
                style={({ pressed }) => [pressed && styles.pressed]}
                onPress={() => handleBuy(item)}
              >
                <LinearGradient
                  colors={gradients.brandPink}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buyButton}
                >
                  <Text style={styles.buyButtonText}>Comprar</Text>
                </LinearGradient>
              </Pressable>
            </View>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    paddingVertical: 22,
    paddingHorizontal: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(233, 34, 144, 0.12)',
    gap: 14,
  },
  heading: {
    color: colors.brown,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  tabText: {
    color: colors.brown,
    fontSize: 12,
    fontWeight: '700',
  },
  tabTextActive: {
    color: colors.white,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  card: {
    width: '48.2%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    gap: 6,
    shadowColor: colors.brown,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  iconBox: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faf7f9',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 6,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productName: {
    color: colors.brown,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    minHeight: 32,
  },
  productPrice: {
    color: colors.pink,
    fontSize: 13,
    fontWeight: '800',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.borderPink,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 2,
  },
  qtyBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  qtyValue: {
    color: colors.brown,
    fontSize: 12,
    fontWeight: '700',
  },
  buyButton: {
    marginTop: 4,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
  },
});