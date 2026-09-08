import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGlobalLang, LangCode } from '@/utils/languageStore';
import { getUITranslations } from '@/utils/translations';

export type ArtisanTabKey = 'home' | 'products' | 'orders' | 'customers' | 'profile' | 'chat';

interface ArtisanFloatingNavProps {
  activeTab: ArtisanTabKey;
  selectedLang?: LangCode;
}

export function ArtisanFloatingNav({ activeTab, selectedLang }: ArtisanFloatingNavProps) {
  const router = useRouter();
  const [globalLang] = useGlobalLang();
  const lang = selectedLang || globalLang;
  const t = getUITranslations(lang);

  const navItems: {
    key: 'home' | 'products' | 'orders' | 'profile';
    label: string;
    iconOutline: keyof typeof Ionicons.glyphMap;
    iconSolid: keyof typeof Ionicons.glyphMap;
    route: string;
  }[] = [
    {
      key: 'home',
      label: t.navHome,
      iconOutline: 'home-outline',
      iconSolid: 'home',
      route: '/home',
    },
    {
      key: 'products',
      label: t.navProducts,
      iconOutline: 'cube-outline',
      iconSolid: 'cube',
      route: '/products',
    },
    {
      key: 'orders',
      label: t.navOrders,
      iconOutline: 'clipboard-outline',
      iconSolid: 'clipboard',
      route: '/customers',
    },
    {
      key: 'profile',
      label: t.navProfile,
      iconOutline: 'person-outline',
      iconSolid: 'person',
      route: '/profile',
    },
  ];

  return (
    <View style={styles.floatingNavContainer}>
      {navItems.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.navTab}
            onPress={() => {
              if (!isActive) {
                router.push({ pathname: item.route as any, params: { lang } });
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? item.iconSolid : item.iconOutline}
              size={24}
              color={isActive ? '#3B6029' : '#666666'}
            />
            <Text style={[styles.navTabText, isActive && styles.navTabTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  floatingNavContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 16,
    right: 16,
    height: 68,
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#EFECE6',
    zIndex: 1000,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  navTabText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
    fontWeight: '500',
  },
  navTabTextActive: {
    color: '#3B6029',
    fontWeight: 'bold',
  },
});
