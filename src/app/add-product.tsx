import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGlobalLang, LangCode } from '@/utils/languageStore';

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'English' },
];

const TRANSLATIONS: Record<LangCode, {
  headerTitle: string;
  camHint: string;
  camSub: string;
  shutterText: string;
  nextBtn: string;
  modalTitle: string;
}> = {
  hi: {
    headerTitle: 'नया उत्पाद जोड़ें',
    camHint: 'उत्पाद को कैमरे के सामने रखें',
    camSub: '(भविष्य में यहाँ लाइव कैमरा/expo-image-picker एकीकृत होगा)',
    shutterText: 'फोटो खींचें',
    nextBtn: 'आगे बढ़ें (Next) →',
    modalTitle: 'भाषा चुनें / Select Language',
  },
  en: {
    headerTitle: 'Add New Product',
    camHint: 'Position product in center of frame',
    camSub: '(Future integration with live expo-image-picker camera)',
    shutterText: 'Snap Photo',
    nextBtn: 'Next →',
    modalTitle: 'Select Language / भाषा चुनें',
  },
};

export default function AddProductCameraScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const [globalLang] = useGlobalLang();

  const selectedLang: LangCode =
    (params.lang as LangCode) || (globalLang === 'en' ? 'en' : 'hi');
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.hi;
  const currentLangLabel = LANGUAGES.find((l) => l.code === selectedLang)?.label || 'हिंदी';

  const [hasSnapped, setHasSnapped] = useState(false);

  const handleSnapPhoto = () => {
    setHasSnapped(true);
  };

  const handleNext = () => {
    // Navigate to Description options (Voice vs Write) page
    router.push({
      pathname: '/add-product-details',
      params: { lang: selectedLang },
    });
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

          {/* Language Selector Pill */}
          <TouchableOpacity
            style={styles.langSelectorBtn}
            onPress={() => setIsLangModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="globe-outline" size={13} color="#2C2C2C" />
            <Text style={styles.langSelectorText}>{currentLangLabel}</Text>
            <Ionicons name="chevron-down" size={11} color="#2C2C2C" />
          </TouchableOpacity>
        </View>

        {/* Camera Main Body */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Central Camera Viewfinder Card */}
          <View style={styles.cameraViewfinderCard}>
            {/* Viewfinder Top Bar */}
            <View style={styles.viewfinderTopRow}>
              <Ionicons name="flash-off-outline" size={20} color="#666" />
              <View style={styles.liveIndicator}>
                <View style={styles.redDot} />
                <Text style={styles.liveText}>CAMERA</Text>
              </View>
              <Ionicons name="camera-reverse-outline" size={22} color="#666" />
            </View>

            {/* Central Camera Icon & Graphic */}
            <View style={styles.cameraGraphicBox}>
              <View style={styles.cameraCircleOuter}>
                <Ionicons
                  name={hasSnapped ? "checkmark-circle" : "camera"}
                  size={64}
                  color="#3B6029"
                />
              </View>
              <Text style={styles.camHintText}>
                {hasSnapped
                  ? selectedLang === 'hi' ? 'फोटो सफलतापूर्वक खींची गई!' : 'Photo Captured Successfully!'
                  : t.camHint}
              </Text>
              <Text style={styles.camSubText}>{t.camSub}</Text>
            </View>

            {/* Shutter Button */}
            <TouchableOpacity
              style={[styles.shutterButton, hasSnapped && styles.shutterButtonCaptured]}
              onPress={handleSnapPhoto}
              activeOpacity={0.8}
            >
              <View style={styles.shutterInnerCircle} />
            </TouchableOpacity>
            <Text style={styles.shutterText}>{t.shutterText}</Text>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.88}
          >
            <Text style={styles.nextButtonText}>{t.nextBtn}</Text>
          </TouchableOpacity>
        </ScrollView>

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
                      styles.langOptionItem,
                      selectedLang === item.code ? styles.langOptionSelected : null,
                    ]}
                    onPress={() => {
                      setIsLangModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.langOptionText,
                        selectedLang === item.code ? styles.langOptionTextSelected : null,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {selectedLang === item.code && (
                      <Ionicons name="checkmark" size={20} color="#3B6029" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
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
  langSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 4,
  },
  langSelectorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
  },
  /* Camera Viewfinder Card */
  cameraViewfinderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E0D8',
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  viewfinderTopRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7ED',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 6,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D32F2F',
  },
  liveText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3B6029',
    letterSpacing: 0.5,
  },
  cameraGraphicBox: {
    alignItems: 'center',
    paddingVertical: 24,
    width: '100%',
  },
  cameraCircleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#D0E2CC',
  },
  camHintText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 6,
  },
  camSubText: {
    fontSize: 12,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  shutterButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#3B6029',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 6,
    elevation: 4,
  },
  shutterButtonCaptured: {
    borderColor: '#2E4C20',
    backgroundColor: '#EAF2E8',
  },
  shutterInnerCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#3B6029',
  },
  shutterText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B6029',
    marginBottom: 8,
  },
  /* Next Button */
  nextButton: {
    height: 54,
    backgroundColor: '#3B6029',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 320,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  langOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#FAF8F5',
  },
  langOptionSelected: {
    backgroundColor: '#F0F7ED',
    borderWidth: 1,
    borderColor: '#3B6029',
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
