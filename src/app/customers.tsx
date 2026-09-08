import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArtisanFloatingNav } from '@/components/ArtisanFloatingNav';
import { useGlobalLang, setGlobalLang, ALL_LANGUAGES, LangCode } from '@/utils/languageStore';

interface RecentCustomerItem {
  id: string;
  names: Record<LangCode, string>;
  locations: Record<LangCode, string>;
  inquiries: Record<LangCode, string>;
}

const RECENT_CUSTOMERS_DATA: RecentCustomerItem[] = [
  {
    id: '1',
    names: {
      en: 'Rahul Sharma',
      hi: 'राहुल शर्मा',
      bn: 'রাহুল শর্মা',
      bho: 'राहुल शर्मा',
      mr: 'राहुल शर्मा',
      gu: 'રાહુલ શર્મા',
      raj: 'राहुल शर्मा',
      kn: 'ರಾಹುಲ್ ಶರ್ಮಾ',
    },
    locations: {
      en: 'Bhopal, Madhya Pradesh',
      hi: 'भोपाल, मध्य प्रदेश',
      bn: 'ভোপাল, মধ্যপ্রদেশ',
      bho: 'भोपाल, मध्य प्रदेश',
      mr: 'भोपाळ, मध्य प्रदेश',
      gu: 'ભોપાલ, મધ્યપ્રદેશ',
      raj: 'भोपाल, मध्य प्रदेश',
      kn: 'ಭೋಪಾಲ್, ಮಧ್ಯಪ್ರದೇಶ',
    },
    inquiries: {
      en: '20 Inquiries',
      hi: '20 पूछताछ',
      bn: '২০টি অনুসন্ধান',
      bho: '20 पूछताछ',
      mr: '२० चौकशी',
      gu: '20 પૂછપરછ',
      raj: '20 पूछताछ',
      kn: '20 ವಿಚಾರಣೆಗಳು',
    },
  },
  {
    id: '2',
    names: {
      en: 'Seema Traders',
      hi: 'सीमा ट्रेडर्स',
      bn: 'সীমা ট্রেডার্স',
      bho: 'सीमा ट्रेडर्स',
      mr: 'सीमा ट्रेडर्स',
      gu: 'સીમા ટ્રેડર્સ',
      raj: 'सीमा ट्रेडर्स',
      kn: 'ಸೀಮಾ ಟ್ರೇಡರ್ಸ್',
    },
    locations: {
      en: 'Jaipur, Rajasthan',
      hi: 'जयपुर, राजस्थान',
      bn: 'জয়পুর, রাজস্থান',
      bho: 'जयपुर, राजस्थान',
      mr: 'जयपूर, राजस्थान',
      gu: 'જયપુર, રાજસ્થાન',
      raj: 'जयपुर, राजस्थान',
      kn: 'ಜೈಪುರ, ರಾಜಸ್ಥಾನ',
    },
    inquiries: {
      en: '12 Inquiries',
      hi: '12 पूछताछ',
      bn: '১২টি অনুসন্ধান',
      bho: '12 पूछताछ',
      mr: '१२ चौकशी',
      gu: '12 પૂછપરછ',
      raj: '12 पूछताछ',
      kn: '12 ವಿಚಾರಣೆಗಳು',
    },
  },
  {
    id: '3',
    names: {
      en: 'Mala Collection',
      hi: 'माला कलेक्शन',
      bn: 'মালা কালেকশন',
      bho: 'माला कलेक्शन',
      mr: 'माला कलेक्शन',
      gu: 'માલા કલેક્શન',
      raj: 'माला कलेक्शन',
      kn: 'ಮಾಲಾ ಕಲೆಕ್ಷನ್',
    },
    locations: {
      en: 'Indore, Madhya Pradesh',
      hi: 'इंदौर, मध्य प्रदेश',
      bn: 'ইন্দোর, মধ্যপ্রদেশ',
      bho: 'इंदौर, मध्य प्रदेश',
      mr: 'इंदूर, मध्य प्रदेश',
      gu: 'ઇન્દોર, મધ્યપ્રદેશ',
      raj: 'इंदौर, मध्य प्रदेश',
      kn: 'ಇಂದೋರ್, ಮಧ್ಯಪ್ರದೇಶ',
    },
    inquiries: {
      en: '8 Inquiries',
      hi: '8 पूछताछ',
      bn: '৮টি অনুসন্ধান',
      bho: '8 पूछताछ',
      mr: '৮ चौकशी',
      gu: '8 પૂછપરછ',
      raj: '8 पूछताछ',
      kn: '8 ವಿಚಾರಣೆಗಳು',
    },
  },
];

const TRANSLATIONS: Record<LangCode, {
  headerTitle: string;
  headerSubtitle: string;
  quickSelectionTitle: string;
  myCustomersTitle: string;
  myCustomersDesc: string;
  bulkOrdersTitle: string;
  bulkOrdersDesc: string;
  tendersTitle: string;
  tendersDesc: string;
  recentCustomersTitle: string;
  viewAll: string;
  chatBtn: string;
  tenderAlertTitle: string;
  tenderAlertSub: string;
  tenderAlertBtn: string;
  modalTitle: string;
}> = {
  hi: {
    headerTitle: 'ऑर्डर्स',
    headerSubtitle: 'अपने सभी उत्पाद ऑर्डर, थोक खरीदारी और सरकारी टेंडर देखें',
    quickSelectionTitle: 'जल्दी से चुनें',
    myCustomersTitle: 'मेरे ग्राहक',
    myCustomersDesc: 'अपने ग्राहकों से बात करें और ऑर्डर संभालें',
    bulkOrdersTitle: 'बल्क ऑर्डर',
    bulkOrdersDesc: 'बड़े ऑर्डर के अवसर देखें',
    tendersTitle: 'टेंडर',
    tendersDesc: 'सरकारी और निजी टेंडर के अवसर देखें',
    recentCustomersTitle: 'हाल के ग्राहक',
    viewAll: 'सभी देखें',
    chatBtn: 'चैट करें',
    tenderAlertTitle: 'नई टेंडर सूचनाएं पाएं',
    tenderAlertSub: 'समय पर जानकारी पाएं और अपने उत्पादों के लिए बेहतर अवसर प्राप्त करें।',
    tenderAlertBtn: 'टेंडर अलर्ट सेट करें',
    modalTitle: 'भाषा चुनें / Select Language',
  },
  en: {
    headerTitle: 'Orders',
    headerSubtitle: 'View all product orders, bulk inquiries & government tenders',
    quickSelectionTitle: 'Quick Selection',
    myCustomersTitle: 'My Customers',
    myCustomersDesc: 'Talk with your buyers & manage orders',
    bulkOrdersTitle: 'Bulk Orders',
    bulkOrdersDesc: 'View big order opportunities',
    tendersTitle: 'Tenders',
    tendersDesc: 'View Govt & private tender options',
    recentCustomersTitle: 'Recent Customers',
    viewAll: 'View All',
    chatBtn: 'Chat',
    tenderAlertTitle: 'Get New Tender Alerts',
    tenderAlertSub: 'Get timely info & better opportunities for your products.',
    tenderAlertBtn: 'Set Alert',
    modalTitle: 'Select Language / भाषा चुनें',
  },
  bn: {
    headerTitle: 'অর্ডারসমূহ',
    headerSubtitle: 'আপনার সমস্ত পণ্য অর্ডার, পাইকারি অনুসন্ধান এবং সরকারি টেন্ডার দেখুন',
    quickSelectionTitle: 'দ্রুত নির্বাচন করুন',
    myCustomersTitle: 'আমার গ্রাহক',
    myCustomersDesc: 'ক্রেতাদের সাথে কথা বলুন এবং অর্ডার পরিচালনা করুন',
    bulkOrdersTitle: 'বাল্ক অর্ডার',
    bulkOrdersDesc: 'বড় অর্ডারের সুযোগগুলি দেখুন',
    tendersTitle: 'টেন্ডার',
    tendersDesc: 'সরকারি ও বেসরকারি টেন্ডার সুযোগ দেখুন',
    recentCustomersTitle: 'সাম্প্রতিক গ্রাহক',
    viewAll: 'সব দেখুন',
    chatBtn: 'চ্যাট করুন',
    tenderAlertTitle: 'নতুন টেন্ডার সতর্কতা পান',
    tenderAlertSub: 'সময়মতো তথ্য পান এবং আপনার পণ্যের জন্য আরও ভালো সুযোগ পান।',
    tenderAlertBtn: 'সতর্কতা সেট করুন',
    modalTitle: 'ভাষা নির্বাচন করুন / Select Language',
  },
  bho: {
    headerTitle: 'ऑर्डर',
    headerSubtitle: 'अपन सभ सामान ऑर्डर, थोक खरीदारी अउरी सरकारी टेंडर देखीं',
    quickSelectionTitle: 'जल्दी से चुनीं',
    myCustomersTitle: 'हमर ग्राहक',
    myCustomersDesc: 'अपन ग्राहकन से बात करीं अउरी ऑर्डर संभालीं',
    bulkOrdersTitle: 'बल्क ऑर्डर',
    bulkOrdersDesc: 'बड़ा ऑर्डर के मौका देखीं',
    tendersTitle: 'टेंडर',
    tendersDesc: 'सरकारी अउरी निजी टेंडर के मौका देखीं',
    recentCustomersTitle: 'हाल के ग्राहक',
    viewAll: 'सब देखीं',
    chatBtn: 'बात करीं',
    tenderAlertTitle: 'नया टेंडर खबर पाईं',
    tenderAlertSub: 'समय पर जानकारी पाईं अउरी अपन सामान खातिर बढ़िया मौका पाईं।',
    tenderAlertBtn: 'अलर्ट सेट करीं',
    modalTitle: 'भाषा चुनीं / Select Language',
  },
  mr: {
    headerTitle: 'ऑर्डर्स',
    headerSubtitle: 'तुमचे सर्व उत्पादन ऑर्डर्स, घाऊक चौकशी आणि सरकारी टेंडर पहा',
    quickSelectionTitle: 'त्वरित निवडा',
    myCustomersTitle: 'माझे ग्राहक',
    myCustomersDesc: 'तुमच्या ग्राहकांशी बोला आणि ऑर्डर्स व्यवस्थापित करा',
    bulkOrdersTitle: 'बल्क ऑर्डर्स',
    bulkOrdersDesc: 'मोठ्या ऑर्डरच्या संधी पहा',
    tendersTitle: 'टेंडर्स',
    tendersDesc: 'सरकारी आणि खाजगी टेंडरच्या संधी पहा',
    recentCustomersTitle: 'अलीकडील ग्राहक',
    viewAll: 'सर्व पहा',
    chatBtn: 'चॅट करा',
    tenderAlertTitle: 'नवीन टेंडर सूचना मिळवा',
    tenderAlertSub: 'वेळेवर माहिती मिळवा आणि तुमच्या उत्पादनांसाठी चांगल्या संधी मिळवा.',
    tenderAlertBtn: 'अलर्ट सेट करा',
    modalTitle: 'भाषा निवडा / Select Language',
  },
  gu: {
    headerTitle: 'ઓર્ડર',
    headerSubtitle: 'તમારા તમામ ઉત્પાદન ઓર્ડર, જથ્થાબંધ પૂછપરછ અને સરકારી ટેન્ડર જુઓ',
    quickSelectionTitle: 'ઝડપી પસંદગી',
    myCustomersTitle: 'મારા ગ્રાહકો',
    myCustomersDesc: 'તમારા ગ્રાહકો સાથે વાત કરો અને ઓર્ડર સંભાળો',
    bulkOrdersTitle: 'બલ્ક ઓર્ડર',
    bulkOrdersDesc: 'મોટા ઓર્ડરની તકો જુઓ',
    tendersTitle: 'ટેન્ડર',
    tendersDesc: 'સરકારી અને ખાનગી ટેન્ડરના વિકલ્પો જુઓ',
    recentCustomersTitle: 'તાજેતરના ગ્રાહકો',
    viewAll: 'બધા જુઓ',
    chatBtn: 'ચેટ કરો',
    tenderAlertTitle: 'નવી ટેન્ડર એલર્ટ મેળવો',
    tenderAlertSub: 'સમયસર માહિતી મેળવો અને તમારા ઉત્પાદનો માટે વધુ સારી તકો મેળવો.',
    tenderAlertBtn: 'એલર્ટ સેટ કરો',
    modalTitle: 'ભાષા પસંદ કરો / Select Language',
  },
  raj: {
    headerTitle: 'ऑर्डर',
    headerSubtitle: 'अापका सगळा सामान ऑर्डर, थोक खरीदारी अर सरकारी टेंडर देखो',
    quickSelectionTitle: 'बैगा चूणो',
    myCustomersTitle: 'म्हारा ग्राहक',
    myCustomersDesc: 'अापका ग्राहकां सूं बात करो अर ऑर्डर संभालो',
    bulkOrdersTitle: 'बल्क ऑर्डर',
    bulkOrdersDesc: 'बड़ा ऑर्डर रा मौका देखो',
    tendersTitle: 'टेंडर',
    tendersDesc: 'सरकारी अर निजी टेंडर रा मौका देखो',
    recentCustomersTitle: 'हाल रा ग्राहक',
    viewAll: 'सगळा देखो',
    chatBtn: 'बात करो',
    tenderAlertTitle: 'नया टेंडर अलर्ट पाओ',
    tenderAlertSub: 'टेम पर जाणकारी पाओ अर अापका सामानां खातर चोखा मौका पाओ।',
    tenderAlertBtn: 'अलर्ट सेट करो',
    modalTitle: 'भाषा चूणो / Select Language',
  },
  kn: {
    headerTitle: 'ಆದೇಶಗಳು',
    headerSubtitle: 'ನಿಮ್ಮ ಎಲ್ಲಾ ಉತ್ಪನ್ನ ಆದೇಶಗಳು, ಸಗಟು ವಿಚಾರಣೆಗಳು ಮತ್ತು ಸರ್ಕಾರಿ ಟೆಂಡರ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    quickSelectionTitle: 'ತ್ವರಿತ ಆಯ್ಕೆ',
    myCustomersTitle: 'ನನ್ನ ಗ್ರಾಹಕರು',
    myCustomersDesc: 'ನಿಮ್ಮ ಗ್ರಾಹಕರೊಂದಿಗೆ ಮಾತನಾಡಿ ಮತ್ತು ಆದೇಶಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    bulkOrdersTitle: 'ಬಲ್ಕ್ ಆದೇಶಗಳು',
    bulkOrdersDesc: 'ದೊಡ್ಡ ಆದೇಶದ ಅವಕಾಶಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    tendersTitle: 'ಟೆಂಡರ್‌ಗಳು',
    tendersDesc: 'ಸರ್ಕಾರಿ ಮತ್ತು ಖಾಸಗಿ ಟೆಂಡರ್ ಅವಕಾಶಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    recentCustomersTitle: 'ಇತ್ತೀಚಿನ ಗ್ರಾಹಕರು',
    viewAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
    chatBtn: 'ಚಾಟ್ ಮಾಡಿ',
    tenderAlertTitle: 'ಹೊಸ ಟೆಂಡರ್ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಿರಿ',
    tenderAlertSub: 'ಸಮಯೋಚಿತ ಮಾಹಿತಿ ಪಡೆಯಿರಿ ಮತ್ತು ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳಿಗೆ ಉತ್ತಮ ಅವಕಾಶಗಳನ್ನು ಪಡೆಯಿರಿ.',
    tenderAlertBtn: 'ಎಚ್ಚರಿಕೆ ಹೊಂದಿಸಿ',
    modalTitle: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / Select Language',
  },
};

export default function CustomersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const [globalLang] = useGlobalLang();
  const initialLang: LangCode = (params.lang as LangCode) || globalLang || 'hi';

  const [selectedLang, setSelectedLang] = useState<LangCode>(initialLang);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);

  React.useEffect(() => {
    if (globalLang) {
      setSelectedLang(globalLang);
    }
  }, [globalLang]);

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.hi;
  const currentLangObj = ALL_LANGUAGES.find((l) => l.code === selectedLang) || ALL_LANGUAGES[1];
  const currentLangLabel = `${currentLangObj.nativeName} (${currentLangObj.englishName})`;

  const handleChatPress = (customerName: string) => {
    router.push({ pathname: '/product-chats', params: { lang: selectedLang } });
  };

  const handleQuickCardPress = (cardTitle: string) => {
    alert(`${cardTitle}...`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Header Row: Title, Subtitle, Language Pill, Notification Bell */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextGroup}>
              <Text style={styles.headerTitle}>{t.headerTitle}</Text>
              <Text style={styles.headerSubtitle}>{t.headerSubtitle}</Text>
              <TouchableOpacity
                style={styles.langSelector}
                onPress={() => setIsLangModalVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.langText}>{currentLangLabel}</Text>
                <Ionicons name="chevron-down" size={14} color="#2C2C2C" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => router.push({ pathname: '/notifications', params: { lang: selectedLang } })}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={26} color="#1A1A1A" />
              <View style={styles.redBadgeDot} />
            </TouchableOpacity>
          </View>

          {/* "Quick Selection" Cards */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{t.quickSelectionTitle}</Text>

            <View style={styles.quickCardsVerticalGroup}>
              {/* Card 1: My Customers */}
              <TouchableOpacity
                style={[styles.quickCard, styles.quickCardGreen]}
                onPress={() => router.push({ pathname: '/my-customers', params: { lang: selectedLang } })}
                activeOpacity={0.85}
              >
                <View style={[styles.quickIconCircle, { backgroundColor: '#EAF2E8' }]}>
                  <Ionicons name="people" size={22} color="#3B6029" />
                </View>
                <View style={styles.quickCardTextGroup}>
                  <Text style={styles.quickCardTitle}>{t.myCustomersTitle}</Text>
                  <Text style={styles.quickCardDesc}>{t.myCustomersDesc}</Text>
                </View>
                <View style={[styles.quickArrowCircle, { backgroundColor: '#EAF2E8' }]}>
                  <Ionicons name="arrow-forward" size={14} color="#3B6029" />
                </View>
              </TouchableOpacity>

              {/* Card 2: Bulk Orders */}
              <TouchableOpacity
                style={[styles.quickCard, styles.quickCardBlue]}
                onPress={() => router.push({ pathname: '/bulk-orders', params: { lang: selectedLang } })}
                activeOpacity={0.85}
              >
                <View style={[styles.quickIconCircle, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="cube" size={22} color="#1976D2" />
                </View>
                <View style={styles.quickCardTextGroup}>
                  <Text style={styles.quickCardTitle}>{t.bulkOrdersTitle}</Text>
                  <Text style={styles.quickCardDesc}>{t.bulkOrdersDesc}</Text>
                </View>
                <View style={[styles.quickArrowCircle, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="arrow-forward" size={14} color="#1976D2" />
                </View>
              </TouchableOpacity>

              {/* Card 3: Tenders */}
              <TouchableOpacity
                style={[styles.quickCard, styles.quickCardOrange]}
                onPress={() => handleQuickCardPress(t.tendersTitle)}
                activeOpacity={0.85}
              >
                <View style={[styles.quickIconCircle, { backgroundColor: '#FFF0E6' }]}>
                  <Ionicons name="document-text" size={22} color="#E65100" />
                </View>
                <View style={styles.quickCardTextGroup}>
                  <Text style={styles.quickCardTitle}>{t.tendersTitle}</Text>
                  <Text style={styles.quickCardDesc}>{t.tendersDesc}</Text>
                </View>
                <View style={[styles.quickArrowCircle, { backgroundColor: '#FFF0E6' }]}>
                  <Ionicons name="arrow-forward" size={14} color="#E65100" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Customers Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.recentHeaderRow}>
              <Text style={styles.sectionTitle}>{t.recentCustomersTitle}</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.viewAllText}>{t.viewAll}</Text>
              </TouchableOpacity>
            </View>

            {/* List of Recent Customer Cards */}
            <View style={styles.recentListGroup}>
              {RECENT_CUSTOMERS_DATA.map((customer) => {
                const displayName = customer.names[selectedLang] || customer.names.hi || customer.names.en;
                const displayLoc = customer.locations[selectedLang] || customer.locations.hi || customer.locations.en;
                const displayInq = customer.inquiries[selectedLang] || customer.inquiries.hi || customer.inquiries.en;

                return (
                  <TouchableOpacity
                    key={customer.id}
                    style={styles.recentCustomerCard}
                    onPress={() => handleChatPress(displayName)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.customerAvatarCircle}>
                      <Ionicons name="person-outline" size={22} color="#3B6029" />
                    </View>

                    <View style={styles.customerInfoGroup}>
                      <Text style={styles.customerName}>{displayName}</Text>
                      <Text style={styles.customerLoc}>{displayLoc}</Text>

                      <View style={styles.inquiryBadgePill}>
                        <Text style={styles.inquiryBadgeText}>{displayInq}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.chatButton}
                      onPress={() => handleChatPress(displayName)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="chatbubble" size={14} color="#3B6029" style={{ marginRight: 4 }} />
                      <Text style={styles.chatButtonText}>{t.chatBtn}</Text>
                    </TouchableOpacity>

                    <Ionicons name="chevron-forward" size={18} color="#999999" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Tender Alert Banner */}
          <View style={styles.tenderAlertBanner}>
            <Image
              source={require('@/assets/images/tender_illustration.png')}
              style={styles.tenderIllustration}
              resizeMode="contain"
            />

            <View style={styles.tenderTextGroup}>
              <Text style={styles.tenderTitle}>{t.tenderAlertTitle}</Text>
              <Text style={styles.tenderSubtitle}>{t.tenderAlertSub}</Text>
            </View>

            <TouchableOpacity
              style={styles.tenderAlertButton}
              onPress={() => alert(t.tenderAlertBtn)}
              activeOpacity={0.85}
            >
              <Ionicons name="notifications" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.tenderAlertButtonText}>{t.tenderAlertBtn}</Text>
            </TouchableOpacity>
          </View>

          {/* Scenic Village Sketch Overlay */}
          <View style={styles.sketchWrapper}>
            <Image
              source={require('@/assets/images/village_sketch.png')}
              style={styles.sketchImage}
              resizeMode="contain"
            />
          </View>
        </ScrollView>

        {/* Bottom Navigation Bar (4 Tabs) */}
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
    backgroundColor: '#FAF8F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  /* Header Row */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 8,
    paddingBottom: 16,
  },
  headerTextGroup: {
    flex: 1,
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEA',
    elevation: 1,
  },
  redBadgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  /* Section Containers */
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  /* Quick Cards Vertical Stack */
  quickCardsVerticalGroup: {
    gap: 12,
  },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  quickCardGreen: {
    backgroundColor: '#F8FCF7',
    borderColor: '#E3F0E0',
  },
  quickCardBlue: {
    backgroundColor: '#F5F9FF',
    borderColor: '#E1EDFF',
  },
  quickCardOrange: {
    backgroundColor: '#FFFBF5',
    borderColor: '#FFE8D6',
  },
  quickIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  quickCardTextGroup: {
    flex: 1,
    paddingRight: 8,
  },
  quickCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  quickCardDesc: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  quickArrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Recent Customers Section */
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  recentListGroup: {
    gap: 10,
  },
  recentCustomerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EFEA',
    elevation: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  customerAvatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  customerInfoGroup: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  customerLoc: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  inquiryBadgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F7ED',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  inquiryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B6029',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  chatButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B6029',
  },
  /* Tender Alert Banner */
  tenderAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F8F3',
    borderWidth: 1,
    borderColor: '#E2EFE0',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  tenderIllustration: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 10,
  },
  tenderTextGroup: {
    flex: 1,
    paddingRight: 6,
  },
  tenderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  tenderSubtitle: {
    fontSize: 11,
    color: '#555555',
    lineHeight: 15,
  },
  tenderAlertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tenderAlertButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  /* Bottom Village Sketch Overlay */
  sketchWrapper: {
    width: '100%',
    height: 100,
    marginTop: 4,
    overflow: 'hidden',
  },
  sketchImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  /* Bottom Navigation Bar */
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 64,
    marginHorizontal: 16,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#F0EFEA',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  navTabText: {
    fontSize: 11,
    color: '#666666',
    marginTop: 3,
    fontWeight: '500',
  },
  navTabTextActive: {
    color: '#3B6029',
    fontWeight: 'bold',
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 6,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
  },
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
