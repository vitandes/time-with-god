import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const features = [
    {
      icon: 'time-outline',
      title: 'Momentos Personalizados',
      description: 'Elige entre 5, 10, 15 o 30 minutos para tu tiempo con Dios'
    },
    {
      icon: 'leaf-outline',
      title: 'Planta Espiritual',
      description: 'Observa cómo crece tu fe día a día con tu planta virtual'
    },
    {
      icon: 'book-outline',
      title: 'Versículos Inspiradores',
      description: 'Reflexiona con pasajes bíblicos cuidadosamente seleccionados'
    },
    {
      icon: 'musical-notes-outline',
      title: 'Música Relajante',
      description: 'Acompaña tu oración con melodías que elevan el espíritu'
    }
  ];

  return (
    <LinearGradient
      colors={Colors.gradients.primary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header con ícono principal */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="flower"
                size={60}
                color={Colors.text.primary}
              />
            </View>
            <Text style={styles.title}>Tiempo con Dios</Text>
            <Text style={styles.subtitle}>
              Tu compañero para momentos diarios de oración, reflexión y paz interior
            </Text>
          </View>

          {/* Características principales */}
          <View style={styles.featuresContainer}>
            {features && features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons
                    name={feature.icon}
                    size={24}
                    color={Colors.text.primary}
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Mensaje inspirador */}
          <View style={styles.inspirationalContainer}>
            <Text style={styles.inspirationalText}>
              "Estad quietos, y conoced que yo soy Dios"
            </Text>
            <Text style={styles.inspirationalReference}>Salmos 46:10</Text>
          </View>

          {/* Botones de acción */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Comenzar mi Viaje</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={Colors.text.light}
                style={styles.buttonIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Ya tengo una cuenta</Text>
            </TouchableOpacity>
          </View>

          {/* Información de prueba gratuita */}
          <View style={styles.trialInfo}>
            <Ionicons
              name="gift-outline"
              size={16}
              color={Colors.text.secondary}
            />
            <Text style={styles.trialText}>
              7 días de prueba gratuita • Cancela cuando quieras
            </Text>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  iconContainer: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 50,
    marginBottom: 20,
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  inspirationalContainer: {
    backgroundColor: Colors.surface,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  inspirationalText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 26,
  },
  inspirationalReference: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: Colors.text.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.text.primary,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  trialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  trialText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 6,
    textAlign: 'center',
  },
});

export default WelcomeScreen;