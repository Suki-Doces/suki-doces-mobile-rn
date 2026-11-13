import { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { CandyPlaceholderIcon } from '@/components/home/CandyPlaceholderIcon';
import { colors } from '@/constants/colors';
import { quickProducts } from '@/constants/home';

interface PreviewProduct {
    id: string;
    nome: string;
    preco: string;
    tag: 'Novo' | 'Destaque';
}

const allPreviewProducts: PreviewProduct[] = quickProducts.map((p, idx) => ({
    id: p.id,
    nome: p.name,
    preco: p.price,
    tag: p.tab === 'releases' || idx >= quickProducts.length - 4 ? 'Novo' : 'Destaque',
}));

export function LoginHighlights() {
    const [produtosExibidos, setProdutosExibidos] = useState<PreviewProduct[]>(() =>
        allPreviewProducts.slice(0, 5)
    );
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade-out (.product-preview.fading)
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                const shuffled = [...allPreviewProducts]
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 5);
                setProdutosExibidos(shuffled);

                // Fade-in
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }).start();
            });
        }, 10000);

        return () => clearInterval(interval);
    }, [fadeAnim]);

    return (
        <ImageBackground
            source={require('@/assets/images/candy-wallpaper.jpg')}
            style={styles.loginImg}
            imageStyle={styles.loginImgBg}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <Text style={styles.heading}>Entre e aproveite!</Text>

                <Animated.View style={[styles.productPreview, { opacity: fadeAnim }]}>
                    {produtosExibidos.map((p) => (
                        <View key={p.id} style={styles.miniCard}>
                            <View style={styles.thumbBox}>
                                <CandyPlaceholderIcon size={40} color="#6e7278" />
                            </View>

                            <View style={styles.info}>
                                <Text style={styles.nome} numberOfLines={1}>
                                    {p.nome}
                                </Text>
                                <Text style={styles.preco}>{p.preco}</Text>
                            </View>

                            <View
                                style={[
                                    styles.badge,
                                    p.tag === 'Novo' ? styles.badgeNovo : styles.badgeDestaque,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.badgeText,
                                        p.tag === 'Novo' ? styles.badgeNovoText : styles.badgeDestaqueText,
                                    ]}
                                >
                                    {p.tag}
                                </Text>
                            </View>
                        </View>
                    ))}
                </Animated.View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    loginImg: {
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
    },
    loginImgBg: {
        borderRadius: 20,
    },
    overlay: {
        padding: 20,
        backgroundColor: 'rgba(255, 240, 247, 0.78)',
        gap: 14,
    },
    heading: {
        color: colors.brown, // var(--t-color-3)
        fontSize: 22,
        fontWeight: '800',
    },
    productPreview: {
        gap: 12,
        width: '100%',
    },
    miniCard: {
        backgroundColor: colors.white,
        padding: 10,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(247, 181, 204, 0.5)',
        shadowColor: colors.pink,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
    },
    thumbBox: {
        width: 56,
        height: 56,
        borderRadius: 8,
        backgroundColor: '#faf5f8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
        gap: 2,
    },
    nome: {
        fontWeight: '600',
        fontSize: 14,
        color: '#333333',
    },
    preco: {
        color: colors.timelinePink, // #f178b6
        fontWeight: '700',
        fontSize: 14,
    },
    badge: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 10,
    },
    badgeNovo: {
        backgroundColor: '#98ff98',
    },
    badgeDestaque: {
        backgroundColor: '#ffa500',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    badgeNovoText: {
        color: '#2d5a2d',
    },
    badgeDestaqueText: {
        color: colors.white,
    },
});