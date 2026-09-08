import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArtisanFloatingNav } from '@/components/ArtisanFloatingNav';
import { useGlobalLang, setGlobalLang, ALL_LANGUAGES, LangCode } from '@/utils/languageStore';
import { useProducts, getMultilingualProductName, ProductItem } from '@/utils/productStore';

type ActiveTab = 'home' | 'products' | 'customers' | 'profile';

const TRANSLATIONS: Record<LangCode, {
  headerTitle: string;
  totalProductsLabel: string;
  activeStatus: string;
  stockPrefix: string;
  pieceSuffix: string;
  actionView: string;
  actionEdit: string;
  actionMore: string;
  addNewProduct: string;
  navHome: string;
  navProducts: string;
  navCustomers: string;
  navProfile: string;
  modalTitle: string;
  noProductsTitle: string;
  noProductsSub: string;
  pricingSummaryTitle: string;
  unitPriceLabel: string;
  stockQtyLabel: string;
  wholesaleSectionTitle: string;
  bulkDiscountLabel: string;
  totalOrderValLabel: string;
  aiGuidanceHeader: string;
  costBreakdownTitle: string;
  closeModalBtn: string;
  costRawMaterial: string;
  costCraftsmanship: string;
  costFinishing: string;
  costMarketDemand: string;
  perPieceSuffix: string;
}> = {
  hi: {
    headerTitle: 'मेरे उत्पाद',
    totalProductsLabel: 'कुल उत्पाद',
    activeStatus: 'सक्रिय',
    stockPrefix: 'स्टॉक: ',
    pieceSuffix: ' पीस',
    actionView: 'देखें',
    actionEdit: 'संपादित करें',
    actionMore: 'और',
    addNewProduct: 'नया उत्पाद जोड़ें',
    navHome: 'होम',
    navProducts: 'उत्पाद',
    navCustomers: 'ग्राहक',
    navProfile: 'प्रोफ़ाइल',
    modalTitle: 'भाषा चुनें / Select Language',
    noProductsTitle: 'अभी तक कोई उत्पाद नहीं जोड़ा गया है',
    noProductsSub: 'अपना पहला उत्पाद जोड़ने के लिए नीचे दिए गए बटन पर टैप करें और AI द्वारा फोटो व विवरण दर्ज करें।',
    pricingSummaryTitle: 'उत्पाद मूल्य एवं थोक बिक्री विवरण',
    unitPriceLabel: 'प्रति पीस दर (Single Piece Rate)',
    stockQtyLabel: 'कुल उपलब्ध स्टॉक',
    wholesaleSectionTitle: 'थोक बिक्री विवरण (Wholesale Order Guidance)',
    bulkDiscountLabel: 'बल्क छूट:',
    totalOrderValLabel: 'कुल थोक ऑर्डर मूल्य:',
    aiGuidanceHeader: 'KalaSetu AI मार्केट गाइडेंस:',
    costBreakdownTitle: 'AI मूल्य विश्लेषण एवं लागत विवरण',
    closeModalBtn: 'बंद करें',
    costRawMaterial: 'कच्चा माल लागत (30%)',
    costCraftsmanship: 'कारीगरी व श्रम (35%)',
    costFinishing: 'फिनिशिंग व पॉलिश (10%)',
    costMarketDemand: 'मार्केट डिमांड प्रीमियम (25%)',
    perPieceSuffix: '/ पीस',
  },
  en: {
    headerTitle: 'My Products',
    totalProductsLabel: 'Total Products',
    activeStatus: 'Active',
    stockPrefix: 'Stock: ',
    pieceSuffix: ' pcs',
    actionView: 'View',
    actionEdit: 'Edit',
    actionMore: 'More',
    addNewProduct: 'Add New Product',
    navHome: 'Home',
    navProducts: 'Products',
    navCustomers: 'Customers',
    navProfile: 'Profile',
    modalTitle: 'Select Language / भाषा चुनें',
    noProductsTitle: 'No Products Published Yet',
    noProductsSub: 'Tap the button below to capture photo, answer questions, and publish your first product!',
    pricingSummaryTitle: 'Product Pricing & Wholesale Summary',
    unitPriceLabel: 'Single Piece Unit Price',
    stockQtyLabel: 'Total Stock Count',
    wholesaleSectionTitle: 'Wholesale Order Guidance',
    bulkDiscountLabel: 'Bulk Discount:',
    totalOrderValLabel: 'Total Bulk Order Value:',
    aiGuidanceHeader: 'KalaSetu AI Market Guidance:',
    costBreakdownTitle: 'AI Cost Breakdown & Intelligence',
    closeModalBtn: 'Close',
    costRawMaterial: 'Raw Materials (30%)',
    costCraftsmanship: 'Craftsmanship & Labor (35%)',
    costFinishing: 'Finishing & Polish (10%)',
    costMarketDemand: 'Market Demand Premium (25%)',
    perPieceSuffix: '/ pc',
  },
  bn: {
    headerTitle: 'আমার পণ্যসমূহ',
    totalProductsLabel: 'মোট পণ্য',
    activeStatus: 'সক্রিয়',
    stockPrefix: 'স্টক: ',
    pieceSuffix: ' টি',
    actionView: 'দেখুন',
    actionEdit: 'সম্পাদনা',
    actionMore: 'আরও',
    addNewProduct: 'নতুন পণ্য যোগ করুন',
    navHome: 'হোম',
    navProducts: 'পণ্য',
    navCustomers: 'গ্রাহক',
    navProfile: 'প্রোফাইল',
    modalTitle: 'ভাষা নির্বাচন করুন / Select Language',
    noProductsTitle: 'এখনও কোনো পণ্য যুক্ত করা হয়নি',
    noProductsSub: 'আপনার প্রথম পণ্য যুক্ত করতে নিচের বোতামে ট্যাপ করুন।',
    pricingSummaryTitle: 'পণ্যের মূল্য ও পাইকারি বিবরণ',
    unitPriceLabel: 'প্রতি পিসের দাম (Single Piece Rate)',
    stockQtyLabel: 'মোট স্টক পরিমাণ',
    wholesaleSectionTitle: 'পাইকারি অর্ডারের বিবরণ (Wholesale Guidance)',
    bulkDiscountLabel: 'বাল্ক ছাড়:',
    totalOrderValLabel: 'মোট পাইকারি অর্ডারের মূল্য:',
    aiGuidanceHeader: 'KalaSetu AI মার্কেট নির্দেশিকা:',
    costBreakdownTitle: 'AI খরচ বিশ্লেষণ ও মূল্য বিবরণ',
    closeModalBtn: 'বন্ধ করুন',
    costRawMaterial: 'কাঁচামাল খরচ (30%)',
    costCraftsmanship: 'কারুশিল্প ও শ্রম (35%)',
    costFinishing: 'ফিনিশিং ও পলিশ (10%)',
    costMarketDemand: 'মার্কেট প্রিমিয়াম (25%)',
    perPieceSuffix: '/ টি',
  },
  bho: {
    headerTitle: 'हमर सामान',
    totalProductsLabel: 'कुल सामान',
    activeStatus: 'चालू',
    stockPrefix: 'स्टॉक: ',
    pieceSuffix: ' गो',
    actionView: 'देखीं',
    actionEdit: 'बदलीं',
    actionMore: 'और',
    addNewProduct: 'नया सामान जोड़ीं',
    navHome: 'होम',
    navProducts: 'सामान',
    navCustomers: 'ग्राहक',
    navProfile: 'प्रोफाइल',
    modalTitle: 'भाषा चुनीं / Select Language',
    noProductsTitle: 'अभी तक कौनो सामान ना जुड़ल बा',
    noProductsSub: 'अपन पहिला सामान जोड़े खातिर नीचे दिहल बटन पर छुईं।',
    pricingSummaryTitle: 'सामान के दाम आ थोक बिक्री विवरण',
    unitPriceLabel: 'प्रति पीस दर (Single Piece Rate)',
    stockQtyLabel: 'कुल उपलब्ध स्टॉक',
    wholesaleSectionTitle: 'थोक ऑर्डर विवरण (Wholesale Order Guidance)',
    bulkDiscountLabel: 'बल्क छूट:',
    totalOrderValLabel: 'कुल थोक ऑर्डर के दाम:',
    aiGuidanceHeader: 'KalaSetu AI मार्केट गाइडेंस:',
    costBreakdownTitle: 'AI लागत विश्लेषण आ विवरण',
    closeModalBtn: 'बंद करीं',
    costRawMaterial: 'कच्चा माल लागत (30%)',
    costCraftsmanship: 'कारीगरी आ मजूरी (35%)',
    costFinishing: 'फिनिशिंग आ पॉलिश (10%)',
    costMarketDemand: 'मार्केट डिमांड प्रीमियम (25%)',
    perPieceSuffix: '/ पीस',
  },
  mr: {
    headerTitle: 'माझी उत्पादने',
    totalProductsLabel: 'एकूण उत्पादने',
    activeStatus: 'सक्रिय',
    stockPrefix: 'स्टॉक: ',
    pieceSuffix: ' नग',
    actionView: 'पहा',
    actionEdit: 'संपादित करा',
    actionMore: 'आणखी',
    addNewProduct: 'नवीन उत्पादन जोडा',
    navHome: 'होम',
    navProducts: 'उत्पादने',
    navCustomers: 'ग्राहक',
    navProfile: 'प्रोफाइल',
    modalTitle: 'भाषा निवडा / Select Language',
    noProductsTitle: 'अजून कोणतेही उत्पादन जोडलेले नाही',
    noProductsSub: 'तुमचे पहिले उत्पादन जोडण्यासाठी खालील बटणावर टॅप करा.',
    pricingSummaryTitle: 'उत्पादन किंमत आणि घाऊक विक्री तपशील',
    unitPriceLabel: 'प्रति नग दर (Single Piece Rate)',
    stockQtyLabel: 'एकूण उपलब्ध साठा',
    wholesaleSectionTitle: 'घाऊक ऑर्डर मार्गदर्शन (Wholesale Order Guidance)',
    bulkDiscountLabel: 'बल्क सूट:',
    totalOrderValLabel: 'एकूण घाऊक ऑर्डर मूल्य:',
    aiGuidanceHeader: 'KalaSetu AI मार्केट मार्गदर्शन:',
    costBreakdownTitle: 'AI खर्च विश्लेषण आणि तपशील',
    closeModalBtn: 'बंद करा',
    costRawMaterial: 'कच्चा माल खर्च (30%)',
    costCraftsmanship: 'कामत आणि श्रम (35%)',
    costFinishing: 'फिनिशिंग आणि पॉलिश (10%)',
    costMarketDemand: 'मार्केट प्रीमियम (25%)',
    perPieceSuffix: '/ नग',
  },
  gu: {
    headerTitle: 'મારા ઉત્પાદનો',
    totalProductsLabel: 'કુલ ઉત્પાદનો',
    activeStatus: 'સક્રિય',
    stockPrefix: 'સ્ટોક: ',
    pieceSuffix: ' પીસ',
    actionView: 'જુઓ',
    actionEdit: 'સંપાદિત કરો',
    actionMore: 'વધુ',
    addNewProduct: 'નવું ઉત્પાદન ઉમેરો',
    navHome: 'હોમ',
    navProducts: 'ઉત્પાદનો',
    navCustomers: 'ગ્રાહકો',
    navProfile: 'પ્રોફાઇલ',
    modalTitle: 'ભાષા પસંદ કરો / Select Language',
    noProductsTitle: 'હજુ સુધી કોઈ ઉત્પાદન ઉમેરાયેલ નથી',
    noProductsSub: 'તમારું પ્રથમ ઉત્પાદન ઉમેરવા માટે નીચેના બટન પર ટૅપ કરો.',
    pricingSummaryTitle: 'ઉત્પાદન કિંમત અને જથ્થાબંધ માહિતી',
    unitPriceLabel: 'પ્રતિ પીસ દર (Single Piece Rate)',
    stockQtyLabel: 'કુલ ઉપલબ્ધ સ્ટોક',
    wholesaleSectionTitle: 'જથ્થાબંધ ઓર્ડર માર્ગદર્શન (Wholesale Guidance)',
    bulkDiscountLabel: 'બલ્ક ડિસ્કાઉન્ટ:',
    totalOrderValLabel: 'કુલ જથ્થાબંધ ઓર્ડર મૂલ્ય:',
    aiGuidanceHeader: 'KalaSetu AI માર્કેટ માર્ગદર્શન:',
    costBreakdownTitle: 'AI ખર્ચ વિશ્લેષણ અને વિગતો',
    closeModalBtn: 'બંધ કરો',
    costRawMaterial: 'કાચો માલ ખર્ચ (30%)',
    costCraftsmanship: 'કારીગરી અને શ્રમ (35%)',
    costFinishing: 'ફિનિશિંગ અને પોલિશ (10%)',
    costMarketDemand: 'માર્કેટ પ્રીમિયમ (25%)',
    perPieceSuffix: '/ પીસ',
  },
  raj: {
    headerTitle: 'म्हारा सामान',
    totalProductsLabel: 'सगळा सामान',
    activeStatus: 'चालू',
    stockPrefix: 'स्टॉक: ',
    pieceSuffix: ' नग',
    actionView: 'देखो',
    actionEdit: 'बदलो',
    actionMore: 'और',
    addNewProduct: 'नयो सामान जोड़ो',
    navHome: 'होम',
    navProducts: 'सामान',
    navCustomers: 'ग्राहक',
    navProfile: 'प्रोफाइल',
    modalTitle: 'भाषा चूणो / Select Language',
    noProductsTitle: 'अजूं तांई कोई सामान नी जुड़्यो है',
    noProductsSub: 'आपरो पेलो सामान जोड़बा सारू नीचे दबायोड़ा बटन पर दबाओ।',
    pricingSummaryTitle: 'सामान रो भाव अर थोक बिक्री ब्योरो',
    unitPriceLabel: 'प्रति पीस भाव (Single Piece Rate)',
    stockQtyLabel: 'सगळो उपलब्ध स्टॉक',
    wholesaleSectionTitle: 'थोक ऑर्डर ब्योरो (Wholesale Order Guidance)',
    bulkDiscountLabel: 'बल्क छूट:',
    totalOrderValLabel: 'सगळो थोक ऑर्डर भाव:',
    aiGuidanceHeader: 'KalaSetu AI मार्केट गाइडेंस:',
    costBreakdownTitle: 'AI लागत ब्योरो अर विश्लेषण',
    closeModalBtn: 'बंद करो',
    costRawMaterial: 'कच्चो माल लागत (30%)',
    costCraftsmanship: 'कारीगरी अर मजूरी (35%)',
    costFinishing: 'फिनिशिंग अर पॉलिश (10%)',
    costMarketDemand: 'मार्केट डिमांड प्रीमियम (25%)',
    perPieceSuffix: '/ पीस',
  },
  kn: {
    headerTitle: 'ನನ್ನ ಉತ್ಪನ್ನಗಳು',
    totalProductsLabel: 'ಒಟ್ಟು ಉತ್ಪನ್ನಗಳು',
    activeStatus: 'ಸಕ್ರಿಯ',
    stockPrefix: 'ಸ್ಟಾಕ್: ',
    pieceSuffix: ' ತುಂಡುಗಳು',
    actionView: 'ವೀಕ್ಷಿಸಿ',
    actionEdit: 'ಸಂಪಾದಿಸಿ',
    actionMore: 'ಇನ್ನಷ್ಟು',
    addNewProduct: 'ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಿ',
    navHome: 'ಹೋಮ್',
    navProducts: 'ಉತ್ಪನ್ನಗಳು',
    navCustomers: 'ಗ್ರಾಹಕರು',
    navProfile: 'ಪ್ರೊಫೈಲ್',
    modalTitle: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / Select Language',
    noProductsTitle: 'ಇನ್ನೂ ಯಾವುದೇ ಉತ್ಪನ್ನಗಳನ್ನು ಪಟ್ಟಿ ಮಾಡಲಾಗಿಲ್ಲ',
    noProductsSub: 'ನಿಮ್ಮ ಮೊದಲ ಉತ್ಪನ್ನವನ್ನು ಸೇರಿಸಲು ಕೆಳಗಿನ ಬಟನ್ ಟ್ಯಾಪ್ ಮಾಡಿ!',
    pricingSummaryTitle: 'ಉತ್ಪನ್ನ ಬೆಲೆ ಮತ್ತು ಸಗಟು ವಿವರಣೆ',
    unitPriceLabel: 'ಪ್ರತಿ ತುಂಡಿನ ದರ (Single Piece Rate)',
    stockQtyLabel: 'ಒಟ್ಟು ಲಭ್ಯವಿರುವ ಸ್ಟಾಕ್',
    wholesaleSectionTitle: 'ಸಗಟು ಆರ್ಡರ್ ಮಾರ್ಗದರ್ಶನ (Wholesale Guidance)',
    bulkDiscountLabel: 'ಬಲ್ಕ್ ರಿಯಾಯಿತಿ:',
    totalOrderValLabel: 'ಒಟ್ಟು ಸಗಟು ಆರ್ಡರ್ ಮೌಲ್ಯ:',
    aiGuidanceHeader: 'KalaSetu AI ಮಾರುಕಟ್ಟೆ ಮಾರ್ಗದರ್ಶನ:',
    costBreakdownTitle: 'AI ವೆಚ್ಚ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ವಿವರಣೆ',
    closeModalBtn: 'ಮುಚ್ಚಿ',
    costRawMaterial: 'ಕಚ್ಚಾ ವಸ್ತುಗಳ ವೆಚ್ಚ (30%)',
    costCraftsmanship: 'ಕರಕುಶಲತೆ ಮತ್ತು ಶ್ರಮ (35%)',
    costFinishing: 'ಫಿನಿಶಿಂಗ್ ಮತ್ತು ಪಾಲಿಶ್ (10%)',
    costMarketDemand: 'ಮಾರುಕಟ್ಟೆ ಪ್ರೀಮಿಯಂ (25%)',
    perPieceSuffix: '/ ತುಂಡು',
  },
};

export default function ProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const [globalLang] = useGlobalLang();
  const initialLang: LangCode = (params.lang as LangCode) || globalLang || 'hi';

  const [selectedLang, setSelectedLang] = useState<LangCode>(initialLang);
  const productsList = useProducts();

  React.useEffect(() => {
    if (globalLang) {
      setSelectedLang(globalLang);
    }
  }, [globalLang]);

  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [selectedProductSummary, setSelectedProductSummary] = useState<ProductItem | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.hi;
  const currentLangObj = ALL_LANGUAGES.find((l) => l.code === selectedLang) || ALL_LANGUAGES[1];
  const currentLangLabel = `${currentLangObj.nativeName} (${currentLangObj.englishName})`;
  const totalLabel = `${t.totalProductsLabel}: ${productsList.length}`;

  const openSummaryModal = (item: ProductItem) => {
    setSelectedProductSummary(item);
    setIsSummaryModalOpen(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>{t.headerTitle}</Text>
            <TouchableOpacity
              style={styles.langSelector}
              onPress={() => setIsLangModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.langText}>{currentLangLabel}</Text>
              <Ionicons name="chevron-down" size={14} color="#2C2C2C" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push({ pathname: '/notifications', params: { lang: selectedLang } })}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={26} color="#1A1A1A" />
            <View style={styles.redBadgeDot} />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content Body */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Total Count Header */}
          <Text style={styles.totalCountHeader}>{totalLabel}</Text>

          {productsList.length > 0 ? (
            /* Product Items List */
            <View style={styles.productListGroup}>
              {productsList.map((item) => {
                const displayName = getMultilingualProductName(
                  item.title,
                  selectedLang,
                  item.translations_json,
                  item.names,
                  item.title_en
                );
                let displayCategory = item.category;
                let displayMaterial = item.materialUsed;

                if (selectedLang === 'en') {
                  if (item.category_en) displayCategory = item.category_en;
                  if (item.materialUsed_en) displayMaterial = item.materialUsed_en;
                }

                const imageSource =
                  typeof item.image === 'string'
                    ? { uri: item.image }
                    : item.image && typeof item.image === 'object' && item.image.uri
                    ? { uri: item.image.uri }
                    : item.image || require('@/assets/images/product_pot.png');

                const displayPriceText = item.price.includes('/')
                  ? item.price
                  : `${item.price} ${t.perPieceSuffix}`;

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.productCard}
                    activeOpacity={0.85}
                    onPress={() => openSummaryModal(item)}
                  >
                    <View style={styles.productMainRow}>
                      <Image source={imageSource} style={styles.productImage} resizeMode="cover" />

                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={styles.productNameText}>{displayName}</Text>
                          <View style={styles.activeStatusBadge}>
                            <Text style={styles.activeStatusText}>{t.activeStatus}</Text>
                          </View>
                        </View>

                        {(displayCategory || displayMaterial) && (
                          <Text style={{ fontSize: 11, color: '#666666', marginTop: 2 }} numberOfLines={1}>
                            {displayCategory ? `${displayCategory}` : ''} {displayMaterial ? `• ${displayMaterial}` : ''}
                          </Text>
                        )}

                        <Text style={styles.productPriceText}>{displayPriceText}</Text>
                        <Text style={styles.productStockText}>{t.stockPrefix}{item.stockQty}{t.pieceSuffix}</Text>
                      </View>
                    </View>

                    <View style={styles.cardDividerLine} />

                    <View style={styles.cardActionBar}>
                      <TouchableOpacity
                        style={styles.cardActionItem}
                        activeOpacity={0.7}
                        onPress={() => openSummaryModal(item)}
                      >
                        <Ionicons name="eye-outline" size={16} color="#3B6029" />
                        <Text style={styles.cardActionText}>{t.actionView}</Text>
                      </TouchableOpacity>

                      <View style={styles.actionDividerLine} />

                      <TouchableOpacity style={styles.cardActionItem} activeOpacity={0.7}>
                        <Ionicons name="pencil-outline" size={15} color="#3B6029" />
                        <Text style={styles.cardActionText}>{t.actionEdit}</Text>
                      </TouchableOpacity>

                      <View style={styles.actionDividerLine} />

                      <TouchableOpacity style={styles.cardActionItem} activeOpacity={0.7}>
                        <Ionicons name="ellipsis-horizontal" size={16} color="#3B6029" />
                        <Text style={styles.cardActionText}>{t.actionMore}</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            /* Empty State Container */
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="cube-outline" size={42} color="#3B6029" />
              </View>
              <Text style={styles.emptyTitle}>{t.noProductsTitle}</Text>
              <Text style={styles.emptySub}>{t.noProductsSub}</Text>
            </View>
          )}

          {/* Primary Outlined Add Product Button */}
          <TouchableOpacity
            style={styles.outlinedAddProductBtn}
            onPress={() => router.push({ pathname: '/add-product', params: { lang: selectedLang } })}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.outlinedAddProductBtnText}>{t.addNewProduct}</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Floating Bottom Navigation Bar (4 Tabs) */}
        <ArtisanFloatingNav activeTab="products" selectedLang={selectedLang} />

        {/* Language Selection Modal */}
        <Modal
          visible={isLangModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsLangModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsLangModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t.modalTitle}</Text>
              <FlatList
                data={ALL_LANGUAGES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.langOptionItem,
                      selectedLang === item.code ? styles.langOptionSelected : null,
                    ]}
                    onPress={() => {
                      setSelectedLang(item.code);
                      setGlobalLang(item.code);
                      setIsLangModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.langOptionText,
                        selectedLang === item.code ? styles.langOptionTextSelected : null,
                      ]}
                    >
                      {item.nativeName} ({item.englishName})
                    </Text>
                    {selectedLang === item.code && (
                      <Ionicons name="checkmark" size={20} color="#3B6029" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Product Pricing & Wholesale Summary Modal */}
        {selectedProductSummary && (
          <Modal
            visible={isSummaryModalOpen}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsSummaryModalOpen(false)}
          >
            <View style={styles.summaryModalOverlay}>
              <View style={styles.summaryModalCard}>
                {/* Modal Header */}
                <View style={styles.summaryModalHeader}>
                  <Text style={styles.summaryModalTitle}>{t.pricingSummaryTitle}</Text>
                  <TouchableOpacity
                    onPress={() => setIsSummaryModalOpen(false)}
                    style={styles.closeIconButton}
                  >
                    <Ionicons name="close" size={22} color="#1A1A1A" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 0 }}>
                  {/* Product Header Row */}
                  <View style={styles.modalProductHeaderRow}>
                    <Image
                      source={
                        typeof selectedProductSummary.image === 'string'
                          ? { uri: selectedProductSummary.image }
                          : selectedProductSummary.image && selectedProductSummary.image.uri
                          ? { uri: selectedProductSummary.image.uri }
                          : selectedProductSummary.image || require('@/assets/images/product_pot.png')
                      }
                      style={styles.modalProductImage}
                      resizeMode="cover"
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalProductName}>
                        {getMultilingualProductName(
                          selectedProductSummary.title,
                          selectedLang,
                          selectedProductSummary.translations_json,
                          selectedProductSummary.names,
                          selectedProductSummary.title_en
                        )}
                      </Text>
                      {selectedProductSummary.category && (
                        <Text style={styles.modalProductMeta}>
                          {selectedProductSummary.category} {selectedProductSummary.materialUsed ? `• ${selectedProductSummary.materialUsed}` : ''}
                        </Text>
                      )}
                      <View style={[styles.activeStatusBadge, { alignSelf: 'flex-start', marginTop: 4 }]}>
                        <Text style={styles.activeStatusText}>{t.activeStatus}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Primary Pricing Grid */}
                  <View style={styles.pricingMetricsGrid}>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricBoxLabel}>{t.unitPriceLabel}</Text>
                      <Text style={styles.metricBoxValue}>
                        {selectedProductSummary.price.includes('/')
                          ? selectedProductSummary.price
                          : `${selectedProductSummary.price} ${t.perPieceSuffix}`}
                      </Text>
                    </View>

                    <View style={styles.metricBox}>
                      <Text style={styles.metricBoxLabel}>{t.stockQtyLabel}</Text>
                      <Text style={styles.metricBoxValue}>
                        {selectedProductSummary.stockQty} {t.pieceSuffix}
                      </Text>
                    </View>
                  </View>

                  {/* Wholesale Bulk Order Guidance Card */}
                  {(selectedProductSummary.isBulkOrder || selectedProductSummary.stockQty >= 5) && (
                    <View style={styles.bulkGuidanceBox}>
                      <Text style={styles.bulkGuidanceTitle}>{t.wholesaleSectionTitle}</Text>
                      <View style={styles.bulkDetailRow}>
                        <Text style={styles.bulkDetailLabel}>{t.bulkDiscountLabel}</Text>
                        <Text style={styles.bulkDetailValue}>
                          {selectedProductSummary.bulkDiscountPct || (selectedProductSummary.stockQty >= 50 ? '20.0%' : (selectedProductSummary.stockQty >= 20 ? '15.0%' : '10.0%'))}
                        </Text>
                      </View>
                      <View style={styles.bulkDetailRow}>
                        <Text style={styles.bulkDetailLabel}>बल्क मात्रा:</Text>
                        <Text style={styles.bulkDetailValue}>{selectedProductSummary.stockQty} {t.pieceSuffix}</Text>
                      </View>
                      <View style={styles.bulkDetailRow}>
                        <Text style={styles.bulkDetailLabel}>{t.totalOrderValLabel}</Text>
                        <Text style={styles.bulkDetailValueHighlight}>
                          ₹{selectedProductSummary.bulkOrderTotal || (parseFloat(selectedProductSummary.price.replace(/[^0-9.]/g, '')) * selectedProductSummary.stockQty)}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* AI Market Guidance */}
                  {Boolean(selectedProductSummary.guidanceText) && (
                    <View style={styles.aiAdviceBox}>
                      <Text style={styles.aiAdviceTitle}>{t.aiGuidanceHeader}</Text>
                      <Text style={styles.aiAdviceText}>{selectedProductSummary.guidanceText}</Text>
                    </View>
                  )}

                  {/* AI Cost Breakdown */}
                  <View style={styles.costBreakdownSection}>
                    <Text style={styles.costBreakdownHeader}>{t.costBreakdownTitle}</Text>
                    <View style={styles.costBarRow}>
                      <Text style={styles.costBarLabel}>{t.costRawMaterial}</Text>
                      <Text style={styles.costBarValue}>
                        ₹{Math.round((parseFloat(selectedProductSummary.price.replace(/[^0-9.]/g, '')) || 450) * 0.30)}
                      </Text>
                    </View>
                    <View style={styles.costBarRow}>
                      <Text style={styles.costBarLabel}>{t.costCraftsmanship}</Text>
                      <Text style={styles.costBarValue}>
                        ₹{Math.round((parseFloat(selectedProductSummary.price.replace(/[^0-9.]/g, '')) || 450) * 0.35)}
                      </Text>
                    </View>
                    <View style={styles.costBarRow}>
                      <Text style={styles.costBarLabel}>{t.costFinishing}</Text>
                      <Text style={styles.costBarValue}>
                        ₹{Math.round((parseFloat(selectedProductSummary.price.replace(/[^0-9.]/g, '')) || 450) * 0.10)}
                      </Text>
                    </View>
                    <View style={styles.costBarRow}>
                      <Text style={styles.costBarLabel}>{t.costMarketDemand}</Text>
                      <Text style={styles.costBarValue}>
                        ₹{Math.round((parseFloat(selectedProductSummary.price.replace(/[^0-9.]/g, '')) || 450) * 0.25)}
                      </Text>
                    </View>
                  </View>
                </ScrollView>

                {/* Close Button */}
                <TouchableOpacity
                  style={styles.closeSummaryBtn}
                  onPress={() => setIsSummaryModalOpen(false)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.closeSummaryBtnText}>{t.closeModalBtn}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
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

  /* Top Header Row */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 8,
    paddingBottom: 16,
  },
  headerLeft: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 2,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEA',
    elevation: 1,
  },
  redBadgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },

  /* Scrollable Body */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 14,
  },

  totalCountHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 2,
  },

  /* Product List Cards Group */
  productListGroup: {
    gap: 12,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  productMainRow: {
    flexDirection: 'row',
    gap: 14,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  productNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  activeStatusBadge: {
    backgroundColor: '#F0F7ED',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  activeStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  productPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B6029',
    marginTop: 6,
  },
  productStockText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },

  cardDividerLine: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginTop: 12,
    marginBottom: 4,
  },

  /* Bottom Action Bar */
  cardActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  cardActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
    flex: 1,
  },
  cardActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B6029',
  },
  actionDividerLine: {
    width: 1,
    height: 18,
    backgroundColor: '#E0E0E0',
  },

  /* Empty State Card */
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 28,
    alignItems: 'center',
    marginVertical: 10,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBF6EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },

  /* Outlined Add Product Button */
  outlinedAddProductBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 6,
  },
  outlinedAddProductBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 320,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  langOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#FAF8F5',
  },
  langOptionSelected: {
    backgroundColor: '#F0F7ED',
    borderWidth: 1,
    borderColor: '#3B6029',
  },
  langOptionText: {
    fontSize: 16,
    color: '#333333',
  },
  langOptionTextSelected: {
    fontWeight: 'bold',
    color: '#3B6029',
  },

  /* Summary Modal Styles */
  summaryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  summaryModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxHeight: '85%',
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  summaryModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 14,
  },
  summaryModalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
  },
  closeIconButton: {
    padding: 4,
  },
  modalProductHeaderRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  modalProductImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  modalProductName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  modalProductMeta: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },

  pricingMetricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#F5F8F3',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2EFE0',
  },
  metricBoxLabel: {
    fontSize: 11,
    color: '#555555',
    fontWeight: '600',
  },
  metricBoxValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#3B6029',
    marginTop: 4,
  },

  bulkGuidanceBox: {
    backgroundColor: '#F0F7ED',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#C2E0B6',
    marginBottom: 14,
    gap: 6,
  },
  bulkGuidanceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D4E1F',
    marginBottom: 4,
  },
  bulkDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bulkDetailLabel: {
    fontSize: 12,
    color: '#4A6B3B',
  },
  bulkDetailValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2D4E1F',
  },
  bulkDetailValueHighlight: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3B6029',
  },

  aiAdviceBox: {
    backgroundColor: '#FFF8EC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    marginBottom: 14,
  },
  aiAdviceTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#D97706',
    marginBottom: 4,
  },
  aiAdviceText: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
  },

  costBreakdownSection: {
    backgroundColor: '#FAF8F5',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    marginBottom: 16,
    gap: 8,
  },
  costBreakdownHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  costBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costBarLabel: {
    fontSize: 12,
    color: '#555555',
  },
  costBarValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B6029',
  },

  closeSummaryBtn: {
    backgroundColor: '#3B6029',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  closeSummaryBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
