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
import { useGlobalLang, LangCode } from '@/utils/languageStore';

type StatusTab = 'all' | 'draft' | 'active' | 'evaluation' | 'awarded' | 'closed';

const TRANSLATIONS_MY_TENDERS = {
  hi: {
    dashboard: 'डैशबोर्ड',
    createTender: 'नया टेंडर बनाएं',
    activeTenders: 'एक्टिव टेंडर',
    myTenders: 'मेरे टेंडर',
    bidsReceived: 'बिड प्राप्त',
    awardedTenders: 'पुरस्कारित टेंडर',
    notifications: 'सूचनाएं',
    messages: 'संदेश',
    settings: 'सेटिंग्स',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    deptName: 'छत्तीसगढ़ शासन',
    deptState: 'खरीद विभाग',
    pageTitle: 'मेरे टेंडर',
    pageSubtitle: 'यहाँ आपके सभी टेंडर की स्थिति देख सकते हैं।',
    filterBtn: 'फ़िल्टर',
    tabAll: 'सभी',
    tabDraft: 'ड्राफ्ट',
    tabActive: 'एक्टिव',
    tabEval: 'मूल्यांकन में',
    tabAwarded: 'पुरस्कारित',
    tabClosed: 'बंद',
    thDetail: 'टेंडर विवरण',
    thQty: 'मात्रा',
    thStartPrice: 'शुरुआती मूल्य',
    thBids: 'बिड प्राप्त',
    thStatus: 'स्थिति',
    thDeadline: 'अंतिम तिथि',
    thAction: 'कार्रवाई',
    bidsCountLabel: 'बिड',
    daysLeft: 'दिन शेष',
    expiredLabel: 'समाप्त',
    viewDetails: 'विवरण देखें',
    continueBtn: 'जारी करें',
    footerInfo: 'कुल 14 टेंडर',
  },
  en: {
    dashboard: 'Dashboard',
    createTender: 'Create New Tender',
    activeTenders: 'Active Tenders',
    myTenders: 'My Tenders',
    bidsReceived: 'Bids Received',
    awardedTenders: 'Awarded Tenders',
    notifications: 'Notifications',
    messages: 'Messages',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    deptName: 'Govt of Chhattisgarh',
    deptState: 'Procurement Dept',
    pageTitle: 'My Tenders',
    pageSubtitle: 'Here you can see the status of all your tenders.',
    filterBtn: 'Filter',
    tabAll: 'All',
    tabDraft: 'Draft',
    tabActive: 'Active',
    tabEval: 'Under Eval',
    tabAwarded: 'Awarded',
    tabClosed: 'Closed',
    thDetail: 'Tender Details',
    thQty: 'Quantity',
    thStartPrice: 'Starting Price',
    thBids: 'Bids Recd.',
    thStatus: 'Status',
    thDeadline: 'Deadline',
    thAction: 'Action',
    bidsCountLabel: 'Bids',
    daysLeft: 'days left',
    expiredLabel: 'Expired',
    viewDetails: 'View Details',
    continueBtn: 'Continue',
    footerInfo: 'Total 14 Tenders',
  },
};

const ALL_MY_TENDERS = [
  {
    id: '1',
    titleHi: 'बांस की टोकरी',
    titleEn: 'Bamboo Basket',
    categoryHi: 'हस्तशिल्प सामग्री',
    categoryEn: 'Craft Items',
    qty: '500',
    unitHi: 'पीस',
    unitEn: 'Pcs',
    price: '450',
    bidsCount: 12,
    status: 'active',
    statusTextHi: 'एक्टिव',
    statusTextEn: 'Active',
    statusBg: '#E8F5E9',
    statusColor: '#2E7D32',
    deadlineDate: '30 मई 2025',
    daysLeftTextHi: '5 दिन शेष',
    daysLeftTextEn: '5 days left',
    actionType: 'view',
    image: require('@/assets/images/govt_item_basket.png'),
  },
  {
    id: '2',
    titleHi: 'बांस की कुर्सी',
    titleEn: 'Bamboo Chair',
    categoryHi: 'फर्नीचर',
    categoryEn: 'Furniture',
    qty: '100',
    unitHi: 'पीस',
    unitEn: 'Pcs',
    price: '850',
    bidsCount: 7,
    status: 'evaluation',
    statusTextHi: 'मूल्यांकन में',
    statusTextEn: 'Under Eval',
    statusBg: '#E3F2FD',
    statusColor: '#1565C0',
    deadlineDate: '02 जून 2025',
    daysLeftTextHi: '8 दिन शेष',
    daysLeftTextEn: '8 days left',
    actionType: 'view',
    image: require('@/assets/images/govt_item_chair.png'),
  },
  {
    id: '3',
    titleHi: 'बांस लैम्पशेड',
    titleEn: 'Bamboo Lampshade',
    categoryHi: 'होम डेकोर',
    categoryEn: 'Home Decor',
    qty: '200',
    unitHi: 'पीस',
    unitEn: 'Pcs',
    price: '550',
    bidsCount: 5,
    status: 'active',
    statusTextHi: 'एक्टिव',
    statusTextEn: 'Active',
    statusBg: '#E8F5E9',
    statusColor: '#2E7D32',
    deadlineDate: '05 जून 2025',
    daysLeftTextHi: '11 दिन शेष',
    daysLeftTextEn: '11 days left',
    actionType: 'view',
    image: require('@/assets/images/govt_item_lampshade.png'),
  },
  {
    id: '4',
    titleHi: 'बांस सर्विंग ट्रे',
    titleEn: 'Bamboo Serving Tray',
    categoryHi: 'रसोई उपयोग',
    categoryEn: 'Kitchenware',
    qty: '300',
    unitHi: 'पीस',
    unitEn: 'Pcs',
    price: '350',
    bidsCount: 3,
    status: 'draft',
    statusTextHi: 'ड्राफ्ट',
    statusTextEn: 'Draft',
    statusBg: '#FFF3E0',
    statusColor: '#E65100',
    deadlineDate: '-',
    daysLeftTextHi: '',
    daysLeftTextEn: '',
    actionType: 'continue',
    image: require('@/assets/images/govt_item_tray.png'),
  },
  {
    id: '5',
    titleHi: 'बांस चटाई',
    titleEn: 'Bamboo Mat',
    categoryHi: 'हैंडिक्राफ्ट',
    categoryEn: 'Handicraft',
    qty: '250',
    unitHi: 'पीस',
    unitEn: 'Pcs',
    price: '280',
    bidsCount: 0,
    status: 'closed',
    statusTextHi: 'बंद',
    statusTextEn: 'Closed',
    statusBg: '#F5F5F5',
    statusColor: '#757575',
    deadlineDate: '15 मई 2025',
    daysLeftTextHi: 'समाप्त',
    daysLeftTextEn: 'Expired',
    actionType: 'view',
    image: require('@/assets/images/govt_item_mat.png'),
  },
];

export default function GovtMyTendersScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const t = TRANSLATIONS_MY_TENDERS.en;
  const isHindi = false;

  const filteredTenders = ALL_MY_TENDERS.filter((item) => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        <View style={styles.mainLayoutRow}>
          {/* 1. Unified Left Sidebar Navigation */}
          {isDesktop && (
            <View style={styles.sidebarCol}>
              <View style={styles.sidebarTopGroup}>
                {/* Brand Logo Header */}
                <View style={styles.sidebarBrandRow}>
                  <Image
                    source={require('@/assets/images/logo_icon.png')}
                    style={styles.sidebarLogoImage}
                    resizeMode="contain"
                  />
                </View>

                {/* Sidebar Navigation Items */}
                <View style={styles.sidebarMenuGroup}>
                  {/* 1. डैशबोर्ड */}
                  <TouchableOpacity
                    style={styles.sidebarNavItem}
                    onPress={() => router.push('/govt-dashboard')}
                  >
                    <Ionicons name="home-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.dashboard}</Text>
                  </TouchableOpacity>

                  {/* 2. नया टेंडर बनाएं */}
                  <TouchableOpacity
                    style={styles.sidebarNavItem}
                    onPress={() => router.push('/govt-create-tender')}
                  >
                    <Ionicons name="add-circle-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.createTender}</Text>
                  </TouchableOpacity>

                  {/* 3. एक्टिव टेंडर */}
                  <TouchableOpacity
                    style={styles.sidebarNavItem}
                    onPress={() => router.push('/govt-active-tenders')}
                  >
                    <Ionicons name="document-text-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.activeTenders}</Text>
                  </TouchableOpacity>

                  {/* 4. मेरे टेंडर (Active Screen) */}
                  <TouchableOpacity style={[styles.sidebarNavItem, styles.sidebarNavItemActive]}>
                    <Ionicons name="folder" size={18} color="#E65100" style={{ marginRight: 12 }} />
                    <Text style={[styles.sidebarNavText, styles.sidebarNavTextActive]}>{t.myTenders}</Text>
                  </TouchableOpacity>

                  {/* 5. बिड प्राप्त */}
                  <TouchableOpacity
                    style={styles.sidebarNavItem}
                    onPress={() => router.push('/govt-bids-received')}
                  >
                    <Ionicons name="people-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.bidsReceived}</Text>
                  </TouchableOpacity>

                  {/* 6. पुरस्कारित टेंडर */}
                  <TouchableOpacity
                    style={styles.sidebarNavItem}
                    onPress={() => router.push('/govt-awarded-tenders')}
                  >
                    <Ionicons name="trophy-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.awardedTenders}</Text>
                  </TouchableOpacity>

                  {/* 7. सूचनाएं */}
                  <TouchableOpacity
                    style={styles.sidebarNavItem}
                    onPress={() => router.push('/govt-notifications')}
                  >
                    <Ionicons name="notifications-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.notifications}</Text>
                    <View style={styles.sidebarBadge}>
                      <Text style={styles.sidebarBadgeText}>2</Text>
                    </View>
                  </TouchableOpacity>

                  {/* 8. संदेश */}
                  <TouchableOpacity
                    style={styles.sidebarNavItem}
                    onPress={() => router.push('/govt-messages')}
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.messages}</Text>
                  </TouchableOpacity>

                  {/* 9. सेटिंग्स */}
                  <TouchableOpacity
                    style={styles.sidebarNavItem}
                    onPress={() => router.push('/govt-settings')}
                  >
                    <Ionicons name="settings-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.settings}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bottom Sidebar Controls */}
              <View style={styles.sidebarBottomGroup}>
                <TouchableOpacity
                  style={styles.sidebarNavItem}
                  onPress={() => router.push('/govt-profile')}
                >
                  <Ionicons name="person-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                  <Text style={styles.sidebarNavText}>{t.profile}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sidebarNavItem}
                  onPress={() => router.push('/')}
                >
                  <Ionicons name="log-out-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                  <Text style={styles.sidebarNavText}>{t.logout}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 2. Main Content Area */}
          <View style={styles.contentCol}>
            {/* Header Bar */}
            <View style={styles.headerBar}>
              <TouchableOpacity style={styles.menuToggleBtn}>
                <Ionicons name="menu" size={24} color="#1A1A1A" />
              </TouchableOpacity>

              <View style={styles.headerRightGroup}>

                {/* Notification Bell */}
                <TouchableOpacity
                  style={styles.notifBtn}
                  onPress={() => router.push('/govt-notifications')}
                >
                  <Ionicons name="notifications-outline" size={22} color="#444444" />
                  <View style={styles.notifBadge}>
                    <Text style={styles.notifBadgeText}>2</Text>
                  </View>
                </TouchableOpacity>

                {/* State Govt Badge */}
                <View style={styles.govtDeptBadge}>
                  <View style={styles.govtEmblemCircle}>
                    <Ionicons name="shield" size={14} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={styles.govtDeptName}>{t.deptName}</Text>
                    <Text style={styles.govtStateSubtitle}>{t.deptState}</Text>
                  </View>
                  <Ionicons name="chevron-down" size={14} color="#777777" style={{ marginLeft: 6 }} />
                </View>
              </View>
            </View>

            {/* Scrollable Body */}
            <ScrollView
              style={styles.dashboardScrollView}
              contentContainerStyle={styles.dashboardScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Page Title & Filter Button Bar */}
              <View style={styles.pageTitleHeaderRow}>
                <View>
                  <Text style={styles.pageTitle}>{t.pageTitle}</Text>
                  <Text style={styles.pageSubtitle}>{t.pageSubtitle}</Text>
                </View>

                <TouchableOpacity style={styles.filterBtn} activeOpacity={0.88}>
                  <Ionicons name="funnel" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.filterBtnText}>{t.filterBtn}</Text>
                </TouchableOpacity>
              </View>

              {/* Table Card Container */}
              <View style={styles.tableCardContainer}>
                {/* Status Filter Tabs Row */}
                <View style={styles.tabsRow}>
                  {/* Tab 1: सभी (14) */}
                  <TouchableOpacity
                    style={[styles.tabItem, activeTab === 'all' && styles.tabItemActive]}
                    onPress={() => setActiveTab('all')}
                  >
                    <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                      {t.tabAll} (14)
                    </Text>
                  </TouchableOpacity>

                  {/* Tab 2: ड्राफ्ट (2) */}
                  <TouchableOpacity
                    style={[styles.tabItem, activeTab === 'draft' && styles.tabItemActive]}
                    onPress={() => setActiveTab('draft')}
                  >
                    <Text style={[styles.tabText, activeTab === 'draft' && styles.tabTextActive]}>
                      {t.tabDraft} (2)
                    </Text>
                  </TouchableOpacity>

                  {/* Tab 3: एक्टिव (6) */}
                  <TouchableOpacity
                    style={[styles.tabItem, activeTab === 'active' && styles.tabItemActive]}
                    onPress={() => setActiveTab('active')}
                  >
                    <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
                      {t.tabActive} (6)
                    </Text>
                  </TouchableOpacity>

                  {/* Tab 4: मूल्यांकन में (3) */}
                  <TouchableOpacity
                    style={[styles.tabItem, activeTab === 'evaluation' && styles.tabItemActive]}
                    onPress={() => setActiveTab('evaluation')}
                  >
                    <Text style={[styles.tabText, activeTab === 'evaluation' && styles.tabTextActive]}>
                      {t.tabEval} (3)
                    </Text>
                  </TouchableOpacity>

                  {/* Tab 5: पुरस्कारित (2) */}
                  <TouchableOpacity
                    style={[styles.tabItem, activeTab === 'awarded' && styles.tabItemActive]}
                    onPress={() => setActiveTab('awarded')}
                  >
                    <Text style={[styles.tabText, activeTab === 'awarded' && styles.tabTextActive]}>
                      {t.tabAwarded} (2)
                    </Text>
                  </TouchableOpacity>

                  {/* Tab 6: बंद (1) */}
                  <TouchableOpacity
                    style={[styles.tabItem, activeTab === 'closed' && styles.tabItemActive]}
                    onPress={() => setActiveTab('closed')}
                  >
                    <Text style={[styles.tabText, activeTab === 'closed' && styles.tabTextActive]}>
                      {t.tabClosed} (1)
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Main Data Table */}
                <View style={styles.tableWrapper}>
                  {/* Table Header Row */}
                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.thCellText, { flex: 2.2 }]}>{t.thDetail}</Text>
                    <Text style={[styles.thCellText, { flex: 1.1 }]}>{t.thQty}</Text>
                    <Text style={[styles.thCellText, { flex: 1.2 }]}>{t.thStartPrice}</Text>
                    <Text style={[styles.thCellText, { flex: 1, textAlign: 'center' }]}>{t.thBids}</Text>
                    <Text style={[styles.thCellText, { flex: 1.1 }]}>{t.thStatus}</Text>
                    <Text style={[styles.thCellText, { flex: 1.4 }]}>{t.thDeadline}</Text>
                    <Text style={[styles.thCellText, { flex: 1.4, textAlign: 'center' }]}>{t.thAction}</Text>
                  </View>

                  {/* Table Data Rows */}
                  {filteredTenders.map((item) => (
                    <View style={styles.tableDataRow} key={item.id}>
                      {/* Item Thumbnail & Title */}
                      <View style={[styles.tdCell, { flex: 2.2, flexDirection: 'row', alignItems: 'center' }]}>
                        <Image source={item.image} style={styles.itemThumb} />
                        <View>
                          <Text style={styles.itemTitleText}>{isHindi ? item.titleHi : item.titleEn}</Text>
                          <Text style={styles.itemCategoryText}>{isHindi ? item.categoryHi : item.categoryEn}</Text>
                        </View>
                      </View>

                      {/* Quantity */}
                      <Text style={[styles.tdCellText, { flex: 1.1 }]}>
                        {item.qty} {isHindi ? item.unitHi : item.unitEn}
                      </Text>

                      {/* Starting Price */}
                      <Text style={[styles.tdCellText, { flex: 1.2 }]}>
                        ₹{item.price} / {isHindi ? item.unitHi : item.unitEn}
                      </Text>

                      {/* Bids Received */}
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={[styles.bidsCountVal, item.bidsCount === 0 && { color: '#888888' }]}>
                          {item.bidsCount}
                        </Text>
                        <Text style={styles.bidsCountLabel}>{t.bidsCountLabel}</Text>
                      </View>

                      {/* Status Pill */}
                      <View style={{ flex: 1.1 }}>
                        <View style={[styles.statusPill, { backgroundColor: item.statusBg }]}>
                          <Text style={[styles.statusPillText, { color: item.statusColor }]}>
                            {isHindi ? item.statusTextHi : item.statusTextEn}
                          </Text>
                        </View>
                      </View>

                      {/* Deadline Date */}
                      <View style={{ flex: 1.4 }}>
                        <Text style={styles.deadlineDateText}>{item.deadlineDate}</Text>
                        {!!item.daysLeftTextHi && (
                          <Text
                            style={[
                              styles.daysLeftSubtext,
                              item.status === 'closed' && { color: '#C62828' },
                            ]}
                          >
                            {isHindi ? item.daysLeftTextHi : item.daysLeftTextEn}
                          </Text>
                        )}
                      </View>

                      {/* Action Button */}
                      <View style={{ flex: 1.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <TouchableOpacity style={styles.actionBtn}>
                          <Text style={styles.actionBtnText}>
                            {item.actionType === 'continue' ? t.continueBtn : t.viewDetails}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 4 }}>
                          <Ionicons name="ellipsis-vertical" size={16} color="#777777" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Bottom Footer Pagination */}
                <View style={styles.tableFooterRow}>
                  <Text style={styles.tableFooterInfoText}>{t.footerInfo}</Text>

                  <View style={styles.paginationControlsRow}>
                    <TouchableOpacity style={[styles.pageBtn, styles.pageBtnDisabled]} disabled>
                      <Ionicons name="chevron-back" size={16} color="#B0B0B0" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.pageBtn, styles.pageBtnActive]}>
                      <Text style={styles.pageBtnTextActive}>1</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.pageBtn}>
                      <Text style={styles.pageBtnText}>2</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.pageBtn}>
                      <Ionicons name="chevron-forward" size={16} color="#444444" />
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
    backgroundColor: '#F7F7F8',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F8',
  },
  mainLayoutRow: {
    flex: 1,
    flexDirection: 'row',
  },
  /* 1. Sidebar */
  sidebarCol: {
    width: 230,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderColor: '#EBEBEB',
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  sidebarTopGroup: {},
  sidebarBrandRow: {
    marginBottom: 20,
  },
  sidebarLogoImage: {
    width: 170,
    height: 60,
  },
  sidebarMenuGroup: {
    gap: 4,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  sidebarNavItemActive: {
    backgroundColor: '#FFF4EB',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  sidebarNavText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
  },
  sidebarNavTextActive: {
    color: '#E65100',
    fontWeight: 'bold',
  },
  sidebarBadge: {
    marginLeft: 'auto',
    backgroundColor: '#E65100',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sidebarBottomGroup: {
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },

  /* 2. Main Content Area */
  contentCol: {
    flex: 1,
    backgroundColor: '#F7F7F8',
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
  menuToggleBtn: {
    padding: 6,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  /* Language Segmented Toggle Pill */
  langSegmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 20,
    padding: 3,
    paddingLeft: 8,
  },
  langSegmentBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  langSegmentBtnActive: {
    backgroundColor: '#E65100',
  },
  langSegmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
  },
  langSegmentTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  notifBtn: {
    position: 'relative',
    padding: 6,
  },
  notifBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#E65100',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  govtDeptBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  govtEmblemCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  govtDeptName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  govtStateSubtitle: {
    fontSize: 10,
    color: '#777777',
  },

  /* Scrollable Body */
  dashboardScrollView: {
    flex: 1,
  },
  dashboardScrollContent: {
    padding: 24,
    gap: 20,
  },
  pageTitleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#666666',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E65100',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /* Table Card Container */
  tableCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    elevation: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 16,
  },
  tabItem: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#E65100',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  tabTextActive: {
    color: '#E65100',
    fontWeight: 'bold',
  },

  /* Data Table */
  tableWrapper: {},
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF8F5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  thCellText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
  },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  tdCell: {},
  itemThumb: {
    width: 42,
    height: 42,
    borderRadius: 8,
    marginRight: 12,
  },
  itemTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  itemCategoryText: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },
  tdCellText: {
    fontSize: 13,
    color: '#444444',
  },
  bidsCountVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  bidsCountLabel: {
    fontSize: 10,
    color: '#777777',
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  deadlineDateText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
  },
  daysLeftSubtext: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444444',
  },

  /* Table Footer Pagination */
  tableFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  tableFooterInfoText: {
    fontSize: 12,
    color: '#777777',
  },
  paginationControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pageBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBtnActive: {
    backgroundColor: '#E65100',
    borderColor: '#E65100',
  },
  pageBtnDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E8E8E8',
  },
  pageBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444444',
  },
  pageBtnTextActive: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
