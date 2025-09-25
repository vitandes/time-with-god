// Import from individual files
import { PLANTS, PLANT_STAGES } from './plants';
import { BIBLE_VERSES } from './verses';
import { MESSAGES, INSPIRATIONAL_QUOTES, MORNING_MESSAGES } from './messages';
import { SUBSCRIPTION_PLANS, SESSION_DURATIONS, APP_CONFIG, SEED_MINUTES, SEED_PLANT } from './config';

// Main exports for English
export { PLANTS, PLANT_STAGES } from './plants';
export { BIBLE_VERSES } from './verses';
export { MESSAGES, INSPIRATIONAL_QUOTES, MORNING_MESSAGES } from './messages';
export { SUBSCRIPTION_PLANS, SESSION_DURATIONS, APP_CONFIG, SEED_MINUTES, SEED_PLANT } from './config';

// Default export with all constants
export default {
  PLANTS,
  PLANT_STAGES,
  BIBLE_VERSES,
  MESSAGES,
  INSPIRATIONAL_QUOTES,
  MORNING_MESSAGES,
  SUBSCRIPTION_PLANS,
  SESSION_DURATIONS,
  APP_CONFIG,
  SEED_MINUTES,
  SEED_PLANT
};