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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalLang, LangCode } from '@/utils/languageStore';
import { CustSidebar, CustTopHeader } from '@/components/CustLayout';

const TRANSLATIONS_CATEGORIES = {
  hi: {
    home: 'होम',
    allProducts: 'सभी उत्पाद',
    categories: 'श्रेणियाँ',
    findArtisans: 'कारीगर खोजें',
    newProducts: 'नए उत्पाद',
    trackOrder: 'ऑर्डर ट्रैक करें',
    myWishlist: 'मेरी इच्छाएं',
    myOrders: 'मेरे ऑर्डर',
    messages: 'संदेश',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    userName: 'आदित्य सिंह',
    breadcrumb: 'होम > श्रेणियाँ',
    pageTitle: 'उत्पाद श्रेणियाँ',
    pageSubtitle: 'भारत के समृद्ध हस्तशिल्प और कला रूपों की श्रेणीवार खोज करें।',
    searchPlaceholder: 'श्रेणी का नाम खोजें...',
    viewProductsBtn: 'उत्पाद देखें',
    productsCountLabel: 'उत्पाद उपलब्ध',
  },
  en: {
    home: 'Home',
    allProducts: 'All Products',
    categories: 'Categories',
    findArtisans: 'Find Artisans',
    newProducts: 'New Products',
    trackOrder: 'Track Order',
    myWishlist: 'My Wishlist',
    myOrders: 'My Orders',
    messages: 'Messages',
    profile: 'Profile',
    logout: 'Logout',
    userName: 'Aditya Singh',
    breadcrumb: 'Home > Categories',
    pageTitle: 'Product Categories',
    pageSubtitle: "Explore India's rich handicrafts and traditional art forms by category.",
    searchPlaceholder: 'Search category name...',
    viewProductsBtn: 'View Products',
    productsCountLabel: 'Products available',
  },
};

const CATEGORIES_LIST = [
  {
    id: 'bamboo',
    titleHi: 'बाँस शिल्प',
    titleEn: 'Bamboo Craft',
    count: '8',
    descHi: 'पूर्वोत्तर और मध्य भारत के प्राकृतिक बांस से निर्मित हस्तशिल्प टोकरियां, चटाइयां और सजावटी वस्तुएं।',
    descEn: 'Handcrafted baskets, mats, and decorative items made from natural bamboo of Central & NE India.',
    image: require('@/assets/images/cust_cat_bamboo.png'),
    badgeColor: '#E8F5E9',
    textColor: '#3B6029',
  },
  {
    id: 'clay',
    titleHi: 'मिट्टी शिल्प & टेराकोटा',
    titleEn: 'Clay & Terracotta Craft',
    count: '6',
    descHi: 'प्राकृतिक मिट्टी से बने पारंपरिक घड़े, दीये, बर्तन और कलात्मक टेराकोटा की मूर्तियां।',
    descEn: 'Traditional eco-friendly pots, lamps, cookware, and artistic terracotta sculptures.',
    image: require('@/assets/images/cust_cat_clay.png'),
    badgeColor: '#FFF3E0',
    textColor: '#E65100',
  },
  {
    id: 'textiles',
    titleHi: 'हस्तनिर्मित वस्त्र',
    titleEn: 'Handwoven Textiles',
    count: '7',
    descHi: 'सिल्क, कॉटन और जूट से बने बनारसी दुपट्टे, कोसा सिल्क साड़ियां और हाथ से कढ़े हुए वस्त्र।',
    descEn: 'Banarasi dupatta, Kosa silk sarees, and hand-embroidered ethnic wear woven by rural artisans.',
    image: require('@/assets/images/cust_cat_textile.png'),
    badgeColor: '#E1F5FE',
    textColor: '#0288D1',
  },
  {
    id: 'wood',
    titleHi: 'लकड़ी शिल्प & नक्काशी',
    titleEn: 'Wood Craft & Carvings',
    count: '5',
    descHi: 'सागौन और शीशम की लकड़ी से उकेरे गए बक्से, सर्विंग ट्रे, खिलौने और नक्काशीदार फर्नीचर।',
    descEn: 'Teak and Sheesham wood carved boxes, serving trays, wooden toys, and home decor items.',
    image: require('@/assets/images/cust_cat_wood.png'),
    badgeColor: '#F3E5F5',
    textColor: '#7B1FA2',
  },
  {
    id: 'metal',
    titleHi: 'ढोकरा धातु कला',
    titleEn: 'Dhokra Metal Craft',
    count: '4',
    descHi: 'खोया-मोम तकनीक (Lost-Wax Casting) द्वारा बनाई गई प्राचीन पीतल और कांस्य मूर्तियां।',
    descEn: 'Ancient bell metal and brass figurines handcrafted using traditional lost-wax casting technique.',
    image: require('@/assets/images/cust_cat_metal.png'),
    badgeColor: '#FFF8E1',
    textColor: '#F57F17',
  },
  {
    id: 'jewel',
    titleHi: 'पारंपरिक आभूषण',
    titleEn: 'Traditional Jewelry',
    count: '9',
    descHi: 'जनजातीय सिल्वर, टेराकोटा बीड्स और जूट-धागे से निर्मित अनूठे और एथनिक आभूषण।',
    descEn: 'Unique ethnic jewelry created with tribal silver finishes, terracotta beads, and handspun threads.',
    image: require('@/assets/images/cust_cat_jewel.png'),
    badgeColor: '#FCE4EC',
    textColor: '#C2185B',
  },
];

export default function CustomerCategoriesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang, setSelectedLang] = useGlobalLang();
  const [searchQuery, setSearchQuery] = useState('');

  const t = TRANSLATIONS_CATEGORIES[selectedLang as keyof typeof TRANSLATIONS_CATEGORIES] || TRANSLATIONS_CATEGORIES.en;
  const isHindi = selectedLang === 'hi';

  const filteredCategories = CATEGORIES_LIST.filter((cat) => {
    const title = isHindi ? cat.titleHi : cat.titleEn;
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <CustTopHeader />

        {/* Main 2-Column Layout */}
        <View style={styles.mainLayoutRow}>
          {/* 1. Left Sidebar Navigation */}
          {isDesktop && <CustSidebar activeKey="categories" />}

          {/* 2. Main Content Area */}
          <ScrollView style={styles.contentCol} contentContainerStyle={styles.contentScrollContainer} showsVerticalScrollIndicator={false}>
            {/* Page Header */}
            <View style={styles.pageHeaderCard}>
              <View>
                <Text style={styles.breadcrumbText}>{t.breadcrumb}</Text>
                <Text style={styles.pageTitleText}>{t.pageTitle}</Text>
                <Text style={styles.pageSubtitleText}>{t.pageSubtitle}</Text>
              </View>

              {/* Search Box */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="#888888" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder={t.searchPlaceholder}
                  placeholderTextColor="#888888"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Categories Grid */}
            <View style={styles.categoriesGrid}>
              {filteredCategories.map((cat) => (
                <View style={styles.categoryCard} key={cat.id}>
                  <View style={styles.cardHeaderRow}>
                    <Image source={cat.image} style={styles.categoryCardImg} resizeMode="contain" />
                    <View style={[styles.countBadgePill, { backgroundColor: cat.badgeColor }]}>
                      <Text style={[styles.countBadgeText, { color: cat.textColor }]}>
                        {cat.count} {t.productsCountLabel}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.categoryTitleText}>{isHindi ? cat.titleHi : cat.titleEn}</Text>
                  <Text style={styles.categoryDescText}>{isHindi ? cat.descHi : cat.descEn}</Text>

                  <TouchableOpacity style={styles.viewProductsBtn} activeOpacity={0.8}>
                    <Text style={styles.viewProductsBtnText}>{t.viewProductsBtn}</Text>
                    <Ionicons name="arrow-forward" size={14} color="#2E7D32" />
                  </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 260,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1A1A1A',
    padding: 0,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  categoryCard: {
    width: '31.5%',
    minWidth: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 20,
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  categoryCardImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FAF8F5',
  },
  countBadgePill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  categoryTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  categoryDescText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 16,
  },
  viewProductsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  viewProductsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
});
