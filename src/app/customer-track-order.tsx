import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalLang, LangCode } from '@/utils/languageStore';
import { CustSidebar, CustTopHeader } from '@/components/CustLayout';

const TRANSLATIONS_TRACK_ORDER = {
  hi: {
    home: 'होम',
    allProducts: 'सभी उत्पाद',
    categories: 'श्रेणियाँ',
    findArtisans: 'कारीगर खोजें',
    trackOrder: 'ऑर्डर ट्रैक करें',
    myWishlist: 'मेरी इच्छाएं',
    myOrders: 'मेरे ऑर्डर',
    messages: 'संदेश',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    userName: 'आदित्य सिंह',
    breadcrumb: 'होम > ऑर्डर ट्रैक करें',
    pageTitle: 'ऑर्डर ट्रैकिंग',
    pageSubtitle: 'अपने ऑर्डर की रीयल-टाइम स्थिति जांचने के लिए ऑर्डर आईडी दर्ज करें।',
    inputPlaceholder: 'ऑर्डर आईडी या AWB नंबर दर्ज करें (उदा. #KS-98421)...',
    trackBtn: 'ट्रैक करें',
    activeOrderTitle: 'ऑर्डर विवरण #KS-98421',
    orderDateLabel: 'ऑर्डर तिथि: 25 अगस्त 2026',
    estimatedDeliveryLabel: 'अनुमानित डिलीवरी: 30 अगस्त 2026 (कल)',
    courierPartnerLabel: 'कूरियर पार्टनर: स्पीड पोस्ट / इंडिया पोस्ट (AWB: IP984210042IN)',
    step1Title: 'ऑर्डर कन्फर्म हुआ',
    step1Date: '25 अगस्त, 10:30 AM',
    step2Title: 'कारीगर द्वारा पैक किया गया',
    step2Sub: 'सीमा देवी (कांकेर)',
    step2Date: '26 अगस्त, 02:15 PM',
    step3Title: 'मार्ग में है (In Transit)',
    step3Sub: 'रायपुर हब से प्रस्थान',
    step3Date: '28 अगस्त, 09:00 AM',
    step4Title: 'डिलीवरी के लिए निकला',
    step4Date: '30 अगस्त (संभावित)',
    orderItemsTitle: 'ऑर्डर में शामिल उत्पाद',
    itemTitle: 'बाँस की हस्तनिर्मित टोकरी',
    itemCraft: 'बाँस शिल्प • कारीगर: सीमा देवी (कांकेर, छत्तीसगढ़)',
    itemPrice: '₹650 (मात्रा: 1)',
    helpSupportBtn: 'सहयोग या सवाल? ग्राहक सेवा से बात करें',
  },
  en: {
    home: 'Home',
    allProducts: 'All Products',
    categories: 'Categories',
    findArtisans: 'Find Artisans',
    trackOrder: 'Track Order',
    myWishlist: 'My Wishlist',
    myOrders: 'My Orders',
    messages: 'Messages',
    profile: 'Profile',
    logout: 'Logout',
    userName: 'Aditya Singh',
    breadcrumb: 'Home > Track Order',
    pageTitle: 'Track Your Order',
    pageSubtitle: 'Enter your Order ID or AWB Tracking Number to check live delivery status.',
    inputPlaceholder: 'Enter Order ID or AWB Number (e.g. #KS-98421)...',
    trackBtn: 'Track Order',
    activeOrderTitle: 'Order Details #KS-98421',
    orderDateLabel: 'Ordered Date: 25 Aug 2026',
    estimatedDeliveryLabel: 'Est. Delivery: 30 Aug 2026 (Tomorrow)',
    courierPartnerLabel: 'Courier Partner: Speed Post / India Post (AWB: IP984210042IN)',
    step1Title: 'Order Confirmed',
    step1Date: '25 Aug, 10:30 AM',
    step2Title: 'Packed by Artisan',
    step2Sub: 'Seema Devi (Kanker)',
    step2Date: '26 Aug, 02:15 PM',
    step3Title: 'In Transit',
    step3Sub: 'Dispatched from Raipur Hub',
    step3Date: '28 Aug, 09:00 AM',
    step4Title: 'Out for Delivery',
    step4Date: '30 Aug (Expected)',
    orderItemsTitle: 'Items in this Order',
    itemTitle: 'Handcrafted Bamboo Basket',
    itemCraft: 'Bamboo Craft • Artisan: Seema Devi (Kanker, CG)',
    itemPrice: '₹650 (Qty: 1)',
    helpSupportBtn: 'Need help? Contact Customer Support',
  },
};

export default function CustomerTrackOrderScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang] = useGlobalLang();
  const [orderInput, setOrderInput] = useState('#KS-98421');

  const t = TRANSLATIONS_TRACK_ORDER[selectedLang as keyof typeof TRANSLATIONS_TRACK_ORDER] || TRANSLATIONS_TRACK_ORDER.en;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <CustTopHeader />

        {/* Main 2-Column Layout */}
        <View style={styles.mainLayoutRow}>
          {/* 1. Left Sidebar Navigation */}
          {isDesktop && <CustSidebar activeKey="trackOrder" />}

          {/* 2. Main Content Area */}
          <ScrollView style={styles.contentCol} contentContainerStyle={styles.contentScrollContainer} showsVerticalScrollIndicator={false}>
            {/* Page Header */}
            <View style={styles.pageHeaderCard}>
              <Text style={styles.breadcrumbText}>{t.breadcrumb}</Text>
              <Text style={styles.pageTitleText}>{t.pageTitle}</Text>
              <Text style={styles.pageSubtitleText}>{t.pageSubtitle}</Text>

              {/* Order ID Input Form */}
              <View style={styles.inputFormRow}>
                <View style={styles.textInputBox}>
                  <Ionicons name="cube-outline" size={18} color="#888888" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.textInput}
                    placeholder={t.inputPlaceholder}
                    placeholderTextColor="#888888"
                    value={orderInput}
                    onChangeText={setOrderInput}
                  />
                </View>

                <TouchableOpacity style={styles.trackSubmitBtn} activeOpacity={0.8}>
                  <Text style={styles.trackSubmitBtnText}>{t.trackBtn}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Live Tracking Card */}
            <View style={styles.trackingCard}>
              {/* Card Header Info */}
              <View style={styles.trackingCardHeader}>
                <View>
                  <Text style={styles.activeOrderTitleText}>{t.activeOrderTitle}</Text>
                  <Text style={styles.orderDateText}>{t.orderDateLabel}</Text>
                </View>

                <View style={styles.estimatedDeliveryPill}>
                  <Ionicons name="time-outline" size={14} color="#2E7D32" style={{ marginRight: 4 }} />
                  <Text style={styles.estimatedDeliveryText}>{t.estimatedDeliveryLabel}</Text>
                </View>
              </View>

              <Text style={styles.courierInfoText}>{t.courierPartnerLabel}</Text>

              {/* Step Progress Bar */}
              <View style={styles.progressStepsRow}>
                {/* Step 1 */}
                <View style={styles.stepItemCol}>
                  <View style={[styles.stepCircleIcon, styles.stepCircleCompleted]}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                  <Text style={styles.stepTitleText}>{t.step1Title}</Text>
                  <Text style={styles.stepDateText}>{t.step1Date}</Text>
                </View>

                <View style={[styles.stepConnectorLine, styles.stepConnectorCompleted]} />

                {/* Step 2 */}
                <View style={styles.stepItemCol}>
                  <View style={[styles.stepCircleIcon, styles.stepCircleCompleted]}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                  <Text style={styles.stepTitleText}>{t.step2Title}</Text>
                  <Text style={styles.stepSubText}>{t.step2Sub}</Text>
                  <Text style={styles.stepDateText}>{t.step2Date}</Text>
                </View>

                <View style={[styles.stepConnectorLine, styles.stepConnectorCompleted]} />

                {/* Step 3 (Active) */}
                <View style={styles.stepItemCol}>
                  <View style={[styles.stepCircleIcon, styles.stepCircleActive]}>
                    <Ionicons name="bus" size={16} color="#FFFFFF" />
                  </View>
                  <Text style={[styles.stepTitleText, { color: '#2E7D32', fontWeight: '800' }]}>{t.step3Title}</Text>
                  <Text style={styles.stepSubText}>{t.step3Sub}</Text>
                  <Text style={styles.stepDateText}>{t.step3Date}</Text>
                </View>

                <View style={styles.stepConnectorLine} />

                {/* Step 4 */}
                <View style={styles.stepItemCol}>
                  <View style={styles.stepCircleIcon}>
                    <Ionicons name="home-outline" size={16} color="#888888" />
                  </View>
                  <Text style={[styles.stepTitleText, { color: '#888888' }]}>{t.step4Title}</Text>
                  <Text style={styles.stepDateText}>{t.step4Date}</Text>
                </View>
              </View>

              {/* Items Summary Section */}
              <View style={styles.orderItemsSection}>
                <Text style={styles.orderItemsTitleText}>{t.orderItemsTitle}</Text>

                <View style={styles.itemRowCard}>
                  <Image source={require('@/assets/images/govt_item_basket.png')} style={styles.itemThumbImg} resizeMode="contain" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitleText}>{t.itemTitle}</Text>
                    <Text style={styles.itemCraftText}>{t.itemCraft}</Text>
                    <Text style={styles.itemPriceText}>{t.itemPrice}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Help & Support Button */}
            <TouchableOpacity style={styles.supportHelpBtn}>
              <Ionicons name="help-circle-outline" size={18} color="#2E7D32" style={{ marginRight: 8 }} />
              <Text style={styles.supportHelpBtnText}>{t.helpSupportBtn}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  mainLayoutRow: {
    flex: 1,
    flexDirection: 'row',
  },
  contentCol: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  contentScrollContainer: {
    padding: 24,
    gap: 20,
  },
  pageHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  breadcrumbText: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  pageTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  pageSubtitleText: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 20,
  },
  inputFormRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    maxWidth: 550,
  },
  textInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#1A1A1A',
    padding: 0,
  },
  trackSubmitBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  trackSubmitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trackingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  trackingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activeOrderTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  orderDateText: {
    fontSize: 12,
    color: '#777777',
  },
  estimatedDeliveryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  estimatedDeliveryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  courierInfoText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 24,
  },
  progressStepsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingHorizontal: 12,
  },
  stepItemCol: {
    alignItems: 'center',
    width: 130,
  },
  stepCircleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircleCompleted: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  stepCircleActive: {
    backgroundColor: '#E65100',
    borderColor: '#E65100',
  },
  stepConnectorLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginTop: 17,
  },
  stepConnectorCompleted: {
    backgroundColor: '#2E7D32',
  },
  stepTitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 2,
  },
  stepSubText: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
  stepDateText: {
    fontSize: 10,
    color: '#888888',
    textAlign: 'center',
    marginTop: 2,
  },
  orderItemsSection: {
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
    paddingTop: 20,
    marginTop: 16,
  },
  orderItemsTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  itemRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderRadius: 12,
    padding: 12,
  },
  itemThumbImg: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  itemTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  itemCraftText: {
    fontSize: 11,
    color: '#666666',
    marginVertical: 2,
  },
  itemPriceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  supportHelpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
  },
  supportHelpBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
});
