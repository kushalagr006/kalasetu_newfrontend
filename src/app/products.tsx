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
import { useProducts, getMultilingualProductName } from '@/utils/productStore';

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

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.hi;
  const currentLangObj = ALL_LANGUAGES.find((l) => l.code === selectedLang) || ALL_LANGUAGES[1];
  const currentLangLabel = `${currentLangObj.nativeName} (${currentLangObj.englishName})`;
  const totalLabel = `${t.totalProductsLabel}: ${productsList.length}`;

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

                return (
                  <View key={item.id} style={styles.productCard}>
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
                            {displayCategory ? `📁 ${displayCategory}` : ''} {displayMaterial ? `• 🧱 ${displayMaterial}` : ''}
                          </Text>
                        )}

                        <Text style={styles.productPriceText}>{item.price}</Text>
                        <Text style={styles.productStockText}>{t.stockPrefix}{item.stockQty}{t.pieceSuffix}</Text>
                      </View>
                    </View>

                    <View style={styles.cardDividerLine} />

                    <View style={styles.cardActionBar}>
                      <TouchableOpacity style={styles.cardActionItem} activeOpacity={0.7}>
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
                  </View>
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
});
