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
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

import { useAuth } from '../context/AuthContext';
import { useSessionHistory } from '../hooks/useSessionHistory';
import { useMorningNotifications } from '../hooks/useMorningNotifications';
import { SUBSCRIPTION_PLANS } from '../constants/Constants';
import Colors from '../constants/Colors';

const ProfileScreen = ({ navigation }) => {
  const { t } = useTranslation(['app', 'common']);
  const { user, logout, updateSubscription } = useAuth();
  const { getStats } = useSessionHistory();
  const {
    notificationsEnabled,
    notificationTime,
    permissionStatus,
    toggleNotifications,
    updateNotificationTime
  } = useMorningNotifications();
  
  // Obtener estadísticas dinámicas totales
  const allTimeStats = getStats('year'); // Usar 'year' para obtener todas las estadísticas
  const [musicEnabled, setMusicEnabled] = useState(true);
  
  // Animaciones
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(30);

  React.useEffect(() => {
    fadeIn.value = withTiming(1, { duration: 800 });
    slideUp.value = withTiming(0, { duration: 600 });
  }, []);

  const handleLogout = () => {
    Alert.alert(
      t('app:profile.alerts.logout.title'),
      t('app:profile.alerts.logout.message'),
      [
        { text: t('app:profile.alerts.logout.cancel'), style: 'cancel' },
        { 
          text: t('app:profile.alerts.logout.confirm'), 
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const handleSubscriptionManagement = () => {
    Alert.alert(
      t('app:profile.alerts.subscription.title'),
      t('app:profile.alerts.subscription.message'),
      [
        { text: t('common:cancel'), style: 'cancel' },
        { text: t('app:profile.alerts.subscription.continue'), onPress: () => console.log('Redirect to store') }
      ]
    );
  };

  const handleUpgradeSubscription = () => {
    navigation.navigate('Subscription');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('app:profile.alerts.deleteAccount.title'),
      t('app:profile.alerts.deleteAccount.message'),
      [
        { text: t('app:profile.alerts.deleteAccount.cancel'), style: 'cancel' },
        { 
          text: t('app:profile.alerts.deleteAccount.confirm'), 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              t('app:profile.alerts.deleteAccount.success.title'),
              t('app:profile.alerts.deleteAccount.success.message'),
              [{ text: t('common:ok'), onPress: logout }]
            );
          }
        }
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      t('app:profile.alerts.contactSupport.title'),
      t('app:profile.alerts.contactSupport.message'),
      [{ text: t('common:ok') }]
    );
  };

  const handleNotificationToggle = async (enabled) => {
    const success = await toggleNotifications(enabled);
    if (!success && enabled) {
      Alert.alert(
        t('app:profile.alerts.notifications.title'),
        t('app:profile.alerts.notifications.message'),
        [{ text: t('common:ok') }]
      );
    }
  };

  const handleTimeChange = () => {
    Alert.alert(
      t('app:profile.alerts.timeConfig.title'),
      t('app:profile.alerts.timeConfig.message'),
      [
        { text: t('app:profile.alerts.timeConfig.cancel'), style: 'cancel' },
        {
          text: t('app:profile.alerts.timeConfig.times.8am'),
          onPress: () => updateNotificationTime('08:00')
        },
        {
          text: t('app:profile.alerts.timeConfig.times.9am'),
          onPress: () => updateNotificationTime('09:00')
        },
        {
          text: t('app:profile.alerts.timeConfig.times.10am'),
          onPress: () => updateNotificationTime('10:00')
        }
      ]
    );
  };



  const getNotificationSubtitle = () => {
    if (!notificationsEnabled) return t('app:profile.notifications.disabled');
    if (permissionStatus !== 'granted') return t('app:profile.notifications.permissionsRequired');
    return `${t('app:profile.notifications.enabled')} ${notificationTime}`;
  };

  const getSubscriptionStatus = () => {
    if (user?.subscription?.isActive) {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === user.subscription.planId);
      return {
        status: t('app:profile.subscription.active'),
        plan: plan?.name || 'Plan Premium',
        color: Colors.plant.healthy,
        icon: 'checkmark-circle'
      };
    } else if (user?.subscription?.isTrialActive) {
      return {
        status: t('app:profile.subscription.trial'),
        plan: `${user.subscription.trialDaysLeft} ${t('app:profile.subscription.daysLeft')}`,
        color: Colors.accent,
        icon: 'time'
      };
    } else {
      return {
        status: t('app:profile.subscription.inactive'),
        plan: t('app:profile.subscription.upgradeAccess'),
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
        title: t('app:profile.settings'),
        items: [
          {
            icon: 'musical-notes',
            title: t('app:profile.music.title'),
            subtitle: t('app:profile.music.subtitle'),
            onPress: () => {}
          },
          {
            icon: 'language',
            title: t('app:profile.language'),
            subtitle: t('app:profile.languageSubtitle'),
            rightComponent: <LanguageSwitcher />
          }
        ]
      },
    {
      title: t('app:profile.subscription.title'),
      items: [
        {
          icon: subscriptionStatus.icon,
          title: t('app:profile.subscription.manage'),
          subtitle: `${subscriptionStatus.status} - ${subscriptionStatus.plan}`,
          color: subscriptionStatus.color,
          onPress: handleSubscriptionManagement
        }
      ]
    },
    {
      title: t('app:profile.appInfo.title'),
      items: [
        {
          icon: 'help-circle',
          title: t('app:profile.appInfo.helpCenter'),
          onPress: () => {}
        },
        {
          icon: 'mail',
          title: t('app:profile.appInfo.contactSupport'),
          onPress: handleContactSupport
        },
        {
          icon: 'star',
          title: t('app:profile.appInfo.rateApp'),
          onPress: () => {}
        },
        {
          icon: 'document-text',
          title: t('app:profile.appInfo.legal'),
          onPress: () => {}
        }
      ]
    },
    {
      title: t('app:profile.account'),
      items: [
        {
          icon: 'log-out',
          title: t('app:profile.logout'),
          color: Colors.plant.withering,
          onPress: handleLogout
        },
        {
          icon: 'trash',
          title: t('app:profile.deleteAccount'),
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
                <Text style={styles.statNumber}>{allTimeStats.totalSessions}</Text>
                <Text style={styles.statLabel}>{t('app:profile.stats.totalSessions')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{allTimeStats.totalMinutes}</Text>
                <Text style={styles.statLabel}>{t('app:profile.stats.totalMinutes')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{allTimeStats.streak}</Text>
                <Text style={styles.statLabel}>{t('app:profile.stats.currentStreak')}</Text>
              </View>
            </View>
          </View>

          <Animated.View style={animatedStyle}>
            {/* Menú de opciones */}
            {menuSections && menuSections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.sectionContent}>
                  {section.items && section.items.map((item, itemIndex) => (
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
              <Text style={styles.appVersion}>{t('app:profile.appInfo.version')}</Text>
              <Text style={styles.appDescription}>
                {t('app:profile.appInfo.description')}
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
    textAlign: 'center',
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