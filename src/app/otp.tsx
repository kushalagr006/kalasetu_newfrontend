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

type LangCode = 'hi' | 'en';

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'English' },
];

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
};

export default function OtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; lang?: string; role?: string }>();
  
  const rawPhone = params.phone || '98765 43210';
  const initialLang: LangCode = (params.lang as LangCode) || 'hi';

  const [selectedLang, setSelectedLang] = useState<LangCode>(initialLang);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(115); // 01:55
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const t = TRANSLATIONS[selectedLang];

  // Live Timer Countdown
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

    // Auto-advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits entered
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
    setTimerSeconds(120); // Reset timer to 2 minutes
    alert(t.otpResent);
    inputRefs.current[0]?.focus();
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:18001234567').catch(() => {
      alert('सहायता नंबर: 1800-123-4567');
    });
  };

  const currentLangLabel = LANGUAGES.find((l) => l.code === selectedLang)?.label || 'हिंदी';

  // Format phone display e.g. "98765 43210"
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

          {/* 6-Digit OTP Boxes */}
          <View style={styles.otpBoxRow}>
            {otp.map((digit, index) => {
              const isFocused = focusedIndex === index;
              return (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpBox,
                    digit !== '' && styles.otpBoxFilled,
                    isFocused && styles.otpBoxFocused,
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onFocus={() => setFocusedIndex(index)}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  selectTextOnFocus
                />
              );
            })}
          </View>

          {/* Security Shield Divider */}
          <View style={styles.securityDividerRow}>
            <View style={styles.dividerLine} />
            <View style={styles.securityBadge}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#3B6029" />
              <Text style={styles.securityText}>{t.secureOtp}</Text>
            </View>
            <View style={styles.dividerLine} />
          </View>

          {/* Timer Container */}
          <View style={styles.timerCard}>
            <Text style={styles.timerLabel}>{t.timerPrefix}</Text>
            <Text style={styles.timerValue}>{formatTimer(timerSeconds)}</Text>
          </View>

          {/* Resend Link */}
          <View style={styles.resendRow}>
            <Text style={styles.resendQuestionText}>{t.resendQuestion}</Text>
            <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
              <Text style={styles.resendBtnText}>{t.resendBtn}</Text>
            </TouchableOpacity>
          </View>

          {/* Help & Support Card ("समस्या हो रही है?") */}
          <View style={styles.helpCard}>
            <Image
              source={require('@/assets/images/support_phone.png')}
              style={styles.supportAvatar}
              resizeMode="cover"
            />
            <View style={styles.helpTextContainer}>
              <Text style={styles.helpTitle}>{t.helpTitle}</Text>
              <Text style={styles.helpSubtitle}>{t.helpSubtitle}</Text>

              <TouchableOpacity
                style={styles.callHotlineButton}
                onPress={handleCallSupport}
                activeOpacity={0.8}
              >
                <View style={styles.callIconBadge}>
                  <Ionicons name="call" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.callHotlineText}>1800-123-4567</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Village Line Art Sketch Overlay */}
          <View style={styles.sketchWrapper}>
            <Image
              source={require('@/assets/images/village_sketch.png')}
              style={styles.sketchImage}
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
                  onPress={() => {
                    setSelectedLang(item.code);
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
    paddingBottom: 24,
  },
  /* Header Bar */
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 8,
    paddingBottom: 4,
  },
  backButton: {
    padding: 6,
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
    marginBottom: 16,
  },
  logoIcon: {
    width: 75,
    height: 75,
    marginBottom: 2,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4E342E',
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B6029',
    marginTop: 1,
  },
  /* OTP Header Section */
  otpHeaderSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  otpTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  otpSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  /* 6-Digit OTP Boxes */
  otpBoxRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
  },
  otpBox: {
    width: 48,
    height: 54,
    borderWidth: 1,
    borderColor: '#D4D0C8',
    borderRadius: 12,
    backgroundColor: '#FAF9F6',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  otpBoxFilled: {
    borderColor: '#3B6029',
    backgroundColor: '#FFFFFF',
    color: '#3B6029',
  },
  otpBoxFocused: {
    borderWidth: 1.8,
    borderColor: '#3B6029',
    backgroundColor: '#FFFFFF',
  },
  /* Security Divider */
  securityDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E3DC',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  securityText: {
    fontSize: 12,
    color: '#777777',
    marginLeft: 6,
    fontWeight: '500',
  },
  /* Timer Card */
  timerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F5ED',
    alignSelf: 'center',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  timerLabel: {
    fontSize: 14,
    color: '#555555',
    marginRight: 10,
  },
  timerValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  /* Resend Row */
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  resendQuestionText: {
    fontSize: 14,
    color: '#333333',
    marginRight: 6,
  },
  resendBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  /* Help Card */
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF7EC',
    borderWidth: 1,
    borderColor: '#F3E8D3',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  supportAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  helpTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  helpTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  helpSubtitle: {
    fontSize: 13,
    color: '#555555',
    marginBottom: 8,
  },
  callHotlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callIconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#3B6029',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  callHotlineText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  /* Sketch Overlay */
  sketchWrapper: {
    width: '100%',
    height: 90,
    marginTop: 4,
    overflow: 'hidden',
  },
  sketchImage: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
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
