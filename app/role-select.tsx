import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useTrading } from '@/contexts/TradingContext';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Briefcase, Shield, AlertTriangle, Scale, Truck, Settings } from 'lucide-react-native';

const roles: { role: UserRole; title: string; icon: any; color: string }[] = [
  { role: 'trade_originator', title: 'Trade Originator', icon: Briefcase, color: '#3B82F6' },
  { role: 'compliance_officer', title: 'Compliance Officer', icon: Shield, color: '#10B981' },
  { role: 'risk_manager', title: 'Risk Manager', icon: AlertTriangle, color: '#F59E0B' },
  { role: 'legal_reviewer', title: 'Legal Reviewer', icon: Scale, color: '#8B5CF6' },
  { role: 'operations_manager', title: 'Operations Manager', icon: Truck, color: '#06B6D4' },
  { role: 'admin', title: 'System Admin', icon: Settings, color: '#EF4444' }
];

export default function RoleSelectScreen() {
  const router = useRouter();
  const { setUser } = useTrading();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      console.log('[RoleSelect] Not authenticated, redirecting to login');
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const selectRole = async (role: UserRole) => {
    await setUser({
      id: 'user1',
      name: role === 'trade_originator' ? 'John Smith' : 
            role === 'compliance_officer' ? 'Sarah Chen' :
            role === 'risk_manager' ? 'Michael Kumar' :
            role === 'legal_reviewer' ? 'Emma Wilson' :
            role === 'operations_manager' ? 'David Lee' : 'Admin',
      role,
      email: `${role}@commoditytrade.com`
    });
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
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
        <Text style={styles.subtitle}>Select your role to continue</Text>
      </View>

      <ScrollView 
        style={styles.rolesContainer}
        contentContainerStyle={styles.rolesContent}
        showsVerticalScrollIndicator={false}
      >
        {roles.map(({ role, title, icon: Icon, color }) => (
          <TouchableOpacity
            key={role}
            style={[styles.roleCard, { borderLeftColor: color }]}
            onPress={() => selectRole(role)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
              <Icon size={24} color={color} />
            </View>
            <View style={styles.roleInfo}>
              <Text style={styles.roleTitle}>{title}</Text>
              <Text style={styles.roleDescription}>
                {role === 'trade_originator' && 'Create and manage trades'}
                {role === 'compliance_officer' && 'Ensure regulatory compliance'}
                {role === 'risk_manager' && 'Assess counterparty risk'}
                {role === 'legal_reviewer' && 'Review contracts and agreements'}
                {role === 'operations_manager' && 'Track logistics and delivery'}
                {role === 'admin' && 'System administration and oversight'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appNameContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  rolesContainer: {
    flex: 1,
  },
  rolesContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  roleCard: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    flexShrink: 1,
  },
  roleDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    flexShrink: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0E27',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
