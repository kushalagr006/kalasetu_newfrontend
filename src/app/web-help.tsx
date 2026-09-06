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
import { useRouter, useLocalSearchParams } from 'expo-router';

type LangCode = 'hi' | 'en';

interface FAQItem {
  id: string;
  questionHi: string;
  questionEn: string;
  answerHi: string;
  answerEn: string;
}

const FAQS_DATA: FAQItem[] = [
  {
    id: '1',
    questionHi: 'कलासेतु पर सरकारी टेंडर के लिए कैसे आवेदन करें?',
    questionEn: 'How to apply for Govt Tenders on KalaSetu?',
    answerHi: 'सरकारी खरीदार पोर्टल पर जाएं या अपने पंजीकृत SHG समूह के साथ टेंडर सेक्शन में जाकर दस्तावेज़ जमा करें।',
    answerEn: 'Go to the Govt Buyer portal or submit documents through your registered SHG group in the tenders section.',
  },
  {
    id: '2',
    questionHi: 'ग्रामीण कलाकारों को भुगतान कैसे प्राप्त होता है?',
    questionEn: 'How do rural artisans receive payments?',
    answerHi: 'सभी भुगतान 100% सुरक्षित डायरेक्ट बैंक ट्रांसफर (DBT) और UPI के माध्यम से सीधे कलाकार के बैंक खाते में जमा होते हैं।',
    answerEn: 'All payments are directly credited to the artisan bank account via 100% secure Direct Bank Transfer (DBT) & UPI.',
  },
  {
    id: '3',
    questionHi: 'यदि प्राप्त उत्पाद डैमेज या खराब मिले तो क्या करें?',
    questionEn: 'What to do if received product is damaged?',
    answerHi: 'आप 7 दिनों के भीतर सहायता केंद्र पर शिकायत दर्ज कर सकते हैं। हमारी टीम तुरंत रिप्लेसमेंट या 100% रिफंड प्रोसेस करेगी।',
    answerEn: 'You can log a complaint at Help Centre within 7 days. Our team will process immediate replacement or 100% refund.',
  },
  {
    id: '4',
    questionHi: 'टोल-फ्री हेल्पलाइन नंबर पर संपर्क करने का समय क्या है?',
    questionEn: 'What are the helpline operating hours?',
    answerHi: 'हमारा टोल-फ्री नंबर 1800-123-4567 सोमवार से शनिवार, सुबह 9:00 बजे से शाम 8:00 बजे तक उपलब्ध है।',
    answerEn: 'Our toll-free number 1800-123-4567 is active Mon-Sat from 9:00 AM to 8:00 PM.',
  },
];

export default function WebHelpPortalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 850;

  const [selectedLang, setSelectedLang] = useState<LangCode>((params.lang as LangCode) || 'en');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('1');

  const isHindi = selectedLang === 'hi';

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Support Portal Header */}
        <View style={styles.headerBar}>
          <View style={styles.headerLeftGroup}>
            <Ionicons name="headset" size={28} color="#C65A28" style={{ marginRight: 10 }} />
            <View>
              <Text style={styles.headerTitle}>
                {isHindi ? 'कलासेतु | सहायता एवं मदद केंद्र' : 'KalaSetu | Help & Support Centre'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {isHindi ? '24x7 ग्राहक और कलाकार सहायता पोर्टल' : '24x7 Customer & Artisan Support Portal'}
              </Text>
            </View>
          </View>

          <View style={styles.headerRightGroup}>

            <View style={styles.helplineBadge}>
              <Ionicons name="call" size={16} color="#3B6029" style={{ marginRight: 6 }} />
              <Text style={styles.helplineText}>1800-123-4567</Text>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={() => router.push('/web-login')}>
              <Ionicons name="log-out-outline" size={20} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Support Hero Banner */}
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>
              {isHindi ? 'हम आपकी कैसे सहायता कर सकते हैं? 🎧' : 'How can we help you today? 🎧'}
            </Text>
            <Text style={styles.heroSubtitle}>
              {isHindi
                ? 'अपने प्रश्नों का तुरंत समाधान पाएं या हमारी सहायता टीम से सीधे संपर्क करें।'
                : 'Get instant answers to your queries or reach out to our support team directly.'}
            </Text>

            <View style={styles.heroSearchBox}>
              <Ionicons name="search-outline" size={20} color="#777777" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.heroSearchInput}
                placeholder={isHindi ? 'अपनी समस्या या प्रश्न यहाँ खोजें...' : 'Search your query or issue here...'}
                placeholderTextColor="#999999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Sahayata Kendra Direct Link Banner */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#2E7D32',
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 16,
                marginTop: 14,
                alignSelf: 'center',
              }}
              onPress={() => router.push('/web-helper')}
              activeOpacity={0.85}
            >
              <Ionicons name="business" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' }}>
                {isHindi ? '🏢 जिला सहायता केंद्र पोर्टल पर जाएं (Helper Dashboard) →' : '🏢 Visit District Sahayata Kendra Portal →'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Support Category Cards (4 Cards Grid) */}
          <View style={[styles.categoryGrid, isDesktop ? styles.categoryGridDesktop : styles.categoryGridMobile]}>
            {/* Card 1 */}
            <TouchableOpacity style={styles.supportCategoryCard} activeOpacity={0.8}>
              <View style={[styles.categoryIconCircle, { backgroundColor: '#EAF2E8' }]}>
                <Ionicons name="cube-outline" size={24} color="#3B6029" />
              </View>
              <Text style={styles.supportCategoryTitle}>{isHindi ? 'ऑर्डर और डिलीवरी' : 'Orders & Delivery'}</Text>
              <Text style={styles.supportCategoryDesc}>{isHindi ? 'ऑर्डर ट्रैक करें, डिलीवरी स्टेटस जानकारी' : 'Track orders & delivery status'}</Text>
            </TouchableOpacity>

            {/* Card 2 */}
            <TouchableOpacity style={styles.supportCategoryCard} activeOpacity={0.8}>
              <View style={[styles.categoryIconCircle, { backgroundColor: '#FFF0E6' }]}>
                <Ionicons name="card-outline" size={24} color="#C65A28" />
              </View>
              <Text style={styles.supportCategoryTitle}>{isHindi ? 'भुगतान और रिफंड' : 'Payment & Refunds'}</Text>
              <Text style={styles.supportCategoryDesc}>{isHindi ? 'यूपीआई, बैंक ट्रांसफर व रिफंड स्थिति' : 'UPI, Direct Transfer & Refund status'}</Text>
            </TouchableOpacity>

            {/* Card 3 */}
            <TouchableOpacity style={styles.supportCategoryCard} activeOpacity={0.8}>
              <View style={[styles.categoryIconCircle, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="business-outline" size={24} color="#1976D2" />
              </View>
              <Text style={styles.supportCategoryTitle}>{isHindi ? 'सरकारी टेंडर मदद' : 'Govt Tender Help'}</Text>
              <Text style={styles.supportCategoryDesc}>{isHindi ? 'टेंडर आवेदन, सब्सिडी व पात्रता मदद' : 'Tender application & subsidy help'}</Text>
            </TouchableOpacity>

            {/* Card 4 */}
            <TouchableOpacity style={styles.supportCategoryCard} activeOpacity={0.8}>
              <View style={[styles.categoryIconCircle, { backgroundColor: '#EAF2E8' }]}>
                <Ionicons name="person-outline" size={24} color="#3B6029" />
              </View>
              <Text style={styles.supportCategoryTitle}>{isHindi ? 'अकाउंट समस्या' : 'Account Issues'}</Text>
              <Text style={styles.supportCategoryDesc}>{isHindi ? 'लॉगिन, ओटीपी व खाता अपडेट मदद' : 'Login, OTP & profile updates'}</Text>
            </TouchableOpacity>
          </View>

          {/* Frequently Asked Questions (FAQ Section) */}
          <View style={styles.faqSectionCard}>
            <Text style={styles.sectionTitle}>
              {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions'}
            </Text>

            <View style={styles.faqListGroup}>
              {FAQS_DATA.map((faq) => {
                const isOpen = openFaqId === faq.id;
                const question = isHindi ? faq.questionHi : faq.questionEn;
                const answer = isHindi ? faq.answerHi : faq.answerEn;

                return (
                  <View key={faq.id} style={styles.faqItemCard}>
                    <TouchableOpacity
                      style={styles.faqQuestionRow}
                      onPress={() => toggleFaq(faq.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.faqQuestionText}>{question}</Text>
                      <Ionicons
                        name={isOpen ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#C65A28"
                      />
                    </TouchableOpacity>

                    {isOpen && <Text style={styles.faqAnswerText}>{answer}</Text>}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Live Contact & Help Banner */}
          <View style={styles.contactBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactBannerTitle}>
                {isHindi ? 'क्या आपको अतिरिक्त सहायता की आवश्यकता है?' : 'Do you need additional assistance?'}
              </Text>
              <Text style={styles.contactBannerSubtitle}>
                {isHindi
                  ? 'हमारी 24x7 सहायता टीम आपकी मदद के लिए सदैव तत्पर है।'
                  : 'Our 24x7 support team is always ready to assist you.'}
              </Text>
            </View>

            <TouchableOpacity style={styles.startChatBtn} onPress={() => alert('Live Chat starting...')}>
              <Ionicons name="chatbubbles" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.startChatBtnText}>{isHindi ? 'लाइव चैट शुरू करें' : 'Start Live Chat'}</Text>
            </TouchableOpacity>
          </View>
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
  /* Header Bar */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E0D8',
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C65A28',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#666666',
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0E6',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFE8D6',
  },
  langBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#C65A28',
  },
  helplineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F8F3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C5D8C1',
  },
  helplineText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  logoutBtn: {
    padding: 6,
  },
  /* Scroll & Content */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E0D8',
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
  },
  heroSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: '#C65A28',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    width: '100%',
    maxWidth: 600,
  },
  heroSearchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  /* Category Grid */
  categoryGrid: {
    gap: 16,
    marginBottom: 24,
  },
  categoryGridDesktop: {
    flexDirection: 'row',
  },
  categoryGridMobile: {
    flexDirection: 'column',
  },
  supportCategoryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E0D8',
    elevation: 1.5,
  },
  categoryIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  supportCategoryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  supportCategoryDesc: {
    fontSize: 11,
    color: '#666666',
    lineHeight: 16,
  },
  /* FAQ Section */
  faqSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E0D8',
    padding: 24,
    marginBottom: 24,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  faqListGroup: {
    gap: 12,
  },
  faqItemCard: {
    backgroundColor: '#FAF8F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAE7E0',
    padding: 16,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
    paddingRight: 10,
  },
  faqAnswerText: {
    fontSize: 13,
    color: '#555555',
    marginTop: 10,
    lineHeight: 18,
    borderTopWidth: 1,
    borderTopColor: '#EBE8E0',
    paddingTop: 8,
  },
  /* Contact Banner */
  contactBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBF5',
    borderWidth: 1,
    borderColor: '#FFE8D6',
    borderRadius: 20,
    padding: 20,
    flexWrap: 'wrap',
    gap: 16,
  },
  contactBannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C65A28',
    marginBottom: 2,
  },
  contactBannerSubtitle: {
    fontSize: 12,
    color: '#666666',
  },
  startChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C65A28',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  startChatBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
