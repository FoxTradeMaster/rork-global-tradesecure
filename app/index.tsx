import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, ScrollView, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Briefcase, Shield, AlertTriangle, Scale, TrendingUp, X, Mail, Lock, User as UserIcon } from 'lucide-react-native';
import { useTrading } from '@/contexts/TradingContext';
import { User } from '@/types';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const ROLES = [
  {
    id: 'trade_originator',
    title: 'Trade Originator',
    description: 'Create and manage trades',
    icon: Briefcase,
    color: '#3B82F6',
  },
  {
    id: 'compliance_officer',
    title: 'Compliance Officer',
    description: 'Ensure regulatory compliance',
    icon: Shield,
    color: '#10B981',
  },
  {
    id: 'risk_manager',
    title: 'Risk Manager',
    description: 'Assess counterparty risk',
    icon: AlertTriangle,
    color: '#F59E0B',
  },
  {
    id: 'legal_reviewer',
    title: 'Legal Reviewer',
    description: 'Review contracts and agreements',
    icon: Scale,
    color: '#8B5CF6',
  },
  {
    id: 'senior_management',
    title: 'Senior Management',
    description: 'Oversee operations and strategy',
    icon: TrendingUp,
    color: '#06B6D4',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { setUser, setDemoUser, currentUser, isLoading } = useTrading();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showDemoRoleModal, setShowDemoRoleModal] = useState(false);

  useEffect(() => {
    if (!navigationState?.key || isLoading) return;
    
    if (currentUser) {
      console.log('[WelcomeScreen] User already exists, navigating to dashboard');
      const timer = setTimeout(() => {
        router.replace('/(tabs)/dashboard');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [navigationState?.key, isLoading, currentUser, router]);

  if (isLoading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Image
          source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/2b9a7na20abky0yfw9asz' }}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
        <Text style={[styles.title, { marginTop: 24 }]} numberOfLines={1}>Fox Trade Master™</Text>
      </View>
    );
  }

  if (currentUser) {
    return null;
  }

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setShowAuthModal(true);
  };

  const handleDemoMode = () => {
    setShowDemoRoleModal(true);
  };

  const handleDemoRoleSelect = async (roleId: string) => {
    try {
      setShowDemoRoleModal(false);
      await setDemoUser(roleId as any);
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      console.error('[WelcomeScreen] Error entering demo mode:', error);
      Alert.alert('Error', 'Failed to start demo mode');
    }
  };

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (authMode === 'signup' && !name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: undefined,
            data: {
              name,
              role: selectedRole,
            },
          },
        });

        if (error) {
          if (error.message?.includes('Error sending confirmation email') || 
              error.message?.includes('email') && error.message?.includes('send')) {
            Alert.alert(
              'Email Configuration Required',
              'Email verification is not configured. Please go to your Supabase project settings > Authentication > Email Templates and either:\n\n1. Configure SMTP settings, or\n2. Disable "Enable email confirmations" under Auth settings',
              [{ text: 'OK' }]
            );
            setAuthLoading(false);
            return;
          }
          throw error;
        }

        if (data.user) {
          if (data.user.identities && data.user.identities.length === 0) {
            Alert.alert('Account Already Exists', 'An account with this email already exists. Please sign in instead.');
            setAuthMode('login');
            return;
          }

          if (data.session) {
            const user: User = {
              id: data.user.id,
              name: name,
              role: selectedRole as any,
              email: email,
            };
            await setUser(user);
            setShowAuthModal(false);
            router.push('/(tabs)/dashboard');
          } else {
            Alert.alert(
              'Verify Your Email',
              'Please check your email and click the verification link to complete signup. After verification, you can sign in.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    setAuthMode('login');
                    setPassword('');
                  }
                }
              ]
            );
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            Alert.alert(
              'Email Not Verified',
              'Please check your email and click the verification link before signing in. Check your spam folder if you don\'t see it.',
              [{ text: 'OK' }]
            );
            return;
          }
          throw error;
        }

        if (data.user && data.session) {
          const user: User = {
            id: data.user.id,
            name: data.user.user_metadata?.name || 'Trade User',
            role: (data.user.user_metadata?.role || selectedRole) as any,
            email: data.user.email || email,
          };
          await setUser(user);
          setShowAuthModal(false);
          router.push('/(tabs)/dashboard');
        }
      }
    } catch (error: any) {
      console.error('[Auth] Error:', error);
      
      let errorMessage = error.message || 'Failed to authenticate';
      
      if (error.message?.includes('Invalid login credentials')) {
        if (authMode === 'login') {
          errorMessage = 'Invalid email or password. Please check your credentials and try again. If you just signed up, make sure to verify your email first.';
        }
      }
      
      Alert.alert('Authentication Error', errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/2b9a7na20abky0yfw9asz' }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title} numberOfLines={1}>Fox Trade Master™</Text>
            <Text style={styles.subtitle}>Global Trading App</Text>
            <Text style={styles.tagline}>Select your role to continue</Text>
          </View>

          <View style={styles.rolesContainer}>
            {ROLES.map((role, index) => {
              const Icon = role.icon;
              return (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleCard,
                    { borderLeftColor: role.color, borderLeftWidth: 4 }
                  ]}
                  onPress={() => handleRoleSelect(role.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: `${role.color}20` }]}>
                    <Icon size={28} color={role.color} />
                  </View>
                  <View style={styles.roleInfo}>
                    <Text style={styles.roleTitle}>{role.title}</Text>
                    <Text style={styles.roleDescription}>{role.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.demoButton} onPress={handleDemoMode}>
            <Text style={styles.demoButtonText}>Try Demo Mode</Text>
            <Text style={styles.demoButtonSubtext}>No account required • Full access</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={showDemoRoleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDemoRoleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDemoRoleModal(false)}
            >
              <X size={24} color="#94A3B8" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Select Your Demo Role</Text>
            <Text style={styles.modalSubtitle}>
              Choose the role you want to explore in demo mode
            </Text>

            <View style={styles.demoRolesContainer}>
              {ROLES.map((role) => {
                const Icon = role.icon;
                return (
                  <TouchableOpacity
                    key={role.id}
                    style={[
                      styles.demoRoleCard,
                      { borderLeftColor: role.color, borderLeftWidth: 4 }
                    ]}
                    onPress={() => handleDemoRoleSelect(role.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.demoIconContainer, { backgroundColor: `${role.color}20` }]}>
                      <Icon size={24} color={role.color} />
                    </View>
                    <View style={styles.demoRoleInfo}>
                      <Text style={styles.demoRoleTitle}>{role.title}</Text>
                      <Text style={styles.demoRoleDescription}>{role.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAuthModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAuthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAuthModal(false)}
            >
              <X size={24} color="#94A3B8" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {authMode === 'login' ? 'Sign in to continue' : 'Sign up to get started'}
            </Text>

            {authMode === 'signup' && (
              <View style={styles.inputContainer}>
                <UserIcon size={20} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#64748B"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Mail size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#64748B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#64748B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.authButton, authLoading && styles.authButtonDisabled]}
              onPress={handleAuth}
              disabled={authLoading}
            >
              {authLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.authButtonText}>
                  {authMode === 'login' ? 'Sign In' : 'Sign Up'}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.switchModeContainer}>
              <Text style={styles.switchModeText}>
                {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </Text>
              <TouchableOpacity onPress={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
                <Text style={styles.switchModeLink}>
                  {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 48,
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    padding: 8,
    marginBottom: 24,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#94A3B8',
    marginBottom: 32,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  rolesContainer: {
    gap: 16,
  },
  roleCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#94A3B8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#94A3B8',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#FFFFFF',
  },
  authButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  switchModeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  switchModeText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  switchModeLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B82F6',
  },
  demoButton: {
    marginTop: 32,
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  demoButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  demoButtonSubtext: {
    fontSize: 13,
    color: '#D1FAE5',
  },
  demoRolesContainer: {
    marginTop: 16,
    gap: 12,
  },
  demoRoleCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  demoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  demoRoleInfo: {
    flex: 1,
  },
  demoRoleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  demoRoleDescription: {
    fontSize: 13,
    color: '#94A3B8',
  },
});