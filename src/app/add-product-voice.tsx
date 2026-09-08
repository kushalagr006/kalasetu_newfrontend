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
import { getPendingProductPhoto } from '@/utils/photoStore';
import { useGlobalLang, LangCode } from '@/utils/languageStore';
import TopLangSelector from '@/components/TopLangSelector';
import {
  PRODUCT_QUESTIONS,
  VOICE_STRINGS,
  ProductQuestion,
} from '@/utils/productQuestions';
import { startLiveSpeechRecognition, LiveSpeechSession } from '@/services/bhashiniService';
import { addPublishedProduct } from '@/utils/productStore';

const VOICE_EXTRA_STRINGS: Record<LangCode, {
  listening: string;
  recorded: string;
  tapMic: string;
  yourRecordedResponse: string;
  reRecord: string;
  viewEstimatedPrice: string;
  aiPredictedTitle: string;
  aiPredictedSub: string;
  yourQuotedPrice: string;
  aiSellingPrice: string;
  profitBadge: string;
  pricingIntelligence: string;
  costRawMaterial: string;
  costCraftsmanship: string;
  costFinishing: string;
  costMarketDemand: string;
  finalPredictedPrice: string;
  publishToCatalog: string;
  editAnswers: string;
}> = {
  hi: {
    listening: 'सुन रहा हूँ... बोलना समाप्त करने के लिए पुनः टैप करें',
    recorded: 'उत्तर दर्ज हो गया है! नीचे देखें',
    tapMic: 'बोलने के लिए माइक पर टैप करें',
    yourRecordedResponse: 'आपकी रिकॉर्ड की गई जानकारी:',
    reRecord: 'पुनः बोलें (Re-record)',
    viewEstimatedPrice: 'मूल्य अनुमान देखें →',
    aiPredictedTitle: '✨ AI द्वारा भविष्यवाणित अंतिम कीमत',
    aiPredictedSub: 'शिल्प गुणवत्ता, सामग्री व बाज़ार मांग के आधार पर AI की सटीक कीमत',
    yourQuotedPrice: 'आपकी बताई कीमत:',
    aiSellingPrice: '🔥 AI द्वारा अनुशंसित अंतिम बिक्री मूल्य',
    profitBadge: '✨ +22% अतिरिक्त मुनाफा (शहरों व टेंडर के लिए बेस्ट)',
    pricingIntelligence: 'AI मूल्य विश्लेषण एवं लागत विवरण',
    costRawMaterial: 'सामग्री लागत (Raw Material)',
    costCraftsmanship: 'हस्तशिल्प व कारीगरी (Craftsmanship)',
    costFinishing: 'फिनिशिंग व बायो-पॉलिश',
    costMarketDemand: 'शहरी बाज़ार मांग व प्रीमियम',
    finalPredictedPrice: 'AI अनुमानित अंतिम मूल्य:',
    publishToCatalog: 'AI कीमत (₹550) से कैटलॉग में जोड़ें',
    editAnswers: 'जानकारी में सुधार करें (Edit Answers)',
  },
  en: {
    listening: 'Listening... Tap again to stop speaking',
    recorded: 'Answer recorded! See preview below',
    tapMic: 'Tap mic button to start speaking',
    yourRecordedResponse: 'Your Recorded Response:',
    reRecord: 'Re-record',
    viewEstimatedPrice: 'View Estimated Price →',
    aiPredictedTitle: '✨ Final AI Predicted Market Price',
    aiPredictedSub: 'Calculated optimal price based on craft quality & market demand',
    yourQuotedPrice: 'Your Quoted Price:',
    aiSellingPrice: '🔥 AI PREDICTED SELLING PRICE',
    profitBadge: '✨ +22% Higher Profit (Best for Urban & Govt Tenders)',
    pricingIntelligence: 'AI Pricing Intelligence & Cost Analysis',
    costRawMaterial: 'Raw Material Cost',
    costCraftsmanship: 'Labor & Craftsmanship',
    costFinishing: 'Finishing & Bio Polish',
    costMarketDemand: 'Urban Market Demand Premium',
    finalPredictedPrice: 'Final AI Predicted Price:',
    publishToCatalog: 'Publish to Catalog at AI Price (₹550)',
    editAnswers: 'Edit Answers',
  },
  bn: {
    listening: 'শুনছি... কথা বলা শেষ করতে আবার ট্যাপ করুন',
    recorded: 'উত্তর রেকর্ড হয়েছে! নিচে দেখুন',
    tapMic: 'বলতে মাইক বোতামে ট্যাপ করুন',
    yourRecordedResponse: 'আপনার রেকর্ড করা তথ্য:',
    reRecord: 'আবার বলুন',
    viewEstimatedPrice: 'আনুমানিক মূল্য দেখুন →',
    aiPredictedTitle: '✨ AI দ্বারা নির্ধারিত চূড়ান্ত বাজার মূল্য',
    aiPredictedSub: 'পণ্যের গুণমান ও চাহিদার ভিত্তিতে সেরা মূল্য',
    yourQuotedPrice: 'আপনার প্রস্তাবিত মূল্য:',
    aiSellingPrice: '🔥 AI প্রস্তাবিত চূড়ান্ত বিক্রয় মূল্য',
    profitBadge: '✨ +২২% অতিরিক্ত লাভ',
    pricingIntelligence: 'AI মূল্য বিশ্লেষণ ও খরচ বিবরণ',
    costRawMaterial: 'কাঁচামালের খরচ',
    costCraftsmanship: 'হস্তশিল্প ও কারুশিল্পের পারিশ্রমিক',
    costFinishing: 'ফিনিশিং ও পালিশ',
    costMarketDemand: 'শহুরে বাজারের চাহিদা প্রিমিয়াম',
    finalPredictedPrice: 'AI নির্ধারিত চূড়ান্ত মূল্য:',
    publishToCatalog: 'AI মূল্যে ক্যাটালগে যুক্ত করুন (₹৫৫০)',
    editAnswers: 'উত্তরগুলি সম্পাদনা করুন',
  },
  bho: {
    listening: 'सुनत बानी... बोला के खतम करे खातिर फिर छुईं',
    recorded: 'उत्तर दर्ज हो गइल! नीचे देखीं',
    tapMic: 'बोले खातिर माइक पर छुईं',
    yourRecordedResponse: 'रउआ के दर्ज जानकारी:',
    reRecord: 'फिर से बोलीं',
    viewEstimatedPrice: 'अनुमानित भाव देखीं →',
    aiPredictedTitle: '✨ AI द्वारा तय अंतिम भाव',
    aiPredictedSub: 'शिल्प गुणवत्ता आ बाजार मांग अनुसार सही कीमत',
    yourQuotedPrice: 'रउआ के बतावल भाव:',
    aiSellingPrice: '🔥 AI अनुशंसित अंतिम बिक्री भाव',
    profitBadge: '✨ +22% जादे मुनाफा',
    pricingIntelligence: 'AI मूल्य विश्लेषण आ लागत विवरण',
    costRawMaterial: 'सामग्री लागत',
    costCraftsmanship: 'कारीगरी आ मेहनत',
    costFinishing: 'फिनिशिंग आ पॉलिश',
    costMarketDemand: 'शहरी बाज़ार मांग',
    finalPredictedPrice: 'AI अनुमानित अंतिम भाव:',
    publishToCatalog: 'AI भाव से कैटलॉग में जोड़ीं (₹550)',
    editAnswers: 'जानकारी में सुधार करीं',
  },
  mr: {
    listening: 'ऐकत आहे... बोलणे थांबवण्यासाठी पुन्हा टॅप करा',
    recorded: 'उत्तर नोंदवले गेले! खाली पहा',
    tapMic: 'बोलण्यासाठी माइकवर टॅप करा',
    yourRecordedResponse: 'तुमची नोंदवलेली माहिती:',
    reRecord: 'पुन्हा बोला',
    viewEstimatedPrice: 'अंदाजित किंमत पहा →',
    aiPredictedTitle: '✨ AI द्वारे अंदाजित अंतिम बाजार किंमत',
    aiPredictedSub: 'शिल्प गुणवत्ता आणि बाजारातील मागणीनुसार अचूक किंमत',
    yourQuotedPrice: 'तुमची सांगितलेली किंमत:',
    aiSellingPrice: '🔥 AI शिफारस केलेली अंतिम विक्री किंमत',
    profitBadge: '✨ +२२% अधिक नफा',
    pricingIntelligence: 'AI मूल्य विश्लेषण आणि खर्च तपशील',
    costRawMaterial: 'कच्च्या मालाचा खर्च',
    costCraftsmanship: 'हस्तकला आणि कारागिरी',
    costFinishing: 'फिनिशिंग आणि बायो-पॉलिश',
    costMarketDemand: 'शहरी बाजार मागणी प्रीमियम',
    finalPredictedPrice: 'AI अंदाजित अंतिम किंमत:',
    publishToCatalog: 'AI किमतीत कॅटलॉगमध्ये जोडा (₹५५०)',
    editAnswers: 'उत्तरे संपादित करा',
  },
  gu: {
    listening: 'સાંભળી રહ્યો છું... બોલવાનું બંધ કરવા ફરી ટૅપ કરો',
    recorded: 'જવાબ નોંધાઈ ગયો છે! નીચે જુઓ',
    tapMic: 'બોલવા માટે માઇક પર ટૅપ કરો',
    yourRecordedResponse: 'તમારી નોંધાયેલી વિગત:',
    reRecord: 'ફરીથી બોલો',
    viewEstimatedPrice: 'અંદાજિત કિંમત જુઓ →',
    aiPredictedTitle: '✨ AI દ્વારા અનુમાનિત અંતિમ બજાર કિંમત',
    aiPredictedSub: 'ગુણવત્તા અને બજાર માંગ પર આધારિત શ્રેષ્ઠ કિંમત',
    yourQuotedPrice: 'તમારી જણાવેલ કિંમત:',
    aiSellingPrice: '🔥 AI ભલામણ કરેલ વેચાણ કિંમત',
    profitBadge: '✨ +૨૨% વધુ નફો',
    pricingIntelligence: 'AI કિંમત વિશ્લેષણ અને ખર્ચ વિગતો',
    costRawMaterial: 'કાચા માલનો ખર્ચ',
    costCraftsmanship: 'કારીગરી અને મહેનત',
    costFinishing: 'ફિનિશિંગ અને બાયો-પોલિશ',
    costMarketDemand: 'શહેરી બજાર માંગ પ્રીમિયમ',
    finalPredictedPrice: 'AI અનુમાનિત અંતિમ કિંમત:',
    publishToCatalog: 'AI કિંમતે કેટલોગમાં ઉમેરો (₹૫૫૦)',
    editAnswers: 'જવાબો સુધારો',
  },
  raj: {
    listening: 'सुणूं लाग्यो हूं... बोलणो बंद करबा सारू पाछो दबाओ',
    recorded: 'जवाब जुड़ गयो! नीचे देखो',
    tapMic: 'बोलण सारू माइक छुओ',
    yourRecordedResponse: 'आपरी दर्ज जानकारी:',
    reRecord: 'पाछो बोलो',
    viewEstimatedPrice: 'भाव रो अंदाजो देखो →',
    aiPredictedTitle: '✨ AI द्वारा तय अंतिम भाव',
    aiPredictedSub: 'कारीगरी अर बजार मांग रे आधार पर सटीक भाव',
    yourQuotedPrice: 'आपरो बतायोड़ो भाव:',
    aiSellingPrice: '🔥 AI अनुशंसित बिक्री भाव',
    profitBadge: '✨ +२२% जादा नफो',
    pricingIntelligence: 'AI भाव विश्लेषण अर लागत ब्योरो',
    costRawMaterial: 'सामान रो भाव',
    costCraftsmanship: 'कारीगरी अर मेहनत',
    costFinishing: 'फिनिशिंग अर पॉलिश',
    costMarketDemand: 'शहरी बजार मांग',
    finalPredictedPrice: 'AI अनुमानित अंतिम भाव:',
    publishToCatalog: 'AI भाव सूं कैटलॉग में जोड़ो (₹५५०)',
    editAnswers: 'ब्योरो बदलो',
  },
  kn: {
    listening: 'ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ... ಮಾತನಾಡುವುದು ಮುಗಿಸಲು ಮತ್ತೆ ಟ್ಯಾಪ್ ಮಾಡಿ',
    recorded: 'ಉತ್ತರ ದಾಖಲಾಗಿದೆ! ಕೆಳಗೆ ನೋಡಿ',
    tapMic: 'ಮಾತನಾಡಲು ಮೈಕ್ ಟ್ಯಾಪ್ ಮಾಡಿ',
    yourRecordedResponse: 'ನಿಮ್ಮ ದಾಖಲಾದ ಮಾಹಿತಿ:',
    reRecord: 'ಮತ್ತೆ ಮಾತನಾಡಿ',
    viewEstimatedPrice: 'ಅಂದಾಜು ಬೆಲೆ ನೋಡಿ →',
    aiPredictedTitle: '✨ AI ನಿಂದ ಅಂದಾಜು ಮಾಡಿದ ಅಂತಿಮ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ',
    aiPredictedSub: 'ಕರಕುಶಲ ಗುಣಮಟ್ಟ ಮತ್ತು ಬೇಡಿಕೆಯ ಆಧಾರದ ಮೇಲೆ ಸೂಕ್ತ ಬೆಲೆ',
    yourQuotedPrice: 'ನಿಮ್ಮ ಬೆಲೆ:',
    aiSellingPrice: '🔥 AI ಶಿಫಾರಸು ಮಾಡಿದ ಮಾರಾಟ ಬೆಲೆ',
    profitBadge: '✨ +೨೨% ಹೆಚ್ಚಿನ ಲಾಭ',
    pricingIntelligence: 'AI ಬೆಲೆ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ವೆಚ್ಚ ವಿವರ',
    costRawMaterial: 'ಕಚ್ಚಾ ವಸ್ತುಗಳ ವೆಚ್ಚ',
    costCraftsmanship: 'ಕರಕುಶಲತೆ ಮತ್ತು ಶ್ರಮ',
    costFinishing: 'ಫಿನಿಶಿಂಗ್ ಮತ್ತು ಬಯೋ-ಪಾಲಿಶ್',
    costMarketDemand: 'ನಗರ ಮಾರುಕಟ್ಟೆ ಬೇಡಿಕೆ ಪ್ರೀಮಿಯಂ',
    finalPredictedPrice: 'AI ಅಂದಾಜು ಅಂತಿಮ ಬೆಲೆ:',
    publishToCatalog: 'AI ಬೆಲೆಯಲ್ಲಿ ಕ್ಯಾಟಲಾಗ್‌ಗೆ ಸೇರಿಸಿ (₹೫೫೦)',
    editAnswers: 'ಮಾಹಿತಿ ತಿದ್ದುಪಡಿ ಮಾಡಿ',
  },
};

export default function AddProductVoiceScreen() {
  const router = useRouter();
  const [globalLang] = useGlobalLang();

  const questions: ProductQuestion[] =
    PRODUCT_QUESTIONS[globalLang] || PRODUCT_QUESTIONS.hi;
  const t = {
    ...(VOICE_STRINGS[globalLang] || VOICE_STRINGS.hi),
    ...(VOICE_EXTRA_STRINGS[globalLang] || VOICE_EXTRA_STRINGS.hi),
  };

  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0..4 for Qs, 5 for Price Summary
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [recordedAnswers, setRecordedAnswers] = useState<Record<number, string>>({});
  const [photoUri, setPhotoUri] = useState<string | null>(() => getPendingProductPhoto().photoUri);
  const [activeSpeechSession, setActiveSpeechSession] = useState<LiveSpeechSession | null>(null);

  const params = useLocalSearchParams<{ photoUri?: string }>();
  useEffect(() => {
    if (params.photoUri) {
      setPhotoUri(params.photoUri);
    } else {
      const pending = getPendingProductPhoto();
      if (pending.photoUri) setPhotoUri(pending.photoUri);
    }
  }, [params.photoUri]);

  const currentQ = questions[currentStepIndex] || questions[0];
  const totalSteps = questions.length;

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

  const getFieldTypeForStep = (stepIdx: number): string => {
    switch (stepIdx) {
      case 0:
        return 'name';
      case 1:
        return 'work';
      case 2:
        return 'work';
      case 3:
        return 'work';
      case 4:
        return 'phone';
      default:
        return 'work';
    }
  };

  const handleMicTap = () => {
    if (isRecording || activeSpeechSession?.isActive()) {
      setIsProcessing(true);
      setIsRecording(false);
      activeSpeechSession?.stop();
      setActiveSpeechSession(null);
    } else {
      setIsRecording(true);
      setIsProcessing(false);
      setTimerSeconds(0);
      const fieldType = getFieldTypeForStep(currentStepIndex);
      const session = startLiveSpeechRecognition({
        fieldType,
        lang: globalLang,
        onLiveText: (analyzedText) => {
          setRecordedAnswers((prev) => ({
            ...prev,
            [currentStepIndex]: analyzedText,
          }));
        },
        onStatusChange: (status) => {
          if (status === 'speaking') {
            setIsRecording(true);
            setIsProcessing(false);
          } else if (status === 'listening') {
            setIsRecording(false);
            setIsProcessing(true);
          } else if (status === 'stopped') {
            setIsRecording(false);
            setIsProcessing(false);
          }
        },
        onComplete: (finalText) => {
          setRecordedAnswers((prev) => ({
            ...prev,
            [currentStepIndex]: finalText || prev[currentStepIndex] || '',
          }));
          setIsRecording(false);
          setIsProcessing(false);
          setActiveSpeechSession(null);
        },
      });
      setActiveSpeechSession(session);
    }
  };

  const handleReRecord = () => {
    if (activeSpeechSession) {
      activeSpeechSession.stop();
      setActiveSpeechSession(null);
    }
    setIsRecording(false);
    setTimerSeconds(0);
    setRecordedAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentStepIndex];
      return updated;
    });
  };

  const handleNextStep = () => {
    if (activeSpeechSession) {
      activeSpeechSession.stop();
      setActiveSpeechSession(null);
    }
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setIsRecording(false);
      setTimerSeconds(0);
    } else {
      // Advance to final AI Price Estimation screen
      setCurrentStepIndex(totalSteps); // Step 5 (Price summary)
    }
  };

  const handlePreviousStep = () => {
    if (activeSpeechSession) {
      activeSpeechSession.stop();
      setActiveSpeechSession(null);
    }
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setIsRecording(false);
      setTimerSeconds(0);
    } else {
      router.back();
    }
  };

  const handlePublishCatalog = async () => {
    const title = recordedAnswers[0] || questions[0]?.dummyAnswer || 'Handmade Craft Product';
    const description = recordedAnswers[1] || questions[1]?.dummyAnswer || '';
    const category = recordedAnswers[2] || questions[2]?.dummyAnswer || 'Pottery & Claycraft';
    const materialUsed = recordedAnswers[3] || questions[3]?.dummyAnswer || '';
    const rawPrice = recordedAnswers[4] || '550';

    await addPublishedProduct({
      title,
      description,
      category,
      materialUsed,
      price: rawPrice,
      image: photoUri || '',
      aiEnhanced: true,
    });

    Alert.alert(
      t.summaryTitle,
      t.confirmAndPublish,
      [
        {
          text: 'OK',
          onPress: () => router.push('/products'),
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
              ? `${t.headerTitle} (${currentStepIndex + 1}/${totalSteps})`
              : t.summaryTitle}
          </Text>

          {/* Top Language Selector */}
          <TopLangSelector />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Enhanced Photo Thumbnail Preview */}
          {photoUri && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              padding: 10,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: '#EFECE6',
              elevation: 2,
            }}>
              <Image
                source={{ uri: photoUri }}
                style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: '#F0F0F0' }}
                resizeMode="cover"
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#3B6029' }}>
                  ✨ AI Enhanced Photo Attached
                </Text>
                <Text style={{ fontSize: 11, color: '#666666', marginTop: 2 }}>
                  {t.recorded}
                </Text>
              </View>
            </View>
          )}

          {isQuestionScreen ? (
            /* ================= QUESTION VOICE STEPS (1-5) ================= */
            <View>
              {/* Question Progress Indicator */}
              <View style={styles.progressRow}>
                {questions.map((q, idx) => (
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
                  {currentQ.question}
                </Text>
                <Text style={styles.questionHint}>
                  {currentQ.hint}
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
                    ? t.listening
                    : isProcessing
                    ? '⏳ Processing & transcribing your voice... / अनुवाद हो रहा है...'
                    : currentAnswer
                    ? t.recorded
                    : t.tapMic}
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
                      {t.yourRecordedResponse}
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
                        {t.reRecord}
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
                      ? t.nextQuestion
                      : t.viewEstimatedPrice}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.simulateSpeakBtn}
                  onPress={handleMicTap}
                  activeOpacity={0.8}
                >
                  <Text style={styles.simulateSpeakBtnText}>
                    {`🗣️ ${t.tapMic}`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            /* ================= STEP 6: FINAL AI PRICE PREDICTED DISPLAY SUMMARY ================= */
            <View>
              {/* AI Prediction Header Banner */}
              <View style={styles.priceHeaderBanner}>
                <Ionicons name="sparkles" size={26} color="#3B6029" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.priceBannerTitle}>
                    {t.aiPredictedTitle}
                  </Text>
                  <Text style={styles.priceBannerSub}>
                    {t.aiPredictedSub}
                  </Text>
                </View>
              </View>

              {/* Product Info Preview Card */}
              <View style={styles.productPreviewCard}>
                {photoUri ? (
                  <Image
                    source={{ uri: photoUri }}
                    style={styles.productThumb}
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require('@/assets/images/cust_prod_clay.png')}
                    style={styles.productThumb}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.productMetaCol}>
                  <Text style={styles.productTitle}>
                    {recordedAnswers[0] || questions[0]?.hint || 'Product'}
                  </Text>
                  <Text style={styles.productCat}>
                    📁 {recordedAnswers[2] || questions[2]?.hint || 'Category'}
                  </Text>
                  <Text style={styles.productMat} numberOfLines={2}>
                    🧱 {recordedAnswers[3] || questions[3]?.hint || 'Materials'}
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#E65100', marginTop: 4 }}>
                    🗣️ {t.yourQuotedPrice} {recordedAnswers[4] || '₹450'}
                  </Text>
                </View>
              </View>

              {/* Prominent AI Predicted Price Hero Banner */}
              <View style={{
                backgroundColor: '#3B6029',
                borderRadius: 20,
                padding: 18,
                marginBottom: 16,
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 13, color: '#EAF2E8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  {t.aiSellingPrice}
                </Text>
                <Text style={{ fontSize: 34, fontWeight: 'bold', color: '#FFFFFF', marginVertical: 6 }}>
                  ₹550
                </Text>
                <View style={{ backgroundColor: '#EAF2E8', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#3B6029' }}>
                    {t.profitBadge}
                  </Text>
                </View>
              </View>

              {/* Itemized Price Breakdown Card */}
              <View style={styles.priceBreakdownCard}>
                <Text style={styles.breakdownHeading}>
                  {t.pricingIntelligence}
                </Text>

                {/* Line Item 1: Raw Material Cost */}
                <View style={styles.costRow}>
                  <View style={styles.costLabelCol}>
                    <MaterialCommunityIcons name="cube-outline" size={20} color="#3B6029" />
                    <Text style={styles.costName}>{t.costRawMaterial}</Text>
                  </View>
                  <Text style={styles.costValue}>₹150</Text>
                </View>

                {/* Line Item 2: Labor Cost */}
                <View style={styles.costRow}>
                  <View style={styles.costLabelCol}>
                    <Ionicons name="construct-outline" size={20} color="#3B6029" />
                    <Text style={styles.costName}>{t.costCraftsmanship}</Text>
                  </View>
                  <Text style={styles.costValue}>₹200</Text>
                </View>

                {/* Line Item 3: Finishing & Bio Polish */}
                <View style={styles.costRow}>
                  <View style={styles.costLabelCol}>
                    <Ionicons name="color-palette-outline" size={20} color="#3B6029" />
                    <Text style={styles.costName}>{t.costFinishing}</Text>
                  </View>
                  <Text style={styles.costValue}>₹50</Text>
                </View>

                {/* Line Item 4: Market Demand Adjustment */}
                <View style={styles.costRow}>
                  <View style={styles.costLabelCol}>
                    <Ionicons name="trending-up-outline" size={20} color="#3B6029" />
                    <Text style={styles.costName}>{t.costMarketDemand}</Text>
                  </View>
                  <Text style={[styles.costValue, { color: '#3B6029' }]}>+₹150</Text>
                </View>

                <View style={styles.costDivider} />

                {/* Total AI Predicted Selling Price */}
                <View style={styles.totalPriceRow}>
                  <Text style={styles.totalPriceLabel}>{t.finalPredictedPrice}</Text>
                  <Text style={styles.totalPriceValue}>₹550</Text>
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
                  {t.publishToCatalog}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => setCurrentStepIndex(0)}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={18} color="#666666" style={{ marginRight: 6 }} />
                <Text style={styles.editBtnText}>
                  {t.editAnswers}
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
