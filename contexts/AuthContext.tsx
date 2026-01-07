import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('[AuthContext] Initializing auth state');
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[AuthContext] Initial session:', session ? 'Found' : 'None');
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('[AuthContext] Auth state changed:', _event);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const sendOtpCode = async (email: string) => {
    console.log('[AuthContext] Sending OTP code to:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        console.error('[AuthContext] Error sending OTP:', {
          message: error.message,
          status: error.status,
          name: error.name,
          full: error,
        });
        
        if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        
        if (error.message.includes('SMTP') || error.message.includes('mail') || error.message.includes('email provider') || error.message.includes('Email rate limit exceeded')) {
          throw new Error('Error sending magic link email. The email service is currently unavailable. Please contact support@foxtrademaster.com for assistance.');
        }
        
        if (error.message.includes('rate limit') || error.status === 429) {
          throw new Error('Too many attempts. Please wait a few minutes before trying again.');
        }
        
        if (error.message.includes('Invalid email') || error.message.includes('valid email')) {
          throw new Error('Please enter a valid email address.');
        }
        
        if (error.status === 500 || error.status === 503) {
          throw new Error('Server error. Our team has been notified. Please try again in a few minutes.');
        }
        
        throw new Error(error.message || 'Unable to send code. Please try again or contact support@foxtrademaster.com.');
      }

      console.log('[AuthContext] OTP code sent successfully', data);
      return data;
    } catch (error: any) {
      console.error('[AuthContext] Caught error:', error);
      if (error.message) {
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again or contact support@foxtrademaster.com.');
    }
  };

  const verifyOtpCode = async (email: string, token: string) => {
    console.log('[AuthContext] Verifying OTP code for:', email);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) {
        console.error('[AuthContext] Error verifying OTP:', error);
        
        if (error.message.includes('Token has expired') || error.message.includes('expired')) {
          throw new Error('Verification code has expired. Please request a new code.');
        }
        
        if (error.message.includes('Invalid') || error.message.includes('invalid') || error.message.includes('not found')) {
          throw new Error('Invalid verification code. Please check your code and try again.');
        }
        
        if (error.message.includes('Too many') || error.message.includes('rate limit')) {
          throw new Error('Too many verification attempts. Please wait a few minutes.');
        }
        
        if (error.message.includes('fetch') || error.message.includes('network')) {
          throw new Error('Network error. Please check your connection and try again.');
        }
        
        throw new Error(error.message || 'Verification failed. Please try again or request a new code.');
      }

      console.log('[AuthContext] OTP verified successfully');
      
      const user = data?.user;
      const isConfirmed = !!(user?.email_confirmed_at || user?.confirmed_at);
      
      if (!isConfirmed) {
        console.log('[AuthContext] Email not confirmed yet');
        return { needsConfirmation: true, user };
      }
      
      return { needsConfirmation: false, user };
    } catch (error: any) {
      console.error('[AuthContext] Caught error:', error);
      if (error.message) {
        throw error;
      }
      throw new Error('Verification failed. Please try again.');
    }
  };

  const signOut = async () => {
    console.log('[AuthContext] Signing out');
    await AsyncStorage.removeItem('current_user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[AuthContext] Error signing out:', error);
      throw error;
    }
  };

  return {
    session,
    user,
    isLoading,
    sendOtpCode,
    verifyOtpCode,
    signOut,
    isAuthenticated: !!session,
  };
});
