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

const TRANSLATIONS_HELPER = {
  hi: {
    districtLabel: 'जिला: रायपुर, छत्तीसगढ़ ⌄',
    helperRole: 'सहायक (Helper)',
    userName: 'राजेश कुमार',
    dashboard: 'डैशबोर्ड',
    addArtisan: 'नया कारीगर जोड़ें',
    postProduct: 'उत्पाद पोस्ट करें',
    viewArtisans: 'कारीगर देखें',
    myPosts: 'मेरी पोस्ट',
    myProfile: 'मेरा प्रोफाइल',
    logout: 'लॉग आउट',
    helpNeededTitle: 'सहायता चाहिए?',
    helpNeededSub: 'किसी भी समस्या के लिए संपर्क करें।',
    helpCenterBtn: 'सहायता केंद्र',
    welcomeGreeting: 'नमस्ते, राजेश कुमार!',
    subHeaderTitle: 'जिला सहायता केंद्र डैशबोर्ड',
    bannerDesc: 'आप अपने जिले के कारीगरों की प्रोफाइल बनाएं और उनके उत्पाद ऑनलाइन पोस्ट करें।',
    statArtisans: 'कुल कारीगर',
    statArtisansSub: 'इस महीने +18',
    statProducts: 'कुल उत्पाद पोस्ट',
    statProductsSub: 'इस महीने +42',
    statLive: 'लाइव उत्पाद',
    statLiveSub: 'ऑनलाइन',
    statViews: 'कुल व्यूज़',
    statViewsSub: 'इस महीने',
    actionAddArtisanTitle: 'नया कारीगर जोड़ें',
    actionAddArtisanDesc: 'नए कारीगर की प्रोफाइल बनाएं और उन्हें कलासेतु से जोड़ें।',
    actionAddArtisanBtn: '+ नया कारीगर जोड़ें',
    actionPostProductTitle: 'उत्पाद पोस्ट करें',
    actionPostProductDesc: 'कारीगर के उत्पाद की जानकारी जोड़ें और ऑनलाइन पोस्ट करें।',
    actionPostProductBtn: 'उत्पाद पोस्ट करें >',
    recentArtisansTitle: 'हाल ही में जोड़े गए कारीगर',
    seeAll: 'देखें सभी',
    seeAllArtisansBtn: 'देखें सभी कारीगर →',
    recentProductsTitle: 'हाल ही में पोस्ट किए गए उत्पाद',
    seeAllProductsBtn: 'देखें सभी उत्पाद →',
    liveBadge: 'लाइव',
    footerLeft: 'कलासेतु जिला सहायता केंद्र पोर्टल',
    footerRight: '© 2025 कलासेतु | सभी अधिकार सुरक्षित',
  },
  en: {
    districtLabel: 'District: Raipur, CG ⌄',
    helperRole: 'Assistant (Helper)',
    userName: 'Rajesh Kumar',
    dashboard: 'Dashboard',
    addArtisan: 'Add New Artisan',
    postProduct: 'Post Product',
    viewArtisans: 'View Artisans',
    myPosts: 'My Posts',
    myProfile: 'My Profile',
    logout: 'Logout',
    helpNeededTitle: 'Need Help?',
    helpNeededSub: 'Contact us for any assistance.',
    helpCenterBtn: 'Help Centre',
    welcomeGreeting: 'Welcome, Rajesh Kumar!',
    subHeaderTitle: 'District Helpdesk Center Dashboard',
    bannerDesc: 'Create profile for rural artisans in your district and post their authentic handmade products online.',
    statArtisans: 'Total Artisans',
    statArtisansSub: 'This Month +18',
    statProducts: 'Total Posted Products',
    statProductsSub: 'This Month +42',
    statLive: 'Live Products',
    statLiveSub: 'Online',
    statViews: 'Total Views',
    statViewsSub: 'This Month',
    actionAddArtisanTitle: 'Add New Artisan',
    actionAddArtisanDesc: 'Create a profile for new artisans and connect them to KalaSetu.',
    actionAddArtisanBtn: '+ Add New Artisan',
    actionPostProductTitle: 'Post Product',
    actionPostProductDesc: 'Add product details of artisans and publish them online.',
    actionPostProductBtn: 'Post Product >',
    recentArtisansTitle: 'Recently Added Artisans',
    seeAll: 'View All',
    seeAllArtisansBtn: 'View All Artisans →',
    recentProductsTitle: 'Recently Posted Products',
    seeAllProductsBtn: 'View All Products →',
    liveBadge: 'Live',
    footerLeft: 'KalaSetu District Helpdesk Portal',
    footerRight: '© 2025 KalaSetu | All rights reserved',
  },
};

const RECENT_ARTISANS = [
  {
    id: '1',
    name: 'सुनीता देवी',
    village: 'ग्राम: खरोरा',
    craft: 'बाँस का सामान',
    date: '20 मई 2025',
    avatarInitials: 'SD',
    avatarBg: '#E8F5E9',
    avatarColor: '#2E7D32',
  },
  {
    id: '2',
    name: 'रमेश साहू',
    village: 'ग्राम: तिल्दा',
    craft: 'लकड़ी का काम',
    date: '19 मई 2025',
    avatarInitials: 'RS',
    avatarBg: '#FFF3E0',
    avatarColor: '#E65100',
  },
  {
    id: '3',
    name: 'कमला बाई',
    village: 'ग्राम: भटगांव',
    craft: 'मिट्टी के बर्तन',
    date: '18 मई 2025',
    avatarInitials: 'KB',
    avatarBg: '#E1F5FE',
    avatarColor: '#0288D1',
  },
];

const RECENT_PRODUCTS = [
  {
    id: '1',
    title: 'बाँस की टोकरी',
    artisan: 'सुनीता देवी',
    price: '₹650',
    date: '21 मई 2025',
    image: require('@/assets/images/govt_item_basket.png'),
  },
  {
    id: '2',
    title: 'लकड़ी की कुर्सी',
    artisan: 'रमेश साहू',
    price: '₹2,200',
    date: '20 मई 2025',
    image: require('@/assets/images/cust_prod_woodbox.png'),
  },
  {
    id: '3',
    title: 'मिट्टी का घड़ा',
    artisan: 'कमला बाई',
    price: '₹450',
    date: '19 मई 2025',
    image: require('@/assets/images/cust_prod_clay.png'),
  },
];

export default function WebHelperDashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang, setSelectedLang] = useGlobalLang();
  const [activeMenuIndex, setActiveMenuIndex] = useState(0);

  const t = TRANSLATIONS_HELPER[selectedLang as keyof typeof TRANSLATIONS_HELPER];
  const isHindi = selectedLang === 'hi';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          {/* Left District Location Dropdown */}
          <TouchableOpacity style={styles.districtLocationDropdownBtn} activeOpacity={0.8}>
            <Ionicons name="location-outline" size={16} color="#444444" style={{ marginRight: 6 }} />
            <Text style={styles.districtLocationText}>{t.districtLabel}</Text>
          </TouchableOpacity>

          {/* Right Header Controls (Notification Bell & User Badge) */}
          <View style={styles.headerRightActions}>

            {/* Notification Bell */}
            <TouchableOpacity style={styles.notificationBellBtn}>
              <Ionicons name="notifications-outline" size={20} color="#333333" />
              <View style={styles.bellBadgeCircle}>
                <Text style={styles.bellBadgeText}>3</Text>
              </View>
            </TouchableOpacity>

            {/* Helper User Badge Dropdown */}
            <TouchableOpacity style={styles.helperProfileBadgeBtn}>
              <View style={styles.helperAvatarCircle}>
                <Text style={styles.helperAvatarText}>RK</Text>
              </View>
              <View style={{ gap: 1 }}>
                <Text style={styles.helperNameText}>{t.userName}</Text>
                <Text style={styles.helperRoleSubText}>{t.helperRole}</Text>
              </View>
              <Ionicons name="chevron-down" size={14} color="#666666" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main 2-Column Layout */}
        <View style={styles.mainLayoutRow}>
          {/* Left Helper Sidebar Navigation */}
          {isDesktop && (
            <View style={styles.sidebarCol}>
              <View style={styles.sidebarTopGroup}>
                {/* KalaSetu Logo & Sub-label */}
                <View style={styles.sidebarHeaderBrand}>
                  <TouchableOpacity onPress={() => setActiveMenuIndex(0)}>
                    <Image
                      source={require('@/assets/images/logo_icon.png')}
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <View style={styles.subBrandTag}>
                    <Text style={styles.subBrandTagText}>जिला सहायता केंद्र</Text>
                  </View>
                </View>

                {/* Navigation Menu */}
                <View style={styles.sidebarMenuGroup}>
                  {/* 1. डैशबोर्ड */}
                  <TouchableOpacity
                    style={[styles.sidebarNavItem, activeMenuIndex === 0 && styles.sidebarNavItemActive]}
                    onPress={() => setActiveMenuIndex(0)}
                  >
                    <Ionicons name="home-outline" size={18} color={activeMenuIndex === 0 ? '#2E7D32' : '#555555'} style={{ marginRight: 12 }} />
                    <Text style={[styles.sidebarNavText, activeMenuIndex === 0 && styles.sidebarNavTextActive]}>{t.dashboard}</Text>
                  </TouchableOpacity>

                  {/* 2. नया कारीगर जोड़ें */}
                  <TouchableOpacity
                    style={[styles.sidebarNavItem, activeMenuIndex === 1 && styles.sidebarNavItemActive]}
                    onPress={() => router.push('/web-add-artisan')}
                  >
                    <Ionicons name="person-add-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.addArtisan}</Text>
                  </TouchableOpacity>

                  {/* 3. उत्पाद पोस्ट करें */}
                  <TouchableOpacity
                    style={[styles.sidebarNavItem, activeMenuIndex === 2 && styles.sidebarNavItemActive]}
                    onPress={() => router.push('/web-post-product')}
                  >
                    <Ionicons name="cube-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.postProduct}</Text>
                  </TouchableOpacity>

                  {/* 4. कारीगर देखें */}
                  <TouchableOpacity
                    style={[styles.sidebarNavItem, activeMenuIndex === 3 && styles.sidebarNavItemActive]}
                    onPress={() => router.push('/web-view-artisans')}
                  >
                    <Ionicons name="people-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.viewArtisans}</Text>
                  </TouchableOpacity>

                  {/* 5. मेरी पोस्ट */}
                  <TouchableOpacity
                    style={[styles.sidebarNavItem, activeMenuIndex === 4 && styles.sidebarNavItemActive]}
                    onPress={() => router.push('/web-my-posts')}
                  >
                    <Ionicons name="document-text-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.myPosts}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bottom Sidebar Group */}
              <View style={styles.sidebarBottomGroup}>
                <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-helper-profile')}>
                  <Ionicons name="person-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                  <Text style={styles.sidebarNavText}>{t.myProfile}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-login')}>
                  <Ionicons name="log-out-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                  <Text style={styles.sidebarNavText}>{t.logout}</Text>
                </TouchableOpacity>

                {/* Sidebar Bottom Help Card */}
                <View style={styles.sidebarHelpCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <Ionicons name="headset-outline" size={16} color="#333333" style={{ marginRight: 6 }} />
                    <Text style={styles.sidebarHelpTitle}>{t.helpNeededTitle}</Text>
                  </View>
                  <Text style={styles.sidebarHelpSub}>{t.helpNeededSub}</Text>

                  <TouchableOpacity
                    style={styles.sidebarHelpOutlineBtn}
                    onPress={() => router.push('/web-help')}
                  >
                    <Text style={styles.sidebarHelpOutlineBtnText}>{t.helpCenterBtn}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Right Main Dashboard Content */}
          <ScrollView style={styles.mainScrollView} contentContainerStyle={styles.scrollContentContainer} showsVerticalScrollIndicator={false}>
            {/* 1. Welcome Greeting Banner Card */}
            <View style={styles.welcomeBannerCard}>
              <View style={{ flex: 1, paddingRight: 20 }}>
                <Text style={styles.greetingTitleText}>{t.welcomeGreeting}</Text>
                <Text style={styles.subHeaderTitleText}>{t.subHeaderTitle}</Text>
                <Text style={styles.bannerDescText}>{t.bannerDesc}</Text>
              </View>

              {/* Banner Right Illustration Graphic */}
              <View style={styles.bannerGraphicIllustrationWrapper}>
                <View style={styles.villageHouseSvgCard}>
                  <Text style={styles.villageHouseTagText}>सहायता केंद्र</Text>
                  <View style={styles.potsRow}>
                    <Text style={{ fontSize: 28 }}>🏺</Text>
                    <Text style={{ fontSize: 24 }}>🧺</Text>
                    <Text style={{ fontSize: 26 }}>🪴</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 2. 4 Metric Summary Cards Row */}
            <View style={styles.metricsCardsRow}>
              {/* Card 1: Total Artisans */}
              <View style={styles.metricCard}>
                <View style={styles.metricIconCircleGreen}>
                  <Ionicons name="people" size={22} color="#2E7D32" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metricLabelText}>{t.statArtisans}</Text>
                  <Text style={styles.metricValueText}>248</Text>
                  <Text style={styles.metricSubGreenText}>{t.statArtisansSub}</Text>
                </View>
              </View>

              {/* Card 2: Total Posted Products */}
              <View style={styles.metricCard}>
                <View style={styles.metricIconCircleOrange}>
                  <Ionicons name="cube" size={22} color="#E65100" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metricLabelText}>{t.statProducts}</Text>
                  <Text style={styles.metricValueText}>516</Text>
                  <Text style={styles.metricSubGreenText}>{t.statProductsSub}</Text>
                </View>
              </View>

              {/* Card 3: Live Products */}
              <View style={styles.metricCard}>
                <View style={styles.metricIconCircleBlue}>
                  <Ionicons name="checkmark-circle" size={22} color="#0288D1" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metricLabelText}>{t.statLive}</Text>
                  <Text style={styles.metricValueText}>452</Text>
                  <Text style={styles.metricSubGreenText}>{t.statLiveSub}</Text>
                </View>
              </View>

              {/* Card 4: Total Views */}
              <View style={styles.metricCard}>
                <View style={styles.metricIconCirclePurple}>
                  <Ionicons name="eye" size={22} color="#7B1FA2" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.metricLabelText}>{t.statViews}</Text>
                  <Text style={styles.metricValueText}>12,860</Text>
                  <Text style={styles.metricSubGreenText}>{t.statViewsSub}</Text>
                </View>
              </View>
            </View>

            {/* 3. 2 Primary Quick Action Cards Row */}
            <View style={styles.quickActionsRow}>
              {/* Action Card 1: Add New Artisan */}
              <View style={[styles.actionCard, { backgroundColor: '#F2F9F2', borderColor: '#C8E6C9' }]}>
                <View style={styles.actionIconCircleGreen}>
                  <Ionicons name="person-add" size={24} color="#2E7D32" />
                </View>

                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.actionCardTitleText}>{t.actionAddArtisanTitle}</Text>
                  <Text style={styles.actionCardDescText}>{t.actionAddArtisanDesc}</Text>

                  <TouchableOpacity
                    style={styles.addArtisanGreenBtn}
                    onPress={() => router.push('/web-add-artisan')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addArtisanGreenBtnText}>{t.actionAddArtisanBtn}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Action Card 2: Post Product */}
              <View style={[styles.actionCard, { backgroundColor: '#FFF8F0', borderColor: '#FFE0B2' }]}>
                <View style={styles.actionIconCircleOrange}>
                  <Ionicons name="cube" size={24} color="#E65100" />
                </View>

                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.actionCardTitleText}>{t.actionPostProductTitle}</Text>
                  <Text style={styles.actionCardDescText}>{t.actionPostProductDesc}</Text>

                  <TouchableOpacity
                    style={styles.postProductOrangeBtn}
                    onPress={() => router.push('/web-post-product')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.postProductOrangeBtnText}>{t.actionPostProductBtn}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 4. Recent Activity Tables / Columns Row */}
            <View style={styles.recentActivityTablesRow}>
              {/* Left Column: Recent Artisans Added */}
              <View style={styles.activityCardCol}>
                <View style={styles.activityCardHeader}>
                  <Text style={styles.activityCardTitle}>{t.recentArtisansTitle}</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAllGreenLink}>{t.seeAll}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.activityListGroup}>
                  {RECENT_ARTISANS.map((artisan) => (
                    <View style={styles.artisanRowItem} key={artisan.id}>
                      <View style={[styles.artisanAvatarCircle, { backgroundColor: artisan.avatarBg }]}>
                        <Text style={[styles.artisanAvatarText, { color: artisan.avatarColor }]}>
                          {artisan.avatarInitials}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.artisanNameText}>{artisan.name}</Text>
                        <Text style={styles.artisanSubText}>{artisan.village}</Text>
                      </View>

                      <View style={{ alignItems: 'center' }}>
                        <Text style={styles.craftLabelText}>कला/काम</Text>
                        <Text style={styles.craftValueText}>{artisan.craft}</Text>
                      </View>

                      <View style={{ alignItems: 'flex-end', minWidth: 90 }}>
                        <Text style={styles.craftLabelText}>जुड़ने की तारीख</Text>
                        <Text style={styles.craftValueText}>{artisan.date}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.bottomSeeAllBtnRow}>
                  <Text style={styles.bottomSeeAllBtnText}>{t.seeAllArtisansBtn}</Text>
                </TouchableOpacity>
              </View>

              {/* Right Column: Recent Products Posted */}
              <View style={styles.activityCardCol}>
                <View style={styles.activityCardHeader}>
                  <Text style={styles.activityCardTitle}>{t.recentProductsTitle}</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAllGreenLink}>{t.seeAll}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.activityListGroup}>
                  {RECENT_PRODUCTS.map((prod) => (
                    <View style={styles.productRowItem} key={prod.id}>
                      <Image source={prod.image} style={styles.productThumbnailImage} resizeMode="contain" />

                      <View style={{ flex: 1 }}>
                        <Text style={styles.productNameText}>{prod.title}</Text>
                        <Text style={styles.artisanSubText}>कारीगर: {prod.artisan}</Text>
                      </View>

                      <View style={{ alignItems: 'center' }}>
                        <Text style={styles.craftLabelText}>कीमत</Text>
                        <Text style={styles.priceValueText}>{prod.price}</Text>
                      </View>

                      <View style={{ alignItems: 'center', minWidth: 90 }}>
                        <Text style={styles.craftLabelText}>पोस्ट की तारीख</Text>
                        <Text style={styles.craftValueText}>{prod.date}</Text>
                      </View>

                      <View style={styles.livePillBadge}>
                        <Text style={styles.livePillBadgeText}>{t.liveBadge}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.bottomSeeAllBtnRow}>
                  <Text style={styles.bottomSeeAllBtnText}>{t.seeAllProductsBtn}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 5. Footer Bar */}
            <View style={styles.footerBarRow}>
              <Text style={styles.footerLeftText}>🛡️ {t.footerLeft}</Text>
              <Text style={styles.footerRightText}>{t.footerRight}</Text>
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#EBEBEB',
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  districtLocationDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  districtLocationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  langSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    padding: 2,
  },
  langSegmentBtn: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  langSegmentBtnActive: {
    backgroundColor: '#E65100',
  },
  langSegmentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555555',
  },
  langSegmentTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  notificationBellBtn: {
    position: 'relative',
    padding: 4,
  },
  bellBadgeCircle: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: '#C62828',
    borderRadius: 8,
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  helperProfileBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  helperAvatarCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  helperAvatarText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  helperNameText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  helperRoleSubText: {
    fontSize: 10,
    color: '#666666',
  },

  /* Main Layout */
  mainLayoutRow: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarCol: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderColor: '#EBEBEB',
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  sidebarHeaderBrand: {
    paddingHorizontal: 8,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  logoImage: {
    width: 150,
    height: 44,
  },
  subBrandTag: {
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginTop: 2,
  },
  subBrandTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  sidebarTopGroup: {
    gap: 4,
  },
  sidebarBottomGroup: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    gap: 8,
  },
  sidebarHelpCard: {
    backgroundColor: '#FAF8F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 12,
    marginTop: 8,
  },
  sidebarHelpTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  sidebarHelpSub: {
    fontSize: 10,
    color: '#777777',
    marginBottom: 8,
  },
  sidebarHelpOutlineBtn: {
    borderWidth: 1,
    borderColor: '#2E7D32',
    borderRadius: 6,
    paddingVertical: 4,
    alignItems: 'center',
  },
  sidebarHelpOutlineBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  sidebarMenuGroup: {
    gap: 4,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  sidebarNavItemActive: {
    backgroundColor: '#E8F5E9',
  },
  sidebarNavText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
  },
  sidebarNavTextActive: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },

  /* Scroll Body */
  mainScrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 24,
    gap: 20,
  },

  /* Welcome Banner */
  welcomeBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E0D8',
    padding: 24,
  },
  greetingTitleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subHeaderTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 2,
  },
  bannerDescText: {
    fontSize: 13,
    color: '#666666',
    marginTop: 6,
    lineHeight: 18,
  },
  bannerGraphicIllustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  villageHouseSvgCard: {
    backgroundColor: '#FFF8F0',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 6,
  },
  villageHouseTagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D84315',
    backgroundColor: '#FFE0B2',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  potsRow: {
    flexDirection: 'row',
    gap: 6,
  },

  /* Metrics Cards Row */
  metricsCardsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metricCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 16,
    gap: 12,
  },
  metricIconCircleGreen: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricIconCircleOrange: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricIconCircleBlue: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E1F5FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricIconCirclePurple: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3E5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabelText: {
    fontSize: 12,
    color: '#666666',
  },
  metricValueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginVertical: 2,
  },
  metricSubGreenText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2E7D32',
  },

  /* Quick Actions Row */
  quickActionsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  actionCard: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  actionIconCircleGreen: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconCircleOrange: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCardTitleText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  actionCardDescText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 10,
  },
  addArtisanGreenBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  addArtisanGreenBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  postProductOrangeBtn: {
    backgroundColor: '#D84315',
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  postProductOrangeBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /* Recent Activity Tables */
  recentActivityTablesRow: {
    flexDirection: 'row',
    gap: 20,
  },
  activityCardCol: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 20,
    gap: 16,
  },
  activityCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 10,
  },
  activityCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  seeAllGreenLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  activityListGroup: {
    gap: 12,
  },
  artisanRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  artisanAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artisanAvatarText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  artisanNameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  artisanSubText: {
    fontSize: 11,
    color: '#777777',
  },
  craftLabelText: {
    fontSize: 10,
    color: '#888888',
  },
  craftValueText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333333',
  },
  productRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  productThumbnailImage: {
    width: 38,
    height: 38,
    borderRadius: 6,
  },
  productNameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  priceValueText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  livePillBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  livePillBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  bottomSeeAllBtnRow: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  bottomSeeAllBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  /* Footer */
  footerBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    paddingTop: 16,
    marginTop: 10,
  },
  footerLeftText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444444',
  },
  footerRightText: {
    fontSize: 12,
    color: '#888888',
  },
});
