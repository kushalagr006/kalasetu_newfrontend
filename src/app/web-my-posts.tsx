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

const TRANSLATIONS_MY_POSTS = {
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
    breadcrumb: 'डैशबोर्ड > मेरी पोस्ट',
    pageTitle: 'मेरी पोस्ट की गई सूची',
    pageSubtitle: 'सहायता केंद्र द्वारा पोस्ट किए गए सभी उत्पादों का प्रबंधन करें।',
    postProductBtn: '+ नया उत्पाद पोस्ट करें',
    tabAll: 'सभी पोस्ट (516)',
    tabLive: 'लाइव (452)',
    tabReview: 'समीक्षाधीन (44)',
    tabDraft: 'ड्राफ्ट (20)',
    searchPlaceholder: 'उत्पाद का नाम या कारीगर खोजें...',
    liveBadge: 'लाइव',
    reviewBadge: 'समीक्षाधीन',
    viewsCount: 'व्यूज़',
    editBtn: 'संपादन',
    deleteBtn: 'हटाएं',
    viewBtn: 'देखें',
    footerLeft: '© 2025 कलासेतु | जिला सहायता केंद्र पोर्टल',
    footerRight: 'संस्करण 1.0.0',
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
    breadcrumb: 'Dashboard > My Posts',
    pageTitle: 'My Posted Products',
    pageSubtitle: 'Manage all craft products posted by your helpdesk center.',
    postProductBtn: '+ Post New Product',
    tabAll: 'All Posts (516)',
    tabLive: 'Live (452)',
    tabReview: 'Under Review (44)',
    tabDraft: 'Drafts (20)',
    searchPlaceholder: 'Search product name or artisan...',
    liveBadge: 'Live',
    reviewBadge: 'Under Review',
    viewsCount: 'Views',
    editBtn: 'Edit',
    deleteBtn: 'Delete',
    viewBtn: 'View',
    footerLeft: '© 2025 KalaSetu | District Helpdesk Portal',
    footerRight: 'Version 1.0.0',
  },
};

interface ProductPostRecord {
  id: string;
  prodName: string;
  prodNameEn: string;
  artisanName: string;
  artisanNameEn: string;
  village: string;
  villageEn: string;
  category: string;
  categoryEn: string;
  price: string;
  date: string;
  views: number;
  status: 'live' | 'review';
  icon: keyof typeof Ionicons.glyphMap;
}

const POSTS_LIST: ProductPostRecord[] = [
  {
    id: '1',
    prodName: 'हस्तनिर्मित बाँस की टोकरी (सैट ऑफ 3)',
    prodNameEn: 'Handmade Bamboo Basket (Set of 3)',
    artisanName: 'सुनीता देवी',
    artisanNameEn: 'Sunita Devi',
    village: 'खरोरा, रायपुर',
    villageEn: 'Kharora, Raipur',
    category: 'बाँस क्राफ्ट',
    categoryEn: 'Bamboo Craft',
    price: '₹650',
    date: '28 Feb 2025',
    views: 1420,
    status: 'live',
    icon: 'basket-outline',
  },
  {
    id: '2',
    prodName: 'सागौन लकड़ी की तराशी हुई कुर्सी',
    prodNameEn: 'Teak Wood Hand-carved Chair',
    artisanName: 'रामेश साहू',
    artisanNameEn: 'Ramesh Sahu',
    village: 'तिल्दा, रायपुर',
    villageEn: 'Tilda, Raipur',
    category: 'काष्ठ कला',
    categoryEn: 'Wood Carving',
    price: '₹2,200',
    date: '26 Feb 2025',
    views: 890,
    status: 'live',
    icon: 'bed-outline',
  },
  {
    id: '3',
    prodName: 'पारंपरिक मिट्टी का मटका (जल पात्र)',
    prodNameEn: 'Terracotta Water Pot',
    artisanName: 'कमला बाई',
    artisanNameEn: 'Kamla Bai',
    village: 'भाटागांव, रायपुर',
    villageEn: 'Bhatgaon, Raipur',
    category: 'टेराकोटा',
    categoryEn: 'Terracotta',
    price: '₹450',
    date: '24 Feb 2025',
    views: 2150,
    status: 'live',
    icon: 'color-fill-outline',
  },
  {
    id: '4',
    prodName: 'बेल मेटल जनजातीय मुखौटा',
    prodNameEn: 'Bell Metal Tribal Mask',
    artisanName: 'विनय लकड़ा',
    artisanNameEn: 'Vinay Lakra',
    village: 'अभनपुर, रायपुर',
    villageEn: 'Abhanpur, Raipur',
    category: 'ढोकरा आर्ट',
    categoryEn: 'Dhokra Art',
    price: '₹1,850',
    date: '22 Feb 2025',
    views: 310,
    status: 'review',
    icon: 'aperture-outline',
  },
  {
    id: '5',
    prodName: 'हाथ से बुना कोसा सिल्क दुपट्टा',
    prodNameEn: 'Handwoven Kosa Silk Dupatta',
    artisanName: 'मीना साहू',
    artisanNameEn: 'Meena Sahu',
    village: 'आरंग, रायपुर',
    villageEn: 'Arang, Raipur',
    category: 'हथकरघा सिल्क',
    categoryEn: 'Handloom Silk',
    price: '₹3,400',
    date: '20 Feb 2025',
    views: 1780,
    status: 'live',
    icon: 'shirt-outline',
  },
];

export default function WebMyPostsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang, setSelectedLang] = useGlobalLang();
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'review'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const t = TRANSLATIONS_MY_POSTS[selectedLang as keyof typeof TRANSLATIONS_MY_POSTS] || TRANSLATIONS_MY_POSTS.en;
  const isHindi = selectedLang === 'hi';

  const filteredPosts = POSTS_LIST.filter((post) => {
    if (activeTab === 'live' && post.status !== 'live') return false;
    if (activeTab === 'review' && post.status !== 'review') return false;

    const term = searchQuery.toLowerCase();
    const prod = isHindi ? post.prodName : post.prodNameEn;
    const art = isHindi ? post.artisanName : post.artisanNameEn;
    return prod.toLowerCase().includes(term) || art.toLowerCase().includes(term);
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.districtLocationDropdownBtn} activeOpacity={0.8}>
            <Ionicons name="location-outline" size={16} color="#444444" style={{ marginRight: 6 }} />
            <Text style={styles.districtLocationText}>{t.districtLabel}</Text>
          </TouchableOpacity>

          <View style={styles.headerRightActions}>

            <TouchableOpacity style={styles.notificationBellBtn}>
              <Ionicons name="notifications-outline" size={20} color="#333333" />
              <View style={styles.bellBadgeCircle}>
                <Text style={styles.bellBadgeText}>3</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.helperProfileBadgeBtn} onPress={() => router.push('/web-helper-profile')}>
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
                <View style={styles.sidebarHeaderBrand}>
                  <TouchableOpacity onPress={() => router.push('/web-helper')}>
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

                <View style={styles.sidebarMenuGroup}>
                  <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-helper')}>
                    <Ionicons name="home-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.dashboard}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-add-artisan')}>
                    <Ionicons name="person-add-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.addArtisan}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-post-product')}>
                    <Ionicons name="cube-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.postProduct}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-view-artisans')}>
                    <Ionicons name="people-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.viewArtisans}</Text>
                  </TouchableOpacity>

                  {/* Active 5. मेरी पोस्ट */}
                  <TouchableOpacity style={[styles.sidebarNavItem, styles.sidebarNavItemActive]}>
                    <Ionicons name="document-text" size={18} color="#2E7D32" style={{ marginRight: 12 }} />
                    <Text style={[styles.sidebarNavText, styles.sidebarNavTextActive]}>{t.myPosts}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.sidebarBottomGroup}>
                <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-helper-profile')}>
                  <Ionicons name="person-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                  <Text style={styles.sidebarNavText}>{t.myProfile}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-login')}>
                  <Ionicons name="log-out-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                  <Text style={styles.sidebarNavText}>{t.logout}</Text>
                </TouchableOpacity>

                <View style={styles.sidebarHelpCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <Ionicons name="headset-outline" size={16} color="#333333" style={{ marginRight: 6 }} />
                    <Text style={styles.sidebarHelpTitle}>{t.helpNeededTitle}</Text>
                  </View>
                  <Text style={styles.sidebarHelpSub}>{t.helpNeededSub}</Text>

                  <TouchableOpacity style={styles.sidebarHelpOutlineBtn} onPress={() => router.push('/web-help')}>
                    <Text style={styles.sidebarHelpOutlineBtnText}>{t.helpCenterBtn}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Right Main Content */}
          <ScrollView style={styles.mainScrollView} contentContainerStyle={styles.scrollContentContainer} showsVerticalScrollIndicator={false}>
            {/* Header Title & Action Button */}
            <View style={styles.headerTitleRow}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <TouchableOpacity onPress={() => router.push('/web-helper')} activeOpacity={0.7}>
                    <Text style={[styles.breadcrumbText, { color: '#2E7D32', fontWeight: 'bold' }]}>
                      {isHindi ? 'डैशबोर्ड' : 'Dashboard'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.breadcrumbText}> {'>'} {isHindi ? 'मेरी पोस्ट' : 'My Posts'}</Text>
                </View>

                <Text style={styles.pageTitleText}>{t.pageTitle}</Text>
                <Text style={styles.pageSubtitleText}>{t.pageSubtitle}</Text>
              </View>

              <TouchableOpacity style={styles.postProductHeaderBtn} onPress={() => router.push('/web-post-product')}>
                <Text style={styles.postProductHeaderBtnText}>{t.postProductBtn}</Text>
              </TouchableOpacity>
            </View>

            {/* Filter Tabs Bar */}
            <View style={styles.filterTabsRow}>
              <TouchableOpacity
                style={[styles.filterTabBtn, activeTab === 'all' && styles.filterTabBtnActive]}
                onPress={() => setActiveTab('all')}
              >
                <Text style={[styles.filterTabText, activeTab === 'all' && styles.filterTabTextActive]}>{t.tabAll}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterTabBtn, activeTab === 'live' && styles.filterTabBtnActive]}
                onPress={() => setActiveTab('live')}
              >
                <Text style={[styles.filterTabText, activeTab === 'live' && styles.filterTabTextActive]}>{t.tabLive}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterTabBtn, activeTab === 'review' && styles.filterTabBtnActive]}
                onPress={() => setActiveTab('review')}
              >
                <Text style={[styles.filterTabText, activeTab === 'review' && styles.filterTabTextActive]}>{t.tabReview}</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input Box */}
            <View style={styles.searchBarBox}>
              <Ionicons name="search-outline" size={20} color="#777777" style={{ marginRight: 10 }} />
              <TextInput
                placeholder={t.searchPlaceholder}
                placeholderTextColor="#999999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInputFlex}
              />
            </View>

            {/* Posts Cards Grid */}
            <View style={styles.postsListGrid}>
              {filteredPosts.map((post) => (
                <View key={post.id} style={styles.postCardRow}>
                  {/* Thumbnail */}
                  <View style={styles.postThumbBox}>
                    <Ionicons name={post.icon} size={28} color="#2E7D32" />
                  </View>

                  {/* Main Product Info */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <Text style={styles.postTitleText}>{isHindi ? post.prodName : post.prodNameEn}</Text>
                      <View
                        style={[
                          styles.statusBadgePill,
                          post.status === 'live' ? styles.statusLivePill : styles.statusReviewPill,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            post.status === 'live' ? styles.statusLiveText : styles.statusReviewText,
                          ]}
                        >
                          {post.status === 'live' ? t.liveBadge : t.reviewBadge}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.postSubArtisan}>
                      {isHindi ? 'कारीगर: ' : 'Artisan: '}{isHindi ? post.artisanName : post.artisanNameEn} ({isHindi ? post.village : post.villageEn})
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 6 }}>
                      <Text style={styles.categoryPillText}>{isHindi ? post.category : post.categoryEn}</Text>
                      <Text style={styles.priceTagText}>{post.price}</Text>
                      <Text style={styles.dateMetaText}>{post.date}</Text>
                      <Text style={styles.viewsMetaText}>👁️ {post.views} {t.viewsCount}</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.postActionsCol}>
                    <TouchableOpacity style={styles.actionIconBtn}>
                      <Ionicons name="create-outline" size={18} color="#1976D2" />
                      <Text style={[styles.actionIconBtnText, { color: '#1976D2' }]}>{t.editBtn}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionIconBtn}>
                      <Ionicons name="trash-outline" size={18} color="#D32F2F" />
                      <Text style={[styles.actionIconBtnText, { color: '#D32F2F' }]}>{t.deleteBtn}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Footer Bar */}
            <View style={styles.footerBarRow}>
              <Text style={styles.footerLeftText}>{t.footerLeft}</Text>
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
  mainScrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 24,
    gap: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  breadcrumbText: {
    fontSize: 12,
    color: '#777777',
  },
  pageTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 2,
  },
  pageSubtitleText: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  postProductHeaderBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  postProductHeaderBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filterTabsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  filterTabBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  filterTabBtnActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  filterTabTextActive: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 42,
  },
  searchInputFlex: {
    flex: 1,
    fontSize: 13,
    color: '#333333',
  },
  postsListGrid: {
    gap: 12,
  },
  postCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 16,
    gap: 16,
  },
  postThumbBox: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#F2F9F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  postSubArtisan: {
    fontSize: 12,
    color: '#666666',
  },
  statusBadgePill: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  statusLivePill: {
    backgroundColor: '#E8F5E9',
  },
  statusReviewPill: {
    backgroundColor: '#FFF3E0',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusLiveText: {
    color: '#2E7D32',
  },
  statusReviewText: {
    color: '#E65100',
  },
  categoryPillText: {
    fontSize: 11,
    color: '#555555',
    backgroundColor: '#F5F5F5',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  priceTagText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  dateMetaText: {
    fontSize: 11,
    color: '#888888',
  },
  viewsMetaText: {
    fontSize: 11,
    color: '#666666',
  },
  postActionsCol: {
    flexDirection: 'row',
    gap: 12,
  },
  actionIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
  },
  actionIconBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
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
    color: '#777777',
  },
  footerRightText: {
    fontSize: 12,
    color: '#888888',
  },
});
