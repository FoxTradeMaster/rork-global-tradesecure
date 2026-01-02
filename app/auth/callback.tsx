import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';
import { AlertCircle } from 'lucide-react-native';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[AuthCallback] Processing auth callback');
    console.log('[AuthCallback] URL params:', params);
    
    const handleCallback = async () => {
      try {
        if (Platform.OS === 'web') {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const errorParam = hashParams.get('error');
          const errorCode = hashParams.get('error_code');
          const errorDescription = hashParams.get('error_description');
          
          console.log('[AuthCallback] Web hash params:', { 
            accessToken: !!accessToken, 
            refreshToken: !!refreshToken,
            error: errorParam,
            errorCode,
            errorDescription
          });
          
          if (errorParam) {
            let message = 'Authentication failed';
            if (errorCode === 'otp_expired') {
              message = 'The magic link has expired. Please request a new one.';
            } else if (errorDescription) {
              message = errorDescription.replace(/\+/g, ' ');
            }
            console.error('[AuthCallback] Auth error:', message);
            setError(message);
            return;
          }
          
          if (accessToken && refreshToken) {
            console.log('[AuthCallback] Setting session from tokens');
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error('[AuthCallback] Error setting session:', error);
              setError(error.message || 'Failed to sign in');
              return;
            }

            if (data.session) {
              console.log('[AuthCallback] Session created, redirecting to home');
              router.replace('/');
              return;
            }
          }
        } else {
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
                setError(error.message || 'Failed to verify magic link');
                return;
              }

              if (data.session) {
                console.log('[AuthCallback] Session created, redirecting to home');
                router.replace('/');
                return;
              }
            }
          }
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthCallback] Error getting session:', error);
          setError(error.message || 'Failed to get session');
          return;
        }

        if (session) {
          console.log('[AuthCallback] Session found, redirecting to home');
          router.replace('/');
        } else {
          console.log('[AuthCallback] No session found, redirecting to login');
          setError('No session found. Please try signing in again.');
        }
      } catch (error: any) {
        console.error('[AuthCallback] Error processing callback:', error);
        setError(error?.message || 'An unexpected error occurred');
      }
    };

    handleCallback();
  }, [router, params]);

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <AlertCircle size={48} color="#EF4444" />
          </View>
          <Text style={styles.errorTitle}>Authentication Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.backButtonText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0EA5E9" />
      <Text style={styles.text}>Signing you in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  text: {
    color: '#64748B',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    alignItems: 'center',
    maxWidth: 400,
  },
  errorIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
