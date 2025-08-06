import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  OBTAINED_PLANTS: '@obtained_plants',
  CURRENT_PLANT: '@current_plant',
  TOTAL_MINUTES: '@total_minutes',
};

export const usePlantProgress = () => {
  const [obtainedPlants, setObtainedPlants] = useState([]);
  const [currentPlant, setCurrentPlant] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);

  // Cargar datos al inicializar
  useEffect(() => {
    loadPlantData();
  }, []);

  const loadPlantData = async () => {
    try {
      const [obtained, current, minutes] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.OBTAINED_PLANTS),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_PLANT),
        AsyncStorage.getItem(STORAGE_KEYS.TOTAL_MINUTES),
      ]);

      if (obtained) {
        setObtainedPlants(JSON.parse(obtained));
      }
      
      if (current) {
        setCurrentPlant(JSON.parse(current));
      }
      
      if (minutes) {
        setTotalMinutes(parseInt(minutes));
      } else {
         // Inicializar en 0 para mostrar 5 minutos restantes para la semilla
         const initialMinutes = 0;
         setTotalMinutes(initialMinutes);
         await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_MINUTES, initialMinutes.toString());
       }
    } catch (error) {
      console.error('Error loading plant data:', error);
    }
  };

  const selectNewPlant = async (plant) => {
    try {
      // Solo establecer como planta actual, NO agregar a obtenidas hasta completarla
      setCurrentPlant(plant);
      
      // Resetear totalMinutes al seleccionar una nueva planta
      setTotalMinutes(0);
      
      // Guardar en storage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.CURRENT_PLANT, JSON.stringify(plant)),
        AsyncStorage.setItem(STORAGE_KEYS.TOTAL_MINUTES, '5')
      ]);
    } catch (error) {
      console.error('Error selecting new plant:', error);
    }
  };

  const completePlant = async (plant) => {
    try {
      // Agregar planta a las obtenidas con fecha de obtención
      const plantWithDate = {
        id: plant.id,
        completedDate: new Date().toISOString(),
        completedDateFormatted: new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
      const newObtained = [...obtainedPlants, plantWithDate];
      setObtainedPlants(newObtained);
      
      // Resetear la planta actual cuando se completa
      setCurrentPlant(null);
      
      // Guardar en storage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.OBTAINED_PLANTS, JSON.stringify(newObtained)),
        AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_PLANT)
      ]);
    } catch (error) {
      console.error('Error completing plant:', error);
    }
  };

  const resetPlantProgress = async () => {
    try {
      setCurrentPlant(null);
      setTotalMinutes(0);
      
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_PLANT),
        AsyncStorage.setItem(STORAGE_KEYS.TOTAL_MINUTES, '0'),
      ]);
    } catch (error) {
      console.error('Error resetting plant progress:', error);
    }
  };

  const addSessionMinutes = async (minutes) => {
    try {
      const newTotal = totalMinutes + minutes;
      setTotalMinutes(newTotal);
      await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_MINUTES, newTotal.toString());
    } catch (error) {
      console.error('Error adding session minutes:', error);
    }
  };

  return {
    obtainedPlants,
    currentPlant,
    totalMinutes,
    selectNewPlant,
    completePlant,
    resetPlantProgress,
    addSessionMinutes,
  };
};