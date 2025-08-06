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
    minutes: 20,
    description: 'Representa la paz interior y la tranquilidad del alma.',
    meaning: 'Esta hermosa flor azul simboliza tu logro en encontrar la serenidad en medio del caos. Has cultivado un corazón en paz que refleja la tranquilidad divina y la capacidad de transmitir calma a quienes te rodean.'
  },
  { 
    id: 'flor-celestial', 
    name: 'Flor Celestial de la Esperanza', 
    image: require('../../assets/plants/flor-celestial.webp'), 
    minutes: 40,
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
  {
    id: 'acacia',
    name: 'Acacia de la Santidad',
    image: require('../../assets/plants/acacia.webp'),
    minutes: 150,
    description: 'Representa la santidad y la consagración a Dios.',
    meaning: 'La acacia fue usada en la construcción del Tabernáculo. Esta medalla simboliza tu dedicación a ser un templo santo para Dios, separado del mundo y consagrado para Su gloria. Has demostrado un corazón que busca la santidad en cada aspecto de tu vida.'
  },
  {
    id: 'aloe',
    name: 'Aloe de la Sanidad',
    image: require('../../assets/plants/aloe.webp'),
    minutes: 100,
    description: 'Simboliza la sanidad divina y la restauración del alma.',
    meaning: 'Como el aloe que sana las heridas, esta medalla representa tu fe en el poder sanador de Dios. Has experimentado Su toque restaurador en tu vida y ahora eres instrumento de sanidad para otros que sufren.'
  },
  {
    id: 'canela',
    name: 'Canela del Aroma Agradable',
    image: require('../../assets/plants/canela.webp'),
    minutes: 110,
    description: 'Representa la oración como incienso agradable a Dios.',
    meaning: 'La canela era parte del aceite santo de la unción. Esta medalla celebra tus oraciones que suben como incienso agradable ante el trono de Dios. Tu vida de oración constante es un aroma dulce que agrada al Señor.'
  },
  {
    id: 'espino-blanco',
    name: 'Espino Blanco de la Protección',
    image: require('../../assets/plants/espino-blanco.webp'),
    minutes: 130,
    description: 'Simboliza la protección divina y la defensa espiritual.',
    meaning: 'Como el espino que protege con sus espinas, esta medalla representa la protección que Dios te brinda. Has aprendido a confiar en Su escudo protector y a ser refugio seguro para otros bajo Su cuidado.'
  },
  {
    id: 'girasol',
    name: 'Girasol de la Adoración',
    image: require('../../assets/plants/girasol.webp'),
    minutes: 90,
    description: 'Representa la adoración constante y la búsqueda de la luz divina.',
    meaning: 'Como el girasol que siempre mira al sol, esta medalla simboliza tu corazón que constantemente busca la presencia de Dios. Tu adoración sincera y tu deseo de seguir Su luz te han llevado a este hermoso logro espiritual.'
  },
  {
    id: 'higuera',
    name: 'Higuera de la Abundancia',
    image: require('../../assets/plants/higuera.webp'),
    minutes: 180,
    description: 'Simboliza la abundancia espiritual y los frutos de la fe.',
    meaning: 'La higuera representa la abundancia y la prosperidad espiritual. Esta medalla celebra los frutos abundantes que has producido en tu caminar con Dios: amor, gozo, paz y bendición para otros.'
  },
  {
    id: 'jacinto',
    name: 'Jacinto de la Humildad',
    image: require('../../assets/plants/Jacinto.webp'),
    minutes: 95,
    description: 'Representa la humildad y la sencillez del corazón.',
    meaning: 'El jacinto, con su belleza sencilla, simboliza la humildad genuina. Esta medalla honra tu corazón humilde que reconoce la grandeza de Dios y tu dependencia total de Su gracia y misericordia.'
  },
  {
    id: 'laurel',
    name: 'Laurel de la Victoria',
    image: require('../../assets/plants/laurel.webp'),
    minutes: 200,
    description: 'Simboliza la victoria espiritual y el triunfo en Cristo.',
    meaning: 'El laurel corona a los vencedores. Esta medalla representa tu victoria sobre las adversidades a través de la fe. Has demostrado que en Cristo somos más que vencedores, triunfando sobre toda dificultad.'
  },
  {
    id: 'lirio2',
    name: 'Lirio Real de la Majestad',
    image: require('../../assets/plants/lirio2.webp'),
    minutes: 140,
    description: 'Representa la majestad divina y la realeza espiritual.',
    meaning: 'Este lirio real simboliza tu identidad como hijo del Rey de reyes. Has comprendido tu posición real en el reino de Dios y vives con la dignidad y propósito que corresponde a la realeza espiritual.'
  },
  {
    id: 'mirra',
    name: 'Mirra del Sacrificio',
    image: require('../../assets/plants/mirra.webp'),
    minutes: 160,
    description: 'Simboliza el sacrificio y la entrega total a Dios.',
    meaning: 'La mirra representa el sacrificio y la entrega. Esta medalla honra tu disposición a entregar todo por amor a Dios, siguiendo el ejemplo de Cristo quien se entregó completamente por nosotros.'
  },
  {
    id: 'mostaza',
    name: 'Mostaza de la Fe',
    image: require('../../assets/plants/moztaza.webp'),
    minutes: 80,
    description: 'Representa la fe que mueve montañas.',
    meaning: 'Como la semilla de mostaza que crece hasta ser un gran árbol, esta medalla celebra tu fe que, aunque pequeña al principio, ha crecido hasta ser capaz de mover montañas y lograr lo imposible.'
  },
  {
    id: 'palma',
    name: 'Palma del Triunfo',
    image: require('../../assets/plants/palma.webp'),
    minutes: 220,
    description: 'Simboliza el triunfo eterno y la victoria final.',
    meaning: 'La palma es símbolo de triunfo eterno. Esta medalla representa tu perseverancia hasta el final y tu participación en la victoria eterna de Cristo. Como los santos que llevan palmas, has vencido por la sangre del Cordero.'
  },
  {
    id: 'trigo',
    name: 'Trigo de la Provisión',
    image: require('../../assets/plants/trigo.webp'),
    minutes: 170,
    description: 'Representa la provisión divina y el pan de vida.',
    meaning: 'El trigo simboliza la provisión de Dios y el pan de vida. Esta medalla celebra tu confianza en que Dios provee todo lo que necesitas, tanto física como espiritualmente, siendo Él tu sustento diario.'
  },
  {
    id: 'vid',
    name: 'Vid de la Comunión',
    image: require('../../assets/plants/vid.webp'),
    minutes: 190,
    description: 'Simboliza la comunión íntima con Cristo.',
    meaning: 'Como Cristo es la vid verdadera, esta medalla representa tu comunión íntima con Él. Has aprendido a permanecer en Cristo, dando fruto abundante y experimentando la vida plena que solo Él puede dar.'
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

// Mensajes matutinos motivacionales de Dios
export const MORNING_MESSAGES = [
  {
    id: 1,
    message: "Buenos días, mi amado hijo. Hoy es un nuevo día lleno de mis bendiciones. Camina confiado sabiendo que yo voy contigo.",
    verse: "Lamentaciones 3:23"
  },
  {
    id: 2,
    message: "Levántate con gozo, porque mis misericordias son nuevas cada mañana. Tu fe será tu fortaleza hoy.",
    verse: "Salmos 30:5"
  },
  {
    id: 3,
    message: "Mi paz sea contigo al comenzar este día. No temas, porque yo estoy contigo dondequiera que vayas.",
    verse: "Josué 1:9"
  },
  {
    id: 4,
    message: "Hoy te doy fuerzas renovadas. Como las águilas, te elevarás por encima de toda dificultad.",
    verse: "Isaías 40:31"
  },
  {
    id: 5,
    message: "Eres mi obra maestra, creado para buenas obras. Camina en el propósito que he preparado para ti.",
    verse: "Efesios 2:10"
  },
  {
    id: 6,
    message: "Mi amor por ti es eterno e incondicional. Nada podrá separarte de mi amor que está en Cristo Jesús.",
    verse: "Romanos 8:38-39"
  },
  {
    id: 7,
    message: "Confía en mí de todo corazón. Yo dirigiré tus pasos y haré derechas tus sendas.",
    verse: "Proverbios 3:5-6"
  },
  {
    id: 8,
    message: "Eres más que vencedor en Cristo. Hoy enfrentarás cada desafío con mi poder en ti.",
    verse: "Romanos 8:37"
  },
  {
    id: 9,
    message: "Mi gracia es suficiente para ti. En tu debilidad, mi poder se perfecciona.",
    verse: "2 Corintios 12:9"
  },
  {
    id: 10,
    message: "Busca primero mi reino y mi justicia, y todas las demás cosas te serán añadidas.",
    verse: "Mateo 6:33"
  },
  {
    id: 11,
    message: "Yo tengo planes de bien para ti, planes de esperanza y de futuro. Confía en mi timing perfecto.",
    verse: "Jeremías 29:11"
  },
  {
    id: 12,
    message: "Tu oración es como incienso delante de mí. Habla conmigo, que siempre te escucho.",
    verse: "Salmos 141:2"
  },
  {
    id: 13,
    message: "Sé fuerte y valiente. No te desanimes, porque yo soy tu Dios que te esfuerza y te ayuda.",
    verse: "Isaías 41:10"
  },
  {
    id: 14,
    message: "Echa sobre mí toda tu ansiedad, porque yo tengo cuidado de ti. Descansa en mi amor.",
    verse: "1 Pedro 5:7"
  },
  {
    id: 15,
    message: "Hoy brillarás como luz en el mundo. Tu testimonio será bendición para muchos.",
    verse: "Mateo 5:14"
  },
  {
    id: 16,
    message: "Mi gozo es tu fortaleza. Regocíjate en mí y tu corazón se llenará de alegría.",
    verse: "Nehemías 8:10"
  },
  {
    id: 17,
    message: "Permanece en mí como la rama en la vid. Así darás mucho fruto para mi gloria.",
    verse: "Juan 15:5"
  },
  {
    id: 18,
    message: "Todo lo puedes en Cristo que te fortalece. No hay imposibles para quien cree.",
    verse: "Filipenses 4:13"
  },
  {
    id: 19,
    message: "Yo soy tu refugio y fortaleza, tu pronto auxilio en las tribulaciones. Ven a mí.",
    verse: "Salmos 46:1"
  },
  {
    id: 20,
    message: "Camina por fe y no por vista. Yo guío tus pasos aunque no veas el camino completo.",
    verse: "2 Corintios 5:7"
  },
  {
    id: 21,
    message: "Eres mi hijo amado en quien tengo complacencia. Vive en la seguridad de mi amor.",
    verse: "Mateo 3:17"
  },
  {
    id: 22,
    message: "Mi palabra es lámpara a tus pies y lumbrera a tu camino. Medita en ella hoy.",
    verse: "Salmos 119:105"
  },
  {
    id: 23,
    message: "Deléitate en mí y yo te concederé las peticiones de tu corazón. Confía en mis tiempos.",
    verse: "Salmos 37:4"
  },
  {
    id: 24,
    message: "Yo hago nuevas todas las cosas. Hoy es un nuevo comienzo lleno de posibilidades.",
    verse: "Apocalipsis 21:5"
  },
  {
    id: 25,
    message: "Mi presencia irá contigo y te dará descanso. No camines solo, yo estoy aquí.",
    verse: "Éxodo 33:14"
  },
  {
    id: 26,
    message: "Eres corona de gloria en mi mano y diadema real en la mano de tu Dios.",
    verse: "Isaías 62:3"
  },
  {
    id: 27,
    message: "Humíllate bajo mi poderosa mano y yo te exaltaré cuando fuere tiempo.",
    verse: "1 Pedro 5:6"
  },
  {
    id: 28,
    message: "Yo soy el camino, la verdad y la vida. En mí encontrarás todo lo que necesitas.",
    verse: "Juan 14:6"
  },
  {
    id: 29,
    message: "Bendito eres cuando confías en mí. Serás como árbol plantado junto a corrientes de aguas.",
    verse: "Jeremías 17:7-8"
  },
  {
    id: 30,
    message: "Mi amor nunca falla. Cada día te amo con amor eterno y con misericordia te he atraído.",
    verse: "Jeremías 31:3"
  }
];

export default {
  SESSION_DURATIONS,
  PLANTS,
  PLANT_STAGES,
  BIBLE_VERSES,
  INSPIRATIONAL_QUOTES,
  SUBSCRIPTION_PLANS,
  APP_CONFIG,
  MESSAGES,
  MORNING_MESSAGES
};