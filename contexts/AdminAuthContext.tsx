import { useState, useCallback, useEffect } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_SESSION_KEY = '@admin_session';
const ADMIN_PASSWORD_KEY = '@admin_custom_password';
const SESSION_DURATION = 30 * 60 * 1000;

interface AdminAuthState {
  isAuthenticated: boolean;
  authenticate: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  setNewPassword: (newPassword: string) => Promise<void>;
  hasCustomPassword: boolean;
}

export const [AdminAuthProvider, useAdminAuth] = createContextHook<AdminAuthState>(() => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasCustomPassword, setHasCustomPassword] = useState<boolean>(false);

  const checkSession = useCallback(async () => {
    try {
      const customPassword = await AsyncStorage.getItem(ADMIN_PASSWORD_KEY);
      setHasCustomPassword(!!customPassword);
      
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

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const authenticate = useCallback(async (password: string): Promise<boolean> => {
    const inputPassword = password.trim();
    
    const customPassword = await AsyncStorage.getItem(ADMIN_PASSWORD_KEY);
    const adminPassword = customPassword || (process.env.EXPO_PUBLIC_ADMIN_PASSWORD || 'admin123').trim();
    
    console.log('Authenticating...');
    console.log('Using custom password:', !!customPassword);
    console.log('Passwords match:', inputPassword === adminPassword);
    
    if (inputPassword === adminPassword) {
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

  const setNewPassword = useCallback(async (newPassword: string) => {
    try {
      await AsyncStorage.setItem(ADMIN_PASSWORD_KEY, newPassword.trim());
      setHasCustomPassword(true);
      console.log('New password saved successfully');
    } catch (error) {
      console.error('Failed to save new password:', error);
      throw error;
    }
  }, []);

  return {
    isAuthenticated,
    authenticate,
    logout,
    checkSession,
    setNewPassword,
    hasCustomPassword,
  };
});
