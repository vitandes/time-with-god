import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PlantSelector from './PlantSelector';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';

import { PLANT_STAGES, SEED_MINUTES, PLANTS } from '../constants/Constants';
import Colors from '../constants/Colors';
import { usePlantProgress } from '../hooks/usePlantProgress';

// Mapeo de imágenes de plantas
const PLANT_IMAGES = {
  'cactus': require('../../assets/plants/cactuus.webp'),
  'cedro': require('../../assets/plants/cedro.webp'),
  'flor-azul': require('../../assets/plants/flor-azul.webp'),
  'flor-celestial': require('../../assets/plants/flor-celestial.webp'),
  'lirio': require('../../assets/plants/lirio.webp'),
  'rosa': require('../../assets/plants/rosa.webp'),
};

const { width } = Dimensions.get('window');

const SpiritualPlant = ({ 
  onPlantPress,
  animated = true
}) => {
  // Estado para el modal de selección
  const [showPlantSelector, setShowPlantSelector] = useState(false);
  
  // Usar el hook de progreso de plantas
  const { obtainedPlants, currentPlant, totalMinutes, selectNewPlant, completePlant } = usePlantProgress();
  
  // Animaciones
  const plantScale = useSharedValue(1);
  const breathingScale = useSharedValue(1);
  
  // Validar que totalMinutes sea un número válido
  const validTotalMinutes = typeof totalMinutes === 'number' && !isNaN(totalMinutes) ? totalMinutes : 0;
  
  // Lógica para determinar qué mostrar
  const seedCompleted = validTotalMinutes >= SEED_MINUTES;
  
  // Determinar si la planta actual está completa
  const plantCompleted = currentPlant && validTotalMinutes >= (SEED_MINUTES + currentPlant.minutes);
  
  // Calcular progreso y tiempo restante
  let remainingMinutes = 0;
  let progressPercentage = 0;
  
  if (!currentPlant) {
    // Solo semilla - mostrar progreso hacia completar la semilla
    remainingMinutes = Math.max(SEED_MINUTES - validTotalMinutes, 0);
    progressPercentage = Math.min((validTotalMinutes / SEED_MINUTES) * 100, 100);
  } else {
    // Hay planta seleccionada - calcular progreso de la planta
    const minutesForPlant = Math.max(validTotalMinutes - SEED_MINUTES, 0);
    remainingMinutes = Math.max(currentPlant.minutes - minutesForPlant, 0);
    progressPercentage = Math.min((minutesForPlant / currentPlant.minutes) * 100, 100);
    
    // Si la planta está completa, marcarla como obtenida
    if (remainingMinutes === 0 && minutesForPlant >= currentPlant.minutes) {
      completePlant(currentPlant);
    }
  }
  


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

  // Manejar selección de nueva planta
  const handleSelectNewPlant = (plant) => {
    selectNewPlant(plant);
  };

  // Mostrar selector de plantas
  const handleShowPlantSelector = () => {
    setShowPlantSelector(true);
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
          {remainingMinutes > 0 && !currentPlant ? (
            // Mostrar semilla inicial mientras falten minutos
            <Image 
              source={require('../../assets/plants/semilla.webp')} 
              style={styles.seedImage}
              resizeMode="cover"
            />
          ) : currentPlant && remainingMinutes > 0 ? (
            // Mostrar planta seleccionada mientras falten minutos
            <Image 
              source={PLANT_IMAGES[currentPlant.id]} 
              style={styles.seedImage}
              resizeMode="cover"
            />
          ) : currentPlant && remainingMinutes <= 0 ? (
            // Mostrar planta completada
            <Image 
              source={PLANT_IMAGES[currentPlant.id]} 
              style={styles.seedImage}
              resizeMode="cover"
            />
          ) : (
            // Mostrar botón "+" cuando la semilla esté completa y no haya planta seleccionada
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleShowPlantSelector}
            >
              <Ionicons name="add" size={50} color="rgba(255, 255, 255, 0.9)" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </TouchableOpacity>
      
      {/* Mostrar información de tiempo y planta */}
      <View style={styles.timeInfo}>
        {currentPlant ? (
          <>
            <Text style={styles.timeText}>
              {remainingMinutes} minutos restantes
            </Text>
            <Text style={styles.plantNameText}>
              {currentPlant.name}
            </Text>
          </>
        ) : (
          <Text style={styles.timeText}>
            {remainingMinutes} minutos restantes
          </Text>
        )}
      </View>
      
      {/* Modal de selección de plantas */}
      <PlantSelector
        visible={showPlantSelector}
        onClose={() => setShowPlantSelector(false)}
        onSelectPlant={handleSelectNewPlant}
        obtainedPlants={obtainedPlants}
      />
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
    marginBottom: 10,
    width: 230,
    height: 230,
    borderRadius: 20,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  flower: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  seedImage: {
    width: '100%',
    height: '100%',
  },
  addButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 115,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  timeText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
  },
  plantNameText: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
    marginTop: 5,
    textAlign: 'center',
  },


});

export default SpiritualPlant;