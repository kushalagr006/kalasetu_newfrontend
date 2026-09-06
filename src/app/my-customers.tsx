import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

type LangCode = 'hi' | 'en';

interface CustomerRecord {
  id: string;
  nameHi: string;
  nameEn: string;
  locationHi: string;
  locationEn: string;
  lastMsgHi: string;
  lastMsgEn: string;
  timeAgoHi: string;
  timeAgoEn: string;
  orderSummaryHi: string;
  orderSummaryEn: string;
  unreadCount: number;
}

const CUSTOMERS_DATA: CustomerRecord[] = [
  {
    id: '1',
    nameHi: 'सीमा ट्रेडर्स',
    nameEn: 'Seema Traders',
    locationHi: 'जयपुर, राजस्थान',
    locationEn: 'Jaipur, Rajasthan',
    lastMsgHi: 'नमस्ते, मुझे 200 पीस मिट्टी के बर्तन का आधिकारिक कोटेशन चाहिए।',
    lastMsgEn: 'Hello, I need an official price quote for 200 units of clay pots.',
    timeAgoHi: '10 मिनट पहले',
    timeAgoEn: '10m ago',
    orderSummaryHi: '📦 थोक ऑर्डर पूछताछ (200 पीस)',
    orderSummaryEn: '📦 Bulk Inquiry (200 Units)',
    unreadCount: 2,
  },
  {
    id: '2',
    nameHi: 'राहुल शर्मा',
    nameEn: 'Rahul Sharma',
    locationHi: 'भोपाल, मध्य प्रदेश',
    locationEn: 'Bhopal, Madhya Pradesh',
    lastMsgHi: 'क्या आप इस घड़े पर कस्टम नक्काशी बना सकते हैं?',
    lastMsgEn: 'Can you customize the handmade etching on this clay pot?',
    timeAgoHi: '1 घंटा पहले',
    timeAgoEn: '1h ago',
    orderSummaryHi: '🛒 ग्राहक पूछताछ (2 घड़े)',
    orderSummaryEn: '🛒 Product Inquiry (2 Units)',
    unreadCount: 0,
  },
  {
    id: '3',
    nameHi: 'ताज हॉस्पिटैलिटी प्रोक्योरमेंट',
    nameEn: 'Taj Hospitality Procurement',
    locationHi: 'नई दिल्ली',
    locationEn: 'New Delhi',
    lastMsgHi: 'आपके द्वारा भेजे गए सैंपल हमें पसंद आए। डिलीवरी का समय बताएं।',
    lastMsgEn: 'We loved your sample photos. Please confirm delivery timeline.',
    timeAgoHi: '3 घंटे पहले',
    timeAgoEn: '3h ago',
    orderSummaryHi: '🏨 होटल क्राफ्ट ऑर्डर (500 पीस)',
    orderSummaryEn: '🏨 Corporate Order (500 Units)',
    unreadCount: 1,
  },
  {
    id: '4',
    nameHi: 'अनन्या वर्मा',
    nameEn: 'Ananya Verma',
    locationHi: 'इंदौर, मध्य प्रदेश',
    locationEn: 'Indore, Madhya Pradesh',
    lastMsgHi: 'धन्यवाद! मुझे सामान प्राप्त हो गया है, बहुत ही सुंदर है।',
    lastMsgEn: 'Thank you! Received the product, craftsmanship is beautiful.',
    timeAgoHi: 'कल',
    timeAgoEn: 'Yesterday',
    orderSummaryHi: '✅ पूर्ण ऑर्डर (दीया सेट)',
    orderSummaryEn: '✅ Completed Order (Diya Set)',
    unreadCount: 0,
  },
  {
    id: '5',
    nameHi: 'फैबइंडिया क्राफ्ट सप्लायर्स',
    nameEn: 'FabIndia Craft Sourcing',
    locationHi: 'मुंबई, महाराष्ट्र',
    locationEn: 'Mumbai, Maharashtra',
    lastMsgHi: 'अंतिम दस्तावेज़ और डिलीवरी शेड्यूल साझा करें।',
    lastMsgEn: 'Please share final documentation & dispatch dates.',
    timeAgoHi: '2 दिन पहले',
    timeAgoEn: '2 days ago',
    orderSummaryHi: '📦 थोक ऑर्डर (350 सेट)',
    orderSummaryEn: '📦 Wholesale Order (350 Sets)',
    unreadCount: 0,
  },
];

export default function MyCustomersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();

  const selectedLang: LangCode = (params.lang as LangCode) || 'hi';
  const isHindi = selectedLang === 'hi';

  const [searchQuery, setSearchQuery] = useState('');

  // Chat Modal State
  const [activeChatCustomer, setActiveChatCustomer] = useState<CustomerRecord | null>(null);
  const [chatInputText, setChatInputText] = useState('');
  const [messagesList, setMessagesList] = useState<{ id: string; text: string; sender: 'me' | 'them'; time: string }[]>([]);

  const handleOpenChat = (customer: CustomerRecord) => {
    setActiveChatCustomer(customer);
    setChatInputText('');
    setMessagesList([
      {
        id: '1',
        text: isHindi ? customer.lastMsgHi : customer.lastMsgEn,
        sender: 'them',
        time: isHindi ? customer.timeAgoHi : customer.timeAgoEn,
      },
    ]);
  };

  const handleSendMessage = () => {
    if (!chatInputText.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      text: chatInputText,
      sender: 'me' as const,
      time: isHindi ? 'अभी' : 'Just now',
    };
    setMessagesList((prev) => [...prev, newMsg]);
    setChatInputText('');
  };

  const filteredCustomers = CUSTOMERS_DATA.filter((cust) => {
    const name = isHindi ? cust.nameHi : cust.nameEn;
    const loc = isHindi ? cust.locationHi : cust.locationEn;
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
            {isHindi ? 'मेरे ग्राहक' : 'My Customers'}
          </Text>

          {/* Spacer to keep title centered */}
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Box */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={
                isHindi
                  ? 'ग्राहक का नाम या शहर खोजें...'
                  : 'Search customer name or city...'
              }
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          {/* Customers List */}
          <View style={styles.customerListGroup}>
            {filteredCustomers.map((cust) => {
              const name = isHindi ? cust.nameHi : cust.nameEn;
              const loc = isHindi ? cust.locationHi : cust.locationEn;
              const msg = isHindi ? cust.lastMsgHi : cust.lastMsgEn;
              const time = isHindi ? cust.timeAgoHi : cust.timeAgoEn;
              const orderSum = isHindi ? cust.orderSummaryHi : cust.orderSummaryEn;

              return (
                <View key={cust.id} style={styles.customerCard}>
                  {/* Card Main Row */}
                  <TouchableOpacity
                    style={styles.cardHeaderArea}
                    onPress={() => handleOpenChat(cust)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.avatarContainer}>
                      <View style={styles.avatarCircle}>
                        <Ionicons name="person" size={24} color="#3B6029" />
                      </View>
                      {cust.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadBadgeText}>{cust.unreadCount}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.infoCol}>
                      <View style={styles.nameRow}>
                        <Text style={styles.customerName}>{name}</Text>
                        <Text style={styles.timeAgo}>{time}</Text>
                      </View>

                      <Text style={styles.locationText}>📍 {loc}</Text>

                      <Text style={styles.orderSummaryText}>{orderSum}</Text>

                      <Text style={styles.lastMsgSnippet} numberOfLines={1}>
                        "{msg}"
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.cardDivider} />

                  {/* Card Action Button Row: Single Chat Button Only */}
                  <View style={styles.cardActionRow}>
                    <TouchableOpacity
                      style={styles.chatActionBtn}
                      onPress={() => handleOpenChat(cust)}
                      activeOpacity={0.88}
                    >
                      <Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.chatActionBtnText}>
                        {isHindi ? 'चैट करें' : 'Chat'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Live Chat Modal */}
        <Modal
          visible={!!activeChatCustomer}
          animationType="slide"
          onRequestClose={() => setActiveChatCustomer(null)}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF8F5' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
            <View style={styles.chatModalHeader}>
              <TouchableOpacity onPress={() => setActiveChatCustomer(null)}>
                <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
              </TouchableOpacity>

              {activeChatCustomer && (
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.chatHeaderName}>
                    {isHindi ? activeChatCustomer.nameHi : activeChatCustomer.nameEn}
                  </Text>
                  <Text style={styles.chatHeaderSub}>
                    📍 {isHindi ? activeChatCustomer.locationHi : activeChatCustomer.locationEn}
                  </Text>
                </View>
              )}

              <View style={{ width: 26 }} />
            </View>

            {/* Chat Messages Body */}
            <ScrollView
              style={{ flex: 1, paddingHorizontal: 16, paddingTop: 10 }}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {messagesList.map((m) => (
                <View
                  key={m.id}
                  style={[
                    styles.msgBubble,
                    m.sender === 'me' ? styles.msgBubbleMe : styles.msgBubbleThem,
                  ]}
                >
                  <Text
                    style={[
                      styles.msgText,
                      m.sender === 'me' ? styles.msgTextMe : styles.msgTextThem,
                    ]}
                  >
                    {m.text}
                  </Text>
                  <Text
                    style={[
                      styles.msgTime,
                      m.sender === 'me' ? styles.msgTimeMe : styles.msgTimeThem,
                    ]}
                  >
                    {m.time}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Chat Input Bar */}
            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatTextInput}
                placeholder={isHindi ? 'संदेश लिखें...' : 'Type a message...'}
                placeholderTextColor="#888"
                value={chatInputText}
                onChangeText={setChatInputText}
              />
              <TouchableOpacity
                style={styles.sendMsgBtn}
                onPress={handleSendMessage}
                activeOpacity={0.8}
              >
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 36,
  },
  /* Search Box */
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  /* Customer Cards */
  customerListGroup: {
    gap: 14,
  },
  customerCard: {
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
  cardHeaderArea: {
    flexDirection: 'row',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF6EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0A0A',
    flex: 1,
  },
  timeAgo: {
    fontSize: 11,
    color: '#888888',
  },
  locationText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  orderSummaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B6029',
    marginBottom: 4,
  },
  lastMsgSnippet: {
    fontSize: 13,
    color: '#555555',
    fontStyle: 'italic',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F0EFEA',
    marginVertical: 12,
  },
  cardActionRow: {
    flexDirection: 'row',
  },
  chatActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 12,
    paddingVertical: 10,
  },
  chatActionBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  /* Chat Modal */
  chatModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E5E3DC',
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  chatHeaderSub: {
    fontSize: 11,
    color: '#666666',
  },
  msgBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  msgBubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B6029',
    borderBottomRightRadius: 2,
  },
  msgBubbleThem: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E3DC',
    borderBottomLeftRadius: 2,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 19,
  },
  msgTextMe: {
    color: '#FFFFFF',
  },
  msgTextThem: {
    color: '#1A1A1A',
  },
  msgTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  msgTimeMe: {
    color: '#EAF2E8',
  },
  msgTimeThem: {
    color: '#888888',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#E5E3DC',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chatTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    maxHeight: 80,
  },
  sendMsgBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B6029',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
