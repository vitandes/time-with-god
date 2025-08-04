import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

import { useAuth } from '../context/AuthContext';
import { SUBSCRIPTION_PLANS } from '../constants/Constants';
import Colors from '../constants/Colors';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateSubscription } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');
  
  // Animaciones
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(30);

  React.useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 800 });
    slideUp.value = withTiming(0, { duration: 600 });
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar sesión', 
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const handleSubscriptionManagement = () => {
    Alert.alert(
      'Gestionar suscripción',
      'Serás redirigido a la tienda de aplicaciones para gestionar tu suscripción.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: () => console.log('Redirect to store') }
      ]
    );
  };

  const handleUpgradeSubscription = () => {
    navigation.navigate('Subscription');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta acción no se puede deshacer. Se eliminarán todos tus datos y progreso.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Cuenta eliminada',
              'Tu cuenta ha sido eliminada exitosamente.',
              [{ text: 'OK', onPress: logout }]
            );
          }
        }
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contactar soporte',
      'Puedes contactarnos en: soporte@tiempoconDios.com',
      [{ text: 'OK' }]
    );
  };

  const getSubscriptionStatus = () => {
    if (user?.subscription?.isActive) {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === user.subscription.planId);
      return {
        status: 'Activa',
        plan: plan?.name || 'Plan Premium',
        color: Colors.plant.healthy,
        icon: 'checkmark-circle'
      };
    } else if (user?.subscription?.isTrialActive) {
      return {
        status: 'Prueba gratuita',
        plan: `${user.subscription.trialDaysLeft} días restantes`,
        color: Colors.accent,
        icon: 'time'
      };
    } else {
      return {
        status: 'Inactiva',
        plan: 'Actualizar para acceder',
        color: Colors.plant.withering,
        icon: 'alert-circle'
      };
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeIn.value,
      transform: [{ translateY: slideUp.value }],
    };
  });

  const subscriptionStatus = getSubscriptionStatus();

  const menuSections = [
    {
      title: 'Cuenta',
      items: [
        {
          icon: 'person',
          title: 'Información personal',
          subtitle: user?.email || 'usuario@ejemplo.com',
          onPress: () => Alert.alert('Información', 'Funcionalidad en desarrollo')
        },
        {
          icon: subscriptionStatus.icon,
          title: 'Suscripción',
          subtitle: `${subscriptionStatus.status} • ${subscriptionStatus.plan}`,
          color: subscriptionStatus.color,
          onPress: user?.subscription?.isActive ? handleSubscriptionManagement : handleUpgradeSubscription
        }
      ]
    },
    {
      title: 'Configuración',
      items: [
        {
          icon: 'notifications',
          title: 'Notificaciones',
          subtitle: 'Recordatorios diarios',
          rightComponent: (
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.secondary, true: Colors.primary }}
              thumbColor={notifications ? Colors.text.light : Colors.text.secondary}
            />
          )
        },
        {
          icon: 'musical-notes',
          title: 'Música por defecto',
          subtitle: musicEnabled ? 'Activada' : 'Desactivada',
          rightComponent: (
            <Switch
              value={musicEnabled}
              onValueChange={setMusicEnabled}
              trackColor={{ false: Colors.secondary, true: Colors.primary }}
              thumbColor={musicEnabled ? Colors.text.light : Colors.text.secondary}
            />
          )
        },
        {
          icon: 'time',
          title: 'Recordatorio diario',
          subtitle: `${reminderTime} cada día`,
          onPress: () => Alert.alert('Recordatorio', 'Configuración de hora en desarrollo')
        }
      ]
    },
    {
      title: 'Soporte',
      items: [
        {
          icon: 'help-circle',
          title: 'Centro de ayuda',
          subtitle: 'Preguntas frecuentes',
          onPress: () => Alert.alert('Ayuda', 'Centro de ayuda en desarrollo')
        },
        {
          icon: 'mail',
          title: 'Contactar soporte',
          subtitle: 'Envíanos un mensaje',
          onPress: handleContactSupport
        },
        {
          icon: 'star',
          title: 'Calificar la app',
          subtitle: 'Comparte tu experiencia',
          onPress: () => Alert.alert('Calificación', 'Redirección a tienda en desarrollo')
        }
      ]
    },
    {
      title: 'Legal',
      items: [
        {
          icon: 'document-text',
          title: 'Términos de servicio',
          onPress: () => Alert.alert('Términos', 'Términos de servicio en desarrollo')
        },
        {
          icon: 'shield-checkmark',
          title: 'Política de privacidad',
          onPress: () => Alert.alert('Privacidad', 'Política de privacidad en desarrollo')
        }
      ]
    },
    {
      title: 'Zona peligrosa',
      items: [
        {
          icon: 'log-out',
          title: 'Cerrar sesión',
          color: Colors.plant.withering,
          onPress: handleLogout
        },
        {
          icon: 'trash',
          title: 'Eliminar cuenta',
          color: Colors.plant.withering,
          onPress: handleDeleteAccount
        }
      ]
    }
  ];

  return (
    <LinearGradient
      colors={Colors.gradients.primary}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.profileInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color={Colors.text.light} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
                <Text style={styles.userEmail}>{user?.email || 'usuario@ejemplo.com'}</Text>
              </View>
            </View>
            
            {/* Estadísticas rápidas */}
            <View style={styles.quickStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user?.totalSessions || 0}</Text>
                <Text style={styles.statLabel}>Sesiones</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user?.totalMinutes || 0}</Text>
                <Text style={styles.statLabel}>Minutos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user?.currentStreak || 0}</Text>
                <Text style={styles.statLabel}>Días seguidos</Text>
              </View>
            </View>
          </View>

          <Animated.View style={animatedStyle}>
            {/* Menú de opciones */}
            {menuSections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.sectionContent}>
                  {section.items.map((item, itemIndex) => (
                    <TouchableOpacity
                      key={itemIndex}
                      style={[
                        styles.menuItem,
                        itemIndex === section.items.length - 1 && styles.menuItemLast
                      ]}
                      onPress={item.onPress}
                    >
                      <View style={styles.menuItemLeft}>
                        <Ionicons 
                          name={item.icon} 
                          size={20} 
                          color={item.color || Colors.text.primary} 
                        />
                        <View style={styles.menuItemText}>
                          <Text style={[
                            styles.menuItemTitle,
                            item.color && { color: item.color }
                          ]}>
                            {item.title}
                          </Text>
                          {item.subtitle && (
                            <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                          )}
                        </View>
                      </View>
                      
                      {item.rightComponent || (
                        <Ionicons 
                          name="chevron-forward" 
                          size={16} 
                          color={Colors.text.secondary} 
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            {/* Información de la app */}
            <View style={styles.appInfo}>
              <Text style={styles.appVersion}>Tiempo con Dios v1.0.0</Text>
              <Text style={styles.appDescription}>
                Desarrollado con amor para tu crecimiento espiritual
              </Text>
            </View>
          </Animated.View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.text.light,
    opacity: 0.8,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.light,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.light,
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  appVersion: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ProfileScreen;