import { Platform } from 'react-native';

let Purchases = null;
let LOG_LEVEL = null;
try {
  const RNPurchases = require('react-native-purchases');
  Purchases = RNPurchases.default || RNPurchases;
  LOG_LEVEL = RNPurchases.LOG_LEVEL;
} catch (e) {
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

const iosApiKey = 'test_ObwXVXTOZpepjNdgRjeuMuqKZMv';
const androidApiKey = 'test_ObwXVXTOZpepjNdgRjeuMuqKZMv';

export const configureRC = async () => {
  try {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    if (!Purchases.isConfigured || !Purchases.isConfigured()) {
      if (Platform.OS === 'ios') {
        await Purchases.configure({ apiKey: iosApiKey });
      } else {
        await Purchases.configure({ apiKey: androidApiKey });
      }
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const logInRC = async (appUserId) => {
  try {
    await configureRC();
    const result = await Purchases.logIn(appUserId);
    return result;
  } catch (e) {
    return { error: e?.message };
  }
};

export const logOutRC = async () => {
  try {
    await configureRC();
    await Purchases.logOut();
    return true;
  } catch (e) {
    return false;
  }
};

export const getCustomerInfoRC = async () => {
  try {
    await configureRC();
    const info = await Purchases.getCustomerInfo();
    return info;
  } catch (e) {
    return null;
  }
};

export const hasActiveEntitlements = async () => {
  const info = await getCustomerInfoRC();
  const active = info?.entitlements?.active || {};
  return Object.keys(active).length > 0;
};