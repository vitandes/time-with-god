import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PLANTS } from '../constants/Constants';
import Colors from '../constants/Colors';

// Mapeo de imágenes
const PLANT_IMAGES = {
  'cactus': require('../../assets/plants/cactuus.webp'),
  'cedro': require('../../assets/plants/cedro.webp'),
  'flor-azul': require('../../assets/plants/flor-azul.webp'),
  'flor-celestial': require('../../assets/plants/flor-celestial.webp'),
  'lirio': require('../../assets/plants/lirio.webp'),
  'rosa': require('../../assets/plants/rosa.webp'),
  
};

const { width } = Dimensions.get('window');

const PlantSelector = ({ visible, onClose, onSelectPlant, obtainedPlants = [] }) => {
  // Filtrar plantas que no han sido obtenidas
  const availablePlants = PLANTS.filter(plant => !obtainedPlants.some(obtained => obtained.id === plant.id));
  const [currentPage, setCurrentPage] = useState(0);
  
  // Configuración para paginación
  const PLANTS_PER_PAGE = 6;
  const totalPages = Math.ceil(availablePlants.length / PLANTS_PER_PAGE);
  const shouldShowPagination = availablePlants.length > PLANTS_PER_PAGE;
  
  // Plantas para la página actual
  const currentPlants = shouldShowPagination 
    ? availablePlants.slice(currentPage * PLANTS_PER_PAGE, (currentPage + 1) * PLANTS_PER_PAGE)
    : availablePlants;

  const handleSelectPlant = (plant) => {
    onSelectPlant(plant);
    onClose();
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const resetPage = () => {
    setCurrentPage(0);
  };
  
  // Reset página cuando se cierra el modal
  const handleClose = () => {
    resetPage();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecciona tu nueva planta</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.plantsContainer}>
            {availablePlants.length > 0 ? (
              <>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.plantsScrollView}>
                  <View style={styles.plantsGrid}>
                    {currentPlants.map((plant) => (
                      <TouchableOpacity
                        key={plant.id}
                        style={styles.plantCard}
                        onPress={() => handleSelectPlant(plant)}
                      >
                        <Image source={PLANT_IMAGES[plant.id]} style={styles.plantImage} resizeMode="cover" />
                        <Text style={styles.plantName}>{plant.name}</Text>
                        <Text style={styles.plantTime}>{plant.minutes} minutos</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
                
                {shouldShowPagination && (
                  <View style={styles.paginationContainer}>
                    <TouchableOpacity 
                      style={[styles.paginationButton, currentPage === 0 && styles.paginationButtonDisabled]}
                      onPress={goToPrevPage}
                      disabled={currentPage === 0}
                    >
                      <Ionicons name="chevron-back" size={20} color={currentPage === 0 ? Colors.text.muted : Colors.text.primary} />
                    </TouchableOpacity>
                    
                    <View style={styles.pageIndicator}>
                      <Text style={styles.pageText}>{currentPage + 1} de {totalPages}</Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={[styles.paginationButton, currentPage === totalPages - 1 && styles.paginationButtonDisabled]}
                      onPress={goToNextPage}
                      disabled={currentPage === totalPages - 1}
                    >
                      <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages - 1 ? Colors.text.muted : Colors.text.primary} />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.noPlants}>
                <Text style={styles.noplantsText}>¡Has desbloqueado todas las plantas!</Text>
                <Text style={styles.noplantsSubtext}>Continúa tu viaje espiritual</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: '80%',
    padding: 20,
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 5,
  },
  plantsContainer: {
    minHeight: 300,
    maxHeight: 400,
  },
  plantsScrollView: {
    flexGrow: 1,
  },
  plantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  plantCard: {
    width: (width * 0.9 - 60) / 2,
    backgroundColor: Colors.background,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 140,
  },
  plantImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  plantName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 5,
  },
  plantTime: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  noPlants: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noplantsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  noplantsSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.primary,
    marginTop: 10,
  },
  paginationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  paginationButtonDisabled: {
    backgroundColor: Colors.background,
    borderColor: Colors.text.muted,
    opacity: 0.5,
  },
  pageIndicator: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 15,
  },
  pageText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
  },
});

export default PlantSelector;