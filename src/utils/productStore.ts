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

const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: '1',
    names: {
      en: 'Bamboo Basket',
      hi: 'बांस की टोकरी',
      bn: 'বাঁশের ঝুড়ি',
      bho: 'बांस के टोकरी',
      mr: 'बांबूची टोपली',
      gu: 'વાંસની ટોપલી',
      raj: 'बांस री टोकरी',
      kn: 'ಬಿದಿರಿನ ಬುಟ್ಟಿ',
    },
    title: 'Bamboo Basket',
    price: '₹350',
    stockQty: 45,
    image: require('@/assets/images/product_basket.png'),
    aiEnhanced: true,
  },
  {
    id: '2',
    names: {
      en: 'Bamboo Box Container',
      hi: 'बांस का डिब्बा',
      bn: 'বাঁশের বাক্স',
      bho: 'बांस के डिब्बा',
      mr: 'बांबूचा डब्बा',
      gu: 'વાંસનું બોક્સ',
      raj: 'बांस रो डिब्बो',
      kn: 'ಬಿದಿರಿನ ಪೆಟ್ಟಿಗೆ',
    },
    title: 'Bamboo Box Container',
    price: '₹450',
    stockQty: 30,
    image: require('@/assets/images/product_pot.png'),
    aiEnhanced: true,
  },
  {
    id: '3',
    names: {
      en: 'Wall Hanging Decor',
      hi: 'दीवार सजावट',
      bn: 'দেয়াল সজ্জা',
      bho: 'दीवाल सजावट',
      mr: 'भिंतीची सजावट',
      gu: 'दीवाल शणगार',
      raj: 'भींत सजावट',
      kn: 'ಗೋಡೆಯ ಅಲಂಕಾರ',
    },
    title: 'Wall Hanging Decor',
    price: '₹250',
    stockQty: 60,
    image: require('@/assets/images/product_macrame.png'),
    aiEnhanced: true,
  },
  {
    id: '4',
    names: {
      en: 'Terracotta Clay Pot',
      hi: 'मिट्टी का घड़ा',
      bn: 'পোড়ামাটির পাত্র',
      bho: 'माटी के घड़ा',
      mr: 'मातीचे मडके',
      gu: 'માટીનું માટલું',
      raj: 'माटी रो घड़ो',
      kn: 'ಮಣ್ಣಿನ ಮಡಕೆ',
    },
    title: 'Terracotta Clay Pot',
    price: '₹450',
    stockQty: 15,
    image: require('@/assets/images/product_pot.png'),
    aiEnhanced: true,
  },
  {
    id: '5',
    names: {
      en: 'Handmade Fabric Bag',
      hi: 'हैंडमेड कपड़ा बैग',
      bn: 'হাতে তৈরি কাপড়ের ব্যাগ',
      bho: 'हाथ के बनल कपड़ा बैग',
      mr: 'हस्तनिर्मित कापडी पिशवी',
      gu: 'હસ્તનિર્મિત કાપડની થેલી',
      raj: 'हाथ सूं बन्यो कपड़ो थैलो',
      kn: 'ಹಸ್ತಾಲಂಕಾರದ ಬಟ್ಟೆಯ ಚೀಲ',
    },
    title: 'Handmade Fabric Bag',
    price: '₹550',
    stockQty: 25,
    image: require('@/assets/images/product_bag.png'),
    aiEnhanced: true,
  },
];

let globalProducts: ProductItem[] = [...DEFAULT_PRODUCTS];
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
