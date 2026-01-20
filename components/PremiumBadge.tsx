import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle, Clock, TrendingUp, Shield, Database } from 'lucide-react-native';
import type { CompanyVerification, MarketParticipant } from '@/types';

interface PremiumBadgeProps {
  verification?: CompanyVerification;
  compact?: boolean;
  participant?: MarketParticipant;
}

export default function PremiumBadge({ verification, compact = false, participant }: PremiumBadgeProps) {
  const hasBrandFetchData = participant?.data_quality_score !== undefined;
  const isBrandFetchClaimed = participant?.brandfetch_claimed === true;
  
  if (!verification && !hasBrandFetchData) return null;

  if (compact) {
    return (
      <View style={styles.compactRow}>
        {hasBrandFetchData && (
          <View style={styles.compactContainer}>
            <Database size={12} color="#3B82F6" />
            {participant.data_quality_score !== undefined && (
              <Text style={styles.compactScore}>{participant.data_quality_score}/100</Text>
            )}
          </View>
        )}
        {isBrandFetchClaimed && (
          <View style={styles.compactClaimed}>
            <Shield size={12} color="#10B981" />
            <Text style={styles.compactClaimedText}>Claimed</Text>
          </View>
        )}
        {verification && verification.responseRate !== undefined && verification.responseRate > 0 && (
          <View style={styles.compactContainer}>
            <CheckCircle size={12} color="#10B981" />
            <Text style={styles.compactRate}>{Math.round(verification.responseRate)}%</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {hasBrandFetchData && (
        <>
          <View style={styles.row}>
            <Database size={14} color="#3B82F6" />
            <Text style={styles.label}>Data Source</Text>
            <Text style={styles.value}>BrandFetch</Text>
          </View>
          {participant.data_quality_score !== undefined && (
            <View style={styles.row}>
              <TrendingUp size={14} color="#F59E0B" />
              <Text style={styles.label}>Quality Score</Text>
              <Text style={[
                styles.value,
                styles.rate,
                { color: participant.data_quality_score >= 70 ? '#10B981' : participant.data_quality_score >= 50 ? '#F59E0B' : '#EF4444' }
              ]}>
                {participant.data_quality_score}/100
              </Text>
            </View>
          )}
          {isBrandFetchClaimed && (
            <View style={styles.row}>
              <Shield size={14} color="#10B981" />
              <Text style={styles.label}>Status</Text>
              <Text style={[styles.value, { color: '#10B981' }]}>Claimed by Company</Text>
            </View>
          )}
          {participant.last_verified && (
            <View style={styles.row}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.label}>Last Verified</Text>
              <Text style={styles.value}>
                {new Date(participant.last_verified).toLocaleDateString()}
              </Text>
            </View>
          )}
        </>
      )}
      
      {verification && (
        <>
          <View style={styles.row}>
            <CheckCircle size={14} color="#10B981" />
            <Text style={styles.label}>User Verified</Text>
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
        </>
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
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#3B82F620',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  compactScore: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3B82F6',
  },
  compactClaimed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B98120',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  compactClaimedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
  compactRate: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
  },
});
