import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrading } from '@/contexts/TradingContext';
import { Search, TrendingUp, AlertCircle, Plus } from 'lucide-react-native';

export default function TradesScreen() {
  const router = useRouter();
  const { trades } = useTrading();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTrades = trades.filter(trade => {
    const matchesSearch = trade.counterpartyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trade.commodity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || trade.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusFilters = ['all', 'active', 'financing_pending', 'legal_review', 'in_transit'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Trade Portfolio</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/trade/create')}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search trades..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          {statusFilters.map(status => (
            <TouchableOpacity
              key={status}
              style={[styles.filterChip, filterStatus === status && styles.filterChipActive]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[
                styles.filterChipText,
                filterStatus === status && styles.filterChipTextActive
              ]}>
                {status.replace(/_/g, ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.tradesContainer}>
            {filteredTrades.map(trade => (
              <TouchableOpacity
                key={trade.id}
                style={styles.tradeCard}
                onPress={() => router.push(`/trade/${trade.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.tradeHeader}>
                  <View style={styles.tradeHeaderLeft}>
                    <View style={[
                      styles.commodityIcon,
                      { backgroundColor: 
                        trade.commodity === 'gold' ? '#F59E0B20' :
                        trade.commodity.includes('coal') ? '#6B728020' :
                        '#3B82F620'
                      }
                    ]}>
                      <TrendingUp 
                        size={20} 
                        color={
                          trade.commodity === 'gold' ? '#F59E0B' :
                          trade.commodity.includes('coal') ? '#6B7280' :
                          '#3B82F6'
                        } 
                      />
                    </View>
                    <View>
                      <Text style={styles.tradeCommodity}>
                        {trade.commodity.replace(/_/g, ' ').toUpperCase()}
                      </Text>
                      <Text style={styles.tradeCounterparty}>{trade.counterpartyName}</Text>
                    </View>
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

                <View style={styles.tradeMetrics}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Quantity</Text>
                    <Text style={styles.metricValue}>{trade.quantity.toLocaleString()} {trade.unit}</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Value</Text>
                    <Text style={styles.metricValue}>${(trade.totalValue / 1000000).toFixed(2)}M</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Price</Text>
                    <Text style={styles.metricValue}>${trade.pricePerUnit.toLocaleString()}</Text>
                  </View>
                </View>

                <View style={styles.tradeFooter}>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: 
                      ['active', 'in_transit', 'delivered'].includes(trade.status) ? '#10B98120' :
                      ['financing_pending', 'legal_review', 'compliance_check'].includes(trade.status) ? '#F59E0B20' :
                      '#3B82F620'
                    }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color:
                        ['active', 'in_transit', 'delivered'].includes(trade.status) ? '#10B981' :
                        ['financing_pending', 'legal_review', 'compliance_check'].includes(trade.status) ? '#F59E0B' :
                        '#3B82F6'
                      }
                    ]}>
                      {trade.status.replace(/_/g, ' ')}
                    </Text>
                  </View>

                  {trade.alerts.length > 0 && (
                    <View style={styles.alertBadge}>
                      <AlertCircle size={14} color="#EF4444" />
                      <Text style={styles.alertCount}>{trade.alerts.length}</Text>
                    </View>
                  )}

                  <Text style={styles.incoterm}>{trade.incoterm}</Text>
                </View>
              </TouchableOpacity>
            ))}

            {filteredTrades.length === 0 && (
              <View style={styles.emptyState}>
                <TrendingUp size={48} color="#374151" />
                <Text style={styles.emptyStateText}>No trades found</Text>
                <Text style={styles.emptyStateSubtext}>
                  {searchQuery ? 'Try adjusting your search' : 'Create your first trade to get started'}
                </Text>
              </View>
            )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  filterScroll: {
    maxHeight: 50,
    marginBottom: 16,
  },
  filterContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#1F2937',
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  tradesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  tradeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  commodityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tradeCommodity: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  tradeCounterparty: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  riskText: {
    fontSize: 10,
    fontWeight: '700',
  },
  tradeMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#374151',
  },
  tradeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#EF444420',
  },
  alertCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },
  incoterm: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 'auto',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
