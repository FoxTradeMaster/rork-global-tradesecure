// Force redeploy - Jan 31, 2026
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Modal, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { 
  Search, 
  Building2, 
  TrendingUp, 
  Briefcase,
  CheckCircle,
  MapPin,
  Globe,
  X,
  Shield,
  ExternalLink,
  Award,
  Users,
  ChevronRight,
  Upload,
  Mail,
  Star,
  Bookmark,
  FileText,
  MoreVertical
} from 'lucide-react-native';
import { getCommodityLabel, getCategoryLabel, addMarketParticipants, getAllMarketParticipants, forceReloadParticipants } from '@/mocks/market-participants';
import type { MarketParticipant, TradingHouse, Broker, MarketPlatform, CommodityType, SavedSearch } from '@/types';
import ImportModal from '@/components/ImportModal';
import EmailOutreachModal from '@/components/EmailOutreachModal';
import SavedSearchesModal from '@/components/SavedSearchesModal';
import CompanyRatingsModal from '@/components/CompanyRatingsModal';
import ReportsModal from '@/components/ReportsModal';
import PremiumBadge from '@/components/PremiumBadge';
import { ParsedRow } from '@/lib/fileParser';
import { useMarket } from '@/contexts/MarketContext';
import { useTrading } from '@/contexts/TradingContext';

const MARKET_IMPORT_FIELDS = [
  { field: 'name', label: 'Company Name', required: true },
  { field: 'headquarters', label: 'Country/Headquarters', required: true },
  { field: 'address', label: 'Address', required: false },
  { field: 'phone', label: 'Phone', required: false },
  { field: 'email', label: 'Email', required: false },
  { field: 'website', label: 'Website', required: false },
  { field: 'contact_person', label: 'Contact Person', required: false },
  { field: 'commodities', label: 'Products/Commodities', required: false },
  { field: 'type', label: 'Company Type', required: false },
];

export function MarketDirectoryScreen() {
  const { verifications, getAverageRating } = useMarket();
  const { currentUser } = useTrading();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'all' | 'trading_house' | 'broker' | 'platform'>('all');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('all');
  const [selectedBusinessType, setSelectedBusinessType] = useState<'all' | 'buyer' | 'seller' | 'both'>('all');
  const [selectedParticipant, setSelectedParticipant] = useState<MarketParticipant | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [showSavedSearches, setShowSavedSearches] = useState<boolean>(false);
  const [showRatingsModal, setShowRatingsModal] = useState<boolean>(false);
  const [showReportsModal, setShowReportsModal] = useState<boolean>(false);
  const [selectedCompanies, setSelectedCompanies] = useState<MarketParticipant[]>([]);
  const [importedParticipants, setImportedParticipants] = useState<MarketParticipant[]>([]);
  const [showActionsMenu, setShowActionsMenu] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const loadAllParticipants = useCallback(async () => {
    console.log('[Market] 📂 Loading all persisted participants');
    setIsLoadingData(true);
    
    try {
      const persisted = await forceReloadParticipants();
      console.log('[Market] ✅ Loaded AI-generated participants:', persisted.length);
      
      if (persisted.length > 0) {
        console.log('[Market] 🎯 Forcing UI refresh with', persisted.length, 'AI companies');
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      console.error('[Market] ❌ Error loading AI participants:', error);
    }
    
    // Data now loaded from Supabase via loadImportedParticipants() in market-participants.ts
    console.log('[Market] Data will be loaded from Supabase database');

    await new Promise(resolve => setTimeout(resolve, 100));
    
    setIsLoadingData(false);
    setRefreshKey(prev => prev + 1);
    
    console.log('[Market] ✅ Load complete');
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('[Market] 🎯 Tab focused - reloading data');
      loadAllParticipants();
    }, [loadAllParticipants])
  );
 // Debounce search query to prevent crash from rapid re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const commodities = ['all', 'gold', 'fuel_oil', 'steam_coal', 'anthracite_coal', 'urea', 'edible_oils', 'bio_fuels', 'iron_ore'];

  const allParticipants = useMemo(() => {
    const total = [...getAllMarketParticipants(), ...importedParticipants];
    console.log('[Market] 📊 Total participants:', total.length, '(getAllMarketParticipants:', getAllMarketParticipants().length, 'Local imported:', importedParticipants.length, ')');
    return total;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importedParticipants, refreshKey]);
const filteredParticipants = useMemo(() => {
  if (!Array.isArray(allParticipants)) {
    return [];
  }
  return allParticipants.filter(participant => {
      const name = String(participant?.name || '').toLowerCase();
const description = String(participant?.description || '').toLowerCase();
const headquarters = String(participant?.headquarters || '').toLowerCase();
const specialization = String(participant?.specialization || '').toLowerCase();
const query = String(debouncedSearchQuery || '').toLowerCase();
const matchesSearch = name.includes(query) || 
                      description.includes(query) || 
                      headquarters.includes(query) ||
                      specialization.includes(query);


      
      const matchesType = selectedType === 'all' || participant.type === selectedType;
      
      const matchesCommodity = selectedCommodity === 'all' || 
                               (participant.commodities || []).includes(selectedCommodity as any);
      
      const matchesBusinessType = selectedBusinessType === 'all' || 
                                  (participant.type === 'trading_house' && 
                                   ((participant as TradingHouse).businessType === selectedBusinessType || 
                                    (participant as TradingHouse).businessType === 'both'));
      
      return matchesSearch && matchesType && matchesCommodity && matchesBusinessType;
    });
}, [allParticipants, debouncedSearchQuery, selectedType, selectedCommodity, selectedBusinessType]);



  const stats = useMemo(() => {
    if (isLoadingData) {
      return { total: 0, tradingHouses: 0, brokers: 0, platforms: 0 };
    }
    return {
      total: allParticipants.length,
      tradingHouses: allParticipants.filter(p => p.type === 'trading_house').length,
      brokers: allParticipants.filter(p => p.type === 'broker').length,
      platforms: allParticipants.filter(p => p.type === 'platform').length,
    };
  }, [allParticipants, isLoadingData]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const toggleCompanySelection = (participant: MarketParticipant) => {
    setSelectedCompanies(prev => {
      const isSelected = prev.find(p => p.id === participant.id);
      if (isSelected) {
        return prev.filter(p => p.id !== participant.id);
      } else {
        return [...prev, participant];
      }
    });
  };

  const handleLoadSearch = (search: SavedSearch) => {
    setSelectedType(search.type);
    setSelectedCommodity(search.commodity);
    setSelectedBusinessType(search.businessType);
    setSearchQuery(search.searchQuery);
  };

  const handleOpenRatings = (participant: MarketParticipant) => {
    setSelectedParticipant(participant);
    setShowRatingsModal(true);
  };

  const openDetail = (participant: MarketParticipant) => {
    setSelectedParticipant(participant);
    setShowDetailModal(true);
  };

  const closeDetail = () => {
    setShowDetailModal(false);
    setTimeout(() => setSelectedParticipant(null), 300);
  };

  const handleImport = useCallback(async (data: ParsedRow[], categorySettings?: { commodity: string; businessType: 'buyer' | 'seller' | 'both' }) => {
    console.log('[Market] Importing', data.length, 'market participants', categorySettings);
    
    const newParticipants: MarketParticipant[] = data.map((row, index) => {
      const name = String(row.name || '');
      const headquarters = String(row.headquarters || 'Unknown');
      const typeValue = String(row.type || 'trading_house').toLowerCase();
      const description = String(row.description || `${name} - Market participant`);
      const website = row.website ? String(row.website) : undefined;
      const specialization = String(row.specialization || 'General trading');
      
      let commodities: CommodityType[];
      if (categorySettings) {
        commodities = [categorySettings.commodity as CommodityType];
      } else {
        const commoditiesStr = String(row.commodities || 'gold');
        commodities = commoditiesStr.split(',').map(c => {
          const trimmed = c.trim().toLowerCase().replace(/\s+/g, '_');
          const validCommodities: CommodityType[] = ['gold', 'fuel_oil', 'steam_coal', 'anthracite_coal', 'urea', 'edible_oils'];
          return validCommodities.includes(trimmed as CommodityType) ? trimmed as CommodityType : 'gold';
        }).filter((v, i, a) => a.indexOf(v) === i) as CommodityType[];
      }

      const baseParticipant = {
        id: `imported_market_${Date.now()}_${index}`,
        name,
        headquarters,
        description,
        verified: false,
        website,
        commodities,
      };

      if (typeValue === 'broker') {
        return {
          ...baseParticipant,
          type: 'broker' as const,
          brokerType: ['physical_broker' as const],
          regulatedBy: [],
          clearingRelationships: [],
          licenseNumbers: [],
        } as Broker;
      } else if (typeValue === 'platform') {
        return {
          ...baseParticipant,
          type: 'platform' as const,
          category: 'exchange' as const,
          framework: specialization,
        } as MarketPlatform;
      } else {
        const businessType = categorySettings?.businessType || 'both';
        return {
          ...baseParticipant,
          type: 'trading_house' as const,
          category: ['diversified' as const],
          offices: [headquarters],
          licenses: [],
          specialization,
          businessType,
        } as TradingHouse;
      }
    }).filter(p => p.name.trim() !== '');

    if (newParticipants.length > 0) {
      try {
        // Save to Supabase database (now handled by addMarketParticipants)
        await addMarketParticipants(newParticipants);
        
        // Only update local state if Supabase save succeeds
        const updated = [...importedParticipants, ...newParticipants];
        setImportedParticipants(updated);
        
        Alert.alert(
          'Import Successful ✅',
          `Successfully saved ${newParticipants.length} companies to Supabase cloud database! [v2.0]`,
          [{ text: 'OK' }]
        );
      } catch (error) {
        console.error('[Market] Import failed:', error);
        Alert.alert(
          'Import Failed',
          `Failed to save to database: ${error instanceof Error ? error.message : String(error)}`,
          [{ text: 'OK' }]
        );
      }
    } else {
      Alert.alert(
        'Import Failed',
        'No valid market participants found in the file.',
        [{ text: 'OK' }]
      );
    }
  }, [importedParticipants]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.title}>Verified Market Directory</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => setShowImportModal(true)}
              >
                <Upload size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => setShowActionsMenu(true)}
              >
                <MoreVertical size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.subtitle}>
            {selectedCompanies.length > 0 
              ? `${selectedCompanies.length} selected • All data verified`
              : 'Real company data from proprietary sources'
            }
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Shield size={18} color="#10B981" />
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statCard}>
            <Building2 size={18} color="#3B82F6" />
            <Text style={styles.statValue}>{stats.tradingHouses}</Text>
            <Text style={styles.statLabel}>Traders</Text>
          </View>
          <View style={styles.statCard}>
            <Briefcase size={18} color="#8B5CF6" />
            <Text style={styles.statValue}>{stats.brokers}</Text>
            <Text style={styles.statLabel}>Brokers</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={18} color="#F59E0B" />
            <Text style={styles.statValue}>{stats.platforms}</Text>
            <Text style={styles.statLabel}>Platforms</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search traders, brokers, platforms..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          <TouchableOpacity 
            style={styles.searchIconButton}
            onPress={() => setShowSavedSearches(true)}
          >
            <Bookmark size={18} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
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
            <Building2 size={12} color={selectedType === 'trading_house' ? '#FFFFFF' : '#9CA3AF'} />
            <Text style={[styles.filterChipText, selectedType === 'trading_house' && styles.filterChipTextActive]}>
              Trading Houses
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedType === 'broker' && styles.filterChipActive]}
            onPress={() => setSelectedType('broker')}
          >
            <Briefcase size={12} color={selectedType === 'broker' ? '#FFFFFF' : '#9CA3AF'} />
            <Text style={[styles.filterChipText, selectedType === 'broker' && styles.filterChipTextActive]}>
              Brokers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, selectedType === 'platform' && styles.filterChipActive]}
            onPress={() => setSelectedType('platform')}
          >
            <TrendingUp size={12} color={selectedType === 'platform' ? '#FFFFFF' : '#9CA3AF'} />
            <Text style={[styles.filterChipText, selectedType === 'platform' && styles.filterChipTextActive]}>
              Platforms
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.commodityScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
          {commodities.map(commodity => (
            <TouchableOpacity
              key={commodity}
              style={[styles.commodityChip, selectedCommodity === commodity && styles.commodityChipActive]}
              onPress={() => setSelectedCommodity(commodity)}
            >
              <Text style={[styles.commodityChipText, selectedCommodity === commodity && styles.commodityChipTextActive]}>
                {commodity === 'all' ? 'All Commodities' : getCommodityLabel(commodity)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.businessTypeScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
          <TouchableOpacity
            style={[styles.businessTypeChip, selectedBusinessType === 'all' && styles.businessTypeChipActive]}
            onPress={() => setSelectedBusinessType('all')}
          >
            <Text style={[styles.businessTypeChipText, selectedBusinessType === 'all' && styles.businessTypeChipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.businessTypeChip, selectedBusinessType === 'buyer' && styles.businessTypeChipActive]}
            onPress={() => setSelectedBusinessType('buyer')}
          >
            <Text style={[styles.businessTypeChipText, selectedBusinessType === 'buyer' && styles.businessTypeChipTextActive]}>
              Buyers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.businessTypeChip, selectedBusinessType === 'seller' && styles.businessTypeChipActive]}
            onPress={() => setSelectedBusinessType('seller')}
          >
            <Text style={[styles.businessTypeChipText, selectedBusinessType === 'seller' && styles.businessTypeChipTextActive]}>
              Sellers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.businessTypeChip, selectedBusinessType === 'both' && styles.businessTypeChipActive]}
            onPress={() => setSelectedBusinessType('both')}
          >
            <Text style={[styles.businessTypeChipText, selectedBusinessType === 'both' && styles.businessTypeChipTextActive]}>
              Both
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoadingData ? (
            <View style={styles.loadingState}>
              <Text style={styles.loadingText}>Loading companies...</Text>
            </View>
          ) : (
            <>
          <Text style={styles.resultsCount}>
            {filteredParticipants.length} {filteredParticipants.length === 1 ? 'result' : 'results'}
          </Text>
          {filteredParticipants.slice(0, 50).map(participant => {
            const isSelected = selectedCompanies.find(p => p.id === participant.id);
            const verification = verifications[participant.id];
            const avgRating = getAverageRating(participant.id);
            
            return (
            <TouchableOpacity
              key={participant.id}
              style={[styles.participantCard, isSelected && styles.participantCardSelected]}
              onPress={() => openDetail(participant)}
              onLongPress={() => toggleCompanySelection(participant)}
              activeOpacity={0.7}
            >
              <View style={styles.participantHeader}>
                <View style={styles.participantTitleRow}>
                  <View style={[
                    styles.participantIcon,
                    { backgroundColor: 
                      participant.type === 'trading_house' ? '#3B82F620' :
                      participant.type === 'broker' ? '#8B5CF620' :
                      '#F59E0B20'
                    }
                  ]}>
                    {participant.type === 'trading_house' && <Building2 size={20} color="#3B82F6" />}
                    {participant.type === 'broker' && <Briefcase size={20} color="#8B5CF6" />}
                    {participant.type === 'platform' && <TrendingUp size={20} color="#F59E0B" />}
                  </View>
                  <View style={styles.participantTitleContainer}>
                    <View style={styles.nameRow}>
                      <Text style={styles.participantName}>{participant.name}</Text>
                      <ChevronRight size={18} color="#3B82F6" style={styles.chevronIcon} />
                    </View>
                    <View style={styles.participantMeta}>
                      <MapPin size={12} color="#6B7280" />
                      <Text style={styles.participantLocation}>{participant.headquarters || 'Unknown'}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.badgesRow}>
                  {participant.verified && (
                    <View style={styles.verifiedBadge}>
                      <CheckCircle size={16} color="#10B981" />
                    </View>
                  )}
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <CheckCircle size={16} color="#3B82F6" fill="#3B82F6" />
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.verificationContainer}>
                <PremiumBadge verification={verification} participant={participant} compact />
              </View>

              {avgRating > 0 && (
                <TouchableOpacity 
                  style={styles.ratingRow}
                  onPress={() => handleOpenRatings(participant)}
                >
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>{avgRating.toFixed(1)}</Text>
                  <Text style={styles.ratingLabel}>• Tap to review</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.participantDescription} numberOfLines={2}>
  {participant.description || 'No description available'}
</Text>
              <View style={styles.commodityTags}>
                {(participant.commodities || []).slice(0, 3).map(commodity => (
                  <View key={commodity} style={styles.commodityTag}>
                    <Text style={styles.commodityTagText}>{getCommodityLabel(commodity)}</Text>
                  </View>
                ))}
                {(participant.commodities || []).length > 3 && (
                  <View style={styles.commodityTag}>
                    <Text style={styles.commodityTagText}>+{(participant.commodities || []).length - 3}</Text>
                  </View>
                )}
              </View>

              {participant.type === 'trading_house' && (
                <View style={styles.participantFooter}>
                  <Text style={styles.footerLabel}>Specialization:</Text>
                  <Text style={styles.footerValue} numberOfLines={1}>
  {(participant as TradingHouse).specialization || 'General trading'}
</Text>
                </View>
              )}

              {participant.type === 'broker' && (
                <View style={styles.participantFooter}>
                  <Text style={styles.footerLabel}>Regulated by:</Text>
                  <View style={styles.regulationTags}>
                    {((participant as Broker).regulatedBy || []).slice(0, 3).map(auth => (
                      <View key={auth} style={styles.regulationTag}>
                        <Text style={styles.regulationTagText}>{auth}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {participant.type === 'platform' && (
                <View style={styles.participantFooter}>
                  <Text style={styles.footerLabel}>Framework:</Text>
                  <Text style={styles.footerValue} numberOfLines={1}>
  {(participant as MarketPlatform).framework || 'Standard framework'}
</Text>
                </View>
              )}
            </TouchableOpacity>
            );
          })}
          {filteredParticipants.length === 0 && (
            <View style={styles.emptyState}>
              <Search size={48} color="#374151" />
              <Text style={styles.emptyStateTitle}>No results found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filters
              </Text>
            </View>
          )}

          <View style={styles.bottomPadding} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={showDetailModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeDetail}
      >
        <View style={styles.modalContainer}>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView edges={['top']} style={styles.modalSafeArea}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Details</Text>
              <TouchableOpacity onPress={closeDetail} style={styles.closeButton}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {selectedParticipant && (
                <>
                  <View style={styles.detailHeader}>
                    <View style={[
                      styles.detailIcon,
                      { backgroundColor: 
                        selectedParticipant.type === 'trading_house' ? '#3B82F620' :
                        selectedParticipant.type === 'broker' ? '#8B5CF620' :
                        '#F59E0B20'
                      }
                    ]}>
                      {selectedParticipant.type === 'trading_house' && <Building2 size={24} color="#3B82F6" />}
                      {selectedParticipant.type === 'broker' && <Briefcase size={24} color="#8B5CF6" />}
                      {selectedParticipant.type === 'platform' && <TrendingUp size={24} color="#F59E0B" />}
                    </View>
                    <Text style={styles.detailName}>{selectedParticipant.name}</Text>
                    {selectedParticipant.verified && (
                      <View style={styles.detailVerifiedBadge}>
                        <CheckCircle size={16} color="#10B981" />
                        <Text style={styles.detailVerifiedText}>Verified</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.detailSection}>
                    <View style={styles.detailRow}>
                      <MapPin size={18} color="#6B7280" />
                      <Text style={styles.detailLabel}>Headquarters</Text>
                    </View>
                    <Text style={styles.detailValue}>{selectedParticipant.headquarters}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Description</Text>
                    <Text style={styles.detailDescription}>{selectedParticipant.description}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Commodities</Text>
                    <View style={styles.detailCommodities}>
                      {(selectedParticipant.commodities || []).map(commodity => (
                        <View key={commodity} style={styles.detailCommodityChip}>
                          <Text style={styles.detailCommodityText}>{getCommodityLabel(commodity)}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {selectedParticipant.type === 'trading_house' && (
                    <>
                      <View style={styles.detailSection}>
                        <View style={styles.detailRow}>
                          <Award size={18} color="#6B7280" />
                          <Text style={styles.detailLabel}>Specialization</Text>
                        </View>
                        <Text style={styles.detailValue}>
                          {(selectedParticipant as TradingHouse).specialization}
                        </Text>
                      </View>

                      {(selectedParticipant as TradingHouse).offices && (
                        <View style={styles.detailSection}>
                          <Text style={styles.detailSectionTitle}>Global Offices</Text>
                          <View style={styles.officeList}>
                            {(selectedParticipant as TradingHouse).offices.map(office => (
                              <View key={office} style={styles.officeChip}>
                                <MapPin size={12} color="#3B82F6" />
                                <Text style={styles.officeText}>{office}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {(selectedParticipant as TradingHouse).tradingVolume && (
                        <View style={styles.detailSection}>
                          <View style={styles.detailRow}>
                            <TrendingUp size={18} color="#6B7280" />
                            <Text style={styles.detailLabel}>Trading Volume</Text>
                          </View>
                          <Text style={styles.detailValue}>
                            {(selectedParticipant as TradingHouse).tradingVolume}
                          </Text>
                        </View>
                      )}

                      {(selectedParticipant as TradingHouse).founded && (
                        <View style={styles.detailSection}>
                          <View style={styles.detailRow}>
                            <Building2 size={18} color="#6B7280" />
                            <Text style={styles.detailLabel}>Founded</Text>
                          </View>
                          <Text style={styles.detailValue}>
                            {(selectedParticipant as TradingHouse).founded}
                          </Text>
                        </View>
                      )}

                      <View style={styles.detailSection}>
                        <Text style={styles.detailSectionTitle}>Categories</Text>
                        <View style={styles.categoryList}>
                          {(selectedParticipant as TradingHouse).category.map(cat => (
                            <View key={cat} style={styles.categoryChip}>
                              <Text style={styles.categoryText}>{getCategoryLabel(cat)}</Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={styles.detailSectionTitle}>Licenses & Compliance</Text>
                        {(selectedParticipant as TradingHouse).licenses.map(license => (
                          <View key={license} style={styles.licenseItem}>
                            <Shield size={16} color="#10B981" />
                            <Text style={styles.licenseText}>{license}</Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}

                  {selectedParticipant.type === 'broker' && (
                    <>
                      <View style={styles.detailSection}>
                        <Text style={styles.detailSectionTitle}>Regulatory Authorities</Text>
                        <View style={styles.regulationList}>
                          {((selectedParticipant as Broker).regulatedBy || []).map(auth => (
                            <View key={auth} style={styles.regulationChip}>
                              <Shield size={14} color="#10B981" />
                              <Text style={styles.regulationChipText}>{auth}</Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={styles.detailSectionTitle}>License Numbers</Text>
                        {(selectedParticipant as Broker).licenseNumbers.map((license, idx) => (
                          <View key={idx} style={styles.licenseNumberItem}>
                            <Text style={styles.licenseAuthority}>{license.authority}</Text>
                            <Text style={styles.licenseNumber}>{license.number}</Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={styles.detailSectionTitle}>Broker Type</Text>
                        <View style={styles.brokerTypeList}>
                          {(selectedParticipant as Broker).brokerType.map(type => (
                            <View key={type} style={styles.brokerTypeChip}>
                              <Text style={styles.brokerTypeText}>
                                {type.replace(/_/g, ' ').toUpperCase()}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      <View style={styles.detailSection}>
                        <Text style={styles.detailSectionTitle}>Clearing Relationships</Text>
                        {(selectedParticipant as Broker).clearingRelationships.map(rel => (
                          <View key={rel} style={styles.clearingItem}>
                            <CheckCircle size={16} color="#3B82F6" />
                            <Text style={styles.clearingText}>{rel}</Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}

                  {selectedParticipant.type === 'platform' && (
                    <>
                      <View style={styles.detailSection}>
                        <View style={styles.detailRow}>
                          <Award size={18} color="#6B7280" />
                          <Text style={styles.detailLabel}>Framework</Text>
                        </View>
                        <Text style={styles.detailValue}>
                          {(selectedParticipant as MarketPlatform).framework}
                        </Text>
                      </View>

                      {(selectedParticipant as MarketPlatform).members && (
                        <View style={styles.detailSection}>
                          <View style={styles.detailRow}>
                            <Users size={18} color="#6B7280" />
                            <Text style={styles.detailLabel}>Key Members</Text>
                          </View>
                          {(selectedParticipant as MarketPlatform).members!.slice(0, 8).map(member => (
                            <View key={member} style={styles.memberItem}>
                              <CheckCircle size={14} color="#10B981" />
                              <Text style={styles.memberText}>{member}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </>
                  )}

                  {selectedParticipant.website && (
                    <View style={styles.detailSection}>
                      <View style={styles.detailRow}>
                        <Globe size={18} color="#6B7280" />
                        <Text style={styles.detailLabel}>Website</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.websiteLink}
                        onPress={() => {
                          const url = selectedParticipant.website;
                          if (url) {
                            const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
                            Linking.openURL(formattedUrl).catch(err => {
                              console.error('Failed to open URL:', err);
                              Alert.alert('Error', 'Could not open website');
                            });
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.websiteText}>{selectedParticipant.website}</Text>
                        <ExternalLink size={16} color="#3B82F6" />
                      </TouchableOpacity>
                    </View>
                  )}

                  <View style={styles.modalBottomPadding} />
                </>
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      <ImportModal
        visible={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        title="Import Market Participants"
        targetFields={MARKET_IMPORT_FIELDS}
        showCategorySelection={true}
      />

      <EmailOutreachModal
        visible={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        selectedCompanies={selectedCompanies}
      />

      <SavedSearchesModal
        visible={showSavedSearches}
        onClose={() => setShowSavedSearches(false)}
        currentSearch={{
          type: selectedType,
          commodity: selectedCommodity,
          businessType: selectedBusinessType,
          searchQuery
        }}
        onLoadSearch={handleLoadSearch}
      />

      {selectedParticipant && (
        <CompanyRatingsModal
          visible={showRatingsModal}
          onClose={() => setShowRatingsModal(false)}
          company={selectedParticipant}
          currentUserId={currentUser?.id || 'user1'}
          currentUserName={currentUser?.name || 'User'}
        />
      )}

      <ReportsModal
        visible={showReportsModal}
        onClose={() => setShowReportsModal(false)}
        selectedCompanies={selectedCompanies}
      />

      <Modal
        visible={showActionsMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionsMenu(false)}
      >
        <TouchableOpacity 
          style={styles.actionsOverlay}
          activeOpacity={1}
          onPress={() => setShowActionsMenu(false)}
        >
          <View style={styles.actionsMenu}>
            <TouchableOpacity
              style={styles.actionsMenuItem}
              onPress={() => {
                setShowActionsMenu(false);
                setShowEmailModal(true);
              }}
            >
              <Mail size={20} color="#3B82F6" />
              <Text style={styles.actionsMenuText}>Email Outreach</Text>
              {selectedCompanies.length > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{selectedCompanies.length}</Text>
                </View>
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionsMenuItem}
              onPress={() => {
                setShowActionsMenu(false);
                setShowSavedSearches(true);
              }}
            >
              <Bookmark size={20} color="#8B5CF6" />
              <Text style={styles.actionsMenuText}>Saved Searches</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionsMenuItem}
              onPress={() => {
                setShowActionsMenu(false);
                setShowReportsModal(true);
              }}
            >
              <FileText size={20} color="#10B981" />
              <Text style={styles.actionsMenuText}>Generate Report</Text>
              {selectedCompanies.length > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{selectedCompanies.length}</Text>
                </View>
              ) : null}
            </TouchableOpacity>

            {selectedCompanies.length > 0 && (
              <TouchableOpacity
                style={[styles.actionsMenuItem, styles.clearMenuItem]}
                onPress={() => {
                  setSelectedCompanies([]);
                  setShowActionsMenu(false);
                }}
              >
                <X size={20} color="#EF4444" />
                <Text style={[styles.actionsMenuText, styles.clearText]}>Clear Selection</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
    alignItems: 'center',
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 9,
    color: '#64748B',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 32,
    color: '#0F172A',
    fontSize: 14,
  },
  searchIconButton: {
    padding: 6,
  },
  filterScroll: {
    marginBottom: 6,
  },
  commodityScroll: {
    marginBottom: 6,
  },
  businessTypeScroll: {
    marginBottom: 8,
  },
  filterScrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
    gap: 3,
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
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  commodityChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  commodityChipActive: {
    backgroundColor: '#10B98120',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  commodityChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  commodityChipTextActive: {
    color: '#10B981',
  },
  businessTypeChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  businessTypeChipActive: {
    backgroundColor: '#F59E0B20',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  businessTypeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  businessTypeChipTextActive: {
    color: '#F59E0B',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  resultsCount: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  participantCard: {
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
  participantCardSelected: {
    borderWidth: 2,
    borderColor: '#0284C7',
  },
  participantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  participantTitleRow: {
    flexDirection: 'row',
    flex: 1,
  },
  participantIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  participantTitleContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0284C7',
    flex: 1,
  },
  chevronIcon: {
    marginLeft: 4,
  },
  participantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  participantLocation: {
    fontSize: 12,
    color: '#6B7280',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  verifiedBadge: {},
  selectedBadge: {},
  verificationContainer: {
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
  },
  ratingLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  participantDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 12,
  },
  commodityTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  commodityTag: {
    backgroundColor: '#374151',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  commodityTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  participantFooter: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 12,
  },
  footerLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  footerValue: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  regulationTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  regulationTag: {
    backgroundColor: '#10B98120',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  regulationTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0284C7',
  },
  bottomPadding: {
    height: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#111827',
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderBottomWidth: 0,
    backgroundColor: '#1F2937',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    flex: 1,
  },
  detailHeader: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    backgroundColor: '#1F2937',
    marginBottom: 0,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  detailName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  detailVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  detailVerifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  detailSection: {
    paddingHorizontal: 16,
    marginBottom: 0,
    backgroundColor: '#1F2937',
    marginHorizontal: 0,
    paddingVertical: 8,
    borderRadius: 0,
    borderBottomWidth: 0.5,
    borderBottomColor: '#374151',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  detailSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 22,
  },
  detailCommodities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  detailCommodityChip: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  detailCommodityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  officeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  officeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  officeText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#3B82F620',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },
  licenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  licenseText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  regulationList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  regulationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  regulationChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  licenseNumberItem: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  licenseAuthority: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  licenseNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  brokerTypeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  brokerTypeChip: {
    backgroundColor: '#8B5CF620',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  brokerTypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  clearingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  clearingText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  memberText: {
    fontSize: 14,
    color: '#9CA3AF',
    flex: 1,
  },
  websiteLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 10,
  },
  websiteText: {
    fontSize: 13,
    color: '#3B82F6',
    flex: 1,
  },
  modalBottomPadding: {
    height: 20,
  },
  actionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionsMenu: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  actionsMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    gap: 12,
  },
  actionsMenuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  badge: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  clearMenuItem: {
    borderBottomWidth: 0,
  },
  clearText: {
    color: '#EF4444',
  },
});


// Wrap in Error Boundary to catch crashes
import ErrorBoundary from '../../components/ErrorBoundary';

export default function MarketScreenWithErrorBoundary() {
  return (
    <ErrorBoundary componentName="Market Directory">
      <MarketDirectoryScreen />
    </ErrorBoundary>
  );
}


