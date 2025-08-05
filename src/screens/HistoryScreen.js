import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
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
import { PLANTS, SEED_PLANT } from '../constants/Constants';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedal, setSelectedMedal] = useState(null);
  
  // Animaciones
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(30);

  // Obtener datos dinámicos del historial
  const currentData = getStats(selectedPeriod);
  
  // Mostrar solo plantas reales obtenidas por el usuario
  const displayPlants = obtainedPlants;

  const handleMedalPress = (plantData) => {
    // Buscar primero en PLANTS, luego en SEED_PLANT
    let plant = PLANTS.find(p => p.id === plantData.id);
    if (!plant && plantData.id === 'semilla') {
      plant = SEED_PLANT;
    }
    
    if (plant) {
      setSelectedMedal({
        ...plant,
        completedDate: plantData.completedDateFormatted
      });
      setModalVisible(true);
    }
  };

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
            {displayPlants.length > 0 ? (
               <ScrollView 
                 horizontal 
                 showsHorizontalScrollIndicator={false}
                 contentContainerStyle={styles.plantsSlider}
                 style={styles.sliderContainer}
               >
                 {displayPlants.map((plantData, index) => {
                   const plantId = typeof plantData === 'string' ? plantData : plantData.id;
                   // Buscar primero en PLANTS, luego en SEED_PLANT
                   let plant = PLANTS.find(p => p.id === plantId);
                   if (!plant && plantId === 'semilla') {
                     plant = SEED_PLANT;
                   }
                   return (
                     <TouchableOpacity 
                       key={index} 
                       style={styles.plantMedal}
                       onPress={() => handleMedalPress(typeof plantData === 'string' ? { id: plantData } : plantData)}
                     >
                       <Image 
                         source={plant?.image} 
                         style={styles.medalImage}
                         resizeMode="cover"
                       />
                       <Text style={styles.medalName}>{plant?.name}</Text>
                     </TouchableOpacity>
                   );
                 })}
                 {Array.from({ length: Math.max(0, 10 - displayPlants.length) }).map((_, index) => (
                   <View key={`empty-${index}`} style={[styles.plantMedal, styles.emptyMedal]}>
                     <View style={[styles.medalImage, { backgroundColor: 'rgba(200, 200, 200, 0.3)', justifyContent: 'center', alignItems: 'center' }]}>
                       <Ionicons name="leaf-outline" size={24} color={Colors.text.secondary} />
                     </View>
                     <Text style={styles.medalName}>?</Text>
                   </View>
                 ))}
               </ScrollView>
             ) : (
               <View style={styles.emptyGardenContainer}>
                 <Ionicons name="leaf-outline" size={48} color="#7B8794" />
                 <Text style={styles.emptyGardenText}>Aún no has obtenido ninguna planta</Text>
                 <Text style={styles.emptyGardenSubtext}>Completa sesiones de meditación para obtener tus primeras medallas</Text>
               </View>
             )}
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
                <Ionicons name="time" size={24} color="#3F51B5" />
                <Text style={styles.statNumber}>{currentData.totalMinutes}</Text>
                <Text style={styles.statLabel}>minutos</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <Text style={styles.statNumber}>{currentData.totalSessions}</Text>
                <Text style={styles.statLabel}>sesiones</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="flame" size={24} color="#FF5722" />
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
                <Ionicons name="calendar" size={20} color="#34495E" />
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

        {/* Modal para mostrar detalles de la medalla */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={Colors.text.secondary} />
              </TouchableOpacity>
              
              {selectedMedal && (
                <>
                  <Image 
                    source={selectedMedal.image} 
                    style={styles.modalMedalImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.modalMedalName}>{selectedMedal.name}</Text>
                   <Text style={styles.modalMedalDescription}>{selectedMedal.description}</Text>
                   <Text style={styles.modalMedalMeaning}>{selectedMedal.meaning}</Text>
                   {selectedMedal.completedDate && (
                     <Text style={styles.modalCompletedDate}>
                       🎉 Obtenida el {selectedMedal.completedDate}
                     </Text>
                   )}
                </>
              )}
            </View>
          </View>
        </Modal>
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
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
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
    width: 100,
    alignItems: 'center',
    marginBottom: 15,
    marginRight: 20,
    padding: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medalImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: Colors.plant.healthy,
    marginBottom: 8,
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  medalName: {
    fontSize: 10,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 12,
  },
  emptyMedal: {
    opacity: 0.5,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 40,
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  modalMedalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.plant.healthy,
    marginBottom: 20,
  },
  modalMedalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMedalDescription: {
     fontSize: 16,
     color: Colors.text.secondary,
     textAlign: 'center',
     lineHeight: 22,
     marginBottom: 15,
     fontWeight: '500',
   },
   modalMedalMeaning: {
     fontSize: 15,
     color: Colors.text.primary,
     textAlign: 'center',
     lineHeight: 20,
     marginBottom: 20,
     fontStyle: 'italic',
     paddingHorizontal: 10,
   },
   modalCompletedDate: {
     fontSize: 16,
     color: Colors.plant.healthy,
     fontWeight: '700',
     textAlign: 'center',
     backgroundColor: 'rgba(76, 175, 80, 0.1)',
     paddingVertical: 8,
     paddingHorizontal: 15,
     borderRadius: 20,
     borderWidth: 1,
     borderColor: Colors.plant.healthy,
   },
   emptyGardenContainer: {
     alignItems: 'center',
     justifyContent: 'center',
     paddingVertical: 40,
     paddingHorizontal: 20,
   },
   emptyGardenText: {
     fontSize: 18,
     fontWeight: '600',
     color: Colors.text.primary,
     textAlign: 'center',
     marginTop: 15,
     marginBottom: 8,
   },
   emptyGardenSubtext: {
     fontSize: 14,
     color: Colors.text.secondary,
     textAlign: 'center',
     lineHeight: 20,
   },
});

export default HistoryScreen;