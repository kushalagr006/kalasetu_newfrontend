import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalLang } from '@/utils/languageStore';
import { CustSidebar, CustTopHeader } from '@/components/CustLayout';

const TRANSLATIONS_DASHBOARD = {
  hi: {
    welcomeTitle: 'नमस्ते, अमन 👋',
    welcomeSubtitle: 'प्रामाणिक भारतीय हस्तशिल्प और उत्पाद खोजें और खरीदें।',
    // Action Cards
    buyProductsTitle: 'उत्पाद खरीदें',
    buyProductsSub: 'हस्तनिर्मित उत्पादों को खोजें और खरीदें।',
    createTenderTitle: 'टेंडर बनाएं',
    createTenderSub: 'अपनी आवश्यकताओं को पोस्ट करें और कारीगरों से बोलियां आमंत्रित करें।',
    myOrdersTitle: 'मेरे ऑर्डर',
    myOrdersSub: 'अपनी खरीदारी को ट्रैक और प्रबंधित करें।',
    // Recommended
    recommendedTitle: 'आपके लिए अनुशंसित',
    viewAll: 'सभी देखें',
    addToCart: 'कार्ट में जोड़ें',
    // Quick Stats
    quickStatsTitle: 'त्वरित आँकड़े',
    statTotalOrders: 'कुल ऑर्डर',
    statActiveTenders: 'सक्रिय टेंडर',
    statSavedProducts: 'सहेजे गए उत्पाद',
    statNotifications: 'सूचनाएं',
  },
  en: {
    welcomeTitle: 'Hello, Aman 👋',
    welcomeSubtitle: 'Discover and purchase authentic Indian handicrafts and products.',
    // Action Cards
    buyProductsTitle: 'Buy Products',
    buyProductsSub: 'Explore and purchase handcrafted products.',
    createTenderTitle: 'Create Tender',
    createTenderSub: 'Post your requirements and invite bids from artisans.',
    myOrdersTitle: 'My Orders',
    myOrdersSub: 'Track and manage your purchases.',
    // Recommended
    recommendedTitle: 'Recommended for you',
    viewAll: 'View All',
    addToCart: 'Add to Cart',
    // Quick Stats
    quickStatsTitle: 'Quick Stats',
    statTotalOrders: 'Total Orders',
    statActiveTenders: 'Active Tenders',
    statSavedProducts: 'Saved Products',
    statNotifications: 'Notifications',
  },
};

const RECOMMENDED_PRODUCTS = [
  {
    id: '1',
    titleHi: 'बाँस की टोकरी (3 का सेट)',
    titleEn: 'Bamboo Basket (Set of 3)',
    price: '450',
    artisanHi: 'बस्तर हस्तशिल्प एसएचजी',
    artisanEn: 'Bastar Handicrafts SHG',
    image: require('@/assets/images/govt_item_basket.png'),
  },
  {
    id: '2',
    titleHi: 'टेराकोटा दीपक',
    titleEn: 'Terracotta Lamp',
    price: '320',
    artisanHi: 'दंतेवाड़ा कारीगर',
    artisanEn: 'Dantewada Artisans',
    image: require('@/assets/images/cust_prod_clay.png'),
  },
  {
    id: '3',
    titleHi: 'वरली वॉल आर्ट',
    titleEn: 'Warli Wall Art',
    price: '1,200',
    artisanHi: 'छत्तीसगढ़ क्राफ्ट्स',
    artisanEn: 'Chhattisgarh Crafts',
    image: require('@/assets/images/cust_prod_dupatta.png'),
  },
  {
    id: '4',
    titleHi: 'लकड़ी की सजावट',
    titleEn: 'Wooden Home Decor',
    price: '950',
    artisanHi: 'महुआ प्रोडक्ट्स',
    artisanEn: 'Mahua Products',
    image: require('@/assets/images/govt_item_tray.png'),
  },
];

export default function CustomerDashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang] = useGlobalLang();
  const t = TRANSLATIONS_DASHBOARD[selectedLang as keyof typeof TRANSLATIONS_DASHBOARD] || TRANSLATIONS_DASHBOARD.en;
  const isHindi = selectedLang === 'hi';

  const [wishlistState, setWishlistState] = useState<{ [key: string]: boolean }>({
    '1': false,
    '2': false,
    '3': false,
    '4': false,
  });

  const toggleWishlist = (id: string) => {
    setWishlistState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <CustTopHeader />

        {/* Main 2-Column Layout */}
        <View style={styles.mainLayoutRow}>
          {/* 1. Left Sidebar Navigation */}
          {isDesktop && <CustSidebar activeKey="dashboard" />}

          {/* 2. Main Content Scrollable Area */}
          <ScrollView style={styles.contentCol} contentContainerStyle={styles.contentScrollContainer} showsVerticalScrollIndicator={false}>
            {/* Greeting Header */}
            <View style={styles.greetingHeader}>
              <Text style={styles.greetingTitleText}>{t.welcomeTitle}</Text>
              <Text style={styles.greetingSubtitleText}>{t.welcomeSubtitle}</Text>
            </View>

            {/* Top 3 Action Banner Cards Row */}
            <View style={styles.actionCardsRow}>
              {/* Card 1: Buy Products */}
              <TouchableOpacity
                style={[styles.actionCard, styles.actionCardGreen]}
                onPress={() => router.push('/customer-buy-products' as any)}
                activeOpacity={0.85}
              >
                <View style={styles.actionCardHeader}>
                  <View style={[styles.actionIconCircle, styles.actionIconCircleGreen]}>
                    <Ionicons name="cart-outline" size={24} color="#2E7D32" />
                  </View>
                  <Ionicons name="arrow-forward" size={20} color="#2E7D32" />
                </View>
                <Text style={styles.actionCardTitle}>{t.buyProductsTitle}</Text>
                <Text style={styles.actionCardSub}>{t.buyProductsSub}</Text>
              </TouchableOpacity>

              {/* Card 2: Create Tender */}
              <TouchableOpacity
                style={[styles.actionCard, styles.actionCardBlue]}
                onPress={() => router.push('/govt-tenders-create' as any)}
                activeOpacity={0.85}
              >
                <View style={styles.actionCardHeader}>
                  <View style={[styles.actionIconCircle, styles.actionIconCircleBlue]}>
                    <Ionicons name="document-text-outline" size={24} color="#1E88E5" />
                  </View>
                  <Ionicons name="arrow-forward" size={20} color="#1E88E5" />
                </View>
                <Text style={styles.actionCardTitle}>{t.createTenderTitle}</Text>
                <Text style={styles.actionCardSub}>{t.createTenderSub}</Text>
              </TouchableOpacity>

              {/* Card 3: My Orders */}
              <TouchableOpacity
                style={[styles.actionCard, styles.actionCardOrange]}
                onPress={() => router.push('/customer-my-orders' as any)}
                activeOpacity={0.85}
              >
                <View style={styles.actionCardHeader}>
                  <View style={[styles.actionIconCircle, styles.actionIconCircleOrange]}>
                    <Ionicons name="briefcase-outline" size={24} color="#E65100" />
                  </View>
                  <Ionicons name="arrow-forward" size={20} color="#E65100" />
                </View>
                <Text style={styles.actionCardTitle}>{t.myOrdersTitle}</Text>
                <Text style={styles.actionCardSub}>{t.myOrdersSub}</Text>
              </TouchableOpacity>
            </View>

            {/* Main Content 2-Column Split: Recommended vs Quick Stats */}
            <View style={styles.dashboardSplitRow}>
              {/* Left Column: Recommended for you */}
              <View style={styles.recommendedSectionCol}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitleText}>{t.recommendedTitle}</Text>
                  <TouchableOpacity
                    style={styles.viewAllBtn}
                    onPress={() => router.push('/customer-buy-products' as any)}
                  >
                    <Text style={styles.viewAllBtnText}>{t.viewAll}</Text>
                    <Ionicons name="arrow-forward" size={14} color="#2E7D32" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>

                {/* 4 Product Cards Grid */}
                <View style={styles.productsGridRow}>
                  {RECOMMENDED_PRODUCTS.map((prod) => (
                    <View style={styles.productCard} key={prod.id}>
                      {/* Heart Wishlist Icon Top Right */}
                      <TouchableOpacity
                        style={styles.heartBtn}
                        onPress={() => toggleWishlist(prod.id)}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={wishlistState[prod.id] ? 'heart' : 'heart-outline'}
                          size={18}
                          color={wishlistState[prod.id] ? '#D32F2F' : '#666666'}
                        />
                      </TouchableOpacity>

                      {/* Product Image */}
                      <Image source={prod.image} style={styles.productImage} resizeMode="cover" />

                      {/* Product Meta */}
                      <Text style={styles.productTitleText}>{isHindi ? prod.titleHi : prod.titleEn}</Text>
                      <Text style={styles.productPriceText}>₹{prod.price}</Text>
                      <Text style={styles.productArtisanText}>{isHindi ? prod.artisanHi : prod.artisanEn}</Text>

                      {/* Add to Cart Outlined Button */}
                      <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.8}>
                        <Text style={styles.addToCartBtnText}>{t.addToCart}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>

              {/* Right Column: Quick Stats Panel */}
              <View style={styles.quickStatsCol}>
                <View style={styles.quickStatsCard}>
                  <Text style={styles.quickStatsHeaderTitle}>{t.quickStatsTitle}</Text>

                  {/* Stat Item 1: Total Orders */}
                  <View style={styles.statRowItem}>
                    <View style={[styles.statIconBox, { backgroundColor: '#EAF2E8' }]}>
                      <Ionicons name="briefcase-outline" size={20} color="#2E7D32" />
                    </View>
                    <View style={styles.statMetaCol}>
                      <Text style={styles.statValText}>5</Text>
                      <Text style={styles.statLabelText}>{t.statTotalOrders}</Text>
                    </View>
                  </View>

                  {/* Stat Item 2: Active Tenders */}
                  <View style={styles.statRowItem}>
                    <View style={[styles.statIconBox, { backgroundColor: '#EBF3FE' }]}>
                      <Ionicons name="document-text-outline" size={20} color="#1E88E5" />
                    </View>
                    <View style={styles.statMetaCol}>
                      <Text style={styles.statValText}>2</Text>
                      <Text style={styles.statLabelText}>{t.statActiveTenders}</Text>
                    </View>
                  </View>

                  {/* Stat Item 3: Saved Products */}
                  <View style={styles.statRowItem}>
                    <View style={[styles.statIconBox, { backgroundColor: '#FCE8E6' }]}>
                      <Ionicons name="heart-outline" size={20} color="#D32F2F" />
                    </View>
                    <View style={styles.statMetaCol}>
                      <Text style={styles.statValText}>12</Text>
                      <Text style={styles.statLabelText}>{t.statSavedProducts}</Text>
                    </View>
                  </View>

                  {/* Stat Item 4: Notifications */}
                  <View style={styles.statRowItem}>
                    <View style={[styles.statIconBox, { backgroundColor: '#FFF0D4' }]}>
                      <Ionicons name="notifications-outline" size={20} color="#E65100" />
                    </View>
                    <View style={styles.statMetaCol}>
                      <Text style={styles.statValText}>3</Text>
                      <Text style={styles.statLabelText}>{t.statNotifications}</Text>
                    </View>
                  </View>
                </View>
              </View>
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
    backgroundColor: '#F8FAF6',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAF6',
  },
  mainLayoutRow: {
    flex: 1,
    flexDirection: 'row',
  },
  contentCol: {
    flex: 1,
    backgroundColor: '#F8FAF6',
  },
  contentScrollContainer: {
    padding: 24,
    gap: 24,
  },

  /* Greeting Header */
  greetingHeader: {
    marginBottom: 4,
  },
  greetingTitleText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  greetingSubtitleText: {
    fontSize: 14,
    color: '#666666',
  },

  /* Action Cards */
  actionCardsRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  actionCard: {
    flex: 1,
    minWidth: 220,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  actionCardGreen: {
    backgroundColor: '#EBF7EE',
    borderColor: '#D2EBD6',
  },
  actionCardBlue: {
    backgroundColor: '#EFF6FF',
    borderColor: '#D0E2FF',
  },
  actionCardOrange: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFE4C4',
  },
  actionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconCircleGreen: {
    backgroundColor: '#C8E6CA',
  },
  actionIconCircleBlue: {
    backgroundColor: '#D0E2FF',
  },
  actionIconCircleOrange: {
    backgroundColor: '#FFE4C4',
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  actionCardSub: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },

  /* Dashboard 2-Column Split */
  dashboardSplitRow: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  recommendedSectionCol: {
    flex: 3,
    minWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    ...Platform.select({
      web: { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.03)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3 },
    }),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  sectionTitleText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },

  /* Product Cards Grid */
  productsGridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  productCard: {
    flex: 1,
    minWidth: 160,
    maxWidth: 210,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 12,
    position: 'relative',
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    elevation: 2,
    ...Platform.select({
      web: { boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    }),
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  productTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  productPriceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  productArtisanText: {
    fontSize: 11,
    color: '#777777',
    marginBottom: 12,
  },
  addToCartBtn: {
    borderWidth: 1,
    borderColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },

  /* Quick Stats Column */
  quickStatsCol: {
    flex: 1,
    minWidth: 260,
  },
  quickStatsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    gap: 16,
    ...Platform.select({
      web: { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.03)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3 },
    }),
  },
  quickStatsHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statMetaCol: {
    justifyContent: 'center',
  },
  statValText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  statLabelText: {
    fontSize: 12,
    color: '#666666',
  },
});
