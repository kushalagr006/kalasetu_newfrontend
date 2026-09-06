import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalLang, LangCode } from '@/utils/languageStore';
import { CustSidebar, CustTopHeader } from '@/components/CustLayout';

const TRANSLATIONS_CUST_PROFILE = {
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
    userRole: 'ग्राहक / खरीदार',
    pageTitle: 'मेरी प्रोफाइल',
    pageSubtitle: 'अपनी व्यक्तिगत जानकारी, डिलीवरी पते और खाता प्राथमिकताओं को प्रबंधित करें।',
    personalInfoTitle: 'व्यक्तिगत जानकारी',
    editBtn: 'संपादित करें',
    saveBtn: 'सहेजें',
    fullNameLabel: 'पूरा नाम',
    emailLabel: 'ईमेल पता',
    phoneLabel: 'मोबाइल नंबर',
    genderLabel: 'लिंग',
    dobLabel: 'जन्म तिथि',
    addressesTitle: 'सहेजे गए डिलीवरी पते',
    addAddressBtn: '+ नया पता जोड़ें',
    primaryPill: 'प्राथमिक',
    homeAddressTitle: 'घर का पता',
    homeAddressVal: '124, सनशाइन एन्क्लेव, सिविल लाइंस, रायपुर, छत्तीसगढ़ - 492001',
    workAddressTitle: 'कार्यालय का पता',
    workAddressVal: 'ब्लॉक 3, आईटी पार्क, नया रायपुर, छत्तीसगढ़ - 492002',
    securityTitle: 'सुरक्षा और पासवर्ड बदलें',
    currentPassLabel: 'वर्तमान पासवर्ड',
    newPassLabel: 'नया पासवर्ड',
    confirmPassLabel: 'पासवर्ड की पुष्टि करें',
    updatePassBtn: 'पासवर्ड अपडेट करें',
    notifPrefTitle: 'अधिसूचना प्राथमिकताएं',
    notifSmsLabel: 'एसएमएस द्वारा ऑर्डर अपडेट प्राप्त करें',
    notifWhatsappLabel: 'व्हाट्सएप द्वारा ट्रैकिंग अलर्ट प्राप्त करें',
    notifPromosLabel: 'विशेष ऑफ़र और कारीगर कहानियों का न्यूज़लेटर',
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
    userRole: 'Customer / Buyer',
    pageTitle: 'My Profile',
    pageSubtitle: 'Manage your personal details, delivery addresses, and account preferences.',
    personalInfoTitle: 'Personal Information',
    editBtn: 'Edit',
    saveBtn: 'Save Details',
    fullNameLabel: 'Full Name',
    emailLabel: 'Email Address',
    phoneLabel: 'Mobile Number',
    genderLabel: 'Gender',
    dobLabel: 'Date of Birth',
    addressesTitle: 'Saved Delivery Addresses',
    addAddressBtn: '+ Add New Address',
    primaryPill: 'Default',
    homeAddressTitle: 'Home Address',
    homeAddressVal: '124, Sunshine Enclave, Civil Lines, Raipur, Chhattisgarh - 492001',
    workAddressTitle: 'Work Address',
    workAddressVal: 'Block 3, IT Park, Naya Raipur, Chhattisgarh - 492002',
    securityTitle: 'Security & Change Password',
    currentPassLabel: 'Current Password',
    newPassLabel: 'New Password',
    confirmPassLabel: 'Confirm New Password',
    updatePassBtn: 'Update Password',
    notifPrefTitle: 'Notification Preferences',
    notifSmsLabel: 'Receive Order updates via SMS',
    notifWhatsappLabel: 'Receive Tracking alerts via WhatsApp',
    notifPromosLabel: 'Newsletter for special offers & artisan stories',
  },
};

export default function CustomerProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang] = useGlobalLang();
  const [isEditing, setIsEditing] = useState(false);
  const [smsNotif, setSmsNotif] = useState(true);
  const [waNotif, setWaNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(false);

  const t = TRANSLATIONS_CUST_PROFILE[selectedLang as keyof typeof TRANSLATIONS_CUST_PROFILE] || TRANSLATIONS_CUST_PROFILE.en;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <CustTopHeader />

        {/* Main 2-Column Layout */}
        <View style={styles.mainLayoutRow}>
          {/* 1. Left Sidebar Navigation */}
          {isDesktop && <CustSidebar activeKey="profile" />}

          {/* 2. Main Content Scrollable Area */}
          <ScrollView style={styles.contentCol} contentContainerStyle={styles.contentScrollContainer} showsVerticalScrollIndicator={false}>
            {/* Profile Banner Summary Card */}
            <View style={styles.profileSummaryCard}>
              <View style={styles.avatarBigCircle}>
                <Text style={styles.avatarBigText}>AS</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.summaryNameText}>{t.userName}</Text>
                <Text style={styles.summaryRoleText}>{t.userRole}</Text>
                <Text style={styles.summaryEmailText}>aditya.singh@example.com • +91 98765 43210</Text>
              </View>

              <TouchableOpacity
                style={styles.summaryEditBtn}
                onPress={() => setIsEditing(!isEditing)}
                activeOpacity={0.8}
              >
                <Ionicons name={isEditing ? 'checkmark' : 'create-outline'} size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.summaryEditBtnText}>{isEditing ? t.saveBtn : t.editBtn}</Text>
              </TouchableOpacity>
            </View>

            {/* Grid Row for Profile Details */}
            <View style={styles.profileGridRow}>
              {/* Card 1: Personal Details */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionCardTitleText}>{t.personalInfoTitle}</Text>

                <View style={styles.fieldInputGroup}>
                  <Text style={styles.fieldLabelText}>{t.fullNameLabel}</Text>
                  <TextInput
                    style={[styles.profileInput, !isEditing && styles.profileInputDisabled]}
                    editable={isEditing}
                    defaultValue="Aditya Singh"
                  />
                </View>

                <View style={styles.fieldInputGroup}>
                  <Text style={styles.fieldLabelText}>{t.emailLabel}</Text>
                  <TextInput
                    style={[styles.profileInput, !isEditing && styles.profileInputDisabled]}
                    editable={isEditing}
                    defaultValue="aditya.singh@example.com"
                  />
                </View>

                <View style={styles.fieldInputGroup}>
                  <Text style={styles.fieldLabelText}>{t.phoneLabel}</Text>
                  <TextInput
                    style={[styles.profileInput, !isEditing && styles.profileInputDisabled]}
                    editable={isEditing}
                    defaultValue="+91 98765 43210"
                  />
                </View>
              </View>

              {/* Card 2: Saved Delivery Addresses */}
              <View style={styles.sectionCard}>
                <View style={styles.cardHeaderWithBtn}>
                  <Text style={styles.sectionCardTitleText}>{t.addressesTitle}</Text>
                  <TouchableOpacity style={styles.addAddressOutlineBtn}>
                    <Text style={styles.addAddressOutlineBtnText}>{t.addAddressBtn}</Text>
                  </TouchableOpacity>
                </View>

                {/* Address Item 1 */}
                <View style={styles.addressBoxCard}>
                  <View style={styles.addressBoxHeader}>
                    <Text style={styles.addressTitleText}>{t.homeAddressTitle}</Text>
                    <View style={styles.defaultBadgePill}>
                      <Text style={styles.defaultBadgeText}>{t.primaryPill}</Text>
                    </View>
                  </View>
                  <Text style={styles.addressFullText}>{t.homeAddressVal}</Text>
                </View>

                {/* Address Item 2 */}
                <View style={styles.addressBoxCard}>
                  <Text style={styles.addressTitleText}>{t.workAddressTitle}</Text>
                  <Text style={styles.addressFullText}>{t.workAddressVal}</Text>
                </View>
              </View>

              {/* Card 3: Security & Passwords */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionCardTitleText}>{t.securityTitle}</Text>

                <View style={styles.fieldInputGroup}>
                  <Text style={styles.fieldLabelText}>{t.currentPassLabel}</Text>
                  <TextInput style={styles.profileInput} secureTextEntry placeholder="••••••••" />
                </View>

                <View style={styles.fieldInputGroup}>
                  <Text style={styles.fieldLabelText}>{t.newPassLabel}</Text>
                  <TextInput style={styles.profileInput} secureTextEntry placeholder="••••••••" />
                </View>

                <TouchableOpacity style={styles.updatePassBtn} activeOpacity={0.8}>
                  <Text style={styles.updatePassBtnText}>{t.updatePassBtn}</Text>
                </TouchableOpacity>
              </View>

              {/* Card 4: Notification Preferences */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionCardTitleText}>{t.notifPrefTitle}</Text>

                <View style={styles.toggleRowItem}>
                  <Text style={styles.toggleLabelText}>{t.notifSmsLabel}</Text>
                  <Switch
                    value={smsNotif}
                    onValueChange={setSmsNotif}
                    trackColor={{ false: '#E0E0E0', true: '#C8E6C9' }}
                    thumbColor={smsNotif ? '#2E7D32' : '#999999'}
                  />
                </View>

                <View style={styles.toggleRowItem}>
                  <Text style={styles.toggleLabelText}>{t.notifWhatsappLabel}</Text>
                  <Switch
                    value={waNotif}
                    onValueChange={setWaNotif}
                    trackColor={{ false: '#E0E0E0', true: '#C8E6C9' }}
                    thumbColor={waNotif ? '#2E7D32' : '#999999'}
                  />
                </View>

                <View style={styles.toggleRowItem}>
                  <Text style={styles.toggleLabelText}>{t.notifPromosLabel}</Text>
                  <Switch
                    value={promoNotif}
                    onValueChange={setPromoNotif}
                    trackColor={{ false: '#E0E0E0', true: '#C8E6C9' }}
                    thumbColor={promoNotif ? '#2E7D32' : '#999999'}
                  />
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
  profileSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  avatarBigCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBigText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  summaryNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  summaryRoleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  summaryEmailText: {
    fontSize: 12,
    color: '#777777',
  },
  summaryEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  summaryEditBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileGridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  sectionCard: {
    width: '48.5%',
    minWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 20,
  },
  sectionCardTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  cardHeaderWithBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addAddressOutlineBtn: {
    borderWidth: 1,
    borderColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  addAddressOutlineBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  fieldInputGroup: {
    marginBottom: 14,
  },
  fieldLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
    marginBottom: 6,
  },
  profileInput: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1A1A1A',
  },
  profileInputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#666666',
  },
  addressBoxCard: {
    backgroundColor: '#FAF8F5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E0D8',
  },
  addressBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  addressTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  defaultBadgePill: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
  },
  addressFullText: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
  updatePassBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  updatePassBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  toggleRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  toggleLabelText: {
    fontSize: 12,
    color: '#444444',
    flex: 1,
    paddingRight: 12,
  },
});
