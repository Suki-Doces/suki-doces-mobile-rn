import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/constants/colors';
import { useSession } from '@/hooks/useSession';
import { authService } from '@/services/authService';
import type { IconName } from '@/types/icon';

const MENU_ITEMS: { label: string; icon: IconName; route: string }[] = [
    { label: 'Meus Pedidos', icon: 'orders', route: '/orders' },
    { label: 'Fale Conosco', icon: 'mail', route: '/contact' },
    { label: 'Nossa História', icon: 'userData', route: '/history' },
    { label: 'Verificar E-mail', icon: 'security', route: '/verify-email' },
];

export default function ProfileScreen() {
    const router = useRouter();
    const { user, isLoggedIn } = useSession();

    const handleLogout = async () => {
        await authService.logout();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Perfil</Text>

                <View style={styles.userCard}>
                    <View style={styles.avatar}>
                        {user?.foto_perfil ? (
                            <Image source={{ uri: user.foto_perfil }} style={styles.avatarImg} />
                        ) : (
                            <Icon name="profile" size={26} color={colors.pink} />
                        )}
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.userName}>{user?.nome || 'Visitante'}</Text>
                        <Text style={styles.userEmail}>
                            {user?.email || 'Entre para acompanhar seus pedidos'}
                        </Text>
                    </View>

                    {!isLoggedIn && (
                        <Pressable style={styles.loginBtn} onPress={() => router.push('/login')}>
                            <Text style={styles.loginBtnText}>Entrar</Text>
                        </Pressable>
                    )}
                </View>

                <View style={styles.group}>
                    {MENU_ITEMS.map((item, idx) => (
                        <Pressable
                            key={item.route}
                            style={[styles.row, idx === MENU_ITEMS.length - 1 && styles.rowLast]}
                            onPress={() => router.push(item.route as any)}
                        >
                            <Icon name={item.icon} size={20} color={colors.pink} />
                            <Text style={styles.rowLabel}>{item.label}</Text>
                            <Icon name="chevronRight" size={18} color={colors.muted} />
                        </Pressable>
                    ))}
                </View>

                {isLoggedIn && (
                    <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                        <Icon name="userDanger" size={20} color="#DC2626" />
                        <Text style={styles.logoutText}>Sair da conta</Text>
                    </Pressable>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.pinkSurface },
    content: { padding: 16, gap: 16 },
    title: { fontSize: 26, fontWeight: '800', color: colors.brownDark },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.borderPink,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.pinkSoft,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImg: { width: '100%', height: '100%' },
    userName: { fontSize: 17, fontWeight: '800', color: colors.brownDark },
    userEmail: { fontSize: 13, color: colors.muted, marginTop: 2 },
    loginBtn: {
        backgroundColor: colors.pink,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
    },
    loginBtnText: { color: colors.white, fontWeight: '700', fontSize: 13 },
    group: {
        backgroundColor: colors.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.borderPink,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.pinkPale,
    },
    rowLast: { borderBottomWidth: 0 },
    rowLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.brownDark },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 14,
        borderRadius: 16,
        backgroundColor: '#FEF2F2',
    },
    logoutText: { color: '#DC2626', fontWeight: '700', fontSize: 15 },
});