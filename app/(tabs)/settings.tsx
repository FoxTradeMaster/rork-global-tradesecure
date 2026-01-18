import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useTrading, usePortfolioMetrics } from '@/contexts/TradingContext';
import { useAIMarketUpdater } from '@/contexts/AIMarketUpdaterContext';
import { Crown, User, Info, FileText, Shield, ChevronRight, HelpCircle, LogOut, Zap, Play, Pause, Clock, Activity, CheckCircle, XCircle, TestTube2 } from 'lucide-react-native';
import PremiumBadge from '@/components/PremiumBadge';
import PaywallModal from '@/components/PaywallModal';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { subscriptionStatus, isPremium, manageSubscription } = useSubscription();
  const { currentUser, clearUser, isDemoMode } = useTrading();
  const metrics = usePortfolioMetrics();
  const { 
    settings, 
    updateLogs, 
    isUpdating, 
    currentCommodity, 
    toggleEnabled, 
    togglePaused, 
    manualUpdate, 
    getTimeUntilNextUpdate 
  } = useAIMarketUpdater();
  const [showPaywall, setShowPaywall] = useState(false);
  const [showUpdateLogs, setShowUpdateLogs] = useState(false);
  const router = useRouter();

  const handleManageSubscription = () => {
    if (isPremium) {
      manageSubscription();
    } else {
      setShowPaywall(true);
    }
  };

  const handleChangeRole = async () => {
    await clearUser();
    router.replace('/');
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
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
          </View>

          {isDemoMode && (
            <View style={styles.section}>
              <View style={styles.demoBanner}>
                <View style={styles.demoIconContainer}>
                  <TestTube2 size={24} color="#10B981" />
                </View>
                <View style={styles.demoContent}>
                  <Text style={styles.demoTitle}>Demo Mode Active</Text>
                  <Text style={styles.demoDescription}>
                    You&apos;re exploring with full access. All features unlocked. Data won&apos;t be saved permanently.
                  </Text>
                  <TouchableOpacity
                    style={styles.createAccountButton}
                    onPress={handleChangeRole}
                  >
                    <Text style={styles.createAccountButtonText}>Create Real Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

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
            <Text style={styles.sectionTitle}>Platform Fee Structure</Text>
            <View style={styles.roleCard}>
              <Text style={styles.roleTitle}>Masters Energy Inc. Fee</Text>
              <Text style={styles.roleDescription}>
                As the platform operator and intermediary, Masters Energy Inc. charges the following fees for facilitating deals on this platform:
              </Text>
              <View style={styles.commissionRateContainer}>
                <Text style={styles.commissionRateLabel}>Masters Energy Commission</Text>
                <Text style={styles.commissionRateValue}>
                  {subscriptionStatus.features.commissionRate}%
                </Text>
              </View>
              {isPremium && subscriptionStatus.features.platformFee > 0 && (
                <Text style={styles.platformFeeText}>
                  + ${subscriptionStatus.features.platformFee}/month subscription fee
                </Text>
              )}
              <Text style={styles.feeNote}>
                This fee is charged by Masters Energy Inc. on all completed transactions
              </Text>
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
            <Text style={styles.sectionTitle}>AI Market Updater</Text>
            <View style={styles.aiUpdaterCard}>
              <View style={styles.aiUpdaterHeader}>
                <View style={styles.aiUpdaterIconContainer}>
                  <Zap size={24} color="#F59E0B" fill="#F59E0B" />
                </View>
                <View style={styles.aiUpdaterInfo}>
                  <Text style={styles.aiUpdaterTitle}>Autonomous Market Updates</Text>
                  <Text style={styles.aiUpdaterDescription}>
                    AI adds new buyers & sellers daily for each commodity sector
                  </Text>
                </View>
              </View>

              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <View style={[styles.statusDot, { backgroundColor: settings.isEnabled ? '#10B981' : '#6B7280' }]} />
                  <Text style={styles.statusText}>
                    {settings.isEnabled ? 'Enabled' : 'Disabled'}
                  </Text>
                </View>
                {settings.isEnabled && (
                  <View style={styles.statusItem}>
                    <View style={[styles.statusDot, { backgroundColor: settings.isPaused ? '#F59E0B' : '#10B981' }]} />
                    <Text style={styles.statusText}>
                      {settings.isPaused ? 'Paused' : 'Active'}
                    </Text>
                  </View>
                )}
                {isUpdating && (
                  <View style={styles.statusItem}>
                    <Activity size={14} color="#3B82F6" />
                    <Text style={[styles.statusText, { color: '#3B82F6' }]}>Updating...</Text>
                  </View>
                )}
              </View>

              {currentCommodity && (
                <View style={styles.currentUpdateBanner}>
                  <Activity size={16} color="#3B82F6" />
                  <Text style={styles.currentUpdateText}>
                    Generating companies for {currentCommodity}
                  </Text>
                </View>
              )}

              {settings.isEnabled && getTimeUntilNextUpdate() != null && (
                <View style={styles.nextUpdateRow}>
                  <Clock size={14} color="#6B7280" />
                  <Text style={styles.nextUpdateText}>
                    Next update in {getTimeUntilNextUpdate()}
                  </Text>
                </View>
              )}

              <View style={styles.aiUpdaterControls}>
                <TouchableOpacity
                  style={[styles.controlButton, settings.isEnabled && styles.controlButtonActive]}
                  onPress={toggleEnabled}
                >
                  <Text style={[styles.controlButtonText, settings.isEnabled && styles.controlButtonTextActive]}>
                    {settings.isEnabled ? 'Disable' : 'Enable'}
                  </Text>
                </TouchableOpacity>

                {settings.isEnabled && (
                  <TouchableOpacity
                    style={[styles.controlButton, styles.pauseButton]}
                    onPress={togglePaused}
                    disabled={isUpdating}
                  >
                    {settings.isPaused ? (
                      <Play size={16} color="#FFFFFF" />
                    ) : (
                      <Pause size={16} color="#FFFFFF" />
                    )}
                    <Text style={styles.controlButtonText}>
                      {settings.isPaused ? 'Resume' : 'Pause'}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.controlButton, styles.manualButton]}
                  onPress={manualUpdate}
                  disabled={isUpdating || settings.isPaused}
                >
                  <Zap size={16} color="#FFFFFF" />
                  <Text style={styles.controlButtonText}>Update Now</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.updaterStats}>
                <View style={styles.updaterStatItem}>
                  <Text style={styles.updaterStatValue}>{settings.companiesPerUpdate}</Text>
                  <Text style={styles.updaterStatLabel}>Companies/Update</Text>
                </View>
                <View style={styles.updaterStatItem}>
                  <Text style={styles.updaterStatValue}>{settings.updateIntervalHours}h</Text>
                  <Text style={styles.updaterStatLabel}>Interval</Text>
                </View>
                <View style={styles.updaterStatItem}>
                  <Text style={styles.updaterStatValue}>{settings.selectedCommodities.length}</Text>
                  <Text style={styles.updaterStatLabel}>Commodities</Text>
                </View>
              </View>

              {updateLogs.length > 0 && (
                <TouchableOpacity
                  style={styles.logsButton}
                  onPress={() => setShowUpdateLogs(!showUpdateLogs)}
                >
                  <Text style={styles.logsButtonText}>View Recent Updates</Text>
                  <ChevronRight size={16} color="#3B82F6" />
                </TouchableOpacity>
              )}

              {showUpdateLogs && updateLogs.slice(0, 5).map((log) => (
                <View key={log.id} style={styles.logItem}>
                  <View style={styles.logHeader}>
                    {log.success ? (
                      <CheckCircle size={14} color="#10B981" />
                    ) : (
                      <XCircle size={14} color="#EF4444" />
                    )}
                    <Text style={styles.logCommodity}>{log.commodity}</Text>
                    <Text style={styles.logTime}>
                      {new Date(log.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                  {log.success ? (
                    <>
                      <Text style={styles.logText}>
                        Added {log.companiesAdded} companies total
                      </Text>
                      {log.isSummary && log.details && log.details.length > 0 && (
                        <View style={styles.logDetailsContainer}>
                          <Text style={styles.logDetailsTitle}>Breakdown by commodity:</Text>
                          {log.details.map((detail, idx) => (
                            <View key={idx} style={styles.logDetailRow}>
                              <Text style={styles.logDetailCommodity}>• {detail.name}</Text>
                              <Text style={styles.logDetailCount}>{detail.count} companies</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </>
                  ) : (
                    <Text style={[styles.logText, { color: '#EF4444' }]}>
                      Error: {log.error}
                    </Text>
                  )}
                </View>
              ))}

              <Text style={styles.aiUpdaterWarning}>
                ⚠️ AI updates consume API credits. Use pause feature to control costs.
              </Text>
            </View>
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

            <TouchableOpacity style={styles.menuItem} onPress={handleChangeRole}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#FEE2E2' }]}>
                  <LogOut size={20} color="#EF4444" />
                </View>
                <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Change Role</Text>
              </View>
              <ChevronRight size={20} color="#EF4444" />
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
    backgroundColor: '#E0F2FE',
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
    color: '#0F172A',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  profileIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  subscriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  subscriptionCardPremium: {
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#F59E0B',
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
    color: '#0F172A',
    marginBottom: 4,
  },
  subscriptionExpiry: {
    fontSize: 13,
    color: '#64748B',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 12,
  },
  featureLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  featureValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0284C7',
  },
  manageButton: {
    backgroundColor: '#0284C7',
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
    color: '#0F172A',
    marginBottom: 8,
  },
  freePlanDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  limitGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  limitItem: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  limitValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0284C7',
    marginBottom: 4,
  },
  limitLabel: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  upgradeButton: {
    backgroundColor: '#0284C7',
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
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
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
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
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
    color: '#64748B',
    textAlign: 'center',
  },
  copyright: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  operatorNote: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic' as const,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#0284C7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#0F172A',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  commissionRateContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commissionRateLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#64748B',
  },
  commissionRateValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#10B981',
  },
  platformFeeText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
  },
  commissionSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  commissionMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commissionMetricLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#64748B',
  },
  commissionMetricValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#10B981',
  },
  feeNote: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic' as const,
  },
  aiUpdaterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  aiUpdaterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  aiUpdaterIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiUpdaterInfo: {
    flex: 1,
  },
  aiUpdaterTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#0F172A',
    marginBottom: 4,
  },
  aiUpdaterDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#0F172A',
  },
  currentUpdateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E0F2FE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  currentUpdateText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#3B82F6',
  },
  nextUpdateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  nextUpdateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  aiUpdaterControls: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  controlButtonActive: {
    backgroundColor: '#10B981',
  },
  pauseButton: {
    backgroundColor: '#F59E0B',
  },
  manualButton: {
    backgroundColor: '#3B82F6',
  },
  controlButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#64748B',
  },
  controlButtonTextActive: {
    color: '#FFFFFF',
  },
  updaterStats: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 12,
  },
  updaterStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  updaterStatValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#0284C7',
    marginBottom: 2,
  },
  updaterStatLabel: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },
  logsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 8,
  },
  logsButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#3B82F6',
  },
  logItem: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  logCommodity: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#0F172A',
    flex: 1,
  },
  logTime: {
    fontSize: 11,
    color: '#6B7280',
  },
  logText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 22,
  },
  logDetailsContainer: {
    marginTop: 8,
    marginLeft: 22,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  logDetailsTitle: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#64748B',
    marginBottom: 6,
  },
  logDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logDetailCommodity: {
    fontSize: 10,
    color: '#64748B',
    flex: 1,
  },
  logDetailCount: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#10B981',
  },
  aiUpdaterWarning: {
    fontSize: 11,
    color: '#F59E0B',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic' as const,
  },
  demoBanner: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#10B981',
    flexDirection: 'row',
    gap: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  demoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoContent: {
    flex: 1,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#065F46',
    marginBottom: 6,
  },
  demoDescription: {
    fontSize: 13,
    color: '#047857',
    lineHeight: 18,
    marginBottom: 12,
  },
  createAccountButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  createAccountButtonText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
});
