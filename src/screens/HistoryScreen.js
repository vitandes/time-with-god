import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { useAuth } from '../context/AuthContext';
import { usePlantProgress } from '../hooks/usePlantProgress';
import { useSessionHistory } from '../hooks/useSessionHistory';
import { PLANTS } from '../constants/Constants';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const moodEmojis = {
  peaceful: '😌',
  grateful: '🙏',
  calm: '😊',
  joyful: '😄',
  inspired: '✨',
  loved: '💕',
  strengthened: '💪',
  comforted: '🤗'
};

const HistoryScreen = () => {
  const { user } = useAuth();
  const { obtainedPlants } = usePlantProgress();
  const { getStats } = useSessionHistory();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  
  // Animaciones
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(30);

  // Obtener datos dinámicos del historial
  const currentData = getStats(selectedPeriod);
  
  // Agregar plantas de prueba si no hay plantas obtenidas
  const displayPlants = obtainedPlants.length > 0 ? obtainedPlants : ['cactus', 'cedro', 'flor-azul'];

  const periods = [
    { key: 'week', label: 'Esta semana' },
    { key: 'month', label: 'Este mes' },
    { key: 'year', label: 'Este año' },
  ];

  const moodEmojis = {
    grateful: '🙏',
    peaceful: '😌',
    loved: '💝',
    inspired: '✨',
    comforted: '🤗',
    strengthened: '💪',
  };

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    fadeIn.value = withTiming(1, { duration: 800 });
    slideUp.value = withTiming(0, { 
      duration: 600, 
      easing: Easing.out(Easing.ease) 
    });
  };



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getStreakMessage = (streak) => {
    if (streak >= 30) return '¡Increíble constancia! 🌟';
    if (streak >= 14) return '¡Excelente hábito! 🔥';
    if (streak >= 7) return '¡Gran progreso! 💪';
    if (streak >= 3) return '¡Buen comienzo! 🌱';
    return '¡Sigue adelante! 💚';
  };

  const getPlantStage = (totalSessions) => {
    if (totalSessions >= 100) return { icon: '🌳', stage: 'Árbol sagrado' };
    if (totalSessions >= 50) return { icon: '🌸', stage: 'Planta florecida' };
    if (totalSessions >= 25) return { icon: '🌿', stage: 'Planta con hojas' };
    if (totalSessions >= 10) return { icon: '🌱', stage: 'Planta joven' };
    if (totalSessions >= 5) return { icon: '🌾', stage: 'Brote' };
    return { icon: '🌰', stage: 'Semilla' };
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeIn.value,
      transform: [{ translateY: slideUp.value }],
    };
  });


  const plantStage = getPlantStage(currentData.totalSessions);

  return (
    <LinearGradient
      colors={Colors.gradients.primary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Mi Progreso Espiritual</Text>
            <Text style={styles.subtitle}>Tu camino con Dios</Text>
          </View>

          {/* Medallas de plantas obtenidas - Slider */}
          <View style={styles.gardenSection}>
            <Text style={styles.gardenTitle}>Plantas Obtenidas</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.plantsSlider}
              style={styles.sliderContainer}
            >
              {displayPlants.map((plantId, index) => {
                const plant = PLANTS.find(p => p.id === plantId);
                return (
                  <View key={index} style={styles.plantMedal}>
                    <Image 
                      source={plant?.image} 
                      style={styles.medalImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.medalName}>{plant?.name}</Text>
                  </View>
                );
              })}
              {/* Espacios vacíos para mostrar progreso */}
              {Array.from({ length: Math.max(0, 10 - displayPlants.length) }).map((_, index) => (
                <View key={`empty-${index}`} style={[styles.plantMedal, styles.emptyMedal]}>
                  <Ionicons name="leaf-outline" size={24} color={Colors.text.secondary} style={styles.emptyIcon} />
                  <Text style={styles.emptyMedalText}>?</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Selector de período */}
          <View style={styles.periodSelector}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.key && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period.key)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key && styles.periodButtonTextActive
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Animated.View style={animatedStyle}>
            {/* Estadísticas principales */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Ionicons name="time" size={24} color={Colors.primary} />
                <Text style={styles.statNumber}>{currentData.totalMinutes}</Text>
                <Text style={styles.statLabel}>minutos</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.secondary} />
                <Text style={styles.statNumber}>{currentData.totalSessions}</Text>
                <Text style={styles.statLabel}>sesiones</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="flame" size={24} color={Colors.accent} />
                <Text style={styles.statNumber}>{currentData.streak}</Text>
                <Text style={styles.statLabel}>días seguidos</Text>
              </View>
            </View>

            {/* Estado de la planta */}
            <View style={styles.plantCard}>
              <View style={styles.plantHeader}>
                <Text style={styles.plantStageIcon}>{plantStage.icon}</Text>
                <View style={styles.plantInfo}>
                  <Text style={styles.plantStage}>{plantStage.stage}</Text>
                  <Text style={styles.plantMessage}>{getStreakMessage(currentData.streak)}</Text>
                </View>
              </View>
              
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min((currentData.totalSessions % 25) * 4, 100)}%` }
                  ]} 
                />
              </View>
              
              <Text style={styles.progressText}>
                {25 - (currentData.totalSessions % 25)} sesiones para el siguiente nivel
              </Text>
            </View>

            {/* Racha actual */}
            <View style={styles.streakCard}>
              <View style={styles.streakHeader}>
                <Ionicons name="calendar" size={20} color={Colors.text.primary} />
                <Text style={styles.streakTitle}>Racha actual</Text>
              </View>
              
              <Text style={styles.streakDays}>{currentData.streak} días consecutivos</Text>
              <Text style={styles.streakMessage}>{getStreakMessage(currentData.streak)}</Text>
              
              <View style={styles.streakVisual}>
                {[...Array(7)].map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.streakDot,
                      index < currentData.streak && styles.streakDotActive
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Historial de sesiones */}
            <View style={styles.historyCard}>
              <Text style={styles.historyTitle}>Sesiones recientes</Text>
              
              {currentData.sessions && currentData.sessions.map((session, index) => (
                <View key={index} style={styles.sessionItem}>
                  <View style={styles.sessionDate}>
                    <Text style={styles.sessionDateText}>{formatDate(session.date)}</Text>
                  </View>
                  
                  <View style={styles.sessionInfo}>
                    <View style={styles.sessionDuration}>
                      <Ionicons 
                        name={session.completed ? "checkmark-circle" : "close-circle"} 
                        size={16} 
                        color={session.completed ? Colors.plant.healthy : Colors.plant.withering} 
                      />
                      <Text style={styles.sessionDurationText}>{session.duration} min</Text>
                    </View>
                    
                    {session.mood && (
                      <View style={styles.sessionMood}>
                        <Text style={styles.sessionMoodEmoji}>{moodEmojis[session.mood]}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>

            {/* Mensaje inspirador */}
            <View style={styles.inspirationCard}>
              <Ionicons name="heart" size={20} color={Colors.accent} />
              <Text style={styles.inspirationText}>
                "Cada momento que dedicas a Dios es una semilla plantada en tu corazón"
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
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
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    opacity: 0.8,
  },
  gardenSection: {
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gardenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  sliderContainer: {
    maxHeight: 120,
  },
  plantsSlider: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  plantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  plantMedal: {
    width: 80,
    alignItems: 'center',
    marginBottom: 15,
    marginRight: 20,
  },
  medalImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.plant.healthy,
    marginBottom: 6,
  },
  medalName: {
    fontSize: 10,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 12,
  },
  emptyMedal: {
    opacity: 0.3,
  },
  emptyIcon: {
    marginBottom: 6,
  },
  emptyMedalText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: 'bold',
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  periodButtonTextActive: {
    color: Colors.text.light,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  plantCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  plantStageIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  plantInfo: {
    flex: 1,
  },
  plantStage: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  plantMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.secondary,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.plant.healthy,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  streakCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  streakDays: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: 4,
  },
  streakMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  streakVisual: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  streakDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.secondary,
  },
  streakDotActive: {
    backgroundColor: Colors.accent,
  },
  historyCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  sessionDate: {
    width: 80,
  },
  sessionDateText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  sessionInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionDurationText: {
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 6,
  },
  sessionMood: {
    alignItems: 'center',
  },
  sessionMoodEmoji: {
    fontSize: 20,
  },
  inspirationCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inspirationText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 20,
  },
});

export default HistoryScreen;