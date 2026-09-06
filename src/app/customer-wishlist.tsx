import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalLang, LangCode } from '@/utils/languageStore';
import { CustSidebar, CustTopHeader } from '@/components/CustLayout';

const TRANSLATIONS_WISHLIST = {
  hi: {
    home: 'होम',
    allProducts: 'सभी उत्पाद',
    categories: 'श्रेणियाँ',
    findArtisans: 'कारीगर खोजें',
    trackOrder: 'ऑर्डर ट्रैक करें',
    myWishlist: 'मेरी इच्छाएं',
    myOrders: 'मेरे ऑर्डर',
    messages: 'संदेश',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    userName: 'आदित्य सिंह',
    breadcrumb: 'होम > मेरी इच्छाएं',
    pageTitle: 'मेरी इच्छाएं (Wishlist)',
    pageSubtitle: 'आपके द्वारा सहेजे गए पसंदीदा हस्तशिल्प और कलाकृतियां।',
    addToCartBtn: 'कार्ट में जोड़ें',
    removeBtn: 'हटाएं',
    emptyText: 'आपकी विशलिस्ट में अभी कोई उत्पाद नहीं है।',
    exploreProductsBtn: 'उत्पाद देखें',
  },
  en: {
    home: 'Home',
    allProducts: 'All Products',
    categories: 'Categories',
    findArtisans: 'Find Artisans',
    trackOrder: 'Track Order',
    myWishlist: 'My Wishlist',
    myOrders: 'My Orders',
    messages: 'Messages',
    profile: 'Profile',
    logout: 'Logout',
    userName: 'Aditya Singh',
    breadcrumb: 'Home > My Wishlist',
    pageTitle: 'My Wishlist',
    pageSubtitle: 'Your saved favorite artisanal crafts and products.',
    addToCartBtn: 'Add to Cart',
    removeBtn: 'Remove',
    emptyText: 'No saved products in your wishlist yet.',
    exploreProductsBtn: 'Explore Products',
  },
};

const WISHLIST_PRODUCTS = [
  {
    id: '1',
    titleHi: 'बाँस की टोकरी',
    titleEn: 'Bamboo Basket',
    artisanHi: 'सीमा देवी (कांकेर, छत्तीसगढ़)',
    artisanEn: 'Seema Devi (Kanker, CG)',
    categoryHi: 'बाँस शिल्प',
    categoryEn: 'Bamboo Craft',
    price: '650',
    rating: '4.6',
    reviewsCount: '28',
    image: require('@/assets/images/govt_item_basket.png'),
  },
  {
    id: '2',
    titleHi: 'मिट्टी का घड़ा सेट',
    titleEn: 'Terracotta Pots Set',
    artisanHi: 'रामकुमार साहू (कोंडागांव, छत्तीसगढ़)',
    artisanEn: 'Ramkumar Sahu (Kondagaon, CG)',
    categoryHi: 'मिट्टी शिल्प',
    categoryEn: 'Clay Craft',
    price: '1,250',
    rating: '4.8',
    reviewsCount: '16',
    image: require('@/assets/images/cust_prod_clay.png'),
  },
  {
    id: '3',
    titleHi: 'हस्तनिर्मित साड़ी',
    titleEn: 'Handwoven Saree',
    artisanHi: 'मीना बाई (चांपा, छत्तीसगढ़)',
    artisanEn: 'Meena Bai (Champa, CG)',
    categoryHi: 'वस्त्र',
    categoryEn: 'Textiles',
    price: '1,850',
    rating: '4.7',
    reviewsCount: '14',
    image: require('@/assets/images/cust_prod_dupatta.png'),
  },
];

export default function CustomerWishlistScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang] = useGlobalLang();
  const t = TRANSLATIONS_WISHLIST[selectedLang as keyof typeof TRANSLATIONS_WISHLIST] || TRANSLATIONS_WISHLIST.en;
  const isHindi = selectedLang === 'hi';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <CustTopHeader />

        {/* Main 2-Column Layout */}
        <View style={styles.mainLayoutRow}>
          {/* 1. Left Sidebar Navigation */}
          {isDesktop && <CustSidebar activeKey="wishlist" />}

          {/* 2. Main Content Area */}
          <ScrollView style={styles.contentCol} contentContainerStyle={styles.contentScrollContainer} showsVerticalScrollIndicator={false}>
            {/* Page Header */}
            <View style={styles.pageHeaderCard}>
              <Text style={styles.breadcrumbText}>{t.breadcrumb}</Text>
              <Text style={styles.pageTitleText}>{t.pageTitle}</Text>
              <Text style={styles.pageSubtitleText}>{t.pageSubtitle}</Text>
            </View>

            {/* Wishlist Items Grid */}
            <View style={styles.wishlistGrid}>
              {WISHLIST_PRODUCTS.map((item) => (
                <View style={styles.productCard} key={item.id}>
                  {/* Remove Button Top Right */}
                  <TouchableOpacity style={styles.removeCircleBtn}>
                    <Ionicons name="trash-outline" size={16} color="#D32F2F" />
                  </TouchableOpacity>

                  {/* Image */}
                  <Image source={item.image} style={styles.productCardImg} resizeMode="contain" />

                  {/* Category Pill */}
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryPillText}>{isHindi ? item.categoryHi : item.categoryEn}</Text>
                  </View>

                  {/* Title & Artisan */}
                  <Text style={styles.productTitleText}>{isHindi ? item.titleHi : item.titleEn}</Text>
                  <Text style={styles.artisanSubText}>{isHindi ? item.artisanHi : item.artisanEn}</Text>

                  {/* Rating */}
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={13} color="#FFB300" style={{ marginRight: 4 }} />
                    <Text style={styles.ratingValText}>{item.rating}</Text>
                    <Text style={styles.reviewsCountText}>({item.reviewsCount})</Text>
                  </View>

                  {/* Price & Add to Cart */}
                  <View style={styles.cardFooterRow}>
                    <Text style={styles.priceText}>₹{item.price}</Text>

                    <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.8}>
                      <Ionicons name="cart-outline" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.addToCartBtnText}>{t.addToCartBtn}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
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
  mainLayoutRow: {
    flex: 1,
    flexDirection: 'row',
  },
  contentCol: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  contentScrollContainer: {
    padding: 24,
    gap: 20,
  },
  pageHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  breadcrumbText: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  pageTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  pageSubtitleText: {
    fontSize: 13,
    color: '#666666',
  },
  wishlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  productCard: {
    width: '31.5%',
    minWidth: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 16,
    position: 'relative',
  },
  removeCircleBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  productCardImg: {
    width: '100%',
    height: 140,
    marginBottom: 12,
  },
  categoryPill: {
    backgroundColor: '#FAF8F5',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
  },
  productTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  artisanSubText: {
    fontSize: 11,
    color: '#777777',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  ratingValText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    marginRight: 4,
  },
  reviewsCountText: {
    fontSize: 11,
    color: '#888888',
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
    paddingTop: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2E7D32',
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addToCartBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
