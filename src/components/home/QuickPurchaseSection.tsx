import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { CandyPlaceholderIcon } from '@/components/home/CandyPlaceholderIcon';
import { colors } from '@/constants/colors';
import { quickProducts } from '@/constants/home';
import type { QuickProduct, QuickTab } from '@/interfaces/home';

export function QuickPurchaseSection() {
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
    Alert.alert('Carrinho', `${qty}x ${product.name} adicionado ao carrinho!`);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Fazer uma compra rápida</Text>

      {/* Abas Mais vendidos | Lançamentos */}
      <View style={styles.tabsRow}>
        <Pressable
          accessibilityRole="tab"
          style={[styles.tabBtn, activeTab === 'bestsellers' && styles.tabBtnActive]}
          onPress={() => setActiveTab('bestsellers')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'bestsellers' && styles.tabTextActive,
            ]}
          >
            Mais vendidos
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="tab"
          style={[styles.tabBtn, activeTab === 'releases' && styles.tabBtnActive]}
          onPress={() => setActiveTab('releases')}
        >
          <Text
            style={[styles.tabText, activeTab === 'releases' && styles.tabTextActive]}
          >
            Lançamentos
          </Text>
        </Pressable>
      </View>

      {/* Grelha 2x2 de Produtos */}
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

              {/* Seletor de quantidade (- 1 +) */}
              <View style={styles.qtyRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Diminuir quantidade"
                  style={styles.qtyBtn}
                  onPress={() => changeQty(item.id, -1)}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </Pressable>

                <Text style={styles.qtyValue}>{qty}</Text>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Aumentar quantidade"
                  style={styles.qtyBtn}
                  onPress={() => changeQty(item.id, 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </Pressable>
              </View>

              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [styles.buyButton, pressed && styles.pressed]}
                onPress={() => handleBuy(item)}
              >
                <Text style={styles.buyButtonText}>Comprar</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    paddingVertical: 22,
    paddingHorizontal: 12,
    borderRadius: 24,
    backgroundColor: '#fde8f1',
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
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: colors.white,
  },
  tabBtnActive: {
    backgroundColor: colors.pink,
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
  },
  iconBox: {
    height: 95,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderColor: '#f0dce5',
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
    backgroundColor: colors.pink,
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