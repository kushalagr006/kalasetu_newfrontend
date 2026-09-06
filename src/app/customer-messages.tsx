import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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

const TRANSLATIONS_CUST_MESSAGES = {
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
    pageTitle: 'कारीगर बातचीत',
    pageSubtitle: 'कारीगरों के साथ सीधे संदेश भेजें और अपने प्रश्नों के उत्तर पाएं।',
    searchChatPlaceholder: 'कारीगर का नाम खोजें...',
    tabAll: 'सभी',
    tabUnread: 'अपठित (1)',
    tabOrders: 'ऑर्डर प्रश्न',
    newMessageBtn: '+ नया संदेश',
    activeOnline: 'ऑनलाइन',
    viewArtisanProducts: 'उत्पाद देखें',
    inputPlaceholder: 'कारीगर को संदेश लिखें...',
    sendBtn: 'भेजें',
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
    pageTitle: 'Artisan Messages',
    pageSubtitle: 'Chat directly with master artisans and track custom product inquiries.',
    searchChatPlaceholder: 'Search artisan name...',
    tabAll: 'All',
    tabUnread: 'Unread (1)',
    tabOrders: 'Order Inquiries',
    newMessageBtn: '+ New Chat',
    activeOnline: 'Online',
    viewArtisanProducts: 'View Products',
    inputPlaceholder: 'Type a message to artisan...',
    sendBtn: 'Send',
  },
};

const ARTISAN_CHATS = [
  {
    id: '1',
    nameHi: 'सीमा देवी (कांकेर)',
    nameEn: 'Seema Devi (Kanker)',
    craftHi: 'बाँस टोकरी निर्माता',
    craftEn: 'Bamboo Basket Artisan',
    lastMessageHi: 'नमस्कार जी, आपका बाँस की टोकरी का ऑर्डर रायपुर हब से निकल गया है। 🌿',
    lastMessageEn: 'Hello, your bamboo basket order has been dispatched from Raipur hub. 🌿',
    time: '10:45 AM',
    unread: 1,
    online: true,
    avatarInitials: 'SD',
    avatarBg: '#3B6029',
  },
  {
    id: '2',
    nameHi: 'रामकुमार साहू (कोंडागांव)',
    nameEn: 'Ramkumar Sahu (Kondagaon)',
    craftHi: 'टेराकोटा शिल्पी',
    craftEn: 'Terracotta Sculptor',
    lastMessageHi: 'क्या आपको टेराकोटा घड़े की मिट्टी की फिनिशिंग पसंद आई?',
    lastMessageEn: 'Did you like the natural clay finish of the terracotta pot?',
    time: 'कल',
    unread: 0,
    online: false,
    avatarInitials: 'RS',
    avatarBg: '#E65100',
  },
  {
    id: '3',
    nameHi: 'सुनीता देवांगन (रायगढ़)',
    nameEn: 'Sunita Dewangan (Raigarh)',
    craftHi: 'कोसा सिल्क बुनकर',
    craftEn: 'Kosa Silk Weaver',
    lastMessageHi: 'आपकी कस्टमाइज्ड साड़ी की बुनाई 80% पूरी हो चुकी है।',
    lastMessageEn: 'Your customized saree weaving is 80% completed.',
    time: '24 अगस्त',
    unread: 0,
    online: true,
    avatarInitials: 'SD',
    avatarBg: '#0288D1',
  },
];

const CHAT_THREAD_SD = [
  {
    id: 'm1',
    sender: 'customer',
    textHi: 'नमस्ते सीमा जी! मैंने बांस की टोकरी (ऑर्डर #KS-98421) का ऑर्डर दिया है। क्या यह प्राकृतिक बांस से ही बनी है?',
    textEn: 'Hello Seema ji! I placed order #KS-98421 for the bamboo basket. Is it made from pure natural bamboo?',
    time: '25 अगस्त, 11:30 AM',
  },
  {
    id: 'm2',
    sender: 'artisan',
    textHi: 'प्रणाम आदित्य जी! जी हाँ, यह 100% कांकेर के जंगलों से चुने गए प्राकृतिक बांस से हाथ से बनाई गई है।',
    textEn: 'Pranam Aditya ji! Yes, it is 100% handcrafted from natural bamboo selected from Kanker forests.',
    time: '25 अगस्त, 11:35 AM',
  },
  {
    id: 'm3',
    sender: 'customer',
    textHi: 'बहुत बढ़िया! इसे पैक करते समय थोड़ा मजबूत डिब्बा इस्तेमाल कर दीजिएगा।',
    textEn: 'Great! Please use sturdy packaging while shipping.',
    time: '26 अगस्त, 09:10 AM',
  },
  {
    id: 'm4',
    sender: 'artisan',
    textHi: 'नमस्कार जी, आपका बाँस की टोकरी का ऑर्डर रायपुर हब से निकल गया है। 🌿',
    textEn: 'Hello, your bamboo basket order has been dispatched from Raipur hub. 🌿',
    time: 'आज, 10:45 AM',
  },
];

export default function CustomerMessagesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang] = useGlobalLang();
  const [selectedChatId, setSelectedChatId] = useState('1');
  const [inputText, setInputText] = useState('');

  const t = TRANSLATIONS_CUST_MESSAGES[selectedLang as keyof typeof TRANSLATIONS_CUST_MESSAGES] || TRANSLATIONS_CUST_MESSAGES.en;
  const isHindi = selectedLang === 'hi';

  const activeChat = ARTISAN_CHATS.find((c) => c.id === selectedChatId) || ARTISAN_CHATS[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <CustTopHeader />

        {/* Main 2-Column Layout */}
        <View style={styles.mainLayoutRow}>
          {/* 1. Left Sidebar Navigation */}
          {isDesktop && <CustSidebar activeKey="messages" />}

          {/* 2. Main Content Area */}
          <View style={styles.contentCol}>
            {/* Split Screen Layout: Left Chat List & Right Active Thread */}
            <View style={styles.splitChatCard}>
              {/* Left Column: Artisans List */}
              <View style={styles.chatsListColumn}>
                {/* Search Bar */}
                <View style={styles.chatListSearchBox}>
                  <Ionicons name="search" size={16} color="#888888" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.chatListSearchInput}
                    placeholder={t.searchChatPlaceholder}
                    placeholderTextColor="#888888"
                  />
                </View>

                {/* Filter Tabs */}
                <View style={styles.chatFilterTabsRow}>
                  <TouchableOpacity style={[styles.chatFilterTab, styles.chatFilterTabActive]}>
                    <Text style={[styles.chatFilterTabText, styles.chatFilterTabTextActive]}>{t.tabAll}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.chatFilterTab}>
                    <Text style={styles.chatFilterTabText}>{t.tabUnread}</Text>
                  </TouchableOpacity>
                </View>

                {/* Chat List Scroll */}
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                  {ARTISAN_CHATS.map((chat) => {
                    const isSelected = chat.id === selectedChatId;
                    return (
                      <TouchableOpacity
                        key={chat.id}
                        style={[styles.chatRowItem, isSelected && styles.chatRowItemActive]}
                        onPress={() => setSelectedChatId(chat.id)}
                        activeOpacity={0.8}
                      >
                        {/* Avatar */}
                        <View style={[styles.avatarCircle, { backgroundColor: chat.avatarBg }]}>
                          <Text style={styles.avatarText}>{chat.avatarInitials}</Text>
                          {chat.online && <View style={styles.onlineBadgeDot} />}
                        </View>

                        {/* Text Meta */}
                        <View style={{ flex: 1 }}>
                          <View style={styles.nameTimeRow}>
                            <Text style={styles.chatNameText}>{isHindi ? chat.nameHi : chat.nameEn}</Text>
                            <Text style={styles.timeText}>{chat.time}</Text>
                          </View>
                          <Text style={styles.craftSubText}>{isHindi ? chat.craftHi : chat.craftEn}</Text>
                          <Text style={styles.lastMsgText} numberOfLines={1}>
                            {isHindi ? chat.lastMessageHi : chat.lastMessageEn}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Right Column: Active Thread */}
              <View style={styles.chatThreadColumn}>
                {/* Active Chat Header */}
                <View style={styles.threadHeaderBar}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.avatarCircle, { backgroundColor: activeChat.avatarBg, width: 42, height: 42, borderRadius: 21, marginRight: 12 }]}>
                      <Text style={styles.avatarText}>{activeChat.avatarInitials}</Text>
                    </View>
                    <View>
                      <Text style={styles.threadArtisanName}>{isHindi ? activeChat.nameHi : activeChat.nameEn}</Text>
                      <Text style={styles.threadCraftText}>{isHindi ? activeChat.craftHi : activeChat.craftEn}</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.viewProductsOutlineBtn}>
                    <Text style={styles.viewProductsOutlineBtnText}>{t.viewArtisanProducts}</Text>
                  </TouchableOpacity>
                </View>

                {/* Messages Feed */}
                <ScrollView style={styles.messagesFeedScroll} contentContainerStyle={{ padding: 20, gap: 16 }}>
                  {CHAT_THREAD_SD.map((msg) => {
                    const isCustomer = msg.sender === 'customer';
                    return (
                      <View
                        key={msg.id}
                        style={[
                          styles.msgBubbleWrapper,
                          isCustomer ? styles.msgBubbleWrapperRight : styles.msgBubbleWrapperLeft,
                        ]}
                      >
                        <View style={[styles.msgBubbleCard, isCustomer ? styles.customerBubble : styles.artisanBubble]}>
                          <Text style={[styles.msgText, isCustomer ? styles.customerMsgText : styles.artisanMsgText]}>
                            {isHindi ? msg.textHi : msg.textEn}
                          </Text>
                          <Text style={[styles.msgTimeText, isCustomer ? styles.customerMsgTime : styles.artisanMsgTime]}>
                            {msg.time}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>

                {/* Input Bar */}
                <View style={styles.inputBarRow}>
                  <TouchableOpacity style={styles.attachIconBtn}>
                    <Ionicons name="attach" size={20} color="#666666" />
                  </TouchableOpacity>

                  <TextInput
                    style={styles.msgTextInput}
                    placeholder={t.inputPlaceholder}
                    placeholderTextColor="#888888"
                    value={inputText}
                    onChangeText={setInputText}
                  />

                  <TouchableOpacity style={styles.sendMsgBtn} activeOpacity={0.8}>
                    <Ionicons name="send" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
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
    padding: 24,
  },
  splitChatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  chatsListColumn: {
    width: 340,
    borderRightWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#FFFFFF',
  },
  chatListSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 16,
    marginBottom: 8,
  },
  chatListSearchInput: {
    flex: 1,
    fontSize: 12,
    color: '#1A1A1A',
    padding: 0,
  },
  chatFilterTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  chatFilterTab: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FAF8F5',
  },
  chatFilterTabActive: {
    backgroundColor: '#2E7D32',
  },
  chatFilterTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666666',
  },
  chatFilterTabTextActive: {
    color: '#FFFFFF',
  },
  chatRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
  },
  chatRowItemActive: {
    backgroundColor: '#E8F5E9',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  onlineBadgeDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  chatNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  timeText: {
    fontSize: 10,
    color: '#888888',
  },
  craftSubText: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMsgText: {
    fontSize: 11,
    color: '#666666',
  },
  chatThreadColumn: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  threadHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#EBEBEB',
  },
  threadArtisanName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  threadCraftText: {
    fontSize: 11,
    color: '#666666',
  },
  viewProductsOutlineBtn: {
    borderWidth: 1,
    borderColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  viewProductsOutlineBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  messagesFeedScroll: {
    flex: 1,
  },
  msgBubbleWrapper: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  msgBubbleWrapperLeft: {
    justifyContent: 'flex-start',
  },
  msgBubbleWrapperRight: {
    justifyContent: 'flex-end',
  },
  msgBubbleCard: {
    maxWidth: '70%',
    padding: 14,
    borderRadius: 14,
  },
  artisanBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  customerBubble: {
    backgroundColor: '#2E7D32',
  },
  msgText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 4,
  },
  artisanMsgText: {
    color: '#1A1A1A',
  },
  customerMsgText: {
    color: '#FFFFFF',
  },
  msgTimeText: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  artisanMsgTime: {
    color: '#888888',
  },
  customerMsgTime: {
    color: '#E8F5E9',
  },
  inputBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#EBEBEB',
    gap: 12,
  },
  attachIconBtn: {
    padding: 4,
  },
  msgTextInput: {
    flex: 1,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
    color: '#1A1A1A',
  },
  sendMsgBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
