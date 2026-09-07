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

type LangCode = 'hi' | 'en';
type ActiveTab = 'home' | 'products' | 'customers' | 'profile';

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'English' },
];

const TRANSLATIONS: Record<LangCode, {
  headerTitle: string;
  totalProducts: string;
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
}> = {
  hi: {
    headerTitle: 'मेरे उत्पाद',
    totalProducts: 'कुल उत्पाद: 18',
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
  },
  en: {
    headerTitle: 'My Products',
    totalProducts: 'Total Products: 18',
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
  },
};

interface ProductItem {
  id: string;
  nameHi: string;
  nameEn: string;
  price: string;
  stockQty: number;
  image: any;
}

const PRODUCTS_LIST: ProductItem[] = [
  {
    id: '1',
    nameHi: 'बांस की टोकरी',
    nameEn: 'Bamboo Basket',
    price: '₹350',
    stockQty: 45,
    image: require('@/assets/images/product_basket.png'),
  },
  {
    id: '2',
    nameHi: 'बांस का डिब्बा',
    nameEn: 'Bamboo Box Container',
    price: '₹450',
    stockQty: 30,
    image: require('@/assets/images/product_pot.png'),
  },
  {
    id: '3',
    nameHi: 'दीवार सजावट',
    nameEn: 'Wall Hanging Decor',
    price: '₹250',
    stockQty: 60,
    image: require('@/assets/images/product_macrame.png'),
  },
  {
    id: '4',
    nameHi: 'मिट्टी का घड़ा',
    nameEn: 'Terracotta Clay Pot',
    price: '₹450',
    stockQty: 15,
    image: require('@/assets/images/product_pot.png'),
  },
  {
    id: '5',
    nameHi: 'हैंडमेड कपड़ा बैग',
    nameEn: 'Handmade Fabric Bag',
    price: '₹550',
    stockQty: 25,
    image: require('@/assets/images/product_bag.png'),
  },
];

export default function ProductsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const initialLang: LangCode = (params.lang as LangCode) || 'hi';

  const [selectedLang, setSelectedLang] = useState<LangCode>(initialLang);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('products');

  const t = TRANSLATIONS[selectedLang];
  const currentLangLabel = LANGUAGES.find((l) => l.code === selectedLang)?.label || 'हिंदी';

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
          <Text style={styles.totalCountHeader}>{t.totalProducts}</Text>

          {/* Product Items List */}
          <View style={styles.productListGroup}>
            {PRODUCTS_LIST.map((item) => (
              <View key={item.id} style={styles.productCard}>
                <View style={styles.productMainRow}>
                  <Image source={item.image} style={styles.productImage} resizeMode="cover" />

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={styles.productNameText}>{selectedLang === 'hi' ? item.nameHi : item.nameEn}</Text>
                      <View style={styles.activeStatusBadge}>
                        <Text style={styles.activeStatusText}>{t.activeStatus}</Text>
                      </View>
                    </View>

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
            ))}
          </View>

          {/* Primary Outlined Add Product Button */}
          <TouchableOpacity
            style={styles.outlinedAddProductBtn}
            onPress={() => router.push({ pathname: '/add-product', params: { lang: selectedLang } })}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={20} color="#3B6029" style={{ marginRight: 6 }} />
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
                data={LANGUAGES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.langOptionItem,
                      selectedLang === item.code ? styles.langOptionSelected : null,
                    ]}
                    onPress={() => {
                      setSelectedLang(item.code);
                      setIsLangModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.langOptionText,
                        selectedLang === item.code ? styles.langOptionTextSelected : null,
                      ]}
                    >
                      {item.label}
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

  /* Outlined Add Product Button */
  outlinedAddProductBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#3B6029',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 6,
  },
  outlinedAddProductBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3B6029',
  },

  /* Floating Bottom Navigation Bar */
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 64,
    marginHorizontal: 16,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#F0EFEA',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  navTabText: {
    fontSize: 11,
    color: '#666666',
    marginTop: 3,
    fontWeight: '500',
  },
  navTabTextActiveProduct: {
    color: '#E65100',
    fontWeight: 'bold',
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
