import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrading } from '@/contexts/TradingContext';
import { 
  AlertCircle, 
  Clock, 
  FileText, 
  MapPin, 
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle
} from 'lucide-react-native';

export default function TradeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { trades } = useTrading();

  const trade = trades.find(t => t.id === id);

  if (!trade) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <AlertCircle size={48} color="#EF4444" />
            <Text style={styles.errorText}>Trade not found</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    if (['active', 'in_transit', 'delivered', 'settled'].includes(status)) return '#10B981';
    if (['financing_pending', 'legal_review', 'compliance_check'].includes(status)) return '#F59E0B';
    return '#3B82F6';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.headerCard}>
              <View style={styles.headerTop}>
                <View>
                  <Text style={styles.commodity}>{trade.commodity.replace(/_/g, ' ').toUpperCase()}</Text>
                  <Text style={styles.counterparty}>{trade.counterpartyName}</Text>
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

              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trade.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(trade.status) }]}>
                  {trade.status.replace(/_/g, ' ').toUpperCase()}
                </Text>
              </View>
            </View>

            {trade.alerts.length > 0 && (
              <View style={styles.alertsSection}>
                {trade.alerts.map(alert => (
                  <View key={alert.id} style={styles.alertCard}>
                    <AlertCircle size={20} color={
                      alert.type === 'critical' ? '#EF4444' :
                      alert.type === 'warning' ? '#F59E0B' :
                      '#3B82F6'
                    } />
                    <View style={styles.alertContent}>
                      <Text style={styles.alertMessage}>{alert.message}</Text>
                      <Text style={styles.alertTime}>
                        {new Date(alert.timestamp).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trade Value</Text>
              <View style={styles.valueCard}>
                <DollarSign size={32} color="#10B981" />
                <View style={styles.valueInfo}>
                  <Text style={styles.valueAmount}>
                    ${trade.totalValue.toLocaleString()} {trade.currency}
                  </Text>
                  <Text style={styles.valueBreakdown}>
                    {trade.quantity.toLocaleString()} {trade.unit} × ${trade.pricePerUnit.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {trade.commissionRate && trade.commissionAmount && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Facilitation Commission</Text>
                <View style={styles.commissionSection}>
                  <View style={styles.commissionCard}>
                    <View style={styles.commissionHeader}>
                      <Text style={styles.commissionRate}>{trade.commissionRate}%</Text>
                      <View style={[
                        styles.commissionBadge,
                        { backgroundColor: trade.commissionPaid ? '#10B98120' : '#F59E0B20' }
                      ]}>
                        <Text style={[
                          styles.commissionBadgeText,
                          { color: trade.commissionPaid ? '#10B981' : '#F59E0B' }
                        ]}>
                          {trade.commissionPaid ? 'PAID' : 'PENDING'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.commissionAmount}>
                      ${trade.commissionAmount.toLocaleString()} {trade.currency}
                    </Text>
                    {trade.commissionPaid && trade.commissionPaidAt && (
                      <Text style={styles.commissionPaidDate}>
                        Paid on {new Date(trade.commissionPaidAt).toLocaleDateString()}
                      </Text>
                    )}
                    {!trade.commissionPaid && ['delivered', 'settled'].includes(trade.status) && (
                      <Text style={styles.commissionNote}>
                        Payment due upon trade settlement
                      </Text>
                    )}
                    <View style={styles.facilitatorBanner}>
                      <Text style={styles.facilitatorText}>Facilitated by Masters Energy Inc. USA</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trade Details</Text>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <TrendingUp size={20} color="#3B82F6" />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>Quantity</Text>
                    <Text style={styles.detailValue}>{trade.quantity.toLocaleString()} {trade.unit}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <MapPin size={20} color="#8B5CF6" />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>INCOTERM</Text>
                    <Text style={styles.detailValue}>{trade.incoterm}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <Calendar size={20} color="#F59E0B" />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>Delivery Window</Text>
                    <Text style={styles.detailValue}>
                      {new Date(trade.deliveryWindow.start).toLocaleDateString()} - {new Date(trade.deliveryWindow.end).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <View style={styles.detailIcon}>
                    <Clock size={20} color="#10B981" />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>Created</Text>
                    <Text style={styles.detailValue}>
                      {new Date(trade.createdAt).toLocaleDateString()}
                    </Text>
                    <Text style={styles.detailSubvalue}>by {trade.createdBy}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Documents</Text>
              {trade.documents.length > 0 ? (
                trade.documents.map(doc => (
                  <View key={doc.id} style={styles.documentCard}>
                    <View style={styles.documentIcon}>
                      <FileText size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName}>{doc.name}</Text>
                      <Text style={styles.documentMeta}>
                        {doc.type.replace(/_/g, ' ').toUpperCase()} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
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
    padding: 20,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  commodity: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  counterparty: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  riskText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  alertsSection: {
    marginBottom: 20,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  valueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  valueInfo: {
    flex: 1,
  },
  valueAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  valueBreakdown: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  detailSubvalue: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
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
  commissionSection: {
    gap: 12,
  },
  commissionCard: {
    backgroundColor: '#8B5CF620',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  commissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  commissionRate: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  commissionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  commissionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  commissionAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  commissionPaidDate: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  commissionNote: {
    fontSize: 14,
    color: '#F59E0B',
    fontStyle: 'italic' as const,
  },
  facilitatorBanner: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#8B5CF640',
    alignItems: 'center',
  },
  facilitatorText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600' as const,
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
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
