import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Mail, BookOpen, Clock, CheckCircle, ExternalLink, Phone } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@foxtrademaster.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+18045069939');
  };

  const handleUserManualPress = () => {
    router.push('/user-manual');
  };

  const handleSupportWebsitePress = () => {
    Linking.openURL('https://support.foxtrademasters.com');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Support',
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
        }}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Masters Energy Inc. USA Support</Text>
          <Text style={styles.subtitle}>
            We&apos;re here to help you succeed with your commodity trading operations through our facilitation platform
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSupportWebsitePress}
          activeOpacity={0.8}
        >
          <ExternalLink size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Visit Support Website</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Get Help</Text>
          
          <TouchableOpacity
            style={styles.supportItem}
            onPress={handleEmailPress}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Mail size={24} color="#4a90e2" />
            </View>
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>Email Support</Text>
              <Text style={styles.supportEmail}>support@foxtrademaster.com</Text>
              <Text style={styles.supportDescription}>
                Send us your questions, issues, or feedback. We typically respond within 24 hours.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.supportItem}
            onPress={handlePhonePress}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Phone size={24} color="#8b5cf6" />
            </View>
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>Phone Support</Text>
              <Text style={styles.supportEmail}>+1-804-506-9939</Text>
              <Text style={styles.supportDescription}>
                Call us for immediate assistance with your trading operations.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.supportItem}
            onPress={handleUserManualPress}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <BookOpen size={24} color="#10b981" />
            </View>
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>User Manual</Text>
              <Text style={styles.supportDescription}>
                Comprehensive documentation covering all features, workflows, and best practices for Fox Trade Master™.
              </Text>
              <Text style={styles.linkText}>View User Manual →</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.supportItemLast}>
            <View style={styles.iconContainer}>
              <Clock size={24} color="#f59e0b" />
            </View>
            <View style={styles.supportContent}>
              <Text style={styles.supportTitle}>Support Hours</Text>
              <Text style={styles.supportDescription}>
                24/7 for critical issues
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What We Can Help With</Text>
          
          {helpTopics.map((topic, index) => (
            <View key={index} style={styles.helpItem}>
              <CheckCircle size={20} color="#10b981" style={styles.checkIcon} />
              <Text style={styles.helpText}>{topic}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Before Contacting Support</Text>
          <Text style={styles.bodyText}>
            To help us assist you quickly, please:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletText}>• Check the User Manual for common questions</Text>
            <Text style={styles.bulletText}>• Have your account information ready</Text>
            <Text style={styles.bulletText}>• Describe the issue in detail with screenshots if applicable</Text>
            <Text style={styles.bulletText}>• Include any error messages you received</Text>
            <Text style={styles.bulletText}>• Note what device and version you&apos;re using</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Manual Highlights</Text>
          <Text style={styles.bodyText}>
            Our comprehensive user manual includes:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletText}>• Getting Started Guide</Text>
            <Text style={styles.bulletText}>• Role Selection and Permissions</Text>
            <Text style={styles.bulletText}>• Managing Trades and Counterparties</Text>
            <Text style={styles.bulletText}>• Document Management</Text>
            <Text style={styles.bulletText}>• Market Directory Features</Text>
            <Text style={styles.bulletText}>• Risk Assessment Guidelines</Text>
            <Text style={styles.bulletText}>• Trade Workflow Details</Text>
            <Text style={styles.bulletText}>• Troubleshooting Common Issues</Text>
            <Text style={styles.bulletText}>• Incoterms Reference</Text>
            <Text style={styles.bulletText}>• Commodity Specifications</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Masters Energy Inc. USA - Commodity Trading Intermediary & Facilitator
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const helpTopics = [
  'Account setup and role selection',
  'Creating and managing trades',
  'Counterparty onboarding and risk assessment',
  'Document upload and verification',
  'Market directory navigation and search',
  'Email outreach and saved searches',
  'Understanding risk scores and compliance',
  'Trade workflow and approvals',
  'Troubleshooting technical issues',
  'Mobile app and web platform usage',
  'Data security and privacy questions',
  'Feature requests and feedback',
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a4e',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  supportItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  supportItemLast: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  supportEmail: {
    fontSize: 16,
    color: '#4a90e2',
    marginBottom: 8,
    fontWeight: '500',
  },
  supportDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  linkText: {
    fontSize: 14,
    color: '#4a90e2',
    marginTop: 8,
    fontWeight: '600',
  },
  bodyText: {
    fontSize: 15,
    color: '#d1d5db',
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletList: {
    marginLeft: 8,
  },
  bulletText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 24,
    marginBottom: 4,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  helpText: {
    flex: 1,
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#2a2a4e',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#4b5563',
  },
  primaryButton: {
    backgroundColor: '#4a90e2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
