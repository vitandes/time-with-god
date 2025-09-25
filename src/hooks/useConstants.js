import { useTranslation } from 'react-i18next';

/**
 * Hook personalizado para acceder a las constantes traducidas
 * Proporciona acceso directo a todas las constantes de la aplicación
 * en el idioma actual seleccionado por el usuario
 */
export const useConstants = () => {
  const { t, i18n } = useTranslation('constants');
  
  // Función helper para obtener constantes anidadas
  const getConstant = (path, defaultValue = null) => {
    try {
      return t(path, { returnObjects: true, defaultValue });
    } catch (error) {
      console.warn(`Error accessing constant: ${path}`, error);
      return defaultValue;
    }
  };

  // Acceso directo a las principales categorías de constantes
  const constants = {
    // Plantas espirituales
    plants: getConstant('PLANTS', []),
    plantStages: getConstant('PLANT_STAGES', {}),
    seedPlant: getConstant('SEED_PLANT', {}),
    
    // Versículos bíblicos
    bibleVerses: getConstant('BIBLE_VERSES', []),
    
    // Mensajes de la aplicación
    messages: getConstant('MESSAGES', {}),
    inspirationalQuotes: getConstant('INSPIRATIONAL_QUOTES', []),
    morningMessages: getConstant('MORNING_MESSAGES', []),
    
    // Configuraciones
    sessionDurations: getConstant('SESSION_DURATIONS', []),
    subscriptionPlans: getConstant('SUBSCRIPTION_PLANS', {}),
    appConfig: getConstant('APP_CONFIG', {}),
    
    // Constantes numéricas
    seedMinutes: getConstant('SEED_MINUTES', 5),
  };

  return {
    ...constants,
    getConstant,
    currentLanguage: i18n.language,
    changeLanguage: i18n.changeLanguage,
  };
};

export default useConstants;