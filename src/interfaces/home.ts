export type QuickTab = 'bestsellers' | 'releases';

export type PartnerIconName = 'truck' | 'headset' | 'store';

export interface CarouselProduct {
  id: string;
  rankLabel: string;
  name: string;
  price: string;
}

export interface PartnerFeature {
  icon: PartnerIconName;
  title: string;
  description: string;
}

export interface QuickProduct {
  id: string;
  name: string;
  price: string;
  tab: QuickTab;
}

export interface IceCreamStep {
  id: string;
  title: string;
  description: string;
}