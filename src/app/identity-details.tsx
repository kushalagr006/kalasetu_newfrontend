import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

type LangCode = 'hi' | 'en';

const TRANSLATIONS: Record<LangCode, {
  title: string;
  subtitle: string;
  aadhaarLabel: string;
  aadhaarPlaceholder: string;
  aadhaarExample: string;
  panLabel: string;
  panPlaceholder: string;
  panExample: string;
  gstLabel: string;
  gstPlaceholder: string;
  gstExample: string;
  infoNote: string;
  nextBtn: string;
  aadhaarRequiredError: string;
  panRequiredError: string;
}> = {
  hi: {
    title: 'पहचान विवरण',
    subtitle: 'अपनी पहचान सत्यापित करने के लिए कृपया निम्नलिखित विवरण प्रदान करें।',
    aadhaarLabel: 'आधार कार्ड नंबर',
    aadhaarPlaceholder: '12 अंकों का आधार नंबर दर्ज करें',
    aadhaarExample: 'उदाहरण: 1234 5678 9012',
    panLabel: 'पैन कार्ड नंबर',
    panPlaceholder: 'पैन नंबर दर्ज करें',
    panExample: 'उदाहरण: ABCDE1234F',
    gstLabel: 'जीएसटी नंबर (यदि उपलब्ध हो)',
    gstPlaceholder: 'जीएसटी नंबर दर्ज करें',
    gstExample: 'उदाहरण: 22AAAAA0000A1Z5',
    infoNote: 'आपकी जानकारी हमारे पास सुरक्षित है और इसका उपयोग केवल सत्यापन के लिए किया जाएगा।',
    nextBtn: 'आगे बढ़ें',
    aadhaarRequiredError: 'कृपया 12 अंकों का वैध आधार नंबर दर्ज करें।',
    panRequiredError: 'कृपया वैध पैन नंबर दर्ज करें।',
  },
  en: {
    title: 'Identity Details',
    subtitle: 'Please provide the following details to verify your identity.',
    aadhaarLabel: 'Aadhaar Card Number',
    aadhaarPlaceholder: 'Enter 12 digit Aadhaar number',
    aadhaarExample: 'Example: 1234 5678 9012',
    panLabel: 'PAN Card Number',
    panPlaceholder: 'Enter PAN number',
    panExample: 'Example: ABCDE1234F',
    gstLabel: 'GST Number (If available)',
    gstPlaceholder: 'Enter GST number',
    gstExample: 'Example: 22AAAAA0000A1Z5',
    infoNote: 'Your information is safe with us and will be used only for verification.',
    nextBtn: 'Next',
    aadhaarRequiredError: 'Please enter a valid 12-digit Aadhaar number.',
    panRequiredError: 'Please enter a valid PAN number.',
  },
};

export default function IdentityDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; lang?: string }>();
  const lang: LangCode = (params.lang as LangCode) === 'hi' ? 'hi' : 'en';

  const t = TRANSLATIONS[lang];

  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [gst, setGst] = useState('');

  const handleNext = () => {
    router.replace({ pathname: '/about-yourself', params: { lang, phone: params.phone } });
  };

  const handleMicPress = (field: string) => {
    alert(lang === 'hi' ? `${field} के लिए वॉइस इनपुट जल्द ही उपलब्ध होगा!` : `Voice input for ${field} coming soon!`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title Header */}
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>{t.subtitle}</Text>

          {/* Field 1: Aadhaar Card Number */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>
              {t.aadhaarLabel} <Text style={styles.requiredStar}>*</Text>
            </Text>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder={t.aadhaarPlaceholder}
                placeholderTextColor="#999999"
                keyboardType="numeric"
                maxLength={14}
                value={aadhaar}
                onChangeText={setAadhaar}
              />
              <TouchableOpacity
                style={styles.micBtn}
                onPress={() => handleMicPress(t.aadhaarLabel)}
                activeOpacity={0.8}
              >
                <Ionicons name="mic" size={20} color="#3B6029" />
              </TouchableOpacity>
            </View>
            <Text style={styles.exampleText}>{t.aadhaarExample}</Text>
          </View>

          {/* Field 2: PAN Card Number */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>
              {t.panLabel} <Text style={styles.requiredStar}>*</Text>
            </Text>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder={t.panPlaceholder}
                placeholderTextColor="#999999"
                autoCapitalize="characters"
                maxLength={10}
                value={pan}
                onChangeText={setPan}
              />
              <TouchableOpacity
                style={styles.micBtn}
                onPress={() => handleMicPress(t.panLabel)}
                activeOpacity={0.8}
              >
                <Ionicons name="mic" size={20} color="#3B6029" />
              </TouchableOpacity>
            </View>
            <Text style={styles.exampleText}>{t.panExample}</Text>
          </View>

          {/* Field 3: GST Number (Optional) */}
          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>{t.gstLabel}</Text>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder={t.gstPlaceholder}
                placeholderTextColor="#999999"
                autoCapitalize="characters"
                maxLength={15}
                value={gst}
                onChangeText={setGst}
              />
              <TouchableOpacity
                style={styles.micBtn}
                onPress={() => handleMicPress(t.gstLabel)}
                activeOpacity={0.8}
              >
                <Ionicons name="mic" size={20} color="#3B6029" />
              </TouchableOpacity>
            </View>
            <Text style={styles.exampleText}>{t.gstExample}</Text>
          </View>

          {/* Verification Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="information-circle-outline" size={22} color="#3B6029" />
            </View>
            <Text style={styles.infoCardText}>{t.infoNote}</Text>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.88}
          >
            <Text style={styles.nextButtonText}>{t.nextBtn}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 28,
  },
  fieldBlock: {
    marginBottom: 22,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  requiredStar: {
    color: '#DC2626',
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  micBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#EBF3ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF5F1',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
  },
  infoIconCircle: {
    marginRight: 12,
  },
  infoCardText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 10,
    height: 50,
    marginTop: 20,
    elevation: 2,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
