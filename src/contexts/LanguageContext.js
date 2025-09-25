import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importar las traducciones
import esTranslations from '../i18n/es';
import enTranslations from '../i18n/en';

// Crear el contexto
const LanguageContext = createContext();

// Idiomas disponibles
export const LANGUAGES = {
  ES: 'es',
  EN: 'en'
};

// Traducciones disponibles
const translations = {
  [LANGUAGES.ES]: esTranslations,
  [LANGUAGES.EN]: enTranslations
};

// Proveedor del contexto
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(LANGUAGES.ES);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar idioma guardado al inicializar
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      if (savedLanguage && translations[savedLanguage]) {
        setCurrentLanguage(savedLanguage);
      }
    } catch (error) {
      console.log('Error loading saved language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (language) => {
    if (translations[language]) {
      setCurrentLanguage(language);
      try {
        await AsyncStorage.setItem('app_language', language);
      } catch (error) {
        console.log('Error saving language:', error);
      }
    }
  };

  // Obtener las traducciones actuales
  const t = translations[currentLanguage];

  // Función para obtener texto traducido por clave
  const getText = (key, defaultValue = '') => {
    const keys = key.split('.');
    let value = t;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && value[k] !== undefined) {
        value = value[k];
      } else {
        return defaultValue || key;
      }
    }
    
    return value || defaultValue || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    isLoading,
    t,
    getText,
    availableLanguages: Object.values(LANGUAGES)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;