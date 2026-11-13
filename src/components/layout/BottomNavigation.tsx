import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, type Href } from 'expo-router';
import {
  Alert,
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { GlassView } from 'expo-glass-effect';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/constants/colors';

interface UserProfile {
  id?: number;
  nome: string;
  foto_perfil?: string | null;
  role?: 'admin' | 'user';
}

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>('Perfil');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openMenu, setOpenMenu] = useState<'search' | 'profile' | null>(null);

  const [viewProductsBtn, setViewProductsBtn] = useState<boolean>(true);
  const [viewHomeBtn, setViewHomeBtn] = useState<boolean>(false);
  const [cartTotal] = useState<number>(0);

  const [mensagemUsuario, setMensagemUsuario] = useState<string>('');
  const [historico, setHistorico] = useState<ChatMessage[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const chatScrollRef = useRef<ScrollView>(null);

  const dropdownAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkRoute(pathname);
  }, [pathname]);

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      const parts = user.nome.trim().split(' ');
      setDisplayName(
        parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : parts[0]
      );
    } else {
      setIsLoggedIn(false);
      setDisplayName('Perfil');
    }
  }, [user]);

  useEffect(() => {
    Animated.spring(dropdownAnim, {
      toValue: openMenu ? 1 : 0,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
    }).start();
  }, [openMenu, dropdownAnim]);

  function checkRoute(url: string): void {
    const isHome = url === '/' || url === '/home';
    const isProductDetail = url.includes('/produtos/');
    const isProductList = url.includes('/produtos');
    const isCart = url.includes('/carrinho');
    const isCheckout = url.includes('/checkout');
    const isProfile = url.includes('/perfil');
    const isLogin = url.includes('/login');
    const isContact = url.includes('/contatos') || url.includes('/contact');
    const isHistory = url.includes('/historia') || url.includes('/history');

    if (isHome || isProductDetail || isCart || isCheckout) {
      setViewProductsBtn(true);
      setViewHomeBtn(false);
    } else if (isProductList || isProfile || isLogin || isContact || isHistory) {
      setViewProductsBtn(false);
      setViewHomeBtn(true);
    } else {
      setViewProductsBtn(true);
      setViewHomeBtn(false);
    }
  }

  function toggleMenu(menu: 'search' | 'profile'): void {
    if (openMenu === menu) {
      setOpenMenu(null);
    } else {
      setOpenMenu(menu);
      setIsChatOpen(false);
    }
  }

  function closeMenu(): void {
    setOpenMenu(null);
    setIsChatOpen(false);
  }

  function onSearch(): void {
    if (searchQuery.trim()) {
      Alert.alert('Pesquisa', `Buscando por: "${searchQuery.trim()}"`);
      setOpenMenu(null);
    }
  }

  function toggleChat(): void {
    setIsChatOpen((prev) => !prev);
  }

  function enviarMensagem(): void {
    if (!mensagemUsuario.trim() || carregando) return;
    const textoEnviado = mensagemUsuario.trim();
    setMensagemUsuario('');
    setHistorico((prev) => [...prev, { role: 'user', text: textoEnviado }]);
    setCarregando(true);

    setTimeout(() => {
      setHistorico((prev) => [
        ...prev,
        {
          role: 'bot',
          text: `Encontrei opções deliciosas na SukiDoces para "${textoEnviado}"! Posso te mostrar nosso catálogo ou ajudar com o pedido.`,
        },
      ]);
      setCarregando(false);
      setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 50);
    }, 600);
  }

  function logout(): void {
    setUser(null);
    setIsLoggedIn(false);
    setOpenMenu(null);
    router.navigate('/login');
  }

  function isAdmin(): boolean {
    return user?.role === 'admin';
  }

  function navigateAndClose(href: Href): void {
    closeMenu();
    router.navigate(href);
  }

  function formatBRL(value: number): string {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }

  const dropdownTranslateY = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <View style={styles.rootContainer} pointerEvents="box-none">
      {openMenu !== null ? (
        <Pressable
          accessibilityLabel="Fechar menu"
          style={styles.backdrop}
          onPress={closeMenu}
        />
      ) : null}

      <View style={styles.navWrapper} pointerEvents="box-none">
        {openMenu === 'search' ? (
          <Animated.View
            style={[
              styles.hnvSearchPanel,
              isChatOpen ? styles.hnvSearchPanelChatActive : null,
              {
                opacity: dropdownAnim,
                transform: [{ translateY: dropdownTranslateY }],
              },
            ]}
          >
            <View style={styles.hnvPanelContent}>
              {!isChatOpen ? (
                <GlassView style={styles.hnvSearchContainer}>
                  <View style={styles.hnvSearchForm}>
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="O que você procura?"
                      placeholderTextColor="#5a4b4b"
                      style={styles.hnvSearchInput}
                      returnKeyType="search"
                      onSubmitEditing={onSearch}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Pesquisar"
                      style={({ pressed }) => [
                        styles.btnPrimary,
                        styles.hnvSearchSubmitBtn,
                        pressed ? styles.btnPressed : null,
                      ]}
                      onPress={onSearch}
                    >
                      <Icon name="search" size={20} color={colors.white} />
                    </Pressable>
                  </View>
                </GlassView>
              ) : (
                <GlassView style={styles.chatContainer}>
                  <View style={styles.chatHeader}>
                    <View style={styles.chatHeaderLeft}>
                      <View style={styles.botAvatar}>
                        <Icon name="sukiBot" size={32} color="#201613" />
                      </View>
                      <Text style={styles.chatHeaderTitle}>SukiBot</Text>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Fechar SukiBot"
                      style={styles.btnCloseChat}
                      onPress={() => setIsChatOpen(false)}
                    >
                      <Icon name="close" size={24} color={colors.white} />
                    </Pressable>
                  </View>

                  <ScrollView
                    ref={chatScrollRef}
                    style={styles.chatBody}
                    contentContainerStyle={styles.chatBodyContent}
                    showsVerticalScrollIndicator={false}
                  >
                    {historico.length === 0 ? (
                      <View style={[styles.msgBot, styles.msgWrapperBot]}>
                        <Text style={styles.msgBotText}>
                          Olá! Sou a assistente inteligente da SukiDoces. Como posso te ajudar hoje?
                        </Text>
                      </View>
                    ) : null}

                    {historico.map((msg, index) => (
                      <View
                        key={String(index)}
                        style={
                          msg.role === 'user' ? styles.msgWrapperUser : styles.msgWrapperBot
                        }
                      >
                        <View style={msg.role === 'user' ? styles.msgUser : styles.msgBot}>
                          <Text
                            style={
                              msg.role === 'user' ? styles.msgUserText : styles.msgBotText
                            }
                          >
                            {msg.text}
                          </Text>
                        </View>
                      </View>
                    ))}

                    {carregando ? (
                      <View style={styles.msgWrapperBot}>
                        <View style={styles.msgBot}>
                          <Text style={styles.msgBotText}>Só um minuto...</Text>
                        </View>
                      </View>
                    ) : null}
                  </ScrollView>

                  <View style={styles.chatFooter}>
                    <TextInput
                      value={mensagemUsuario}
                      onChangeText={setMensagemUsuario}
                      placeholder="Peça ao SukiBot..."
                      placeholderTextColor="#7a646c"
                      editable={!carregando}
                      style={styles.chatFooterInput}
                      returnKeyType="send"
                      onSubmitEditing={enviarMensagem}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Enviar mensagem"
                      disabled={carregando}
                      style={({ pressed }) => [
                        styles.btnPrimary,
                        styles.btnSend,
                        pressed ? styles.btnPressed : null,
                      ]}
                      onPress={enviarMensagem}
                    >
                      <Icon name="send" size={20} color={colors.white} />
                    </Pressable>
                  </View>
                </GlassView>
              )}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Alternar SukiBot IA"
              style={({ pressed }) => [
                styles.btnPrimary,
                styles.hnvAiChatBtn,
                pressed ? styles.btnPressed : null,
              ]}
              onPress={toggleChat}
            >
              <Icon name="aiSparkle" size={24} color={colors.white} />
            </Pressable>
          </Animated.View>
        ) : null}

        {openMenu === 'profile' ? (
          <Animated.View
            style={[
              styles.hnvProfileDropdownWrapper,
              {
                opacity: dropdownAnim,
                transform: [{ translateY: dropdownTranslateY }],
              },
            ]}
          >
            <GlassView style={styles.hnvProfilePanel}>
              {isLoggedIn ? (
                <View>
                  <Pressable
                    style={({ pressed }) => [
                      styles.hnvPpLinks,
                      pressed ? styles.hnvPpLinksHover : null,
                    ]}
                    onPress={() => {
                      closeMenu();
                      Alert.alert('Meus Dados', 'Abrindo aba Dados do Perfil...');
                    }}
                  >
                    <Text style={styles.hnvPpLinksText}>Meus Dados</Text>
                  </Pressable>

                  <View style={styles.hr} />

                  {isAdmin() ? (
                    <View>
                      <Pressable
                        style={({ pressed }) => [
                          styles.hnvPpLinks,
                          pressed ? styles.hnvPpLinksHover : null,
                        ]}
                        onPress={() => {
                          closeMenu();
                          Alert.alert('Painel Admin', 'Abrindo Dashboard Admin...');
                        }}
                      >
                        <Text style={styles.hnvPpLinksText}>Painel Admin</Text>
                      </Pressable>
                      <View style={styles.hr} />
                    </View>
                  ) : null}

                  <Pressable
                    style={({ pressed }) => [
                      styles.hnvPpLinks,
                      pressed ? styles.hnvPpLinksHover : null,
                    ]}
                    onPress={() => {
                      closeMenu();
                      Alert.alert('Pedidos', 'Abrindo aba Meus Pedidos...');
                    }}
                  >
                    <Text style={styles.hnvPpLinksText}>Pedidos</Text>
                  </Pressable>

                  <View style={styles.hr} />

                  <Pressable
                    style={({ pressed }) => [
                      styles.hnvPpLinks,
                      pressed ? styles.hnvPpLinksHover : null,
                    ]}
                    onPress={logout}
                  >
                    <Text style={[styles.hnvPpLinksText, styles.logoutText]}>Sair</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  style={({ pressed }) => [
                    styles.hnvPpLinks,
                    pressed ? styles.hnvPpLinksHover : null,
                  ]}
                  onPress={() => navigateAndClose('/login')}
                >
                  <Text style={styles.hnvPpLinksText}>Entrar / Cadastrar</Text>
                </Pressable>
              )}
            </GlassView>
          </Animated.View>
        ) : null}

        <GlassView style={styles.hoverNav}>
          <View style={styles.hnvButtonWrapper}>
            {viewProductsBtn ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Produtos"
                style={({ pressed }) => [
                  styles.hnvButton,
                  pressed ? styles.hnvButtonActive : null,
                ]}
                onPress={() => navigateAndClose('/history')}
              >
                <Icon name="products" size={26} color="#000000" />
                <Text style={styles.hnvButtonText}>Produtos</Text>
              </Pressable>
            ) : null}

            {viewHomeBtn ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Página inicial"
                style={({ pressed }) => [
                  styles.hnvButton,
                  pressed ? styles.hnvButtonActive : null,
                ]}
                onPress={() => navigateAndClose('/')}
              >
                <Icon name="home" size={26} color="#000000" />
                <Text style={styles.hnvButtonText}>Home</Text>
              </Pressable>
            ) : null}
          </View>

          <View style={styles.hnvButtonWrapper}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Abrir pesquisa"
              style={({ pressed }) => [
                styles.hnvButton,
                openMenu === 'search' || pressed ? styles.hnvButtonActive : null,
              ]}
              onPress={() => toggleMenu('search')}
            >
              <View style={openMenu === 'search' ? styles.iconScaled : undefined}>
                <Icon name="search" size={26} color="#000000" />
              </View>
              <Text style={styles.hnvButtonText}>Procurar</Text>
            </Pressable>
          </View>

          <View style={styles.hnvButtonWrapper}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Carrinho de Compras"
              style={({ pressed }) => [
                styles.hnvButton,
                pressed ? styles.hnvButtonActive : null,
              ]}
              onPress={() => {
                closeMenu();
                Alert.alert('Carrinho', 'Abrindo seu carrinho de compras...');
              }}
            >
              <Icon name="cart" size={26} color="#000000" />
              <Text style={styles.hnvButtonText}>
                {cartTotal === 0 || !cartTotal ? 'Carrinho' : formatBRL(cartTotal)}
              </Text>
            </Pressable>
          </View>

          <View style={styles.hnvButtonWrapper}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Abrir menu do perfil"
              style={({ pressed }) => [
                styles.hnvButton,
                openMenu === 'profile' || pressed ? styles.hnvButtonActive : null,
              ]}
              onPress={() => toggleMenu('profile')}
            >
              <View style={openMenu === 'profile' ? styles.iconScaled : undefined}>
                {user?.foto_perfil ? (
                  <Image source={{ uri: user.foto_perfil }} style={styles.profileAvatarImg} />
                ) : (
                  <Icon name="profile" size={26} color="#000000" />
                )}
              </View>
              <Text style={styles.hnvButtonText} numberOfLines={1}>
                {displayName}
              </Text>
            </Pressable>
          </View>
        </GlassView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 998,
  },
  navWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 18,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  hoverNav: {
    height: 74,
    width: '90%',
    maxWidth: 350,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 30,
    backgroundColor: 'rgba(247, 181, 204, 0.7)',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    overflow: 'hidden',
  },
  hnvButtonWrapper: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hnvButton: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: 25,
    backgroundColor: 'transparent',
  },
  hnvButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
  },
  iconScaled: {
    transform: [{ scale: 1.1 }],
  },
  profileAvatarImg: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
  },
  hnvButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#222222',
  },
  hnvSearchPanel: {
    position: 'absolute',
    bottom: 89,
    width: '90%',
    maxWidth: 350,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    zIndex: 999,
  },
  hnvSearchPanelChatActive: {
    backgroundColor: 'transparent',
  },
  hnvPanelContent: {
    flex: 1,
    justifyContent: 'center',
  },
  hnvSearchContainer: {
    width: '100%',
    backgroundColor: '#f7b5ccb3',
    padding: 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
  },
  hnvSearchForm: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 18,
    width: '100%',
    height: 44,
  },
  hnvSearchInput: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 5,
    height: '100%',
    color: '#4a2a2a',
    fontSize: 14.4,
  },
  btnPrimary: {
    backgroundColor: colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  hnvSearchSubmitBtn: {
    borderRadius: 17,
    margin: 2,
    width: 40,
    height: 40,
  },
  hnvAiChatBtn: {
    width: 50,
    height: 50,
    borderRadius: 18,
    flexShrink: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 194, 227, 0.6)',
    shadowColor: colors.pink,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  chatContainer: {
    width: '100%',
    height: 420,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 194, 227, 0.5)',
  },
  chatHeader: {
    padding: 8,
    backgroundColor: 'rgba(233, 34, 144, 0.85)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatar: {
    backgroundColor: colors.white,
    borderRadius: 16.5,
    width: 40,
    height: 40,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  btnCloseChat: {
    width: 36,
    height: 36,
    borderRadius: 16.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  chatBody: {
    flex: 1,
    paddingHorizontal: 12,
  },
  chatBodyContent: {
    paddingVertical: 15,
    gap: 10,
  },
  msgWrapperUser: {
    alignSelf: 'flex-end',
    maxWidth: '82%',
  },
  msgWrapperBot: {
    alignSelf: 'flex-start',
    maxWidth: '82%',
  },
  msgUser: {
    backgroundColor: colors.pink,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 5,
  },
  msgUserText: {
    color: colors.white,
    fontSize: 13.5,
    lineHeight: 18,
  },
  msgBot: {
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 5,
  },
  msgBotText: {
    color: colors.brown,
    fontSize: 13.5,
    lineHeight: 18,
  },
  chatFooter: {
    height: 49,
    padding: 2,
    backgroundColor: '#f7b5ccb3',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  chatFooterInput: {
    flex: 1,
    height: 44,
    backgroundColor: colors.white,
    paddingLeft: 15,
    paddingRight: 5,
    borderRadius: 18,
    fontSize: 14,
    color: colors.brown,
  },
  btnSend: {
    height: 40,
    width: 40,
    margin: 2,
    borderRadius: 17,
  },
  hnvProfileDropdownWrapper: {
    position: 'absolute',
    bottom: 85,
    right: '5%',
    minWidth: 180,
    zIndex: 999,
  },
  hnvProfilePanel: {
    backgroundColor: 'rgba(247, 181, 204, 0.78)',
    padding: 4,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    overflow: 'hidden',
  },
  hnvPpLinks: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hnvPpLinksHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  hnvPpLinksText: {
    color: colors.brown,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  logoutText: {
    color: '#e9228f',
  },
  hr: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    width: '100%',
    marginVertical: 1,
  },
});