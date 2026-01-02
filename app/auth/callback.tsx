import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';
import { AlertCircle } from 'lucide-react-native';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  const hasProcessed = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    console.log('[AuthCallback] Processing auth callback');
    
    const handleCallback = async () => {
      if (hasProcessed.current) {
        console.log('[AuthCallback] Already processed, skipping');
        return;
      }
      hasProcessed.current = true;

      timeoutRef.current = setTimeout(() => {
        console.error('[AuthCallback] Timeout - auth took too long');
        setIsProcessing(false);
        setError('Authentication is taking too long. Please try again.');
      }, 30000);

      try {
        if (Platform.OS === 'web') {
          const queryParams = new URLSearchParams(window.location.search);
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          
          const tokenFromQuery = queryParams.get('token');
          const typeFromQuery = queryParams.get('type');
          const errorParam = queryParams.get('error') || hashParams.get('error');
          const errorCode = queryParams.get('error_code') || hashParams.get('error_code');
          const errorDescription = queryParams.get('error_description') || hashParams.get('error_description');
          
          console.log('[AuthCallback] Web params:', { 
            tokenFromQuery: !!tokenFromQuery,
            typeFromQuery,
            error: errorParam,
            errorCode,
            errorDescription,
            url: window.location.href
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
          
          if (tokenFromQuery && typeFromQuery) {
            const isMobileWeb = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobileWeb) {
              const deepLink = `rork-app://auth/callback?token=${tokenFromQuery}&type=${typeFromQuery}`;
              console.log('[AuthCallback] Mobile web detected, redirecting to app');
              
              window.location.href = deepLink;
              
              setTimeout(() => {
                setIsProcessing(false);
                setError('If the app did not open, please copy the link from your email and open it directly in the app');
              }, 2000);
              return;
            }
            
            console.log('[AuthCallback] Verifying OTP from magic link');
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: tokenFromQuery,
              type: typeFromQuery as any,
            });

            if (error) {
              console.error('[AuthCallback] Error verifying OTP:', error);
              setError(error.message || 'Failed to verify magic link');
              return;
            }

            if (data.session) {
              console.log('[AuthCallback] Session created, redirecting to home');
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              router.replace('/');
              return;
            } else {
              console.error('[AuthCallback] OTP verified but no session created');
              setError('Authentication failed. Please try again.');
              return;
            }
          }
          
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
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
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              router.replace('/');
              return;
            }
          }
        } else {
          const processUrl = async (url: string) => {
            console.log('[AuthCallback] Processing URL:', url);
            if (!url) {
              console.error('[AuthCallback] Empty URL received');
              return;
            }
            
            const hashIndex = url.indexOf('#');
            let accessToken: string | null = null;
            let refreshToken: string | null = null;
            
            if (hashIndex !== -1) {
              const hashPart = url.substring(hashIndex + 1);
              const hashParams = new URLSearchParams(hashPart);
              accessToken = hashParams.get('access_token');
              refreshToken = hashParams.get('refresh_token');
              
              console.log('[AuthCallback] Hash params:', { 
                hasAccessToken: !!accessToken, 
                hasRefreshToken: !!refreshToken 
              });
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
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                router.replace('/');
                return;
              }
            }
            
            const { queryParams } = Linking.parse(url);
            console.log('[AuthCallback] Query params from URL:', queryParams);
            
            if (queryParams?.error) {
              let message = 'Authentication failed';
              if (queryParams.error_code === 'otp_expired') {
                message = 'The magic link has expired. Please request a new one.';
              } else if (queryParams.error_description) {
                message = String(queryParams.error_description).replace(/\+/g, ' ');
              }
              console.error('[AuthCallback] Auth error:', message);
              setError(message);
              return;
            }
            
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
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                router.replace('/');
                return;
              } else {
                console.error('[AuthCallback] OTP verified but no session created');
                setError('Authentication failed. Please try again.');
              }
            } else if (!accessToken && !refreshToken) {
              console.error('[AuthCallback] No tokens or OTP parameters found');
              setError('Invalid authentication link. Please try signing in again.');
            }
          };

          const initialUrl = await Linking.getInitialURL();
          console.log('[AuthCallback] Initial URL:', initialUrl);

          if (initialUrl && initialUrl.includes('auth/callback')) {
            await processUrl(initialUrl);
          } else {
            console.log('[AuthCallback] No initial URL or not callback URL, setting up listener');
            
            const subscription = Linking.addEventListener('url', async ({ url }) => {
              console.log('[AuthCallback] Received URL event:', url);
              if (url.includes('auth/callback')) {
                await processUrl(url);
                subscription.remove();
              }
            });

            setTimeout(() => {
              subscription.remove();
              if (hasProcessed.current && !error) {
                console.log('[AuthCallback] Listener timeout, checking session');
              } else {
                console.error('[AuthCallback] No auth callback received within timeout');
                setError('Did not receive authentication response. Please try again.');
              }
            }, 15000);
          }
          return;
        }
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthCallback] Error getting session:', error);
          setError(error.message || 'Failed to get session');
          return;
        }

        if (session) {
          console.log('[AuthCallback] Session found, redirecting to home');
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          router.replace('/');
        } else {
          console.log('[AuthCallback] No session found');
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setError('No session found. Please try signing in again.');
        }
      } catch (error: any) {
        console.error('[AuthCallback] Error processing callback:', error);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsProcessing(false);
        setError(error?.message || 'An unexpected error occurred');
      }
    };

    const cleanup = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    handleCallback();

    return cleanup;
  }, [router]);

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
            onPress={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              router.replace('/login');
            }}
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
      {!isProcessing && (
        <TouchableOpacity 
          style={[styles.backButton, { marginTop: 32 }]}
          onPress={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            router.replace('/login');
          }}
        >
          <Text style={styles.backButtonText}>Back to Sign In</Text>
        </TouchableOpacity>
      )}
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
