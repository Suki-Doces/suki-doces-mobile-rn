import Svg, { Circle, Path } from 'react-native-svg';

interface CandyPlaceholderIconProps {
  size?: number;
  color?: string;
}

export function CandyPlaceholderIcon({
  size = 56,
  color = '#6e7278',
}: CandyPlaceholderIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path
        d="M52 28c0 12.15-9.85 22-22 22S8 40.15 8 28 17.85 6 30 6c2.4 0 4.7.38 6.86 1.09a7.5 7.5 0 0 0 7.45 8.41 7.47 7.47 0 0 0 6.5 4.82c.78 2.42 1.19 5 1.19 7.68Z"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx="28" cy="28" r="6" stroke={color} strokeWidth={2.5} />
      <Circle cx="20" cy="20" r="1.8" fill={color} />
      <Circle cx="21" cy="36" r="1.8" fill={color} />
      <Circle cx="36" cy="38" r="1.8" fill={color} />
      <Circle cx="35" cy="18" r="1.8" fill={color} />
      <Circle cx="41" cy="29" r="1.8" fill={color} />
    </Svg>
  );
}