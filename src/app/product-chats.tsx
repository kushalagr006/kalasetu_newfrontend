import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Modal,
  Image,
  Platform,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArtisanFloatingNav } from '@/components/ArtisanFloatingNav';
import { useGlobalLang, setGlobalLang, ALL_LANGUAGES, LangCode } from '@/utils/languageStore';

type FilterType = 'all' | 'govt' | 'company' | 'individual';

interface ChatItem {
  id: string;
  buyerNames: Record<LangCode, string>;
  buyerCategories: Record<LangCode, string>;
  buyerType: 'govt' | 'company' | 'individual';
  productNames: Record<LangCode, string>;
  productPrice: string;
  lastMsgs: Record<LangCode, string>;
  timeAgos: Record<LangCode, string>;
  unreadCount: number;
  badgeBg: string;
  badgeTextColor: string;
  avatarIcon: keyof typeof Ionicons.glyphMap;
  messages: { sender: 'buyer' | 'me'; text: Record<LangCode, string>; time: string }[];
}

const PRODUCT_CHATS_DATA: ChatItem[] = [
  {
    id: '1',
    buyerNames: {
      en: 'Rajasthan Handicrafts Dept',
      hi: 'राजस्थान हस्तशिल्प विभाग',
      bn: 'রাজস্থান হস্তশিল্প বিভাগ',
      bho: 'राजस्थान हस्तशिल्प विभाग',
      mr: 'राजस्थान हस्तकला विभाग',
      gu: 'રાજસ્થાન હસ્તકળા વિભાગ',
      raj: 'राजस्थान हस्तशिल्प विभाग',
      kn: 'ರಾಜಸ್ಥಾನ ಕರಕುಶಲ ಇಲಾಖೆ',
    },
    buyerCategories: {
      en: 'Govt Dept',
      hi: 'सरकारी विभाग',
      bn: 'সরকারি বিভাগ',
      bho: 'सरकारी विभाग',
      mr: 'सरकारी विभाग',
      gu: 'સરકારી વિભાગ',
      raj: 'सरकारी विभाग',
      kn: 'ಸರ್ಕಾರಿ ಇಲಾಖೆ',
    },
    buyerType: 'govt',
    productNames: {
      en: 'Decorative Clay Pot (50 Pcs)',
      hi: 'सजावटी मिट्टी का घड़ा (50 पीस)',
      bn: 'সাজসজ্জার পোড়ামাটির পাত্র (৫০ টি)',
      bho: 'सजावटी माटी के घड़ा (50 गो)',
      mr: 'सजावटी मातीचे मडके (५० नग)',
      gu: 'શણગારાત્મક માટીનું માટલું (50 પીસ)',
      raj: 'सजावटी माटी रो घड़ो (50 नग)',
      kn: 'ಅಲಂಕಾರಿಕ ಮಣ್ಣಿನ ಮಡಕೆ (50 ತುಂಡುಗಳು)',
    },
    productPrice: '₹22,500',
    lastMsgs: {
      en: 'Official tender approval letter issued. Payment will credit in 3 days.',
      hi: 'सरकारी टेंडर स्वीकृति पत्र भेज दिया गया है। भुगतान 3 दिनों में क्रेडिट होगा।',
      bn: 'সরকারি টেন্ডার অনুমোদনের চিঠি প্রদান করা হয়েছে। ৩ দিনের মধ্যে পেমেন্ট ক্রেডিট হবে।',
      bho: 'सरकारी टेंडर मंजूरी पत्र भेज दिहल गइल बा। 3 दिन में पइसा क्रेडिट हो जाई।',
      mr: 'शासकीय निविदा मंजुरी पत्र जारी केले आहे. ३ दिवसात पैसे जमा होतील.',
      gu: 'સરકારી ટેન્ડર મંજૂરી પત્ર જારી કરવામાં આવ્યો છે. 3 દિવસમાં ચુકવણી જમા થશે.',
      raj: 'सरकारी टेंडर मंजूरी कागद भेज दियो है। 3 दिनां मांय रिपिया आवैगा।',
      kn: 'ಅಧಿಕೃತ ಟೆಂಡರ್ ಅನುಮೋದನೆ ಪತ್ರವನ್ನು ನೀಡಲಾಗಿದೆ. 3 ದಿನಗಳಲ್ಲಿ ಹಣ ಜಮಾ ಆಗುತ್ತದೆ.',
    },
    timeAgos: {
      en: '10m ago',
      hi: '10 मिनट पहले',
      bn: '১০ মিনিট আগে',
      bho: '10 मिनट पहिले',
      mr: '१० मिनिटांपूर्वी',
      gu: '10 મિનિટ પહેલાં',
      raj: '10 मिनट पैली',
      kn: '10 ನಿಮಿಷದ ಹಿಂದೆ',
    },
    unreadCount: 2,
    badgeBg: '#E8F5E9',
    badgeTextColor: '#2E7D32',
    avatarIcon: 'business',
    messages: [
      {
        sender: 'buyer',
        text: {
          en: 'Hello Sunita Ji, we received your tender proposal for 50 clay pots.',
          hi: 'नमस्ते सुनीता जी, हमें आपकी 50 मिट्टी के घड़ों का टेंडर प्रस्ताव प्राप्त हुआ है।',
          bn: 'নমস্তে সুনীতা জী, আমরা আপনার ৫০টি পোড়ামাটির পাত্রের টেন্ডার প্রস্তাব পেয়েছি।',
          bho: 'नमस्ते सुनीता जी, हमरा राउर 50 गो माटी के घड़ा के टेंडर प्रस्ताव मिल गइल बा।',
          mr: 'नमस्ते सुनिता जी, आम्हाला तुमच्या ५० मातीच्या मडक्यांचा निविदा प्रस्ताव मिळाला आहे.',
          gu: 'નમસ્તે સુનિતા જી, અમને તમારા 50 માટીના માટલાનો ટેન્ડર પ્રસ્તાવ મળ્યો છે.',
          raj: 'राम राम सुनीता जी, म्हाने आपरा 50 माटी रा घड़ां रो टेंडर प्रस्ताव मिल गयो है।',
          kn: 'ನಮಸ್ಕಾರ ಸುನೀತಾ ಜಿ, ನಿಮ್ಮ 50 ಮಣ್ಣಿನ ಮಡಕೆಗಳ ಟೆಂಡರ್ ಪ್ರಸ್ತಾಪ ನಮಗೆ ತಲುಪಿದೆ.',
        },
        time: '10:00 AM',
      },
      {
        sender: 'me',
        text: {
          en: 'Hello Sir! All pots are handcrafted and quality checked.',
          hi: 'नमस्ते सर! सभी घड़े पूरी तरह हस्तनिर्मित और गुणवत्ता जांचे हुए हैं।',
          bn: 'নমস্তে স্যার! সমস্ত পাত্র সম্পূর্ণ হাতে তৈরি এবং গুণমান পরীক্ষা করা হয়েছে।',
          bho: 'नमस्ते सर! सभ घड़ा पूरा तरह हाथ के बनल अउरी क्वालिटी जांचल बा।',
          mr: 'नमस्ते सर! सर्व मडकी पूर्णपणे हस्तनिर्मित आणि गुणवत्ता तपासलेली आहेत.',
          gu: 'નમસ્તે સર! બધા માટલાં પૂરેપૂરાં હાથથી બનાવેલાં અને ગુણવત્તા ચકાસેલાં છે.',
          raj: 'राम राम सा! सगळा घड़ा हाथ सूं बन्योड़ा अर क्वालिटी जांच्योड़ा है।',
          kn: 'ನಮಸ್ಕಾರ ಸರ್! ಎಲ್ಲಾ ಮಡಕೆಗಳು ಕೈಯಿಂದ ಮಾಡಲ್ಪಟ್ಟಿದ್ದು ಗುಣಮಟ್ಟ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.',
        },
        time: '10:12 AM',
      },
      {
        sender: 'buyer',
        text: {
          en: 'Official tender approval letter issued. Payment will credit in 3 days.',
          hi: 'सरकारी टेंडर स्वीकृति पत्र भेज दिया गया है। भुगतान 3 दिनों में क्रेडिट होगा।',
          bn: 'সরকারি টেন্ডার অনুমোদনের চিঠি প্রদান করা হয়েছে। ৩ দিনের মধ্যে পেমেন্ট ক্রেডিট হবে।',
          bho: 'सरकारी टेंडर मंजूरी पत्र भेज दिहल गइल बा। 3 दिन में पइसा क्रेडिट हो जाई।',
          mr: 'शासकीय निविदा मंजुरी पत्र जारी केले आहे. ३ दिवसात पैसे जमा होतील.',
          gu: 'સરકારી ટેન્ડર મંજૂરી પત્ર જારી કરવામાં આવ્યો છે. 3 દિવસમાં ચુકવણી જમા થશે.',
          raj: 'सरकारी टेंडर मंजूरी कागद भेज दियो है। 3 दिनां मांय रिपिया आवैगा।',
          kn: 'ಅಧಿಕೃತ ಟೆಂಡರ್ ಅನುಮೋದನೆ ಪತ್ರವನ್ನು ನೀಡಲಾಗಿದೆ. 3 ದಿನಗಳಲ್ಲಿ ಹಣ ಜಮಾ ಆಗುತ್ತದೆ.',
        },
        time: '10:30 AM',
      },
    ],
  },
  {
    id: '2',
    buyerNames: {
      en: 'Seema Traders (Jaipur)',
      hi: 'सीमा ट्रेडर्स (जयपुर)',
      bn: 'সীমা ট্রেডার্স (জয়পুর)',
      bho: 'सीमा ट्रेडर्स (जयपुर)',
      mr: 'सीमा ट्रेडर्स (जयपूर)',
      gu: 'સીમા ટ્રેડર્સ (જયપુર)',
      raj: 'सीमा ट्रेडर्स (जयपुर)',
      kn: 'ಸೀಮಾ ಟ್ರೇಡರ್ಸ್ (ಜೈಪುರ)',
    },
    buyerCategories: {
      en: 'Private Co',
      hi: 'निजी कंपनी',
      bn: 'বেসরকারি কোম্পানি',
      bho: 'प्राइवेट कंपनी',
      mr: 'खाजगी कंपनी',
      gu: 'ખાનગી કંપની',
      raj: 'प्राइवेट कंपनी',
      kn: 'ಖಾಸಗಿ ಕಂಪನಿ',
    },
    buyerType: 'company',
    productNames: {
      en: 'Handmade Embroidered Dupatta (200 Pcs)',
      hi: 'हाथ की कढ़ाई का दुपट्टा (200 पीस)',
      bn: 'হাতে সেলাই করা ওড়না (২০০ টি)',
      bho: 'हाथ के कढ़ाई वाला दुपट्टा (200 गो)',
      mr: 'हस्तनिर्मित भरतकामाचा दुपट्टा (२०० नग)',
      gu: 'હસ્તનિર્મિત ભરતકામવાળો દુપટ્ટો (200 પીસ)',
      raj: 'हाथ री कड़ाई रो दुपट्टो (200 नग)',
      kn: 'ಹಸ್ತಾಲಂಕಾರದ ಎಂಬ್ರಾಯ್ಡರಿ ದುಪಟ್ಟಾ (200 ತುಂಡುಗಳು)',
    },
    productPrice: '₹4,00,000',
    lastMsgs: {
      en: 'Hello Sunita Ji, shall we deposit 50% advance for 200 pcs order?',
      hi: 'नमस्ते सुनीता जी, क्या हम 200 पीस के लिए 50% अग्रिम भुगतान कर दें?',
      bn: 'নমস্তে সুনীতা জী, আমরা কি ২০০টি পিসের জন্য ৫০% অগ্রিম জমা দেব?',
      bho: 'नमस्ते सुनीता जी, का हमनी 200 गो खातिर 50% एडवांस दे दीं?',
      mr: 'नमस्ते सुनिता जी, आम्ही २०० नग ऑर्डर्ससाठी ५०% ॲडव्हान्स जमा करू का?',
      gu: 'નમસ્તે સુનિતા જી, શું અમે 200 પીસ માટે 50% એડવાન્સ ચુકવણી કરીએ?',
      raj: 'राम राम सुनीता जी, कां म्हे 200 नग खातर 50% एडवांस दे द्यां?',
      kn: 'ನಮಸ್ಕಾರ ಸುನೀತಾ ಜಿ, 200 ತುಂಡುಗಳ ಆದೇಶಕ್ಕಾಗಿ ನಾವು 50% ಮುಂಗಡ ನೀಡಬೇಕೇ?',
    },
    timeAgos: {
      en: '25m ago',
      hi: '25 मिनट पहले',
      bn: '২৫ মিনিট আগে',
      bho: '25 मिनट पहिले',
      mr: '२५ मिनिटांपूर्वी',
      gu: '25 મિનિટ પહેલાં',
      raj: '25 मिनट पैली',
      kn: '25 ನಿಮಿಷದ ಹಿಂದೆ',
    },
    unreadCount: 1,
    badgeBg: '#FFF3E0',
    badgeTextColor: '#E65100',
    avatarIcon: 'briefcase',
    messages: [
      {
        sender: 'buyer',
        text: {
          en: 'Hello, we really liked your handmade embroidered dupatta samples.',
          hi: 'नमस्ते, हमें आपकी हस्तनिर्मित कढ़ाई का दुपट्टा सैंपल बहुत पसंद आया।',
          bn: 'নমস্তে, আমরা আপনার হাতে সেলাই করা ওড়নার স্যাম্পল খুব পছন্দ করেছি।',
          bho: 'नमस्ते, हमरा राउर हाथ के कढ़ाई वाला दुपट्टा सैंपल बहुत पसंद आईल।',
          mr: 'नमस्ते, आम्हाला तुमचे भरतकामाचे दुपट्टा नमुने खूप आवडले.',
          gu: 'નમસ્તે, અમને તમારા ભરતકામના દુપટ્ટાના સેમ્પલ ખૂબ ગમ્યા.',
          raj: 'राम राम, म्हाने आपरा हाथ री कड़ाई रा दुपट्टा सैंपल घणा चोखा लाग्या।',
          kn: 'ನಮಸ್ಕಾರ, ನಿಮ್ಮ ಎಂಬ್ರಾಯ್ಡರಿ ದುಪಟ್ಟಾ ಮಾದರಿಗಳು ನಮಗೆ ತುಂಬಾ ಇಷ್ಟವಾದವು.',
        },
        time: '09:30 AM',
      },
      {
        sender: 'buyer',
        text: {
          en: 'Hello Sunita Ji, shall we deposit 50% advance for 200 pcs order?',
          hi: 'नमस्ते सुनीता जी, क्या हम 200 पीस के लिए 50% अग्रिम भुगतान कर दें?',
          bn: 'নমস্তে সুনীতা জী, আমরা কি ২০০টি পিসের জন্য ৫০% অগ্রিম জমা দেব?',
          bho: 'नमस्ते सुनीता जी, का हमनी 200 गो खातिर 50% एडवांस दे दीं?',
          mr: 'नमस्ते सुनिता जी, आम्ही २०० नग ऑर्डर्ससाठी ५०% ॲडव्हान्स जमा करू का?',
          gu: 'નમસ્તે સુનિતા જી, શું અમે 200 પીસ માટે 50% એડવાન્સ ચુકવણી કરીએ?',
          raj: 'राम राम सुनीता जी, कां म्हे 200 नग खातर 50% एडवांस दे द्यां?',
          kn: 'ನಮಸ್ಕಾರ ಸುನೀತಾ ಜಿ, 200 ತುಂಡುಗಳ ಆದೇಶಕ್ಕಾಗಿ ನಾವು 50% ಮುಂಗಡ ನೀಡಬೇಕೇ?',
        },
        time: '10:05 AM',
      },
    ],
  },
  {
    id: '3',
    buyerNames: {
      en: 'Ramesh Kumar',
      hi: 'रमेश कुमार',
      bn: 'রমেশ কুমার',
      bho: 'रमेश कुमार',
      mr: 'रमेश कुमार',
      gu: 'રમેશ કુમાર',
      raj: 'रमेश कुमार',
      kn: 'ರಮೇಶ್ ಕುಮಾರ್',
    },
    buyerCategories: {
      en: 'Individual Buyer',
      hi: 'ग्राहक',
      bn: 'ব্যক্তিগত ক্রেতা',
      bho: 'ग्राहक',
      mr: 'ग्राहक',
      gu: 'ગ્રાહક',
      raj: 'ग्राहक',
      kn: 'ಖರೀದಿದಾರ',
    },
    buyerType: 'individual',
    productNames: {
      en: 'Carved Bamboo Basket (2 Pcs)',
      hi: 'बांस की नक्काशीदार टोकरी (2 पीस)',
      bn: 'বাঁশের খোদাই করা ঝুড়ি (২ টি)',
      bho: 'बांस के नक्काशीदार टोकरी (2 गो)',
      mr: 'बांबूची नक्षीकाम केलेली टोपली (२ नग)',
      gu: 'વાંસની કોતરણીવાળી ટોપલી (2 પીસ)',
      raj: 'बांस री नक्काशीदार टोकरी (2 नग)',
      kn: 'ಕೆತ್ತನೆಯ ಬಿದಿರಿನ ಬುಟ್ಟಿ (2 ತುಂಡುಗಳು)',
    },
    productPrice: '₹900',
    lastMsgs: {
      en: 'How will the packaging be? Is there any risk of damage?',
      hi: 'घड़े की पैकिंग कैसी रहेगी भाई साहब? टूटने का डर तो नहीं है?',
      bn: 'প্যাকিং কেমন হবে? ভেঙে যাওয়ার ঝুঁকি নেই তো?',
      bho: 'पैकिंग कइसन रही? टूटे के डर त नइखे न?',
      mr: 'पॅकिंग कशी असेल? फुटण्याची भीती नाही ना?',
      gu: 'પેકિંગ કેવું રહેશે? તૂટી જવાનો ડર તો નથી ને?',
      raj: 'पैकिंग कैसी रहैगी? टूंटबा रो डर तो कोनी?',
      kn: 'ಪ್ಯಾಕಿಂಗ್ ಹೇಗಿರುತ್ತದೆ? ಹಾನಿಯಾಗುವ ಭಯವಿದೆಯೇ?',
    },
    timeAgos: {
      en: '1h ago',
      hi: '1 घंटा पहले',
      bn: '১ ঘন্টা আগে',
      bho: '1 घंटा पहिले',
      mr: '१ तासापूर्वी',
      gu: '1 કલાક પહેલાં',
      raj: '1 घंटा पैली',
      kn: '1 ಗಂಟೆಯ ಹಿಂದೆ',
    },
    unreadCount: 0,
    badgeBg: '#E1F5FE',
    badgeTextColor: '#0288D1',
    avatarIcon: 'person',
    messages: [
      {
        sender: 'buyer',
        text: {
          en: 'Hello, I ordered 2 bamboo baskets.',
          hi: 'नमस्ते, मैंने 2 बांस की टोकरी का ऑर्डर दिया है।',
          bn: 'নমস্তে, আমি ২টি বাঁশের ঝুড়ির অর্ডার দিয়েছি।',
          bho: 'नमस्ते, हम 2 गो बांस के टोकरी के ऑर्डर देले बानी।',
          mr: 'नमस्ते, मी २ बांबूच्या टोपल्यांची ऑर्डर दिली आहे.',
          gu: 'નમસ્તે, મેં 2 વાંસની ટોપલીનો ઓર્ડર આપ્યો છે.',
          raj: 'राम राम, म्हे 2 बांस री टोकरी रो ऑर्डर दियो है।',
          kn: 'ನಮಸ್ಕಾರ, ನಾನು 2 ಬಿದಿರಿನ ಬುಟ್ಟಿಗಳನ್ನು ಆದೇಶಿಸಿದ್ದೇನೆ.',
        },
        time: 'Yesterday',
      },
      {
        sender: 'me',
        text: {
          en: 'Thank you Ramesh Ji! Your order will be packed by this evening.',
          hi: 'धन्यवाद रमेश जी! आपका ऑर्डर आज शाम तक पैक हो जाएगा।',
          bn: 'ধন্যবাদ রমেশ জী! আপনার অর্ডার আজ সন্ধ্যার মধ্যে প্যাক হয়ে যাবে।',
          bho: 'धन्यवाद रमेश जी! राउर ऑर्डर आज सांझ तक पैक हो जाई।',
          mr: 'धन्यवाद रमेश जी! तुमची ऑर्डर आज संध्याकाळपर्यंत पॅक होईल.',
          gu: 'ધ્યાનવાદ રમેશ જી! તમારો ઓર્ડર આજે સાંજે પેક થઈ જશે.',
          raj: 'धण्यावाद रमेश जी! आपरो ऑर्डर आज सांझ तांई पैक हो जावैगो।',
          kn: 'ಧನ್ಯವಾದಗಳು ರಮೇಶ್ ಜಿ! ನಿಮ್ಮ ಆದೇಶವು ಇಂದು ಸಂಜೆಯ ವೇಳೆಗೆ ಪ್ಯಾಕ್ ಆಗುತ್ತದೆ.',
        },
        time: 'Yesterday',
      },
      {
        sender: 'buyer',
        text: {
          en: 'How will the packaging be? Is there any risk of damage?',
          hi: 'घड़े की पैकिंग कैसी रहेगी भाई साहब? टूटने का डर तो नहीं है?',
          bn: 'প্যাকিং কেমন হবে? ভেঙে যাওয়ার ঝুঁকি নেই তো?',
          bho: 'पैकिंग कइसन रही? टूटे के डर त नइखे न?',
          mr: 'पॅकिंग कशी असेल? फुटण्याची भीती नाही ना?',
          gu: 'પેકિંગ કેવું રહેશે? તૂટી જવાનો ડર તો નથી ને?',
          raj: 'पैकिंग कैसी रहैगी? टूंटबा रो डर तो कोनी?',
          kn: 'ಪ್ಯಾಕಿಂಗ್ ಹೇಗಿರುತ್ತದೆ? ಹಾನಿಯಾಗುವ ಭಯವಿದೆಯೇ?',
        },
        time: '09:15 AM',
      },
    ],
  },
];

const TRANSLATIONS: Record<LangCode, {
  headerTitle: string;
  headerSubtitle: string;
  searchPlaceholder: string;
  filterAll: string;
  filterGovt: string;
  filterCompany: string;
  filterIndividual: string;
  productLabel: string;
  typeMessagePlaceholder: string;
  sendBtn: string;
  closeBtn: string;
  modalTitle: string;
  openChat: string;
  noChats: string;
}> = {
  hi: {
    headerTitle: 'उत्पाद एवं खरीदार चैट',
    headerSubtitle: 'आपके उत्पादों के लिए चल रही सभी ग्राहक, कंपनी एवं सरकारी टेंडर की बातचीत',
    searchPlaceholder: 'खरीदार या उत्पाद का नाम खोजें...',
    filterAll: 'सभी',
    filterGovt: 'सरकारी',
    filterCompany: 'कंपनी',
    filterIndividual: 'ग्राहक',
    productLabel: 'उत्पाद: ',
    typeMessagePlaceholder: 'संदेश लिखें...',
    sendBtn: 'भेजें',
    closeBtn: 'बंद करें',
    modalTitle: 'भाषा चुनें / Select Language',
    openChat: 'चैट खोलें',
    noChats: 'कोई चैट नहीं मिली',
  },
  en: {
    headerTitle: 'Product & Buyer Chats',
    headerSubtitle: 'All active customer, company & govt tender chats for your products',
    searchPlaceholder: 'Search buyer or product name...',
    filterAll: 'All',
    filterGovt: 'Govt',
    filterCompany: 'Company',
    filterIndividual: 'Individual',
    productLabel: 'Product: ',
    typeMessagePlaceholder: 'Type a message...',
    sendBtn: 'Send',
    closeBtn: 'Close',
    modalTitle: 'Select Language / भाषा चुनें',
    openChat: 'Open Chat',
    noChats: 'No chats found',
  },
  bn: {
    headerTitle: 'পণ্য এবং ক্রেতা চ্যাট',
    headerSubtitle: 'আপনার পণ্যের জন্য সমস্ত সক্রিয় গ্রাহক, কোম্পানি এবং সরকারি টেন্ডার চ্যাট',
    searchPlaceholder: 'ক্রেতা বা পণ্যের নাম খুঁজুন...',
    filterAll: 'সব',
    filterGovt: 'সরকারি',
    filterCompany: 'কোম্পানি',
    filterIndividual: 'ব্যক্তিগত',
    productLabel: 'পণ্য: ',
    typeMessagePlaceholder: 'একটি বার্তা টাইপ করুন...',
    sendBtn: 'পাঠান',
    closeBtn: 'বন্ধ করুন',
    modalTitle: 'ভাষা নির্বাচন করুন / Select Language',
    openChat: 'চ্যাট খুলুন',
    noChats: 'কোন চ্যাট পাওয়া যায়নি',
  },
  bho: {
    headerTitle: 'सामान अउरी खरीदार चैट',
    headerSubtitle: 'रउआ सामान खातिर चलत सभ ग्राहक, कंपनी अउरी सरकारी टेंडर बातचीत',
    searchPlaceholder: 'खरीदार चाहे सामान के नाम खोजीं...',
    filterAll: 'सब',
    filterGovt: 'सरकारी',
    filterCompany: 'कंपनी',
    filterIndividual: 'ग्राहक',
    productLabel: 'सामान: ',
    typeMessagePlaceholder: 'संदेश लिखीं...',
    sendBtn: 'भेजीं',
    closeBtn: 'बंद करीं',
    modalTitle: 'भाषा चुनीं / Select Language',
    openChat: 'चैट खोलीं',
    noChats: 'कौनौ चैट ना मिलल',
  },
  mr: {
    headerTitle: 'उत्पादने व ग्राहक चॅट',
    headerSubtitle: 'तुमच्या उत्पादनांसाठीचे सर्व सक्रिय ग्राहक, कंपनी आणि सरकारी निविदा संवाद',
    searchPlaceholder: 'ग्राहक किंवा उत्पादनाचे नाव शोधा...',
    filterAll: 'सर्व',
    filterGovt: 'सरकारी',
    filterCompany: 'कंपनी',
    filterIndividual: 'वैयक्तिक',
    productLabel: 'उत्पादन: ',
    typeMessagePlaceholder: 'संदेश लिहा...',
    sendBtn: 'पाठवा',
    closeBtn: 'बंद करा',
    modalTitle: 'भाषा निवडा / Select Language',
    openChat: 'चॅट उघडा',
    noChats: 'कोणतीही चॅट सापडली नाही',
  },
  gu: {
    headerTitle: 'ઉત્પાદન અને ખરીદદાર ચેટ',
    headerSubtitle: 'તમારા ઉત્પાદનો માટેના તમામ સક્રિય ગ્રાહક, કંપની અને સરકારી ટેન્ડર સંવાદો',
    searchPlaceholder: 'ખરીદદાર અથવા ઉત્પાદનનું નામ શોધો...',
    filterAll: 'બધા',
    filterGovt: 'સરકારી',
    filterCompany: 'કંપની',
    filterIndividual: 'વ્યક્તિગત',
    productLabel: 'ઉત્પાદન: ',
    typeMessagePlaceholder: 'સંદેશ લખો...',
    sendBtn: 'મોકલો',
    closeBtn: 'બંધ કરો',
    modalTitle: 'ભાષા પસંદ કરો / Select Language',
    openChat: 'ચેટ ખોલો',
    noChats: 'કોઈ ચેટ મળી નથી',
  },
  raj: {
    headerTitle: 'सामान अर खरीदार चैट',
    headerSubtitle: 'अापका सामानां खातर चालबा आळी सगळी ग्राहक, कंपनी अर सरकारी टेंडर बातचित',
    searchPlaceholder: 'खरीदार या सामान रो नाम ढूंढो...',
    filterAll: 'सगळा',
    filterGovt: 'सरकारी',
    filterCompany: 'कंपनी',
    filterIndividual: 'ग्राहक',
    productLabel: 'सामान: ',
    typeMessagePlaceholder: 'संदेश लिखो...',
    sendBtn: 'भेजो',
    closeBtn: 'बंद करो',
    modalTitle: 'भाषा चूणो / Select Language',
    openChat: 'चैट खोलो',
    noChats: 'कोई चैट कोनी मिली',
  },
  kn: {
    headerTitle: 'ಉತ್ಪನ್ನ ಮತ್ತು ಖರೀದಿದಾರರ ಚಾಟ್‌ಗಳು',
    headerSubtitle: 'ನಿಮ್ಮ ಉತ್ಪನ್ನಗಳಿಗಾಗಿ ಎಲ್ಲಾ ಸಕ್ರಿಯ ಗ್ರಾಹಕ, ಕಂಪನಿ ಮತ್ತು ಸರ್ಕಾರಿ ಟೆಂಡರ್ ಚಾಟ್‌ಗಳು',
    searchPlaceholder: 'ಖರೀದಿದಾರ ಅಥವಾ ಉತ್ಪನ್ನದ ಹೆಸರನ್ನು ಹುಡುಕಿ...',
    filterAll: 'ಎಲ್ಲಾ',
    filterGovt: 'ಸರ್ಕಾರಿ',
    filterCompany: 'ಕಂಪನಿ',
    filterIndividual: 'ವ್ಯಕ್ತಿಗತ',
    productLabel: 'ಉತ್ಪನ್ನ: ',
    typeMessagePlaceholder: 'ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...',
    sendBtn: 'ಕಳುಹಿಸಿ',
    closeBtn: 'ಮುಚ್ಚಿ',
    modalTitle: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / Select Language',
    openChat: 'ಚಾಟ್ ತೆರೆಯಿರಿ',
    noChats: 'ಯಾವುದೇ ಚಾಟ್ ಕಂಡುಬಂದಿಲ್ಲ',
  },
};

export default function ProductChatsScreen() {
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

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [chatList, setChatList] = useState<ChatItem[]>(PRODUCT_CHATS_DATA);

  const filteredChats = chatList.filter((chat) => {
    const matchesFilter = activeFilter === 'all' || chat.buyerType === activeFilter;
    const bName = chat.buyerNames[selectedLang] || chat.buyerNames.hi || chat.buyerNames.en;
    const pName = chat.productNames[selectedLang] || chat.productNames.hi || chat.productNames.en;
    const nameMatch =
      bName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && nameMatch;
  });

  const handleSendMessage = () => {
    if (!replyText.trim() || !selectedChat) return;

    const newMsg = {
      sender: 'me' as const,
      text: {
        en: replyText,
        hi: replyText,
        bn: replyText,
        bho: replyText,
        mr: replyText,
        gu: replyText,
        raj: replyText,
        kn: replyText,
      },
      time: 'Just now',
    };

    const updatedChats = chatList.map((c) => {
      if (c.id === selectedChat.id) {
        return {
          ...c,
          lastMsgs: { ...c.lastMsgs, [selectedLang]: replyText },
          timeAgos: { ...c.timeAgos, [selectedLang]: 'Just now' },
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    setChatList(updatedChats);
    setSelectedChat({
      ...selectedChat,
      messages: [...selectedChat.messages, newMsg],
    });
    setReplyText('');
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Top Header Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.headerTitle}>{t.headerTitle}</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {t.headerSubtitle}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.langSelector}
            onPress={() => setIsLangModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.langText}>{currentLangLabel}</Text>
            <Ionicons name="chevron-down" size={14} color="#2C2C2C" />
          </TouchableOpacity>
        </View>

        {/* Search Input Bar */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={20} color="#777777" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.searchPlaceholder}
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#999999" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'all' && styles.filterPillActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
                {t.filterAll}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'govt' && styles.filterPillActive]}
              onPress={() => setActiveFilter('govt')}
            >
              <Text style={[styles.filterText, activeFilter === 'govt' && styles.filterTextActive]}>
                {t.filterGovt}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'company' && styles.filterPillActive]}
              onPress={() => setActiveFilter('company')}
            >
              <Text style={[styles.filterText, activeFilter === 'company' && styles.filterTextActive]}>
                {t.filterCompany}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterPill, activeFilter === 'individual' && styles.filterPillActive]}
              onPress={() => setActiveFilter('individual')}
            >
              <Text style={[styles.filterText, activeFilter === 'individual' && styles.filterTextActive]}>
                {t.filterIndividual}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Chat Cards List */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {filteredChats.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={48} color="#CCCCCC" />
              <Text style={styles.emptyText}>{t.noChats}</Text>
            </View>
          ) : (
            filteredChats.map((item) => {
              const buyerName = item.buyerNames[selectedLang] || item.buyerNames.hi || item.buyerNames.en;
              const categoryText = item.buyerCategories[selectedLang] || item.buyerCategories.hi || item.buyerCategories.en;
              const productName = item.productNames[selectedLang] || item.productNames.hi || item.productNames.en;
              const lastMsg = item.lastMsgs[selectedLang] || item.lastMsgs.hi || item.lastMsgs.en;
              const timeAgo = item.timeAgos[selectedLang] || item.timeAgos.hi || item.timeAgos.en;

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.chatCard}
                  onPress={() => setSelectedChat(item)}
                  activeOpacity={0.88}
                >
                  <View style={styles.cardTopRow}>
                    <View style={styles.avatarCircle}>
                      <Ionicons name={item.avatarIcon} size={22} color="#3B6029" />
                    </View>

                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <View style={styles.buyerHeader}>
                        <Text style={styles.buyerName} numberOfLines={1}>
                          {buyerName}
                        </Text>
                        <Text style={styles.timeText}>{timeAgo}</Text>
                      </View>

                      {/* Category Badge */}
                      <View style={[styles.categoryBadge, { backgroundColor: item.badgeBg }]}>
                        <Text style={[styles.categoryBadgeText, { color: item.badgeTextColor }]}>
                          {categoryText}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Attached Product Box */}
                  <View style={styles.productAttachBox}>
                    <Ionicons name="cube-outline" size={16} color="#3B6029" style={{ marginRight: 6 }} />
                    <Text style={styles.productAttachTitle} numberOfLines={1}>
                      {t.productLabel}{productName}
                    </Text>
                    <Text style={styles.productPriceBadge}>{item.productPrice}</Text>
                  </View>

                  {/* Last Message Snippet */}
                  <Text style={styles.lastMsgText} numberOfLines={2}>
                    "{lastMsg}"
                  </Text>

                  <View style={styles.cardFooterRow}>
                    <View style={styles.chatActionLabel}>
                      <Ionicons name="chatbubble-ellipses" size={14} color="#3B6029" style={{ marginRight: 4 }} />
                      <Text style={styles.chatActionText}>{t.openChat}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#999999" />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        {/* Floating Bottom Nav */}
        <ArtisanFloatingNav activeTab="chat" selectedLang={selectedLang as any} />

        {/* Chat Detail Modal */}
        {selectedChat && (
          <Modal
            visible={!!selectedChat}
            animationType="slide"
            onRequestClose={() => setSelectedChat(null)}
          >
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedChat(null)} style={{ padding: 4 }}>
                  <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.modalBuyerTitle}>
                    {selectedChat.buyerNames[selectedLang] || selectedChat.buyerNames.hi || selectedChat.buyerNames.en}
                  </Text>
                  <Text style={styles.modalCategorySub}>
                    {selectedChat.buyerCategories[selectedLang] || selectedChat.buyerCategories.hi || selectedChat.buyerCategories.en}
                  </Text>
                </View>
              </View>

              {/* Attached Product Header Banner */}
              <View style={styles.modalProductBanner}>
                <Ionicons name="cube" size={20} color="#3B6029" style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalProductName}>
                    {selectedChat.productNames[selectedLang] || selectedChat.productNames.hi || selectedChat.productNames.en}
                  </Text>
                  <Text style={styles.modalProductPrice}>{selectedChat.productPrice}</Text>
                </View>
              </View>

              {/* Messages Scroll Area */}
              <ScrollView style={styles.messagesContainer} contentContainerStyle={{ paddingVertical: 12 }}>
                {selectedChat.messages.map((msg, index) => (
                  <View
                    key={index}
                    style={[
                      styles.msgBubble,
                      msg.sender === 'me' ? styles.msgBubbleMe : styles.msgBubbleBuyer,
                    ]}
                  >
                    <Text
                      style={[
                        styles.msgText,
                        msg.sender === 'me' ? styles.msgTextMe : styles.msgTextBuyer,
                      ]}
                    >
                      {msg.text[selectedLang] || msg.text.hi || msg.text.en}
                    </Text>
                    <Text
                      style={[
                        styles.msgTime,
                        msg.sender === 'me' ? styles.msgTimeMe : styles.msgTimeBuyer,
                      ]}
                    >
                      {msg.time}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              {/* Message Input Box */}
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.chatTextInput}
                  placeholder={t.typeMessagePlaceholder}
                  placeholderTextColor="#999999"
                  value={replyText}
                  onChangeText={setReplyText}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendMessage}
                  activeOpacity={0.85}
                >
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Modal>
        )}

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
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFECE6',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  filterRow: {
    marginBottom: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#EFEFEA',
  },
  filterPillActive: {
    backgroundColor: '#3B6029',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#888888',
    marginTop: 12,
  },
  chatCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFECE6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buyerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 6,
  },
  timeText: {
    fontSize: 11,
    color: '#888888',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 3,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  productAttachBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7F4',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  productAttachTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
    flex: 1,
  },
  productPriceBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B6029',
    marginLeft: 6,
  },
  lastMsgText: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0EFEA',
    paddingTop: 8,
  },
  chatActionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFECE6',
  },
  modalBuyerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  modalCategorySub: {
    fontSize: 12,
    color: '#3B6029',
    fontWeight: '600',
  },
  modalProductBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2E8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DBE8D7',
  },
  modalProductName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  modalProductPrice: {
    fontSize: 12,
    color: '#3B6029',
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  msgBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 4,
  },
  msgBubbleBuyer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFECE6',
  },
  msgBubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B6029',
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  msgTextBuyer: {
    color: '#1A1A1A',
  },
  msgTextMe: {
    color: '#FFFFFF',
  },
  msgTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  msgTimeBuyer: {
    color: '#888888',
  },
  msgTimeMe: {
    color: '#D2E7C9',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFECE6',
  },
  chatTextInput: {
    flex: 1,
    height: 42,
    backgroundColor: '#F5F4F0',
    borderRadius: 21,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1A1A1A',
    marginRight: 8,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#3B6029',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginLeft: 8,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2C2C',
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
