import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSequence,
  withDelay,
} from 'react-native-reanimated';

import { useAuth } from '../context/AuthContext';
import { useConstants } from '../hooks/useConstants';
import Colors from '../constants/Colors';
import SpiritualPlant from '../components/SpiritualPlant';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation('app');
  const { sessionDurations, plantStages } = useConstants();
  const { plant } = useAuth();
  const [selectedTime, setSelectedTime] = useState(5);
  const [currentPlantStage, setCurrentPlantStage] = useState(plantStages.SEED);

  // Animaciones
  const plantScale = useSharedValue(1);
  const plantRotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0.5);
  const particle1Y = useSharedValue(0);
  const particle2Y = useSharedValue(0);

  useEffect(() => {
    // Determinar etapa actual de la planta
    const totalSessions = plant.totalSessions || 0;
    let stage = plantStages.SEED;

    Object.values(plantStages).forEach(stageData => {
      if (totalSessions >= stageData.minSessions && totalSessions <= stageData.maxSessions) {
        stage = stageData;
      }
    });

    setCurrentPlantStage(stage);
  }, [plant.totalSessions]);

  useEffect(() => {
    // Animación de respiración para la planta
    plantScale.value = withRepeat(
      withTiming(1.05, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Glow effect pulsante
    glowOpacity.value = withRepeat(
      withTiming(0.8, {
        duration: 2500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Partículas flotantes
    particle1Y.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    particle2Y.value = withDelay(1000, withRepeat(
      withSequence(
        withTiming(-30, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    ));

    // Rotación suave si la planta está saludable
    if (plant.isHealthy) {
      plantRotation.value = withRepeat(
        withTiming(3, {
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );
    }
  }, [plant.isHealthy]);

  const animatedPlantStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: plantScale.value },
        { rotate: `${plantRotation.value}deg` },
      ],
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
      transform: [{ scale: plantScale.value }],
    };
  });

  const particle1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle1Y.value }],
  }));

  const particle2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle2Y.value }],
  }));

  const handleStartSession = () => {
    const duration = { id: selectedTime.toString(), minutes: selectedTime };
    navigation.navigate('Session', { duration });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.spiritual}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      {/* Efectos de fondo (Luces ambientales) */}
      <View style={[styles.ambientLight, styles.ambientLightTop]} />
      <View style={[styles.ambientLight, styles.ambientLightBottom]} />

      {/* Partículas */}
      <Animated.View style={[styles.particle, { top: '20%', left: '15%', width: 4, height: 4 }, particle1Style]} />
      <Animated.View style={[styles.particle, { top: '30%', right: '20%', width: 6, height: 6, opacity: 0.4 }, particle2Style]} />
      <Animated.View style={[styles.particle, { bottom: '40%', left: '10%', width: 3, height: 3, opacity: 0.3 }, particle1Style]} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greetingTitle}>{t('home.greeting')}</Text>
          <Text style={styles.greetingSubtitle}>{t('home.subtitle')}</Text>
        </View>

        {/* Contenedor central con planta */}
        <View style={styles.centerContainer}>
          <View style={styles.plantWrapper}>
            {/* Halo de luz detrás de la planta */}
            <Animated.View style={[styles.glowHalo, animatedGlowStyle]} />

            <Animated.View style={[styles.plantContainer, animatedPlantStyle]}>
              <SpiritualPlant
                animated={true}
                size={220}
              />
            </Animated.View>
          </View>
        </View>

        {/* Sección de controles inferior */}
        <View style={styles.bottomControls}>
          {/* Selector de tiempo */}
          <View style={styles.timeSelectorContainer}>
            <Text style={styles.timeLabel}>{t('home.timeWithGod')}</Text>

            <View style={styles.timeControls}>
              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => setSelectedTime(Math.max(5, selectedTime - 5))}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={24} color={Colors.white} />
              </TouchableOpacity>

              <View style={styles.timeDisplayContainer}>
                <Text style={styles.timeValue}>{selectedTime}</Text>
                <Text style={styles.timeUnit}>min</Text>
              </View>

              <TouchableOpacity
                style={styles.adjustButton}
                onPress={() => setSelectedTime(Math.min(60, selectedTime + 5))}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={24} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botón de inicio */}
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartSession}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.startButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.startButtonText}>{t('home.startSession')}</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.white} style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  ambientLight: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width,
    opacity: 0.15,
  },
  ambientLightTop: {
    top: -width * 0.8,
    left: -width * 0.2,
    backgroundColor: '#8A2BE2', // BlueViolet
    transform: [{ scale: 1.2 }],
  },
  ambientLightBottom: {
    bottom: -width * 0.8,
    right: -width * 0.2,
    backgroundColor: '#4B0082', // Indigo
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 50,
    opacity: 0.5,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-light',
  },
  greetingSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
    fontWeight: '400',
    letterSpacing: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantWrapper: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowHalo: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
    shadowColor: '#E6E6FA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 20,
  },
  plantContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  timeSelectorContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timeLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
  },
  timeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  adjustButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  timeDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeValue: {
    fontSize: 42,
    fontWeight: '200',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-thin',
  },
  timeUnit: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: -5,
  },
  startButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 30,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default HomeScreen;