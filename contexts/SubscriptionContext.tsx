import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionFeatures {
  maxCounterparties: number | null;
  maxActiveTrades: number | null;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  documentScanning: boolean;
  customReports: boolean;
  apiAccess: boolean;
  bulkImport: boolean;
  marketInsights: boolean;
}

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  features: SubscriptionFeatures;
  expiresAt: Date | null;
  isActive: boolean;
}

const FREE_FEATURES: SubscriptionFeatures = {
  maxCounterparties: 5,
  maxActiveTrades: 10,
  advancedAnalytics: false,
  prioritySupport: false,
  documentScanning: false,
  customReports: false,
  apiAccess: false,
  bulkImport: false,
  marketInsights: false,
};

const PREMIUM_FEATURES: SubscriptionFeatures = {
  maxCounterparties: null,
  maxActiveTrades: null,
  advancedAnalytics: true,
  prioritySupport: true,
  documentScanning: true,
  customReports: true,
  apiAccess: true,
  bulkImport: true,
  marketInsights: true,
};

export const [SubscriptionProvider, useSubscription] = createContextHook(() => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    tier: 'free',
    features: FREE_FEATURES,
    expiresAt: null,
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const stored = await AsyncStorage.getItem('subscription_status');
        if (stored) {
          const parsed = JSON.parse(stored);
          const status: SubscriptionStatus = {
            ...parsed,
            expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
          };
          
          if (status.tier === 'premium' && status.expiresAt) {
            if (new Date() > status.expiresAt) {
              await downgradeToFree();
            } else {
              setSubscriptionStatus(status);
            }
          } else {
            setSubscriptionStatus(status);
          }
        }
      } catch (error) {
        console.error('[SubscriptionContext] Error loading subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const upgradeSubscription = async () => {
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const newStatus: SubscriptionStatus = {
      tier: 'premium',
      features: PREMIUM_FEATURES,
      expiresAt,
      isActive: true,
    };

    setSubscriptionStatus(newStatus);
    await AsyncStorage.setItem('subscription_status', JSON.stringify(newStatus));
    console.log('[SubscriptionContext] Upgraded to premium');
  };

  const downgradeToFree = async () => {
    const newStatus: SubscriptionStatus = {
      tier: 'free',
      features: FREE_FEATURES,
      expiresAt: null,
      isActive: true,
    };

    setSubscriptionStatus(newStatus);
    await AsyncStorage.setItem('subscription_status', JSON.stringify(newStatus));
    console.log('[SubscriptionContext] Downgraded to free');
  };

  const checkFeatureAccess = (feature: keyof SubscriptionFeatures): boolean => {
    return subscriptionStatus.features[feature] === true;
  };

  const getFeatureLimit = (feature: keyof SubscriptionFeatures): number | null => {
    const value = subscriptionStatus.features[feature];
    return typeof value === 'number' ? value : null;
  };

  return {
    subscriptionStatus,
    isLoading,
    isPremium: subscriptionStatus.tier === 'premium',
    upgradeSubscription,
    downgradeToFree,
    checkFeatureAccess,
    getFeatureLimit,
  };
});
