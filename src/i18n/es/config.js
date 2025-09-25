// Configuraciones de suscripción en español
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 'monthly',
    price: 2.99,
    currency: 'USD',
    period: 'mes',
    description: 'Acceso completo por un mes'
  },
  YEARLY: {
    id: 'yearly',
    price: 29.99,
    currency: 'USD',
    period: 'año',
    description: 'Acceso completo por un año (ahorra 17%)'
  }
};

// Duraciones de sesión en español
export const SESSION_DURATIONS = [
  { id: 1, minutes: 5, label: '5 minutos', seconds: 300 },
  { id: 2, minutes: 10, label: '10 minutos', seconds: 600 },
  { id: 3, minutes: 15, label: '15 minutos', seconds: 900 },
  { id: 4, minutes: 20, label: '20 minutos', seconds: 1200 },
  { id: 5, minutes: 25, label: '25 minutos', seconds: 1500 },
  { id: 6, minutes: 30, label: '30 minutos', seconds: 1800 }
];

// Configuraciones de la aplicación
export const APP_CONFIG = {
  FREE_TRIAL_DAYS: 7,
  PLANT_WITHERING_HOURS: 48,
  VERSE_CHANGE_INTERVAL: 15000, // 15 segundos
  MAX_SESSIONS_PER_DAY: 10,
  MIN_SESSION_DURATION: 60, // 1 minuto mínimo
};

// Constantes numéricas
export const SEED_MINUTES = 5;
export const SEED_PLANT = {
  id: 1,
  name: 'Semilla de Mostaza',
  image: 'mustard-seed',
  minutes: 5,
  description: 'Una pequeña semilla que crece con fe',
  meaning: 'La fe más pequeña puede mover montañas'
};