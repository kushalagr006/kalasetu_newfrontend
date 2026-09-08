import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  useWindowDimensions,
  Modal,
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

    pageTitle: 'मेरे ऑर्डर',
    pageSubtitle: 'अपनी खरीदारी और टेंडर ऑर्डर की स्थिति ट्रैक और प्रबंधित करें।',

    allOrders: 'सभी ऑर्डर',
    directPurchase: 'प्रत्यक्ष खरीद',
    tenderOrders: 'टेंडर ऑर्डर',

    thOrderId: 'ऑर्डर आईडी',
    thTitle: 'उत्पाद / टेंडर शीर्षक',
    thType: 'प्रकार',
    thQuantity: 'मात्रा',
    thOrderDate: 'ऑर्डर तिथि',
    thStatus: 'स्थिति',
    thAction: 'कार्रवाई',

    viewDetails: 'विवरण देखें',

    typeDirect: 'प्रत्यक्ष खरीद',
    typeTender: 'टेंडर ऑर्डर',

    statusDelivered: 'डिलीवर किया गया',
    statusInTransit: 'मार्ग में',
    statusInProgress: 'प्रगति पर',
    statusCancelled: 'रद्द कर दिया गया',

    showingFooter: (start: number, end: number, total: number) => `कुल ${total} ऑर्डर में से ${start} - ${end} दिखाए जा रहे हैं`,
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

    pageTitle: 'My Orders',
    pageSubtitle: 'Track and manage your purchases and tender orders.',

    allOrders: 'All Orders',
    directPurchase: 'Direct Purchase',
    tenderOrders: 'Tender Orders',

    thOrderId: 'Order ID',
    thTitle: 'Product / Tender Title',
    thType: 'Type',
    thQuantity: 'Quantity',
    thOrderDate: 'Order Date',
    thStatus: 'Status',
    thAction: 'Action',

    viewDetails: 'View Details',

    typeDirect: 'Direct Purchase',
    typeTender: 'Tender Order',

    statusDelivered: 'Delivered',
    statusInTransit: 'In Transit',
    statusInProgress: 'In Progress',
    statusCancelled: 'Cancelled',

    showingFooter: (start: number, end: number, total: number) => `Showing ${start} - ${end} of ${total} orders`,
  },
};

const ORDERS_LIST = [
  {
    id: 'ORD-001',
    titleEn: 'Bamboo Baskets Bulk Order',
    titleHi: 'बांस की टोकरियां थोक आदेश',
    subtitleEn: 'Bastar Artisans Co-op',
    subtitleHi: 'बस्तर आर्टिसन्स को-ऑप',
    type: 'direct',
    quantityEn: '500 units',
    quantityHi: '500 इकाइयां',
    orderDate: '10 Aug 2025',
    status: 'delivered',
  },
  {
    id: 'TR-002',
    titleEn: 'Terracotta Diyas for Festival',
    titleHi: 'त्योहार के लिए टेराकोटा दीये',
    subtitleEn: '(Tender)',
    subtitleHi: '(टेंडर)',
    type: 'tender',
    quantityEn: '1,000 units',
    quantityHi: '1,000 इकाइयां',
    orderDate: '05 Aug 2025',
    status: 'in_transit',
  },
  {
    id: 'ORD-003',
    titleEn: 'Handwoven Shawls',
    titleHi: 'हाथ से बुने हुए शॉल',
    subtitleEn: 'Kondagaon Weavers',
    subtitleHi: 'कोण्डागांव बुनकर',
    type: 'direct',
    quantityEn: '100 units',
    quantityHi: '100 इकाइयां',
    orderDate: '01 Aug 2025',
    status: 'in_progress',
  },
  {
    id: 'ORD-004',
    titleEn: 'Jute Carrying Bags',
    titleHi: 'जूट ले जाने वाले बैग',
    subtitleEn: 'Raigarh Jute Crafts',
    subtitleHi: 'रायगढ़ जूट क्राफ्ट्स',
    type: 'direct',
    quantityEn: '300 units',
    quantityHi: '300 इकाइयां',
    orderDate: '20 Jul 2025',
    status: 'delivered',
  },
  {
    id: 'TR-005',
    titleEn: 'Handicraft Furniture',
    titleHi: 'हस्तशिल्प फर्नीचर',
    subtitleEn: '(Tender)',
    subtitleHi: '(टेंडर)',
    type: 'tender',
    quantityEn: '50 units',
    quantityHi: '50 इकाइयां',
    orderDate: '28 Jun 2025',
    status: 'in_progress',
  },
  {
    id: 'ORD-006',
    titleEn: 'Terracotta Cup Set',
    titleHi: 'टेराकोटा कप सेट',
    subtitleEn: 'Surguja Handicrafts',
    subtitleHi: 'सरगुजा हस्तशिल्प',
    type: 'direct',
    quantityEn: '250 sets',
    quantityHi: '250 सेट',
    orderDate: '15 Jun 2025',
    status: 'cancelled',
  },
];

export default function GovtMyOrdersScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang] = useGlobalLang();
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'tender'>('all');
  const [selectedOrder, setSelectedOrder] = useState<typeof ORDERS_LIST[0] | null>(null);

  const t = (TRANSLATIONS as any)[selectedLang] || TRANSLATIONS.hi;
  const isHindi = selectedLang === 'hi';

  const filteredOrders = ORDERS_LIST.filter((item) => {
    if (activeTab === 'direct') return item.type === 'direct';
    if (activeTab === 'tender') return item.type === 'tender';
    return true;
  });

  const renderTypePill = (type: string) => {
    if (type === 'direct') {
      return (
        <View style={[styles.pillBadge, { backgroundColor: '#DCFCE7' }]}>
          <Text style={[styles.pillText, { color: '#166534' }]}>{t.typeDirect}</Text>
        </View>
      );
    }
    return (
      <View style={[styles.pillBadge, { backgroundColor: '#E0E7FF' }]}>
        <Text style={[styles.pillText, { color: '#3730A3' }]}>{t.typeTender}</Text>
      </View>
    );
  };

  const renderStatusPill = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <View style={[styles.pillBadge, { backgroundColor: '#DCFCE7' }]}>
            <Text style={[styles.pillText, { color: '#166534' }]}>{t.statusDelivered}</Text>
          </View>
        );
      case 'in_transit':
        return (
          <View style={[styles.pillBadge, { backgroundColor: '#DBEAFE' }]}>
            <Text style={[styles.pillText, { color: '#1E40AF' }]}>{t.statusInTransit}</Text>
          </View>
        );
      case 'in_progress':
        return (
          <View style={[styles.pillBadge, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.pillText, { color: '#92400E' }]}>{t.statusInProgress}</Text>
          </View>
        );
      case 'cancelled':
      default:
        return (
          <View style={[styles.pillBadge, { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.pillText, { color: '#991B1B' }]}>{t.statusCancelled}</Text>
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
          {isDesktop && <GovtSidebar activeKey="myOrders" />}

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
              {/* Page Header */}
              <View style={styles.pageHeaderRow}>
                <View>
                  <Text style={styles.pageTitle}>{t.pageTitle}</Text>
                  <Text style={styles.pageSubtitle}>{t.pageSubtitle}</Text>
                </View>
              </View>

              {/* Tabs Bar */}
              <View style={styles.tabsRow}>
                <TouchableOpacity
                  style={[styles.tabItem, activeTab === 'all' && styles.tabItemActive]}
                  onPress={() => setActiveTab('all')}
                >
                  <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                    {t.allOrders}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabItem, activeTab === 'direct' && styles.tabItemActive]}
                  onPress={() => setActiveTab('direct')}
                >
                  <Text style={[styles.tabText, activeTab === 'direct' && styles.tabTextActive]}>
                    {t.directPurchase}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabItem, activeTab === 'tender' && styles.tabItemActive]}
                  onPress={() => setActiveTab('tender')}
                >
                  <Text style={[styles.tabText, activeTab === 'tender' && styles.tabTextActive]}>
                    {t.tenderOrders}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Main Card Container */}
              <View style={styles.mainCard}>
                {/* Data Table */}
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.thText, { flex: 1.2 }]}>{t.thOrderId}</Text>
                    <Text style={[styles.thText, { flex: 2.4 }]}>{t.thTitle}</Text>
                    <Text style={[styles.thText, { flex: 1.5 }]}>{t.thType}</Text>
                    <Text style={[styles.thText, { flex: 1.2 }]}>{t.thQuantity}</Text>
                    <Text style={[styles.thText, { flex: 1.4 }]}>{t.thOrderDate}</Text>
                    <Text style={[styles.thText, { flex: 1.4 }]}>{t.thStatus}</Text>
                    <Text style={[styles.thText, { flex: 1.2, textAlign: 'center' }]}>{t.thAction}</Text>
                  </View>

                  {filteredOrders.map((item) => (
                    <View style={styles.tableDataRow} key={item.id}>
                      <Text style={[styles.tdCodeText, { flex: 1.2 }]}>{item.id}</Text>

                      <View style={{ flex: 2.4, paddingRight: 10 }}>
                        <Text style={styles.tdTitleText}>{isHindi ? item.titleHi : item.titleEn}</Text>
                        <Text style={styles.tdSubtext}>{isHindi ? item.subtitleHi : item.subtitleEn}</Text>
                      </View>

                      <View style={{ flex: 1.5 }}>
                        {renderTypePill(item.type)}
                      </View>

                      <Text style={[styles.tdText, { flex: 1.2 }]}>
                        {isHindi ? item.quantityHi : item.quantityEn}
                      </Text>

                      <Text style={[styles.tdText, { flex: 1.4 }]}>{item.orderDate}</Text>

                      <View style={{ flex: 1.4 }}>
                        {renderStatusPill(item.status)}
                      </View>

                      <View style={styles.actionCell}>
                        <TouchableOpacity
                          style={styles.actionOutlineBtn}
                          onPress={() => setSelectedOrder(item)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.actionOutlineBtnText}>{t.viewDetails}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Table Footer / Pagination */}
                <View style={styles.tableFooterRow}>
                  <Text style={styles.footerShowingText}>
                    {t.showingFooter(
                      filteredOrders.length > 0 ? 1 : 0,
                      filteredOrders.length,
                      filteredOrders.length
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

        {/* Modal for Order Details */}
        {selectedOrder && (
          <Modal transparent animationType="fade" visible={!!selectedOrder}>
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={() => setSelectedOrder(null)}
            >
              <View style={styles.modalContentCard}>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitleText}>
                    {selectedOrder.id} - {isHindi ? selectedOrder.titleHi : selectedOrder.titleEn}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                    <Ionicons name="close" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                <View style={{ gap: 10, marginVertical: 14 }}>
                  <Text style={styles.modalDetailLabel}>
                    Supplier: <Text style={{ color: '#111827', fontWeight: 'normal' }}>{isHindi ? selectedOrder.subtitleHi : selectedOrder.subtitleEn}</Text>
                  </Text>
                  <Text style={styles.modalDetailLabel}>
                    Quantity: <Text style={{ color: '#111827', fontWeight: 'normal' }}>{isHindi ? selectedOrder.quantityHi : selectedOrder.quantityEn}</Text>
                  </Text>
                  <Text style={styles.modalDetailLabel}>
                    Order Date: <Text style={{ color: '#111827', fontWeight: 'normal' }}>{selectedOrder.orderDate}</Text>
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setSelectedOrder(null)}
                >
                  <Text style={styles.modalCloseBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
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
  tdCodeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  tdTitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  tdSubtext: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  tdText: {
    fontSize: 12,
    color: '#4B5563',
  },
  pillBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionCell: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContentCard: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
  },
  modalTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  modalDetailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  modalCloseBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#2E7D32',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginTop: 10,
  },
  modalCloseBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
