import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.lastUpdated}>Last Updated: December 30, 2025</Text>

            <Text style={styles.paragraph}>
              This Privacy Policy describes how Masters Energy Inc. USA (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, stores, and protects your personal information when you use our trading platform application (&quot;App&quot;). Masters Energy Inc. USA operates as an intermediary and facilitator for commodity trading transactions. We are committed to protecting your privacy and handling your data in an open and transparent manner.
            </Text>

            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            
            <Text style={styles.subsectionTitle}>1.1 Information You Provide</Text>
            <Text style={styles.paragraph}>
              When you use our App, you may provide us with the following information:
            </Text>
            <Text style={styles.bulletPoint}>• Account information (name, email address, role/position)</Text>
            <Text style={styles.bulletPoint}>• Trade data (commodity types, prices, quantities, dates)</Text>
            <Text style={styles.bulletPoint}>• Counterparty information (company names, contact details, relationships)</Text>
            <Text style={styles.bulletPoint}>• Documents and attachments related to trades</Text>
            <Text style={styles.bulletPoint}>• Communication preferences and settings</Text>
            <Text style={styles.bulletPoint}>• Payment information (processed through app stores)</Text>

            <Text style={styles.subsectionTitle}>1.2 Automatically Collected Information</Text>
            <Text style={styles.paragraph}>
              When you use the App, we automatically collect certain information, including:
            </Text>
            <Text style={styles.bulletPoint}>• Device information (device type, operating system, unique device identifiers)</Text>
            <Text style={styles.bulletPoint}>• Usage data (features accessed, time spent, interactions)</Text>
            <Text style={styles.bulletPoint}>• Log data (IP address, access times, app crashes)</Text>
            <Text style={styles.bulletPoint}>• Analytics data to improve app performance and user experience</Text>

            <Text style={styles.subsectionTitle}>1.3 Third-Party Data</Text>
            <Text style={styles.paragraph}>
              We may collect market data, commodity prices, and industry information from third-party data providers to enhance the functionality of our App.
            </Text>

            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.paragraph}>
              We use the collected information for the following purposes:
            </Text>
            <Text style={styles.bulletPoint}>• To provide, maintain, and improve the App&apos;s functionality</Text>
            <Text style={styles.bulletPoint}>• To process and manage your trades and counterparty relationships</Text>
            <Text style={styles.bulletPoint}>• To manage your subscription and process payments</Text>
            <Text style={styles.bulletPoint}>• To send you notifications, updates, and important information</Text>
            <Text style={styles.bulletPoint}>• To provide customer support and respond to your inquiries</Text>
            <Text style={styles.bulletPoint}>• To analyze usage patterns and improve user experience</Text>
            <Text style={styles.bulletPoint}>• To detect, prevent, and address technical issues and security threats</Text>
            <Text style={styles.bulletPoint}>• To comply with legal obligations and enforce our Terms of Service</Text>
            <Text style={styles.bulletPoint}>• To send marketing communications (with your consent)</Text>

            <Text style={styles.sectionTitle}>3. Data Storage and Security</Text>
            
            <Text style={styles.subsectionTitle}>3.1 Data Storage</Text>
            <Text style={styles.paragraph}>
              Your data is stored securely using industry-standard cloud infrastructure (Supabase). We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.
            </Text>

            <Text style={styles.subsectionTitle}>3.2 Security Measures</Text>
            <Text style={styles.paragraph}>
              We employ various security measures, including:
            </Text>
            <Text style={styles.bulletPoint}>• Encryption of data in transit and at rest</Text>
            <Text style={styles.bulletPoint}>• Secure authentication and access controls</Text>
            <Text style={styles.bulletPoint}>• Regular security audits and monitoring</Text>
            <Text style={styles.bulletPoint}>• Limited employee access to personal data</Text>
            <Text style={styles.bulletPoint}>• Secure backup and disaster recovery procedures</Text>

            <Text style={styles.paragraph}>
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
            </Text>

            <Text style={styles.sectionTitle}>4. Data Sharing and Disclosure</Text>
            <Text style={styles.paragraph}>
              We do not sell your personal information to third parties. We may share your information in the following circumstances:
            </Text>

            <Text style={styles.subsectionTitle}>4.1 Service Providers</Text>
            <Text style={styles.paragraph}>
              We may share your information with trusted third-party service providers who assist us in operating the App, including:
            </Text>
            <Text style={styles.bulletPoint}>• Cloud hosting and database services (Supabase)</Text>
            <Text style={styles.bulletPoint}>• Payment processing (Apple, Google Play)</Text>
            <Text style={styles.bulletPoint}>• Email delivery services (SendGrid)</Text>
            <Text style={styles.bulletPoint}>• Analytics and data aggregation services</Text>
            <Text style={styles.bulletPoint}>• Market data providers (Polygon.io)</Text>

            <Text style={styles.paragraph}>
              These service providers are contractually obligated to protect your information and use it only for the purposes we specify.
            </Text>

            <Text style={styles.subsectionTitle}>4.2 Legal Requirements</Text>
            <Text style={styles.paragraph}>
              We may disclose your information if required by law, regulation, legal process, or governmental request, or to:
            </Text>
            <Text style={styles.bulletPoint}>• Comply with legal obligations</Text>
            <Text style={styles.bulletPoint}>• Protect our rights, property, or safety</Text>
            <Text style={styles.bulletPoint}>• Prevent fraud or security threats</Text>
            <Text style={styles.bulletPoint}>• Respond to claims or legal disputes</Text>

            <Text style={styles.subsectionTitle}>4.3 Business Transfers</Text>
            <Text style={styles.paragraph}>
              In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control of your personal information.
            </Text>

            <Text style={styles.sectionTitle}>5. Data Retention</Text>
            <Text style={styles.paragraph}>
              We retain your personal information for as long as necessary to provide the App&apos;s services and fulfill the purposes described in this Privacy Policy. When you delete your account, we will delete or anonymize your personal information within 90 days, unless we are required to retain it for legal or regulatory purposes.
            </Text>
            <Text style={styles.paragraph}>
              Backup copies may persist for a limited period but will be deleted in accordance with our data retention policies.
            </Text>

            <Text style={styles.sectionTitle}>6. Your Rights and Choices</Text>
            <Text style={styles.paragraph}>
              Depending on your jurisdiction, you may have the following rights regarding your personal information:
            </Text>

            <Text style={styles.subsectionTitle}>6.1 Access and Portability</Text>
            <Text style={styles.paragraph}>
              You have the right to request access to your personal information and receive a copy of the data we hold about you in a portable format.
            </Text>

            <Text style={styles.subsectionTitle}>6.2 Correction and Update</Text>
            <Text style={styles.paragraph}>
              You can update or correct your personal information at any time through the App&apos;s settings.
            </Text>

            <Text style={styles.subsectionTitle}>6.3 Deletion</Text>
            <Text style={styles.paragraph}>
              You have the right to request deletion of your personal information. You can delete your account through the App settings or by contacting us.
            </Text>

            <Text style={styles.subsectionTitle}>6.4 Opt-Out of Marketing</Text>
            <Text style={styles.paragraph}>
              You can opt out of receiving marketing communications from us at any time by adjusting your notification preferences in the App or following the unsubscribe instructions in our emails.
            </Text>

            <Text style={styles.subsectionTitle}>6.5 Data Restriction and Objection</Text>
            <Text style={styles.paragraph}>
              You may have the right to restrict or object to certain processing of your personal information, subject to legal requirements.
            </Text>

            <Text style={styles.sectionTitle}>7. International Data Transfers</Text>
            <Text style={styles.paragraph}>
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. When we transfer your data internationally, we ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </Text>

            <Text style={styles.sectionTitle}>8. Children&apos;s Privacy</Text>
            <Text style={styles.paragraph}>
              Our App is not intended for use by children under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information promptly.
            </Text>

            <Text style={styles.sectionTitle}>9. Cookies and Tracking Technologies</Text>
            <Text style={styles.paragraph}>
              We may use cookies, local storage, and similar tracking technologies to enhance your experience, analyze usage patterns, and gather information about user behavior. You can control cookies through your device settings, but disabling them may affect the functionality of the App.
            </Text>

            <Text style={styles.sectionTitle}>10. Third-Party Links and Services</Text>
            <Text style={styles.paragraph}>
              The App may contain links to third-party websites or services. This Privacy Policy does not apply to those third-party services. We encourage you to review the privacy policies of any third-party services you access through the App.
            </Text>

            <Text style={styles.sectionTitle}>11. California Privacy Rights (CCPA)</Text>
            <Text style={styles.paragraph}>
              If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA), including:
            </Text>
            <Text style={styles.bulletPoint}>• The right to know what personal information we collect and how it is used</Text>
            <Text style={styles.bulletPoint}>• The right to request deletion of your personal information</Text>
            <Text style={styles.bulletPoint}>• The right to opt-out of the sale of personal information (we do not sell your information)</Text>
            <Text style={styles.bulletPoint}>• The right to non-discrimination for exercising your rights</Text>

            <Text style={styles.sectionTitle}>12. European Privacy Rights (GDPR)</Text>
            <Text style={styles.paragraph}>
              If you are located in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR), including:
            </Text>
            <Text style={styles.bulletPoint}>• The right to access your personal data</Text>
            <Text style={styles.bulletPoint}>• The right to rectification of inaccurate data</Text>
            <Text style={styles.bulletPoint}>• The right to erasure (&quot;right to be forgotten&quot;)</Text>
            <Text style={styles.bulletPoint}>• The right to restrict processing</Text>
            <Text style={styles.bulletPoint}>• The right to data portability</Text>
            <Text style={styles.bulletPoint}>• The right to object to processing</Text>
            <Text style={styles.bulletPoint}>• The right to withdraw consent</Text>
            <Text style={styles.bulletPoint}>• The right to lodge a complaint with a supervisory authority</Text>

            <Text style={styles.sectionTitle}>13. Changes to This Privacy Policy</Text>
            <Text style={styles.paragraph}>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy in the App and updating the &quot;Last Updated&quot; date.
            </Text>
            <Text style={styles.paragraph}>
              We encourage you to review this Privacy Policy periodically. Your continued use of the App after changes are posted constitutes your acceptance of the updated Privacy Policy.
            </Text>

            <Text style={styles.sectionTitle}>14. Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact Masters Energy Inc. USA through the App&apos;s support channels or at the contact information provided in the App.
            </Text>
            <Text style={styles.paragraph}>
              For data protection inquiries, you can contact our Data Protection Officer (if applicable) at the designated email address provided in the App.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Company:</Text> Masters Energy Inc. USA{`
`}
              <Text style={styles.bold}>Role:</Text> Intermediary/Facilitator for commodity trading transactions
            </Text>

            <Text style={styles.sectionTitle}>15. Your Consent</Text>
            <Text style={styles.paragraph}>
              By using our App, you consent to the collection, use, and storage of your information as described in this Privacy Policy.
            </Text>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                We are committed to protecting your privacy and ensuring the security of your personal information. Thank you for trusting us with your data.
              </Text>
            </View>
          </View>
        </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 24,
    fontStyle: 'italic' as const,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 24,
    marginBottom: 8,
    paddingLeft: 16,
  },
  footer: {
    marginTop: 32,
    marginBottom: 40,
    padding: 16,
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  footerText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 22,
    fontStyle: 'italic' as const,
  },
  bold: {
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
});
