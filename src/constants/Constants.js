// Constantes generales para la app "Tiempo con Dios"

// Tiempo requerido para completar la semilla (en minutos)
export const SEED_MINUTES = 5;

// Definición de la semilla como planta especial
export const SEED_PLANT = {
  id: 'semilla',
  name: 'Semilla de la Fe',
  image: require('../../assets/plants/semilla.webp'),
  minutes: 5,
  description: 'El comienzo de tu viaje espiritual.',
  meaning: 'Esta primera medalla representa el inicio de tu camino espiritual. Como toda gran obra comienza con una pequeña semilla, tu dedicación inicial de tiempo con Dios ha plantado la base para un crecimiento espiritual extraordinario. ¡Felicidades por dar el primer paso!'
};

// Opciones de tiempo para sesiones
export const SESSION_DURATIONS = [
  { id: 1, minutes: 5, label: '5 minutos', seconds: 300 },
  { id: 2, minutes: 10, label: '10 minutos', seconds: 600 },
  { id: 3, minutes: 15, label: '15 minutos', seconds: 900 },
  { id: 4, minutes: 30, label: '30 minutos', seconds: 1800 },
];

// Plantas disponibles para seleccionar
export const PLANTS = [
  { 
    id: 'cactus', 
    name: 'Cactus de la Resistencia', 
    image: require('../../assets/plants/cactuus.webp'), 
    minutes: 120,
    description: 'Representa la perseverancia y resistencia en los momentos difíciles de la vida.',
    meaning: 'Esta medalla simboliza tu capacidad de mantenerte firme en la fe, incluso en las circunstancias más desafiantes. Como el cactus que florece en el desierto, has demostrado que puedes encontrar belleza y crecimiento espiritual en cualquier situación.'
  },
  { 
    id: 'cedro', 
    name: 'Cedro de la Fortaleza', 
    image: require('../../assets/plants/cedro.webp'), 
    minutes: 120,
    description: 'Simboliza la fortaleza interior y la estabilidad espiritual.',
    meaning: 'El cedro es conocido por su longevidad y resistencia. Esta medalla representa tu crecimiento en fortaleza espiritual y tu capacidad de ser un refugio para otros, manteniéndote firme en tus convicciones y valores.'
  },
  { 
    id: 'flor-azul', 
    name: 'Flor Azul de la Serenidad', 
    image: require('../../assets/plants/flor-azul.webp'), 
    minutes: 120,
    description: 'Representa la paz interior y la tranquilidad del alma.',
    meaning: 'Esta hermosa flor azul simboliza tu logro en encontrar la serenidad en medio del caos. Has cultivado un corazón en paz que refleja la tranquilidad divina y la capacidad de transmitir calma a quienes te rodean.'
  },
  { 
    id: 'flor-celestial', 
    name: 'Flor Celestial de la Esperanza', 
    image: require('../../assets/plants/flor-celestial.webp'), 
    minutes: 120,
    description: 'Simboliza la esperanza eterna y la conexión con lo divino.',
    meaning: 'Esta medalla celestial representa tu fe inquebrantable y tu capacidad de mantener la esperanza viva. Como una flor que mira hacia el cielo, has demostrado que siempre buscas lo mejor y confías en el plan divino para tu vida.'
  },
  { 
    id: 'lirio', 
    name: 'Lirio de la Pureza', 
    image: require('../../assets/plants/lirio.webp'), 
    minutes: 120,
    description: 'Representa la pureza de corazón y la inocencia espiritual.',
    meaning: 'El lirio ha sido símbolo de pureza desde tiempos antiguos. Esta medalla celebra tu corazón puro y tu búsqueda constante de la santidad. Representa tu deseo de vivir con integridad y transparencia ante Dios y los demás.'
  },
  { 
    id: 'rosa', 
    name: 'Rosa del Amor Divino', 
    image: require('../../assets/plants/rosa.webp'), 
    minutes: 120,
    description: 'Simboliza el amor incondicional y la devoción espiritual.',
    meaning: 'La rosa, reina de las flores, representa el amor en su forma más pura. Esta medalla honra tu capacidad de amar incondicionalmente y tu devoción profunda. Como la rosa que da su fragancia sin pedir nada a cambio, has aprendido a amar como Dios ama.'
  },
];

// Estados de la planta espiritual
export const PLANT_STAGES = {
  SEED: {
    id: 'seed',
    name: 'Semilla',
    minSessions: 0,
    maxSessions: 2,
    description: 'Tu viaje espiritual está comenzando'
  },
  SPROUT: {
    id: 'sprout',
    name: 'Brote',
    minSessions: 3,
    maxSessions: 7,
    description: 'Pequeños pasos hacia la fe'
  },
  YOUNG_PLANT: {
    id: 'young',
    name: 'Planta Joven',
    minSessions: 8,
    maxSessions: 15,
    description: 'Creciendo en sabiduría'
  },
  LEAFY_PLANT: {
    id: 'leafy',
    name: 'Planta con Hojas',
    minSessions: 16,
    maxSessions: 30,
    description: 'Floreciendo en gracia'
  },
  FLOWERING_PLANT: {
    id: 'flowering',
    name: 'Planta con Flor',
    minSessions: 31,
    maxSessions: 50,
    description: 'Dando frutos espirituales'
  },
  SACRED_PLANT: {
    id: 'sacred',
    name: 'Planta Sagrada',
    minSessions: 51,
    maxSessions: Infinity,
    description: 'En comunión perfecta'
  }
};

// Versículos bíblicos inspiradores
export const BIBLE_VERSES = [
  {
    text: "Estad quietos, y conoced que yo soy Dios",
    reference: "Salmos 46:10"
  },
  {
    text: "Si permaneces en mí, darás mucho fruto",
    reference: "Juan 15:5"
  },
  {
    text: "Venid a mí todos los que estáis trabajados y cargados",
    reference: "Mateo 11:28"
  },
  {
    text: "La paz os dejo, mi paz os doy",
    reference: "Juan 14:27"
  },
  {
    text: "Mas buscad primeramente el reino de Dios",
    reference: "Mateo 6:33"
  },
  {
    text: "Todo lo puedo en Cristo que me fortalece",
    reference: "Filipenses 4:13"
  },
  {
    text: "Jehová es mi pastor; nada me faltará",
    reference: "Salmos 23:1"
  },
  {
    text: "Porque donde están dos o tres congregados en mi nombre",
    reference: "Mateo 18:20"
  },
  {
    text: "El Señor tu Dios está en medio de ti",
    reference: "Sofonías 3:17"
  },
  {
    text: "Confía en Jehová de todo tu corazón",
    reference: "Proverbios 3:5"
  }
];

// Frases inspiradoras adicionales
export const INSPIRATIONAL_QUOTES = [
  "Respira profundo y siente la presencia de Dios",
  "En el silencio, el alma encuentra su hogar",
  "Cada momento contigo es sagrado",
  "Tu corazón es el templo donde Dios habita",
  "La oración es el aliento del alma",
  "En la quietud, escucha Su voz",
  "Dios está más cerca de lo que imaginas",
  "Tu fe es como una semilla que crece cada día"
];

// Configuraciones de suscripción
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

// Configuraciones de la aplicación
export const APP_CONFIG = {
  FREE_TRIAL_DAYS: 7,
  PLANT_WITHERING_HOURS: 48,
  VERSE_CHANGE_INTERVAL: 15000, // 15 segundos
  MAX_SESSIONS_PER_DAY: 10,
  MIN_SESSION_DURATION: 60, // 1 minuto mínimo
};

// Mensajes de la aplicación
export const MESSAGES = {
  WELCOME: "Bienvenido a tu momento con Dios",
  SESSION_COMPLETE: "¡Hermoso momento de conexión!",
  PLANT_GROWING: "Tu planta espiritual está creciendo",
  PLANT_WITHERING: "Tu planta necesita atención",
  STREAK_BROKEN: "No te desanimes, cada día es una nueva oportunidad",
  NEW_STAGE: "¡Has alcanzado una nueva etapa espiritual!"
};

export default {
  SESSION_DURATIONS,
  PLANTS,
  PLANT_STAGES,
  BIBLE_VERSES,
  INSPIRATIONAL_QUOTES,
  SUBSCRIPTION_PLANS,
  APP_CONFIG,
  MESSAGES
};