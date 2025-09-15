import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import {
  signInWithEmail as firebaseSignInWithEmail,
  signUpWithEmail as firebaseSignUpWithEmail,
  signInWithGoogle as firebaseSignInWithGoogle,
  signInWithApple as firebaseSignInWithApple,
  signOut as firebaseSignOut,
} from '../services/authHelpers';
import { APP_CONFIG } from '../constants/Constants';

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  subscription: {
    isActive: false,
    plan: null,
    expiresAt: null,
    trialEndsAt: null,
    isTrialActive: false
  },
  sessions: {
    total: 0,
    thisWeek: 0,
    streak: 0,
    lastSessionDate: null,
    weeklyMinutes: 0,
    totalMinutes: 0
  },
  plant: {
    stage: 'seed',
    lastWatered: null,
    isHealthy: true,
    totalSessions: 0
  }
};

// Tipos de acciones
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_SUBSCRIPTION: 'UPDATE_SUBSCRIPTION',
  COMPLETE_SESSION: 'COMPLETE_SESSION',
  UPDATE_PLANT: 'UPDATE_PLANT',
  LOAD_USER_DATA: 'LOAD_USER_DATA'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false
      };
    
    case ActionTypes.LOGOUT:
      return {
        ...initialState,
        isLoading: false
      };
    
    case ActionTypes.UPDATE_SUBSCRIPTION:
      return {
        ...state,
        subscription: { ...state.subscription, ...action.payload }
      };
    
    case ActionTypes.COMPLETE_SESSION:
      const newTotalSessions = state.sessions.total + 1;
      const newWeeklySessions = state.sessions.thisWeek + 1;
      const newWeeklyMinutes = state.sessions.weeklyMinutes + action.payload.duration;
      const newTotalMinutes = state.sessions.totalMinutes + action.payload.duration;
      
      return {
        ...state,
        sessions: {
          ...state.sessions,
          total: newTotalSessions,
          thisWeek: newWeeklySessions,
          weeklyMinutes: newWeeklyMinutes,
          totalMinutes: newTotalMinutes,
          lastSessionDate: new Date().toISOString(),
          streak: calculateStreak(state.sessions.lastSessionDate)
        },
        plant: {
          ...state.plant,
          totalSessions: newTotalSessions,
          lastWatered: new Date().toISOString(),
          isHealthy: true
        }
      };
    
    case ActionTypes.UPDATE_PLANT:
      return {
        ...state,
        plant: { ...state.plant, ...action.payload }
      };
    
    case ActionTypes.LOAD_USER_DATA:
      return {
        ...state,
        ...action.payload,
        isLoading: false
      };
    
    default:
      return state;
  }
};

// Función auxiliar para calcular racha
const calculateStreak = (lastSessionDate) => {
  if (!lastSessionDate) return 1;
  
  const lastDate = new Date(lastSessionDate);
  const today = new Date();
  const diffTime = Math.abs(today - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= 1 ? 1 : 0; // Simplificado por ahora
};

// Crear contexto
const AuthContext = createContext();

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    loadUserData();
  }, []);

  // Listener de Firebase Auth para cambios de estado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuario autenticado con Firebase
        const userData = {
          user: {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Usuario',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            authProvider: firebaseUser.providerData[0]?.providerId || 'firebase'
          },
          isAuthenticated: true,
          subscription: {
            isActive: false,
            isTrialActive: true,
            trialEndsAt: new Date(Date.now() + APP_CONFIG.FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString()
          }
        };
        
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: userData });
        await saveUserData({ ...state, ...userData });
      } else {
        // Usuario no autenticado
        dispatch({ type: ActionTypes.LOGOUT });
      }
    });

    return () => unsubscribe();
  }, []);

  // Verificar salud de la planta periódicamente
  useEffect(() => {
    const checkPlantHealth = () => {
      if (state.plant.lastWatered) {
        const lastWatered = new Date(state.plant.lastWatered);
        const now = new Date();
        const hoursSinceLastSession = (now - lastWatered) / (1000 * 60 * 60);
        
        if (hoursSinceLastSession > APP_CONFIG.PLANT_WITHERING_HOURS) {
          dispatch({
            type: ActionTypes.UPDATE_PLANT,
            payload: { isHealthy: false }
          });
        }
      }
    };

    const interval = setInterval(checkPlantHealth, 60000); // Verificar cada minuto
    return () => clearInterval(interval);
  }, [state.plant.lastWatered]);

  // Funciones del contexto
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        dispatch({
          type: ActionTypes.LOAD_USER_DATA,
          payload: parsedData
        });
      } else {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  const saveUserData = async (data) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // ==================== FIREBASE AUTH METHODS ====================
  
  // Iniciar sesión con Google
  const signInWithGoogle = async () => {
    try {
      const result = await firebaseSignInWithGoogle();
      if (result.success && result.user) {
        return { success: true, user: result.user };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: error.message };
    }
  };

  // Iniciar sesión con Apple
  const signInWithApple = async () => {
    try {
      const result = await firebaseSignInWithApple();
      if (result.success && result.user) {
        return { success: true, user: result.user };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Apple sign-in error:', error);
      return { success: false, error: error.message };
    }
  };

  // Iniciar sesión con email y contraseña
  const signInWithEmail = async (email, password) => {
    try {
      const result = await firebaseSignInWithEmail(email, password);
      if (result.success && result.user) {
        return { success: true, user: result.user };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Email sign-in error:', error);
      return { success: false, error: error.message };
    }
  };

  // Registrar con email y contraseña
  const signUpWithEmail = async (email, password) => {
    try {
      const result = await firebaseSignUpWithEmail(email, password);
      if (result.success && result.user) {
        return { success: true, user: result.user };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Email sign-up error:', error);
      return { success: false, error: error.message };
    }
  };

  // Cerrar sesión
  const signOut = async () => {
    try {
      const result = await firebaseSignOut();
      if (result.success) {
        await AsyncStorage.removeItem('userData');
        dispatch({ type: ActionTypes.LOGOUT });
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Sign-out error:', error);
      return { success: false, error: error.message };
    }
  };

  // ==================== LEGACY METHODS (mantener compatibilidad) ====================
  
  const login = async (userInfo, provider = 'email') => {
    try {
      // Añadir información del proveedor de autenticación
      const userData = {
        user: {
          ...userInfo,
          authProvider: provider
        },
        isAuthenticated: true,
        subscription: {
          isActive: false,
          isTrialActive: true,
          trialEndsAt: new Date(Date.now() + APP_CONFIG.FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString()
        }
      };
      
      dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: userData });
      await saveUserData({ ...state, ...userData });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      // Usar el nuevo método signOut que maneja Firebase
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const completeSession = async (duration) => {
    dispatch({
      type: ActionTypes.COMPLETE_SESSION,
      payload: { duration }
    });
    
    // Guardar datos actualizados
    const updatedState = { ...state };
    await saveUserData(updatedState);
  };

  const updateSubscription = async (subscriptionData) => {
    dispatch({
      type: ActionTypes.UPDATE_SUBSCRIPTION,
      payload: subscriptionData
    });
    
    await saveUserData({ ...state, subscription: { ...state.subscription, ...subscriptionData } });
  };

  const hasActiveSubscription = () => {
    const { subscription } = state;
    
    // Verificar si tiene suscripción activa
    if (subscription.isActive && subscription.expiresAt) {
      return new Date(subscription.expiresAt) > new Date();
    }
    
    // Verificar si está en período de prueba
    if (subscription.isTrialActive && subscription.trialEndsAt) {
      return new Date(subscription.trialEndsAt) > new Date();
    }
    
    return false;
  };

  const value = {
    ...state,
    // Métodos Firebase Auth
    signInWithGoogle,
    signInWithApple,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    // Métodos legacy (compatibilidad)
    login,
    logout,
    completeSession,
    updateSubscription,
    hasActiveSubscription,
    loadUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;