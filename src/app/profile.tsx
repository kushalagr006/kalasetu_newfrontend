import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  Modal,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArtisanFloatingNav } from '@/components/ArtisanFloatingNav';
import { useGlobalLang, setGlobalLang, ALL_LANGUAGES, LangCode } from '@/utils/languageStore';
import { getAuthUser, fetchFreshUserProfile, clearAuthSession } from '@/utils/authStore';

type ActiveTab = 'home' | 'products' | 'customers' | 'profile';

const TRANSLATIONS: Record<LangCode, {
  headerTitle: string;
  shgName: string;
  location: string;
  members: string;
  joined: string;
  editBtn: string;
  contactHeader: string;
  phoneLabel: string;
  emailLabel: string;
  addressLabel: string;
  addressVal: string;
  shgHeader: string;
  craftLabel: string;
  craftVal: string;
  memberCountLabel: string;
  aboutLabel: string;
  aboutVal: string;
  logoutBtn: string;
  logoutTitle: string;
  logoutMsg: string;
  cancel: string;
  navHome: string;
  navProducts: string;
  navCustomers: string;
  navProfile: string;
  modalTitle: string;
  identityHeader: string;
  aadhaarLabel: string;
  panLabel: string;
  gstLabel: string;
  statusLabel: string;
  verifiedText: string;
  pendingText: string;
}> = {
  hi: {
    headerTitle: 'प्रोफ़ाइल',
    shgName: 'सुनीता देवी (कारीगर)',
    location: 'रामपुर, धमतरी',
    members: 'कारीगर सदस्य',
    joined: 'जुड़ी: मई 2025',
    editBtn: 'संपादित करें',
    contactHeader: 'संपर्क जानकारी',
    phoneLabel: 'मोबाइल नंबर',
    emailLabel: 'ईमेल (यदि है)',
    addressLabel: 'पूरा पता',
    addressVal: 'रामपुर गांव, धमतरी,\nछत्तीसगढ़ - 493773',
    shgHeader: 'प्रोफ़ाइल विवरण',
    craftLabel: 'हस्तशिल्प प्रकार',
    craftVal: 'हैंडिक्राफ्ट आइटम',
    memberCountLabel: 'अनुभव / श्रेणी',
    aboutLabel: 'हमारे बारे में',
    aboutVal: 'हम सुंदर और गुणवत्तापूर्ण हस्तनिर्मित उत्पाद बनाते हैं।',
    logoutBtn: 'लॉग आउट (Log Out)',
    logoutTitle: 'लॉग आउट करें?',
    logoutMsg: 'क्या आप सचमुच ऐप से लॉग आउट करना चाहते हैं?',
    cancel: 'रद्द करें',
    navHome: 'होम',
    navProducts: 'उत्पाद',
    navCustomers: 'ग्राहक',
    navProfile: 'प्रोफ़ाइल',
    modalTitle: 'भाषा चुनें / Select Language',
    identityHeader: 'पहचान एवं दस्तावेज (KYC Details)',
    aadhaarLabel: 'आधार कार्ड (Aadhaar)',
    panLabel: 'पैन कार्ड (PAN Card)',
    gstLabel: 'जीएसटी (GSTIN)',
    statusLabel: 'प्रोफ़ाइल स्थिति',
    verifiedText: 'सत्यापित (VERIFIED ✓)',
    pendingText: 'सत्यापन लंबित (PENDING ⏳)',
  },
  en: {
    headerTitle: 'Profile',
    shgName: 'Sunita Devi (Artisan)',
    location: 'Rampur, Dhamtari',
    members: 'Artisan Member',
    joined: 'Joined May 2025',
    editBtn: 'Edit Profile',
    contactHeader: 'Contact Information',
    phoneLabel: 'Mobile Number',
    emailLabel: 'Email (Optional)',
    addressLabel: 'Full Address',
    addressVal: 'Rampur Village, Dhamtari,\nChhattisgarh - 493773',
    shgHeader: 'Profile Details',
    craftLabel: 'Craft Type',
    craftVal: 'Handicraft Items',
    memberCountLabel: 'Experience / Category',
    aboutLabel: 'About Us',
    aboutVal: 'We craft beautiful, high-quality handmade products.',
    logoutBtn: 'Log Out',
    logoutTitle: 'Log Out?',
    logoutMsg: 'Are you sure you want to log out?',
    cancel: 'Cancel',
    navHome: 'Home',
    navProducts: 'Products',
    navCustomers: 'Customers',
    navProfile: 'Profile',
    modalTitle: 'Select Language / भाषा चुनें',
    identityHeader: 'KYC & Identity Documents',
    aadhaarLabel: 'Aadhaar Card',
    panLabel: 'PAN Card',
    gstLabel: 'GSTIN',
    statusLabel: 'Verification Status',
    verifiedText: 'VERIFIED ✓',
    pendingText: 'PENDING ⏳',
  },
  bn: {
    headerTitle: 'প্রোফাইল',
    shgName: 'সুনীতা দেবী (কারুশিল্পী)',
    location: 'রামপুর, ধামতরি',
    members: 'কারুশিল্পী সদস্য',
    joined: 'যুক্ত হয়েছেন: মে ২০২৫',
    editBtn: 'সম্পাদনা করুন',
    contactHeader: 'যোগাযোগের তথ্য',
    phoneLabel: 'মোবাইল নম্বর',
    emailLabel: 'ইমেইল (ঐচ্ছিক)',
    addressLabel: 'সম্পূর্ণ ঠিকানা',
    addressVal: 'রামপুর গ্রাম, ধামতরি,\nছত্রিশগড় - ৪৯৩৭৭৩',
    shgHeader: 'প্রোফাইল বিবরণ',
    craftLabel: 'হস্তশিল্পের ধরন',
    craftVal: 'হস্তশিল্প সামগ্রী',
    memberCountLabel: 'অভিজ্ঞতা / বিভাগ',
    aboutLabel: 'আমাদের সম্পর্কে',
    aboutVal: 'আমরা সুন্দর এবং উচ্চমানের হাতে তৈরি পণ্য তৈরি করি।',
    logoutBtn: 'লগ আউট (Log Out)',
    logoutTitle: 'লগ আউট করবেন?',
    logoutMsg: 'আপনি কি নিশ্চিত যে অ্যাপ থেকে লগ আউট করতে চান?',
    cancel: 'বাতিল',
    navHome: 'হোম',
    navProducts: 'পণ্য',
    navCustomers: 'গ্রাহক',
    navProfile: 'প্রোফাইল',
    modalTitle: 'ভাষা নির্বাচন করুন / Select Language',
    identityHeader: 'পরিচয় ও কেওয়াইসি (KYC Details)',
    aadhaarLabel: 'আধার কার্ড',
    panLabel: 'প্যান কার্ড',
    gstLabel: 'জিএসটি',
    statusLabel: 'স্ট্যাটাস',
    verifiedText: 'যাচাইকৃত (VERIFIED ✓)',
    pendingText: 'অপেক্ষমাণ (PENDING ⏳)',
  },
  bho: {
    headerTitle: 'प्रोफाइल',
    shgName: 'सुनीता देवी (कारीगर)',
    location: 'रामपुर, धमतरी',
    members: 'कारीगर सदस्य',
    joined: 'जुड़ल: मई 2025',
    editBtn: 'बदलीं',
    contactHeader: 'संपर्क जानकारी',
    phoneLabel: 'मोबाइल नंबर',
    emailLabel: 'ईमेल (यदि बा)',
    addressLabel: 'पूरा पता',
    addressVal: 'रामपुर गांव, धमतरी,\nछत्तीसगढ़ - 493773',
    shgHeader: 'प्रोफाइल विवरण',
    craftLabel: 'हस्तशिल्प प्रकार',
    craftVal: 'हैंडिक्राफ्ट सामान',
    memberCountLabel: 'अनुभव',
    aboutLabel: 'हमरा बारे में',
    aboutVal: 'हमनी सुंदर अउरी बढ़िया क्वालिटी के हाथ के बनल सामान बनाइले।',
    logoutBtn: 'लॉग आउट (Log Out)',
    logoutTitle: 'लॉग आउट करीं?',
    logoutMsg: 'का रउआ सचमुच ऐप से लॉग आउट करे के चाहत बानी?',
    cancel: 'रद्द करीं',
    navHome: 'होम',
    navProducts: 'सामान',
    navCustomers: 'ग्राहक',
    navProfile: 'प्रोफाइल',
    modalTitle: 'भाषा चुनीं / Select Language',
    identityHeader: 'पहचान आ दस्तावेज (KYC)',
    aadhaarLabel: 'आधार कार्ड',
    panLabel: 'पैन कार्ड',
    gstLabel: 'जीएसटी',
    statusLabel: 'स्थिति',
    verifiedText: 'सत्यापित (VERIFIED ✓)',
    pendingText: 'लंबित (PENDING ⏳)',
  },
  mr: {
    headerTitle: 'प्रोफाइल',
    shgName: 'सुनिता देवी (कारागीर)',
    location: 'रामपूर, धमतरी',
    members: 'कारागीर सदस्य',
    joined: 'सामील: मे २०२५',
    editBtn: 'संपादित करा',
    contactHeader: 'संपर्क माहिती',
    phoneLabel: 'मोबाईल नंबर',
    emailLabel: 'ईमेल (ऐच्छिक)',
    addressLabel: 'पूर्ण पत्ता',
    addressVal: 'रामपूर गाव, धमतरी,\nछत्तीसगड - ४९३७त्७३',
    shgHeader: 'प्रोफाइल तपशील',
    craftLabel: 'हस्तकला प्रकार',
    craftVal: 'हस्तकला वस्तू',
    memberCountLabel: 'अनुभव',
    aboutLabel: 'आमच्याबद्दल',
    aboutVal: 'आम्ही सुंदर आणि उच्च दर्जाच्या हस्तनिर्मित वस्तू बनवतो.',
    logoutBtn: 'लॉग आउट (Log Out)',
    logoutTitle: 'लॉग आउट करायचे?',
    logoutMsg: 'तुम्हाला खरोखर ॲपवरून लॉग आउट करायचे आहे का?',
    cancel: 'रद्द करा',
    navHome: 'होम',
    navProducts: 'उत्पादने',
    navCustomers: 'ग्राहक',
    navProfile: 'प्रोफाइल',
    modalTitle: 'भाषा निवडा / Select Language',
    identityHeader: 'ओळख आणि कागदपत्रे (KYC)',
    aadhaarLabel: 'आधार कार्ड',
    panLabel: 'पॅन कार्ड',
    gstLabel: 'जीएसटी',
    statusLabel: 'स्थिती',
    verifiedText: 'सत्यापित (VERIFIED ✓)',
    pendingText: 'लंबित (PENDING ⏳)',
  },
  gu: {
    headerTitle: 'પ્રોફાઇલ',
    shgName: 'સુનિતા દેવી (કારીગર)',
    location: 'રામપુર, ધમતરી',
    members: 'કારીગર સભ્ય',
    joined: 'જોડાયા: મે 2025',
    editBtn: 'સંપાદિત કરો',
    contactHeader: 'સંપર્ક માહિતી',
    phoneLabel: 'મોબાઇલ નંબર',
    emailLabel: 'ઇમેઇલ (વૈકલ્પિક)',
    addressLabel: 'પૂરું સરનામું',
    addressVal: 'રામપુર ગામ, ધમતરી,\nછત્તીસગઢ - 493773',
    shgHeader: 'પ્રોફાઇલ વિગતો',
    craftLabel: 'હસ્તકળા પ્રકાર',
    craftVal: 'હસ્તકળા વસ્તુઓ',
    memberCountLabel: 'અનુભવ',
    aboutLabel: 'અમારા વિશે',
    aboutVal: 'અમે સુંદર અને ઉચ્ચ ગુણવત્તાવાળા હસ્તનિર્મિત ઉત્પાદનો બનાવીએ છીએ.',
    logoutBtn: 'લોગ આઉટ (Log Out)',
    logoutTitle: 'લોગ આઉટ કરવું છે?',
    logoutMsg: 'શું તમે ખરેખર એપમાંથી લોગ આઉટ કરવા માંગો છો?',
    cancel: 'રદ કરો',
    navHome: 'હોમ',
    navProducts: 'ઉત્પાદનો',
    navCustomers: 'ગ્રાહકો',
    navProfile: 'પ્રોફાઇલ',
    modalTitle: 'ભાષા પસંદ કરો / Select Language',
    identityHeader: 'ઓળખ અને કેવાયસી (KYC)',
    aadhaarLabel: 'આધાર કાર્ડ',
    panLabel: 'પાન કાર્ડ',
    gstLabel: 'જીએસટી',
    statusLabel: 'સ્થિતિ',
    verifiedText: 'ચકાસાયેલ (VERIFIED ✓)',
    pendingText: 'પેન્ડિંગ (PENDING ⏳)',
  },
  raj: {
    headerTitle: 'प्रोफाइल',
    shgName: 'सुनीता देवी (कारीगर)',
    location: 'रामपुर, धमतरी',
    members: 'कारीगर सदस्य',
    joined: 'जुड़्या: मई 2025',
    editBtn: 'बदलो',
    contactHeader: 'संपर्क जाणकारी',
    phoneLabel: 'मोबाइल नंबर',
    emailLabel: 'ईमेल (यदि है)',
    addressLabel: 'पूरो पत्तो',
    addressVal: 'रामपुर गांव, धमतरी,\nछत्तीसगढ़ - 493773',
    shgHeader: 'प्रोफाइल विवरण',
    craftLabel: 'हस्तशिल्प प्रकार',
    craftVal: 'हैंडिक्राफ्ट सामान',
    memberCountLabel: 'अनुभव',
    aboutLabel: 'म्हांरा बारे मांय',
    aboutVal: 'म्हे चोखा अर बढ़िया क्वालिटी रा हाथ सूं बन्योड़ा सामानां बनावां।',
    logoutBtn: 'लॉग आउट (Log Out)',
    logoutTitle: 'लॉग आउट करोला?',
    logoutMsg: 'कां आप सचमुच ऐप सूं लॉग आउट करबो चाहो?',
    cancel: 'रद्द करो',
    navHome: 'होम',
    navProducts: 'सामान',
    navCustomers: 'ग्राहक',
    navProfile: 'प्रोफाइल',
    modalTitle: 'भाषा चूणो / Select Language',
    identityHeader: 'पहचान अर कागजात (KYC)',
    aadhaarLabel: 'आधार कार्ड',
    panLabel: 'पैन कार्ड',
    gstLabel: 'जीएसटी',
    statusLabel: 'स्थिती',
    verifiedText: 'सत्यापित (VERIFIED ✓)',
    pendingText: 'बाकी (PENDING ⏳)',
  },
  kn: {
    headerTitle: 'ಪ್ರೊಫೈಲ್',
    shgName: 'ಸುನೀತಾ ದೇವಿ (ಕುಶಲಕರ್ಮಿ)',
    location: 'ರಾಮಪುರ, ಧಮ್ತರಿ',
    members: 'ಕುಶಲಕರ್ಮಿ ಸದಸ್ಯೆ',
    joined: 'ಸೇರ್ಪಡೆ: ಮೇ 2025',
    editBtn: 'ಸಂಪಾದಿಸಿ',
    contactHeader: 'ಸಂಪರ್ಕ ಮಾಹಿತಿ',
    phoneLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    emailLabel: 'ಇಮೇಲ್ (ಐಚ್ಛಿಕ)',
    addressLabel: 'ಪೂರ್ಣ ವಿಳಾಸ',
    addressVal: 'ರಾಮಪುರ ಗ್ರಾಮ, ಧಮ್ತರಿ,\nಛತ್ತೀಸ್‌ಗಢ - 493773',
    shgHeader: 'ಪ್ರೊಫೈಲ್ ವಿವರಗಳು',
    craftLabel: 'ಕರಕುಶಲ ಪ್ರಕಾರ',
    craftVal: 'ಕರಕುಶಲ ವಸ್ತುಗಳು',
    memberCountLabel: 'ಅನುಭವ',
    aboutLabel: 'ನಮ್ಮ ಬಗ್ಗೆ',
    aboutVal: 'ನಾವು ಸುಂದರವಾದ ಮತ್ತು ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಹಸ್ತಾಲಂಕಾರದ ಉತ್ಪನ್ನಗಳನ್ನು ತಯಾರಿಸುತ್ತೇವೆ.',
    logoutBtn: 'ಲಾಗ್ ಔಟ್ (Log Out)',
    logoutTitle: 'ಲಾಗ್ ಔಟ್ ಮಾಡಬೇಕೇ?',
    logoutMsg: 'ನೀವು ನಿಜವಾಗಿಯೂ ಅಪ್ಲಿಕೇಶನ್‌ನಿಂದ ಲಾಗ್ ಔಟ್ ಮಾಡಲು ಬಯಸುತ್ತೀರಾ?',
    cancel: 'ರದ್ದುಗೊಳಿಸಿ',
    navHome: 'ಹೋಮ್',
    navProducts: 'ಉತ್ಪನ್ನಗಳು',
    navCustomers: 'ಗ್ರಾಹಕರು',
    navProfile: 'ಪ್ರೊಫೈಲ್',
    modalTitle: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / Select Language',
    identityHeader: 'ಗುರುತು ಮತ್ತು ಕೆವೈಸಿ (KYC)',
    aadhaarLabel: 'ಆಧಾರ್ ಕಾರ್ಡ್',
    panLabel: 'ಪ್ಯಾನ್ ಕಾರ್ಡ್',
    gstLabel: 'ಜಿಎಸ್‌ಟಿ',
    statusLabel: 'ಸ್ಥಿತಿ',
    verifiedText: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ (VERIFIED ✓)',
    pendingText: 'ಬಕಿ ಇದೆ (PENDING ⏳)',
  },
};

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const [globalLang] = useGlobalLang();
  const initialLang: LangCode = (params.lang as LangCode) || globalLang || 'hi';

  const [selectedLang, setSelectedLang] = useState<LangCode>(initialLang);
  const [userSession, setUserSession] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadUserData = async () => {
    const cached = await getAuthUser();
    if (cached) setUserSession(cached);
    const fresh = await fetchFreshUserProfile();
    if (fresh) setUserSession(fresh);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  React.useEffect(() => {
    if (globalLang) {
      setSelectedLang(globalLang);
    }
  }, [globalLang]);

  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.hi;
  const currentLangObj = ALL_LANGUAGES.find((l) => l.code === selectedLang) || ALL_LANGUAGES[1];
  const currentLangLabel = `${currentLangObj.nativeName} (${currentLangObj.englishName})`;

  const artisanProf = userSession?.artisan_profile || {};
  const displayName = userSession?.full_name || t.shgName;
  const displayPhone = userSession?.phone_number ? `+91 ${userSession.phone_number}` : '+91 98765 43210';
  
  const locationParts = [artisanProf.city, artisanProf.district, artisanProf.state].filter(Boolean);
  const displayLocation = locationParts.length > 0 ? locationParts.join(', ') : t.location;
  const displayAddress = locationParts.length > 0 ? locationParts.join(',\n') : t.addressVal;
  
  const displayCraft = artisanProf.craft_type || artisanProf.craft_category || t.craftVal;
  const displayCategory = artisanProf.craft_category ? artisanProf.craft_category.toUpperCase() : 'ARTISAN';
  const displayAadhaar = artisanProf.aadhaar_number ? `XXXX-XXXX-${artisanProf.aadhaar_number.slice(-4)}` : null;
  const displayPan = artisanProf.pan_number || null;
  const displayGst = artisanProf.gstin || null;
  const isVerified = userSession?.is_verified || artisanProf.verification_status === 'VERIFIED';

  const handleLogoutPerform = async () => {
    await clearAuthSession();
    router.replace('/app-login' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>{t.headerTitle}</Text>
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

        {/* Scrollable Body Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B6029']} />
          }
        >
          {/* Top Profile Hero Card */}
          <View style={styles.profileHeroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.womenAvatarGroupCircle}>
                <Ionicons name="person" size={36} color="#3B6029" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.shgTitleText}>{displayName}</Text>

                <View style={styles.infoMetaRow}>
                  <Ionicons name="location-outline" size={14} color="#3B6029" />
                  <Text style={styles.infoMetaText}>{displayLocation}</Text>
                </View>

                <View style={styles.infoMetaRow}>
                  <Ionicons name="briefcase-outline" size={14} color="#3B6029" />
                  <Text style={styles.infoMetaText}>{displayCraft}</Text>
                </View>

                <View style={styles.infoMetaRow}>
                  <Ionicons
                    name={isVerified ? 'checkmark-circle' : 'time-outline'}
                    size={14}
                    color={isVerified ? '#2E7D32' : '#E65100'}
                  />
                  <Text style={[styles.infoMetaText, { color: isVerified ? '#2E7D32' : '#E65100', fontWeight: 'bold' }]}>
                    {isVerified ? t.verifiedText : t.pendingText}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* संपर्क जानकारी Section */}
          <Text style={styles.sectionHeaderTitle}>{t.contactHeader}</Text>
          <View style={styles.infoCardBox}>
            <View style={styles.infoRowItem}>
              <Ionicons name="call-outline" size={20} color="#3B6029" style={styles.rowIcon} />
              <Text style={styles.rowLabelText}>{t.phoneLabel}</Text>
              <Text style={styles.rowValueText}>{displayPhone}</Text>
            </View>

            <View style={styles.rowDividerLine} />

            <View style={styles.infoRowItem}>
              <Ionicons name="mail-outline" size={20} color="#3B6029" style={styles.rowIcon} />
              <Text style={styles.rowLabelText}>{t.emailLabel}</Text>
              <Text style={styles.rowValueText}>{userSession?.email || 'N/A'}</Text>
            </View>

            <View style={styles.rowDividerLine} />

            <View style={styles.infoRowItem}>
              <Ionicons name="location-outline" size={20} color="#3B6029" style={styles.rowIcon} />
              <Text style={styles.rowLabelText}>{t.addressLabel}</Text>
              <Text style={styles.rowValueAddressText}>{displayAddress}</Text>
            </View>
          </View>

          {/* पहचान एवं दस्तावेज (KYC Details) Section */}
          <Text style={styles.sectionHeaderTitle}>{t.identityHeader}</Text>
          <View style={styles.infoCardBox}>
            <View style={styles.infoRowItem}>
              <Ionicons name="card-outline" size={20} color="#3B6029" style={styles.rowIcon} />
              <Text style={styles.rowLabelText}>{t.aadhaarLabel}</Text>
              <Text style={styles.rowValueText}>{displayAadhaar || 'Not Provided'}</Text>
            </View>

            <View style={styles.rowDividerLine} />

            <View style={styles.infoRowItem}>
              <Ionicons name="document-text-outline" size={20} color="#3B6029" style={styles.rowIcon} />
              <Text style={styles.rowLabelText}>{t.panLabel}</Text>
              <Text style={styles.rowValueText}>{displayPan || 'Not Provided'}</Text>
            </View>

            {displayGst ? (
              <>
                <View style={styles.rowDividerLine} />
                <View style={styles.infoRowItem}>
                  <Ionicons name="business-outline" size={20} color="#3B6029" style={styles.rowIcon} />
                  <Text style={styles.rowLabelText}>{t.gstLabel}</Text>
                  <Text style={styles.rowValueText}>{displayGst}</Text>
                </View>
              </>
            ) : null}

            <View style={styles.rowDividerLine} />

            <View style={styles.infoRowItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#3B6029" style={styles.rowIcon} />
              <Text style={styles.rowLabelText}>{t.statusLabel}</Text>
              <Text style={[styles.rowValueText, { color: isVerified ? '#2E7D32' : '#E65100' }]}>
                {isVerified ? t.verifiedText : t.pendingText}
              </Text>
            </View>
          </View>

          {/* प्रोफ़ाइल विवरण Section */}
          <Text style={styles.sectionHeaderTitle}>{t.shgHeader}</Text>
          <View style={styles.infoCardBox}>
            <View style={styles.infoRowItem}>
              <Ionicons name="basket-outline" size={20} color="#3B6029" style={styles.rowIcon} />
              <Text style={styles.rowLabelText}>{t.craftLabel}</Text>
              <Text style={styles.rowValueText}>{displayCraft}</Text>
            </View>

            <View style={styles.rowDividerLine} />

            <View style={styles.infoRowItem}>
              <Ionicons name="pricetag-outline" size={20} color="#3B6029" style={styles.rowIcon} />
              <Text style={styles.rowLabelText}>{t.memberCountLabel}</Text>
              <Text style={styles.rowValueText}>{displayCategory}</Text>
            </View>

            <View style={styles.rowDividerLine} />

            <View style={styles.infoRowItem}>
              <Ionicons name="information-circle-outline" size={20} color="#3B6029" style={styles.rowIcon} />
              <Text style={styles.rowLabelText}>{t.aboutLabel}</Text>
              <Text style={styles.rowValueBodyText}>{t.aboutVal}</Text>
            </View>
          </View>

          {/* Log Out Button */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {
              if (Platform.OS === 'web') {
                if (window.confirm(t.logoutMsg)) {
                  handleLogoutPerform();
                }
              } else {
                Alert.alert(
                  t.logoutTitle,
                  t.logoutMsg,
                  [
                    { text: t.cancel, style: 'cancel' },
                    { text: t.logoutBtn, style: 'destructive', onPress: handleLogoutPerform },
                  ]
                );
              }
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="log-out-outline" size={20} color="#D32F2F" style={{ marginRight: 8 }} />
            <Text style={styles.logoutBtnText}>{t.logoutBtn}</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Floating Bottom Navigation Bar (4 Tabs) */}
        <ArtisanFloatingNav activeTab="profile" selectedLang={selectedLang} />

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

  /* Top Header Row */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 8,
    paddingBottom: 16,
  },
  headerLeft: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
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
    marginTop: 2,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
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

  /* Scrollable Body */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 14,
  },

  /* Profile Hero Card */
  profileHeroCard: {
    backgroundColor: '#F0F7ED',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E0D8',
    gap: 12,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  womenAvatarGroupCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shgTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  infoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  infoMetaText: {
    fontSize: 12,
    color: '#3B6029',
  },

  /* Section Title */
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3B6029',
    marginTop: 4,
  },

  /* Info Card Box Container */
  infoCardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    paddingVertical: 4,
  },
  infoRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowLabelText: {
    fontSize: 13,
    color: '#555555',
    flex: 1,
  },
  rowValueText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  rowValueAddressText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'right',
    lineHeight: 18,
  },
  rowValueBodyText: {
    fontSize: 12,
    color: '#333333',
    flex: 1.5,
    textAlign: 'right',
    lineHeight: 16,
  },
  rowDividerLine: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 16,
  },

  /* Logout Button */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 10,
    marginBottom: 4,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D32F2F',
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
