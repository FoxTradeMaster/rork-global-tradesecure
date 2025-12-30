import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react-native';
import type { CompanyVerification } from '@/types';

interface PremiumBadgeProps {
  verification?: CompanyVerification;
  compact?: boolean;
}

export default function PremiumBadge({ verification, compact = false }: PremiumBadgeProps) {
  if (!verification) return null;

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <CheckCircle size={12} color="#10B981" />
        {verification.responseRate !== undefined && verification.responseRate > 0 && (
          <Text style={styles.compactRate}>{Math.round(verification.responseRate)}%</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <CheckCircle size={14} color="#10B981" />
        <Text style={styles.label}>Verified</Text>
        <Text style={styles.value}>
          {verification.verificationDate.toLocaleDateString()}
        </Text>
      </View>
      
      {verification.lastContactDate && (
        <View style={styles.row}>
          <Clock size={14} color="#3B82F6" />
          <Text style={styles.label}>Last Contact</Text>
          <Text style={styles.value}>
            {verification.lastContactDate.toLocaleDateString()}
          </Text>
        </View>
      )}
      
      {verification.responseRate !== undefined && verification.responseRate > 0 && (
        <View style={styles.row}>
          <TrendingUp size={14} color="#F59E0B" />
          <Text style={styles.label}>Response Rate</Text>
          <Text style={[
            styles.value,
            styles.rate,
            { color: verification.responseRate >= 70 ? '#10B981' : verification.responseRate >= 40 ? '#F59E0B' : '#EF4444' }
          ]}>
            {Math.round(verification.responseRate)}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#374151',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  value: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 'auto',
  },
  rate: {
    fontWeight: '700',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B98120',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  compactRate: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
});
