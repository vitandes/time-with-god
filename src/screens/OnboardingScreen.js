import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const flatListRef = useRef(null);

  const timeOptions = [
    { value: 5, label: '5 min ⏳' },
    { value: 10, label: '10 min' },
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 'custom', label: 'Personalizar' },
  ];

  const onboardingSteps = [
    // Pantalla 1 - Bienvenida
    {
      id: 'welcome',
      title: '✨ Bienvenido(a) a tu espacio con Dios',
      content: 'Un lugar diseñado para que cada día puedas detenerte, respirar y dedicarle un tiempo a tu Creador.\n\nAquí no importa cuánto, sino cómo: lo importante es conectar de verdad con Él.',
      buttonText: 'Empezar mi camino',
      image: require('../../assets/angel-flower.png'),
    },
    // Pantalla 2 - Inspiración
    {
      id: 'inspiration',
      title: 'Un momento solo para ti y para Dios',
      content: 'Vivimos rodeados de ruido y ocupaciones. Esta app quiere regalarte un espacio íntimo de oración, palabra y música.\n\nTú decides el ritmo. Nosotros te acompañamos.',
      buttonText: 'Continuar',
      image: require('../../assets/plants/flor-celestial.webp'),
    },
    // Pantalla 3 - Pregunta clave
    {
      id: 'time-selection',
      title: '¿Cuánto tiempo quieres dedicarle a Dios cada día?',
      content: 'No importa si son 5 minutos o 30 minutos.\n\nLo importante es dar ese paso y mantenerlo.',
      buttonText: 'Continuar',
      image: require('../../assets/plants/lirio.webp'),
      showTimeSelection: true,
    },
    // Pantalla 4 - Motivación personalizada
    {
      id: 'motivation',
      title: 'Tu tiempo con Dios',
      getContent: (time) => {
        if (!time) return '';
        
        if (time === 'custom') {
          return 'Dedicar un tiempo personalizado cada día puede transformar tu corazón.\n\nEn este espacio podrás orar, leer la palabra y escuchar música que inspire tu alma.';
        }
        
        return `${time} minutos cada día pueden transformar tu corazón.\n\nEn este tiempo podrás orar, leer la palabra y escuchar música que inspire tu alma.`;
      },
      buttonText: 'Quiero comenzar',
      image: require('../../assets/plants/rosa.webp'),
    },
    // Pantalla 5 - Cierre del onboarding
    {
      id: 'finish',
      title: 'Listo, este es tu espacio con Dios 🙏',
      content: 'Cada día encontrarás aquí una guía sencilla para acercarte más a Él.\n\nEste es solo el inicio de una nueva etapa en tu vida espiritual.',
      buttonText: '✨ Entrar a mi primer tiempo con Dios',
      image: require('../../assets/plants/flor-azul.webp'),
      isLastStep: true,
    },
  ];

  const handleNext = () => {
    const nextStep = currentStep + 1;
    
    // Si estamos en la pantalla de selección de tiempo y no se ha seleccionado ninguno
    if (currentStep === 2 && selectedTime === null) {
      // Establecer un valor predeterminado o mostrar un mensaje
      setSelectedTime(10); // Valor predeterminado de 10 minutos
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
    // Aquí se guardarían las preferencias del usuario
    // Por ejemplo, el tiempo seleccionado para la sesión diaria
    
    // Navegar a la pantalla de registro
    navigation.navigate('Register');
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

  const renderOnboardingStep = ({ item, index }) => {
    const isCurrentStep = index === currentStep;
    
    return (
      <View style={styles.stepContainer}>
        <View style={styles.contentContainer}>
          {item.image && (
            <Image source={item.image} style={styles.stepImage} resizeMode="contain" />
          )}
          
          <Text style={styles.stepTitle}>{item.title}</Text>
          
          <Text style={styles.stepContent}>
            {item.getContent ? item.getContent(selectedTime) : item.content}
          </Text>
          
          {item.showTimeSelection && (
            <View style={styles.timeOptionsContainer}>
              {timeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.timeOption,
                    selectedTime === option.value && styles.timeOptionSelected,
                  ]}
                  onPress={() => setSelectedTime(option.value)}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      selectedTime === option.value && styles.timeOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.nextButton}
          onPress={item.isLastStep ? finishOnboarding : handleNext}
        >
          <Text style={styles.nextButtonText}>{item.buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={Colors.gradients.primary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          ref={flatListRef}
          data={onboardingSteps}
          renderItem={renderOnboardingStep}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        />
        
        {/* Indicadores de paso */}
        <View style={styles.indicatorsContainer}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentStep && styles.indicatorActive,
              ]}
            />
          ))}
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
  stepContainer: {
    width,
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  stepImage: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 30,
    borderRadius: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  stepContent: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 24,
  },
  timeOptionsContainer: {
    width: '100%',
    marginTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  timeOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    margin: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  timeOptionSelected: {
    backgroundColor: Colors.white,
  },
  timeOptionText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  timeOptionTextSelected: {
    color: Colors.primary,
  },
  nextButton: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  indicatorsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: Colors.white,
    width: 20,
  },
});

export default OnboardingScreen;