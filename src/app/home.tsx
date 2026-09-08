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
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArtisanFloatingNav } from '@/components/ArtisanFloatingNav';
import { useGlobalLang, setGlobalLang, ALL_LANGUAGES, LangCode } from '@/utils/languageStore';
import { getUITranslations } from '@/utils/translations';

type ActiveTab = 'home' | 'products' | 'customers' | 'profile';

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const [globalLang] = useGlobalLang();

  const initialLang: LangCode = (params.lang as LangCode) || globalLang || 'hi';
  const [selectedLang, setSelectedLangState] = useState<LangCode>(initialLang);

  React.useEffect(() => {
    if (globalLang) {
      setSelectedLangState(globalLang);
    }
  }, [globalLang]);

  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  const t = getUITranslations(selectedLang);
  const currentLangObj = ALL_LANGUAGES.find((l) => l.code === selectedLang) || ALL_LANGUAGES[1];
  const currentLangLabel = `${currentLangObj.nativeName} (${currentLangObj.englishName})`;

  const handleLanguageChange = (code: LangCode) => {
    setSelectedLangState(code);
    setGlobalLang(code);
    setIsLangModalVisible(false);
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
          {/* Top Header: Greeting, Notification Bell, Language Selector */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.greetingText}>{t.greeting}</Text>
              <TouchableOpacity
                style={styles.langSelector}
                onPress={() => setIsLangModalVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.langText}>{currentLangLabel}</Text>
                <Ionicons name="chevron-down" size={14} color="#2C2C2C" />
              </TouchableOpacity>
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

          {/* Primary CTA Button: Add New Product */}
          <TouchableOpacity
            style={styles.addProductButton}
            onPress={() => router.push({ pathname: '/add-product', params: { lang: selectedLang } })}
            activeOpacity={0.88}
          >
            <View style={styles.plusIconCircle}>
              <Ionicons name="add" size={28} color="#3B6029" />
            </View>
            <Text style={styles.addProductText}>{t.addProduct}</Text>
          </TouchableOpacity>

          {/* Product Statistics Card (Clicking opens All Uploaded Products) */}
          <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => router.push({ pathname: '/products', params: { lang: selectedLang } })}
            activeOpacity={0.88}
          >
            <View style={styles.cardHeaderRow}>
              <Ionicons name="cube-outline" size={20} color="#3B6029" style={{ marginRight: 8 }} />
              <Text style={styles.cardHeaderTitle}>{t.yourProducts}</Text>
              <Ionicons name="chevron-forward" size={18} color="#777777" style={{ marginLeft: 'auto' }} />
            </View>

            <View style={styles.statsMetricsRow}>
              {/* Metric 1: Total Products */}
              <TouchableOpacity
                style={styles.metricItem}
                onPress={() => router.push({ pathname: '/products', params: { lang: selectedLang } })}
                activeOpacity={0.7}
              >
                <View style={[styles.metricIconCircle, { backgroundColor: '#EAF2E8' }]}>
                  <Ionicons name="cube-outline" size={24} color="#3B6029" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={[styles.metricNumber, { color: '#3B6029' }]}>12</Text>
                  <Text style={styles.metricLabel}>{t.totalProducts}</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.verticalDivider} />

              {/* Metric 2: Total Orders */}
              <TouchableOpacity
                style={styles.metricItem}
                onPress={() => router.push({ pathname: '/product-chats', params: { lang: selectedLang } })}
                activeOpacity={0.7}
              >
                <View style={[styles.metricIconCircle, { backgroundColor: '#FFF0E6' }]}>
                  <Ionicons name="clipboard-outline" size={24} color="#E65100" />
                </View>
                <View style={styles.metricTextGroup}>
                  <Text style={[styles.metricNumber, { color: '#E65100' }]}>3</Text>
                  <Text style={styles.metricLabel}>{t.totalOrders}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* Sales Summary Card */}
          <TouchableOpacity
            style={styles.salesCard}
            onPress={() => router.push({ pathname: '/product-chats', params: { lang: selectedLang } })}
            activeOpacity={0.88}
          >
            <View style={styles.salesBagCircle}>
              <Ionicons name="wallet-outline" size={26} color="#4E342E" />
            </View>
            <View style={styles.salesTextContainer}>
              <Text style={styles.salesLabel}>{t.salesTillDate}</Text>
              <Text style={styles.salesAmount}>₹2,450</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#777777" />
          </TouchableOpacity>

          {/* Orders Section (Clicking opens Customer Purchase Chat) */}
          <View style={styles.recentOrdersCard}>
            <View style={styles.recentHeaderRow}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                onPress={() => router.push({ pathname: '/product-chats', params: { lang: selectedLang } })}
                activeOpacity={0.7}
              >
                <Ionicons name="clipboard-outline" size={20} color="#3B6029" style={{ marginRight: 6 }} />
                <Text style={styles.recentHeaderTitle}>{t.recentOrders}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/product-chats', params: { lang: selectedLang } })}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>{t.viewAll}</Text>
              </TouchableOpacity>
            </View>

            {/* Order Item 1 */}
            <TouchableOpacity
              style={styles.orderRowItem}
              onPress={() => router.push({ pathname: '/product-chats', params: { lang: selectedLang } })}
              activeOpacity={0.85}
            >
              <View style={styles.orderBadgeCircle}>
                <Ionicons name="cart-outline" size={22} color="#3B6029" />
              </View>
              <View style={styles.orderTextGroup}>
                <Text style={styles.orderTitle}>{t.order1Title}</Text>
                <Text style={styles.orderSub}>{t.order1Sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>

            <View style={styles.orderDividerLine} />

            {/* Order Item 2 */}
            <TouchableOpacity
              style={styles.orderRowItem}
              onPress={() => router.push({ pathname: '/product-chats', params: { lang: selectedLang } })}
              activeOpacity={0.85}
            >
              <View style={[styles.orderBadgeCircle, { backgroundColor: '#FFF0E6' }]}>
                <Ionicons name="gift-outline" size={22} color="#E65100" />
              </View>
              <View style={styles.orderTextGroup}>
                <Text style={styles.orderTitle}>{t.order2Title}</Text>
                <Text style={styles.orderSub}>{t.order2Sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CCCCCC" />
            </TouchableOpacity>
          </View>

          {/* Non-Working View Government Schemes Button */}
          <TouchableOpacity
            style={styles.viewGovtSchemesBtn}
            onPress={() => {}}
            activeOpacity={1}
          >
            <Ionicons name="document-text-outline" size={20} color="#3B6029" style={{ marginRight: 8 }} />
            <Text style={styles.viewGovtSchemesBtnText}>{t.viewGovtSchemes}</Text>
          </TouchableOpacity>

          {/* Non-Working Sales Growth Artisan Tip Card */}
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>{t.tipTitle}</Text>
            <Text style={styles.tipBody}>{t.tipBody}</Text>
          </View>

          {/* Village Line Art Background Overlay */}
          <View style={styles.sketchWrapper}>
            <Image
              source={require('@/assets/images/village_sketch.png')}
              style={styles.sketchImage}
              resizeMode="contain"
            />
          </View>
        </ScrollView>

        {/* Floating Action Chat Button (Navigates to Product Chats) */}
        <TouchableOpacity
          style={styles.floatingChatButton}
          onPress={() => router.push({ pathname: '/product-chats', params: { lang: selectedLang } })}
          activeOpacity={0.85}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Persistent Floating Pill Bottom Navigation Bar */}
        <ArtisanFloatingNav activeTab="home" selectedLang={selectedLang} />

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
              <Text style={styles.modalTitle}>Select Language / भाषा चुनें</Text>
              <FlatList
                data={ALL_LANGUAGES}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.langOption,
                      selectedLang === item.code && styles.langOptionSelected,
                    ]}
                    onPress={() => handleLanguageChange(item.code)}
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
    paddingBottom: 100,
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
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  langText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C2C2C',
    marginRight: 4,
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
  /* Primary CTA: Add Product */
  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B6029',
    borderRadius: 16,
    height: 64,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#3B6029',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  plusIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addProductText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  /* Product Stats Card */
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0EFEA',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statsMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  metricTextGroup: {
    justifyContent: 'center',
  },
  metricNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#EFEFEA',
  },
  /* Sales Card */
  salesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0EFEA',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  salesBagCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F5ECE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  salesTextContainer: {
    flex: 1,
  },
  salesLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 2,
  },
  salesAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4E342E',
  },
  /* Recent Orders Section */
  recentOrdersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0EFEA',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  recentHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  orderRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  orderBadgeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF2E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  orderTextGroup: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  orderSub: {
    fontSize: 12,
    color: '#666666',
  },
  orderDividerLine: {
    height: 1,
    backgroundColor: '#F5F4EF',
    marginVertical: 8,
  },
  /* Non-Working View Government Schemes Button */
  viewGovtSchemesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#3B6029',
    borderRadius: 16,
    height: 52,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  viewGovtSchemesBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  /* Sales Growth Tip Card */
  tipCard: {
    backgroundColor: '#FDF7EC',
    borderWidth: 1,
    borderColor: '#F3E8D3',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  tipBody: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
  },
  /* Sketch Overlay */
  sketchWrapper: {
    width: '100%',
    height: 120,
    marginTop: 4,
    overflow: 'hidden',
  },
  sketchImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  /* Floating Chat FAB */
  floatingChatButton: {
    position: 'absolute',
    right: 20,
    bottom: 84,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B6029',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#3B6029',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    zIndex: 99,
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
  navTabTextActiveProduct: {
    color: '#E65100',
    fontWeight: 'bold',
  },
  navTabTextActiveCustomer: {
    color: '#5E35B1',
    fontWeight: 'bold',
  },
  navTabTextActiveProfile: {
    color: '#1976D2',
    fontWeight: 'bold',
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
});
