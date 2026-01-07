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
        console.error('[AuthContext] Error sending OTP:', error);
        
        if (error.message.includes('fetch') || error.message.includes('network')) {
          throw new Error('Unable to connect. Please check your internet connection.');
        }
        
        throw new Error(error.message || 'Failed to send code. Please try again.');
      }

      console.log('[AuthContext] OTP code sent successfully');
      return data;
    } catch (error: any) {
      console.error('[AuthContext] Caught error:', error);
      throw error;
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
        
        if (error.message.includes('Token has expired')) {
          throw new Error('Code has expired. Please request a new one.');
        }
        
        if (error.message.includes('Invalid') || error.message.includes('invalid')) {
          throw new Error('Invalid code. Please check and try again.');
        }
        
        throw new Error(error.message || 'Verification failed. Please try again.');
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
      throw error;
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
