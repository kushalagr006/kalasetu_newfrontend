import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalLang } from '@/utils/languageStore';

export type CustNavKey =
  | 'dashboard'
  | 'home'
  | 'buyProducts'
  | 'tenders'
  | 'myOrders'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'categories'
  | 'findArtisans'
  | 'trackOrder'
  | 'wishlist'
  | 'messages';

const TRANSLATIONS = {
  hi: {
    dashboard: 'डैशबोर्ड',
    home: 'होम',
    buyProducts: 'उत्पाद खरीदें',
    tenders: 'टेंडर',
    myOrders: 'मेरे ऑर्डर',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    categories: 'श्रेणियाँ',
    findArtisans: 'कारीगर खोजें',
    trackOrder: 'ऑर्डर ट्रैक करें',
    wishlist: 'मेरी इच्छाएं',
    messages: 'संदेश',
    logout: 'लॉगआउट',
    searchPlaceholder: 'उत्पाद, श्रेणियां खोजें...',
    searchBtn: 'खोजें',
    wishlistBadge: 'इच्छाएं',
    cartBadge: 'कार्ट',
    userName: 'अमन',
    userRole: 'ग्राहक',
    notificationsBadge: 'सूचनाएं',
  },
  en: {
    dashboard: 'Dashboard',
    home: 'Home',
    buyProducts: 'Buy Products',
    tenders: 'Tenders',
    myOrders: 'My Orders',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    categories: 'Categories',
    findArtisans: 'Find Artisans',
    trackOrder: 'Track Order',
    wishlist: 'My Wishlist',
    messages: 'Messages',
    logout: 'Logout',
    searchPlaceholder: 'Search for products, categories...',
    searchBtn: 'Search',
    wishlistBadge: 'Wishlist',
    cartBadge: 'Cart',
    userName: 'Aman',
    userRole: 'Customer',
    notificationsBadge: 'Notifications',
  },
};

interface CustSidebarProps {
  activeKey: CustNavKey;
}

export function CustSidebar({ activeKey }: CustSidebarProps) {
  const router = useRouter();
  const [selectedLang] = useGlobalLang();
  const t = TRANSLATIONS[selectedLang as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const navItems = [
    {
      key: 'dashboard',
      label: t.dashboard,
      iconOutline: 'home-outline' as const,
      iconSolid: 'home' as const,
      route: '/customer-dashboard',
    },
    {
      key: 'buyProducts',
      label: t.buyProducts,
      iconOutline: 'cart-outline' as const,
      iconSolid: 'cart' as const,
      route: '/customer-buy-products',
    },
    {
      key: 'tenders',
      label: t.tenders,
      iconOutline: 'document-text-outline' as const,
      iconSolid: 'document-text' as const,
      route: '/govt-tenders',
    },
    {
      key: 'myOrders',
      label: t.myOrders,
      iconOutline: 'briefcase-outline' as const,
      iconSolid: 'briefcase' as const,
      route: '/customer-my-orders',
    },
    {
      key: 'notifications',
      label: t.notifications,
      iconOutline: 'notifications-outline' as const,
      iconSolid: 'notifications' as const,
      badge: '3',
      route: '/customer-notifications',
    },
    {
      key: 'profile',
      label: t.profile,
      iconOutline: 'person-outline' as const,
      iconSolid: 'person' as const,
      route: '/customer-profile',
    },
    {
      key: 'settings',
      label: t.settings,
      iconOutline: 'settings-outline' as const,
      iconSolid: 'settings' as const,
      route: '/govt-settings',
    },
  ];

  return (
    <View style={sidebarStyles.sidebarCol}>
      <View style={sidebarStyles.sidebarTopGroup}>
        <View style={sidebarStyles.sidebarMenuGroup}>
          {navItems.map((item) => {
            const isActive = activeKey === item.key || (activeKey === 'home' && item.key === 'dashboard');
            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  sidebarStyles.navItem,
                  isActive && sidebarStyles.navItemActive,
                ]}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isActive ? item.iconSolid : item.iconOutline}
                  size={18}
                  color={isActive ? '#3B6029' : '#555555'}
                  style={sidebarStyles.navIcon}
                />
                <Text
                  style={[
                    sidebarStyles.navText,
                    isActive && sidebarStyles.navTextActive,
                  ]}
                >
                  {item.label}
                </Text>
                {item.badge && (
                  <View style={sidebarStyles.sidebarBadge}>
                    <Text style={sidebarStyles.sidebarBadgeText}>{item.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Sidebar Bottom Logout */}
      <View style={sidebarStyles.sidebarBottomGroup}>
        <TouchableOpacity
          style={sidebarStyles.navItem}
          onPress={() => router.push('/login')}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={18} color="#555555" style={sidebarStyles.navIcon} />
          <Text style={sidebarStyles.navText}>{t.logout}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function CustTopHeader() {
  const router = useRouter();
  const t = TRANSLATIONS.en;

  return (
    <View style={headerStyles.headerBar}>
      {/* Left Group: Brand Logo & Hamburger */}
      <View style={headerStyles.headerLeftGroup}>
        <TouchableOpacity onPress={() => router.push('/customer-dashboard')}>
          <Image
            source={require('@/assets/images/logo_icon.png')}
            style={headerStyles.logoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Center Search Bar */}
      <View style={headerStyles.searchBarContainer}>
        <TouchableOpacity style={{ marginRight: 8 }}>
          <Ionicons name="menu-outline" size={20} color="#555555" />
        </TouchableOpacity>
        <Ionicons name="search-outline" size={18} color="#777777" style={{ marginRight: 8 }} />
        <TextInput
          placeholder={t.searchPlaceholder}
          placeholderTextColor="#888888"
          style={headerStyles.searchInput}
        />
      </View>

      {/* Right Header Actions */}
      <View style={headerStyles.headerRightActions}>

        {/* User Profile */}
        <TouchableOpacity
          style={headerStyles.userProfileDropdownBtn}
          onPress={() => router.push('/customer-profile')}
        >
          <View style={headerStyles.userAvatarCircle}>
            <Text style={headerStyles.userAvatarInitial}>A</Text>
          </View>
          <View style={headerStyles.userNameCol}>
            <Text style={headerStyles.userProfileNameText}>{t.userName}</Text>
            <Text style={headerStyles.userProfileRoleText}>{t.userRole}</Text>
          </View>
          <Ionicons name="chevron-down" size={14} color="#666666" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const sidebarStyles = StyleSheet.create({
  sidebarCol: {
    width: 230,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderColor: '#EBEBEB',
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  sidebarTopGroup: {
    gap: 4,
  },
  sidebarBottomGroup: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    gap: 4,
  },
  sidebarMenuGroup: {
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: '#EAF2E8',
  },
  navIcon: {
    marginRight: 12,
  },
  navText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#444444',
  },
  navTextActive: {
    color: '#3B6029',
    fontWeight: 'bold',
  },
  sidebarBadge: {
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

const headerStyles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#EBEBEB',
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 160,
    height: 44,
  },
  searchBarContainer: {
    flex: 1,
    maxWidth: 520,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#333333',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  langDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  langDropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },
  userProfileDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  userAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B6029',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userAvatarInitial: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userNameCol: {
    justifyContent: 'center',
  },
  userProfileNameText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  userProfileRoleText: {
    fontSize: 11,
    color: '#777777',
  },
});
