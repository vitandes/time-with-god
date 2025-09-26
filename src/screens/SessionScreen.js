import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  AppState,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { useAuth } from "../context/AuthContext";
import { useConstants } from "../hooks/useConstants";
import Colors from "../constants/Colors";
import { usePlantProgress } from "../hooks/usePlantProgress";

const { width, height } = Dimensions.get("window");

const SessionScreen = ({ navigation, route }) => {
  const { duration } = route.params;
  const { completeSession } = useAuth();
  const { addSessionMinutes } = usePlantProgress();
  const { bibleVerses, inspirationalQuotes, appConfig } = useConstants();
  const { t, i18n } = useTranslation();
  // const { addSessionMinutes } = usePlantProgress(t);

  const [timeLeft, setTimeLeft] = useState(duration.minutes * 60);
  // const [timeLeft, setTimeLeft] = useState(10);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [sound, setSound] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [shuffledSongs, setShuffledSongs] = useState([]);

  // Estados para la introducción
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);
  const [introSound, setIntroSound] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  const timerRef = useRef(null);
  const verseTimerRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  // Animaciones
  const circleScale = useSharedValue(1);
  const textOpacity = useSharedValue(1);
  const breathingScale = useSharedValue(1);

  // Combinar versículos bíblicos y frases inspiradoras
  const allContent = [
    ...bibleVerses,
    ...inspirationalQuotes.map((quote) => ({ text: quote, reference: "" })),
  ];

  // Lista de canciones disponibles
  const songs = [
    require("../../assets/songs/Heaven's Light.mp3"),
    require("../../assets/songs/Heaven's Open Door.mp3"),
    require("../../assets/songs/Heaven's Whisper.mp3"),
    require("../../assets/songs/Inner Seed.mp3"),
    require("../../assets/songs/Lift Me Higher.mp3"),
    require("../../assets/songs/Light the Way.mp3"),
    require("../../assets/songs/Rise Above.mp3"),
    require("../../assets/songs/Rise and Shine.mp3"),
    require("../../assets/songs/Shine Through Me.mp3"),
    require("../../assets/songs/Whispers of the Divine.mp3"),
  ];

  // Archivos de audio de introducción por idioma
  const introAudioFiles = {
    es: require("../../assets/music/intro-meditation-es.mp3"),
    en: require("../../assets/music/intro-meditation-en.mp3"),
  };

  useEffect(() => {
    // Resetear estados de introducción al iniciar una nueva sesión
    setIsIntroPlaying(true);
    setSessionStarted(false);
    setIntroSound(null);
    
    startIntroduction();

    // Listener para cambios de estado de la app
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

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
      if (introSound) {
        introSound.unloadAsync();
      }
    };
  }, [sound, introSound]);

  useEffect(() => {
    // Solo inicializar música si no estamos en la introducción
    if (musicEnabled && !isIntroPlaying && sessionStarted) {
      initializeMusic();
    }
  }, [musicEnabled, isIntroPlaying, sessionStarted]);

  useEffect(() => {
    // Solo reproducir música si no estamos en la introducción
    if (musicEnabled && shuffledSongs.length > 0 && !isIntroPlaying && sessionStarted) {
      playCurrentSong();
    }
  }, [shuffledSongs, isIntroPlaying, sessionStarted]);

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
    if (
      appStateRef.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // La app volvió al primer plano - reiniciar sesión
      Alert.alert(
        t("app:session.alerts.sessionInterrupted"),
        t("app:session.alerts.sessionInterruptedMessage"),
        [
          {
            text: t("app:session.alerts.continue"),
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
    appStateRef.current = nextAppState;
  };

  const startIntroduction = async () => {
    try {
      // Configurar el modo de audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Obtener el idioma actual
      const currentLanguage = i18n.language || "es";
      const audioFile = introAudioFiles[currentLanguage] || introAudioFiles.es;

      // Cargar y reproducir el audio de introducción
      const { sound: newIntroSound } = await Audio.Sound.createAsync(audioFile);
      setIntroSound(newIntroSound);

      // Configurar el callback para cuando termine el audio
      newIntroSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          finishIntroduction();
        }
      });

      // Reproducir el audio de introducción
      await newIntroSound.playAsync();

      // Iniciar la animación de respiración durante la introducción
      startBreathingAnimation();
    } catch (error) {
      console.error("Error al reproducir audio de introducción:", error);
      // Si hay error, continuar con la sesión normal
      finishIntroduction();
    }
  };

  const finishIntroduction = async () => {
    // Limpiar el audio de introducción
    if (introSound) {
      await introSound.unloadAsync();
      setIntroSound(null);
    }

    // Cambiar el estado para mostrar la sesión principal
    setIsIntroPlaying(false);
    setSessionStarted(true);

    // Iniciar la sesión principal
    startSession();
    startVerseRotation();

    // Inicializar música de fondo si está habilitada (después de la introducción)
    if (musicEnabled) {
      setTimeout(() => {
        initializeMusic();
      }, 1000); // Esperar 1 segundo antes de iniciar la música de fondo
    }
  };

  const startSession = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
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
      setCurrentVerseIndex((prev) => (prev + 1) % allContent.length);

      // Animación de transición de texto
      textOpacity.value = withTiming(0, { duration: 500 }, () => {
        textOpacity.value = withTiming(1, { duration: 500 });
      });
    }, appConfig.VERSE_CHANGE_INTERVAL);
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
    navigation.replace("SessionComplete", { duration });
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
    if (introSound) {
      introSound.unloadAsync();
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
      t("app:session.alerts.exitSession"),
      t("app:session.alerts.exitSessionMessage"),
      [
        { text: t("app:session.alerts.continueSession"), style: "cancel" },
        {
          text: t("app:session.alerts.exit"),
          style: "destructive",
          onPress: () => {
            cleanup();
            navigation.goBack();
          },
        },
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
      console.error("Error initializing music:", error);
    }
  };

  const playCurrentSong = async (
    songList = shuffledSongs,
    index = currentSongIndex
  ) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      if (!songList || songList.length === 0 || !songList[index]) {
        console.log("No valid song to play");
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
      console.error("Error playing song:", error);
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
      console.error("Error toggling music:", error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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
    <LinearGradient colors={Colors.gradients.sky} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header con controles */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleExit}>
            <Ionicons name="close" size={24} color={Colors.text.light} />
          </TouchableOpacity>

          <Text style={styles.sessionTitle}>
            {isIntroPlaying
              ? t("app:session.introduction", {
                  defaultValue: "Preparándose para meditar...",
                })
              : t("app:session.title", { minutes: duration.minutes })}
          </Text>

          {!isIntroPlaying && (
            <TouchableOpacity style={styles.headerButton} onPress={toggleMusic}>
              <Ionicons
                name={musicEnabled ? "musical-notes" : "musical-notes-outline"}
                size={24}
                color={Colors.text.light}
              />
            </TouchableOpacity>
          )}

          {isIntroPlaying && <View style={styles.headerButton} />}
        </View>

        {/* Contenido principal */}
        <View style={styles.content}>
          {isIntroPlaying ? (
            // Pantalla de introducción con animación de respiración
            <View style={styles.introContainer}>
              <Animated.View
                style={[styles.introBreathingCircle, animatedBreathingStyle]}
              >
                <View style={styles.innerBreathingCircle}>
                  <Text style={styles.introText}>
                    {t("app:session.breathe", { defaultValue: "Respira" })}
                  </Text>
                </View>
              </Animated.View>

              <Text style={styles.introMessage}>
                {t("app:session.introMessage", {
                  defaultValue:
                    "Tómate un momento para relajarte y prepararte para este tiempo de meditación",
                })}
              </Text>
            </View>
          ) : (
            // Pantalla principal de la sesión
            <>
              {/* Círculo de progreso y temporizador */}
              <View style={styles.timerContainer}>
                <Animated.View
                  style={[styles.progressCircle, animatedCircleStyle]}
                >
                  <Animated.View
                    style={[styles.breathingCircle, animatedBreathingStyle]}
                  >
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                    <Text style={styles.timerLabel}>
                      {t("app:session.timeRemaining")}
                    </Text>
                  </Animated.View>
                </Animated.View>

                {/* Barra de progreso */}
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${getProgressPercentage()}%` },
                      ]}
                    />
                  </View>
                </View>
              </View>

              {/* Contenido espiritual */}
              <Animated.View
                style={[styles.contentContainer, animatedTextStyle]}
              >
                <Text style={styles.verseText}>{currentContent.text}</Text>
                {currentContent.reference && (
                  <Text style={styles.verseReference}>
                    {currentContent.reference}
                  </Text>
                )}
              </Animated.View>

              {/* Indicador de respiración */}
              <View style={styles.breathingGuide}>
                <Text style={styles.breathingText}>
                  {t("app:session.breathingGuide")}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Controles inferiores - solo mostrar durante la sesión principal */}
        {!isIntroPlaying && (
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
        )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.light,
    textAlign: "center",
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  // Estilos para la pantalla de introducción
  introContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  introBreathingCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  innerBreathingCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  introText: {
    fontSize: 24,
    fontWeight: "300",
    color: Colors.text.light,
    textAlign: "center",
  },
  introMessage: {
    fontSize: 18,
    color: Colors.text.light,
    textAlign: "center",
    lineHeight: 26,
    opacity: 0.9,
    paddingHorizontal: 20,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  progressCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  breathingCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 36,
    fontWeight: "bold",
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
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.text.light,
    borderRadius: 2,
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  verseText: {
    fontSize: 20,
    color: Colors.text.light,
    textAlign: "center",
    lineHeight: 30,
    fontStyle: "italic",
    marginBottom: 16,
  },
  verseReference: {
    fontSize: 16,
    color: Colors.text.light,
    opacity: 0.8,
    fontWeight: "500",
  },
  breathingGuide: {
    alignItems: "center",
  },
  breathingText: {
    fontSize: 14,
    color: Colors.text.light,
    opacity: 0.9,
    textAlign: "center",
  },
  controls: {
    alignItems: "center",
    paddingBottom: 40,
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
});

export default SessionScreen;
