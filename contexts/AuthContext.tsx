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
    
    const projectId = process.env.EXPO_PUBLIC_PROJECT_ID || 'nuw502s5hmgxa8hwzf3sa';
    const redirectUrl = `https://rork.com/p/${projectId}/auth/callback`;
    
    console.log('[AuthContext] Using redirect URL:', redirectUrl, 'Platform:', Platform.OS);
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error('[AuthContext] Error sending magic link:', error);
      throw error;
    }

    console.log('[AuthContext] Magic link sent successfully');
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
