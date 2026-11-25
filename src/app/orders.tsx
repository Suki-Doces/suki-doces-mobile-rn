import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { colors } from '@/constants/colors';
import { useSession } from '@/hooks/useSession';
import { orderService, type Order } from '@/services/orderService';
import { formatBRL } from '@/services/productService';

/** Atualização automática enquanto a tela está aberta (status alterado no painel do site aparece aqui). */
const POLLING_MS = 20000;

const STATUS_LABEL: Record<string, { text: string; color: string; background: string }> = {
  pendente: { text: 'Pendente', color: '#8a5a00', background: '#fff1d6' },
  pago: { text: 'Pago', color: '#1d5b3a', background: '#e3f5ea' },
  enviado: { text: 'Enviado', color: '#1c4b8f', background: '#e3edfb' },
  entregue: { text: 'Entregue', color: '#3d2a6e', background: '#ece6fa' },
  cancelado: { text: 'Cancelado', color: '#9b1c1c', background: '#fde2e2' },
};

const PAYMENT_LABEL: Record<string, string> = { pix: 'PIX', cartao: 'Cartão', boleto: 'Boleto' };

function formatDate(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function OrdersScreen() {
  const router = useRouter();
  const { isLoggedIn, restored } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [busyOrder, setBusyOrder] = useState<number | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setOrders(await orderService.myOrders());
      setError('');
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) return;
      setLoading(true);
      load().finally(() => setLoading(false));
      const timer = setInterval(load, POLLING_MS);
      return () => clearInterval(timer);
    }, [isLoggedIn, load]),
  );

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function act(order: Order, action: 'cancel' | 'pay') {
    setBusyOrder(order.id_pedido);
    try {
      if (action === 'cancel') await orderService.cancel(order.id_pedido);
      else await orderService.pay(order.id_pedido);
      await load();
    } catch (err) {
      Alert.alert('Não foi possível concluir', (err as Error).message);
    } finally {
      setBusyOrder(null);
    }
  }

  function confirmCancel(order: Order) {
    Alert.alert('Cancelar pedido', `Deseja cancelar o pedido #${order.id_pedido}?`, [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim, cancelar', style: 'destructive', onPress: () => act(order, 'cancel') },
    ]);
  }

  if (restored && !isLoggedIn) {
    return (
      <Screen contentContainerStyle={styles.content}>
        <Text style={styles.title}>Meus pedidos</Text>
        <Text style={styles.muted}>Entre na sua conta para ver os pedidos feitos no app e no site.</Text>
        <Pressable accessibilityRole="button" style={styles.linkBtn} onPress={() => router.navigate('/login')}>
          <Text style={styles.linkText}>Entrar / Cadastrar</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.pink} />}
    >
      <Text style={styles.title}>Meus pedidos</Text>
      <Text style={styles.muted}>Pedidos feitos aqui e no site aparecem juntos.</Text>

      {loading && orders.length === 0 ? <ActivityIndicator color={colors.pink} style={styles.loader} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && orders.length === 0 ? (
        <Text style={styles.muted}>Você ainda não fez nenhum pedido.</Text>
      ) : null}

      {orders.map((order) => {
        const status = STATUS_LABEL[order.status] ?? STATUS_LABEL.pendente;
        const busy = busyOrder === order.id_pedido;
        return (
          <View key={order.id_pedido} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>#{String(order.id_pedido).padStart(4, '0')}</Text>
              <Text style={[styles.badge, { color: status.color, backgroundColor: status.background }]}>
                {status.text}
              </Text>
            </View>
            <Text style={styles.muted}>
              {formatDate(order.data_pedido)} · {PAYMENT_LABEL[order.metodo_pagamento ?? ''] ?? order.metodo_pagamento ?? '—'}
              {order.origem ? ` · feito no ${order.origem === 'mobile' ? 'app' : 'site'}` : ''}
            </Text>

            {(order.itens_pedido ?? []).map((item) => (
              <Text key={item.id_item} style={styles.item}>
                {item.quantidade}x {item.produtos?.nome ?? `Produto #${item.id_produto}`}
              </Text>
            ))}

            <View style={styles.cardFooter}>
              <Text style={styles.total}>{formatBRL(Number(order.valor_total))}</Text>
              <View style={styles.actions}>
                {order.status === 'pendente' ? (
                  <Pressable
                    accessibilityRole="button"
                    disabled={busy}
                    onPress={() => act(order, 'pay')}
                    style={[styles.actionBtn, styles.payBtn, busy && styles.disabled]}
                  >
                    <Text style={styles.payText}>Pagar</Text>
                  </Pressable>
                ) : null}
                {order.status === 'pendente' || order.status === 'pago' ? (
                  <Pressable
                    accessibilityRole="button"
                    disabled={busy}
                    onPress={() => confirmCancel(order)}
                    style={[styles.actionBtn, busy && styles.disabled]}
                  >
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 140, gap: 12 },
  title: { fontSize: 24, fontWeight: '800', color: colors.brown },
  muted: { color: colors.muted, fontSize: 13 },
  loader: { marginVertical: 24 },
  error: { color: '#dc3545', fontWeight: '600' },
  card: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderPink,
    gap: 6,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { fontSize: 16, fontWeight: '800', color: colors.brown },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '700',
  },
  item: { color: colors.text },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  total: { fontSize: 16, fontWeight: '800', color: colors.brown },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.pinkLight,
  },
  payBtn: { backgroundColor: colors.pink, borderColor: colors.pink },
  payText: { color: colors.white, fontWeight: '700' },
  cancelText: { color: colors.pinkDark, fontWeight: '700' },
  linkBtn: { alignSelf: 'flex-start', paddingVertical: 10 },
  linkText: { color: colors.pink, fontWeight: '700' },
  disabled: { opacity: 0.5 },
});
