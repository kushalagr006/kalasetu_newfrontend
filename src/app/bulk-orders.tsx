import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

type LangCode = 'hi' | 'en';

interface BulkOrderItem {
  id: string;
  buyerNameHi: string;
  buyerNameEn: string;
  buyerTypeHi: string;
  buyerTypeEn: string;
  locationHi: string;
  locationEn: string;
  productReqHi: string;
  productReqEn: string;
  quantityHi: string;
  quantityEn: string;
  estBudgetHi: string;
  estBudgetEn: string;
  deadlineHi: string;
  deadlineEn: string;
  badgeTagHi: string;
  badgeTagEn: string;
  badgeColor: string;
}

const BULK_ORDERS_DATA: BulkOrderItem[] = [
  {
    id: '1',
    buyerNameHi: 'ताज ग्रुप ऑफ होटल्स',
    buyerNameEn: 'Taj Hotels & Heritage Resorts',
    buyerTypeHi: 'कॉरपोरेट हॉस्पिटैलिटी खरीदार',
    buyerTypeEn: 'Corporate Hospitality Buyer',
    locationHi: 'जयपुर, राजस्थान',
    locationEn: 'Jaipur, Rajasthan',
    productReqHi: 'हस्तनिर्मित मिट्टी के सजावटी घड़े व फूलदान',
    productReqEn: 'Handmade Decorative Etched Clay Pots & Vases',
    quantityHi: '200 पीस (न्यूनतम)',
    quantityEn: '200 Units (Min)',
    estBudgetHi: '₹2,10,000',
    estBudgetEn: '₹2,10,000',
    deadlineHi: '15 सितंबर 2026',
    deadlineEn: '15 Sep 2026',
    badgeTagHi: 'अति आवश्यक',
    badgeTagEn: 'Urgent Sourcing',
    badgeColor: '#D32F2F',
  },
  {
    id: '2',
    buyerNameHi: 'सेंट्रल कॉटेज इंडस्ट्रीज एम्पोरियम',
    buyerNameEn: 'Central Cottage Industries Emporium',
    buyerTypeHi: 'सरकारी एम्पोरियम रीसेलर',
    buyerTypeEn: 'Govt Emporium Bulk Reseller',
    locationHi: 'नई दिल्ली',
    locationEn: 'New Delhi',
    productReqHi: 'नक्काशीदार शीशम लकड़ी के फोटो फ्रेम व दीवार कला',
    productReqEn: 'Hand-carved Wooden Frames & Wall Art Units',
    quantityHi: '500 पीस',
    quantityEn: '500 Units',
    estBudgetHi: '₹4,50,000',
    estBudgetEn: '₹4,50,000',
    deadlineHi: '30 सितंबर 2026',
    deadlineEn: '30 Sep 2026',
    badgeTagHi: 'सरकारी टेंडर',
    badgeTagEn: 'Govt Order',
    badgeColor: '#3B6029',
  },
  {
    id: '3',
    buyerNameHi: 'फैबइंडिया रिटेल प्राइवेट लिमिटेड',
    buyerNameEn: 'FabIndia Retail Pvt Ltd',
    buyerTypeHi: 'ब्रांडेड क्राफ्ट रिटेल श्रृंखला',
    buyerTypeEn: 'Branded Craft Retail Chain',
    locationHi: 'मुंबई, महाराष्ट्र',
    locationEn: 'Mumbai, Maharashtra',
    productReqHi: 'पारंपरिक हस्तनिर्मित टेराकोटा दीया व उपहार सेट',
    productReqEn: 'Traditional Handmade Terracotta Diya Gift Sets',
    quantityHi: '350 सेट',
    quantityEn: '350 Sets',
    estBudgetHi: '₹1,75,000',
    estBudgetEn: '₹1,75,000',
    deadlineHi: '20 अक्टूबर 2026',
    deadlineEn: '20 Oct 2026',
    badgeTagHi: 'सीधा खरीदार',
    badgeTagEn: 'Verified Buyer',
    badgeColor: '#1976D2',
  },
];

export default function BulkOrdersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();

  const selectedLang: LangCode = (params.lang as LangCode) || 'hi';
  const isHindi = selectedLang === 'hi';

  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'govt'>('all');
  const [selectedOrder, setSelectedOrder] = useState<BulkOrderItem | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteDays, setQuoteDays] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenQuoteModal = (order: BulkOrderItem) => {
    setSelectedOrder(order);
    setQuotePrice('');
    setQuoteDays('');
    setQuoteNotes('');
    setIsModalOpen(true);
  };

  const handleSpeechToText = (field: 'price' | 'days' | 'notes') => {
    if (field === 'price') {
      setQuotePrice('180000');
      Alert.alert(
        isHindi ? '🎙️ आवाज़ से दर्ज किया गया' : '🎙️ Voice Recorded',
        isHindi ? 'बोली गई कीमत: ₹1,80,000' : 'Spoken Price: ₹1,80,000'
      );
    } else if (field === 'days') {
      setQuoteDays('15');
      Alert.alert(
        isHindi ? '🎙️ आवाज़ से दर्ज किया गया' : '🎙️ Voice Recorded',
        isHindi ? 'बोले गए दिन: 15 दिन' : 'Spoken Days: 15 Days'
      );
    } else if (field === 'notes') {
      setQuoteNotes(
        isHindi
          ? 'उच्चतम गुणवत्ता की प्राकृतिक सामग्री और 15 दिनों में सुरक्षित डिलीवरी की गारंटी।'
          : 'Premium quality handmade materials with guaranteed 15-day delivery.'
      );
      Alert.alert(
        isHindi ? '🎙️ आवाज़ से दर्ज किया गया' : '🎙️ Voice Recorded',
        isHindi ? 'विशेष संदेश आवाज़ से टाइप कर दिया गया है।' : 'Notes recorded via speech-to-text.'
      );
    }
  };

  const handleSubmitQuote = () => {
    if (!quotePrice.trim()) {
      Alert.alert(
        isHindi ? 'त्रुटि' : 'Error',
        isHindi ? 'कृपया अपना मूल्य प्रस्ताव दर्ज करें।' : 'Please enter your quote price.'
      );
      return;
    }
    setIsModalOpen(false);
    Alert.alert(
      isHindi ? 'प्रस्ताव भेजा गया!' : 'Quote Submitted!',
      isHindi
        ? `आपका ₹${quotePrice} का ऑफर ${selectedOrder?.buyerNameHi} को भेज दिया गया है।`
        : `Your quote of ₹${quotePrice} has been sent to ${selectedOrder?.buyerNameEn}.`
    );
  };

  const filteredOrders = BULK_ORDERS_DATA.filter((item) => {
    if (activeFilter === 'urgent') return item.badgeTagHi === 'अति आवश्यक';
    if (activeFilter === 'govt') return item.badgeTagHi === 'सरकारी टेंडर';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        
        {/* Top Header Bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {isHindi ? 'बल्क ऑर्डर अवसर' : 'Bulk Orders & Enquiries'}
          </Text>

          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => Alert.alert(isHindi ? 'बल्क ऑर्डर सहायता' : 'Bulk Orders Help')}
            activeOpacity={0.7}
          >
            <Ionicons name="help-circle-outline" size={22} color="#3B6029" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Banner Card */}
          <View style={styles.bannerCard}>
            <View style={styles.bannerIconCircle}>
              <Ionicons name="cube" size={26} color="#3B6029" />
            </View>

            <View style={styles.bannerTextGroup}>
              <Text style={styles.bannerTitle}>
                {isHindi ? 'बड़ी मात्रा में बिक्री करें' : 'Get Bulk Orders & Growth'}
              </Text>
              <Text style={styles.bannerSub}>
                {isHindi
                  ? 'होटल, कॉरपोरेट और बड़े खरीदारों से सीधे थोक ऑर्डर प्राप्त करें'
                  : 'Receive direct wholesale orders from hotels, emporiums & corporate buyers'}
              </Text>
            </View>
          </View>

          {/* Filter Pills Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsRow}
          >
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[styles.filterPillText, activeFilter === 'all' && styles.filterPillTextActive]}>
                {isHindi ? 'सभी ऑर्डर' : 'All Orders'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'urgent' && styles.filterPillActive]}
              onPress={() => setActiveFilter('urgent')}
            >
              <Text style={[styles.filterPillText, activeFilter === 'urgent' && styles.filterPillTextActive]}>
                {isHindi ? 'अति आवश्यक' : 'Urgent Requests'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'govt' && styles.filterPillActive]}
              onPress={() => setActiveFilter('govt')}
            >
              <Text style={[styles.filterPillText, activeFilter === 'govt' && styles.filterPillTextActive]}>
                {isHindi ? 'सरकारी टेंडर' : 'Govt Tenders'}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Bulk Orders List */}
          <View style={styles.ordersListGroup}>
            {filteredOrders.map((order) => {
              const bName = isHindi ? order.buyerNameHi : order.buyerNameEn;
              const bType = isHindi ? order.buyerTypeHi : order.buyerTypeEn;
              const loc = isHindi ? order.locationHi : order.locationEn;
              const req = isHindi ? order.productReqHi : order.productReqEn;
              const qty = isHindi ? order.quantityHi : order.quantityEn;
              const budget = isHindi ? order.estBudgetHi : order.estBudgetEn;
              const deadline = isHindi ? order.deadlineHi : order.deadlineEn;
              const tag = isHindi ? order.badgeTagHi : order.badgeTagEn;

              return (
                <View key={order.id} style={styles.orderCard}>
                  {/* Card Header Row */}
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.buyerAvatar}>
                      <Ionicons name="business" size={22} color="#3B6029" />
                    </View>

                    <View style={styles.buyerMetaCol}>
                      <Text style={styles.buyerName}>{bName}</Text>
                      <Text style={styles.buyerType}>{bType} • 📍 {loc}</Text>
                    </View>

                    <View style={[styles.badgeTag, { backgroundColor: order.badgeColor }]}>
                      <Text style={styles.badgeTagText}>{tag}</Text>
                    </View>
                  </View>

                  <View style={styles.cardDivider} />

                  {/* Order Details Body */}
                  <Text style={styles.reqTitle}>{req}</Text>

                  <View style={styles.specGrid}>
                    <View style={styles.specBox}>
                      <Text style={styles.specLabel}>{isHindi ? 'मात्रा (Quantity)' : 'Quantity'}</Text>
                      <Text style={styles.specVal}>{qty}</Text>
                    </View>

                    <View style={styles.specBox}>
                      <Text style={styles.specLabel}>{isHindi ? 'अनुमानित बजट' : 'Estimated Budget'}</Text>
                      <Text style={styles.specValGreen}>{budget}</Text>
                    </View>

                    <View style={styles.specBox}>
                      <Text style={styles.specLabel}>{isHindi ? 'अंतिम तिथि' : 'Deadline'}</Text>
                      <Text style={styles.specVal}>{deadline}</Text>
                    </View>
                  </View>

                  {/* Action Buttons Row */}
                  <View style={styles.cardActionRow}>
                    <TouchableOpacity
                      style={styles.chatBuyerBtn}
                      onPress={() =>
                        Alert.alert(
                          isHindi ? 'चैट शुरू हो रही है' : 'Starting Chat',
                          isHindi
                            ? `${bName} के प्रतिनिधि से चैट करें।`
                            : `Opening direct chat with ${bName}.`
                        )
                      }
                      activeOpacity={0.8}
                    >
                      <Ionicons name="chatbubble-outline" size={16} color="#3B6029" />
                      <Text style={styles.chatBuyerBtnText}>
                        {isHindi ? 'चैट करें' : 'Chat'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.submitQuoteBtn}
                      onPress={() => handleOpenQuoteModal(order)}
                      activeOpacity={0.88}
                    >
                      <Text style={styles.submitQuoteBtnText}>
                        {isHindi ? 'ऑफर सबमिट करें →' : 'Submit Quote →'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Submit Quote Modal */}
        <Modal
          visible={isModalOpen}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsModalOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsModalOpen(false)}
          >
            <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isHindi ? 'अपना ऑफर (Quote) सबमिट करें' : 'Submit Price Proposal'}
                </Text>
                <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {selectedOrder && (
                <Text style={styles.modalOrderSub}>
                  {isHindi ? selectedOrder.buyerNameHi : selectedOrder.buyerNameEn} -{' '}
                  {isHindi ? selectedOrder.productReqHi : selectedOrder.productReqEn}
                </Text>
              )}

              {/* Price Offer Field */}
              <Text style={styles.fieldLabel}>
                {isHindi ? 'आपकी कुल अनुमानित कीमत (₹) *' : 'Your Total Price Quote (₹) *'}
              </Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder={isHindi ? 'जैसे: 1,80,000' : 'e.g. 1,80,000'}
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={quotePrice}
                  onChangeText={setQuotePrice}
                />
                <TouchableOpacity
                  style={styles.micInputBtn}
                  onPress={() => handleSpeechToText('price')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="mic" size={18} color="#3B6029" />
                </TouchableOpacity>
              </View>

              {/* Delivery Days Field */}
              <Text style={styles.fieldLabel}>
                {isHindi ? 'सामान तैयार करने में लगने वाले दिन' : 'Estimated Delivery Days'}
              </Text>
              <View style={styles.inputBox}>
                <Ionicons name="time-outline" size={18} color="#555" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.inputField}
                  placeholder={isHindi ? 'जैसे: 15 दिन' : 'e.g. 15 Days'}
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={quoteDays}
                  onChangeText={setQuoteDays}
                />
                <TouchableOpacity
                  style={styles.micInputBtn}
                  onPress={() => handleSpeechToText('days')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="mic" size={18} color="#3B6029" />
                </TouchableOpacity>
              </View>

              {/* Remarks Field */}
              <Text style={styles.fieldLabel}>
                {isHindi ? 'खरीदार के लिए विशेष संदेश / नोट (ऐच्छिक)' : 'Message to Buyer (Optional)'}
              </Text>
              <View style={[styles.inputBox, { height: 74, alignItems: 'flex-start', paddingTop: 8 }]}>
                <TextInput
                  style={[styles.inputField, { textAlignVertical: 'top' }]}
                  placeholder={isHindi ? 'पैकेजिंग, शिपिंग व गुणवत्ता की जानकारी लिखें...' : 'Mention quality, delivery terms...'}
                  placeholderTextColor="#888"
                  multiline={true}
                  value={quoteNotes}
                  onChangeText={setQuoteNotes}
                />
                <TouchableOpacity
                  style={styles.micInputBtn}
                  onPress={() => handleSpeechToText('notes')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="mic" size={18} color="#3B6029" />
                </TouchableOpacity>
              </View>

              {/* Modal Submit Button */}
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleSubmitQuote}
                activeOpacity={0.88}
              >
                <Text style={styles.modalSubmitBtnText}>
                  {isHindi ? 'ऑफर भेजें (Send Proposal)' : 'Send Proposal'}
                </Text>
              </TouchableOpacity>
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
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FAF8F5',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  helpButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 36,
  },
  /* Top Banner Card */
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF6EE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bannerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerTextGroup: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B6029',
    marginBottom: 2,
  },
  bannerSub: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 16,
  },
  /* Filter Pills */
  filterPillsRow: {
    gap: 8,
    marginBottom: 18,
  },
  filterPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E3DC',
  },
  filterPillActive: {
    backgroundColor: '#3B6029',
    borderColor: '#3B6029',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  /* Orders List */
  ordersListGroup: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EBF6EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  buyerMetaCol: {
    flex: 1,
  },
  buyerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  buyerType: {
    fontSize: 11,
    color: '#666666',
    marginTop: 2,
  },
  badgeTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  badgeTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F0EFEA',
    marginVertical: 12,
  },
  reqTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
    lineHeight: 21,
  },
  specGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  specBox: {
    flex: 1,
  },
  specLabel: {
    fontSize: 10,
    color: '#777777',
    marginBottom: 2,
  },
  specVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  specValGreen: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  cardActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chatBuyerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF6EE',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 4,
  },
  chatBuyerBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  submitQuoteBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 12,
    paddingVertical: 10,
  },
  submitQuoteBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  modalOrderSub: {
    fontSize: 12,
    color: '#3B6029',
    fontWeight: '600',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
    marginTop: 10,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAF8F5',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B6029',
    marginRight: 6,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  micInputBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EBF6EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  modalSubmitBtn: {
    height: 52,
    backgroundColor: '#3B6029',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalSubmitBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
