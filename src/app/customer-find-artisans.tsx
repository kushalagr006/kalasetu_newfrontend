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

const TRANSLATIONS_FIND_ARTISANS = {
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
    breadcrumb: 'होम > कारीगर खोजें',
    pageTitle: 'ग्रामीण मास्टर कारीगर',
    pageSubtitle: 'भारत के दूर-दराज के गांवों से मास्टर शिल्पकारों और उनके प्रामाणिक उत्पादों से जुड़ें।',
    searchPlaceholder: 'कारीगर का नाम, कला या राज्य खोजें...',
    stateFilter: 'सभी राज्य ⌄',
    verifiedBadge: 'प्रमाणित कारीगर',
    masterWeaverBadge: 'मास्टर बुनकर',
    awardeeBadge: 'राष्ट्रीय पुरस्कार विजेता',
    productsListed: 'उत्पाद सूचीबद्ध',
    reviewsCount: 'समीक्षाएं',
    viewProfileBtn: 'प्रोफाइल देखें',
    messageBtn: 'संदेश भेजें',
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
    breadcrumb: 'Home > Find Artisans',
    pageTitle: 'Rural Master Artisans',
    pageSubtitle: 'Connect directly with master craftspeople from rural India and explore authentic handmade heritage.',
    searchPlaceholder: 'Search by artisan name, craft, or state...',
    stateFilter: 'All States ⌄',
    verifiedBadge: 'Verified Artisan',
    masterWeaverBadge: 'Master Weaver',
    awardeeBadge: 'National Awardee',
    productsListed: 'Products Listed',
    reviewsCount: 'Reviews',
    viewProfileBtn: 'View Profile',
    messageBtn: 'Send Message',
  },
};

const ARTISANS_LIST = [
  {
    id: '1',
    nameHi: 'सीमा देवी',
    nameEn: 'Seema Devi',
    locationHi: 'कांकेर, छत्तीसगढ़',
    locationEn: 'Kanker, Chhattisgarh',
    craftHi: 'बाँस एवं बेत शिल्प (Bamboo Craft)',
    craftEn: 'Bamboo & Cane Craft',
    experienceHi: '18 वर्षों का अनुभव',
    experienceEn: '18 Years Experience',
    rating: '4.9',
    reviewsCount: '42',
    productsCount: '15',
    badgeKey: 'verifiedBadge',
    badgeBg: '#E8F5E9',
    badgeTextColor: '#2E7D32',
    avatarInitials: 'SD',
  },
  {
    id: '2',
    nameHi: 'रामकुमार साहू',
    nameEn: 'Ramkumar Sahu',
    locationHi: 'कोंडागांव, छत्तीसगढ़',
    locationEn: 'Kondagaon, Chhattisgarh',
    craftHi: 'टेराकोटा एवं मिट्टी कला (Terracotta)',
    craftEn: 'Terracotta & Clay Art',
    experienceHi: '22 वर्षों का अनुभव',
    experienceEn: '22 Years Experience',
    rating: '4.8',
    reviewsCount: '58',
    productsCount: '24',
    badgeKey: 'awardeeBadge',
    badgeBg: '#FFF3E0',
    badgeTextColor: '#E65100',
    avatarInitials: 'RS',
  },
  {
    id: '3',
    nameHi: 'सुनीता देवांगन',
    nameEn: 'Sunita Dewangan',
    locationHi: 'रायगढ़, छत्तीसगढ़',
    locationEn: 'Raigarh, Chhattisgarh',
    craftHi: 'कोसा सिल्क हथकरघा (Kosa Silk Weaving)',
    craftEn: 'Kosa Silk Weaving',
    experienceHi: '15 वर्षों का अनुभव',
    experienceEn: '15 Years Experience',
    rating: '4.95',
    reviewsCount: '31',
    productsCount: '18',
    badgeKey: 'masterWeaverBadge',
    badgeBg: '#E1F5FE',
    badgeTextColor: '#0288D1',
    avatarInitials: 'SD',
  },
  {
    id: '4',
    nameHi: 'मोहन चक्रधारी',
    nameEn: 'Mohan Chakradhari',
    locationHi: 'बस्तर, छत्तीसगढ़',
    locationEn: 'Bastar, Chhattisgarh',
    craftHi: 'ढोकरा बेल मेटल क्राफ्ट (Dhokra Metal)',
    craftEn: 'Dhokra Bell Metal Craft',
    experienceHi: '25 वर्षों का अनुभव',
    experienceEn: '25 Years Experience',
    rating: '4.85',
    reviewsCount: '64',
    productsCount: '12',
    badgeKey: 'awardeeBadge',
    badgeBg: '#FFF8E1',
    badgeTextColor: '#F57F17',
    avatarInitials: 'MC',
  },
];

export default function CustomerFindArtisansScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang, setSelectedLang] = useGlobalLang();
  const [searchQuery, setSearchQuery] = useState('');

  const t = TRANSLATIONS_FIND_ARTISANS[selectedLang as keyof typeof TRANSLATIONS_FIND_ARTISANS] || TRANSLATIONS_FIND_ARTISANS.en;
  const isHindi = selectedLang === 'hi';

  const filteredArtisans = ARTISANS_LIST.filter((artisan) => {
    const name = isHindi ? artisan.nameHi : artisan.nameEn;
    const craft = isHindi ? artisan.craftHi : artisan.craftEn;
    const loc = isHindi ? artisan.locationHi : artisan.locationEn;
    const query = searchQuery.toLowerCase();
    return name.toLowerCase().includes(query) || craft.toLowerCase().includes(query) || loc.toLowerCase().includes(query);
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
          {isDesktop && <CustSidebar activeKey="findArtisans" />}

          {/* 2. Main Content Area */}
          <ScrollView style={styles.contentCol} contentContainerStyle={styles.contentScrollContainer} showsVerticalScrollIndicator={false}>
            {/* Page Header */}
            <View style={styles.pageHeaderCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.breadcrumbText}>{t.breadcrumb}</Text>
                <Text style={styles.pageTitleText}>{t.pageTitle}</Text>
                <Text style={styles.pageSubtitleText}>{t.pageSubtitle}</Text>
              </View>

              {/* Search Box & State Filter */}
              <View style={styles.headerRightControlsRow}>
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

                <TouchableOpacity style={styles.stateFilterBtn}>
                  <Text style={styles.stateFilterBtnText}>{t.stateFilter}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Artisans Cards Grid */}
            <View style={styles.artisansGrid}>
              {filteredArtisans.map((artisan) => {
                const badgeText = t[artisan.badgeKey as keyof typeof t] as string;
                return (
                  <View style={styles.artisanCard} key={artisan.id}>
                    {/* Top Row: Avatar Initials & Badge */}
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.avatarInitialsCircle}>
                        <Text style={styles.avatarInitialsText}>{artisan.avatarInitials}</Text>
                      </View>

                      <View style={[styles.badgePill, { backgroundColor: artisan.badgeBg }]}>
                        <Ionicons name="checkmark-circle" size={12} color={artisan.badgeTextColor} style={{ marginRight: 4 }} />
                        <Text style={[styles.badgeText, { color: artisan.badgeTextColor }]}>{badgeText}</Text>
                      </View>
                    </View>

                    {/* Artisan Name & Location */}
                    <Text style={styles.artisanNameText}>{isHindi ? artisan.nameHi : artisan.nameEn}</Text>

                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={14} color="#777777" style={{ marginRight: 4 }} />
                      <Text style={styles.locationText}>{isHindi ? artisan.locationHi : artisan.locationEn}</Text>
                    </View>

                    {/* Craft & Experience */}
                    <View style={styles.craftBox}>
                      <Text style={styles.craftTitleText}>{isHindi ? artisan.craftHi : artisan.craftEn}</Text>
                      <Text style={styles.experienceText}>{isHindi ? artisan.experienceHi : artisan.experienceEn}</Text>
                    </View>

                    {/* Ratings & Products Stats */}
                    <View style={styles.statsRow}>
                      <View style={styles.statItemCol}>
                        <View style={styles.ratingSubRow}>
                          <Ionicons name="star" size={14} color="#FFB300" style={{ marginRight: 3 }} />
                          <Text style={styles.ratingValText}>{artisan.rating}</Text>
                        </View>
                        <Text style={styles.statLabelText}>({artisan.reviewsCount} {t.reviewsCount})</Text>
                      </View>

                      <View style={styles.statDividerLine} />

                      <View style={styles.statItemCol}>
                        <Text style={styles.productsValText}>{artisan.productsCount}</Text>
                        <Text style={styles.statLabelText}>{t.productsListed}</Text>
                      </View>
                    </View>

                    {/* Bottom Action Buttons */}
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        style={styles.viewProfileBtn}
                        onPress={() => router.push('/web-helper-profile')}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.viewProfileBtnText}>{t.viewProfileBtn}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.messageBtn}
                        onPress={() => router.push('/customer-messages')}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="chatbubble-ellipses-outline" size={16} color="#2E7D32" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
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
  headerRightControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  stateFilterBtn: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  stateFilterBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444444',
  },
  artisansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  artisanCard: {
    width: '48.5%',
    minWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarInitialsCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitialsText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  artisanNameText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#666666',
  },
  craftBox: {
    backgroundColor: '#FAF8F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  craftTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 2,
  },
  experienceText: {
    fontSize: 11,
    color: '#777777',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    paddingVertical: 12,
    marginBottom: 16,
  },
  statItemCol: {
    alignItems: 'center',
  },
  ratingSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  statLabelText: {
    fontSize: 10,
    color: '#888888',
    marginTop: 2,
  },
  statDividerLine: {
    width: 1,
    height: 28,
    backgroundColor: '#EBEBEB',
  },
  productsValText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  viewProfileBtn: {
    flex: 1,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewProfileBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  messageBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
