export type QuickTab = 'bestsellers' | 'releases';

export interface ProductItem {
  id: string;
  productId?: number;
  name: string;
  description: string;
  price: string;
  priceValue?: number;
  stock?: number;
  image: string;
  category: string;
}

export interface CarouselProduct {
  id: string;
  productId?: number;
  rankLabel: string;
  name: string;
  price: string;
  image?: string;
}

export interface QuickProduct {
  id: string;
  productId?: number;
  name: string;
  price: string;
  image?: string;
  tab: QuickTab;
}

export interface IceCreamStep {
  id: string;
  title: string;
  description: string;
}