import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getPendingProductPhoto } from '@/utils/photoStore';
import { useGlobalLang, LangCode } from '@/utils/languageStore';
import TopLangSelector from '@/components/TopLangSelector';
import { TEXT_STRINGS, PRODUCT_QUESTIONS } from '@/utils/productQuestions';
import { addPublishedProduct } from '@/utils/productStore';
import { fetchFromBackend } from '@/services/apiClient';

const TEXT_SUMMARY_STRINGS: Record<LangCode, {
  aiPredictedTitle: string;
  aiPredictedSub: string;
  yourQuotedPrice: string;
  selectSellingPrice: string;
  optionATitle: string;
  recommendedBadge: string;
  moreProfitTag: string;
  fairMarketRange: string;
  optionBTitle: string;
  optionBSub: string;
  optionCTitle: string;
  guidanceHeader: string;
  publishToCatalog: string;
  editDetails: string;
  summaryTitle: string;
  confirmSuccess: string;
  wholesaleBadge: string;
  bulkDiscountTag: string;
}> = {
  hi: {
    aiPredictedTitle: 'AI द्वारा अनुमानित अंचल बाज़ार मूल्य',
    aiPredictedSub: 'आपकी शिल्प कला, सामग्री और बाज़ार मांग के आधार पर सटीक मूल्यांकन',
    yourQuotedPrice: 'आपकी अनुमानित कीमत:',
    selectSellingPrice: 'अपनी अंतिम बिक्री दर चुनें:',
    optionATitle: 'AI Fair Market Retail Price',
    recommendedBadge: 'Recommended',
    moreProfitTag: 'अधिक मुनाफ़ा',
    fairMarketRange: 'न्यायसंगत बाज़ार सीमा:',
    optionBTitle: 'Your Original Quoted Price',
    optionBSub: 'आपकी स्वयं अनुमानित बिक्री दर',
    optionCTitle: 'AI Recommended Wholesale Bulk Rate',
    guidanceHeader: 'KalaSetu AI मार्केट गाइडेंस:',
    publishToCatalog: 'Publish Product',
    editDetails: '← विवरण में सुधार करें',
    summaryTitle: 'Final Product Details',
    confirmSuccess: 'उत्पाद सफलतापूर्वक पब्लिश हो गया है!',
    wholesaleBadge: 'थोक बिक्री (Wholesale Bulk Order)',
    bulkDiscountTag: 'बल्क छूट लागू',
  },
  en: {
    aiPredictedTitle: 'AI Estimated Fair Market Price',
    aiPredictedSub: 'Based on craftsmanship quality, raw materials and market demand',
    yourQuotedPrice: 'Your Quoted Price:',
    selectSellingPrice: 'Select Your Final Selling Rate:',
    optionATitle: 'AI Fair Market Retail Price',
    recommendedBadge: 'Recommended',
    moreProfitTag: 'more profit',
    fairMarketRange: 'Fair Market Range:',
    optionBTitle: 'Your Original Quoted Price',
    optionBSub: 'Your self-estimated selling price',
    optionCTitle: 'AI Recommended Wholesale Bulk Rate',
    guidanceHeader: 'KalaSetu AI Market Guidance:',
    publishToCatalog: 'Publish Product',
    editDetails: '← Edit Details',
    summaryTitle: 'Final Product Details',
    confirmSuccess: 'Product published successfully!',
    wholesaleBadge: 'Wholesale Bulk Order',
    bulkDiscountTag: 'Bulk Discount Applied',
  },
  bn: {
    aiPredictedTitle: 'AI দ্বারা অনুমিত ন্যায্য বাজার মূল্য',
    aiPredictedSub: 'কারুশিল্প, উপাদান এবং বাজারের চাহিদার ভিত্তিতে সঠিক মূল্যায়ন',
    yourQuotedPrice: 'আপনার প্রস্তাবিত দাম:',
    selectSellingPrice: 'আপনার চূড়ান্ত বিক্রয় মূল্য চয়ন করুন:',
    optionATitle: 'AI Fair Market Retail Price',
    recommendedBadge: 'সুপারিশকৃত',
    moreProfitTag: 'অতিরিক্ত লাভ',
    fairMarketRange: 'ন্যায্য বাজার পরিসর:',
    optionBTitle: 'Your Original Quoted Price',
    optionBSub: 'আপনার স্ব-অনুমিত বিক্রয় মূল্য',
    optionCTitle: 'AI Recommended Wholesale Bulk Rate',
    guidanceHeader: 'KalaSetu AI মার্কেট নির্দেশিকা:',
    publishToCatalog: 'Publish Product',
    editDetails: '← বিবরণ সম্পাদনা করুন',
    summaryTitle: 'Final Product Details',
    confirmSuccess: 'পণ্য সফলভাবে প্রকাশিত হয়েছে!',
    wholesaleBadge: 'পাইকারি অর্ডার (Wholesale Order)',
    bulkDiscountTag: 'বাল্ক ছাড় প্রযোজ্য',
  },
  bho: {
    aiPredictedTitle: 'AI से अनुमानित बाजार दाम',
    aiPredictedSub: 'शिल्प कला, लागल सामान आ मांग के आधार पर सटीक मूल्यांकन',
    yourQuotedPrice: 'रउआ बतावल दाम:',
    selectSellingPrice: 'आपन अंतिम बिक्री दाम चुनीं:',
    optionATitle: 'AI Fair Market Retail Price',
    recommendedBadge: 'Recommended',
    moreProfitTag: 'जादे मुनाफा',
    fairMarketRange: 'उचित बाजार सीमा:',
    optionBTitle: 'Your Original Quoted Price',
    optionBSub: 'रउआ खुद के बतावल बिक्री दाम',
    optionCTitle: 'AI Recommended Wholesale Bulk Rate',
    guidanceHeader: 'KalaSetu AI मार्केट गाइडेंस:',
    publishToCatalog: 'Publish Product',
    editDetails: '← विवरण में सुधार करीं',
    summaryTitle: 'Final Product Details',
    confirmSuccess: 'सामान सफलतापूर्वक पब्लिश हो गइल!',
    wholesaleBadge: 'थोक बिक्री (Wholesale Order)',
    bulkDiscountTag: 'बल्क छूट लागल बा',
  },
  mr: {
    aiPredictedTitle: 'AI द्वारे अंदाजित बाजार किंमत',
    aiPredictedSub: 'तुमची कलाकुसर, वापरलेले साहित्य आणि मागणीनुसार अचूक मूल्य',
    yourQuotedPrice: 'तुमची सांगितलेली किंमत:',
    selectSellingPrice: 'तुमचा अंतिम विक्री दर निवडा:',
    optionATitle: 'AI Fair Market Retail Price',
    recommendedBadge: 'शिफारस केलेले',
    moreProfitTag: 'अधिक नफा',
    fairMarketRange: 'योग्य बाजार श्रेणी:',
    optionBTitle: 'Your Original Quoted Price',
    optionBSub: 'तुमचा स्वतःचा विक्री दर',
    optionCTitle: 'AI Recommended Wholesale Bulk Rate',
    guidanceHeader: 'KalaSetu AI मार्केट मार्गदर्शन:',
    publishToCatalog: 'Publish Product',
    editDetails: '← माहिती बदला',
    summaryTitle: 'Final Product Details',
    confirmSuccess: 'उत्पादन यशस्वीरित्या प्रकाशित झाले!',
    wholesaleBadge: 'घाऊक ऑर्डर (Wholesale Order)',
    bulkDiscountTag: 'बल्क सूट लागू',
  },
  gu: {
    aiPredictedTitle: 'AI દ્વારા અંદાજિત વ્યાજબી બજાર કિંમત',
    aiPredictedSub: 'તમારી કારીગરી, સામગ્રી અને બજાર માંગના આધારે વર્ગીકરણ',
    yourQuotedPrice: 'તમારી અંદાજિત કિંમત:',
    selectSellingPrice: 'તમારી અંતિમ વેચાણ કિંમત પસંદ કરો:',
    optionATitle: 'AI Fair Market Retail Price',
    recommendedBadge: 'ભલામણ કરેલ',
    moreProfitTag: 'વધુ નફો',
    fairMarketRange: 'વાજબી બજાર રેન્જ:',
    optionBTitle: 'Your Original Quoted Price',
    optionBSub: 'તમારી મૂળ જણાવેલ વેચાણ કિંમત',
    optionCTitle: 'AI Recommended Wholesale Bulk Rate',
    guidanceHeader: 'KalaSetu AI બજાર સલાહ:',
    publishToCatalog: 'Publish Product',
    editDetails: '← વિગત સુધારો',
    summaryTitle: 'Final Product Details',
    confirmSuccess: 'ઉત્પાદન સફળતાપૂર્વક પબ્લિશ થયું!',
    wholesaleBadge: 'જથ્થાબંધ ઓર્ડર (Wholesale Order)',
    bulkDiscountTag: 'બલ્ક ડિસ્કાઉન્ટ ઉપલબ્ધ',
  },
  raj: {
    aiPredictedTitle: 'AI सूं तय वाजिब बजार भाव',
    aiPredictedSub: 'कारीगरी अर बजार मांग रे आधार पर सटीक भाव',
    yourQuotedPrice: 'आपरो बतायोड़ो भाव:',
    selectSellingPrice: 'आपरो अंतिम बिक्री भाव चुणो:',
    optionATitle: 'AI Fair Market Retail Price',
    recommendedBadge: 'सलाह दीधोड़ो',
    moreProfitTag: 'जादा नफो',
    fairMarketRange: 'वाजिब बजार रेंज:',
    optionBTitle: 'Your Original Quoted Price',
    optionBSub: 'आपरी खुद री बतायोड़ी बिक्री भाव',
    optionCTitle: 'AI Recommended Wholesale Bulk Rate',
    guidanceHeader: 'KalaSetu AI बजार सलाह:',
    publishToCatalog: 'Publish Product',
    editDetails: '← ब्योरो बदलो',
    summaryTitle: 'Final Product Details',
    confirmSuccess: 'माल सफलतापूर्वक पब्लिश हो गयो!',
    wholesaleBadge: 'थोक बिक्री (Wholesale Order)',
    bulkDiscountTag: 'बल्क छूट लागू',
  },
  kn: {
    aiPredictedTitle: 'AI ನಿಂದ ಅಂದಾಜು ಮಾಡಿದ ಅಂತಿಮ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ',
    aiPredictedSub: 'ಕರಕುಶಲ ಗುಣಮಟ್ಟ ಮತ್ತು ಬೇಡಿಕೆಯ ಆಧಾರದ ಮೇಲೆ ಸೂಕ್ತ ಬೆಲೆ',
    yourQuotedPrice: 'ನಿಮ್ಮ ಬೆಲೆ:',
    selectSellingPrice: 'ನಿಮ್ಮ ಅಂತಿಮ ಮಾರಾಟ ಬೆಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
    optionATitle: 'AI Fair Market Retail Price',
    recommendedBadge: 'ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ',
    moreProfitTag: 'ಹೆಚ್ಚಿನ ಲಾಭ',
    fairMarketRange: 'ನ್ಯಾಯಯುತ ಮಾರುಕಟ್ಟೆ ಶ್ರೇಣಿ:',
    optionBTitle: 'Your Original Quoted Price',
    optionBSub: 'ನಿಮ್ಮ ಸ್ವಯಂ ಅಂದಾಜು ಮಾಡಿದ ಮಾರಾಟ ಬೆಲೆ',
    optionCTitle: 'AI Recommended Wholesale Bulk Rate',
    guidanceHeader: 'KalaSetu AI ಮಾರುಕಟ್ಟೆ ಮಾರ್ಗದರ್ಶನ:',
    publishToCatalog: 'Publish Product',
    editDetails: '← ವಿವರಗಳನ್ನು ತಿದ್ದುಪಡಿ ಮಾಡಿ',
    summaryTitle: 'Final Product Details',
    confirmSuccess: 'ಉತ್ಪನ್ನ ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಕಟವಾಗಿದೆ!',
    wholesaleBadge: 'ಸಗಟು ಆದೇಶ (Wholesale Bulk Order)',
    bulkDiscountTag: 'ಬಲ್ಕ್ ರಿಯಾಯಿತಿ ಅನ್ವಯಿಸಲಾಗಿದೆ',
  },
};

export default function AddProductTextScreen() {
  const router = useRouter();
  const [globalLang] = useGlobalLang();
  const t = TEXT_STRINGS[globalLang] || TEXT_STRINGS.hi;
  const ts = TEXT_SUMMARY_STRINGS[globalLang] || TEXT_SUMMARY_STRINGS.hi;

  // 6 Questions State Sync
  const [productName, setProductName] = useState(''); // Q1
  const [description, setDescription] = useState(''); // Q2
  const [category, setCategory] = useState('Pottery & Claycraft'); // Q3
  const [features, setFeatures] = useState(''); // Q4: Material Used
  const [price, setPrice] = useState(''); // Q5: Selling Price
  const [stock, setStock] = useState('1'); // Q6: Stock Quantity
  const [location, setLocation] = useState('');

  const [stage, setStage] = useState<'FORM' | 'SUMMARY'>('FORM');
  const [selectedPriceOption, setSelectedPriceOption] = useState<'AI_RETAIL' | 'ARTISAN' | 'AI_WHOLESALE'>('AI_RETAIL');
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);

  const [pricingEstimate, setPricingEstimate] = useState<{
    suggested_price: number;
    recommended_min: number;
    recommended_max: number;
    artisan_price: number;
    guidance: { hindi: string; english: string };
    pricing: { cost_floor: number; market_reference_price: number };
    bulk_wholesale?: {
      is_bulk: boolean;
      quantity: number;
      bulk_discount_percentage?: string;
      bulk_price_per_piece?: number;
      bulk_order_total?: number;
      total_estimated_profit?: string;
    };
  } | null>(null);

  const pendingPhoto = getPendingProductPhoto();
  const photoUri = pendingPhoto.photoUri;

  const handleProceedToPricing = async () => {
    if (!productName.trim()) {
      Alert.alert('Notice', t.errNameAlert);
      return;
    }

    const numPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 450;
    const parsedQty = parseInt(stock.replace(/[^0-9]/g, ''), 10);
    const numQty = isNaN(parsedQty) || parsedQty < 1 ? 1 : parsedQty;

    setIsLoadingPricing(true);

    try {
      const bodyParams = new URLSearchParams();
      bodyParams.append('selling_price', String(numPrice));
      bodyParams.append('quantity', String(numQty));
      bodyParams.append('product_name', productName);
      bodyParams.append('source_language', globalLang || 'hi');
      const combinedDesc = `${category} ${features} ${description}`.trim();
      if (combinedDesc) {
        bodyParams.append('description', combinedDesc);
      }

      const res = await fetchFromBackend('/api/v1/pricing/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams.toString(),
      });

      if (res.ok) {
        const data = await res.json();
        setPricingEstimate({
          suggested_price: data.suggested_price || Math.round(numPrice * 1.22),
          recommended_min: data.recommended_min || Math.round(numPrice * 1.05),
          recommended_max: data.recommended_max || Math.round(numPrice * 1.45),
          artisan_price: numPrice,
          guidance: data.guidance || { hindi: '', english: '' },
          pricing: data.pricing || { cost_floor: Math.round(numPrice * 0.7), market_reference_price: data.suggested_price || Math.round(numPrice * 1.22) },
          bulk_wholesale: data.bulk_wholesale || (numQty >= 5 ? {
            is_bulk: true,
            quantity: numQty,
            bulk_discount_percentage: numQty >= 50 ? '20.0%' : (numQty >= 20 ? '15.0%' : '10.0%'),
            bulk_price_per_piece: Math.round(numPrice * (numQty >= 50 ? 0.8 : (numQty >= 20 ? 0.85 : 0.9))),
            bulk_order_total: Math.round(numPrice * (numQty >= 50 ? 0.8 : (numQty >= 20 ? 0.85 : 0.9))) * numQty,
            total_estimated_profit: `Rs. ${Math.round(numPrice * 0.3 * numQty)}`
          } : { is_bulk: false, quantity: numQty }),
        });
      } else {
        throw new Error('Non 200 response');
      }
    } catch (e) {
      console.log('Pricing API estimate fallback:', e);
      const suggestedFallback = Math.round((numPrice * 1.22) / 10) * 10;
      setPricingEstimate({
        suggested_price: suggestedFallback,
        recommended_min: Math.round(numPrice * 1.05),
        recommended_max: Math.round(numPrice * 1.45),
        artisan_price: numPrice,
        guidance: {
          hindi: `सलाह: आप इसे ₹${numPrice} में बेच रहे हैं, जबकि बाज़ार में यह ₹${suggestedFallback} तक बिकता है। आप इसे कम से कम ₹${suggestedFallback} में बेचें। आपको ₹${suggestedFallback - numPrice} का सीधा अतिरिक्त मुनाफ़ा होगा!`,
          english: `Advise: Artisan sells at ₹${numPrice} vs market ₹${suggestedFallback}. Room to capture +22% margin.`
        },
        pricing: {
          cost_floor: Math.round(numPrice * 0.7),
          market_reference_price: suggestedFallback
        },
        bulk_wholesale: numQty >= 5 ? {
          is_bulk: true,
          quantity: numQty,
          bulk_discount_percentage: numQty >= 50 ? '20.0%' : (numQty >= 20 ? '15.0%' : '10.0%'),
          bulk_price_per_piece: Math.round(numPrice * (numQty >= 50 ? 0.8 : (numQty >= 20 ? 0.85 : 0.9))),
          bulk_order_total: Math.round(numPrice * (numQty >= 50 ? 0.8 : (numQty >= 20 ? 0.85 : 0.9))) * numQty,
          total_estimated_profit: `Rs. ${Math.round(numPrice * 0.3 * numQty)}`
        } : { is_bulk: false, quantity: numQty }
      });
    } finally {
      setIsLoadingPricing(false);
      setStage('SUMMARY');
    }
  };

  const artisanPriceVal = parseFloat(price.replace(/[^0-9.]/g, '')) || 450;
  const parsedQtyVal = parseInt(stock.replace(/[^0-9]/g, ''), 10);
  const qtyVal = isNaN(parsedQtyVal) || parsedQtyVal < 1 ? 1 : parsedQtyVal;
  const isBulkOrder = qtyVal >= 5;

  const bulkInfo = pricingEstimate?.bulk_wholesale;
  const bulkDiscPctStr = bulkInfo?.bulk_discount_percentage || (qtyVal >= 50 ? '20.0%' : (qtyVal >= 20 ? '15.0%' : (qtyVal >= 5 ? '10.0%' : '0%')));

  const baseAiPriceVal = pricingEstimate?.suggested_price || Math.round((artisanPriceVal * 1.22) / 10) * 10;
  
  const discMult = qtyVal >= 50 ? 0.8 : (qtyVal >= 20 ? 0.85 : 0.9);
  const bulkPricePerPiece = bulkInfo?.bulk_price_per_piece || Math.round((baseAiPriceVal * discMult) / 10) * 10;
  const bulkOrderTotal = bulkInfo?.bulk_order_total || bulkPricePerPiece * qtyVal;

  const gainVal = Math.max(0, baseAiPriceVal - artisanPriceVal);
  const gainPct = artisanPriceVal > 0 ? Math.round((gainVal / artisanPriceVal) * 100) : 22;

  const chosenUnitPrice = selectedPriceOption === 'AI_RETAIL'
    ? baseAiPriceVal
    : selectedPriceOption === 'AI_WHOLESALE'
    ? bulkPricePerPiece
    : artisanPriceVal;

  const chosenFinalPrice = selectedPriceOption === 'AI_RETAIL'
    ? baseAiPriceVal * qtyVal
    : selectedPriceOption === 'AI_WHOLESALE'
    ? bulkOrderTotal
    : artisanPriceVal * qtyVal;

  const handlePublishCatalog = async () => {
    const guidanceText = pricingEstimate?.guidance
      ? (globalLang === 'en' ? pricingEstimate.guidance.english || pricingEstimate.guidance.hindi : pricingEstimate.guidance.hindi || pricingEstimate.guidance.english)
      : '';

    await addPublishedProduct({
      title: productName,
      description: description,
      category: category || 'Handicrafts',
      materialUsed: features,
      price: String(chosenUnitPrice),
      stockQty: qtyVal,
      image: photoUri || '',
      aiEnhanced: true,
      sourceLanguage: globalLang,
      unitPrice: chosenUnitPrice,
      isBulkOrder: isBulkOrder,
      bulkDiscountPct: bulkDiscPctStr,
      bulkOrderTotal: isBulkOrder ? chosenFinalPrice : chosenUnitPrice,
      artisanPrice: artisanPriceVal,
      aiSuggestedPrice: baseAiPriceVal,
      guidanceText: guidanceText,
    });

    Alert.alert(
      t.headerTitle,
      ts.confirmSuccess,
      [
        {
          text: 'OK',
          onPress: () => router.push('/products'),
        },
      ]
    );
  };

  const getLocalizedGuidanceText = (
    lang: LangCode,
    artisanP: number,
    aiP: number,
    mRef: number,
    gain: number,
    gainP: number,
    backendGuidance?: { hindi?: string; english?: string }
  ): string => {
    if (isBulkOrder) {
      if (lang === 'en') {
        return `Bulk Wholesale Guidance: ${qtyVal} pieces volume order with ${bulkDiscPctStr} volume discount. Unit rate ₹${bulkPricePerPiece}/pc. Total wholesale order value: ₹${bulkOrderTotal.toLocaleString()}.`;
      }
      if (lang === 'hi') {
        return `थोक ऑर्डर सलाह: ${qtyVal} पीस के बड़े ऑर्डर पर ${bulkDiscPctStr} डिस्काउंट लागू है। ₹${bulkPricePerPiece}/पीस थोक दर पर कुल ऑर्डर मूल्य: ₹${bulkOrderTotal.toLocaleString()}।`;
      }
      if (lang === 'bn') {
        return `পাইকারি অডার পরামর্শ: ${qtyVal} পিসের অর্ডারে ${bulkDiscPctStr} ছাড় প্রযোজ্য। মোট পাইকারি দাম: ₹${bulkOrderTotal.toLocaleString()}।`;
      }
      if (lang === 'bho') {
        return `थोक ऑर्डर सलाह: ${qtyVal} पीस के ऑर्डर पर ${bulkDiscPctStr} छूट लागू बा। कुल थोक ऑर्डर दाम: ₹${bulkOrderTotal.toLocaleString()}।`;
      }
      if (lang === 'mr') {
        return `घाऊक ऑर्डर सल्ला: ${qtyVal} नगांच्या ऑर्डरवर ${bulkDiscPctStr} सवलत लागू आहे. एकूण घाऊक मूल्य: ₹${bulkOrderTotal.toLocaleString()}।`;
      }
      if (lang === 'gu') {
        return `જથ્થાબંધ ઓર્ડર સલાહ: ${qtyVal} પીસ પર ${bulkDiscPctStr} ડિસ્કાઉન્ટ ઉપલબ્ધ છે. કુલ ઓર્ડર કિંમત: ₹${bulkOrderTotal.toLocaleString()}।`;
      }
      if (lang === 'raj') {
        return `थोक ऑर्डर सलाह: ${qtyVal} पीस रे ऑर्डर पर ${bulkDiscPctStr} छूट लागू है। कुल थोक भाव: ₹${bulkOrderTotal.toLocaleString()}।`;
      }
      if (lang === 'kn') {
        return `ಸಗಟು ಆದೇಶ ಮಾರ್ಗದರ್ಶನ: ${qtyVal} ಪೀಸ್‌ಗಳ ಆದೇಶದ ಮೇಲೆ ${bulkDiscPctStr} ರಿಯಾಯಿತಿ ಇದೆ. ಒಟ್ಟು ಸಗಟು ಮೌಲ್ಯ: ₹${bulkOrderTotal.toLocaleString()}।`;
      }
    }

    if (lang === 'en') {
      if (backendGuidance?.english) return backendGuidance.english;
      if (gain > 0) {
        return `Advice: You quoted ₹${artisanP}, while online market listings sell around ₹${mRef || aiP}. We recommend pricing at ₹${aiP} to capture +₹${gain} (+${gainP}%) additional direct profit!`;
      }
      return `Advice: Your quoted price of ₹${artisanP} is well aligned with prevailing online market rates.`;
    }
    if (lang === 'hi') {
      if (backendGuidance?.hindi) return backendGuidance.hindi;
      if (gain > 0) {
        return `सलाह: आप इसे ₹${artisanP} में बेच रहे हैं, जबकि बाज़ार में यह ₹${mRef || aiP} तक बिकता है। आप इसे कम से कम ₹${aiP} में बेचें। आपको ₹${gain} का सीधा अतिरिक्त मुनाफ़ा होगा!`;
      }
      return `सलाह: आपका दाम (₹${artisanP}) बाज़ार के बिल्कुल सही स्तर पर है। आप ₹${aiP} में आसानी से बेच सकते हैं।`;
    }
    if (lang === 'bn') {
      if (gain > 0) {
        return `পরামর্শ: আপনি ₹${artisanP} মূল্য প্রস্তাব করছেন, যখন বাজারে এটি ₹${mRef || aiP} পর্যন্ত বিক্রি হয়। ₹${aiP} মূল্যে বিক্রি করলে আপনার ₹${gain} (+${gainP}%) অতিরিক্ত সরাসরি লাভ হবে!`;
      }
      return `পরামর্শ: আপনার মূল্য (₹${artisanP}) বাজারের মানদণ্ডের সাথে মানানসই। আপনি ₹${aiP} এ বিক্রি করতে পারেন।`;
    }
    if (lang === 'bho') {
      if (gain > 0) {
        return `सलाह: रउआ एकरा के ₹${artisanP} में बेचत बानी, जबकि बाज़ार में ई ₹${mRef || aiP} तक बिकाला। रउआ एकरा के ₹${aiP} में बेचीं। रउआ के ₹${gain} के सीधा जादे मुनाफा होई!`;
      }
      return `सलाह: रउआ के भाव (₹${artisanP}) बाज़ार के बिल्कुल सही स्तर पर बा। रउआ ₹${aiP} में बेच सकत बानी।`;
    }
    if (lang === 'mr') {
      if (gain > 0) {
        return `सल्ला: तुम्ही हे ₹${artisanP} ला विकत आहात, तर बाजारात हे ₹${mRef || aiP} पर्यंत विकले जाते. ₹${aiP} ला विकल्यास तुम्हाला ₹${gain} (+${gainP}%) थेट अतिरिक्त नफा मिळेल!`;
      }
      return `सल्ला: तुमची किंमत (₹${artisanP}) बाजाराच्या मानकांशी सुसंगत आहे. तुम्ही ₹${aiP} ला विकू शकता.`;
    }
    if (lang === 'gu') {
      if (gain > 0) {
        return `સલાહ: તમે આ ₹${artisanP} માં વેચી રહ્યા છો, જ્યારે બજારમાં તે ₹${mRef || aiP} સુધી વેચાય છે. ₹${aiP} માં વેચવાથી તમને ₹${gain} (+${gainP}%) વધારાનો નફો મળશે!`;
      }
      return `સલાહ: તમારી કિંમત (₹${artisanP}) બજારના ધોરણો સાથે યોગ્ય રીતે મેળ ખાતી રહે છે. તમે ₹${aiP} માં વેચી શકો છો.`;
    }
    if (lang === 'raj') {
      if (gain > 0) {
        return `सलाह: आप इने ₹${artisanP} में बेच रिया हो, जदके बजार में ओ ₹${mRef || aiP} ताईं बिकै। आप इने ₹${aiP} में बेचो। आपने ₹${gain} रो सीधो जादा नफो होवेला!`;
      }
      return `सलाह: आपरो भाव (₹${artisanP}) बजार रे हिसाब सूं बिल्कुल सही है। आप ₹${aiP} में बेच सको हो।`;
    }
    if (lang === 'kn') {
      if (gain > 0) {
        return `ಸಲಹೆ: ನೀವು ಇದನ್ನು ₹${artisanP} ಗೆ ಮಾರಾಟ ಮಾಡುತ್ತಿದ್ದೀರಿ, ಆದರೆ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಇದು ₹${mRef || aiP} ವರೆಗೆ ಮಾರಾಟವಾಗುತ್ತದೆ. ₹${aiP} ಗೆ ಮಾರಾಟ ಮಾಡುವುದರಿಂದ ನಿಮಗೆ ₹${gain} (+${gainP}%) ಹೆಚ್ಚುವರಿ ಲಾಭ ಸಿಗುತ್ತದೆ!`;
      }
      return `ಸಲಹೆ: ನಿಮ್ಮ ಬೆಲೆ (₹${artisanP}) ಮಾರುಕಟ್ಟೆ ಮಾನದಂಡಗಳಿಗೆ ಸೂಕ್ತವಾಗಿದೆ. ನೀವು ₹${aiP} ಗೆ ಮಾರಾಟ ಮಾಡಬಹುದು.`;
    }
    return backendGuidance?.english || backendGuidance?.hindi || '';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (stage === 'SUMMARY') {
                setStage('FORM');
              } else {
                router.back();
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#3B6029" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {stage === 'FORM' ? t.headerTitle : ts.summaryTitle}
          </Text>

          <TopLangSelector />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Enhanced Photo Banner Preview */}
          {photoUri && (
            <View style={styles.photoBanner}>
              <Image
                source={{ uri: photoUri }}
                style={styles.photoThumb}
                resizeMode="cover"
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#3B6029' }}>
                  {t.photoAttached}
                </Text>
                <Text style={{ fontSize: 11, color: '#666666', marginTop: 2 }}>
                  {t.photoSub}
                </Text>
              </View>
            </View>
          )}

          {stage === 'FORM' ? (
            /* ================= STAGE 1: 6 QUESTIONS MANUAL FORM ================= */
            <View>
              {/* Info Banner Card */}
              <View style={styles.infoBanner}>
                <View style={styles.pencilCircleSmall}>
                  <Ionicons name="pencil" size={26} color="#3B6029" />
                </View>

                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoTitle}>
                    {t.infoTitle}
                  </Text>
                  <Text style={styles.infoSubtitle}>
                    {t.infoSub}
                  </Text>
                </View>
              </View>

              {/* Question 1: Product Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Q1. {t.labelName}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.placeholderName}
                  placeholderTextColor="#999999"
                  value={productName}
                  onChangeText={setProductName}
                />
              </View>

              {/* Question 2: Product Description */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Q2. {t.labelDescription}
                </Text>
                <View style={styles.multilineInputContainer}>
                  <TextInput
                    style={styles.multilineInput}
                    placeholder={t.placeholderDescription}
                    placeholderTextColor="#999999"
                    multiline
                    maxLength={300}
                    value={description}
                    onChangeText={setDescription}
                  />
                  <Text style={styles.charCounter}>{`${description.length}/300`}</Text>
                </View>
              </View>

              {/* Question 3 & Question 4: Category & Materials */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Q3. {t.labelCategory}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Pottery & Claycraft, Handloom, Woodcraft"
                  placeholderTextColor="#999999"
                  value={category}
                  onChangeText={setCategory}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Q4. {t.labelMaterials}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={t.placeholderMaterials}
                  placeholderTextColor="#999999"
                  value={features}
                  onChangeText={setFeatures}
                />
              </View>

              {/* Question 5 & Question 6: Price & Stock Row */}
              <View style={styles.formRow}>
                {/* Price (Q5) */}
                <View style={[styles.formGroup, styles.formCol]}>
                  <Text style={styles.label}>
                    Q5. {t.labelPrice}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t.placeholderPrice}
                    placeholderTextColor="#999999"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>

                {/* Stock Quantity (Q6) */}
                <View style={[styles.formGroup, styles.formCol]}>
                  <Text style={styles.label}>
                    Q6. {t.labelStock}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t.placeholderStock}
                    placeholderTextColor="#999999"
                    keyboardType="numeric"
                    value={stock}
                    onChangeText={setStock}
                  />
                </View>
              </View>

              {/* Optional Location */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  {t.labelLocation}
                </Text>
                <View style={styles.locationInputBox}>
                  <Ionicons name="location-outline" size={20} color="#777777" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.locationTextInput}
                    placeholder={t.placeholderLocation}
                    placeholderTextColor="#999999"
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>
              </View>

              {/* CTA Button to proceed to AI Pricing Estimate */}
              <TouchableOpacity
                style={styles.saveProductButton}
                onPress={handleProceedToPricing}
                activeOpacity={0.85}
                disabled={isLoadingPricing}
              >
                {isLoadingPricing ? (
                  <ActivityIndicator color="#FFFFFF" size="small" style={{ marginRight: 8 }} />
                ) : (
                  <Ionicons name="sparkles-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                )}
                <Text style={styles.saveProductButtonText}>
                  {isLoadingPricing ? 'Evaluating AI Price...' : 'Calculate Fair AI Price & Continue →'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* ================= STAGE 2: AI PRICE SELECTION & SUMMARY ================= */
            <View>
              {/* AI Prediction Header Banner */}
              <View style={styles.priceHeaderBanner}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.priceBannerTitle}>
                    {ts.aiPredictedTitle}
                  </Text>
                  <Text style={styles.priceBannerSub}>
                    {ts.aiPredictedSub}
                  </Text>
                </View>
              </View>

              {/* Wholesale Bulk Order Summary Banner Card */}
              {isBulkOrder && (
                <View style={{
                  backgroundColor: '#E8F5E9',
                  borderColor: '#2E7D32',
                  borderWidth: 1.5,
                  borderRadius: 16,
                  padding: 14,
                  marginBottom: 16,
                }}>
                  <View style={{ marginBottom: 6 }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1B5E20' }}>
                      Wholesale Bulk Order ({qtyVal} Pcs)
                    </Text>
                    <Text style={{ fontSize: 12, color: '#2E7D32', fontWeight: '600', marginTop: 2 }}>
                      Bulk Discount: {bulkDiscPctStr} OFF ({qtyVal} Pcs)
                    </Text>
                  </View>
                  
                  <View style={{ backgroundColor: '#FFFFFF', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#A5D6A7' }}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1B5E20' }}>
                      Suggested Wholesale Rate: ₹{bulkPricePerPiece} / pc
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#2E7D32', marginTop: 2 }}>
                      Total Order Value: ₹{bulkOrderTotal.toLocaleString()} ({qtyVal} Pcs)
                    </Text>
                    <Text style={{ fontSize: 11, color: '#388E3C', marginTop: 2 }}>
                      Optimal rate for bulk wholesale transactions
                    </Text>
                  </View>
                </View>
              )}

              {/* Product Info Preview Card */}
              <View style={styles.productPreviewCard}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.previewThumb} resizeMode="cover" />
                ) : (
                  <Image source={require('@/assets/images/cust_prod_clay.png')} style={styles.previewThumb} resizeMode="cover" />
                )}
                <View style={styles.productMetaCol}>
                  <Text style={styles.productTitle}>{productName || 'Craft Item'}</Text>
                  <Text style={styles.productCat}>{category || 'Handicrafts'}</Text>
                  {features ? <Text style={styles.productMat}>{features}</Text> : null}
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#E65100', marginTop: 4 }}>
                    {ts.yourQuotedPrice} ₹{artisanPriceVal} {isBulkOrder ? `(Qty: ${qtyVal} Pcs)` : ''}
                  </Text>
                </View>
              </View>

              {/* 3 Price Selection Options (Option A, Option B, Option C) */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 }}>
                  {ts.selectSellingPrice}
                </Text>

                {/* Option A: AI Fair Market Retail Price */}
                <TouchableOpacity
                  style={{
                    backgroundColor: selectedPriceOption === 'AI_RETAIL' ? '#F4F9F2' : '#FFFFFF',
                    borderColor: selectedPriceOption === 'AI_RETAIL' ? '#3B6029' : '#EFECE6',
                    borderWidth: 2,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    elevation: selectedPriceOption === 'AI_RETAIL' ? 3 : 1,
                  }}
                  onPress={() => setSelectedPriceOption('AI_RETAIL')}
                  activeOpacity={0.88}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#3B6029' }}>
                        {ts.optionATitle}
                      </Text>
                      <View style={{ backgroundColor: '#3B6029', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginLeft: 8 }}>
                        <Text style={{ fontSize: 10, color: '#FFF', fontWeight: 'bold' }}>{ts.recommendedBadge}</Text>
                      </View>
                    </View>
                    
                    <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1A1A1A' }}>
                      ₹{baseAiPriceVal} <Text style={{ fontSize: 14, fontWeight: 'normal', color: '#666' }}>/ pc</Text>
                    </Text>

                    {gainVal > 0 && (
                      <Text style={{ fontSize: 12, color: '#3B6029', fontWeight: '700', marginTop: 2 }}>
                        +₹{gainVal} ({gainPct}%) {ts.moreProfitTag}
                      </Text>
                    )}

                    <Text style={{ fontSize: 11, color: '#666666', marginTop: 4 }}>
                      {ts.fairMarketRange} ₹{pricingEstimate?.recommended_min || Math.round(artisanPriceVal * 1.05)} – ₹{pricingEstimate?.recommended_max || Math.round(artisanPriceVal * 1.45)}
                    </Text>
                  </View>
                  <Ionicons
                    name={selectedPriceOption === 'AI_RETAIL' ? 'radio-button-on' : 'radio-button-off'}
                    size={26}
                    color={selectedPriceOption === 'AI_RETAIL' ? '#3B6029' : '#CCCCCC'}
                  />
                </TouchableOpacity>

                {/* Option B: Your Original Quoted Price */}
                <TouchableOpacity
                  style={{
                    backgroundColor: selectedPriceOption === 'ARTISAN' ? '#FFFDF5' : '#FFFFFF',
                    borderColor: selectedPriceOption === 'ARTISAN' ? '#E65100' : '#EFECE6',
                    borderWidth: 2,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    elevation: selectedPriceOption === 'ARTISAN' ? 3 : 1,
                  }}
                  onPress={() => setSelectedPriceOption('ARTISAN')}
                  activeOpacity={0.88}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#E65100', marginBottom: 4 }}>
                      {ts.optionBTitle}
                    </Text>
                    
                    <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#1A1A1A' }}>
                      ₹{artisanPriceVal} <Text style={{ fontSize: 14, fontWeight: 'normal', color: '#666' }}>/ pc</Text>
                    </Text>

                    <Text style={{ fontSize: 12, color: '#666666', marginTop: 2 }}>
                      {ts.optionBSub}
                    </Text>
                  </View>
                  <Ionicons
                    name={selectedPriceOption === 'ARTISAN' ? 'radio-button-on' : 'radio-button-off'}
                    size={26}
                    color={selectedPriceOption === 'ARTISAN' ? '#E65100' : '#CCCCCC'}
                  />
                </TouchableOpacity>

                {/* Option C: AI Recommended Wholesale Bulk Rate */}
                <TouchableOpacity
                  style={{
                    backgroundColor: selectedPriceOption === 'AI_WHOLESALE' ? '#E8F5E9' : '#FFFFFF',
                    borderColor: selectedPriceOption === 'AI_WHOLESALE' ? '#2E7D32' : '#EFECE6',
                    borderWidth: 2,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    elevation: selectedPriceOption === 'AI_WHOLESALE' ? 3 : 1,
                  }}
                  onPress={() => setSelectedPriceOption('AI_WHOLESALE')}
                  activeOpacity={0.88}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#2E7D32' }}>
                        {ts.optionCTitle}
                      </Text>
                      <View style={{ backgroundColor: '#2E7D32', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginLeft: 8 }}>
                        <Text style={{ fontSize: 10, color: '#FFF', fontWeight: 'bold' }}>{bulkDiscPctStr} OFF</Text>
                      </View>
                    </View>

                    <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#1A1A1A' }}>
                      ₹{bulkPricePerPiece} <Text style={{ fontSize: 14, fontWeight: 'normal', color: '#666' }}>/ pc</Text>
                    </Text>

                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#2E7D32', marginTop: 2 }}>
                      Total Order Value: ₹{bulkOrderTotal.toLocaleString()} ({qtyVal} Pcs)
                    </Text>
                    <Text style={{ fontSize: 11, color: '#388E3C', marginTop: 2 }}>
                      Best rate for bulk wholesale orders (Fair profit for you & buyer)
                    </Text>
                  </View>
                  <Ionicons
                    name={selectedPriceOption === 'AI_WHOLESALE' ? 'radio-button-on' : 'radio-button-off'}
                    size={26}
                    color={selectedPriceOption === 'AI_WHOLESALE' ? '#2E7D32' : '#CCCCCC'}
                  />
                </TouchableOpacity>
              </View>

              {/* Language-Specific AI Guidance Banner */}
              {pricingEstimate ? (
                <View style={{
                  backgroundColor: '#FFF8E7',
                  borderColor: '#FFE082',
                  borderWidth: 1,
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 16,
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#E65100', marginBottom: 2 }}>
                      {ts.guidanceHeader}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#424242', lineHeight: 19, fontWeight: '500' }}>
                      {getLocalizedGuidanceText(
                        globalLang,
                        artisanPriceVal,
                        baseAiPriceVal,
                        pricingEstimate?.pricing?.market_reference_price || baseAiPriceVal,
                        gainVal,
                        gainPct,
                        pricingEstimate?.guidance
                      )}
                    </Text>
                  </View>
                </View>
              ) : null}

              {/* Action Buttons */}
              <TouchableOpacity
                style={styles.saveProductButton}
                onPress={handlePublishCatalog}
                activeOpacity={0.85}
              >
                <Text style={styles.saveProductButtonText}>
                  {ts.publishToCatalog}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => setStage('FORM')}
                activeOpacity={0.7}
              >
                <Text style={styles.editBtnText}>{ts.editDetails}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 10,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  photoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFECE6',
    elevation: 2,
  },
  photoThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF5',
    borderWidth: 1,
    borderColor: '#EAEFE8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  pencilCircleSmall: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EEF5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoTextGroup: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 17,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formCol: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#1A1A1A',
  },
  multilineInputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 14,
    padding: 12,
  },
  multilineInput: {
    height: 80,
    fontSize: 14,
    color: '#1A1A1A',
    textAlignVertical: 'top',
  },
  charCounter: {
    fontSize: 12,
    color: '#888888',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  locationInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  locationTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  saveProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 12,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#3B6029',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  saveProductButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  priceHeaderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7ED',
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D0E2CC',
  },
  priceBannerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  priceBannerSub: {
    fontSize: 12,
    color: '#555555',
    marginTop: 2,
  },
  bulkBadgeCard: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EFECE6',
    elevation: 1,
  },
  previewThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  productMetaCol: {
    flex: 1,
    marginLeft: 12,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  productCat: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  productMat: {
    fontSize: 12,
    color: '#666666',
    marginTop: 1,
  },
  priceOptionCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EFECE6',
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceOptionCardSelected: {
    backgroundColor: '#F4F9F2',
    borderColor: '#3B6029',
    elevation: 3,
  },
  priceOptionCardSelectedArtisan: {
    backgroundColor: '#FFFDF5',
    borderColor: '#E65100',
    elevation: 3,
  },
  guidanceBox: {
    backgroundColor: '#FFF8E7',
    borderColor: '#FFE082',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  editBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B6029',
  },
});
