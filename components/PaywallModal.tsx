import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Check, X, Crown, Zap, Shield, TrendingUp, FileText, Database } from 'lucide-react-native';
import { useState } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PurchasesPackage } from 'react-native-purchases';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  feature?: string;
}

const PREMIUM_FEATURES = [
  { icon: Zap, title: 'Reduced Platform Fee', description: 'Only 0.5% platform fee vs 2% on free plan' },
  { icon: Database, title: 'Unlimited Trades & Parties', description: 'No limits on trades or counterparties' },
  { icon: TrendingUp, title: 'Advanced Analytics', description: 'Deep insights into your trading performance' },
  { icon: FileText, title: 'Custom Reports', description: 'Generate detailed custom reports' },
  { icon: Shield, title: 'Priority Support', description: '24/7 priority customer support' },
  { icon: Database, title: 'API Access', description: 'Integrate with your existing systems' },
];

export default function PaywallModal({ visible, onClose, feature }: PaywallModalProps) {
  const { offerings, purchasePackage, isPurchasing, isLoading, restorePurchases, isRestoring } = useSubscription();
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);

  const currentOffering = offerings?.current;
  const monthlyPackage = currentOffering?.availablePackages.find((p: PurchasesPackage) => p.identifier === '$rc_monthly');
  const yearlyPackage = currentOffering?.availablePackages.find((p: PurchasesPackage) => p.identifier === '$rc_annual');
  const lifetimePackage = currentOffering?.availablePackages.find((p: PurchasesPackage) => p.identifier === '$rc_lifetime');

  const handlePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert('Select Plan', 'Please select a subscription plan');
      return;
    }

    try {
      await purchasePackage(selectedPackage);
      Alert.alert(
        'Success!',
        'Your premium subscription is now active. Enjoy all features!',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error: any) {
      if (error.message !== 'Purchase cancelled') {
        Alert.alert('Purchase Failed', error.message || 'Please try again');
      }
    }
  };

  const handleRestore = async () => {
    try {
      await restorePurchases();
      Alert.alert(
        'Restore Complete',
        'Your purchases have been restored.',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error: any) {
      Alert.alert('Restore Failed', error.message || 'No purchases to restore');
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
              Lower platform fees + unlimited access to facilitation platform
            </Text>

            <View style={styles.commissionCompareCard}>
              <Text style={styles.platformFeeTitle}>Masters Energy Inc. Platform Fees</Text>
              <View style={styles.commissionRow}>
                <Text style={styles.commissionLabel}>Free Plan:</Text>
                <Text style={styles.commissionFree}>2% platform fee per deal</Text>
              </View>
              <View style={styles.commissionRow}>
                <Text style={styles.commissionLabel}>Premium Plan:</Text>
                <Text style={styles.commissionPremium}>0.5% platform fee + $99/mo</Text>
              </View>
              <Text style={styles.commissionNote}>Lower platform fees on every transaction!</Text>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading offers...</Text>
              </View>
            ) : (
              <View style={styles.packagesContainer}>
                {yearlyPackage && (
                  <TouchableOpacity
                    style={[
                      styles.packageCard,
                      selectedPackage?.identifier === yearlyPackage.identifier && styles.packageCardSelected
                    ]}
                    onPress={() => setSelectedPackage(yearlyPackage)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.bestValueBadge}>
                      <Text style={styles.bestValueText}>BEST VALUE</Text>
                    </View>
                    <Text style={styles.packageTitle}>Yearly</Text>
                    <Text style={styles.packagePrice}>{yearlyPackage.product.priceString}</Text>
                    <Text style={styles.packagePeriod}>per year</Text>
                    {monthlyPackage && yearlyPackage.product.price < monthlyPackage.product.price * 12 && (
                      <Text style={styles.packageSave}>
                        Save {monthlyPackage.product.currencyCode} {(monthlyPackage.product.price * 12 - yearlyPackage.product.price).toFixed(0)}/year
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
                
                {monthlyPackage && (
                  <TouchableOpacity
                    style={[
                      styles.packageCard,
                      selectedPackage?.identifier === monthlyPackage.identifier && styles.packageCardSelected
                    ]}
                    onPress={() => setSelectedPackage(monthlyPackage)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.packageTitle}>Monthly</Text>
                    <Text style={styles.packagePrice}>{monthlyPackage.product.priceString}</Text>
                    <Text style={styles.packagePeriod}>per month</Text>
                  </TouchableOpacity>
                )}

                {lifetimePackage && (
                  <TouchableOpacity
                    style={[
                      styles.packageCard,
                      selectedPackage?.identifier === lifetimePackage.identifier && styles.packageCardSelected
                    ]}
                    onPress={() => setSelectedPackage(lifetimePackage)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.bestValueBadge}>
                      <Text style={styles.bestValueText}>LIFETIME</Text>
                    </View>
                    <Text style={styles.packageTitle}>Lifetime Access</Text>
                    <Text style={styles.packagePrice}>{lifetimePackage.product.priceString}</Text>
                    <Text style={styles.packagePeriod}>one-time payment</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

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
              style={[styles.upgradeButton, (isPurchasing || isLoading || !selectedPackage) && styles.upgradeButtonDisabled]}
              onPress={handlePurchase}
              disabled={isPurchasing || isLoading || !selectedPackage}
              activeOpacity={0.8}
            >
              {isPurchasing ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Crown size={20} color="#FFFFFF" fill="#FFFFFF" />
                  <Text style={styles.upgradeButtonText}>Subscribe Now</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestore}
              disabled={isRestoring}
              activeOpacity={0.8}
            >
              {isRestoring ? (
                <ActivityIndicator color="#3B82F6" size="small" />
              ) : (
                <Text style={styles.restoreButtonText}>Restore Purchases</Text>
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
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
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  packagesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  packageCard: {
    backgroundColor: '#0A0E27',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
    position: 'relative',
  },
  packageCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E3A8A15',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestValueText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  packagePrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  packagePeriod: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  packageSave: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 8,
  },

  commissionCompareCard: {
    backgroundColor: '#0A0E27',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  platformFeeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  commissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commissionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  commissionFree: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  commissionPremium: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  commissionNote: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  restoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
});
