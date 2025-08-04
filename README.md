# Tiempo con Dios 🙏

Una aplicación móvil React Native desarrollada con Expo para ayudar a las personas a tener momentos diarios de oración, reflexión y meditación espiritual de manera guiada y enfocada.

## 🌟 Características Principales

### 🔐 Autenticación
- Registro e inicio de sesión con email
- Integración con Google Sign-In (simulado)
- Sistema de suscripción con prueba gratuita de 7 días

### ⏰ Sesiones Espirituales
- Selección de duración: 5, 10, 15 o 30 minutos
- Temporizador con versículos bíblicos y frases inspiradoras
- Música instrumental opcional (funcionalidad simulada)
- Seguimiento de progreso y estadísticas

### 🌱 Planta Espiritual (Gamificación)
- Sistema visual de progreso con una planta virtual
- 6 etapas de crecimiento: Semilla → Brote → Planta joven → Planta con hojas → Planta con flor → Planta sagrada
- La planta crece con sesiones completadas
- Se marchita si no hay actividad por más de 48 horas
- Mensajes motivacionales basados en el estado de la planta

### 📊 Historial y Estadísticas
- Seguimiento de sesiones completadas
- Estadísticas semanales, mensuales y anuales
- Sistema de rachas consecutivas
- Registro de estados de ánimo post-sesión

### 👤 Perfil y Configuración
- Gestión de cuenta y suscripción
- Configuración de notificaciones
- Preferencias de música
- Recordatorios diarios personalizables

## 🎨 Diseño

### Paleta de Colores
- **Colores principales**: Blanco, lavanda, azul cielo, beige
- **Tipografía**: Tranquila, elegante y legible
- **Estilo**: Minimalista, limpio y sin distracciones
- **Animaciones**: Suaves y naturales

### Iconografía
- Íconos sutiles y espirituales
- Elementos naturales (hojas, flores, nubes)
- Símbolos de paz y tranquilidad

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI
- Expo Go app en tu dispositivo móvil (opcional)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd tiempo-de-dios
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

4. **Ejecutar en dispositivo**
   - Escanea el código QR con Expo Go (Android) o la cámara (iOS)
   - O presiona `a` para Android emulator, `i` para iOS simulator

## 📱 Navegación de la App

### Flujo de Autenticación
1. **Pantalla de Bienvenida** - Introducción a la app
2. **Registro** - Crear nueva cuenta
3. **Login** - Iniciar sesión
4. **Suscripción** - Seleccionar plan (con prueba gratuita)

### Flujo Principal (Usuario Autenticado)
1. **Home** - Planta espiritual y selección de sesión
2. **Sesión** - Temporizador con contenido espiritual
3. **Completar Sesión** - Registro de estado de ánimo y notas
4. **Historial** - Estadísticas y progreso
5. **Perfil** - Configuración y gestión de cuenta

## 🛠️ Tecnologías Utilizadas

### Core
- **React Native** - Framework de desarrollo móvil
- **Expo** - Plataforma de desarrollo y despliegue
- **React Navigation** - Navegación entre pantallas

### UI/UX
- **React Native Reanimated** - Animaciones fluidas
- **Expo Linear Gradient** - Gradientes de colores
- **Expo Vector Icons** - Iconografía
- **React Native SVG** - Gráficos vectoriales

### Funcionalidades
- **AsyncStorage** - Almacenamiento local
- **Expo AV** - Reproducción de audio (preparado)
- **Expo Auth Session** - Autenticación (preparado)
- **Expo Notifications** - Notificaciones push (preparado)

## 📂 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   └── SpiritualPlant.js # Componente de la planta espiritual
├── constants/           # Constantes y configuración
│   ├── Colors.js        # Paleta de colores
│   └── Constants.js     # Configuraciones generales
├── context/             # Context API para estado global
│   └── AuthContext.js   # Gestión de autenticación y estado
├── hooks/               # Custom hooks (preparado para expansión)
├── navigation/          # Configuración de navegación
│   └── AppNavigator.js  # Navegador principal
├── screens/             # Pantallas de la aplicación
│   ├── WelcomeScreen.js
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── SubscriptionScreen.js
│   ├── HomeScreen.js
│   ├── SessionScreen.js
│   ├── SessionCompleteScreen.js
│   ├── HistoryScreen.js
│   ├── ProfileScreen.js
│   └── LoadingScreen.js
├── services/            # Servicios externos (preparado)
└── utils/               # Utilidades (preparado)
```

## 🔮 Funcionalidades Futuras

### Integraciones Pendientes
- **RevenueCat** - Gestión completa de suscripciones
- **Stripe** - Procesamiento de pagos
- **Firebase** - Backend y analytics
- **Google Sign-In** - Autenticación real
- **Apple Sign-In** - Autenticación iOS

### Características Adicionales
- Contenido premium con más versículos y meditaciones
- Biblioteca de música instrumental cristiana
- Comunidad y compartir progreso
- Planes de lectura bíblica
- Recordatorios inteligentes
- Modo offline
- Múltiples idiomas

## 🎯 Estados de la Planta Espiritual

| Etapa | Sesiones Requeridas | Descripción |
|-------|-------------------|-------------|
| 🌰 Semilla | 0-4 | "Tu viaje espiritual comienza aquí" |
| 🌾 Brote | 5-9 | "Primeros pasos en tu crecimiento" |
| 🌱 Planta joven | 10-24 | "Tu fe está echando raíces" |
| 🌿 Planta con hojas | 25-49 | "Creciendo en sabiduría y gracia" |
| 🌸 Planta con flor | 50-99 | "Floreciendo en tu relación con Dios" |
| 🌳 Planta sagrada | 100+ | "Un árbol plantado junto a corrientes de agua" |

## 💡 Consejos de Uso

1. **Consistencia**: Intenta mantener una rutina diaria para ver crecer tu planta
2. **Duración**: Comienza con sesiones cortas (5-10 min) y aumenta gradualmente
3. **Ambiente**: Busca un lugar tranquilo y sin distracciones
4. **Reflexión**: Usa las notas post-sesión para registrar tus pensamientos
5. **Paciencia**: El crecimiento espiritual es un proceso gradual

## 🤝 Contribución

Este proyecto está en desarrollo activo. Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre la aplicación:
- Email: soporte@tiempoconDios.com
- Issues: GitHub Issues

---

*"Cada momento que dedicas a Dios es una semilla plantada en tu corazón"* 🌱💚