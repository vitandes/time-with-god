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
  Easing,
} from 'react-native-reanimated';

import { useAuth } from '../context/AuthContext';
import { APP_CONFIG } from '../constants/Constants';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const SessionCompleteScreen = ({ navigation, route }) => {
  const { duration } = route.params;
  const { user } = useAuth();
  
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [isNoteInputFocused, setIsNoteInputFocused] = useState(false);
  
  // Animaciones
  const checkmarkScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const plantGrowth = useSharedValue(0);
  const noteInputPosition = useSharedValue(0);
  const backgroundOpacity = useSharedValue(1);

  const moods = [
    { emoji: '🙏', label: 'Agradecido', value: 'grateful' },
    { emoji: '😌', label: 'En paz', value: 'peaceful' },
    { emoji: '💝', label: 'Amado', value: 'loved' },
    { emoji: '✨', label: 'Inspirado', value: 'inspired' },
    { emoji: '🤗', label: 'Consolado', value: 'comforted' },
    { emoji: '💪', label: 'Fortalecido', value: 'strengthened' },
  ];

  const completionMessages = [
    "¡Hermoso momento con Dios completado!",
    "Tu corazón ha sido renovado",
    "Has cultivado tu jardín espiritual",
    "Dios se alegra de este tiempo contigo",
    "Tu fe ha crecido un poco más"
  ];

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
  };

  const handleMoodSelection = (mood) => {
    setSelectedMood(mood);
  };

  const handleSaveSession = async () => {
    try {
      // En una app real, aquí guardarías la información de la sesión
      const sessionData = {
        duration: duration.minutes,
        mood: selectedMood,
        note: note.trim(),
        completedAt: new Date().toISOString(),
      };
      
      console.log('Session saved:', sessionData);
      
      // Mostrar mensaje de confirmación
      Alert.alert(
          'Sesión guardada',
          'Tu momento con Dios ha sido registrado. ¡Que tengas un día bendecido!',
          [
            {
              text: 'Continuar',
              onPress: () => navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
              })
            }
          ]
        );
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert('Error', 'No se pudo guardar la sesión. Inténtalo de nuevo.');
    }
  };

  const handleSkip = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleNoteInputFocus = () => {
    setIsNoteInputFocused(true);
    noteInputPosition.value = withTiming(-300, { duration: 400 });
    backgroundOpacity.value = withTiming(0, { duration: 400 });
  };

  const handleNoteInputBlur = () => {
    setIsNoteInputFocused(false);
    noteInputPosition.value = withTiming(0, { duration: 400 });
    backgroundOpacity.value = withTiming(1, { duration: 400 });
  };

  const getRandomMessage = () => {
    return completionMessages[Math.floor(Math.random() * completionMessages.length)];
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

  const animatedPlantStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: plantGrowth.value },
        { translateY: (1 - plantGrowth.value) * 10 },
      ],
    };
  });

  const animatedNoteStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: noteInputPosition.value }],
  }));

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  return (
    <LinearGradient
      colors={Colors.gradients.primary}
      style={styles.container}
    >
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
            <Animated.View style={[styles.checkmarkContainer, animatedCheckmarkStyle]}>
              <Ionicons name="checkmark-circle" size={80} color={Colors.text.light} />
            </Animated.View>
            
            <Animated.View style={[styles.messageContainer, animatedContentStyle]}>
              <Text style={styles.completionTitle}>Dios se alegra de este tiempo contigo</Text>
              <Text style={styles.completionSubtitle}>
                Has dedicado {duration.minutes} minutos a tu conexión con Dios
              </Text>
            </Animated.View>
          </Animated.View>

           {/* Contenido principal */}
           <Animated.View style={[styles.content, animatedContentStyle]}>
          {/* Selección de estado de ánimo */}
           <Animated.View style={[styles.moodSection, animatedBackgroundStyle]}>
            <Text style={styles.sectionTitle}>¿Cómo te sientes?</Text>
            <View style={styles.moodGrid}>
              {moods.map((mood, index) => (
                <TouchableOpacity
                  key={mood.value}
                  style={[
                    styles.moodButton,
                    selectedMood?.value === mood.value && styles.moodButtonSelected
                  ]}
                  onPress={() => handleMoodSelection(mood)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

           {/* Nota personal */}
          <Animated.View style={[styles.noteSection, animatedNoteStyle]}>
            <Text style={styles.sectionTitle}>Nota personal (opcional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Escribe cómo te sentiste durante este momento..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
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
          </Animated.View>
        </Animated.View>

          {/* Botones de acción */}
          <Animated.View style={[styles.actions, animatedContentStyle, animatedBackgroundStyle]}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSaveSession}
            >
              <Text style={styles.primaryButtonText}>Guardar mi momento</Text>
              <Ionicons name="heart" size={20} color={Colors.text.light} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSkip}
            >
              <Text style={styles.secondaryButtonText}>Continuar sin guardar</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Estadísticas rápidas */}
          <Animated.View style={[styles.stats, animatedContentStyle, animatedBackgroundStyle]}>
            <Text style={styles.statsText}>
              Total esta semana: {user?.weeklyMinutes || 0} minutos • {user?.weeklySessions || 0} sesiones
            </Text>
          </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 30,
  },
  checkmarkContainer: {
    marginBottom: 20,
  },
  messageContainer: {
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.light,
    textAlign: 'center',
    marginBottom: 8,
  },
  completionSubtitle: {
    fontSize: 16,
    color: Colors.text.light,
    opacity: 0.9,
    textAlign: 'center',
  },
  plantContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  plantGrowth: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  plantMessage: {
    fontSize: 14,
    color: Colors.text.light,
    marginTop: 8,
    fontWeight: '500',
  },
  content: {
    
    paddingHorizontal: 30,
  },
  moodSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.light,
    marginBottom: 16,
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodButton: {
    width: (width - 80) / 3,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: Colors.text.light,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    color: Colors.text.light,
    textAlign: 'center',
    fontWeight: '500',
  },
  noteSection: {
    
    marginBottom: 0,
  },

  noteInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    color: Colors.text.light,
    fontSize: 16,
    height: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actions: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    
  },
  primaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.light,
    marginRight: 8,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: Colors.text.light,
    opacity: 0.7,
  },
  stats: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  statsText: {
    fontSize: 12,
    color: Colors.text.light,
    opacity: 0.6,
  },
});

export default SessionCompleteScreen;