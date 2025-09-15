// Authentication Helpers for Firebase Auth
// Este archivo contiene las funciones helper para autenticación con Firebase
// Incluye providers para Google, Apple y Email/Password

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as firebaseSignOut,
  User,
  UserCredential,
} from 'firebase/auth';
import { makeRedirectUri, AuthRequest } from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { auth } from '../firebase/firebaseConfig';

// Tipos para TypeScript
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface UserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId: string;
}

// Helper para extraer información del usuario
const extractUserInfo = (user: User, providerId: string): UserInfo => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    providerId,
  };
};

// ==================== EMAIL/PASSWORD AUTHENTICATION ====================

/**
 * Iniciar sesión con email y contraseña
 * @param email - Email del usuario
 * @param password - Contraseña del usuario
 * @returns Promise<AuthResult>
 */
export const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const userInfo = extractUserInfo(userCredential.user, 'password');
    
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error: any) {
    console.error('Error signing in with email:', error);
    
    // Mensajes de error amigables
    let errorMessage = 'Error al iniciar sesión';
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No existe una cuenta con este email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Contraseña incorrecta';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email inválido';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Esta cuenta ha sido deshabilitada';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
        break;
      default:
        errorMessage = error.message || 'Error desconocido';
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Registrar usuario con email y contraseña
 * @param email - Email del usuario
 * @param password - Contraseña del usuario
 * @returns Promise<AuthResult>
 */
export const signUpWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userInfo = extractUserInfo(userCredential.user, 'password');
    
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error: any) {
    console.error('Error signing up with email:', error);
    
    // Mensajes de error amigables
    let errorMessage = 'Error al crear la cuenta';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Ya existe una cuenta con este email';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email inválido';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        break;
      default:
        errorMessage = error.message || 'Error desconocido';
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// ==================== GOOGLE AUTHENTICATION ====================

/**
 * Iniciar sesión con Google
 * NOTA: Este es un helper básico. Para implementación completa,
 * usar el hook useGoogleAuth de googleAuthExample.ts en componentes de UI.
 * @param idToken - Token de identidad de Google obtenido del flujo OAuth
 * @returns Promise<AuthResult>
 */
export const signInWithGoogle = async (idToken: string): Promise<AuthResult> => {
  try {
    // Crear credencial de Firebase con el ID token de Google
    const credential = GoogleAuthProvider.credential(idToken);
    
    // Iniciar sesión con Firebase
    const userCredential = await signInWithCredential(auth, credential);
    
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error: any) {
    console.error('Error en signInWithGoogle:', error);
    return {
      success: false,
      error: error.message || 'Error al iniciar sesión con Google',
    };
  }
};

// ==================== APPLE AUTHENTICATION ====================

/**
 * Iniciar sesión con Apple (solo iOS)
 * @returns Promise<AuthResult>
 */
export const signInWithApple = async (): Promise<AuthResult> => {
  try {
    // Verificar que estamos en iOS
    if (Platform.OS !== 'ios') {
      return {
        success: false,
        error: 'Apple Sign-In solo está disponible en iOS',
      };
    }

    // Verificar disponibilidad de Apple Authentication
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        error: 'Apple Sign-In no está disponible en este dispositivo',
      };
    }

    // Realizar autenticación con Apple
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Crear credencial de Firebase
    const { identityToken } = appleCredential;
    if (!identityToken) {
      throw new Error('No se recibió identity token de Apple');
    }

    // Crear provider de Apple para Firebase
    const provider = new OAuthProvider('apple.com');
    const credential = provider.credential({
      idToken: identityToken,
    });

    // Autenticar con Firebase
    const userCredential = await signInWithCredential(auth, credential);
    
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error: any) {
    console.error('Error signing in with Apple:', error);
    
    // Manejar cancelación del usuario
    if (error.code === 'ERR_CANCELED') {
      return {
        success: false,
        error: 'Autenticación con Apple cancelada',
      };
    }
    
    return {
      success: false,
      error: error.message || 'Error al iniciar sesión con Apple',
    };
  }
};

// ==================== SIGN OUT ====================

/**
 * Cerrar sesión del usuario actual
 * @returns Promise<AuthResult>
 */
export const signOut = async (): Promise<AuthResult> => {
  try {
    await firebaseSignOut(auth);
    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return {
      success: false,
      error: error.message || 'Error al cerrar sesión',
    };
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Obtener el usuario actual
 * @returns User | null
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Verificar si hay un usuario autenticado
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
  return auth.currentUser !== null;
};

/*
Notas importantes para la implementación:

1. GOOGLE SIGN-IN:
   - Requiere configurar OAuth 2.0 client IDs en Google Cloud Console
   - Para Expo Go: usar useProxy: true en la configuración
   - Para builds nativos: configurar SHA-1/SHA-256 fingerprints
   - Redirect URIs: https://auth.expo.io/@usuario/nombreApp

2. APPLE SIGN-IN:
   - Solo funciona en iOS
   - Requiere configuración en Apple Developer Portal
   - Necesita Service ID y claves configuradas en Firebase
   - Solo funciona en builds nativos (EAS Build)

3. EMAIL/PASSWORD:
   - Funciona en Expo Go sin problemas
   - Requiere habilitar el método en Firebase Console
   - Validaciones de seguridad incluidas

4. VARIABLES DE ENTORNO REQUERIDAS:
   - EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID
   - EXPO_PUBLIC_FIREBASE_ANDROID_CLIENT_ID
   - EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID
   - EXPO_PUBLIC_APP_SLUG

5. ERRORES COMUNES:
   - Google: redirect_uri_mismatch → verificar makeRedirectUri
   - Apple: requiere compilación nativa
   - Firebase: verificar configuración de providers
*/