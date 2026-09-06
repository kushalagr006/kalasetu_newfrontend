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

const TRANSLATIONS_POST_PRODUCT = {
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
    breadcrumb: 'डैशबोर्ड > उत्पाद पोस्ट करें > नया उत्पाद',
    pageTitle: 'नया उत्पाद पोस्ट करें',
    pageSubtitle: 'कारीगर के उत्पाद की जानकारी भरें और ऑनलाइन पोस्ट करें।',
    step1Title: 'उत्पाद की जानकारी',
    step2Title: 'फोटो अपलोड करें',
    step3Title: 'पूर्वावलोकन और पुष्टि',
    step4Title: 'पोस्ट करें',
    selectArtisanLabel: 'कारीगर चुनें *',
    changeArtisanBtn: 'कारीगर बदलें',
    prodNameLabel: 'उत्पाद का नाम *',
    prodNamePlaceholder: 'जैसे - बाँस की टोकरी',
    categoryLabel: 'श्रेणी *',
    categoryPlaceholder: 'श्रेणी चुनें ⌄',
    subCategoryLabel: 'उप-श्रेणी',
    subCategoryPlaceholder: 'उप-श्रेणी चुनें ⌄',
    materialLabel: 'सामग्री / कच्चा माल *',
    materialPlaceholder: 'जैसे - बाँस, लकड़ी, मिट्टी आदि',
    descriptionLabel: 'उत्पाद का विवरण *',
    descriptionPlaceholder: 'इस उत्पाद की विशेषताएं, उपयोग, बनाने की विधि आदि लिखें...',
    makeTimeLabel: 'अनुमानित बनाने का समय',
    makeTimePlaceholder: 'जैसे - 2 दिन, 5 दिन आदि',
    priceLabel: 'कीमत (₹) *',
    pricePlaceholder: 'जैसे - 650',
    stockLabel: 'स्टॉक उपलब्धता',
    stockPlaceholder: 'उपलब्ध ⌄',
    deliveryTimeLabel: 'डिलीवरी समय (दिन)',
    deliveryTimePlaceholder: 'जैसे - 3 से 5 दिन',
    voiceInputTitle: 'आवाज से जानकारी भरें',
    voiceInputSub: 'आप बोलकर भी उत्पाद की जानकारी भर सकते हैं।',
    speakInputBtn: 'बोलकर भरें',
    proceedBtn: 'आगे बढ़ें →',
    tipsTitle: 'जानकारी भरने के सुझाव',
    tip1: 'सही जानकारी भरें जिससे ग्राहक को भरोसा हो।',
    tip2: 'अच्छी फोटो अपलोड करें।',
    tip3: 'कीमत उचित रखें।',
    tip4: 'सभी * वाले फ़ील्ड भरना आवश्यक है।',
    previewTitle: 'उत्पाद का पूर्वावलोकन',
    previewImagePlaceholder: 'फोटो अपलोड करने पर यहाँ दिखेगा',
    previewProdName: 'उत्पाद का नाम',
    previewArtisan: 'कारीगर',
    previewCategory: 'श्रेणी',
    previewPrice: 'कीमत',
    previewMakeTime: 'बनाने का समय',
    previewStock: 'स्टॉक उपलब्धता',
    alertInfoText: 'अगले चरण में आप जानकारी की पुष्टि करके पोस्ट कर पाएंगे।',
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
    breadcrumb: 'Dashboard > Post Product > New Product',
    pageTitle: 'Post New Product',
    pageSubtitle: 'Fill artisan product details and publish online.',
    step1Title: 'Product Details',
    step2Title: 'Upload Photos',
    step3Title: 'Preview & Confirm',
    step4Title: 'Publish',
    selectArtisanLabel: 'Select Artisan *',
    changeArtisanBtn: 'Change Artisan',
    prodNameLabel: 'Product Name *',
    prodNamePlaceholder: 'e.g. Bamboo Basket',
    categoryLabel: 'Category *',
    categoryPlaceholder: 'Select Category ⌄',
    subCategoryLabel: 'Sub-Category',
    subCategoryPlaceholder: 'Select Sub-Category ⌄',
    materialLabel: 'Material / Raw Material *',
    materialPlaceholder: 'e.g. Bamboo, Wood, Clay',
    descriptionLabel: 'Product Description *',
    descriptionPlaceholder: 'Write features, usage, crafting method...',
    makeTimeLabel: 'Est. Crafting Time',
    makeTimePlaceholder: 'e.g. 2 days, 5 days',
    priceLabel: 'Price (₹) *',
    pricePlaceholder: 'e.g. 650',
    stockLabel: 'Stock Availability',
    stockPlaceholder: 'In Stock ⌄',
    deliveryTimeLabel: 'Delivery Time (Days)',
    deliveryTimePlaceholder: 'e.g. 3 to 5 days',
    voiceInputTitle: 'Fill Details by Voice',
    voiceInputSub: 'You can also speak to auto-fill product details.',
    speakInputBtn: 'Speak & Fill',
    proceedBtn: 'Proceed →',
    tipsTitle: 'Tips for Filling Details',
    tip1: 'Provide accurate info to build customer trust.',
    tip2: 'Upload high quality photos.',
    tip3: 'Keep reasonable pricing.',
    tip4: 'All fields marked * are required.',
    previewTitle: 'Product Live Preview',
    previewImagePlaceholder: 'Uploaded photo will appear here',
    previewProdName: 'Product Name',
    previewArtisan: 'Artisan',
    previewCategory: 'Category',
    previewPrice: 'Price',
    previewMakeTime: 'Crafting Time',
    previewStock: 'Stock Availability',
    alertInfoText: 'In next step you can review details and publish live.',
    footerLeft: '© 2025 KalaSetu | District Helpdesk Portal',
    footerRight: 'Version 1.0.0',
  },
};

export default function WebPostProductScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [selectedLang, setSelectedLang] = useGlobalLang();
  const [currentStep, setCurrentStep] = useState(1);

  // Form Field States
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [description, setDescription] = useState('');
  const [makeTime, setMakeTime] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('available');
  const [deliveryTime, setDeliveryTime] = useState('');

  const t = TRANSLATIONS_POST_PRODUCT[selectedLang as keyof typeof TRANSLATIONS_POST_PRODUCT];
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

                  {/* 2. नया कारीगर जोड़ें */}
                  <TouchableOpacity style={styles.sidebarNavItem} onPress={() => router.push('/web-add-artisan')}>
                    <Ionicons name="person-add-outline" size={18} color="#555555" style={{ marginRight: 12 }} />
                    <Text style={styles.sidebarNavText}>{t.addArtisan}</Text>
                  </TouchableOpacity>

                  {/* 3. उत्पाद पोस्ट करें (Active) */}
                  <TouchableOpacity style={[styles.sidebarNavItem, styles.sidebarNavItemActive]}>
                    <Ionicons name="cube" size={18} color="#2E7D32" style={{ marginRight: 12 }} />
                    <Text style={[styles.sidebarNavText, styles.sidebarNavTextActive]}>{t.postProduct}</Text>
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
                    <Text style={[styles.breadcrumbText, { color: '#2E7D32', fontWeight: 'bold' }]}>
                      {isHindi ? 'डैशबोर्ड' : 'Dashboard'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.breadcrumbText}> {'>'} {isHindi ? 'उत्पाद पोस्ट करें' : 'Post Product'} {'>'} {isHindi ? 'नया उत्पाद' : 'New Product'}</Text>
                </View>

                <Text style={styles.pageTitleText}>{t.pageTitle}</Text>
                <Text style={styles.pageSubtitleText}>{t.pageSubtitle}</Text>
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

            {/* Form & Live Preview 2-Column Row */}
            <View style={styles.formAndTipsRow}>
              {/* Left Main Form Card (Width ~ 68%) */}
              <View style={styles.formMainCard}>
                {/* Artisan Selection Card */}
                <Text style={styles.fieldLabelText}>{t.selectArtisanLabel}</Text>
                <View style={styles.selectedArtisanCard}>
                  <View style={styles.artisanAvatarCircle}>
                    <Text style={styles.artisanAvatarText}>SD</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.artisanNameTitle}>{isHindi ? 'सुनीता देवी' : 'Seema Devi'}</Text>
                    <Text style={styles.artisanSubLoc}>{isHindi ? 'ग्राम: खरोरा, रायपुर' : 'Village: Kharora, Raipur'}</Text>
                  </View>
                  <TouchableOpacity style={styles.changeArtisanBtn}>
                    <Text style={styles.changeArtisanBtnText}>{t.changeArtisanBtn}</Text>
                  </TouchableOpacity>
                </View>

                {/* Form Fields Grid */}
                <View style={{ gap: 16, marginTop: 16 }}>
                  {/* Row 1: Product Name & Category */}
                  <View style={styles.formTwoColRow}>
                    <View style={styles.formFieldFlex}>
                      <Text style={styles.fieldLabelText}>{t.prodNameLabel}</Text>
                      <TextInput
                        placeholder={t.prodNamePlaceholder}
                        placeholderTextColor="#888888"
                        value={productName}
                        onChangeText={setProductName}
                        style={styles.textInputBox}
                      />
                    </View>

                    <View style={styles.formFieldFlex}>
                      <Text style={styles.fieldLabelText}>{t.categoryLabel}</Text>
                      <TouchableOpacity style={styles.dropdownSelectBox}>
                        <Text style={styles.dropdownSelectText}>
                          {category ? category : t.categoryPlaceholder}
                        </Text>
                        <Ionicons name="chevron-down" size={14} color="#666666" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Row 2: Sub-Category & Raw Material */}
                  <View style={styles.formTwoColRow}>
                    <View style={styles.formFieldFlex}>
                      <Text style={styles.fieldLabelText}>{t.subCategoryLabel}</Text>
                      <TouchableOpacity style={styles.dropdownSelectBox}>
                        <Text style={styles.dropdownSelectText}>
                          {subCategory ? subCategory : t.subCategoryPlaceholder}
                        </Text>
                        <Ionicons name="chevron-down" size={14} color="#666666" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.formFieldFlex}>
                      <Text style={styles.fieldLabelText}>{t.materialLabel}</Text>
                      <TextInput
                        placeholder={t.materialPlaceholder}
                        placeholderTextColor="#888888"
                        value={material}
                        onChangeText={setMaterial}
                        style={styles.textInputBox}
                      />
                    </View>
                  </View>

                  {/* Row 3: Description & Crafting Time */}
                  <View style={styles.formTwoColRow}>
                    <View style={styles.formFieldFlex}>
                      <Text style={styles.fieldLabelText}>{t.descriptionLabel}</Text>
                      <View style={styles.textareaWrapper}>
                        <TextInput
                          placeholder={t.descriptionPlaceholder}
                          placeholderTextColor="#888888"
                          value={description}
                          onChangeText={setDescription}
                          multiline
                          numberOfLines={3}
                          style={styles.textareaFlex}
                        />
                        <Text style={styles.charCountText}>{description.length}/500</Text>
                      </View>
                    </View>

                    <View style={styles.formFieldFlex}>
                      <Text style={styles.fieldLabelText}>{t.makeTimeLabel}</Text>
                      <TextInput
                        placeholder={t.makeTimePlaceholder}
                        placeholderTextColor="#888888"
                        value={makeTime}
                        onChangeText={setMakeTime}
                        style={styles.textInputBox}
                      />
                    </View>
                  </View>

                  {/* Row 4 (3 Columns): Price, Stock & Delivery Time */}
                  <View style={styles.formThreeColRow}>
                    <View style={styles.formFieldFlex}>
                      <Text style={styles.fieldLabelText}>{t.priceLabel}</Text>
                      <TextInput
                        placeholder={t.pricePlaceholder}
                        placeholderTextColor="#888888"
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="number-pad"
                        style={styles.textInputBox}
                      />
                    </View>

                    <View style={styles.formFieldFlex}>
                      <Text style={styles.fieldLabelText}>{t.stockLabel}</Text>
                      <TouchableOpacity style={styles.dropdownSelectBox}>
                        <Text style={styles.dropdownSelectText}>{isHindi ? 'उपलब्ध' : 'In Stock'}</Text>
                        <Ionicons name="chevron-down" size={14} color="#666666" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.formFieldFlex}>
                      <Text style={styles.fieldLabelText}>{t.deliveryTimeLabel}</Text>
                      <TextInput
                        placeholder={t.deliveryTimePlaceholder}
                        placeholderTextColor="#888888"
                        value={deliveryTime}
                        onChangeText={setDeliveryTime}
                        style={styles.textInputBox}
                      />
                    </View>
                  </View>
                </View>

                {/* Voice Input Banner Box */}
                <View style={styles.voiceInputBannerCard}>
                  <View style={styles.micIconCircle}>
                    <Ionicons name="mic-outline" size={20} color="#2E7D32" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.voiceTitleText}>{t.voiceInputTitle}</Text>
                    <Text style={styles.voiceSubText}>{t.voiceInputSub}</Text>
                  </View>

                  <TouchableOpacity style={styles.speakInputOutlineBtn}>
                    <Ionicons name="mic" size={14} color="#2E7D32" style={{ marginRight: 4 }} />
                    <Text style={styles.speakInputOutlineBtnText}>{t.speakInputBtn}</Text>
                  </TouchableOpacity>
                </View>

                {/* Form Action Buttons */}
                <View style={styles.formActionButtonsRow}>
                  <TouchableOpacity
                    style={styles.proceedSolidBtn}
                    onPress={() => alert(isHindi ? 'उत्पाद विवरण सहेजा गया! अब फोटो अपलोड करें।' : 'Product info saved! Now upload photos.')}
                  >
                    <Text style={styles.proceedSolidBtnText}>{t.proceedBtn}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Right Side Live Preview & Tips Column (Width ~ 30%) */}
              <View style={styles.rightSideTipsCol}>
                {/* Tips Card */}
                <View style={styles.tipsCard}>
                  <Text style={styles.tipsTitleText}>{t.tipsTitle}</Text>
                  <View style={styles.tipsListGroup}>
                    <View style={styles.tipItemRow}>
                      <Ionicons name="checkmark-circle" size={16} color="#2E7D32" style={{ marginRight: 8 }} />
                      <Text style={styles.tipText}>{t.tip1}</Text>
                    </View>
                    <View style={styles.tipItemRow}>
                      <Ionicons name="checkmark-circle" size={16} color="#2E7D32" style={{ marginRight: 8 }} />
                      <Text style={styles.tipText}>{t.tip2}</Text>
                    </View>
                    <View style={styles.tipItemRow}>
                      <Ionicons name="checkmark-circle" size={16} color="#2E7D32" style={{ marginRight: 8 }} />
                      <Text style={styles.tipText}>{t.tip3}</Text>
                    </View>
                    <View style={styles.tipItemRow}>
                      <Ionicons name="checkmark-circle" size={16} color="#2E7D32" style={{ marginRight: 8 }} />
                      <Text style={styles.tipText}>{t.tip4}</Text>
                    </View>
                  </View>
                </View>

                {/* Live Preview Card */}
                <View style={styles.previewCard}>
                  <Text style={styles.previewTitleText}>{t.previewTitle}</Text>

                  {/* Image Placeholder */}
                  <View style={styles.previewImagePlaceholderBox}>
                    <Ionicons name="basket-outline" size={40} color="#C4C4C4" />
                    <Text style={styles.previewImagePlaceholderText}>{t.previewImagePlaceholder}</Text>
                  </View>

                  {/* Key-Value Summary List */}
                  <View style={styles.previewSummaryList}>
                    <View style={styles.summaryRowItem}>
                      <Text style={styles.summaryLabel}>{t.previewProdName}</Text>
                      <Text style={styles.summaryValue}>{productName || '-'}</Text>
                    </View>
                    <View style={styles.summaryRowItem}>
                      <Text style={styles.summaryLabel}>{t.previewArtisan}</Text>
                      <Text style={styles.summaryValue}>{isHindi ? 'सुनीता देवी' : 'Seema Devi'}</Text>
                    </View>
                    <View style={styles.summaryRowItem}>
                      <Text style={styles.summaryLabel}>{t.previewCategory}</Text>
                      <Text style={styles.summaryValue}>{category || '-'}</Text>
                    </View>
                    <View style={styles.summaryRowItem}>
                      <Text style={styles.summaryLabel}>{t.previewPrice}</Text>
                      <Text style={styles.summaryValue}>{price ? `₹${price}` : '-'}</Text>
                    </View>
                    <View style={styles.summaryRowItem}>
                      <Text style={styles.summaryLabel}>{t.previewMakeTime}</Text>
                      <Text style={styles.summaryValue}>{makeTime || '-'}</Text>
                    </View>
                    <View style={styles.summaryRowItem}>
                      <Text style={styles.summaryLabel}>{t.previewStock}</Text>
                      <Text style={styles.summaryValue}>-</Text>
                    </View>
                  </View>
                </View>

                {/* Bottom Blue Alert Banner */}
                <View style={styles.blueAlertBannerCard}>
                  <Ionicons name="information-circle" size={20} color="#0288D1" style={{ marginRight: 8 }} />
                  <Text style={styles.blueAlertText}>{t.alertInfoText}</Text>
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
    backgroundColor: '#2E7D32',
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
    color: '#2E7D32',
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
    color: '#2E7D32',
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
    borderColor: '#2E7D32',
    borderRadius: 6,
    paddingVertical: 4,
    alignItems: 'center',
  },
  sidebarHelpOutlineBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
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
    backgroundColor: '#2E7D32',
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
    backgroundColor: '#2E7D32',
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
  fieldLabelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },

  /* Selected Artisan Card */
  selectedArtisanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F9F2',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  artisanAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artisanAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  artisanNameTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  artisanSubLoc: {
    fontSize: 11,
    color: '#555555',
    marginTop: 1,
  },
  changeArtisanBtn: {
    borderWidth: 1,
    borderColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  changeArtisanBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  /* Form Fields */
  formTwoColRow: {
    flexDirection: 'row',
    gap: 14,
  },
  formThreeColRow: {
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
    color: '#555555',
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
    height: 54,
    fontSize: 13,
    color: '#333333',
    textAlignVertical: 'top',
  },
  charCountText: {
    fontSize: 11,
    color: '#888888',
    alignSelf: 'flex-end',
  },

  /* Voice Input Banner Card */
  voiceInputBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F9F2',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
    gap: 12,
  },
  micIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  voiceSubText: {
    fontSize: 11,
    color: '#555555',
  },
  speakInputOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  speakInputOutlineBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  /* Form Action Buttons */
  formActionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  proceedSolidBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 26,
  },
  proceedSolidBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /* Right Side Tips & Live Preview Column */
  rightSideTipsCol: {
    flex: 1,
    gap: 16,
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 16,
    padding: 18,
    gap: 12,
  },
  tipsTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  tipsListGroup: {
    gap: 8,
  },
  tipItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    fontSize: 12,
    color: '#444444',
    flex: 1,
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderRadius: 16,
    padding: 18,
    gap: 14,
  },
  previewTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  previewImagePlaceholderBox: {
    backgroundColor: '#FAF8F5',
    borderRadius: 12,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  previewImagePlaceholderText: {
    fontSize: 11,
    color: '#888888',
  },
  previewSummaryList: {
    gap: 6,
  },
  summaryRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#777777',
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  blueAlertBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1F5FE',
    borderWidth: 1,
    borderColor: '#B3E5FC',
    borderRadius: 12,
    padding: 12,
  },
  blueAlertText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0288D1',
    flex: 1,
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
