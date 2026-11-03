import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { colors } from '@/constants/colors';

export default function RootLayout() {
  return (
    <View style={styles.app}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.app}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Tabs
          tabBar={() => <BottomNavigation />}
          screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.white } }}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="contact" />
        </Tabs>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
