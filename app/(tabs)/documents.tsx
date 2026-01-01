import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert, ActivityIndicator, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrading } from '@/contexts/TradingContext';
import { useState } from 'react';
import { FileText, File as FileIcon, CheckCircle, Clock, Download, Send, Mail, X, Plus, Camera, Upload, FolderOpen } from 'lucide-react-native';
import { Trade, Document, DocumentType } from '@/types';
import { sendTradeDocument, generateDocumentContent, generateBlankDocument } from '@/lib/sendgrid';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Print from 'expo-print';
import { supabase } from '@/lib/supabase';

export default function DocumentsScreen() {
  const { trades, counterparties, currentUser, updateTrade, updateCounterparty } = useTrading();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<'CIS' | 'SCO' | 'ICPO' | 'LOI' | 'POF' | 'NCNDA' | 'MFPA' | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showTradeSelector, setShowTradeSelector] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUploadTargetSelector, setShowUploadTargetSelector] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<{ type: 'trade' | 'counterparty'; id: string; name: string } | null>(null);

  const allDocuments = [
    ...trades.flatMap(trade => trade.documents.map(doc => ({ ...doc, source: 'trade', sourceId: trade.id, sourceName: trade.counterpartyName }))),
    ...counterparties.flatMap(cp => cp.documents.map(doc => ({ ...doc, source: 'counterparty', sourceId: cp.id, sourceName: cp.name })))
  ].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  const getDocumentIcon = (type: string) => {
    return type.includes('lc') || type.includes('contract') ? FileText : FileIcon;
  };

  const getDocumentTypeColor = (type: string) => {
    if (type.includes('lc')) return '#10B981';
    if (type.includes('contract') || type.includes('spa') || type.includes('msa')) return '#3B82F6';
    if (type.includes('certificate')) return '#8B5CF6';
    return '#6B7280';
  };

  const handleDownloadDocument = async (doc: any) => {
    try {
      const isDummyUrl = !doc.url || 
                         doc.url.trim() === '' || 
                         doc.url.includes('dummy.pdf') || 
                         doc.url.includes('w3.org/WAI/ER/tests');
      
      if (isDummyUrl) {
        Alert.alert(
          'Placeholder Document', 
          'This is a sample document from the demo data. To work with real documents:\n\n• Upload your own documents using the + button\n• Download blank templates below to fill out\n• Send documents via email',
          [
            { text: 'OK', style: 'default' }
          ]
        );
      } else {
        await Linking.openURL(doc.url);
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      Alert.alert('Error', 'Failed to open document');
    }
  };

  const handleDownloadBlankTemplate = async (docType: 'CIS' | 'SCO' | 'ICPO' | 'LOI' | 'POF' | 'NCNDA' | 'MFPA') => {
    try {
      const content = generateBlankDocument(docType);
      
      if (Platform.OS === 'web') {
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${docType}_Blank_Template.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        Alert.alert('Success', `${docType} template downloaded successfully`);
      } else {
        const { uri } = await Print.printToFileAsync({
          html: content,
        });
        
        await Print.printAsync({
          uri: uri,
        });
      }
    } catch (error) {
      console.error('Error printing template:', error);
      Alert.alert('Error', 'Failed to print template');
    }
  };

  const handleSendDocument = (trade: Trade, docType: 'CIS' | 'SCO' | 'ICPO' | 'LOI' | 'POF' | 'NCNDA' | 'MFPA') => {
    setSelectedTrade(trade);
    setSelectedDocType(docType);
    setRecipientEmail('');
    setShowTradeSelector(false);
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to scan documents');
      return false;
    }
    return true;
  };

  const handleScanDocument = async () => {
    if (Platform.OS !== 'web') {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.9,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadDocument(result.assets[0].uri, 'scanned_document.jpg', 'image/jpeg');
      }
    } catch (error) {
      console.error('Error scanning document:', error);
      Alert.alert('Error', 'Failed to scan document');
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        await uploadDocument(asset.uri, asset.name, asset.mimeType || 'application/octet-stream');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.9,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadDocument(result.assets[0].uri, 'document_image.jpg', 'image/jpeg');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadDocument = async (uri: string, fileName: string, mimeType: string) => {
    if (!uploadTarget) return;

    setIsUploading(true);
    try {
      const fileExt = fileName.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const filePath = `${uploadTarget.type}s/${uploadTarget.id}/${timestamp}.${fileExt}`;

      let fileData: Blob | Buffer;
      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        fileData = await response.blob();
      } else {
        const response = await fetch(uri);
        const blob = await response.blob();
        fileData = blob;
      }

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, fileData, {
          contentType: mimeType,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const newDocument: Document = {
        id: `doc_${timestamp}`,
        type: 'corporate_docs' as DocumentType,
        name: fileName,
        uploadedAt: new Date(),
        uploadedBy: currentUser?.name || 'User',
        url: urlData.publicUrl,
        verified: false,
      };

      if (uploadTarget.type === 'trade') {
        const trade = trades.find(t => t.id === uploadTarget.id);
        if (trade) {
          const updatedDocuments = [...trade.documents, newDocument];
          await updateTrade(uploadTarget.id, { documents: updatedDocuments });
        }
      } else {
        const counterparty = counterparties.find(cp => cp.id === uploadTarget.id);
        if (counterparty) {
          const updatedDocuments = [...counterparty.documents, newDocument];
          await updateCounterparty(uploadTarget.id, { documents: updatedDocuments });
        }
      }

      Alert.alert('Success', 'Document uploaded successfully');
      setShowUploadModal(false);
      setUploadTarget(null);
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const showUploadOptions = (type: 'trade' | 'counterparty', id: string, name: string) => {
    setUploadTarget({ type, id, name });
    setShowUploadModal(true);
  };

  const confirmSendDocument = async () => {
    if (!selectedTrade || !selectedDocType || !recipientEmail) return;

    setIsSending(true);
    try {
      const documentContent = generateDocumentContent(
        selectedDocType,
        {
          commodity: selectedTrade.commodity,
          quantity: selectedTrade.quantity,
          unit: selectedTrade.unit,
          pricePerUnit: selectedTrade.pricePerUnit,
          incoterm: selectedTrade.incoterm,
          counterpartyName: selectedTrade.counterpartyName,
        }
      );

      const result = await sendTradeDocument({
        to: recipientEmail,
        subject: `${selectedDocType} - ${selectedTrade.commodity.replace(/_/g, ' ').toUpperCase()} Trade`,
        documentType: selectedDocType,
        tradeDetails: {
          commodity: selectedTrade.commodity,
          quantity: selectedTrade.quantity,
          unit: selectedTrade.unit,
          pricePerUnit: selectedTrade.pricePerUnit,
          incoterm: selectedTrade.incoterm,
          counterpartyName: selectedTrade.counterpartyName,
        },
        attachments: [
          {
            content: Buffer.from(documentContent).toString('base64'),
            filename: `${selectedDocType}_${selectedTrade.id}.html`,
            type: 'text/html',
            disposition: 'attachment',
          },
        ],
      });

      if (result.success) {
        Alert.alert('Success', `${selectedDocType} sent successfully to ${recipientEmail}`);
        setSelectedTrade(null);
        setSelectedDocType(null);
        setRecipientEmail('');
      } else {
        Alert.alert('Error', result.error || 'Failed to send document');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send document');
      console.error('Error sending document:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Documents</Text>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{allDocuments.length}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowTradeSelector(true)}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => {
                if (trades.length === 0 && counterparties.length === 0) {
                  Alert.alert('No Targets', 'Create a trade or counterparty first to upload documents');
                  return;
                }
                setShowUploadTargetSelector(true);
              }}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <CheckCircle size={20} color="#10B981" />
            <View>
              <Text style={styles.statValue}>
                {allDocuments.filter(d => d.verified).length}
              </Text>
              <Text style={styles.statLabel}>Verified</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Clock size={20} color="#F59E0B" />
            <View>
              <Text style={styles.statValue}>
                {allDocuments.filter(d => !d.verified).length}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.documentsContainer}>
            {allDocuments.map(doc => {
              const DocIcon = getDocumentIcon(doc.type);
              const docColor = getDocumentTypeColor(doc.type);

              return (
                <TouchableOpacity
                  key={doc.id}
                  style={styles.documentCard}
                  activeOpacity={0.7}
                >
                  <View style={styles.documentHeader}>
                    <View style={[styles.docIconContainer, { backgroundColor: docColor + '20' }]}>
                      <DocIcon size={20} color={docColor} />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName}>{doc.name}</Text>
                      <Text style={styles.documentSource}>
                        {doc.source === 'trade' ? 'Trade' : 'Counterparty'}: {doc.sourceName}
                      </Text>
                    </View>
                    {doc.verified ? (
                      <CheckCircle size={20} color="#10B981" />
                    ) : (
                      <Clock size={20} color="#F59E0B" />
                    )}
                  </View>

                  <View style={styles.documentMeta}>
                    <View style={[styles.typeBadge, { backgroundColor: docColor + '20' }]}>
                      <Text style={[styles.typeText, { color: docColor }]}>
                        {doc.type.replace(/_/g, ' ').toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.uploadedText}>
                      Uploaded by {doc.uploadedBy}
                    </Text>
                  </View>

                  <View style={styles.documentFooter}>
                    <Text style={styles.dateText}>
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </Text>
                    <TouchableOpacity 
                      style={styles.downloadButton}
                      onPress={() => handleDownloadDocument(doc)}
                    >
                      <Download size={16} color="#3B82F6" />
                      <Text style={styles.downloadText}>Download</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}

            {(trades.length > 0 || counterparties.length > 0) && (
              <View style={styles.uploadSection}>
                <Text style={styles.uploadSectionTitle}>Quick Upload</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickUploadList}>
                  {trades.map(trade => (
                    <TouchableOpacity
                      key={`upload-trade-${trade.id}`}
                      style={styles.uploadTargetCard}
                      onPress={() => showUploadOptions('trade', trade.id, trade.counterpartyName)}
                    >
                      <View style={styles.uploadTargetIcon}>
                        <FileText size={20} color="#3B82F6" />
                      </View>
                      <Text style={styles.uploadTargetName} numberOfLines={1}>
                        {trade.commodity.replace(/_/g, ' ')}
                      </Text>
                      <Text style={styles.uploadTargetType}>Trade</Text>
                    </TouchableOpacity>
                  ))}
                  {counterparties.map(cp => (
                    <TouchableOpacity
                      key={`upload-cp-${cp.id}`}
                      style={styles.uploadTargetCard}
                      onPress={() => showUploadOptions('counterparty', cp.id, cp.name)}
                    >
                      <View style={styles.uploadTargetIcon}>
                        <FileIcon size={20} color="#10B981" />
                      </View>
                      <Text style={styles.uploadTargetName} numberOfLines={1}>
                        {cp.name}
                      </Text>
                      <Text style={styles.uploadTargetType}>Counterparty</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.templatesSection}>
              <Text style={styles.templatesSectionTitle}>Blank Document Templates</Text>
              <Text style={styles.templatesSectionSubtitle}>Download blank templates to fill out manually</Text>
              <View style={styles.templatesGrid}>
                {[
                  { type: 'LOI', name: 'Letter of Intent', desc: 'Express purchase intent' },
                  { type: 'SCO', name: 'Soft Corporate Offer', desc: 'Non-binding offer' },
                  { type: 'ICPO', name: 'Irrevocable Corporate PO', desc: 'Binding purchase order' },
                  { type: 'POF', name: 'Proof of Funds', desc: 'Bank fund certification' },
                  { type: 'NCNDA', name: 'NCNDA', desc: 'Non-disclosure agreement' },
                  { type: 'MFPA', name: 'Master Fee Protection Agreement', desc: 'Fee protection contract' },
                  { type: 'CIS', name: 'Corporate Info Sheet', desc: 'Company details' },
                ].map(template => (
                  <TouchableOpacity
                    key={template.type}
                    style={styles.templateCard}
                    onPress={() => handleDownloadBlankTemplate(template.type as 'CIS' | 'SCO' | 'ICPO' | 'LOI' | 'POF' | 'NCNDA' | 'MFPA')}
                    activeOpacity={0.7}
                  >
                    <View style={styles.templateIconContainer}>
                      <FileText size={24} color="#3B82F6" />
                    </View>
                    <Text style={styles.templateName}>{template.name}</Text>
                    <Text style={styles.templateDesc}>{template.desc}</Text>
                    <View style={styles.templateDownloadButton}>
                      <Download size={16} color="#3B82F6" />
                      <Text style={styles.templateDownloadText}>Download</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {allDocuments.length === 0 && (
              <View style={styles.emptyState}>
                <FileText size={48} color="#374151" />
                <Text style={styles.emptyStateText}>No documents yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Documents will appear here as trades are created
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {showTradeSelector && (
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Trade</Text>
                <TouchableOpacity onPress={() => setShowTradeSelector(false)}>
                  <X size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.tradeList} showsVerticalScrollIndicator={false}>
                {trades.map(trade => (
                  <View key={trade.id} style={styles.tradeItem}>
                    <View style={styles.tradeItemHeader}>
                      <Text style={styles.tradeItemTitle}>
                        {trade.commodity.replace(/_/g, ' ').toUpperCase()}
                      </Text>
                      <Text style={styles.tradeItemSubtitle}>{trade.counterpartyName}</Text>
                    </View>
                    <View style={styles.docActions}>
                      {['CIS', 'SCO', 'ICPO', 'LOI', 'POF', 'NCNDA', 'MFPA'].map(docType => (
                        <TouchableOpacity
                          key={docType}
                          style={styles.docActionButton}
                          onPress={() => handleSendDocument(trade, docType as 'CIS' | 'SCO' | 'ICPO' | 'LOI' | 'POF' | 'NCNDA' | 'MFPA')}
                        >
                          <Send size={16} color="#3B82F6" />
                          <Text style={styles.docActionText}>{docType}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        {selectedTrade && selectedDocType && (
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Send {selectedDocType}</Text>
                <TouchableOpacity onPress={() => {
                  setSelectedTrade(null);
                  setSelectedDocType(null);
                  setRecipientEmail('');
                }}>
                  <X size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalLabel}>Trade: {selectedTrade.commodity.replace(/_/g, ' ').toUpperCase()}</Text>
              <Text style={styles.modalSubtext}>{selectedTrade.counterpartyName}</Text>

              <View style={styles.inputContainer}>
                <Mail size={20} color="#6B7280" />
                <TextInput
                  style={styles.emailInput}
                  placeholder="Recipient email"
                  placeholderTextColor="#6B7280"
                  value={recipientEmail}
                  onChangeText={setRecipientEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[styles.sendButton, (!recipientEmail || isSending) && styles.sendButtonDisabled]}
                onPress={confirmSendDocument}
                disabled={!recipientEmail || isSending}
              >
                {isSending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Send size={20} color="#FFFFFF" />
                    <Text style={styles.sendButtonText}>Send Document</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {showUploadTargetSelector && (
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Upload Target</Text>
                <TouchableOpacity onPress={() => setShowUploadTargetSelector(false)}>
                  <X size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.targetList} showsVerticalScrollIndicator={false}>
                {trades.length > 0 && (
                  <View>
                    <Text style={styles.sectionLabel}>Trades</Text>
                    {trades.map(trade => (
                      <TouchableOpacity
                        key={`target-trade-${trade.id}`}
                        style={styles.targetItem}
                        onPress={() => {
                          showUploadOptions('trade', trade.id, trade.counterpartyName);
                          setShowUploadTargetSelector(false);
                        }}
                      >
                        <View style={styles.targetIconContainer}>
                          <FileText size={20} color="#3B82F6" />
                        </View>
                        <View style={styles.targetInfo}>
                          <Text style={styles.targetName}>
                            {trade.commodity.replace(/_/g, ' ').toUpperCase()}
                          </Text>
                          <Text style={styles.targetSubname}>{trade.counterpartyName}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {counterparties.length > 0 && (
                  <View style={{ marginTop: trades.length > 0 ? 16 : 0 }}>
                    <Text style={styles.sectionLabel}>Counterparties</Text>
                    {counterparties.map(cp => (
                      <TouchableOpacity
                        key={`target-cp-${cp.id}`}
                        style={styles.targetItem}
                        onPress={() => {
                          showUploadOptions('counterparty', cp.id, cp.name);
                          setShowUploadTargetSelector(false);
                        }}
                      >
                        <View style={styles.targetIconContainer}>
                          <FileIcon size={20} color="#10B981" />
                        </View>
                        <View style={styles.targetInfo}>
                          <Text style={styles.targetName}>{cp.name}</Text>
                          <Text style={styles.targetSubname}>Counterparty</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        )}

        {showUploadModal && uploadTarget && (
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Upload Document</Text>
                <TouchableOpacity onPress={() => {
                  setShowUploadModal(false);
                  setUploadTarget(null);
                }}>
                  <X size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalLabel}>Uploading to: {uploadTarget.name}</Text>
              <Text style={styles.modalSubtext}>{uploadTarget.type === 'trade' ? 'Trade' : 'Counterparty'}</Text>

              <View style={styles.uploadOptionsContainer}>
                <TouchableOpacity
                  style={styles.uploadOptionButton}
                  onPress={handleScanDocument}
                  disabled={isUploading}
                >
                  <View style={styles.uploadOptionIcon}>
                    <Camera size={32} color="#3B82F6" />
                  </View>
                  <Text style={styles.uploadOptionTitle}>Scan Document</Text>
                  <Text style={styles.uploadOptionDescription}>Use camera to scan</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.uploadOptionButton}
                  onPress={handlePickDocument}
                  disabled={isUploading}
                >
                  <View style={styles.uploadOptionIcon}>
                    <FolderOpen size={32} color="#10B981" />
                  </View>
                  <Text style={styles.uploadOptionTitle}>Choose File</Text>
                  <Text style={styles.uploadOptionDescription}>PDF, DOC, or image</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.uploadOptionButton}
                  onPress={handlePickFromGallery}
                  disabled={isUploading}
                >
                  <View style={styles.uploadOptionIcon}>
                    <Upload size={32} color="#8B5CF6" />
                  </View>
                  <Text style={styles.uploadOptionTitle}>From Gallery</Text>
                  <Text style={styles.uploadOptionDescription}>Select from photos</Text>
                </TouchableOpacity>
              </View>

              {isUploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text style={styles.uploadingText}>Uploading document...</Text>
                </View>
              )}
            </View>
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  headerBadgeText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  scrollView: {
    flex: 1,
  },
  documentsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  documentCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  docIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  documentSource: {
    fontSize: 12,
    color: '#6B7280',
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  uploadedText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  documentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  downloadText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#3B82F6',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modalSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0E27',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 12,
  },
  emailInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  tradeList: {
    maxHeight: 400,
  },
  tradeItem: {
    backgroundColor: '#0A0E27',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tradeItemHeader: {
    marginBottom: 12,
  },
  tradeItemTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tradeItemSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  docActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  docActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 6,
    minWidth: '30%',
  },
  docActionText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#3B82F6',
  },
  uploadSection: {
    marginTop: 24,
    marginBottom: 12,
  },
  uploadSectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  quickUploadList: {
    flexDirection: 'row',
  },
  uploadTargetCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
  },
  uploadTargetIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0A0E27',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadTargetName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  uploadTargetType: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  uploadOptionsContainer: {
    marginTop: 20,
    gap: 12,
  },
  uploadOptionButton: {
    backgroundColor: '#0A0E27',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
  },
  uploadOptionIcon: {
    marginBottom: 12,
  },
  uploadOptionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  uploadOptionDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 14, 39, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  uploadingText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginTop: 16,
  },
  templatesSection: {
    marginTop: 32,
    marginBottom: 24,
  },
  templatesSectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  templatesSectionSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  templateCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    minWidth: 150,
  },
  templateIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F620',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  templateDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 12,
    minHeight: 28,
  },
  templateDownloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0E27',
    borderRadius: 8,
    paddingVertical: 8,
    gap: 6,
  },
  templateDownloadText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#3B82F6',
  },
  targetList: {
    maxHeight: 500,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#6B7280',
    textTransform: 'uppercase' as const,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  targetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0E27',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  targetIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetInfo: {
    flex: 1,
  },
  targetName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  targetSubname: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
