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

    pageTitle: 'टेंडर',
    pageSubtitle: 'अपनी आवश्यकताओं के लिए टेंडर बनाएं और सत्यापित कारीगरों और उत्पादक समूहों से बोलियां प्राप्त करें।',
    createTender: '+ नया टेंडर बनाएं',

    allTenders: 'सभी टेंडर',
    drafts: 'ड्राफ्ट',
    active: 'सक्रिय',
    closed: 'बंद',

    categoryLabel: 'श्रेणी',
    statusLabel: 'स्थिति',
    allCategories: 'सभी',
    allStatuses: 'सभी',
    searchPlaceholder: 'टेंडर खोजें...',

    thTitle: 'शीर्षक',
    thCategory: 'श्रेणी',
    thQuantity: 'मात्रा',
    thDeadline: 'प्रस्तुत करने की अंतिम तिथि',
    thStatus: 'स्थिति',
    thActions: 'कार्रवाई',

    viewBids: 'बोलियां देखें',
    viewDetails: 'विवरण देखें',

    statusActive: 'सक्रिय',
    statusOpen: 'खुला',
    statusUnderReview: 'समीक्षाधीन',
    statusClosed: 'बंद',

    showingFooter: (start: number, end: number, total: number) => `कुल ${total} टेंडर में से ${start} - ${end} दिखाए जा रहे हैं`,
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

    pageTitle: 'Tenders',
    pageSubtitle: 'Create tenders for your requirements and receive bids from verified artisans and producer groups.',
    createTender: '+ Create Tender',

    allTenders: 'All Tenders',
    drafts: 'Drafts',
    active: 'Active',
    closed: 'Closed',

    categoryLabel: 'Category',
    statusLabel: 'Status',
    allCategories: 'All',
    allStatuses: 'All',
    searchPlaceholder: 'Search tenders...',

    thTitle: 'Title',
    thCategory: 'Category',
    thQuantity: 'Quantity',
    thDeadline: 'Submission Deadline',
    thStatus: 'Status',
    thActions: 'Actions',

    viewBids: 'View Bids',
    viewDetails: 'View Details',

    statusActive: 'Active',
    statusOpen: 'Open',
    statusUnderReview: 'Under Review',
    statusClosed: 'Closed',

    showingFooter: (start: number, end: number, total: number) => `Showing ${start} - ${end} of ${total} tenders`,
  },
};

const TENDERS_LIST = [
  {
    id: '1',
    titleEn: 'Bamboo Baskets Bulk Order',
    titleHi: 'बांस की टोकरियां थोक आदेश',
    categoryEn: 'Craft Items',
    categoryHi: 'हस्तशिल्प वस्तुएं',
    quantityEn: '500 units',
    quantityHi: '500 इकाइयां',
    deadline: '25 Aug 2025',
    status: 'active',
  },
  {
    id: '2',
    titleEn: 'Terracotta Diyas for Festival',
    titleHi: 'त्योहार के लिए टेराकोटा दीये',
    categoryEn: 'Pottery',
    categoryHi: 'मिट्टी के बर्तन',
    quantityEn: '1,000 units',
    quantityHi: '1,000 इकाइयां',
    deadline: '10 Sep 2025',
    status: 'open',
  },
  {
    id: '3',
    titleEn: 'Handwoven Shawls',
    titleHi: 'हाथ से बुने हुए शॉल',
    categoryEn: 'Textiles',
    categoryHi: 'कपड़ा और वस्त्र',
    quantityEn: '200 units',
    quantityHi: '200 इकाइयां',
    deadline: '15 Sep 2025',
    status: 'active',
  },
  {
    id: '4',
    titleEn: 'Jute Bags',
    titleHi: 'जूट बैग',
    categoryEn: 'Accessories',
    categoryHi: 'सहायक उपकरण',
    quantityEn: '500 units',
    quantityHi: '500 इकाइयां',
    deadline: '30 Sep 2025',
    status: 'under_review',
  },
  {
    id: '5',
    titleEn: 'Wall Hangings',
    titleHi: 'वॉल हैंगिंग',
    categoryEn: 'Home Decor',
    categoryHi: 'होम डेकोर',
    quantityEn: '150 units',
    quantityHi: '150 इकाइयां',
    deadline: '12 Oct 2025',
    status: 'closed',
  },
  {
    id: '6',
    titleEn: 'Kitchenware Set',
    titleHi: 'किचनवेयर सेट',
    categoryEn: 'Kitchenware',
    categoryHi: 'रसोई का सामान',
    quantityEn: '250 units',
    quantityHi: '250 इकाइयां',
    deadline: '05 Sep 2025',
    status: 'closed',
  },
];

export default function GovtActiveTendersScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang] = useGlobalLang();
  const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'active' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter] = useState('All');
  const [statusFilter] = useState('All');

  const t = TRANSLATIONS[selectedLang as keyof typeof TRANSLATIONS];
  const isHindi = selectedLang === 'hi';

  const filteredTenders = TENDERS_LIST.filter((item) => {
    if (activeTab === 'drafts') return false;
    if (activeTab === 'active' && item.status === 'closed') return false;
    if (activeTab === 'closed' && item.status !== 'closed') return false;

    const title = isHindi ? item.titleHi : item.titleEn;
    const category = isHindi ? item.categoryHi : item.categoryEn;
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const renderStatusPill = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <View style={[styles.statusPill, { backgroundColor: '#DCFCE7' }]}>
            <Text style={[styles.statusPillText, { color: '#166534' }]}>{t.statusActive}</Text>
          </View>
        );
      case 'open':
        return (
          <View style={[styles.statusPill, { backgroundColor: '#DBEAFE' }]}>
            <Text style={[styles.statusPillText, { color: '#1E40AF' }]}>{t.statusOpen}</Text>
          </View>
        );
      case 'under_review':
        return (
          <View style={[styles.statusPill, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.statusPillText, { color: '#92400E' }]}>{t.statusUnderReview}</Text>
          </View>
        );
      case 'closed':
      default:
        return (
          <View style={[styles.statusPill, { backgroundColor: '#F1F5F9' }]}>
            <Text style={[styles.statusPillText, { color: '#475569' }]}>{t.statusClosed}</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <View style={styles.container}>
        <View style={styles.mainRow}>
          {/* 1. Shared Left Sidebar Component */}
          {isDesktop && <GovtSidebar activeKey="tenders" />}

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
              {/* Page Title & Create Tender Header */}
              <View style={styles.pageHeaderRow}>
                <View style={{ flex: 1, paddingRight: 16 }}>
                  <Text style={styles.pageTitle}>{t.pageTitle}</Text>
                  <Text style={styles.pageSubtitle}>{t.pageSubtitle}</Text>
                </View>

                <TouchableOpacity
                  style={styles.createTenderBtn}
                  onPress={() => router.push('/govt-create-tender')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.createTenderBtnText}>{t.createTender}</Text>
                </TouchableOpacity>
              </View>

              {/* Filter Tabs Bar */}
              <View style={styles.tabsRow}>
                <TouchableOpacity
                  style={[styles.tabItem, activeTab === 'all' && styles.tabItemActive]}
                  onPress={() => setActiveTab('all')}
                >
                  <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                    {t.allTenders}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabItem, activeTab === 'drafts' && styles.tabItemActive]}
                  onPress={() => setActiveTab('drafts')}
                >
                  <Text style={[styles.tabText, activeTab === 'drafts' && styles.tabTextActive]}>
                    {t.drafts}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabItem, activeTab === 'active' && styles.tabItemActive]}
                  onPress={() => setActiveTab('active')}
                >
                  <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
                    {t.active}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabItem, activeTab === 'closed' && styles.tabItemActive]}
                  onPress={() => setActiveTab('closed')}
                >
                  <Text style={[styles.tabText, activeTab === 'closed' && styles.tabTextActive]}>
                    {t.closed}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Main Card Container */}
              <View style={styles.mainCard}>
                {/* Search & Filter Controls Bar */}
                <View style={styles.filtersBarRow}>
                  <View style={styles.dropdownCol}>
                    <Text style={styles.fieldLabel}>{t.categoryLabel}</Text>
                    <TouchableOpacity style={styles.dropdownBox}>
                      <Text style={styles.dropdownBoxText}>{categoryFilter}</Text>
                      <Ionicons name="chevron-down" size={14} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dropdownCol}>
                    <Text style={styles.fieldLabel}>{t.statusLabel}</Text>
                    <TouchableOpacity style={styles.dropdownBox}>
                      <Text style={styles.dropdownBoxText}>{statusFilter}</Text>
                      <Ionicons name="chevron-down" size={14} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.searchBoxCol}>
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
                </View>

                {/* Data Table */}
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.thText, { flex: 2.2 }]}>{t.thTitle}</Text>
                    <Text style={[styles.thText, { flex: 1.2 }]}>{t.thCategory}</Text>
                    <Text style={[styles.thText, { flex: 1.1 }]}>{t.thQuantity}</Text>
                    <Text style={[styles.thText, { flex: 1.6 }]}>{t.thDeadline}</Text>
                    <Text style={[styles.thText, { flex: 1.2 }]}>{t.thStatus}</Text>
                    <Text style={[styles.thText, { flex: 1.5, textAlign: 'center' }]}>{t.thActions}</Text>
                  </View>

                  {filteredTenders.map((item) => (
                    <View style={styles.tableDataRow} key={item.id}>
                      <View style={{ flex: 2.2, paddingRight: 10 }}>
                        <Text style={styles.tdTitleText}>{isHindi ? item.titleHi : item.titleEn}</Text>
                      </View>

                      <Text style={[styles.tdCategoryText, { flex: 1.2 }]}>
                        {isHindi ? item.categoryHi : item.categoryEn}
                      </Text>

                      <Text style={[styles.tdText, { flex: 1.1 }]}>
                        {isHindi ? item.quantityHi : item.quantityEn}
                      </Text>

                      <Text style={[styles.tdText, { flex: 1.6 }]}>{item.deadline}</Text>

                      <View style={{ flex: 1.2, justifyContent: 'center' }}>
                        {renderStatusPill(item.status)}
                      </View>

                      <View style={styles.actionCell}>
                        <TouchableOpacity
                          style={styles.actionOutlineBtn}
                          onPress={() => router.push('/govt-bids-received')}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.actionOutlineBtnText}>
                            {item.status === 'closed' ? t.viewDetails : t.viewBids}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.optionsMenuBtn} activeOpacity={0.6}>
                          <Ionicons name="ellipsis-vertical" size={16} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}

                  {filteredTenders.length === 0 && (
                    <View style={styles.emptyContainer}>
                      <Ionicons name="document-text-outline" size={40} color="#D1D5DB" />
                      <Text style={styles.emptyText}>No tenders found matching criteria</Text>
                    </View>
                  )}
                </View>

                {/* Table Footer / Pagination */}
                <View style={styles.tableFooterRow}>
                  <Text style={styles.footerShowingText}>
                    {t.showingFooter(
                      filteredTenders.length > 0 ? 1 : 0,
                      filteredTenders.length,
                      filteredTenders.length
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    lineHeight: 18,
  },
  createTenderBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 1,
  },
  createTenderBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 24,
  },
  tabItem: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#2E7D32',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 18,
    gap: 16,
    elevation: 1,
  },
  filtersBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  dropdownCol: {
    width: 140,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
  },
  dropdownBoxText: {
    fontSize: 12,
    color: '#111827',
  },
  searchBoxCol: {
    flex: 1,
    minWidth: 200,
    justifyContent: 'flex-end',
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
    marginTop: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#111827',
    padding: 0,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  thText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tdTitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  tdCategoryText: {
    fontSize: 12,
    color: '#4B5563',
  },
  tdText: {
    fontSize: 12,
    color: '#4B5563',
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionCell: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionOutlineBtn: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  actionOutlineBtnText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
  },
  optionsMenuBtn: {
    padding: 4,
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
    paddingTop: 8,
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
