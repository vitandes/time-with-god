import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@session_history';

export const useSessionHistory = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const storedSessions = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedSessions) {
        setSessions(JSON.parse(storedSessions));
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const addSession = async (sessionData) => {
    try {
      const newSession = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        duration: sessionData.duration,
        mood: sessionData.mood,
        note: sessionData.note,
        completed: true,
        ...sessionData
      };

      const updatedSessions = [newSession, ...sessions];
      setSessions(updatedSessions);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));

      return newSession;
    } catch (error) {
      console.error('Error adding session:', error);
      throw error;
    }
  };

  const getSessionsByPeriod = useCallback((period) => {
    const now = new Date();
    const filteredSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date);

      if (period === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return sessionDate >= weekAgo;
      } else if (period === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return sessionDate >= monthAgo;
      }

      return true;
    });

    return filteredSessions;
  }, [sessions]);

  const getStats = useCallback((period) => {
    const periodSessions = getSessionsByPeriod(period);

    const totalMinutes = periodSessions.reduce((sum, session) => sum + session.duration, 0);
    const totalSessions = periodSessions.length;

    // Calcular racha actual
    const today = new Date();
    let streak = 0;

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const hasSessionThisDay = sessions.some(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= dayStart && sessionDate < dayEnd;
      });

      if (hasSessionThisDay) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      totalMinutes,
      totalSessions,
      streak,
      sessions: periodSessions
    };
  }, [sessions, getSessionsByPeriod]);

  return {
    sessions,
    addSession,
    getSessionsByPeriod,
    getStats,
    loadSessions
  };
};

export default useSessionHistory;