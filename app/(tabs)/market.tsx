// BRAND NEW Market Directory Component - Built from scratch for reliability
// V2.4 - Load full 1,207+ companies from Supabase - 2026-01-31-20:50
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { useState, useMemo, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { 
  Search, 
  Building2, 
  TrendingUp, 
  Briefcase,
  MapPin,
  Globe,
  X
} from 'lucide-react-native';
import { getAllMarketParticipants, loadImportedParticipants } from '@/mocks/market-participants';
import type { MarketParticipant, TradingHouse } from '@/types';

// Safe string conversion helper - NEVER crashes
const safeString = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  try {
    return String(value);
  } catch {
    return '';
  }
};

// Safe lowercase conversion - NEVER crashes
const safeLower = (value: any): string => {
  return safeString(value).toLowerCase();
};

export function MarketDirectoryScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'all' | 'trading_house' | 'broker' | 'platform'>('all');
  const [selectedParticipant, setSelectedParticipant] = useState<MarketParticipant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Load Supabase data when screen is focused
  useFocusEffect(
    useCallback(() => {
      console.log('[Market V2.4] 🔄 Loading Supabase data...');
      loadImportedParticipants()
        .then(() => {
          console.log('[Market V2.4] ✅ Supabase data loaded successfully');
          setDataLoaded(true);
          setRefreshKey(prev => prev + 1);
        })
        .catch((error) => {
          console.error('[Market V2.4] ❌ Error loading Supabase data:', error);
          setDataLoaded(true); // Still set to true to show base data
        });
    }, [])
  );

  // Load all participants - simple and safe
  const allParticipants = useMemo(() => {
    try {
      const participants = getAllMarketParticipants();
      if (!Array.isArray(participants)) {
        console.warn('[Market V2.4] getAllMarketParticipants returned non-array');
        return [];
      }
      console.log('[Market V2.4] 📊 Loaded', participants.length, 'participants from all sources');
      return participants;
    } catch (error) {
      console.error('[Market V2.4] Error loading participants:', error);
      return [];
    }
  }, [refreshKey]);

  // Filter participants - ULTRA DEFENSIVE
  const filteredParticipants = useMemo(() => {
    try {
      if (!Array.isArray(allParticipants)) {
        return [];
      }

      // If no search and no filter, return all
      if (!searchQuery && selectedType === 'all') {
        return allParticipants;
      }

      const queryLower = safeLower(searchQuery);

      return allParticipants.filter(participant => {
        // Safety check - skip if participant is invalid
        if (!participant || typeof participant !== 'object') {
          return false;
        }

        // Search filter - check multiple fields safely
        let matchesSearch = true;
        if (queryLower) {
          const name = safeLower(participant.name);
          const description = safeLower(participant.description);
          const headquarters = safeLower(participant.headquarters);
          const specialization = safeLower(participant.specialization);
          
          matchesSearch = 
            name.includes(queryLower) || 
            description.includes(queryLower) || 
            headquarters.includes(queryLower) ||
            specialization.includes(queryLower);
        }

        // Type filter
        const matchesType = selectedType === 'all' || participant.type === selectedType;

        return matchesSearch && matchesType;
      });
    } catch (error) {
      console.error('[Market V2] Error filtering participants:', error);
      return [];
    }
  }, [allParticipants, searchQuery, selectedType]);

  // Calculate stats safely
  const stats = useMemo(() => {
    try {
      if (!Array.isArray(allParticipants)) {
        return { total: 0, tradingHouses: 0, brokers: 0, platforms: 0 };
      }
      return {
        total: allParticipants.length,
        tradingHouses: allParticipants.filter(p => p?.type === 'trading_house').length,
        brokers: allParticipants.filter(p => p?.type === 'broker').length,
        platforms: allParticipants.filter(p => p?.type === 'platform').length,
      };
    } catch (error) {
      console.error('[Market V2] Error calculating stats:', error);
      return { total: 0, tradingHouses: 0, brokers: 0, platforms: 0 };
    }
  }, [allParticipants]);

  // Handle search change - simple and safe
  const handleSearchChange = (text: string) => {
    try {
      setSearchQuery(text || '');
    } catch (error) {
      console.error('[Market V2] Error in handleSearchChange:', error);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Open detail modal
  const handleOpenDetail = (participant: MarketParticipant) => {
    setSelectedParticipant(participant);
    setShowDetailModal(true);
  };

  // Close detail modal
  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedParticipant(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Market Directory</Text>
        <Text style={styles.subtitle}>Verified Trading Partners</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Building2 size={20} color="#3B82F6" />
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Verified</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={20} color="#10B981" />
          <Text style={styles.statValue}>{stats.tradingHouses}</Text>
          <Text style={styles.statLabel}>Traders</Text>
        </View>
        <View style={styles.statCard}>
          <Briefcase size={20} color="#F59E0B" />
          <Text style={styles.statValue}>{stats.brokers}</Text>
          <Text style={styles.statLabel}>Brokers</Text>
        </View>
        <View style={styles.statCard}>
          <Globe size={20} color="#8B5CF6" />
          <Text style={styles.statValue}>{stats.platforms}</Text>
          <Text style={styles.statLabel}>Platforms</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search companies..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={handleClearSearch}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Type Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'all' && styles.filterChipActive]}
          onPress={() => setSelectedType('all')}
        >
          <Text style={[styles.filterChipText, selectedType === 'all' && styles.filterChipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'trading_house' && styles.filterChipActive]}
          onPress={() => setSelectedType('trading_house')}
        >
          <Text style={[styles.filterChipText, selectedType === 'trading_house' && styles.filterChipTextActive]}>
            Trading Houses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'broker' && styles.filterChipActive]}
          onPress={() => setSelectedType('broker')}
        >
          <Text style={[styles.filterChipText, selectedType === 'broker' && styles.filterChipTextActive]}>
            Brokers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, selectedType === 'platform' && styles.filterChipActive]}
          onPress={() => setSelectedType('platform')}
        >
          <Text style={[styles.filterChipText, selectedType === 'platform' && styles.filterChipTextActive]}>
            Platforms
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filteredParticipants.length} results</Text>
      </View>

      {/* Company List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredParticipants.map((participant) => {
          const name = safeString(participant?.name);
          const headquarters = safeString(participant?.headquarters);
          const description = safeString(participant?.description);
          
          return (
            <TouchableOpacity
              key={participant?.id || Math.random()}
              style={styles.companyCard}
              onPress={() => handleOpenDetail(participant)}
            >
              <View style={styles.companyHeader}>
                <Text style={styles.companyName}>{name || 'Unknown Company'}</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓ Verified</Text>
                </View>
              </View>
              
              {headquarters ? (
                <View style={styles.companyDetail}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.companyDetailText}>{headquarters}</Text>
                </View>
              ) : null}
              
              {description ? (
                <Text style={styles.companyDescription} numberOfLines={2}>
                  {description}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
        
        {filteredParticipants.length === 0 && (
          <View style={styles.emptyState}>
            <Search size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>No companies found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search or filters</Text>
          </View>
        )}
      </ScrollView>

      {/* Simple Detail Modal */}
      {showDetailModal && selectedParticipant && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{safeString(selectedParticipant.name)}</Text>
              <TouchableOpacity onPress={handleCloseDetail}>
                <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Headquarters</Text>
                <Text style={styles.modalValue}>{safeString(selectedParticipant.headquarters) || 'N/A'}</Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Type</Text>
                <Text style={styles.modalValue}>{safeString(selectedParticipant.type) || 'N/A'}</Text>
              </View>
              
              {selectedParticipant.description && (
                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>Description</Text>
                  <Text style={styles.modalValue}>{safeString(selectedParticipant.description)}</Text>
                </View>
              )}
            </ScrollView>
            
            <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseDetail}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filterScroll: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  companyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },
  companyDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  companyDetailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  companyDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  modalBody: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  modalValue: {
    fontSize: 16,
    color: '#111827',
  },
  modalCloseButton: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    margin: 20,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

// Wrap in Error Boundary to catch crashes
import ErrorBoundary from '../../components/ErrorBoundary';

export default function MarketScreenWithErrorBoundary() {
  return (
    <ErrorBoundary componentName="Market Directory V2">
      <MarketDirectoryScreen />
    </ErrorBoundary>
  );
}
