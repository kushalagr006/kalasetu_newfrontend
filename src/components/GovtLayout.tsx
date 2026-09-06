import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useGlobalLang } from '@/utils/languageStore';

export type GovtNavKey =
  | 'dashboard'
  | 'buyProducts'
  | 'tenders'
  | 'myOrders'
  | 'messages'
  | 'notifications'
  | 'profile'
  | 'settings';

const TRANSLATIONS = {
  hi: {
    dashboard: 'डैशबोर्ड',
    buyProducts: 'उत्पाद खरीदें',
    tenders: 'टेंडर',
    myOrders: 'मेरे ऑर्डर',
    messages: 'संदेश',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉगआउट',
    deptName: 'उद्योग और वाणिज्य विभाग',
    deptState: 'छत्तीसगढ़ सरकार',
    userRole: 'अधिकारी',
    userTitle: 'विभाग अधिकारी',
  },
  en: {
    dashboard: 'Dashboard',
    buyProducts: 'Buy Products',
    tenders: 'Tenders',
    myOrders: 'My Orders',
    messages: 'Messages',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    deptName: 'Dept. of Industry & Commerce',
    deptState: 'Govt. of Chhattisgarh',
    userRole: 'Officer',
    userTitle: 'Department Officer',
  },
};

interface GovtSidebarProps {
  activeKey: GovtNavKey;
}

export function GovtSidebar({ activeKey }: GovtSidebarProps) {
  const router = useRouter();
  const [selectedLang] = useGlobalLang();
  const t = TRANSLATIONS[selectedLang as keyof typeof TRANSLATIONS];

  const navItems = [
    {
      key: 'dashboard',
      label: t.dashboard,
      iconOutline: 'home-outline' as const,
      iconSolid: 'home' as const,
      route: '/govt-dashboard',
    },
    {
      key: 'buyProducts',
      label: t.buyProducts,
      iconOutline: 'cart-outline' as const,
      iconSolid: 'cart' as const,
      route: '/govt-buy-products',
    },
    {
      key: 'tenders',
      label: t.tenders,
      iconOutline: 'document-text-outline' as const,
      iconSolid: 'document-text' as const,
      route: '/govt-active-tenders',
    },
    {
      key: 'myOrders',
      label: t.myOrders,
      iconOutline: 'briefcase-outline' as const,
      iconSolid: 'briefcase' as const,
      route: '/govt-my-orders',
    },
    {
      key: 'messages',
      label: t.messages,
      iconOutline: 'chatbubble-ellipses-outline' as const,
      iconSolid: 'chatbubble-ellipses' as const,
      route: '/govt-messages',
    },
    {
      key: 'notifications',
      label: t.notifications,
      iconOutline: 'notifications-outline' as const,
      iconSolid: 'notifications' as const,
      route: '/govt-notifications',
      badge: 2,
    },
    {
      key: 'profile',
      label: t.profile,
      iconOutline: 'person-outline' as const,
      iconSolid: 'person' as const,
      route: '/govt-profile',
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
        {/* Brand Logo Header */}
        <TouchableOpacity
          style={sidebarStyles.brandContainer}
          onPress={() => router.push('/govt-dashboard')}
          activeOpacity={0.8}
        >
          <View style={sidebarStyles.logoRow}>
            <Image
              source={require('@/assets/images/logo_icon.png')}
              style={sidebarStyles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={sidebarStyles.deptNameText}>{t.deptName}</Text>
          <Text style={sidebarStyles.deptStateText}>{t.deptState}</Text>
        </TouchableOpacity>

        {/* Sidebar Navigation Links */}
        <View style={sidebarStyles.navMenuGroup}>
          {navItems.map((item) => {
            const isActive = activeKey === item.key;
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
                  size={19}
                  color={isActive ? '#3B6029' : '#4B5563'}
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
                {item.badge ? (
                  <View style={sidebarStyles.badgeCount}>
                    <Text style={sidebarStyles.badgeText}>{item.badge}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Sidebar Bottom Logout */}
      <TouchableOpacity
        style={sidebarStyles.logoutBtn}
        onPress={() => router.push('/login')}
        activeOpacity={0.7}
      >
        <Ionicons
          name="log-out-outline"
          size={19}
          color="#4B5563"
          style={sidebarStyles.navIcon}
        />
        <Text style={sidebarStyles.navText}>{t.logout}</Text>
      </TouchableOpacity>
    </View>
  );
}

export function GovtTopHeader() {
  const router = useRouter();
  const t = TRANSLATIONS.en;

  return (
    <View style={headerStyles.topHeaderBar}>
      <TouchableOpacity style={headerStyles.menuToggleBtn}>
        <Ionicons name="menu" size={22} color="#374151" />
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      <View style={headerStyles.topHeaderRight}>

        {/* User Avatar Badge */}
        <TouchableOpacity
          style={headerStyles.userAvatarBadge}
          onPress={() => router.push('/govt-profile')}
          activeOpacity={0.8}
        >
          <View style={headerStyles.avatarCircle}>
            <Text style={headerStyles.avatarLetter}>O</Text>
          </View>
          <View style={{ marginLeft: 8 }}>
            <Text style={headerStyles.userNameText}>{t.userRole}</Text>
            <Text style={headerStyles.userTitleText}>{t.userTitle}</Text>
          </View>
          <Ionicons
            name="chevron-down"
            size={14}
            color="#6B7280"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const sidebarStyles = StyleSheet.create({
  sidebarCol: {
    width: 240,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  sidebarTopGroup: {},
  brandContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  logoImage: {
    width: 140,
    height: 48,
  },
  deptNameText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
  },
  deptStateText: {
    fontSize: 10,
    color: '#6B7280',
  },
  navMenuGroup: {
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: '#EAF2E8',
    borderLeftWidth: 3,
    borderLeftColor: '#3B6029',
  },
  navIcon: {
    marginRight: 12,
  },
  navText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  navTextActive: {
    color: '#3B6029',
    fontWeight: 'bold',
  },
  badgeCount: {
    marginLeft: 'auto',
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});

const headerStyles = StyleSheet.create({
  topHeaderBar: {
    height: 64,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  menuToggleBtn: {
    padding: 6,
  },
  topHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  langPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  langPickerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  userAvatarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3B6029',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  userNameText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  userTitleText: {
    fontSize: 10,
    color: '#6B7280',
  },
});
