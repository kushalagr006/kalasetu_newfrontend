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
    title: 'Tell me more about you',
    subtitle: 'Please enter your location, social category, and work details.',
    stateLabel: 'State',
    statePlaceholder: 'Enter your State (e.g. Rajasthan, Odisha)',
    districtLabel: 'District',
    districtPlaceholder: 'Enter your District',
    cityLabel: 'Village or City',
    cityPlaceholder: 'Enter your Village or City name',
    categoryLabel: 'Select Category',
    categories: [
      { key: 'sc', label: 'Scheduled Caste (SC)' },
      { key: 'st', label: 'Scheduled Tribe (ST)' },
      { key: 'pwd', label: 'PWD (Specially Abled)' },
      { key: 'shg', label: 'Women SHG Group' },
      { key: 'tribal', label: 'Tribals' },
    ],
    workLabel: 'What type of work/craft do you do?',
    workPlaceholder: 'e.g. Clay Pottery, Handloom Weaving, Wood Carving',
    nextBtn: 'Continue →',
    errState: 'Please enter your State.',
    errDistrict: 'Please enter your District.',
    errCity: 'Please enter your Village or City.',
    errWork: 'Please specify the type of work or craft you do.',
    listeningMsg: 'Listening... speak now',
  },
  hi: {
    title: 'अपने बारे में अधिक जानकारी दें',
    subtitle: 'कृपया अपना राज्य, जिला, स्थान, वर्ग और काम का विवरण भरें।',
    stateLabel: 'राज्य (State)',
    statePlaceholder: 'अपना राज्य लिखें (जैसे राजस्थान, ओडिसा)',
    districtLabel: 'जिला (District)',
    districtPlaceholder: 'अपना जिला लिखें',
    cityLabel: 'गांव या शहर (Village or City)',
    cityPlaceholder: 'अपने गांव या शहर का नाम लिखें',
    categoryLabel: 'श्रेणी / सामाजिक वर्ग चुनें',
    categories: [
      { key: 'sc', label: 'अनुसूचित जाति (SC)' },
      { key: 'st', label: 'अनुसूचित जनजाति (ST)' },
      { key: 'pwd', label: 'दिव्यांगजन (PWD)' },
      { key: 'shg', label: 'महिला स्व-सहायता समूह (SHG)' },
      { key: 'tribal', label: 'जनजातीय समुदाय (Tribals)' },
    ],
    workLabel: 'आप किस प्रकार का काम/शिल्प करते हैं?',
    workPlaceholder: 'जैसे मिट्टी के बर्तन (Pottery), हथकरघा (Handloom), लकड़ी की नक्काशी',
    nextBtn: 'आगे बढ़ें →',
    errState: 'कृपया अपना राज्य दर्ज करें।',
    errDistrict: 'कृपया अपना जिला दर्ज करें।',
    errCity: 'कृपया अपना गांव या शहर दर्ज करें।',
    errWork: 'कृपया अपने काम/शिल्प का प्रकार दर्ज करें।',
    listeningMsg: 'सुन रहे हैं... बोलिए',
  },
};

export default function AppRegisterPersonalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const [globalLang] = useGlobalLang();

  const selectedLang: LangCode =
    (params.lang as LangCode) || (globalLang === 'en' ? 'en' : 'hi');
  const t = (TRANSLATIONS as any)[selectedLang] || TRANSLATIONS.hi;

  const [stateName, setStateName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [cityName, setCityName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('sc');
  const [workType, setWorkType] = useState('');

  const [activeMicField, setActiveMicField] = useState<string | null>(null);

  const handleMicPress = (field: string) => {
    setActiveMicField(field);
    setTimeout(() => {
      if (field === 'state') {
        setStateName(selectedLang === 'hi' ? 'राजस्थान' : 'Rajasthan');
      } else if (field === 'district') {
        setDistrictName(selectedLang === 'hi' ? 'जयपुर' : 'Jaipur');
      } else if (field === 'city') {
        setCityName(selectedLang === 'hi' ? 'सांगानेर' : 'Sanganer');
      } else if (field === 'work') {
        setWorkType(selectedLang === 'hi' ? 'ब्लॉक प्रिंटिंग और कपड़े की बुनाई' : 'Block Printing & Textiles');
      }
      setActiveMicField(null);
    }, 1500);
  };

  const handleNext = () => {
    if (!stateName.trim()) {
      alert(t.errState);
      return;
    }
    if (!districtName.trim()) {
      alert(t.errDistrict);
      return;
    }
    if (!cityName.trim()) {
      alert(t.errCity);
      return;
    }
    if (!workType.trim()) {
      alert(t.errWork);
      return;
    }
    // All valid - navigate to existing Home dashboard
    router.push({ pathname: '/home', params: { lang: selectedLang } });
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
          {/* Top Bar (Only Back Arrow) */}
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

          {/* Field 1: State */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.stateLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder={t.statePlaceholder}
                placeholderTextColor="#999999"
                value={stateName}
                onChangeText={setStateName}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  activeMicField === 'state' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('state')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="mic"
                  size={20}
                  color={activeMicField === 'state' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Field 2: District */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.districtLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder={t.districtPlaceholder}
                placeholderTextColor="#999999"
                value={districtName}
                onChangeText={setDistrictName}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  activeMicField === 'district' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('district')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="mic"
                  size={20}
                  color={activeMicField === 'district' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Field 3: Village or City */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.cityLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder={t.cityPlaceholder}
                placeholderTextColor="#999999"
                value={cityName}
                onChangeText={setCityName}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  activeMicField === 'city' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('city')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="mic"
                  size={20}
                  color={activeMicField === 'city' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Field 4: Category Selection (SC, ST, PWD, SHG, Tribals) */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.categoryLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.categoryWrap}>
              {t.categories.map((cat: { key: string; label: string }) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat.key && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.key)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={selectedCategory === cat.key ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={selectedCategory === cat.key ? '#3B6029' : '#777'}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat.key && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Field 5: What type of work you do? (with Mic Button) */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.workLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.textInput, { height: 60 }]}
                placeholder={t.workPlaceholder}
                placeholderTextColor="#999999"
                multiline={true}
                numberOfLines={2}
                value={workType}
                onChangeText={setWorkType}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  { height: 60 },
                  activeMicField === 'work' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('work')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="mic"
                  size={22}
                  color={activeMicField === 'work' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Voice Toast Indicator */}
          {activeMicField && (
            <View style={styles.voiceToast}>
              <Ionicons name="mic-circle" size={24} color="#3B6029" />
              <Text style={styles.voiceToastText}>{t.listeningMsg}</Text>
            </View>
          )}

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
  categoryWrap: {
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  categoryChipActive: {
    borderColor: '#3B6029',
    backgroundColor: '#F3F8F1',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#444444',
  },
  categoryChipTextActive: {
    fontWeight: 'bold',
    color: '#3B6029',
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
  nextButton: {
    height: 54,
    backgroundColor: '#3B6029',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
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
