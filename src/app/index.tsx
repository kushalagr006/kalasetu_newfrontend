import React from 'react';
import { Platform } from 'react-native';
import WebLoginScreen from './web-login';
import LanguageSelectScreen from './language-select';

export default function IndexScreen() {
  if (Platform.OS === 'web') {
    return <WebLoginScreen />;
  }

  return <LanguageSelectScreen />;
}
