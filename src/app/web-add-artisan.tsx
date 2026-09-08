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
import { useGlobalLang, LangCode } from '@/utils/languageStore';

const TRANSLATIONS_ADD_ARTISAN = {
  hi: {
    districtLabel: 'जिला: रायपुर, छत्तीसगढ़ ⌄',
    helperRole: 'सहायक (Helper)',
    userName: 'राजेश कुमार',
    dashboard: 'डैशबोर्ड',
    addArtisan: 'नया कारीगर जोड़ें',
    postProduct: 'उत्पाद पोस्ट करें',
    viewArtisans: 'कारीगर देखें',
    myPosts: 'मेरी पोस्ट',
    myProfile: 'मेरा प्रोफाइल',
    logout: 'लॉग आउट',
    helpNeededTitle: 'सहायता चाहिए?',
    helpNeededSub: 'किसी भी समस्या के लिए संपर्क करें।',
    helpCenterBtn: 'सहायता केंद्र',
    breadcrumb: 'डैशबोर्ड > नया कारीगर जोड़ें',
    pageTitle: 'नया कारीगर जोड़ें',
    pageSubtitle: 'कारीगर का प्रोफाइल बनाएं और उन्हें कलासेतु से जोड़ें।',
    dataSecurityTitle: 'आर्टिजन का डेटा सुरक्षित है',
    dataSecuritySub: 'सभी जानकारी केवल कलासेतु प्लेटफॉर्म पर सुरक्षित रहेगी।',
    step1Title: 'व्यक्तिगत जानकारी',
    step2Title: 'पता और संपर्क',
    step3Title: 'कला/कौशल जानकारी',
    step4Title: 'पूरा करें',
    photoLabel: 'कारीगर का फोटो',
    uploadPhotoBtn: 'फोटो अपलोड करें',
    uploadPhotoLimit: 'JPG, PNG (अधिकतम 5MB)',
    photoTip: 'ⓘ साफ और सामने से ली गई फोटो अपलोड करें।',
    fullNameLabel: 'पूरा नाम *',
    fullNamePlaceholder: 'उदा. सुनीता देवी',
    genderLabel: 'लिंग *',
    genderPlaceholder: 'चुनें ⌄',
    dobLabel: 'जन्म तिथि',
    dobPlaceholder: 'DD/MM/YYYY',
    mobileLabel: 'मोबाइल नंबर *',
    mobilePlaceholder: 'मोबाइल नंबर दर्ज करें',
    aadhaarLabel: 'आधार नंबर (वैकल्पिक)',
    aadhaarPlaceholder: '12 अंकों का आधार नंबर',
    emailLabel: 'ईमेल (वैकल्पिक)',
    emailPlaceholder: 'ईमेल दर्ज करें',
    bioLabel: 'परिचय / संक्षिप्त विवरण (वैकल्पिक)',
    bioPlaceholder: 'कारीगर के बारे में कुछ जानकारी लिखें...',
    cancelBtn: 'रद्द करें',
    proceedBtn: 'आगे बढ़ें →',
    benefitsTitle: 'कारीगर जोड़ने के फायदे',
    benefit1Title: 'उनकी कला को मिलेगा पहचान',
    benefit1Desc: 'कारीगर के उत्पाद देशभर के लोगों तक पहुंचेंगे।',
    benefit2Title: 'अधिक बिक्री के अवसर',
    benefit2Desc: 'ऑनलाइन प्लेटफॉर्म पर अधिक ग्राहक मिलेंगे।',
    benefit3Title: 'आसान और सुरक्षित',
    benefit3Desc: 'हमारा प्लेटफॉर्म कारीगरों के लिए सुरक्षित और भरोसेमंद है।',
    noteTitle: 'ध्यान दें',
    noteBullet1: '• सभी जानकारी कारीगर की सहमति से ही दर्ज करें।',
    noteBullet2: '• गलत जानकारी दर्ज करने से प्रोफाइल अप्रूव नहीं होगा।',
    footerLeft: '© 2025 कलासेतु | जिला सहायता केंद्र पोर्टल',
    footerRight: 'संस्करण 1.0.0',
  },
  en: {
    districtLabel: 'District: Raipur, CG ⌄',
    helperRole: 'Assistant (Helper)',
    userName: 'Rajesh Kumar',
    dashboard: 'Dashboard',
    addArtisan: 'Add New Artisan',
    postProduct: 'Post Product',
    viewArtisans: 'View Artisans',
    myPosts: 'My Posts',
    myProfile: 'My Profile',
    logout: 'Logout',
    helpNeededTitle: 'Need Help?',
    helpNeededSub: 'Contact us for any assistance.',
    helpCenterBtn: 'Help Centre',
    breadcrumb: 'Dashboard > Add New Artisan',
    pageTitle: 'Add New Artisan',
    pageSubtitle: 'Create artisan profile and connect them to KalaSetu.',
    dataSecurityTitle: 'Artisan Data is Secured',
    dataSecuritySub: 'All information will remain strictly confidential on KalaSetu.',
    step1Title: 'Personal Information',
    step2Title: 'Address & Contact',
    step3Title: 'Craft & Skill Details',
    step4Title: 'Complete',
    photoLabel: 'Artisan Photo',
    uploadPhotoBtn: 'Upload Photo',
    uploadPhotoLimit: 'JPG, PNG (Max 5MB)',
    photoTip: 'ⓘ Upload clear front-facing photo.',
    fullNameLabel: 'Full Name *',
    fullNamePlaceholder: 'e.g. Seema Devi',
    genderLabel: 'Gender *',
    genderPlaceholder: 'Select ⌄',
    dobLabel: 'Date of Birth',
    dobPlaceholder: 'DD/MM/YYYY',
    mobileLabel: 'Mobile Number *',
    mobilePlaceholder: 'Enter mobile number',
    aadhaarLabel: 'Aadhaar Number (Optional)',
    aadhaarPlaceholder: '12-digit Aadhaar number',
    emailLabel: 'Email (Optional)',
    emailPlaceholder: 'Enter email address',
    bioLabel: 'Bio / Short Description (Optional)',
    bioPlaceholder: 'Write brief background about the artisan...',
    cancelBtn: 'Cancel',
    proceedBtn: 'Proceed →',
    benefitsTitle: 'Benefits of Registering Artisan',
    benefit1Title: 'Nationwide Recognition',
    benefit1Desc: 'Artisan products will reach customers across India.',
    benefit2Title: 'Higher Sales Opportunities',
    benefit2Desc: 'Gain access to more buyers via online portal.',
    benefit3Title: 'Easy & Secure',
    benefit3Desc: 'Our platform is trusted and 100% secure.',
    noteTitle: 'Important Note',
    noteBullet1: '• Register details with explicit artisan consent.',
    noteBullet2: '• Incorrect information may lead to rejection.',
    footerLeft: '© 2025 KalaSetu | District Helpdesk Portal',
    footerRight: 'Version 1.0.0',
  },
};

export default function WebAddArtisanScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang, setSelectedLang] = useGlobalLang();
  const [currentStep, setCurrentStep] = useState(1);

  // Form Field States
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('female');
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  const t = TRANSLATIONS_ADD_ARTISAN[selectedLang as keyof typeof TRANSLATIONS_ADD_ARTISAN] || TRANSLATIONS_ADD_ARTISAN.en;
  const isHindi = selectedLang === 'hi';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          {/* Left District Location Dropdown */}
          <TouchableOpacity style={styles.districtLocationDropdownBtn} activeOpacity={0.8}>
            <Ionicons name="location-outline" size={16} color="#444444" style={{ marginRight: 6 }} />
            <Text style={styles.districtLocationText}>{t.districtLabel}</Text>
          </TouchableOpacity>

          {/* Right Header Controls */}
          <View style={styles.headerRightActions}>

            {/* Notification Bell */}
            <TouchableOpacity style={styles.notificationBellBtn}>
              <Ionicons name="notifications-outline" size={20} color="#333333" />
              <View style={styles.bellBadgeCircle}>
                <Text style={styles.bellBadgeText}>3</Text>
              </View>
            </TouchableOpacity>

            {/* Helper User Badge Dropdown */}
            <TouchableOpacity style={styles.helperProfileBadgeBtn}>
              <View style={styles.helperAvatarCircle}>
                <Text style={styles.helperAvatarText}>RK</Text>
              </View>
              <View style={{ gap: 1 }}>
                <Text style={styles.helperNameText}>{t.userName}</Text>
                <Text style={styles.helperRoleSubText}>{t.helperRole}</Text>
              </View>
              <Ionicons name="chevron-down" size={14} color="#666666" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main 2-Column Layout */}
        <View style={styles.mainLayoutRow}>
          {/* Left Helper Sidebar Navigation */}
          {isDesktop && (
            <View style={styles.sidebarCol}>
              <View style={styles.sidebarTopGroup}>
                {/* Brand Header */}
                <View style={styles.sidebarHeaderBrand}>
                  <TouchableOpacity onPress={() => router.push('/web-helper')}>
                    <Image
                      source={require('@/assets/images/logo_icon.png')}
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <View style={styles.subBrandTag}>
                    <Text style={styles.subBrandTagText}>जिला सहायता केंद्र</Text>
                  </View>
                </View>

                {/* Menu Items */}
                <View style={styles.sidebarMenuGroup}>
                  {/* 1. डैशबोर्ड */}
                  <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-helper')}>
                    <Ionicons name="home-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.dashboard}</Text>
                  </TouchableOpacity>

                  {/* 2. नया कारीगर जोड़ें (Active) */}
                  <TouchableOpacity style={[styles.sidebarNavItem, styles.sidebarNavItemActive]}>
                    <Ionicons name="person-add" size={18} color="#3B6029" style={{ marginRight: 12 }} />
                    <Text style={[styles.sidebarNavText, styles.sidebarNavTextActive]}>{t.addArtisan}</Text>
                  </TouchableOpacity>

                  {/* 3. उत्पाद पोस्ट करें */}
                  <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-post-product')}>
                    <Ionicons name="cube-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.postProduct}</Text>
                  </TouchableOpacity>

                  {/* 4. कारीगर देखें */}
                  <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-view-artisans')}>
                    <Ionicons name="people-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.viewArtisans}</Text>
                  </TouchableOpacity>

                  {/* 5. मेरी पोस्ट */}
                  <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-my-posts')}>
                    <Ionicons name="document-text-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.myPosts}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Bottom Sidebar Group */}
              <View style={styles.sidebarBottomGroup}>
                <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-helper-profile')}>
                  <Ionicons name="person-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                  <Text style={styles.sidebarNavText}>{t.myProfile}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-login')}>
                  <Ionicons name="log-out-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                  <Text style={styles.sidebarNavText}>{t.logout}</Text>
                </TouchableOpacity>

                {/* Sidebar Bottom Help Card */}
                <View style={styles.sidebarHelpCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <Ionicons name="headset-outline" size={16} color="#333333" style={{ marginRight: 6 }} />
                    <Text style={styles.sidebarHelpTitle}>{t.helpNeededTitle}</Text>
                  </View>
                  <Text style={styles.sidebarHelpSub}>{t.helpNeededSub}</Text>

                  <TouchableOpacity
                    style={styles.sidebarHelpOutlineBtn}
                    onPress={() => router.push('/web-help')}
                  >
                    <Text style={styles.sidebarHelpOutlineBtnText}>{t.helpCenterBtn}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Right Main Scroll Content */}
          <ScrollView style={styles.mainScrollView} contentContainerStyle={styles.scrollContentContainer} showsVerticalScrollIndicator={false}>
            {/* Header Title Section */}
            <View style={styles.headerTitleRow}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <TouchableOpacity onPress={() => router.push('/web-helper')} activeOpacity={0.7}>
                    <Text style={[styles.breadcrumbText, { color: '#3B6029', fontWeight: 'bold' }]}>
                      {isHindi ? 'डैशबोर्ड' : 'Dashboard'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.breadcrumbText}> {'>'} {isHindi ? 'नया कारीगर जोड़ें' : 'Add New Artisan'}</Text>
                </View>

                <Text style={styles.pageTitleText}>{t.pageTitle}</Text>
                <Text style={styles.pageSubtitleText}>{t.pageSubtitle}</Text>
              </View>

              {/* Data Security Badge Box */}
              <View style={styles.dataSecurityCard}>
                <Ionicons name="shield-checkmark" size={24} color="#3B6029" style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.dataSecurityTitle}>{t.dataSecurityTitle}</Text>
                  <Text style={styles.dataSecuritySub}>{t.dataSecuritySub}</Text>
                </View>
              </View>
            </View>

            {/* Stepper Progress Bar Card */}
            <View style={styles.stepperCard}>
              {/* Step 1 */}
              <View style={styles.stepProgressItem}>
                <View style={[styles.stepCircleIcon, currentStep >= 1 ? styles.stepCircleActive : styles.stepCircleInactive]}>
                  <Text style={[styles.stepNumberText, currentStep >= 1 && styles.stepNumberTextActive]}>1</Text>
                </View>
                <Text style={[styles.stepLabelText, currentStep >= 1 && styles.stepLabelTextActive]}>{t.step1Title}</Text>
              </View>
              <View style={[styles.stepLine, currentStep >= 2 ? styles.stepLineActive : styles.stepLineInactive]} />

              {/* Step 2 */}
              <View style={styles.stepProgressItem}>
                <View style={[styles.stepCircleIcon, currentStep >= 2 ? styles.stepCircleActive : styles.stepCircleInactive]}>
                  <Text style={[styles.stepNumberText, currentStep >= 2 && styles.stepNumberTextActive]}>2</Text>
                </View>
                <Text style={[styles.stepLabelText, currentStep >= 2 && styles.stepLabelTextActive]}>{t.step2Title}</Text>
              </View>
              <View style={[styles.stepLine, currentStep >= 3 ? styles.stepLineActive : styles.stepLineInactive]} />

              {/* Step 3 */}
              <View style={styles.stepProgressItem}>
                <View style={[styles.stepCircleIcon, currentStep >= 3 ? styles.stepCircleActive : styles.stepCircleInactive]}>
                  <Text style={[styles.stepNumberText, currentStep >= 3 && styles.stepNumberTextActive]}>3</Text>
                </View>
                <Text style={[styles.stepLabelText, currentStep >= 3 && styles.stepLabelTextActive]}>{t.step3Title}</Text>
              </View>
              <View style={[styles.stepLine, currentStep >= 4 ? styles.stepLineActive : styles.stepLineInactive]} />

              {/* Step 4 */}
              <View style={styles.stepProgressItem}>
                <View style={[styles.stepCircleIcon, currentStep >= 4 ? styles.stepCircleActive : styles.stepCircleInactive]}>
                  <Text style={[styles.stepNumberText, currentStep >= 4 && styles.stepNumberTextActive]}>4</Text>
                </View>
                <Text style={[styles.stepLabelText, currentStep >= 4 && styles.stepLabelTextActive]}>{t.step4Title}</Text>
              </View>
            </View>

            {/* Form & Tips 2-Column Row */}
            <View style={styles.formAndTipsRow}>
              {/* Left Form Card (Width ~ 68%) */}
              <View style={styles.formMainCard}>
                <Text style={styles.formSectionTitle}>{t.step1Title}</Text>

                <View style={styles.photoAndFieldsRow}>
                  {/* Photo Upload Box */}
                  <View style={styles.photoUploadCol}>
                    <Text style={styles.fieldLabelText}>{t.photoLabel}</Text>
                    <View style={styles.photoDashedBox}>
                      <View style={styles.cameraIconCircle}>
                        <Ionicons name="camera-outline" size={24} color="#3B6029" />
                      </View>
                      <Text style={styles.uploadPhotoBtnText}>{t.uploadPhotoBtn}</Text>
                      <Text style={styles.uploadPhotoLimitText}>{t.uploadPhotoLimit}</Text>
                    </View>
                    <Text style={styles.photoTipText}>{t.photoTip}</Text>
                  </View>

                  {/* Form Grid Fields */}
                  <View style={styles.formFieldsGridCol}>
                    {/* Row 1: Full Name & Gender */}
                    <View style={styles.formTwoColRow}>
                      <View style={styles.formFieldFlex}>
                        <Text style={styles.fieldLabelText}>{t.fullNameLabel}</Text>
                        <TextInput
                          placeholder={t.fullNamePlaceholder}
                          placeholderTextColor="#888888"
                          value={fullName}
                          onChangeText={setFullName}
                          style={styles.textInputBox}
                        />
                      </View>

                      <View style={styles.formFieldFlex}>
                        <Text style={styles.fieldLabelText}>{t.genderLabel}</Text>
                        <TouchableOpacity style={styles.dropdownSelectBox}>
                          <Text style={styles.dropdownSelectText}>
                            {gender === 'female' ? (isHindi ? 'महिला' : 'Female') : (isHindi ? 'पुरुष' : 'Male')}
                          </Text>
                          <Ionicons name="chevron-down" size={14} color="#666666" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Row 2: DOB & Mobile */}
                    <View style={styles.formTwoColRow}>
                      <View style={styles.formFieldFlex}>
                        <Text style={styles.fieldLabelText}>{t.dobLabel}</Text>
                        <View style={styles.inputWithIconWrapper}>
                          <TextInput
                            placeholder={t.dobPlaceholder}
                            placeholderTextColor="#888888"
                            value={dob}
                            onChangeText={setDob}
                            style={styles.textInputFlex}
                          />
                          <Ionicons name="calendar-outline" size={16} color="#777777" />
                        </View>
                      </View>

                      <View style={styles.formFieldFlex}>
                        <Text style={styles.fieldLabelText}>{t.mobileLabel}</Text>
                        <View style={styles.mobileInputPrefixWrapper}>
                          <View style={styles.prefixPill}>
                            <Text style={styles.prefixPillText}>+91</Text>
                          </View>
                          <TextInput
                            placeholder={t.mobilePlaceholder}
                            placeholderTextColor="#888888"
                            value={mobile}
                            onChangeText={setMobile}
                            keyboardType="phone-pad"
                            style={styles.textInputFlex}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Row 3: Aadhaar & Email */}
                    <View style={styles.formTwoColRow}>
                      <View style={styles.formFieldFlex}>
                        <Text style={styles.fieldLabelText}>{t.aadhaarLabel}</Text>
                        <TextInput
                          placeholder={t.aadhaarPlaceholder}
                          placeholderTextColor="#888888"
                          value={aadhaar}
                          onChangeText={setAadhaar}
                          keyboardType="number-pad"
                          style={styles.textInputBox}
                        />
                      </View>

                      <View style={styles.formFieldFlex}>
                        <Text style={styles.fieldLabelText}>{t.emailLabel}</Text>
                        <TextInput
                          placeholder={t.emailPlaceholder}
                          placeholderTextColor="#888888"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          style={styles.textInputBox}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Bio Textarea */}
                <View style={{ marginTop: 16 }}>
                  <Text style={styles.fieldLabelText}>{t.bioLabel}</Text>
                  <View style={styles.textareaWrapper}>
                    <TextInput
                      placeholder={t.bioPlaceholder}
                      placeholderTextColor="#888888"
                      value={bio}
                      onChangeText={setBio}
                      multiline
                      numberOfLines={4}
                      style={styles.textareaFlex}
                    />
                    <Text style={styles.charCountText}>{bio.length}/200</Text>
                  </View>
                </View>

                {/* Form Action Buttons */}
                <View style={styles.formActionButtonsRow}>
                  <TouchableOpacity
                    style={styles.cancelOutlineBtn}
                    onPress={() => router.push('/web-helper')}
                  >
                    <Text style={styles.cancelOutlineBtnText}>{t.cancelBtn}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.proceedSolidBtn}
                    onPress={() => alert(isHindi ? 'कारीगर जानकारी सफलतापूर्वक सहेजी गई!' : 'Artisan info saved successfully!')}
                  >
                    <Text style={styles.proceedSolidBtnText}>{t.proceedBtn}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Right Side Tips & Benefits Cards (Width ~ 30%) */}
              <View style={styles.rightSideTipsCol}>
                {/* Benefits Card */}
                <View style={styles.benefitsCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                    <Ionicons name="people-outline" size={20} color="#3B6029" style={{ marginRight: 8 }} />
                    <Text style={styles.benefitsCardTitle}>{t.benefitsTitle}</Text>
                  </View>

                  {/* Item 1 */}
                  <View style={styles.benefitItemRow}>
                    <View style={styles.benefitIconCircle}>
                      <Ionicons name="person-outline" size={16} color="#3B6029" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.benefitItemTitle}>{t.benefit1Title}</Text>
                      <Text style={styles.benefitItemDesc}>{t.benefit1Desc}</Text>
                    </View>
                  </View>

                  {/* Item 2 */}
                  <View style={styles.benefitItemRow}>
                    <View style={styles.benefitIconCircle}>
                      <Ionicons name="bag-handle-outline" size={16} color="#3B6029" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.benefitItemTitle}>{t.benefit2Title}</Text>
                      <Text style={styles.benefitItemDesc}>{t.benefit2Desc}</Text>
                    </View>
                  </View>

                  {/* Item 3 */}
                  <View style={styles.benefitItemRow}>
                    <View style={styles.benefitIconCircle}>
                      <Ionicons name="shield-checkmark-outline" size={16} color="#3B6029" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.benefitItemTitle}>{t.benefit3Title}</Text>
                      <Text style={styles.benefitItemDesc}>{t.benefit3Desc}</Text>
                    </View>
                  </View>
                </View>

                {/* Important Note Card */}
                <View style={styles.importantNoteCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Ionicons name="bulb-outline" size={18} color="#E65100" style={{ marginRight: 6 }} />
                    <Text style={styles.importantNoteTitle}>{t.noteTitle}</Text>
                  </View>
                  <Text style={styles.noteBulletText}>{t.noteBullet1}</Text>
                  <Text style={styles.noteBulletText}>{t.noteBullet2}</Text>
                </View>
              </View>
            </View>

            {/* Footer Bar */}
            <View style={styles.footerBarRow}>
              <Text style={styles.footerLeftText}>{t.footerLeft}</Text>
              <Text style={styles.footerRightText}>{t.footerRight}</Text>
            </View>
          </ScrollView>
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#EBEBEB',
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  districtLocationDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  districtLocationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  langSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    padding: 2,
  },
  langSegmentBtn: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  langSegmentBtnActive: {
    backgroundColor: '#E65100',
  },
  langSegmentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555555',
  },
  langSegmentTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  notificationBellBtn: {
    position: 'relative',
    padding: 4,
  },
  bellBadgeCircle: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: '#C62828',
    borderRadius: 8,
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  helperProfileBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  helperAvatarCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#3B6029',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  helperAvatarText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  helperNameText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  helperRoleSubText: {
    fontSize: 10,
    color: '#666666',
  },

  /* Main Layout */
  mainLayoutRow: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarCol: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderColor: '#EBEBEB',
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  sidebarHeaderBrand: {
    paddingHorizontal: 8,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  logoImage: {
    width: 150,
    height: 44,
  },
  subBrandTag: {
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginTop: 2,
  },
  subBrandTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  sidebarTopGroup: {
    gap: 4,
  },
  sidebarBottomGroup: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    gap: 8,
  },
  sidebarMenuGroup: {
    gap: 4,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  sidebarNavItemActive: {
    backgroundColor: '#E8F5E9',
  },
  sidebarNavText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
  },
  sidebarNavTextActive: {
    color: '#3B6029',
    fontWeight: 'bold',
  },
  sidebarHelpCard: {
    backgroundColor: '#FAF8F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 12,
    marginTop: 8,
  },
  sidebarHelpTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  sidebarHelpSub: {
    fontSize: 10,
    color: '#777777',
    marginBottom: 8,
  },
  sidebarHelpOutlineBtn: {
    borderWidth: 1,
    borderColor: '#3B6029',
    borderRadius: 6,
    paddingVertical: 4,
    alignItems: 'center',
  },
  sidebarHelpOutlineBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3B6029',
  },

  /* Scroll Body */
  mainScrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 24,
    gap: 20,
  },

  /* Header Title Row */
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  breadcrumbText: {
    fontSize: 12,
    color: '#777777',
  },
  pageTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 2,
  },
  pageSubtitleText: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  dataSecurityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F9F2',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dataSecurityTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  dataSecuritySub: {
    fontSize: 11,
    color: '#555555',
  },

  /* Stepper Card */
  stepperCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  stepProgressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepCircleIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#3B6029',
  },
  stepCircleInactive: {
    backgroundColor: '#E0E0E0',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
  },
  stepNumberTextActive: {
    color: '#FFFFFF',
  },
  stepLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888888',
  },
  stepLabelTextActive: {
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 16,
  },
  stepLineActive: {
    backgroundColor: '#3B6029',
  },
  stepLineInactive: {
    backgroundColor: '#E0E0E0',
  },

  /* Form & Tips Row */
  formAndTipsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  formMainCard: {
    flex: 2.3,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 24,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  photoAndFieldsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  photoUploadCol: {
    width: 170,
    gap: 6,
  },
  fieldLabelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  photoDashedBox: {
    backgroundColor: '#F8FAF8',
    borderWidth: 1.5,
    borderColor: '#A5D6A7',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 180,
  },
  cameraIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPhotoBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  uploadPhotoLimitText: {
    fontSize: 10,
    color: '#888888',
    textAlign: 'center',
  },
  photoTipText: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
  },

  /* Form Fields Grid */
  formFieldsGridCol: {
    flex: 1,
    gap: 16,
  },
  formTwoColRow: {
    flexDirection: 'row',
    gap: 14,
  },
  formFieldFlex: {
    flex: 1,
  },
  textInputBox: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
    fontSize: 13,
    color: '#333333',
  },
  dropdownSelectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
  },
  dropdownSelectText: {
    fontSize: 13,
    color: '#333333',
  },
  inputWithIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
  },
  textInputFlex: {
    flex: 1,
    fontSize: 13,
    color: '#333333',
  },
  mobileInputPrefixWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 8,
    overflow: 'hidden',
    height: 38,
  },
  prefixPill: {
    backgroundColor: '#EBEBEB',
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#D8D8D8',
  },
  prefixPillText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#444444',
  },

  /* Textarea */
  textareaWrapper: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 8,
    padding: 12,
  },
  textareaFlex: {
    height: 80,
    fontSize: 13,
    color: '#333333',
    textAlignVertical: 'top',
  },
  charCountText: {
    fontSize: 11,
    color: '#888888',
    alignSelf: 'flex-end',
  },

  /* Form Action Buttons */
  formActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  cancelOutlineBtn: {
    borderWidth: 1,
    borderColor: '#3B6029',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  cancelOutlineBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  proceedSolidBtn: {
    backgroundColor: '#3B6029',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  proceedSolidBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /* Right Tips Column */
  rightSideTipsCol: {
    flex: 1,
    gap: 16,
  },
  benefitsCard: {
    backgroundColor: '#F2F9F2',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 16,
    padding: 20,
  },
  benefitsCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  benefitItemRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  benefitIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitItemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  benefitItemDesc: {
    fontSize: 11,
    color: '#555555',
    marginTop: 2,
  },
  importantNoteCard: {
    backgroundColor: '#FFF8F0',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  importantNoteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E65100',
  },
  noteBulletText: {
    fontSize: 11,
    color: '#666666',
    lineHeight: 16,
  },

  /* Footer */
  footerBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    paddingTop: 16,
    marginTop: 10,
  },
  footerLeftText: {
    fontSize: 12,
    color: '#777777',
  },
  footerRightText: {
    fontSize: 12,
    color: '#888888',
  },
});
