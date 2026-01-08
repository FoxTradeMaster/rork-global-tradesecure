import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Briefcase, Shield, AlertTriangle, Scale, TrendingUp } from 'lucide-react-native';
import { useTrading } from '@/contexts/TradingContext';
import { User } from '@/types';

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
  const { setUser, currentUser } = useTrading();

  const handleRoleSelect = async (roleId: string) => {
    const user: User = {
      id: `user_${Date.now()}`,
      name: 'Trade User',
      role: roleId as any,
      email: 'user@foxtrademaster.com',
    };
    
    await setUser(user);
    router.replace('/(tabs)/dashboard');
  };

  if (currentUser) {
    router.replace('/(tabs)/dashboard');
    return null;
  }

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
                source={require('@/assets/images/icon.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Fox Trade Master™</Text>
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
        </ScrollView>
      </SafeAreaView>
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
    fontSize: 32,
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
});