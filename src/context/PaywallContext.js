import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Lazy import to avoid crashing if library is missing during development
let Purchases = null;
let LOG_LEVEL = null;
try {
  const RNPurchases = require('react-native-purchases');
  Purchases = RNPurchases.default || RNPurchases;
  LOG_LEVEL = RNPurchases.LOG_LEVEL;
} catch (e) {
  // Library not installed yet; provide safe no-op stubs
  Purchases = {
    isConfigured: () => false,
    configure: () => {},
    setLogLevel: () => {},
    getCustomerInfo: async () => ({ entitlements: { active: {} }, originalAppUserId: null }),
    logIn: async () => ({ created: false }),
    logOut: async () => {},
  };
  LOG_LEVEL = { VERBOSE: 'VERBOSE' };
}

const PaywallContext = createContext(null);

export const usePaywall = () => {
  const ctx = useContext(PaywallContext);
  if (!ctx) throw new Error('usePaywall debe usarse dentro de PaywallProvider');
  return ctx;
};

const ONBOARDING_KEY = 'onboardingCompleted';

export const PaywallProvider = ({ children }) => {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [rcReady, setRcReady] = useState(false);
  const [rcCustomerInfo, setRcCustomerInfo] = useState(null);
  const [rcUserId, setRcUserId] = useState(null);
  const [hadActiveAtLogout, setHadActiveAtLogout] = useState(false);

  const hasActiveSubscription = useMemo(() => {
    const active = rcCustomerInfo?.entitlements?.active || {};
    return Object.keys(active).length > 0;
  }, [rcCustomerInfo]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(ONBOARDING_KEY);
      setOnboardingCompleted(stored === 'true');
      const hadActive = await AsyncStorage.getItem('hadActiveAtLogout');
      setHadActiveAtLogout(hadActive === 'true');
    })();
  }, []);

  const initRevenueCat = async () => {
    try {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
      const iosApiKey = 'test_ObwXVXTOZpepjNdgRjeuMuqKZMv';
      const androidApiKey = 'test_ObwXVXTOZpepjNdgRjeuMuqKZMv';

      if (!Purchases.isConfigured || !Purchases.isConfigured()) {
        if (Platform.OS === 'ios') {
          await Purchases.configure({ apiKey: iosApiKey });
        } else {
          await Purchases.configure({ apiKey: androidApiKey });
        }
      }
      const info = await Purchases.getCustomerInfo();
      setRcCustomerInfo(info);
      setRcUserId(info?.originalAppUserId || null);
      setRcReady(true);
    } catch (e) {
      setRcReady(false);
    }
  };

  const markOnboardingCompleted = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setOnboardingCompleted(true);
  };

  const syncRevenueCatUserId = async (newUid) => {
    try {
      if (!newUid) return;
      const result = await Purchases.logIn(newUid);
      const info = await Purchases.getCustomerInfo();
      setRcCustomerInfo(info);
      setRcUserId(info?.originalAppUserId || newUid);
      return result;
    } catch (e) {
      return { error: e?.message };
    }
  };

  const logoutRevenueCat = async () => {
    try {
      const before = await Purchases.getCustomerInfo();
      const activeBefore = Object.keys(before?.entitlements?.active || {}).length > 0;
      await AsyncStorage.setItem('hadActiveAtLogout', activeBefore ? 'true' : 'false');
      setHadActiveAtLogout(activeBefore);
      await Purchases.logOut();
      const info = await Purchases.getCustomerInfo();
      setRcCustomerInfo(info);
      setRcUserId(info?.originalAppUserId || null);
    } catch (e) {
      // ignore
    }
  };

  const getInitialAuthRoute = () => {
    if (hasActiveSubscription || hadActiveAtLogout) return 'Login';
    return onboardingCompleted ? 'Paywall' : 'Onboarding';
  };

  const value = {
    rcReady,
    rcCustomerInfo,
    rcUserId,
    hasActiveSubscription,
    onboardingCompleted,
    initRevenueCat,
    markOnboardingCompleted,
    syncRevenueCatUserId,
    logoutRevenueCat,
    getInitialAuthRoute,
  };

  return (
    <PaywallContext.Provider value={value}>{children}</PaywallContext.Provider>
  );
};

export default PaywallContext;