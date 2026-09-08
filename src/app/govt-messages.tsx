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
import { useGlobalLang } from '@/utils/languageStore';
import { GovtSidebar, GovtTopHeader } from '@/components/GovtLayout';

const TRANSLATIONS = {
  hi: {
    dashboard: 'डैशबोर्ड',
    buyProducts: 'उत्पाद खरीदें',
    tenders: 'टेंडर',
    myOrders: 'मेरे ऑर्डर',
    messages: 'संदेश',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉगआउट',
    deptName: 'उद्योग और वाणिज्य विभाग',
    deptState: 'छत्तीसगढ़ सरकार',
    userRole: 'अधिकारी',
    userTitle: 'विभाग अधिकारी',

    pageTitle: 'संदेश',
    pageSubtitle: 'विक्रेताओं से संपर्क करें, प्रश्न पूछें और उत्पादों के बारे में अधिक विवरण प्राप्त करें।',

    searchPlaceholder: 'संदेश खोजें...',
    filterAll: 'सभी',
    filterUnread: 'अनपढ़े',
    filterOrders: 'ऑर्डर',
    filterProducts: 'उत्पाद',

    activeNow: 'अभी सक्रिय',
    location: 'हस्तशिल्प | जगदलपुर, छत्तीसगढ़',
    viewSellerProfile: 'विक्रेता प्रोफाइल देखें',
    viewProduct: 'उत्पाद देखें',

    typeMessage: 'संदेश टाइप करें...',
    send: 'भेजें',
    today: 'आज',
  },
  en: {
    dashboard: 'Dashboard',
    buyProducts: 'Buy Products',
    tenders: 'Tenders',
    myOrders: 'My Orders',
    messages: 'Messages',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    deptName: 'Dept. of Industry & Commerce',
    deptState: 'Govt. of Chhattisgarh',
    userRole: 'Officer',
    userTitle: 'Department Officer',

    pageTitle: 'Messages',
    pageSubtitle: 'Contact sellers, ask questions and get more details about products.',

    searchPlaceholder: 'Search messages...',
    filterAll: 'All',
    filterUnread: 'Unread',
    filterOrders: 'Orders',
    filterProducts: 'Products',

    activeNow: 'Active now',
    location: 'Handicrafts | Jagdalpur, Chhattisgarh',
    viewSellerProfile: 'View Seller Profile',
    viewProduct: 'View Product',

    typeMessage: 'Type a message...',
    send: 'Send',
    today: 'Today',
  },
};

const CONVERSATIONS_LIST = [
  {
    id: '1',
    name: 'Bastar Handicrafts SHG',
    time: '10:24 AM',
    lastMessageEn: 'Yes, we can provide 50 pieces. ...',
    lastMessageHi: 'हाँ, हम 50 पीस प्रदान कर सकते हैं। ...',
    image: require('@/assets/images/govt_item_basket.png'),
    unread: true,
  },
  {
    id: '2',
    name: 'Chhattisgarh Crafts',
    time: 'Yesterday',
    lastMessageEn: 'Thank you for your tender bid response.',
    lastMessageHi: 'आपकी टेंडर बोली प्रतिक्रिया के लिए धन्यवाद।',
    image: require('@/assets/images/govt_item_chair.png'),
    unread: false,
  },
  {
    id: '3',
    name: 'Kondagaon Artisans',
    time: '04 Sep',
    lastMessageEn: 'Sample pictures have been sent for review.',
    lastMessageHi: 'समीक्षा के लिए नमूना चित्र भेज दिए गए हैं।',
    image: require('@/assets/images/govt_item_lampshade.png'),
    unread: false,
  },
];

const CHAT_MESSAGES = [
  {
    id: 'm1',
    sender: 'them',
    textEn: 'Namaste Officer, regarding Tender #TND-2025-008 for Bamboo Baskets, we have submitted our bid.',
    textHi: 'नमस्ते अधिकारी महोदय, बांस की टोकरियों के लिए टेंडर #TND-2025-008 के संबंध में हमने अपनी बोली जमा कर दी है।',
    time: '10:15 AM',
  },
  {
    id: 'm2',
    sender: 'me',
    textEn: 'Thank you. What is your estimated delivery timeline for 500 units?',
    textHi: 'धन्यवाद। 500 इकाइयों के लिए आपकी अनुमानित डिलीवरी समय-सीमा क्या है?',
    time: '10:20 AM',
  },
  {
    id: 'm3',
    sender: 'them',
    textEn: 'Yes, we can provide 50 pieces per week and complete the full order within 10 days after approval.',
    textHi: 'हाँ, हम प्रति सप्ताह 50 पीस प्रदान कर सकते हैं और अनुमोदन के बाद 10 दिनों के भीतर पूरा ऑर्डर पूरा कर सकते हैं।',
    time: '10:24 AM',
  },
];

export default function GovtMessagesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang] = useGlobalLang();
  const [activeConvId, setActiveConvId] = useState('1');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'orders' | 'products'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');

  const t = (TRANSLATIONS as any)[selectedLang] || TRANSLATIONS.hi;
  const isHindi = selectedLang === 'hi';

  const activeConv = CONVERSATIONS_LIST.find((c) => c.id === activeConvId) || CONVERSATIONS_LIST[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <View style={styles.container}>
        <View style={styles.mainRow}>
          {/* 1. Shared Left Sidebar Component */}
          {isDesktop && <GovtSidebar activeKey="messages" />}

          {/* 2. Right Main Content Area */}
          <View style={styles.contentCol}>
            {/* Shared Top Header */}
            <GovtTopHeader />

            {/* Main Chat Layout Container */}
            <View style={styles.chatWrapper}>
              {/* Left Column: Conversations List */}
              <View style={styles.convListCol}>
                <View style={styles.convListHeader}>
                  <Text style={styles.convListTitle}>{t.pageTitle}</Text>

                  {/* Search Bar */}
                  <View style={styles.searchBox}>
                    <Ionicons name="search" size={15} color="#9CA3AF" style={{ marginRight: 6 }} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder={t.searchPlaceholder}
                      placeholderTextColor="#9CA3AF"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>

                  {/* Filter Pills */}
                  <View style={styles.filterPillsRow}>
                    <TouchableOpacity
                      style={[styles.filterPill, filterTab === 'all' && styles.filterPillActive]}
                      onPress={() => setFilterTab('all')}
                    >
                      <Text style={[styles.filterPillText, filterTab === 'all' && styles.filterPillTextActive]}>
                        {t.filterAll}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.filterPill, filterTab === 'unread' && styles.filterPillActive]}
                      onPress={() => setFilterTab('unread')}
                    >
                      <Text style={[styles.filterPillText, filterTab === 'unread' && styles.filterPillTextActive]}>
                        {t.filterUnread}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Items List */}
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                  {CONVERSATIONS_LIST.map((item) => {
                    const isActive = item.id === activeConvId;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.convItemRow, isActive && styles.convItemRowActive]}
                        onPress={() => setActiveConvId(item.id)}
                        activeOpacity={0.75}
                      >
                        <Image source={item.image} style={styles.avatarThumb} />
                        <View style={{ flex: 1 }}>
                          <View style={styles.itemTopLine}>
                            <Text style={styles.itemPartnerName}>{item.name}</Text>
                            <Text style={styles.itemTimeText}>{item.time}</Text>
                          </View>
                          <Text style={styles.itemLastMsg} numberOfLines={1}>
                            {isHindi ? item.lastMessageHi : item.lastMessageEn}
                          </Text>
                        </View>
                        {item.unread && <View style={styles.unreadBadgeDot} />}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Right Column: Active Chat Area */}
              <View style={styles.chatActiveCol}>
                {/* Chat Top Header */}
                <View style={styles.chatHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={activeConv.image} style={styles.chatHeaderAvatar} />
                    <View>
                      <Text style={styles.chatHeaderName}>{activeConv.name}</Text>
                      <Text style={styles.chatHeaderSub}>{t.location}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity style={styles.chatHeaderActionBtn}>
                      <Text style={styles.chatHeaderActionText}>{t.viewSellerProfile}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Chat Messages Log */}
                <ScrollView style={styles.chatLogArea} contentContainerStyle={styles.chatLogContent}>
                  <View style={styles.dateDividerRow}>
                    <View style={styles.dateDividerLine} />
                    <Text style={styles.dateDividerText}>{t.today}</Text>
                    <View style={styles.dateDividerLine} />
                  </View>

                  {CHAT_MESSAGES.map((msg) => {
                    const isMe = msg.sender === 'me';
                    return (
                      <View
                        key={msg.id}
                        style={[styles.msgBubbleRow, isMe ? styles.msgRowRight : styles.msgRowLeft]}
                      >
                        <View style={[styles.msgBubble, isMe ? styles.msgBubbleMe : styles.msgBubbleThem]}>
                          <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextThem]}>
                            {isHindi ? msg.textHi : msg.textEn}
                          </Text>
                          <Text style={[styles.msgTime, isMe ? styles.msgTimeMe : styles.msgTimeThem]}>
                            {msg.time}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>

                {/* Input Bar */}
                <View style={styles.inputBarRow}>
                  <TouchableOpacity style={styles.attachBtn}>
                    <Ionicons name="attach" size={20} color="#6B7280" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.chatInput}
                    placeholder={t.typeMessage}
                    placeholderTextColor="#9CA3AF"
                    value={inputMessage}
                    onChangeText={setInputMessage}
                  />
                  <TouchableOpacity style={styles.sendBtn}>
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
  chatWrapper: {
    flex: 1,
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  convListCol: {
    width: 320,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  convListHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  convListTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#111827',
    padding: 0,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  filterPillActive: {
    backgroundColor: '#2E7D32',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4B5563',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  convItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  convItemRowActive: {
    backgroundColor: '#F0FDF4',
  },
  avatarThumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  itemTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemPartnerName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  itemTimeText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  itemLastMsg: {
    fontSize: 12,
    color: '#6B7280',
  },
  unreadBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
    marginLeft: 6,
  },
  chatActiveCol: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  chatHeaderAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
  },
  chatHeaderName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  chatHeaderSub: {
    fontSize: 11,
    color: '#6B7280',
  },
  chatHeaderActionBtn: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chatHeaderActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  chatLogArea: {
    flex: 1,
  },
  chatLogContent: {
    padding: 20,
    gap: 14,
  },
  dateDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  dateDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dateDividerText: {
    fontSize: 11,
    color: '#9CA3AF',
    paddingHorizontal: 12,
  },
  msgBubbleRow: {
    flexDirection: 'row',
  },
  msgRowLeft: {
    justifyContent: 'flex-start',
  },
  msgRowRight: {
    justifyContent: 'flex-end',
  },
  msgBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 12,
  },
  msgBubbleThem: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  msgBubbleMe: {
    backgroundColor: '#2E7D32',
  },
  msgText: {
    fontSize: 13,
    lineHeight: 18,
  },
  msgTextThem: {
    color: '#111827',
  },
  msgTextMe: {
    color: '#FFFFFF',
  },
  msgTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  msgTimeThem: {
    color: '#9CA3AF',
  },
  msgTimeMe: {
    color: '#A7F3D0',
  },
  inputBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 10,
  },
  attachBtn: {
    padding: 6,
  },
  chatInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sendBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
