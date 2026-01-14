import { useState, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_SESSION_KEY = '@admin_session';
const SESSION_DURATION = 30 * 60 * 1000;

interface AdminAuthState {
  isAuthenticated: boolean;
  authenticate: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const [AdminAuthProvider, useAdminAuth] = createContextHook<AdminAuthState>(() => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkSession = useCallback(async () => {
    try {
      const sessionData = await AsyncStorage.getItem(ADMIN_SESSION_KEY);
      if (sessionData) {
        const { timestamp } = JSON.parse(sessionData);
        const now = Date.now();
        if (now - timestamp < SESSION_DURATION) {
          setIsAuthenticated(true);
        } else {
          await AsyncStorage.removeItem(ADMIN_SESSION_KEY);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Failed to check admin session:', error);
      setIsAuthenticated(false);
    }
  }, []);

  const authenticate = useCallback(async (password: string): Promise<boolean> => {
    const adminPassword = process.env.EXPO_PUBLIC_ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      try {
        await AsyncStorage.setItem(
          ADMIN_SESSION_KEY,
          JSON.stringify({ timestamp: Date.now() })
        );
      } catch (error) {
        console.error('Failed to save admin session:', error);
      }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    setIsAuthenticated(false);
    try {
      await AsyncStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear admin session:', error);
    }
  }, []);

  return {
    isAuthenticated,
    authenticate,
    logout,
    checkSession,
  };
});
