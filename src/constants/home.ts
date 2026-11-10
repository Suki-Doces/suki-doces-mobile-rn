import type {
  CarouselProduct,
  IceCreamStep,
  PartnerFeature,
  QuickProduct,
} from '@/interfaces/home';

export const carouselProducts: CarouselProduct[] = [
  {
    id: '1',
    rankLabel: 'Os Mais Vendidos',
    name: 'Bolo de Pote - Ninho com Nutella',
    price: 'R$15,50',
  },
  {
    id: '2',
    rankLabel: '2º Mais Vendido',
    name: 'Milkshake Morango Especial',
    price: 'R$18,00',
  },
  {
    id: '3',
    rankLabel: '3º Mais Vendido',
    name: 'Mini Coxa c/ 20',
    price: 'R$18,00',
  },
  {
    id: '4',
    rankLabel: '4º Mais Vendido',
    name: 'Trio Brownie Cookies and Cream',
    price: 'R$6,25',
  },
  {
    id: '5',
    rankLabel: '5º Mais Vendido',
    name: 'Trufa Artesanal de Morango',
    price: 'R$4,50',
  },
];

export const partnerFeatures: PartnerFeature[] = [
  {
    icon: 'truck',
    title: 'Logística e Entregas',
    description:
      'Receba seus pedidos com rapidez e segurança diretamente no seu comércio.',
  },
  {
    icon: 'headset',
    title: 'Atendimento Exclusivo',
    description:
      'Nossa equipe está pronta para tirar dúvidas e montar o melhor pedido com você.',
  },
  {
    icon: 'store',
    title: 'Visite Nossa Loja',
    description:
      'Venha nos conhecer! Estamos localizados em Diadema - SP, de portas abertas para recebê-lo.',
  },
];

export const quickProducts: QuickProduct[] = [
  {
    id: 'q1',
    name: 'Bolo de Pote - Ninho com Nutella',
    price: 'R$15,50',
    tab: 'bestsellers',
  },
  {
    id: 'q2',
    name: 'Milkshake Morango',
    price: 'R$18,00',
    tab: 'bestsellers',
  },
  {
    id: 'q3',
    name: 'Mini Coxa c/ 20',
    price: 'R$18,00',
    tab: 'bestsellers',
  },
  {
    id: 'q4',
    name: 'Trio Brownie Cookies and Cream',
    price: 'R$6,25',
    tab: 'bestsellers',
  },
  {
    id: 'q5',
    name: 'Copo da Felicidade Ferrero',
    price: 'R$19,90',
    tab: 'releases',
  },
  {
    id: 'q6',
    name: 'Picolé Artesanal Pistache',
    price: 'R$12,00',
    tab: 'releases',
  },
  {
    id: 'q7',
    name: 'Box Doces Finos (12 un.)',
    price: 'R$24,90',
    tab: 'releases',
  },
  {
    id: 'q8',
    name: 'Cookie Red Velvet Recheado',
    price: 'R$9,50',
    tab: 'releases',
  },
];

export const iceCreamSteps: IceCreamStep[] = [
  {
    id: 'step-1',
    title: 'Escolha seu sabor',
    description: 'Em nosso menu, você vai achar algo do seu agrado.',
  },
  {
    id: 'step-2',
    title: 'Monte do seu jeito',
    description:
      'Adicione coberturas, caldas e complementos como quiser. Seu sorvete, do seu jeito.',
  },
  {
    id: 'step-3',
    title: 'Compartilhe o sabor',
    description:
      'Tire fotos, marque a gente e espalhe essa delícia nas redes sociais! #SukiDoces',
  },
];