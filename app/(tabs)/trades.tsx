import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrading } from '@/contexts/TradingContext';
import { Search, TrendingUp, AlertCircle, Plus, Upload, TrendingDown, Activity } from 'lucide-react-native';
import ImportModal from '@/components/ImportModal';
import { ParsedRow } from '@/lib/fileParser';
import { Trade } from '@/types';

const TRADE_IMPORT_FIELDS = [
  { field: 'commodity', label: 'Commodity', required: true },
  { field: 'counterpartyName', label: 'Counterparty Name', required: true },
  { field: 'quantity', label: 'Quantity', required: true },
  { field: 'unit', label: 'Unit (MT/kg)', required: false },
  { field: 'pricePerUnit', label: 'Price per Unit', required: true },
  { field: 'incoterm', label: 'Incoterm (FOB/CIF)', required: false },
  { field: 'status', label: 'Status', required: false },
];

export default function TradesScreen() {
  const router = useRouter();
  const { trades, addTrades, currentUser } = useTrading();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showImportModal, setShowImportModal] = useState(false);

  const getRoleSpecificFilters = () => {
    if (!currentUser) return ['all'];

    switch (currentUser.role) {
      case 'compliance_officer':
        return ['all', 'compliance_check', 'counterparty_review', 'risk_approval', 'legal_review'];
      case 'risk_manager':
        return ['all', 'risk_approval', 'counterparty_review', 'active', 'financing_pending'];
      case 'legal_reviewer':
        return ['all', 'legal_review', 'compliance_check', 'counterparty_review'];
      case 'senior_management':
        return ['all', 'active', 'in_transit', 'delivered', 'settled'];
      case 'trade_originator':
      default:
        return ['all', 'active', 'financing_pending', 'legal_review', 'in_transit', 'delivered'];
    }
  };

  const getRoleSpecificTrades = () => {
    if (!currentUser) return trades;

    switch (currentUser.role) {
      case 'compliance_officer':
        return trades;
      case 'risk_manager':
        return trades;
      case 'legal_reviewer':
        return trades;
      case 'senior_management':
        return trades;
      case 'trade_originator':
      default:
        return trades;
    }
  };

  const roleFilteredTrades = getRoleSpecificTrades();

  const filteredTrades = roleFilteredTrades.filter(trade => {
    const matchesSearch = trade.counterpartyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trade.commodity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || trade.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusFilters = getRoleSpecificFilters();

  const handleImport = useCallback((data: ParsedRow[]) => {
    console.log('[Trades] Importing', data.length, 'rows');
    
    const newTrades: Trade[] = data.map((row, index) => {
      const commodityRaw = String(row.commodity || '').toLowerCase().replace(/\s+/g, '_');
      const counterpartyName = String(row.counterpartyName || 'Unknown');
      const quantity = Number(row.quantity) || 0;
      const unit = String(row.unit || 'MT');
      const pricePerUnit = Number(row.pricePerUnit) || 0;
      const incoterm = String(row.incoterm || 'FOB');
      const statusValue = String(row.status || 'active').toLowerCase().replace(/\s+/g, '_');
      
      const validCommodities = ['gold', 'fuel_oil', 'steam_coal', 'anthracite_coal', 'urea', 'edible_oils'];
      const commodity = validCommodities.includes(commodityRaw) ? commodityRaw : 'gold';
      
      return {
        id: `imported_${Date.now()}_${index}`,
        commodity: commodity as Trade['commodity'],
        counterpartyId: '',
        counterpartyName,
        quantity,
        unit,
        pricePerUnit,
        totalValue: quantity * pricePerUnit,
        currency: 'USD',
        incoterm,
        deliveryWindow: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        status: statusValue as Trade['status'],
        createdAt: new Date(),
        createdBy: 'Import',
        riskLevel: 'amber' as const,
        alerts: [],
        documents: [],
      };
    }).filter(trade => trade.commodity && trade.counterpartyName && trade.quantity > 0);

    if (newTrades.length > 0) {
      addTrades(newTrades);
      Alert.alert(
        'Import Successful',
        `Successfully imported ${newTrades.length} trades.`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Import Failed',
        'No valid trades found in the file.',
        [{ text: 'OK' }]
      );
    }
  }, [addTrades]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Trade Portfolio</Text>
          <View style={styles.headerButtons}>
            {(currentUser?.role === 'trade_originator' || currentUser?.role === 'senior_management') ? (
              <>
                <TouchableOpacity 
                  style={styles.importButton}
                  onPress={() => setShowImportModal(true)}
                >
                  <Upload size={16} color="#0284C7" />
                  <Text style={styles.importButtonText}>Import</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => router.push('/trade/create')}
                >
                  <Plus size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search trades..."
              placeholderTextColor="#64748B"
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

                {trade.entryPrice && trade.currentPrice && ['active', 'in_transit', 'financing_pending'].includes(trade.status) && (
                  <View style={styles.profitSection}>
                    <View style={styles.profitHeader}>
                      <Activity size={14} color="#64748B" />
                      <Text style={styles.profitLabel}>Real-Time P&L</Text>
                    </View>
                    <View style={styles.profitDetails}>
                      <View style={styles.profitRow}>
                        <Text style={styles.profitSubLabel}>Entry:</Text>
                        <Text style={styles.profitSubValue}>${trade.entryPrice.toFixed(2)}</Text>
                      </View>
                      <View style={styles.profitRow}>
                        <Text style={styles.profitSubLabel}>Current:</Text>
                        <Text style={[styles.profitSubValue, { fontWeight: '700' }]}>${trade.currentPrice.toFixed(2)}</Text>
                      </View>
                      <View style={styles.profitDivider} />
                      <View style={styles.profitMainRow}>
                        {(trade.profitLoss || 0) >= 0 ? (
                          <TrendingUp size={16} color="#10B981" />
                        ) : (
                          <TrendingDown size={16} color="#EF4444" />
                        )}
                        <Text style={[
                          styles.profitMainValue,
                          { color: (trade.profitLoss || 0) >= 0 ? '#10B981' : '#EF4444' }
                        ]}>
                          {(trade.profitLoss || 0) >= 0 ? '+' : ''}{((trade.profitLoss || 0) / 1000).toFixed(1)}K
                        </Text>
                        <Text style={[
                          styles.profitPercent,
                          { color: (trade.profitLoss || 0) >= 0 ? '#10B981' : '#EF4444' }
                        ]}>
                          ({(trade.profitLossPercent || 0) >= 0 ? '+' : ''}{(trade.profitLossPercent || 0).toFixed(2)}%)
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

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
                <TrendingUp size={48} color="#94A3B8" />
                <Text style={styles.emptyStateText}>No trades found</Text>
                <Text style={styles.emptyStateSubtext}>
                  {searchQuery ? 'Try adjusting your search' : 'Create your first trade to get started'}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <ImportModal
        visible={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        title="Import Trades"
        targetFields={TRADE_IMPORT_FIELDS}
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
    color: '#0F172A',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  importButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0284C7',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
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
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: '#0284C7',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
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
    color: '#0F172A',
    marginBottom: 2,
  },
  tradeCounterparty: {
    fontSize: 13,
    color: '#64748B',
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
    color: '#64748B',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
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
    color: '#64748B',
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
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  profitSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
  },
  profitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  profitLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  profitDetails: {
    gap: 4,
  },
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profitSubLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  profitSubValue: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '500',
  },
  profitDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 6,
  },
  profitMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profitMainValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  profitPercent: {
    fontSize: 13,
    fontWeight: '600',
  },
});
