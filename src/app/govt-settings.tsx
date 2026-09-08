import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
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

    pageTitle: 'सेटिंग्स',
    pageSubtitle: 'अपने खाते की प्राथमिकताओं और एप्लिकेशन सेटिंग्स को प्रबंधित करें।',

    accountTitle: 'खाता सेटिंग्स',
    accountSubhead: 'अपनी बुनियादी खाता जानकारी अपडेट करें।',
    editBtn: 'संपादित करें',
    nameLabel: 'नाम',
    nameVal: 'अधिकारी',
    emailLabel: 'ईमेल',
    emailVal: 'officer@cg.gov.in',

    notifTitle: 'सूचनाएं',
    notifSubhead: 'चुनें कि आप कौन से अपडेट प्राप्त करना चाहते हैं।',
    orderUpdatesTitle: 'ऑर्डर अपडेट',
    orderUpdatesSubtext: 'ऑर्डर स्थिति में बदलाव के बारे में सूचित रहें।',
    tenderUpdatesTitle: 'टेंडर अपडेट',
    tenderUpdatesSubtext: 'नए टेंडर और समय सीमा के बारे में सूचित रहें।',

    languageTitle: 'भाषा',
    languageSubhead: 'एप्लिकेशन के लिए अपनी पसंदीदा भाषा चुनें।',

    securityTitle: 'सुरक्षा',
    securitySubhead: 'अपने खाते की सुरक्षा प्रबंधित करें।',
    passwordTitle: 'पासवर्ड',
    passwordSubtext: 'अपना खाता पासवर्ड बदलें।',
    changePasswordBtn: 'पासवर्ड बदलें',
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

    pageTitle: 'Settings',
    pageSubtitle: 'Manage your account preferences and application settings.',

    accountTitle: 'Account Settings',
    accountSubhead: 'Update your basic account information.',
    editBtn: 'Edit',
    nameLabel: 'Name',
    nameVal: 'Officer',
    emailLabel: 'Email',
    emailVal: 'officer@cg.gov.in',

    notifTitle: 'Notifications',
    notifSubhead: 'Choose what updates you want to receive.',
    orderUpdatesTitle: 'Order updates',
    orderUpdatesSubtext: 'Get notified about order status changes.',
    tenderUpdatesTitle: 'Tender updates',
    tenderUpdatesSubtext: 'Get notified about new tenders and deadlines.',

    languageTitle: 'Language',
    languageSubhead: 'Choose your preferred language for the app.',

    securityTitle: 'Security',
    securitySubhead: 'Manage your account security.',
    passwordTitle: 'Password',
    passwordSubtext: 'Change your account password.',
    changePasswordBtn: 'Change password',
  },
};

export default function GovtSettingsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang, setSelectedLang] = useGlobalLang();
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [tenderUpdates, setTenderUpdates] = useState(true);

  const t = (TRANSLATIONS as any)[selectedLang] || TRANSLATIONS.hi;
  const isHindi = selectedLang === 'hi';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <View style={styles.container}>
        <View style={styles.mainRow}>
          {/* 1. Shared Left Sidebar Component */}
          {isDesktop && <GovtSidebar activeKey="settings" />}

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
                <Text style={styles.pageTitle}>{t.pageTitle}</Text>
                <Text style={styles.pageSubtitle}>{t.pageSubtitle}</Text>
              </View>

              {/* Main Content Settings Cards Container */}
              <View style={styles.cardsStack}>
                {/* Section 1: Account Settings */}
                <View style={styles.settingCard}>
                  <View style={styles.cardHeaderRow}>
                    <View>
                      <Text style={styles.cardTitle}>{t.accountTitle}</Text>
                      <Text style={styles.cardSubhead}>{t.accountSubhead}</Text>
                    </View>
                    <TouchableOpacity style={styles.actionOutlineBtn}>
                      <Text style={styles.actionOutlineBtnText}>{t.editBtn}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.cardBodyGroup}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>{t.nameLabel}</Text>
                      <Text style={styles.infoValue}>{t.nameVal}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>{t.emailLabel}</Text>
                      <Text style={styles.infoValue}>{t.emailVal}</Text>
                    </View>
                  </View>
                </View>

                {/* Section 2: Notifications */}
                <View style={styles.settingCard}>
                  <View style={styles.cardHeaderRow}>
                    <View>
                      <Text style={styles.cardTitle}>{t.notifTitle}</Text>
                      <Text style={styles.cardSubhead}>{t.notifSubhead}</Text>
                    </View>
                  </View>

                  <View style={styles.cardBodyGroup}>
                    {/* Toggle Item 1 */}
                    <View style={styles.toggleRow}>
                      <View style={{ flex: 1, paddingRight: 12 }}>
                        <Text style={styles.toggleTitle}>{t.orderUpdatesTitle}</Text>
                        <Text style={styles.toggleSubtext}>{t.orderUpdatesSubtext}</Text>
                      </View>
                      <Switch
                        value={orderUpdates}
                        onValueChange={setOrderUpdates}
                        trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
                        thumbColor={orderUpdates ? '#2E7D32' : '#9CA3AF'}
                      />
                    </View>

                    {/* Toggle Item 2 */}
                    <View style={styles.toggleRow}>
                      <View style={{ flex: 1, paddingRight: 12 }}>
                        <Text style={styles.toggleTitle}>{t.tenderUpdatesTitle}</Text>
                        <Text style={styles.toggleSubtext}>{t.tenderUpdatesSubtext}</Text>
                      </View>
                      <Switch
                        value={tenderUpdates}
                        onValueChange={setTenderUpdates}
                        trackColor={{ false: '#E5E7EB', true: '#86EFAC' }}
                        thumbColor={tenderUpdates ? '#2E7D32' : '#9CA3AF'}
                      />
                    </View>
                  </View>
                </View>

                {/* Section 4: Security */}
                <View style={styles.settingCard}>
                  <View style={styles.cardHeaderRow}>
                    <View>
                      <Text style={styles.cardTitle}>{t.securityTitle}</Text>
                      <Text style={styles.cardSubhead}>{t.securitySubhead}</Text>
                    </View>
                  </View>

                  <View style={styles.cardBodyGroup}>
                    <View style={styles.securityRow}>
                      <View style={{ flex: 1, paddingRight: 12 }}>
                        <Text style={styles.toggleTitle}>{t.passwordTitle}</Text>
                        <Text style={styles.toggleSubtext}>{t.passwordSubtext}</Text>
                      </View>
                      <TouchableOpacity style={styles.actionOutlineBtn}>
                        <Text style={styles.actionOutlineBtnText}>{t.changePasswordBtn}</Text>
                      </TouchableOpacity>
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
  cardsStack: {
    gap: 20,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    gap: 16,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  cardSubhead: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionOutlineBtn: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  actionOutlineBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  cardBodyGroup: {
    gap: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  toggleSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  langPillsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  langPill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  langPillActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  langPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  langPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
