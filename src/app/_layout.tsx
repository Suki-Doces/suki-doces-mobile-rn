// src/app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AiChatFab } from '../components/chat/AiChatModal';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerBackTitle: 'Voltar',
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#FAF7F9' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ title: '', headerTransparent: true }} />
        <Stack.Screen name="checkout" options={{ title: 'Finalizar Pedido' }} />
        <Stack.Screen name="orders" options={{ title: 'Meus Pedidos' }} />
        <Stack.Screen name="contact" options={{ title: 'Fale Conosco' }} />
        <Stack.Screen name="history" options={{ title: 'Nossa História' }} />
        <Stack.Screen name="verify-email" options={{ title: 'Verificar E-mail' }} />
        <Stack.Screen name="login" options={{ presentation: 'modal', title: 'Entrar' }} />
      </Stack>

      <AiChatFab />
    </SafeAreaProvider>
  );
}