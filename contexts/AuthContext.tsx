import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
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

  const signInWithEmail = async (email: string) => {
    console.log('[AuthContext] Sending magic link to:', email);
    
    try {
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('[AuthContext] Missing Supabase credentials');
        throw new Error('Authentication service is not configured. Please contact support.');
      }
      
      if (!supabaseUrl.includes('supabase')) {
        console.error('[AuthContext] Invalid Supabase URL:', supabaseUrl);
        throw new Error('Authentication service configuration is invalid. Please contact support.');
      }
      
      console.log('[AuthContext] Supabase URL:', supabaseUrl);
      
      let redirectUrl: string;
      
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          redirectUrl = `${window.location.origin}/auth/callback`;
        } else {
          throw new Error('Cannot determine redirect URL. Please try again.');
        }
      } else {
        redirectUrl = 'rork-app://auth/callback';
      }
      
      console.log('[AuthContext] Using redirect URL:', redirectUrl, 'Platform:', Platform.OS);
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('[AuthContext] Supabase error:', error);
        console.error('[AuthContext] Error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        
        if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to authentication service. Please check your internet connection and try again.');
        }
        
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account first.');
        }
        
        throw new Error(error.message || 'Failed to send magic link. Please try again.');
      }

      console.log('[AuthContext] Magic link sent successfully:', data);
    } catch (error: any) {
      console.error('[AuthContext] Caught error:', error);
      
      if (error.message && (error.message.includes('connect') || error.message.includes('service'))) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to reach authentication service. Please check your connection.');
      }
      
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
    signInWithEmail,
    signOut,
    isAuthenticated: !!session,
  };
});
