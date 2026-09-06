import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGlobalLang, LangCode } from '@/utils/languageStore';

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'English' },
];

const TRANSLATIONS: Record<LangCode, {
  tagline: string;
  formTitle: string;
  placeholder: string;
  button: string;
  or: string;
  shgTitle: string;
  shgSubtitle: string;
  trust1: string;
  trust2: string;
  trust3: string;
  alertError: string;
  alertSuccess: string;
  modalTitle: string;
}> = {
  hi: {
    tagline: 'आपकी कला, आपकी पहचान',
    formTitle: 'मोबाइल नंबर डालें',
    placeholder: 'अपना मोबाइल नंबर लिखें',
    button: 'आगे बढ़ें',
    or: 'या',
    shgTitle: 'महिला SHG समूह बनाएं',
    shgSubtitle: 'एक साथ काम करें, बड़े ऑर्डर पाएं\nऔर अपनी आमदनी बढ़ाएं',
    trust1: 'सुरक्षित\nऔर भरोसेमंद',
    trust2: 'भारतीय कलाकारों\nके लिए',
    trust3: 'बिकें, कमाएं\nऔर आगे बढ़ें',
    alertError: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।',
    alertSuccess: 'ओटीपी भेजा गया:',
    modalTitle: 'भाषा चुनें / Select Language',
  },
  en: {
    tagline: 'Your Art, Your Identity',
    formTitle: 'Enter Mobile Number',
    placeholder: 'Enter mobile number',
    button: 'Continue',
    or: 'OR',
    shgTitle: 'Create Women SHG Group',
    shgSubtitle: 'Work together, get bulk orders\nand grow your income',
    trust1: 'Safe &\nTrustworthy',
    trust2: 'For Indian\nArtisans',
    trust3: 'Sell, Earn &\nGrow',
    alertError: 'Please enter a valid 10-digit mobile number.',
    alertSuccess: 'OTP sent to:',
    modalTitle: 'Select Language / भाषा चुनें',
  },
};

export default function AppLoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const [globalLang, setGlobalLang] = useGlobalLang();

  const initialLang: LangCode = (params.lang as LangCode) || globalLang || 'hi';
  const [selectedLang, setSelectedLang] = useState<LangCode>(initialLang);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  useEffect(() => {
    if (params.lang && (params.lang === 'hi' || params.lang === 'en')) {
      setSelectedLang(params.lang as LangCode);
    }
  }, [params.lang]);

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.hi;

  const handleContinue = () => {
    if (phoneNumber.length < 10) {
      alert(t.alertError);
      return;
    }
    router.push({
      pathname: '/otp',
      params: { phone: phoneNumber, lang: selectedLang },
    });
  };

  const currentLangLabel = LANGUAGES.find((l) => l.code === selectedLang)?.label || 'हिंदी';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Bar - Language Selector */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.langSelector}
              onPress={() => setIsLangModalVisible(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="globe-outline" size={16} color="#2C2C2C" />
              <Text style={styles.langText}>{currentLangLabel}</Text>
              <Ionicons name="chevron-down" size={14} color="#2C2C2C" />
            </TouchableOpacity>
          </View>

          {/* Logo & Brand Identity */}
          <View style={styles.brandContainer}>
            <Image
              source={require('@/assets/images/logo_icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Village Scenic Landscape Banner */}
          <View style={styles.bannerWrapper}>
            <Image
              source={require('@/assets/images/village_banner.png')}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>

          {/* Phone Icon Badge */}
          <View style={styles.phoneBadgeContainer}>
            <View style={styles.phoneBadge}>
              <Ionicons name="call" size={22} color="#3B6029" />
            </View>
            <Text style={styles.formTitle}>{t.formTitle}</Text>
          </View>

          {/* Login Form Container */}
          <View style={styles.formContainer}>
            {/* Phone Number Input Box */}
            <View style={styles.inputCard}>
              <TouchableOpacity style={styles.countryPicker} activeOpacity={0.8}>
                <Text style={styles.countryCodeText}>{countryCode}</Text>
                <Ionicons name="chevron-down" size={14} color="#555" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
              <View style={styles.dividerVertical} />
              <TextInput
                style={styles.textInput}
                placeholder={t.placeholder}
                placeholderTextColor="#8E8E93"
                keyboardType="phone-pad"
                maxLength={10}
                numberOfLines={1}
                multiline={false}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
              <Ionicons name="call" size={20} color="#3B6029" style={styles.inputPhoneIcon} />
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                phoneNumber.length === 10 ? styles.primaryButtonActive : null,
              ]}
              onPress={handleContinue}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>{t.button}</Text>
              <Feather name="arrow-right" size={22} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>

          {/* Or Divider */}
          <View style={styles.orDividerRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>{t.or}</Text>
            <View style={styles.orLine} />
          </View>

          {/* SHG Card */}
          <TouchableOpacity
            style={styles.shgCard}
            onPress={() => {
              router.push({
                pathname: '/login',
                params: { lang: selectedLang, role: 'shg' },
              });
            }}
            activeOpacity={0.9}
          >
            <View style={styles.shgAvatarCircle}>
              <Ionicons name="people" size={26} color="#3B6029" />
            </View>
            <View style={styles.shgTextContainer}>
              <Text style={styles.shgTitle}>{t.shgTitle}</Text>
              <Text style={styles.shgSubtitle}>{t.shgSubtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#3B6029" />
          </TouchableOpacity>

          {/* Footer Features & Trust Badges */}
          <View style={styles.trustFooter}>
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#3B6029" />
              <Text style={styles.trustText}>{t.trust1}</Text>
            </View>

            <View style={styles.trustDivider} />

            <View style={styles.trustItem}>
              <Ionicons name="leaf-outline" size={24} color="#3B6029" />
              <Text style={styles.trustText}>{t.trust2}</Text>
            </View>

            <View style={styles.trustDivider} />

            <View style={styles.trustItem}>
              <Ionicons name="heart-outline" size={24} color="#3B6029" />
              <Text style={styles.trustText}>{t.trust3}</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.langOption,
                    selectedLang === item.code && styles.langOptionSelected,
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
                      selectedLang === item.code && styles.langOptionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {selectedLang === item.code && (
                    <Ionicons name="checkmark-circle" size={20} color="#3B6029" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  scrollContent: {
    paddingBottom: 32,
  },
  /* Top Bar */
  topBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 8,
    paddingBottom: 4,
    alignItems: 'flex-end',
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  langText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C2C2C',
    marginHorizontal: 4,
  },
  /* Brand Container */
  brandContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  logoImage: {
    width: 220,
    height: 170,
  },
  /* Banner Image */
  bannerWrapper: {
    width: '100%',
    height: 190,
    marginTop: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  /* Phone Badge Section */
  phoneBadgeContainer: {
    alignItems: 'center',
    marginTop: -30,
    zIndex: 10,
  },
  phoneBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8F0E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#FAF8F5',
  },
  formTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 14,
    textAlign: 'center',
  },
  /* Form Container */
  formContainer: {
    paddingHorizontal: 20,
    width: '100%',
  },
  inputCard: {
    flexDirection: 'row',
    height: 56,
    borderWidth: 1.5,
    borderColor: '#3B6029',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F5F0',
    paddingHorizontal: 14,
    height: '100%',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  dividerVertical: {
    width: 1,
    height: '60%',
    backgroundColor: '#E2E0D8',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    paddingHorizontal: 10,
    paddingVertical: 0,
    height: '100%',
  },
  inputPhoneIcon: {
    marginRight: 14,
  },
  /* Primary Button */
  primaryButton: {
    height: 56,
    backgroundColor: '#3B6029',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#3B6029',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  primaryButtonActive: {
    backgroundColor: '#2E4C20',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  /* Or Divider */
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
    paddingHorizontal: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E3DC',
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#777777',
    fontWeight: '500',
  },
  /* SHG Card */
  shgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF7EC',
    borderWidth: 1,
    borderColor: '#F3E8D3',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 28,
  },
  shgAvatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shgTextContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  shgTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  shgSubtitle: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
  },
  /* Trust Footer */
  trustFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    marginTop: 4,
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustText: {
    fontSize: 12,
    color: '#444444',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
    fontWeight: '500',
  },
  trustDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E0D8',
  },
  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  langOptionSelected: {
    backgroundColor: '#F4F8F3',
    borderRadius: 10,
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
