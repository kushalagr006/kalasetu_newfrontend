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
    loginSub: 'Login with your Email & Password to continue',
    roleGovt: 'Government Buyer',
    roleCust: 'Customer / Buyer',
    emailLoginLabel: 'Email ID',
    emailLoginPlaceholder: 'Enter your email address',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    loginBtn: 'Login',
    forgotPassword: 'Forgot Password?',
    newUser: 'New user? ',
    register: 'Register',
    errEmailLogin: 'Please enter a valid email address.',
    errPassword: 'Please enter your password.',
    langSelect: 'Select Language / भाषा चुनें',
    regTitle: 'Create New Account',
    regSub: 'Select your account role to proceed',
    roleIndTitle: 'Individual',
    roleIndSub: 'Name, Phone, Email, Password',
    roleCompTitle: 'Private Company',
    roleCompSub: 'Company Name, GST, Authorized Person, Phone, Email, Password',
    roleNgoTitle: 'NGO',
    roleNgoSub: 'NGO Name, Registration No., Authorized Person, Phone, Email, Password',
    roleOrgTitle: 'Organization',
    roleOrgSub: 'Organization Name, Type, Registration No., Authorized Person, Phone, Email, Password',

    nameLabel: 'Full Name *',
    namePlaceholder: 'Enter full name',
    phoneLabel: 'Phone Number *',
    phonePlaceholder: 'Enter 10-digit phone number',
    emailLabel: 'Email ID *',
    emailPlaceholder: 'Enter email address',
    regPasswordLabel: 'Password *',
    regPasswordPlaceholder: 'Enter password (min 6 characters)',
    
    compNameLabel: 'Company Name *',
    compNamePlaceholder: 'Enter company name',
    gstinLabel: 'GSTIN Number *',
    gstinPlaceholder: 'Enter 15-digit GSTIN',

    ngoNameLabel: 'NGO Name *',
    ngoNamePlaceholder: 'Enter NGO name',
    ngoRegNoLabel: 'NGO Registration No. *',
    ngoRegNoPlaceholder: 'Enter NGO registration number',

    orgNameLabel: 'Organization Name *',
    orgNamePlaceholder: 'Enter organization name',
    orgTypeLabel: 'Organization Type *',
    orgTypePlaceholder: 'e.g. Govt, Semi-Govt, PSU, Cooperative',
    orgRegNoLabel: 'Registration Number *',
    orgRegNoPlaceholder: 'Enter registration number',

    authPersonLabel: 'Authorized Person Name *',
    authPersonPlaceholder: 'Enter name of authorized person',

    submitReg: 'Create Account →',
    errName: 'Please enter full name',
    errPhone: 'Please enter valid 10-digit phone number',
    errEmail: 'Please enter a valid email address',
    errRegPassword: 'Please enter password (min 6 characters)',
    errCompName: 'Please enter company name',
    errGstin: 'Please enter 15-digit GSTIN',
    errNgoName: 'Please enter NGO name',
    errNgoRegNo: 'Please enter NGO registration number',
    errOrgName: 'Please enter organization name',
    errOrgType: 'Please enter organization type',
    errOrgRegNo: 'Please enter organization registration number',
    errAuthPerson: 'Please enter authorized person name',

    successReg: 'Account Created Successfully!',
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
    welcome: 'कलासेतु में आपका स्वागत है ',
    loginSub: 'जारी रखने के लिए अपने ईमेल और पासवर्ड से लॉगिन करें',
    roleGovt: 'सरकारी खरीदार',
    roleCust: 'ग्राहक / खरीदार',
    emailLoginLabel: 'ईमेल आईडी',
    emailLoginPlaceholder: 'अपनी ईमेल आईडी दर्ज करें',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    loginBtn: 'लॉगिन करें',
    forgotPassword: 'पासवर्ड भूल गए?',
    newUser: 'नया खाता बनाएं? ',
    register: 'रजिस्ट्रेशन करें',
    errEmailLogin: 'कृपया एक वैध ईमेल आईडी दर्ज करें।',
    errPassword: 'कृपया अपना पासवर्ड दर्ज करें।',
    langSelect: 'भाषा चुनें / Select Language',
    regTitle: 'नया खाता बनाएं',
    regSub: 'आगे बढ़ने के लिए खाता रोल चुनें',
    roleIndTitle: 'व्यक्तिगत (Individual)',
    roleIndSub: 'नाम, फोन, ईमेल, पासवर्ड',
    roleCompTitle: 'प्राइवेट कंपनी (Private Company)',
    roleCompSub: 'कंपनी नाम, GST, अधिकृत व्यक्ति, फोन, ईमेल, पासवर्ड',
    roleNgoTitle: 'एनजीओ (NGO)',
    roleNgoSub: 'NGO नाम, पंजीकरण संख्या, अधिकृत व्यक्ति, फोन, ईमेल, पासवर्ड',
    roleOrgTitle: 'संस्था (Organization)',
    roleOrgSub: 'संस्था नाम, प्रकार, पंजीकरण संख्या, अधिकृत व्यक्ति, फोन, ईमेल, पासवर्ड',

    nameLabel: 'पूरा नाम *',
    namePlaceholder: 'अपना पूरा नाम दर्ज करें',
    phoneLabel: 'फोन नंबर *',
    phonePlaceholder: '10 अंकों का फोन नंबर दर्ज करें',
    emailLabel: 'ईमेल आईडी *',
    emailPlaceholder: 'अपनी ईमेल आईडी दर्ज करें',
    regPasswordLabel: 'पासवर्ड *',
    regPasswordPlaceholder: 'पासवर्ड दर्ज करें (कम से कम 6 अक्षर)',
    
    compNameLabel: 'कंपनी का नाम *',
    compNamePlaceholder: 'कंपनी का नाम दर्ज करें',
    gstinLabel: 'जीएसटीआईएन (GSTIN) *',
    gstinPlaceholder: '15-अंकों का GSTIN दर्ज करें',

    ngoNameLabel: 'NGO का नाम *',
    ngoNamePlaceholder: 'NGO का नाम दर्ज करें',
    ngoRegNoLabel: 'NGO पंजीकरण संख्या *',
    ngoRegNoPlaceholder: 'NGO पंजीकरण संख्या दर्ज करें',

    orgNameLabel: 'संस्था का नाम (Organization Name) *',
    orgNamePlaceholder: 'संस्था का नाम दर्ज करें',
    orgTypeLabel: 'संस्था का प्रकार (Organization Type) *',
    orgTypePlaceholder: 'जैसे सरकारी, अर्ध-सरकारी, पीएसयू, सहकारी',
    orgRegNoLabel: 'पंजीकरण संख्या *',
    orgRegNoPlaceholder: 'पंजीकरण संख्या दर्ज करें',

    authPersonLabel: 'अधिकृत व्यक्ति का नाम *',
    authPersonPlaceholder: 'अधिकृत प्रतिनिधि का नाम दर्ज करें',

    submitReg: 'खाता बनाएं →',
    errName: 'कृपया पूरा नाम दर्ज करें',
    errPhone: 'कृपया 10 अंकों का वैध फोन नंबर दर्ज करें',
    errEmail: 'कृपया एक वैध ईमेल पता दर्ज करें',
    errRegPassword: 'कृपया पासवर्ड दर्ज करें (कम से कम 6 अक्षर)',
    errCompName: 'कृपया कंपनी का नाम दर्ज करें',
    errGstin: 'कृपया 15 अंकों का GSTIN दर्ज करें',
    errNgoName: 'कृपया NGO का नाम दर्ज करें',
    errNgoRegNo: 'कृपया NGO पंजीकरण संख्या दर्ज करें',
    errOrgName: 'कृपया संस्था का नाम दर्ज करें',
    errOrgType: 'कृपया संस्था का प्रकार दर्ज करें',
    errOrgRegNo: 'कृपया पंजीकरण संख्या दर्ज करें',
    errAuthPerson: 'कृपया अधिकृत व्यक्ति का नाम दर्ज करें',

    successReg: 'खाता सफलतापूर्वक बनाया गया!',
  },
};

type RegRoleType = 'individual' | 'private_company' | 'ngo' | 'organization' | null;

export default function WebLoginScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [globalLang, setGlobalLang] = useGlobalLang();
  const selectedLang: LangCode = globalLang === 'hi' ? 'hi' : 'en';
  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.en;

  const [selectedRole, setSelectedRole] = useState<RoleType>('govt');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [isRegModalVisible, setIsRegModalVisible] = useState(false);

  // Selected Registration Role
  const [regRole, setRegRole] = useState<RegRoleType>(null);

  // Form states for registration
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [compName, setCompName] = useState('');
  const [gstin, setGstin] = useState('');
  const [ngoName, setNgoName] = useState('');
  const [ngoRegNo, setNgoRegNo] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('');
  const [orgRegNo, setOrgRegNo] = useState('');
  const [authorizedPerson, setAuthorizedPerson] = useState('');

  const handleLogin = () => {
    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      alert(t.errEmailLogin);
      return;
    }
    if (!loginPassword.trim()) {
      alert(t.errPassword);
      return;
    }
    if (selectedRole === 'govt') {
      router.push('/govt-dashboard');
    } else {
      router.push('/customer-dashboard');
    }
  };

  const handleRegisterSubmit = () => {
    if (regRole === 'individual') {
      if (!regName.trim()) { alert(t.errName); return; }
      if (regPhone.length < 10) { alert(t.errPhone); return; }
      if (!regEmail.trim() || !regEmail.includes('@')) { alert(t.errEmail); return; }
      if (regPassword.length < 6) { alert(t.errRegPassword); return; }
    } else if (regRole === 'private_company') {
      if (!compName.trim()) { alert(t.errCompName); return; }
      if (gstin.length < 15) { alert(t.errGstin); return; }
      if (!authorizedPerson.trim()) { alert(t.errAuthPerson); return; }
      if (regPhone.length < 10) { alert(t.errPhone); return; }
      if (!regEmail.trim() || !regEmail.includes('@')) { alert(t.errEmail); return; }
      if (regPassword.length < 6) { alert(t.errRegPassword); return; }
    } else if (regRole === 'ngo') {
      if (!ngoName.trim()) { alert(t.errNgoName); return; }
      if (!ngoRegNo.trim()) { alert(t.errNgoRegNo); return; }
      if (!authorizedPerson.trim()) { alert(t.errAuthPerson); return; }
      if (regPhone.length < 10) { alert(t.errPhone); return; }
      if (!regEmail.trim() || !regEmail.includes('@')) { alert(t.errEmail); return; }
      if (regPassword.length < 6) { alert(t.errRegPassword); return; }
    } else if (regRole === 'organization') {
      if (!orgName.trim()) { alert(t.errOrgName); return; }
      if (!orgType.trim()) { alert(t.errOrgType); return; }
      if (!orgRegNo.trim()) { alert(t.errOrgRegNo); return; }
      if (!authorizedPerson.trim()) { alert(t.errAuthPerson); return; }
      if (regPhone.length < 10) { alert(t.errPhone); return; }
      if (!regEmail.trim() || !regEmail.includes('@')) { alert(t.errEmail); return; }
      if (regPassword.length < 6) { alert(t.errRegPassword); return; }
    }

    alert(t.successReg);
    setIsRegModalVisible(false);

    // Reset fields
    setRegRole(null);
    setRegName('');
    setRegPhone('');
    setRegEmail('');
    setRegPassword('');
    setCompName('');
    setGstin('');
    setNgoName('');
    setNgoRegNo('');
    setOrgName('');
    setOrgType('');
    setOrgRegNo('');
    setAuthorizedPerson('');

    if (regRole === 'organization') {
      router.push('/govt-dashboard');
    } else {
      router.push('/customer-dashboard');
    }
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

            {/* Email ID Input */}
            <Text style={styles.inputLabel}>{t.emailLoginLabel}</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder={t.emailLoginPlaceholder}
                placeholderTextColor="#999999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={loginEmail}
                onChangeText={setLoginEmail}
              />
            </View>

            {/* Password Input */}
            <View style={styles.passwordHeaderRow}>
              <Text style={styles.inputLabel}>{t.passwordLabel}</Text>
              <TouchableOpacity onPress={() => alert(selectedLang === 'hi' ? 'पासवर्ड रीसेट लिंक आपके ईमेल पर भेजा गया है।' : 'Password reset link sent to your email.')}>
                <Text style={styles.forgotPasswordText}>{t.forgotPassword}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder={t.passwordPlaceholder}
                placeholderTextColor="#999999"
                secureTextEntry={!showPassword}
                value={loginPassword}
                onChangeText={setLoginPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconBtn}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Login Primary Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.loginButtonText}>{t.loginBtn}</Text>
            </TouchableOpacity>

            {/* Register Link Row */}
            <View style={styles.registerRow}>
              <Text style={styles.newUserText}>{t.newUser}</Text>
              <TouchableOpacity
                onPress={() => {
                  setRegRole(null);
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

            {!regRole ? (
              <View style={{ marginTop: 8 }}>
                <Text style={styles.regModalSub}>{t.regSub}</Text>
                
                {/* 1. Individual */}
                <TouchableOpacity
                  style={styles.regTypeCard}
                  onPress={() => setRegRole('individual')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="person-circle-outline" size={30} color="#1F4D25" />
                  <View style={{ marginLeft: 14, flex: 1 }}>
                    <Text style={styles.regTypeTitle}>{t.roleIndTitle}</Text>
                    <Text style={styles.regTypeSub}>{t.roleIndSub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#1F4D25" />
                </TouchableOpacity>

                {/* 2. Private Company */}
                <TouchableOpacity
                  style={styles.regTypeCard}
                  onPress={() => setRegRole('private_company')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="business-outline" size={30} color="#1F4D25" />
                  <View style={{ marginLeft: 14, flex: 1 }}>
                    <Text style={styles.regTypeTitle}>{t.roleCompTitle}</Text>
                    <Text style={styles.regTypeSub}>{t.roleCompSub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#1F4D25" />
                </TouchableOpacity>

                {/* 3. NGO */}
                <TouchableOpacity
                  style={styles.regTypeCard}
                  onPress={() => setRegRole('ngo')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="people-outline" size={30} color="#1F4D25" />
                  <View style={{ marginLeft: 14, flex: 1 }}>
                    <Text style={styles.regTypeTitle}>{t.roleNgoTitle}</Text>
                    <Text style={styles.regTypeSub}>{t.roleNgoSub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#1F4D25" />
                </TouchableOpacity>

                {/* 4. Organization */}
                <TouchableOpacity
                  style={styles.regTypeCard}
                  onPress={() => setRegRole('organization')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="library-outline" size={30} color="#1F4D25" />
                  <View style={{ marginLeft: 14, flex: 1 }}>
                    <Text style={styles.regTypeTitle}>{t.roleOrgTitle}</Text>
                    <Text style={styles.regTypeSub}>{t.roleOrgSub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#1F4D25" />
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 460 }} showsVerticalScrollIndicator={false}>
                <TouchableOpacity onPress={() => setRegRole(null)} style={styles.backLink}>
                  <Ionicons name="arrow-back" size={16} color="#1F4D25" />
                  <Text style={styles.backLinkText}>
                    {selectedLang === 'hi' ? 'रोल चयन पर वापस जाएं' : 'Back to roles'}
                  </Text>
                </TouchableOpacity>

                {/* 1. INDIVIDUAL FORM */}
                {regRole === 'individual' && (
                  <>
                    <Text style={styles.fieldLabel}>{t.nameLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.namePlaceholder}
                      placeholderTextColor="#999999"
                      value={regName}
                      onChangeText={setRegName}
                    />

                    <Text style={styles.fieldLabel}>{t.phoneLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.phonePlaceholder}
                      placeholderTextColor="#999999"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={regPhone}
                      onChangeText={setRegPhone}
                    />

                    <Text style={styles.fieldLabel}>{t.emailLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.emailPlaceholder}
                      placeholderTextColor="#999999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={regEmail}
                      onChangeText={setRegEmail}
                    />

                    <Text style={styles.fieldLabel}>{t.regPasswordLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.regPasswordPlaceholder}
                      placeholderTextColor="#999999"
                      secureTextEntry
                      value={regPassword}
                      onChangeText={setRegPassword}
                    />
                  </>
                )}

                {/* 2. PRIVATE COMPANY FORM */}
                {regRole === 'private_company' && (
                  <>
                    <Text style={styles.fieldLabel}>{t.compNameLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.compNamePlaceholder}
                      placeholderTextColor="#999999"
                      value={compName}
                      onChangeText={setCompName}
                    />

                    <Text style={styles.fieldLabel}>{t.gstinLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.gstinPlaceholder}
                      placeholderTextColor="#999999"
                      maxLength={15}
                      autoCapitalize="characters"
                      value={gstin}
                      onChangeText={setGstin}
                    />

                    <Text style={styles.fieldLabel}>{t.authPersonLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.authPersonPlaceholder}
                      placeholderTextColor="#999999"
                      value={authorizedPerson}
                      onChangeText={setAuthorizedPerson}
                    />

                    <Text style={styles.fieldLabel}>{t.phoneLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.phonePlaceholder}
                      placeholderTextColor="#999999"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={regPhone}
                      onChangeText={setRegPhone}
                    />

                    <Text style={styles.fieldLabel}>{t.emailLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.emailPlaceholder}
                      placeholderTextColor="#999999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={regEmail}
                      onChangeText={setRegEmail}
                    />

                    <Text style={styles.fieldLabel}>{t.regPasswordLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.regPasswordPlaceholder}
                      placeholderTextColor="#999999"
                      secureTextEntry
                      value={regPassword}
                      onChangeText={setRegPassword}
                    />
                  </>
                )}

                {/* 3. NGO FORM */}
                {regRole === 'ngo' && (
                  <>
                    <Text style={styles.fieldLabel}>{t.ngoNameLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.ngoNamePlaceholder}
                      placeholderTextColor="#999999"
                      value={ngoName}
                      onChangeText={setNgoName}
                    />

                    <Text style={styles.fieldLabel}>{t.ngoRegNoLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.ngoRegNoPlaceholder}
                      placeholderTextColor="#999999"
                      value={ngoRegNo}
                      onChangeText={setNgoRegNo}
                    />

                    <Text style={styles.fieldLabel}>{t.authPersonLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.authPersonPlaceholder}
                      placeholderTextColor="#999999"
                      value={authorizedPerson}
                      onChangeText={setAuthorizedPerson}
                    />

                    <Text style={styles.fieldLabel}>{t.phoneLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.phonePlaceholder}
                      placeholderTextColor="#999999"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={regPhone}
                      onChangeText={setRegPhone}
                    />

                    <Text style={styles.fieldLabel}>{t.emailLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.emailPlaceholder}
                      placeholderTextColor="#999999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={regEmail}
                      onChangeText={setRegEmail}
                    />

                    <Text style={styles.fieldLabel}>{t.regPasswordLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.regPasswordPlaceholder}
                      placeholderTextColor="#999999"
                      secureTextEntry
                      value={regPassword}
                      onChangeText={setRegPassword}
                    />
                  </>
                )}

                {/* 4. ORGANIZATION FORM */}
                {regRole === 'organization' && (
                  <>
                    <Text style={styles.fieldLabel}>{t.orgNameLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.orgNamePlaceholder}
                      placeholderTextColor="#999999"
                      value={orgName}
                      onChangeText={setOrgName}
                    />

                    <Text style={styles.fieldLabel}>{t.orgTypeLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.orgTypePlaceholder}
                      placeholderTextColor="#999999"
                      value={orgType}
                      onChangeText={setOrgType}
                    />

                    <Text style={styles.fieldLabel}>{t.orgRegNoLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.orgRegNoPlaceholder}
                      placeholderTextColor="#999999"
                      value={orgRegNo}
                      onChangeText={setOrgRegNo}
                    />

                    <Text style={styles.fieldLabel}>{t.authPersonLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.authPersonPlaceholder}
                      placeholderTextColor="#999999"
                      value={authorizedPerson}
                      onChangeText={setAuthorizedPerson}
                    />

                    <Text style={styles.fieldLabel}>{t.phoneLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.phonePlaceholder}
                      placeholderTextColor="#999999"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={regPhone}
                      onChangeText={setRegPhone}
                    />

                    <Text style={styles.fieldLabel}>{t.emailLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.emailPlaceholder}
                      placeholderTextColor="#999999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={regEmail}
                      onChangeText={setRegEmail}
                    />

                    <Text style={styles.fieldLabel}>{t.regPasswordLabel}</Text>
                    <TextInput
                      style={styles.regTextInput}
                      placeholder={t.regPasswordPlaceholder}
                      placeholderTextColor="#999999"
                      secureTextEntry
                      value={regPassword}
                      onChangeText={setRegPassword}
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
  /* Form Inputs */
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0DDD3',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  passwordHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F4D25',
    marginBottom: 8,
  },
  eyeIconBtn: {
    padding: 4,
  },
  /* Primary Button */
  loginButton: {
    height: 52,
    backgroundColor: '#1F4D25',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#1F4D25',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  loginButtonText: {
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
