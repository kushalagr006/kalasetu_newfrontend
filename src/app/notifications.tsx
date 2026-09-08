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
import { useGlobalLang } from '@/utils/languageStore';

type LangCode = 'hi' | 'en';
type FilterCategory = 'all' | 'orders' | 'sales' | 'updates';

interface NotificationItem {
  id: string;
  category: 'orders' | 'sales' | 'updates';
  titleHi: string;
  titleEn: string;
  messageHi: string;
  messageEn: string;
  timeHi: string;
  timeEn: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  isUnread: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    category: 'orders',
    titleHi: 'नई ऑर्डर इंक्वायरी मिली!',
    titleEn: 'New Order Inquiry Received!',
    messageHi: "रमेश कुमार ने 'सजावटी मिट्टी का घड़ा' (₹450) का ऑर्डर भेजा है।",
    messageEn: "Ramesh Kumar placed an order for 'Decorative Clay Pot' (₹450).",
    timeHi: '10 मिनट पहले',
    timeEn: '10 mins ago',
    iconName: 'cube-outline',
    iconColor: '#3B6029',
    iconBg: '#EAF2E8',
    isUnread: true,
  },
  {
    id: '2',
    category: 'sales',
    titleHi: 'भुगतान प्राप्त हुआ!',
    titleEn: 'Payment Received!',
    messageHi: 'प्रिया वर्मा से ₹2,000 की राशि आपके कलासेतु खाते में जमा हो गई है।',
    messageEn: 'Amount of ₹2,000 from Priya Verma credited to your KalaSetu account.',
    timeHi: '1 घंटे पहले',
    timeEn: '1 hr ago',
    iconName: 'wallet-outline',
    iconColor: '#E65100',
    iconBg: '#FFF0E6',
    isUnread: true,
  },
  {
    id: '3',
    category: 'updates',
    titleHi: 'कलाकार सब्सिडी योजना 2024 📢',
    titleEn: 'Artisan Subsidy Scheme 2024 📢',
    messageHi: 'राज्य सरकार द्वारा हस्तशिल्प कलाकारों के लिए ₹15,000 की वित्तीय सहायता योजना शुरू हुई है।',
    messageEn: 'Financial assistance scheme of ₹15,000 for artisans launched by State Govt.',
    timeHi: 'कल, 4:30 PM',
    timeEn: 'Yesterday, 4:30 PM',
    iconName: 'megaphone-outline',
    iconColor: '#1976D2',
    iconBg: '#E3F2FD',
    isUnread: false,
  },
  {
    id: '4',
    category: 'updates',
    titleHi: 'प्रोफाइल सहेजी गई',
    titleEn: 'Profile Information Saved',
    messageHi: "आपकी दुकान 'सुनीता क्राफ्टस' का विवरण सफलतापूर्वक अपडेट कर दिया गया है।",
    messageEn: "Your shop 'Sunita Crafts' details updated successfully.",
    timeHi: '2 दिन पहले',
    timeEn: '2 days ago',
    iconName: 'checkmark-circle-outline',
    iconColor: '#5E35B1',
    iconBg: '#F3E5F5',
    isUnread: false,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const [globalLang] = useGlobalLang();

  const selectedLang: LangCode = (params.lang as LangCode) || globalLang || 'hi';
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');

  const isHindi = selectedLang === 'hi';

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isUnread: false }))
    );
  };

  const handleNotificationTap = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isUnread: false } : item))
    );
  };

  const filteredNotifications = notifications.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.category === selectedFilter;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" translucent={false} />
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {isHindi ? 'सूचनाएं' : 'Notifications'}
          </Text>

          <TouchableOpacity onPress={markAllAsRead} activeOpacity={0.7}>
            <Text style={styles.markReadText}>
              {isHindi ? 'सब पढ़ें' : 'Mark all read'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter Chips */}
        <View style={styles.filterChipContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity
              style={[
                styles.chip,
                selectedFilter === 'all' && styles.chipActive,
              ]}
              onPress={() => setSelectedFilter('all')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedFilter === 'all' && styles.chipTextActive,
                ]}
              >
                {isHindi ? 'सभी' : 'All'} ({notifications.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chip,
                selectedFilter === 'orders' && styles.chipActive,
              ]}
              onPress={() => setSelectedFilter('orders')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedFilter === 'orders' && styles.chipTextActive,
                ]}
              >
                {isHindi ? 'ऑर्डर' : 'Orders'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chip,
                selectedFilter === 'sales' && styles.chipActive,
              ]}
              onPress={() => setSelectedFilter('sales')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedFilter === 'sales' && styles.chipTextActive,
                ]}
              >
                {isHindi ? 'बिक्री' : 'Sales'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.chip,
                selectedFilter === 'updates' && styles.chipActive,
              ]}
              onPress={() => setSelectedFilter('updates')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedFilter === 'updates' && styles.chipTextActive,
                ]}
              >
                {isHindi ? 'सूचनाएं' : 'Updates'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Notifications Scroll List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="notifications-off-outline" size={48} color="#CCCCCC" />
              <Text style={styles.emptyStateText}>
                {isHindi ? 'कोई सूचना नहीं है' : 'No notifications available'}
              </Text>
            </View>
          ) : (
            filteredNotifications.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.notificationCard,
                  item.isUnread && styles.notificationCardUnread,
                ]}
                onPress={() => handleNotificationTap(item.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.iconName} size={22} color={item.iconColor} />
                </View>

                <View style={styles.notificationContent}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardTitle}>
                      {isHindi ? item.titleHi : item.titleEn}
                    </Text>
                    {item.isUnread && <View style={styles.unreadBadgeDot} />}
                  </View>

                  <Text style={styles.cardMessage}>
                    {isHindi ? item.messageHi : item.messageEn}
                  </Text>

                  <Text style={styles.cardTime}>
                    {isHindi ? item.timeHi : item.timeEn}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}

          {/* Village Line Art Background Overlay */}
          <View style={styles.sketchWrapper}>
            <Image
              source={require('@/assets/images/village_sketch.png')}
              style={styles.sketchImage}
              resizeMode="contain"
            />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? 8 : 12) : 8,
    paddingBottom: 12,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  markReadText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3B6029',
  },
  /* Filter Chips */
  filterChipContainer: {
    marginBottom: 12,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E0D8',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipActive: {
    backgroundColor: '#3B6029',
    borderColor: '#3B6029',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  /* Scroll Content */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  /* Notification Cards */
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0EFEA',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  notificationCardUnread: {
    borderColor: '#C2DEC0',
    backgroundColor: '#FAFDF9',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  notificationContent: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
  },
  unreadBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B6029',
    marginLeft: 6,
  },
  cardMessage: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
    marginBottom: 6,
  },
  cardTime: {
    fontSize: 11,
    color: '#888888',
    fontWeight: '500',
  },
  /* Empty State */
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#777777',
    marginTop: 12,
  },
  /* Sketch Overlay */
  sketchWrapper: {
    width: '100%',
    height: 100,
    marginTop: 16,
    overflow: 'hidden',
  },
  sketchImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
});
