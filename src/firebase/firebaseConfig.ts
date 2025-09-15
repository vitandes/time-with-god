// Firebase Configuration for Time with God App
// Este archivo contiene la configuración de Firebase para autenticación
// Las claves deben ser configuradas en las variables de entorno

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// NOTA: Usando getAuth() estándar que funciona perfectamente en React Native
// Firebase maneja automáticamente la persistencia en dispositivos móviles

// Configuración de Firebase - estas claves deben venir de variables de entorno
// Para configurar:
// 1. Crear proyecto en Firebase Console (https://console.firebase.google.com)
// 2. Habilitar Authentication > Sign-in method: Google, Apple, Email/Password
// 3. Obtener las claves de configuración del proyecto
// 4. Configurar las variables de entorno en .env
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "your-api-key-here",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  // Para iOS
  iosClientId: process.env.EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID || "your-ios-client-id",
  // Para Android
  androidClientId: process.env.EXPO_PUBLIC_FIREBASE_ANDROID_CLIENT_ID || "your-android-client-id",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth - Firebase maneja automáticamente la persistencia en React Native
// getAuth() es la forma recomendada y más estable para inicializar Firebase Auth
const auth = getAuth(app);

// Exportar la instancia de auth para usar en toda la app
export { auth };
export default app;

// Configuración adicional para desarrollo
export const firebaseConfigInfo = {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  // URLs de redirección para OAuth (Google, Apple)
  redirectUris: [
    `https://auth.expo.io/@${process.env.EXPO_PUBLIC_EXPO_USERNAME || 'usuario'}/${process.env.EXPO_PUBLIC_APP_SLUG || 'time-with-god'}`,
    // Para desarrollo local
    'http://localhost:19006/auth',
    // Para Expo Go
    'exp://localhost:19000/--/auth'
  ]
};

/*
Pasos para configurar Firebase Console (UI 2025):

1. Crear proyecto en https://console.firebase.google.com
2. Ir a Authentication > Get started
3. En Sign-in method, habilitar:
   - Google: Configurar OAuth 2.0 client IDs
   - Apple: Configurar Service ID y claves
   - Email/Password: Simplemente habilitar

4. Para Google Sign-In:
   - Ir a Google Cloud Console
   - APIs & Services > Credentials
   - Crear OAuth 2.0 client IDs para Web, iOS, Android
   - Configurar redirect URIs autorizados

5. Para Apple Sign-In:
   - Apple Developer Portal > Certificates, IDs & Profiles
   - Crear Service ID
   - Configurar Sign in with Apple
   - Agregar las claves en Firebase Console

6. Variables de entorno necesarias en .env:
   EXPO_PUBLIC_FIREBASE_API_KEY=
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   EXPO_PUBLIC_FIREBASE_APP_ID=
   EXPO_PUBLIC_FIREBASE_IOS_CLIENT_ID=
   EXPO_PUBLIC_FIREBASE_ANDROID_CLIENT_ID=
   EXPO_PUBLIC_EXPO_USERNAME=
   EXPO_PUBLIC_APP_SLUG=
*/