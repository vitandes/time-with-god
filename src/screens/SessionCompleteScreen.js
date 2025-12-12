import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { useAuth } from '../context/AuthContext';
import { useConstants } from '../hooks/useConstants';
import Colors from '../constants/Colors';
import { usePlantProgress } from '../hooks/usePlantProgress';
import { useSessionHistory } from '../hooks/useSessionHistory';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const SessionCompleteScreen = ({ navigation, route }) => {
  const { duration } = route.params;
  const { user } = useAuth();
  const { addSessionMinutes } = usePlantProgress();
  const { addSession, getStats } = useSessionHistory();
  const { t } = useTranslation('app');

  // Obtener estadísticas dinámicas de la semana
  const weeklyStats = getStats('week');

  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [isNoteInputFocused, setIsNoteInputFocused] = useState(false);

  // Animaciones
  const checkmarkScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const plantGrowth = useSharedValue(0);
  const noteInputPosition = useSharedValue(0);
  const backgroundOpacity = useSharedValue(1);
  const particle1Y = useSharedValue(0);
  const particle2Y = useSharedValue(0);

  const moods = [
    { emoji: '🙏', label: t('sessionComplete.moods.grateful'), value: 'grateful' },
    { emoji: '😌', label: t('sessionComplete.moods.peaceful'), value: 'peaceful' },
    { emoji: '💝', label: t('sessionComplete.moods.loved'), value: 'loved' },
    { emoji: '✨', label: t('sessionComplete.moods.inspired'), value: 'inspired' },
    { emoji: '🤗', label: t('sessionComplete.moods.comforted'), value: 'comforted' },
    { emoji: '💪', label: t('sessionComplete.moods.strengthened'), value: 'strengthened' },
  ];

  const completionMessages = t('sessionComplete.completionMessages', { returnObjects: true });

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Animación del checkmark
    checkmarkScale.value = withSequence(
      withTiming(1.2, { duration: 600, easing: Easing.out(Easing.back(1.7)) }),
      withTiming(1, { duration: 200 })
    );

    // Animación del contenido
    setTimeout(() => {
      contentOpacity.value = withTiming(1, { duration: 800 });
    }, 300);

    // Animación del crecimiento de la planta
    setTimeout(() => {
      plantGrowth.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    }, 800);

    // Animaciones de partículas
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

  const handleMoodSelection = (mood) => {
    setSelectedMood(mood);
  };

  const handleSaveSession = async () => {
    // ... existing logic ...
    try {
      // Agregar los minutos de la sesión al progreso de la planta
      await addSessionMinutes(duration.minutes);

      // Guardar la sesión en el historial
      const sessionData = {
        duration: duration.minutes,
        mood: selectedMood,
        note: note.trim(),
      };

      await addSession(sessionData);
      console.log('Session saved:', sessionData);

      // Mostrar mensaje de confirmación
      Alert.alert(
        t('sessionComplete.alerts.sessionSaved'),
        t('sessionComplete.alerts.sessionSavedMessage', { minutes: duration.minutes }),
        [
          {
            text: t('sessionComplete.alerts.continue'),
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            })
          }
        ]
      );
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert(t('sessionComplete.alerts.error'), t('sessionComplete.alerts.errorMessage'));
    }
  };

  const handleSkip = async () => {
    try {
      // Incluso si se salta, agregar los minutos al progreso
      await addSessionMinutes(duration.minutes);

      // Guardar sesión básica sin mood ni nota
      await addSession({
        duration: duration.minutes,
        mood: null,
        note: '',
      });
    } catch (error) {
      console.error('Error adding session minutes:', error);
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleNoteInputFocus = () => {
    setIsNoteInputFocused(true);
    noteInputPosition.value = withTiming(-100, { duration: 400 }); // Adjusted offset
    backgroundOpacity.value = withTiming(0.3, { duration: 400 }); // Fade but keep visible
  };

  const handleNoteInputBlur = () => {
    setIsNoteInputFocused(false);
    noteInputPosition.value = withTiming(0, { duration: 400 });
    backgroundOpacity.value = withTiming(1, { duration: 400 });
  };

  const animatedCheckmarkStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkmarkScale.value }],
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      transform: [
        {
          translateY: contentOpacity.value === 0 ? 20 : 0,
        },
      ],
    };
  });

  const animatedNoteStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: noteInputPosition.value }],
  }));

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const particle1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle1Y.value }],
  }));

  const particle2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: particle2Y.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.spiritual}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      {/* Ambient Lights */}
      <View style={[styles.ambientLight, styles.ambientLightTop]} />
      <View style={[styles.ambientLight, styles.ambientLightBottom]} />

      {/* Particles */}
      <Animated.View style={[styles.particle, { top: '15%', left: '10%', width: 4, height: 4 }, particle1Style]} />
      <Animated.View style={[styles.particle, { top: '25%', right: '15%', width: 6, height: 6, opacity: 0.4 }, particle2Style]} />
      <Animated.View style={[styles.particle, { bottom: '30%', left: '20%', width: 3, height: 3, opacity: 0.3 }, particle1Style]} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Animación de completado */}
            <Animated.View style={[styles.header, animatedBackgroundStyle]}>
              <View style={styles.glassCircle}>
                <Animated.View style={[styles.checkmarkContainer, animatedCheckmarkStyle]}>
                  <Ionicons name="checkmark" size={60} color="#FFFFFF" />
                </Animated.View>
              </View>

              <Animated.View style={[styles.messageContainer, animatedContentStyle]}>
                <Text style={styles.completionTitle}>{t('sessionComplete.title')}</Text>
                <Text style={styles.completionSubtitle}>
                  {t('sessionComplete.subtitle', { minutes: duration.minutes })}
                </Text>
              </Animated.View>
            </Animated.View>

            {/* Contenido principal */}
            <Animated.View style={[styles.content, animatedContentStyle]}>
              {/* Selección de estado de ánimo */}
              <Animated.View style={[styles.sectionContainer, animatedBackgroundStyle]}>
                <Text style={styles.sectionTitle}>{t('sessionComplete.moodQuestion')}</Text>
                <View style={styles.moodGrid}>
                  {moods && moods.map((mood, index) => (
                    <TouchableOpacity
                      key={mood.value}
                      style={[
                        styles.moodButton,
                        selectedMood?.value === mood.value && styles.moodButtonSelected
                      ]}
                      onPress={() => handleMoodSelection(mood)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text style={[
                        styles.moodLabel,
                        selectedMood?.value === mood.value && styles.moodLabelSelected
                      ]}>{mood.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>

              {/* Nota personal */}
              <Animated.View style={[styles.sectionContainer, animatedNoteStyle]}>
                <Text style={styles.sectionTitle}>{t('sessionComplete.noteTitle')}</Text>
                <View style={styles.glassCard}>
                  <TextInput
                    style={styles.noteInput}
                    placeholder={t('sessionComplete.notePlaceholder')}
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={note}
                    onChangeText={setNote}
                    multiline
                    maxLength={200}
                    textAlignVertical="top"
                    returnKeyType="done"
                    blurOnSubmit={true}
                    onFocus={handleNoteInputFocus}
                    onBlur={handleNoteInputBlur}
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                  />
                </View>
              </Animated.View>
            </Animated.View>

            {/* Botones de acción */}
            <Animated.View style={[styles.actions, animatedContentStyle, animatedBackgroundStyle]}>
              {selectedMood || note ? (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleSaveSession}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.primaryButtonText}>{t('sessionComplete.saveButton')}</Text>
                    <Ionicons name="save-outline" size={20} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleSkip}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.primaryButtonText}>{t('sessionComplete.continueButton')}</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              )}

            </Animated.View>

            {/* Estadísticas rápidas - Footer subtle */}
            <Animated.View style={[styles.stats, animatedContentStyle, animatedBackgroundStyle]}>
              <Text style={styles.statsText}>
                {t('sessionComplete.weeklyStats', {
                  minutes: weeklyStats.totalMinutes,
                  sessions: weeklyStats.totalSessions
                })}
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
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
    backgroundColor: '#8A2BE2',
    transform: [{ scale: 1.2 }],
  },
  ambientLightBottom: {
    bottom: -width * 0.8,
    right: -width * 0.2,
    backgroundColor: '#4B0082',
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 50,
    opacity: 0.5,
  },
  header: {
    alignItems: 'center',
    paddingTop: 30,
    marginBottom: 20,
  },
  glassCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 0,
      }
    })
  },
  checkmarkContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  completionSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  moodButton: {
    width: (width - 60) / 3,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 15,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  moodButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.05 }],
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    fontWeight: '500',
  },
  moodLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  noteInput: {
    padding: 20,
    color: '#FFFFFF',
    fontSize: 16,
    height: 120,
    textAlignVertical: 'top',
  },
  actions: {
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 20,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 0,
      }
    })
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 10,
  },
  stats: {
    alignItems: 'center',
    paddingBottom: 20,
    opacity: 0.8,
  },
  statsText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
  },
});

export default SessionCompleteScreen;