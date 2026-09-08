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
import { GovtSidebar, GovtTopHeader } from '@/components/GovtLayout';

const TRANSLATIONS_AWARDED = {
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
    pageTitle: 'Awarded Tenders',
    pageSubtitle: 'यहाँ आपके द्वारा आवंटित (Awarded) टेंडर की सूची है।',
    filterBtn: 'फ़िल्टर',
    thDetail: 'टेंडर विवरण',
    thTenderId: 'टेंडर आईडी',
    thAwardedTo: 'आवंटित को',
    thAmount: 'आवंटित राशि (₹)',
    thAwardDate: 'आवंटित तिथि',
    thStatus: 'स्थिति',
    thAction: 'कार्रवाई',
    statusCompleted: 'पूर्ण',
    statusInProgress: 'प्रगति पर',
    viewDetails: 'विवरण देखें',
    footerInfo: 'कुल 3 टेंडर',
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
    pageTitle: 'Awarded Tenders',
    pageSubtitle: 'Here is the list of tenders awarded by you.',
    filterBtn: 'Filter',
    thDetail: 'Tender Details',
    thTenderId: 'Tender ID',
    thAwardedTo: 'Awarded To',
    thAmount: 'Awarded Amount (₹)',
    thAwardDate: 'Award Date',
    thStatus: 'Status',
    thAction: 'Action',
    statusCompleted: 'Completed',
    statusInProgress: 'In Progress',
    viewDetails: 'View Details',
    footerInfo: 'Total 3 Tenders',
  },
};

const AWARDED_TENDERS_DATA = [
  {
    id: '1',
    tenderId: 'TND-2025-008',
    titleHi: 'बांस की टोकरी',
    titleEn: 'Bamboo Basket',
    categoryHi: 'हस्तशिल्प सामग्री',
    categoryEn: 'Craft Items',
    awardedToHi: 'शिवम हस्तशिल्प समूह',
    awardedToEn: 'Shivam Handicrafts Group',
    locationHi: 'रायपुर, छत्तीसगढ़',
    locationEn: 'Raipur, Chhattisgarh',
    amount: '2,07,500',
    awardDate: '21 मई 2025',
    status: 'completed',
    statusTextHi: 'पूर्ण',
    statusTextEn: 'Completed',
    statusBg: '#E8F5E9',
    statusColor: '#3B6029',
    image: require('@/assets/images/govt_item_basket.png'),
  },
  {
    id: '2',
    tenderId: 'TND-2025-004',
    titleHi: 'बांस की कुर्सी',
    titleEn: 'Bamboo Chair',
    categoryHi: 'फर्नीचर',
    categoryEn: 'Furniture',
    awardedToHi: 'छत्तीसगढ़ क्राफ्ट्स',
    awardedToEn: 'Chhattisgarh Crafts',
    locationHi: 'दुर्ग, छत्तीसगढ़',
    locationEn: 'Durg, Chhattisgarh',
    amount: '85,000',
    awardDate: '18 मई 2025',
    status: 'completed',
    statusTextHi: 'पूर्ण',
    statusTextEn: 'Completed',
    statusBg: '#E8F5E9',
    statusColor: '#3B6029',
    image: require('@/assets/images/govt_item_chair.png'),
  },
  {
    id: '3',
    tenderId: 'TND-2025-012',
    titleHi: 'बांस लैम्पशेड',
    titleEn: 'Bamboo Lampshade',
    categoryHi: 'होम डेकोर',
    categoryEn: 'Home Decor',
    awardedToHi: 'बस्तर आर्टिसन्स क्लब',
    awardedToEn: 'Bastar Artisans Club',
    locationHi: 'बिलासपुर, छत्तीसगढ़',
    locationEn: 'Bilaspur, Chhattisgarh',
    amount: '2,20,000',
    awardDate: '12 जून 2025',
    status: 'in_progress',
    statusTextHi: 'प्रगति पर',
    statusTextEn: 'In Progress',
    statusBg: '#E3F2FD',
    statusColor: '#1565C0',
    image: require('@/assets/images/govt_item_lampshade.png'),
  },
];

export default function GovtAwardedTendersScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const t = TRANSLATIONS_AWARDED.en;
  const isHindi = false;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        <View style={styles.mainLayoutRow}>
          {/* 1. Unified Left Sidebar Navigation */}
          {isDesktop && <GovtSidebar activeKey="tenders" />}

          {/* 2. Main Content Area */}
          <View style={styles.contentCol}>
            {/* Header Bar */}
            <GovtTopHeader />

            {/* Scrollable Body */}
            <ScrollView
              style={styles.dashboardScrollView}
              contentContainerStyle={styles.dashboardScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Page Title Header */}
              <View style={styles.pageTitleHeaderRow}>
                <View style={styles.pageTitleGroup}>
                  <Ionicons name="trophy-outline" size={24} color="#1A1A1A" style={{ marginRight: 10 }} />
                  <View>
                    <Text style={styles.pageTitle}>{t.pageTitle}</Text>
                    <Text style={styles.pageSubtitle}>{t.pageSubtitle}</Text>
                  </View>
                </View>
              </View>

              {/* Table Card Container */}
              <View style={styles.tableCardContainer}>
                {/* Data Table */}
                <View style={styles.tableWrapper}>
                  {/* Table Header Row (Light Yellow Background matching ref) */}
                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.thCellText, { flex: 2.2 }]}>{t.thDetail}</Text>
                    <Text style={[styles.thCellText, { flex: 1.3 }]}>{t.thTenderId}</Text>
                    <Text style={[styles.thCellText, { flex: 2 }]}>{t.thAwardedTo}</Text>
                    <Text style={[styles.thCellText, { flex: 1.4, textAlign: 'center' }]}>{t.thAmount}</Text>
                    <Text style={[styles.thCellText, { flex: 1.3, textAlign: 'center' }]}>{t.thAwardDate}</Text>
                    <Text style={[styles.thCellText, { flex: 1.1 }]}>{t.thStatus}</Text>
                    <Text style={[styles.thCellText, { flex: 1.4, textAlign: 'center' }]}>{t.thAction}</Text>
                  </View>

                  {/* Table Data Rows */}
                  {AWARDED_TENDERS_DATA.map((item) => (
                    <View style={styles.tableDataRow} key={item.id}>
                      {/* Item Thumbnail & Title */}
                      <View style={[styles.tdCell, { flex: 2.2, flexDirection: 'row', alignItems: 'center' }]}>
                        <Image source={item.image} style={styles.itemThumb} />
                        <View>
                          <Text style={styles.itemTitleText}>{isHindi ? item.titleHi : item.titleEn}</Text>
                          <Text style={styles.itemCategoryText}>{isHindi ? item.categoryHi : item.categoryEn}</Text>
                        </View>
                      </View>

                      {/* Tender ID */}
                      <Text style={[styles.tdCellText, { flex: 1.3, fontWeight: '600', color: '#333333' }]}>
                        {item.tenderId}
                      </Text>

                      {/* Awarded To */}
                      <View style={{ flex: 2 }}>
                        <Text style={styles.awardedToNameText}>{isHindi ? item.awardedToHi : item.awardedToEn}</Text>
                        <Text style={styles.locationSubtext}>{isHindi ? item.locationHi : item.locationEn}</Text>
                      </View>

                      {/* Awarded Amount (Bold matching ref) */}
                      <Text style={[styles.amountText, { flex: 1.4, textAlign: 'center' }]}>
                        ₹{item.amount}
                      </Text>

                      {/* Award Date */}
                      <Text style={[styles.tdCellText, { flex: 1.3, textAlign: 'center' }]}>
                        {item.awardDate}
                      </Text>

                      {/* Status Pill */}
                      <View style={{ flex: 1.1 }}>
                        <View style={[styles.statusPill, { backgroundColor: item.statusBg }]}>
                          <Text style={[styles.statusPillText, { color: item.statusColor }]}>
                            {isHindi ? item.statusTextHi : item.statusTextEn}
                          </Text>
                        </View>
                      </View>

                      {/* Action Button */}
                      <View style={{ flex: 1.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <TouchableOpacity style={styles.actionBtn}>
                          <Text style={styles.actionBtnText}>{t.viewDetails}</Text>
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
  contentCol: {
    flex: 1,
    backgroundColor: '#F7F7F8',
  },
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
  pageTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#666666',
  },
  tableCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    elevation: 1,
  },
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
  awardedToNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  locationSubtext: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2,
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
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
  pageBtnTextActive: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
