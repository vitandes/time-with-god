// Plantas espirituales en español
export const PLANTS = [
  {
    id: 1,
    name: 'Semilla de Mostaza',
    image: 'mostaza',
    minutes: 5,
    description: 'Una pequeña semilla que crece con fe',
    meaning: 'La fe más pequeña puede mover montañas'
  },
  {
    id: 2,
    name: 'Lirio del Valle',
    image: 'lirio',
    minutes: 10,
    description: 'Flor delicada que florece en lugares humildes',
    meaning: 'La humildad es el camino hacia la verdadera grandeza'
  },
  {
    id: 3,
    name: 'Cedro del Líbano',
    image: 'cedro',
    minutes: 15,
    description: 'Árbol majestuoso que resiste las tormentas',
    meaning: 'La fortaleza viene de raíces profundas en la fe'
  },
  {
    id: 4,
    name: 'Rosa de Sarón',
    image: 'rosa',
    minutes: 20,
    description: 'Rosa hermosa que simboliza el amor divino',
    meaning: 'El amor de Dios florece en cada corazón'
  },
  {
    id: 5,
    name: 'Olivo de Getsemaní',
    image: 'aloe',
    minutes: 25,
    description: 'Árbol ancestral testigo de oración profunda',
    meaning: 'En la oración encontramos paz y fortaleza'
  },
  {
    id: 6,
    name: 'Espino Blanco de la Protección',
    image: 'espino-blanco',
    minutes: 30,
    description: 'Arbusto protector con flores blancas puras',
    meaning: 'Dios es nuestro refugio y fortaleza'
  },
  {
    id: 7,
    name: 'Girasol de la Adoración',
    image: 'girasol',
    minutes: 35,
    description: 'Flor que siempre mira hacia la luz',
    meaning: 'Nuestros ojos deben estar puestos en Cristo'
  },
  {
    id: 8,
    name: 'Higuera de la Abundancia',
    image: 'higuera',
    minutes: 40,
    description: 'Árbol frutal que da alimento y sombra',
    meaning: 'Dios provee abundantemente para sus hijos'
  },
  {
    id: 9,
    name: 'Jacinto de la Humildad',
    image: 'jacinto',
    minutes: 45,
    description: 'Flor sencilla pero de fragancia intensa',
    meaning: 'La humildad es el perfume del alma'
  },
  {
    id: 10,
    name: 'Laurel de la Victoria',
    image: 'laurel',
    minutes: 50,
    description: 'Corona de hojas que simboliza el triunfo',
    meaning: 'En Cristo somos más que vencedores'
  },
  {
    id: 11,
    name: 'Lirio Real de la Majestad',
    image: 'lirio-real',
    minutes: 55,
    description: 'Flor elegante que refleja la gloria divina',
    meaning: 'Somos hijos del Rey de reyes'
  },
  {
    id: 12,
    name: 'Mirra del Sacrificio',
    image: 'mirra',
    minutes: 60,
    description: 'Resina preciosa usada en adoración',
    meaning: 'El sacrificio de amor trae sanidad'
  },
  {
    id: 13,
    name: 'Mostaza de la Fe',
    image: 'mostaza-planta',
    minutes: 65,
    description: 'Planta que crece hasta ser árbol grande',
    meaning: 'La fe pequeña puede lograr grandes cosas'
  },
  {
    id: 14,
    name: 'Palma del Triunfo',
    image: 'palma',
    minutes: 70,
    description: 'Árbol que se dobla pero no se quiebra',
    meaning: 'Los justos florecen como la palma'
  },
  {
    id: 15,
    name: 'Trigo de la Provisión',
    image: 'trigo',
    minutes: 75,
    description: 'Cereal que alimenta y sustenta la vida',
    meaning: 'Cristo es el pan de vida'
  },
  {
    id: 16,
    name: 'Vid de la Comunión',
    image: 'vid',
    minutes: 80,
    description: 'Planta que une ramas en un solo tronco',
    meaning: 'Permaneced en mí como yo en vosotros'
  }
];

export const PLANT_STAGES = {
  SEED: {
    id: 'seed',
    name: 'Semilla',
    minSessions: 1,
    maxSessions: 2,
    description: 'El comienzo de tu jornada espiritual'
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