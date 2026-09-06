import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

type LangCode = 'hi' | 'en';
type OrderFilter = 'all' | 'accepted' | 'processing' | 'completed';

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'English' },
];

const TRANSLATIONS: Record<LangCode, {
  headerTitle: string;
  filterAll: string;
  filterAccepted: string;
  filterProcessing: string;
  filterCompleted: string;
  orderIdPrefix: string;
  datePrefix: string;
  itemPrefix: string;
  qtyPrefix: string;
  viewHistory: string;
  navHome: string;
  navProducts: string;
  navCustomers: string;
  navProfile: string;
  modalTitle: string;
}> = {
  hi: {
    headerTitle: 'मेरे ऑर्डर',
    filterAll: 'सभी',
    filterAccepted: 'स्वीकृत',
    filterProcessing: 'तैयारी में',
    filterCompleted: 'पूर्ण',
    orderIdPrefix: 'ऑर्डर ID: ',
    datePrefix: 'दिनांक: ',
    itemPrefix: 'आइटम: ',
    qtyPrefix: 'मात्रा: ',
    viewHistory: 'ऑर्डर इतिहास देखें',
    navHome: 'होम',
    navProducts: 'उत्पाद',
    navCustomers: 'ग्राहक',
    navProfile: 'प्रोफ़ाइल',
    modalTitle: 'भाषा चुनें / Select Language',
  },
  en: {
    headerTitle: 'My Orders',
    filterAll: 'All',
    filterAccepted: 'Accepted',
    filterProcessing: 'In Prep',
    filterCompleted: 'Completed',
    orderIdPrefix: 'Order ID: ',
    datePrefix: 'Date: ',
    itemPrefix: 'Item: ',
    qtyPrefix: 'Qty: ',
    viewHistory: 'View Order History',
    navHome: 'Home',
    navProducts: 'Products',
    navCustomers: 'Customers',
    navProfile: 'Profile',
    modalTitle: 'Select Language / भाषा चुनें',
  },
};

interface OrderItem {
  id: string;
  orderId: string;
  dateHi: string;
  dateEn: string;
  itemHi: string;
  itemEn: string;
  qtyHi: string;
  qtyEn: string;
  price: string;
  status: 'accepted' | 'processing' | 'completed';
  statusTextHi: string;
  statusTextEn: string;
  image: any;
}

const ORDERS_LIST: OrderItem[] = [
  {
    id: '1',
    orderId: 'ORD1234',
    dateHi: '20 मई 2025',
    dateEn: '20 May 2025',
    itemHi: 'बांस की टोकरी',
    itemEn: 'Bamboo Basket',
    qtyHi: '25 पीस',
    qtyEn: '25 pcs',
    price: '₹ 8,750',
    status: 'accepted',
    statusTextHi: 'स्वीकृत',
    statusTextEn: 'Accepted',
    image: require('@/assets/images/product_basket.png'),
  },
  {
    id: '2',
    orderId: 'ORD1233',
    dateHi: '18 मई 2025',
    dateEn: '18 May 2025',
    itemHi: 'बांस का डिब्बा',
    itemEn: 'Bamboo Box Container',
    qtyHi: '40 पीस',
    qtyEn: '40 pcs',
    price: '₹ 18,000',
    status: 'processing',
    statusTextHi: 'तैयारी में',
    statusTextEn: 'In Prep',
    image: require('@/assets/images/product_pot.png'),
  },
  {
    id: '3',
    orderId: 'ORD1232',
    dateHi: '10 मई 2025',
    dateEn: '10 May 2025',
    itemHi: 'दीवार सजावट',
    itemEn: 'Wall Hanging Decor',
    qtyHi: '15 पीस',
    qtyEn: '15 pcs',
    price: '₹ 3,750',
    status: 'completed',
    statusTextHi: 'पूर्ण',
    statusTextEn: 'Completed',
    image: require('@/assets/images/product_macrame.png'),
  },
];

export default function OrdersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const initialLang: LangCode = (params.lang as LangCode) || 'hi';

  const [selectedLang, setSelectedLang] = useState<LangCode>(initialLang);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('all');
  const [activeTab, setActiveTab] = useState<'home' | 'myshg' | 'products' | 'orders' | 'profile'>('orders');

  const t = TRANSLATIONS[selectedLang];
  const currentLangLabel = LANGUAGES.find((l) => l.code === selectedLang)?.label || 'हिंदी';

  const filteredOrders = ORDERS_LIST.filter((o) => {
    if (activeFilter === 'all') return true;
    return o.status === activeFilter;
  });

  const getStatusBadgeStyle = (status: OrderItem['status']) => {
    switch (status) {
      case 'accepted':
        return { bg: '#F0F7ED', text: '#3B6029' };
      case 'processing':
        return { bg: '#FFF3E0', text: '#E65100' };
      case 'completed':
        return { bg: '#E1F5FE', text: '#0288D1' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#3B6029" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.topGreenHeader}>
          <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
            <Ionicons name="menu-outline" size={26} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{t.headerTitle}</Text>

          {/* Language Switcher Pill */}
          <TouchableOpacity
            style={styles.langSelectorBtn}
            onPress={() => setIsLangModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="globe-outline" size={14} color="#3B6029" />
            <Text style={styles.langSelectorText}>{currentLangLabel}</Text>
            <Ionicons name="chevron-down" size={12} color="#3B6029" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.push({ pathname: '/notifications', params: { lang: selectedLang } })}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Order Filter Tabs Bar */}
        <View style={styles.filterTabsBar}>
          <TouchableOpacity
            style={[styles.filterTabItem, activeFilter === 'all' && styles.filterTabItemActive]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterTabText, activeFilter === 'all' && styles.filterTabTextActive]}>{t.filterAll}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTabItem, activeFilter === 'accepted' && styles.filterTabItemActive]}
            onPress={() => setActiveFilter('accepted')}
          >
            <Text style={[styles.filterTabText, activeFilter === 'accepted' && styles.filterTabTextActive]}>{t.filterAccepted}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTabItem, activeFilter === 'processing' && styles.filterTabItemActive]}
            onPress={() => setActiveFilter('processing')}
          >
            <Text style={[styles.filterTabText, activeFilter === 'processing' && styles.filterTabTextActive]}>{t.filterProcessing}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTabItem, activeFilter === 'completed' && styles.filterTabItemActive]}
            onPress={() => setActiveFilter('completed')}
          >
            <Text style={[styles.filterTabText, activeFilter === 'completed' && styles.filterTabTextActive]}>{t.filterCompleted}</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content Body */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Order Cards List */}
          <View style={styles.ordersListGroup}>
            {filteredOrders.map((order) => {
              const badgeStyle = getStatusBadgeStyle(order.status);
              return (
                <TouchableOpacity key={order.id} style={styles.orderCard} activeOpacity={0.88}>
                  <View style={styles.orderCardContentRow}>
                    <Image source={order.image} style={styles.orderImage} resizeMode="cover" />

                    <View style={{ flex: 1 }}>
                      <View style={styles.orderHeaderMetaRow}>
                        <Text style={styles.orderIdText}>{t.orderIdPrefix}{order.orderId}</Text>
                        <View style={[styles.statusBadgePill, { backgroundColor: badgeStyle.bg }]}>
                          <Text style={[styles.statusBadgeText, { color: badgeStyle.text }]}>
                            {selectedLang === 'hi' ? order.statusTextHi : order.statusTextEn}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.orderMetaItemRow}>
                        <Ionicons name="calendar-outline" size={14} color="#666666" />
                        <Text style={styles.orderMetaText}>{t.datePrefix}{selectedLang === 'hi' ? order.dateHi : order.dateEn}</Text>
                      </View>

                      <View style={styles.orderMetaItemRow}>
                        <Ionicons name="person-outline" size={14} color="#666666" />
                        <Text style={styles.orderMetaText}>{t.itemPrefix}{selectedLang === 'hi' ? order.itemHi : order.itemEn}</Text>
                      </View>

                      <View style={styles.orderMetaItemRow}>
                        <Ionicons name="cube-outline" size={14} color="#666666" />
                        <Text style={styles.orderMetaText}>{t.qtyPrefix}{selectedLang === 'hi' ? order.qtyHi : order.qtyEn}</Text>
                      </View>

                      <Text style={styles.orderPriceText}>{order.price}</Text>
                    </View>

                    <Ionicons name="chevron-forward" size={20} color="#777777" style={{ alignSelf: 'center' }} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Outlined View Order History Button */}
          <TouchableOpacity style={styles.outlinedHistoryBtn} activeOpacity={0.85}>
            <Ionicons name="calendar-outline" size={18} color="#3B6029" style={{ marginRight: 6 }} />
            <Text style={styles.outlinedHistoryBtnText}>{t.viewHistory}</Text>
            <Ionicons name="chevron-forward" size={18} color="#3B6029" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </ScrollView>

        {/* Bottom Tab Navigation Bar (4 Tabs) */}
        <View style={styles.bottomTabBar}>
          {/* Tab 1: Home */}
          <TouchableOpacity style={styles.tabBarItem} onPress={() => router.push({ pathname: '/home', params: { lang: selectedLang } })}>
            <Ionicons name="home-outline" size={22} color="#666666" />
            <Text style={styles.tabBarLabel}>{t.navHome}</Text>
          </TouchableOpacity>

          {/* Tab 2: Products */}
          <TouchableOpacity style={styles.tabBarItem} onPress={() => router.push({ pathname: '/products', params: { lang: selectedLang } })}>
            <Ionicons name="cube-outline" size={22} color="#666666" />
            <Text style={styles.tabBarLabel}>{t.navProducts}</Text>
          </TouchableOpacity>

          {/* Tab 3: Customers */}
          <TouchableOpacity style={styles.tabBarItem} onPress={() => router.push({ pathname: '/customers', params: { lang: selectedLang } })}>
            <Ionicons name="people-outline" size={22} color="#666666" />
            <Text style={styles.tabBarLabel}>{t.navCustomers}</Text>
          </TouchableOpacity>

          {/* Tab 4: Profile */}
          <TouchableOpacity style={styles.tabBarItem} onPress={() => router.push({ pathname: '/profile', params: { lang: selectedLang } })}>
            <Ionicons name="person-outline" size={22} color="#666666" />
            <Text style={styles.tabBarLabel}>{t.navProfile}</Text>
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
    backgroundColor: '#3B6029',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },

  /* Header Bar */
  topGreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3B6029',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerIconBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  langSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 4,
  },
  langSelectorText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B6029',
  },

  /* Filter Tabs Bar */
  filterTabsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  filterTabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterTabItemActive: {
    borderBottomColor: '#3B6029',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666666',
  },
  filterTabTextActive: {
    color: '#3B6029',
    fontWeight: 'bold',
  },

  /* Scrollable Content Body */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 14,
  },

  /* Orders List */
  ordersListGroup: {
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 14,
  },
  orderCardContentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  orderImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  orderHeaderMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderIdText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statusBadgePill: {
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  orderMetaItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  orderMetaText: {
    fontSize: 12,
    color: '#555555',
  },
  orderPriceText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#3B6029',
    marginTop: 6,
  },

  /* Outlined History Button */
  outlinedHistoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#3B6029',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 4,
  },
  outlinedHistoryBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3B6029',
  },

  /* Bottom Tab Bar */
  bottomTabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    paddingVertical: 8,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 2,
  },
  tabBarItemActivePill: {
    backgroundColor: '#F0F7ED',
    borderRadius: 12,
  },
  tabBarLabel: {
    fontSize: 10,
    color: '#666666',
  },
  tabBarLabelActive: {
    color: '#3B6029',
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
