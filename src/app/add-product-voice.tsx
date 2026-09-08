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
import { fetchFromBackend } from '@/services/apiClient';

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
  selectSellingPrice: string;
  optionATitle: string;
  recommendedBadge: string;
  moreProfitTag: string;
  fairMarketRange: string;
  optionBTitle: string;
  optionBSub: string;
  guidanceHeader: string;
  selectedAiPriceLabel: string;
  selectedArtisanPriceLabel: string;
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
    publishToCatalog: 'कीमत से कैटलॉग में जोड़ें',
    editAnswers: 'जानकारी में सुधार करें (Edit Answers)',
    selectSellingPrice: 'अपनी अंतिम बिक्री कीमत चुनें:',
    optionATitle: '✨ विकल्प A: AI फेयर मार्केट प्राइस',
    recommendedBadge: 'अनुशंसित (Recommended)',
    moreProfitTag: 'अतिरिक्त मुनाफ़ा',
    fairMarketRange: 'फेयर मार्केट रेंज:',
    optionBTitle: '🗣️ विकल्प B: आपकी बताई मूल कीमत',
    optionBSub: 'आपकी द्वारा बताई गई मूल बिक्री कीमत',
    guidanceHeader: '💡 KalaSetu AI बाज़ार सलाह (Guidance):',
    selectedAiPriceLabel: 'चयनित AI फेयर प्राइस:',
    selectedArtisanPriceLabel: 'चयनित आपकी कीमत:',
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
    publishToCatalog: 'Publish to Catalog at Price',
    editAnswers: 'Edit Answers',
    selectSellingPrice: 'Select Your Final Selling Price:',
    optionATitle: '✨ Option A: AI Fair Market Price',
    recommendedBadge: 'RECOMMENDED',
    moreProfitTag: 'More Profit',
    fairMarketRange: 'Fair market range:',
    optionBTitle: '🗣️ Option B: Your Quoted Price',
    optionBSub: 'Your original self-quoted selling price',
    guidanceHeader: '💡 KalaSetu AI Market Guidance:',
    selectedAiPriceLabel: 'Selected AI Fair Price:',
    selectedArtisanPriceLabel: 'Selected Your Quoted Price:',
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
    publishToCatalog: 'মূল্যে ক্যাটালগে প্রকাশ করুন',
    editAnswers: 'উত্তরগুলি সম্পাদনা করুন',
    selectSellingPrice: 'আপনার চূড়ান্ত বিক্রয় মূল্য নির্বাচন করুন:',
    optionATitle: '✨ বিকল্প A: AI ন্যায্য বাজার মূল্য',
    recommendedBadge: 'অনুমোদিত (Recommended)',
    moreProfitTag: 'অতিরিক্ত লাভ',
    fairMarketRange: 'ন্যায্য বাজার পরিসীমা:',
    optionBTitle: '🗣️ বিকল্প B: আপনার প্রস্তাবিত মূল্য',
    optionBSub: 'আপনার মূল প্রস্তাবিত বিক্রয় মূল্য',
    guidanceHeader: '💡 KalaSetu AI বাজার পরামর্শ (Guidance):',
    selectedAiPriceLabel: 'নির্বাচিত AI ন্যায্য মূল্য:',
    selectedArtisanPriceLabel: 'নির্বাচিত আপনার প্রস্তাবিত মূল্য:',
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
    publishToCatalog: 'भाव से कैटलॉग में प्रकाशित करीं',
    editAnswers: 'जानकारी में सुधार करीं',
    selectSellingPrice: 'आपण अंतिम बिक्री भाव चुनीं:',
    optionATitle: '✨ विकल्प A: AI उचित बाज़ार भाव',
    recommendedBadge: 'सलाह दीहल (Recommended)',
    moreProfitTag: 'जादे मुनाफा',
    fairMarketRange: 'उचित बाज़ार रेंज:',
    optionBTitle: '🗣️ विकल्प B: रउआ बतावल भाव',
    optionBSub: 'रउआ खुद से बतावल मूल बिक्री भाव',
    guidanceHeader: '💡 KalaSetu AI बाज़ार सलाह (Guidance):',
    selectedAiPriceLabel: 'चुनल AI उचित भाव:',
    selectedArtisanPriceLabel: 'चुनल रउआ बतावल भाव:',
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
    publishToCatalog: 'किमतीत कॅटलॉगमध्ये प्रकाशित करा',
    editAnswers: 'उत्तरे संपादित करा',
    selectSellingPrice: 'तुमची अंतिम विक्री किंमत निवडा:',
    optionATitle: '✨ पर्याय A: AI वाजवी बाजार किंमत',
    recommendedBadge: 'शिफारस केलेले (Recommended)',
    moreProfitTag: 'अधिक नफा',
    fairMarketRange: 'वाजवी बाजार श्रेणी:',
    optionBTitle: '🗣️ पर्याय B: तुमची मूळ सांगितलेली किंमत',
    optionBSub: 'तुमची स्वतः सांगितलेली मूळ विक्री किंमत',
    guidanceHeader: '💡 KalaSetu AI बाजार सल्ला (Guidance):',
    selectedAiPriceLabel: 'निवडलेली AI वाजवी किंमत:',
    selectedArtisanPriceLabel: 'निवडलेली तुमची मूळ किंमत:',
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
    publishToCatalog: 'કિંમતે કેટલોગમાં પ્રકાશિત કરો',
    editAnswers: 'જવાબો સુધારો',
    selectSellingPrice: 'તમારી અંતિમ વેચાણ કિંમત પસંદ કરો:',
    optionATitle: '✨ વિકલ્પ A: AI વાજબી બજાર કિંમત',
    recommendedBadge: 'ભલામણ કરેલ (Recommended)',
    moreProfitTag: 'વધુ નફો',
    fairMarketRange: 'વાજબી બજાર રેન્જ:',
    optionBTitle: '🗣️ વિકલ્પ B: તમારી મૂળ જણાવેલ કિંમત',
    optionBSub: 'તમારી મૂળ જણાવેલ વેચાણ કિંમત',
    guidanceHeader: '💡 KalaSetu AI બજાર સલાહ (Guidance):',
    selectedAiPriceLabel: 'પસંદ કરેલ AI વાજબી કિંમત:',
    selectedArtisanPriceLabel: 'પસંદ કરેલ તમારી કિંમત:',
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
    publishToCatalog: 'भाव सूं कैटलॉग में जोड़ो',
    editAnswers: 'ब्योरो बदलो',
    selectSellingPrice: 'आपरो अंतिम बिक्री भाव चुणो:',
    optionATitle: '✨ विकल्प A: AI वाजिब बजार भाव',
    recommendedBadge: 'सलाह दीधोड़ो (Recommended)',
    moreProfitTag: 'जादा नफो',
    fairMarketRange: 'वाजिब बजार रेंज:',
    optionBTitle: '🗣️ विकल्प B: आपरो बतायोड़ो भाव',
    optionBSub: 'आपरी खुद री बतायोड़ी मूल बिक्री भाव',
    guidanceHeader: '💡 KalaSetu AI बजार सलाह:',
    selectedAiPriceLabel: 'चुन्योड़ो AI वाजिब भाव:',
    selectedArtisanPriceLabel: 'चुन्योड़ो आपरो बतायोड़ो भाव:',
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
    publishToCatalog: 'ಬೆಲೆಯಲ್ಲಿ ಕ್ಯಾಟಲಾಗ್‌ಗೆ ಪ್ರಕಟಿಸಿ',
    editAnswers: 'ಮಾಹಿತಿ ತಿದ್ದುಪಡಿ ಮಾಡಿ',
    selectSellingPrice: 'ನಿಮ್ಮ ಅಂತಿಮ ಮಾರಾಟ ಬೆಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
    optionATitle: '✨ ಆಯ್ಕೆ A: AI ನ್ಯಾಯಯುತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ',
    recommendedBadge: 'ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ (Recommended)',
    moreProfitTag: 'ಹೆಚ್ಚಿನ ಲಾಭ',
    fairMarketRange: 'ನ್ಯಾಯಯುತ ಮಾರುಕಟ್ಟೆ ಶ್ರೇಣಿ:',
    optionBTitle: '🗣️ ಆಯ್ಕೆ B: ನಿಮ್ಮ ಮೂಲ ಅಂದಾಜು ಬೆಲೆ',
    optionBSub: 'ನಿಮ್ಮ ಸ್ವಯಂ ಅಂದಾಜು ಮಾಡಿದ ಮಾರಾಟ ಬೆಲೆ',
    guidanceHeader: '💡 KalaSetu AI ಮಾರುಕಟ್ಟೆ ಮಾರ್ಗದರ್ಶನ:',
    selectedAiPriceLabel: 'ಆಯ್ಕೆಮಾಡಿದ AI ನ್ಯಾಯಯುತ ಬೆಲೆ:',
    selectedArtisanPriceLabel: 'ಆಯ್ಕೆಮಾಡಿದ ನಿಮ್ಮ ಅಂದಾಜು ಬೆಲೆ:',
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

  // Dynamic Pricing Engine state
  const [pricingEstimate, setPricingEstimate] = useState<{
    suggested_price: number;
    recommended_min: number;
    recommended_max: number;
    artisan_price: number;
    guidance: { hindi: string; english: string };
    pricing: { cost_floor: number; market_reference_price: number };
  } | null>(null);
  const [selectedPriceOption, setSelectedPriceOption] = useState<'AI' | 'ARTISAN'>('AI');
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);

  const fetchPricingEstimate = async () => {
    setIsLoadingPricing(true);
    try {
      const rawPriceStr = recordedAnswers[4] || questions[4]?.dummyAnswer || '450';
      const numPrice = parseFloat(rawPriceStr.replace(/[^0-9.]/g, '')) || 450;
      const title = recordedAnswers[0] || questions[0]?.dummyAnswer || 'Handmade Craft Product';
      const description = recordedAnswers[1] || questions[1]?.dummyAnswer || '';
      const category = recordedAnswers[2] || questions[2]?.dummyAnswer || '';
      const material = recordedAnswers[3] || questions[3]?.dummyAnswer || '';

      const bodyParams = new URLSearchParams();
      bodyParams.append('selling_price', String(numPrice));
      bodyParams.append('product_name', title);
      bodyParams.append('source_language', globalLang || 'hi');
      const combinedDesc = `${category} ${material} ${description}`.trim();
      if (combinedDesc) {
        bodyParams.append('description', combinedDesc);
      }

      const res = await fetchFromBackend('/api/v1/pricing/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams.toString(),
      });

      if (res.ok) {
        const data = await res.json();
        setPricingEstimate({
          suggested_price: data.suggested_price || Math.round(numPrice * 1.22),
          recommended_min: data.recommended_min || Math.round(numPrice * 1.05),
          recommended_max: data.recommended_max || Math.round(numPrice * 1.45),
          artisan_price: numPrice,
          guidance: data.guidance || { hindi: '', english: '' },
          pricing: data.pricing || { cost_floor: Math.round(numPrice * 0.7), market_reference_price: data.suggested_price || Math.round(numPrice * 1.22) },
        });
      } else {
        throw new Error('Pricing API returned non-200 status');
      }
    } catch (err) {
      console.log('Pricing API estimate fallback:', err);
      const rawPriceStr = recordedAnswers[4] || questions[4]?.dummyAnswer || '450';
      const numPrice = parseFloat(rawPriceStr.replace(/[^0-9.]/g, '')) || 450;
      const suggestedFallback = Math.round((numPrice * 1.22) / 10) * 10;
      setPricingEstimate({
        suggested_price: suggestedFallback,
        recommended_min: Math.round(numPrice * 1.05),
        recommended_max: Math.round(numPrice * 1.45),
        artisan_price: numPrice,
        guidance: {
          hindi: `सलाह: आप इसे ₹${numPrice} में बेच रहे हैं, जबकि बाज़ार में यह ₹${suggestedFallback} तक बिकता है। आप इसे कम से कम ₹${suggestedFallback} में बेचें। आपको ₹${suggestedFallback - numPrice} का सीधा अतिरिक्त मुनाफ़ा होगा!`,
          english: `Advise: Artisan sells at ₹${numPrice} vs market ₹${suggestedFallback}. Room to capture +22% margin.`
        },
        pricing: {
          cost_floor: Math.round(numPrice * 0.7),
          market_reference_price: suggestedFallback
        }
      });
    } finally {
      setIsLoadingPricing(false);
    }
  };

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
    if (currentStepIndex === totalSteps && !pricingEstimate && !isLoadingPricing) {
      fetchPricingEstimate();
    }
  }, [currentStepIndex]);

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
      fetchPricingEstimate();
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

    const rawPriceStr = recordedAnswers[4] || questions[4]?.dummyAnswer || '450';
    const artisanPriceNum = parseFloat(rawPriceStr.replace(/[^0-9.]/g, '')) || 450;
    const aiPriceNum = pricingEstimate?.suggested_price || 550;

    const finalPriceNum = selectedPriceOption === 'AI' ? aiPriceNum : artisanPriceNum;

    await addPublishedProduct({
      title,
      description,
      category,
      materialUsed,
      price: String(finalPriceNum),
      image: photoUri || '',
      aiEnhanced: true,
      sourceLanguage: globalLang,
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

  const rawPriceStr = recordedAnswers[4] || questions[4]?.dummyAnswer || '450';
  const artisanPriceVal = parseFloat(rawPriceStr.replace(/[^0-9.]/g, '')) || 450;
  const aiPriceVal = pricingEstimate?.suggested_price || Math.round((artisanPriceVal * 1.22) / 10) * 10;
  const gainVal = Math.max(0, aiPriceVal - artisanPriceVal);
  const gainPct = artisanPriceVal > 0 ? Math.round((gainVal / artisanPriceVal) * 100) : 22;

  const chosenFinalPrice = selectedPriceOption === 'AI' ? aiPriceVal : artisanPriceVal;

  const materialEst = Math.round(chosenFinalPrice * 0.30);
  const laborEst = Math.round(chosenFinalPrice * 0.35);
  const finishingEst = Math.round(chosenFinalPrice * 0.10);
  const demandEst = Math.max(0, chosenFinalPrice - (materialEst + laborEst + finishingEst));

  const getLocalizedGuidanceText = (
    lang: LangCode,
    artisanP: number,
    aiP: number,
    mRef: number,
    gain: number,
    gainP: number,
    backendGuidance?: { hindi?: string; english?: string }
  ): string => {
    if (lang === 'en') {
      if (backendGuidance?.english) return backendGuidance.english;
      if (gain > 0) {
        return `Advice: You quoted ₹${artisanP}, while online market listings sell around ₹${mRef || aiP}. We recommend pricing at ₹${aiP} to capture +₹${gain} (+${gainP}%) additional direct profit!`;
      }
      return `Advice: Your quoted price of ₹${artisanP} is well aligned with prevailing online market rates.`;
    }
    if (lang === 'hi') {
      if (backendGuidance?.hindi) return backendGuidance.hindi;
      if (gain > 0) {
        return `सलाह: आप इसे ₹${artisanP} में बेच रहे हैं, जबकि बाज़ार में यह ₹${mRef || aiP} तक बिकता है। आप इसे कम से कम ₹${aiP} में बेचें। आपको ₹${gain} का सीधा अतिरिक्त मुनाफ़ा होगा!`;
      }
      return `सलाह: आपका दाम (₹${artisanP}) बाज़ार के बिल्कुल सही स्तर पर है। आप ₹${aiP} में आसानी से बेच सकते हैं।`;
    }
    if (lang === 'bn') {
      if (gain > 0) {
        return `পরামর্শ: আপনি ₹${artisanP} মূল্য প্রস্তাব করছেন, যখন বাজারে এটি ₹${mRef || aiP} পর্যন্ত বিক্রি হয়। ₹${aiP} মূল্যে বিক্রি করলে আপনার ₹${gain} (+${gainP}%) অতিরিক্ত সরাসরি লাভ হবে!`;
      }
      return `পরামর্শ: আপনার মূল্য (₹${artisanP}) বাজারের মানদণ্ডের সাথে মানানসই। আপনি ₹${aiP} এ বিক্রি করতে পারেন।`;
    }
    if (lang === 'bho') {
      if (gain > 0) {
        return `सलाह: रउआ एकरा के ₹${artisanP} में बेचत बानी, जबकि बाज़ार में ई ₹${mRef || aiP} तक बिकाला। रउआ एकरा के ₹${aiP} में बेचीं। रउआ के ₹${gain} के सीधा जादे मुनाफा होई!`;
      }
      return `सलाह: रउआ के भाव (₹${artisanP}) बाज़ार के बिल्कुल सही स्तर पर बा। रउआ ₹${aiP} में बेच सकत बानी।`;
    }
    if (lang === 'mr') {
      if (gain > 0) {
        return `सल्ला: तुम्ही हे ₹${artisanP} ला विकत आहात, तर बाजारात हे ₹${mRef || aiP} पर्यंत विकले जाते. ₹${aiP} ला विकल्यास तुम्हाला ₹${gain} (+${gainP}%) थेट अतिरिक्त नफा मिळेल!`;
      }
      return `सल्ला: तुमची किंमत (₹${artisanP}) बाजाराच्या मानकांशी सुसंगत आहे. तुम्ही ₹${aiP} ला विकू शकता.`;
    }
    if (lang === 'gu') {
      if (gain > 0) {
        return `સલાહ: તમે આ ₹${artisanP} માં વેચી રહ્યા છો, જ્યારે બજારમાં તે ₹${mRef || aiP} સુધી વેચાય છે. ₹${aiP} માં વેચવાથી તમને ₹${gain} (+${gainP}%) વધારાનો નફો મળશે!`;
      }
      return `સલાહ: તમારી કિંમત (₹${artisanP}) બજારના ધોરણો સાથે યોગ્ય રીતે મેળ ખાતી રહે છે. તમે ₹${aiP} માં વેચી શકો છો.`;
    }
    if (lang === 'raj') {
      if (gain > 0) {
        return `सलाह: आप इने ₹${artisanP} में बेच रिया हो, जदके बजार में ओ ₹${mRef || aiP} ताईं बिकै। आप इने ₹${aiP} में बेचो। आपने ₹${gain} रो सीधो जादा नफो होवेला!`;
      }
      return `सलाह: आपरो भाव (₹${artisanP}) बजार रे हिसाब सूं बिल्कुल सही है। आप ₹${aiP} में बेच सको हो।`;
    }
    if (lang === 'kn') {
      if (gain > 0) {
        return `ಸಲಹೆ: ನೀವು ₹${artisanP} ಬೆಲೆ ನಿಗದಿಪಡಿಸಿದ್ದೀರಿ, ಆದರೆ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಇದು ₹${mRef || aiP} ವರೆಗೆ ಮಾರಾಟವಾಗುತ್ತದೆ. ₹${aiP} ಬೆಲೆಯಲ್ಲಿ ಮಾರಾಟ ಮಾಡುವುದರಿಂದ ನಿಮಗೆ ₹${gain} (+${gainP}%) ಹೆಚ್ಚುವರಿ ಲಾಭ ಸಿಗುತ್ತದೆ!`;
      }
      return `ಸಲಹೆ: ನಿಮ್ಮ ಬೆಲೆ (₹${artisanP}) ಮಾರುಕಟ್ಟೆ ಮಾನದಂಡಗಳಿಗೆ ಸಂಪೂರ್ಣವಾಗಿ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ. ನೀವು ₹${aiP} ರಲ್ಲಿ ಮಾರಾಟ ಮಾಡಬಹುದು.`;
    }
    return `Advice: You quoted ₹${artisanP}. Recommended fair selling target is ₹${aiP}.`;
  };

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
            /* ================= STEP 6: DUAL PRICE SELECTION SUMMARY ================= */
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
                    🗣️ {t.yourQuotedPrice} ₹{artisanPriceVal}
                  </Text>
                </View>
              </View>

              {/* Dual Price Selection Cards (Option A vs Option B) */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 }}>
                  💰 {t.selectSellingPrice}
                </Text>

                {/* Option A: AI Fair Market Price (Recommended) */}
                <TouchableOpacity
                  style={{
                    backgroundColor: selectedPriceOption === 'AI' ? '#F4F9F2' : '#FFFFFF',
                    borderColor: selectedPriceOption === 'AI' ? '#3B6029' : '#EFECE6',
                    borderWidth: 2,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    elevation: selectedPriceOption === 'AI' ? 3 : 1,
                  }}
                  onPress={() => setSelectedPriceOption('AI')}
                  activeOpacity={0.88}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#3B6029', textTransform: 'uppercase' }}>
                        {t.optionATitle}
                      </Text>
                      <View style={{ backgroundColor: '#3B6029', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginLeft: 8 }}>
                        <Text style={{ fontSize: 10, color: '#FFF', fontWeight: 'bold' }}>{t.recommendedBadge}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#1A1A1A' }}>
                      ₹{aiPriceVal}
                    </Text>
                    {gainVal > 0 && (
                      <Text style={{ fontSize: 12, color: '#3B6029', fontWeight: '700', marginTop: 2 }}>
                        ✨ +₹{gainVal} ({gainPct}%) {t.moreProfitTag}
                      </Text>
                    )}
                    <Text style={{ fontSize: 11, color: '#666666', marginTop: 4 }}>
                      {t.fairMarketRange} ₹{pricingEstimate?.recommended_min || Math.round(artisanPriceVal * 1.05)} – ₹{pricingEstimate?.recommended_max || Math.round(artisanPriceVal * 1.45)}
                    </Text>
                  </View>
                  <Ionicons
                    name={selectedPriceOption === 'AI' ? 'radio-button-on' : 'radio-button-off'}
                    size={26}
                    color={selectedPriceOption === 'AI' ? '#3B6029' : '#CCCCCC'}
                  />
                </TouchableOpacity>

                {/* Option B: Artisan Quoted Price */}
                <TouchableOpacity
                  style={{
                    backgroundColor: selectedPriceOption === 'ARTISAN' ? '#FFFDF5' : '#FFFFFF',
                    borderColor: selectedPriceOption === 'ARTISAN' ? '#E65100' : '#EFECE6',
                    borderWidth: 2,
                    borderRadius: 16,
                    padding: 16,
                    marginBottom: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    elevation: selectedPriceOption === 'ARTISAN' ? 3 : 1,
                  }}
                  onPress={() => setSelectedPriceOption('ARTISAN')}
                  activeOpacity={0.88}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#E65100', textTransform: 'uppercase', marginBottom: 4 }}>
                      {t.optionBTitle}
                    </Text>
                    <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#1A1A1A' }}>
                      ₹{artisanPriceVal}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666666', marginTop: 2 }}>
                      {t.optionBSub}
                    </Text>
                  </View>
                  <Ionicons
                    name={selectedPriceOption === 'ARTISAN' ? 'radio-button-on' : 'radio-button-off'}
                    size={26}
                    color={selectedPriceOption === 'ARTISAN' ? '#E65100' : '#CCCCCC'}
                  />
                </TouchableOpacity>
              </View>

              {/* Language-Specific AI Guidance Banner */}
              {pricingEstimate ? (
                <View style={{
                  backgroundColor: '#FFF8E7',
                  borderColor: '#FFE082',
                  borderWidth: 1,
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 16,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                }}>
                  <Ionicons name="bulb" size={24} color="#E65100" style={{ marginRight: 10, marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#E65100', marginBottom: 2 }}>
                      {t.guidanceHeader}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#424242', lineHeight: 19, fontWeight: '500' }}>
                      {getLocalizedGuidanceText(
                        globalLang,
                        artisanPriceVal,
                        aiPriceVal,
                        pricingEstimate?.pricing?.market_reference_price || aiPriceVal,
                        gainVal,
                        gainPct,
                        pricingEstimate?.guidance
                      )}
                    </Text>
                  </View>
                </View>
              ) : null}

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
                  <Text style={styles.costValue}>₹{materialEst}</Text>
                </View>

                {/* Line Item 2: Labor Cost */}
                <View style={styles.costRow}>
                  <View style={styles.costLabelCol}>
                    <Ionicons name="construct-outline" size={20} color="#3B6029" />
                    <Text style={styles.costName}>{t.costCraftsmanship}</Text>
                  </View>
                  <Text style={styles.costValue}>₹{laborEst}</Text>
                </View>

                {/* Line Item 3: Finishing & Bio Polish */}
                <View style={styles.costRow}>
                  <View style={styles.costLabelCol}>
                    <Ionicons name="color-palette-outline" size={20} color="#3B6029" />
                    <Text style={styles.costName}>{t.costFinishing}</Text>
                  </View>
                  <Text style={styles.costValue}>₹{finishingEst}</Text>
                </View>

                {/* Line Item 4: Market Demand Adjustment */}
                <View style={styles.costRow}>
                  <View style={styles.costLabelCol}>
                    <Ionicons name="trending-up-outline" size={20} color="#3B6029" />
                    <Text style={styles.costName}>{t.costMarketDemand}</Text>
                  </View>
                  <Text style={[styles.costValue, { color: '#3B6029' }]}>+₹{demandEst}</Text>
                </View>

                <View style={styles.costDivider} />

                {/* Total Chosen Price */}
                <View style={styles.totalPriceRow}>
                  <Text style={styles.totalPriceLabel}>
                    {selectedPriceOption === 'AI' ? t.selectedAiPriceLabel : t.selectedArtisanPriceLabel}
                  </Text>
                  <Text style={[styles.totalPriceValue, { color: selectedPriceOption === 'AI' ? '#3B6029' : '#E65100' }]}>
                    ₹{chosenFinalPrice}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <TouchableOpacity
                style={[styles.publishBtn, selectedPriceOption === 'ARTISAN' && { backgroundColor: '#E65100' }]}
                onPress={handlePublishCatalog}
                activeOpacity={0.88}
              >
                <Ionicons name="checkmark-done" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.publishBtnText}>
                  {`${t.publishToCatalog} (₹${chosenFinalPrice})`}
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
