import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { setGlobalLang, LangCode } from '@/utils/languageStore';

type LangOption = {
  id: string;
  code: string;
  nativeName: string;
  englishName: string;
  isOther?: boolean;
};

const LANGUAGE_LIST: LangOption[] = [
  { id: 'hi', code: 'hi', nativeName: 'हिंदी', englishName: 'Hindi' },
  { id: 'en', code: 'en', nativeName: 'English', englishName: 'English' },
  { id: 'bn', code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali' },
  { id: 'mr', code: 'mr', nativeName: 'मराठी', englishName: 'Marathi' },
  { id: 'gu', code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati' },
  { id: 'ta', code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil' },
  { id: 'te', code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu' },
  { id: 'kn', code: 'kn', nativeName: 'ಕನ್ನಡ', englishName: 'Kannada' },
  { id: 'ml', code: 'ml', nativeName: 'മലയാളം', englishName: 'Malayalam' },
  { id: 'pa', code: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi' },
  { id: 'or', code: 'or', nativeName: 'ଓଡ଼ିଆ', englishName: 'Odia' },
  { id: 'other', code: 'other', nativeName: 'अन्य भाषा', englishName: 'Other', isOther: true },
];

export default function LanguageSelectScreen() {
  const router = useRouter();

  const [selectedLangId, setSelectedLangId] = useState<string>('hi');
  const [isLangDropdownVisible, setIsLangDropdownVisible] = useState<boolean>(false);

  const handleProceed = () => {
    const langCode = (selectedLangId === 'other' ? 'hi' : selectedLangId) as LangCode;
    setGlobalLang(langCode);
    router.replace({ pathname: '/app-login', params: { lang: langCode } });
  };

  const selectedItem = LANGUAGE_LIST.find((item) => item.id === selectedLangId) || LANGUAGE_LIST[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Header Bar with Language Selector Pill */}
          <View style={styles.headerBar}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={styles.langSelectorBtn}
              onPress={() => setIsLangDropdownVisible(!isLangDropdownVisible)}
              activeOpacity={0.8}
            >
              <Ionicons name="globe-outline" size={16} color="#2C2C2C" style={{ marginRight: 6 }} />
              <Text style={styles.langSelectorText}>{selectedItem.nativeName}</Text>
              <Ionicons name="chevron-down" size={14} color="#2C2C2C" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            {isLangDropdownVisible && (
              <View style={styles.dropdownMenu}>
                {LANGUAGE_LIST.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setSelectedLangId(item.id);
                      setIsLangDropdownVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        selectedLangId === item.id && styles.dropdownOptionTextActive,
                      ]}
                    >
                      {item.nativeName} ({item.englishName})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Logo & Brand Header */}
          <View style={styles.brandContainer}>
            <Image
              source={require('@/assets/images/logo_icon.png')}
              style={styles.logoIcon}
              resizeMode="contain"
            />
            <Text style={styles.brandTitle}>कलासेतु</Text>
            <Text style={styles.brandTagline}>आपकी कला, आपकी पहचान</Text>
          </View>

          {/* Main Title & Subtitle */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>
              आप किस भाषा में{'\n'}ऐप चलाना चाहते हैं?
            </Text>
            <Text style={styles.subtitle}>अपनी सुविधा के अनुसार भाषा चुनें</Text>
          </View>

          {/* 3-Column Language Grid */}
          <View style={styles.gridContainer}>
            {LANGUAGE_LIST.map((item) => {
              const isSelected = selectedLangId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.langCard,
                    isSelected && styles.langCardSelected,
                  ]}
                  onPress={() => setSelectedLangId(item.id)}
                  activeOpacity={0.85}
                >
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    </View>
                  )}

                  <Text
                    style={[
                      styles.nativeNameText,
                      isSelected && styles.nativeNameTextSelected,
                    ]}
                  >
                    {item.nativeName}
                  </Text>
                  <Text style={styles.englishNameText}>{item.englishName}</Text>

                  {item.isOther && (
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#666666"
                      style={styles.otherArrowIcon}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Primary Action Button: "आगे बढ़ें →" */}
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={handleProceed}
            activeOpacity={0.88}
          >
            <Text style={styles.proceedButtonText}>आगे बढ़ें</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>

          {/* Bottom Village Artwork Footer */}
          <View style={styles.footerSection}>
            <View style={styles.dividerRow}>
              <View style={styles.dividerDash} />
              <Text style={styles.footerMotto}>रहेंगे साथ, बढ़ेगी कला</Text>
              <View style={styles.dividerDash} />
            </View>

            <Image
              source={require('@/assets/images/village_sketch.png')}
              style={styles.villageSketchImage}
              resizeMode="cover"
            />
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  /* Header Bar */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 8,
    paddingBottom: 4,
    zIndex: 100,
  },
  langSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    elevation: 1,
    ...Platform.select({
      web: { boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    }),
  },
  langSelectorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E0D8',
    elevation: 6,
    ...Platform.select({
      web: { boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
    }),
    zIndex: 1000,
    minWidth: 160,
    paddingVertical: 6,
  },
  dropdownOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dropdownOptionText: {
    fontSize: 13,
    color: '#333333',
  },
  dropdownOptionTextActive: {
    fontWeight: 'bold',
    color: '#3B6029',
  },
  /* Brand Container */
  brandContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
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
  /* Title Section */
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
  },
  /* 3-Column Language Grid */
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 24,
    rowGap: 10,
  },
  langCard: {
    width: '31%',
    minHeight: 74,
    backgroundColor: '#FAF9F5',
    borderWidth: 1,
    borderColor: '#EAE7DF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  langCardSelected: {
    backgroundColor: '#F0F6EE',
    borderColor: '#3B6029',
    borderWidth: 1.5,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#3B6029',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nativeNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
    textAlign: 'center',
  },
  nativeNameTextSelected: {
    color: '#3B6029',
  },
  englishNameText: {
    fontSize: 12,
    color: '#777777',
    textAlign: 'center',
  },
  otherArrowIcon: {
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  /* Proceed Button */
  proceedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 12,
    height: 52,
    marginHorizontal: 20,
    marginBottom: 24,
    elevation: 2,
  },
  proceedButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  /* Footer Section */
  footerSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dividerDash: {
    width: 24,
    height: 1,
    backgroundColor: '#C5C0B6',
  },
  footerMotto: {
    fontSize: 13,
    fontWeight: '500',
    color: '#777777',
    marginHorizontal: 10,
  },
  villageSketchImage: {
    width: '100%',
    height: 80,
    opacity: 0.85,
  },
});
