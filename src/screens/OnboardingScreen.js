import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Animated,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from 'react-i18next';

import Colors from "../constants/Colors";
import LanguageSwitcher from '../components/LanguageSwitcher';

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const { t } = useTranslation(['onboarding', 'common']);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const flatListRef = useRef(null);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada para cada paso
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const timeOptions = [
    { value: 5, label: "5 min" },
    { value: 10, label: "10 min" },
    { value: 15, label: "15 min" },
    { value: 30, label: "30 min" },
    { value: "custom", label: t('timeOptions.custom') },
  ];

  const onboardingSteps = [
    // Pantalla 1 - Bienvenida
    {
      id: "welcome",
      title: t('welcome.title'),
      content: t('welcome.content'),
      buttonText: t('welcome.buttonText'),
      image: require("../../assets/onboarding/ob1.webp"),
    },
    // Pantalla 2 - Motivación
    {
      id: "inspiration",
      title: t('inspiration.title'),
      content: t('inspiration.content'),
      buttonText: t('inspiration.buttonText'),
      image: require("../../assets/onboarding/ob2.webp"),
    },
    // Pantalla 3 - Elección del tiempo
    {
      id: "time-selection",
      title: t('timeSelection.title'),
      content: t('timeSelection.content'),
      buttonText: t('timeSelection.buttonText'),
      image: require("../../assets/onboarding/ob3.webp"),
      showTimeSelection: true,
    },
    // Pantalla 4 - Motivación personalizada
    {
      id: "motivation",
      title: t('motivation.title'),
      getContent: (time) => {
        if (!time) return "";

        if (time === "custom") {
          return t('motivation.contentCustom');
        }

        return t('motivation.contentTimed', { time });
      },
      buttonText: t('motivation.buttonText'),
      image: require("../../assets/onboarding/ob40.webp"),
    },
    // Pantalla 5 - Compromiso inspirador
    {
      id: "finish",
      title: t('finish.title'),
      content: t('finish.content'),
      buttonText: t('finish.buttonText'),
      image: require("../../assets/onboarding/ob5.webp"),
      isLastStep: true,
    },
  ];

  const showFeedbackMessage = (message, duration = 2000) => {
    setFeedbackMessage(message);
    setShowFeedback(true);

    // Animar la aparición del mensaje
    Animated.sequence([
      Animated.timing(feedbackAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(feedbackAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowFeedback(false);
    });
  };

  const handleNext = () => {
    const nextStep = currentStep + 1;

    // Si estamos en la pantalla de selección de tiempo y no se ha seleccionado ninguno
    if (currentStep === 2 && selectedTime === null) {
      // Mostrar mensaje de feedback en lugar de establecer valor predeterminado
      showFeedbackMessage(
        t('onboarding:feedbackMessages.selectTime')
      );
      return;
    }

    // Si acabamos de seleccionar el tiempo, mostrar mensaje de refuerzo
    if (currentStep === 2 && selectedTime) {
      const displayTime =
      selectedTime === "custom" ? t('feedbackMessage') : `${selectedTime} minutos`;
      showFeedbackMessage(
        t('onboarding:feedbackMessages.excellentChoice', { time: displayTime })
      );
    }

    if (nextStep < onboardingSteps.length) {
      setCurrentStep(nextStep);
      flatListRef.current?.scrollToIndex({ index: nextStep, animated: true });
    } else {
      // Guardar las preferencias del usuario y navegar a la pantalla principal
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    // Mostrar mensaje de refuerzo emocional antes de navegar
    showFeedbackMessage(
      t('onboarding:feedbackMessages.firstStep'),
      2500
    );

    // Guardar las preferencias del usuario
    // Por ejemplo, el tiempo seleccionado para la sesión diaria

    // Navegar a la pantalla de registro después de un breve retraso
    setTimeout(() => {
      navigation.navigate("Register");
    }, 2000);
  };

  const renderTimeOption = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.timeOption,
        selectedTime === item.value && styles.timeOptionSelected,
      ]}
      onPress={() => setSelectedTime(item.value)}
    >
      <Text
        style={[
          styles.timeOptionText,
          selectedTime === item.value && styles.timeOptionTextSelected,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  // Animación para cada opción de tiempo - movido fuera de renderOnboardingStep
  const timeOptionAnimScale = useRef(new Animated.Value(1)).current;

  // Animación de pulsación para botones - movido fuera de renderOnboardingStep
  const handlePressIn = (animValue) => {
    Animated.spring(animValue, {
      toValue: 0.95,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (animValue) => {
    Animated.spring(animValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const renderOnboardingStep = ({ item, index }) => {
    const isCurrentStep = index === currentStep;

    return (
      <Animated.View
        style={[
          styles.stepContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            width: width,
          },
        ]}
      >
        <View style={styles.contentContainer}>
          {item.image && (
            <View style={styles.imageContainer}>
              <Animated.Image
                source={item.image}
                style={[
                  styles.stepImage,
                  { transform: [{ scale: scaleAnim }] },
                ]}
                resizeMode="cover"
              />
            </View>
          )}

          <Animated.Text style={[styles.stepTitle, { opacity: fadeAnim }]}>
            {item.title}
          </Animated.Text>

          <Animated.Text style={[styles.stepContent, { opacity: fadeAnim }]}>
            {item.getContent ? item.getContent(selectedTime) : item.content}
          </Animated.Text>

          {item.showTimeSelection && (
            <Animated.View
              style={[styles.timeOptionsContainer, { opacity: fadeAnim }]}
            >
              {timeOptions &&
                timeOptions.map((option) => {
                  const isSelected = selectedTime === option.value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.timeOption,
                        isSelected && styles.timeOptionSelected,
                      ]}
                      onPress={() => {
                        // Usar la animación global en lugar de una específica para cada opción
                        // Esto evita crear hooks dentro del renderizado
                        Animated.sequence([
                          Animated.timing(timeOptionAnimScale, {
                            toValue: 0.9,
                            duration: 100,
                            useNativeDriver: true,
                          }),
                          Animated.spring(timeOptionAnimScale, {
                            toValue: 1,
                            friction: 3,
                            tension: 40,
                            useNativeDriver: true,
                          }),
                        ]).start();

                        setSelectedTime(option.value);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.timeOptionText,
                          isSelected && styles.timeOptionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </Animated.View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            item.isLastStep ? styles.successButton : styles.primaryButton,
          ]}
          onPress={item.isLastStep ? finishOnboarding : handleNext}
          activeOpacity={0.8}
          onPressIn={() => handlePressIn(scaleAnim)}
          onPressOut={() => handlePressOut(scaleAnim)}
        >
          <Text style={styles.nextButtonText}>{item.buttonText}</Text>
          {item.isLastStep ? (
            <Ionicons
              name="heart"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
          ) : (
            <Ionicons
              name="arrow-forward"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <LinearGradient
      colors={Colors.gradients.primary}
      style={styles.container}
    >
      {/* Selector de idioma en la parte superior */}
      <SafeAreaView style={styles.languageSwitcherContainer}>
        <LanguageSwitcher />
      </SafeAreaView>
      
      {/* <SafeAreaView style={styles.safeArea}> */}
      <FlatList
        ref={flatListRef}
        data={onboardingSteps}
        renderItem={renderOnboardingStep}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onMomentumScrollEnd={(event) => {
          // Detectar cambio de pantalla por gesto de deslizamiento
          const newIndex = Math.floor(
            event.nativeEvent.contentOffset.x / width
          );
          if (newIndex !== currentStep) {
            setCurrentStep(newIndex);
          }
        }}
      />

      {/* Indicadores de paso */}
      <View style={styles.indicatorsContainer}>
        {onboardingSteps &&
          onboardingSteps.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                index === currentStep && styles.indicatorActive,
              ]}
              onPress={() => {
                setCurrentStep(index);
                flatListRef.current?.scrollToIndex({ index, animated: true });
              }}
              activeOpacity={0.7}
            />
          ))}
      </View>

      {/* Mensaje de feedback */}
      {showFeedback && (
        <Animated.View
          style={[styles.feedbackContainer, { opacity: feedbackAnim }]}
        >
          <LinearGradient
            colors={Colors.gradients.success}
            style={styles.feedbackGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.feedbackText}>{feedbackMessage}</Text>
          </LinearGradient>
        </Animated.View>
      )}
      {/* </SafeAreaView> */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  languageSwitcherContainer: {
    position: 'absolute',
    top: 0,
    right: 20,
    zIndex: 1000,
    paddingTop: 10,
  },
  safeArea: {
    flex: 1,
    position: "relative",
  },
  stepContainer: {
    width,
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 0,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 0,
  },
  imageContainer: {
    width: "100%",
    height: 380,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  stepImage: {
    width: "100%",
    height: "100%",
    alignSelf: "flex-start",
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.white,
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 0.5,
    paddingHorizontal: 10,
  },
  stepContent: {
    paddingHorizontal: 15,
    fontSize: 17,
    color: Colors.white,
    textAlign: "center",
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  timeOptionsContainer: {
    width: "100%",
    marginTop: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  timeOption: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    margin: 6,
    minWidth: 100,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  timeOptionSelected: {
    backgroundColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    transform: [{ scale: 1.05 }],
  },
  timeOptionText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  timeOptionTextSelected: {
    color: Colors.white,
    fontWeight: "bold",
  },
  nextButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20,
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  successButton: {
    backgroundColor: Colors.success,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  indicatorsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 4,
    opacity: 0.6,
  },
  indicatorActive: {
    backgroundColor: Colors.white,
    width: 24,
    opacity: 1,
  },
  feedbackContainer: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  feedbackGradient: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  successFeedback: {
    backgroundColor: Colors.success,
  },
  feedbackText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.3,
  },
});

export default OnboardingScreen;
