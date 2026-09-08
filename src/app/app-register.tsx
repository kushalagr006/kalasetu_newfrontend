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
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  aadhaarLabel: string;
  aadhaarPlaceholder: string;
  aadhaarHint: string;
  panLabel: string;
  panPlaceholder: string;
  panHint: string;
  gstLabel: string;
  gstPlaceholder: string;
  gstHint: string;
  infoText: string;
  nextBtn: string;
  errName: string;
  errPhone: string;
  errAadhaar: string;
  errPan: string;
  listeningLive: string;
  stopBtn: string;
}> = {
  en: {
    title: 'Artisan Registration',
    subtitle: 'Please provide your identity & contact details to register.',
    nameLabel: 'Full Name',
    namePlaceholder: 'Enter your full name',
    phoneLabel: 'Mobile Number',
    phonePlaceholder: 'Enter 10-digit mobile number',
    aadhaarLabel: 'Aadhaar Card Number',
    aadhaarPlaceholder: 'Enter 12 digit Aadhaar number',
    aadhaarHint: 'Example: 1234 5678 9012',
    panLabel: 'PAN Card Number',
    panPlaceholder: 'Enter PAN number',
    panHint: 'Example: ABCDE1234F',
    gstLabel: 'GST Number (Optional)',
    gstPlaceholder: 'Enter GST number',
    gstHint: 'Example: 22AAAAA0000A1Z5',
    infoText: 'Your information is safe and protected under KalaSetu artisan trust.',
    nextBtn: 'Continue →',
    errName: 'Please enter your full name.',
    errPhone: 'Please enter a valid 10-digit mobile number.',
    errAadhaar: 'Please enter a valid 12-digit Aadhaar number.',
    errPan: 'Please enter a valid 10-character PAN number.',
    listeningLive: '🎙️ Listening in real-time... Speak now (Live AI typing)',
    stopBtn: 'Stop',
  },
  hi: {
    title: 'कारीगर पंजीकरण',
    subtitle: 'पंजीकरण करने के लिए कृपया अपनी पहचान व मोबाइल विवरण भरें।',
    nameLabel: 'पूरा नाम',
    namePlaceholder: 'अपना पूरा नाम दर्ज करें',
    phoneLabel: 'मोबाइल नंबर',
    phonePlaceholder: '10 अंकों का मोबाइल नंबर दर्ज करें',
    aadhaarLabel: 'आधार कार्ड नंबर',
    aadhaarPlaceholder: '12 अंकों का आधार नंबर दर्ज करें',
    aadhaarHint: 'उदाहरण: 1234 5678 9012',
    panLabel: 'पैन कार्ड नंबर',
    panPlaceholder: 'पैन नंबर दर्ज करें',
    panHint: 'उदाहरण: ABCDE1234F',
    gstLabel: 'जीएसटी नंबर (यदि उपलब्ध हो)',
    gstPlaceholder: 'जीएसटी नंबर दर्ज करें',
    gstHint: 'उदाहरण: 22AAAAA0000A1Z5',
    infoText: 'आपकी जानकारी हमारे पास सुरक्षित है और केवल सत्यापन के लिए प्रयुक्त होगी।',
    nextBtn: 'आगे बढ़ें →',
    errName: 'कृपया अपना पूरा नाम दर्ज करें।',
    errPhone: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।',
    errAadhaar: 'कृपया 12 अंकों का वैध आधार नंबर दर्ज करें।',
    errPan: 'कृपया 10 अंकों का वैध पैन कार्ड नंबर दर्ज करें।',
    listeningLive: '🎙️ लाइव सुन रहे हैं... बोलिए (बोलते ही लाइव टाइप होगा)',
    stopBtn: 'रोकें',
  },
  bn: {
    title: 'কারিগর রেজিস্ট্রেশন',
    subtitle: 'রেজিস্ট্রেশন করতে আপনার পরিচয় ও মোবাইল নম্বর দিন।',
    nameLabel: 'সম্পূর্ণ নাম',
    namePlaceholder: 'আপনার সম্পূর্ণ নাম লিখুন',
    phoneLabel: 'মোবাইল নম্বর',
    phonePlaceholder: '১০ সংখ্যার মোবাইল নম্বর লিখুন',
    aadhaarLabel: 'আধার কার্ড নম্বর',
    aadhaarPlaceholder: '১২ সংখ্যার আধার নম্বর লিখুন',
    aadhaarHint: 'যেমন: 1234 5678 9012',
    panLabel: 'প্যান কার্ড নম্বর',
    panPlaceholder: 'প্যান নম্বর লিখুন',
    panHint: 'যেমন: ABCDE1234F',
    gstLabel: 'জিএসটি নম্বর (ঐচ্ছিক)',
    gstPlaceholder: 'জিএসটি নম্বর লিখুন',
    gstHint: 'যেমন: 22AAAAA0000A1Z5',
    infoText: 'আপনার তথ্য সম্পূর্ণ সুরক্ষিত থাকবে।',
    nextBtn: 'এগিয়ে যান →',
    errName: 'অনুগ্রহ করে সম্পূর্ণ নাম লিখুন।',
    errPhone: 'অনুগ্রহ করে ১০ সংখ্যার মোবাইল নম্বর লিখুন।',
    errAadhaar: 'অনুগ্রহ করে ১২ সংখ্যার বৈধ আধার নম্বর লিখুন।',
    errPan: 'অনুগ্রহ করে ১০ অক্ষরের বৈধ প্যান নম্বর লিখুন।',
    listeningLive: '🎙️ লাইভ শুনছি... বলুন (বলার সাথে সাথে টাইপ হবে)',
    stopBtn: 'থামুন',
  },
  bho: {
    title: 'कारीगर रजिस्ट्रेशन',
    subtitle: 'रजिस्ट्रेशन खातिर आपन पहचान आ मोबाइल नंबर भरीं।',
    nameLabel: 'पूरा नाम',
    namePlaceholder: 'आपन पूरा नाम लिखीं',
    phoneLabel: 'मोबाइल नंबर',
    phonePlaceholder: '१० अंक के मोबाइल नंबर लिखीं',
    aadhaarLabel: 'आधार कार्ड नंबर',
    aadhaarPlaceholder: '१२ अंक के आधार नंबर लिखीं',
    aadhaarHint: 'जैसे: 1234 5678 9012',
    panLabel: 'पैन कार्ड नंबर',
    panPlaceholder: 'पैन नंबर लिखीं',
    panHint: 'जैसे: ABCDE1234F',
    gstLabel: 'जीएसटी नंबर (ऐच्छिक)',
    gstPlaceholder: 'जीएसटी नंबर लिखीं',
    gstHint: 'जैसे: 22AAAAA0000A1Z5',
    infoText: 'रउआ जानकारी एकदम सुरक्षित बा।',
    nextBtn: 'आगे बढ़ीं →',
    errName: 'कृपया आपन पूरा नाम लिखीं।',
    errPhone: 'कृपया १० अंक के मोबाइल नंबर लिखीं।',
    errAadhaar: 'कृपया १२ अंक के आधार नंबर लिखीं।',
    errPan: 'कृपया १० अंक के पैन नंबर लिखीं।',
    listeningLive: '🎙️ लाइव सुनत बानी... बोलीं (बोलते ही टाइप होई)',
    stopBtn: 'रोकीं',
  },
  mr: {
    title: 'कारागीर नोंदणी',
    subtitle: 'नोंदणी करण्यासाठी कृपया आपली ओळख आणि मोबाईल क्रमांक भरा.',
    nameLabel: 'पूर्ण नाव',
    namePlaceholder: 'आपले पूर्ण नाव टाका',
    phoneLabel: 'मोबाईल नंबर',
    phonePlaceholder: '१० अंकी मोबाईल नंबर टाका',
    aadhaarLabel: 'आधार कार्ड नंबर',
    aadhaarPlaceholder: '१२ अंकी आधार नंबर टाका',
    aadhaarHint: 'उदा: 1234 5678 9012',
    panLabel: 'पॅन कार्ड नंबर',
    panPlaceholder: 'पॅन नंबर टाका',
    panHint: 'उदा: ABCDE1234F',
    gstLabel: 'जीएसटी नंबर (पर्यायी)',
    gstPlaceholder: 'जीएसटी नंबर टाका',
    gstHint: 'उदा: 22AAAAA0000A1Z5',
    infoText: 'आपली माहिती सुरक्षित आहे.',
    nextBtn: 'पुढे जा →',
    errName: 'कृपया पूर्ण नाव टाका.',
    errPhone: 'कृपया १० अंकी वैध मोबाईल नंबर टाका.',
    errAadhaar: 'कृपया १२ अंकी वैध आधार नंबर टाका.',
    errPan: 'कृपया १० अक्षरी वैध पॅन नंबर टाका.',
    listeningLive: '🎙️ थेट ऐकत आहे... बोला (बोलताच थेट टाईप होईल)',
    stopBtn: 'थांबवा',
  },
  gu: {
    title: 'કારીગર નોંધણી',
    subtitle: 'નોંધણી કરવા માટે કૃપા કરીને તમારી ઓળખ અને મોબાઈલ નંબર દાખલ કરો.',
    nameLabel: 'પૂરું નામ',
    namePlaceholder: 'તમારું પૂરું નામ દાખલ કરો',
    phoneLabel: 'મોબાઈલ નંબર',
    phonePlaceholder: '૧૦ અંકનો મોબાઈલ નંબર દાખલ કરો',
    aadhaarLabel: 'આધાર કાર્ડ નંબર',
    aadhaarPlaceholder: '૧૨ અંકનો આધાર નંબર દાખલ કરો',
    aadhaarHint: 'દા.ત.: 1234 5678 9012',
    panLabel: 'પાન કાર્ડ નંબર',
    panPlaceholder: 'પાન નંબર દાખલ કરો',
    panHint: 'દા.ત.: ABCDE1234F',
    gstLabel: 'જીએસટી નંબર (વૈકલ્પિક)',
    gstPlaceholder: 'જીએસટી નંબર દાખલ કરો',
    gstHint: 'દા.ત.: 22AAAAA0000A1Z5',
    infoText: 'તમારી માહિતી સુરક્ષિત છે.',
    nextBtn: 'આગળ વધો →',
    errName: 'કૃપા કરીને પૂરું નામ દાખલ કરો.',
    errPhone: 'કૃપા કરીને ૧૦ અંકનો મોબાઈલ નંબર દાખલ કરો.',
    errAadhaar: 'કૃપા કરીને ૧૨ અંકનો આધાર નંબર દાખલ કરો.',
    errPan: 'કૃપા કરીને ૧૦ અક્ષરોનો પાન નંબર દાખલ કરો.',
    listeningLive: '🎙️ લાઈવ સાંભળી રહ્યા છીએ... બોલો (બોલતા જ ટાઇપ થશે)',
    stopBtn: 'રોકો',
  },
  raj: {
    title: 'कारीगर रो पंजीकरण',
    subtitle: 'पंजीकरण सारु आपरी पहचान अर फोन नंबर रो ब्योरो लिखो।',
    nameLabel: 'पूरो नाम',
    namePlaceholder: 'आपरो पूरो नाम लिखो',
    phoneLabel: 'मोबाइल नंबर',
    phonePlaceholder: '१० अंक रो मोबाइल नंबर लिखो',
    aadhaarLabel: 'आधार कार्ड नंबर',
    aadhaarPlaceholder: '१२ अंक रो आधार नंबर लिखो',
    aadhaarHint: 'जियां: 1234 5678 9012',
    panLabel: 'पैन कार्ड नंबर',
    panPlaceholder: 'पैन नंबर लिखो',
    panHint: 'जियां: ABCDE1234F',
    gstLabel: 'जीएसटी नंबर (यदि होवे तो)',
    gstPlaceholder: 'जीएसटी नंबर लिखो',
    gstHint: 'जियां: 22AAAAA0000A1Z5',
    infoText: 'आपरी जानकारी कलासेतु में सुरक्षित है।',
    nextBtn: 'आगे बढ़ो →',
    errName: 'कृपया आपरो पूरो नाम लिखो।',
    errPhone: 'कृपया १० अंक रो मोबाइल नंबर लिखो।',
    errAadhaar: 'कृपया १२ अंक रो आधार नंबर लिखो।',
    errPan: 'कृपया १० अक्षर रो पैन नंबर लिखो।',
    listeningLive: '🎙️ लाइव सुण रह्या हां... बोलो (बोलता ही छपसी)',
    stopBtn: 'रोको',
  },
  kn: {
    title: 'ಕುಶಲಕರ್ಮಿಗಳ ನೋಂದಣಿ',
    subtitle: 'ನೋಂದಾಯಿಸಲು ನಿಮ್ಮ ಗುರುತು ಮತ್ತು ಮೊಬೈಲ್ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.',
    nameLabel: 'ಪೂರ್ಣ ಹೆಸರು',
    namePlaceholder: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
    phoneLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    phonePlaceholder: '೧೦ ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    aadhaarLabel: 'ಆಧಾರ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ',
    aadhaarPlaceholder: '೧೨ ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
    aadhaarHint: 'ಉದಾ: 1234 5678 9012',
    panLabel: 'ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ',
    panPlaceholder: 'ಪ್ಯಾನ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    panHint: 'ಉದಾ: ABCDE1234F',
    gstLabel: 'ಜಿಎಸ್‌ಟಿ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)',
    gstPlaceholder: 'ಜಿಎಸ್‌ಟಿ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    gstHint: 'ಉದಾ: 22AAAAA0000A1Z5',
    infoText: 'ನಿಮ್ಮ ವಿವರಗಳು ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತವಾಗಿವೆ.',
    nextBtn: 'ಮುಂದೆ ಸಾಗಿ →',
    errName: 'ದಯವಿಟ್ಟು ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.',
    errPhone: 'ದಯವಿಟ್ಟು ೧೦ ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.',
    errAadhaar: 'ದಯವಿಟ್ಟು ೧೨ ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.',
    errPan: 'ದಯವಿಟ್ಟು ೧೦ ಅಂಕಿಯ ಪ್ಯಾನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.',
    listeningLive: '🎙️ ಲೈವ್ ಆಗಿ ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ (ಲೈವ್ ಟೈಪ್ ಆಗುತ್ತದೆ)',
    stopBtn: 'ನಿಲ್ಲಿಸಿ',
  },
};

export default function AppRegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string; phone?: string }>();
  const [globalLang] = useGlobalLang();

  const selectedLang: LangCode =
    (params.lang as LangCode) || globalLang || 'hi';
  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.hi;

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(params.phone || '');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');

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
    // If clicking the currently active mic, stop it
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

    // Start real-time live streaming recognition
    const session = startLiveSpeechRecognition({
      fieldType: field,
      lang: selectedLang,
      onLiveText: (analyzedText, raw) => {
        setLiveRawSpeech(raw);
        // Live update the text box on the left in real time!
        if (field === 'name') {
          setFullName(analyzedText);
        } else if (field === 'phone') {
          setPhoneNumber(analyzedText);
        } else if (field === 'aadhaar') {
          setAadhaarNumber(analyzedText);
        } else if (field === 'pan') {
          setPanNumber(analyzedText);
        } else if (field === 'gst') {
          setGstNumber(analyzedText);
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
    // Stop any active mic session
    if (currentSessionRef.current) {
      currentSessionRef.current.stop();
      currentSessionRef.current = null;
    }

    if (!fullName.trim()) {
      Alert.alert('Notice', t.errName);
      return;
    }
    if (phoneNumber.trim().length < 10) {
      Alert.alert('Notice', t.errPhone);
      return;
    }
    if (aadhaarNumber.length < 12) {
      Alert.alert('Notice', t.errAadhaar);
      return;
    }
    if (panNumber.trim().length < 10) {
      Alert.alert('Notice', t.errPan);
      return;
    }

    // Navigate to Personal Details Step 2 Page with Step 1 data
    router.push({
      pathname: '/app-register-personal',
      params: {
        lang: selectedLang,
        fullName: fullName.trim(),
        phone: phoneNumber.trim(),
        aadhaar: aadhaarNumber.trim(),
        pan: panNumber.trim(),
        gst: gstNumber.trim(),
      },
    });
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

          {/* Field 1: Full Name */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.nameLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.textInput,
                  activeMicField === 'name' && styles.textInputActive,
                ]}
                placeholder={t.namePlaceholder}
                placeholderTextColor="#999999"
                value={fullName}
                onChangeText={setFullName}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  activeMicField === 'name' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('name')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={activeMicField === 'name' ? 'mic' : 'mic-outline'}
                  size={22}
                  color={activeMicField === 'name' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Field 2: Mobile Number */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.phoneLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.textInput,
                  activeMicField === 'phone' && styles.textInputActive,
                ]}
                placeholder={t.phonePlaceholder}
                placeholderTextColor="#999999"
                keyboardType="phone-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  activeMicField === 'phone' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('phone')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={activeMicField === 'phone' ? 'mic' : 'mic-outline'}
                  size={22}
                  color={activeMicField === 'phone' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Field 3: Aadhaar Card Number */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.aadhaarLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.textInput,
                  activeMicField === 'aadhaar' && styles.textInputActive,
                ]}
                placeholder={t.aadhaarPlaceholder}
                placeholderTextColor="#999999"
                keyboardType="number-pad"
                maxLength={12}
                value={aadhaarNumber}
                onChangeText={setAadhaarNumber}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  activeMicField === 'aadhaar' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('aadhaar')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={activeMicField === 'aadhaar' ? 'mic' : 'mic-outline'}
                  size={22}
                  color={activeMicField === 'aadhaar' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.hintText}>{t.aadhaarHint}</Text>
          </View>

          {/* Field 4: PAN Card Number */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {t.panLabel}
              <Text style={styles.asterisk}> *</Text>
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.textInput,
                  activeMicField === 'pan' && styles.textInputActive,
                ]}
                placeholder={t.panPlaceholder}
                placeholderTextColor="#999999"
                autoCapitalize="characters"
                maxLength={10}
                value={panNumber}
                onChangeText={setPanNumber}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  activeMicField === 'pan' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('pan')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={activeMicField === 'pan' ? 'mic' : 'mic-outline'}
                  size={22}
                  color={activeMicField === 'pan' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.hintText}>{t.panHint}</Text>
          </View>

          {/* Field 5: GST Number (Optional) */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>{t.gstLabel}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.textInput,
                  activeMicField === 'gst' && styles.textInputActive,
                ]}
                placeholder={t.gstPlaceholder}
                placeholderTextColor="#999999"
                autoCapitalize="characters"
                maxLength={15}
                value={gstNumber}
                onChangeText={setGstNumber}
              />
              <TouchableOpacity
                style={[
                  styles.micButton,
                  activeMicField === 'gst' && styles.micButtonActive,
                ]}
                onPress={() => handleMicPress('gst')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={activeMicField === 'gst' ? 'mic' : 'mic-outline'}
                  size={22}
                  color={activeMicField === 'gst' ? '#FFFFFF' : '#3B6029'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.hintText}>{t.gstHint}</Text>
          </View>

          {/* Security & Trust Note */}
          <View style={styles.infoCard}>
            <View style={styles.infoIconCircle}>
              <Ionicons name="shield-checkmark" size={20} color="#3B6029" />
            </View>
            <Text style={styles.infoText}>{t.infoText}</Text>
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
  hintText: {
    fontSize: 12,
    color: '#888888',
    marginTop: 6,
    marginLeft: 2,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F8F1',
    padding: 14,
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0EEDD',
    gap: 12,
  },
  infoIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2EEDF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#3B6029',
    lineHeight: 18,
  },
  nextButton: {
    height: 54,
    backgroundColor: '#3B6029',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
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
