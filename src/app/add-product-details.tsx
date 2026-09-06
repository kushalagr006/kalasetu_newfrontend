import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGlobalLang, LangCode } from '@/utils/languageStore';

const TRANSLATIONS = {
  en: {
    headerTitle: 'Add Product Details',
    changePhoto: 'Change Photo',
    imgSuccess: 'Image uploaded successfully',
    heading: 'Now add product details',
    subtitle: 'You can tell us about your product by voice or type it manually.',
    speakTitle: 'Speak and Add Details',
    speakSub: 'Tap the mic and tell us about your product.',
    writeTitle: 'Write Details',
    writeSub: 'Type the product details manually.',
    continueBtn: 'Continue →',
  },
  hi: {
    headerTitle: 'उत्पाद विवरण जोड़ें',
    changePhoto: 'फोटो बदलें',
    imgSuccess: 'इमेज सफलतापूर्वक अपलोड की गई',
    heading: 'अब उत्पाद विवरण जोड़ें',
    subtitle: 'आप बोलकर या लिखकर अपने उत्पाद की जानकारी दे सकते हैं।',
    speakTitle: 'बोलकर विवरण जोड़ें (Speak)',
    speakSub: 'माइक पर टैप करें और अपने उत्पाद के बारे में बताएं।',
    writeTitle: 'लिखकर विवरण जोड़ें (Write)',
    writeSub: 'उत्पाद का नाम, विवरण और मूल्य खुद टाइप करें।',
    continueBtn: 'आगे बढ़ें →',
  },
};

export default function AddProductDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const [globalLang] = useGlobalLang();

  const selectedLang: LangCode =
    (params.lang as LangCode) || (globalLang === 'en' ? 'en' : 'hi');
  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.en;

  const [selectedOption, setSelectedOption] = useState<'voice' | 'text' | null>(null);

  const handleSpeakClick = () => {
    setSelectedOption('voice');
    router.push({ pathname: '/add-product-voice', params: { lang: selectedLang } });
  };

  const handleWriteClick = () => {
    setSelectedOption('text');
    router.push({ pathname: '/add-product-text', params: { lang: selectedLang } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        
        {/* Top Header Bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{t.headerTitle}</Text>
          
          {/* Spacer to keep title perfectly centered */}
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Photo Card with Floating Change Photo Button */}
          <View style={styles.photoCard}>
            <Image
              source={require('@/assets/images/cust_prod_clay.png')}
              style={styles.photoImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.changePhotoBtn}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={15} color="#1A1A1A" />
              <Text style={styles.changePhotoText}>{t.changePhoto}</Text>
            </TouchableOpacity>
          </View>

          {/* Success Banner */}
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#3B6029" />
            <Text style={styles.successText}>{t.imgSuccess}</Text>
          </View>

          {/* Heading & Subtitle */}
          <Text style={styles.headingText}>{t.heading}</Text>
          <Text style={styles.subtitleText}>{t.subtitle}</Text>

          {/* Option 1: Speak and Add Details (Mic) */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedOption === 'voice' && styles.optionCardSelected,
            ]}
            onPress={handleSpeakClick}
            activeOpacity={0.85}
          >
            <View style={styles.iconCircleGreen}>
              <Ionicons name="mic" size={24} color="#FFFFFF" />
            </View>
            
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>{t.speakTitle}</Text>
              <Text style={styles.cardSub}>{t.speakSub}</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={selectedOption === 'voice' ? '#3B6029' : '#888888'}
            />
          </TouchableOpacity>

          {/* Option 2: Write Details (Keyboard) */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedOption === 'text' && styles.optionCardSelected,
            ]}
            onPress={handleWriteClick}
            activeOpacity={0.85}
          >
            <View style={styles.iconCircleGreen}>
              <MaterialCommunityIcons name="keyboard-outline" size={24} color="#FFFFFF" />
            </View>

            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>{t.writeTitle}</Text>
              <Text style={styles.cardSub}>{t.writeSub}</Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={selectedOption === 'text' ? '#3B6029' : '#888888'}
            />
          </TouchableOpacity>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FAF8F5',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 36,
  },
  /* Photo Card */
  photoCard: {
    width: '100%',
    height: 210,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E3DC',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  changePhotoBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  /* Success Banner */
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF6EE',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
    gap: 10,
  },
  successText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B6029',
  },
  /* Headings */
  headingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A0A0A',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 20,
  },
  /* Option Cards */
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    padding: 16,
    marginBottom: 14,
  },
  optionCardSelected: {
    backgroundColor: '#F3F9F4',
    borderColor: '#3B6029',
    borderWidth: 1.5,
  },
  iconCircleGreen: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#3B6029',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextCol: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0A0A',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 17,
  },
});
