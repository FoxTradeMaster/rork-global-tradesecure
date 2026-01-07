import { View, Text, StyleSheet, TouchableOpacity, StatusBar, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

type Screen = 'email' | 'code' | 'confirm-required';

export default function LoginScreen() {
  const [screen, setScreen] = useState<Screen>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const { sendOtpCode, verifyOtpCode, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const codeInputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendCode = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address (e.g., user@example.com)');
      return;
    }

    setIsLoading(true);
    try {
      await sendOtpCode(email.trim().toLowerCase());
      setSuccessMessage('Code sent successfully! Check your email.');
      setTimeout(() => {
        setScreen('code');
        setResendTimer(60);
        setSuccessMessage('');
        setTimeout(() => codeInputRefs.current[0]?.focus(), 100);
      }, 1000);
    } catch (error: any) {
      console.error('[Login] Error sending code:', {
        message: error?.message || 'Unknown error',
        name: error?.name,
        email: email.trim().toLowerCase(),
      });
      
      const errorMsg = error?.message || 'Unable to send verification code. Please check your email address and try again.';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);
    try {
      await sendOtpCode(email.trim().toLowerCase());
      setCode(['', '', '', '', '', '']);
      setResendTimer(60);
      setSuccessMessage('New code sent! Check your email.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('[Login] Error resending code:', {
        message: error?.message || 'Unknown error',
        email: email.trim().toLowerCase(),
      });
      setErrorMessage(error?.message || 'Failed to resend verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      const codes = text.split('').slice(0, 6);
      const newCode = [...code];
      codes.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);
      
      const nextIndex = Math.min(index + codes.length, 5);
      codeInputRefs.current[nextIndex]?.focus();
      
      if (newCode.every(c => c !== '')) {
        handleVerifyCode(newCode.join(''));
      }
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(c => c !== '')) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (codeString: string) => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);
    try {
      const result = await verifyOtpCode(email.trim().toLowerCase(), codeString);
      
      if (result.needsConfirmation) {
        setScreen('confirm-required');
      }
    } catch (error: any) {
      console.error('[Login] Verification error:', {
        message: error?.message || 'Unknown error',
        code: codeString,
        email: email.trim().toLowerCase(),
      });
      
      const errorMsg = error?.message || 'Invalid or expired verification code. Please request a new code.';
      setErrorMessage(errorMsg);
      setCode(['', '', '', '', '', '']);
      codeInputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  if (screen === 'confirm-required') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.content}>
          <View style={styles.confirmContainer}>
            <View style={styles.warningIcon}>
              <Mail size={48} color="#F59E0B" />
            </View>
            <Text style={styles.successTitle}>Confirm your email</Text>
            <Text style={styles.successMessage}>
              To finish setting up your account, please confirm your email address.
            </Text>
            <Text style={styles.instructions}>
              We sent a confirmation email to{' '}
              <Text style={styles.emailText}>{email}</Text>.
              Click the link in that email to activate your account.
            </Text>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => {
                setScreen('email');
                setEmail('');
                setCode(['', '', '', '', '', '']);
              }}
            >
              <Text style={styles.primaryButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (screen === 'code') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              setScreen('email');
              setCode(['', '', '', '', '', '']);
              setErrorMessage('');
              setSuccessMessage('');
            }}
          >
            <ArrowLeft size={24} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Image
              source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/n6j4k8rpzw1ut8oqfu5do' }}
              style={styles.logo}
              contentFit="contain"
            />
            <Text style={styles.title}>Enter verification code</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit code to{' '}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
          </View>

          <View style={styles.form}>
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={20} color="#EF4444" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}
            
            {successMessage ? (
              <View style={styles.successBanner}>
                <CheckCircle2 size={20} color="#10B981" />
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => { codeInputRefs.current[index] = ref; }}
                  style={[styles.codeInput, digit && styles.codeInputFilled]}
                  value={digit}
                  onChangeText={text => handleCodeChange(text, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  editable={!isLoading}
                />
              ))}
            </View>

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#0EA5E9" />
                <Text style={styles.loadingText}>Verifying...</Text>
              </View>
            )}

            <TouchableOpacity 
              style={[styles.resendButton, resendTimer > 0 && styles.resendButtonDisabled]}
              onPress={handleResendCode}
              disabled={resendTimer > 0 || isLoading}
            >
              <Text style={[styles.resendButtonText, resendTimer > 0 && styles.resendButtonTextDisabled]}>
                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/n6j4k8rpzw1ut8oqfu5do' }}
            style={styles.logo}
            contentFit="contain"
          />
          <View style={styles.appNameContainer}>
            <Text style={styles.appName}>Fox Trade Master™</Text>
            <Text style={styles.appName}>Global Trading App</Text>
          </View>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={20} color="#EF4444" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}
          
          {successMessage ? (
            <View style={styles.successBanner}>
              <CheckCircle2 size={20} color="#10B981" />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Mail size={20} color="#64748B" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrorMessage('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
            onPress={handleSendCode}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.signInButtonText}>Send Code</Text>
                <ArrowRight size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            We&apos;ll email you a 6-digit code to sign in
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appNameContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  inputIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#0F172A',
    fontSize: 16,
    paddingVertical: 16,
  },
  signInButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    marginTop: 16,
    lineHeight: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#BAE6FD',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#0F172A',
  },
  codeInputFilled: {
    borderColor: '#0EA5E9',
    backgroundColor: '#F0F9FF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#0EA5E9',
    fontWeight: '500',
  },
  confirmContainer: {
    alignItems: 'center',
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  warningIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  emailText: {
    color: '#0EA5E9',
    fontWeight: '600',
  },
  instructions: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    color: '#0EA5E9',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  resendButtonTextDisabled: {
    color: '#94A3B8',
  },
  primaryButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 24,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    flex: 1,
    color: '#991B1B',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  successText: {
    flex: 1,
    color: '#065F46',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
