import { AboutCallout } from '@/components/home/AboutCallout';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { IceCreamSection } from '@/components/home/IceCreamSection';
import { PartnerSection } from '@/components/home/PartnerSection';
import { PromoBannersSection } from '@/components/home/PromoBannersSection';
import { ShortCatalog } from '@/components/home/ShortCatalog';
import { Footer } from '@/components/layout/Footer';
import { Screen } from '@/components/layout/Screen';

export default function HomeScreen() {
  return (
    <Screen>
      <HeroCarousel />
      <PartnerSection />
      <AboutCallout />
      <ShortCatalog />
      <PromoBannersSection />
      <IceCreamSection />
      <Footer />
    </Screen>
  );
}