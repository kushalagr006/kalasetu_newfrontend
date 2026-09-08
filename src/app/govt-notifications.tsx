import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
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

    pageTitle: 'सूचनाएं',
    pageSubtitle: 'ऑर्डर, टेंडर और खरीद से संबंधित महत्वपूर्ण अपडेट प्राप्त करें।',

    searchPlaceholder: 'सूचनाएं खोजें...',
    filterAll: 'सभी',
    filterUnread: 'अनपढ़ी',
    filterRead: 'पढ़ी हुई',

    showingFooter: (start: number, end: number, total: number) => `कुल ${total} सूचनाओं में से ${start} - ${end} दिखाई जा रही हैं`,
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

    pageTitle: 'Notifications',
    pageSubtitle: 'Stay updated with important updates related to orders, tenders and procurement.',

    searchPlaceholder: 'Search notifications...',
    filterAll: 'All',
    filterUnread: 'Unread',
    filterRead: 'Read',

    showingFooter: (start: number, end: number, total: number) => `Showing ${start} - ${end} of ${total} notifications`,
  },
};

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    unread: true,
    titleEn: 'New Tender Published',
    titleHi: 'नया टेंडर प्रकाशित',
    descEn: 'A new tender "Handicraft Items for Office Decor" has been published.',
    descHi: 'एक नया टेंडर "कार्यालय सजावट के लिए हस्तशिल्प वस्तुएं" प्रकाशित किया गया है।',
    dateTime: '10 Sep 2025, 11:20 AM',
  },
  {
    id: '2',
    unread: true,
    titleEn: 'Bid Received',
    titleHi: 'बिड प्राप्त हुई',
    descEn: 'You have received a new bid for the tender "Supply of Bamboo Furniture".',
    descHi: 'आपको टेंडर "बांस फर्नीचर की आपूर्ति" के लिए एक नई बोली प्राप्त हुई है।',
    dateTime: '09 Sep 2025, 04:15 PM',
  },
  {
    id: '3',
    unread: false,
    titleEn: 'Order Delivered',
    titleHi: 'ऑर्डर डिलीवर हो गया',
    descEn: 'Order #ORD-10984 has been successfully delivered by Bastar Artisans Group.',
    descHi: 'ऑर्डर #ORD-10984 बस्तर आर्टिसन्स ग्रुप द्वारा सफलतापूर्वक डिलीवर कर दिया गया है।',
    dateTime: '07 Sep 2025, 02:45 PM',
  },
  {
    id: '4',
    unread: false,
    titleEn: 'Tender Evaluation Completed',
    titleHi: 'टेंडर मूल्यांकन पूरा',
    descEn: 'Technical evaluation for "Terracotta Products" is completed.',
    descHi: '"टेराकोटा उत्पाद" के लिए तकनीकी मूल्यांकन पूरा हो गया है।',
    dateTime: '05 Sep 2025, 06:00 PM',
  },
  {
    id: '5',
    unread: false,
    titleEn: 'Payment Released',
    titleHi: 'भुगतान जारी किया गया',
    descEn: 'Payment of ₹1,45,000 released for Order #ORD-10822.',
    descHi: 'ऑर्डर #ORD-10822 के लिए ₹1,45,000 का भुगतान जारी किया गया।',
    dateTime: '01 Sep 2025, 10:30 AM',
  },
];

export default function GovtNotificationsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang] = useGlobalLang();
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifList, setNotifList] = useState(INITIAL_NOTIFICATIONS);

  const t = (TRANSLATIONS as any)[selectedLang] || TRANSLATIONS.hi;
  const isHindi = selectedLang === 'hi';

  const filteredNotifs = notifList.filter((item) => {
    if (activeTab === 'unread' && !item.unread) return false;
    if (activeTab === 'read' && item.unread) return false;

    const title = isHindi ? item.titleHi : item.titleEn;
    const desc = isHindi ? item.descHi : item.descEn;
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const toggleUnreadState = (id: string) => {
    setNotifList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <View style={styles.container}>
        <View style={styles.mainRow}>
          {/* 1. Shared Left Sidebar Component */}
          {isDesktop && <GovtSidebar activeKey="notifications" />}

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
              {/* Page Title & Subtitle */}
              <View style={styles.pageHeaderRow}>
                <Text style={styles.pageTitle}>{t.pageTitle}</Text>
                <Text style={styles.pageSubtitle}>{t.pageSubtitle}</Text>
              </View>

              {/* Main White Card */}
              <View style={styles.mainCard}>
                {/* Search & Filter Tabs Bar */}
                <View style={styles.topControlsRow}>
                  {/* Filter Tabs */}
                  <View style={styles.tabsGroup}>
                    <TouchableOpacity
                      style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
                      onPress={() => setActiveTab('all')}
                    >
                      <Text style={[styles.tabBtnText, activeTab === 'all' && styles.tabBtnTextActive]}>
                        {t.filterAll}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.tabBtn, activeTab === 'unread' && styles.tabBtnActive]}
                      onPress={() => setActiveTab('unread')}
                    >
                      <Text style={[styles.tabBtnText, activeTab === 'unread' && styles.tabBtnTextActive]}>
                        {t.filterUnread}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.tabBtn, activeTab === 'read' && styles.tabBtnActive]}
                      onPress={() => setActiveTab('read')}
                    >
                      <Text style={[styles.tabBtnText, activeTab === 'read' && styles.tabBtnTextActive]}>
                        {t.filterRead}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Search Input Box */}
                  <View style={styles.searchBox}>
                    <Ionicons name="search" size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder={t.searchPlaceholder}
                      placeholderTextColor="#9CA3AF"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>
                </View>

                {/* Notifications List */}
                <View style={styles.listContainer}>
                  {filteredNotifs.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.notifItemRow, item.unread && styles.notifItemUnreadBg]}
                      onPress={() => toggleUnreadState(item.id)}
                      activeOpacity={0.7}
                    >
                      {/* Bell Icon & Unread Dot */}
                      <View style={styles.iconCol}>
                        <View style={styles.bellCircle}>
                          <Ionicons name="notifications-outline" size={18} color="#2E7D32" />
                        </View>
                        {item.unread && <View style={styles.unreadDot} />}
                      </View>

                      {/* Content Column */}
                      <View style={styles.textCol}>
                        <Text style={styles.notifTitle}>{isHindi ? item.titleHi : item.titleEn}</Text>
                        <Text style={styles.notifDesc}>{isHindi ? item.descHi : item.descEn}</Text>
                      </View>

                      {/* Date & Time Right Column */}
                      <View style={styles.dateCol}>
                        <Text style={styles.dateText}>{item.dateTime}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}

                  {filteredNotifs.length === 0 && (
                    <View style={styles.emptyContainer}>
                      <Ionicons name="notifications-off-outline" size={40} color="#D1D5DB" />
                      <Text style={styles.emptyText}>No notifications found</Text>
                    </View>
                  )}
                </View>

                {/* Table Footer / Pagination */}
                <View style={styles.tableFooterRow}>
                  <Text style={styles.footerShowingText}>
                    {t.showingFooter(
                      filteredNotifs.length > 0 ? 1 : 0,
                      filteredNotifs.length,
                      filteredNotifs.length
                    )}
                  </Text>

                  <View style={styles.paginationRow}>
                    <TouchableOpacity style={[styles.pageNavBtn, styles.pageNavBtnDisabled]} disabled>
                      <Ionicons name="chevron-back" size={16} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.pageNavBtn, styles.pageNavBtnActive]}>
                      <Text style={styles.pageNavBtnTextActive}>1</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.pageNavBtn}>
                      <Ionicons name="chevron-forward" size={16} color="#4B5563" />
                    </TouchableOpacity>
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
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 18,
    gap: 18,
    elevation: 1,
  },
  topControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  },
  tabsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  tabBtnActive: {
    backgroundColor: '#2E7D32',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    width: 220,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#111827',
    padding: 0,
  },
  listContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  notifItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  notifItemUnreadBg: {
    backgroundColor: '#F0FDF4',
  },
  iconCol: {
    position: 'relative',
    marginRight: 12,
    marginTop: 2,
  },
  bellCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2E7D32',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  textCol: {
    flex: 1,
    paddingRight: 12,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 3,
  },
  notifDesc: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 17,
  },
  dateCol: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
  },
  tableFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  footerShowingText: {
    fontSize: 12,
    color: '#6B7280',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pageNavBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  pageNavBtnActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  pageNavBtnDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  pageNavBtnTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
