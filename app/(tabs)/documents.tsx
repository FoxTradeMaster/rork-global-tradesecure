import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert, ActivityIndicator, Platform, Linking, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrading } from '@/contexts/TradingContext';
import { useState, useEffect } from 'react';
import { FileText, File as FileIcon, CheckCircle, Clock, Download, Send, Mail, X, Plus, Camera, Upload, FolderOpen, User, Edit3 } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [showCompanyInfoForm, setShowCompanyInfoForm] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    registrationNumber: '',
    country: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    representative: '',
    title: '',
    bankName: '',
    swiftCode: '',
    accountNumber: '',
    signatoryName: '',
    signatoryTitle: '',
  });
  const [hasCompanyProfile, setHasCompanyProfile] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showTradeSelector, setShowTradeSelector] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUploadTargetSelector, setShowUploadTargetSelector] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<{ type: 'trade' | 'counterparty'; id: string; name: string } | null>(null);

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem('company_profile');
      if (saved) {
        const profile = JSON.parse(saved);
        setCompanyInfo(profile);
        setHasCompanyProfile(true);
        console.log('[Documents] Loaded company profile');
      }
    } catch (error) {
      console.error('[Documents] Error loading company profile:', error);
    }
  };

  const saveCompanyProfile = async (profile: typeof companyInfo) => {
    try {
      await AsyncStorage.setItem('company_profile', JSON.stringify(profile));
      setHasCompanyProfile(true);
      console.log('[Documents] Saved company profile');
    } catch (error) {
      console.error('[Documents] Error saving company profile:', error);
    }
  };

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
    
    if (!hasCompanyProfile || !companyInfo.companyName) {
      setShowCompanyInfoForm(true);
    }
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
        },
        companyInfo
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
        setShowCompanyInfoForm(false);
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
          <View style={styles.headerLeft}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Documents</Text>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{allDocuments.length}</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.profileButton, hasCompanyProfile && styles.profileSetBadge]}
              onPress={() => setShowProfileManager(true)}
            >
              <User size={20} color="#FFFFFF" />
            </TouchableOpacity>
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

        {showCompanyInfoForm && selectedTrade && selectedDocType && (
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoid}
            >
              <View style={styles.modal}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Company Information</Text>
                  <TouchableOpacity onPress={() => {
                    setShowCompanyInfoForm(false);
                    setSelectedTrade(null);
                    setSelectedDocType(null);
                  }}>
                    <X size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.formDescription}>
                  Fill in your company details to include in the {selectedDocType} document
                </Text>

                <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
                  <Text style={styles.formSectionTitle}>Basic Information</Text>
                  
                  <Text style={styles.inputLabel}>Company Name *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter company name"
                    placeholderTextColor="#6B7280"
                    value={companyInfo.companyName}
                    onChangeText={(text) => setCompanyInfo(prev => ({ ...prev, companyName: text }))}
                  />

                  <Text style={styles.inputLabel}>Registration Number</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Company registration number"
                    placeholderTextColor="#6B7280"
                    value={companyInfo.registrationNumber}
                    onChangeText={(text) => setCompanyInfo(prev => ({ ...prev, registrationNumber: text }))}
                  />

                  <Text style={styles.inputLabel}>Country *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Country of registration"
                    placeholderTextColor="#6B7280"
                    value={companyInfo.country}
                    onChangeText={(text) => setCompanyInfo(prev => ({ ...prev, country: text }))}
                  />

                  <Text style={styles.inputLabel}>Registered Address *</Text>
                  <TextInput
                    style={[styles.formInput, styles.textArea]}
                    placeholder="Full registered address"
                    placeholderTextColor="#6B7280"
                    value={companyInfo.address}
                    onChangeText={(text) => setCompanyInfo(prev => ({ ...prev, address: text }))}
                    multiline
                    numberOfLines={3}
                  />

                  <Text style={styles.formSectionTitle}>Contact Information</Text>

                  <Text style={styles.inputLabel}>Phone *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="+1 234 567 8900"
                    placeholderTextColor="#6B7280"
                    value={companyInfo.phone}
                    onChangeText={(text) => setCompanyInfo(prev => ({ ...prev, phone: text }))}
                    keyboardType="phone-pad"
                  />

                  <Text style={styles.inputLabel}>Email *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="contact@company.com"
                    placeholderTextColor="#6B7280"
                    value={companyInfo.email}
                    onChangeText={(text) => setCompanyInfo(prev => ({ ...prev, email: text }))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <Text style={styles.inputLabel}>Website</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="www.company.com"
                    placeholderTextColor="#6B7280"
                    value={companyInfo.website}
                    onChangeText={(text) => setCompanyInfo(prev => ({ ...prev, website: text }))}
                    autoCapitalize="none"
                  />

                  <Text style={styles.formSectionTitle}>Authorized Representative</Text>

                  <Text style={styles.inputLabel}>Representative Name *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Full name"
                    placeholderTextColor="#6B7280"
                    value={companyInfo.representative}
                    onChangeText={(text) => setCompanyInfo(prev => ({ ...prev, representative: text }))}
                  />

                  <Text style={styles.inputLabel}>Title/Position *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g., CEO, Managing Director"
                    placeholderTextColor="#6B7280"
                    value={companyInfo.title}
                    onChangeText={(text) => setCompanyInfo(prev => ({ ...prev, title: text }))}
                  />

                  <Text style={styles.formSectionTitle}>Banking Information</Text>

                  <Text style={styles.inputLabel}>Bank Name</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Name of your bank"
                    placeholderTextColor="#6B7280"
                    value={companyInfo.bankName}
                    onChangeText={(text) => setCompanyInfo(prev => ({ ...prev, bankName: text }))}
                  />

                  <Text style={styles.inputLabel}>SWIFT Code</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="SWIFT/BIC code"
                    placeholderTextColor="#6B7280"
                    value={companyInfo.swiftCode}
                    onChangeText={(text) => setCompanyInfo(prev => ({ ...prev, swiftCode: text }))}
                    autoCapitalize="characters"
                  />

                  <Text style={styles.inputLabel}>Account Number</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Bank account number"
                    placeholderTextColor="#6B7280"
                    value={companyInfo.accountNumber}
                    onChangeText={(text) => setCompanyInfo(prev => ({ ...prev, accountNumber: text }))}
                    secureTextEntry
                  />

                  <Text style={styles.formSectionTitle}>Document Signatory</Text>

                  <Text style={styles.inputLabel}>Signatory Name *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Person signing the document"
                    placeholderTextColor="#6B7280"
                    value={companyInfo.signatoryName}
                    onChangeText={(text) => setCompanyInfo(prev => ({ ...prev, signatoryName: text }))}
                  />

                  <Text style={styles.inputLabel}>Signatory Title *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g., Authorized Signatory, Director"
                    placeholderTextColor="#6B7280"
                    value={companyInfo.signatoryTitle}
                    onChangeText={(text) => setCompanyInfo(prev => ({ ...prev, signatoryTitle: text }))}
                  />

                  <View style={{ height: 20 }} />
                </ScrollView>

                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    (!companyInfo.companyName || !companyInfo.country || !companyInfo.address || 
                     !companyInfo.phone || !companyInfo.email || !companyInfo.representative || 
                     !companyInfo.title || !companyInfo.signatoryName || !companyInfo.signatoryTitle) && 
                    styles.continueButtonDisabled
                  ]}
                  onPress={async () => {
                    if (!companyInfo.companyName || !companyInfo.country || !companyInfo.address || 
                        !companyInfo.phone || !companyInfo.email || !companyInfo.representative || 
                        !companyInfo.title || !companyInfo.signatoryName || !companyInfo.signatoryTitle) {
                      Alert.alert('Required Fields', 'Please fill in all required fields marked with *');
                      return;
                    }
                    await saveCompanyProfile(companyInfo);
                    setShowCompanyInfoForm(false);
                    Alert.alert('Success', 'Your company profile has been saved and will be used for all future documents.');
                  }}
                >
                  <Text style={styles.continueButtonText}>Continue to Send</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        )}

        {selectedTrade && selectedDocType && !showCompanyInfoForm && (
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Send {selectedDocType}</Text>
                <TouchableOpacity onPress={() => {
                  setSelectedTrade(null);
                  setSelectedDocType(null);
                  setRecipientEmail('');
                  setShowCompanyInfoForm(false);
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

        {showProfileManager && (
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardAvoid}
            >
              <View style={styles.modal}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Company Profile</Text>
                  <TouchableOpacity onPress={() => setShowProfileManager(false)}>
                    <X size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {hasCompanyProfile ? (
                  <View>
                    <View style={styles.profileBanner}>
                      <View style={styles.profileIconContainer}>
                        <User size={32} color="#3B82F6" />
                      </View>
                      <View style={styles.profileBannerInfo}>
                        <Text style={styles.profileCompanyName}>{companyInfo.companyName}</Text>
                        <Text style={styles.profileCountry}>{companyInfo.country}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.editProfileButton}
                        onPress={() => {
                          setShowProfileManager(false);
                          setShowCompanyInfoForm(true);
                        }}
                      >
                        <Edit3 size={18} color="#3B82F6" />
                      </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.profileDetailsScroll} showsVerticalScrollIndicator={false}>
                      <View style={styles.profileSection}>
                        <Text style={styles.profileSectionTitle}>Basic Information</Text>
                        <View style={styles.profileField}>
                          <Text style={styles.profileFieldLabel}>Company Name</Text>
                          <Text style={styles.profileFieldValue}>{companyInfo.companyName}</Text>
                        </View>
                        {companyInfo.registrationNumber && (
                          <View style={styles.profileField}>
                            <Text style={styles.profileFieldLabel}>Registration Number</Text>
                            <Text style={styles.profileFieldValue}>{companyInfo.registrationNumber}</Text>
                          </View>
                        )}
                        <View style={styles.profileField}>
                          <Text style={styles.profileFieldLabel}>Country</Text>
                          <Text style={styles.profileFieldValue}>{companyInfo.country}</Text>
                        </View>
                        <View style={styles.profileField}>
                          <Text style={styles.profileFieldLabel}>Address</Text>
                          <Text style={styles.profileFieldValue}>{companyInfo.address}</Text>
                        </View>
                      </View>

                      <View style={styles.profileSection}>
                        <Text style={styles.profileSectionTitle}>Contact Information</Text>
                        <View style={styles.profileField}>
                          <Text style={styles.profileFieldLabel}>Phone</Text>
                          <Text style={styles.profileFieldValue}>{companyInfo.phone}</Text>
                        </View>
                        <View style={styles.profileField}>
                          <Text style={styles.profileFieldLabel}>Email</Text>
                          <Text style={styles.profileFieldValue}>{companyInfo.email}</Text>
                        </View>
                        {companyInfo.website && (
                          <View style={styles.profileField}>
                            <Text style={styles.profileFieldLabel}>Website</Text>
                            <Text style={styles.profileFieldValue}>{companyInfo.website}</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.profileSection}>
                        <Text style={styles.profileSectionTitle}>Representative</Text>
                        <View style={styles.profileField}>
                          <Text style={styles.profileFieldLabel}>Name</Text>
                          <Text style={styles.profileFieldValue}>{companyInfo.representative}</Text>
                        </View>
                        <View style={styles.profileField}>
                          <Text style={styles.profileFieldLabel}>Title</Text>
                          <Text style={styles.profileFieldValue}>{companyInfo.title}</Text>
                        </View>
                      </View>

                      {(companyInfo.bankName || companyInfo.swiftCode) && (
                        <View style={styles.profileSection}>
                          <Text style={styles.profileSectionTitle}>Banking</Text>
                          {companyInfo.bankName && (
                            <View style={styles.profileField}>
                              <Text style={styles.profileFieldLabel}>Bank Name</Text>
                              <Text style={styles.profileFieldValue}>{companyInfo.bankName}</Text>
                            </View>
                          )}
                          {companyInfo.swiftCode && (
                            <View style={styles.profileField}>
                              <Text style={styles.profileFieldLabel}>SWIFT Code</Text>
                              <Text style={styles.profileFieldValue}>{companyInfo.swiftCode}</Text>
                            </View>
                          )}
                        </View>
                      )}

                      <View style={styles.profileSection}>
                        <Text style={styles.profileSectionTitle}>Document Signatory</Text>
                        <View style={styles.profileField}>
                          <Text style={styles.profileFieldLabel}>Name</Text>
                          <Text style={styles.profileFieldValue}>{companyInfo.signatoryName}</Text>
                        </View>
                        <View style={styles.profileField}>
                          <Text style={styles.profileFieldLabel}>Title</Text>
                          <Text style={styles.profileFieldValue}>{companyInfo.signatoryTitle}</Text>
                        </View>
                      </View>
                    </ScrollView>

                    <View style={styles.profileInfoBox}>
                      <Text style={styles.profileInfoText}>✓ This information will be automatically included in all documents you send</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.noProfileContainer}>
                    <View style={styles.noProfileIcon}>
                      <User size={48} color="#6B7280" />
                    </View>
                    <Text style={styles.noProfileTitle}>No Company Profile</Text>
                    <Text style={styles.noProfileText}>
                      Set up your company profile to automatically fill documents with your information when sending to counterparties.
                    </Text>
                    <TouchableOpacity 
                      style={styles.createProfileButton}
                      onPress={() => {
                        setShowProfileManager(false);
                        setShowCompanyInfoForm(true);
                      }}
                    >
                      <Plus size={20} color="#FFFFFF" />
                      <Text style={styles.createProfileButtonText}>Create Profile</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </KeyboardAvoidingView>
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
    marginRight: 8,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  headerBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flexShrink: 0,
  },
  headerBadgeText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 0,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  formDescription: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 20,
    lineHeight: 18,
  },
  formScroll: {
    maxHeight: 400,
    marginBottom: 20,
  },
  formSectionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#9CA3AF',
    marginBottom: 6,
    marginTop: 8,
  },
  formInput: {
    backgroundColor: '#0A0E27',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#374151',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  profileSetBadge: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0E27',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  profileIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F620',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBannerInfo: {
    flex: 1,
  },
  profileCompanyName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileCountry: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDetailsScroll: {
    maxHeight: 400,
    marginBottom: 16,
  },
  profileSection: {
    marginBottom: 20,
  },
  profileSectionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  profileField: {
    marginBottom: 12,
  },
  profileFieldLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  profileFieldValue: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  profileInfoBox: {
    backgroundColor: '#10B98120',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  profileInfoText: {
    fontSize: 12,
    color: '#10B981',
    lineHeight: 18,
  },
  noProfileContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noProfileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  noProfileTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  noProfileText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  createProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  createProfileButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
