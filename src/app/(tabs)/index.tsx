import { AboutCallout } from '@/components/home/AboutCallout';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { IceCreamSection } from '@/components/home/IceCreamSection';
import { PromoBannersSection } from '@/components/home/PromoBannersSection';
import { ShortCatalog } from '@/components/home/ShortCatalog';
import { Screen } from '@/components/layout/Screen';

export default function HomeScreen() {
  return (
    <Screen>
      <HeroCarousel />
      <AboutCallout />
      <ShortCatalog />
      <PromoBannersSection />
      <IceCreamSection />
    </Screen>
  );
}