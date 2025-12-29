import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrading } from '@/contexts/TradingContext';
import { 
  Building2,
  MapPin,
  Calendar,
  FileText,
  Shield,
  CheckCircle,
  AlertTriangle
} from 'lucide-react-native';

export default function CounterpartyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { counterparties } = useTrading();

  const counterparty = counterparties.find(cp => cp.id === id);

  if (!counterparty) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <AlertTriangle size={48} color="#EF4444" />
            <Text style={styles.errorText}>Counterparty not found</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'green': return '#10B981';
      case 'amber': return '#F59E0B';
      case 'red': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.headerCard}>
              <View style={[
                styles.iconContainer,
                { backgroundColor: counterparty.type === 'buyer' ? '#3B82F620' : '#8B5CF620' }
              ]}>
                <Building2 
                  size={32} 
                  color={counterparty.type === 'buyer' ? '#3B82F6' : '#8B5CF6'} 
                />
              </View>
              <Text style={styles.name}>{counterparty.name}</Text>
              <View style={styles.headerMeta}>
                <View style={styles.locationContainer}>
                  <MapPin size={16} color="#6B7280" />
                  <Text style={styles.country}>{counterparty.country}</Text>
                </View>
                <View style={[
                  styles.typeBadge,
                  { backgroundColor: counterparty.type === 'buyer' ? '#3B82F620' : '#8B5CF620' }
                ]}>
                  <Text style={[
                    styles.typeText,
                    { color: counterparty.type === 'buyer' ? '#3B82F6' : '#8B5CF6' }
                  ]}>
                    {counterparty.type.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={[
                styles.statusContainer,
                { backgroundColor: counterparty.approved ? '#10B98120' : '#F59E0B20' }
              ]}>
                <CheckCircle 
                  size={20} 
                  color={counterparty.approved ? '#10B981' : '#F59E0B'} 
                />
                <Text style={[
                  styles.statusText,
                  { color: counterparty.approved ? '#10B981' : '#F59E0B' }
                ]}>
                  {counterparty.status.replace(/_/g, ' ').toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Shield size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Risk Assessment</Text>
              </View>

              <View style={styles.riskOverview}>
                <View style={styles.riskScoreCircle}>
                  <Text style={[styles.riskScoreValue, { color: getRiskColor(counterparty.riskScore.level) }]}>
                    {counterparty.riskScore.overall}
                  </Text>
                  <Text style={styles.riskScoreLabel}>Overall Score</Text>
                </View>
                <View style={[
                  styles.riskLevelBadge,
                  { backgroundColor: getRiskColor(counterparty.riskScore.level) + '20' }
                ]}>
                  <Text style={[
                    styles.riskLevelText,
                    { color: getRiskColor(counterparty.riskScore.level) }
                  ]}>
                    {counterparty.riskScore.level.toUpperCase()} RISK
                  </Text>
                </View>
              </View>

              <View style={styles.riskMetrics}>
                <View style={styles.riskMetricItem}>
                  <View style={styles.riskMetricHeader}>
                    <Text style={styles.riskMetricLabel}>Legal & Licensing</Text>
                    <Text style={styles.riskMetricValue}>{counterparty.riskScore.legal_licensing}</Text>
                  </View>
                  <View style={styles.riskBar}>
                    <View 
                      style={[
                        styles.riskBarFill,
                        { 
                          width: `${counterparty.riskScore.legal_licensing}%`,
                          backgroundColor: getRiskColor(counterparty.riskScore.level)
                        }
                      ]} 
                    />
                  </View>
                </View>

                <View style={styles.riskMetricItem}>
                  <View style={styles.riskMetricHeader}>
                    <Text style={styles.riskMetricLabel}>Financial Strength</Text>
                    <Text style={styles.riskMetricValue}>{counterparty.riskScore.financial_strength}</Text>
                  </View>
                  <View style={styles.riskBar}>
                    <View 
                      style={[
                        styles.riskBarFill,
                        { 
                          width: `${counterparty.riskScore.financial_strength}%`,
                          backgroundColor: getRiskColor(counterparty.riskScore.level)
                        }
                      ]} 
                    />
                  </View>
                </View>

                <View style={styles.riskMetricItem}>
                  <View style={styles.riskMetricHeader}>
                    <Text style={styles.riskMetricLabel}>Compliance & Sanctions</Text>
                    <Text style={styles.riskMetricValue}>{counterparty.riskScore.compliance_sanctions}</Text>
                  </View>
                  <View style={styles.riskBar}>
                    <View 
                      style={[
                        styles.riskBarFill,
                        { 
                          width: `${counterparty.riskScore.compliance_sanctions}%`,
                          backgroundColor: getRiskColor(counterparty.riskScore.level)
                        }
                      ]} 
                    />
                  </View>
                </View>

                <View style={styles.riskMetricItem}>
                  <View style={styles.riskMetricHeader}>
                    <Text style={styles.riskMetricLabel}>Operations & Logistics</Text>
                    <Text style={styles.riskMetricValue}>{counterparty.riskScore.operations_logistics}</Text>
                  </View>
                  <View style={styles.riskBar}>
                    <View 
                      style={[
                        styles.riskBarFill,
                        { 
                          width: `${counterparty.riskScore.operations_logistics}%`,
                          backgroundColor: getRiskColor(counterparty.riskScore.level)
                        }
                      ]} 
                    />
                  </View>
                </View>

                <View style={styles.riskMetricItem}>
                  <View style={styles.riskMetricHeader}>
                    <Text style={styles.riskMetricLabel}>Commodity Specific</Text>
                    <Text style={styles.riskMetricValue}>{counterparty.riskScore.commodity_specific}</Text>
                  </View>
                  <View style={styles.riskBar}>
                    <View 
                      style={[
                        styles.riskBarFill,
                        { 
                          width: `${counterparty.riskScore.commodity_specific}%`,
                          backgroundColor: getRiskColor(counterparty.riskScore.level)
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>

              {counterparty.approvalConditions && counterparty.approvalConditions.length > 0 && (
                <View style={styles.conditionsCard}>
                  <View style={styles.conditionsHeader}>
                    <AlertTriangle size={16} color="#F59E0B" />
                    <Text style={styles.conditionsTitle}>Approval Conditions</Text>
                  </View>
                  {counterparty.approvalConditions.map((condition, index) => (
                    <Text key={index} style={styles.conditionText}>• {condition}</Text>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <FileText size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Documents</Text>
              </View>

              {counterparty.documents.length > 0 ? (
                counterparty.documents.map(doc => (
                  <View key={doc.id} style={styles.documentCard}>
                    <View style={styles.documentIcon}>
                      <FileText size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName}>{doc.name}</Text>
                      <Text style={styles.documentMeta}>
                        {doc.type.replace(/_/g, ' ').toUpperCase()} • {new Date(doc.uploadedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    {doc.verified && <CheckCircle size={20} color="#10B981" />}
                  </View>
                ))
              ) : (
                <View style={styles.emptyDocuments}>
                  <FileText size={32} color="#374151" />
                  <Text style={styles.emptyDocumentsText}>No documents uploaded yet</Text>
                </View>
              )}
            </View>

            <View style={styles.metaCard}>
              <View style={styles.metaItem}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.metaText}>
                  Onboarded {new Date(counterparty.onboardedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
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
  content: {
    padding: 20,
  },
  headerCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  country: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  riskOverview: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  riskScoreCircle: {
    alignItems: 'center',
    marginBottom: 16,
  },
  riskScoreValue: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 4,
  },
  riskScoreLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  riskLevelBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  riskLevelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  riskMetrics: {
    gap: 16,
    marginBottom: 16,
  },
  riskMetricItem: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  riskMetricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskMetricLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  riskMetricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  riskBar: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
  },
  riskBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  conditionsCard: {
    backgroundColor: '#F59E0B20',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  conditionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  conditionsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
  },
  conditionText: {
    fontSize: 13,
    color: '#F59E0B',
    marginBottom: 4,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F620',
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  documentMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyDocuments: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#1F2937',
    borderRadius: 12,
  },
  emptyDocumentsText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
  },
  metaCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 16,
  },
});
