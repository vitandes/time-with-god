import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  AppState,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

import { useAuth } from '../context/AuthContext';
import { BIBLE_VERSES, INSPIRATIONAL_QUOTES, APP_CONFIG } from '../constants/Constants';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const SessionScreen = ({ navigation, route }) => {
  const { duration } = route.params;
  const { completeSession } = useAuth();
  
  //const [timeLeft, setTimeLeft] = useState(duration.minutes * 60);
  const [timeLeft, setTimeLeft] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [sound, setSound] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [shuffledSongs, setShuffledSongs] = useState([]);
  
  const timerRef = useRef(null);
  const verseTimerRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  
  // Animaciones
  const circleScale = useSharedValue(1);
  const textOpacity = useSharedValue(1);
  const breathingScale = useSharedValue(1);

  // Combinar versículos bíblicos y frases inspiradoras
  const allContent = [...BIBLE_VERSES, ...INSPIRATIONAL_QUOTES.map(quote => ({ text: quote, reference: '' }))];

  // Lista de canciones disponibles
  const songs = [
    require('../../assets/songs/Inner Seed.mp3'),
    require('../../assets/songs/Lift Me Higher.mp3'),
    require('../../assets/songs/Light the Way.mp3'),
    require('../../assets/songs/Shine Through Me.mp3'),
    require('../../assets/songs/Whispers of the Divine.mp3'),
  ];

  useEffect(() => {
    startSession();
    startVerseRotation();
    startBreathingAnimation();
    
    // Listener para cambios de estado de la app
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      cleanup();
      subscription?.remove();
    };
  }, []);

  // Cleanup cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() => {
    if (musicEnabled) {
      initializeMusic();
    }
  }, [musicEnabled]);

  useEffect(() => {
    if (musicEnabled && shuffledSongs.length > 0) {
      playCurrentSong();
    }
  }, [shuffledSongs]);

  useEffect(() => {
    // Animación del círculo de progreso
    
    const totalSeconds = duration.minutes * 60;
    const progress = (totalSeconds - timeLeft) / totalSeconds;
    circleScale.value = withTiming(1 + progress * 0.2, {
      duration: 1000,
      easing: Easing.out(Easing.ease),
    });
  }, [timeLeft]);

  const handleAppStateChange = (nextAppState) => {
    if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
      // La app volvió al primer plano - reiniciar sesión
      Alert.alert(
        'Sesión interrumpida',
        'Tu sesión se ha reiniciado porque saliste de la aplicación.',
        [
          {
            text: 'Continuar',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
    appStateRef.current = nextAppState;
  };

  const startSession = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          completeSessionAndNavigate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startVerseRotation = () => {
    verseTimerRef.current = setInterval(() => {
      setCurrentVerseIndex(prev => (prev + 1) % allContent.length);
      
      // Animación de transición de texto
      textOpacity.value = withTiming(0, { duration: 500 }, () => {
        textOpacity.value = withTiming(1, { duration: 500 });
      });
    }, APP_CONFIG.VERSE_CHANGE_INTERVAL);
  };

  const startBreathingAnimation = () => {
    breathingScale.value = withRepeat(
      withTiming(1.1, {
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  };

  const completeSessionAndNavigate = async () => {
    cleanup();
    await completeSession(duration.minutes);
    navigation.replace('SessionComplete', { duration });
  };

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (verseTimerRef.current) {
      clearInterval(verseTimerRef.current);
      verseTimerRef.current = null;
    }
    if (sound) {
      sound.unloadAsync();
    }
  };

  const togglePause = async () => {
    if (isPlaying) {
      clearInterval(timerRef.current);
      clearInterval(verseTimerRef.current);
      if (sound && musicEnabled) {
        await sound.pauseAsync();
      }
    } else {
      startSession();
      startVerseRotation();
      if (sound && musicEnabled) {
        await sound.playAsync();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleExit = () => {
    Alert.alert(
      'Salir de la sesión',
      '¿Estás seguro de que quieres terminar tu momento con Dios? El progreso no se guardará.',
      [
        { text: 'Continuar sesión', style: 'cancel' },
        { 
          text: 'Salir', 
          style: 'destructive',
          onPress: () => {
            cleanup();
            navigation.goBack();
          }
        }
      ]
    );
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeMusic = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      
      // Mezclar canciones aleatoriamente
      const shuffled = shuffleArray(songs);
      setShuffledSongs(shuffled);
      setCurrentSongIndex(0);
      
    } catch (error) {
      console.error('Error initializing music:', error);
    }
  };

  const playCurrentSong = async (songList = shuffledSongs, index = currentSongIndex) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      
      if (!songList || songList.length === 0 || !songList[index]) {
        console.log('No valid song to play');
        return;
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        songList[index],
        { shouldPlay: true, isLooping: false, volume: 0.3 }
      );
      
      setSound(newSound);
      
      // Configurar listener para cuando termine la canción
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          playNextSong();
        }
      });
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  const playNextSong = async () => {
    const nextIndex = (currentSongIndex + 1) % shuffledSongs.length;
    setCurrentSongIndex(nextIndex);
    
    // Si llegamos al final, volver a mezclar
    if (nextIndex === 0) {
      const newShuffled = shuffleArray(songs);
      setShuffledSongs(newShuffled);
      await playCurrentSong(newShuffled, 0);
    } else {
      await playCurrentSong(shuffledSongs, nextIndex);
    }
  };

  const toggleMusic = async () => {
    try {
      if (musicEnabled) {
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
        }
      } else {
        if (shuffledSongs.length > 0) {
          await playCurrentSong();
        } else {
          await initializeMusic();
        }
      }
      setMusicEnabled(!musicEnabled);
    } catch (error) {
      console.error('Error toggling music:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalSeconds = duration.minutes * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: circleScale.value }],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  const animatedBreathingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: breathingScale.value }],
    };
  });

  const currentContent = allContent[currentVerseIndex];

  return (
    <LinearGradient
      colors={Colors.gradients.sky}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header con controles */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleExit}
          >
            <Ionicons name="close" size={24} color={Colors.text.light} />
          </TouchableOpacity>
          
          <Text style={styles.sessionTitle}>
            Momento con Dios • {duration.minutes} min
          </Text>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleMusic}
          >
            <Ionicons 
              name={musicEnabled ? "musical-notes" : "musical-notes-outline"} 
              size={24} 
              color={Colors.text.light} 
            />
          </TouchableOpacity>
        </View>

        {/* Contenido principal */}
        <View style={styles.content}>
          {/* Círculo de progreso y temporizador */}
          <View style={styles.timerContainer}>
            <Animated.View style={[styles.progressCircle, animatedCircleStyle]}>
              <Animated.View style={[styles.breathingCircle, animatedBreathingStyle]}>
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                <Text style={styles.timerLabel}>restantes</Text>
              </Animated.View>
            </Animated.View>
            
            {/* Barra de progreso */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]} 
                />
              </View>
            </View>
          </View>

          {/* Contenido espiritual */}
          <Animated.View style={[styles.contentContainer, animatedTextStyle]}>
            <Text style={styles.verseText}>{currentContent.text}</Text>
            {currentContent.reference && (
              <Text style={styles.verseReference}>{currentContent.reference}</Text>
            )}
          </Animated.View>

          {/* Indicador de respiración */}
          <View style={styles.breathingGuide}>
            <Text style={styles.breathingText}>Respira profundo y siente Su presencia</Text>
          </View>
        </View>

        {/* Controles inferiores */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={togglePause}
          >
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={32} 
              color={Colors.text.light} 
            />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.light,
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  progressCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  breathingCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.text.light,
  },
  timerLabel: {
    fontSize: 14,
    color: Colors.text.light,
    opacity: 0.8,
    marginTop: 4,
  },
  progressBarContainer: {
    width: width - 60,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.text.light,
    borderRadius: 2,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  verseText: {
    fontSize: 20,
    color: Colors.text.light,
    textAlign: 'center',
    lineHeight: 30,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  verseReference: {
    fontSize: 16,
    color: Colors.text.light,
    opacity: 0.8,
    fontWeight: '500',
  },
  breathingGuide: {
    alignItems: 'center',
  },
  breathingText: {
    fontSize: 14,
    color: Colors.text.light,
    opacity: 0.9,
    textAlign: 'center',
  },
  controls: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default SessionScreen;