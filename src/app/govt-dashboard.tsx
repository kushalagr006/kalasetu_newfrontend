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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalLang } from '@/utils/languageStore';
import { GovtSidebar, GovtTopHeader } from '@/components/GovtLayout';

const TRANSLATIONS_GOVT = {
  hi: {
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
    officerTitle: 'Officer',
    officerRole: 'Department Officer',
    helloOfficer: 'Hello, Officer',
    helloSubtitle: 'Access authentic Indian handicrafts and products, or create tenders for your requirements.',
    bannerTitle: 'Support Artisans. Strengthen Rural India.',
    buyProductsTitle: 'Buy Products',
    buyProductsSub: 'Browse and purchase available products directly.',
    createTenderTitle: 'Create Tender',
    createTenderSub: 'Publish your requirement and invite bids from artisans/SHGs.',
    myOrdersTitle: 'My Orders',
    myOrdersSub: 'Track all your purchases and tender orders.',
    recentOrdersTitle: 'Recent Orders / Tenders',
    viewAll: 'View All →',
    thTitle: 'Title',
    thType: 'Type',
    thDate: 'Date',
    thStatus: 'Status',
    thAction: 'Action',
    viewBtn: 'View',
    purchase: 'Purchase',
    tender: 'Tender',
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
    officerTitle: 'Officer',
    officerRole: 'Department Officer',
    helloOfficer: 'Hello, Officer',
    helloSubtitle: 'Access authentic Indian handicrafts and products, or create tenders for your requirements.',
    bannerTitle: 'Support Artisans. Strengthen Rural India.',
    buyProductsTitle: 'Buy Products',
    buyProductsSub: 'Browse and purchase available products directly.',
    createTenderTitle: 'Create Tender',
    createTenderSub: 'Publish your requirement and invite bids from artisans/SHGs.',
    myOrdersTitle: 'My Orders',
    myOrdersSub: 'Track all your purchases and tender orders.',
    recentOrdersTitle: 'Recent Orders / Tenders',
    viewAll: 'View All →',
    thTitle: 'Title',
    thType: 'Type',
    thDate: 'Date',
    thStatus: 'Status',
    thAction: 'Action',
    viewBtn: 'View',
    purchase: 'Purchase',
    tender: 'Tender',
  },
};

const RECENT_ITEMS = [
  {
    id: '1',
    titleHi: 'बांस की टोकरी (500 पीस)',
    titleEn: 'Bamboo Basket (500 Pcs)',
    type: 'purchase',
    dateHi: '25 अगस्त 2026',
    dateEn: '25 Aug 2026',
    statusHi: 'वितरित',
    statusEn: 'Delivered',
    statusBg: '#DCFCE7',
    statusColor: '#166534',
    route: '/govt-my-orders',
  },
  {
    id: '2',
    titleHi: 'कार्यालय सजावट हेतु हस्तशिल्प सामग्री',
    titleEn: 'Handicraft Items for Office Decor',
    type: 'tender',
    dateHi: '20 अगस्त 2026',
    dateEn: '20 Aug 2026',
    statusHi: 'एक्टिव',
    statusEn: 'Active',
    statusBg: '#DCFCE7',
    statusColor: '#166534',
    route: '/govt-active-tenders',
  },
  {
    id: '3',
    titleHi: 'टेराकोटा लैंप सेट (200 पीस)',
    titleEn: 'Terracotta Lamp Set (200 Pcs)',
    type: 'purchase',
    dateHi: '15 अगस्त 2026',
    dateEn: '15 Aug 2026',
    statusHi: 'प्रोसेसिंग',
    statusEn: 'Processing',
    statusBg: '#DBEAFE',
    statusColor: '#1E40AF',
    route: '/govt-my-orders',
  },
  {
    id: '4',
    titleHi: 'बांस की कुर्सी आपूर्ति टेंडर',
    titleEn: 'Bamboo Chair Supply Tender',
    type: 'tender',
    dateHi: '10 अगस्त 2026',
    dateEn: '10 Aug 2026',
    statusHi: 'समीक्षाधीन',
    statusEn: 'Under Review',
    statusBg: '#FEF3C7',
    statusColor: '#92400E',
    route: '/govt-active-tenders',
  },
];

export default function WebGovtDashboard() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang] = useGlobalLang();
  const t = TRANSLATIONS_GOVT[selectedLang as keyof typeof TRANSLATIONS_GOVT];
  const isHindi = selectedLang === 'hi';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <View style={styles.container}>
        <View style={styles.mainLayoutRow}>
          {/* 1. Shared Left Sidebar Component */}
          {isDesktop && <GovtSidebar activeKey="dashboard" />}

          {/* 2. Main Right Content Area */}
          <View style={styles.contentCol}>
            {/* Shared Top Bar Header */}
            <GovtTopHeader />

            {/* Dashboard Scroll Body */}
            <ScrollView
              style={styles.dashboardScrollView}
              contentContainerStyle={styles.dashboardScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Top Greeting Row */}
              <View style={styles.greetingRow}>
                <View style={styles.greetingTextGroup}>
                  <Text style={styles.greetingTitle}>{t.helloOfficer}</Text>
                  <Text style={styles.greetingSubtitle}>{t.helloSubtitle}</Text>
                </View>
              </View>

              {/* 3 Quick Action Cards Row */}
              <View style={styles.actionCardsRow}>
                {/* 1. Buy Products */}
                <TouchableOpacity
                  style={[styles.actionCard, styles.buyProductsCardBg]}
                  onPress={() => router.push('/govt-buy-products')}
                  activeOpacity={0.88}
                >
                  <View style={styles.actionCardLeft}>
                    <View style={[styles.actionIconCircle, { backgroundColor: '#C8E6C9' }]}>
                      <Ionicons name="cart-outline" size={26} color="#3B6029" />
                    </View>
                    <View style={styles.actionTextGroup}>
                      <Text style={styles.actionCardTitle}>{t.buyProductsTitle}</Text>
                      <Text style={styles.actionCardSub}>{t.buyProductsSub}</Text>
                    </View>
                  </View>
                  <Ionicons name="arrow-forward" size={20} color="#1E293B" />
                </TouchableOpacity>

                {/* 2. Create Tender */}
                <TouchableOpacity
                  style={[styles.actionCard, styles.createTenderCardBg]}
                  onPress={() => router.push('/govt-create-tender')}
                  activeOpacity={0.88}
                >
                  <View style={styles.actionCardLeft}>
                    <View style={[styles.actionIconCircle, { backgroundColor: '#C8E6C9' }]}>
                      <Ionicons name="document-text-outline" size={26} color="#3B6029" />
                    </View>
                    <View style={styles.actionTextGroup}>
                      <Text style={styles.actionCardTitle}>{t.createTenderTitle}</Text>
                      <Text style={styles.actionCardSub}>{t.createTenderSub}</Text>
                    </View>
                  </View>
                  <Ionicons name="arrow-forward" size={20} color="#1E293B" />
                </TouchableOpacity>

                {/* 3. My Orders */}
                <TouchableOpacity
                  style={[styles.actionCard, styles.myOrdersCardBg]}
                  onPress={() => router.push('/govt-my-orders')}
                  activeOpacity={0.88}
                >
                  <View style={styles.actionCardLeft}>
                    <View style={[styles.actionIconCircle, { backgroundColor: '#C8E6C9' }]}>
                      <Ionicons name="briefcase-outline" size={26} color="#3B6029" />
                    </View>
                    <View style={styles.actionTextGroup}>
                      <Text style={styles.actionCardTitle}>{t.myOrdersTitle}</Text>
                      <Text style={styles.actionCardSub}>{t.myOrdersSub}</Text>
                    </View>
                  </View>
                  <Ionicons name="arrow-forward" size={20} color="#1E293B" />
                </TouchableOpacity>
              </View>

              {/* Recent Orders / Tenders Table Section */}
              <View style={styles.recentSectionCard}>
                <View style={styles.recentSectionHeader}>
                  <Text style={styles.recentSectionTitle}>{t.recentOrdersTitle}</Text>
                  <TouchableOpacity onPress={() => router.push('/govt-my-orders')}>
                    <Text style={styles.viewAllBtnText}>{t.viewAll}</Text>
                  </TouchableOpacity>
                </View>

                {/* Table */}
                <View style={styles.tableWrapper}>
                  {/* Table Header Row */}
                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.thCell, { flex: 2.5 }]}>{t.thTitle}</Text>
                    <Text style={[styles.thCell, { flex: 1.2 }]}>{t.thType}</Text>
                    <Text style={[styles.thCell, { flex: 1.5 }]}>{t.thDate}</Text>
                    <Text style={[styles.thCell, { flex: 1.2 }]}>{t.thStatus}</Text>
                    <Text style={[styles.thCell, { flex: 1, textAlign: 'center' }]}>{t.thAction}</Text>
                  </View>

                  {/* Table Data Rows */}
                  {RECENT_ITEMS.map((item) => (
                    <View style={styles.tableDataRow} key={item.id}>
                      <Text style={[styles.tdCellBold, { flex: 2.5 }]} numberOfLines={1}>
                        {isHindi ? item.titleHi : item.titleEn}
                      </Text>

                      <View style={{ flex: 1.2 }}>
                        <View
                          style={[
                            styles.typePill,
                            {
                              backgroundColor:
                                item.type === 'purchase' ? '#DCFCE7' : '#E0E7FF',
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.typePillText,
                              {
                                color:
                                  item.type === 'purchase' ? '#166534' : '#3730A3',
                              },
                            ]}
                          >
                            {item.type === 'purchase' ? t.purchase : t.tender}
                          </Text>
                        </View>
                      </View>

                      <Text style={[styles.tdCellText, { flex: 1.5 }]}>
                        {isHindi ? item.dateHi : item.dateEn}
                      </Text>

                      <View style={{ flex: 1.2 }}>
                        <View style={[styles.statusPill, { backgroundColor: item.statusBg }]}>
                          <Text style={[styles.statusPillText, { color: item.statusColor }]}>
                            {isHindi ? item.statusHi : item.statusEn}
                          </Text>
                        </View>
                      </View>

                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity
                          style={styles.actionViewBtn}
                          onPress={() => router.push(item.route as any)}
                        >
                          <Text style={styles.actionViewBtnText}>{t.viewBtn}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
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
  mainLayoutRow: {
    flex: 1,
    flexDirection: 'row',
  },
  contentCol: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  dashboardScrollView: {
    flex: 1,
  },
  dashboardScrollContent: {
    padding: 28,
    gap: 24,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
  greetingTextGroup: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  govtBadgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2 },
    }),
    elevation: 1,
  },
  govtEmblemCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  govtBadgeTextGroup: {},
  govtBadgeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  govtBadgeSub: {
    fontSize: 11,
    color: '#4B5563',
  },

  /* Action Cards */
  actionCardsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    }),
    elevation: 1,
  },
  buyProductsCardBg: {},
  createTenderCardBg: {},
  myOrdersCardBg: {},
  actionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextGroup: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  actionCardSub: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },

  /* Recent Section */
  recentSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    }),
    elevation: 1,
  },
  recentSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recentSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  viewAllBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B6029',
  },

  /* Table */
  tableWrapper: {
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  thCell: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  tdCellBold: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#111827',
  },
  tdCellText: {
    fontSize: 13,
    color: '#4B5563',
  },
  typePill: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  typePillText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  actionViewBtn: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  actionViewBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});
