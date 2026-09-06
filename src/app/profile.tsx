import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

type LangCode = 'hi' | 'en';
type ActiveTab = 'home' | 'products' | 'customers' | 'profile';

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'English' },
];

const TRANSLATIONS: Record<LangCode, {
  headerTitle: string;
  shgName: string;
  location: string;
  members: string;
  joined: string;
  editBtn: string;
  contactHeader: string;
  phoneLabel: string;
  emailLabel: string;
  addressLabel: string;
  addressVal: string;
  shgHeader: string;
  craftLabel: string;
  craftVal: string;
  memberCountLabel: string;
  aboutLabel: string;
  aboutVal: string;
  logoutBtn: string;
  logoutTitle: string;
  logoutMsg: string;
  cancel: string;
  navHome: string;
  navProducts: string;
  navCustomers: string;
  navProfile: string;
  modalTitle: string;
}> = {
  hi: {
    headerTitle: 'प्रोफ़ाइल',
    shgName: 'सुनीता देवी (कारीगर)',
    location: 'रामपुर, धमतरी',
    members: 'कारीगर सदस्य',
    joined: 'जुड़ी: मई 2025',
    editBtn: 'संपादित करें',
    contactHeader: 'संपर्क जानकारी',
    phoneLabel: 'मोबाइल नंबर',
    emailLabel: 'ईमेल (यदि है)',
    addressLabel: 'पूरा पता',
    addressVal: 'रामपुर गांव, धमतरी,\nछत्तीसगढ़ - 493773',
    shgHeader: 'प्रोफ़ाइल विवरण',
    craftLabel: 'हस्तशिल्प प्रकार',
    craftVal: 'हैंडिक्राफ्ट आइटम',
    memberCountLabel: 'अनुभव',
    aboutLabel: 'हमारे बारे में',
    aboutVal: 'हम सुंदर और गुणवत्तापूर्ण हस्तनिर्मित उत्पाद बनाते हैं।',
    logoutBtn: 'लॉग आउट (Log Out)',
    logoutTitle: 'लॉग आउट करें?',
    logoutMsg: 'क्या आप सचमुच ऐप से लॉग आउट करना चाहते हैं?',
    cancel: 'रद्द करें',
    navHome: 'होम',
    navProducts: 'उत्पाद',
    navCustomers: 'ग्राहक',
    navProfile: 'प्रोफ़ाइल',
    modalTitle: 'भाषा चुनें / Select Language',
  },
  en: {
    headerTitle: 'Profile',
    shgName: 'Sunita Devi (Artisan)',
    location: 'Rampur, Dhamtari',
    members: 'Artisan Member',
    joined: 'Joined May 2025',
    editBtn: 'Edit Profile',
    contactHeader: 'Contact Information',
    phoneLabel: 'Mobile Number',
    emailLabel: 'Email (Optional)',
    addressLabel: 'Full Address',
    addressVal: 'Rampur Village, Dhamtari,\nChhattisgarh - 493773',
    shgHeader: 'Profile Details',
    craftLabel: 'Craft Type',
    craftVal: 'Handicraft Items',
    memberCountLabel: 'Experience',
    aboutLabel: 'About Us',
    aboutVal: 'We craft beautiful, high-quality handmade products.',
    logoutBtn: 'Log Out',
    logoutTitle: 'Log Out?',
    logoutMsg: 'Are you sure you want to log out?',
    cancel: 'Cancel',
    navHome: 'Home',
    navProducts: 'Products',
    navCustomers: 'Customers',
    navProfile: 'Profile',
    modalTitle: 'Select Language / भाषा चुनें',
  },
};

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const initialLang: LangCode = (params.lang as LangCode) || 'hi';

  const [selectedLang, setSelectedLang] = useState<LangCode>(initialLang);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');

  const t = TRANSLATIONS[selectedLang];
  const currentLangLabel = LANGUAGES.find((l) => l.code === selectedLang)?.label || 'हिंदी';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>{t.headerTitle}</Text>
            <TouchableOpacity
              style={styles.langSelector}
              onPress={() => setIsLangModalVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.langText}>{currentLangLabel}</Text>
              <Ionicons name="chevron-down" size={14} color="#2C2C2C" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push({ pathname: '/notifications', params: { lang: selectedLang } })}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={26} color="#1A1A1A" />
            <View style={styles.redBadgeDot} />
          </TouchableOpacity>
        </View>

        {/* Scrollable Body Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Profile Hero Card */}
          <View style={styles.profileHeroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.womenAvatarGroupCircle}>
                <Ionicons name="people" size={38} color="#3B6029" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.shgTitleText}>{t.shgName}</Text>

                <View style={styles.infoMetaRow}>
                  <Ionicons name="location-outline" size={14} color="#3B6029" />
                  <Text style={styles.infoMetaText}>{t.location}</Text>
                </View>

                <View style={styles.infoMetaRow}>
                  <Ionicons name="people-outline" size={14} color="#3B6029" />
                  <Text style={styles.infoMetaText}>{t.members}</Text>
                </View>

                <View style={styles.infoMetaRow}>
                  <Ionicons name="calendar-outline" size={14} color="#3B6029" />
                  <Text style={styles.infoMetaText}>{t.joined}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.editProfileBtn} activeOpacity={0.8}>
              <Ionicons name="pencil-outline" size={15} color="#3B6029" />
              <Text style={styles.editProfileBtnText}>{t.editBtn}</Text>
            </TouchableOpacity>
          </View>

          {/* संपर्क जानकारी Section */}
          <Text style={styles.sectionHeaderTitle}>{t.contactHeader}</Text>
          <View style={styles.infoCardBox}>
            <View style={styles.infoRowItem}>
              <Ionicons name="call-outline" size={20} color="#3B6029" style={styles.rowIcon} />
              <Text style={styles.rowLabelText}>{t.phoneLabel}</Text>
              <Text style={styles.rowValueText}>+91 98765 43210</Text>
            </View>

            <View style={styles.rowDividerLine} />

            <View style={styles.infoRowItem}>
              <Ionicons name="mail-outline" size={20} color="#3B6029" style={styles.rowIcon} />
              <Text style={styles.rowLabelText}>{t.emailLabel}</Text>
              <Text style={styles.rowValueText}>sakhi.shg@gmail.com</Text>
            </View>

            <View style={styles.rowDividerLine} />

            <View style={styles.infoRowItem}>
              <Ionicons name="location-outline" size={20} color="#3B6029" style={styles.rowIcon} />
              <Text style={styles.rowLabelText}>{t.addressLabel}</Text>
              <Text style={styles.rowValueAddressText}>{t.addressVal}</Text>
            </View>
          </View>

          {/* SHG विवरण Section */}
          <Text style={styles.sectionHeaderTitle}>{t.shgHeader}</Text>
          <View style={styles.infoCardBox}>
            <View style={styles.infoRowItem}>
              <Ionicons name="basket-outline" size={20} color="#3B6029" style={styles.rowIcon} />
              <Text style={styles.rowLabelText}>{t.craftLabel}</Text>
              <Text style={styles.rowValueText}>{t.craftVal}</Text>
            </View>

            <View style={styles.rowDividerLine} />

            <View style={styles.infoRowItem}>
              <Ionicons name="people-outline" size={20} color="#3B6029" style={styles.rowIcon} />
              <Text style={styles.rowLabelText}>{t.memberCountLabel}</Text>
              <Text style={styles.rowValueText}>12</Text>
            </View>

            <View style={styles.rowDividerLine} />

            <View style={styles.infoRowItem}>
              <Ionicons name="information-circle-outline" size={20} color="#3B6029" style={styles.rowIcon} />
              <Text style={styles.rowLabelText}>{t.aboutLabel}</Text>
              <Text style={styles.rowValueBodyText}>{t.aboutVal}</Text>
            </View>
          </View>

          {/* Log Out Button */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              if (Platform.OS === 'web') {
                if (window.confirm(t.logoutMsg)) {
                  router.replace('/');
                }
              } else {
                Alert.alert(
                  t.logoutTitle,
                  t.logoutMsg,
                  [
                    { text: t.cancel, style: 'cancel' },
                    { text: t.logoutBtn, style: 'destructive', onPress: () => router.replace('/') },
                  ]
                );
              }
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="log-out-outline" size={20} color="#D32F2F" style={{ marginRight: 8 }} />
            <Text style={styles.logoutBtnText}>{t.logoutBtn}</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Floating Bottom Navigation Bar (4 Tabs) */}
        <View style={styles.bottomNavContainer}>
          {/* Tab 1: Home */}
          <TouchableOpacity
            style={styles.navTab}
            onPress={() => router.push({ pathname: '/home', params: { lang: selectedLang } })}
            activeOpacity={0.7}
          >
            <Ionicons name="home-outline" size={22} color="#666666" />
            <Text style={styles.navTabText}>{t.navHome}</Text>
          </TouchableOpacity>

          {/* Tab 2: Products */}
          <TouchableOpacity
            style={styles.navTab}
            onPress={() => router.push({ pathname: '/products', params: { lang: selectedLang } })}
            activeOpacity={0.7}
          >
            <Ionicons name="cube-outline" size={22} color="#666666" />
            <Text style={styles.navTabText}>{t.navProducts}</Text>
          </TouchableOpacity>

          {/* Tab 3: Customers */}
          <TouchableOpacity
            style={styles.navTab}
            onPress={() => router.push({ pathname: '/customers', params: { lang: selectedLang } })}
            activeOpacity={0.7}
          >
            <Ionicons name="people-outline" size={22} color="#666666" />
            <Text style={styles.navTabText}>{t.navCustomers}</Text>
          </TouchableOpacity>

          {/* Tab 4: Profile (Active) */}
          <TouchableOpacity
            style={styles.navTab}
            onPress={() => setActiveTab('profile')}
            activeOpacity={0.7}
          >
            <Ionicons name="person" size={22} color="#1976D2" />
            <Text style={[styles.navTabText, styles.navTabTextActiveProfile]}>
              {t.navProfile}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Language Selection Modal */}
        <Modal
          visible={isLangModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsLangModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsLangModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t.modalTitle}</Text>
              <FlatList
                data={LANGUAGES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.langOptionItem,
                      selectedLang === item.code ? styles.langOptionSelected : null,
                    ]}
                    onPress={() => {
                      setSelectedLang(item.code);
                      setIsLangModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.langOptionText,
                        selectedLang === item.code ? styles.langOptionTextSelected : null,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {selectedLang === item.code && (
                      <Ionicons name="checkmark" size={20} color="#3B6029" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
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

  /* Top Header Row */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 8,
    paddingBottom: 16,
  },
  headerLeft: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 2,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEA',
    elevation: 1,
  },
  redBadgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },

  /* Scrollable Body */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },

  /* Profile Hero Card */
  profileHeroCard: {
    backgroundColor: '#F0F7ED',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E0D8',
    gap: 12,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  womenAvatarGroupCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shgTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  infoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  infoMetaText: {
    fontSize: 12,
    color: '#3B6029',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3B6029',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    gap: 6,
    marginTop: -10,
  },
  editProfileBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B6029',
  },

  /* Section Title */
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3B6029',
    marginTop: 4,
  },

  /* Info Card Box Container */
  infoCardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    paddingVertical: 4,
  },
  infoRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabelText: {
    fontSize: 13,
    color: '#555555',
    flex: 1,
  },
  rowValueText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  rowValueAddressText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'right',
    lineHeight: 18,
  },
  rowValueBodyText: {
    fontSize: 12,
    color: '#333333',
    flex: 1.5,
    textAlign: 'right',
    lineHeight: 16,
  },
  rowDividerLine: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
  },

  /* Logout Button */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
    marginBottom: 4,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D32F2F',
  },

  /* Floating Bottom Navigation Bar */
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 64,
    marginHorizontal: 16,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#F0EFEA',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  navTabText: {
    fontSize: 11,
    color: '#666666',
    marginTop: 3,
    fontWeight: '500',
  },
  navTabTextActiveProfile: {
    color: '#1976D2',
    fontWeight: 'bold',
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 320,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  langOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#FAF8F5',
  },
  langOptionSelected: {
    backgroundColor: '#F0F7ED',
    borderWidth: 1,
    borderColor: '#3B6029',
  },
  langOptionText: {
    fontSize: 16,
    color: '#333333',
  },
  langOptionTextSelected: {
    fontWeight: 'bold',
    color: '#3B6029',
  },
});
