import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

type LangCode = 'hi' | 'en';

interface RecentCustomerItem {
  id: string;
  nameHi: string;
  nameEn: string;
  locationHi: string;
  locationEn: string;
  inquiriesHi: string;
  inquiriesEn: string;
}

const RECENT_CUSTOMERS_DATA: RecentCustomerItem[] = [
  {
    id: '1',
    nameHi: 'राहुल शर्मा',
    nameEn: 'Rahul Sharma',
    locationHi: 'भोपाल, मध्य प्रदेश',
    locationEn: 'Bhopal, Madhya Pradesh',
    inquiriesHi: '20 पूछताछ',
    inquiriesEn: '20 Inquiries',
  },
  {
    id: '2',
    nameHi: 'सीमा ट्रेडर्स',
    nameEn: 'Seema Traders',
    locationHi: 'जयपुर, राजस्थान',
    locationEn: 'Jaipur, Rajasthan',
    inquiriesHi: '12 पूछताछ',
    inquiriesEn: '12 Inquiries',
  },
  {
    id: '3',
    nameHi: 'माला कलेक्शन',
    nameEn: 'Mala Collection',
    locationHi: 'इंदौर, मध्य प्रदेश',
    locationEn: 'Indore, Madhya Pradesh',
    inquiriesHi: '8 पूछताछ',
    inquiriesEn: '8 Inquiries',
  },
];

export default function CustomersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();

  const selectedLang: LangCode = (params.lang as LangCode) || 'hi';
  const isHindi = selectedLang === 'hi';

  const handleChatPress = (customerName: string) => {
    alert(
      isHindi
        ? `${customerName} के साथ चैट शुरू हो रही है...`
        : `Opening chat with ${customerName}...`
    );
  };

  const handleQuickCardPress = (cardTitle: string) => {
    alert(
      isHindi
        ? `${cardTitle} अनुभाग खुल रहा है...`
        : `Opening ${cardTitle} section...`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Header Row: Title, Subtitle, Notification Bell */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextGroup}>
              <Text style={styles.headerTitle}>
                {isHindi ? 'ग्राहक' : 'Customers'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {isHindi
                  ? 'अपने ग्राहकों से जुड़ें और नए अवसर पाएं'
                  : 'Connect with your buyers & find new opportunities'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => router.push({ pathname: '/notifications', params: { lang: selectedLang } })}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={26} color="#1A1A1A" />
              <View style={styles.redBadgeDot} />
            </TouchableOpacity>
          </View>

          {/* "जल्दी से चुनें" (Quick Selection Cards - Stacked Vertically) */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              {isHindi ? 'जल्दी से चुनें' : 'Quick Selection'}
            </Text>

            <View style={styles.quickCardsVerticalGroup}>
              {/* Card 1: My Customers (Green Theme) */}
              <TouchableOpacity
                style={[styles.quickCard, styles.quickCardGreen]}
                onPress={() => router.push({ pathname: '/my-customers', params: { lang: selectedLang } })}
                activeOpacity={0.85}
              >
                <View style={[styles.quickIconCircle, { backgroundColor: '#EAF2E8' }]}>
                  <Ionicons name="people" size={22} color="#3B6029" />
                </View>
                <View style={styles.quickCardTextGroup}>
                  <Text style={styles.quickCardTitle}>
                    {isHindi ? 'मेरे ग्राहक' : 'My Customers'}
                  </Text>
                  <Text style={styles.quickCardDesc}>
                    {isHindi
                      ? 'अपने ग्राहकों से बात करें और ऑर्डर संभालें'
                      : 'Talk with your buyers & manage orders'}
                  </Text>
                </View>
                <View style={[styles.quickArrowCircle, { backgroundColor: '#EAF2E8' }]}>
                  <Ionicons name="arrow-forward" size={14} color="#3B6029" />
                </View>
              </TouchableOpacity>

              {/* Card 2: Bulk Orders (Blue Theme) */}
              <TouchableOpacity
                style={[styles.quickCard, styles.quickCardBlue]}
                onPress={() => router.push({ pathname: '/bulk-orders', params: { lang: selectedLang } })}
                activeOpacity={0.85}
              >
                <View style={[styles.quickIconCircle, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="cube" size={22} color="#1976D2" />
                </View>
                <View style={styles.quickCardTextGroup}>
                  <Text style={styles.quickCardTitle}>
                    {isHindi ? 'बल्क ऑर्डर' : 'Bulk Orders'}
                  </Text>
                  <Text style={styles.quickCardDesc}>
                    {isHindi
                      ? 'बड़े ऑर्डर के अवसर देखें'
                      : 'View big order opportunities'}
                  </Text>
                </View>
                <View style={[styles.quickArrowCircle, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="arrow-forward" size={14} color="#1976D2" />
                </View>
              </TouchableOpacity>

              {/* Card 3: Tenders (Orange Theme) */}
              <TouchableOpacity
                style={[styles.quickCard, styles.quickCardOrange]}
                onPress={() => handleQuickCardPress(isHindi ? 'टेंडर' : 'Tenders')}
                activeOpacity={0.85}
              >
                <View style={[styles.quickIconCircle, { backgroundColor: '#FFF0E6' }]}>
                  <Ionicons name="document-text" size={22} color="#E65100" />
                </View>
                <View style={styles.quickCardTextGroup}>
                  <Text style={styles.quickCardTitle}>
                    {isHindi ? 'टेंडर' : 'Tenders'}
                  </Text>
                  <Text style={styles.quickCardDesc}>
                    {isHindi
                      ? 'सरकारी और निजी टेंडर के अवसर देखें'
                      : 'View Govt & private tender options'}
                  </Text>
                </View>
                <View style={[styles.quickArrowCircle, { backgroundColor: '#FFF0E6' }]}>
                  <Ionicons name="arrow-forward" size={14} color="#E65100" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* "हाल के ग्राहक" (Recent Customers Section) */}
          <View style={styles.sectionContainer}>
            <View style={styles.recentHeaderRow}>
              <Text style={styles.sectionTitle}>
                {isHindi ? 'हाल के ग्राहक' : 'Recent Customers'}
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.viewAllText}>
                  {isHindi ? 'सभी देखें' : 'View All'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* List of Recent Customer Cards */}
            <View style={styles.recentListGroup}>
              {RECENT_CUSTOMERS_DATA.map((customer) => {
                const displayName = isHindi ? customer.nameHi : customer.nameEn;
                const displayLoc = isHindi ? customer.locationHi : customer.locationEn;
                const displayInq = isHindi ? customer.inquiriesHi : customer.inquiriesEn;

                return (
                  <TouchableOpacity
                    key={customer.id}
                    style={styles.recentCustomerCard}
                    onPress={() => handleChatPress(displayName)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.customerAvatarCircle}>
                      <Ionicons name="person-outline" size={22} color="#3B6029" />
                    </View>

                    <View style={styles.customerInfoGroup}>
                      <Text style={styles.customerName}>{displayName}</Text>
                      <Text style={styles.customerLoc}>{displayLoc}</Text>

                      <View style={styles.inquiryBadgePill}>
                        <Text style={styles.inquiryBadgeText}>{displayInq}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.chatButton}
                      onPress={() => handleChatPress(displayName)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="chatbubble" size={14} color="#3B6029" style={{ marginRight: 4 }} />
                      <Text style={styles.chatButtonText}>
                        {isHindi ? 'चैट करें' : 'Chat'}
                      </Text>
                    </TouchableOpacity>

                    <Ionicons name="chevron-forward" size={18} color="#999999" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Tender Alert Banner ("नई टेंडर सूचनाएं पाएं") */}
          <View style={styles.tenderAlertBanner}>
            <Image
              source={require('@/assets/images/tender_illustration.png')}
              style={styles.tenderIllustration}
              resizeMode="contain"
            />

            <View style={styles.tenderTextGroup}>
              <Text style={styles.tenderTitle}>
                {isHindi ? 'नई टेंडर सूचनाएं पाएं' : 'Get New Tender Alerts'}
              </Text>
              <Text style={styles.tenderSubtitle}>
                {isHindi
                  ? 'समय पर जानकारी पाएं और अपने उत्पादों के लिए बेहतर अवसर प्राप्त करें।'
                  : 'Get timely info & better opportunities for your products.'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.tenderAlertButton}
              onPress={() => alert(isHindi ? 'टेंडर अलर्ट सेट हो गया है!' : 'Tender Alert Set!')}
              activeOpacity={0.85}
            >
              <Ionicons name="notifications" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.tenderAlertButtonText}>
                {isHindi ? 'टेंडर अलर्ट सेट करें' : 'Set Alert'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Scenic Village Sketch Overlay at Bottom of Screen */}
          <View style={styles.sketchWrapper}>
            <Image
              source={require('@/assets/images/village_sketch.png')}
              style={styles.sketchImage}
              resizeMode="contain"
            />
          </View>
        </ScrollView>

        {/* Bottom Navigation Bar (4 Tabs) */}
        <View style={styles.bottomNavContainer}>
          {/* Tab 1: Home */}
          <TouchableOpacity
            style={styles.navTab}
            onPress={() => router.push({ pathname: '/home', params: { lang: selectedLang } })}
            activeOpacity={0.7}
          >
            <Ionicons name="home-outline" size={22} color="#666666" />
            <Text style={styles.navTabText}>{isHindi ? 'होम' : 'Home'}</Text>
          </TouchableOpacity>

          {/* Tab 2: Products */}
          <TouchableOpacity
            style={styles.navTab}
            onPress={() => router.push({ pathname: '/products', params: { lang: selectedLang } })}
            activeOpacity={0.7}
          >
            <Ionicons name="cube-outline" size={22} color="#666666" />
            <Text style={styles.navTabText}>{isHindi ? 'उत्पाद' : 'Products'}</Text>
          </TouchableOpacity>

          {/* Tab 3: Customers (Active) */}
          <TouchableOpacity
            style={styles.navTab}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <Ionicons name="people" size={22} color="#3B6029" />
            <Text style={[styles.navTabText, styles.navTabTextActive]}>
              {isHindi ? 'ग्राहक' : 'Customers'}
            </Text>
          </TouchableOpacity>

          {/* Tab 4: Profile */}
          <TouchableOpacity
            style={styles.navTab}
            onPress={() => router.push({ pathname: '/profile', params: { lang: selectedLang } })}
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={22} color="#666666" />
            <Text style={styles.navTabText}>{isHindi ? 'प्रोफाइल' : 'Profile'}</Text>
          </TouchableOpacity>
        </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  /* Header Row */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 8,
    paddingBottom: 16,
  },
  headerTextGroup: {
    flex: 1,
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEA',
    elevation: 1,
  },
  redBadgeDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  /* Section Containers */
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  /* Quick Cards Vertical Stack */
  quickCardsVerticalGroup: {
    gap: 12,
  },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  quickCardGreen: {
    backgroundColor: '#F8FCF7',
    borderColor: '#E3F0E0',
  },
  quickCardBlue: {
    backgroundColor: '#F5F9FF',
    borderColor: '#E1EDFF',
  },
  quickCardOrange: {
    backgroundColor: '#FFFBF5',
    borderColor: '#FFE8D6',
  },
  quickIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  quickCardTextGroup: {
    flex: 1,
    paddingRight: 8,
  },
  quickCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  quickCardDesc: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  quickArrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Recent Customers Section */
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  recentListGroup: {
    gap: 10,
  },
  recentCustomerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EFEA',
    elevation: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  customerAvatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  customerInfoGroup: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  customerLoc: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  inquiryBadgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F7ED',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  inquiryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B6029',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  chatButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B6029',
  },
  /* Tender Alert Banner */
  tenderAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F8F3',
    borderWidth: 1,
    borderColor: '#E2EFE0',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  tenderIllustration: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 10,
  },
  tenderTextGroup: {
    flex: 1,
    paddingRight: 6,
  },
  tenderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  tenderSubtitle: {
    fontSize: 11,
    color: '#555555',
    lineHeight: 15,
  },
  tenderAlertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tenderAlertButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  /* Bottom Village Sketch Overlay */
  sketchWrapper: {
    width: '100%',
    height: 100,
    marginTop: 4,
    overflow: 'hidden',
  },
  sketchImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  /* Bottom Navigation Bar */
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 64,
    marginHorizontal: 16,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#F0EFEA',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  navTabText: {
    fontSize: 11,
    color: '#666666',
    marginTop: 3,
    fontWeight: '500',
  },
  navTabTextActive: {
    color: '#3B6029',
    fontWeight: 'bold',
  },
});
