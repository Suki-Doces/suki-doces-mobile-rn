import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/constants/colors';
import { useCart } from '@/hooks/useCart';
import { useSession } from '@/hooks/useSession';
import { formatBRL } from '@/services/productService';

export default function TabsLayout() {
    const insets = useSafeAreaInsets();
    const cart = useCart();
    const { user, isLoggedIn } = useSession();

    const bottomInset = Math.max(insets.bottom, 12);
    const firstName = user?.nome?.trim().split(/\s+/)[0];
    const profileLabel = isLoggedIn && firstName ? firstName : 'Perfil';
    const cartLabel =
        cart.itemCount > 0 ? formatBRL(cart.subtotal || cart.total) : 'Carrinho';

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.pink,
                tabBarInactiveTintColor: colors.muted,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        height: 64 + bottomInset,
                        paddingBottom: bottomInset + 6,
                    },
                ],
                tabBarLabelStyle: styles.tabLabel,
                tabBarItemStyle: styles.tabItem,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Início',
                    tabBarIcon: ({ color }) => <Icon name="home" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="catalog"
                options={{
                    title: 'Catálogo',
                    tabBarIcon: ({ color }) => <Icon name="products" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: cartLabel,
                    tabBarBadge: cart.itemCount > 0 ? cart.itemCount : undefined,
                    tabBarBadgeStyle: styles.badge,
                    tabBarIcon: ({ color }) => <Icon name="cart" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: profileLabel,
                    tabBarIcon: ({ color }) => <Icon name="profile" size={22} color={color} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        paddingTop: 10,
        paddingHorizontal: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        borderTopWidth: 1,
        borderTopColor: colors.borderPink,
        elevation: 12,
    },
    tabItem: {
        paddingVertical: 2,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
    badge: {
        backgroundColor: colors.pink,
        color: colors.white,
        fontSize: 11,
    },
});