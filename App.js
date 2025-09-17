import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';

import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import Colors from './src/constants/Colors';
import i18n from './src/i18n';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <AuthProvider>
            <AppNavigator />
            <StatusBar style="light" backgroundColor={Colors.primary} />
          </AuthProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </I18nextProvider>
  );
}
