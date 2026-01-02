import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    console.log('[AuthCallback] Processing auth callback');
    console.log('[AuthCallback] URL params:', params);
    
    const handleCallback = async () => {
      try {
        const url = await Linking.getInitialURL();
        console.log('[AuthCallback] Initial URL:', url);

        if (url) {
          const { queryParams } = Linking.parse(url);
          console.log('[AuthCallback] Query params from URL:', queryParams);
          
          const tokenHash = queryParams?.token_hash || queryParams?.token;
          const type = queryParams?.type;
          
          if (tokenHash && type) {
            console.log('[AuthCallback] Verifying OTP token');
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: tokenHash as string,
              type: type as any,
            });

            if (error) {
              console.error('[AuthCallback] Error verifying OTP:', error);
              router.replace('/login');
              return;
            }

            if (data.session) {
              console.log('[AuthCallback] Session created, redirecting to home');
              router.replace('/');
              return;
            }
          }
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthCallback] Error getting session:', error);
          router.replace('/login');
          return;
        }

        if (session) {
          console.log('[AuthCallback] Session found, redirecting to home');
          router.replace('/');
        } else {
          console.log('[AuthCallback] No session found, redirecting to login');
          router.replace('/login');
        }
      } catch (error) {
        console.error('[AuthCallback] Error processing callback:', error);
        router.replace('/login');
      }
    };

    handleCallback();
  }, [router, params]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text style={styles.text}>Signing you in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  text: {
    color: '#9CA3AF',
    fontSize: 16,
  },
});
