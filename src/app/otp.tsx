import React, { useState, useEffect, useRef } from 'react';
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
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGlobalLang, setGlobalLang, ALL_LANGUAGES, LangCode } from '@/utils/languageStore';

const LANGUAGES = ALL_LANGUAGES;

const TRANSLATIONS: Record<LangCode, {
  tagline: string;
  otpTitle: string;
  otpSubtitlePrefix: string;
  otpSubtitleSuffix: string;
  secureOtp: string;
  timerPrefix: string;
  resendQuestion: string;
  resendBtn: string;
  helpTitle: string;
  helpSubtitle: string;
  modalTitle: string;
  verifySuccess: string;
  otpResent: string;
}> = {
  en: {
    tagline: 'Your Art, Your Identity',
    otpTitle: 'Enter OTP',
    otpSubtitlePrefix: 'We have sent a 6-digit OTP to\n+91 ',
    otpSubtitleSuffix: '',
    secureOtp: 'Your OTP is Secure',
    timerPrefix: 'OTP expires in:',
    resendQuestion: "Didn't receive OTP?",
    resendBtn: 'Resend',
    helpTitle: 'Having Trouble?',
    helpSubtitle: 'Call our support team',
    modalTitle: 'Select Language / भाषा चुनें',
    verifySuccess: 'OTP Verified Successfully!',
    otpResent: 'New 6-digit OTP sent successfully!',
  },
  hi: {
    tagline: 'आपकी कला, आपकी पहचान',
    otpTitle: 'OTP दर्ज करें',
    otpSubtitlePrefix: 'हमने आपके मोबाइल नंबर +91 ',
    otpSubtitleSuffix: '\nपर एक 6 अंकों का OTP भेजा है।',
    secureOtp: 'आपका OTP सुरक्षित है',
    timerPrefix: 'OTP समाप्त होने में:',
    resendQuestion: 'OTP नहीं मिला?',
    resendBtn: 'पुनः भेजें',
    helpTitle: 'समस्या हो रही है?',
    helpSubtitle: 'कॉल्स करें हमारी सहायता टीम को',
    modalTitle: 'भाषा चुनें / Select Language',
    verifySuccess: 'OTP सफलतापूर्वक सत्यापित हुआ!',
    otpResent: 'नया 6-अंकों का OTP भेजा गया है!',
  },
  bn: {
    tagline: 'আপনার শিল্প, আপনার পরিচয়',
    otpTitle: 'ওটিপি লিখুন',
    otpSubtitlePrefix: 'আমরা আপনার মোবাইল নম্বর +91 ',
    otpSubtitleSuffix: '\nএ একটি ৬ সংখ্যার OTP পাঠিয়েছি।',
    secureOtp: 'আপনার OTP সুরক্ষিত',
    timerPrefix: 'OTP মেয়াদ শেষ হতে:',
    resendQuestion: 'OTP পাননি?',
    resendBtn: 'পুনরায় পাঠান',
    helpTitle: 'সমস্যা হচ্ছে?',
    helpSubtitle: 'আমাদের সহায়তা দলে কল করুন',
    modalTitle: 'ভাষা নির্বাচন করুন / Select Language',
    verifySuccess: 'OTP সফলভাবে যাচাই করা হয়েছে!',
    otpResent: 'নতুন ৬ সংখ্যার OTP পাঠানো হয়েছে!',
  },
  bho: {
    tagline: 'रउआ कला, रउआ पहचान',
    otpTitle: 'OTP डालीं',
    otpSubtitlePrefix: 'हमनी आपके मोबाइल नंबर +91 ',
    otpSubtitleSuffix: '\nपर एक ६ अंक के OTP भेजले बानी।',
    secureOtp: 'रउआ OTP सुरक्षित बा',
    timerPrefix: 'OTP खतम होखे में:',
    resendQuestion: 'OTP ना मिलल?',
    resendBtn: 'फिर से भेजीं',
    helpTitle: 'कवनो दिक्कत बा?',
    helpSubtitle: 'हमनी के हेल्प टीम के फोन करीं',
    modalTitle: 'भाषा चुनीं / Select Language',
    verifySuccess: 'OTP सही सत्यापित भइल!',
    otpResent: 'नया ६-अंक के OTP भेजल गइल!',
  },
  mr: {
    tagline: 'तुमची कला, तुमची ओळख',
    otpTitle: 'OTP प्रविष्ट करा',
    otpSubtitlePrefix: 'आम्ही तुमच्या मोबाईल नंबर +91 ',
    otpSubtitleSuffix: '\nवर ६ अंकी OTP पाठवला आहे.',
    secureOtp: 'तुमचा OTP सुरक्षित आहे',
    timerPrefix: 'OTP संपण्यास शिल्लक वेळ:',
    resendQuestion: 'OTP मिळाला नाही?',
    resendBtn: 'पुन्हा पाठवा',
    helpTitle: 'काही अडचण येत आहे?',
    helpSubtitle: 'आमच्या सपोर्ट टीमला कॉल करा',
    modalTitle: 'भाषा निवडा / Select Language',
    verifySuccess: 'OTP यशस्वीरित्या सत्यापित झाला!',
    otpResent: 'नवीन ६ अंकी OTP पाठवला आहे!',
  },
  gu: {
    tagline: 'તમારી કળા, તમારી ઓળખ',
    otpTitle: 'OTP દાખલ કરો',
    otpSubtitlePrefix: 'અમે તમારા મોબાઇલ નંબર +91 ',
    otpSubtitleSuffix: '\nપર ૬ અંકનો OTP મોકલ્યો છે.',
    secureOtp: 'તમારો OTP સુરક્ષિત છે',
    timerPrefix: 'OTP સમાપ્ત થવામાં સમય:',
    resendQuestion: 'OTP મળ્યો નથી?',
    resendBtn: 'ફરીથી મોકલો',
    helpTitle: 'કોઈ સમસ્યા છે?',
    helpSubtitle: 'અમારી મદદ ટીમ પર કોલ કરો',
    modalTitle: 'ભાષા પસંદ કરો / Select Language',
    verifySuccess: 'OTP સફળતાપૂર્વક ચકાસાયો!',
    otpResent: 'નવો ૬ અંકનો OTP મોકલવામાં આવ્યો છે!',
  },
  raj: {
    tagline: 'थांरी कला, थांरी पहचान',
    otpTitle: 'OTP लिखो',
    otpSubtitlePrefix: 'म्हे थांरा मोबाइल नंबर +91 ',
    otpSubtitleSuffix: '\nमाथै ६ अंकां रो OTP भेज्यो है।',
    secureOtp: 'थांरो OTP सुरक्षित है',
    timerPrefix: 'OTP पूरा होवण मांही समय:',
    resendQuestion: 'OTP कोनी मिल्यो?',
    resendBtn: 'पाछो भेजो',
    helpTitle: 'कांई दिक्कत हो रही है?',
    helpSubtitle: 'म्हारी सहायता टीम नै फोन करो',
    modalTitle: 'भाषा चूणो / Select Language',
    verifySuccess: 'OTP पूरो सत्यापित होयो!',
    otpResent: 'नयो ६-अंकां रो OTP भेज्यो गयो!',
  },
  kn: {
    tagline: 'ನಿಮ್ಮ ಕಲೆ, ನಿಮ್ಮ ಗುರುತು',
    otpTitle: 'OTP ನಮೂದಿಸಿ',
    otpSubtitlePrefix: 'ನಾವು ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ +91 ',
    otpSubtitleSuffix: '\nಗೆ ೬ ಅಂಕಿಯ OTP ಕಳುಹಿಸಿದ್ದೇವೆ.',
    secureOtp: 'ನಿಮ್ಮ OTP ಸುರಕ್ಷಿತವಾಗಿದೆ',
    timerPrefix: 'OTP ಗಡುವು ಮುಗಿಯಲು:',
    resendQuestion: 'OTP ಸ್ವೀಕರಿಸಲಿಲ್ಲವೇ?',
    resendBtn: 'ಮತ್ತೆ ಕಳುಹಿಸಿ',
    helpTitle: 'ತೊಂದರೆ ಇದೆಯೇ?',
    helpSubtitle: 'ನಮ್ಮ ಸಹಾಯ ತಂಡಕ್ಕೆ ಕರೆ ಮಾಡಿ',
    modalTitle: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / Select Language',
    verifySuccess: 'OTP ಯಶಸ್ವಿಯಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ!',
    otpResent: 'ಹೊಸ ೬ ಅಂಕಿಯ OTP ಕಳುಹಿಸಲಾಗಿದೆ!',
  },
};

export default function OtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; lang?: string; role?: string }>();
  const [globalLang, setGlobalLangState] = useGlobalLang();

  const rawPhone = params.phone || '98765 43210';
  const selectedLang: LangCode = (params.lang as LangCode) || globalLang || 'hi';

  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(115);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const t = (TRANSLATIONS as any)[selectedLang] || (TRANSLATIONS as any)[globalLang] || TRANSLATIONS.hi;

  const handleLangChange = (code: LangCode) => {
    setGlobalLangState(code);
    setIsLangModalVisible(false);
  };

  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(mins)} : ${pad(secs)}`;
  };

  const handleOtpChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== '')) {
      setTimeout(() => {
        if (params.role === 'shg') {
          router.replace('/shg-platform' as any);
        } else {
          router.replace({ pathname: '/home', params: { lang: selectedLang } });
        }
      }, 150);
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setTimerSeconds(120);
    alert(t.otpResent);
    inputRefs.current[0]?.focus();
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:18001234567').catch(() => {
      alert('सहायता नंबर: 1800-123-4567');
    });
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[1];
  const currentLangLabel = `${currentLangObj.nativeName} (${currentLangObj.englishName})`;

  const formattedPhoneDisplay = rawPhone.length === 10
    ? `${rawPhone.slice(0, 5)} ${rawPhone.slice(5)}`
    : rawPhone;

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
          {/* Header Bar: Back Button & Language Selector */}
          <View style={styles.headerBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
            </TouchableOpacity>

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
              style={styles.logoIcon}
              resizeMode="contain"
            />
            <Text style={styles.brandTitle}>कलासेतु</Text>
            <Text style={styles.brandTagline}>{t.tagline}</Text>
          </View>

          {/* OTP Heading & Subtitle */}
          <View style={styles.otpHeaderSection}>
            <Text style={styles.otpTitle}>{t.otpTitle}</Text>
            <Text style={styles.otpSubtitle}>
              {t.otpSubtitlePrefix}
              {formattedPhoneDisplay}
              {t.otpSubtitleSuffix}
            </Text>
          </View>

          {/* 6 Digit OTP Input Boxes */}
          <View style={styles.otpInputsContainer}>
            {otp.map((digit, idx) => {
              const isFocused = focusedIndex === idx;
              const isFilled = digit !== '';
              return (
                <TextInput
                  key={idx}
                  ref={(ref) => {
                    inputRefs.current[idx] = ref;
                  }}
                  style={[
                    styles.otpBox,
                    isFocused && styles.otpBoxFocused,
                    isFilled && styles.otpBoxFilled,
                  ]}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, idx)}
                  onKeyPress={(e) => handleKeyPress(e, idx)}
                  onFocus={() => setFocusedIndex(idx)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              );
            })}
          </View>

          {/* Security Badge */}
          <View style={styles.securityBadgeRow}>
            <Ionicons name="shield-checkmark" size={16} color="#3B6029" />
            <Text style={styles.securityBadgeText}>{t.secureOtp}</Text>
          </View>

          {/* Timer Countdown Display */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              {t.timerPrefix} <Text style={styles.timerBoldText}>{formatTimer(timerSeconds)}</Text>
            </Text>
          </View>

          {/* Resend OTP Button Section */}
          <View style={styles.resendSection}>
            <Text style={styles.resendQuestionText}>{t.resendQuestion}</Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={timerSeconds > 0}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.resendBtnText,
                  timerSeconds > 0 && styles.resendBtnDisabled,
                ]}
              >
                {t.resendBtn}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Support Helpline Card */}
          <TouchableOpacity
            style={styles.supportCard}
            onPress={handleCallSupport}
            activeOpacity={0.85}
          >
            <View style={styles.supportIconCircle}>
              <Ionicons name="headset" size={24} color="#3B6029" />
            </View>
            <View style={styles.supportTextCol}>
              <Text style={styles.supportTitle}>{t.helpTitle}</Text>
              <Text style={styles.supportSubtitle}>{t.helpSubtitle}</Text>
            </View>
            <Ionicons name="call-outline" size={20} color="#3B6029" />
          </TouchableOpacity>

          {/* Village Scenic Footer Background */}
          <View style={styles.footerSection}>
            <Image
              source={require('@/assets/images/village_sketch.png')}
              style={styles.villageSketchImage}
              resizeMode="cover"
            />
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
                  onPress={() => handleLangChange(item.code)}
                >
                  <Text
                    style={[
                      styles.langOptionText,
                      selectedLang === item.code && styles.langOptionTextSelected,
                    ]}
                  >
                    {item.nativeName} ({item.englishName})
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
    paddingBottom: 24,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 12,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    elevation: 1,
  },
  langText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C2C2C',
    marginHorizontal: 4,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  logoIcon: {
    width: 65,
    height: 65,
    marginBottom: 6,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4E342E',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B6029',
    marginTop: 2,
  },
  otpHeaderSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  otpTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  otpSubtitle: {
    fontSize: 15,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 22,
  },
  otpInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  otpBox: {
    width: 46,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D4D0C7',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    elevation: 1,
  },
  otpBoxFocused: {
    borderColor: '#3B6029',
    backgroundColor: '#F7FAF5',
  },
  otpBoxFilled: {
    borderColor: '#3B6029',
    backgroundColor: '#FFFFFF',
  },
  securityBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  securityBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B6029',
    marginLeft: 6,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 14,
    color: '#666666',
  },
  timerBoldText: {
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  resendSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  resendQuestionText: {
    fontSize: 14,
    color: '#666666',
    marginRight: 6,
  },
  resendBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  resendBtnDisabled: {
    color: '#999999',
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    elevation: 2,
  },
  supportIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  supportTextCol: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  supportSubtitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  villageSketchImage: {
    width: '100%',
    height: 70,
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    maxHeight: 400,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: '#FAF9F5',
  },
  langOptionSelected: {
    backgroundColor: '#EAF2E8',
  },
  langOptionText: {
    fontSize: 15,
    color: '#333333',
  },
  langOptionTextSelected: {
    fontWeight: 'bold',
    color: '#3B6029',
  },
});
