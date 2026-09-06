import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGlobalLang, LangCode } from '@/utils/languageStore';

const TRANSLATIONS = {
  en: {
    title: 'Identity Details',
    subtitle: 'Please provide the following details to verify your identity.',
    aadhaarLabel: 'Aadhaar Card Number',
    aadhaarPlaceholder: 'Enter 12 digit Aadhaar number',
    aadhaarHint: 'Example: 1234 5678 9012',
    panLabel: 'PAN Card Number',
    panPlaceholder: 'Enter PAN number',
    panHint: 'Example: ABCDE1234F',
    gstLabel: 'GST Number (If available)',
    gstPlaceholder: 'Enter GST number',
    gstHint: 'Example: 22AAAAA0000A1Z5',
    infoText: 'Your information is safe with us and will be used only for verification.',
    nextBtn: 'Continue →',
    errAadhaar: 'Please enter a valid 12-digit Aadhaar number.',
    errPan: 'Please enter a valid 10-character PAN number.',
    listeningMsg: 'Listening... speak now',
  },
  hi: {
    title: 'पहचान विवरण',
    subtitle: 'अपनी पहचान सत्यापित करने के लिए कृपया निम्नलिखित विवरण भरें।',
    aadhaarLabel: 'आधार कार्ड नंबर',
    aadhaarPlaceholder: '12 अंकों का आधार नंबर दर्ज करें',
    aadhaarHint: 'उदाहरण: 1234 5678 9012',
    panLabel: 'पैन कार्ड नंबर',
    panPlaceholder: 'पैन नंबर दर्ज करें',
    panHint: 'उदाहरण: ABCDE1234F',
    gstLabel: 'जीएसटी नंबर (यदि उपलब्ध हो)',
    gstPlaceholder: 'जीएसटी नंबर दर्ज करें',
    gstHint: 'उदाहरण: 22AAAAA0000A1Z5',
    infoText: 'आपकी जानकारी हमारे पास पूरी तरह सुरक्षित है और इसका उपयोग केवल सत्यापन के लिए किया जाएगा।',
    nextBtn: 'आगे बढ़ें →',
    errAadhaar: 'कृपया 12 अंकों का वैध आधार नंबर दर्ज करें।',
    errPan: 'कृपया 10 अंकों का वैध पैन कार्ड नंबर दर्ज करें।',
    listeningMsg: 'सुन रहे हैं... बोलिए',
  },
};

export default function AppRegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const [globalLang] = useGlobalLang();

  const selectedLang: LangCode =
    (params.lang as LangCode) || (globalLang === 'en' ? 'en' : 'hi');
  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.hi;

  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [activeMicField, setActiveMicField] = useState<string | null>(null);

  const handleMicPress = (field: string) => {
    setActiveMicField(field);
    setTimeout(() => {
      if (field === 'aadhaar') {
        setAadhaarNumber('987654321098');
      } else if (field === 'pan') {
        setPanNumber('ABCDE1234F');
      } else if (field === 'gst') {
        setGstNumber('22AAAAA0000A1Z5');
      }
      setActiveMicField(null);
    }, 1500);
  };

  const handleNext = () => {
    if (aadhaarNumber.length < 12) {
      alert(t.errAadhaar);
      return;
    }
    if (panNumber.trim().length < 10) {
      alert(t.errPan);
      return;
    }
    // GST is optional -> Navigate to Personal Details Step 2 Page
    router.push({
      pathname: '/app-register-personal',
      params: { lang: selectedLang },
    });
  };

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
        >
          {/* Clean Top Bar (Only Back Button) */}
          <View style={styles.topHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* Title & Subtitle */}
          <Text style={styles.pageTitle}>{t.title}</Text>
          <Text style={styles.pageSubtitle}>{t.subtitle}</Text>

          {/* Field 1: Aadhaar Card Number */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.aadhaarLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder={t.aadhaarPlaceholder}
                placeholderTextColor="#999999"
                keyboardType="number-pad"
                maxLength={12}
                value={aadhaarNumber}
                onChangeText={setAadhaarNumber}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  activeMicField === 'aadhaar' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('aadhaar')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="mic"
                  size={20}
                  color={activeMicField === 'aadhaar' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.hintText}>{t.aadhaarHint}</Text>
          </View>

          {/* Field 2: PAN Card Number */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.panLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder={t.panPlaceholder}
                placeholderTextColor="#999999"
                autoCapitalize="characters"
                maxLength={10}
                value={panNumber}
                onChangeText={setPanNumber}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  activeMicField === 'pan' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('pan')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="mic"
                  size={20}
                  color={activeMicField === 'pan' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.hintText}>{t.panHint}</Text>
          </View>

          {/* Field 3: GST Number (Optional) */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>{t.gstLabel}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder={t.gstPlaceholder}
                placeholderTextColor="#999999"
                autoCapitalize="characters"
                maxLength={15}
                value={gstNumber}
                onChangeText={setGstNumber}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  activeMicField === 'gst' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('gst')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="mic"
                  size={20}
                  color={activeMicField === 'gst' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.hintText}>{t.gstHint}</Text>
          </View>

          {/* Voice Listening Toast Indicator */}
          {activeMicField && (
            <View style={styles.voiceToast}>
              <Ionicons name="mic-circle" size={24} color="#3B6029" />
              <Text style={styles.voiceToastText}>{t.listeningMsg}</Text>
            </View>
          )}

          {/* Information Notice Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="information-circle-outline" size={22} color="#3B6029" />
            </View>
            <Text style={styles.infoText}>{t.infoText}</Text>
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextButtonText}>{t.nextBtn}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 36,
  },
  /* Top Header (Clean - Only Back Arrow) */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  /* Title & Subtitle */
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 24,
  },
  /* Field Section */
  fieldSection: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  asterisk: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E0D8',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1A1A1A',
  },
  micButton: {
    width: 48,
    height: 52,
    backgroundColor: '#EAF2E8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonActive: {
    backgroundColor: '#3B6029',
  },
  hintText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 6,
    marginLeft: 2,
  },
  voiceToast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2E8',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
    gap: 8,
  },
  voiceToastText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B6029',
  },
  /* Info Card */
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F8F1',
    borderWidth: 1,
    borderColor: '#D0E2CC',
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    marginBottom: 28,
  },
  infoIconCircle: {
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#2E4C20',
    lineHeight: 18,
    fontWeight: '500',
  },
  /* Primary Action Button */
  nextButton: {
    height: 54,
    backgroundColor: '#3B6029',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#3B6029',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
