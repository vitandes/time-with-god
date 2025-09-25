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
import { useConstants } from '../hooks/useConstants';
import Colors from '../constants/Colors';
import { useTranslation } from 'react-i18next';

// Mapeo de imágenes
const PLANT_IMAGES = {
  'cactus': require('../../assets/plants/cactuus.webp'),
  'cedro': require('../../assets/plants/cedro.webp'),
  'flor-azul': require('../../assets/plants/flor-azul.webp'),
  'flor-celestial': require('../../assets/plants/flor-celestial.webp'),
  'lirio': require('../../assets/plants/lirio.webp'),
  'rosa': require('../../assets/plants/rosa.webp'),
  'acacia': require('../../assets/plants/acacia.webp'),
  'aloe': require('../../assets/plants/aloe.webp'),
  'canela': require('../../assets/plants/canela.webp'),
  'espino-blanco': require('../../assets/plants/espino-blanco.webp'),
  'girasol': require('../../assets/plants/girasol.webp'),
  'higuera': require('../../assets/plants/higuera.webp'),
  'jacinto': require('../../assets/plants/Jacinto.webp'),
  'laurel': require('../../assets/plants/laurel.webp'),
  'lirio2': require('../../assets/plants/lirio2.webp'),
  'lirio-real': require('../../assets/plants/lirio2.webp'),
  'mirra': require('../../assets/plants/mirra.webp'),
  'mostaza': require('../../assets/plants/moztaza.webp'),
  'mostaza-planta': require('../../assets/plants/moztaza.webp'),
  'palma': require('../../assets/plants/palma.webp'),
  'trigo': require('../../assets/plants/trigo.webp'),
  'vid': require('../../assets/plants/vid.webp'),
};

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
  const { t } = useTranslation('app');
  const { user } = useAuth();
  const { plants, seedPlant } = useConstants();
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
    // Buscar primero por image en plants, luego en seedPlant
    let plant = plants.find(p => p.image === plantData.id || p.id === plantData.id);
    if (!plant && plantData.id === 'semilla') {
      plant = seedPlant;
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
    { key: 'week', label: t('history.periods.thisWeek') },
    { key: 'month', label: t('history.periods.thisMonth') },
    { key: 'year', label: t('history.periods.thisYear') },
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
      return t('history.dates.today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('history.dates.yesterday');
    } else {
      return date.toLocaleDateString('es-ES', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getStreakMessage = (streak) => {
    if (streak >= 30) return t('history.streakMessages.incredible');
    if (streak >= 14) return t('history.streakMessages.excellent');
    if (streak >= 7) return t('history.streakMessages.great');
    if (streak >= 3) return t('history.streakMessages.good');
    return t('history.streakMessages.keepGoing');
  };

  const getPlantStage = (totalSessions) => {
    if (totalSessions >= 100) return { icon: '🌳', stage: t('history.plantStages.sacredTree') };
    if (totalSessions >= 50) return { icon: '🌸', stage: t('history.plantStages.bloomingPlant') };
    if (totalSessions >= 25) return { icon: '🌿', stage: t('history.plantStages.leafyPlant') };
    if (totalSessions >= 10) return { icon: '🌱', stage: t('history.plantStages.youngPlant') };
    if (totalSessions >= 5) return { icon: '🌾', stage: t('history.plantStages.sprout') };
    return { icon: '🌰', stage: t('history.plantStages.seed') };
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
            <Text style={styles.title}>{t('history.title')}</Text>
            <Text style={styles.subtitle}>{t('history.subtitle')}</Text>
          </View>

          {/* Medallas de plantas obtenidas - Slider */}
          <View style={styles.gardenSection}>
            <Text style={styles.gardenTitle}>{t('history.plantsObtained')}</Text>
            {displayPlants.length > 0 ? (
               <ScrollView 
                 horizontal 
                 showsHorizontalScrollIndicator={false}
                 contentContainerStyle={styles.plantsSlider}
                 style={styles.sliderContainer}
               >
                 {displayPlants && displayPlants.map((plantData, index) => {
                   const plantId = typeof plantData === 'string' ? plantData : plantData.id;
                   // Buscar primero por image en plants (es un array), luego en seedPlant
                   let plant = plants.find(p => p.image === plantId || p.id === plantId);
                   if (!plant && plantId === 'semilla') {
                     plant = seedPlant;
                   }
                   return (
                     <TouchableOpacity 
                       key={index} 
                       style={styles.plantMedal}
                       onPress={() => handleMedalPress(typeof plantData === 'string' ? { id: plantData } : plantData)}
                     >
                       <Image 
                         source={PLANT_IMAGES[plant?.image]} 
                         style={styles.medalImage}
                         resizeMode="cover"
                       />
                       <Text style={styles.medalName}>{plant?.name}</Text>
                     </TouchableOpacity>
                   );
                 })}
                 {displayPlants && Array.from({ length: Math.max(0, 10 - displayPlants.length) }).map((_, index) => (
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
                 <Text style={styles.emptyGardenText}>{t('history.emptyGarden.title')}</Text>
                 <Text style={styles.emptyGardenSubtext}>{t('history.emptyGarden.subtitle')}</Text>
               </View>
             )}
          </View>

          {/* Selector de período */}
          <View style={styles.periodSelector}>
            {periods && periods.map((period) => (
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
                <Text style={styles.statLabel}>{t('history.stats.minutes')}</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                <Text style={styles.statNumber}>{currentData.totalSessions}</Text>
                <Text style={styles.statLabel}>{t('history.stats.sessions')}</Text>
              </View>
              
              <View style={styles.statCard}>
                <Ionicons name="flame" size={24} color="#FF5722" />
                <Text style={styles.statNumber}>{currentData.streak}</Text>
                <Text style={styles.statLabel}>{t('history.stats.consecutiveDays')}</Text>
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
                {t('history.progressText', { sessions: 25 - (currentData.totalSessions % 25) })}
              </Text>
            </View>

            {/* Racha actual */}
            <View style={styles.streakCard}>
              <View style={styles.streakHeader}>
                <Ionicons name="calendar" size={20} color="#34495E" />
                <Text style={styles.streakTitle}>{t('history.currentStreak')}</Text>
              </View>
              
              <Text style={styles.streakDays}>{t('history.consecutiveDays', { days: currentData.streak })}</Text>
              <Text style={styles.streakMessage}>{getStreakMessage(currentData.streak)}</Text>
              
              <View style={styles.streakVisual}>
                {Array(7).fill().map((_, index) => (
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
              <Text style={styles.historyTitle}>{t('history.recentSessions')}</Text>
              
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
                {t('history.inspirationalMessage')}
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
                    source={PLANT_IMAGES[selectedMedal.image]} 
                    style={styles.modalMedalImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.modalMedalName}>{selectedMedal.name}</Text>
                   <Text style={styles.modalMedalDescription}>{selectedMedal.description}</Text>
                   <Text style={styles.modalMedalMeaning}>{selectedMedal.meaning}</Text>
                   {selectedMedal.completedDate && (
                     <Text style={styles.modalCompletedDate}>
                       {t('history.obtainedOn', { date: selectedMedal.completedDate })}
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
    textAlign: 'center',
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