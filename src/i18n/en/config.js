// Subscription configurations in English
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 'monthly',
    price: 2.99,
    currency: 'USD',
    period: 'month',
    description: 'Full access for one month'
  },
  YEARLY: {
    id: 'yearly',
    price: 29.99,
    currency: 'USD',
    period: 'year',
    description: 'Full access for one year (save 17%)'
  }
};

// Session durations in English
export const SESSION_DURATIONS = [
  { id: 1, minutes: 5, label: '5 minutes', seconds: 300 },
  { id: 2, minutes: 10, label: '10 minutes', seconds: 600 },
  { id: 3, minutes: 15, label: '15 minutes', seconds: 900 },
  { id: 4, minutes: 20, label: '20 minutes', seconds: 1200 },
  { id: 5, minutes: 25, label: '25 minutes', seconds: 1500 },
  { id: 6, minutes: 30, label: '30 minutes', seconds: 1800 }
];

// Application configuration
export const APP_CONFIG = {
  FREE_TRIAL_DAYS: 7,
  PLANT_WITHERING_HOURS: 48,
  VERSE_CHANGE_INTERVAL: 15000, // 15 seconds
  MAX_SESSIONS_PER_DAY: 10,
  MIN_SESSION_DURATION: 60, // 1 minute minimum
};

// Numeric constants
export const SEED_MINUTES = 5;
export const SEED_PLANT = {
  id: 1,
  name: 'Mustard Seed',
  image: 'mustard-seed',
  minutes: 5,
  description: 'A small seed that grows with faith',
  meaning: 'The smallest faith can move mountains'
};