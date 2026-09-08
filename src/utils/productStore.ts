import { useState, useEffect } from 'react';
import { LangCode } from './languageStore';
import { fetchFromBackend } from '@/services/apiClient';

export interface ProductItem {
  id: string;
  names?: Partial<Record<LangCode, string>>;
  title?: string;
  description?: string;
  category?: string;
  materialUsed?: string;
  price: string;
  stockQty: number;
  image: any; // local require or remote uri string
  aiEnhanced?: boolean;
  createdAt?: string;
}

const DEFAULT_PRODUCTS: ProductItem[] = [];

let globalProducts: ProductItem[] = [];
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function getProducts(): ProductItem[] {
  return globalProducts;
}

export async function addPublishedProduct(newProduct: {
  title: string;
  description?: string;
  category?: string;
  materialUsed?: string;
  price: string;
  stockQty?: number;
  image: string;
  aiEnhanced?: boolean;
}): Promise<ProductItem> {
  const formattedPrice = newProduct.price.startsWith('₹')
    ? newProduct.price
    : `₹${newProduct.price}`;

  const createdItem: ProductItem = {
    id: `prod_${Date.now()}`,
    title: newProduct.title,
    description: newProduct.description || '',
    category: newProduct.category || 'Handicrafts',
    materialUsed: newProduct.materialUsed || '',
    price: formattedPrice,
    stockQty: newProduct.stockQty ?? 20,
    image: newProduct.image ? { uri: newProduct.image } : require('@/assets/images/product_pot.png'),
    aiEnhanced: newProduct.aiEnhanced ?? true,
    createdAt: new Date().toISOString(),
  };

  // Prepend to top of catalog list so newly created product displays first
  globalProducts = [createdItem, ...globalProducts];
  notifyListeners();

  // Optionally attempt async post to backend
  try {
    const numericPrice = parseFloat(newProduct.price.replace(/[^0-9.]/g, '')) || 550;
    fetchFromBackend('/api/v1/products/', {
      method: 'POST',
      body: JSON.stringify({
        title: newProduct.title,
        description: newProduct.description || '',
        category: newProduct.category || 'Handicrafts',
        material_used: newProduct.materialUsed || '',
        price: numericPrice,
        stock_quantity: newProduct.stockQty ?? 20,
        primary_image_url: newProduct.image || '',
      }),
    }).catch((err) => {
      console.log('Backend publish info:', err);
    });
  } catch (e) {
    console.log('Backend publish skipped:', e);
  }

  return createdItem;
}

export function useProducts(): ProductItem[] {
  const [products, setProducts] = useState<ProductItem[]>(globalProducts);

  useEffect(() => {
    const handleChange = () => setProducts([...globalProducts]);
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  return products;
}
