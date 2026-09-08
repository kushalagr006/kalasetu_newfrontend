import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StatusBar,
  useWindowDimensions,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalLang } from '@/utils/languageStore';
import { GovtSidebar, GovtTopHeader } from '@/components/GovtLayout';
import { useProducts, syncBackendProducts, getMultilingualProductName, ProductItem } from '@/utils/productStore';

const TRANSLATIONS_GOVT_PRODUCTS = {
  hi: {
    dashboard: 'Dashboard',
    buyProducts: 'Buy Products',
    tenders: 'Tenders',
    myOrders: 'My Orders',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    deptName: 'Dept. of Industry & Commerce',
    deptState: 'Govt. of Chhattisgarh',
    officerTitle: 'Officer',
    officerRole: 'Department Officer',
    breadcrumb: 'Home > Buy Products',
    pageTitle: 'Buy Products',
    pageSubtitle: 'Purchase authentic Indian handicrafts directly from verified mobile app artisans and producer groups.',
    searchPlaceholder: 'Search products, artisans or keywords...',
    allCategories: 'All Categories',
    inStock: 'In Stock',
    viewDetails: 'View Details',
    artisanBadge: '✨ Artisan Mobile Product',
    noProductsTitle: 'कोई उत्पाद उपलब्ध नहीं है / No Products Listed Yet',
    noProductsSub: 'कारीगरों द्वारा मोबाइल ऐप पर दर्ज किए गए उत्पाद यहाँ सरकारी खरीद पोर्टल पर लाइव प्रदर्शित होंगे। (Products published by artisans on the mobile app will automatically appear here for government procurement.)',
    showingFooter: (start: number, end: number, total: number) => `Showing ${start} - ${end} of ${total} products`,
  },
  en: {
    dashboard: 'Dashboard',
    buyProducts: 'Buy Products',
    tenders: 'Tenders',
    myOrders: 'My Orders',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    deptName: 'Dept. of Industry & Commerce',
    deptState: 'Govt. of Chhattisgarh',
    officerTitle: 'Officer',
    officerRole: 'Department Officer',
    breadcrumb: 'Home > Buy Products',
    pageTitle: 'Buy Products',
    pageSubtitle: 'Purchase authentic Indian handicrafts directly from verified mobile app artisans and producer groups.',
    searchPlaceholder: 'Search products, artisans or keywords...',
    allCategories: 'All Categories',
    inStock: 'In Stock',
    viewDetails: 'View Details',
    artisanBadge: '✨ Artisan Mobile Product',
    noProductsTitle: 'No Products Listed Yet',
    noProductsSub: 'Products published by artisans via the KalaSetu mobile app will appear here live for government procurement.',
    showingFooter: (start: number, end: number, total: number) => `Showing ${start} - ${end} of ${total} products`,
  },
};

const PRODUCTS_DATA: any[] = [];

export default function WebGovtBuyProductsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang] = useGlobalLang();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductModal, setSelectedProductModal] = useState<any | null>(null);

  // Government Portal is strictly 100% English based
  const t = TRANSLATIONS_GOVT_PRODUCTS.en;

  // Live products published by artisans on mobile app
  const artisanMobileProducts = useProducts();

  // Active real-time live link to backend database
  useEffect(() => {
    syncBackendProducts();
    const interval = setInterval(() => {
      syncBackendProducts();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const artisanFormatted = artisanMobileProducts.map((p) => {
    const numericPrice = p.price.replace(/[^0-9.]/g, '') || '550';
    const img = typeof p.image === 'string'
      ? { uri: p.image }
      : (p.image && typeof p.image === 'object' && p.image.uri)
      ? { uri: p.image.uri }
      : p.image || require('@/assets/images/product_pot.png');

    // Always display Bhashini NMT English translation on the Government Website
    const englishTitle = p.title_en || p.title || 'Artisan Craft Product';
    const englishCategory = p.category_en || p.category || 'Handicrafts';
    const englishMaterial = p.materialUsed_en || p.materialUsed || 'Eco Natural Materials';
    const englishDescription = p.description_en || p.description || 'Handmade artisan product listed via KalaSetu Voice Wizard.';

    return {
      id: p.id,
      title: englishTitle,
      titleEn: englishTitle,
      category: englishCategory,
      materialUsed: englishMaterial,
      description: englishDescription,
      price: numericPrice,
      unit: '/ piece',
      stock: p.stockQty || 20,
      image: img,
      isArtisanLive: true,
      rawProduct: p,
    };
  });

  // Only show products published by artisans on mobile app
  const combinedProducts = [...artisanFormatted, ...PRODUCTS_DATA];

  const filteredProducts = combinedProducts.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <View style={styles.container}>
        <View style={styles.mainLayoutRow}>
          {/* 1. Shared Left Sidebar Component */}
          {isDesktop && <GovtSidebar activeKey="buyProducts" />}

          {/* 2. Main Right Content Area */}
          <View style={styles.contentCol}>
            {/* Shared Top Header */}
            <GovtTopHeader />

            {/* Main Scroll Body */}
            <ScrollView
              style={styles.mainScrollView}
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Header Title Section */}
              <View style={styles.headerTitleRow}>
                <Text style={styles.breadcrumbText}>{t.breadcrumb}</Text>
                <Text style={styles.pageTitleText}>{t.pageTitle}</Text>
                <Text style={styles.pageSubtitleText}>{t.pageSubtitle}</Text>
              </View>

              {/* Search & Filter Bar */}
              <View style={styles.filterBarRow}>
                {/* Search Box */}
                <View style={styles.searchBoxCol}>
                  <Ionicons name="search" size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder={t.searchPlaceholder}
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                {/* Category Filter Dropdown */}
                <TouchableOpacity style={styles.categoryDropdownBtn}>
                  <Text style={styles.categoryDropdownText}>{t.allCategories}</Text>
                  <Ionicons name="chevron-down" size={14} color="#6B7280" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>

              {/* 4-Column Product Grid or Clean Empty State */}
              {filteredProducts.length > 0 ? (
                <View style={styles.productGrid}>
                  {filteredProducts.map((product) => (
                    <View style={styles.productCard} key={product.id}>
                      <View style={styles.cardImageContainer}>
                        {product.isArtisanLive && (
                          <View style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            zIndex: 10,
                            backgroundColor: '#3B6029',
                            paddingVertical: 3,
                            paddingHorizontal: 8,
                            borderRadius: 8,
                          }}>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#FFFFFF' }}>
                              {t.artisanBadge}
                            </Text>
                          </View>
                        )}
                        <Image source={product.image} style={styles.productImage} resizeMode="contain" />
                      </View>

                      <View style={styles.cardContent}>
                        <Text style={styles.productTitleText} numberOfLines={1}>{product.title}</Text>
                        <Text style={styles.categorySubtext}>{product.category}</Text>

                        <View style={styles.priceStockRow}>
                          <Text style={styles.priceText}>
                            ₹{product.price} <Text style={styles.unitText}>{product.unit}</Text>
                          </Text>
                          <View style={styles.stockBadge}>
                            <Text style={styles.stockBadgeText}>
                              {t.inStock} ({product.stock})
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          style={styles.viewDetailsBtn}
                          onPress={() => setSelectedProductModal(product)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.viewDetailsBtnText}>{t.viewDetails}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  padding: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: 20,
                }}>
                  <View style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor: '#EBF6EE',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}>
                    <Ionicons name="cube-outline" size={36} color="#3B6029" />
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 6 }}>
                    {t.noProductsTitle}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', maxWidth: 460, lineHeight: 20 }}>
                    {t.noProductsSub}
                  </Text>
                </View>
              )}

              {/* Footer Pagination Bar */}
              <View style={styles.tableFooterRow}>
                <Text style={styles.footerShowingText}>
                  {t.showingFooter(
                    filteredProducts.length > 0 ? 1 : 0,
                    filteredProducts.length,
                    filteredProducts.length
                  )}
                </Text>

                <View style={styles.paginationRow}>
                  <TouchableOpacity style={[styles.pageNavBtn, styles.pageNavBtnDisabled]} disabled>
                    <Ionicons name="chevron-back" size={16} color="#9CA3AF" />
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.pageNavBtn, styles.pageNavBtnActive]}>
                    <Text style={styles.pageNavBtnTextActive}>1</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.pageNavBtn}>
                    <Ionicons name="chevron-forward" size={16} color="#4B5563" />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>

      {/* Product Detail & Bulk Purchase Modal */}
      {selectedProductModal && (
        <Modal
          visible={!!selectedProductModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedProductModal(null)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}
            activeOpacity={1}
            onPress={() => setSelectedProductModal(null)}
          >
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                width: '100%',
                maxWidth: 480,
                padding: 24,
                elevation: 5,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827', flex: 1 }}>
                  {selectedProductModal.title}
                </Text>
                <TouchableOpacity onPress={() => setSelectedProductModal(null)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={{ height: 180, backgroundColor: '#F9FAFB', borderRadius: 12, marginBottom: 14, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={selectedProductModal.image} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="contain" />
              </View>

              {selectedProductModal.isArtisanLive && (
                <View style={{ backgroundColor: '#EBF6EE', padding: 8, borderRadius: 8, marginBottom: 10 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#3B6029' }}>
                    ✨ Direct Artisan Mobile Listing (Bhashini AI Verified)
                  </Text>
                </View>
              )}

              <Text style={{ fontSize: 13, color: '#4B5563', marginBottom: 4 }}>
                <Text style={{ fontWeight: 'bold' }}>Category:</Text> {selectedProductModal.category}
              </Text>
              {selectedProductModal.materialUsed && (
                <Text style={{ fontSize: 13, color: '#4B5563', marginBottom: 4 }}>
                  <Text style={{ fontWeight: 'bold' }}>Material:</Text> {selectedProductModal.materialUsed}
                </Text>
              )}
              <Text style={{ fontSize: 13, color: '#4B5563', marginBottom: 12 }}>
                <Text style={{ fontWeight: 'bold' }}>Price:</Text> ₹{selectedProductModal.price} / piece ({t.inStock}: {selectedProductModal.stock} pcs)
              </Text>

              {selectedProductModal.description && (
                <View style={{ backgroundColor: '#FAF8F5', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                  <Text style={{ fontSize: 12, color: '#333333', lineHeight: 18 }}>
                    "{selectedProductModal.description}"
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={{
                  backgroundColor: '#3B6029',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
                onPress={() => {
                  Alert.alert('Order Inquiry Sent', `Direct purchase request for "${selectedProductModal.title}" sent to Artisan via KalaSetu Procurement Portal!`);
                  setSelectedProductModal(null);
                }}
              >
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' }}>
                  🛒 Place Govt Procurement Order / Inquiry
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainLayoutRow: {
    flex: 1,
    flexDirection: 'row',
  },
  contentCol: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainScrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 28,
    gap: 20,
  },
  headerTitleRow: {
    marginBottom: 4,
  },
  breadcrumbText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  pageTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  pageSubtitleText: {
    fontSize: 13,
    color: '#6B7280',
  },

  /* Filter Bar */
  filterBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  searchBoxCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 42,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
  },
  categoryDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 42,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  categoryDropdownText: {
    fontSize: 13,
    color: '#374151',
  },

  /* Product Grid */
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  productCard: {
    width: '23.2%', // ~4 columns
    minWidth: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    }),
    elevation: 1,
  },
  cardImageContainer: {
    height: 150,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 14,
    gap: 6,
  },
  productTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  categorySubtext: {
    fontSize: 11,
    color: '#6B7280',
  },
  priceStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  unitText: {
    fontSize: 11,
    fontWeight: 'normal',
    color: '#6B7280',
  },
  stockBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  stockBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#166534',
  },
  viewDetailsBtn: {
    borderWidth: 1,
    borderColor: '#3B6029',
    borderRadius: 6,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  viewDetailsBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B6029',
  },

  /* Footer / Pagination */
  tableFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 8,
  },
  footerShowingText: {
    fontSize: 12,
    color: '#6B7280',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pageNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNavBtnActive: {
    backgroundColor: '#3B6029',
    borderColor: '#3B6029',
  },
  pageNavBtnDisabled: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  pageNavBtnTextActive: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
