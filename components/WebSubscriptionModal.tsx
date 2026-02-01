import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { SUBSCRIPTION_PLANS, createPayPalSubscription, openPayPalCheckout } from '@/lib/paypal';

interface WebSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe?: (planId: string) => void;
}

export function WebSubscriptionModal({ visible, onClose, onSubscribe }: WebSubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setIsLoading(true);
    setSelectedPlan(planId);
    
    try {
      // Call server-side API to create PayPal subscription
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          returnUrl: typeof window !== 'undefined' ? `${window.location.origin}/subscription/success` : undefined,
          cancelUrl: typeof window !== 'undefined' ? `${window.location.origin}/subscription/cancel` : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create subscription');
      }

      const subscription = await response.json();
      
      // Find the approval URL
      const approvalUrl = subscription.links?.find(
        (link: any) => link.rel === 'approve'
      )?.href;
      
      if (approvalUrl) {
        // Redirect user to PayPal to complete subscription
        openPayPalCheckout(approvalUrl);
      } else {
        throw new Error('No approval URL returned from PayPal');
      }
      
      // Call optional callback
      if (onSubscribe) {
        await onSubscribe(planId);
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      alert(`Failed to start subscription: ${error.message}`);
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Upgrade to Premium</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.subtitle}>
              Unlock unlimited trades, advanced analytics, and priority support
            </Text>

            {SUBSCRIPTION_PLANS.map((plan) => (
              <View key={plan.id} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                </View>
                
                <Text style={styles.planDescription}>{plan.description}</Text>
                
                <View style={styles.featuresList}>
                  {plan.features.map((feature, index) => (
                    <Text key={index} style={styles.feature}>✓ {feature}</Text>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.subscribeButton,
                    isLoading && selectedPlan === plan.id && styles.subscribeButtonDisabled
                  ]}
                  onPress={() => handleSubscribe(plan.id)}
                  disabled={isLoading}
                >
                  {isLoading && selectedPlan === plan.id ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.subscribeButtonText}>Subscribe with PayPal</Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}

            <Text style={styles.disclaimer}>
              Subscriptions are processed securely through PayPal. Cancel anytime from your account settings.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 600,
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    color: '#6b7280',
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  planCard: {
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  planDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  featuresList: {
    marginBottom: 16,
  },
  feature: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  subscribeButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
  },
});
