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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalLang } from '@/utils/languageStore';
import { GovtSidebar, GovtTopHeader } from '@/components/GovtLayout';

const TRANSLATIONS = {
  hi: {
    dashboard: 'डैशबोर्ड',
    buyProducts: 'उत्पाद खरीदें',
    tenders: 'टेंडर',
    myOrders: 'मेरे ऑर्डर',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉगआउट',
    deptName: 'उद्योग और वाणिज्य विभाग',
    deptState: 'छत्तीसगढ़ सरकार',
    userRole: 'अधिकारी',
    userTitle: 'विभाग अधिकारी',

    pageTitle: 'प्रोफाइल',
    pageSubtitle: 'अपनी व्यक्तिगत और विभागीय जानकारी प्रबंधित करें।',
    editProfile: 'प्रोफाइल संपादित करें',

    userName: 'अधिकारी',
    designation: 'विभाग अधिकारी',
    deptFull: 'उद्योग और वाणिज्य विभाग',
    govtFull: 'छत्तीसगढ़ सरकार',
    emailLabel: 'ईमेल',
    phoneLabel: 'फोन',

    deptDetailsTitle: 'विभाग विवरण',
    deptNameLabel: 'विभाग का नाम',
    deptNameVal: 'उद्योग और वाणिज्य विभाग',
    designationLabel: 'पदनाम',
    designationVal: 'विभाग अधिकारी',
    officeLocLabel: 'कार्यालय का स्थान',
    officeLocVal: 'रायपुर, छत्तीसगढ़',

    contactInfoTitle: 'संपर्क जानकारी',
    emailAddrLabel: 'ईमेल पता',
    emailAddrVal: 'officer@cg.gov.in',
    phoneNumLabel: 'फोन नंबर',
    phoneNumVal: '+91 98765 43210',
    altPhoneLabel: 'वैकल्पिक फोन (वैकल्पिक)',

    accountSettingsTitle: 'खाता सेटिंग्स',
    passwordLabel: 'पासवर्ड',
    changePasswordBtn: 'पासवर्ड बदलें',

    preferencesTitle: 'वरीयताएं',
    languageLabel: 'भाषा',
    emailNotifLabel: 'ईमेल सूचनाएं',
    enabledVal: 'सक्षम',
  },
  en: {
    dashboard: 'Dashboard',
    buyProducts: 'Buy Products',
    tenders: 'Tenders',
    myOrders: 'My Orders',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    deptName: 'Dept. of Industry & Commerce',
    deptState: 'Govt. of Chhattisgarh',
    userRole: 'Officer',
    userTitle: 'Department Officer',

    pageTitle: 'Profile',
    pageSubtitle: 'Manage your personal and department information.',
    editProfile: 'Edit Profile',

    userName: 'Officer',
    designation: 'Department Officer',
    deptFull: 'Department of Industry & Commerce',
    govtFull: 'Government of Chhattisgarh',
    emailLabel: 'Email',
    phoneLabel: 'Phone',

    deptDetailsTitle: 'Department Details',
    deptNameLabel: 'Department Name',
    deptNameVal: 'Department of Industry & Commerce',
    designationLabel: 'Designation',
    designationVal: 'Department Officer',
    officeLocLabel: 'Office Location',
    officeLocVal: 'Raipur, Chhattisgarh',

    contactInfoTitle: 'Contact Information',
    emailAddrLabel: 'Email Address',
    emailAddrVal: 'officer@cg.gov.in',
    phoneNumLabel: 'Phone Number',
    phoneNumVal: '+91 98765 43210',
    altPhoneLabel: 'Alternate Phone (Optional)',

    accountSettingsTitle: 'Account Settings',
    passwordLabel: 'Password',
    changePasswordBtn: 'Change Password',

    preferencesTitle: 'Preferences',
    languageLabel: 'Language',
    emailNotifLabel: 'Email Notifications',
    enabledVal: 'Enabled',
  },
};

export default function GovtProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang] = useGlobalLang();

  const t = (TRANSLATIONS as any)[selectedLang] || TRANSLATIONS.hi;
  const isHindi = selectedLang === 'hi';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <View style={styles.container}>
        <View style={styles.mainRow}>
          {/* 1. Shared Left Sidebar Component */}
          {isDesktop && <GovtSidebar activeKey="profile" />}

          {/* 2. Right Main Content Area */}
          <View style={styles.contentCol}>
            {/* Shared Top Header */}
            <GovtTopHeader />

            {/* Scrollable Body */}
            <ScrollView
              style={styles.scrollBody}
              contentContainerStyle={styles.scrollBodyContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Page Title Row */}
              <View style={styles.pageHeaderRow}>
                <View>
                  <Text style={styles.pageTitle}>{t.pageTitle}</Text>
                  <Text style={styles.pageSubtitle}>{t.pageSubtitle}</Text>
                </View>

                <TouchableOpacity style={styles.editBtn} activeOpacity={0.85}>
                  <Ionicons name="create-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.editBtnText}>{t.editProfile}</Text>
                </TouchableOpacity>
              </View>

              {/* Profile Overview Card */}
              <View style={styles.heroCard}>
                <View style={styles.avatarCircle}>
                  <Ionicons name="person" size={40} color="#2E7D32" />
                </View>

                <View style={styles.heroTextCol}>
                  <Text style={styles.heroName}>{t.userName}</Text>
                  <Text style={styles.heroDesignation}>{t.designation}</Text>
                  <Text style={styles.heroDept}>{t.deptFull}</Text>
                  <Text style={styles.heroGovt}>{t.govtFull}</Text>
                </View>

                <View style={styles.heroContactGroup}>
                  <View style={styles.contactItemRow}>
                    <Ionicons name="mail-outline" size={14} color="#6B7280" style={{ marginRight: 6 }} />
                    <Text style={styles.contactLabel}>{t.emailLabel}:</Text>
                    <Text style={styles.contactVal}>officer@cg.gov.in</Text>
                  </View>
                  <View style={styles.contactItemRow}>
                    <Ionicons name="call-outline" size={14} color="#6B7280" style={{ marginRight: 6 }} />
                    <Text style={styles.contactLabel}>{t.phoneLabel}:</Text>
                    <Text style={styles.contactVal}>+91 98765 43210</Text>
                  </View>
                </View>
              </View>

              {/* Grid Section Cards */}
              <View style={styles.gridRow}>
                {/* Card 1: Department Details */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeaderRow}>
                    <Ionicons name="business-outline" size={18} color="#2E7D32" style={{ marginRight: 8 }} />
                    <Text style={styles.sectionTitle}>{t.deptDetailsTitle}</Text>
                  </View>

                  <View style={styles.infoGroup}>
                    <View style={styles.infoField}>
                      <Text style={styles.fieldLabel}>{t.deptNameLabel}</Text>
                      <Text style={styles.fieldValue}>{t.deptNameVal}</Text>
                    </View>

                    <View style={styles.infoField}>
                      <Text style={styles.fieldLabel}>{t.designationLabel}</Text>
                      <Text style={styles.fieldValue}>{t.designationVal}</Text>
                    </View>

                    <View style={styles.infoField}>
                      <Text style={styles.fieldLabel}>{t.officeLocLabel}</Text>
                      <Text style={styles.fieldValue}>{t.officeLocVal}</Text>
                    </View>
                  </View>
                </View>

                {/* Card 2: Contact Information */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeaderRow}>
                    <Ionicons name="call-outline" size={18} color="#2E7D32" style={{ marginRight: 8 }} />
                    <Text style={styles.sectionTitle}>{t.contactInfoTitle}</Text>
                  </View>

                  <View style={styles.infoGroup}>
                    <View style={styles.infoField}>
                      <Text style={styles.fieldLabel}>{t.emailAddrLabel}</Text>
                      <Text style={styles.fieldValue}>{t.emailAddrVal}</Text>
                    </View>

                    <View style={styles.infoField}>
                      <Text style={styles.fieldLabel}>{t.phoneNumLabel}</Text>
                      <Text style={styles.fieldValue}>{t.phoneNumVal}</Text>
                    </View>

                    <View style={styles.infoField}>
                      <Text style={styles.fieldLabel}>{t.altPhoneLabel}</Text>
                      <Text style={styles.fieldValueNotSet}>Not set</Text>
                    </View>
                  </View>
                </View>

                {/* Card 3: Account Settings */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeaderRow}>
                    <Ionicons name="lock-closed-outline" size={18} color="#2E7D32" style={{ marginRight: 8 }} />
                    <Text style={styles.sectionTitle}>{t.accountSettingsTitle}</Text>
                  </View>

                  <View style={styles.infoGroup}>
                    <View style={styles.infoField}>
                      <Text style={styles.fieldLabel}>{t.passwordLabel}</Text>
                      <Text style={styles.fieldValue}>••••••••••••</Text>
                    </View>

                    <TouchableOpacity style={styles.actionOutlineBtn}>
                      <Text style={styles.actionOutlineBtnText}>{t.changePasswordBtn}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Card 4: Preferences */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeaderRow}>
                    <Ionicons name="options-outline" size={18} color="#2E7D32" style={{ marginRight: 8 }} />
                    <Text style={styles.sectionTitle}>{t.preferencesTitle}</Text>
                  </View>

                  <View style={styles.infoGroup}>
                    <View style={styles.infoField}>
                      <Text style={styles.fieldLabel}>{t.languageLabel}</Text>
                      <Text style={styles.fieldValue}>{isHindi ? 'हिंदी' : 'English'}</Text>
                    </View>

                    <View style={styles.infoField}>
                      <Text style={styles.fieldLabel}>{t.emailNotifLabel}</Text>
                      <Text style={styles.fieldValue}>{t.enabledVal}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainRow: {
    flex: 1,
    flexDirection: 'row',
  },
  contentCol: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollBody: {
    flex: 1,
  },
  scrollBodyContent: {
    padding: 24,
    gap: 20,
  },
  pageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    gap: 20,
    elevation: 1,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextCol: {
    flex: 1,
  },
  heroName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  heroDesignation: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  heroDept: {
    fontSize: 12,
    color: '#4B5563',
  },
  heroGovt: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  heroContactGroup: {
    gap: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
    paddingLeft: 20,
  },
  contactItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 4,
  },
  contactVal: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  sectionCard: {
    flex: 1,
    minWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 18,
    gap: 16,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  infoGroup: {
    gap: 12,
  },
  infoField: {
    gap: 2,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  fieldValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  fieldValueNotSet: {
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  actionOutlineBtn: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  actionOutlineBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});
