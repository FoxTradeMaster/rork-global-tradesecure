import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrading } from '@/contexts/TradingContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Search, Users, Building2, MapPin, CheckCircle, AlertTriangle, XCircle, Upload } from 'lucide-react-native';
import ImportModal from '@/components/ImportModal';
import { ParsedRow } from '@/lib/fileParser';
import { Counterparty, RiskLevel } from '@/types';

const COUNTERPARTY_IMPORT_FIELDS = [
  { field: 'name', label: 'Company Name', required: true },
  { field: 'country', label: 'Country', required: true },
  { field: 'type', label: 'Type (buyer/seller)', required: false },
  { field: 'email', label: 'Email', required: false },
  { field: 'phone', label: 'Phone', required: false },
  { field: 'address', label: 'Address', required: false },
];

export default function CounterpartiesScreen() {
  const router = useRouter();
  const { counterparties, addCounterparties } = useTrading();
  const { isPremium, checkFeatureAccess, getFeatureLimit, canEdit, showPaywall: triggerPaywall } = useSubscription();
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  const filteredCounterparties = counterparties.filter(cp =>
    cp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cp.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'green': return '#10B981';
      case 'amber': return '#F59E0B';
      case 'red': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'under_review': return AlertTriangle;
      case 'rejected': return XCircle;
      default: return AlertTriangle;
    }
  };

  const handleImportClick = () => {
    if (!canEdit) {
      triggerPaywall();
      return;
    }
    setShowImportModal(true);
  };

  const handleImport = useCallback((data: ParsedRow[]) => {
    console.log('[Counterparties] Importing', data.length, 'rows');
    
    const newCounterparties: Counterparty[] = data.map((row, index) => {
      const name = String(row.name || '');
      const country = String(row.country || 'Unknown');
      const typeValue = String(row.type || 'buyer').toLowerCase();
      const type = (typeValue === 'seller' ? 'seller' : 'buyer') as 'buyer' | 'seller';
      
      const riskLevel: RiskLevel = 'amber';
      
      return {
        id: `imported_${Date.now()}_${index}`,
        name,
        country,
        type,
        onboardedAt: new Date(),
        riskScore: {
          legal_licensing: 50,
          financial_strength: 50,
          compliance_sanctions: 50,
          operations_logistics: 50,
          commodity_specific: 50,
          overall: 50,
          level: riskLevel,
        },
        documents: [],
        approved: false,
        status: 'pending_ddq' as const,
      };
    }).filter(cp => cp.name.trim() !== '');

    if (newCounterparties.length > 0) {
      if (!canEdit) {
        triggerPaywall();
        return;
      }
      
      addCounterparties(newCounterparties);
      Alert.alert(
        'Import Successful',
        `Successfully imported ${newCounterparties.length} counterparties.`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Import Failed',
        'No valid counterparties found in the file.',
        [{ text: 'OK' }]
      );
    }
  }, [addCounterparties, counterparties.length, isPremium, getFeatureLimit]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Counterparties</Text>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{counterparties.length}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.importButton}
            onPress={handleImportClick}
          >
            <Upload size={16} color="#FFFFFF" />
            <Text style={styles.importButtonText}>Import</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search counterparties..."
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.counterpartiesContainer}>
            {filteredCounterparties.map(cp => {
              const StatusIcon = getStatusIcon(cp.status);
              return (
                <TouchableOpacity
                  key={cp.id}
                  style={styles.counterpartyCard}
                  onPress={() => router.push(`/counterparty/${cp.id}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <View style={[
                        styles.iconContainer,
                        { backgroundColor: cp.type === 'buyer' ? '#3B82F620' : '#8B5CF620' }
                      ]}>
                        <Building2 
                          size={24} 
                          color={cp.type === 'buyer' ? '#3B82F6' : '#8B5CF6'} 
                        />
                      </View>
                      <View style={styles.cardInfo}>
                        <Text style={styles.counterpartyName}>{cp.name}</Text>
                        <View style={styles.locationContainer}>
                          <MapPin size={12} color="#64748B" />
                          <Text style={styles.countryText}>{cp.country}</Text>
                          <View style={[
                            styles.typeBadge,
                            { backgroundColor: cp.type === 'buyer' ? '#3B82F620' : '#8B5CF620' }
                          ]}>
                            <Text style={[
                              styles.typeText,
                              { color: cp.type === 'buyer' ? '#3B82F6' : '#8B5CF6' }
                            ]}>
                              {cp.type}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <StatusIcon 
                      size={20} 
                      color={
                        cp.status === 'approved' ? '#10B981' :
                        cp.status === 'rejected' ? '#EF4444' :
                        '#F59E0B'
                      } 
                    />
                  </View>

                  <View style={styles.riskScoreContainer}>
                    <View style={styles.riskScoreHeader}>
                      <Text style={styles.riskScoreLabel}>Risk Score</Text>
                      <View style={[
                        styles.riskLevelBadge,
                        { backgroundColor: getRiskColor(cp.riskScore.level) + '20' }
                      ]}>
                        <Text style={[
                          styles.riskLevelText,
                          { color: getRiskColor(cp.riskScore.level) }
                        ]}>
                          {cp.riskScore.level.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.riskBar}>
                      <View 
                        style={[
                          styles.riskBarFill,
                          { 
                            width: `${cp.riskScore.overall}%`,
                            backgroundColor: getRiskColor(cp.riskScore.level)
                          }
                        ]} 
                      />
                    </View>

                    <View style={styles.riskMetrics}>
                      <View style={styles.riskMetricItem}>
                        <Text style={styles.riskMetricValue}>{cp.riskScore.legal_licensing}</Text>
                        <Text style={styles.riskMetricLabel}>Legal</Text>
                      </View>
                      <View style={styles.riskMetricItem}>
                        <Text style={styles.riskMetricValue}>{cp.riskScore.financial_strength}</Text>
                        <Text style={styles.riskMetricLabel}>Financial</Text>
                      </View>
                      <View style={styles.riskMetricItem}>
                        <Text style={styles.riskMetricValue}>{cp.riskScore.compliance_sanctions}</Text>
                        <Text style={styles.riskMetricLabel}>Compliance</Text>
                      </View>
                      <View style={styles.riskMetricItem}>
                        <Text style={styles.riskMetricValue}>{cp.riskScore.operations_logistics}</Text>
                        <Text style={styles.riskMetricLabel}>Operations</Text>
                      </View>
                    </View>
                  </View>

                  {cp.approvalConditions && cp.approvalConditions.length > 0 && (
                    <View style={styles.conditionsContainer}>
                      <AlertTriangle size={14} color="#F59E0B" />
                      <Text style={styles.conditionsText}>
                        {cp.approvalConditions[0]}
                      </Text>
                    </View>
                  )}

                  <View style={styles.cardFooter}>
                    <Text style={styles.documentsText}>
                      {cp.documents.length} documents
                    </Text>
                    <Text style={styles.onboardedText}>
                      Onboarded {new Date(cp.onboardedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {filteredCounterparties.length === 0 && (
              <View style={styles.emptyState}>
                <Users size={48} color="#94A3B8" />
                <Text style={styles.emptyStateText}>No counterparties found</Text>
                <Text style={styles.emptyStateSubtext}>
                  {searchQuery ? 'Try adjusting your search' : 'Start by onboarding a counterparty'}
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
        title="Import Counterparties"
        targetFields={COUNTERPARTY_IMPORT_FIELDS}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  importButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  counterpartiesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  counterpartyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  counterpartyName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countryText: {
    fontSize: 13,
    color: '#64748B',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  riskScoreContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  riskScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskScoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  riskLevelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  riskLevelText: {
    fontSize: 11,
    fontWeight: '700',
  },
  riskBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  riskBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  riskMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  riskMetricItem: {
    alignItems: 'center',
  },
  riskMetricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  riskMetricLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  conditionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F59E0B20',
    borderRadius: 6,
    marginBottom: 8,
  },
  conditionsText: {
    fontSize: 12,
    color: '#F59E0B',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  documentsText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  onboardedText: {
    fontSize: 11,
    color: '#64748B',
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
});
