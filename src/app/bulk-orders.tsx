import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Modal,
  TextInput,
  Alert,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGlobalLang, setGlobalLang, ALL_LANGUAGES, LangCode } from '@/utils/languageStore';

interface BulkOrderItem {
  id: string;
  buyerNames: Record<LangCode, string>;
  buyerTypes: Record<LangCode, string>;
  locations: Record<LangCode, string>;
  productReqs: Record<LangCode, string>;
  quantities: Record<LangCode, string>;
  estBudgets: Record<LangCode, string>;
  deadlines: Record<LangCode, string>;
  badgeTags: Record<LangCode, string>;
  badgeTagKey: 'urgent' | 'govt' | 'verified';
  badgeColor: string;
}

const BULK_ORDERS_DATA: BulkOrderItem[] = [
  {
    id: '1',
    buyerNames: {
      en: 'Taj Hotels & Heritage Resorts',
      hi: 'ताज ग्रुप ऑफ होटल्स',
      bn: 'তাজ গ্রুপ অফ হোটেলস',
      bho: 'ताज ग्रुप ऑफ होटल्स',
      mr: 'ताज ग्रुप ऑफ हॉटेल्स',
      gu: 'તાજ ગ્રુપ ઓફ હોટેલ્સ',
      raj: 'ताज ग्रुप ऑफ होटल्स',
      kn: 'ತಾಜ್ ಗ್ರೂಪ್ ಆಫ್ ಹೋಟೆಲ್ಸ್',
    },
    buyerTypes: {
      en: 'Corporate Hospitality Buyer',
      hi: 'कॉरपोरेट हॉस्पिटैलिटी खरीदार',
      bn: 'কর্পোরেট হসপিটালিটি ক্রেতা',
      bho: 'कॉरपोरेट हॉस्पिटैलिटी खरीदार',
      mr: 'कॉर्पोरेट हॉस्पिटॅलिटी ग्राहक',
      gu: 'કોર્પોરેટ હોસ્પિટાલિટી ખરીદદાર',
      raj: 'कॉरपोरेट हॉस्पिटैलिटी खरीदार',
      kn: 'ಕಾರ್ಪೊರೇಟ್ ಹಾಸ್ಪಿಟಾಲಿಟಿ ಖರೀದಿದಾರ',
    },
    locations: {
      en: 'Jaipur, Rajasthan',
      hi: 'जयपुर, राजस्थान',
      bn: 'জয়পুর, রাজস্থান',
      bho: 'जयपुर, राजस्थान',
      mr: 'जयपूर, राजस्थान',
      gu: 'જયપુર, રાજસ્થાન',
      raj: 'जयपुर, राजस्थान',
      kn: 'ಜೈಪುರ, ರಾಜಸ್ಥಾನ',
    },
    productReqs: {
      en: 'Handmade Decorative Etched Clay Pots & Vases',
      hi: 'हस्तनिर्मित मिट्टी के सजावटी घड़े व फूलदान',
      bn: 'হাতে তৈরি পোড়ামাটির আলংকারিক পাত্র ও ফুলদানি',
      bho: 'हाथ के बनल माटी के सजावटी घड़ा अउरी फूलदान',
      mr: 'हस्तनिर्मित सजावटी मातीची मडकी व फुलदाण्या',
      gu: 'હસ્તનિર્મિત માટીના શણગારાત્મક માટલાં અને ફૂલદાની',
      raj: 'हाथ सूं बन्योड़ा माटी रा सजावटी घड़ा अर फूलदान',
      kn: 'ಹಸ್ತಾಲಂಕಾರದ ಮಣ್ಣಿನ ಅಲಂಕಾರಿಕ ಮಡಕೆಗಳು ಮತ್ತು ಹೂಜಿಗಳು',
    },
    quantities: {
      en: '200 Units (Min)',
      hi: '200 पीस (न्यूनतम)',
      bn: '২০০ টি (সর্বনিম্ন)',
      bho: '200 गो (कम से कम)',
      mr: '२०० नग (किमान)',
      gu: '200 પીસ (ન્યૂનતમ)',
      raj: '200 नग (कम सूं कम)',
      kn: '200 ತುಂಡುಗಳು (ಕನಿಷ್ಠ)',
    },
    estBudgets: {
      en: '₹2,10,000',
      hi: '₹2,10,000',
      bn: '₹২,১০,০০০',
      bho: '₹2,10,000',
      mr: '₹२,१०,०००',
      gu: '₹2,10,000',
      raj: '₹2,10,000',
      kn: '₹2,10,000',
    },
    deadlines: {
      en: '15 Sep 2026',
      hi: '15 सितंबर 2026',
      bn: '১৫ সেপ্টেম্বর ২০২৬',
      bho: '15 सितंबर 2026',
      mr: '१५ सप्टेंबर २०२६',
      gu: '15 સપ્ટેમ્બર 2026',
      raj: '15 सितंबर 2026',
      kn: '15 ಸೆಪ್ಟೆಂಬರ್ 2026',
    },
    badgeTags: {
      en: 'Urgent Sourcing',
      hi: 'अति आवश्यक',
      bn: 'জরুরী প্রয়োজন',
      bho: 'अति आवश्यक',
      mr: 'अति आवश्यक',
      gu: 'અતિ આવશ્યક',
      raj: 'अति आवश्यक',
      kn: 'ತುರ್ತು ಅವಶ್ಯಕತೆ',
    },
    badgeTagKey: 'urgent',
    badgeColor: '#D32F2F',
  },
  {
    id: '2',
    buyerNames: {
      en: 'Central Cottage Industries Emporium',
      hi: 'सेंट्रल कॉटेज इंडस्ट्रीज एम्पोरियम',
      bn: 'সেন্ট্রাল কটেজ ইন্ডাস্ট্রিজ এম্পোরিয়াম',
      bho: 'सेंट्रल कॉटेज इंडस्ट्रीज एम्पोरियम',
      mr: 'सेंट्रल कॉटेज इंडस्ट्रीज एम्पोरियम',
      gu: 'સેન્ટ્રલ કોટેજ ઇન્ડસ્ટ્રીઝ એમ્પોર્સ',
      raj: 'सेंट्रल कॉटेज इंडस्ट्रीज एम्पोरियम',
      kn: 'ಸೆಂಟ್ರಲ್ ಕಾಟೇಜ್ ಇಂಡಸ್ಟ್ರೀಸ್ ಎಂಪೋರಿಯಂ',
    },
    buyerTypes: {
      en: 'Govt Emporium Bulk Reseller',
      hi: 'सरकारी एम्पोरियम रीसेलर',
      bn: 'সরকারি এম্পোরিয়াম রিয়েলারেসলার',
      bho: 'सरकारी एम्पोरियम रीसेलर',
      mr: 'सरकारी एम्पोरियम रीसेलर',
      gu: 'સરકારી એમ્પોર્સ રીસેલર',
      raj: 'सरकारी एम्पोरियम रीसेलर',
      kn: 'ಸರ್ಕಾರಿ ಎಂಪೋರಿಯಂ ರಿಸೇಲರ್',
    },
    locations: {
      en: 'New Delhi',
      hi: 'नई दिल्ली',
      bn: 'নতুন দিল্লি',
      bho: 'नई दिल्ली',
      mr: 'नवी दिल्ली',
      gu: 'નવી દિલ્હી',
      raj: 'नई दिल्ली',
      kn: 'ನವದೆಹಲಿ',
    },
    productReqs: {
      en: 'Hand-carved Wooden Frames & Wall Art Units',
      hi: 'नक्काशीदार शीशम लकड़ी के फोटो फ्रेम व दीवार कला',
      bn: 'খোদাই করা কাঠের ফটো ফ্রেম এবং দেয়াল শিল্প',
      bho: 'नक्काशीदार लकड़ी के फोटो फ्रेम अउरी दीवाल कला',
      mr: 'नक्षीकाम केलेले लाकडी फोटो फ्रेम आणि भिंतीची कला',
      gu: 'કોતરણીવાળી લાકડાની ફોટો ફ્રેમ અને દીવાલ કલા',
      raj: 'नक्काशीदार लाकड़ी रा फोटो फ्रेम अर भींत कला',
      kn: 'ಕೆತ್ತನೆಯ ಮರದ ಫೋಟೋ ಫ್ರೇಮ್‌ಗಳು ಮತ್ತು ಗೋಡೆಯ ಕಲೆ',
    },
    quantities: {
      en: '500 Units',
      hi: '500 पीस',
      bn: '৫০০ টি',
      bho: '500 गो',
      mr: '५०० नग',
      gu: '500 પીસ',
      raj: '500 नग',
      kn: '500 ತುಂಡುಗಳು',
    },
    estBudgets: {
      en: '₹4,50,000',
      hi: '₹4,50,000',
      bn: '₹৪,৫০,০০০',
      bho: '₹4,50,000',
      mr: '₹४,५०,०००',
      gu: '₹4,50,000',
      raj: '₹4,50,000',
      kn: '₹4,50,000',
    },
    deadlines: {
      en: '30 Sep 2026',
      hi: '30 सितंबर 2026',
      bn: '৩০ সেপ্টেম্বর ২০২৬',
      bho: '30 सितंबर 2026',
      mr: '३० सप्टेंबर २०२६',
      gu: '30 સપ્ટેમ્બર 2026',
      raj: '30 सितंबर 2026',
      kn: '30 ಸೆಪ್ಟೆಂಬರ್ 2026',
    },
    badgeTags: {
      en: 'Govt Order',
      hi: 'सरकारी टेंडर',
      bn: 'সরকারি টেন্ডার',
      bho: 'सरकारी टेंडर',
      mr: 'सरकारी टेंडर',
      gu: 'સરકારી ટેન્ડર',
      raj: 'सरकारी टेंडर',
      kn: 'ಸರ್ಕಾರಿ ಟೆಂಡರ್',
    },
    badgeTagKey: 'govt',
    badgeColor: '#3B6029',
  },
  {
    id: '3',
    buyerNames: {
      en: 'FabIndia Retail Pvt Ltd',
      hi: 'फैबइंडिया रिटेल प्राइवेट लिमिटेड',
      bn: 'ফ্যাবইন্ডিয়া রিটেল প্রাইভেট লিমিটেড',
      bho: 'फैबइंडिया रिटेल प्राइवेट लिमिटेड',
      mr: 'फॅबइंडिया रिटेल प्रायव्हेट लिमिटेड',
      gu: 'ફેબઇન્ડિયા રિટેલ પ્રાઇવેટ લિમિટેડ',
      raj: 'फैबइंडिया रिटेल प्राइवेट लिमिटेड',
      kn: 'ಫ್ಯಾಬ್‌ಇಂಡಿಯಾ ರಿಟೇಲ್ ಪ್ರೈವೇಟ್ ಲಿಮಿಟೆಡ್',
    },
    buyerTypes: {
      en: 'Branded Craft Retail Chain',
      hi: 'ब्रांडेड क्राफ्ट रिटेल श्रृंखला',
      bn: 'ব্র্যান্ডেড ক্রাফট খুচরা শৃঙ্খল',
      bho: 'ब्रांडेड क्राफ्ट रिटेल श्रृंखला',
      mr: 'ब्रँडेड क्राफ्ट रिटेल साखळी',
      gu: 'બ્રાન્ડેડ ક્રાફ્ટ રિટેલ ચેઇન',
      raj: 'ब्रांडेड क्राफ्ट रिटेल श्रृंखला',
      kn: 'ಬ್ರಾಂಡೆಡ್ ಕ್ರಾಫ್ಟ್ ರಿಟೇಲ್ ಸರಣಿ',
    },
    locations: {
      en: 'Mumbai, Maharashtra',
      hi: 'मुंबई, महाराष्ट्र',
      bn: 'মুম্বাই, মহারাষ্ট্র',
      bho: 'मुंबई, महाराष्ट्र',
      mr: 'मुंबई, महाराष्ट्र',
      gu: 'મુંબઈ, મહારાષ્ટ્ર',
      raj: 'मुंबई, महाराष्ट्र',
      kn: 'ಮುಂಬೈ, ಮಹಾರಾಷ್ಟ್ರ',
    },
    productReqs: {
      en: 'Traditional Handmade Terracotta Diya Gift Sets',
      hi: 'पारंपरिक हस्तनिर्मित टेराकोटा दीया व उपहार सेट',
      bn: 'ঐতিহ্যবাহী হাতে তৈরি পোড়ামাটির প্রদীপ উপহার সেট',
      bho: 'पारंपरिक हाथ के बनल टेराकोटा दीया उपहार सेट',
      mr: 'पारंपरिक हस्तनिर्मित टेराकोटा दिवा व भेट वस्तू संच',
      gu: 'પરંપરાગત હસ્તનિર્મિત ટેરાકોટા દીવા ગિફ્ટ સેટ',
      raj: 'पारंपरिक हाथ सूं बन्योड़ा टेराकोटा दीया उपहार सेट',
      kn: 'ಪಾರಂಪರಿಕ ಹಸ್ತಾಲಂಕಾರದ ಟೆರಾಕೋಟಾ ದೀಪ ಉಡುಗೊರೆ ಸೆಟ್‌ಗಳು',
    },
    quantities: {
      en: '350 Sets',
      hi: '350 सेट',
      bn: '৩৫০ সেট',
      bho: '350 सेट',
      mr: '३५० संच',
      gu: '350 સેટ',
      raj: '350 सेट',
      kn: '350 ಸೆಟ್‌ಗಳು',
    },
    estBudgets: {
      en: '₹1,75,000',
      hi: '₹1,75,000',
      bn: '₹১,৭৫,০০০',
      bho: '₹1,75,000',
      mr: '₹१,७५,०००',
      gu: '₹1,75,000',
      raj: '₹1,75,000',
      kn: '₹1,75,000',
    },
    deadlines: {
      en: '20 Oct 2026',
      hi: '20 अक्टूबर 2026',
      bn: '২০ অক্টোবর ২০২৬',
      bho: '20 अक्टूबर 2026',
      mr: '२० ऑक्टोबर २०२६',
      gu: '20 ઓક્ટોબર 2026',
      raj: '20 अक्टूबर 2026',
      kn: '20 ಅಕ್ಟೋಬರ್ 2026',
    },
    badgeTags: {
      en: 'Verified Buyer',
      hi: 'सीधा खरीदार',
      bn: 'সরাসরি ক্রেতা',
      bho: 'सीधा खरीदार',
      mr: 'थेट ग्राहक',
      gu: 'સીધો ખરીદદાર',
      raj: 'सीधो खरीदार',
      kn: 'ನೇರ ಖರೀದಿದಾರ',
    },
    badgeTagKey: 'verified',
    badgeColor: '#1976D2',
  },
];

const TRANSLATIONS: Record<LangCode, {
  headerTitle: string;
  bannerTitle: string;
  bannerSub: string;
  allOrders: string;
  urgentRequests: string;
  govtTenders: string;
  qtyLabel: string;
  budgetLabel: string;
  deadlineLabel: string;
  chatBtn: string;
  submitQuoteBtn: string;
  quoteModalTitle: string;
  quotePriceLabel: string;
  quotePricePlaceholder: string;
  quoteDaysLabel: string;
  quoteDaysPlaceholder: string;
  quoteNotesLabel: string;
  quoteNotesPlaceholder: string;
  submitOffer: string;
  modalTitle: string;
}> = {
  hi: {
    headerTitle: 'बल्क ऑर्डर अवसर',
    bannerTitle: 'बड़ी मात्रा में बिक्री करें',
    bannerSub: 'होटल, कॉरपोरेट और बड़े खरीदारों से सीधे थोक ऑर्डर प्राप्त करें',
    allOrders: 'सभी ऑर्डर',
    urgentRequests: 'अति आवश्यक',
    govtTenders: 'सरकारी टेंडर',
    qtyLabel: 'मात्रा (Quantity)',
    budgetLabel: 'अनुमानित बजट',
    deadlineLabel: 'अंतिम तिथि',
    chatBtn: 'चैट करें',
    submitQuoteBtn: 'ऑफर सबमिट करें →',
    quoteModalTitle: 'अपना ऑफर (Quote) सबमिट करें',
    quotePriceLabel: 'आपकी कुल अनुमानित कीमत (₹) *',
    quotePricePlaceholder: 'जैसे: 1,80,000',
    quoteDaysLabel: 'सामान तैयार करने में लगने वाले दिन',
    quoteDaysPlaceholder: 'जैसे: 15 दिन',
    quoteNotesLabel: 'खरीदार के लिए विशेष संदेश / नोट (ऐच्छिक)',
    quoteNotesPlaceholder: 'पैकेजिंग, शिपिंग व गुणवत्ता की जानकारी लिखें...',
    submitOffer: 'ऑफर भेजें',
    modalTitle: 'भाषा चुनें / Select Language',
  },
  en: {
    headerTitle: 'Bulk Orders & Enquiries',
    bannerTitle: 'Get Bulk Orders & Growth',
    bannerSub: 'Receive direct wholesale orders from hotels, emporiums & corporate buyers',
    allOrders: 'All Orders',
    urgentRequests: 'Urgent Requests',
    govtTenders: 'Govt Tenders',
    qtyLabel: 'Quantity',
    budgetLabel: 'Estimated Budget',
    deadlineLabel: 'Deadline',
    chatBtn: 'Chat',
    submitQuoteBtn: 'Submit Quote →',
    quoteModalTitle: 'Submit Price Proposal',
    quotePriceLabel: 'Your Total Price Quote (₹) *',
    quotePricePlaceholder: 'e.g. 1,80,000',
    quoteDaysLabel: 'Estimated Delivery Days',
    quoteDaysPlaceholder: 'e.g. 15 Days',
    quoteNotesLabel: 'Message to Buyer (Optional)',
    quoteNotesPlaceholder: 'Mention quality, delivery terms...',
    submitOffer: 'Submit Proposal',
    modalTitle: 'Select Language / भाषा चुनें',
  },
  bn: {
    headerTitle: 'বাল্ক অর্ডারের সুযোগ',
    bannerTitle: 'বিপুল পরিমাণে বিক্রি করুন',
    bannerSub: 'হোটেল, কর্পোরেট এবং বড় ক্রেতাদের কাছ থেকে সরাসরি পাইকারি অর্ডার পান',
    allOrders: 'সমস্ত অর্ডার',
    urgentRequests: 'জরুরী অনুরোধ',
    govtTenders: 'সরকারি টেন্ডার',
    qtyLabel: 'পরিমাণ (Quantity)',
    budgetLabel: 'আনুমানিক বাজেট',
    deadlineLabel: 'শেষ তারিখ',
    chatBtn: 'চ্যাট করুন',
    submitQuoteBtn: 'অফার জমা দিন →',
    quoteModalTitle: 'আপনার মূল্য প্রস্তাব জমা দিন',
    quotePriceLabel: 'আপনার মোট আনুমানিক মূল্য (₹) *',
    quotePricePlaceholder: 'যেমন: ১,৮০,০০০',
    quoteDaysLabel: 'পণ্য তৈরিতে আনুমানিক দিন',
    quoteDaysPlaceholder: 'যেমন: ১৫ দিন',
    quoteNotesLabel: 'ক্রেতার জন্য বিশেষ বার্তা / নোট (ঐচ্ছিক)',
    quoteNotesPlaceholder: 'প্যাকেজিং, শিপিং ও গুণমানের বিবরণ লিখুন...',
    submitOffer: 'প্রস্তাব পাঠান',
    modalTitle: 'ভাষা নির্বাচন করুন / Select Language',
  },
  bho: {
    headerTitle: 'बल्क ऑर्डर के मौका',
    bannerTitle: 'बड़ा मात्रा में सामान बेचीं',
    bannerSub: 'होटल, कॉरपोरेट अउरी बड़ा खरीदारन से सीधे थोक ऑर्डर पाईं',
    allOrders: 'सभ ऑर्डर',
    urgentRequests: 'अति आवश्यक',
    govtTenders: 'सरकारी टेंडर',
    qtyLabel: 'मात्रा',
    budgetLabel: 'अनुमानित बजट',
    deadlineLabel: 'अंतिम तारीख',
    chatBtn: 'बात करीं',
    submitQuoteBtn: 'ऑफर जमा करीं →',
    quoteModalTitle: 'अपन ऑफर (Quote) सबमिट करीं',
    quotePriceLabel: 'राउर कुल अनुमानित कीमत (₹) *',
    quotePricePlaceholder: 'जैसे: 1,80,000',
    quoteDaysLabel: 'सामान तैयार करे में लागे वाला दिन',
    quoteDaysPlaceholder: 'जैसे: 15 दिन',
    quoteNotesLabel: 'खरीदार खातिर विशेष संदेश (ऐच्छिक)',
    quoteNotesPlaceholder: 'पैकेजिंग अउरी क्वालिटी के जानकारी लिखीं...',
    submitOffer: 'ऑफर भेजीं',
    modalTitle: 'भाषा चुनीं / Select Language',
  },
  mr: {
    headerTitle: 'बल्क ऑर्डर संधी',
    bannerTitle: 'मोठ्या प्रमाणात विक्री करा',
    bannerSub: 'हॉटेल्स, कॉर्पोरेट्स आणि मोठ्या ग्राहकांकडून थेट घाऊक ऑर्डर्स मिळवा',
    allOrders: 'सर्व ऑर्डर्स',
    urgentRequests: 'अति आवश्यक',
    govtTenders: 'सरकारी टेंडर्स',
    qtyLabel: 'प्रमाण (Quantity)',
    budgetLabel: 'अंदाजे बजेट',
    deadlineLabel: 'अंतिम तारीख',
    chatBtn: 'चॅट करा',
    submitQuoteBtn: 'ऑफर सबमिट करा →',
    quoteModalTitle: 'तुमचा दर प्रस्ताव (Quote) सबमिट करा',
    quotePriceLabel: 'तुमची एकूण अंदाजे किंमत (₹) *',
    quotePricePlaceholder: 'उदा: १,८०,०००',
    quoteDaysLabel: 'सामग्री तयार करण्यासाठी लागणारे दिवस',
    quoteDaysPlaceholder: 'उदा: १५ दिवस',
    quoteNotesLabel: 'ग्राहकासाठी विशेष संदेश / टीप (ऐच्छिक)',
    quoteNotesPlaceholder: 'पॅकिंग, शिपिंग व गुणवत्तेची माहिती लिहा...',
    submitOffer: 'प्रस्ताव पाठवा',
    modalTitle: 'भाषा निवडा / Select Language',
  },
  gu: {
    headerTitle: 'બલ્ક ઓર્ડર તકો',
    bannerTitle: 'મોટી માત્રામાં વેચાણ કરો',
    bannerSub: 'હોટેલ્સ, કોર્પોરેટ અને મોટા ખરીદદારો પાસેથી સીધા જથ્થાબંધ ઓર્ડર મેળવો',
    allOrders: 'તમામ ઓર્ડર',
    urgentRequests: 'અતિ આવશ્યક',
    govtTenders: 'સરકારી ટેન્ડર',
    qtyLabel: 'જથ્થો (Quantity)',
    budgetLabel: 'અંદાજિત બજેટ',
    deadlineLabel: 'અંતિમ તારીખ',
    chatBtn: 'ચેટ કરો',
    submitQuoteBtn: 'ઓફર સબમિટ કરો →',
    quoteModalTitle: 'તમારો ભાવ પ્રસ્તાવ સબમિટ કરો',
    quotePriceLabel: 'તમારી કુલ અંદાજિત કિંમત (₹) *',
    quotePricePlaceholder: 'જેમ કે: 1,80,000',
    quoteDaysLabel: 'સામાન તૈયાર કરવામાં લાગતા દિવસો',
    quoteDaysPlaceholder: 'જેમ કે: 15 દિવસ',
    quoteNotesLabel: 'ખરીદદાર માટે ખાસ સંદેશ (વૈકલ્પિક)',
    quoteNotesPlaceholder: 'પેકેજિંગ અને ગુણવત્તાની વિગતો લખો...',
    submitOffer: 'પ્રસ્તાવ મોકલો',
    modalTitle: 'ભાષા પસંદ કરો / Select Language',
  },
  raj: {
    headerTitle: 'बल्क ऑर्डर मौका',
    bannerTitle: 'बड़ी मात्रा मांय बिक्री करो',
    bannerSub: 'होटल, कॉरपोरेट अर बड़ा खरीदारां सूं सीधो थोक ऑर्डर पाओ',
    allOrders: 'सगळा ऑर्डर',
    urgentRequests: 'अति आवश्यक',
    govtTenders: 'सरकारी टेंडर',
    qtyLabel: 'मात्रा',
    budgetLabel: 'अनुमानित बजट',
    deadlineLabel: 'अंतिम तारीख',
    chatBtn: 'बात करो',
    submitQuoteBtn: 'ऑफर सबमिट करो →',
    quoteModalTitle: 'आपरो ऑफर (Quote) सबमिट करो',
    quotePriceLabel: 'आपरी कुल अनुमानित कीमत (₹) *',
    quotePricePlaceholder: 'जियां: 1,80,000',
    quoteDaysLabel: 'सामान तैयार करवा मांय लागबा आळा दिन',
    quoteDaysPlaceholder: 'जियां: 15 दिन',
    quoteNotesLabel: 'खरीदार खातर विशेष संदेश (ऐच्छिक)',
    quoteNotesPlaceholder: 'पैकेजिंग अर क्वालिटी री जाणकारी लिखो...',
    submitOffer: 'ऑफर भेजो',
    modalTitle: 'भाषा चूणो / Select Language',
  },
  kn: {
    headerTitle: 'ಬಲ್ಕ್ ಆದೇಶದ ಅವಕಾಶಗಳು',
    bannerTitle: 'ಹೆಚ್ಚಿನ ಪ್ರಮಾಣದಲ್ಲಿ ಮಾರಾಟ ಮಾಡಿ',
    bannerSub: 'ಹೋಟೆಲ್‌ಗಳು, ಕಾರ್ಪೊರೇಟ್‌ಗಳು ಮತ್ತು ಪ್ರಮುಖ ಖರೀದಿದಾರರಿಂದ ನೇರ ಸಗಟು ಆದೇಶಗಳನ್ನು ಪಡೆಯಿರಿ',
    allOrders: 'ಎಲ್ಲಾ ಆದೇಶಗಳು',
    urgentRequests: 'ತುರ್ತು ಅವಶ್ಯಕತೆಗಳು',
    govtTenders: 'ಸರ್ಕಾರಿ ಟೆಂಡರ್‌ಗಳು',
    qtyLabel: 'ಪ್ರಮಾಣ (Quantity)',
    budgetLabel: 'ಅಂದಾಜು ಬಜೆಟ್',
    deadlineLabel: 'ಕೊನೆಯ ದಿನಾಂಕ',
    chatBtn: 'ಚಾಟ್ ಮಾಡಿ',
    submitQuoteBtn: 'ಆಫರ್ ಸಲ್ಲಿಸಿ →',
    quoteModalTitle: 'ನಿಮ್ಮ ಬೆಲೆ ಪ್ರಸ್ತಾಪವನ್ನು ಸಲ್ಲಿಸಿ',
    quotePriceLabel: 'ನಿಮ್ಮ ಒಟ್ಟು ಅಂದಾಜು ಬೆಲೆ (₹) *',
    quotePricePlaceholder: 'ಉದಾ: 1,80,000',
    quoteDaysLabel: 'ವಸ್ತುಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲು ಬೇಕಾಗುವ ದಿನಗಳು',
    quoteDaysPlaceholder: 'ಉದಾ: 15 ದಿನಗಳು',
    quoteNotesLabel: 'ಖರೀದಿದಾರರಿಗೆ ವಿಶೇಷ ಸಂದೇಶ (ಐಚ್ಛಿಕ)',
    quoteNotesPlaceholder: 'ಪ್ಯಾಕಿಂಗ್ ಮತ್ತು ಗುಣಮಟ್ಟದ ವಿವರಗಳನ್ನು ಬರೆಯಿರಿ...',
    submitOffer: 'ಪ್ರಸ್ತಾಪವನ್ನು ಸಲ್ಲಿಸಿ',
    modalTitle: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / Select Language',
  },
};

export default function BulkOrdersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const [globalLang] = useGlobalLang();
  const initialLang: LangCode = (params.lang as LangCode) || globalLang || 'hi';

  const [selectedLang, setSelectedLang] = useState<LangCode>(initialLang);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);

  React.useEffect(() => {
    if (globalLang) {
      setSelectedLang(globalLang);
    }
  }, [globalLang]);

  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.hi;
  const currentLangObj = ALL_LANGUAGES.find((l) => l.code === selectedLang) || ALL_LANGUAGES[1];
  const currentLangLabel = `${currentLangObj.nativeName} (${currentLangObj.englishName})`;

  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'govt'>('all');
  const [selectedOrder, setSelectedOrder] = useState<BulkOrderItem | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteDays, setQuoteDays] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenQuoteModal = (order: BulkOrderItem) => {
    setSelectedOrder(order);
    setQuotePrice('');
    setQuoteDays('');
    setQuoteNotes('');
    setIsModalOpen(true);
  };

  const isHindi = selectedLang === 'hi';

  const handleSpeechToText = (field: 'price' | 'days' | 'notes') => {
    if (field === 'price') {
      setQuotePrice('180000');
      Alert.alert(
        isHindi ? '🎙️ आवाज़ से दर्ज किया गया' : '🎙️ Voice Recorded',
        isHindi ? 'बोली गई कीमत: ₹1,80,000' : 'Spoken Price: ₹1,80,000'
      );
    } else if (field === 'days') {
      setQuoteDays('15');
      Alert.alert(
        isHindi ? '🎙️ आवाज़ से दर्ज किया गया' : '🎙️ Voice Recorded',
        isHindi ? 'बोले गए दिन: 15 दिन' : 'Spoken Days: 15 Days'
      );
    } else if (field === 'notes') {
      setQuoteNotes(
        isHindi
          ? 'उच्चतम गुणवत्ता की प्राकृतिक सामग्री और 15 दिनों में सुरक्षित डिलीवरी की गारंटी।'
          : 'Premium quality handmade materials with guaranteed 15-day delivery.'
      );
      Alert.alert(
        isHindi ? '🎙️ आवाज़ से दर्ज किया गया' : '🎙️ Voice Recorded',
        isHindi ? 'विशेष संदेश आवाज़ से टाइप कर दिया गया है।' : 'Notes recorded via speech-to-text.'
      );
    }
  };

  const handleSubmitQuote = () => {
    if (!quotePrice.trim()) {
      Alert.alert(
        isHindi ? 'त्रुटि' : 'Error',
        isHindi ? 'कृपया अपना मूल्य प्रस्ताव दर्ज करें।' : 'Please enter your quote price.'
      );
      return;
    }
    setIsModalOpen(false);
    const buyerName = selectedOrder ? (selectedOrder.buyerNames[selectedLang] || selectedOrder.buyerNames.en) : '';
    Alert.alert(
      isHindi ? 'प्रस्ताव भेजा गया!' : 'Quote Submitted!',
      isHindi
        ? `आपका ₹${quotePrice} का ऑफर ${buyerName} को भेज दिया गया है।`
        : `Your quote of ₹${quotePrice} has been sent to ${buyerName}.`
    );
  };

  const filteredOrders = BULK_ORDERS_DATA.filter((item) => {
    if (activeFilter === 'urgent') return item.badgeTagKey === 'urgent';
    if (activeFilter === 'govt') return item.badgeTagKey === 'govt';
    return true;
  });

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

          <TouchableOpacity
            style={styles.langSelector}
            onPress={() => setIsLangModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.langText}>{currentLangLabel}</Text>
            <Ionicons name="chevron-down" size={14} color="#2C2C2C" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Banner Card */}
          <View style={styles.bannerCard}>
            <View style={styles.bannerIconCircle}>
              <Ionicons name="cube" size={26} color="#3B6029" />
            </View>

            <View style={styles.bannerTextGroup}>
              <Text style={styles.bannerTitle}>{t.bannerTitle}</Text>
              <Text style={styles.bannerSub}>{t.bannerSub}</Text>
            </View>
          </View>

          {/* Filter Pills Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsRow}
          >
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[styles.filterPillText, activeFilter === 'all' && styles.filterPillTextActive]}>
                {t.allOrders}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'urgent' && styles.filterPillActive]}
              onPress={() => setActiveFilter('urgent')}
            >
              <Text style={[styles.filterPillText, activeFilter === 'urgent' && styles.filterPillTextActive]}>
                {t.urgentRequests}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'govt' && styles.filterPillActive]}
              onPress={() => setActiveFilter('govt')}
            >
              <Text style={[styles.filterPillText, activeFilter === 'govt' && styles.filterPillTextActive]}>
                {t.govtTenders}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Bulk Orders List */}
          <View style={styles.ordersListGroup}>
            {filteredOrders.map((order) => {
              const bName = order.buyerNames[selectedLang] || order.buyerNames.hi || order.buyerNames.en;
              const bType = order.buyerTypes[selectedLang] || order.buyerTypes.hi || order.buyerTypes.en;
              const loc = order.locations[selectedLang] || order.locations.hi || order.locations.en;
              const req = order.productReqs[selectedLang] || order.productReqs.hi || order.productReqs.en;
              const qty = order.quantities[selectedLang] || order.quantities.hi || order.quantities.en;
              const budget = order.estBudgets[selectedLang] || order.estBudgets.hi || order.estBudgets.en;
              const deadline = order.deadlines[selectedLang] || order.deadlines.hi || order.deadlines.en;
              const tag = order.badgeTags[selectedLang] || order.badgeTags.hi || order.badgeTags.en;

              return (
                <View key={order.id} style={styles.orderCard}>
                  {/* Card Header Row */}
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.buyerAvatar}>
                      <Ionicons name="business" size={22} color="#3B6029" />
                    </View>

                    <View style={styles.buyerMetaCol}>
                      <Text style={styles.buyerName}>{bName}</Text>
                      <Text style={styles.buyerType}>{bType} • 📍 {loc}</Text>
                    </View>

                    <View style={[styles.badgeTag, { backgroundColor: order.badgeColor }]}>
                      <Text style={styles.badgeTagText}>{tag}</Text>
                    </View>
                  </View>

                  <View style={styles.cardDivider} />

                  {/* Order Details Body */}
                  <Text style={styles.reqTitle}>{req}</Text>

                  <View style={styles.specGrid}>
                    <View style={styles.specBox}>
                      <Text style={styles.specLabel}>{t.qtyLabel}</Text>
                      <Text style={styles.specVal}>{qty}</Text>
                    </View>

                    <View style={styles.specBox}>
                      <Text style={styles.specLabel}>{t.budgetLabel}</Text>
                      <Text style={styles.specValGreen}>{budget}</Text>
                    </View>

                    <View style={styles.specBox}>
                      <Text style={styles.specLabel}>{t.deadlineLabel}</Text>
                      <Text style={styles.specVal}>{deadline}</Text>
                    </View>
                  </View>

                  {/* Action Buttons Row */}
                  <View style={styles.cardActionRow}>
                    <TouchableOpacity
                      style={styles.chatBuyerBtn}
                      onPress={() =>
                        router.push({ pathname: '/product-chats', params: { lang: selectedLang } })
                      }
                      activeOpacity={0.8}
                    >
                      <Ionicons name="chatbubble-outline" size={16} color="#3B6029" />
                      <Text style={styles.chatBuyerBtnText}>{t.chatBtn}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.submitQuoteBtn}
                      onPress={() => handleOpenQuoteModal(order)}
                      activeOpacity={0.88}
                    >
                      <Text style={styles.submitQuoteBtnText}>{t.submitQuoteBtn}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Submit Quote Modal */}
        <Modal
          visible={isModalOpen}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsModalOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsModalOpen(false)}
          >
            <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t.quoteModalTitle}</Text>
                <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {selectedOrder && (
                <Text style={styles.modalOrderSub}>
                  {(selectedOrder.buyerNames[selectedLang] || selectedOrder.buyerNames.hi)} -{' '}
                  {(selectedOrder.productReqs[selectedLang] || selectedOrder.productReqs.hi)}
                </Text>
              )}

              {/* Price Offer Field */}
              <Text style={styles.fieldLabel}>{t.quotePriceLabel}</Text>
              <View style={styles.inputBox}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder={t.quotePricePlaceholder}
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={quotePrice}
                  onChangeText={setQuotePrice}
                />
                <TouchableOpacity
                  style={styles.micInputBtn}
                  onPress={() => handleSpeechToText('price')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="mic" size={18} color="#3B6029" />
                </TouchableOpacity>
              </View>

              {/* Delivery Days Field */}
              <Text style={styles.fieldLabel}>{t.quoteDaysLabel}</Text>
              <View style={styles.inputBox}>
                <Ionicons name="time-outline" size={18} color="#555" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.inputField}
                  placeholder={t.quoteDaysPlaceholder}
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={quoteDays}
                  onChangeText={setQuoteDays}
                />
                <TouchableOpacity
                  style={styles.micInputBtn}
                  onPress={() => handleSpeechToText('days')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="mic" size={18} color="#3B6029" />
                </TouchableOpacity>
              </View>

              {/* Remarks Field */}
              <Text style={styles.fieldLabel}>{t.quoteNotesLabel}</Text>
              <View style={[styles.inputBox, { height: 74, alignItems: 'flex-start', paddingTop: 8 }]}>
                <TextInput
                  style={[styles.inputField, { textAlignVertical: 'top' }]}
                  placeholder={t.quoteNotesPlaceholder}
                  placeholderTextColor="#888"
                  multiline={true}
                  value={quoteNotes}
                  onChangeText={setQuoteNotes}
                />
                <TouchableOpacity
                  style={styles.micInputBtn}
                  onPress={() => handleSpeechToText('notes')}
                  activeOpacity={0.7}
                >
                  <Ionicons name="mic" size={18} color="#3B6029" />
                </TouchableOpacity>
              </View>

              {/* Modal Submit Button */}
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleSubmitQuote}
                activeOpacity={0.88}
              >
                <Text style={styles.modalSubmitBtnText}>{t.submitOffer}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

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
                data={ALL_LANGUAGES}
                keyExtractor={(item: { code: string }) => item.code}
                renderItem={({ item }: { item: { code: LangCode; nativeName: string; englishName: string } }) => (
                  <TouchableOpacity
                    style={[
                      styles.langOptionItem,
                      selectedLang === item.code ? styles.langOptionSelected : null,
                    ]}
                    onPress={() => {
                      setSelectedLang(item.code);
                      setGlobalLang(item.code);
                      setIsLangModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.langOptionText,
                        selectedLang === item.code ? styles.langOptionTextSelected : null,
                      ]}
                    >
                      {item.nativeName} ({item.englishName})
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
  helpButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 36,
  },
  /* Top Banner Card */
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF6EE',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bannerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bannerTextGroup: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B6029',
    marginBottom: 2,
  },
  bannerSub: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 16,
  },
  /* Filter Pills */
  filterPillsRow: {
    gap: 8,
    marginBottom: 18,
  },
  filterPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E3DC',
  },
  filterPillActive: {
    backgroundColor: '#3B6029',
    borderColor: '#3B6029',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  /* Orders List */
  ordersListGroup: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EBF6EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  buyerMetaCol: {
    flex: 1,
  },
  buyerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  buyerType: {
    fontSize: 11,
    color: '#666666',
    marginTop: 2,
  },
  badgeTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  badgeTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F0EFEA',
    marginVertical: 12,
  },
  reqTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
    lineHeight: 21,
  },
  specGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  specBox: {
    flex: 1,
  },
  specLabel: {
    fontSize: 10,
    color: '#777777',
    marginBottom: 2,
  },
  specVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  specValGreen: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  cardActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chatBuyerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF6EE',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 4,
  },
  chatBuyerBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  submitQuoteBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 12,
    paddingVertical: 10,
  },
  submitQuoteBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  modalOrderSub: {
    fontSize: 12,
    color: '#3B6029',
    fontWeight: '600',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
    marginTop: 10,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAF8F5',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B6029',
    marginRight: 6,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  micInputBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EBF6EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  modalSubmitBtn: {
    height: 52,
    backgroundColor: '#3B6029',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalSubmitBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
    gap: 4,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxWidth: 320,
    padding: 20,
    alignSelf: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
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
