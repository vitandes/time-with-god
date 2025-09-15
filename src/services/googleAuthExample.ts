/**
 * Ejemplo de implementación correcta de Google Auth con expo-auth-session
 * usando useAuthRequest (reemplaza el método obsoleto startAsync)
 * 
 * IMPORTANTE: Este archivo es solo un ejemplo de referencia.
 * Debes implementar este patrón directamente en tus componentes de UI.
 */

import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

// Necesario para cerrar el popup web
WebBrowser.maybeCompleteAuthSession();

/**
 * Hook personalizado para Google Auth con Firebase
 * Úsalo en tus componentes de la siguiente manera:
 * 
 * const { request, response, promptAsync } = useGoogleAuth();
 * 
 * // En tu JSX:
 * <Button disabled={!request} onPress={() => promptAsync()} title="Sign in with Google" />
 */
export const useGoogleAuth = () => {
  // Auto-discovery para Google OAuth endpoints
  const discovery = useAutoDiscovery('https://accounts.google.com');
  
  // Configurar la solicitud de autenticación
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '',
      scopes: ['openid', 'profile', 'email'],
      redirectUri: makeRedirectUri({
        scheme: process.env.EXPO_PUBLIC_APP_SLUG || 'time-with-god',
        path: 'auth',
        useProxy: true, // Para desarrollo con Expo Go
      }),
      responseType: 'id_token', // Para obtener directamente el ID token
      extraParams: {
        // Forzar selección de cuenta
        prompt: 'select_account',
      },
    },
    discovery
  );

  // Manejar la respuesta de autenticación
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleSignIn(response.params.id_token);
    } else if (response?.type === 'error') {
      console.error('Google Auth Error:', response.error);
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken: string) => {
    try {
      // Crear credencial de Firebase con el ID token
      const credential = GoogleAuthProvider.credential(idToken);
      
      // Iniciar sesión con Firebase
      const userCredential = await signInWithCredential(auth, credential);
      
      console.log('Usuario autenticado:', userCredential.user.email);
      
      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error: any) {
      console.error('Error al iniciar sesión con Firebase:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  };

  return {
    request,
    response,
    promptAsync,
  };
};

/**
 * Ejemplo de uso en un componente:
 * 
 * import React from 'react';
 * import { Button, View } from 'react-native';
 * import { useGoogleAuth } from '../services/googleAuthExample';
 * 
 * export const LoginScreen = () => {
 *   const { request, promptAsync } = useGoogleAuth();
 * 
 *   return (
 *     <View>
 *       <Button
 *         disabled={!request}
 *         title="Iniciar sesión con Google"
 *         onPress={() => {
 *           promptAsync();
 *         }}
 *       />
 *     </View>
 *   );
 * };
 */

/**
 * Configuración alternativa para builds nativos (sin proxy):
 * 
 * redirectUri: makeRedirectUri({
 *   scheme: 'com.tuusuario.timewithgod', // Debe coincidir con app.json
 *   path: 'auth',
 *   useProxy: false, // Para builds nativos
 * }),
 * 
 * También necesitarás configurar:
 * 1. Google Cloud Console con el bundle ID correcto
 * 2. SHA-1 fingerprint para Android
 * 3. URL scheme en app.json
 */

/**
 * Variables de entorno requeridas en .env:
 * 
 * EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=tu_client_id.apps.googleusercontent.com
 * EXPO_PUBLIC_APP_SLUG=time-with-god
 */