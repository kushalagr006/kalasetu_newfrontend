import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

type LangCode = 'hi' | 'en';

type DropdownField = 'state' | 'district' | 'village' | 'category' | 'work' | null;

const TRANSLATIONS: Record<
  LangCode,
  {
    step: string;
    title: string;
    subtitle: string;
    stateLabel: string;
    statePlaceholder: string;
    districtLabel: string;
    districtPlaceholder: string;
    villageLabel: string;
    villagePlaceholder: string;
    categoryLabel: string;
    categoryPlaceholder: string;
    workLabel: string;
    workPlaceholder: string;
    nextBtn: string;
    selectModalTitle: string;
    closeBtn: string;
    requiredError: string;
  }
> = {
  hi: {
    step: 'Step 3 of 4',
    title: 'अपने बारे में बताएं',
    subtitle: 'यह जानकारी आपके प्रोफ़ाइल के लिए आवश्यक है।',
    stateLabel: 'राज्य',
    statePlaceholder: 'राज्य चुनें',
    districtLabel: 'जिला',
    districtPlaceholder: 'जिला चुनें',
    villageLabel: 'गाँव / शहर',
    villagePlaceholder: 'गाँव / शहर चुनें',
    categoryLabel: 'आप किस श्रेणी में आते हैं?',
    categoryPlaceholder: 'श्रेणी चुनें (जैसे: SC, ST, OBC, General, आदि)',
    workLabel: 'आप क्या काम करते हैं?',
    workPlaceholder: 'अपना काम चुनें (जैसे: बुनाई, मिट्टी के बर्तन, हस्तशिल्प)',
    nextBtn: 'आगे बढ़ें',
    selectModalTitle: 'विकल्प चुनें',
    closeBtn: 'बंद करें',
    requiredError: 'कृपया सभी आवश्यक फ़ील्ड चुनें।',
  },
  en: {
    step: 'Step 3 of 4',
    title: 'Tell us about yourself',
    subtitle: 'This information is required for your profile.',
    stateLabel: 'State',
    statePlaceholder: 'Select state',
    districtLabel: 'District',
    districtPlaceholder: 'Select district',
    villageLabel: 'Village / City',
    villagePlaceholder: 'Select village / city',
    categoryLabel: 'Which category do you belong to?',
    categoryPlaceholder: 'Select category (e.g. SC, ST, OBC, General, etc.)',
    workLabel: 'What work do you do?',
    workPlaceholder: 'Select your work (e.g. Weaving, Pottery, Handicrafts)',
    nextBtn: 'Proceed',
    selectModalTitle: 'Select Option',
    closeBtn: 'Close',
    requiredError: 'Please select all required fields.',
  },
};

const OPTIONS = {
  state: {
    hi: [
      'राजस्थान',
      'उत्तर प्रदेश',
      'मध्य प्रदेश',
      'बिहार',
      'महाराष्ट्र',
      'गुजरात',
      'पश्चिम बंगाल',
      'ओडिशा',
      'पंजाब',
      'हरियाणा',
      'तमिलनाडु',
      'कर्नाटक',
      'तेलंगाना',
      'आंध्र प्रदेश',
      'केरल',
      'असम',
      'छत्तीसगढ़',
      'झारखंड',
      'अन्य राज्य',
    ],
    en: [
      'Rajasthan',
      'Uttar Pradesh',
      'Madhya Pradesh',
      'Bihar',
      'Maharashtra',
      'Gujarat',
      'West Bengal',
      'Odisha',
      'Punjab',
      'Haryana',
      'Tamil Nadu',
      'Karnataka',
      'Telangana',
      'Andhra Pradesh',
      'Kerala',
      'Assam',
      'Chhattisgarh',
      'Jharkhand',
      'Other State',
    ],
  },
  district: {
    hi: [
      'जयपुर',
      'जोधपुर',
      'कोटा',
      'उदयपुर',
      'वाराणसी',
      'लखनऊ',
      'आगरा',
      'पटना',
      'भोपाल',
      'इंदौर',
      'अहमदाबाद',
      'सुरत',
      'कोलकाता',
      'भुवनेश्वर',
      'अन्य जिला',
    ],
    en: [
      'Jaipur',
      'Jodhpur',
      'Kota',
      'Udaipur',
      'Varanasi',
      'Lucknow',
      'Agra',
      'Patna',
      'Bhopal',
      'Indore',
      'Ahmedabad',
      'Surat',
      'Kolkata',
      'Bhubaneswar',
      'Other District',
    ],
  },
  village: {
    hi: [
      'मुख्य गाँव / ग्राम पंचायत',
      'तहसील / कस्बा',
      'नगर निगम / मुख्य शहर',
      'औद्योगिक क्षेत्र / बाज़ार',
      'अन्य',
    ],
    en: [
      'Main Village / Gram Panchayat',
      'Tehsil / Town',
      'Municipal / City Center',
      'Industrial / Market Hub',
      'Other',
    ],
  },
  category: {
    hi: [
      'SC (अनुसूचित जाति)',
      'ST (अनुसूचित जनजाति)',
      'OBC (अन्य पिछड़ा वर्ग)',
      'General (सामान्य)',
      'EWS (आर्थिक रूप से कमजोर)',
      'अन्य',
    ],
    en: [
      'SC (Scheduled Caste)',
      'ST (Scheduled Tribe)',
      'OBC (Other Backward Class)',
      'General',
      'EWS (Economically Weaker Section)',
      'Other',
    ],
  },
  work: {
    hi: [
      'बुनाई और हथकरघा (Weaving)',
      'मिट्टी के बर्तन (Pottery)',
      'हस्तशिल्प (Handicrafts)',
      'कढ़ाई और सिलाई (Embroidery)',
      'लकड़ी पर नक्काशी (Wood Carving)',
      'चित्रकारी और लोक कला (Painting)',
      'धातु शिल्प (Metal Craft)',
      'आभूषण निर्माण (Jewelry Making)',
      'कालीन और दरी बुनाई (Carpet Weaving)',
      'बांस और बेंट शिल्प (Bamboo Craft)',
      'अन्य शिल्प कार्य (Other Artisan Work)',
    ],
    en: [
      'Weaving & Handloom',
      'Pottery & Clay Work',
      'Handicrafts & Decor',
      'Embroidery & Sewing',
      'Wood Carving & Craft',
      'Painting & Folk Art',
      'Metal Craft',
      'Jewelry Making',
      'Carpet & Rug Weaving',
      'Bamboo & Cane Craft',
      'Other Artisan Work',
    ],
  },
};

export default function AboutYourselfScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; lang?: string }>();
  const lang: LangCode = (params.lang as LangCode) === 'hi' ? 'hi' : 'en';

  const t = TRANSLATIONS[lang];

  const [stateVal, setStateVal] = useState('');
  const [districtVal, setDistrictVal] = useState('');
  const [villageVal, setVillageVal] = useState('');
  const [categoryVal, setCategoryVal] = useState('');
  const [workVal, setWorkVal] = useState('');

  const [activeModal, setActiveModal] = useState<DropdownField>(null);

  const handleNext = () => {
    router.replace({ pathname: '/home', params: { lang, phone: params.phone } });
  };

  const handleMicPress = (fieldLabel: string) => {
    alert(
      lang === 'hi'
        ? `${fieldLabel} के लिए वॉइस इनपुट जल्द ही उपलब्ध होगा!`
        : `Voice input for ${fieldLabel} coming soon!`
    );
  };

  const openDropdown = (field: DropdownField) => {
    setActiveModal(field);
  };

  const selectModalOption = (value: string) => {
    if (activeModal === 'state') setStateVal(value);
    else if (activeModal === 'district') setDistrictVal(value);
    else if (activeModal === 'village') setVillageVal(value);
    else if (activeModal === 'category') setCategoryVal(value);
    else if (activeModal === 'work') setWorkVal(value);

    setActiveModal(null);
  };

  const getModalTitle = () => {
    if (!activeModal) return t.selectModalTitle;
    if (activeModal === 'state') return t.stateLabel;
    if (activeModal === 'district') return t.districtLabel;
    if (activeModal === 'village') return t.villageLabel;
    if (activeModal === 'category') return t.categoryLabel;
    if (activeModal === 'work') return t.workLabel;
    return t.selectModalTitle;
  };

  const getModalOptions = () => {
    if (!activeModal) return [];
    return OPTIONS[activeModal][lang];
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

      {/* Top Bar Header with Back Arrow and Step 3 of 4 */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.stepText}>{t.step}</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Subtitle */}
        <Text style={styles.title}>{t.title}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>

        {/* Field 1: State (राज्य) */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>
            {t.stateLabel} <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.dropdownBox}
              onPress={() => openDropdown('state')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !stateVal && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {stateVal || t.statePlaceholder}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.micBtn}
              onPress={() => handleMicPress(t.stateLabel)}
              activeOpacity={0.8}
            >
              <Ionicons name="mic" size={20} color="#3B6029" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Field 2: District (जिला) */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>
            {t.districtLabel} <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.dropdownBox}
              onPress={() => openDropdown('district')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !districtVal && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {districtVal || t.districtPlaceholder}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.micBtn}
              onPress={() => handleMicPress(t.districtLabel)}
              activeOpacity={0.8}
            >
              <Ionicons name="mic" size={20} color="#3B6029" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Field 3: Village / City (गाँव / शहर) */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>
            {t.villageLabel} <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.dropdownBox}
              onPress={() => openDropdown('village')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !villageVal && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {villageVal || t.villagePlaceholder}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.micBtn}
              onPress={() => handleMicPress(t.villageLabel)}
              activeOpacity={0.8}
            >
              <Ionicons name="mic" size={20} color="#3B6029" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Field 4: Category (आप किस श्रेणी में आते हैं?) */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>
            {t.categoryLabel} <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.dropdownBox}
              onPress={() => openDropdown('category')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !categoryVal && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {categoryVal || t.categoryPlaceholder}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.micBtn}
              onPress={() => handleMicPress(t.categoryLabel)}
              activeOpacity={0.8}
            >
              <Ionicons name="mic" size={20} color="#3B6029" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Field 5: Work Type (आप क्या काम करते हैं?) */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>
            {t.workLabel} <Text style={styles.requiredStar}>*</Text>
          </Text>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={styles.dropdownBox}
              onPress={() => openDropdown('work')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !workVal && styles.placeholderText,
                ]}
                numberOfLines={1}
              >
                {workVal || t.workPlaceholder}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.micBtn}
              onPress={() => handleMicPress(t.workLabel)}
              activeOpacity={0.8}
            >
              <Ionicons name="mic" size={20} color="#3B6029" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.88}
        >
          <Text style={styles.nextButtonText}>{t.nextBtn}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Selection Picker */}
      <Modal
        visible={activeModal !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getModalTitle()}</Text>
              <TouchableOpacity
                onPress={() => setActiveModal(null)}
                style={styles.modalCloseIconBtn}
              >
                <Ionicons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={getModalOptions()}
              keyExtractor={(item, idx) => `${item}-${idx}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => selectModalOption(item)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionItemText}>{item}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.optionSeparator} />}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -6,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
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
    marginBottom: 24,
  },
  fieldBlock: {
    marginBottom: 20,
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
  dropdownBox: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    marginRight: 8,
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  micBtn: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#EBF3ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 10,
    height: 52,
    marginTop: 16,
    elevation: 2,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '65%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalCloseIconBtn: {
    padding: 4,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  optionItemText: {
    fontSize: 15,
    color: '#1F2937',
  },
  optionSeparator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
  },
});
