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
import { ArtisanFloatingNav } from '@/components/ArtisanFloatingNav';
import { useGlobalLang, setGlobalLang, ALL_LANGUAGES, LangCode } from '@/utils/languageStore';

type OrderFilter = 'all' | 'accepted' | 'processing' | 'completed';

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
  chatWithBuyer: string;
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
    chatWithBuyer: 'ग्राहक से चैट करें',
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
    chatWithBuyer: 'Chat with Buyer',
  },
  bn: {
    headerTitle: 'আমার অর্ডার',
    filterAll: 'সব',
    filterAccepted: 'গৃহীত',
    filterProcessing: 'প্রস্তুতি চলছে',
    filterCompleted: 'সম্পন্ন',
    orderIdPrefix: 'অর্ডার ID: ',
    datePrefix: 'তারিখ: ',
    itemPrefix: 'আইটেম: ',
    qtyPrefix: 'পরিমাণ: ',
    viewHistory: 'অর্ডার ইতিহাস দেখুন',
    navHome: 'হোম',
    navProducts: 'পণ্য',
    navCustomers: 'গ্রাহক',
    navProfile: 'প্রোফাইল',
    modalTitle: 'ভাষা নির্বাচন করুন / Select Language',
    chatWithBuyer: 'ক্রেতার সাথে চ্যাট করুন',
  },
  bho: {
    headerTitle: 'हमर ऑर्डर',
    filterAll: 'सब',
    filterAccepted: 'मंजूर',
    filterProcessing: 'तैयारी में',
    filterCompleted: 'पूरा भइल',
    orderIdPrefix: 'ऑर्डर ID: ',
    datePrefix: 'तारीख: ',
    itemPrefix: 'सामान: ',
    qtyPrefix: 'मात्रा: ',
    viewHistory: 'ऑर्डर इतिहास देखीं',
    navHome: 'होम',
    navProducts: 'सामान',
    navCustomers: 'ग्राहक',
    navProfile: 'प्रोफाइल',
    modalTitle: 'भाषा चुनीं / Select Language',
    chatWithBuyer: 'ग्राहक से बात करीं',
  },
  mr: {
    headerTitle: 'माझे ऑर्डर्स',
    filterAll: 'सर्व',
    filterAccepted: 'स्वीकृत',
    filterProcessing: 'तयारीत',
    filterCompleted: 'पूर्ण',
    orderIdPrefix: 'ऑर्डर ID: ',
    datePrefix: 'दिनांक: ',
    itemPrefix: 'वस्तू: ',
    qtyPrefix: 'प्रमाण: ',
    viewHistory: 'ऑर्डर इतिहास पहा',
    navHome: 'होम',
    navProducts: 'उत्पादने',
    navCustomers: 'ग्राहक',
    navProfile: 'प्रोफाइल',
    modalTitle: 'भाषा निवडा / Select Language',
    chatWithBuyer: 'ग्राहकाशी चॅट करा',
  },
  gu: {
    headerTitle: 'મારા ઓર્ડર',
    filterAll: 'બધા',
    filterAccepted: 'સ્વીકારેલ',
    filterProcessing: 'તૈયારીમાં',
    filterCompleted: 'પૂર્ણ',
    orderIdPrefix: 'ઓર્ડર ID: ',
    datePrefix: 'તારીખ: ',
    itemPrefix: 'આઇટમ: ',
    qtyPrefix: 'જથ્થો: ',
    viewHistory: 'ઓર્ડર ઇતિહાસ જુઓ',
    navHome: 'હોમ',
    navProducts: 'ઉત્પાદનો',
    navCustomers: 'ગ્રાહકો',
    navProfile: 'પ્રોફાઇલ',
    modalTitle: 'ભાષા પસંદ કરો / Select Language',
    chatWithBuyer: 'ગ્રાહક સાથે ચેટ કરો',
  },
  raj: {
    headerTitle: 'म्हारा ऑर्डर',
    filterAll: 'सगळा',
    filterAccepted: 'स्वीकार्य',
    filterProcessing: 'तैयारी मांय',
    filterCompleted: 'पूरा',
    orderIdPrefix: 'ऑर्डर ID: ',
    datePrefix: 'तारीख: ',
    itemPrefix: 'सामान: ',
    qtyPrefix: 'मात्रा: ',
    viewHistory: 'ऑर्डर इतिहास देखो',
    navHome: 'होम',
    navProducts: 'सामान',
    navCustomers: 'ग्राहक',
    navProfile: 'प्रोफाइल',
    modalTitle: 'भाषा चूणो / Select Language',
    chatWithBuyer: 'ग्राहक सूं बात करो',
  },
  kn: {
    headerTitle: 'ನನ್ನ ಆದೇಶಗಳು',
    filterAll: 'ಎಲ್ಲಾ',
    filterAccepted: 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
    filterProcessing: 'ಸಿದ್ಧತೆಯಲ್ಲಿದೆ',
    filterCompleted: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    orderIdPrefix: 'ಆದೇಶ ID: ',
    datePrefix: 'ದಿನಾಂಕ: ',
    itemPrefix: 'ವಸ್ತು: ',
    qtyPrefix: 'ಪ್ರಮಾಣ: ',
    viewHistory: 'ಆದೇಶದ ಇತಿಹಾಸವನ್ನು ವೀಕ್ಷಿಸಿ',
    navHome: 'ಹೋಮ್',
    navProducts: 'ಉತ್ಪನ್ನಗಳು',
    navCustomers: 'ಗ್ರಾಹಕರು',
    navProfile: 'ಪ್ರೊಫೈಲ್',
    modalTitle: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / Select Language',
    chatWithBuyer: 'ಖರೀದಿದಾರರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ',
  },
};

interface OrderItem {
  id: string;
  orderId: string;
  dates: Record<LangCode, string>;
  items: Record<LangCode, string>;
  qtys: Record<LangCode, string>;
  price: string;
  status: 'accepted' | 'processing' | 'completed';
  statusTexts: Record<LangCode, string>;
  image: any;
}

const ORDERS_LIST: OrderItem[] = [
  {
    id: '1',
    orderId: 'ORD1234',
    dates: {
      en: '20 May 2025',
      hi: '20 मई 2025',
      bn: '২০ মে ২০২৫',
      bho: '20 मई 2025',
      mr: '२० मे २०२५',
      gu: '20 મે 2025',
      raj: '20 मई 2025',
      kn: '20 ಮೇ 2025',
    },
    items: {
      en: 'Bamboo Basket',
      hi: 'बांस की टोकरी',
      bn: 'বাঁশের ঝুড়ি',
      bho: 'बांस के टोकरी',
      mr: 'बांबूची टोपली',
      gu: 'વાંસની ટોપલી',
      raj: 'बांस री टोकरी',
      kn: 'ಬಿದಿರಿನ ಬುಟ್ಟಿ',
    },
    qtys: {
      en: '25 pcs',
      hi: '25 पीस',
      bn: '২৫ টি',
      bho: '25 गो',
      mr: '२५ नग',
      gu: '25 પીસ',
      raj: '25 नग',
      kn: '25 ತುಂಡುಗಳು',
    },
    price: '₹ 8,750',
    status: 'accepted',
    statusTexts: {
      en: 'Accepted',
      hi: 'स्वीकृत',
      bn: 'গৃহীত',
      bho: 'मंजूर',
      mr: 'स्वीकृत',
      gu: 'સ્વીકારેલ',
      raj: 'स्वीकार्य',
      kn: 'ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
    },
    image: require('@/assets/images/product_basket.png'),
  },
  {
    id: '2',
    orderId: 'ORD1233',
    dates: {
      en: '18 May 2025',
      hi: '18 मई 2025',
      bn: '১৮ মে ২০২৫',
      bho: '18 मई 2025',
      mr: '१८ मे २०२५',
      gu: '18 મે 2025',
      raj: '18 मई 2025',
      kn: '18 ಮೇ 2025',
    },
    items: {
      en: 'Bamboo Box Container',
      hi: 'बांस का डिब्बा',
      bn: 'বাঁশের বাক্স',
      bho: 'बांस के डिब्बा',
      mr: 'बांबूचा डब्बा',
      gu: 'વાંસનું બોક્સ',
      raj: 'बांस रो डिब्बो',
      kn: 'ಬಿದಿರಿನ ಪೆಟ್ಟಿಗೆ',
    },
    qtys: {
      en: '40 pcs',
      hi: '40 पीस',
      bn: '৪০ টি',
      bho: '40 गो',
      mr: '४० नग',
      gu: '40 પીસ',
      raj: '40 नग',
      kn: '40 ತುಂಡುಗಳು',
    },
    price: '₹ 18,000',
    status: 'processing',
    statusTexts: {
      en: 'In Prep',
      hi: 'तैयारी में',
      bn: 'প্রস্তুতি চলছে',
      bho: 'तैयारी में',
      mr: 'तयारीत',
      gu: 'તૈયારીમાં',
      raj: 'तैयारी मांय',
      kn: 'ಸಿದ್ಧತೆಯಲ್ಲಿದೆ',
    },
    image: require('@/assets/images/product_pot.png'),
  },
  {
    id: '3',
    orderId: 'ORD1232',
    dates: {
      en: '10 May 2025',
      hi: '10 मई 2025',
      bn: '১০ মে ২০২৫',
      bho: '10 मई 2025',
      mr: '१० मे २०२५',
      gu: '10 મે 2025',
      raj: '10 मई 2025',
      kn: '10 ಮೇ 2025',
    },
    items: {
      en: 'Wall Hanging Decor',
      hi: 'दीवार सजावट',
      bn: 'দেয়াল সজ্জা',
      bho: 'दीवाल सजावट',
      mr: 'भिंतीची सजावट',
      gu: 'દીવાલ શણગાર',
      raj: 'भींत सजावट',
      kn: 'ಗೋಡೆಯ ಅಲಂಕಾರ',
    },
    qtys: {
      en: '15 pcs',
      hi: '15 पीस',
      bn: '১৫ টি',
      bho: '15 गो',
      mr: '१५ नग',
      gu: '15 પીસ',
      raj: '15 नग',
      kn: '15 ತುಂಡುಗಳು',
    },
    price: '₹ 3,750',
    status: 'completed',
    statusTexts: {
      en: 'Completed',
      hi: 'पूर्ण',
      bn: 'সম্পন্ন',
      bho: 'पूरा भइल',
      mr: 'पूर्ण',
      gu: 'પૂર્ણ',
      raj: 'पूरा',
      kn: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    },
    image: require('@/assets/images/product_macrame.png'),
  },
];

export default function OrdersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const [globalLang] = useGlobalLang();
  const initialLang: LangCode = (params.lang as LangCode) || globalLang || 'hi';

  const [selectedLang, setSelectedLang] = useState<LangCode>(initialLang);

  React.useEffect(() => {
    if (globalLang) {
      setSelectedLang(globalLang);
    }
  }, [globalLang]);

  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('all');
  const [activeTab, setActiveTab] = useState<'home' | 'myshg' | 'products' | 'orders' | 'profile'>('orders');

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.hi;
  const currentLangObj = ALL_LANGUAGES.find((l) => l.code === selectedLang) || ALL_LANGUAGES[1];
  const currentLangLabel = `${currentLangObj.nativeName} (${currentLangObj.englishName})`;

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
                <TouchableOpacity
                  key={order.id}
                  style={styles.orderCard}
                  onPress={() => router.push({ pathname: '/product-chats', params: { lang: selectedLang } })}
                  activeOpacity={0.88}
                >
                  <View style={styles.orderCardContentRow}>
                    <Image source={order.image} style={styles.orderImage} resizeMode="cover" />

                    <View style={{ flex: 1 }}>
                      <View style={styles.orderHeaderMetaRow}>
                        <Text style={styles.orderIdText}>{t.orderIdPrefix}{order.orderId}</Text>
                        <View style={[styles.statusBadgePill, { backgroundColor: badgeStyle.bg }]}>
                          <Text style={[styles.statusBadgeText, { color: badgeStyle.text }]}>
                            {order.statusTexts[selectedLang] || order.statusTexts.hi || order.statusTexts.en}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.orderMetaItemRow}>
                        <Ionicons name="calendar-outline" size={14} color="#666666" />
                        <Text style={styles.orderMetaText}>{t.datePrefix}{order.dates[selectedLang] || order.dates.hi || order.dates.en}</Text>
                      </View>

                      <View style={styles.orderMetaItemRow}>
                        <Ionicons name="person-outline" size={14} color="#666666" />
                        <Text style={styles.orderMetaText}>{t.itemPrefix}{order.items[selectedLang] || order.items.hi || order.items.en}</Text>
                      </View>

                      <View style={styles.orderMetaItemRow}>
                        <Ionicons name="cube-outline" size={14} color="#666666" />
                        <Text style={styles.orderMetaText}>{t.qtyPrefix}{order.qtys[selectedLang] || order.qtys.hi || order.qtys.en}</Text>
                      </View>

                      <Text style={styles.orderPriceText}>{order.price}</Text>

                      {/* Customer Chat Action */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                        <Ionicons name="chatbubble-ellipses-outline" size={14} color="#3B6029" style={{ marginRight: 4 }} />
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#3B6029' }}>
                          {t.chatWithBuyer}
                        </Text>
                      </View>
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

        {/* Floating Bottom Tab Navigation Bar */}
        <ArtisanFloatingNav activeTab="orders" selectedLang={selectedLang} />

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
                data={ALL_LANGUAGES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.langOptionItem,
                      selectedLang === item.code ? styles.langOptionSelected : null,
                    ]}
                    onPress={() => {
                      setSelectedLang(item.code);
                      setGlobalLang(item.code);
                      setIsLangModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.langOptionText,
                        selectedLang === item.code ? styles.langOptionTextSelected : null,
                      ]}
                    >
                      {item.nativeName} ({item.englishName})
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
    paddingBottom: 100,
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
