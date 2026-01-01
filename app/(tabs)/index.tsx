import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrading, usePortfolioMetrics, useTradesByStatus } from '@/contexts/TradingContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  Users,
  Plus,
  HelpCircle
} from 'lucide-react-native';

export default function DashboardScreen() {
  const router = useRouter();
  const { currentUser, trades } = useTrading();
  const metrics = usePortfolioMetrics();
  const tradesByStatus = useTradesByStatus();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    
    const timeout = setTimeout(() => {
      if (!isAuthenticated) {
        console.log('[Dashboard] Not authenticated, redirecting to login');
        router.replace('/login');
        return;
      }
      
      if (!currentUser) {
        console.log('[Dashboard] No user role selected, redirecting to role select');
        router.replace('/role-select');
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [currentUser, router, isAuthenticated, authLoading]);

  if (authLoading || !isAuthenticated || !currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const recentTrades = trades.slice(0, 3);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.userRole}>{currentUser.role.replace(/_/g, ' ').toUpperCase()}</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.helpButton}
                onPress={() => router.push('/user-manual')}
              >
                <HelpCircle size={24} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => router.push('/trade/create')}
              >
                <Plus size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, styles.primaryMetric]}>
              <View style={styles.metricIconContainer}>
                <DollarSign size={24} color="#10B981" />
              </View>
              <Text style={styles.metricValue}>
                ${(metrics.totalValue / 1000000).toFixed(1)}M
              </Text>
              <Text style={styles.metricLabel}>Total Portfolio Value</Text>
            </View>

            <View style={[styles.metricCard, styles.commissionMetric]}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#8B5CF620' }]}>
                <DollarSign size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.metricValue}>${(metrics.totalCommissionEarned / 1000).toFixed(0)}K</Text>
              <Text style={styles.metricLabel}>Commission Earned</Text>
            </View>

            <View style={[styles.metricCard, styles.commissionMetric]}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#F59E0B20' }]}>
                <Clock size={20} color="#F59E0B" />
              </View>
              <Text style={styles.metricValue}>${(metrics.potentialCommission / 1000).toFixed(0)}K</Text>
              <Text style={styles.metricLabel}>Potential Commission</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#3B82F620' }]}>
                <TrendingUp size={20} color="#3B82F6" />
              </View>
              <Text style={styles.metricValue}>{metrics.activeTrades}</Text>
              <Text style={styles.metricLabel}>Active Trades</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#F59E0B20' }]}>
                <Clock size={20} color="#F59E0B" />
              </View>
              <Text style={styles.metricValue}>{metrics.pendingApprovals}</Text>
              <Text style={styles.metricLabel}>Pending Approvals</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#EF444420' }]}>
                <AlertCircle size={20} color="#EF4444" />
              </View>
              <Text style={styles.metricValue}>{metrics.criticalAlerts}</Text>
              <Text style={styles.metricLabel}>Critical Alerts</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconContainer, { backgroundColor: '#8B5CF620' }]}>
                <Users size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.metricValue}>{metrics.approvedCounterparties}</Text>
              <Text style={styles.metricLabel}>Approved Counterparties</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trade Pipeline</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/trades')}>
                <Text style={styles.sectionLink}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pipelineContainer}>
              {Object.entries(tradesByStatus).slice(0, 4).map(([status, count]) => (
                <View key={status} style={styles.pipelineItem}>
                  <View style={[
                    styles.pipelineDot, 
                    { backgroundColor: 
                      status.includes('active') || status.includes('delivered') ? '#10B981' : 
                      status.includes('pending') || status.includes('review') ? '#F59E0B' : 
                      '#3B82F6' 
                    }
                  ]} />
                  <View style={styles.pipelineInfo}>
                    <Text style={styles.pipelineLabel}>{status.replace(/_/g, ' ')}</Text>
                    <Text style={styles.pipelineCount}>{count} trades</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Trades</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/trades')}>
                <Text style={styles.sectionLink}>View All</Text>
              </TouchableOpacity>
            </View>

            {recentTrades.map(trade => (
              <TouchableOpacity
                key={trade.id}
                style={styles.tradeCard}
                onPress={() => router.push(`/trade/${trade.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.tradeHeader}>
                  <View>
                    <Text style={styles.tradeCommodity}>{trade.commodity.replace(/_/g, ' ').toUpperCase()}</Text>
                    <Text style={styles.tradeCounterparty}>{trade.counterpartyName}</Text>
                  </View>
                  <View style={[
                    styles.riskBadge,
                    { backgroundColor: 
                      trade.riskLevel === 'green' ? '#10B98120' : 
                      trade.riskLevel === 'amber' ? '#F59E0B20' : 
                      '#EF444420'
                    }
                  ]}>
                    <Text style={[
                      styles.riskText,
                      { color: 
                        trade.riskLevel === 'green' ? '#10B981' : 
                        trade.riskLevel === 'amber' ? '#F59E0B' : 
                        '#EF4444'
                      }
                    ]}>{trade.riskLevel.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={styles.tradeDetails}>
                  <View style={styles.tradeDetailItem}>
                    <Text style={styles.tradeDetailLabel}>Quantity</Text>
                    <Text style={styles.tradeDetailValue}>{trade.quantity.toLocaleString()} {trade.unit}</Text>
                  </View>
                  <View style={styles.tradeDetailItem}>
                    <Text style={styles.tradeDetailLabel}>Value</Text>
                    <Text style={styles.tradeDetailValue}>${(trade.totalValue / 1000000).toFixed(2)}M</Text>
                  </View>
                  <View style={styles.tradeDetailItem}>
                    <Text style={styles.tradeDetailLabel}>Status</Text>
                    <Text style={styles.tradeDetailValue}>{trade.status.replace(/_/g, ' ')}</Text>
                  </View>
                </View>

                {trade.alerts.length > 0 && (
                  <View style={styles.alertContainer}>
                    <AlertCircle size={14} color="#F59E0B" />
                    <Text style={styles.alertText}>{trade.alerts[0].message}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  helpButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  metricCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    width: '48%',
  },
  primaryMetric: {
    width: '100%',
    backgroundColor: '#10B98120',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  commissionMetric: {
    width: '48%',
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B98120',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionLink: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  pipelineContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  pipelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pipelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  pipelineInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pipelineLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  pipelineCount: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  tradeCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  tradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tradeCommodity: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tradeCounterparty: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tradeDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  tradeDetailItem: {
    flex: 1,
  },
  tradeDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  tradeDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  alertText: {
    fontSize: 12,
    color: '#F59E0B',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0E27',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#9CA3AF',
  },
});
