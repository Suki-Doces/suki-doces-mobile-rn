import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/constants/colors';
import { useSession } from '@/hooks/useSession';
import type { ProductItem } from '@/interfaces/home';
import { apiFetch } from '@/services/api';
import { cartStore } from '@/services/cartStore';
import { formatBRL, toProductItem, type ApiProduct } from '@/services/productService';

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { isLoggedIn } = useSession();

    const [product, setProduct] = useState<ProductItem | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                if (!id) return;
                const data = await apiFetch<ApiProduct>(`/produtos/${id}`);
                if (active && data) {
                    setProduct(toProductItem(data));
                }
            } catch {
                if (active) setProduct(null);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => {
            active = false;
        };
    }, [id]);

    const maxStock = product?.stock ?? 99;
    const outOfStock = (product?.stock ?? 0) <= 0;

    const handleAdd = async () => {
        if (!product?.productId) return;
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        setAdding(true);
        try {
            await cartStore.add(product.productId, quantity);
            Alert.alert('Adicionado!', `${quantity}x ${product.name} foi para o carrinho.`, [
                { text: 'Continuar', style: 'cancel' },
                { text: 'Ver carrinho', onPress: () => router.push('/(tabs)/cart') },
            ]);
        } catch {
            Alert.alert('Erro', 'Não foi possível adicionar este item ao carrinho.');
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.pink} />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.center}>
                <Icon name="searchEmpty" size={52} color={colors.muted} />
                <Text style={styles.muted}>Produto não encontrado.</Text>
                <Pressable style={styles.backFallback} onPress={() => router.back()}>
                    <Icon name="back" size={18} color={colors.brownDark} />
                    <Text style={styles.backFallbackText}>Voltar</Text>
                </Pressable>
            </View>
        );
    }

    const total = (product.priceValue ?? 0) * quantity;

    return (
        <View style={styles.container}>
            <Pressable
                style={[styles.floatingBack, { top: insets.top + 12 }]}
                onPress={() => router.back()}
            >
                <Icon name="back" size={20} color={colors.brownDark} />
            </Pressable>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.hero}>
                    {product.image ? (
                        <Image source={{ uri: product.image }} style={styles.heroImg} />
                    ) : (
                        <Icon name="products" size={72} color={colors.pink} />
                    )}
                </View>

                <View style={styles.sheet}>
                    {!!product.category && (
                        <Text style={styles.badge}>{product.category}</Text>
                    )}
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.price}>{product.price}</Text>
                    <Text style={styles.stockText}>
                        {outOfStock ? 'Indisponível no momento' : `${product.stock} em estoque`}
                    </Text>
                    <Text style={styles.description}>
                        {product.description || 'Doce artesanal preparado com ingredientes selecionados.'}
                    </Text>
                </View>
            </ScrollView>

            <View style={[styles.stickyBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <View style={styles.stepper}>
                    <Pressable
                        onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                        style={styles.stepBtn}
                        disabled={quantity <= 1}
                    >
                        <Icon
                            name="minus"
                            size={16}
                            color={quantity <= 1 ? colors.muted : colors.brownDark}
                        />
                    </Pressable>
                    <Text style={styles.qty}>{quantity}</Text>
                    <Pressable
                        onPress={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                        style={styles.stepBtn}
                        disabled={quantity >= maxStock}
                    >
                        <Icon
                            name="plus"
                            size={16}
                            color={quantity >= maxStock ? colors.muted : colors.brownDark}
                        />
                    </Pressable>
                </View>

                <Pressable
                    style={[styles.cta, (outOfStock || adding) && styles.ctaDisabled]}
                    onPress={handleAdd}
                    disabled={outOfStock || adding}
                >
                    <Icon name="cartAdd" size={20} color={colors.white} />
                    <Text style={styles.ctaText}>
                        {outOfStock ? 'Esgotado' : `Adicionar • ${formatBRL(total)}`}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.pinkSurface },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    muted: { color: colors.muted, fontSize: 15 },
    backFallback: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.borderPink,
    },
    backFallbackText: { fontWeight: '700', color: colors.brownDark },
    floatingBack: {
        position: 'absolute',
        left: 16,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.borderPink,
    },
    scrollContent: { paddingBottom: 112 },
    hero: {
        height: 320,
        backgroundColor: colors.pinkSoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroImg: { width: '100%', height: '100%', resizeMode: 'cover' },
    sheet: {
        marginTop: -24,
        backgroundColor: colors.pinkSurface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 20,
        gap: 8,
    },
    badge: {
        alignSelf: 'flex-start',
        backgroundColor: colors.pinkSoft,
        color: colors.pinkDark,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        fontSize: 12,
        fontWeight: '700',
    },
    name: { fontSize: 24, fontWeight: '800', color: colors.brownDark },
    price: { fontSize: 22, fontWeight: '800', color: colors.pink },
    stockText: { fontSize: 13, fontWeight: '600', color: colors.muted },
    description: { fontSize: 15, lineHeight: 22, color: colors.text, marginTop: 6 },
    stickyBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 12,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.borderPink,
    },
    stepper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.pinkPale,
        borderRadius: 14,
        padding: 4,
        gap: 10,
    },
    stepBtn: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qty: { fontSize: 16, fontWeight: '700', color: colors.brownDark, minWidth: 20, textAlign: 'center' },
    cta: {
        flex: 1,
        height: 48,
        borderRadius: 14,
        backgroundColor: colors.pink,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    ctaDisabled: { opacity: 0.5 },
    ctaText: { color: colors.white, fontSize: 15, fontWeight: '800' },
});