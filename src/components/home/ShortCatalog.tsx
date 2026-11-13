import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CandyPlaceholderIcon } from '@/components/home/CandyPlaceholderIcon';
import { colors, gradients } from '@/constants/colors';
import { quickProducts } from '@/constants/home';
import type { QuickProduct, QuickTab } from '@/interfaces/home';

export function ShortCatalog() {
  const [activeTab, setActiveTab] = useState<QuickTab>('bestsellers');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const visibleProducts = quickProducts.filter((item) => item.tab === activeTab);

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

  function handleBuy(product: QuickProduct) {
    const qty = getQty(product.id);
    Alert.alert('Carrinho', `${qty}x ${product.name} (${product.price}) adicionado ao carrinho!`);
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
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.iconBox}>
                <CandyPlaceholderIcon size={54} color="#6e7278" />
              </View>
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.productPrice}>{item.price}</Text>

              <View style={styles.qtyRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Diminuir quantidade de ${item.name}`}
                  style={styles.qtyBtn}
                  onPress={() => changeQty(item.id, -1)}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </Pressable>
                <Text style={styles.qtyValue}>{qty}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Aumentar quantidade de ${item.name}`}
                  style={styles.qtyBtn}
                  onPress={() => changeQty(item.id, 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
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
    height: 95,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faf7f9',
    borderRadius: 12,
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
    paddingVertical: 3,
    marginTop: 2,
  },
  qtyBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  qtyBtnText: {
    color: colors.pink,
    fontSize: 14,
    fontWeight: '700',
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