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

type LangCode = 'hi' | 'en';

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'English' },
];

const TRANSLATIONS: Record<LangCode, {
  headerTitle: string;
  headerSub: string;
  choice1Title: string;
  choice1Sub1: string;
  choice1Sub2: string;
  choice2Title: string;
  choice2Sub1: string;
  choice2Sub2: string;
  tip1: string;
  tip2: string;
  modalTitle: string;
}> = {
  hi: {
    headerTitle: 'नया उत्पाद जोड़ें',
    headerSub: 'अपना उत्पाद जोड़ने का तरीका चुनें',
    choice1Title: 'आवाज़ से',
    choice1Sub1: 'बोलकर जानकारी दें',
    choice1Sub2: 'हम भर देंगे',
    choice2Title: 'लिखकर',
    choice2Sub1: 'टेक्स्ट में जानकारी भरें',
    choice2Sub2: 'और उत्पाद जोड़ें',
    tip1: 'दोनों तरीकों से उत्पाद जोड़ना आसान है।',
    tip2: 'आप अपनी सुविधा के अनुसार चुनें।',
    modalTitle: 'भाषा चुनें / Select Language',
  },
  en: {
    headerTitle: 'Add New Product',
    headerSub: 'Choose how to add your product',
    choice1Title: 'By Voice',
    choice1Sub1: 'Speak product details',
    choice1Sub2: 'We will fill for you',
    choice2Title: 'By Writing',
    choice2Sub1: 'Fill in details in text',
    choice2Sub2: 'and add product',
    tip1: 'Adding products is easy with both methods.',
    tip2: 'Choose according to your convenience.',
    modalTitle: 'Select Language / भाषा चुनें',
  },
};

export default function AddProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const initialLang: LangCode = (params.lang as LangCode) || 'hi';

  const [selectedLang, setSelectedLang] = useState<LangCode>(initialLang);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);

  const t = TRANSLATIONS[selectedLang];
  const currentLangLabel = LANGUAGES.find((l) => l.code === selectedLang)?.label || 'हिंदी';

  const handleVoiceOption = () => {
    router.push({ pathname: '/add-product-voice', params: { lang: selectedLang } });
  };

  const handleTextOption = () => {
    router.push({ pathname: '/add-product-text', params: { lang: selectedLang } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#3B6029" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.topGreenHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerTitleCenter}>
            <Text style={styles.headerTitle}>{t.headerTitle}</Text>
            <Text style={styles.headerSubtitle}>{t.headerSub}</Text>
          </View>

          {/* Language Switcher Pill */}
          <TouchableOpacity
            style={styles.langSelectorBtn}
            onPress={() => setIsLangModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="globe-outline" size={13} color="#3B6029" />
            <Text style={styles.langSelectorText}>{currentLangLabel}</Text>
            <Ionicons name="chevron-down" size={11} color="#3B6029" />
          </TouchableOpacity>
        </View>

        {/* Scrollable Choice Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Card 1: आवाज़ से */}
          <TouchableOpacity
            style={styles.choiceCard}
            onPress={handleVoiceOption}
            activeOpacity={0.88}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="mic" size={38} color="#3B6029" />
            </View>

            <Text style={styles.choiceTitle}>{t.choice1Title}</Text>
            <Text style={styles.choiceSubtitle}>{t.choice1Sub1}</Text>
            <Text style={styles.choiceSubtitle}>{t.choice1Sub2}</Text>
          </TouchableOpacity>

          {/* Card 2: लिखकर */}
          <TouchableOpacity
            style={styles.choiceCard}
            onPress={handleTextOption}
            activeOpacity={0.88}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="pencil" size={34} color="#3B6029" />
            </View>

            <Text style={styles.choiceTitle}>{t.choice2Title}</Text>
            <Text style={styles.choiceSubtitle}>{t.choice2Sub1}</Text>
            <Text style={styles.choiceSubtitle}>{t.choice2Sub2}</Text>
          </TouchableOpacity>

          {/* Bottom Tip Banner */}
          <View style={styles.tipRow}>
            <Ionicons name="bulb-outline" size={28} color="#3B6029" style={styles.bulbIcon} />
            <View style={styles.tipTextGroup}>
              <Text style={styles.tipText}>{t.tip1}</Text>
              <Text style={styles.tipText}>{t.tip2}</Text>
            </View>
          </View>
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
                      setSelectedLang(item.code);
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
    backgroundColor: '#3B6029',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },

  /* Header Bar */
  topGreenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3B6029',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitleCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#EAF2E8',
    marginTop: 2,
    textAlign: 'center',
  },
  langSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
  langSelectorText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3B6029',
  },

  /* Scrollable Body Content */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 18,
  },

  /* Choice Cards */
  choiceCard: {
    width: '100%',
    backgroundColor: '#F0F7ED',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E0D8',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  choiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B6029',
    marginBottom: 8,
  },
  choiceSubtitle: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 20,
  },

  /* Tip Banner */
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 8,
    gap: 12,
  },
  bulbIcon: {
    marginTop: 2,
  },
  tipTextGroup: {
    flex: 1,
  },
  tipText: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 20,
  },

  /* Modal Styles */
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
