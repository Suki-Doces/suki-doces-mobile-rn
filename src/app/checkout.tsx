import React, { useRef, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/constants/colors';
import { useCart } from '@/hooks/useCart';
import { cartStore } from '@/services/cartStore';
import {
    newIdempotencyKey,
    orderService,
    type CouponPreview,
    type PaymentMethod,
} from '@/services/orderService';
import { formatBRL } from '@/services/productService';
import type { IconName } from '@/types/icon';

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: IconName }[] = [
    { id: 'pix', label: 'Pix (aprovação imediata)', icon: 'pix' },
    { id: 'cartao', label: 'Cartão de Crédito', icon: 'card' },
    { id: 'boleto', label: 'Boleto Bancário', icon: 'boleto' },
];

export default function CheckoutScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const cart = useCart();
    const idempotencyKeyRef = useRef(newIdempotencyKey());

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [cep, setCep] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [payment, setPayment] = useState<PaymentMethod>('pix');
    const [couponInput, setCouponInput] = useState('');
    const [coupon, setCoupon] = useState<CouponPreview | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const discount = coupon?.valor_desconto ?? 0;
    const finalTotal = Math.max(0, cart.total - discount);

    const handleApplyCoupon = async () => {
        const code = couponInput.trim().toUpperCase();
        if (!code) return;
        try {
            const preview = await orderService.validateCoupon(code, cart.subtotal);
            setCoupon(preview);
            Alert.alert('Cupom aplicado', `Desconto de ${formatBRL(preview.valor_desconto)}.`);
        } catch {
            setCoupon(null);
            Alert.alert('Cupom inválido', 'Verifique o código e tente novamente.');
        }
    };

    const handleConfirm = async () => {
        if (cart.items.length === 0) return;
        setSubmitting(true);
        try {
            const lines = cart.items.map((line) => ({
                id_produto: line.productId,
                quantidade: line.quantity,
            }));
            await orderService.checkout(
                lines,
                payment,
                idempotencyKeyRef.current,
                coupon?.codigo,
            );
            await cartStore.refresh();
            Alert.alert('Pedido confirmado!', 'Acompanhe o andamento em Meus Pedidos.', [
                { text: 'Ver pedidos', onPress: () => router.replace('/orders') },
            ]);
        } catch {
            Alert.alert('Erro', 'Não foi possível finalizar o pedido. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    };

    if (cart.items.length === 0) {
        return (
            <View style={styles.emptyBox}>
                <Icon name="cartEmpty" size={64} color={colors.muted} />
                <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
                <Pressable style={styles.nextBtnInline} onPress={() => router.replace('/(tabs)/catalog')}>
                    <Icon name="back" size={18} color={colors.white} />
                    <Text style={styles.nextText}>Voltar ao catálogo</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.stepperRow}>
                {(['Entrega', 'Pagamento', 'Revisão'] as const).map((label, idx) => {
                    const current = idx + 1;
                    const active = step >= current;
                    return (
                        <View key={label} style={styles.stepItem}>
                            <View style={[styles.stepDot, active && styles.stepDotActive]}>
                                <Text style={[styles.stepNum, active && styles.stepNumActive]}>{current}</Text>
                            </View>
                            <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
                        </View>
                    );
                })}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {step === 1 && (
                    <View style={styles.card}>
                        <View style={styles.cardTitleRow}>
                            <Icon name="address" size={20} color={colors.pink} />
                            <Text style={styles.sectionTitle}>Endereço de entrega</Text>
                        </View>
                        <TextInput
                            placeholder="CEP"
                            placeholderTextColor={colors.muted}
                            keyboardType="numeric"
                            value={cep}
                            onChangeText={setCep}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Rua / Avenida"
                            placeholderTextColor={colors.muted}
                            value={street}
                            onChangeText={setStreet}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Número e complemento"
                            placeholderTextColor={colors.muted}
                            value={number}
                            onChangeText={setNumber}
                            style={styles.input}
                        />
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Forma de pagamento</Text>
                        {PAYMENT_OPTIONS.map((opt) => {
                            const selected = payment === opt.id;
                            return (
                                <Pressable
                                    key={opt.id}
                                    onPress={() => setPayment(opt.id)}
                                    style={[styles.optionRow, selected && styles.optionRowActive]}
                                >
                                    <Icon
                                        name={opt.icon}
                                        size={22}
                                        color={selected ? colors.pink : colors.text}
                                    />
                                    <Text style={styles.optionText}>{opt.label}</Text>
                                </Pressable>
                            );
                        })}

                        <View style={styles.couponRow}>
                            <TextInput
                                placeholder="Código de cupom"
                                placeholderTextColor={colors.muted}
                                autoCapitalize="characters"
                                value={couponInput}
                                onChangeText={setCouponInput}
                                style={[styles.input, { flex: 1 }]}
                            />
                            <Pressable style={styles.couponBtn} onPress={handleApplyCoupon}>
                                <Text style={styles.couponBtnText}>Aplicar</Text>
                            </Pressable>
                        </View>
                    </View>
                )}

                {step === 3 && (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Resumo do pedido</Text>
                        <Text style={styles.summaryLine}>
                            Endereço: {street || 'Não informado'}, {number || 'S/N'} ({cep || 'CEP não informado'})
                        </Text>
                        <Text style={styles.summaryLine}>Pagamento: {payment.toUpperCase()}</Text>
                        <Text style={styles.summaryLine}>Subtotal: {formatBRL(cart.subtotal)}</Text>
                        <Text style={styles.summaryLine}>
                            Frete: {cart.freeShipping ? 'Grátis' : formatBRL(cart.shipping)}
                        </Text>
                        {discount > 0 && (
                            <Text style={[styles.summaryLine, { color: colors.greenDark }]}>
                                Desconto ({coupon?.codigo}): -{formatBRL(discount)}
                            </Text>
                        )}
                        <Text style={styles.summaryTotal}>Total: {formatBRL(finalTotal)}</Text>
                    </View>
                )}
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                {step > 1 && (
                    <Pressable
                        style={styles.backBtn}
                        onPress={() => setStep((s) => (s - 1) as 1 | 2)}
                    >
                        <Icon name="back" size={18} color={colors.brownDark} />
                        <Text style={styles.backText}>Voltar</Text>
                    </Pressable>
                )}
                <Pressable
                    style={styles.nextBtn}
                    disabled={submitting}
                    onPress={() => (step < 3 ? setStep((s) => (s + 1) as 2 | 3) : handleConfirm())}
                >
                    {step === 3 && <Icon name="receiptCheck" size={18} color={colors.white} />}
                    <Text style={styles.nextText}>
                        {step < 3 ? 'Continuar' : submitting ? 'Enviando...' : 'Confirmar Pedido'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.pinkSurface },
    emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 },
    emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.brownDark },
    nextBtnInline: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.pink,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 14,
    },
    stepperRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 14,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderPink,
    },
    stepItem: { alignItems: 'center', gap: 4 },
    stepDot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.pinkPale,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepDotActive: { backgroundColor: colors.pink },
    stepNum: { fontWeight: '700', color: colors.muted },
    stepNumActive: { color: colors.white },
    stepLabel: { fontSize: 12, color: colors.muted },
    stepLabelActive: { color: colors.brownDark, fontWeight: '700' },
    content: { padding: 16, gap: 16 },
    card: {
        backgroundColor: colors.white,
        borderRadius: 18,
        padding: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: colors.borderPink,
    },
    cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.brownDark },
    input: {
        height: 46,
        borderRadius: 12,
        backgroundColor: colors.pinkSurface,
        borderWidth: 1,
        borderColor: colors.borderPink,
        paddingHorizontal: 14,
        fontSize: 15,
        color: colors.brownDark,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.borderPink,
    },
    optionRowActive: { borderColor: colors.pink, backgroundColor: colors.pinkSoft },
    optionText: { fontSize: 15, fontWeight: '600', color: colors.brownDark },
    couponRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
    couponBtn: {
        height: 46,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: colors.brownDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    couponBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
    summaryLine: { fontSize: 14, color: colors.text },
    summaryTotal: { fontSize: 20, fontWeight: '800', color: colors.pink, marginTop: 8 },
    footer: {
        flexDirection: 'row',
        gap: 12,
        padding: 16,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.borderPink,
    },
    backBtn: {
        height: 48,
        paddingHorizontal: 16,
        borderRadius: 14,
        backgroundColor: colors.pinkPale,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    backText: { fontWeight: '700', color: colors.brownDark },
    nextBtn: {
        flex: 1,
        height: 48,
        borderRadius: 14,
        backgroundColor: colors.pink,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    nextText: { color: colors.white, fontSize: 15, fontWeight: '800' },
});