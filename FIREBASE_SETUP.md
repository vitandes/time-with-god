# 🔥 Configuración Firebase Auth 2025 - Time with God

## 📋 Resumen de Implementación

✅ **Completado:**
- Dependencias instaladas (firebase, expo-auth-session, expo-apple-authentication, async-storage)
- Configuración Firebase (`src/firebase/firebaseConfig.ts`)
- Helpers de autenticación (`src/services/authHelpers.ts`)
- Contexto de autenticación actualizado (`src/context/AuthContext.js`)
- LoginScreen y RegisterScreen actualizados con Firebase Auth
- Variables de entorno configuradas (`.env`)

## 🚀 Configuración Firebase Console (UI 2025)

### 1. Crear Proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Clic en "Crear un proyecto" o "Add project"
3. Nombre: `time-with-god` (o el que prefieras)
4. Habilita Google Analytics (opcional)
5. Selecciona cuenta de Analytics

### 2. Configurar Authentication
1. En el panel izquierdo: **Build > Authentication**
2. Clic en "Get started" si es la primera vez
3. Ve a la pestaña **"Sign-in method"**
4. Habilita los siguientes proveedores:

#### ✉️ Email/Password
- Clic en "Email/Password"
- Habilita "Email/Password"
- Habilita "Email link (passwordless sign-in)" (opcional)
- Guardar

#### 🔍 Google
- Clic en "Google"
- Habilita el toggle
- **Project support email:** tu email
- **Web SDK configuration:** se auto-genera
- Guardar

#### 🍎 Apple (solo iOS)
- Clic en "Apple"
- Habilita el toggle
- **Apple ID:** (configurar después en Apple Developer)
- **Apple Team ID:** (obtener de Apple Developer Portal)
- **Key ID:** (crear en Apple Developer Portal)
- **Private Key:** (descargar de Apple Developer Portal)
- Guardar

### 3. Configurar Web App
1. En **Project Overview**, clic en el ícono web `</>`
2. **App nickname:** `time-with-god-web`
3. **Firebase Hosting:** No (por ahora)
4. Clic "Register app"
5. **Copiar la configuración** y actualizar `.env`:

```javascript
// Ejemplo de configuración que aparecerá:
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "time-with-god-xxxxx.firebaseapp.com",
  projectId: "time-with-god-xxxxx",
  storageBucket: "time-with-god-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 🔑 Configuración Google OAuth

### 1. Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto Firebase
3. **APIs & Services > Credentials**
4. Clic "+ CREATE CREDENTIALS > OAuth 2.0 Client IDs"

### 2. Crear Client IDs

#### Web Application
- **Application type:** Web application
- **Name:** `time-with-god-web`
- **Authorized redirect URIs:**
  ```
  https://time-with-god-xxxxx.firebaseapp.com/__/auth/handler
  https://auth.expo.io/@tu_usuario/time-with-god
  ```

#### iOS Application
- **Application type:** iOS
- **Name:** `time-with-god-ios`
- **Bundle ID:** `com.tuusuario.timewithgod` (debe coincidir con app.json)

#### Android Application
- **Application type:** Android
- **Name:** `time-with-god-android`
- **Package name:** `com.tuusuario.timewithgod`
- **SHA-1 certificate fingerprint:** (obtener con `expo credentials:manager`)

### 3. Actualizar .env
```env
GOOGLE_WEB_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=123456789-ghijkl.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=123456789-mnopqr.apps.googleusercontent.com
```

## 🍎 Configuración Apple Sign-In

### 1. Apple Developer Portal
1. Ve a [Apple Developer](https://developer.apple.com/account/)
2. **Certificates, Identifiers & Profiles**
3. **Identifiers > App IDs**
4. Crear/editar tu App ID
5. Habilita **Sign In with Apple**

### 2. Crear Service ID
1. **Identifiers > Services IDs**
2. Clic "+" para crear nuevo
3. **Description:** `Time with God Sign In`
4. **Identifier:** `com.tuusuario.timewithgod.signin`
5. Habilita **Sign In with Apple**
6. **Configure:**
   - **Primary App ID:** tu App ID principal
   - **Web Domain:** `time-with-god-xxxxx.firebaseapp.com`
   - **Return URLs:** `https://time-with-god-xxxxx.firebaseapp.com/__/auth/handler`

### 3. Crear Key para Firebase
1. **Keys** en el menú lateral
2. Clic "+" para crear nueva key
3. **Key Name:** `Firebase Apple Auth`
4. Habilita **Sign In with Apple**
5. **Configure:** selecciona tu Primary App ID
6. **Descargar la key** (.p8 file)
7. **Anotar el Key ID**

### 4. Configurar en Firebase
1. Firebase Console > Authentication > Sign-in method > Apple
2. **Service ID:** `com.tuusuario.timewithgod.signin`
3. **Apple Team ID:** (encontrar en Apple Developer > Membership)
4. **Key ID:** el ID de la key creada
5. **Private Key:** contenido del archivo .p8

## 📱 Configuración Expo

### 1. Actualizar app.json/app.config.js
```json
{
  "expo": {
    "name": "Time with God",
    "slug": "time-with-god",
    "scheme": "timewithgod",
    "ios": {
      "bundleIdentifier": "com.tuusuario.timewithgod",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "package": "com.tuusuario.timewithgod",
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      "expo-apple-authentication",
      "@react-native-async-storage/async-storage"
    ]
  }
}
```

### 2. Descargar archivos de configuración

#### iOS (GoogleService-Info.plist)
1. Firebase Console > Project Settings > General
2. Sección "Your apps" > iOS app
3. Descargar `GoogleService-Info.plist`
4. Colocar en la raíz del proyecto

#### Android (google-services.json)
1. Firebase Console > Project Settings > General
2. Sección "Your apps" > Android app
3. Descargar `google-services.json`
4. Colocar en la raíz del proyecto

## 🧪 Pruebas y Desarrollo

### ✅ Expo Go (Limitado)
**Funciona:**
- ✅ Email/Password authentication
- ✅ Google Sign-In (con `useProxy: true`)

**NO funciona:**
- ❌ Apple Sign-In (requiere build nativo)
- ❌ Google Sign-In nativo (sin proxy)

**Comando para desarrollo:**
```bash
npx expo start
```

### 🏗️ EAS Build (Completo)
**Funciona todo:**
- ✅ Email/Password authentication
- ✅ Google Sign-In nativo
- ✅ Apple Sign-In (solo iOS)

**Comandos para build:**
```bash
# Configurar EAS
npx eas build:configure

# Build para desarrollo
npx eas build --profile development --platform ios
npx eas build --profile development --platform android

# Build para producción
npx eas build --profile production --platform all
```

## 🐛 Checklist de Errores Comunes

### Google Sign-In
- ❌ **"redirect_uri_mismatch"**
  - ✅ Verificar que los redirect URIs en Google Cloud coincidan
  - ✅ Usar `makeRedirectUri()` correctamente
  - ✅ Verificar que el Client ID sea correcto

- ❌ **"invalid_client"**
  - ✅ Verificar que el Client ID esté en `.env`
  - ✅ Verificar que el bundle ID/package name coincida

### Apple Sign-In
- ❌ **"invalid_client"**
  - ✅ Verificar Service ID en Apple Developer
  - ✅ Verificar configuración en Firebase
  - ✅ Solo funciona en builds nativos (no Expo Go)

- ❌ **"unauthorized_client"**
  - ✅ Verificar que el dominio esté configurado
  - ✅ Verificar return URLs

### Firebase
- ❌ **"auth/invalid-api-key"**
  - ✅ Verificar API key en `.env`
  - ✅ Verificar que el proyecto esté activo

- ❌ **"auth/network-request-failed"**
  - ✅ Verificar conexión a internet
  - ✅ Verificar que Firebase esté configurado

### Android Específico
- ❌ **SHA-1/SHA-256 missing**
  - ✅ Generar con: `expo credentials:manager`
  - ✅ Agregar en Firebase Console > Project Settings > General > Android app

## 🎯 Próximos Pasos

1. **Configurar Firebase Console** siguiendo esta guía
2. **Actualizar `.env`** con los valores reales
3. **Probar en Expo Go** (Email/Password y Google con proxy)
4. **Configurar EAS Build** para pruebas completas
5. **Probar Apple Sign-In** en dispositivo iOS real

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs de la consola
2. Verifica la configuración paso a paso
3. Consulta la [documentación oficial de Firebase](https://firebase.google.com/docs/auth)
4. Revisa los [ejemplos de Expo](https://docs.expo.dev/guides/authentication/)

---

**¡Tu sistema de autenticación Firebase está listo! 🚀**