import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    console.log('[AuthCallback] Processing auth callback');
    
    const handleCallback = async () => {
      try {
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
  }, [router]);

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
