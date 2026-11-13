import { Animated, Dimensions, StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients } from '@/constants/colors';
import { store } from '@/constants/store';

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

  const translateY = scrollY.interpolate({
    inputRange: [50, 180],
    outputRange: [0, -150],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [80, 180],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.headerWrapper,
        {
          top: insets.top + 10,
          height: headerHeight,
          width: headerWidth,
          opacity: headerOpacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <LinearGradient
        colors={gradients.brandPink}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1.2 }}
        style={styles.gradient}
      >
        <View accessible accessibilityLabel={store.name} style={styles.lockup}>
          <Animated.Text style={[styles.name, { fontSize: titleSize }]}>
            Suki
          </Animated.Text>

          <Animated.View
            style={{
              height: taglineHeight,
              marginTop: taglineMargin,
              opacity: taglineOpacity,
              overflow: 'hidden',
            }}
          >
            <Text style={styles.tagline}>doces</Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    position: 'absolute',
    left: 10,
    borderRadius: 29,
    shadowColor: colors.pink,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    zIndex: 10,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
    borderRadius: 29,
    justifyContent: 'center',
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