import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGlobalLang, LangCode } from '@/utils/languageStore';
import TopLangSelector from '@/components/TopLangSelector';
import {
  startLiveSpeechRecognition,
  LiveSpeechSession,
} from '@/services/bhashiniService';

const TRANSLATIONS: Record<LangCode, {
  title: string;
  subtitle: string;
  stateLabel: string;
  statePlaceholder: string;
  districtLabel: string;
  districtPlaceholder: string;
  cityLabel: string;
  cityPlaceholder: string;
  categoryLabel: string;
  categories: { key: string; label: string }[];
  workLabel: string;
  workPlaceholder: string;
  nextBtn: string;
  errState: string;
  errDistrict: string;
  errCity: string;
  errWork: string;
  listeningLive: string;
  stopBtn: string;
  regSuccess: string;
}> = {
  en: {
    title: 'Location & Work Details',
    subtitle: 'Please enter your location, category, and craft details.',
    stateLabel: 'State',
    statePlaceholder: 'Enter your State (e.g. Rajasthan, Odisha)',
    districtLabel: 'District',
    districtPlaceholder: 'Enter your District',
    cityLabel: 'Village or City',
    cityPlaceholder: 'Enter your Village or City name',
    categoryLabel: 'Select Category',
    categories: [
      { key: 'sc', label: 'Scheduled Caste (SC)' },
      { key: 'st', label: 'Scheduled Tribe (ST)' },
      { key: 'pwd', label: 'PWD (Specially Abled)' },
      { key: 'shg', label: 'Women SHG Group' },
      { key: 'tribal', label: 'Tribals' },
    ],
    workLabel: 'What type of work/craft do you do?',
    workPlaceholder: 'e.g. Clay Pottery, Handloom Weaving, Wood Carving',
    nextBtn: 'Complete Registration →',
    errState: 'Please enter your State.',
    errDistrict: 'Please enter your District.',
    errCity: 'Please enter your Village or City.',
    errWork: 'Please specify the type of work or craft you do.',
    listeningLive: '🎙️ Listening in real-time... Speak now (Live AI typing)',
    stopBtn: 'Stop',
    regSuccess: '🎉 Registration Successful! Welcome to KalaSetu.',
  },
  hi: {
    title: 'स्थान एवं शिल्प का विवरण',
    subtitle: 'कृपया अपना राज्य, जिला, स्थान, वर्ग और काम का विवरण भरें।',
    stateLabel: 'राज्य (State)',
    statePlaceholder: 'अपना राज्य लिखें (जैसे राजस्थान, ओडिसा)',
    districtLabel: 'जिला (District)',
    districtPlaceholder: 'अपना जिला लिखें',
    cityLabel: 'गांव या शहर (Village or City)',
    cityPlaceholder: 'अपने गांव या शहर का नाम लिखें',
    categoryLabel: 'श्रेणी / सामाजिक वर्ग चुनें',
    categories: [
      { key: 'sc', label: 'अनुसूचित जाति (SC)' },
      { key: 'st', label: 'अनुसूचित जनजाति (ST)' },
      { key: 'pwd', label: 'दिव्यांगजन (PWD)' },
      { key: 'shg', label: 'महिला स्व-सहायता समूह (SHG)' },
      { key: 'tribal', label: 'जनजातीय समुदाय (Tribals)' },
    ],
    workLabel: 'आप किस प्रकार का काम/शिल्प करते हैं?',
    workPlaceholder: 'जैसे मिट्टी के बर्तन (Pottery), हथकरघा (Handloom), लकड़ी की नक्काशी',
    nextBtn: 'पंजीकरण पूरा करें →',
    errState: 'कृपया अपना राज्य दर्ज करें।',
    errDistrict: 'कृपया अपना जिला दर्ज करें।',
    errCity: 'कृपया अपना गांव या शहर दर्ज करें।',
    errWork: 'कृपया अपने काम/शिल्प का प्रकार दर्ज करें।',
    listeningLive: '🎙️ लाइव सुन रहे हैं... बोलिए (बोलते ही लाइव टाइप होगा)',
    stopBtn: 'रोकें',
    regSuccess: '🎉 पंजीकरण सफल! कलासेतु में आपका स्वागत है।',
  },
  bn: {
    title: 'স্থান ও কারুশিল্পের বিবরণ',
    subtitle: 'অনুগ্রহ করে আপনার রাজ্য, জেলা, স্থান, বিভাগ এবং কাজের বিবরণ দিন।',
    stateLabel: 'রাজ্য (State)',
    statePlaceholder: 'আপনার রাজ্য লিখুন (যেমন পশ্চিমবঙ্গ, রাজস্থান)',
    districtLabel: 'জেলা (District)',
    districtPlaceholder: 'আপনার জেলা লিখুন',
    cityLabel: 'গ্রাম বা শহর (Village or City)',
    cityPlaceholder: 'আপনার গ্রাম বা শহরের নাম লিখুন',
    categoryLabel: 'বিভাগ নির্বাচন করুন',
    categories: [
      { key: 'sc', label: 'তফসিলি জাতি (SC)' },
      { key: 'st', label: 'তফসিলি উপজাতি (ST)' },
      { key: 'pwd', label: 'বিশেষ চাহিদা সম্পন্ন (PWD)' },
      { key: 'shg', label: 'মহিলা স্বনির্ভর দল (SHG)' },
      { key: 'tribal', label: 'আদিবাসী সম্প্রদায় (Tribals)' },
    ],
    workLabel: 'আপনি কী ধরণের কাজ বা শিল্প করেন?',
    workPlaceholder: 'যেমন মাটির পাত্র, তাঁতের বয়ন, কাঠের খোদাই',
    nextBtn: 'রেজিস্ট্রেশন সম্পন্ন করুন →',
    errState: 'অনুগ্রহ করে রাজ্য লিখুন।',
    errDistrict: 'অনুগ্রহ করে জেলা লিখুন।',
    errCity: 'অনুগ্রহ করে গ্রাম বা শহর লিখুন।',
    errWork: 'অনুগ্রহ করে কাজের প্রকার লিখুন।',
    listeningLive: '🎙️ লাইভ শুনছি... বলুন (বলার সাথে সাথে টাইপ হবে)',
    stopBtn: 'থামুন',
    regSuccess: '🎉 রেজিস্ট্রেশন সফল হয়েছে! কলাসেতুতে স্বাগতম।',
  },
  bho: {
    title: 'स्थान आ कला के विवरण',
    subtitle: 'कृपया आपन राज्य, जिला, गांव/शहर, वर्ग आ काम के विवरण भरीं।',
    stateLabel: 'राज्य (State)',
    statePlaceholder: 'आपन राज्य लिखीं (जैसे बिहार, राजस्थान)',
    districtLabel: 'जिला (District)',
    districtPlaceholder: 'आपन जिला लिखीं',
    cityLabel: 'गांव भा शहर (Village or City)',
    cityPlaceholder: 'आपन गांव या शहर के नाम लिखीं',
    categoryLabel: 'वर्ग चुनीं',
    categories: [
      { key: 'sc', label: 'अनुसूचित जाति (SC)' },
      { key: 'st', label: 'अनुसूचित जनजाति (ST)' },
      { key: 'pwd', label: 'दिव्यांगजन (PWD)' },
      { key: 'shg', label: 'महिला स्वयं सहायता समूह (SHG)' },
      { key: 'tribal', label: 'जनजातीय समुदाय (Tribals)' },
    ],
    workLabel: 'रउआ कवन काम भा कलाकारी करींला?',
    workPlaceholder: 'जैसे माटी के बर्तन, करघा बुनाई, काठ के नक्काशी',
    nextBtn: 'पंजीकरण पूरा करीं →',
    errState: 'कृपया आपन राज्य दर्ज करीं।',
    errDistrict: 'कृपया आपन जिला दर्ज करीं।',
    errCity: 'कृपया आपन गांव या शहर लिखीं।',
    errWork: 'कृपया आपन काम के प्रकार लिखीं।',
    listeningLive: '🎙️ लाइव सुनत बानी... बोलीं (बोलते ही टाइप होई)',
    stopBtn: 'रोकीं',
    regSuccess: '🎉 पंजीकरण सफल भइल! कलासेतु में रउआ स्वागत बा।',
  },
  mr: {
    title: 'स्थान आणि हस्तकलेचा तपशील',
    subtitle: 'कृपया आपले राज्य, जिल्हा, गाव/शहर, वर्ग आणि कामाचा तपशील भरा.',
    stateLabel: 'राज्य (State)',
    statePlaceholder: 'आपले राज्य प्रविष्ट करा (उदा. महाराष्ट्र, राजस्थान)',
    districtLabel: 'जिल्हा (District)',
    districtPlaceholder: 'आपला जिल्हा प्रविष्ट करा',
    cityLabel: 'गाव किंवा शहर (Village or City)',
    cityPlaceholder: 'आपल्या गावाचे किंवा शहराचे नाव टाका',
    categoryLabel: 'वर्ग निवडा',
    categories: [
      { key: 'sc', label: 'अनुसूचित जाती (SC)' },
      { key: 'st', label: 'अनुसूचित जमाती (ST)' },
      { key: 'pwd', label: 'दिव्यांगजन (PWD)' },
      { key: 'shg', label: 'महिला बचत गट (SHG)' },
      { key: 'tribal', label: 'आदिवासी समुदाय (Tribals)' },
    ],
    workLabel: 'तुम्ही कोणत्या प्रकारचे काम/शिल्प करता?',
    workPlaceholder: 'उदा. मातीची भांडी, हातमाग विणकाम, लाकडी कोरीव काम',
    nextBtn: 'नोंदणी पूर्ण करा →',
    errState: 'कृपया आपले राज्य प्रविष्ट करा.',
    errDistrict: 'कृपया आपला जिल्हा प्रविष्ट करा.',
    errCity: 'कृपया आपले गाव किंवा शहर प्रविष्ट करा.',
    errWork: 'कृपया आपल्या कामाचा प्रकार प्रविष्ट करा.',
    listeningLive: '🎙️ थेट ऐकत आहे... बोला (बोलताच थेट टाईप होईल)',
    stopBtn: 'थांबवा',
    regSuccess: '🎉 नोंदणी यशस्वी झाली! कलासेतूमध्ये आपले स्वागत आहे.',
  },
  gu: {
    title: 'સ્થાન અને કળાની વિગત',
    subtitle: 'કૃપા કરીને તમારું રાજ્ય, જિલ્લો, ગામ/શહેર, વર્ગ અને કામની વિગત ભરો.',
    stateLabel: 'રાજ્ય (State)',
    statePlaceholder: 'તમારું રાજ્ય લખો (દા.ત. ગુજરાત, રાજસ્થાન)',
    districtLabel: 'જિલ્લો (District)',
    districtPlaceholder: 'તમારો જિલ્લો લખો',
    cityLabel: 'ગામ અથવા શહેર (Village or City)',
    cityPlaceholder: 'તમારા ગામ કે શહેરનું નામ લખો',
    categoryLabel: 'વર્ગ પસંદ કરો',
    categories: [
      { key: 'sc', label: 'અનુસૂચિત જાતિ (SC)' },
      { key: 'st', label: 'અનુસૂચિત જનજાતિ (ST)' },
      { key: 'pwd', label: 'દિવ્યાંગજન (PWD)' },
      { key: 'shg', label: 'મહિલા સ્વ-સહાય જૂથ (SHG)' },
      { key: 'tribal', label: 'આદિવાસી સમુદાય (Tribals)' },
    ],
    workLabel: 'તમે કયા પ્રકારનું કામ/કળા કરો છો?',
    workPlaceholder: 'દા.ત. માટીકામ, હાથવણાટ, લાકડાનું કોતરકામ',
    nextBtn: 'નોંધણી પૂર્ણ કરો →',
    errState: 'કૃપા કરીને તમારું રાજ્ય દાખલ કરો.',
    errDistrict: 'કૃપા કરીને તમારો જિલ્લો દાખલ કરો.',
    errCity: 'કૃપા કરીને તમારું ગામ કે શહેર દાખલ કરો.',
    errWork: 'કૃપા કરીને તમારા કામનો પ્રકાર દાખલ કરો.',
    listeningLive: '🎙️ લાઈવ સાંભળી રહ્યા છીએ... બોલો (બોલતા જ ટાઇપ થશે)',
    stopBtn: 'રોકો',
    regSuccess: '🎉 નોંધણી સફળ! કલાસેતુમાં આપનું સ્વાગત છે.',
  },
  raj: {
    title: 'ठिकाणो अर काम रो ब्योरो',
    subtitle: 'आपरो राज्य, जिलो, गाँव/शहर, जात-वर्ग अर कलाकारी रो ब्योरो भरो।',
    stateLabel: 'राज्य (State)',
    statePlaceholder: 'आपरो राज्य लिखो (जियां राजस्थान, गुजरात)',
    districtLabel: 'जिलो (District)',
    districtPlaceholder: 'आपरो जिलो लिखो',
    cityLabel: 'गाँव या शहर (Village or City)',
    cityPlaceholder: 'आपरे गाँव या शहर रो नाम लिखो',
    categoryLabel: 'वर्ग चुणो',
    categories: [
      { key: 'sc', label: 'अनुसूचित जाति (SC)' },
      { key: 'st', label: 'अनुसूचित जनजाति (ST)' },
      { key: 'pwd', label: 'दिव्यांगजन (PWD)' },
      { key: 'shg', label: 'महिला बचत समूह (SHG)' },
      { key: 'tribal', label: 'जनजातीय समाज (Tribals)' },
    ],
    workLabel: 'थे किस्यो काम या कलाकारी करो हो?',
    workPlaceholder: 'जियां माटी रा भांडा, हथकरघा बुनाई, काठ रो काम',
    nextBtn: 'पंजीकरण पूरो करो →',
    errState: 'कृपया आपरो राज्य भरो।',
    errDistrict: 'कृपया आपरो जिलो भरो।',
    errCity: 'कृपया आपरो गाँव या शहर लिखो।',
    errWork: 'कृपया आपरे काम री जात लिखो।',
    listeningLive: '🎙️ लाइव सुण रह्या हां... बोलो (बोलता ही छपसी)',
    stopBtn: 'रोको',
    regSuccess: '🎉 पंजीकरण पूरा हो गयो! कलासेतु में आपरो स्वागत है।',
  },
  kn: {
    title: 'ಸ್ಥಳ ಮತ್ತು ಕರಕುಶಲ ವಿವರಗಳು',
    subtitle: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ರಾಜ್ಯ, ಜಿಲ್ಲೆ, ಊರು, ವರ್ಗ ಮತ್ತು ಕೆಲಸದ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.',
    stateLabel: 'ರಾಜ್ಯ (State)',
    statePlaceholder: 'ನಿಮ್ಮ ರಾಜ್ಯ ನಮೂದಿಸಿ (ಉದಾ. ಕರ್ನಾಟಕ, ರಾಜಸ್ಥಾನ)',
    districtLabel: 'ಜಿಲ್ಲೆ (District)',
    districtPlaceholder: 'ನಿಮ್ಮ ಜಿಲ್ಲೆ ನಮೂದಿಸಿ',
    cityLabel: 'ಗ್ರಾಮ ಅಥವಾ ನಗರ (Village or City)',
    cityPlaceholder: 'ನಿಮ್ಮ ಗ್ರಾಮ ಅಥವಾ ನಗರದ ಹೆಸರು',
    categoryLabel: 'ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    categories: [
      { key: 'sc', label: 'ಪರಿಶಿಷ್ಟ ಜಾತಿ (SC)' },
      { key: 'st', label: 'ಪರಿಶಿಷ್ಟ ಪಂಗಡ (ST)' },
      { key: 'pwd', label: 'ವಿಶೇಷ ಚೇತನರು (PWD)' },
      { key: 'shg', label: 'ಮಹಿಳಾ ಸ್ವಸಹಾಯ ಗುಂಪು (SHG)' },
      { key: 'tribal', label: 'ಬುಡಕಟ್ಟು ಸಮುದಾಯ (Tribals)' },
    ],
    workLabel: 'ನೀವು ಯಾವ ರೀತಿಯ ಕೆಲಸ/ಕರಕುಶಲತೆಯನ್ನು ಮಾಡುತ್ತೀರಿ?',
    workPlaceholder: 'ಉದಾ. ಮಣ್ಣಿನ ಮಡಕೆಗಳು, ಕೈಮಗ್ಗ ನೇಯ್ಗೆ, ಮರದ ಕೆತ್ತನೆ',
    nextBtn: 'ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ →',
    errState: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ರಾಜ್ಯವನ್ನು ನಮೂದಿಸಿ.',
    errDistrict: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಜಿಲ್ಲೆಯನ್ನು ನಮೂದಿಸಿ.',
    errCity: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಗ್ರಾಮ ಅಥವಾ ನಗರವನ್ನು ನಮೂದಿಸಿ.',
    errWork: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಕೆಲಸದ ಪ್ರಕಾರವನ್ನು ನಮೂದಿಸಿ.',
    listeningLive: '🎙️ ಲೈವ್ ಆಗಿ ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ (ಲೈವ್ ಟೈಪ್ ಆಗುತ್ತದೆ)',
    stopBtn: 'ನಿಲ್ಲಿಸಿ',
    regSuccess: '🎉 ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ! ಕಲಾಸೇತುಗೆ ಸುಸ್ವಾಗತ.',
  },
};

export default function AppRegisterPersonalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    lang?: string;
    fullName?: string;
    phone?: string;
    aadhaar?: string;
    pan?: string;
    gst?: string;
  }>();
  const [globalLang] = useGlobalLang();

  const selectedLang: LangCode =
    (params.lang as LangCode) || globalLang || 'hi';
  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.hi;

  const [stateName, setStateName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [cityName, setCityName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('sc');
  const [workType, setWorkType] = useState('');

  // Live Speech Recognition Session State
  const [activeMicField, setActiveMicField] = useState<string | null>(null);
  const [liveRawSpeech, setLiveRawSpeech] = useState<string>('');
  const currentSessionRef = useRef<LiveSpeechSession | null>(null);

  // Stop session on unmount
  useEffect(() => {
    return () => {
      currentSessionRef.current?.stop();
    };
  }, []);

  const handleMicPress = (field: string) => {
    // If clicking the active mic, toggle off
    if (activeMicField === field) {
      currentSessionRef.current?.stop();
      currentSessionRef.current = null;
      setActiveMicField(null);
      setLiveRawSpeech('');
      return;
    }

    // Stop any existing session
    if (currentSessionRef.current) {
      currentSessionRef.current.stop();
      currentSessionRef.current = null;
    }

    setActiveMicField(field);
    setLiveRawSpeech('');

    // Start streaming recognition
    const session = startLiveSpeechRecognition({
      fieldType: field,
      lang: selectedLang,
      onLiveText: (analyzedText, raw) => {
        setLiveRawSpeech(raw);
        if (field === 'state') {
          setStateName(analyzedText);
        } else if (field === 'district') {
          setDistrictName(analyzedText);
        } else if (field === 'city') {
          setCityName(analyzedText);
        } else if (field === 'work') {
          setWorkType(analyzedText);
        }
      },
      onStatusChange: (status) => {
        if (status === 'stopped') {
          setActiveMicField(null);
          setLiveRawSpeech('');
          currentSessionRef.current = null;
        }
      },
      onError: (errMsg) => {
        console.log('Microphone status:', errMsg);
        setActiveMicField(null);
        setLiveRawSpeech('');
        currentSessionRef.current = null;
      },
      onComplete: (finalText) => {
        setActiveMicField(null);
        setLiveRawSpeech('');
        currentSessionRef.current = null;
      },
    });

    currentSessionRef.current = session;
  };

  const handleNext = () => {
    if (currentSessionRef.current) {
      currentSessionRef.current.stop();
      currentSessionRef.current = null;
    }

    if (!stateName.trim()) {
      Alert.alert('Notice', t.errState);
      return;
    }
    if (!districtName.trim()) {
      Alert.alert('Notice', t.errDistrict);
      return;
    }
    if (!cityName.trim()) {
      Alert.alert('Notice', t.errCity);
      return;
    }
    if (!workType.trim()) {
      Alert.alert('Notice', t.errWork);
      return;
    }

    // Direct mock registration flow - navigate straight to Home dashboard
    Alert.alert('KalaSetu', t.regSuccess, [
      {
        text: 'OK',
        onPress: () => router.replace({ pathname: '/home', params: { lang: selectedLang } }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Bar: Back Button & Language Selector */}
          <View style={styles.topHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={28} color="#1A1A1A" />
            </TouchableOpacity>

            <TopLangSelector />
          </View>

          {/* Title & Subtitle */}
          <Text style={styles.pageTitle}>{t.title}</Text>
          <Text style={styles.pageSubtitle}>{t.subtitle}</Text>

          {/* Real-time Voice Toast Indicator with Live Speech Preview & Stop Button */}
          {activeMicField && (
            <View style={styles.voiceToast}>
              <View style={styles.livePulseDot} />
              <Ionicons name="mic" size={20} color="#D32F2F" />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.voiceToastTitle}>{t.listeningLive}</Text>
                {liveRawSpeech ? (
                  <Text style={styles.voiceToastSpeech} numberOfLines={1}>
                    🗣️ "{liveRawSpeech}"
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.stopRecordingBtn}
                onPress={() => handleMicPress(activeMicField)}
                activeOpacity={0.8}
              >
                <Ionicons name="stop-circle" size={16} color="#FFFFFF" />
                <Text style={styles.stopRecordingText}>{t.stopBtn}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Field 1: State */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.stateLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.textInput,
                  activeMicField === 'state' && styles.textInputActive,
                ]}
                placeholder={t.statePlaceholder}
                placeholderTextColor="#999999"
                value={stateName}
                onChangeText={setStateName}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  activeMicField === 'state' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('state')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={activeMicField === 'state' ? 'mic' : 'mic-outline'}
                  size={22}
                  color={activeMicField === 'state' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Field 2: District */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.districtLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.textInput,
                  activeMicField === 'district' && styles.textInputActive,
                ]}
                placeholder={t.districtPlaceholder}
                placeholderTextColor="#999999"
                value={districtName}
                onChangeText={setDistrictName}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  activeMicField === 'district' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('district')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={activeMicField === 'district' ? 'mic' : 'mic-outline'}
                  size={22}
                  color={activeMicField === 'district' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Field 3: Village or City */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.cityLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.textInput,
                  activeMicField === 'city' && styles.textInputActive,
                ]}
                placeholder={t.cityPlaceholder}
                placeholderTextColor="#999999"
                value={cityName}
                onChangeText={setCityName}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  activeMicField === 'city' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('city')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={activeMicField === 'city' ? 'mic' : 'mic-outline'}
                  size={22}
                  color={activeMicField === 'city' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Field 4: Category Selection */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.categoryLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.categoryWrap}>
              {t.categories.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat.key && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.key)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={selectedCategory === cat.key ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={selectedCategory === cat.key ? '#3B6029' : '#777'}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat.key && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Field 5: What type of work you do? (with Mic Button) */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.workLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.textInput,
                  { height: 60 },
                  activeMicField === 'work' && styles.textInputActive,
                ]}
                placeholder={t.workPlaceholder}
                placeholderTextColor="#999999"
                multiline={true}
                numberOfLines={2}
                value={workType}
                onChangeText={setWorkType}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  { height: 60 },
                  activeMicField === 'work' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('work')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={activeMicField === 'work' ? 'mic' : 'mic-outline'}
                  size={22}
                  color={activeMicField === 'work' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextButtonText}>{t.nextBtn}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 18,
  },
  voiceToast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 18,
  },
  livePulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D32F2F',
    marginRight: 6,
  },
  voiceToastTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D32F2F',
  },
  voiceToastSpeech: {
    fontSize: 12,
    color: '#444444',
    marginTop: 2,
    fontStyle: 'italic',
  },
  stopRecordingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 4,
    marginLeft: 6,
  },
  stopRecordingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  fieldSection: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  asterisk: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E0D8',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1A1A1A',
  },
  textInputActive: {
    borderColor: '#D32F2F',
    backgroundColor: '#FFFBFB',
  },
  micButton: {
    width: 48,
    height: 52,
    backgroundColor: '#EAF2E8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1E3CE',
  },
  micButtonActive: {
    backgroundColor: '#D32F2F',
    borderColor: '#B71C1C',
    elevation: 3,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  categoryWrap: {
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  categoryChipActive: {
    borderColor: '#3B6029',
    backgroundColor: '#F3F8F1',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#444444',
  },
  categoryChipTextActive: {
    fontWeight: 'bold',
    color: '#3B6029',
  },
  nextButton: {
    height: 54,
    backgroundColor: '#3B6029',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    elevation: 2,
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
});
