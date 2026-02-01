import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function SubscriptionSuccess() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    // Log subscription details
    console.log('[Subscription Success]', {
      subscriptionId: params.subscription_id,
      token: params.token,
      baToken: params.ba_token,
    });

    // TODO: Call backend API to verify and activate subscription
    // This should update the user's subscription status in Supabase
  }, [params]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>✅</Text>
        <Text style={styles.title}>Subscription Successful!</Text>
        <Text style={styles.message}>
          Thank you for upgrading to Premium. Your subscription has been activated.
        </Text>
        
        {params.subscription_id && (
          <View style={styles.detailsBox}>
            <Text style={styles.detailsLabel}>Subscription ID:</Text>
            <Text style={styles.detailsValue}>{params.subscription_id}</Text>
          </View>
        )}

        <Text style={styles.features}>
          You now have access to:{'\n\n'}
          ✓ Unlimited trades and counterparties{'\n'}
          ✓ All document types{'\n'}
          ✓ Advanced analytics{'\n'}
          ✓ Priority support{'\n'}
          ✓ Only 0.5% commission rate
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    maxWidth: 500,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  detailsBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    marginBottom: 24,
  },
  detailsLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  detailsValue: {
    fontSize: 14,
    color: '#111827',
    fontFamily: 'monospace',
  },
  features: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 24,
    textAlign: 'left',
    width: '100%',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
