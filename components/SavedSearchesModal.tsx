import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Save, Trash2, Star, Search } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SavedSearch } from '@/types';

interface SavedSearchesModalProps {
  visible: boolean;
  onClose: () => void;
  currentSearch: {
    type: 'all' | 'trading_house' | 'broker' | 'platform';
    commodity: string;
    businessType: 'all' | 'buyer' | 'seller' | 'both';
    searchQuery: string;
  };
  onLoadSearch: (search: SavedSearch) => void;
}

export default function SavedSearchesModal({ visible, onClose, currentSearch, onLoadSearch }: SavedSearchesModalProps) {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [searchName, setSearchName] = useState<string>('');

  useEffect(() => {
    if (visible) {
      loadSavedSearches();
    }
  }, [visible]);

  const loadSavedSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem('saved_searches');
      if (stored) {
        const searches = JSON.parse(stored);
        setSavedSearches(searches.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt)
        })));
      }
    } catch (error) {
      console.error('Error loading saved searches:', error);
    }
  };

  const handleSaveSearch = async () => {
    if (!searchName.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for this search.');
      return;
    }

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName,
      type: currentSearch.type,
      commodity: currentSearch.commodity,
      businessType: currentSearch.businessType,
      searchQuery: currentSearch.searchQuery,
      createdAt: new Date()
    };

    try {
      const updated = [...savedSearches, newSearch];
      await AsyncStorage.setItem('saved_searches', JSON.stringify(updated));
      setSavedSearches(updated);
      setSearchName('');
      Alert.alert('Success', 'Search saved successfully!');
    } catch (error) {
      console.error('Error saving search:', error);
      Alert.alert('Error', 'Failed to save search.');
    }
  };

  const handleDeleteSearch = async (id: string) => {
    Alert.alert(
      'Delete Search',
      'Are you sure you want to delete this saved search?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updated = savedSearches.filter(s => s.id !== id);
              await AsyncStorage.setItem('saved_searches', JSON.stringify(updated));
              setSavedSearches(updated);
            } catch (error) {
              console.error('Error deleting search:', error);
              Alert.alert('Error', 'Failed to delete search.');
            }
          }
        }
      ]
    );
  };

  const handleLoadSearch = (search: SavedSearch) => {
    onLoadSearch(search);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.title}>Saved Searches</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Save Current Search</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Premium Asian Producers"
                  placeholderTextColor="#6B7280"
                  value={searchName}
                  onChangeText={setSearchName}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveSearch}
                >
                  <Save size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.currentSearchPreview}>
                <Text style={styles.previewLabel}>Current filters:</Text>
                <Text style={styles.previewText}>
                  Type: {currentSearch.type === 'all' ? 'All' : currentSearch.type}
                </Text>
                <Text style={styles.previewText}>
                  Commodity: {currentSearch.commodity === 'all' ? 'All' : currentSearch.commodity}
                </Text>
                <Text style={styles.previewText}>
                  Business: {currentSearch.businessType === 'all' ? 'All' : currentSearch.businessType}
                </Text>
                {currentSearch.searchQuery && (
                  <Text style={styles.previewText}>
                    Query: &quot;{currentSearch.searchQuery}&quot;
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Your Saved Searches ({savedSearches.length})
              </Text>
              {savedSearches.length === 0 ? (
                <View style={styles.emptyState}>
                  <Star size={40} color="#374151" />
                  <Text style={styles.emptyStateText}>No saved searches yet</Text>
                  <Text style={styles.emptyStateSubtext}>Save your frequent filters for quick access</Text>
                </View>
              ) : (
                <View style={styles.searchesList}>
                  {savedSearches.map(search => (
                    <TouchableOpacity
                      key={search.id}
                      style={styles.searchCard}
                      onPress={() => handleLoadSearch(search)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.searchCardHeader}>
                        <View style={styles.searchIcon}>
                          <Search size={18} color="#3B82F6" />
                        </View>
                        <View style={styles.searchInfo}>
                          <Text style={styles.searchName}>{search.name}</Text>
                          <Text style={styles.searchDate}>
                            Saved {search.createdAt.toLocaleDateString()}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDeleteSearch(search.id)}
                        >
                          <Trash2 size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.searchFilters}>
                        <View style={styles.filterTag}>
                          <Text style={styles.filterTagText}>{search.type}</Text>
                        </View>
                        <View style={styles.filterTag}>
                          <Text style={styles.filterTagText}>{search.commodity}</Text>
                        </View>
                        {search.businessType !== 'all' && (
                          <View style={styles.filterTag}>
                            <Text style={styles.filterTagText}>{search.businessType}</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.bottomPadding} />
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#374151',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentSearchPreview: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 6,
  },
  previewText: {
    fontSize: 13,
    color: '#D1D5DB',
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  searchesList: {
    gap: 12,
  },
  searchCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  searchCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F620',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchInfo: {
    flex: 1,
  },
  searchName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  searchDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  deleteButton: {
    padding: 8,
  },
  searchFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterTag: {
    backgroundColor: '#374151',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  filterTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'capitalize',
  },
  bottomPadding: {
    height: 40,
  },
});
