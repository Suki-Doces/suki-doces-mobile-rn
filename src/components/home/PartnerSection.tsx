import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '@/constants/colors';
import { partnerFeatures } from '@/constants/home';
import type { PartnerIconName } from '@/interfaces/home';

function PartnerIcon({ name }: { name: PartnerIconName }) {
  const strokeProps = {
    stroke: colors.pink,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };

  if (name === 'truck') {
    return (
      <Svg width={28} height={28} viewBox="0 0 24 24">
        <Rect {...strokeProps} x="1.5" y="4" width="13" height="12" rx="1" />
        <Path {...strokeProps} d="M14.5 8h4l3 3.5V16h-7V8Z" />
        <Circle {...strokeProps} cx="6" cy="18" r="2" />
        <Circle {...strokeProps} cx="18" cy="18" r="2" />
      </Svg>
    );
  }

  if (name === 'headset') {
    return (
      <Svg width={28} height={28} viewBox="0 0 24 24">
        <Path {...strokeProps} d="M4 13v-1a8 8 0 0 1 16 0v1" />
        <Rect {...strokeProps} x="2.5" y="12" width="3.5" height="6" rx="1.5" />
        <Rect {...strokeProps} x="18" y="12" width="3.5" height="6" rx="1.5" />
        <Path {...strokeProps} d="M19.5 18v1a2 2 0 0 1-2 2h-4.5" />
      </Svg>
    );
  }

  return (
    <Svg width={28} height={28} viewBox="0 0 24 24">
      <Path {...strokeProps} d="M3 9.5 4.8 4h14.4L21 9.5" />
      <Path {...strokeProps} d="M3 9.5a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <Path {...strokeProps} d="M5 12v8h14v-8" />
      <Rect {...strokeProps} x="9.5" y="14.5" width="5" height="5.5" />
    </Svg>
  );
}

export function PartnerSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Seja um Parceiro SukiDoces</Text>
      <Text style={styles.subtitle}>
        Ofereça as melhores sobremesas no seu estabelecimento com condições especiais para
        revenda.
      </Text>

      <View style={styles.featuresList}>
        {partnerFeatures.map((feature) => (
          <View key={feature.title} style={styles.featureItem}>
            <View style={styles.iconCircle}>
              <PartnerIcon name={feature.icon} />
            </View>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff0f7',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heading: {
    color: colors.brown,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 28,
  },
  featuresList: {
    width: '100%',
    gap: 28,
    alignItems: 'center',
  },
  featureItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  iconCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#f8bad4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  featureTitle: {
    color: colors.brown,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  featureDescription: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
});