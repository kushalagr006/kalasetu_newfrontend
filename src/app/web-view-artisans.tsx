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

const TRANSLATIONS_VIEW_ARTISANS = {
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
    breadcrumb: 'डैशबोर्ड > कारीगर देखें',
    pageTitle: 'जिला के पंजीकृत कारीगर',
    pageSubtitle: 'रायपुर जिले के सभी पंजीकृत कारीगरों की सूची और विवरण प्रबंधित करें।',
    addArtisanBtn: '+ नया कारीगर जोड़ें',
    searchPlaceholder: 'कारीगर का नाम, गांव या कला खोजें...',
    statTotal: 'कुल कारीगर',
    statActive: 'सक्रिय कारीगर',
    statPending: 'समीक्षाधीन',
    statCrafts: 'प्रमुख कलाएं',
    activeBadge: 'सक्रिय',
    pendingBadge: 'समीक्षाधीन',
    viewProfileBtn: 'प्रोफाइल देखें',
    addProdBtn: '+ उत्पाद जोड़ें',
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
    breadcrumb: 'Dashboard > View Artisans',
    pageTitle: 'District Registered Artisans',
    pageSubtitle: 'Manage list and details of all registered artisans in Raipur district.',
    addArtisanBtn: '+ Add New Artisan',
    searchPlaceholder: 'Search artisan name, village or craft...',
    statTotal: 'Total Artisans',
    statActive: 'Active Artisans',
    statPending: 'Under Review',
    statCrafts: 'Major Crafts',
    activeBadge: 'Active',
    pendingBadge: 'Under Review',
    viewProfileBtn: 'View Profile',
    addProdBtn: '+ Add Product',
    footerLeft: '© 2025 KalaSetu | District Helpdesk Portal',
    footerRight: 'Version 1.0.0',
  },
};

interface ArtisanRecord {
  id: string;
  name: string;
  nameEn: string;
  village: string;
  villageEn: string;
  craft: string;
  craftEn: string;
  mobile: string;
  productsCount: number;
  regDate: string;
  status: 'active' | 'pending';
  avatarText: string;
}

const ARTISANS_LIST: ArtisanRecord[] = [
  {
    id: '1',
    name: 'सुनीता देवी',
    nameEn: 'Sunita Devi',
    village: 'ग्राम: खरोरा, रायपुर',
    villageEn: 'Village: Kharora, Raipur',
    craft: 'बाँस हस्तशिल्प',
    craftEn: 'Bamboo Craft',
    mobile: '+91 98765 12345',
    productsCount: 14,
    regDate: '12 Jan 2025',
    status: 'active',
    avatarText: 'SD',
  },
  {
    id: '2',
    name: 'रामेश साहू',
    nameEn: 'Ramesh Sahu',
    village: 'ग्राम: तिल्दा, रायपुर',
    villageEn: 'Village: Tilda, Raipur',
    craft: 'काष्ठ कला (लकड़ी तराशना)',
    craftEn: 'Wood Carving',
    mobile: '+91 98271 88492',
    productsCount: 9,
    regDate: '28 Jan 2025',
    status: 'active',
    avatarText: 'RS',
  },
  {
    id: '3',
    name: 'कमला बाई',
    nameEn: 'Kamla Bai',
    village: 'ग्राम: भाटागांव, रायपुर',
    villageEn: 'Village: Bhatgaon, Raipur',
    craft: 'टेराकोटा मिट्टी कला',
    craftEn: 'Terracotta Pottery',
    mobile: '+91 99812 44310',
    productsCount: 22,
    regDate: '04 Feb 2025',
    status: 'active',
    avatarText: 'KB',
  },
  {
    id: '4',
    name: 'विनय लकड़ा',
    nameEn: 'Vinay Lakra',
    village: 'ग्राम: अभनपुर, रायपुर',
    villageEn: 'Village: Abhanpur, Raipur',
    craft: 'ढोकरा मेटल क्राफ्ट',
    craftEn: 'Dhokra Metal Craft',
    mobile: '+91 97554 33219',
    productsCount: 6,
    regDate: '18 Feb 2025',
    status: 'pending',
    avatarText: 'VL',
  },
  {
    id: '5',
    name: 'मीना साहू',
    nameEn: 'Meena Sahu',
    village: 'ग्राम: आरंग, रायपुर',
    villageEn: 'Village: Arang, Raipur',
    craft: 'कोसा सिल्क हथकरघा',
    craftEn: 'Kosa Silk Handloom',
    mobile: '+91 94255 11980',
    productsCount: 18,
    regDate: '22 Feb 2025',
    status: 'active',
    avatarText: 'MS',
  },
];

export default function WebViewArtisansScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang, setSelectedLang] = useGlobalLang();
  const [searchQuery, setSearchQuery] = useState('');

  const t = TRANSLATIONS_VIEW_ARTISANS[selectedLang as keyof typeof TRANSLATIONS_VIEW_ARTISANS] || TRANSLATIONS_VIEW_ARTISANS.en;
  const isHindi = selectedLang === 'hi';

  const filteredArtisans = ARTISANS_LIST.filter((art) => {
    const term = searchQuery.toLowerCase();
    const name = isHindi ? art.name : art.nameEn;
    const village = isHindi ? art.village : art.villageEn;
    const craft = isHindi ? art.craft : art.craftEn;
    return (
      name.toLowerCase().includes(term) ||
      village.toLowerCase().includes(term) ||
      craft.toLowerCase().includes(term)
    );
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

                  {/* Active 4. कारीगर देखें */}
                  <TouchableOpacity style={[styles.sidebarNavItem, styles.sidebarNavItemActive]}>
                    <Ionicons name="people" size={18} color="#2E7D32" style={{ marginRight: 12 }} />
                    <Text style={[styles.sidebarNavText, styles.sidebarNavTextActive]}>{t.viewArtisans}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-my-posts')}>
                    <Ionicons name="document-text-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.myPosts}</Text>
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
                  <Text style={styles.breadcrumbText}> {'>'} {isHindi ? 'कारीगर देखें' : 'View Artisans'}</Text>
                </View>

                <Text style={styles.pageTitleText}>{t.pageTitle}</Text>
                <Text style={styles.pageSubtitleText}>{t.pageSubtitle}</Text>
              </View>

              <TouchableOpacity style={styles.addArtisanHeaderBtn} onPress={() => router.push('/web-add-artisan')}>
                <Text style={styles.addArtisanHeaderBtnText}>{t.addArtisanBtn}</Text>
              </TouchableOpacity>
            </View>

            {/* 4 Summary Stat Cards */}
            <View style={styles.statsRowGrid}>
              <View style={styles.statCard}>
                <Ionicons name="people-outline" size={24} color="#2E7D32" />
                <View>
                  <Text style={styles.statNumberText}>248</Text>
                  <Text style={styles.statLabelText}>{t.statTotal}</Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#388E3C" />
                <View>
                  <Text style={styles.statNumberText}>210</Text>
                  <Text style={styles.statLabelText}>{t.statActive}</Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="time-outline" size={24} color="#E65100" />
                <View>
                  <Text style={styles.statNumberText}>38</Text>
                  <Text style={styles.statLabelText}>{t.statPending}</Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="color-palette-outline" size={24} color="#1976D2" />
                <View>
                  <Text style={styles.statNumberText}>12</Text>
                  <Text style={styles.statLabelText}>{t.statCrafts}</Text>
                </View>
              </View>
            </View>

            {/* Search Bar Row */}
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

            {/* Artisans List Grid */}
            <View style={styles.artisansGrid}>
              {filteredArtisans.map((artisan) => (
                <View key={artisan.id} style={styles.artisanCard}>
                  <View style={styles.artisanCardHeaderRow}>
                    <View style={styles.artisanAvatarCircleLarge}>
                      <Text style={styles.artisanAvatarTextLarge}>{artisan.avatarText}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.artisanCardName}>{isHindi ? artisan.name : artisan.nameEn}</Text>
                      <Text style={styles.artisanCardVillage}>{isHindi ? artisan.village : artisan.villageEn}</Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadgePill,
                        artisan.status === 'active' ? styles.statusActivePill : styles.statusPendingPill,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          artisan.status === 'active' ? styles.statusActiveText : styles.statusPendingText,
                        ]}
                      >
                        {artisan.status === 'active' ? t.activeBadge : t.pendingBadge}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.artisanDetailsDivider} />

                  <View style={styles.artisanInfoGrid}>
                    <View style={styles.infoColItem}>
                      <Text style={styles.infoLabelText}>{isHindi ? 'कला/कौशल' : 'Craft/Skill'}</Text>
                      <Text style={styles.infoValueText}>{isHindi ? artisan.craft : artisan.craftEn}</Text>
                    </View>

                    <View style={styles.infoColItem}>
                      <Text style={styles.infoLabelText}>{isHindi ? 'मोबाइल नंबर' : 'Mobile'}</Text>
                      <Text style={styles.infoValueText}>{artisan.mobile}</Text>
                    </View>

                    <View style={styles.infoColItem}>
                      <Text style={styles.infoLabelText}>{isHindi ? 'कुल पोस्ट उत्पाद' : 'Posted Products'}</Text>
                      <Text style={styles.infoValueTextHighlight}>{artisan.productsCount} {isHindi ? 'उत्पाद' : 'Products'}</Text>
                    </View>
                  </View>

                  {/* Card Action Buttons */}
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity style={styles.cardOutlineBtn}>
                      <Text style={styles.cardOutlineBtnText}>{t.viewProfileBtn}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cardSolidBtn}
                      onPress={() => router.push('/web-post-product')}
                    >
                      <Text style={styles.cardSolidBtnText}>{t.addProdBtn}</Text>
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
  addArtisanHeaderBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  addArtisanHeaderBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsRowGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 16,
    gap: 14,
  },
  statNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statLabelText: {
    fontSize: 11,
    color: '#777777',
    marginTop: 1,
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
  artisansGrid: {
    gap: 14,
  },
  artisanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 18,
    gap: 14,
  },
  artisanCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  artisanAvatarCircleLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artisanAvatarTextLarge: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  artisanCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  artisanCardVillage: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  statusBadgePill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusActivePill: {
    backgroundColor: '#E8F5E9',
  },
  statusPendingPill: {
    backgroundColor: '#FFF3E0',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusActiveText: {
    color: '#2E7D32',
  },
  statusPendingText: {
    color: '#E65100',
  },
  artisanDetailsDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  artisanInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoColItem: {
    gap: 2,
  },
  infoLabelText: {
    fontSize: 11,
    color: '#888888',
  },
  infoValueText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  infoValueTextHighlight: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cardOutlineBtn: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  cardOutlineBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
  },
  cardSolidBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  cardSolidBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
