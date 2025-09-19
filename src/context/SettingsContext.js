import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Estado inicial de configuraciones
const initialState = {
  morningMessagesEnabled: true,
  messageTime: { hour: 8, minute: 0 },
  defaultMusicEnabled: true,
  language: 'es',
  theme: 'light',
  notificationsEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
};

// Tipos de acciones
const ActionTypes = {
  LOAD_SETTINGS: 'LOAD_SETTINGS',
  UPDATE_SETTING: 'UPDATE_SETTING',
  RESET_SETTINGS: 'RESET_SETTINGS',
};

// Reducer para manejar las configuraciones
const settingsReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_SETTINGS:
      return {
        ...state,
        ...action.payload,
      };
    
    case ActionTypes.UPDATE_SETTING:
      return {
        ...state,
        ...action.payload,
      };
    
    case ActionTypes.RESET_SETTINGS:
      return initialState;
    
    default:
      return state;
  }
};

// Crear contexto
const SettingsContext = createContext();

// Hook personalizado
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings debe ser usado dentro de SettingsProvider');
  }
  return context;
};

// Provider
export const SettingsProvider = ({ children }) => {
  const [settings, dispatch] = useReducer(settingsReducer, initialState);

  // Cargar configuraciones al iniciar
  useEffect(() => {
    loadSettings();
  }, []);

  // Guardar configuraciones cuando cambien
  useEffect(() => {
    saveSettings();
  }, [settings]);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('userSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        dispatch({
          type: ActionTypes.LOAD_SETTINGS,
          payload: parsedSettings,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSettings = (newSettings) => {
    dispatch({
      type: ActionTypes.UPDATE_SETTING,
      payload: newSettings,
    });
  };

  const resetSettings = () => {
    dispatch({ type: ActionTypes.RESET_SETTINGS });
  };

  const value = {
    settings,
    updateSettings,
    resetSettings,
    loadSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;