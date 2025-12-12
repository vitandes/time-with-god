import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
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

import { useConstants } from '../hooks/useConstants';
import Colors from '../constants/Colors';
import { usePlantProgress } from '../hooks/usePlantProgress';

// Mapeo de imágenes de plantas
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

const SpiritualPlant = ({
  onPlantPress,
  animated = true
}) => {
  const { t } = useTranslation('app');
  // Estado para el modal de selección
  const [showPlantSelector, setShowPlantSelector] = useState(false);
  // Estado para el modal de información de la planta
  const [showPlantInfo, setShowPlantInfo] = useState(false);

  // Usar el hook de constantes
  const { seedMinutes, seedPlant } = useConstants();

  // Usar el hook de progreso de plantas
  const { obtainedPlants, currentPlant, totalMinutes, selectNewPlant, completePlant } = usePlantProgress();

  // Animaciones
  const plantScale = useSharedValue(1);
  const breathingScale = useSharedValue(1);

  // Validar que totalMinutes sea un número válido
  const validTotalMinutes = typeof totalMinutes === 'number' && !isNaN(totalMinutes) ? totalMinutes : 0;

  // Lógica para determinar qué mostrar
  const seedCompleted = validTotalMinutes >= seedMinutes;

  // Determinar si la planta actual está completa
  const plantCompleted = currentPlant && validTotalMinutes >= (seedMinutes + currentPlant.minutes);

  // Calcular progreso y tiempo restante
  let remainingMinutes = 0;
  let progressPercentage = 0;

  if (!currentPlant) {
    // Solo semilla - mostrar progreso hacia completar la semilla
    remainingMinutes = Math.max(seedMinutes - validTotalMinutes, 0);
    progressPercentage = Math.min((validTotalMinutes / seedMinutes) * 100, 100);
  } else {
    // Hay planta seleccionada - calcular progreso de la planta
    const minutesForPlant = Math.max(validTotalMinutes - seedMinutes, 0);
    remainingMinutes = Math.max(currentPlant.minutes - minutesForPlant, 0);
    progressPercentage = Math.min((minutesForPlant / currentPlant.minutes) * 100, 100);

    // Si la planta está completa, marcarla como obtenida (MOVED TO USEEFFECT)
    // if (remainingMinutes === 0 && minutesForPlant >= currentPlant.minutes) {
    //   completePlant(currentPlant);
    // }
  }

  // Efecto para completar la planta actual
  useEffect(() => {
    if (currentPlant && validTotalMinutes >= (seedMinutes + currentPlant.minutes)) {
      completePlant(currentPlant);
    }
  }, [currentPlant, validTotalMinutes, seedMinutes, completePlant]);



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

  // Efecto para completar la semilla automáticamente
  useEffect(() => {
    // Verificar si la semilla está completa y no hay planta actual
    if (seedCompleted && !currentPlant && validTotalMinutes >= seedMinutes) {
      // Verificar si la semilla ya está en las plantas obtenidas
      const seedAlreadyObtained = obtainedPlants.some(plant => plant.id === 'semilla');

      if (!seedAlreadyObtained) {
        // Completar la semilla automáticamente
        completePlant(seedPlant);
      }
    }
  }, [seedCompleted, currentPlant, validTotalMinutes, obtainedPlants, completePlant, seedPlant]);

  // Animación cuando se toca la planta
  const handlePlantPress = () => {
    plantScale.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withSpring(1, { damping: 10, stiffness: 100 })
    );

    // Si hay una planta actual, mostrar información
    if (currentPlant) {
      setShowPlantInfo(true);
    }

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
              source={require('../../assets/plants/semilla.png')}
              style={styles.seedImage}
              resizeMode="cover"
            />
          ) : currentPlant && remainingMinutes > 0 ? (
            // Mostrar planta seleccionada mientras falten minutos
            <Image
              source={PLANT_IMAGES[currentPlant.image]}
              style={styles.seedImage}
              resizeMode="cover"
            />
          ) : currentPlant && remainingMinutes <= 0 ? (
            // Mostrar planta completada
            <Image
              source={PLANT_IMAGES[currentPlant.image]}
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
              {remainingMinutes} {t('home.plant.minutesRemaining')}
            </Text>
            <Text style={styles.plantNameText}>
              {currentPlant.name}
            </Text>
          </>
        ) : (
          <Text style={styles.timeText}>
            {remainingMinutes} {t('home.plant.minutesRemaining')}
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

      {/* Modal de información de la planta */}
      <Modal
        visible={showPlantInfo}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPlantInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPlantInfo(false)}
            >
              <Ionicons name="close" size={24} color={Colors.text.secondary} />
            </TouchableOpacity>

            {currentPlant && (
              <>
                <Image
                  source={PLANT_IMAGES[currentPlant.image]}
                  style={styles.modalPlantImage}
                  resizeMode="cover"
                />
                <Text style={styles.modalPlantName}>{currentPlant.name}</Text>
                <Text style={styles.modalPlantDescription}>{currentPlant.description}</Text>
                <Text style={styles.modalPlantMeaning}>{currentPlant.meaning}</Text>
                <Text style={styles.modalPlantProgress}>
                  {remainingMinutes > 0
                    ? `${remainingMinutes} ${t('home.plant.minutesRemaining')}`
                    : t('home.plant.completed')
                  }
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  modalPlantImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.plant.healthy,
    marginBottom: 20,
  },
  modalPlantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalPlantDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 15,
    fontWeight: '500',
  },
  modalPlantMeaning: {
    fontSize: 15,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    fontStyle: 'italic',
    paddingHorizontal: 10,
  },
  modalPlantProgress: {
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
});

export default SpiritualPlant;