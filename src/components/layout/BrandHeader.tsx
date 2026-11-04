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

  // NOVA ANIMAÇÃO: Desliza o header para cima e para fora da tela
  const translateY = scrollY.interpolate({
    inputRange: [50, 180], // Começa a subir após 50px de scroll
    outputRange: [0, -150], // Move 150px para cima (o suficiente para escondê-lo)
    extrapolate: 'clamp',
  });

  // NOVA ANIMAÇÃO: Reduz a opacidade (fade-out) para uma transição mais suave
  const headerOpacity = scrollY.interpolate({
    inputRange: [80, 180], // Fica transparente entre 80px e 180px de scroll
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[
      styles.header, 
      { 
        top: insets.top + 10,
        height: headerHeight,
        width: headerWidth,
        opacity: headerOpacity, // <-- Aplica o fade-out
        transform: [{ translateY }] // <-- Aplica a movimentação para cima
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