import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StatusBar,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalLang, LangCode } from '@/utils/languageStore';
import { GovtSidebar, GovtTopHeader } from '@/components/GovtLayout';

type SupplyType = 'goods' | 'service' | 'both';

export default function WebCreateTenderScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLang, setSelectedLang] = useGlobalLang();

  // Form Fields State
  const [tenderTitle, setTenderTitle] = useState('');
  const [workPurpose, setWorkPurpose] = useState('');
  const [category, setCategory] = useState('');
  const [supplyType, setSupplyType] = useState<SupplyType>('goods');
  const [shortDesc, setShortDesc] = useState('');
  const [totalQty, setTotalQty] = useState('');
  const [unit, setUnit] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const isHindi = selectedLang === 'hi';

  const handlePublishTender = () => {
    if (!tenderTitle || !workPurpose || !totalQty) {
      alert(isHindi ? 'कृपया सभी अनिवार्य (*) फील्ड भरें।' : 'Please fill all required (*) fields.');
      return;
    }
    alert(
      isHindi
        ? `टेंडर '${tenderTitle}' सफलतापूर्वक प्रकाशित कर दिया गया है!`
        : `Tender '${tenderTitle}' published successfully!`
    );
    router.push('/govt-dashboard');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        <View style={styles.mainLayoutRow}>
          {/* 1. Unified Left Sidebar Navigation */}
          {isDesktop && <GovtSidebar activeKey="tenders" />}

          {/* 2. Main Content Area */}
          <View style={styles.contentCol}>
            {/* Header Bar */}
            <GovtTopHeader />

            {/* Scrollable Form Content */}
            <ScrollView
              style={styles.dashboardScrollView}
              contentContainerStyle={styles.dashboardScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Page Title Header */}
              <View style={styles.pageHeaderRow}>
                <Text style={styles.pageTitle}>{isHindi ? 'नया टेंडर बनाएं' : 'Create New Tender'}</Text>
                <Text style={styles.pageSubtitle}>
                  {isHindi
                    ? 'आवश्यक जानकारी भरें और टेंडर प्रकाशित करें'
                    : 'Fill required details and publish tender'}
                </Text>
              </View>

              {/* Form Grid Row */}
              <View style={styles.formGridRow}>
                {/* Left Form Card */}
                <View style={[styles.formCard, { flex: 2.2 }]}>
                  {/* 4-Step Stepper Header */}
                  <View style={styles.stepperRow}>
                    {/* Step 1 */}
                    <View style={styles.stepItem}>
                      <View style={[styles.stepCircle, styles.stepCircleActive]}>
                        <Text style={styles.stepCircleTextActive}>1</Text>
                      </View>
                      <Text style={[styles.stepLabel, styles.stepLabelActive]}>
                        {isHindi ? 'टेंडर जानकारी' : 'Tender Info'}
                      </Text>
                    </View>
                    <View style={styles.stepLine} />

                    {/* Step 2 */}
                    <View style={styles.stepItem}>
                      <View style={styles.stepCircle}>
                        <Text style={styles.stepCircleText}>2</Text>
                      </View>
                      <Text style={styles.stepLabel}>{isHindi ? 'उत्पाद विवरण' : 'Product Details'}</Text>
                    </View>
                    <View style={styles.stepLine} />

                    {/* Step 3 */}
                    <View style={styles.stepItem}>
                      <View style={styles.stepCircle}>
                        <Text style={styles.stepCircleText}>3</Text>
                      </View>
                      <Text style={styles.stepLabel}>{isHindi ? 'शर्तें और समय' : 'Terms & Schedule'}</Text>
                    </View>
                    <View style={styles.stepLine} />

                    {/* Step 4 */}
                    <View style={styles.stepItem}>
                      <View style={styles.stepCircle}>
                        <Text style={styles.stepCircleText}>4</Text>
                      </View>
                      <Text style={styles.stepLabel}>{isHindi ? 'समीक्षा और प्रकाशित करें' : 'Review & Publish'}</Text>
                    </View>
                  </View>

                  <View style={styles.formFieldsDivider} />

                  {/* Form Input Fields */}
                  <View style={styles.inputsGrid}>
                    {/* Row 1: Title & Purpose */}
                    <View style={styles.inputRow2Col}>
                      <View style={styles.inputCol}>
                        <Text style={styles.fieldLabel}>
                          {isHindi ? 'टेंडर शीर्षक' : 'Tender Title'} <Text style={styles.reqStar}>*</Text>
                        </Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder={isHindi ? 'जैसे - बांस की टोकरी की खरीद' : 'e.g. Procurement of Bamboo Baskets'}
                          placeholderTextColor="#999999"
                          value={tenderTitle}
                          onChangeText={setTenderTitle}
                        />
                      </View>

                      <View style={styles.inputCol}>
                        <Text style={styles.fieldLabel}>
                          {isHindi ? 'कार्य / उद्देश्य' : 'Work / Purpose'} <Text style={styles.reqStar}>*</Text>
                        </Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder={isHindi ? 'उदा. सरकारी परियोजना के लिए' : 'e.g. For Govt Project'}
                          placeholderTextColor="#999999"
                          value={workPurpose}
                          onChangeText={setWorkPurpose}
                        />
                      </View>
                    </View>

                    {/* Row 2: Category & Supply Type */}
                    <View style={styles.inputRow2Col}>
                      <View style={styles.inputCol}>
                        <Text style={styles.fieldLabel}>
                          {isHindi ? 'श्रेणी' : 'Category'} <Text style={styles.reqStar}>*</Text>
                        </Text>
                        <TouchableOpacity style={styles.selectDropdownBtn}>
                          <Text style={styles.selectDropdownText}>
                            {category || (isHindi ? 'श्रेणी चुनें' : 'Select Category')}
                          </Text>
                          <Ionicons name="chevron-down" size={14} color="#777777" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.inputCol}>
                        <Text style={styles.fieldLabel}>
                          {isHindi ? 'आपूर्ति का प्रकार' : 'Supply Type'} <Text style={styles.reqStar}>*</Text>
                        </Text>
                        <View style={styles.radioGroupRow}>
                          <TouchableOpacity
                            style={styles.radioItem}
                            onPress={() => setSupplyType('goods')}
                          >
                            <Ionicons
                              name={supplyType === 'goods' ? 'radio-button-on' : 'radio-button-off'}
                              size={18}
                              color={supplyType === 'goods' ? '#E65100' : '#777777'}
                            />
                            <Text style={styles.radioLabelText}>{isHindi ? 'सामान' : 'Goods'}</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.radioItem}
                            onPress={() => setSupplyType('service')}
                          >
                            <Ionicons
                              name={supplyType === 'service' ? 'radio-button-on' : 'radio-button-off'}
                              size={18}
                              color={supplyType === 'service' ? '#E65100' : '#777777'}
                            />
                            <Text style={styles.radioLabelText}>{isHindi ? 'सेवा' : 'Service'}</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.radioItem}
                            onPress={() => setSupplyType('both')}
                          >
                            <Ionicons
                              name={supplyType === 'both' ? 'radio-button-on' : 'radio-button-off'}
                              size={18}
                              color={supplyType === 'both' ? '#E65100' : '#777777'}
                            />
                            <Text style={styles.radioLabelText}>{isHindi ? 'दोनों' : 'Both'}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    {/* Row 3: Short Description */}
                    <View style={styles.inputColFull}>
                      <Text style={styles.fieldLabel}>
                        {isHindi ? 'संक्षिप्त विवरण' : 'Short Description'} <Text style={styles.reqStar}>*</Text>
                      </Text>
                      <TextInput
                        style={styles.textAreaInput}
                        placeholder={isHindi ? 'टेंडर के बारे में संक्षिप्त जानकारी दें...' : 'Give brief details about tender...'}
                        placeholderTextColor="#999999"
                        multiline
                        numberOfLines={4}
                        maxLength={300}
                        value={shortDesc}
                        onChangeText={setShortDesc}
                      />
                      <Text style={styles.charCounterText}>{shortDesc.length} / 300</Text>
                    </View>

                    {/* Section Header: Quantity & Price */}
                    <Text style={styles.formSectionHeaderTitle}>{isHindi ? 'मात्रा और मूल्य' : 'Quantity & Price'}</Text>

                    {/* Row 4: Quantity, Unit, Min Price */}
                    <View style={styles.inputRow3Col}>
                      <View style={styles.inputCol}>
                        <Text style={styles.fieldLabel}>
                          {isHindi ? 'कुल मात्रा' : 'Total Quantity'} <Text style={styles.reqStar}>*</Text>
                        </Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder={isHindi ? 'कुल मात्रा दर्ज करें' : 'Enter total quantity'}
                          placeholderTextColor="#999999"
                          value={totalQty}
                          onChangeText={setTotalQty}
                        />
                      </View>

                      <View style={styles.inputCol}>
                        <Text style={styles.fieldLabel}>
                          {isHindi ? 'इकाई' : 'Unit'} <Text style={styles.reqStar}>*</Text>
                        </Text>
                        <TouchableOpacity style={styles.selectDropdownBtn}>
                          <Text style={styles.selectDropdownText}>{unit || (isHindi ? 'इकाई चुनें' : 'Select Unit')}</Text>
                          <Ionicons name="chevron-down" size={14} color="#777777" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.inputCol}>
                        <Text style={styles.fieldLabel}>
                          {isHindi ? 'न्यूनतम मूल्य (प्रति इकाई)' : 'Min Price (per unit)'} <Text style={styles.reqStar}>*</Text>
                        </Text>
                        <View style={styles.currencyInputBox}>
                          <View style={styles.currencySymbolBox}>
                            <Text style={styles.currencySymbolText}>₹</Text>
                          </View>
                          <TextInput
                            style={styles.currencyTextInput}
                            placeholder={isHindi ? 'राशि दर्ज करें' : 'Enter price'}
                            placeholderTextColor="#999999"
                            value={minPrice}
                            onChangeText={setMinPrice}
                            keyboardType="numeric"
                          />
                        </View>
                      </View>
                    </View>

                    {/* Section Header: Contact Person */}
                    <Text style={styles.formSectionHeaderTitle}>{isHindi ? 'संपर्क व्यक्ति' : 'Contact Person'}</Text>

                    {/* Row 5: Name, Phone, Email */}
                    <View style={styles.inputRow3Col}>
                      <View style={styles.inputCol}>
                        <Text style={styles.fieldLabel}>
                          {isHindi ? 'नाम' : 'Name'} <Text style={styles.reqStar}>*</Text>
                        </Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder={isHindi ? 'संपर्क व्यक्ति का नाम' : 'Contact person name'}
                          placeholderTextColor="#999999"
                          value={contactName}
                          onChangeText={setContactName}
                        />
                      </View>

                      <View style={styles.inputCol}>
                        <Text style={styles.fieldLabel}>
                          {isHindi ? 'मोबाइल नंबर' : 'Mobile Number'} <Text style={styles.reqStar}>*</Text>
                        </Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder={isHindi ? 'मोबाइल नंबर' : 'Mobile number'}
                          placeholderTextColor="#999999"
                          value={contactPhone}
                          onChangeText={setContactPhone}
                          keyboardType="numeric"
                          maxLength={10}
                        />
                      </View>

                      <View style={styles.inputCol}>
                        <Text style={styles.fieldLabel}>{isHindi ? 'ईमेल (वैकल्पिक)' : 'Email (Optional)'}</Text>
                        <TextInput
                          style={styles.textInput}
                          placeholder={isHindi ? 'ईमेल पता' : 'Email address'}
                          placeholderTextColor="#999999"
                          value={contactEmail}
                          onChangeText={setContactEmail}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Bottom Action Buttons Row */}
                  <View style={styles.formBottomActionRow}>
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => router.push('/govt-dashboard')}
                    >
                      <Text style={styles.cancelBtnText}>{isHindi ? 'रद्द करें' : 'Cancel'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.nextStepBtn}
                      onPress={handlePublishTender}
                      activeOpacity={0.88}
                    >
                      <Text style={styles.nextStepBtnText}>{isHindi ? 'अगला चरण ➔' : 'Next Step ➔'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Right Summary Stack Column */}
                <View style={[styles.summaryStackCol, { flex: 1 }]}>
                  {/* Card 1: टेंडर का सारांश */}
                  <View style={styles.summaryCard}>
                    <Text style={styles.summaryCardTitle}>{isHindi ? 'टेंडर का सारांश' : 'Tender Summary'}</Text>

                    {/* Graphic Clipboard Illustration */}
                    <View style={styles.illustrationBox}>
                      <Ionicons name="clipboard-outline" size={60} color="#E65100" />
                      <Ionicons name="create" size={24} color="#E65100" style={styles.penOverlayIcon} />
                    </View>

                    <Text style={styles.illustrationDescText}>
                      {isHindi
                        ? 'यहाँ आपके द्वारा भरी गई जानकारी का सारांश दिखाई देगा।'
                        : 'Summary of entered info will appear here.'}
                    </Text>

                    <View style={styles.summaryLinesDivider} />

                    <View style={styles.summaryInfoGroup}>
                      <View style={styles.summaryInfoRow}>
                        <Text style={styles.summaryInfoLabel}>{isHindi ? 'टेंडर शीर्षक' : 'Tender Title'}</Text>
                        <Text style={styles.summaryInfoVal}>{tenderTitle || '-'}</Text>
                      </View>
                      <View style={styles.summaryInfoRow}>
                        <Text style={styles.summaryInfoLabel}>{isHindi ? 'श्रेणी' : 'Category'}</Text>
                        <Text style={styles.summaryInfoVal}>{category || '-'}</Text>
                      </View>
                      <View style={styles.summaryInfoRow}>
                        <Text style={styles.summaryInfoLabel}>{isHindi ? 'कुल मात्रा' : 'Total Qty'}</Text>
                        <Text style={styles.summaryInfoVal}>{totalQty ? `${totalQty} ${unit}` : '-'}</Text>
                      </View>
                      <View style={styles.summaryInfoRow}>
                        <Text style={styles.summaryInfoLabel}>{isHindi ? 'न्यूनतम मूल्य' : 'Min Price'}</Text>
                        <Text style={styles.summaryInfoVal}>{minPrice ? `₹${minPrice}` : '-'}</Text>
                      </View>
                      <View style={styles.summaryInfoRow}>
                        <Text style={styles.summaryInfoLabel}>{isHindi ? 'अंतिम तिथि' : 'Deadline'}</Text>
                        <Text style={styles.summaryInfoVal}>-</Text>
                      </View>
                    </View>
                  </View>

                  {/* Card 2: ध्यान दें Alert Box */}
                  <View style={styles.noteAlertBox}>
                    <View style={styles.noteAlertTitleRow}>
                      <Ionicons name="information-circle" size={18} color="#1565C0" style={{ marginRight: 6 }} />
                      <Text style={styles.noteAlertTitle}>{isHindi ? 'ध्यान दें' : 'Please Note'}</Text>
                    </View>

                    <Text style={styles.noteAlertDesc}>
                      {isHindi
                        ? 'सभी अनिवार्य (*) फील्ड भरना आवश्यक है। टेंडर प्रकाशित करने के बाद इसे संपादित नहीं किया जा सकेगा।'
                        : 'All required (*) fields must be filled. Once published, it cannot be edited.'}
                    </Text>
                  </View>

                  {/* Action Buttons Stack */}
                  <View style={styles.actionButtonsStack}>
                    <TouchableOpacity style={styles.saveDraftBtn} activeOpacity={0.8}>
                      <Ionicons name="save-outline" size={16} color="#333333" style={{ marginRight: 6 }} />
                      <Text style={styles.saveDraftBtnText}>{isHindi ? 'ड्राफ्ट के रूप में सहेजें' : 'Save as Draft'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.publishTenderBtn}
                      onPress={handlePublishTender}
                      activeOpacity={0.88}
                    >
                      <Ionicons name="paper-plane" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.publishTenderBtnText}>{isHindi ? 'टेंडर प्रकाशित करें' : 'Publish Tender'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F8',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F8',
  },
  mainLayoutRow: {
    flex: 1,
    flexDirection: 'row',
  },
  contentCol: {
    flex: 1,
    backgroundColor: '#F7F7F8',
  },
  dashboardScrollView: {
    flex: 1,
  },
  dashboardScrollContent: {
    padding: 24,
    gap: 20,
  },
  pageHeaderRow: {
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#666666',
  },

  /* Form Grid Row */
  formGridRow: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    elevation: 1,
    minWidth: 500,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepCircleActive: {
    backgroundColor: '#E65100',
  },
  stepCircleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666666',
  },
  stepCircleTextActive: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 11,
    color: '#888888',
  },
  stepLabelActive: {
    color: '#1A1A1A',
    fontWeight: 'bold',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 18,
  },
  formFieldsDivider: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginVertical: 20,
  },

  /* Inputs Grid */
  inputsGrid: {
    gap: 16,
  },
  inputRow2Col: {
    flexDirection: 'row',
    gap: 16,
  },
  inputRow3Col: {
    flexDirection: 'row',
    gap: 16,
  },
  inputCol: {
    flex: 1,
  },
  inputColFull: {
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  reqStar: {
    color: '#D32F2F',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
    color: '#1A1A1A',
  },
  selectDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  selectDropdownText: {
    fontSize: 13,
    color: '#666666',
  },
  radioGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    height: 44,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabelText: {
    fontSize: 13,
    color: '#333333',
    marginLeft: 6,
  },
  textAreaInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1A1A1A',
    height: 90,
    textAlignVertical: 'top',
  },
  charCounterText: {
    fontSize: 10,
    color: '#888888',
    textAlign: 'right',
    marginTop: 4,
  },
  formSectionHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 10,
    marginBottom: 4,
  },
  currencyInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 10,
    height: 44,
    overflow: 'hidden',
  },
  currencySymbolBox: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#D8D8D8',
  },
  currencySymbolText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  currencyTextInput: {
    flex: 1,
    fontSize: 13,
    color: '#1A1A1A',
    paddingHorizontal: 12,
  },
  formBottomActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D8D8D8',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555555',
  },
  nextStepBtn: {
    backgroundColor: '#3B6029',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  nextStepBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /* Right Summary Stack Column */
  summaryStackCol: {
    gap: 16,
    minWidth: 280,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    elevation: 1,
  },
  summaryCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  illustrationBox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    backgroundColor: '#FFF4EB',
    borderRadius: 14,
    marginBottom: 12,
    position: 'relative',
  },
  penOverlayIcon: {
    position: 'absolute',
    bottom: 20,
    right: '36%',
  },
  illustrationDescText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 16,
  },
  summaryLinesDivider: {
    height: 1,
    backgroundColor: '#EBEBEB',
    marginVertical: 14,
  },
  summaryInfoGroup: {
    gap: 10,
  },
  summaryInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryInfoLabel: {
    fontSize: 12,
    color: '#666666',
  },
  summaryInfoVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },

  /* Note Alert Box */
  noteAlertBox: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#BBDEFB',
    borderRadius: 14,
    padding: 14,
  },
  noteAlertTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  noteAlertTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  noteAlertDesc: {
    fontSize: 11,
    color: '#1E88E5',
    lineHeight: 16,
  },

  /* Action Buttons Stack */
  actionButtonsStack: {
    gap: 10,
  },
  saveDraftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 12,
    height: 44,
  },
  saveDraftBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333',
  },
  publishTenderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 12,
    height: 46,
    elevation: 2,
  },
  publishTenderBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
