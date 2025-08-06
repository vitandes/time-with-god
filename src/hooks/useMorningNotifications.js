import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MORNING_MESSAGES } from '../constants/Constants';

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const STORAGE_KEYS = {
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  LAST_MESSAGE_INDEX: 'last_message_index',
  LAST_NOTIFICATION_DATE: 'last_notification_date',
  NOTIFICATION_TIME: 'notification_time'
};

export const useMorningNotifications = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [permissionStatus, setPermissionStatus] = useState(null);

  // Inicializar el hook
  useEffect(() => {
    initializeNotifications();
  }, []);

  // Configurar notificaciones cuando cambie el estado
  useEffect(() => {
    if (notificationsEnabled && permissionStatus === 'granted') {
      scheduleDailyNotification();
    } else {
      cancelAllNotifications();
    }
  }, [notificationsEnabled, notificationTime, permissionStatus]);

  const initializeNotifications = async () => {
    try {
      // Cargar configuraciones guardadas
      const savedNotificationsEnabled = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED);
      const savedNotificationTime = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_TIME);
      
      if (savedNotificationsEnabled !== null) {
        setNotificationsEnabled(JSON.parse(savedNotificationsEnabled));
      }
      
      if (savedNotificationTime) {
        setNotificationTime(savedNotificationTime);
      }

      // Solicitar permisos
      await requestPermissions();
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      setPermissionStatus(finalStatus);
      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  };

  const getNextMessageIndex = async () => {
    try {
      const lastIndex = await AsyncStorage.getItem(STORAGE_KEYS.LAST_MESSAGE_INDEX);
      const currentIndex = lastIndex ? parseInt(lastIndex, 10) : -1;
      const nextIndex = (currentIndex + 1) % MORNING_MESSAGES.length;
      
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_MESSAGE_INDEX, nextIndex.toString());
      return nextIndex;
    } catch (error) {
      console.error('Error getting next message index:', error);
      return 0;
    }
  };

  const scheduleDailyNotification = async () => {
    try {
      // Cancelar notificaciones existentes
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      if (!notificationsEnabled || permissionStatus !== 'granted') {
        return;
      }

      // Obtener el siguiente mensaje
      const messageIndex = await getNextMessageIndex();
      const morningMessage = MORNING_MESSAGES[messageIndex];
      
      // Parsear la hora de notificación
      const [hours, minutes] = notificationTime.split(':').map(Number);
      
      // Crear la fecha para la próxima notificación
      const now = new Date();
      const scheduledDate = new Date();
      scheduledDate.setHours(hours, minutes, 0, 0);
      
      // Si la hora ya pasó hoy, programar para mañana
      if (scheduledDate <= now) {
        scheduledDate.setDate(scheduledDate.getDate() + 1);
      }

      // Programar la notificación
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌅 Buenos días, hijo de Dios',
          body: morningMessage.message,
          data: {
            messageId: morningMessage.id,
            verse: morningMessage.verse,
            type: 'morning_message'
          },
          sound: true,
        },
        trigger: {
          date: scheduledDate,
          repeats: true,
          type: Notifications.SchedulableTriggerInputTypes.DATE,
        },
      });

      console.log('Morning notification scheduled for:', scheduledDate.toLocaleString());
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling notifications:', error);
    }
  };

  const toggleNotifications = async (enabled) => {
    try {
      setNotificationsEnabled(enabled);
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, JSON.stringify(enabled));
      
      if (enabled && permissionStatus !== 'granted') {
        const granted = await requestPermissions();
        if (!granted) {
          setNotificationsEnabled(false);
          await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, JSON.stringify(false));
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error toggling notifications:', error);
      return false;
    }
  };

  const updateNotificationTime = async (time) => {
    try {
      setNotificationTime(time);
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_TIME, time);
    } catch (error) {
      console.error('Error updating notification time:', error);
    }
  };



  return {
    notificationsEnabled,
    notificationTime,
    permissionStatus,
    toggleNotifications,
    updateNotificationTime,
    requestPermissions,
    scheduleDailyNotification
  };
};

export default useMorningNotifications;