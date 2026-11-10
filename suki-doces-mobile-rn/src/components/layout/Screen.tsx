import { useRef } from 'react';
import { Animated, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandHeader } from '@/components/layout/BrandHeader';
import { colors } from '@/constants/colors';

export function Screen({ children, contentContainerStyle, ...props }: ScrollViewProps) {
  // Cria uma variável animada para monitorar a posição de rolagem
  const scrollY = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* O Header recebe o valor da rolagem */}
      <BrandHeader scrollY={scrollY} />

      <Animated.ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16} // Garante animação suave a 60fps
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // false porque animaremos altura e tamanho de texto
        )}
        contentContainerStyle={[
          { paddingTop: insets.top + 120 }, // Espaço dinâmico para não esconder conteúdo atrás do header
          contentContainerStyle
        ]}
        {...props}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
  },
});