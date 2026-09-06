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
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalLang, LangCode } from '@/utils/languageStore';

type RoleType = 'govt' | 'customer';

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
];

const TRANSLATIONS = {
  en: {
    brandTitle: 'KalaSetu',
    brandSub: 'Bridging Artisans to Markets',
    headline1: 'Traditional Skills',
    headline2: 'Brighter Opportunities',
    description:
      'Discover authentic Indian crafts from across the country. Support artisans. Build a stronger, inclusive India.',
    feat1: 'Authentic Products',
    feat2: 'Support Rural Livelihoods',
    feat3: 'Inclusive Growth',
    welcome: 'Welcome to ',
    loginSub: 'Login to continue',
    roleGovt: 'Government Buyer',
    roleCust: 'Customer / Buyer',
    mobileLabel: 'Mobile Number',
    mobilePlaceholder: 'Enter your 10-digit mobile number',
    sendOtp: 'Send OTP',
    newUser: 'New user? ',
    register: 'Register',
    errMobile: 'Please enter a valid 10-digit mobile number.',
    langSelect: 'Select Language / भाषा चुनें',
    regTitle: 'Create New Account',
    regSub: 'Choose account type to proceed',
    indTitle: 'Individual User / Artisan',
    indSub: 'For artisans, customers or individual buyers',
    compTitle: 'Company / Business / Organization',
    compSub: 'For companies, bulk buyers or organizations',
    fullNameLabel: 'Full Name *',
    fullNamePlaceholder: 'Enter your full name',
    emailLabel: 'Email Address *',
    emailPlaceholder: 'Enter email address',
    aadhaarLabel: 'Aadhaar Card Number *',
    aadhaarPlaceholder: '12-digit Aadhaar number',
    compNameLabel: 'Company Name *',
    compNamePlaceholder: 'Enter company name',
    gstinLabel: 'GSTIN Number *',
    gstinPlaceholder: '15-digit GSTIN',
    submitReg: 'Register & Continue →',
    errFullName: 'Please enter full name',
    errEmail: 'Please enter a valid email address',
    errAadhaar: 'Please enter 12-digit Aadhaar number',
    errCompName: 'Please enter company name',
    errGstin: 'Please enter 15-digit GSTIN',
    successInd: 'Individual Registration Successful!',
    successComp: 'Company Registration Successful!',
  },
  hi: {
    brandTitle: 'कलासेतु',
    brandSub: 'कारीगरों को बाज़ारों से जोड़ना',
    headline1: 'पारंपरिक हुनर',
    headline2: 'उज्ज्वल अवसर',
    description:
      'देश भर के प्रामाणिक भारतीय हस्तशिल्प खोजें। कारीगरों का समर्थन करें। एक मजबूत, समावेशी भारत का निर्माण करें।',
    feat1: 'प्रामाणिक उत्पाद',
    feat2: 'ग्रामीण आजीविका समर्थन',
    feat3: 'समावेशी विकास',
    welcome: 'कलासेतु में आपका स्वागत है',
    loginSub: 'जारी रखने के लिए लॉगिन करें',
    roleGovt: 'सरकारी खरीदार',
    roleCust: 'ग्राहक / खरीदार',
    mobileLabel: 'मोबाइल नंबर',
    mobilePlaceholder: 'अपना 10-अंको का मोबाइल नंबर दर्ज करें',
    sendOtp: 'ओटीपी भेजें',
    newUser: 'नया खाता बनाएं? ',
    register: 'रजिस्ट्रेशन करें',
    errMobile: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।',
    langSelect: 'भाषा चुनें / Select Language',
    regTitle: 'नया खाता बनाएं',
    regSub: 'आगे बढ़ने के लिए खाते का प्रकार चुनें',
    indTitle: 'व्यक्तिगत उपयोगकर्ता / कारीगर',
    indSub: 'कारीगरों, ग्राहकों या व्यक्तिगत खरीदारों के लिए',
    compTitle: 'कंपनी / व्यवसाय / संस्था',
    compSub: 'कंपनियों, थोक खरीदारों या संस्थाओं के लिए',
    fullNameLabel: 'पूरा नाम *',
    fullNamePlaceholder: 'अपना पूरा नाम दर्ज करें',
    emailLabel: 'ईमेल पता *',
    emailPlaceholder: 'अपना ईमेल दर्ज करें',
    aadhaarLabel: 'आधार कार्ड नंबर *',
    aadhaarPlaceholder: '12-अंकों का आधार नंबर दर्ज करें',
    compNameLabel: 'कंपनी का नाम *',
    compNamePlaceholder: 'कंपनी का नाम दर्ज करें',
    gstinLabel: 'जीएसटीआईएन (GSTIN) *',
    gstinPlaceholder: '15-अंकों का GSTIN दर्ज करें',
    submitReg: 'रजिस्ट्रेशन करें और आगे बढ़ें →',
    errFullName: 'कृपया पूरा नाम दर्ज करें',
    errEmail: 'कृपया एक वैध ईमेल पता दर्ज करें',
    errAadhaar: 'कृपया 12 अंकों का आधार नंबर दर्ज करें',
    errCompName: 'कृपया कंपनी का नाम दर्ज करें',
    errGstin: 'कृपया 15 अंकों का GSTIN दर्ज करें',
    successInd: 'व्यक्तिगत रजिस्ट्रेशन सफल!',
    successComp: 'कंपनी रजिस्ट्रेशन सफल!',
  },
};

export default function WebLoginScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [globalLang, setGlobalLang] = useGlobalLang();
  const selectedLang: LangCode = globalLang === 'hi' ? 'hi' : 'en';
  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.en;

  const [selectedRole, setSelectedRole] = useState<RoleType>('govt');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [isRegModalVisible, setIsRegModalVisible] = useState(false);
  const [regType, setRegType] = useState<'individual' | 'company' | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [email, setEmail] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [compName, setCompName] = useState('');
  const [gstin, setGstin] = useState('');

  const handleSendOtp = () => {
    if (phoneNumber.length < 10) {
      alert(t.errMobile);
      return;
    }
    if (selectedRole === 'govt') {
      router.push('/govt-dashboard');
    } else {
      router.push('/customer-dashboard');
    }
  };

  const handleRegisterSubmit = () => {
    if (!fullName.trim()) {
      alert(t.errFullName);
      return;
    }
    if (regMobile.length < 10) {
      alert(t.errMobile);
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      alert(t.errEmail);
      return;
    }
    if (regType === 'individual') {
      if (aadhaar.length < 12) {
        alert(t.errAadhaar);
        return;
      }
      alert(t.successInd);
    } else {
      if (!compName.trim()) {
        alert(t.errCompName);
        return;
      }
      if (gstin.length < 15) {
        alert(t.errGstin);
        return;
      }
      alert(t.successComp);
    }
    setIsRegModalVisible(false);
    router.push('/customer-dashboard');
  };

  const currentLangLabel = LANGUAGES.find((l) => l.code === selectedLang)?.label || 'English';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Card Container */}
        <View style={[styles.mainCard, isDesktop && styles.mainCardDesktop]}>
          
          {/* Left Column: Hero & Branding Panel */}
          <View style={[styles.leftPanel, isDesktop && styles.leftPanelDesktop]}>
            {/* Logo & Brand Header */}
            <View style={styles.brandRow}>
              <Image
                source={require('@/assets/images/logo_icon.png')}
                style={styles.logoIcon}
                resizeMode="contain"
              />
              <View style={styles.brandTextCol}>
                <Text style={styles.brandTitle}>{t.brandTitle}</Text>
                <Text style={styles.brandSub}>{t.brandSub}</Text>
              </View>
            </View>

            {/* Headline */}
            <View style={styles.headlineWrapper}>
              <Text style={styles.headlineDark}>{t.headline1}</Text>
              <Text style={styles.headlineGreen}>{t.headline2}</Text>
            </View>

            {/* Description */}
            <Text style={styles.descriptionText}>{t.description}</Text>

            {/* Orange Accent Bar */}
            <View style={styles.orangeAccentBar} />

            {/* 3 Circular Icon Features */}
            <View style={styles.featureRow}>
              <View style={styles.featureItem}>
                <View style={styles.featureIconCircle}>
                  <Ionicons name="leaf-outline" size={20} color="#1F4D25" />
                </View>
                <Text style={styles.featureText}>{t.feat1}</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconCircle}>
                  <Ionicons name="people-outline" size={20} color="#1F4D25" />
                </View>
                <Text style={styles.featureText}>{t.feat2}</Text>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIconCircle}>
                  <Ionicons name="trending-up-outline" size={20} color="#1F4D25" />
                </View>
                <Text style={styles.featureText}>{t.feat3}</Text>
              </View>
            </View>

            {/* Craft Photo Banner */}
            <View style={styles.craftPhotoWrapper}>
              <Image
                source={require('@/assets/images/cust_hero_img.png')}
                style={styles.craftPhotoImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Right Column: Login Form Panel */}
          <View style={[styles.rightPanel, isDesktop && styles.rightPanelDesktop]}>
            {/* Top Right Language Pill */}
            <View style={styles.topLangRow}>
              <TouchableOpacity
                style={styles.langPill}
                onPress={() => setIsLangModalVisible(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="globe-outline" size={16} color="#444" />
                <Text style={styles.langPillText}>{currentLangLabel}</Text>
                <Ionicons name="chevron-down" size={14} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Login Title & Subtitle */}
            <View style={styles.titleContainer}>
              <Text style={styles.welcomeText}>
                {t.welcome}
                <Text style={styles.brandHighlight}>KalaSetu</Text>
              </Text>
              <Text style={styles.loginSubText}>{t.loginSub}</Text>
            </View>

            {/* Role Selection Cards (Government Buyer vs Customer/Buyer) */}
            <View style={styles.roleCardRow}>
              {/* Government Buyer Card */}
              <TouchableOpacity
                style={[
                  styles.roleCard,
                  selectedRole === 'govt' && styles.roleCardActive,
                ]}
                onPress={() => setSelectedRole('govt')}
                activeOpacity={0.85}
              >
                {selectedRole === 'govt' && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
                <View style={styles.roleIconWrapper}>
                  <Ionicons
                    name="business-outline"
                    size={26}
                    color={selectedRole === 'govt' ? '#1F4D25' : '#777777'}
                  />
                </View>
                <Text
                  style={[
                    styles.roleCardText,
                    selectedRole === 'govt' && styles.roleCardTextActive,
                  ]}
                >
                  {t.roleGovt}
                </Text>
              </TouchableOpacity>

              {/* Customer / Buyer Card */}
              <TouchableOpacity
                style={[
                  styles.roleCard,
                  selectedRole === 'customer' && styles.roleCardActive,
                ]}
                onPress={() => setSelectedRole('customer')}
                activeOpacity={0.85}
              >
                {selectedRole === 'customer' && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
                <View style={styles.roleIconWrapper}>
                  <Ionicons
                    name="cart-outline"
                    size={26}
                    color={selectedRole === 'customer' ? '#1F4D25' : '#777777'}
                  />
                </View>
                <Text
                  style={[
                    styles.roleCardText,
                    selectedRole === 'customer' && styles.roleCardTextActive,
                  ]}
                >
                  {t.roleCust}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Mobile Number Input */}
            <Text style={styles.mobileInputLabel}>{t.mobileLabel}</Text>
            <View style={styles.mobileInputContainer}>
              <TouchableOpacity style={styles.countryPrefix} activeOpacity={0.8}>
                <Text style={styles.countryCodeText}>IN +91</Text>
                <Ionicons name="chevron-down" size={12} color="#666" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
              <View style={styles.verticalDivider} />
              <TextInput
                style={styles.mobileTextInput}
                placeholder={t.mobilePlaceholder}
                placeholderTextColor="#999999"
                keyboardType="phone-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>

            {/* Send OTP Primary Button */}
            <TouchableOpacity
              style={styles.sendOtpButton}
              onPress={handleSendOtp}
              activeOpacity={0.85}
            >
              <Text style={styles.sendOtpButtonText}>{t.sendOtp}</Text>
            </TouchableOpacity>

            {/* Register Link Row */}
            <View style={styles.registerRow}>
              <Text style={styles.newUserText}>{t.newUser}</Text>
              <TouchableOpacity
                onPress={() => {
                  setRegMobile(phoneNumber);
                  setIsRegModalVisible(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.registerLinkText}>{t.register}</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>

      {/* Language Modal */}
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
          <View style={styles.langModalContent}>
            <Text style={styles.langModalTitle}>{t.langSelect}</Text>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.langOption,
                    selectedLang === item.code && styles.langOptionActive,
                  ]}
                  onPress={() => {
                    setGlobalLang(item.code);
                    setIsLangModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.langOptionText,
                      selectedLang === item.code && styles.langOptionTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {selectedLang === item.code && (
                    <Ionicons name="checkmark-circle" size={20} color="#1F4D25" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Registration Modal */}
      <Modal
        visible={isRegModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsRegModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.regModalCard}>
            <View style={styles.regModalHeader}>
              <Text style={styles.regModalTitle}>{t.regTitle}</Text>
              <TouchableOpacity onPress={() => setIsRegModalVisible(false)}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            {!regType ? (
              <View style={{ marginTop: 8 }}>
                <Text style={styles.regModalSub}>{t.regSub}</Text>
                
                <TouchableOpacity
                  style={styles.regTypeCard}
                  onPress={() => setRegType('individual')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="person-circle-outline" size={32} color="#1F4D25" />
                  <View style={{ marginLeft: 14, flex: 1 }}>
                    <Text style={styles.regTypeTitle}>{t.indTitle}</Text>
                    <Text style={styles.regTypeSub}>{t.indSub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#1F4D25" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.regTypeCard}
                  onPress={() => setRegType('company')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="business-outline" size={32} color="#1F4D25" />
                  <View style={{ marginLeft: 14, flex: 1 }}>
                    <Text style={styles.regTypeTitle}>{t.compTitle}</Text>
                    <Text style={styles.regTypeSub}>{t.compSub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#1F4D25" />
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
                <TouchableOpacity onPress={() => setRegType(null)} style={styles.backLink}>
                  <Ionicons name="arrow-back" size={16} color="#1F4D25" />
                  <Text style={styles.backLinkText}>Back to options</Text>
                </TouchableOpacity>

                <Text style={styles.fieldLabel}>{t.fullNameLabel}</Text>
                <TextInput
                  style={styles.regTextInput}
                  placeholder={t.fullNamePlaceholder}
                  value={fullName}
                  onChangeText={setFullName}
                />

                <Text style={styles.fieldLabel}>{t.mobileLabel} *</Text>
                <TextInput
                  style={styles.regTextInput}
                  placeholder={t.mobilePlaceholder}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={regMobile}
                  onChangeText={setRegMobile}
                />

                <Text style={styles.fieldLabel}>{t.emailLabel}</Text>
                <TextInput
                  style={styles.regTextInput}
                  placeholder={t.emailPlaceholder}
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />

                {regType === 'individual' ? (
                  <>
                    <Text style={styles.fieldLabel}>{t.aadhaarLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.aadhaarPlaceholder}
                      keyboardType="number-pad"
                      maxLength={12}
                      value={aadhaar}
                      onChangeText={setAadhaar}
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.fieldLabel}>{t.compNameLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.compNamePlaceholder}
                      value={compName}
                      onChangeText={setCompName}
                    />

                    <Text style={styles.fieldLabel}>{t.gstinLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.gstinPlaceholder}
                      maxLength={15}
                      value={gstin}
                      onChangeText={setGstin}
                    />
                  </>
                )}

                <TouchableOpacity
                  style={styles.submitRegBtn}
                  onPress={handleRegisterSubmit}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitRegBtnText}>{t.submitReg}</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  mainCard: {
    width: '100%',
    maxWidth: 1060,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E5DA',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  mainCardDesktop: {
    flexDirection: 'row',
    minHeight: 560,
  },
  /* Left Panel */
  leftPanel: {
    padding: 32,
    backgroundColor: '#F8F6F0',
    justifyContent: 'space-between',
  },
  leftPanelDesktop: {
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: '#ECE8DD',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    width: 44,
    height: 44,
  },
  brandTextCol: {
    marginLeft: 12,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F4D25',
    letterSpacing: 0.3,
  },
  brandSub: {
    fontSize: 12,
    color: '#666666',
    marginTop: 1,
  },
  headlineWrapper: {
    marginBottom: 12,
  },
  headlineDark: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    lineHeight: 32,
  },
  headlineGreen: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F4D25',
    lineHeight: 32,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 14,
  },
  orangeAccentBar: {
    width: 42,
    height: 3.5,
    backgroundColor: '#D96B27',
    borderRadius: 2,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  featureIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 14,
  },
  craftPhotoWrapper: {
    width: '100%',
    height: 195,
    borderRadius: 18,
    overflow: 'hidden',
  },
  craftPhotoImage: {
    width: '100%',
    height: '100%',
  },
  /* Right Panel */
  rightPanel: {
    padding: 36,
    justifyContent: 'center',
  },
  rightPanelDesktop: {
    width: '50%',
  },
  topLangRow: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DDD3',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  langPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginHorizontal: 6,
  },
  titleContainer: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  brandHighlight: {
    color: '#1F4D25',
  },
  loginSubText: {
    fontSize: 14,
    color: '#777777',
    marginTop: 4,
  },
  /* Role Cards */
  roleCardRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  roleCardActive: {
    backgroundColor: '#F0F7F1',
    borderColor: '#1F4D25',
    borderWidth: 1.5,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1F4D25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconWrapper: {
    marginBottom: 8,
  },
  roleCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
    textAlign: 'center',
  },
  roleCardTextActive: {
    color: '#1F4D25',
    fontWeight: 'bold',
  },
  /* Mobile Input */
  mobileInputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },
  mobileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DDD3',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  countryPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  verticalDivider: {
    width: 1,
    height: '55%',
    backgroundColor: '#E2E0D8',
    marginRight: 10,
  },
  mobileTextInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  /* Primary Button */
  sendOtpButton: {
    height: 52,
    backgroundColor: '#1F4D25',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#1F4D25',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  sendOtpButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  /* Register Link */
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newUserText: {
    fontSize: 14,
    color: '#666666',
  },
  registerLinkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F4D25',
  },
  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  langModalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  langModalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 14,
    textAlign: 'center',
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 4,
  },
  langOptionActive: {
    backgroundColor: '#F0F7F1',
  },
  langOptionText: {
    fontSize: 15,
    color: '#333333',
  },
  langOptionTextActive: {
    fontWeight: 'bold',
    color: '#1F4D25',
  },
  /* Registration Modal */
  regModalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    elevation: 6,
  },
  regModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEDF',
    paddingBottom: 10,
  },
  regModalTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  regModalSub: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  regTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F8F3',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  regTypeTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  regTypeSub: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backLinkText: {
    fontSize: 13,
    color: '#1F4D25',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 10,
    marginBottom: 6,
  },
  regTextInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0DDD3',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1A1A1A',
  },
  submitRegBtn: {
    height: 48,
    backgroundColor: '#1F4D25',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 6,
  },
  submitRegBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
