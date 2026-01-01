import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useTrading, usePortfolioMetrics } from '@/contexts/TradingContext';
import { Crown, User, LogOut, Info, FileText, Shield, ChevronRight, HelpCircle, RefreshCw } from 'lucide-react-native';
import PremiumBadge from '@/components/PremiumBadge';
import PaywallModal from '@/components/PaywallModal';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { subscriptionStatus, isPremium, openCustomerCenter } = useSubscription();
  const { currentUser, setUser } = useTrading();
  const metrics = usePortfolioMetrics();
  const [showPaywall, setShowPaywall] = useState(false);
  const router = useRouter();

  const handleManageSubscription = async () => {
    if (isPremium) {
      await openCustomerCenter();
    } else {
      setShowPaywall(true);
    }
  };

  const handleChangeRole = () => {
    Alert.alert(
      'Change Role',
      'Switch to a different role?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change Role',
          onPress: () => {
            setUser(null as any);
            router.replace('/role-select');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            setUser(null as any);
            router.replace('/role-select');
          },
        },
      ]
    );
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.profileCard}>
              <View style={styles.profileIcon}>
                <User size={32} color="#3B82F6" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{currentUser?.name || 'User'}</Text>
                <Text style={styles.profileRole}>
                  {currentUser?.role.replace(/_/g, ' ').toUpperCase() || 'ROLE'}
                </Text>
              </View>
              {isPremium && <PremiumBadge compact />}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Platform Information</Text>
            <View style={styles.roleCard}>
              <Text style={styles.roleTitle}>Platform Role: Intermediary / Facilitator</Text>
              <Text style={styles.roleDescription}>
                Masters Energy Inc. acts as an intermediary/facilitator, earning commission on deals closed through this platform
              </Text>
              <View style={styles.commissionRateContainer}>
                <Text style={styles.commissionRateLabel}>Platform Commission Rate</Text>
                <Text style={styles.commissionRateValue}>
                  {subscriptionStatus.features.commissionRate}%
                </Text>
              </View>
              {isPremium && subscriptionStatus.features.platformFee > 0 && (
                <Text style={styles.platformFeeText}>
                  + ${subscriptionStatus.features.platformFee}/month platform access
                </Text>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Commission Summary</Text>
            <View style={styles.commissionSummaryCard}>
              <View style={styles.commissionMetricRow}>
                <Text style={styles.commissionMetricLabel}>Earned to Date</Text>
                <Text style={styles.commissionMetricValue}>
                  ${(metrics.totalCommissionEarned / 1000).toFixed(1)}K
                </Text>
              </View>
              <View style={styles.commissionMetricRow}>
                <Text style={styles.commissionMetricLabel}>Pending Payment</Text>
                <Text style={[styles.commissionMetricValue, { color: '#F59E0B' }]}>
                  ${(metrics.pendingCommission / 1000).toFixed(1)}K
                </Text>
              </View>
              <View style={styles.commissionMetricRow}>
                <Text style={styles.commissionMetricLabel}>Potential (Active)</Text>
                <Text style={[styles.commissionMetricValue, { color: '#3B82F6' }]}>
                  ${(metrics.potentialCommission / 1000).toFixed(1)}K
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            
            <View style={[styles.subscriptionCard, isPremium && styles.subscriptionCardPremium]}>
              {isPremium ? (
                <>
                  <View style={styles.subscriptionHeader}>
                    <View style={styles.subscriptionIconContainer}>
                      <Crown size={28} color="#FFD700" fill="#FFD700" />
                    </View>
                    <View style={styles.subscriptionInfo}>
                      <Text style={styles.subscriptionTier}>Premium Plan</Text>
                      <Text style={styles.subscriptionExpiry}>
                        Expires: {formatDate(subscriptionStatus.expiresAt)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.featuresGrid}>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>Counterparties</Text>
                      <Text style={styles.featureValue}>Unlimited</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>Active Trades</Text>
                      <Text style={styles.featureValue}>Unlimited</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>Analytics</Text>
                      <Text style={styles.featureValue}>Advanced</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Text style={styles.featureLabel}>Support</Text>
                      <Text style={styles.featureValue}>Priority</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.manageButton}
                    onPress={handleManageSubscription}
                  >
                    <Text style={styles.manageButtonText}>Manage Subscription</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.freePlanTitle}>Free Plan</Text>
                  <Text style={styles.freePlanDescription}>
                    Limited to {subscriptionStatus.features.maxCounterparties} counterparties and{' '}
                    {subscriptionStatus.features.maxActiveTrades} active trades
                  </Text>

                  <View style={styles.limitGrid}>
                    <View style={styles.limitItem}>
                      <Text style={styles.limitValue}>{subscriptionStatus.features.maxCounterparties}</Text>
                      <Text style={styles.limitLabel}>Max Counterparties</Text>
                    </View>
                    <View style={styles.limitItem}>
                      <Text style={styles.limitValue}>{subscriptionStatus.features.maxActiveTrades}</Text>
                      <Text style={styles.limitLabel}>Max Active Trades</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.upgradeButton}
                    onPress={() => setShowPaywall(true)}
                    activeOpacity={0.8}
                  >
                    <Crown size={20} color="#FFFFFF" fill="#FFFFFF" />
                    <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>

            <TouchableOpacity style={styles.menuItem} onPress={handleChangeRole}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <RefreshCw size={20} color="#3B82F6" />
                </View>
                <Text style={styles.menuItemText}>Change Role</Text>
              </View>
              <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General</Text>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/user-manual')}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Info size={20} color="#3B82F6" />
                </View>
                <Text style={styles.menuItemText}>User Manual</Text>
              </View>
              <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/terms-of-service')}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <FileText size={20} color="#3B82F6" />
                </View>
                <Text style={styles.menuItemText}>Terms & Conditions</Text>
              </View>
              <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/privacy-policy')}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Shield size={20} color="#3B82F6" />
                </View>
                <Text style={styles.menuItemText}>Privacy Policy</Text>
              </View>
              <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/support')}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <HelpCircle size={20} color="#3B82F6" />
                </View>
                <Text style={styles.menuItemText}>Support</Text>
              </View>
              <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={20} color="#EF4444" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.version}>Version 1.0.0</Text>
            <Text style={styles.copyright}>©2025 Masters Energy Inc. USA</Text>
            <Text style={styles.operatorNote}>Platform Intermediary & Facilitator</Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
      />
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  profileCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F620',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  subscriptionCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
  },
  subscriptionCardPremium: {
    backgroundColor: '#0A0E27',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  subscriptionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD70020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionTier: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subscriptionExpiry: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 12,
  },
  featureLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  featureValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  manageButton: {
    backgroundColor: '#374151',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  manageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  freePlanTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  freePlanDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  limitGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  limitItem: {
    flex: 1,
    backgroundColor: '#0A0E27',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  limitValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  limitLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  upgradeButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  upgradeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1F2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F620',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1F2937',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 4,
  },
  version: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  copyright: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  operatorNote: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic' as const,
  },
  roleCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
    lineHeight: 20,
  },
  commissionRateContainer: {
    backgroundColor: '#0A0E27',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commissionRateLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#9CA3AF',
  },
  commissionRateValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#10B981',
  },
  platformFeeText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
  },
  commissionSummaryCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  commissionMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commissionMetricLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#9CA3AF',
  },
  commissionMetricValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#10B981',
  },
});
