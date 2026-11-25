import { apiFetch } from './api';
import { ProductItem } from '../interfaces/home';

/** Produto no formato da API NestJS (mesmos nomes de coluna do banco). */
export interface ApiProduct {
  id_produto: number;
  nome: string;
  descricao?: string | null;
  preco: number | string;
  quantidade?: number;
  imagem?: string | null;
  id_categoria?: number | null;
  categorias?: { id_categoria: number; nome: string } | null;
}

export interface ApiCategory {
  id_categoria: number;
  nome: string;
  descricao?: string | null;
}

export function formatBRL(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export function toProductItem(item: ApiProduct): ProductItem {
  const priceValue = typeof item.preco === 'number' ? item.preco : parseFloat(String(item.preco));
  const safePrice = Number.isFinite(priceValue) ? priceValue : 0;
  return {
    id: String(item.id_produto),
    productId: item.id_produto,
    name: item.nome || 'Produto',
    description: item.descricao || '',
    price: formatBRL(safePrice),
    priceValue: safePrice,
    stock: item.quantidade ?? 0,
    image: item.imagem || '',
    category: item.categorias?.nome || '',
  };
}

export const productService = {
  async getProducts(filters: { categoria?: number; query?: string; filtro?: string } = {}): Promise<ProductItem[]> {
    const data = await apiFetch<ApiProduct[]>('/produtos', { method: 'GET', params: filters });
    return Array.isArray(data) ? data.map(toProductItem) : [];
  },

  async getBestSellers(): Promise<ProductItem[]> {
    const data = await apiFetch<ApiProduct[]>('/produtos/mais-vendidos');
    return Array.isArray(data) ? data.map(toProductItem) : [];
  },

  async getNewArrivals(): Promise<ProductItem[]> {
    const data = await apiFetch<ApiProduct[]>('/produtos/novos');
    return Array.isArray(data) ? data.map(toProductItem) : [];
  },

  async getCategories(): Promise<ApiCategory[]> {
    const data = await apiFetch<ApiCategory[]>('/produtos/categorias');
    return Array.isArray(data) ? data : [];
  },
};
