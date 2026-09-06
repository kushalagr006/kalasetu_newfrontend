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
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalLang, LangCode } from '@/utils/languageStore';

type RoleType = 'govt' | 'customer';

const TRANSLATIONS_LOGIN = {
  hi: {
    welcomeTitle: 'कलासेतु में आपका स्वागत है',
    welcomeSubtitle: 'जारी रखने के लिए लॉगिन करें',
    roleGovtTitle: 'सरकारी खरीदार / संस्था',
    roleCustomerTitle: 'ग्राहक / खरीदार / कारीगर',
    mobileLabel: 'मोबाइल नंबर',
    mobilePlaceholder: 'अपना 10-अंको का मोबाइल नंबर दर्ज करें',
    sendOtpBtn: 'ओटीपी भेजें',
    registerPrompt: 'नया खाता बनाएं? ',
    registerLink: 'यहाँ रजिस्ट्रेशन करें',
    // Register Modal Step 1
    registerModalTitle: 'नया खाता बनाएं',
    registerModalSub: 'कृपया उस खाते का प्रकार चुनें जिसे आप बनाना चाहते हैं।',
    individualTitle: 'व्यक्तिगत उपयोगकर्ता',
    individualSub: 'कारीगरों, ग्राहकों या व्यक्तिगत खरीदारों के लिए।',
    companyTitle: 'कंपनी / व्यवसाय',
    companySub: 'निजी कंपनियों, संगठनों या थोक खरीदारों के लिए।',
    continueBtn: 'आगे बढ़ें →',
    orText: 'या',
    alreadyHaveAccount: 'पहले से ही एक खाता है? ',
    loginLinkText: 'लॉगिन करें',
    // Form Headings
    indFormTitle: 'व्यक्तिगत उपयोगकर्ता रजिस्ट्रेशन',
    indFormSub: 'व्यक्तिगत ग्राहक/कारीगर खाता बनाने के लिए अपना विवरण दर्ज करें।',
    compFormTitle: 'कंपनी / व्यवसाय रजिस्ट्रेशन',
    compFormSub: 'कंपनी खाता बनाने के लिए अपना व्यावसायिक और व्यक्तिगत विवरण दर्ज करें।',
    // Form Labels
    fullNameLabel: 'पूरा नाम *',
    fullNamePlaceholder: 'अपना पूरा नाम दर्ज करें',
    mobileNumLabel: 'मोबाइल नंबर *',
    mobileNumPlaceholder: '10-अंकों का मोबाइल नंबर दर्ज करें',
    emailLabel: 'ईमेल आईडी *',
    emailPlaceholder: 'अपना ईमेल पता दर्ज करें',
    aadhaarLabel: 'आधार कार्ड नंबर *',
    aadhaarPlaceholder: '12-अंकों का आधार नंबर दर्ज करें',
    companyNameLabel: 'कंपनी / व्यवसाय का नाम *',
    companyNamePlaceholder: 'कंपनी का नाम दर्ज करें',
    gstinLabel: 'जीएसटीआईएन नंबर (GSTIN) *',
    gstinPlaceholder: '15-अंकों का GSTIN दर्ज करें',
    categoryLabel: 'श्रेणी / सामाजिक वर्ग *',
    categoryPlaceholder: 'अपनी श्रेणी चुनें',
    categories: [
      { key: 'sc', title: 'अनुसूचित जाति (SC)', desc: 'अनुसूचित जाति समुदाय के कारीगर/उपयोगकर्ता' },
      { key: 'st', title: 'अनुसूचित जनजाति (ST)', desc: 'अनुसूचित जनजाति व जनजातीय समुदाय के कारीगर' },
      { key: 'obc', title: 'अन्य पिछड़ा वर्ग (OBC)', desc: 'अन्य पिछड़ा वर्ग समुदाय के कारीगर' },
      { key: 'pwd', title: 'दिव्यांगजन (PWD)', desc: 'विशेष आवश्यकता वाले / दिव्यांग कारीगर' },
      { key: 'shg', title: 'महिला स्व-सहायता समूह (Woman SHG)', desc: 'महिला स्वयं सहायता समूह व क्लस्टर' },
      { key: 'displaced', title: 'विस्थापित कारीगर (Displaced Artisans)', desc: 'पुनर्वासित अथवा विस्थापित कारीगर' },
      { key: 'isolated', title: 'ग्रामीण व भौगोलिक रूप से पृथक (Rural & Geographically Isolated)', desc: 'सड़क, बिजली व मुख्य बाजार की सीमित पहुंच वाले दूरस्थ, ग्रामीण या पहाड़ी क्षेत्रों के कारीगर' },
    ],
    createAccountBtn: 'खाता बनाएं और ओटीपी सत्यापित करें →',
    createCompanyAccountBtn: 'कंपनी खाता बनाएं और ओटीपी सत्यापित करें →',
    // Alerts
    errFullName: 'कृपया अपना पूरा नाम दर्ज करें।',
    errMobile: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।',
    errEmail: 'कृपया एक वैध ईमेल पता दर्ज करें।',
    errAadhaar: 'कृपया 12 अंकों का वैध आधार कार्ड नंबर दर्ज करें।',
    errCompany: 'कृपया अपनी कंपनी/व्यवसाय का नाम दर्ज करें।',
    errGstin: 'कृपया अपना 15 अंकों का GSTIN नंबर दर्ज करें।',
    successInd: 'व्यक्तिगत खाता सफलतापूर्वक बनाया गया! कृपया ओटीपी सत्यापित करें।',
    successComp: 'कंपनी खाता सफलतापूर्वक बनाया गया! कृपया ओटीपी सत्यापित करें।',
    // OTP Modal
    otpModalTitle: 'ओटीपी कोड दर्ज करें',
    otpModalSub: 'हमने आपके मोबाइल नंबर पर 6-अंकों का सत्यापन कोड भेजा है',
    changeNumLink: 'नंबर बदलें',
    resendOtpText: 'ओटीपी प्राप्त नहीं हुआ? पुनः भेजें',
    verifyOtpBtn: 'सत्यापित करें और जारी रखें →',
  },
  en: {
    welcomeTitle: 'Welcome to KalaSetu',
    welcomeSubtitle: 'Login to continue',
    roleGovtTitle: 'Government Buyer',
    roleCustomerTitle: 'Customer / Buyer',
    mobileLabel: 'Mobile Number',
    mobilePlaceholder: 'Enter your 10-digit mobile number',
    sendOtpBtn: 'Send OTP',
    registerPrompt: 'New user? ',
    registerLink: 'Register here',
    // Register Modal Step 1
    registerModalTitle: 'Create a New Account',
    registerModalSub: 'Please select the type of account you want to create.',
    individualTitle: 'Individual User',
    individualSub: 'For artisans, customers or individual buyers.',
    companyTitle: 'Company / Business',
    companySub: 'For private companies, organizations or bulk buyers.',
    continueBtn: 'Continue →',
    orText: 'or',
    alreadyHaveAccount: 'Already have an account? ',
    loginLinkText: 'Login',
    // Form Headings
    indFormTitle: 'Individual Registration',
    indFormSub: 'Enter your details to create your individual customer/artisan account.',
    compFormTitle: 'Company / Business Registration',
    compFormSub: 'Enter your business and personal details to create a company account.',
    // Form Labels
    fullNameLabel: 'Full Name *',
    fullNamePlaceholder: 'Enter your full name',
    mobileNumLabel: 'Mobile Number *',
    mobileNumPlaceholder: 'Enter 10-digit mobile number',
    emailLabel: 'Email ID *',
    emailPlaceholder: 'Enter your email address',
    categoryLabel: 'Category / Social Group *',
    categoryPlaceholder: 'Select your category',
    categories: [
      { key: 'sc', title: 'Scheduled Caste (SC)', desc: 'Artisans/Users belonging to SC community' },
      { key: 'st', title: 'Scheduled Tribe (ST)', desc: 'Artisans belonging to ST community' },
      { key: 'obc', title: 'Other Backward Classes (OBC)', desc: 'Artisans belonging to OBC community' },
      { key: 'pwd', title: 'Persons with Disabilities (PWD)', desc: 'Specially-abled artisans' },
      { key: 'shg', title: 'Woman SHG (Self-Help Group)', desc: 'Women self-help group & clusters' },
      { key: 'displaced', title: 'Displaced Artisans', desc: 'Rehabilitated or displaced craftspersons' },
      { key: 'isolated', title: 'Rural & Geographically Isolated', desc: 'Artisans in remote areas, villages, or hills with limited access to road, electricity, and major market' },
    ],
    aadhaarLabel: 'Aadhaar Card Number *',
    aadhaarPlaceholder: 'Enter 12-digit Aadhaar number',
    companyNameLabel: 'Company Name *',
    companyNamePlaceholder: 'Enter company / business name',
    gstinLabel: 'GSTIN Number *',
    gstinPlaceholder: 'Enter 15-digit GSTIN number',
    createAccountBtn: 'Create Account & Verify OTP →',
    createCompanyAccountBtn: 'Create Company Account & Verify OTP →',
    // Alerts
    errFullName: 'Please enter your full name.',
    errMobile: 'Please enter a valid 10-digit mobile number.',
    errEmail: 'Please enter a valid email address.',
    errAadhaar: 'Please enter a valid 12-digit Aadhaar Card number.',
    errCompany: 'Please enter your company / business name.',
    errGstin: 'Please enter your GSTIN number.',
    successInd: 'Individual Account created successfully! Please verify with OTP.',
    successComp: 'Company Account created successfully! Please verify with OTP.',
    // OTP Modal
    otpModalTitle: 'Enter OTP Code',
    otpModalSub: 'We sent a 6-digit verification code to your mobile number',
    changeNumLink: 'Change Number',
    resendOtpText: "Didn't receive OTP? Resend",
    verifyOtpBtn: 'Verify & Continue →',
  },
};

export default function WebLoginScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 850;

  const [selectedLang, setSelectedLang] = useGlobalLang();
  const effectiveLang = Platform.OS === 'web' ? 'en' : selectedLang;
  const t = TRANSLATIONS_LOGIN[effectiveLang as keyof typeof TRANSLATIONS_LOGIN] || TRANSLATIONS_LOGIN.en;

  const [selectedRole, setSelectedRole] = useState<RoleType>('govt');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [registerStep, setRegisterStep] = useState<'select' | 'individualForm' | 'companyForm'>('select');
  const [isLangDropdownVisible, setIsLangDropdownVisible] = useState(false);

  // Individual Registration Fields
  const [indFullName, setIndFullName] = useState('');
  const [indMobile, setIndMobile] = useState('');
  const [indEmail, setIndEmail] = useState('');
  const [indCategory, setIndCategory] = useState('sc');
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);

  // Company Registration Fields
  const [compFullName, setCompFullName] = useState('');
  const [compAadhaar, setCompAadhaar] = useState('');
  const [compName, setCompName] = useState('');
  const [compGSTIN, setCompGSTIN] = useState('');
  const [compMobile, setCompMobile] = useState('');

  // OTP Modal Window States
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['1', '2', '3', '4', '5', '6']);

  const handleOpenRegister = () => {
    setRegisterStep('select');
    setIsRegisterModalVisible(true);
  };

  const handleSelectIndividual = () => {
    setIndMobile(phoneNumber);
    setRegisterStep('individualForm');
  };

  const handleSelectCompany = () => {
    setCompMobile(phoneNumber);
    setRegisterStep('companyForm');
  };

  const handleCreateIndividualAccount = () => {
    if (!indFullName.trim()) {
      alert(t.errFullName);
      return;
    }
    if (indMobile.length < 10) {
      alert(t.errMobile);
      return;
    }
    if (!indEmail.includes('@')) {
      alert(t.errEmail);
      return;
    }
    alert(t.successInd);
    setPhoneNumber(indMobile);
    setSelectedRole('customer');
    setIsRegisterModalVisible(false);
    setIsOtpModalVisible(true);
  };

  const handleCreateCompanyAccount = () => {
    if (!compFullName.trim()) {
      alert(t.errFullName);
      return;
    }
    if (compAadhaar.length < 12) {
      alert(t.errAadhaar);
      return;
    }
    if (!compName.trim()) {
      alert(t.errCompany);
      return;
    }
    if (!compGSTIN.trim()) {
      alert(t.errGstin);
      return;
    }
    if (compMobile.length < 10) {
      alert(t.errMobile);
      return;
    }
    alert(t.successComp);
    setPhoneNumber(compMobile);
    setSelectedRole('govt');
    setIsRegisterModalVisible(false);
    setIsOtpModalVisible(true);
  };

  const handleSendOTP = () => {
    if (phoneNumber.length < 10) {
      alert(t.errMobile);
      return;
    }
    setIsOtpModalVisible(true);
  };

  const handleVerifyOTP = () => {
    setIsOtpModalVisible(false);
    if (Platform.OS === 'web') {
      if (selectedRole === 'govt') {
        router.push('/govt-dashboard');
      } else {
        router.push('/customer-dashboard');
      }
    } else {
      if (selectedRole === 'govt') {
        router.push({ pathname: '/govt-dashboard', params: { lang: selectedLang } });
      } else {
        router.push({ pathname: '/home', params: { lang: selectedLang } });
      }
    }
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
          {Platform.OS !== 'web' ? (
            /* Mobile App Login Screen (Artisans Portal) */
            <View style={styles.mobileLoginWrapper}>
              {/* Top Bar with Language Selector */}
              <View style={styles.mobileTopBar}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity
                  style={styles.mobileLangPill}
                  onPress={() => setIsLangDropdownVisible(!isLangDropdownVisible)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="globe-outline" size={16} color="#2C2C2C" style={{ marginRight: 6 }} />
                  <Text style={styles.mobileLangPillText}>
                    {selectedLang === 'hi' ? 'हिंदी' : 'English'}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color="#2C2C2C" style={{ marginLeft: 4 }} />
                </TouchableOpacity>

                {isLangDropdownVisible && (
                  <View style={styles.mobileLangDropdown}>
                    <TouchableOpacity
                      style={styles.dropdownOption}
                      onPress={() => {
                        setSelectedLang('hi');
                        setIsLangDropdownVisible(false);
                      }}
                    >
                      <Text style={[styles.dropdownOptionText, selectedLang === 'hi' && styles.dropdownOptionTextActive]}>
                        हिंदी (Hindi)
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdownOption}
                      onPress={() => {
                        setSelectedLang('en');
                        setIsLangDropdownVisible(false);
                      }}
                    >
                      <Text style={[styles.dropdownOptionText, selectedLang === 'en' && styles.dropdownOptionTextActive]}>
                        English (English)
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Brand Logo Header */}
              <View style={styles.mobileBrandHeader}>
                <Image
                  source={require('@/assets/images/logo_icon.png')}
                  style={styles.mobileLogoIcon}
                  resizeMode="contain"
                />
                <Text style={styles.mobileBrandTitle}>
                  {selectedLang === 'hi' ? 'कलासेतु' : 'KalaSetu'}
                </Text>
                <Text style={styles.mobileBrandSub}>
                  {selectedLang === 'hi' ? 'आपकी कला, आपकी पहचान' : 'Your Craft, Your Identity'}
                </Text>
              </View>

              {/* Village Artwork Banner */}
              <View style={styles.mobileVillageArtCard}>
                <Image
                  source={require('@/assets/images/village_sketch.png')}
                  style={styles.mobileVillageArtImage}
                  resizeMode="cover"
                />
              </View>

              {/* Phone Badge & Input Section */}
              <View style={styles.mobilePhoneSection}>
                <View style={styles.mobilePhoneIconBadge}>
                  <Ionicons name="call" size={22} color="#3B6029" />
                </View>
                <Text style={styles.mobilePhoneHeading}>
                  {selectedLang === 'hi' ? 'मोबाइल नंबर डालें' : 'Enter Mobile Number'}
                </Text>

                {/* Mobile Number Input Box */}
                <View style={styles.mobileInputBoxCustom}>
                  <TouchableOpacity style={styles.countryCodePicker}>
                    <Text style={styles.countryCodeText}>+91</Text>
                    <Ionicons name="chevron-down" size={12} color="#666666" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>

                  <View style={{ width: 1, height: 22, backgroundColor: '#CBD5E1', marginHorizontal: 10 }} />

                  <TextInput
                    style={styles.mobileTextInputCustom}
                    placeholder={selectedLang === 'hi' ? 'अपना मोबाइल नंबर लिखें' : 'Enter your mobile number'}
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                  />
                  <Ionicons name="call-outline" size={18} color="#3B6029" style={{ marginLeft: 6 }} />
                </View>

                {/* Primary Action Button: आगे बढ़ें → */}
                <TouchableOpacity
                  style={styles.mobileProceedButton}
                  onPress={handleSendOTP}
                  activeOpacity={0.88}
                >
                  <Text style={styles.mobileProceedButtonText}>
                    {selectedLang === 'hi' ? 'आगे बढ़ें' : 'Proceed'}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
                </TouchableOpacity>

                {/* New Account / Register Link */}
                <View style={styles.registerRowMobile}>
                  <Text style={styles.registerPromptText}>{t.registerPrompt}</Text>
                  <TouchableOpacity onPress={handleOpenRegister}>
                    <Text style={styles.registerLinkText}>{t.registerLink}</Text>
                  </TouchableOpacity>
                </View>

                {/* Divider: —— या —— */}
                <View style={styles.mobileOrDividerRow}>
                  <View style={styles.mobileOrLine} />
                  <Text style={styles.mobileOrText}>{selectedLang === 'hi' ? 'या' : 'or'}</Text>
                  <View style={styles.mobileOrLine} />
                </View>

                {/* Woman SHG Group Card */}
                <TouchableOpacity
                  style={styles.mobileShgCard}
                  onPress={() => {
                    setIndCategory('shg');
                    handleOpenRegister();
                  }}
                  activeOpacity={0.9}
                >
                  <View style={styles.mobileShgAvatarCircle}>
                    <Ionicons name="people" size={26} color="#0A5C28" />
                  </View>
                  <View style={styles.mobileShgTextContent}>
                    <Text style={styles.mobileShgTitle}>
                      {selectedLang === 'hi' ? 'महिला SHG समूह बनाएं' : 'Create Woman SHG Group'}
                    </Text>
                    <Text style={styles.mobileShgSub}>
                      {selectedLang === 'hi'
                        ? 'एक साथ काम करें, बड़े ऑर्डर पाएं और अपनी आमदनी बढ़ाएं'
                        : 'Work together, get bigger orders and boost your income'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#3B6029" />
                </TouchableOpacity>

                {/* Bottom 3 Trust Badges */}
                <View style={styles.mobileTrustRow}>
                  <View style={styles.mobileTrustItem}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#3B6029" />
                    <Text style={styles.mobileTrustText}>
                      {selectedLang === 'hi' ? 'सुरक्षित\nऔर भरोसेमंद' : 'Safe &\nTrusted'}
                    </Text>
                  </View>

                  <View style={styles.mobileTrustDivider} />

                  <View style={styles.mobileTrustItem}>
                    <Ionicons name="leaf-outline" size={20} color="#3B6029" />
                    <Text style={styles.mobileTrustText}>
                      {selectedLang === 'hi' ? 'भारतीय कलाकारों\nके लिए' : 'For Indian\nArtisans'}
                    </Text>
                  </View>

                  <View style={styles.mobileTrustDivider} />

                  <View style={styles.mobileTrustItem}>
                    <Ionicons name="hand-left-outline" size={20} color="#3B6029" />
                    <Text style={styles.mobileTrustText}>
                      {selectedLang === 'hi' ? 'बिकें, कमाएं\nऔर आगे बढ़ें' : 'Sell, Earn\n& Grow'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            /* Web Website Login Screen (Govt & Customers Portal) */
            <View style={[styles.splitWrapper, isDesktop ? styles.splitDesktop : styles.splitMobile]}>
              {/* Left Hero Panel (50%) */}
              <View style={[styles.leftHeroPanel, isDesktop ? { flex: 1 } : { width: '100%' }]}>
                {/* Brand Logo Header */}
                <View style={styles.brandRow}>
                  <Image
                    source={require('@/assets/images/logo_icon.png')}
                    style={styles.brandIcon}
                    resizeMode="contain"
                  />
                  <View style={styles.brandTextGroup}>
                    <Text style={styles.brandTitle}>
                      Kala<Text style={{ color: '#3B6029' }}>Setu</Text>
                    </Text>
                    <Text style={styles.brandSubtitle}>Bridging Artisans to Markets</Text>
                  </View>
                </View>

                {/* Main Headline */}
                <View style={styles.headlineBlock}>
                  <Text style={styles.headlineDark}>Traditional Skills</Text>
                  <Text style={styles.headlineGreen}>Brighter Opportunities</Text>
                </View>

                <Text style={styles.heroDescription}>
                  Discover authentic Indian crafts from across the country. Support artisans. Build a stronger, inclusive India.
                </Text>

                {/* Accent Dash */}
                <View style={styles.accentDash} />

                {/* 3 Value Pillars */}
                <View style={styles.pillarsRow}>
                  <View style={styles.pillarItem}>
                    <View style={styles.pillarIconBox}>
                      <Ionicons name="leaf-outline" size={18} color="#3B6029" />
                    </View>
                    <Text style={styles.pillarTitle}>Authentic Products</Text>
                  </View>

                  <View style={styles.pillarItem}>
                    <View style={styles.pillarIconBox}>
                      <Ionicons name="people-outline" size={18} color="#3B6029" />
                    </View>
                    <Text style={styles.pillarTitle}>Support Rural Livelihoods</Text>
                  </View>

                  <View style={styles.pillarItem}>
                    <View style={styles.pillarIconBox}>
                      <Ionicons name="trending-up-outline" size={18} color="#3B6029" />
                    </View>
                    <Text style={styles.pillarTitle}>Inclusive Growth</Text>
                  </View>
                </View>

                {/* Hero Handicrafts Scene Image */}
                <View style={styles.heroImageCard}>
                  <Image
                    source={require('@/assets/images/web_crafts_hero.jpg')}
                    style={styles.heroImage}
                    resizeMode="cover"
                  />
                </View>
              </View>

              {/* Right Login Panel (50%) */}
              <View style={[styles.rightFormPanel, isDesktop ? { flex: 1 } : { width: '100%', marginTop: 24 }]}>
                {/* Centered Form Body */}
                <View style={styles.formContainer}>
                  <Text style={styles.welcomeTitle}>{t.welcomeTitle}</Text>
                  <Text style={styles.welcomeSubtitle}>{t.welcomeSubtitle}</Text>

                  {/* Role Cards Row */}
                  <View style={styles.rolesRow}>
                    {/* Role 1: Government Buyer */}
                    <TouchableOpacity
                      style={[
                        styles.roleCard,
                        selectedRole === 'govt' && styles.roleCardActive,
                      ]}
                      onPress={() => setSelectedRole('govt')}
                      activeOpacity={0.85}
                    >
                      {selectedRole === 'govt' && (
                        <View style={styles.roleCheckBadge}>
                          <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                        </View>
                      )}
                      <Ionicons
                        name="business-outline"
                        size={28}
                        color={selectedRole === 'govt' ? '#3B6029' : '#555555'}
                      />
                      <Text
                        style={[
                          styles.roleCardText,
                          selectedRole === 'govt' && styles.roleCardTextActive,
                        ]}
                      >
                        {t.roleGovtTitle}
                      </Text>
                    </TouchableOpacity>

                    {/* Role 2: Customer / Buyer */}
                    <TouchableOpacity
                      style={[
                        styles.roleCard,
                        selectedRole === 'customer' && styles.roleCardActive,
                      ]}
                      onPress={() => setSelectedRole('customer')}
                      activeOpacity={0.85}
                    >
                      {selectedRole === 'customer' && (
                        <View style={styles.roleCheckBadge}>
                          <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                        </View>
                      )}
                      <Ionicons
                        name="cart-outline"
                        size={28}
                        color={selectedRole === 'customer' ? '#3B6029' : '#555555'}
                      />
                      <Text
                        style={[
                          styles.roleCardText,
                          selectedRole === 'customer' && styles.roleCardTextActive,
                        ]}
                      >
                        {t.roleCustomerTitle}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Mobile Number Input */}
                  <Text style={styles.inputLabel}>{t.mobileLabel}</Text>
                  <View style={styles.mobileInputBox}>
                    <View style={styles.countryCodePicker}>
                      <Text style={{ fontSize: 16, marginRight: 4 }}>🇮🇳</Text>
                      <Text style={styles.countryCodeText}>+91</Text>
                      <Ionicons name="chevron-down" size={12} color="#666666" style={{ marginLeft: 4 }} />
                    </View>

                    <View style={{ width: 1, height: 22, backgroundColor: '#E2E0D8', marginHorizontal: 10 }} />

                    <TextInput
                      style={styles.mobileTextInput}
                      placeholder={t.mobilePlaceholder}
                      placeholderTextColor="#999999"
                      keyboardType="numeric"
                      maxLength={10}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                    />
                  </View>

                  {/* Send OTP Button */}
                  <TouchableOpacity
                    style={styles.sendOtpButton}
                    onPress={handleSendOTP}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.sendOtpButtonText}>{t.sendOtpBtn}</Text>
                  </TouchableOpacity>

                  {/* Footer Register Link */}
                  <View style={styles.registerRow}>
                    <Text style={styles.registerPromptText}>{t.registerPrompt}</Text>
                    <TouchableOpacity onPress={handleOpenRegister}>
                      <Text style={styles.registerLinkText}>{t.registerLink}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Create a New Account Modal */}
        <Modal
          visible={isRegisterModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsRegisterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.registerModalCard}>
              {/* Top Navigation Bar: Back & Close */}
              <View style={styles.modalTopNavRow}>
                {registerStep !== 'select' ? (
                  <TouchableOpacity
                    style={styles.modalBackBtn}
                    onPress={() => setRegisterStep('select')}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="arrow-back" size={20} color="#333333" />
                    <Text style={styles.modalBackBtnText}>Back</Text>
                  </TouchableOpacity>
                ) : <View />}

                <TouchableOpacity
                  style={styles.registerModalCloseBtn}
                  onPress={() => setIsRegisterModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={20} color="#666666" />
                </TouchableOpacity>
              </View>

              {/* STEP 1: Account Type Selection */}
              {registerStep === 'select' && (
                <>
                  {/* Header */}
                  <Text style={styles.registerModalTitle}>{t.registerModalTitle}</Text>
                  <Text style={styles.registerModalSubtitle}>{t.registerModalSub}</Text>

                  {/* Selection Cards */}
                  <View style={styles.accountCardsGrid}>
                    {/* 1. Individual User */}
                    <TouchableOpacity
                      style={styles.individualAccountCard}
                      onPress={handleSelectIndividual}
                      activeOpacity={0.9}
                    >
                      <View style={styles.individualIconContainer}>
                        <Ionicons name="person" size={36} color="#0A5C28" />
                      </View>
                      <Text style={styles.accountCardTitleText}>{t.individualTitle}</Text>
                      <Text style={styles.accountCardSubtitleText}>{t.individualSub}</Text>
                      <View style={styles.individualContinueBtn}>
                        <Text style={styles.continueBtnText}>{t.continueBtn}</Text>
                      </View>
                    </TouchableOpacity>

                    {/* 2. Company / Business */}
                    <TouchableOpacity
                      style={styles.businessAccountCard}
                      onPress={handleSelectCompany}
                      activeOpacity={0.9}
                    >
                      <View style={styles.businessIconContainer}>
                        <Ionicons name="business" size={36} color="#334155" />
                      </View>
                      <Text style={styles.accountCardTitleText}>{t.companyTitle}</Text>
                      <Text style={styles.accountCardSubtitleText}>{t.companySub}</Text>
                      <View style={styles.businessContinueBtn}>
                        <Text style={styles.continueBtnText}>{t.continueBtn}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Divider */}
                  <View style={styles.modalOrDividerRow}>
                    <View style={styles.modalOrLine} />
                    <Text style={styles.modalOrText}>{t.orText}</Text>
                    <View style={styles.modalOrLine} />
                  </View>

                  {/* Footer Login Link */}
                  <View style={styles.modalFooterRow}>
                    <Text style={styles.modalFooterPromptText}>{t.alreadyHaveAccount}</Text>
                    <TouchableOpacity onPress={() => setIsRegisterModalVisible(false)}>
                      <Text style={styles.modalFooterLoginLink}>{t.loginLinkText}</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* STEP 2A: Individual User Registration Form */}
              {registerStep === 'individualForm' && (
                <View style={styles.formStepContainer}>
                  <Text style={styles.registerModalTitle}>{t.indFormTitle}</Text>
                  <Text style={styles.registerModalSubtitle}>{t.indFormSub}</Text>

                  {/* Field 1: Full Name */}
                  <Text style={styles.formFieldLabel}>{t.fullNameLabel}</Text>
                  <View style={styles.formInputBox}>
                    <Ionicons name="person-outline" size={18} color="#666666" style={{ marginRight: 10 }} />
                    <TextInput
                      style={styles.formTextInput}
                      placeholder={t.fullNamePlaceholder}
                      placeholderTextColor="#999999"
                      value={indFullName}
                      onChangeText={setIndFullName}
                    />
                  </View>

                  {/* Field 2: Mobile Number */}
                  <Text style={styles.formFieldLabel}>{t.mobileNumLabel}</Text>
                  <View style={styles.formInputBox}>
                    <Ionicons name="call-outline" size={18} color="#666666" style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#333333', marginRight: 8 }}>+91</Text>
                    <TextInput
                      style={styles.formTextInput}
                      placeholder={t.mobileNumPlaceholder}
                      placeholderTextColor="#999999"
                      keyboardType="numeric"
                      maxLength={10}
                      value={indMobile}
                      onChangeText={setIndMobile}
                    />
                  </View>

                  {/* Field 3: Email ID */}
                  <Text style={styles.formFieldLabel}>{t.emailLabel}</Text>
                  <View style={styles.formInputBox}>
                    <Ionicons name="mail-outline" size={18} color="#666666" style={{ marginRight: 10 }} />
                    <TextInput
                      style={styles.formTextInput}
                      placeholder={t.emailPlaceholder}
                      placeholderTextColor="#999999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={indEmail}
                      onChangeText={setIndEmail}
                    />
                  </View>

                  {/* Field 4: Category / Social Group (Mobile Artisan App only) */}
                  {Platform.OS !== 'web' && (
                    <>
                      <Text style={styles.formFieldLabel}>{t.categoryLabel}</Text>
                      <TouchableOpacity
                        style={styles.categorySelectBox}
                        onPress={() => setIsCategoryPickerOpen(!isCategoryPickerOpen)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="pricetag-outline" size={18} color="#0A5C28" style={{ marginRight: 10 }} />
                        <Text style={styles.categorySelectText}>
                          {t.categories.find((c) => c.key === indCategory)?.title || t.categoryPlaceholder}
                        </Text>
                        <Ionicons
                          name={isCategoryPickerOpen ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          color="#666666"
                        />
                      </TouchableOpacity>

                      {/* Dropdown Options List */}
                      {isCategoryPickerOpen && (
                        <View style={styles.categoryDropdownList}>
                          <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled showsVerticalScrollIndicator>
                            {t.categories.map((cat) => {
                              const isSelected = cat.key === indCategory;
                              return (
                                <TouchableOpacity
                                  key={cat.key}
                                  style={[
                                    styles.categoryOptionItem,
                                    isSelected && styles.categoryOptionSelected,
                                  ]}
                                  onPress={() => {
                                    setIndCategory(cat.key);
                                    setIsCategoryPickerOpen(false);
                                  }}
                                >
                                  <View style={{ flex: 1 }}>
                                    <Text style={[styles.categoryOptionTitle, isSelected && { color: '#0A5C28', fontWeight: 'bold' }]}>
                                      {cat.title}
                                    </Text>
                                    <Text style={styles.categoryOptionDesc}>{cat.desc}</Text>
                                  </View>
                                  {isSelected && <Ionicons name="checkmark-circle" size={18} color="#0A5C28" />}
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>
                        </View>
                      )}
                    </>
                  )}

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={styles.createAccountSubmitBtn}
                    onPress={handleCreateIndividualAccount}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.createAccountSubmitBtnText}>{t.createAccountBtn}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* STEP 2B: Company / Business Registration Form */}
              {registerStep === 'companyForm' && (
                <View style={styles.formStepContainer}>
                  <Text style={styles.registerModalTitle}>{t.compFormTitle}</Text>
                  <Text style={styles.registerModalSubtitle}>{t.compFormSub}</Text>

                  {/* Field 1: Full Name */}
                  <Text style={styles.formFieldLabel}>{t.fullNameLabel}</Text>
                  <View style={styles.formInputBox}>
                    <Ionicons name="person-outline" size={18} color="#666666" style={{ marginRight: 10 }} />
                    <TextInput
                      style={styles.formTextInput}
                      placeholder={t.fullNamePlaceholder}
                      placeholderTextColor="#999999"
                      value={compFullName}
                      onChangeText={setCompFullName}
                    />
                  </View>

                  {/* Field 2: Aadhaar Card Number */}
                  <Text style={styles.formFieldLabel}>{t.aadhaarLabel}</Text>
                  <View style={styles.formInputBox}>
                    <Ionicons name="card-outline" size={18} color="#666666" style={{ marginRight: 10 }} />
                    <TextInput
                      style={styles.formTextInput}
                      placeholder={t.aadhaarPlaceholder}
                      placeholderTextColor="#999999"
                      keyboardType="numeric"
                      maxLength={12}
                      value={compAadhaar}
                      onChangeText={setCompAadhaar}
                    />
                  </View>

                  {/* Field 3: Company Name */}
                  <Text style={styles.formFieldLabel}>{t.companyNameLabel}</Text>
                  <View style={styles.formInputBox}>
                    <Ionicons name="business-outline" size={18} color="#666666" style={{ marginRight: 10 }} />
                    <TextInput
                      style={styles.formTextInput}
                      placeholder={t.companyNamePlaceholder}
                      placeholderTextColor="#999999"
                      value={compName}
                      onChangeText={setCompName}
                    />
                  </View>

                  {/* Field 4: GSTIN Number */}
                  <Text style={styles.formFieldLabel}>{t.gstinLabel}</Text>
                  <View style={styles.formInputBox}>
                    <Ionicons name="document-text-outline" size={18} color="#666666" style={{ marginRight: 10 }} />
                    <TextInput
                      style={styles.formTextInput}
                      placeholder={t.gstinPlaceholder}
                      placeholderTextColor="#999999"
                      autoCapitalize="characters"
                      maxLength={15}
                      value={compGSTIN}
                      onChangeText={(val) => setCompGSTIN(val.toUpperCase())}
                    />
                  </View>

                  {/* Field 5: Mobile Number */}
                  <Text style={styles.formFieldLabel}>{t.mobileNumLabel}</Text>
                  <View style={styles.formInputBox}>
                    <Ionicons name="call-outline" size={18} color="#666666" style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#333333', marginRight: 8 }}>+91</Text>
                    <TextInput
                      style={styles.formTextInput}
                      placeholder={t.mobileNumPlaceholder}
                      placeholderTextColor="#999999"
                      keyboardType="numeric"
                      maxLength={10}
                      value={compMobile}
                      onChangeText={setCompMobile}
                    />
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={styles.createBusinessAccountSubmitBtn}
                    onPress={handleCreateCompanyAccount}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.createAccountSubmitBtnText}>{t.createCompanyAccountBtn}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* OTP Modal Window */}
        <Modal
          visible={isOtpModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsOtpModalVisible(false)}
        >
          <View style={styles.otpModalOverlay}>
            <View style={styles.otpModalCard}>
              <TouchableOpacity
                style={styles.otpCloseBtn}
                onPress={() => setIsOtpModalVisible(false)}
              >
                <Ionicons name="close" size={20} color="#666666" />
              </TouchableOpacity>

              <Text style={styles.otpModalTitle}>{t.otpModalTitle}</Text>
              <Text style={styles.otpModalSubtitle}>
                {t.otpModalSub} (+91 {phoneNumber || 'XXXXXXXXXX'})
              </Text>

              <View style={styles.otpGridRow}>
                {otpDigits.map((digit, idx) => (
                  <View key={idx} style={styles.otpBox}>
                    <Text style={styles.otpBoxText}>{digit}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.otpResendText}>{t.resendOtpText}</Text>

              <TouchableOpacity
                style={styles.verifyOtpButton}
                onPress={handleVerifyOTP}
                activeOpacity={0.85}
              >
                <Text style={styles.verifyOtpButtonText}>{t.verifyOtpBtn}</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    minHeight: '100%',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  splitWrapper: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    ...Platform.select({
      web: { boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.06)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12 },
    }),
  },
  splitDesktop: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  splitMobile: {
    flexDirection: 'column',
  },
  /* Left Hero Panel */
  leftHeroPanel: {
    backgroundColor: '#FAF8F5',
    padding: 36,
    justifyContent: 'space-between',
    borderRightWidth: 1,
    borderColor: '#E2E0D8',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  brandIcon: {
    width: 44,
    height: 44,
    marginRight: 12,
  },
  brandTextGroup: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  headlineBlock: {
    marginBottom: 14,
  },
  headlineDark: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 34,
  },
  headlineGreen: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3B6029',
    lineHeight: 34,
  },
  heroDescription: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 20,
  },
  accentDash: {
    width: 40,
    height: 4,
    backgroundColor: '#E65100',
    borderRadius: 2,
    marginBottom: 24,
  },
  pillarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  pillarItem: {
    flex: 1,
    alignItems: 'center',
  },
  pillarIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  pillarTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#444444',
    textAlign: 'center',
    lineHeight: 14,
  },
  heroImageCard: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },

  /* Right Form Panel */
  rightFormPanel: {
    padding: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    width: '100%',
    maxWidth: 380,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
  },
  rolesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: '#E2E0D8',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  roleCardActive: {
    backgroundColor: '#EAF2E8',
    borderColor: '#3B6029',
  },
  roleCheckBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#3B6029',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
    marginTop: 8,
    textAlign: 'center',
  },
  roleCardTextActive: {
    color: '#3B6029',
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  mobileInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E0D8',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 20,
  },
  countryCodePicker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  mobileTextInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  sendOtpButton: {
    backgroundColor: '#3B6029',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sendOtpButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerPromptText: {
    fontSize: 13,
    color: '#666666',
  },
  registerLinkText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B6029',
  },

  /* Register Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  registerModalCard: {
    width: '100%',
    maxWidth: 580,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    position: 'relative',
    ...Platform.select({
      web: { boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20 },
    }),
  },
  registerModalCloseBtn: {
    padding: 4,
  },
  registerModalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  registerModalSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
  },
  accountCardsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  individualAccountCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#EAF2E8',
    borderWidth: 1.5,
    borderColor: '#3B6029',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  businessAccountCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  individualIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  businessIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  accountCardTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
    textAlign: 'center',
  },
  accountCardSubtitleText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 18,
  },
  individualContinueBtn: {
    width: '100%',
    backgroundColor: '#0A5C28',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  businessContinueBtn: {
    width: '100%',
    backgroundColor: '#334155',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalOrDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalOrLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  modalOrText: {
    fontSize: 13,
    color: '#777777',
    marginHorizontal: 12,
  },
  modalFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFooterPromptText: {
    fontSize: 14,
    color: '#555555',
  },
  modalFooterLoginLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  modalTopNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalBackBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  formStepContainer: {
    gap: 2,
  },
  formFieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
    marginTop: 10,
  },
  formInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
  },
  formTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  categorySelectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
  },
  categorySelectText: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  categoryDropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0A5C28',
    borderRadius: 10,
    marginTop: 4,
    paddingVertical: 4,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    }),
  },
  categoryOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryOptionSelected: {
    backgroundColor: '#F4F8F3',
  },
  categoryOptionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  categoryOptionDesc: {
    fontSize: 11,
    color: '#666666',
    marginTop: 2,
  },
  createAccountSubmitBtn: {
    backgroundColor: '#0A5C28',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    ...Platform.select({
      web: { boxShadow: '0px 3px 6px rgba(10, 92, 40, 0.25)' },
      default: { shadowColor: '#0A5C28', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5 },
    }),
  },
  createBusinessAccountSubmitBtn: {
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    ...Platform.select({
      web: { boxShadow: '0px 3px 6px rgba(51, 65, 85, 0.25)' },
      default: { shadowColor: '#334155', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5 },
    }),
  },
  createAccountSubmitBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /* OTP Modal */
  otpModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  otpModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    position: 'relative',
    ...Platform.select({
      web: { boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 16 },
    }),
  },
  otpCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
    borderRadius: 15,
    backgroundColor: '#F0EFEA',
  },
  otpModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
    textAlign: 'center',
  },
  otpModalSubtitle: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  otpGridRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  otpBox: {
    width: 44,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#3B6029',
    backgroundColor: '#F4F8F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  otpResendText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 20,
  },
  verifyOtpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 14,
    height: 50,
    width: '100%',
    ...Platform.select({
      web: { boxShadow: '0px 3px 6px rgba(59, 96, 41, 0.25)' },
      default: { shadowColor: '#3B6029', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5 },
    }),
  },
  verifyOtpButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /* Mobile App Login Portal Styles (matching media_1788683026655.png) */
  mobileLoginWrapper: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    paddingBottom: 20,
  },
  mobileTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 8,
    paddingBottom: 4,
    zIndex: 100,
  },
  mobileLangPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4D0C5',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 14,
    ...Platform.select({
      web: { boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3 },
    }),
  },
  mobileLangPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  mobileLangDropdown: {
    position: 'absolute',
    top: 42,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E0D8',
    elevation: 6,
    ...Platform.select({
      web: { boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
    }),
    zIndex: 1000,
    minWidth: 150,
    paddingVertical: 6,
  },
  dropdownOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dropdownOptionText: {
    fontSize: 13,
    color: '#333333',
  },
  dropdownOptionTextActive: {
    fontWeight: 'bold',
    color: '#3B6029',
  },
  mobileBrandHeader: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 6,
  },
  mobileLogoIcon: {
    width: 85,
    height: 85,
    marginBottom: 2,
  },
  mobileBrandTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#4E342E',
    letterSpacing: 0.5,
  },
  mobileBrandSub: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B6029',
    marginTop: 2,
  },
  mobileVillageArtCard: {
    width: '100%',
    height: 150,
    marginBottom: 12,
    overflow: 'hidden',
  },
  mobileVillageArtImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  mobilePhoneSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  mobilePhoneIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  mobilePhoneHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 14,
    textAlign: 'center',
  },
  mobileInputBoxCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#3B6029',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    width: '100%',
    marginBottom: 14,
    ...Platform.select({
      web: { boxShadow: '0px 2px 6px rgba(59, 96, 41, 0.1)' },
      default: { shadowColor: '#3B6029', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    }),
  },
  mobileTextInputCustom: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  mobileProceedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 14,
    height: 52,
    width: '100%',
    marginBottom: 12,
    ...Platform.select({
      web: { boxShadow: '0px 3px 8px rgba(59, 96, 41, 0.25)' },
      default: { shadowColor: '#3B6029', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6 },
    }),
  },
  mobileProceedButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  registerRowMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mobileOrDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 12,
  },
  mobileOrLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  mobileOrText: {
    fontSize: 13,
    color: '#777777',
    marginHorizontal: 12,
    fontWeight: '500',
  },
  mobileShgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF6F0',
    borderWidth: 1,
    borderColor: '#EFE7DA',
    borderRadius: 16,
    padding: 14,
    width: '100%',
    marginBottom: 24,
  },
  mobileShgAvatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E8F3E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mobileShgTextContent: {
    flex: 1,
    paddingRight: 6,
  },
  mobileShgTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  mobileShgSub: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  mobileTrustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EAE7DF',
  },
  mobileTrustItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  mobileTrustDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#EAE7DF',
  },
  mobileTrustText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555555',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 14,
  },
});
