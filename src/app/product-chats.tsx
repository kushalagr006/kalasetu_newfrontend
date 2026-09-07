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
  Image,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArtisanFloatingNav } from '@/components/ArtisanFloatingNav';

type LangCode = 'hi' | 'en';
type FilterType = 'all' | 'govt' | 'company' | 'individual';

interface ChatItem {
  id: string;
  buyerNameHi: string;
  buyerNameEn: string;
  buyerCategoryHi: string;
  buyerCategoryEn: string;
  buyerType: 'govt' | 'company' | 'individual';
  productNameHi: string;
  productNameEn: string;
  productPrice: string;
  lastMsgHi: string;
  lastMsgEn: string;
  timeAgoHi: string;
  timeAgoEn: string;
  unreadCount: number;
  badgeBg: string;
  badgeTextColor: string;
  avatarIcon: keyof typeof Ionicons.glyphMap;
  messages: { sender: 'buyer' | 'me'; textHi: string; textEn: string; time: string }[];
}

const PRODUCT_CHATS_DATA: ChatItem[] = [
  {
    id: '1',
    buyerNameHi: 'राजस्थान हस्तशिल्प विभाग',
    buyerNameEn: 'Rajasthan Handicrafts Dept',
    buyerCategoryHi: 'सरकारी विभाग',
    buyerCategoryEn: 'Govt Dept',
    buyerType: 'govt',
    productNameHi: 'सजावटी मिट्टी का घड़ा (50 पीस)',
    productNameEn: 'Decorative Clay Pot (50 Pcs)',
    productPrice: '₹22,500',
    lastMsgHi: 'सरकारी टेंडर स्वीकृति पत्र भेज दिया गया है। भुगतान 3 दिनों में क्रेडिट होगा।',
    lastMsgEn: 'Official tender approval letter issued. Payment will credit in 3 days.',
    timeAgoHi: '10 मिनट पहले',
    timeAgoEn: '10m ago',
    unreadCount: 2,
    badgeBg: '#E8F5E9',
    badgeTextColor: '#2E7D32',
    avatarIcon: 'business',
    messages: [
      {
        sender: 'buyer',
        textHi: 'नमस्ते सुनीता जी, हमें आपकी 50 मिट्टी के घड़ों का टेंडर प्रस्ताव प्राप्त हुआ है।',
        textEn: 'Hello Sunita Ji, we received your tender proposal for 50 clay pots.',
        time: '10:00 AM',
      },
      {
        sender: 'me',
        textHi: 'नमस्ते सर! सभी घड़े पूरी तरह हस्तनिर्मित और गुणवत्ता जांचे हुए हैं।',
        textEn: 'Hello Sir! All pots are handcrafted and quality checked.',
        time: '10:12 AM',
      },
      {
        sender: 'buyer',
        textHi: 'सरकारी टेंडर स्वीकृति पत्र भेज दिया गया है। भुगतान 3 दिनों में क्रेडिट होगा।',
        textEn: 'Official tender approval letter issued. Payment will credit in 3 days.',
        time: '10:30 AM',
      },
    ],
  },
  {
    id: '2',
    buyerNameHi: 'सीमा ट्रेडर्स (जयपुर)',
    buyerNameEn: 'Seema Traders (Jaipur)',
    buyerCategoryHi: 'निजी कंपनी',
    buyerCategoryEn: 'Private Co',
    buyerType: 'company',
    productNameHi: 'हाथ की कढ़ाई का दुपट्टा (200 पीस)',
    productNameEn: 'Handmade Embroidered Dupatta (200 Pcs)',
    productPrice: '₹4,00,000',
    lastMsgHi: 'नमस्ते सुनीता जी, क्या हम 200 पीस के लिए 50% अग्रिम भुगतान कर दें?',
    lastMsgEn: 'Hello Sunita Ji, shall we deposit 50% advance for 200 pcs order?',
    timeAgoHi: '25 मिनट पहले',
    timeAgoEn: '25m ago',
    unreadCount: 1,
    badgeBg: '#FFF3E0',
    badgeTextColor: '#E65100',
    avatarIcon: 'briefcase',
    messages: [
      {
        sender: 'buyer',
        textHi: 'नमस्ते, हमें आपकी हस्तनिर्मित कढ़ाई का दुपट्टा सैंपल बहुत पसंद आया।',
        textEn: 'Hello, we really liked your handmade embroidered dupatta samples.',
        time: '09:30 AM',
      },
      {
        sender: 'buyer',
        textHi: 'नमस्ते सुनीता जी, क्या हम 200 पीस के लिए 50% अग्रिम भुगतान कर दें?',
        textEn: 'Hello Sunita Ji, shall we deposit 50% advance for 200 pcs order?',
        time: '10:05 AM',
      },
    ],
  },
  {
    id: '3',
    buyerNameHi: 'रमेश कुमार',
    buyerNameEn: 'Ramesh Kumar',
    buyerCategoryHi: 'ग्राहक',
    buyerCategoryEn: 'Individual Buyer',
    buyerType: 'individual',
    productNameHi: 'बांस की नक्काशीदार टोकरी (2 पीस)',
    productNameEn: 'Carved Bamboo Basket (2 Pcs)',
    productPrice: '₹900',
    lastMsgHi: 'घड़े की पैकिंग कैसी रहेगी भाई साहब? टूटने का डर तो नहीं है?',
    lastMsgEn: 'How will the packaging be? Is there any risk of damage?',
    timeAgoHi: '1 घंटा पहले',
    timeAgoEn: '1h ago',
    unreadCount: 0,
    badgeBg: '#E1F5FE',
    badgeTextColor: '#0288D1',
    avatarIcon: 'person',
    messages: [
      {
        sender: 'buyer',
        textHi: 'नमस्ते, मैंने 2 बांस की टोकरी का ऑर्डर दिया है।',
        textEn: 'Hello, I ordered 2 bamboo baskets.',
        time: 'Yesterday',
      },
      {
        sender: 'me',
        textHi: 'धन्यवाद रमेश जी! आपका ऑर्डर आज शाम तक पैक हो जाएगा।',
        textEn: 'Thank you Ramesh Ji! Your order will be packed by this evening.',
        time: 'Yesterday',
      },
      {
        sender: 'buyer',
        textHi: 'घड़े की पैकिंग कैसी रहेगी भाई साहब? टूटने का डर तो नहीं है?',
        textEn: 'How will the packaging be? Is there any risk of damage?',
        time: '09:15 AM',
      },
    ],
  },
  {
    id: '4',
    buyerNameHi: 'ताज हॉस्पिटैलिटी प्रोक्योरमेंट',
    buyerNameEn: 'Taj Hospitality Procurement',
    buyerCategoryHi: 'कॉर्पोरेट',
    buyerCategoryEn: 'Corporate',
    buyerType: 'company',
    productNameHi: 'मिट्टी के दीये और नक्काशीदार फूलदान (500 पीस)',
    productNameEn: 'Clay Diya & Carved Vase Set (500 Pcs)',
    productPrice: '₹1,25,000',
    lastMsgHi: 'सैंपल अप्रूव हो गए हैं! कृपया डिलीवरी की तारीख कन्फर्म करें।',
    lastMsgEn: 'Samples approved! Please confirm the dispatch schedule.',
    timeAgoHi: '3 घंटे पहले',
    timeAgoEn: '3h ago',
    unreadCount: 0,
    badgeBg: '#EDE7F6',
    badgeTextColor: '#512DA8',
    avatarIcon: 'ribbon',
    messages: [
      {
        sender: 'buyer',
        textHi: 'सैंपल अप्रूव हो गए हैं! कृपया डिलीवरी की तारीख कन्फर्म करें।',
        textEn: 'Samples approved! Please confirm the dispatch schedule.',
        time: '07:30 AM',
      },
    ],
  },
  {
    id: '5',
    buyerNameHi: 'प्रिया वर्मा',
    buyerNameEn: 'Priya Verma',
    buyerCategoryHi: 'ग्राहक',
    buyerCategoryEn: 'Individual Buyer',
    buyerType: 'individual',
    productNameHi: 'हाथ से बना दीया सेट (5 सेट)',
    productNameEn: 'Handmade Diya Set (5 Sets)',
    productPrice: '₹2,000',
    lastMsgHi: 'सामान मिल गया है, बहुत ही सुंदर क्वालिटी है! 5 स्टार रेटिंग दी है।',
    lastMsgEn: 'Received the item, beautiful quality! Gave 5 star rating.',
    timeAgoHi: 'कल',
    timeAgoEn: 'Yesterday',
    unreadCount: 0,
    badgeBg: '#EAF2E8',
    badgeTextColor: '#3B6029',
    avatarIcon: 'person',
    messages: [
      {
        sender: 'buyer',
        textHi: 'सामान मिल गया है, बहुत ही सुंदर क्वालिटी है! 5 स्टार रेटिंग दी है।',
        textEn: 'Received the item, beautiful quality! Gave 5 star rating.',
        time: 'Yesterday',
      },
    ],
  },
];

const TRANSLATIONS = {
  hi: {
    headerTitle: 'उत्पाद एवं खरीदार चैट',
    headerSubtitle: 'आपके उत्पादों के लिए चल रही सभी ग्राहक, कंपनी एवं सरकारी टेंडर की बातचीत',
    searchPlaceholder: 'खरीदार या उत्पाद का नाम खोजें...',
    filterAll: 'सभी',
    filterGovt: 'सरकारी',
    filterCompany: 'कंपनी',
    filterIndividual: 'ग्राहक',
    productLabel: 'उत्पाद: ',
    typeMessagePlaceholder: 'संदेश लिखें...',
    sendBtn: 'भेजें',
    closeBtn: 'बंद करें',
  },
  en: {
    headerTitle: 'Product & Buyer Chats',
    headerSubtitle: 'All active customer, company & govt tender chats for your products',
    searchPlaceholder: 'Search buyer or product name...',
    filterAll: 'All',
    filterGovt: 'Govt',
    filterCompany: 'Company',
    filterIndividual: 'Individual',
    productLabel: 'Product: ',
    typeMessagePlaceholder: 'Type a message...',
    sendBtn: 'Send',
    closeBtn: 'Close',
  },
};

export default function ProductChatsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const selectedLang: LangCode = (params.lang as LangCode) === 'en' ? 'en' : 'hi';
  const isHindi = selectedLang === 'hi';
  const t = TRANSLATIONS[selectedLang];

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [chatList, setChatList] = useState<ChatItem[]>(PRODUCT_CHATS_DATA);

  const filteredChats = chatList.filter((chat) => {
    const matchesFilter = activeFilter === 'all' || chat.buyerType === activeFilter;
    const nameMatch =
      chat.buyerNameHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.buyerNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.productNameHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.productNameEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && nameMatch;
  });

  const handleSendMessage = () => {
    if (!replyText.trim() || !selectedChat) return;

    const newMsg = {
      sender: 'me' as const,
      textHi: replyText,
      textEn: replyText,
      time: 'अभी',
    };

    const updatedChats = chatList.map((c) => {
      if (c.id === selectedChat.id) {
        return {
          ...c,
          lastMsgHi: replyText,
          lastMsgEn: replyText,
          timeAgoHi: 'अभी',
          timeAgoEn: 'Just now',
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    setChatList(updatedChats);
    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMsg],
    });
    setReplyText('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.headerTitle}>{t.headerTitle}</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {t.headerSubtitle}
            </Text>
          </View>
        </View>

        {/* Search Input Bar */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={20} color="#777777" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.searchPlaceholder}
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#999999" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
                {t.filterAll}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'govt' && styles.filterPillActive]}
              onPress={() => setActiveFilter('govt')}
            >
              <Text style={[styles.filterText, activeFilter === 'govt' && styles.filterTextActive]}>
                {t.filterGovt}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'company' && styles.filterPillActive]}
              onPress={() => setActiveFilter('company')}
            >
              <Text style={[styles.filterText, activeFilter === 'company' && styles.filterTextActive]}>
                {t.filterCompany}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'individual' && styles.filterPillActive]}
              onPress={() => setActiveFilter('individual')}
            >
              <Text style={[styles.filterText, activeFilter === 'individual' && styles.filterTextActive]}>
                {t.filterIndividual}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Chat Cards List */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filteredChats.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={48} color="#CCCCCC" />
              <Text style={styles.emptyText}>कोई चैट नहीं मिली</Text>
            </View>
          ) : (
            filteredChats.map((item) => {
              const buyerName = isHindi ? item.buyerNameHi : item.buyerNameEn;
              const categoryText = isHindi ? item.buyerCategoryHi : item.buyerCategoryEn;
              const productName = isHindi ? item.productNameHi : item.productNameEn;
              const lastMsg = isHindi ? item.lastMsgHi : item.lastMsgEn;
              const timeAgo = isHindi ? item.timeAgoHi : item.timeAgoEn;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.chatCard}
                  onPress={() => setSelectedChat(item)}
                  activeOpacity={0.88}
                >
                  <View style={styles.cardTopRow}>
                    <View style={styles.avatarCircle}>
                      <Ionicons name={item.avatarIcon} size={22} color="#3B6029" />
                    </View>

                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <View style={styles.buyerHeader}>
                        <Text style={styles.buyerName} numberOfLines={1}>
                          {buyerName}
                        </Text>
                        <Text style={styles.timeText}>{timeAgo}</Text>
                      </View>

                      {/* Category Badge */}
                      <View style={[styles.categoryBadge, { backgroundColor: item.badgeBg }]}>
                        <Text style={[styles.categoryBadgeText, { color: item.badgeTextColor }]}>
                          {categoryText}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Attached Product Box */}
                  <View style={styles.productAttachBox}>
                    <Ionicons name="cube-outline" size={16} color="#3B6029" style={{ marginRight: 6 }} />
                    <Text style={styles.productAttachTitle} numberOfLines={1}>
                      {t.productLabel}{productName}
                    </Text>
                    <Text style={styles.productPriceBadge}>{item.productPrice}</Text>
                  </View>

                  {/* Last Message Snippet */}
                  <Text style={styles.lastMsgText} numberOfLines={2}>
                    "{lastMsg}"
                  </Text>

                  <View style={styles.cardFooterRow}>
                    <View style={styles.chatActionLabel}>
                      <Ionicons name="chatbubble-ellipses" size={14} color="#3B6029" style={{ marginRight: 4 }} />
                      <Text style={styles.chatActionText}>चैट खोलें / Open Chat</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#999999" />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        {/* Floating Bottom Nav */}
        <ArtisanFloatingNav activeTab="chat" selectedLang={selectedLang} />

        {/* Chat Detail Modal */}
        {selectedChat && (
          <Modal
            visible={!!selectedChat}
            animationType="slide"
            onRequestClose={() => setSelectedChat(null)}
          >
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedChat(null)} style={{ padding: 4 }}>
                  <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.modalBuyerTitle}>
                    {isHindi ? selectedChat.buyerNameHi : selectedChat.buyerNameEn}
                  </Text>
                  <Text style={styles.modalCategorySub}>
                    {isHindi ? selectedChat.buyerCategoryHi : selectedChat.buyerCategoryEn}
                  </Text>
                </View>
              </View>

              {/* Attached Product Header Banner */}
              <View style={styles.modalProductBanner}>
                <Ionicons name="cube" size={20} color="#3B6029" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalProductName}>
                    {isHindi ? selectedChat.productNameHi : selectedChat.productNameEn}
                  </Text>
                  <Text style={styles.modalProductPrice}>{selectedChat.productPrice}</Text>
                </View>
              </View>

              {/* Messages Scroll Area */}
              <ScrollView style={styles.messagesContainer} contentContainerStyle={{ paddingVertical: 12 }}>
                {selectedChat.messages.map((msg, index) => (
                  <View
                    key={index}
                    style={[
                      styles.msgBubble,
                      msg.sender === 'me' ? styles.msgBubbleMe : styles.msgBubbleBuyer,
                    ]}
                  >
                    <Text
                      style={[
                        styles.msgText,
                        msg.sender === 'me' ? styles.msgTextMe : styles.msgTextBuyer,
                      ]}
                    >
                      {isHindi ? msg.textHi : msg.textEn}
                    </Text>
                    <Text
                      style={[
                        styles.msgTime,
                        msg.sender === 'me' ? styles.msgTimeMe : styles.msgTimeBuyer,
                      ]}
                    >
                      {msg.time}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              {/* Message Input Box */}
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.chatTextInput}
                  placeholder={t.typeMessagePlaceholder}
                  placeholderTextColor="#999999"
                  value={replyText}
                  onChangeText={setReplyText}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendMessage}
                  activeOpacity={0.85}
                >
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Modal>
        )}
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFECE6',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  filterRow: {
    marginBottom: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#EFEFEA',
  },
  filterPillActive: {
    backgroundColor: '#3B6029',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#888888',
    marginTop: 12,
  },
  chatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFECE6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buyerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 6,
  },
  timeText: {
    fontSize: 11,
    color: '#888888',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 3,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  productAttachBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F4',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  productAttachTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    flex: 1,
  },
  productPriceBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B6029',
    marginLeft: 6,
  },
  lastMsgText: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0EFEA',
    paddingTop: 8,
  },
  chatActionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFECE6',
  },
  modalBuyerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  modalCategorySub: {
    fontSize: 12,
    color: '#3B6029',
    fontWeight: '600',
  },
  modalProductBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2E8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DBE8D7',
  },
  modalProductName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  modalProductPrice: {
    fontSize: 12,
    color: '#3B6029',
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  msgBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 4,
  },
  msgBubbleBuyer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFECE6',
  },
  msgBubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B6029',
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  msgTextBuyer: {
    color: '#1A1A1A',
  },
  msgTextMe: {
    color: '#FFFFFF',
  },
  msgTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  msgTimeBuyer: {
    color: '#888888',
  },
  msgTimeMe: {
    color: '#D2E7C9',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFECE6',
  },
  chatTextInput: {
    flex: 1,
    height: 42,
    backgroundColor: '#F5F4F0',
    borderRadius: 21,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1A1A1A',
    marginRight: 8,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#3B6029',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
