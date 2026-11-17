import { apiFetch } from './api';
import { ProductItem } from '../interfaces/home';

export interface ApiProduct {
  id: number;
  nome: string;
  descricao?: string;
  preco: number | string;
  imagem_url?: string;
  imagem?: string;
  categoria_id?: number;
  categoria?: {
    id: number;
    nome: string;
  };
}

export const productService = {
  async getProducts(categoriaId?: number): Promise<ProductItem[]> {
    const data = await apiFetch<ApiProduct[]>('/produtos', {
      method: 'GET',
      params: categoriaId ? { categoria: categoriaId } : undefined,
    });

    const list = Array.isArray(data) ? data : [];

    return list.map((item, index) => {
      // Converte o preço numérico para o formato monetário brasileiro "R$ XX,XX"
      let formattedPrice = 'R$ 0,00';
      if (typeof item.preco === 'number') {
        formattedPrice = `R$ ${item.preco.toFixed(2).replace('.', ',')}`;
      } else if (typeof item.preco === 'string') {
        const num = parseFloat(item.preco.replace(',', '.'));
        formattedPrice = !isNaN(num)
          ? `R$ ${num.toFixed(2).replace('.', ',')}`
          : `R$ ${item.preco}`;
      }

      return {
        // Garante que o ID seja sempre único string, evitando duplicidade no FlatList
        id: String(item.id ?? `prod-${index}`),
        name: item.nome || 'Produto',
        description: item.descricao || '',
        price: formattedPrice,
        image: item.imagem_url || item.imagem || '',
        category: item.categoria?.nome || '',
      };
    });
  },

  async getCategories() {
    return apiFetch<Array<{ id: number; nome: string }>>('/categorias', {
      method: 'GET',
    });
  },
};