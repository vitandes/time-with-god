import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { SUBSCRIPTION_PLANS, APP_CONFIG } from '../constants/Constants';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const SubscriptionScreen = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);

  const { subscription, updateSubscription, user } = useAuth();

  useEffect(() => {
    // Calcular días restantes de prueba
    if (subscription.trialEndsAt) {
      const trialEnd = new Date(subscription.trialEndsAt);
      const now = new Date();
      const diffTime = trialEnd - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTrialDaysLeft(Math.max(0, diffDays));
    }
  }, [subscription.trialEndsAt]);

  const features = [
    {
      icon: 'checkmark-circle',
      text: 'Acceso ilimitado a todas las sesiones'
    },
    {
      icon: 'checkmark-circle',
      text: 'Biblioteca completa de versículos bíblicos'
    },
    {
      icon: 'checkmark-circle',
      text: 'Música instrumental cristiana'
    },
    {
      icon: 'checkmark-circle',
      text: 'Sistema de planta espiritual'
    },
    {
      icon: 'checkmark-circle',
      text: 'Historial detallado de progreso'
    },
    {
      icon: 'checkmark-circle',
      text: 'Sin anuncios ni interrupciones'
    },
    {
      icon: 'checkmark-circle',
      text: 'Nuevas funciones y contenido'
    }
  ];

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    try {
      // Simular proceso de pago (en una app real, integrarías con RevenueCat/Stripe)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const plan = SUBSCRIPTION_PLANS[selectedPlan.toUpperCase()];
      const expirationDate = new Date();
      
      if (selectedPlan === 'monthly') {
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      } else {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      }

      await updateSubscription({
        isActive: true,
        plan: selectedPlan,
        expiresAt: expirationDate.toISOString(),
        isTrialActive: false,
        subscribedAt: new Date().toISOString()
      });

      Alert.alert(
        '¡Suscripción Activada!',
        `Ahora tienes acceso completo a Tiempo con Dios. Tu suscripción ${plan.period} se renovará automáticamente.`,
        [{ text: 'Continuar', onPress: () => navigation.replace('Main') }]
      );
    } catch (error) {
      Alert.alert(
        'Error en el pago',
        'Hubo un problema al procesar tu suscripción. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithTrial = () => {
    if (trialDaysLeft > 0) {
      navigation.replace('Main');
    } else {
      Alert.alert(
        'Prueba expirada',
        'Tu período de prueba ha terminado. Suscríbete para continuar disfrutando de Tiempo con Dios.',
        [{ text: 'OK' }]
      );
    }
  };

  const PlanCard = ({ planId, plan, isSelected, onSelect }) => {
    const savings = planId === 'yearly' ? '17%' : null;
    
    return (
      <TouchableOpacity
        style={[styles.planCard, isSelected && styles.selectedPlan]}
        onPress={() => onSelect(planId)}
        activeOpacity={0.8}
      >
        {savings && (
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsText}>Ahorra {savings}</Text>
          </View>
        )}
        
        <View style={styles.planHeader}>
          <Text style={styles.planPeriod}>{plan.period}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>{plan.currency}</Text>
            <Text style={styles.price}>{plan.price}</Text>
          </View>
          <Text style={styles.planDescription}>{plan.description}</Text>
        </View>
        
        <View style={styles.radioContainer}>
          <View style={[styles.radio, isSelected && styles.radioSelected]}>
            {isSelected && (
              <Ionicons name="checkmark" size={16} color={Colors.text.light} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="diamond"
                size={40}
                color={Colors.text.primary}
              />
            </View>
            <Text style={styles.title}>Desbloquea tu Potencial Espiritual</Text>
            <Text style={styles.subtitle}>
              Accede a todas las funciones premium y profundiza tu conexión con Dios
            </Text>
          </View>

          {/* Información de prueba */}
          {subscription.isTrialActive && trialDaysLeft > 0 && (
            <View style={styles.trialInfo}>
              <Ionicons name="gift" size={20} color={Colors.success} />
              <Text style={styles.trialText}>
                Te quedan {trialDaysLeft} días de prueba gratuita
              </Text>
            </View>
          )}

          {/* Planes de suscripción */}
          <View style={styles.plansContainer}>
            <Text style={styles.sectionTitle}>Elige tu plan</Text>
            
            <PlanCard
              planId="yearly"
              plan={SUBSCRIPTION_PLANS.YEARLY}
              isSelected={selectedPlan === 'yearly'}
              onSelect={setSelectedPlan}
            />
            
            <PlanCard
              planId="monthly"
              plan={SUBSCRIPTION_PLANS.MONTHLY}
              isSelected={selectedPlan === 'monthly'}
              onSelect={setSelectedPlan}
            />
          </View>

          {/* Características incluidas */}
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Todo lo que incluye</Text>
            
            {features && features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons
                  name={feature.icon}
                  size={20}
                  color={Colors.success}
                  style={styles.featureIcon}
                />
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>

          {/* Botones de acción */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.subscribeButton, isLoading && styles.disabledButton]}
              onPress={handleSubscribe}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.subscribeButtonText}>
                {isLoading ? 'Procesando...' : `Suscribirme por ${SUBSCRIPTION_PLANS[selectedPlan.toUpperCase()].currency} ${SUBSCRIPTION_PLANS[selectedPlan.toUpperCase()].price}/${SUBSCRIPTION_PLANS[selectedPlan.toUpperCase()].period}`}
              </Text>
            </TouchableOpacity>

            {subscription.isTrialActive && trialDaysLeft > 0 && (
              <TouchableOpacity
                style={styles.continueTrialButton}
                onPress={handleContinueWithTrial}
                activeOpacity={0.8}
              >
                <Text style={styles.continueTrialText}>
                  Continuar con prueba gratuita
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Información adicional */}
          <View style={styles.additionalInfo}>
            <Text style={styles.infoText}>
              • Cancela en cualquier momento{"\n"}
              • Renovación automática{"\n"}
              • Soporte 24/7{"\n"}
              • Garantía de satisfacción
            </Text>
          </View>

          {/* Mensaje inspirador */}
          <View style={styles.inspirationalContainer}>
            <Text style={styles.inspirationalText}>
              "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas"
            </Text>
            <Text style={styles.inspirationalReference}>Mateo 6:33</Text>
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
    marginTop: 20,
    marginBottom: 30,
  },
  iconContainer: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 40,
    marginBottom: 20,
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  trialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  trialText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600',
    marginLeft: 8,
  },
  plansContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: Colors.shadow.light,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  selectedPlan: {
    borderColor: Colors.text.primary,
    shadowColor: Colors.shadow.dark,
    shadowOpacity: 0.2,
    elevation: 6,
  },
  savingsBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: Colors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  savingsText: {
    color: Colors.text.light,
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    flex: 1,
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currency: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginRight: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  planDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  radioContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.text.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: Colors.text.primary,
    borderColor: Colors.text.primary,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
    lineHeight: 20,
  },
  actionContainer: {
    marginBottom: 30,
  },
  subscribeButton: {
    backgroundColor: Colors.text.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
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
  disabledButton: {
    opacity: 0.7,
  },
  subscribeButtonText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  continueTrialButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueTrialText: {
    color: Colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  additionalInfo: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
  },
  infoText: {
    fontSize: 12,
    color: Colors.text.secondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  inspirationalContainer: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  inspirationalText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 20,
  },
  inspirationalReference: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
});

export default SubscriptionScreen;