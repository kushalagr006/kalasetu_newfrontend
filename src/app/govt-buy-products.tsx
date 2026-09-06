import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalLang } from '@/utils/languageStore';
import { GovtSidebar, GovtTopHeader } from '@/components/GovtLayout';

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
    pageSubtitle: 'Purchase authentic Indian handicrafts and products from verified artisans and producer groups.',
    searchPlaceholder: 'Search products, artisans or keywords...',
    allCategories: 'All Categories',
    inStock: 'In Stock',
    viewDetails: 'View Details',
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
    pageSubtitle: 'Purchase authentic Indian handicrafts and products from verified artisans and producer groups.',
    searchPlaceholder: 'Search products, artisans or keywords...',
    allCategories: 'All Categories',
    inStock: 'In Stock',
    viewDetails: 'View Details',
    showingFooter: (start: number, end: number, total: number) => `Showing ${start} - ${end} of ${total} products`,
  },
};

const PRODUCTS_DATA = [
  {
    id: '1',
    title: 'Bamboo Basket',
    category: 'Home Decor',
    price: '450',
    unit: '/ piece',
    stock: 500,
    image: require('@/assets/images/govt_item_basket.png'),
  },
  {
    id: '2',
    title: 'Wooden Chair',
    category: 'Furniture',
    price: '850',
    unit: '/ piece',
    stock: 100,
    image: require('@/assets/images/govt_item_chair.png'),
  },
  {
    id: '3',
    title: 'Terracotta Lamp',
    category: 'Home Decor',
    price: '550',
    unit: '/ piece',
    stock: 200,
    image: require('@/assets/images/govt_item_lampshade.png'),
  },
  {
    id: '4',
    title: 'Handwoven Mat',
    category: 'Home Furnishing',
    price: '350',
    unit: '/ piece',
    stock: 300,
    image: require('@/assets/images/govt_item_mat.png'),
  },
  {
    id: '5',
    title: 'Jute Handbag',
    category: 'Accessories',
    price: '320',
    unit: '/ piece',
    stock: 150,
    image: require('@/assets/images/product_bag.png'),
  },
  {
    id: '6',
    title: 'Wooden Serving Tray',
    category: 'Kitchenware',
    price: '600',
    unit: '/ piece',
    stock: 100,
    image: require('@/assets/images/govt_item_tray.png'),
  },
  {
    id: '7',
    title: 'Terracotta Cup Set',
    category: 'Kitchenware',
    price: '300',
    unit: '/ set',
    stock: 250,
    image: require('@/assets/images/cust_prod_clay.png'),
  },
  {
    id: '8',
    title: 'Wall Hanging',
    category: 'Home Decor',
    price: '700',
    unit: '/ piece',
    stock: 50,
    image: require('@/assets/images/product_macrame.png'),
  },
];

export default function WebGovtBuyProductsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang] = useGlobalLang();
  const [searchQuery, setSearchQuery] = useState('');

  const t = TRANSLATIONS_GOVT_PRODUCTS[selectedLang as keyof typeof TRANSLATIONS_GOVT_PRODUCTS] || TRANSLATIONS_GOVT_PRODUCTS.en;

  const filteredProducts = PRODUCTS_DATA.filter((item) =>
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

              {/* 4-Column Product Grid */}
              <View style={styles.productGrid}>
                {filteredProducts.map((product) => (
                  <View style={styles.productCard} key={product.id}>
                    <View style={styles.cardImageContainer}>
                      <Image source={product.image} style={styles.productImage} resizeMode="contain" />
                    </View>

                    <View style={styles.cardContent}>
                      <Text style={styles.productTitleText}>{product.title}</Text>
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

                      <TouchableOpacity style={styles.viewDetailsBtn} activeOpacity={0.8}>
                        <Text style={styles.viewDetailsBtnText}>{t.viewDetails}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>

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
