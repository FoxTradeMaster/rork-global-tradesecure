import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Send, FileText, Users, Mail } from 'lucide-react-native';
import type { MarketParticipant, EmailTemplate } from '@/types';
import { sendBulkEmails } from '@/lib/sendgrid';

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'rfq',
    name: 'Request for Quote',
    type: 'rfq',
    subject: 'RFQ: {commodity} - {company}',
    body: 'Dear {recipient},\n\nWe are interested in obtaining a quote for {commodity}. Could you please provide us with your best pricing and terms?\n\nQuantity: {quantity}\nDelivery Window: {delivery}\n\nLooking forward to your response.\n\nBest regards,\n{sender}'
  },
  {
    id: 'partnership',
    name: 'Partnership Inquiry',
    type: 'partnership',
    subject: 'Partnership Opportunity - {company}',
    body: 'Dear {recipient},\n\nWe are reaching out to explore potential partnership opportunities between our organizations.\n\nWe believe there is strong synergy in {commodity} trading and would like to discuss how we can collaborate.\n\nWould you be available for a call next week?\n\nBest regards,\n{sender}'
  },
  {
    id: 'inquiry',
    name: 'General Inquiry',
    type: 'inquiry',
    subject: 'Inquiry regarding {commodity}',
    body: 'Dear {recipient},\n\nI hope this message finds you well. We are currently researching suppliers/buyers for {commodity} and came across your company.\n\nWould you be open to a conversation about potential collaboration?\n\nBest regards,\n{sender}'
  },
  {
    id: 'follow_up',
    name: 'Follow Up',
    type: 'follow_up',
    subject: 'Following up on our previous conversation',
    body: 'Dear {recipient},\n\nI wanted to follow up on our previous conversation regarding {commodity}.\n\nHave you had a chance to review our proposal?\n\nPlease let me know if you need any additional information.\n\nBest regards,\n{sender}'
  }
];

interface EmailOutreachModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCompanies: MarketParticipant[];
}

export default function EmailOutreachModal({ visible, onClose, selectedCompanies }: EmailOutreachModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(EMAIL_TEMPLATES[0]);
  const [customSubject, setCustomSubject] = useState<string>('');
  const [customBody, setCustomBody] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [recipientEmails, setRecipientEmails] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const initialEmails: { [key: string]: string } = {};
    selectedCompanies.forEach(company => {
      initialEmails[company.id] = '';
    });
    setRecipientEmails(initialEmails);
  }, [selectedCompanies]);

  const handleTemplateSelect = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setCustomSubject(template.subject);
    setCustomBody(template.body);
  };

  const handleSend = async () => {
    if (!senderName || !senderEmail) {
      Alert.alert('Missing Information', 'Please provide your name and email address.');
      return;
    }

    if (selectedCompanies.length === 0) {
      Alert.alert('No Recipients', 'Please select at least one company to send emails to.');
      return;
    }

    const companiesWithEmails = selectedCompanies.filter(company => recipientEmails[company.id]?.trim());
    if (companiesWithEmails.length === 0) {
      Alert.alert('Missing Email Addresses', 'Please provide at least one email address for the recipients.');
      return;
    }

    setIsSending(true);

    try {
      const emails = companiesWithEmails.map(company => {
        const subject = customSubject
          .replace('{company}', company.name)
          .replace('{commodity}', company.commodities[0] || 'commodities')
          .replace('{sender}', senderName);

        const body = customBody
          .replace('{recipient}', company.name)
          .replace('{company}', company.name)
          .replace('{commodity}', company.commodities[0] || 'commodities')
          .replace('{sender}', senderName)
          .replace('{quantity}', '[Please specify]')
          .replace('{delivery}', '[Please specify]');

        return {
          to: recipientEmails[company.id],
          from: senderEmail,
          subject,
          body
        };
      });

      await sendBulkEmails(emails);

      Alert.alert(
        'Success',
        `Email sent to ${companiesWithEmails.length} ${companiesWithEmails.length === 1 ? 'company' : 'companies'}.`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      console.error('Error sending emails:', error);
      Alert.alert('Error', 'Failed to send emails. Please try again.');
    } finally {
      setIsSending(false);
    }
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
            <Text style={styles.title}>Email Outreach</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Users size={18} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Recipients ({selectedCompanies.length})</Text>
              </View>
              {selectedCompanies.map(company => (
                <View key={company.id} style={styles.recipientItem}>
                  <View style={styles.recipientInfo}>
                    <Text style={styles.recipientName}>{company.name}</Text>
                    <Text style={styles.recipientLocation}>{company.headquarters}</Text>
                  </View>
                  <View style={styles.emailInputContainer}>
                    <View style={styles.emailIcon}>
                      <Mail size={16} color="#6B7280" />
                    </View>
                    <TextInput
                      style={styles.emailInput}
                      placeholder="Enter email address"
                      placeholderTextColor="#6B7280"
                      value={recipientEmails[company.id] || ''}
                      onChangeText={(text) => setRecipientEmails(prev => ({
                        ...prev,
                        [company.id]: text
                      }))}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <FileText size={18} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Template</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
                {EMAIL_TEMPLATES.map(template => (
                  <TouchableOpacity
                    key={template.id}
                    style={[
                      styles.templateChip,
                      selectedTemplate.id === template.id && styles.templateChipActive
                    ]}
                    onPress={() => handleTemplateSelect(template)}
                  >
                    <Text style={[
                      styles.templateChipText,
                      selectedTemplate.id === template.id && styles.templateChipTextActive
                    ]}>
                      {template.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#6B7280"
                value={senderName}
                onChangeText={setSenderName}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Your Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#6B7280"
                value={senderEmail}
                onChangeText={setSenderEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="Email subject"
                placeholderTextColor="#6B7280"
                value={customSubject}
                onChangeText={setCustomSubject}
              />
              <Text style={styles.hint}>Variables: {'{company}'}, {'{commodity}'}, {'{sender}'}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Email body"
                placeholderTextColor="#6B7280"
                value={customBody}
                onChangeText={setCustomBody}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />
              <Text style={styles.hint}>
                Variables: {'{recipient}'}, {'{company}'}, {'{commodity}'}, {'{sender}'}, {'{quantity}'}, {'{delivery}'}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={isSending}
            >
              {isSending ? (
                <Text style={styles.sendButtonText}>Sending...</Text>
              ) : (
                <>
                  <Send size={20} color="#FFFFFF" />
                  <Text style={styles.sendButtonText}>
                    Send {Object.values(recipientEmails).filter(email => email.trim()).length > 0 
                      ? `to ${Object.values(recipientEmails).filter(email => email.trim()).length} ${Object.values(recipientEmails).filter(email => email.trim()).length === 1 ? 'Company' : 'Companies'}` 
                      : 'Emails'}
                  </Text>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recipientItem: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  recipientInfo: {
    marginBottom: 12,
  },
  recipientName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  recipientLocation: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0E27',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 12,
  },
  emailIcon: {
    marginRight: 8,
  },
  emailInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#FFFFFF',
  },
  templatesScroll: {
    marginBottom: 8,
  },
  templateChip: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  templateChipActive: {
    backgroundColor: '#3B82F6',
  },
  templateChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  templateChipTextActive: {
    color: '#FFFFFF',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#374151',
  },
  textArea: {
    minHeight: 150,
    paddingTop: 12,
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    fontStyle: 'italic',
  },
  sendButton: {
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
  sendButtonDisabled: {
    backgroundColor: '#374151',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomPadding: {
    height: 40,
  },
});
