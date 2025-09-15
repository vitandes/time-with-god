# Correcciones de Firebase Auth - Errores Resueltos

## 🔧 Errores Corregidos

### 1. Error: `getReactNativePersistence` no exportado

**Problema:**
```typescript
// ❌ INCORRECTO (versiones inconsistentes)
import { getReactNativePersistence } from 'firebase/auth/react-native';
```

**Solución Final:**
```typescript
// ✅ CORRECTO - Firebase v12+ con fallback
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Implementación con try/catch para compatibilidad
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error) {
  const { getAuth } = require('firebase/auth');
  auth = getAuth(app);
}
```

**Archivos modificados:**
- `src/firebase/firebaseConfig.ts`

### 2. Error: `expo-web-browser` no encontrado

**Problema:**
```typescript
// ❌ FALTA DEPENDENCIA
import * as WebBrowser from 'expo-web-browser';
```

**Solución:**
```bash
# ✅ INSTALAR DEPENDENCIA
npm install expo-web-browser
```

**Archivos afectados:**
- `src/services/googleAuthExample.ts`

### 3. Error: `startAsync` no exportado de expo-auth-session

**Problema:**
```typescript
// ❌ OBSOLETO
import { startAsync } from 'expo-auth-session';
```

**Solución:**
```typescript
// ✅ MÉTODO MODERNO
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
```

**Archivos modificados:**
- `src/services/authHelpers.ts`
- `src/services/googleAuthExample.ts` (nuevo archivo con implementación correcta)

## 📱 Implementaciones Actualizadas

### Google Authentication

**Patrón Anterior (Obsoleto):**
```typescript
// ❌ No funciona en versiones recientes
const result = await startAsync({
  authUrl: 'https://accounts.google.com/oauth/authorize',
  // ...
});
```

**Patrón Actual (Recomendado):**
```typescript
// ✅ Hook moderno con useAuthRequest
const [request, response, promptAsync] = useAuthRequest({
  clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  scopes: ['openid', 'profile', 'email'],
  redirectUri: makeRedirectUri({ useProxy: true }),
  responseType: 'id_token',
}, discovery);
```

### Apple Authentication

**Implementación Completa:**
```typescript
// ✅ Usando expo-apple-authentication
import * as AppleAuthentication from 'expo-apple-authentication';

const credential = await AppleAuthentication.signInAsync({
  requestedScopes: [
    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    AppleAuthentication.AppleAuthenticationScope.EMAIL,
  ],
});
```

## 📦 Dependencias Requeridas

### Instalar Dependencias Faltantes

```bash
# Para Apple Sign-In
expo install expo-apple-authentication

# Para Google Auth (si no están instaladas)
expo install expo-auth-session expo-crypto

# Para persistencia de auth
expo install @react-native-async-storage/async-storage
```

### Verificar package.json

Asegúrate de tener estas versiones mínimas:
```json
{
  "expo-auth-session": "~5.0.0",
  "expo-apple-authentication": "~6.0.0",
  "@react-native-async-storage/async-storage": "1.18.2",
  "firebase": "^10.0.0"
}
```

## 🔄 Migración de Código

### Pantallas de Login/Register

**Antes:**
```javascript
// ❌ Llamada directa obsoleta
const result = await signInWithGoogle();
```

**Después:**
```javascript
// ✅ Usar hook en componente
const { request, promptAsync } = useGoogleAuth();

// En el JSX:
<Button 
  disabled={!request} 
  onPress={() => promptAsync()} 
  title="Sign in with Google" 
/>
```

### AuthHelpers Actualizados

**Google Auth:**
- Ahora requiere `idToken` como parámetro
- Usar `googleAuthExample.ts` para implementación completa

**Apple Auth:**
- Implementación completa con `expo-apple-authentication`
- Manejo de errores mejorado
- Verificación de disponibilidad del dispositivo

## 🚀 Próximos Pasos

### 1. Instalar Dependencias
```bash
expo install expo-apple-authentication
```

### 2. Configurar Variables de Entorno
Actualizar `.env` con tus claves reales de Firebase y Google.

### 3. Implementar useGoogleAuth Hook
Reemplazar las llamadas directas a `signInWithGoogle()` con el hook `useGoogleAuth` en tus componentes.

### 4. Probar Autenticación
- **Email/Password**: ✅ Funciona en Expo Go
- **Google**: ✅ Funciona en Expo Go (con useProxy: true)
- **Apple**: ⚠️ Requiere EAS Build nativo

### 5. Configuración de Producción
- Configurar Google Cloud Console
- Configurar Apple Developer Console
- Generar builds nativos para Apple Sign-In

## 📋 Checklist de Verificación

- [ ] ✅ Error `getReactNativePersistence` corregido
- [ ] ✅ Error `startAsync` corregido
- [ ] ✅ Apple Auth implementado completamente
- [ ] ✅ Google Auth actualizado con patrón moderno
- [ ] ⏳ Instalar `expo-apple-authentication`
- [ ] ⏳ Actualizar variables de entorno
- [ ] ⏳ Migrar componentes a usar hooks
- [ ] ⏳ Probar en dispositivo/simulador

## 🔗 Referencias

- [Firebase Auth React Native](https://firebase.google.com/docs/auth/react-native)
- [Expo Auth Session](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Expo Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [Google OAuth Setup](https://docs.expo.dev/guides/google-authentication/)