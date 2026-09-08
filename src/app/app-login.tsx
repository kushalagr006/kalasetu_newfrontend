import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGlobalLang, ALL_LANGUAGES, LangCode } from '@/utils/languageStore';

const LANGUAGES = ALL_LANGUAGES;

const TRANSLATIONS: Record<LangCode, {
  tagline: string;
  formTitle: string;
  placeholder: string;
  button: string;
  or: string;
  shgTitle: string;
  shgSubtitle: string;
  trust1: string;
  trust2: string;
  trust3: string;
  alertError: string;
  alertSuccess: string;
  modalTitle: string;
  newRegisterPrompt: string;
  newRegisterLink: string;
  regModalTitle: string;
  regModalSub: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  mobileLabel: string;
  mobilePlaceholder: string;
  aadhaarLabel: string;
  aadhaarPlaceholder: string;
  panLabel: string;
  panPlaceholder: string;
  gstinLabel: string;
  gstinPlaceholder: string;
  categoryLabel: string;
  categories: { key: string; label: string }[];
  regSubmitBtn: string;
  errFullName: string;
  errMobile: string;
  errAadhaar: string;
  errPan: string;
  closeText: string;
}> = {
  hi: {
    tagline: 'आपकी कला, आपकी पहचान',
    formTitle: 'मोबाइल नंबर डालें',
    placeholder: 'अपना मोबाइल नंबर लिखें',
    button: 'आगे बढ़ें',
    or: 'या',
    shgTitle: 'महिला SHG समूह बनाएं',
    shgSubtitle: 'एक साथ काम करें, बड़े ऑर्डर पाएं\nऔर अपनी आमदनी बढ़ाएं',
    trust1: 'सुरक्षित\nऔर भरोसेमंद',
    trust2: 'भारतीय कलाकारों\nके लिए',
    trust3: 'बिकें, कमाएं\nऔर आगे बढ़ें',
    alertError: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।',
    alertSuccess: 'ओटीपी भेजा गया:',
    modalTitle: 'भाषा चुनें / Select Language',
    newRegisterPrompt: 'नया खाता बनाएं? ',
    newRegisterLink: 'यहाँ रजिस्ट्रेशन करें',
    regModalTitle: 'नया कारीगर रजिस्ट्रेशन (Artisan Registration)',
    regModalSub: 'कलासेतु से जुड़ने के लिए अपना पहचान विवरण भरें',
    fullNameLabel: 'पूरा नाम *',
    fullNamePlaceholder: 'अपना पूरा नाम दर्ज करें',
    mobileLabel: 'मोबाइल नंबर *',
    mobilePlaceholder: '10 अंकों का मोबाइल नंबर',
    aadhaarLabel: 'आधार कार्ड नंबर *',
    aadhaarPlaceholder: '12-अंकों का आधार नंबर दर्ज करें',
    panLabel: 'पैन कार्ड नंबर (PAN Card) *',
    panPlaceholder: '10-अंकों का PAN नंबर (जैसे ABCDE1234F)',
    gstinLabel: 'जीएसटीआईएन नंबर (GSTIN - ऐच्छिक)',
    gstinPlaceholder: '15-अंकों का GSTIN दर्ज करें (यदि उपलब्ध हो)',
    categoryLabel: 'श्रेणी / वर्ग (Category) *',
    categories: [
      { key: 'individual', label: 'व्यक्तिगत कलाकार / कारीगर' },
      { key: 'shg', label: 'महिला स्व-सहायता समूह (Woman SHG)' },
      { key: 'sc_st', label: 'अनुसूचित जाति / जनजाति (SC/ST)' },
      { key: 'obc', label: 'अन्य पिछड़ा वर्ग (OBC)' },
      { key: 'pwd', label: 'दिव्यांगजन (PWD)' },
    ],
    regSubmitBtn: 'आगे बढ़ें (Next) →',
    errFullName: 'कृपया अपना पूरा नाम दर्ज करें।',
    errMobile: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।',
    errAadhaar: 'कृपया 12 अंकों का वैध आधार कार्ड नंबर दर्ज करें।',
    errPan: 'कृपया 10 अंकों का वैध पैन कार्ड नंबर दर्ज करें।',
    closeText: 'बंद करें',
  },
  en: {
    tagline: 'Your Art, Your Identity',
    formTitle: 'Enter Mobile Number',
    placeholder: 'Enter mobile number',
    button: 'Continue',
    or: 'OR',
    shgTitle: 'Create Women SHG Group',
    shgSubtitle: 'Work together, get bulk orders\nand grow your income',
    trust1: 'Safe &\nTrustworthy',
    trust2: 'For Indian\nArtisans',
    trust3: 'Sell, Earn &\nGrow',
    alertError: 'Please enter a valid 10-digit mobile number.',
    alertSuccess: 'OTP sent to:',
    modalTitle: 'Select Language / भाषा चुनें',
    newRegisterPrompt: 'New user? ',
    newRegisterLink: 'Register here',
    regModalTitle: 'Artisan Registration',
    regModalSub: 'Fill in your identification details to join KalaSetu',
    fullNameLabel: 'Full Name *',
    fullNamePlaceholder: 'Enter your full name',
    mobileLabel: 'Mobile Number *',
    mobilePlaceholder: 'Enter 10-digit mobile number',
    aadhaarLabel: 'Aadhaar Card Number *',
    aadhaarPlaceholder: 'Enter 12-digit Aadhaar number',
    panLabel: 'PAN Card Number *',
    panPlaceholder: 'Enter 10-character PAN number (e.g. ABCDE1234F)',
    gstinLabel: 'GSTIN Number (Optional)',
    gstinPlaceholder: 'Enter 15-digit GSTIN (if available)',
    categoryLabel: 'Category *',
    categories: [
      { key: 'individual', label: 'Individual Artisan / Buyer' },
      { key: 'shg', label: 'Woman SHG Group' },
      { key: 'sc_st', label: 'SC / ST Community' },
      { key: 'obc', label: 'OBC Community' },
      { key: 'pwd', label: 'PWD (Specially Abled)' },
    ],
    regSubmitBtn: 'Next →',
    errFullName: 'Please enter your full name.',
    errMobile: 'Please enter a valid 10-digit mobile number.',
    errAadhaar: 'Please enter a valid 12-digit Aadhaar card number.',
    errPan: 'Please enter a valid 10-character PAN card number.',
    closeText: 'Close',
  },
  bn: {
    tagline: 'আপনার শিল্প, আপনার পরিচয়',
    formTitle: 'মোবাইল নম্বর লিখুন',
    placeholder: 'আপনার ১০ সংখ্যার মোবাইল নম্বর লিখুন',
    button: 'এগিয়ে যান',
    or: 'অথবা',
    shgTitle: 'মহিলা এসএইচজি গোষ্ঠী তৈরি করুন',
    shgSubtitle: 'একসাথে কাজ করুন, বড় অর্ডার পান\nএবং আয় বাড়ান',
    trust1: 'নিরাপদ ও\nবিশ্বস্ত',
    trust2: 'ভারতীয় শিল্পীদের\nজন্য',
    trust3: 'বিক্রি করুন, আয় করুন\nএবং এগিয়ে যান',
    alertError: 'দয়া করে একটি বৈধ ১০ সংখ্যার মোবাইল নম্বর লিখুন।',
    alertSuccess: 'ওটিপি পাঠানো হয়েছে:',
    modalTitle: 'ভাষা নির্বাচন করুন / Select Language',
    newRegisterPrompt: 'নতুন অ্যাকাউন্ট তৈরি করবেন? ',
    newRegisterLink: 'এখানে রেজিস্ট্রেশন করুন',
    regModalTitle: 'নতুন কারিগর রেজিস্ট্রেশন (Artisan Registration)',
    regModalSub: 'কলাসেতুতে যোগ দিতে আপনার পরিচয় বিবরণ দিন',
    fullNameLabel: 'সম্পূর্ণ নাম *',
    fullNamePlaceholder: 'আপনার সম্পূর্ণ নাম লিখুন',
    mobileLabel: 'মোবাইল নম্বর *',
    mobilePlaceholder: '১০ সংখ্যার মোবাইল নম্বর',
    aadhaarLabel: 'আধার কার্ড নম্বর *',
    aadhaarPlaceholder: '১২ সংখ্যার আধার নম্বর লিখুন',
    panLabel: 'প্যান কার্ড নম্বর *',
    panPlaceholder: '১০ অক্ষরের PAN নম্বর (যেমন ABCDE1234F)',
    gstinLabel: 'জিএসটিআইএন নম্বর (ঐচ্ছিক)',
    gstinPlaceholder: '১৫ সংখ্যার GSTIN লিখুন (যদি থাকে)',
    categoryLabel: 'শ্রেণী (Category) *',
    categories: [
      { key: 'individual', label: 'ব্যক্তিগত শিল্পী / কারিগর' },
      { key: 'shg', label: 'মহিলা স্বনির্ভর গোষ্ঠী (Woman SHG)' },
      { key: 'sc_st', label: 'তপশিলী জাতি / উপজাতি (SC/ST)' },
      { key: 'obc', label: 'অন্যান্য অনগ্রসর শ্রেণী (OBC)' },
      { key: 'pwd', label: 'বিশেষভাবে সক্ষম (PWD)' },
    ],
    regSubmitBtn: 'এগিয়ে যান →',
    errFullName: 'দয়া করে আপনার সম্পূর্ণ নাম লিখুন।',
    errMobile: 'দয়া করে ১০ সংখ্যার একটি বৈধ মোবাইল নম্বর লিখুন।',
    errAadhaar: 'দয়া করে ১২ সংখ্যার একটি বৈধ আধার নম্বর লিখুন।',
    errPan: 'দয়া করে ১০ অক্ষরের একটি বৈধ প্যান নম্বর লিখুন।',
    closeText: 'বন্ধ করুন',
  },
  bho: {
    tagline: 'रउआ कला, रउआ पहचान',
    formTitle: 'मोबाइल नंबर डालीं',
    placeholder: 'अपना १० अंक के मोबाइल नंबर लिखीं',
    button: 'आगे बढ़ीं',
    or: 'या',
    shgTitle: 'महिला SHG समूह बनाईं',
    shgSubtitle: 'संगे काम करीं, बड़का ऑर्डर पावीं\nऔर कमाई बढ़ाईं',
    trust1: 'सुरक्षित\nऔर भरोसेमंद',
    trust2: 'भारतीय कलाकारन\nखातिर',
    trust3: 'बिकीं, कमाईं\nऔर आगे बढ़ीं',
    alertError: 'कृपया १० अंक के वैध मोबाइल नंबर डालीं।',
    alertSuccess: 'ओटीपी भेजल गइल:',
    modalTitle: 'भाषा चुनीं / Select Language',
    newRegisterPrompt: 'नया खाता बनाईं? ',
    newRegisterLink: 'इहाँ रजिस्ट्रेशन करीं',
    regModalTitle: 'नया कारीगर रजिस्ट्रेशन (Artisan Registration)',
    regModalSub: 'कलासेतु से जुड़े खातिर आपन पहचान विवरण भरीं',
    fullNameLabel: 'पूरा नाम *',
    fullNamePlaceholder: 'आपन पूरा नाम डालीं',
    mobileLabel: 'मोबाइल नंबर *',
    mobilePlaceholder: '१० अंक के मोबाइल नंबर',
    aadhaarLabel: 'आधार कार्ड नंबर *',
    aadhaarPlaceholder: '१२-अंक के आधार नंबर डालीं',
    panLabel: 'पैन कार्ड नंबर *',
    panPlaceholder: '१०-अंक के PAN नंबर (जैसे ABCDE1234F)',
    gstinLabel: 'जीएसटी नंबर (GSTIN - ऐच्छिक)',
    gstinPlaceholder: '१५-अंक के GSTIN डालीं',
    categoryLabel: 'श्रेणी (Category) *',
    categories: [
      { key: 'individual', label: 'व्यक्तिगत कलाकार / कारीगर' },
      { key: 'shg', label: 'महिला स्व-सहायता समूह (Woman SHG)' },
      { key: 'sc_st', label: 'अनुसूचित जाति / जनजाति (SC/ST)' },
      { key: 'obc', label: 'अन्य पिछड़ा वर्ग (OBC)' },
      { key: 'pwd', label: 'दिव्यांगजन (PWD)' },
    ],
    regSubmitBtn: 'आगे बढ़ीं →',
    errFullName: 'कृपया आपन पूरा नाम डालीं।',
    errMobile: 'कृपया १० अंक के वैध मोबाइल नंबर डालीं।',
    errAadhaar: 'कृपया १२ अंक के वैध आधार नंबर डालीं।',
    errPan: 'कृपया १० अंक के वैध पैन नंबर डालीं।',
    closeText: 'बंद करीं',
  },
  mr: {
    tagline: 'तुमची कला, तुमची ओळख',
    formTitle: 'मोबाईल नंबर प्रविष्ट करा',
    placeholder: 'तुमचा १० अंकी मोबाईल नंबर टाका',
    button: 'पुढे जा',
    or: 'किंवा',
    shgTitle: 'महिला बचत गट (SHG) तयार करा',
    shgSubtitle: 'एकत्र काम करा, मोठ्या ऑर्डर्स मिळवा\nआणि उत्पन्न वाढवा',
    trust1: 'सुरक्षित आणि\nविश्वासार्ह',
    trust2: 'भारतीय कारागिरांसाठी',
    trust3: 'विक्री करा, कमवा\nआणि पुढे जा',
    alertError: 'कृपया १० अंकी वैध मोबाईल नंबर प्रविष्ट करा.',
    alertSuccess: 'ओटीपी पाठवला:',
    modalTitle: 'भाषा निवडा / Select Language',
    newRegisterPrompt: 'नवीन खाते तयार करा? ',
    newRegisterLink: 'येथे नोंदणी करा',
    regModalTitle: 'नवीन कारागीर नोंदणी (Artisan Registration)',
    regModalSub: 'कलासेतू मध्ये जोडण्यासाठी तुमची ओळख माहिती भरा',
    fullNameLabel: 'पूर्ण नाव *',
    fullNamePlaceholder: 'तुमचे पूर्ण नाव टाका',
    mobileLabel: 'मोबाईल नंबर *',
    mobilePlaceholder: '१० अंकी मोबाईल नंबर',
    aadhaarLabel: 'आधार कार्ड नंबर *',
    aadhaarPlaceholder: '१२ अंकी आधार नंबर टाका',
    panLabel: 'पॅन कार्ड नंबर *',
    panPlaceholder: '१० अंकी PAN नंबर (उदा. ABCDE1234F)',
    gstinLabel: 'जीएसटी नंबर (GSTIN - ऐच्छिक)',
    gstinPlaceholder: '१५ अंकी GSTIN टाका (उपलब्ध असल्यास)',
    categoryLabel: 'वर्ग (Category) *',
    categories: [
      { key: 'individual', label: 'वैयक्तिक कलाकार / कारागीर' },
      { key: 'shg', label: 'महिला स्वयं सहाय्यता गट (Woman SHG)' },
      { key: 'sc_st', label: 'अनुसूचित जाती / जमाती (SC/ST)' },
      { key: 'obc', label: 'इतर मागासवर्ग (OBC)' },
      { key: 'pwd', label: 'दिव्यांग (PWD)' },
    ],
    regSubmitBtn: 'पुढे जा →',
    errFullName: 'कृपया तुमचे पूर्ण नाव टाका.',
    errMobile: 'कृपया १० अंकी वैध मोबाईल नंबर टाका.',
    errAadhaar: 'कृपया १२ अंकी वैध आधार नंबर टाका.',
    errPan: 'कृपया १० अंकी वैध पॅन नंबर टाका.',
    closeText: 'बंद करा',
  },
  gu: {
    tagline: 'તમારી કળા, તમારી ઓળખ',
    formTitle: 'મોબાઇલ નંબર દાખલ કરો',
    placeholder: 'તમારો ૧૦ અંકનો મોબાઇલ નંબર લખો',
    button: 'આગળ વધો',
    or: 'અથવા',
    shgTitle: 'મહિલા બચત જૂથ (SHG) બનાવો',
    shgSubtitle: 'સાથે મળીને કામ કરો, મોટા ઓર્ડર મેળવો\nઅને આવક વધારો',
    trust1: 'સુરક્ષિત અને\nવિશ્વસનીય',
    trust2: 'ભારતીય કારીગરો\nમાટે',
    trust3: 'વેચો, કમાઓ\nઅને આગળ વધો',
    alertError: 'કૃપા કરીને ૧૦ અંકનો માન્ય મોબાઇલ નંબર દાખલ કરો.',
    alertSuccess: 'ઓટીપી મોકલ્યો:',
    modalTitle: 'ભાષા પસંદ કરો / Select Language',
    newRegisterPrompt: 'નવું ખાતું બનાવો? ',
    newRegisterLink: 'અહીં નોંધણી કરો',
    regModalTitle: 'નવી કારીગર નોંધણી (Artisan Registration)',
    regModalSub: 'કલાસેતુ સાથે જોડાવા માટે તમારી ઓળખ વિગતો ભરો',
    fullNameLabel: 'પૂરું નામ *',
    fullNamePlaceholder: 'તમારું પૂરું નામ લખો',
    mobileLabel: 'મોબાઇલ નંબર *',
    mobilePlaceholder: '૧૦ અંકનો મોબાઇલ નંબર',
    aadhaarLabel: 'આધાર કાર્ડ નંબર *',
    aadhaarPlaceholder: '૧૨ અંકનો આધાર નંબર લખો',
    panLabel: 'પાન કાર્ડ નંબર *',
    panPlaceholder: '૧૦ અક્ષરનો PAN નંબર (જેમ કે ABCDE1234F)',
    gstinLabel: 'જીએસટી નંબર (GSTIN - મરજિયાત)',
    gstinPlaceholder: '૧૫ અંકનો GSTIN લખો (જો હોય તો)',
    categoryLabel: 'કેટેગરી (Category) *',
    categories: [
      { key: 'individual', label: 'વ્યક્તિગત કારીગર' },
      { key: 'shg', label: 'મહિલા સ્વ-સહાય જૂથ (Woman SHG)' },
      { key: 'sc_st', label: 'અનુસૂચિત જાતિ / જનજાતિ (SC/ST)' },
      { key: 'obc', label: 'અન્ય પછાત વર્ગ (OBC)' },
      { key: 'pwd', label: 'દિવ્યાંગ (PWD)' },
    ],
    regSubmitBtn: 'આગળ વધો →',
    errFullName: 'કૃપા કરીને તમારું પૂરું નામ લખો.',
    errMobile: 'કૃપા કરીને ૧૦ અંકનો માન્ય મોબાઇલ નંબર લખો.',
    errAadhaar: 'કૃપા કરીને ૧૨ અંકનો માન્ય આધાર નંબર લખો.',
    errPan: 'કૃપા કરીને ૧૦ અક્ષરનો માન્ય પાન નંબર લખો.',
    closeText: 'બંધ કરો',
  },
  raj: {
    tagline: 'थांरी कला, थांरी पहचान',
    formTitle: 'मोबाइल नंबर लिखो',
    placeholder: 'आपणो १० अंकां रो मोबाइल नंबर लिखो',
    button: 'आगे बढ़ो',
    or: 'या',
    shgTitle: 'महिला SHG समूह बणावो',
    shgSubtitle: 'सागे काम करो, बड़ा ऑर्डर पाओ\nऔर आपणी कमाई बढ़ावो',
    trust1: 'सुरक्षित और\nभरोसेमंद',
    trust2: 'भारतीय कलाकारां\nखातर',
    trust3: 'बिको, कमावो\nऔर आगे बढ़ो',
    alertError: 'कृपया १० अंकां रो वैध मोबाइल नंबर लिखो।',
    alertSuccess: 'ओटीपी भेज्यो गयो:',
    modalTitle: 'भाषा चूणो / Select Language',
    newRegisterPrompt: 'नयो खातो बणावो? ',
    newRegisterLink: 'अठै रजिस्ट्रेशन करो',
    regModalTitle: 'नयो कारीगर रजिस्ट्रेशन (Artisan Registration)',
    regModalSub: 'कलासेतु सूं जुड़बा खातर आपणी पहचान लिखो',
    fullNameLabel: 'पूरो नाम *',
    fullNamePlaceholder: 'आपणो पूरो नाम लिखो',
    mobileLabel: 'मोबाइल नंबर *',
    mobilePlaceholder: '१० अंकां रो मोबाइल नंबर',
    aadhaarLabel: 'आधार कार्ड नंबर *',
    aadhaarPlaceholder: '१२-अंकां रो आधार नंबर लिखो',
    panLabel: 'पैन कार्ड नंबर *',
    panPlaceholder: '१०-अंकां रो PAN नंबर (जैसूं ABCDE1234F)',
    gstinLabel: 'जीएसटी नंबर (GSTIN - ऐच्छिक)',
    gstinPlaceholder: '१५-अंकां रो GSTIN लिखो',
    categoryLabel: 'श्रेणी (Category) *',
    categories: [
      { key: 'individual', label: 'व्यक्तिगत कलाकार / कारीगर' },
      { key: 'shg', label: 'महिला स्व-सहायता समूह (Woman SHG)' },
      { key: 'sc_st', label: 'अनुसूचित जाति / जनजाति (SC/ST)' },
      { key: 'obc', label: 'अन्य पिछड़ा वर्ग (OBC)' },
      { key: 'pwd', label: 'दिव्यांगजन (PWD)' },
    ],
    regSubmitBtn: 'आगे बढ़ो →',
    errFullName: 'कृपयाण आपणो पूरो नाम लिखो।',
    errMobile: 'कृपया १० अंकां रो वैध मोबाइल नंबर लिखो।',
    errAadhaar: 'कृपया १२ अंकां रो वैध आधार नंबर लिखो।',
    errPan: 'कृपया १० अंकां रो वैध पैन नंबर लिखो।',
    closeText: 'बंद करो',
  },
  kn: {
    tagline: 'ನಿಮ್ಮ ಕಲೆ, ನಿಮ್ಮ ಗುರುತು',
    formTitle: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    placeholder: 'ನಿಮ್ಮ ೧೦ ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಬರೆಯಿರಿ',
    button: 'ಮುಂದೆ ಸಾಗಿ',
    or: 'ಅಥವಾ',
    shgTitle: 'ಮಹಿಳಾ ಎಸ್‌ಎಚ್‌ಜಿ ಗುಂಪು ರಚಿಸಿ',
    shgSubtitle: 'ಒಟ್ಟಿಗೆ ಕೆಲಸ ಮಾಡಿ, ದೊಡ್ಡ ಆರ್ಡರ್‌ಗಳನ್ನು ಪಡೆಯಿರಿ\nಮತ್ತು ನಿಮ್ಮ ಆದಾಯವನ್ನು ಹೆಚ್ಚಿಸಿ',
    trust1: 'ಸುರಕ್ಷಿತ ಮತ್ತು\nನಂಬಿಕಾರ್ಹ',
    trust2: 'ಭಾರತೀಯ ಕುಶಲಕರ್ಮಿಗಳಿಗಾಗಿ',
    trust3: 'ಮಾರಿ, ಗಳಿಸಿ\nಮತ್ತು ಬೆಳೆಯಿರಿ',
    alertError: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ೧೦ ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.',
    alertSuccess: 'ಒಟಿಪಿ ಕಳುಹಿಸಲಾಗಿದೆ:',
    modalTitle: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / Select Language',
    newRegisterPrompt: 'ಹೊಸ ಬಳಕೆದಾರರೆ? ',
    newRegisterLink: 'ಇಲ್ಲಿ ನೋಂದಾಯಿಸಿ',
    regModalTitle: 'ಹೊಸ ಕುಶಲಕರ್ಮಿ ನೋಂದಣಿ (Artisan Registration)',
    regModalSub: 'ಕಲಾಸೇತು ಸೇರಲು ನಿಮ್ಮ ಗುರುತಿನ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ',
    fullNameLabel: 'ಪೂರ್ಣ ಹೆಸರು *',
    fullNamePlaceholder: 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
    mobileLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *',
    mobilePlaceholder: '೧೦ ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    aadhaarLabel: 'ಆಧಾರ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ *',
    aadhaarPlaceholder: '೧೨ ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
    panLabel: 'ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ *',
    panPlaceholder: '೧೦ ಅಂಕಿಯ PAN ಸಂಖ್ಯೆ (ಉದಾ. ABCDE1234F)',
    gstinLabel: 'ಜಿಎಸ್‌ಟಿ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)',
    gstinPlaceholder: '೧೫ ಅಂಕಿಯ GSTIN ನಮೂದಿಸಿ (ಲಭ್ಯವಿದ್ದರೆ)',
    categoryLabel: 'ವರ್ಗ (Category) *',
    categories: [
      { key: 'individual', label: 'ವೈಯಕ್ತಿಕ ಕುಶಲಕರ್ಮಿ' },
      { key: 'shg', label: 'ಮಹಿಳಾ ಸ್ವಸಹಾಯ ಗುಂಪು (Woman SHG)' },
      { key: 'sc_st', label: 'ಪರಿಶಿಷ್ಟ ಜಾತಿ / ಪಂಗಡ (SC/ST)' },
      { key: 'obc', label: 'ಹಿಂದುಳಿದ ವರ್ಗಗಳು (OBC)' },
      { key: 'pwd', label: 'ವಿಶೇಷ ಚೇತನರು (PWD)' },
    ],
    regSubmitBtn: 'ಮುಂದೆ ಸಾಗಿ →',
    errFullName: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.',
    errMobile: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ೧೦ ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.',
    errAadhaar: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ೧೨ ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂદಿಸಿ.',
    errPan: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ೧೦ ಅಂಕಿಯ ಪ್ಯಾನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.',
    closeText: 'ಮುಚ್ಚಿ',
  },
};

export default function AppLoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const [globalLang, setGlobalLang] = useGlobalLang();

  const selectedLang: LangCode = (params.lang as LangCode) || globalLang || 'hi';
  const t = (TRANSLATIONS as any)[selectedLang] || (TRANSLATIONS as any)[globalLang] || TRANSLATIONS.hi;

  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  // Registration Modal State
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regAadhaar, setRegAadhaar] = useState('');
  const [regPan, setRegPan] = useState('');
  const [regGstin, setRegGstin] = useState('');
  const [regCategory, setRegCategory] = useState('individual');

  const handleLangChange = (code: LangCode) => {
    setGlobalLang(code);
    setIsLangModalVisible(false);
  };

  const handleContinue = () => {
    if (phoneNumber.length < 10) {
      alert(t.alertError);
      return;
    }
    router.push({
      pathname: '/otp',
      params: { phone: phoneNumber, lang: selectedLang },
    });
  };

  const handleRegisterSubmit = () => {
    if (!regFullName.trim()) {
      alert(t.errFullName);
      return;
    }
    if (regMobile.length < 10) {
      alert(t.errMobile);
      return;
    }
    if (regAadhaar.length < 12) {
      alert(t.errAadhaar);
      return;
    }
    if (regPan.trim().length < 10) {
      alert(t.errPan);
      return;
    }
    // GSTIN is not mandatory!
    setIsRegisterModalVisible(false);
    router.push('/home');
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[1];
  const currentLangLabel = `${currentLangObj.nativeName} (${currentLangObj.englishName})`;

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
          bounces={false}
        >
          {/* Top Bar - Language Selector */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.langSelector}
              onPress={() => setIsLangModalVisible(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="globe-outline" size={16} color="#2C2C2C" />
              <Text style={styles.langText}>{currentLangLabel}</Text>
              <Ionicons name="chevron-down" size={14} color="#2C2C2C" />
            </TouchableOpacity>
          </View>

          {/* Logo & Brand Identity */}
          <View style={styles.brandContainer}>
            <Image
              source={require('@/assets/images/logo_icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Village Scenic Landscape Banner */}
          <View style={styles.bannerWrapper}>
            <Image
              source={require('@/assets/images/village_banner.png')}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>

          {/* Phone Icon Badge */}
          <View style={styles.phoneBadgeContainer}>
            <View style={styles.phoneBadge}>
              <Ionicons name="call" size={22} color="#3B6029" />
            </View>
            <Text style={styles.formTitle}>{t.formTitle}</Text>
          </View>

          {/* Login Form Container */}
          <View style={styles.formContainer}>
            {/* Phone Number Input Box */}
            <View style={styles.inputCard}>
              <TouchableOpacity style={styles.countryPicker} activeOpacity={0.8}>
                <Text style={styles.countryCodeText}>{countryCode}</Text>
                <Ionicons name="chevron-down" size={14} color="#555" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
              <View style={styles.dividerVertical} />
              <TextInput
                style={styles.textInput}
                placeholder={t.placeholder}
                placeholderTextColor="#8E8E93"
                keyboardType="phone-pad"
                maxLength={10}
                numberOfLines={1}
                multiline={false}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
              <Ionicons name="call" size={20} color="#3B6029" style={styles.inputPhoneIcon} />
            </View>

            {/* Primary Action Button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                phoneNumber.length === 10 ? styles.primaryButtonActive : null,
              ]}
              onPress={handleContinue}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>{t.button}</Text>
              <Feather name="arrow-right" size={22} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            {/* New Registration Link */}
            <View style={styles.newRegisterContainer}>
              <Text style={styles.newRegisterPromptText}>{t.newRegisterPrompt}</Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/app-register',
                    params: { lang: selectedLang },
                  })
                }
                activeOpacity={0.7}
              >
                <Text style={styles.newRegisterLinkText}>{t.newRegisterLink}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Features & Trust Badges */}
          <View style={styles.trustFooter}>
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#3B6029" />
              <Text style={styles.trustText}>{t.trust1}</Text>
            </View>

            <View style={styles.trustDivider} />

            <View style={styles.trustItem}>
              <Ionicons name="leaf-outline" size={24} color="#3B6029" />
              <Text style={styles.trustText}>{t.trust2}</Text>
            </View>

            <View style={styles.trustDivider} />

            <View style={styles.trustItem}>
              <Ionicons name="heart-outline" size={24} color="#3B6029" />
              <Text style={styles.trustText}>{t.trust3}</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
                    styles.langOption,
                    selectedLang === item.code && styles.langOptionSelected,
                  ]}
                  onPress={() => handleLangChange(item.code)}
                >
                  <Text
                    style={[
                      styles.langOptionText,
                      selectedLang === item.code && styles.langOptionTextSelected,
                    ]}
                  >
                    {item.nativeName} ({item.englishName})
                  </Text>
                  {selectedLang === item.code && (
                    <Ionicons name="checkmark-circle" size={20} color="#3B6029" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Registration Modal */}
      <Modal
        visible={isRegisterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsRegisterModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.regModalContent}>
            {/* Modal Header */}
            <View style={styles.regModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.regModalTitle}>{t.regModalTitle}</Text>
                <Text style={styles.regModalSub}>{t.regModalSub}</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsRegisterModalVisible(false)}
                style={styles.closeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              {/* Full Name Field */}
              <Text style={styles.regFieldLabel}>{t.fullNameLabel}</Text>
              <View style={styles.regInputBox}>
                <Ionicons name="person-outline" size={20} color="#3B6029" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.regTextInput}
                  placeholder={t.fullNamePlaceholder}
                  placeholderTextColor="#8E8E93"
                  value={regFullName}
                  onChangeText={setRegFullName}
                />
              </View>

              {/* Mobile Number Field */}
              <Text style={styles.regFieldLabel}>{t.mobileLabel}</Text>
              <View style={styles.regInputBox}>
                <Text style={styles.regCountryCode}>{countryCode}</Text>
                <View style={styles.regDividerVertical} />
                <TextInput
                  style={styles.regTextInput}
                  placeholder={t.mobilePlaceholder}
                  placeholderTextColor="#8E8E93"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={regMobile}
                  onChangeText={setRegMobile}
                />
                <Ionicons name="call-outline" size={20} color="#3B6029" style={{ marginRight: 4 }} />
              </View>

              {/* Aadhaar Card Number Field */}
              <Text style={styles.regFieldLabel}>{t.aadhaarLabel}</Text>
              <View style={styles.regInputBox}>
                <Ionicons name="card-outline" size={20} color="#3B6029" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.regTextInput}
                  placeholder={t.aadhaarPlaceholder}
                  placeholderTextColor="#8E8E93"
                  keyboardType="number-pad"
                  maxLength={12}
                  value={regAadhaar}
                  onChangeText={setRegAadhaar}
                />
              </View>

              {/* PAN Card Number Field */}
              <Text style={styles.regFieldLabel}>{t.panLabel}</Text>
              <View style={styles.regInputBox}>
                <Ionicons name="document-text-outline" size={20} color="#3B6029" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.regTextInput}
                  placeholder={t.panPlaceholder}
                  placeholderTextColor="#8E8E93"
                  autoCapitalize="characters"
                  maxLength={10}
                  value={regPan}
                  onChangeText={setRegPan}
                />
              </View>

              {/* GSTIN Number Field (Optional) */}
              <Text style={styles.regFieldLabel}>{t.gstinLabel}</Text>
              <View style={styles.regInputBox}>
                <Ionicons name="business-outline" size={20} color="#3B6029" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.regTextInput}
                  placeholder={t.gstinPlaceholder}
                  placeholderTextColor="#8E8E93"
                  autoCapitalize="characters"
                  maxLength={15}
                  value={regGstin}
                  onChangeText={setRegGstin}
                />
              </View>

              {/* Category Selection */}
              <Text style={styles.regFieldLabel}>{t.categoryLabel}</Text>
              <View style={styles.categoryContainer}>
                {t.categories.map((cat: { key: string; label: string }) => (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.categoryChip,
                      regCategory === cat.key && styles.categoryChipActive,
                    ]}
                    onPress={() => setRegCategory(cat.key)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={regCategory === cat.key ? 'checkmark-circle' : 'ellipse-outline'}
                      size={18}
                      color={regCategory === cat.key ? '#3B6029' : '#888'}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[
                        styles.categoryChipText,
                        regCategory === cat.key && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Next Button */}
              <TouchableOpacity
                style={styles.regSubmitButton}
                onPress={handleRegisterSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.regSubmitButtonText}>{t.regSubmitBtn}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    paddingBottom: 32,
  },
  /* Top Bar */
  topBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 8,
    paddingBottom: 4,
    alignItems: 'flex-end',
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  langText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C2C2C',
    marginHorizontal: 4,
  },
  /* Brand Container */
  brandContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  logoImage: {
    width: 220,
    height: 170,
  },
  /* Banner Image */
  bannerWrapper: {
    width: '100%',
    height: 190,
    marginTop: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  /* Phone Badge Section */
  phoneBadgeContainer: {
    alignItems: 'center',
    marginTop: -30,
    zIndex: 10,
  },
  phoneBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8F0E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#FAF8F5',
  },
  formTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 14,
    textAlign: 'center',
  },
  /* Form Container */
  formContainer: {
    paddingHorizontal: 20,
    width: '100%',
  },
  inputCard: {
    flexDirection: 'row',
    height: 56,
    borderWidth: 1.5,
    borderColor: '#3B6029',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F5F0',
    paddingHorizontal: 14,
    height: '100%',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  dividerVertical: {
    width: 1,
    height: '60%',
    backgroundColor: '#E2E0D8',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    paddingHorizontal: 10,
    paddingVertical: 0,
    height: '100%',
  },
  inputPhoneIcon: {
    marginRight: 14,
  },
  /* Primary Button */
  primaryButton: {
    height: 56,
    backgroundColor: '#3B6029',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#3B6029',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  primaryButtonActive: {
    backgroundColor: '#2E4C20',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  /* Or Divider */
  orDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
    paddingHorizontal: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E3DC',
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#777777',
    fontWeight: '500',
  },
  /* SHG Card */
  shgCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF7EC',
    borderWidth: 1,
    borderColor: '#F3E8D3',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 28,
  },
  shgAvatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shgTextContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  shgTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  shgSubtitle: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
  },
  /* Trust Footer */
  trustFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    marginTop: 4,
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustText: {
    fontSize: 12,
    color: '#444444',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
    fontWeight: '500',
  },
  trustDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E0D8',
  },
  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  langOptionSelected: {
    backgroundColor: '#F4F8F3',
    borderRadius: 10,
  },
  langOptionText: {
    fontSize: 16,
    color: '#333333',
  },
  langOptionTextSelected: {
    fontWeight: 'bold',
    color: '#3B6029',
  },
  /* New Registration Link */
  newRegisterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  newRegisterPromptText: {
    fontSize: 14,
    color: '#666666',
  },
  newRegisterLinkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3B6029',
    textDecorationLine: 'underline',
  },
  /* Registration Modal */
  regModalContent: {
    width: '94%',
    maxHeight: '85%',
    backgroundColor: '#FAF8F5',
    borderRadius: 24,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  regModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EBE8DF',
    paddingBottom: 12,
  },
  regModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  regModalSub: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  regFieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginTop: 12,
    marginBottom: 6,
  },
  regInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D3CEBE',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  regCountryCode: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginRight: 8,
  },
  regDividerVertical: {
    width: 1,
    height: '60%',
    backgroundColor: '#E2E0D8',
    marginRight: 8,
  },
  regTextInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  categoryContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
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
  regSubmitButton: {
    height: 52,
    backgroundColor: '#3B6029',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#3B6029',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  regSubmitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
