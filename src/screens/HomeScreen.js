import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
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
} from 'react-native-reanimated';

import { useAuth } from '../context/AuthContext';
import { SESSION_DURATIONS, PLANT_STAGES, MESSAGES } from '../constants/Constants';
import Colors from '../constants/Colors';
import SpiritualPlant from '../components/SpiritualPlant';

const HomeScreen = ({ navigation }) => {
  const { user, sessions, plant } = useAuth();
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [currentPlantStage, setCurrentPlantStage] = useState(PLANT_STAGES.SEED);

  // Animaciones
  const plantScale = useSharedValue(1);
  const plantRotation = useSharedValue(0);

  useEffect(() => {
    // Determinar etapa actual de la planta
    const totalSessions = plant.totalSessions || 0;
    let stage = PLANT_STAGES.SEED;

    Object.values(PLANT_STAGES).forEach(stageData => {
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
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Rotación suave si la planta está saludable
    if (plant.isHealthy) {
      plantRotation.value = withRepeat(
        withTiming(5, {
          duration: 3000,
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



  const handleStartSession = () => {
    if (!selectedDuration) {
      Alert.alert(
        'Selecciona un tiempo',
        'Por favor elige cuánto tiempo quieres dedicar a tu momento con Dios.',
        [{ text: 'OK' }]
      );
      return;
    }

    const duration = { id: selectedDuration.toString(), minutes: selectedDuration };
    navigation.navigate('Session', { duration });
  };



  return (
    <LinearGradient
      colors={Colors.gradients.primary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header simple */}
        <View style={styles.header}>
          <Text style={styles.greeting}>¡Empieza tu momento con Dios hoy!</Text>
        </View>

        {/* Contenedor central con planta */}
        <View style={styles.centerContainer}>
          <View style={styles.plantCircle}>
            <Animated.View style={[styles.plantIconContainer, animatedPlantStyle]}>
              <SpiritualPlant 
                stage={currentPlantStage.id}
                health={100}
                lastWatered={plant.lastWatered}
                totalMinutes={sessions.totalMinutes || 0}
                animated={true}
              />
            </Animated.View>
          </View>
        </View>

        {/* Sección de tiempo */}
        <View style={styles.timeSection}>
          <Text style={styles.timeLabel}>Oración</Text>
          <View style={styles.timeContainer}>
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setSelectedDuration(Math.max(5, selectedDuration - 5))}
            >
              <Text style={styles.timeButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.timeDisplay}>
              {selectedDuration}:00
            </Text>
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setSelectedDuration(Math.min(60, selectedDuration + 5))}
            >
              <Text style={styles.timeButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón principal */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.plantButton}
            onPress={handleStartSession}
            activeOpacity={0.8}
          >
            <Text style={styles.plantButtonText}>Orar</Text>
          </TouchableOpacity>
        </View>


      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  plantIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timeLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    opacity: 0.9,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  timeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 2,
    minWidth: 120,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  plantButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  plantButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },


});

export default HomeScreen;