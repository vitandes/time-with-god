import React, { useEffect } from 'react';
import { View, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '../context/AuthContext';
import { usePaywall } from '../context/PaywallContext';
import Colors from '../constants/Colors';

// Importar pantallas
import LoadingScreen from '../screens/LoadingScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import HomeScreen from '../screens/HomeScreen';
import SessionScreen from '../screens/SessionScreen';
import SessionCompleteScreen from '../screens/SessionCompleteScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SubscriptionPaywall from '../screens/Paywall';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegador de pestañas principales
const MainTabNavigator = () => {
  const { t } = useTranslation('common');

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarStyle: {
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          backgroundColor: '#2E1A47', // Deep spiritual purple
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: 50,
            }}>
              <Ionicons
                name={iconName}
                size={28}
                color={color}
                style={{
                  marginBottom: 4
                }}
              />
              {focused && (
                <View style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: '#FFFFFF',
                  position: 'absolute',
                  bottom: 10,
                }} />
              )}
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: t('home') }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarLabel: t('garden') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: t('profile') }}
      />
    </Tab.Navigator>
  );
};

// Navegador de autenticación
const AuthNavigator = () => {
  const { initRevenueCat, getInitialAuthRoute } = usePaywall();

  useEffect(() => {
    initRevenueCat();
  }, []);

  const initialRouteName = getInitialAuthRoute();
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Paywall" component={SubscriptionPaywall} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Navegador principal de la aplicación
const AppNavigator = () => {
  const { isAuthenticated, isLoading, hasActiveSubscription } = useAuth();

  if (isLoading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: Colors.background },
      }}
    >
      {!isAuthenticated ? (
        // Usuario no autenticado
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) :
        // !hasActiveSubscription() ? (
        //   // Usuario autenticado pero sin suscripción activa
        //   <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        // ) : 
        (
          // Usuario autenticado con suscripción activa
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="Session"
              component={SessionScreen}
              options={{
                presentation: 'modal',
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="SessionComplete"
              component={SessionCompleteScreen}
              options={{
                presentation: 'modal',
                gestureEnabled: false,
              }}
            />
          </>
        )}
    </Stack.Navigator>
  );
};

export default AppNavigator;