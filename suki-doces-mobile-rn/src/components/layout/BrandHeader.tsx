import { Animated, Dimensions, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { store } from '@/constants/store';

// 1. Captura a largura total do dispositivo
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BrandHeaderProps {
  scrollY: Animated.Value;
}

export function BrandHeader({ scrollY }: BrandHeaderProps) {
  const insets = useSafeAreaInsets();

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [90, 55],
    extrapolate: 'clamp',
  });

  // ANIMAÇÃO NOVA: Reduz a largura (de tela cheia com margens para 120px)
  const headerWidth = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [SCREEN_WIDTH - 20, 85], 
    extrapolate: 'clamp',
  });

  const titleSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [38, 22],
    extrapolate: 'clamp',
  });

  const taglineOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const taglineHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [14, 0],
    extrapolate: 'clamp',
  });

  const taglineMargin = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [-5, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[
      styles.header, 
      { 
        top: insets.top + 10,
        height: headerHeight,
        width: headerWidth // <-- 2. Aplica a largura animada
      }
    ]}>
      <View accessible accessibilityLabel={store.name} style={styles.lockup}>
        <Animated.Text style={[styles.name, { fontSize: titleSize }]}>Suki</Animated.Text>
        
        <Animated.View style={{ 
          height: taglineHeight, 
          marginTop: taglineMargin, 
          opacity: taglineOpacity, 
          overflow: 'hidden' 
        }}>
          <Text style={styles.tagline}>doces</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    left: 10,
    // right: 10, <-- 3. REMOVIDO! Isso impedia a largura de encolher
    paddingHorizontal: 20,
    borderRadius: 29,
    backgroundColor: colors.pink,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    zIndex: 10,
  },
  lockup: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: '#fff5fa',
    fontWeight: '900',
    letterSpacing: -2,
  },
  tagline: {
    color: '#fff5fa',
    fontSize: 13,
    lineHeight: 14,
    fontWeight: '800',
    fontStyle: 'italic',
  },
});