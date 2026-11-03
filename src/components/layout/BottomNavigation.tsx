import { usePathname, useRouter } from 'expo-router';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { GlassView } from 'expo-glass-effect';

import { Icon } from '@/components/ui/Icon';
import { comingSoonMessage, navItems } from '@/constants/navigation';
import type { NavItem } from '@/interfaces/navigation';

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  function handlePress(item: NavItem) {
    if (item.href) router.navigate(item.href);
    else Alert.alert(item.label, comingSoonMessage);
  }

  /* Aplicacao do GlassView no BottomNavigation */
  return (
    <GlassView style={styles.bar}>
      {navItems.map((item) => {
        const active = item.href === pathname;
        return (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            style={styles.item}
            onPress={() => handlePress(item)}
          >
            <Icon name={item.icon} size={25} />
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </GlassView>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: 78, 
    marginHorizontal: 18,
    marginTop: 4,
    marginBottom: Platform.OS === 'ios' ? 12 : 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255,194,227,0.65)',
    borderRadius: 30,
    backgroundColor: 'rgba(247,181,204,0.7)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
    zIndex: 3,
  },
  item: {
    minWidth: 62,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    color: '#292126',
    fontSize: 12,
    lineHeight: 16,
  },
  labelActive: {
    fontWeight: '700',
  },
});
