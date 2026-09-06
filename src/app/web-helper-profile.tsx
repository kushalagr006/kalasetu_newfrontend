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

const TRANSLATIONS_HELPER_PROFILE = {
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
    breadcrumb: 'डैशबोर्ड > मेरा प्रोफाइल',
    pageTitle: 'सहायक अधिकारी प्रोफाइल',
    pageSubtitle: 'अपनी व्यक्तिगत जानकारी, जिला केंद्र और लॉगिन पासवर्ड प्रबंधित करें।',
    designation: 'वरिष्ठ जिला सहायक (Senior District Helper)',
    centerCodeLabel: 'केंद्र कोड:',
    centerCodeValue: 'DAC-CG-RPR-04 (रायपुर)',
    saveChangesBtn: 'बदलाव सहेजें',
    statArtisansOnboarded: 'कुल जोड़े गए कारीगर',
    statProductsPosted: 'कुल पोस्ट उत्पाद',
    statSalesDriven: 'कुल जिला बिक्री सहायता',
    statActivityRating: 'पोर्टल गतिविधि रेटिंग',
    personalTab: 'व्यक्तिगत जानकारी',
    centerTab: 'जिला केंद्र विवरण',
    securityTab: 'सुरक्षा और पासवर्ड',
    fullNameLabel: 'पूरा नाम',
    mobileLabel: 'मोबाइल नंबर',
    emailLabel: 'सरकारी ईमेल',
    districtLabelField: 'जिला / राज्य',
    officeAddressLabel: 'कार्यालय पता',
    saveSuccessMsg: 'प्रोफाइल की जानकारी सफलतापूर्वक अपडेट की गई!',
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
    breadcrumb: 'Dashboard > My Profile',
    pageTitle: 'Helper Profile',
    pageSubtitle: 'Manage personal details, district center info and credentials.',
    designation: 'Senior District Helper',
    centerCodeLabel: 'Center Code:',
    centerCodeValue: 'DAC-CG-RPR-04 (Raipur)',
    saveChangesBtn: 'Save Changes',
    statArtisansOnboarded: 'Artisans Onboarded',
    statProductsPosted: 'Products Posted',
    statSalesDriven: 'District Sales Facilitated',
    statActivityRating: 'Activity Rating',
    personalTab: 'Personal Info',
    centerTab: 'District Center Info',
    securityTab: 'Security & Password',
    fullNameLabel: 'Full Name',
    mobileLabel: 'Mobile Number',
    emailLabel: 'Govt Email',
    districtLabelField: 'District / State',
    officeAddressLabel: 'Office Address',
    saveSuccessMsg: 'Profile updated successfully!',
    footerLeft: '© 2025 KalaSetu | District Helpdesk Portal',
    footerRight: 'Version 1.0.0',
  },
};

export default function WebHelperProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang, setSelectedLang] = useGlobalLang();
  const [activeTab, setActiveTab] = useState<'personal' | 'center' | 'security'>('personal');

  // Form States
  const [name, setName] = useState('राजेश कुमार');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [email, setEmail] = useState('rajesh.kumar@cg.gov.in');
  const [office, setOffice] = useState('जिला पंचायत परिसर, कलेक्ट्रेट रोड, रायपुर (छ.ग.)');

  const t = TRANSLATIONS_HELPER_PROFILE[selectedLang as keyof typeof TRANSLATIONS_HELPER_PROFILE];
  const isHindi = selectedLang === 'hi';

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

                  <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-my-posts')}>
                    <Ionicons name="document-text-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.myPosts}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.sidebarBottomGroup}>
                {/* Active 6. मेरा प्रोफाइल */}
                <TouchableOpacity style={[styles.sidebarNavItem, styles.sidebarNavItemActive]}>
                  <Ionicons name="person" size={18} color="#2E7D32" style={{ marginRight: 12 }} />
                  <Text style={[styles.sidebarNavText, styles.sidebarNavTextActive]}>{t.myProfile}</Text>
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
            {/* Header Title Section */}
            <View style={styles.headerTitleRow}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <TouchableOpacity onPress={() => router.push('/web-helper')} activeOpacity={0.7}>
                    <Text style={[styles.breadcrumbText, { color: '#2E7D32', fontWeight: 'bold' }]}>
                      {isHindi ? 'डैशबोर्ड' : 'Dashboard'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.breadcrumbText}> {'>'} {isHindi ? 'मेरा प्रोफाइल' : 'My Profile'}</Text>
                </View>

                <Text style={styles.pageTitleText}>{t.pageTitle}</Text>
                <Text style={styles.pageSubtitleText}>{t.pageSubtitle}</Text>
              </View>
            </View>

            {/* Profile Overview Card */}
            <View style={styles.profileHeroCard}>
              <View style={styles.heroAvatarCircle}>
                <Text style={styles.heroAvatarText}>RK</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.heroNameText}>{t.userName}</Text>
                <Text style={styles.heroDesignationText}>{t.designation}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Ionicons name="business-outline" size={14} color="#2E7D32" />
                  <Text style={styles.heroCenterCodeText}>
                    {t.centerCodeLabel} <Text style={{ fontWeight: 'bold', color: '#1A1A1A' }}>{t.centerCodeValue}</Text>
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.saveChangesHeaderBtn} onPress={() => alert(t.saveSuccessMsg)}>
                <Text style={styles.saveChangesHeaderBtnText}>{t.saveChangesBtn}</Text>
              </TouchableOpacity>
            </View>

            {/* Performance Stats Cards */}
            <View style={styles.statsRowGrid}>
              <View style={styles.statCard}>
                <Ionicons name="people-outline" size={22} color="#2E7D32" />
                <View>
                  <Text style={styles.statNumberText}>248</Text>
                  <Text style={styles.statLabelText}>{t.statArtisansOnboarded}</Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="cube-outline" size={22} color="#E65100" />
                <View>
                  <Text style={styles.statNumberText}>516</Text>
                  <Text style={styles.statLabelText}>{t.statProductsPosted}</Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="cash-outline" size={22} color="#1976D2" />
                <View>
                  <Text style={styles.statNumberText}>₹12.4L</Text>
                  <Text style={styles.statLabelText}>{t.statSalesDriven}</Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="star" size={22} color="#FBC02D" />
                <View>
                  <Text style={styles.statNumberText}>4.9/5</Text>
                  <Text style={styles.statLabelText}>{t.statActivityRating}</Text>
                </View>
              </View>
            </View>

            {/* Profile Edit Form Card */}
            <View style={styles.formContainerCard}>
              <View style={styles.tabsHeaderRow}>
                <TouchableOpacity
                  style={[styles.tabItemBtn, activeTab === 'personal' && styles.tabItemBtnActive]}
                  onPress={() => setActiveTab('personal')}
                >
                  <Text style={[styles.tabItemText, activeTab === 'personal' && styles.tabItemTextActive]}>{t.personalTab}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabItemBtn, activeTab === 'center' && styles.tabItemBtnActive]}
                  onPress={() => setActiveTab('center')}
                >
                  <Text style={[styles.tabItemText, activeTab === 'center' && styles.tabItemTextActive]}>{t.centerTab}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabItemBtn, activeTab === 'security' && styles.tabItemBtnActive]}
                  onPress={() => setActiveTab('security')}
                >
                  <Text style={[styles.tabItemText, activeTab === 'security' && styles.tabItemTextActive]}>{t.securityTab}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formFieldsBox}>
                <View style={styles.formTwoColRow}>
                  <View style={styles.fieldFlex}>
                    <Text style={styles.fieldLabelText}>{t.fullNameLabel}</Text>
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      style={styles.textInputBox}
                    />
                  </View>

                  <View style={styles.fieldFlex}>
                    <Text style={styles.fieldLabelText}>{t.mobileLabel}</Text>
                    <TextInput
                      value={mobile}
                      onChangeText={setMobile}
                      style={styles.textInputBox}
                    />
                  </View>
                </View>

                <View style={styles.formTwoColRow}>
                  <View style={styles.fieldFlex}>
                    <Text style={styles.fieldLabelText}>{t.emailLabel}</Text>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      style={styles.textInputBox}
                    />
                  </View>

                  <View style={styles.fieldFlex}>
                    <Text style={styles.fieldLabelText}>{t.districtLabelField}</Text>
                    <TextInput
                      value={isHindi ? 'रायपुर, छत्तीसगढ़' : 'Raipur, Chhattisgarh'}
                      editable={false}
                      style={[styles.textInputBox, { backgroundColor: '#F0F0F0' }]}
                    />
                  </View>
                </View>

                <View>
                  <Text style={styles.fieldLabelText}>{t.officeAddressLabel}</Text>
                  <TextInput
                    value={office}
                    onChangeText={setOffice}
                    style={styles.textInputBox}
                  />
                </View>

                <TouchableOpacity style={styles.saveSubmitBtn} onPress={() => alert(t.saveSuccessMsg)}>
                  <Text style={styles.saveSubmitBtnText}>{t.saveChangesBtn}</Text>
                </TouchableOpacity>
              </View>
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
  profileHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 20,
    gap: 16,
  },
  heroAvatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroAvatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  heroNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  heroDesignationText: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  heroCenterCodeText: {
    fontSize: 12,
    color: '#555555',
  },
  saveChangesHeaderBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  saveChangesHeaderBtnText: {
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statLabelText: {
    fontSize: 11,
    color: '#777777',
    marginTop: 1,
  },
  formContainerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 24,
    gap: 20,
  },
  tabsHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 20,
  },
  tabItemBtn: {
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemBtnActive: {
    borderBottomColor: '#2E7D32',
  },
  tabItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777777',
  },
  tabItemTextActive: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  formFieldsBox: {
    gap: 16,
  },
  formTwoColRow: {
    flexDirection: 'row',
    gap: 16,
  },
  fieldFlex: {
    flex: 1,
  },
  fieldLabelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  textInputBox: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 13,
    color: '#333333',
  },
  saveSubmitBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 28,
  },
  saveSubmitBtnText: {
    fontSize: 13,
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
