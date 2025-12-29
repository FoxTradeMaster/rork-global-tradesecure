import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useCallback } from 'react';
import { X, Upload, FileSpreadsheet, Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pickAndParseFile, ParseResult, ParsedRow } from '@/lib/fileParser';

interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
  label: string;
}

interface ImportModalProps {
  visible: boolean;
  onClose: () => void;
  onImport: (data: ParsedRow[]) => void;
  title: string;
  targetFields: { field: string; label: string; required?: boolean }[];
  validateRow?: (row: ParsedRow) => { valid: boolean; error?: string };
}

export default function ImportModal({ 
  visible, 
  onClose, 
  onImport, 
  title, 
  targetFields,
  validateRow 
}: ImportModalProps) {
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [importError, setImportError] = useState<string | null>(null);

  const handlePickFile = useCallback(async () => {
    setIsLoading(true);
    setImportError(null);
    
    try {
      const result = await pickAndParseFile();
      console.log('[ImportModal] Parse result:', result.success, result.headers);
      
      if (result.success) {
        setParseResult(result);
        
        const autoMappings: ColumnMapping[] = targetFields.map(tf => {
          const matchingHeader = result.headers.find(h => 
            h.toLowerCase().replace(/[^a-z0-9]/g, '') === 
            tf.field.toLowerCase().replace(/[^a-z0-9]/g, '') ||
            h.toLowerCase().includes(tf.field.toLowerCase()) ||
            tf.field.toLowerCase().includes(h.toLowerCase().replace(/[^a-z0-9]/g, ''))
          );
          
          return {
            sourceColumn: matchingHeader || '',
            targetField: tf.field,
            label: tf.label,
          };
        });
        
        setMappings(autoMappings);
      } else {
        setImportError(result.error || 'Failed to parse file');
      }
    } catch (error) {
      console.error('[ImportModal] Error:', error);
      setImportError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [targetFields]);

  const updateMapping = (targetField: string, sourceColumn: string) => {
    setMappings(prev => prev.map(m => 
      m.targetField === targetField ? { ...m, sourceColumn } : m
    ));
  };

  const handleImport = () => {
    if (!parseResult) return;

    const mappedData: ParsedRow[] = parseResult.data.map(row => {
      const mapped: ParsedRow = {};
      mappings.forEach(m => {
        if (m.sourceColumn) {
          mapped[m.targetField] = row[m.sourceColumn];
        }
      });
      return mapped;
    });

    const validData = mappedData.filter(row => {
      if (validateRow) {
        return validateRow(row).valid;
      }
      return Object.values(row).some(v => v !== null && v !== '');
    });

    console.log('[ImportModal] Importing', validData.length, 'rows');
    onImport(validData);
    handleClose();
  };

  const handleClose = () => {
    setParseResult(null);
    setMappings([]);
    setImportError(null);
    setShowPreview(true);
    onClose();
  };

  const requiredFieldsMapped = targetFields
    .filter(tf => tf.required)
    .every(tf => mappings.find(m => m.targetField === tf.field)?.sourceColumn);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {!parseResult ? (
              <View style={styles.uploadSection}>
                <View style={styles.uploadIcon}>
                  <FileSpreadsheet size={48} color="#3B82F6" />
                </View>
                <Text style={styles.uploadTitle}>Import from File</Text>
                <Text style={styles.uploadSubtitle}>
                  Select a CSV or Excel file to import data
                </Text>

                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={handlePickFile}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Upload size={20} color="#FFFFFF" />
                      <Text style={styles.uploadButtonText}>Choose File</Text>
                    </>
                  )}
                </TouchableOpacity>

                {importError && (
                  <View style={styles.errorContainer}>
                    <AlertCircle size={16} color="#EF4444" />
                    <Text style={styles.errorText}>{importError}</Text>
                  </View>
                )}

                <View style={styles.supportedFormats}>
                  <Text style={styles.formatsTitle}>Supported formats:</Text>
                  <Text style={styles.formatsText}>• CSV (.csv)</Text>
                  <Text style={styles.formatsText}>• Excel (.xlsx, .xls)</Text>
                </View>
              </View>
            ) : (
              <View style={styles.mappingSection}>
                <View style={styles.fileInfo}>
                  <FileSpreadsheet size={24} color="#10B981" />
                  <View style={styles.fileInfoText}>
                    <Text style={styles.fileName}>{parseResult.fileName}</Text>
                    <Text style={styles.fileStats}>
                      {parseResult.data.length} rows • {parseResult.headers.length} columns
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.changeFileButton}
                    onPress={handlePickFile}
                  >
                    <Text style={styles.changeFileText}>Change</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Column Mapping</Text>
                <Text style={styles.sectionSubtitle}>
                  Map your file columns to the required fields
                </Text>

                {mappings.map((mapping) => {
                  const targetField = targetFields.find(tf => tf.field === mapping.targetField);
                  return (
                    <View key={mapping.targetField} style={styles.mappingRow}>
                      <View style={styles.mappingLabel}>
                        <Text style={styles.mappingLabelText}>{mapping.label}</Text>
                        {targetField?.required && (
                          <Text style={styles.requiredBadge}>Required</Text>
                        )}
                      </View>
                      <View style={styles.mappingDropdown}>
                        <ScrollView 
                          horizontal 
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={styles.columnOptions}
                        >
                          <TouchableOpacity
                            style={[
                              styles.columnOption,
                              !mapping.sourceColumn && styles.columnOptionSelected
                            ]}
                            onPress={() => updateMapping(mapping.targetField, '')}
                          >
                            <Text style={[
                              styles.columnOptionText,
                              !mapping.sourceColumn && styles.columnOptionTextSelected
                            ]}>
                              Skip
                            </Text>
                          </TouchableOpacity>
                          {parseResult.headers.map(header => (
                            <TouchableOpacity
                              key={header}
                              style={[
                                styles.columnOption,
                                mapping.sourceColumn === header && styles.columnOptionSelected
                              ]}
                              onPress={() => updateMapping(mapping.targetField, header)}
                            >
                              <Text style={[
                                styles.columnOptionText,
                                mapping.sourceColumn === header && styles.columnOptionTextSelected
                              ]}>
                                {header}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                  );
                })}

                <TouchableOpacity 
                  style={styles.previewToggle}
                  onPress={() => setShowPreview(!showPreview)}
                >
                  <Text style={styles.previewToggleText}>Data Preview</Text>
                  {showPreview ? (
                    <ChevronUp size={20} color="#9CA3AF" />
                  ) : (
                    <ChevronDown size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>

                {showPreview && (
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={true}
                    style={styles.previewScroll}
                  >
                    <View style={styles.previewTable}>
                      <View style={styles.previewHeaderRow}>
                        {parseResult.headers.map(header => (
                          <View key={header} style={styles.previewHeaderCell}>
                            <Text style={styles.previewHeaderText} numberOfLines={1}>
                              {header}
                            </Text>
                          </View>
                        ))}
                      </View>
                      {parseResult.data.slice(0, 5).map((row, idx) => (
                        <View key={idx} style={styles.previewRow}>
                          {parseResult.headers.map(header => (
                            <View key={header} style={styles.previewCell}>
                              <Text style={styles.previewCellText} numberOfLines={1}>
                                {String(row[header] ?? '')}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ))}
                      {parseResult.data.length > 5 && (
                        <View style={styles.previewMore}>
                          <Text style={styles.previewMoreText}>
                            +{parseResult.data.length - 5} more rows
                          </Text>
                        </View>
                      )}
                    </View>
                  </ScrollView>
                )}

                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={handleClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.importButton,
                      !requiredFieldsMapped && styles.importButtonDisabled
                    ]}
                    onPress={handleImport}
                    disabled={!requiredFieldsMapped}
                  >
                    <Check size={20} color="#FFFFFF" />
                    <Text style={styles.importButtonText}>
                      Import {parseResult.data.length} rows
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
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
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  uploadSection: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  uploadIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3B82F620',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF444420',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    flex: 1,
  },
  supportedFormats: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    alignSelf: 'stretch',
  },
  formatsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  formatsText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  mappingSection: {
    padding: 20,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98120',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  fileInfoText: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  fileStats: {
    fontSize: 13,
    color: '#10B981',
  },
  changeFileButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#374151',
    borderRadius: 6,
  },
  changeFileText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  mappingRow: {
    marginBottom: 16,
  },
  mappingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  mappingLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  requiredBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F59E0B',
    backgroundColor: '#F59E0B20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mappingDropdown: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 8,
  },
  columnOptions: {
    gap: 8,
  },
  columnOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#374151',
    borderRadius: 6,
  },
  columnOptionSelected: {
    backgroundColor: '#3B82F6',
  },
  columnOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  columnOptionTextSelected: {
    color: '#FFFFFF',
  },
  previewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    marginTop: 16,
  },
  previewToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  previewScroll: {
    marginBottom: 20,
  },
  previewTable: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#374151',
  },
  previewHeaderCell: {
    width: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: '#4B5563',
  },
  previewHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  previewRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  previewCell: {
    width: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: '#374151',
  },
  previewCellText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  previewMore: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  previewMoreText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingBottom: 40,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#374151',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  importButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 16,
    backgroundColor: '#10B981',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  importButtonDisabled: {
    backgroundColor: '#374151',
    opacity: 0.6,
  },
  importButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
