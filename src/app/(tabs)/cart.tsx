import { useCallback, useRef, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/layout/Screen';
import { CandyPlaceholderIcon } from '@/components/home/CandyPlaceholderIcon';
import { colors, gradients } from '@/constants/colors';
import { useCart } from '@/hooks/useCart';
import { useSession } from '@/hooks/useSession';
import { cartStore } from '@/services/cartStore';
import { newIdempotencyKey, orderService, type PaymentMethod } from '@/services/orderService';
import { formatBRL } from '@/services/productService';

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; hint: string }[] = [
  { value: 'pix', label: 'PIX', hint: 'Aprovação na hora' },
  { value: 'cartao', label: 'Cartão', hint: 'Aprovação na hora' },
  { value: 'boleto', label: 'Boleto', hint: 'Fica pendente até o pagamento' },
];

export default function CartScreen() {
  const router = useRouter();
  const { isLoggedIn, restored } = useSession();
  const cart = useCart();

  const [loading, setLoading] = useState(false);
  const [busyItem, setBusyItem] = useState<number | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>('pix');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Mantida entre tentativas da MESMA compra: reenviar após falha de rede não duplica o pedido.
  const idempotencyKey = useRef<string | null>(null);

  // Sempre que a tela ganha foco, relê o carrinho do servidor (pode ter mudado pelo site).
  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) return;
      setLoading(true);
      cartStore
        .refresh()
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    }, [isLoggedIn]),
  );

  async function changeQuantity(itemId: number, quantity: number) {
    setBusyItem(itemId);
    setError('');
    try {
      if (quantity <= 0) await cartStore.remove(itemId);
      else await cartStore.setQuantity(itemId, quantity);
      resetCoupon();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyItem(null);
    }
  }

  function resetCoupon() {
    setDiscount(0);
    setAppliedCoupon(null);
    setCouponMessage('');
  }

  async function applyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponMessage('');
    try {
      const preview = await orderService.validateCoupon(code, cart.subtotal);
      setDiscount(preview.valor_desconto);
      setAppliedCoupon(preview.codigo);
      setCouponMessage(`Cupom ${preview.codigo} aplicado: -${formatBRL(preview.valor_desconto)}`);
    } catch (err) {
      resetCoupon();
      setCouponMessage((err as Error).message || 'Cupom inválido ou expirado.');
    }
  }

  async function finishPurchase() {
    if (cart.items.length === 0 || submitting) return;
    setSubmitting(true);
    setError('');
    idempotencyKey.current ??= newIdempotencyKey();

    try {
      const order = await orderService.checkout(
        cart.items.map((line) => ({ id_produto: line.productId, quantidade: line.quantity })),
        payment,
        idempotencyKey.current,
        appliedCoupon ?? undefined,
      );
      idempotencyKey.current = null;
      await cartStore.clear().catch(() => undefined);
      resetCoupon();
      setCouponCode('');

      const statusText =
        order.status === 'pago'
          ? 'Pagamento aprovado!'
          : 'Pedido registrado. Pague o boleto para liberarmos o envio.';
      Alert.alert(`Pedido #${order.id_pedido} criado`, statusText, [
        { text: 'Ver meus pedidos', onPress: () => router.navigate('/orders') },
      ]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  if (restored && !isLoggedIn) {
    return (
      <Screen>
        <View style={styles.emptyBox}>
          <Text style={styles.title}>Seu carrinho</Text>
          <Text style={styles.muted}>
            Entre na sua conta para montar o carrinho. Ele é o mesmo do site: o que você adicionar
            aqui também aparece lá.
          </Text>
          <PrimaryButton label="Entrar / Cadastrar" onPress={() => router.navigate('/login')} />
        </View>
      </Screen>
    );
  }

  const total = Math.max(0, cart.subtotal - discount) + cart.shipping;

  return (
    <Screen keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
      <Text style={styles.title}>Seu carrinho</Text>

      {loading && cart.items.length === 0 ? (
        <ActivityIndicator color={colors.pink} style={styles.loader} />
      ) : null}

      {!loading && cart.items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.muted}>Seu carrinho está vazio.</Text>
          <PrimaryButton label="Ver produtos" onPress={() => router.navigate('/')} />
        </View>
      ) : null}

      {cart.items.map((line) => (
        <View key={line.id} style={styles.card}>
          <View style={styles.thumb}>
            {line.product.image ? (
              <Image source={{ uri: line.product.image }} style={styles.thumbImg} />
            ) : (
              <CandyPlaceholderIcon size={36} color="#6e7278" />
            )}
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.productName} numberOfLines={2}>
              {line.product.name}
            </Text>
            <Text style={styles.muted}>{line.product.price} un.</Text>
            <View style={styles.qtyRow}>
              <QtyButton
                label="-"
                accessibilityLabel={`Diminuir ${line.product.name}`}
                disabled={busyItem === line.id}
                onPress={() => changeQuantity(line.id, line.quantity - 1)}
              />
              <Text style={styles.qtyValue}>{line.quantity}</Text>
              <QtyButton
                label="+"
                accessibilityLabel={`Aumentar ${line.product.name}`}
                disabled={busyItem === line.id}
                onPress={() => changeQuantity(line.id, line.quantity + 1)}
              />
              <Pressable
                accessibilityRole="button"
                onPress={() => changeQuantity(line.id, 0)}
                style={styles.removeBtn}
              >
                <Text style={styles.removeText}>Remover</Text>
              </Pressable>
            </View>
          </View>
          <Text style={styles.lineTotal}>{formatBRL(line.total)}</Text>
        </View>
      ))}

      {cart.items.length > 0 ? (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pagamento</Text>
            {PAYMENT_OPTIONS.map((option) => {
              const selected = payment === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => setPayment(option.value)}
                  style={[styles.option, selected && styles.optionSelected]}
                >
                  <View style={[styles.radio, selected && styles.radioSelected]} />
                  <View>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.muted}>{option.hint}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cupom</Text>
            <View style={styles.couponRow}>
              <TextInput
                value={couponCode}
                onChangeText={(value) => {
                  setCouponCode(value);
                  if (appliedCoupon) resetCoupon();
                }}
                placeholder="Código do cupom"
                placeholderTextColor="#9b8a90"
                autoCapitalize="characters"
                style={styles.input}
              />
              <Pressable accessibilityRole="button" onPress={applyCoupon} style={styles.couponBtn}>
                <Text style={styles.couponBtnText}>Aplicar</Text>
              </Pressable>
            </View>
            {couponMessage ? (
              <Text style={appliedCoupon ? styles.success : styles.errorText}>{couponMessage}</Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <SummaryRow label="Subtotal" value={formatBRL(cart.subtotal)} />
            {discount > 0 ? <SummaryRow label="Desconto" value={`- ${formatBRL(discount)}`} /> : null}
            <SummaryRow
              label="Frete"
              value={cart.freeShipping || cart.shipping === 0 ? 'Grátis' : formatBRL(cart.shipping)}
            />
            <View style={styles.divider} />
            <SummaryRow label="Total" value={formatBRL(total)} strong />
          </View>

          {error ? <Text style={[styles.errorText, styles.errorBox]}>{error}</Text> : null}

          <PrimaryButton
            label={submitting ? 'Finalizando...' : 'Finalizar compra'}
            disabled={submitting}
            onPress={finishPurchase}
          />
        </>
      ) : error ? (
        <Text style={[styles.errorText, styles.errorBox]}>{error}</Text>
      ) : null}
    </Screen>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, strong && styles.summaryStrong]}>{label}</Text>
      <Text style={[styles.summaryValue, strong && styles.summaryStrong]}>{value}</Text>
    </View>
  );
}

function QtyButton(props: {
  label: string;
  accessibilityLabel: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
      disabled={props.disabled}
      onPress={props.onPress}
      style={[styles.qtyBtn, props.disabled && styles.disabled]}
    >
      <Text style={styles.qtyBtnText}>{props.label}</Text>
    </Pressable>
  );
}

function PrimaryButton(props: { label: string; disabled?: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={props.disabled}
      onPress={props.onPress}
      style={({ pressed }) => [styles.primaryWrapper, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={gradients.brandPink}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.primaryBtn, props.disabled && styles.disabled]}
      >
        <Text style={styles.primaryText}>{props.label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 140, gap: 14 },
  title: { fontSize: 24, fontWeight: '800', color: colors.brown, marginBottom: 4 },
  muted: { color: colors.muted, fontSize: 13 },
  loader: { marginVertical: 24 },
  emptyBox: { gap: 14, paddingHorizontal: 20, paddingVertical: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderPink,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.pinkSurface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImg: { width: '100%', height: '100%' },
  cardBody: { flex: 1, gap: 4 },
  productName: { fontWeight: '700', color: colors.brown, fontSize: 15 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 18, fontWeight: '700', color: colors.pink },
  qtyValue: { minWidth: 20, textAlign: 'center', fontWeight: '700', color: colors.brown },
  removeBtn: { marginLeft: 'auto', paddingHorizontal: 6, paddingVertical: 4 },
  removeText: { color: colors.pinkDark, fontSize: 12, fontWeight: '600' },
  lineTotal: { fontWeight: '800', color: colors.brown },
  section: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.pinkSurface,
    gap: 8,
  },
  sectionTitle: { fontWeight: '800', color: colors.brown, fontSize: 16 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderPink,
    backgroundColor: colors.white,
  },
  optionSelected: { borderColor: colors.pink },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.pinkLight },
  radioSelected: { borderColor: colors.pink, backgroundColor: colors.pink },
  optionLabel: { fontWeight: '700', color: colors.brown },
  couponRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.pinkLight,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.brown,
  },
  couponBtn: {
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  couponBtnText: { color: colors.white, fontWeight: '700' },
  success: { color: colors.greenDark, fontWeight: '600' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { color: colors.text },
  summaryValue: { color: colors.brown, fontWeight: '600' },
  summaryStrong: { fontSize: 17, fontWeight: '800', color: colors.brown },
  divider: { height: 1, backgroundColor: colors.borderPink, marginVertical: 4 },
  errorText: { color: '#dc3545', fontWeight: '600' },
  errorBox: {
    backgroundColor: '#ffd6d6cc',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
  primaryWrapper: { borderRadius: 14, overflow: 'hidden' },
  primaryBtn: {
    minHeight: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primaryText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  disabled: { opacity: 0.5 },
});
