import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import {
    Animated,
    type LayoutChangeEvent,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SukiLoginLogo } from '@/components/login/SukiLoginLogo';
import { colors, gradients } from '@/constants/colors';

type FocusedField =
    | 'login-email'
    | 'login-senha'
    | 'reg-nome'
    | 'reg-telefone'
    | 'reg-email'
    | 'reg-senha'
    | 'reg-confirmar'
    | null;

// Equivalente ao ngx-mask="(00) 0000-0000||(00) 0 0000 0000"
function formatPhoneMask(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

export function LoginBox() {
    const router = useRouter();

    // Estados idênticos ao login.component.ts
    const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [focusedField, setFocusedField] = useState<FocusedField>(null);
    const [switchWidth, setSwitchWidth] = useState<number>(0);

    const [formData, setFormData] = useState({
        nome: '',
        telefone: '',
        email: '',
        senha: '',
        confirmar_senha: '',
    });

    // Animação da pílula deslizante (.login-slider-bg) e transição da página (.login-tp-page)
    const slideAnim = useRef(new Animated.Value(0)).current;
    const pageFadeAnim = useRef(new Animated.Value(1)).current;
    const pageTranslateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Efeito elástico cubic-bezier(0.68, -0.55, 0.265, 1.55)
        Animated.spring(slideAnim, {
            toValue: isLoginMode ? 0 : 1,
            useNativeDriver: true,
            friction: 6,
            tension: 80,
        }).start();

        // Animação de entrada do formulário (translateY(20px) -> 0, opacity 0 -> 1)
        pageFadeAnim.setValue(0);
        pageTranslateY.setValue(20);
        Animated.parallel([
            Animated.timing(pageFadeAnim, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
            }),
            Animated.spring(pageTranslateY, {
                toValue: 0,
                useNativeDriver: true,
                damping: 18,
                stiffness: 160,
            }),
        ]).start();
    }, [isLoginMode, slideAnim, pageFadeAnim, pageTranslateY]);

    function selectMode(loginMode: boolean) {
        if (loginMode === isLoginMode) return;
        setIsLoginMode(loginMode);
        setErrorMessage('');
        setFormData((prev) => ({
            ...prev,
            senha: '',
            confirmar_senha: '',
        }));
    }

    function setField<K extends keyof typeof formData>(field: K, value: string) {
        setFormData((prev) => ({
            ...prev,
            [field]: field === 'telefone' ? formatPhoneMask(value) : value,
        }));
    }

    function handleSwitchLayout(event: LayoutChangeEvent) {
        setSwitchWidth(event.nativeEvent.layout.width);
    }

    // Validação equivalente ao #loginForm="ngForm" e #registerForm="ngForm"
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
    const isLoginFormValid = isEmailValid && formData.senha.trim().length > 0;
    const isRegisterFormValid =
        formData.nome.trim().length > 0 &&
        formData.telefone.replace(/\D/g, '').length >= 10 &&
        isEmailValid &&
        formData.senha.length >= 6 &&
        formData.confirmar_senha.length > 0;

    const isSubmitDisabled = isLoading || (isLoginMode ? !isLoginFormValid : !isRegisterFormValid);

    function onSubmit() {
        setErrorMessage('');

        if (!isLoginMode && formData.senha !== formData.confirmar_senha) {
            setErrorMessage('As senhas não coincidem.');
            return;
        }

        setIsLoading(true);

        // Simulação da chamada ao AuthService + sincronização do CartService
        setTimeout(() => {
            setIsLoading(false);
            router.navigate('/');
        }, 900);
    }

    const sliderTranslateX = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Math.max(0, (switchWidth - 10) / 2)],
    });

    return (
        <View style={styles.loginBox}>
            {/* Logo SVG SukiDoces */}
            <View style={styles.logoWrapper}>
                <SukiLoginLogo width={120} />
            </View>

            {/* Switch Entrar / Cadastrar (.login-switch-container) */}
            <View style={styles.loginSwitchContainer} onLayout={handleSwitchLayout}>
                <Animated.View
                    style={[
                        styles.loginSliderBg,
                        {
                            width: switchWidth > 0 ? (switchWidth - 10) / 2 : '50%',
                            transform: [{ translateX: sliderTranslateX }],
                        },
                    ]}
                />
                <Pressable
                    accessibilityRole="tab"
                    accessibilityState={{ selected: isLoginMode }}
                    style={styles.lgnTabLabel}
                    onPress={() => selectMode(true)}
                >
                    <Text style={[styles.lgnTabText, isLoginMode && styles.lgnTabTextActive]}>
                        Entrar
                    </Text>
                </Pressable>

                <Pressable
                    accessibilityRole="tab"
                    accessibilityState={{ selected: !isLoginMode }}
                    style={styles.lgnTabLabel}
                    onPress={() => selectMode(false)}
                >
                    <Text style={[styles.lgnTabText, !isLoginMode && styles.lgnTabTextActive]}>
                        Cadastrar
                    </Text>
                </Pressable>
            </View>

            {/* Área de Conteúdo (.login-type) */}
            <View style={styles.loginType}>
                <Animated.View
                    style={{
                        opacity: pageFadeAnim,
                        transform: [{ translateY: pageTranslateY }],
                    }}
                >
                    {isLoginMode ? (
                        /* --- TELA ENTRAR (.lgn-sign-in-screen) --- */
                        <View>
                            <Text style={styles.fieldLabel}>E-mail</Text>
                            <TextInput
                                value={formData.email}
                                onChangeText={(v) => setField('email', v)}
                                placeholder="Ex. joao@email.com"
                                placeholderTextColor="#9b8a90"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                onFocus={() => setFocusedField('login-email')}
                                onBlur={() => setFocusedField(null)}
                                style={[
                                    styles.loginInput,
                                    focusedField === 'login-email' && styles.loginInputFocused,
                                ]}
                            />

                            <Text style={styles.fieldLabel}>Senha</Text>
                            <TextInput
                                value={formData.senha}
                                onChangeText={(v) => setField('senha', v)}
                                placeholder="Sua senha"
                                placeholderTextColor="#9b8a90"
                                secureTextEntry
                                onFocus={() => setFocusedField('login-senha')}
                                onBlur={() => setFocusedField(null)}
                                style={[
                                    styles.loginInput,
                                    focusedField === 'login-senha' && styles.loginInputFocused,
                                ]}
                            />

                            <Pressable
                                accessibilityRole="button"
                                disabled={isSubmitDisabled}
                                style={({ pressed }) => [
                                    styles.loginBtnWrapper,
                                    pressed && !isSubmitDisabled && styles.btnPressed,
                                ]}
                                onPress={onSubmit}
                            >
                                {isSubmitDisabled ? (
                                    <View style={[styles.loginBtn, styles.loginBtnDisabled]}>
                                        <Text style={styles.loginBtnDisabledText}>
                                            {isLoading ? 'Aguarde...' : 'Entrar'}
                                        </Text>
                                    </View>
                                ) : (
                                    <LinearGradient
                                        colors={gradients.brandPink}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.loginBtn}
                                    >
                                        <Text style={styles.loginBtnText}>
                                            {isLoading ? 'Aguarde...' : 'Entrar'}
                                        </Text>
                                    </LinearGradient>
                                )}
                            </Pressable>
                        </View>
                    ) : (
                        /* --- TELA CADASTRAR (.lgn-sign-up-screen) --- */
                        <View>
                            <View style={styles.formRow}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.fieldLabel}>Nome Completo</Text>
                                    <TextInput
                                        value={formData.nome}
                                        onChangeText={(v) => setField('nome', v)}
                                        placeholder="Ex. João"
                                        placeholderTextColor="#9b8a90"
                                        autoCapitalize="words"
                                        onFocus={() => setFocusedField('reg-nome')}
                                        onBlur={() => setFocusedField(null)}
                                        style={[
                                            styles.loginInput,
                                            focusedField === 'reg-nome' && styles.loginInputFocused,
                                        ]}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.fieldLabel}>Telefone</Text>
                                    <TextInput
                                        value={formData.telefone}
                                        onChangeText={(v) => setField('telefone', v)}
                                        placeholder="(11) 99999-9999"
                                        placeholderTextColor="#9b8a90"
                                        keyboardType="phone-pad"
                                        maxLength={16}
                                        onFocus={() => setFocusedField('reg-telefone')}
                                        onBlur={() => setFocusedField(null)}
                                        style={[
                                            styles.loginInput,
                                            focusedField === 'reg-telefone' && styles.loginInputFocused,
                                        ]}
                                    />
                                </View>
                            </View>

                            <Text style={styles.fieldLabel}>E-mail</Text>
                            <TextInput
                                value={formData.email}
                                onChangeText={(v) => setField('email', v)}
                                placeholder="Ex. joao@email.com"
                                placeholderTextColor="#9b8a90"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                onFocus={() => setFocusedField('reg-email')}
                                onBlur={() => setFocusedField(null)}
                                style={[
                                    styles.loginInput,
                                    focusedField === 'reg-email' && styles.loginInputFocused,
                                ]}
                            />

                            <Text style={styles.fieldLabel}>Senha</Text>
                            <TextInput
                                value={formData.senha}
                                onChangeText={(v) => setField('senha', v)}
                                placeholder="Crie uma senha"
                                placeholderTextColor="#9b8a90"
                                secureTextEntry
                                onFocus={() => setFocusedField('reg-senha')}
                                onBlur={() => setFocusedField(null)}
                                style={[
                                    styles.loginInput,
                                    focusedField === 'reg-senha' && styles.loginInputFocused,
                                ]}
                            />

                            <Text style={styles.fieldLabel}>Confirmar Senha</Text>
                            <TextInput
                                value={formData.confirmar_senha}
                                onChangeText={(v) => setField('confirmar_senha', v)}
                                placeholder="Confirme sua senha"
                                placeholderTextColor="#9b8a90"
                                secureTextEntry
                                onFocus={() => setFocusedField('reg-confirmar')}
                                onBlur={() => setFocusedField(null)}
                                style={[
                                    styles.loginInput,
                                    focusedField === 'reg-confirmar' && styles.loginInputFocused,
                                ]}
                            />

                            <Pressable
                                accessibilityRole="button"
                                disabled={isSubmitDisabled}
                                style={({ pressed }) => [
                                    styles.loginBtnWrapper,
                                    pressed && !isSubmitDisabled && styles.btnPressed,
                                ]}
                                onPress={onSubmit}
                            >
                                {isSubmitDisabled ? (
                                    <View style={[styles.loginBtn, styles.loginBtnDisabled]}>
                                        <Text style={styles.loginBtnDisabledText}>
                                            {isLoading ? 'Aguarde...' : 'Cadastrar'}
                                        </Text>
                                    </View>
                                ) : (
                                    <LinearGradient
                                        colors={gradients.brandPink}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.loginBtn}
                                    >
                                        <Text style={styles.loginBtnText}>
                                            {isLoading ? 'Aguarde...' : 'Cadastrar'}
                                        </Text>
                                    </LinearGradient>
                                )}
                            </Pressable>
                        </View>
                    )}

                    {/* Caixa de Erro (.error) */}
                    {errorMessage ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        </View>
                    ) : null}
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    /* --- .login-box --- */
    loginBox: {
        backgroundColor: colors.white,
        padding: 28,
        borderWidth: 1,
        borderColor: colors.pinkLight, // var(--color-4)
        borderRadius: 20, // 1.25rem no mobile (@media max-width: 850px)
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
        width: '100%',
        gap: 10,
    },
    logoWrapper: {
        alignSelf: 'center',
        marginBottom: 4,
    },

    /* --- .login-switch-container --- */
    loginSwitchContainer: {
        position: 'relative',
        flexDirection: 'row',
        backgroundColor: '#fde8f1', // var(--gls-color-5)
        borderRadius: 50,
        padding: 5,
        marginBottom: 16,
    },
    loginSliderBg: {
        position: 'absolute',
        top: 5,
        bottom: 5,
        left: 5,
        backgroundColor: colors.white,
        borderRadius: 40,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    lgnTabLabel: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },
    lgnTabText: {
        color: 'rgba(0, 0, 0, 0.4)', // var(--black-opacity-40)
        fontWeight: '600',
        fontSize: 15,
    },
    lgnTabTextActive: {
        color: colors.pink, // var(--color-1)
        fontWeight: '700',
    },

    /* --- .login-type & Inputs --- */
    loginType: {
        minHeight: 310,
    },
    formRow: {
        flexDirection: 'column', // Em mobile (@media max-width: 480px) empilha
    },
    inputGroup: {
        width: '100%',
    },
    fieldLabel: {
        textAlign: 'left',
        marginBottom: 5,
        marginLeft: 5,
        fontSize: 14.4, // 0.9rem
        color: '#222222', // var(--t-color-5)
        fontWeight: '600',
    },
    loginInput: {
        backgroundColor: '#fff0f7', // var(--color-5)
        width: '100%',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.pinkLight, // var(--gls-color-4)
        marginTop: 3,
        marginBottom: 15,
        fontSize: 16,
        color: colors.brown,
    },
    loginInputFocused: {
        borderColor: colors.pink, // var(--color-1)
        backgroundColor: colors.white,
    },

    /* --- .login-btn --- */
    loginBtnWrapper: {
        width: '100%',
        marginTop: 4,
        borderRadius: 14,
        overflow: 'hidden',
    },
    loginBtn: {
        width: '100%',
        minHeight: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    loginBtnText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    loginBtnDisabled: {
        backgroundColor: '#fde8f1', // var(--gls-color-5)
        borderWidth: 1,
        borderColor: 'rgba(130, 130, 130, 0.25)',
    },
    loginBtnDisabledText: {
        color: colors.muted, // var(--t-color-7)
        fontSize: 16,
        fontWeight: '600',
    },
    btnPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },

    /* --- .error --- */
    errorBox: {
        marginTop: 15,
        backgroundColor: '#ffd6d6cc', // var(--gls-danger)
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f5c6cb',
    },
    errorText: {
        color: '#dc3545', // var(--gls-danger-btn)
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 14,
    },
});