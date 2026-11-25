import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/constants/colors';
import { useSession } from '@/hooks/useSession';
import type { ProductItem } from '@/interfaces/home';
import { cartStore } from '@/services/cartStore';
import { productService, type ApiCategory } from '@/services/productService';

export default function CatalogScreen() {
    const router = useRouter();
    const { isLoggedIn } = useSession();

    const [products, setProducts] = useState<ProductItem[]>([]);
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const [prods, cats] = await Promise.all([
                productService.getProducts(
                    selectedCategoryId ? { categoria: selectedCategoryId } : {},
                ),
                productService.getCategories(),
            ]);
            setProducts(prods);
            setCategories(cats);
        } catch {
            Alert.alert('Erro', 'Não foi possível carregar o catálogo.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [selectedCategoryId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return products;
        return products.filter(
            (item) =>
                item.name.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q),
        );
    }, [products, search]);

    const handleQuickAdd = async (item: ProductItem) => {
        if (!item.productId) return;
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        try {
            await cartStore.add(item.productId, 1);
            Alert.alert('Adicionado', `${item.name} foi para o carrinho.`);
        } catch {
            Alert.alert('Erro', 'Não foi possível adicionar ao carrinho.');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Catálogo</Text>

                <View style={styles.searchBox}>
                    <Icon name="search" size={18} color={colors.muted} />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Buscar doces, trufas, sorvetes..."
                        placeholderTextColor={colors.muted}
                        style={styles.searchInput}
                    />
                    {search.length > 0 && (
                        <Pressable onPress={() => setSearch('')} hitSlop={8}>
                            <Icon name="close" size={18} color={colors.muted} />
                        </Pressable>
                    )}
                </View>
            </View>

            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsRow}
                >
                    <Pressable
                        onPress={() => setSelectedCategoryId(null)}
                        style={[styles.chip, selectedCategoryId === null && styles.chipActive]}
                    >
                        <Text
                            style={[
                                styles.chipText,
                                selectedCategoryId === null && styles.chipTextActive,
                            ]}
                        >
                            Todos
                        </Text>
                    </Pressable>

                    {categories.map((cat) => {
                        const active = selectedCategoryId === cat.id_categoria;
                        return (
                            <Pressable
                                key={cat.id_categoria}
                                onPress={() => setSelectedCategoryId(cat.id_categoria)}
                                style={[styles.chip, active && styles.chipActive]}
                            >
                                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                                    {cat.nome}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={colors.pink} style={styles.loader} />
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                setRefreshing(true);
                                loadData();
                            }}
                            tintColor={colors.pink}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Icon name="searchEmpty" size={56} color={colors.muted} />
                            <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
                            <Text style={styles.emptySubtitle}>
                                Tente buscar por outro termo ou categoria.
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.card}
                            onPress={() => router.push(`/product/${item.id}`)}
                        >
                            <View style={styles.imageWrap}>
                                {item.image ? (
                                    <Image source={{ uri: item.image }} style={styles.image} />
                                ) : (
                                    <Icon name="products" size={34} color={colors.pink} />
                                )}
                            </View>

                            <Text style={styles.cardTitle} numberOfLines={2}>
                                {item.name}
                            </Text>

                            <View style={styles.cardFooter}>
                                <Text style={styles.cardPrice}>{item.price}</Text>
                                <Pressable
                                    style={styles.addBtn}
                                    onPress={() => handleQuickAdd(item)}
                                    disabled={(item.stock ?? 1) <= 0}
                                >
                                    <Icon name="cartAdd" size={18} color={colors.white} />
                                </Pressable>
                            </View>
                        </Pressable>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.pinkSurface },
    header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, gap: 10 },
    title: { fontSize: 26, fontWeight: '800', color: colors.brownDark },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 14,
        paddingHorizontal: 12,
        height: 44,
        gap: 8,
        borderWidth: 1,
        borderColor: colors.borderPink,
    },
    searchInput: { flex: 1, fontSize: 15, color: colors.brownDark },
    chipsRow: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.borderPink,
    },
    chipActive: { backgroundColor: colors.pink, borderColor: colors.pink },
    chipText: { fontSize: 13, fontWeight: '600', color: colors.text },
    chipTextActive: { color: colors.white },
    loader: { marginTop: 48 },
    listContent: { paddingHorizontal: 16, paddingBottom: 28, gap: 12 },
    row: { gap: 12 },
    card: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 18,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.borderPink,
    },
    imageWrap: {
        height: 128,
        borderRadius: 14,
        backgroundColor: colors.pinkSoft,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: 10,
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    cardTitle: { fontSize: 14, fontWeight: '700', color: colors.brownDark, minHeight: 36 },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    cardPrice: { fontSize: 15, fontWeight: '800', color: colors.pink },
    addBtn: {
        width: 34,
        height: 34,
        borderRadius: 12,
        backgroundColor: colors.pink,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyBox: { alignItems: 'center', marginTop: 56, gap: 8, paddingHorizontal: 24 },
    emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.brownDark },
    emptySubtitle: { fontSize: 14, color: colors.muted, textAlign: 'center' },
});