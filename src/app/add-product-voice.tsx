import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

type LangCode = 'hi' | 'en';

interface VoiceQuestion {
  id: number;
  questionHi: string;
  questionEn: string;
  hintHi: string;
  hintEn: string;
  dummyAnswerHi: string;
  dummyAnswerEn: string;
}

const QUESTIONS: VoiceQuestion[] = [
  {
    id: 1,
    questionHi: 'अपने सामान का नाम बताएं',
    questionEn: 'Tell us the name of your product',
    hintHi: 'जैसे: मिट्टी का घड़ा, हाथ से बुनी साड़ी, लकड़ी की नक्काशीदार घड़ी',
    hintEn: 'e.g. Handmade Clay Pot, Handloom Saree, Carved Wooden Clock',
    dummyAnswerHi: 'सजावटी हस्तनिर्मित मिट्टी का घड़ा',
    dummyAnswerEn: 'Decorative Handmade Clay Pot',
  },
  {
    id: 2,
    questionHi: 'अपने प्रोडक्ट का डिस्क्रिप्शन और विशेषताएं बताइए',
    questionEn: 'Describe your product and its special features',
    hintHi: 'जैसे: यह घड़ा 100% प्राकृतिक मिट्टी से बना है, जो पानी को ठंडा रखता है',
    hintEn: 'e.g. Made from 100% natural organic clay, keeps water naturally cool',
    dummyAnswerHi: 'यह घड़ा 100% शुद्ध काली मिट्टी से बना है। इस पर पारंपरिक प्राकृतिक नक्काशी की गई है जो पानी को 24 घंटे प्राकृतिक रूप से ठंडा रखती है।',
    dummyAnswerEn: 'Made from 100% pure organic black clay with traditional handmade etching that keeps water naturally cool.',
  },
  {
    id: 3,
    questionHi: 'इसकी कैटेगरी बताएं',
    questionEn: 'Tell us the category of your product',
    hintHi: 'जैसे: हस्तशिल्प, मिट्टी के बर्तन, टेक्सटाइल, लकड़ी का काम',
    hintEn: 'e.g. Handicrafts, Pottery, Textiles, Woodcraft',
    dummyAnswerHi: 'हस्तशिल्प - मिट्टी के बर्तन (Pottery & Claycraft)',
    dummyAnswerEn: 'Handicrafts - Pottery & Claycraft',
  },
  {
    id: 4,
    questionHi: 'मटेरियल यूज्ड बताइए, क्या सामान लगा है इसको बनाने में?',
    questionEn: 'What materials were used to make this product?',
    hintHi: 'जैसे: प्राकृतिक काली मिट्टी, जैविक रंग, कुम्हार का चाक',
    hintEn: 'e.g. Organic Black Clay, Natural Terracotta Dyes, Potter Wheel',
    dummyAnswerHi: 'प्राकृतिक काली मिट्टी, टेराकोटा जैविक रंग, हर्बल पॉलिश',
    dummyAnswerEn: 'Organic Black Clay, Terracotta Bio Colors, Herbal Polish',
  },
];

export default function AddProductVoiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();

  const selectedLang: LangCode = (params.lang as LangCode) || 'hi';
  const isHindi = selectedLang === 'hi';

  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0..3 for Qs, 4 for Price Summary
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [recordedAnswers, setRecordedAnswers] = useState<Record<number, string>>({});

  const currentQ = QUESTIONS[currentStepIndex];
  const totalSteps = QUESTIONS.length;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRecording) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleMicTap = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      setTimerSeconds(0);
    } else {
      // Stop recording & record simulated text
      setIsRecording(false);
      const answer = isHindi ? currentQ.dummyAnswerHi : currentQ.dummyAnswerEn;
      setRecordedAnswers((prev) => ({
        ...prev,
        [currentStepIndex]: answer,
      }));
    }
  };

  const handleReRecord = () => {
    setIsRecording(false);
    setTimerSeconds(0);
    setRecordedAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentStepIndex];
      return updated;
    });
  };

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setIsRecording(false);
      setTimerSeconds(0);
    } else {
      // Advance to final AI Price Estimation screen
      setCurrentStepIndex(totalSteps); // Step 4 (Price summary)
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setIsRecording(false);
      setTimerSeconds(0);
    } else {
      router.back();
    }
  };

  const handlePublishCatalog = () => {
    Alert.alert(
      isHindi ? 'सफलतापूर्वक जोड़ा गया!' : 'Successfully Added!',
      isHindi
        ? 'आपका उत्पाद कैटलॉग में सफलतापूर्वक जोड़ दिया गया है।'
        : 'Your product catalog has been successfully added.',
      [
        {
          text: 'OK',
          onPress: () => router.push('/home'),
        },
      ]
    );
  };

  const currentAnswer = recordedAnswers[currentStepIndex];
  const isQuestionScreen = currentStepIndex < totalSteps;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        
        {/* Header Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePreviousStep}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={26} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {isQuestionScreen
              ? isHindi
                ? `आवाज़ से विवरण (${currentStepIndex + 1}/${totalSteps})`
                : `Voice Entry (${currentStepIndex + 1}/${totalSteps})`
              : isHindi
              ? 'उत्पाद मूल्य विवरण'
              : 'Product Pricing Summary'}
          </Text>

          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isQuestionScreen ? (
            /* ================= QUESTION VOICE STEPS (1-4) ================= */
            <View>
              {/* Question Progress Indicator */}
              <View style={styles.progressRow}>
                {QUESTIONS.map((q, idx) => (
                  <View
                    key={q.id}
                    style={[
                      styles.progressSegment,
                      idx <= currentStepIndex && styles.progressSegmentActive,
                    ]}
                  />
                ))}
              </View>

              {/* Question Banner Card */}
              <View style={styles.questionCard}>
                <View style={styles.qBadge}>
                  <Text style={styles.qBadgeText}>Q{currentStepIndex + 1}</Text>
                </View>
                <Text style={styles.questionTitle}>
                  {isHindi ? currentQ.questionHi : currentQ.questionEn}
                </Text>
                <Text style={styles.questionHint}>
                  {isHindi ? currentQ.hintHi : currentQ.hintEn}
                </Text>
              </View>

              {/* Central Mic & Recording Area */}
              <View style={styles.recordingCard}>
                <TouchableOpacity
                  style={[
                    styles.outerPulseCircle,
                    isRecording && styles.outerPulseCircleActive,
                  ]}
                  onPress={handleMicTap}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.innerPulseCircle,
                      isRecording && styles.innerPulseCircleActive,
                    ]}
                  >
                    <Ionicons name="mic" size={50} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>

                <Text style={styles.micInstructionText}>
                  {isRecording
                    ? isHindi
                      ? 'सुन रहा हूँ... बोलना समाप्त करने के लिए पुनः टैप करें'
                      : 'Listening... Tap again to stop speaking'
                    : currentAnswer
                    ? isHindi
                      ? 'उत्तर दर्ज हो गया है! नीचे देखें'
                      : 'Answer recorded! See preview below'
                    : isHindi
                    ? 'बोलने के लिए माइक पर टैप करें'
                    : 'Tap mic button to start speaking'}
                </Text>

                {/* Timer Badge */}
                {isRecording && (
                  <View style={styles.timerBadge}>
                    <View style={styles.recordingRedDot} />
                    <Text style={styles.timerText}>{formatTimer(timerSeconds)}</Text>
                  </View>
                )}
              </View>

              {/* Transcribed Text Preview Box */}
              {currentAnswer ? (
                <View style={styles.transcribedBox}>
                  <View style={styles.transcribedHeader}>
                    <Ionicons name="checkmark-circle" size={18} color="#3B6029" />
                    <Text style={styles.transcribedLabel}>
                      {isHindi ? 'आपकी रिकॉर्ड की गई जानकारी:' : 'Your Recorded Response:'}
                    </Text>
                  </View>

                  <Text style={styles.transcribedText}>"{currentAnswer}"</Text>

                  {/* Action Row: Re-record & Next */}
                  <View style={styles.answerActionRow}>
                    <TouchableOpacity
                      style={styles.reRecordBtn}
                      onPress={handleReRecord}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="refresh-outline" size={18} color="#D32F2F" />
                      <Text style={styles.reRecordText}>
                        {isHindi ? 'पुनः बोलें (Re-record)' : 'Re-record'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}

              {/* Next Question / Finish Button */}
              {currentAnswer ? (
                <TouchableOpacity
                  style={styles.nextQuestionBtn}
                  onPress={handleNextStep}
                  activeOpacity={0.88}
                >
                  <Text style={styles.nextQuestionBtnText}>
                    {currentStepIndex < totalSteps - 1
                      ? isHindi
                        ? 'अगला प्रश्न →'
                        : 'Next Question →'
                      : isHindi
                      ? 'मूल्य अनुमान देखें →'
                      : 'View Estimated Price →'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.simulateSpeakBtn}
                  onPress={handleMicTap}
                  activeOpacity={0.8}
                >
                  <Text style={styles.simulateSpeakBtnText}>
                    {isHindi ? '🗣️ माइक टैप करें और बोलें' : '🗣️ Tap Mic & Speak'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            /* ================= STEP 5: FINAL AI PRICE ESTIMATION SUMMARY ================= */
            <View>
              {/* Success Badge Banner */}
              <View style={styles.priceHeaderBanner}>
                <Ionicons name="sparkles" size={24} color="#3B6029" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.priceBannerTitle}>
                    {isHindi ? 'आपके सामान की अनुमानित कीमत' : 'AI Estimated Product Price'}
                  </Text>
                  <Text style={styles.priceBannerSub}>
                    {isHindi
                      ? 'आपके द्वारा दी गई जानकारी के आधार पर तैयार की गई मूल्य सूची'
                      : 'Calculated breakdown based on your voice details'}
                  </Text>
                </View>
              </View>

              {/* Product Info Preview Card */}
              <View style={styles.productPreviewCard}>
                <Image
                  source={require('@/assets/images/cust_prod_clay.png')}
                  style={styles.productThumb}
                  resizeMode="cover"
                />
                <View style={styles.productMetaCol}>
                  <Text style={styles.productTitle}>
                    {recordedAnswers[0] || (isHindi ? 'सजावटी मिट्टी का घड़ा' : 'Decorative Clay Pot')}
                  </Text>
                  <Text style={styles.productCat}>
                    📁 {recordedAnswers[2] || (isHindi ? 'हस्तशिल्प' : 'Handicrafts')}
                  </Text>
                  <Text style={styles.productMat} numberOfLines={2}>
                    🧱 {recordedAnswers[3] || (isHindi ? 'प्राकृतिक मिट्टी' : 'Organic Clay')}
                  </Text>
                </View>
              </View>

              {/* Itemized Price Breakdown Card */}
              <View style={styles.priceBreakdownCard}>
                <Text style={styles.breakdownHeading}>
                  {isHindi ? 'मूल्य का विस्तृत विवरण (Cost Breakdown)' : 'Itemized Cost Breakdown'}
                </Text>

                {/* Line Item 1: Raw Material Cost */}
                <View style={styles.costRow}>
                  <View style={styles.costLabelCol}>
                    <MaterialCommunityIcons name="cube-outline" size={20} color="#3B6029" />
                    <Text style={styles.costName}>
                      {isHindi ? 'रॉ मटेरियल लागत (Raw Material)' : 'Raw Material Cost'}
                    </Text>
                  </View>
                  <Text style={styles.costValue}>₹350</Text>
                </View>

                {/* Line Item 2: Labor Cost */}
                <View style={styles.costRow}>
                  <View style={styles.costLabelCol}>
                    <Ionicons name="construct-outline" size={20} color="#3B6029" />
                    <Text style={styles.costName}>
                      {isHindi ? 'बनाने की मज़दूरी (Labor & Craft)' : 'Labor & Craftsmanship'}
                    </Text>
                  </View>
                  <Text style={styles.costValue}>₹450</Text>
                </View>

                {/* Line Item 3: Developing & Enhancement */}
                <View style={styles.costRow}>
                  <View style={styles.costLabelCol}>
                    <Ionicons name="color-palette-outline" size={20} color="#3B6029" />
                    <Text style={styles.costName}>
                      {isHindi ? 'फिनिशिंग और डेवलपिंग खर्च' : 'Developing & Finishing'}
                    </Text>
                  </View>
                  <Text style={styles.costValue}>₹150</Text>
                </View>

                {/* Line Item 4: Packaging & Shipping */}
                <View style={styles.costRow}>
                  <View style={styles.costLabelCol}>
                    <Ionicons name="bus-outline" size={20} color="#3B6029" />
                    <Text style={styles.costName}>
                      {isHindi ? 'पैकेजिंग व शिपिंग का खर्चा' : 'Packaging & Shipping'}
                    </Text>
                  </View>
                  <Text style={styles.costValue}>₹100</Text>
                </View>

                <View style={styles.costDivider} />

                {/* Total Suggested Selling Price */}
                <View style={styles.totalPriceRow}>
                  <Text style={styles.totalPriceLabel}>
                    {isHindi ? 'कुल अनुमानित बिक्री मूल्य:' : 'Total Estimated Price:'}
                  </Text>
                  <Text style={styles.totalPriceValue}>₹1,050</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <TouchableOpacity
                style={styles.publishBtn}
                onPress={handlePublishCatalog}
                activeOpacity={0.88}
              >
                <Ionicons name="checkmark-done" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.publishBtnText}>
                  {isHindi ? 'कैटलॉग में जोड़ें (Publish Product)' : 'Publish to Catalog'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => setCurrentStepIndex(0)}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={18} color="#666666" style={{ marginRight: 6 }} />
                <Text style={styles.editBtnText}>
                  {isHindi ? 'जानकारी में सुधार करें (Edit Answers)' : 'Edit Answers'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
  /* Progress Row */
  progressRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E3DC',
  },
  progressSegmentActive: {
    backgroundColor: '#3B6029',
  },
  /* Question Card */
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    padding: 18,
    marginBottom: 16,
  },
  qBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EBF6EE',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  qBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  questionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#0A0A0A',
    marginBottom: 6,
    lineHeight: 25,
  },
  questionHint: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  /* Recording Area */
  recordingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  outerPulseCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F9F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#D1E8D5',
  },
  outerPulseCircleActive: {
    backgroundColor: '#FFEBEB',
    borderColor: '#FFC1C1',
  },
  innerPulseCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#3B6029',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#3B6029',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  innerPulseCircleActive: {
    backgroundColor: '#D32F2F',
    shadowColor: '#D32F2F',
  },
  micInstructionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FDECEB',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  recordingRedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D32F2F',
    marginRight: 6,
  },
  timerText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  /* Transcribed Text Preview Box */
  transcribedBox: {
    backgroundColor: '#F3F9F4',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#3B6029',
    padding: 16,
    marginBottom: 16,
  },
  transcribedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  transcribedLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B6029',
    marginLeft: 6,
  },
  transcribedText: {
    fontSize: 15,
    color: '#1A1A1A',
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  answerActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 4,
  },
  reRecordText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  /* Navigation Buttons */
  nextQuestionBtn: {
    height: 52,
    backgroundColor: '#3B6029',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#3B6029',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  nextQuestionBtnText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  simulateSpeakBtn: {
    height: 48,
    backgroundColor: '#EBF6EE',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3B6029',
    alignItems: 'center',
    justifyContent: 'center',
  },
  simulateSpeakBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  /* Price Breakdown Screen */
  priceHeaderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF6EE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  priceBannerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#3B6029',
    marginBottom: 2,
  },
  priceBannerSub: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 16,
  },
  productPreviewCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  productThumb: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  productMetaCol: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0A0A',
    marginBottom: 4,
  },
  productCat: {
    fontSize: 12,
    color: '#555555',
    marginBottom: 2,
  },
  productMat: {
    fontSize: 12,
    color: '#555555',
  },
  priceBreakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    padding: 18,
    marginBottom: 20,
  },
  breakdownHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0A0A',
    marginBottom: 16,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  costLabelCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  costName: {
    fontSize: 14,
    color: '#444444',
  },
  costValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  costDivider: {
    height: 1,
    backgroundColor: '#E5E3DC',
    marginVertical: 12,
  },
  totalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  totalPriceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  publishBtn: {
    height: 54,
    backgroundColor: '#3B6029',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#3B6029',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  publishBtnText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editBtn: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
});
