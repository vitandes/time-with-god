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
  Platform,
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
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

import { useAuth } from '../context/AuthContext';
import { usePlantProgress } from '../hooks/usePlantProgress';
import { useSessionHistory } from '../hooks/useSessionHistory';
import { useConstants } from '../hooks/useConstants';
import Colors from '../constants/Colors';
import { useTranslation } from 'react-i18next';

// Mapeo de imágenes
const PLANT_IMAGES = {
  'cactus': require('../../assets/plants/cactuus.png'),
  'cedro': require('../../assets/plants/cedro.png'),
  'flor-azul': require('../../assets/plants/flor-azul.png'),
  'flor-celestial': require('../../assets/plants/flor-celestial.png'),
  'lirio': require('../../assets/plants/lirio.png'),
  'rosa': require('../../assets/plants/rosa.png'),
  'acacia': require('../../assets/plants/acacia.png'),
  'aloe': require('../../assets/plants/aloe.png'),
  'canela': require('../../assets/plants/canela.png'),
  'espino-blanco': require('../../assets/plants/espino-blanco.png'),
  'girasol': require('../../assets/plants/girasol.png'),
  'higuera': require('../../assets/plants/higuera.png'),
  'jacinto': require('../../assets/plants/Jacinto.png'),
  'laurel': require('../../assets/plants/laurel.png'),
  'lirio2': require('../../assets/plants/lirio2.png'),
  'lirio-real': require('../../assets/plants/lirio2.png'),
  'mirra': require('../../assets/plants/mirra.png'),
  'mostaza': require('../../assets/plants/moztaza.png'),
  'mostaza-planta': require('../../assets/plants/moztaza.png'),
  'palma': require('../../assets/plants/palma.png'),
  'trigo': require('../../assets/plants/trigo.png'),
  'vid': require('../../assets/plants/vid.png'),
};

const { width } = Dimensions.get('window');

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
  const particle1Y = useSharedValue(0);
  const particle2Y = useSharedValue(0);

  // Obtener datos dinámicos del historial
  const currentData = React.useMemo(() => getStats(selectedPeriod), [getStats, selectedPeriod]);

  // Mostrar solo plantas reales obtenidas por el usuario
  const displayPlants = obtainedPlants || [];

  const handleMedalPress = (plantData) => {
    // Buscar primero por image en plants, luego en seedPlant
    let plant = plants?.find(p => p.image === plantData.id || p.id === plantData.id);
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

  const particle1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle1Y.value }],
  }));

  const particle2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle2Y.value }],
  }));

  const plantStage = getPlantStage(currentData.totalSessions);

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
      <Animated.View style={[styles.particle, { top: '15%', left: '10%', width: 4, height: 4 }, particle1Style]} />
      <Animated.View style={[styles.particle, { top: '25%', right: '15%', width: 6, height: 6, opacity: 0.4 }, particle2Style]} />
      <Animated.View style={[styles.particle, { bottom: '30%', left: '20%', width: 3, height: 3, opacity: 0.3 }, particle1Style]} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('history.title')}</Text>
            <Text style={styles.subtitle}>{t('history.subtitle')}</Text>
          </View>

          {/* Medallas de plantas obtenidas - Slider */}
          <View style={styles.glassCard}>
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
                      <LinearGradient
                        colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']}
                        style={styles.medalGradient}
                      >
                        <Image
                          source={PLANT_IMAGES[plant?.image] || PLANT_IMAGES['seed']}
                          style={styles.medalImage}
                          resizeMode="cover"
                        />
                        <Text style={styles.medalName}>{plant?.name}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
                {displayPlants && Array.from({ length: Math.max(0, 10 - displayPlants.length) }).map((_, index) => (
                  <View key={`empty-${index}`} style={[styles.plantMedal, styles.emptyMedal]}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']}
                      style={styles.medalGradient}
                    >
                      <View style={styles.emptyIconContainer}>
                        <Ionicons name="leaf-outline" size={24} color="rgba(255,255,255,0.3)" />
                      </View>
                      <Text style={styles.medalName}>?</Text>
                    </LinearGradient>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyGardenContainer}>
                <Ionicons name="leaf-outline" size={48} color="rgba(255,255,255,0.3)" />
                <Text style={styles.emptyGardenText}>{t('history.emptyGarden.title')}</Text>
                <Text style={styles.emptyGardenSubtext}>{t('history.emptyGarden.subtitle')}</Text>
              </View>
            )}
          </View>

          {/* Selector de período */}
          <View style={styles.periodSelectorContainer}>
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
          </View>

          <Animated.View style={animatedStyle}>
            {/* Estadísticas principales */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                  style={styles.statGradient}
                >
                  <Ionicons name="time" size={24} color="#B0E0E6" />
                  <Text style={styles.statNumber}>{currentData.totalMinutes}</Text>
                  <Text style={styles.statLabel}>{t('history.stats.minutes')}</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                  style={styles.statGradient}
                >
                  <Ionicons name="checkmark-circle" size={24} color="#98FB98" />
                  <Text style={styles.statNumber}>{currentData.totalSessions}</Text>
                  <Text style={styles.statLabel}>{t('history.stats.sessions')}</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                  style={styles.statGradient}
                >
                  <Ionicons name="flame" size={24} color="#FFB6C1" />
                  <Text style={styles.statNumber}>{currentData.streak}</Text>
                  <Text style={styles.statLabel}>{t('history.stats.consecutiveDays')}</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Estado de la planta */}
            <View style={styles.glassCard}>
              <View style={styles.plantHeader}>
                <Text style={styles.plantStageIcon}>{plantStage.icon}</Text>
                <View style={styles.plantInfo}>
                  <Text style={styles.plantStage}>{plantStage.stage}</Text>
                  <Text style={styles.plantMessage}>{getStreakMessage(currentData.streak)}</Text>
                </View>
              </View>

              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#8A2BE2', '#9370DB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
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
            <View style={styles.glassCard}>
              <View style={styles.streakHeader}>
                <Ionicons name="calendar" size={20} color="#E6E6FA" />
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
            <View style={styles.glassCard}>
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
                        color={session.completed ? "#98FB98" : "#FFB6C1"}
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
            <View style={[styles.glassCard, { marginBottom: 100 }]}>
              <Ionicons name="heart" size={20} color="#FFB6C1" />
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
              <LinearGradient
                colors={['#2E1A47', '#4B0082']}
                style={styles.modalGradient}
              >
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Ionicons name="close" size={24} color="#FFFFFF" />
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
              </LinearGradient>
            </View>
          </View>
        </Modal>
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
    zIndex: 10,
  },
  scrollView: {
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
    paddingBottom: 30,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-light',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
  },
  glassCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    zIndex: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  gardenTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sliderContainer: {
    maxHeight: 130,
  },
  plantsSlider: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  plantMedal: {
    width: 100,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  medalGradient: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  medalImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 8,
  },
  medalName: {
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 12,
  },
  emptyMedal: {
    opacity: 0.7,
  },
  emptyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyGardenContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyGardenText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  emptyGardenSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  periodSelectorContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    zIndex: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  periodButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  statGradient: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 10,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
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
    color: '#FFFFFF',
  },
  plantMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  streakDays: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  streakMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
    textAlign: 'center',
  },
  streakVisual: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  streakDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  streakDotActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sessionDate: {
    width: 80,
  },
  sessionDateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
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
    color: '#FFFFFF',
    marginLeft: 6,
  },
  sessionMood: {
    alignItems: 'center',
  },
  sessionMoodEmoji: {
    fontSize: 20,
  },
  inspirationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalGradient: {
    padding: 30,
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    padding: 5,
  },
  modalMedalImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 20,
  },
  modalMedalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMedalDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  modalMedalMeaning: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  modalCompletedDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 10,
  },
});

export default HistoryScreen;