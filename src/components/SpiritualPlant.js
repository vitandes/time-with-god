import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';

import { PLANT_STAGES } from '../constants/Constants';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const SpiritualPlant = ({ 
  stage = 'seed', 
  health = 100, 
  lastWatered, 
  onPlantPress,
  animated = true,
  totalMinutes = 0
}) => {
  // Animaciones
  const plantScale = useSharedValue(1);
  const breathingScale = useSharedValue(1);

  const currentStage = Object.values(PLANT_STAGES).find(s => s.id === stage) || Object.values(PLANT_STAGES)[0];
  
  // Calcular progreso hacia la angel-flower (120 minutos)
  const ANGEL_FLOWER_MINUTES = 120;
  const progressPercentage = Math.min((totalMinutes / ANGEL_FLOWER_MINUTES) * 100, 100);
  const remainingMinutes = Math.max(ANGEL_FLOWER_MINUTES - totalMinutes, 0);
  const hasAngelFlower = totalMinutes >= ANGEL_FLOWER_MINUTES;
  


  useEffect(() => {
    if (!animated) return;

    // Animación suave de respiración para la flor
    breathingScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [animated]);

  // Animación cuando se toca la planta
  const handlePlantPress = () => {
    plantScale.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withSpring(1, { damping: 10, stiffness: 100 })
    );
    
    if (onPlantPress) {
      onPlantPress();
    }
  };

  const animatedPlantStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: plantScale.value * breathingScale.value },
      ],
    };
  });



  return (
    <View style={styles.container}>
      {/* Imagen de la flor */}
      <TouchableOpacity 
        style={styles.flowerContainer}
        onPress={handlePlantPress}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.flower, animatedPlantStyle]}>
          {hasAngelFlower ? (
            <Image 
              source={require('../../assets/angel-flower.png')} 
              style={styles.angelFlowerImage}
              resizeMode="contain"
            />
          ) : (
            <Image 
              source={require('../../assets/angel-flower.png')} 
              style={[styles.angelFlowerImage, { opacity: 1 }]}
              resizeMode="contain"
            />
          )}
        </Animated.View>
      </TouchableOpacity>
      
      {/* Solo mostrar tiempo restante */}
      {!hasAngelFlower && (
        <View style={styles.timeInfo}>
          <Text style={styles.timeText}>
            {remainingMinutes} minutos restantes
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  flowerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  flower: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  angelFlowerImage: {
    width: 150,
    height: 150,
  },
  timeInfo: {
    alignItems: 'center',
  },
  timeText: {
    marginTop: -20,
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
  },


});

export default SpiritualPlant;