import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, FileText, Download, CheckSquare } from 'lucide-react-native';
import type { MarketParticipant } from '@/types';

interface ReportsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCompanies: MarketParticipant[];
}

export default function ReportsModal({ visible, onClose, selectedCompanies }: ReportsModalProps) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [includeDetails, setIncludeDetails] = useState<boolean>(true);
  const [includeRatings, setIncludeRatings] = useState<boolean>(true);
  const [includeVerification, setIncludeVerification] = useState<boolean>(true);

  const handleGenerateReport = () => {
    if (selectedCompanies.length === 0) {
      Alert.alert('No Companies', 'Please select companies to include in the report.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      Alert.alert(
        'Report Generated',
        `PDF report with ${selectedCompanies.length} companies has been generated and is ready for download.`,
        [{ text: 'OK', onPress: onClose }]
      );
    }, 2000);
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
            <Text style={styles.title}>Generate Report</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Selected Companies ({selectedCompanies.length})</Text>
              <View style={styles.companiesList}>
                {selectedCompanies.slice(0, 10).map(company => (
                  <View key={company.id} style={styles.companyChip}>
                    <Text style={styles.companyText}>{company.name}</Text>
                  </View>
                ))}
                {selectedCompanies.length > 10 && (
                  <Text style={styles.moreText}>+{selectedCompanies.length - 10} more</Text>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Report Options</Text>
              
              <TouchableOpacity
                style={styles.option}
                onPress={() => setIncludeDetails(!includeDetails)}
              >
                <View style={[styles.checkbox, includeDetails && styles.checkboxChecked]}>
                  {includeDetails && <CheckSquare size={18} color="#FFFFFF" />}
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Company Details</Text>
                  <Text style={styles.optionDescription}>
                    Include headquarters, commodities, and description
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => setIncludeRatings(!includeRatings)}
              >
                <View style={[styles.checkbox, includeRatings && styles.checkboxChecked]}>
                  {includeRatings && <CheckSquare size={18} color="#FFFFFF" />}
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Ratings & Reviews</Text>
                  <Text style={styles.optionDescription}>
                    Include average ratings and review summaries
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => setIncludeVerification(!includeVerification)}
              >
                <View style={[styles.checkbox, includeVerification && styles.checkboxChecked]}>
                  {includeVerification && <CheckSquare size={18} color="#FFFFFF" />}
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>Verification Data</Text>
                  <Text style={styles.optionDescription}>
                    Include verification dates and response rates
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.previewTitle}>Report Preview</Text>
              <View style={styles.previewCard}>
                <FileText size={48} color="#3B82F6" />
                <Text style={styles.previewText}>Market Directory Report</Text>
                <Text style={styles.previewSubtext}>
                  {selectedCompanies.length} Companies • PDF Format
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
              onPress={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Text style={styles.generateButtonText}>Generating...</Text>
              ) : (
                <>
                  <Download size={20} color="#FFFFFF" />
                  <Text style={styles.generateButtonText}>Generate PDF Report</Text>
                </>
              )}
            </TouchableOpacity>

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
  companiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  companyChip: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  companyText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  moreText: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  previewCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
    borderStyle: 'dashed',
  },
  previewText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
  },
  previewSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 32,
    gap: 10,
  },
  generateButtonDisabled: {
    backgroundColor: '#374151',
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 40,
  },
});
