import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms of Service</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.lastUpdated}>Last Updated: December 30, 2025</Text>

            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.paragraph}>
              By accessing and using this trading platform application (&quot;App&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the App.
            </Text>

            <Text style={styles.sectionTitle}>2. Description of Service</Text>
            <Text style={styles.paragraph}>
              Our App provides a platform for managing commodity trades, counterparty relationships, trade documentation, and market intelligence. The service includes both free and premium subscription tiers with varying features and limitations.
            </Text>

            <Text style={styles.sectionTitle}>3. User Accounts and Registration</Text>
            <Text style={styles.paragraph}>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.
            </Text>
            <Text style={styles.paragraph}>
              You must provide accurate, current, and complete information during registration and keep your account information updated.
            </Text>

            <Text style={styles.sectionTitle}>4. Subscription and Payment Terms</Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Free Plan:</Text> The free plan provides limited access to features, including a maximum of 3 counterparties and 5 active trades.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Premium Subscription:</Text> Premium plans are available on a monthly, annual, or lifetime basis. By subscribing to a premium plan, you agree to pay the specified fees.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Billing:</Text> Subscription fees are billed in advance on a recurring basis (monthly or annually) through your chosen app store (Apple App Store or Google Play Store). All payments are processed securely through these platforms.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Cancellation:</Text> You may cancel your subscription at any time through your app store account settings. Cancellation will take effect at the end of the current billing period.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>Refunds:</Text> Refund requests are subject to the app store&apos;s refund policies. We do not directly process refunds.
            </Text>

            <Text style={styles.sectionTitle}>5. User Content and Data</Text>
            <Text style={styles.paragraph}>
              You retain all rights to the data you input into the App, including trade information, counterparty details, and documents. By using the App, you grant us a license to store, process, and display your content solely for the purpose of providing the service.
            </Text>
            <Text style={styles.paragraph}>
              You are solely responsible for the accuracy, quality, and legality of your content. You represent and warrant that you own or have the necessary rights to all content you submit.
            </Text>

            <Text style={styles.sectionTitle}>6. Prohibited Uses</Text>
            <Text style={styles.paragraph}>
              You agree not to use the App to:
            </Text>
            <Text style={styles.bulletPoint}>• Violate any applicable laws or regulations</Text>
            <Text style={styles.bulletPoint}>• Infringe upon the rights of others</Text>
            <Text style={styles.bulletPoint}>• Transmit any harmful or malicious code</Text>
            <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to the App or related systems</Text>
            <Text style={styles.bulletPoint}>• Use the App for any fraudulent or illegal activity</Text>
            <Text style={styles.bulletPoint}>• Reverse engineer or attempt to extract the source code of the App</Text>
            <Text style={styles.bulletPoint}>• Scrape, harvest, or collect data from the App using automated means</Text>

            <Text style={styles.sectionTitle}>7. Market Data and Information</Text>
            <Text style={styles.paragraph}>
              Market data, analytics, and information provided through the App are for informational purposes only and should not be considered as financial, investment, or trading advice. We do not guarantee the accuracy, completeness, or timeliness of any market data.
            </Text>
            <Text style={styles.paragraph}>
              You acknowledge that commodity trading involves substantial risk and agree that you are solely responsible for your trading decisions.
            </Text>

            <Text style={styles.sectionTitle}>8. Third-Party Services</Text>
            <Text style={styles.paragraph}>
              The App may integrate with third-party services (including but not limited to payment processors, email services, and data providers). Your use of these services is subject to their respective terms and conditions. We are not responsible for the availability, accuracy, or content of third-party services.
            </Text>

            <Text style={styles.sectionTitle}>9. Intellectual Property Rights</Text>
            <Text style={styles.paragraph}>
              The App and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </Text>
            <Text style={styles.paragraph}>
              You may not copy, modify, distribute, sell, or lease any part of the App without our prior written consent.
            </Text>

            <Text style={styles.sectionTitle}>10. Disclaimer of Warranties</Text>
            <Text style={styles.paragraph}>
              THE APP IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </Text>
            <Text style={styles.paragraph}>
              We do not warrant that the App will be uninterrupted, timely, secure, or error-free, or that defects will be corrected.
            </Text>

            <Text style={styles.sectionTitle}>11. Limitation of Liability</Text>
            <Text style={styles.paragraph}>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
            </Text>
            <Text style={styles.bulletPoint}>• Your use or inability to use the App</Text>
            <Text style={styles.bulletPoint}>• Any unauthorized access to or use of your data</Text>
            <Text style={styles.bulletPoint}>• Any interruption or cessation of the App</Text>
            <Text style={styles.bulletPoint}>• Any trading losses or business losses</Text>
            <Text style={styles.bulletPoint}>• Any errors or omissions in any content or data</Text>

            <Text style={styles.sectionTitle}>12. Indemnification</Text>
            <Text style={styles.paragraph}>
              You agree to indemnify, defend, and hold harmless our company, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of the App, your violation of these Terms, or your violation of any rights of another party.
            </Text>

            <Text style={styles.sectionTitle}>13. Termination</Text>
            <Text style={styles.paragraph}>
              We may terminate or suspend your account and access to the App immediately, without prior notice or liability, for any reason, including breach of these Terms.
            </Text>
            <Text style={styles.paragraph}>
              Upon termination, your right to use the App will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
            </Text>

            <Text style={styles.sectionTitle}>14. Changes to Terms</Text>
            <Text style={styles.paragraph}>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </Text>
            <Text style={styles.paragraph}>
              By continuing to access or use the App after revisions become effective, you agree to be bound by the revised terms.
            </Text>

            <Text style={styles.sectionTitle}>15. Governing Law</Text>
            <Text style={styles.paragraph}>
              These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which our company is registered, without regard to its conflict of law provisions.
            </Text>

            <Text style={styles.sectionTitle}>16. Dispute Resolution</Text>
            <Text style={styles.paragraph}>
              Any dispute arising from or relating to these Terms or the App shall first be resolved through good faith negotiations. If negotiations fail, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association or equivalent body in the applicable jurisdiction.
            </Text>

            <Text style={styles.sectionTitle}>17. Severability</Text>
            <Text style={styles.paragraph}>
              If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will continue in full force and effect. The invalid or unenforceable provision will be deemed modified to the extent necessary to make it valid and enforceable.
            </Text>

            <Text style={styles.sectionTitle}>18. Entire Agreement</Text>
            <Text style={styles.paragraph}>
              These Terms constitute the entire agreement between you and us regarding the use of the App and supersede all prior agreements and understandings, whether written or oral.
            </Text>

            <Text style={styles.sectionTitle}>19. Contact Information</Text>
            <Text style={styles.paragraph}>
              If you have any questions about these Terms of Service, please contact us through the App&apos;s support channels.
            </Text>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By using this App, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
  paragraph: {
    fontSize: 15,
    color: '#D1D5DB',
    lineHeight: 24,
    marginBottom: 12,
  },
  bold: {
    fontWeight: '700',
    color: '#FFFFFF',
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
    borderLeftColor: '#3B82F6',
  },
  footerText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 22,
    fontStyle: 'italic' as const,
  },
});
