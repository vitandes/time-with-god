import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importar traducciones en español
import esCommon from './es/common.json';
import esOnboarding from './es/onboarding.json';
import esApp from './es/app.json';

// Importar traducciones en inglés
import enCommon from './en/common.json';
import enOnboarding from './en/onboarding.json';
import enApp from './en/app.json';

// Configuración de recursos de traducción
const resources = {
  es: {
    common: esCommon,
    onboarding: esOnboarding,
    app: esApp,
  },
  en: {
    common: enCommon,
    onboarding: enOnboarding,
    app: enApp,
  },
};

// Detectar idioma del dispositivo
const getDeviceLanguage = () => {
  const deviceLanguage = Localization.locale || 'en-US';
  // Extraer solo el código de idioma (ej: 'es-ES' -> 'es')
  const languageCode = deviceLanguage.split('-')[0];
  // Si no es español, configurar inglés por defecto
  return languageCode === 'es' ? 'es' : 'en';
};

// Función para obtener el idioma guardado
const getStoredLanguage = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem('user-language');
    return storedLanguage || getDeviceLanguage();
  } catch (error) {
    console.log('Error getting stored language:', error);
    return getDeviceLanguage();
  }
};

// Función para guardar el idioma seleccionado
export const saveLanguage = async (language) => {
  try {
    await AsyncStorage.setItem('user-language', language);
    await i18n.changeLanguage(language);
    console.log('Language changed to:', language);
    // Forzar re-render de la aplicación
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  } catch (error) {
    console.log('Error saving language:', error);
  }
};

// Inicializar i18n
const initI18n = async () => {
  const savedLanguage = await getStoredLanguage();
  
  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3', // Compatibilidad con React Native
      resources,
      lng: savedLanguage,
      fallbackLng: 'es', // Idioma de respaldo
      
      // Configuración de namespaces
      defaultNS: 'common',
      ns: ['common', 'onboarding', 'app'],
      
      // Configuración de interpolación
      interpolation: {
        escapeValue: false, // React ya escapa por defecto
      },
      
      // Configuración de detección
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
      
      // Configuración de desarrollo
      debug: __DEV__,
      
      // Configuración de React
      react: {
        useSuspense: false, // Desactivar suspense para React Native
      },
    });
};

// Inicializar cuando se importe el módulo
initI18n();

export default i18n;

// Exportar funciones útiles
export { getDeviceLanguage, getStoredLanguage };

// Exportar idiomas disponibles
export const availableLanguages = [
  { code: 'es', name: 'Español', nativeName: 'Español' },
  { code: 'en', name: 'English', nativeName: 'English' },
];