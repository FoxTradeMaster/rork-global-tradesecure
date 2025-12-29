import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { Check, X, Crown, Zap, Shield, TrendingUp, FileText, Database } from 'lucide-react-native';
import { useState } from 'react';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => Promise<void>;
  feature?: string;
}

const PREMIUM_FEATURES = [
  { icon: Zap, title: 'Unlimited Trades', description: 'Create and manage unlimited active trades' },
  { icon: Database, title: 'Unlimited Counterparties', description: 'Add as many counterparties as you need' },
  { icon: TrendingUp, title: 'Advanced Analytics', description: 'Deep insights into your trading performance' },
  { icon: FileText, title: 'Custom Reports', description: 'Generate detailed custom reports' },
  { icon: Shield, title: 'Priority Support', description: '24/7 priority customer support' },
  { icon: Database, title: 'API Access', description: 'Integrate with your existing systems' },
];

export default function PaywallModal({ visible, onClose, onUpgrade, feature }: PaywallModalProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await onUpgrade();
      onClose();
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView intensity={80} style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.crownContainer}>
              <Crown size={32} color="#FFD700" fill="#FFD700" />
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.title}>Upgrade to Premium</Text>
            {feature && (
              <Text style={styles.featureNote}>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                "{feature}" requires a Premium subscription
              </Text>
            )}
            <Text style={styles.subtitle}>
              Unlock powerful features for professional commodity trading
            </Text>

            <View style={styles.pricingCard}>
              <View style={styles.pricingBadge}>
                <Text style={styles.pricingBadgeText}>BEST VALUE</Text>
              </View>
              <Text style={styles.priceAmount}>$99</Text>
              <Text style={styles.priceLabel}>per month</Text>
              <Text style={styles.priceSave}>Save $300 with annual plan</Text>
            </View>

            <View style={styles.featuresContainer}>
              {PREMIUM_FEATURES.map((item, index) => {
                const Icon = item.icon;
                return (
                  <View key={index} style={styles.featureItem}>
                    <View style={styles.featureIconContainer}>
                      <Icon size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.featureText}>
                      <Text style={styles.featureTitle}>{item.title}</Text>
                      <Text style={styles.featureDescription}>{item.description}</Text>
                    </View>
                    <Check size={20} color="#10B981" />
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.upgradeButton, isUpgrading && styles.upgradeButtonDisabled]}
              onPress={handleUpgrade}
              disabled={isUpgrading}
              activeOpacity={0.8}
            >
              {isUpgrading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Crown size={20} color="#FFFFFF" fill="#FFFFFF" />
                  <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.terms}>
              By subscribing, you agree to our terms of service. Cancel anytime.
            </Text>
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 20,
    position: 'relative',
  },
  crownContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFD70020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 24,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureNote: {
    fontSize: 14,
    color: '#F59E0B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  pricingCard: {
    backgroundColor: '#0A0E27',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#3B82F6',
    position: 'relative',
  },
  pricingBadge: {
    position: 'absolute',
    top: -12,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pricingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priceLabel: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  priceSave: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0E27',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F620',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  upgradeButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  upgradeButtonDisabled: {
    opacity: 0.6,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  terms: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
