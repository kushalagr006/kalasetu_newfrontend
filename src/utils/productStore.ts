import { useState, useEffect } from 'react';
import { LangCode } from '@/utils/languageStore';
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
  sourceLanguage?: string;
  title_en?: string;
  description_en?: string;
  category_en?: string;
  materialUsed_en?: string;
  translations_json?: string;
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
  sourceLanguage?: LangCode;
}): Promise<ProductItem> {
  const formattedPrice = newProduct.price.startsWith('₹')
    ? newProduct.price
    : `₹${newProduct.price}`;

  const srcLang = newProduct.sourceLanguage || 'hi';

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
    sourceLanguage: srcLang,
    names: {
      [srcLang]: newProduct.title,
      hi: newProduct.title,
      en: newProduct.title,
    },
  };

  // Prepend to top of catalog list so newly created product displays first
  globalProducts = [createdItem, ...globalProducts];
  notifyListeners();

  // Async post to Bhashini backend to generate NMT translations
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
        source_language: srcLang,
      }),
    })
      .then(async (res: any) => {
        if (res && res.ok) {
          const data = await res.json();
          if (data && data.translations_json) {
            createdItem.title_en = data.title_en;
            createdItem.description_en = data.description_en;
            createdItem.category_en = data.category_en;
            createdItem.materialUsed_en = data.material_used_en;
            createdItem.translations_json = data.translations_json;
            try {
              const parsed = typeof data.translations_json === 'string' ? JSON.parse(data.translations_json) : data.translations_json;
              createdItem.names = { ...createdItem.names, ...parsed };
            } catch (e) {}
            notifyListeners();
          }
        }
      })
      .catch((err) => {
        console.log('Backend publish info:', err);
      });
  } catch (e) {
    console.log('Backend publish skipped:', e);
  }

  return createdItem;
}

export function getMultilingualProductName(
  title: string = '',
  selectedLang: LangCode = 'hi',
  translations_json?: string,
  names?: Partial<Record<LangCode, string>>,
  title_en?: string
): string {
  // 1. Try parsed translations_json first
  if (translations_json) {
    try {
      const parsed = typeof translations_json === 'string' ? JSON.parse(translations_json) : translations_json;
      if (parsed && parsed[selectedLang] && typeof parsed[selectedLang] === 'string' && parsed[selectedLang].trim()) {
        return parsed[selectedLang];
      }
    } catch (e) {}
  }

  // 2. Try names object
  if (names && names[selectedLang] && typeof names[selectedLang] === 'string' && names[selectedLang]!.trim()) {
    return names[selectedLang]!;
  }

  // 3. If selectedLang is English and title_en exists
  if (selectedLang === 'en' && title_en && title_en.trim()) {
    return title_en;
  }

  const cleanTitle = (title || title_en || '').trim();
  if (!cleanTitle) return 'Artisan Craft Product';

  if (selectedLang === 'en') {
    return title_en || cleanTitle;
  }

  // Dynamic English -> Regional translation dictionary fallback
  const lower = cleanTitle.toLowerCase();
  const translationsMap: Record<string, Record<LangCode, string>> = {
    pot: { hi: 'मिट्टी का घड़ा', en: 'Earthen Pot', bn: 'মাটির পাত্র', bho: 'मिट्टी के घड़ा', mr: 'मातीचे भांडे', gu: 'માટીનું વાસણ', raj: 'माटी रो घड़ो', kn: 'ಮಣ್ಣಿನ ಪಾತ್ರೆ' },
    terracotta: { hi: 'टेराकोटा शिल्प', en: 'Terracotta Craft', bn: 'টেরাকোটা শিল্প', bho: 'टेराकोटा शिल्प', mr: 'टेराकोटा कला', gu: 'ટેરાકોટા શિલ્પ', raj: 'टेराकोटा शिल्प', kn: 'ಟೆರಾಕೋಟಾ ಕರಕುಶಲ' },
    bamboo: { hi: 'बांस का शिल्प', en: 'Bamboo Craft', bn: 'বাঁশের তৈরি শিল্প', bho: 'बांस के सामान', mr: 'बांबूचे काम', gu: 'વાંસનું કામ', raj: 'बांस रो काम', kn: 'ಬಿದಿರಿನ ಕರಕುಶಲ' },
    chair: { hi: 'लकड़ी की कुर्सी', en: 'Wooden Chair', bn: 'কাঠের চেয়ার', bho: 'लकड़ी के कुर्सी', mr: 'लाकडी खुर्ची', gu: 'લાકડાની ખુરશી', raj: 'लाकडी कुर्सी', kn: 'ಮರದ ಖುರ್ಚಿ' },
    basket: { hi: 'बांस की टोकरी', en: 'Bamboo Basket', bn: 'বাঁশের ঝুড়ি', bho: 'बांस के दौरा', mr: 'बांबूची टोपली', gu: 'વાંસની ટોપલી', raj: 'बांस री टोकरी', kn: 'ಬಿದಿರಿನ ಬುಟ್ಟಿ' },
    lamp: { hi: 'हस्तनिर्मित दीपक', en: 'Handmade Lamp', bn: 'হাতে তৈরি প্রদীপ', bho: 'हाथ के दिया', mr: 'हस्तनिर्मित दिवा', gu: 'હાથથી બનાવેલ દીવો', raj: 'हाथ रो दीयो', kn: 'ಹಸ್ತಚಾಲಿತ ದೀಪ' },
    wood: { hi: 'काष्ठ शिल्प', en: 'Wood Craft', bn: 'কাষ্ঠ শিল্প', bho: 'लकड़ी शिल्प', mr: 'काष्ठ कला', gu: 'લાકડાનું શિલ્પ', raj: 'काष्ठ शिल्प', kn: 'ಮರದ ಕರಕುಶಲ' },
    wooden: { hi: 'लकड़ी की कलाकृति', en: 'Wooden Craft', bn: 'কাঠের শিল্পবস্ত্র', bho: 'लकड़ी के सामान', mr: 'लाकडी वस्तू', gu: 'લાકડાની બનાવટ', raj: 'लाकડી सामान', kn: 'ಮರದ ವಸ್ತು' },
    mat: { hi: 'हथकरघा चटाई', en: 'Handwoven Mat', bn: 'হাতে বোনা মাদুর', bho: 'हाथ के चटाई', mr: 'हातमाग चटई', gu: 'હાથ વણેલી શેતરંજી', raj: 'हाथ री चटाई', kn: 'ಹಸ್ತಚಾಲಿತ ಚಾಪೆ' },
    saree: { hi: 'हथकरघा साड़ी', en: 'Handloom Saree', bn: 'তাঁতের শাড়ি', bho: 'हथकरघा साड़ी', mr: 'हातमाग साडी', gu: 'હાથ વણાટ સાડી', raj: 'हथकरघा साड़ी', kn: 'ಮಗ್ಗದ ಸೀರೆ' },
    bag: { hi: 'जूट का थैला', en: 'Jute Bag', bn: 'পাট ব্যাগ', bho: 'पटुआ के झोला', mr: 'ज्यूट पिशवी', gu: 'શણની થેલી', raj: 'पटुआ रो थैलो', kn: 'ಸೆಣಬಿನ ಚೀಲ' },
  };

  for (const [key, map] of Object.entries(translationsMap)) {
    if (lower.includes(key)) {
      return map[selectedLang] || map.hi;
    }
  }

  return cleanTitle;
}

export async function syncBackendProducts(): Promise<ProductItem[]> {
  try {
    const res = await fetchFromBackend('/api/v1/products/');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const fetchedItems: ProductItem[] = data.map((item: any) => {
          const imgUrl = item.images && item.images.length > 0
            ? item.images[0].enhanced_url || item.images[0].original_url
            : '';

          return {
            id: item.id,
            title: item.title,
            title_en: item.title_en,
            description: item.description,
            description_en: item.description_en,
            category: item.category,
            category_en: item.category_en,
            materialUsed: item.material_used,
            materialUsed_en: item.material_used_en,
            price: `₹${item.price}`,
            stockQty: item.stock_quantity || 20,
            image: imgUrl ? { uri: imgUrl } : require('@/assets/images/product_pot.png'),
            aiEnhanced: item.ai_enhanced ?? true,
            sourceLanguage: item.source_language || 'hi',
            translations_json: item.translations_json,
            createdAt: item.created_at,
          };
        });

        // Replace globalProducts with fresh backend items while keeping unsynced local pending items
        const fetchedIds = new Set(fetchedItems.map((f) => f.id));
        const pendingLocal = globalProducts.filter((p) => p.id.startsWith('prod_') && !fetchedIds.has(p.id));
        globalProducts = [...pendingLocal, ...fetchedItems];
        notifyListeners();
      }
    }
  } catch (err) {
    console.log('Live backend product sync info:', err);
  }
  return globalProducts;
}

export function useProducts(): ProductItem[] {
  const [products, setProducts] = useState<ProductItem[]>(globalProducts);

  useEffect(() => {
    // Initial backend sync
    syncBackendProducts();

    const handleChange = () => setProducts([...globalProducts]);
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  return products;
}
