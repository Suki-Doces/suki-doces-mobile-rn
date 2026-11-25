import { StyleSheet, View } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { LoginBox } from '@/components/login/LoginBox';
import { LoginHighlights } from '@/components/login/LoginHighlights';

export default function LoginScreen() {
    return (
        <Screen keyboardShouldPersistTaps="handled">
            <View style={styles.loginContainer}>
                <LoginBox />
                {/* No CSS web (@media max-width: 850px), .login-img fica oculto.
            Se quiser ocultar no mobile, basta remover a linha abaixo: */}
                <LoginHighlights />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    loginContainer: {
        paddingVertical: 24,
        paddingHorizontal: 20,
        gap: 20,
    },
});