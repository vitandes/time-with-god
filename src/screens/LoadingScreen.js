import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const LoadingScreen = () => {
  // Animación de rotación para el ícono
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Animación de rotación continua
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 3000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Animación de escala pulsante
    scale.value = withRepeat(
      withTiming(1.2, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  return (
    <LinearGradient
      colors={[Colors.gradients.primary.start, Colors.gradients.primary.end]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Ícono animado */}
        <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
          <Ionicons
            name="flower-outline"
            size={80}
            color={Colors.text.primary}
          />
        </Animated.View>

        {/* Título de la app */}
        <Text style={styles.title}>Tiempo con Dios</Text>
        
        {/* Subtítulo */}
        <Text style={styles.subtitle}>
          Momentos de paz y conexión espiritual
        </Text>

        {/* Indicador de carga */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Colors.text.primary}
            style={styles.spinner}
          />
          <Text style={styles.loadingText}>Preparando tu espacio sagrado...</Text>
        </View>
      </View>

      {/* Elementos decorativos */}
      <View style={styles.decorativeElements}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  iconContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: Colors.surface,
    borderRadius: 60,
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 50,
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  decorativeElements: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: Colors.surface,
    opacity: 0.1,
  },
  circle1: {
    width: 100,
    height: 100,
    top: height * 0.1,
    left: width * 0.1,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: height * 0.15,
    right: width * 0.05,
  },
  circle3: {
    width: 80,
    height: 80,
    top: height * 0.3,
    right: width * 0.15,
  },
});

export default LoadingScreen;